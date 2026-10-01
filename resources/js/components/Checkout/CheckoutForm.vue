<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import PhoneField from "@/components/Form/PhoneField.vue"
import { useCartStore } from "@/Store/cartStore"
import { useHomeStore } from "@/Store/homeStore"
import { useAuthStore } from "@/Store/authStore"
import { toast } from "@steveyuowo/vue-hot-toast"
import { router, usePage } from "@inertiajs/vue3"
import { useStoreInfo } from "@/Store/storeInfo"

const storeInfo = useStoreInfo()

onMounted(() => {
  storeInfo.fetchStoreData()
})

const siteInfo = computed(() => storeInfo.storeInfo)
const appliedCoupon = ref(null)

watch(
  () => siteInfo.value,
  (newValue) => {
    if (newValue) {
      updateDeliveryCharge()
    }
  },
)

const cartStore = useCartStore()
const authStore = useAuthStore()

const cartItems = computed(() => cartStore.cartItems)
const directOrderProduct = ref(null)

onMounted(() => {
  if (typeof window !== "undefined") {
    const storedProductData = localStorage.getItem("directOrderProductData")
    if (storedProductData) {
      directOrderProduct.value = JSON.parse(storedProductData)
    }
  }
})

const isPreOrder = computed(() => {
  if (cartStore.is_direct_order) {
    return directOrderProduct.value?.is_pre_order === true
  }
  return cartStore.hasPreOrderItems
})

const subtotal = computed(() => {
  if (cartStore.is_direct_order) {
    return directOrderProductSubtotal.value
  } else {
    return cartItems.value.reduce((total, item) => {
      return total + parseFloat(item.individual_price) * item.quantity
    }, 0)
  }
})

const directOrderProductSubtotal = computed(() => {
  if (!directOrderProduct.value) return 0
  let basePrice = parseFloat(directOrderProduct.value.price || 0)
  const additionalPrices = directOrderProduct.value.selectedAttributes.reduce(
    (total, attr) => total + parseFloat(attr.attribute_option_price || 0),
    0,
  )
  return (basePrice + additionalPrices) * directOrderProduct.value.quantity
})

const total = computed(
  () =>
    subtotal.value + form.value.delivery_charge - (form.value.discount || 0),
)

// Set by PageController::checkout(); false keeps checkout cash-only.
const onlinePaymentAvailable = computed(() => Boolean(usePage().props.onlinePaymentAvailable))
// Set by PageController::checkout() from the bKash switch in Integrations.
const bkashPaymentAvailable = computed(() => Boolean(usePage().props.bkashPaymentAvailable))

// A gateway that sends the customer back (cancelled, failed, unconfirmed)
// redirects here with the reason under errors.payment.
// Served from public/, so bound as a string rather than bundled by Vite.
const bkashLogo = "/assets/images/payment/bkash-pay.png"

const paymentError = computed(() => usePage().props.errors?.payment || "")

// Only a method that is still switched on is sent; anything else is cash.
const chosenPaymentType = () => {
  if (form.value.payment_type === "online" && onlinePaymentAvailable.value) return "online"
  if (form.value.payment_type === "bkash" && bkashPaymentAvailable.value) return "bkash"
  return "cod"
}

const isPlacingOrder = ref(false)

const fieldErrors = ref({
  name: "", mobile: "", address: "", delivery_area: "",
})

// Reported by PhoneField: the number matches the selected country's numbering
// plan, not just a digit count.
const phoneValid = ref(false)

const form = ref({
  email: "",
  name: "",
  mobile: "",
  address: "",
  note: "",
  order_status: "pending",
  order_type: "checkout",
  delivery: "cod",
  delivery_area: "",
  payment_type: "cod",
  delivery_charge: 0,
  discount: 0,
  create_account: true,
  password: "",
})

// Whether the visitor is already authenticated — the create-account option is
// only offered to guests.
const isLoggedIn = computed(() => !!authStore.user)

/**
 * Whether the shop is giving this order free delivery.
 *
 * Mirrors SiteInfo::shipsFree(), which is what the server actually charges —
 * the quote and the charge have to be the same decision.
 */
const siteShipsFree = computed(() => {
  const info = siteInfo.value
  if (!info || !info.free_shipping_enabled) return false

  if (info.free_shipping_mode === "minimum") {
    const minimum = Number(info.free_shipping_min_amount) || 0
    return minimum > 0 && subtotal.value >= minimum
  }

  return true
})

// Per-product free shipping was removed: only the shop-wide rule above decides,
// as CheckoutWebController::shipsFree() does on the server.

/**
 * Whether the delivery fee has actually been waived.
 *
 * Not the same as the charge being zero: before an area is picked it is zero
 * too, and calling that free would promise something the order cannot keep.
 */
const deliveryIsFree = computed(
  () => Boolean(form.value.delivery_area) && siteShipsFree.value
)

const updateDeliveryCharge = () => {
  if (siteShipsFree.value) {
    form.value.delivery_charge = 0
  } else {
    if (form.value.delivery_area === "inside") {
      form.value.delivery_charge = parseFloat(
        siteInfo.value?.shipping_charge_inside_dhaka || 0,
      )
    } else if (form.value.delivery_area === "outside") {
      form.value.delivery_charge = parseFloat(
        siteInfo.value?.shipping_charge_outside_dhaka || 0,
      )
    } else {
      form.value.delivery_charge = 0
    }
  }

  if (form.value.delivery_area && typeof window !== "undefined") {
    const shippingTier =
      form.value.delivery_area === "inside" ? "Inside Dhaka" : "Outside Dhaka"
    const items = buildCheckoutItems()
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "add_shipping_info",
      ecommerce: {
        currency: "BDT",
        value: subtotal.value,
        shipping_tier: shippingTier,
        items: items,
      },
    })
  }
}

// The threshold is measured on the basket, so the quote has to follow it as the
// basket changes — otherwise a customer who reaches the minimum is still shown
// (and, before the server agreed with the browser, charged) the fee.
watch(siteShipsFree, () => updateDeliveryCharge())

/*
 * Prefill for a signed-in customer.
 *
 * Comes from PageController::checkoutPrefill() — the account's details plus
 * whichever saved address is marked primary on the profile page. Only blank
 * fields are filled, so anything already typed is never overwritten, and a
 * guest sees the form exactly as before.
 */
const prefill = computed(() => usePage().props.checkoutPrefill || null)

function applyPrefill(data) {
  if (!data) return

  if (!form.value.name) form.value.name = data.name || ""
  if (!form.value.email) form.value.email = data.email || ""
  if (!form.value.mobile && data.phone) form.value.mobile = data.phone
  if (!form.value.address) form.value.address = data.address || ""

  if (!form.value.delivery_area && data.delivery_area) {
    form.value.delivery_area = data.delivery_area
    // The area decides the shipping fee, so the total has to follow it.
    updateDeliveryCharge()
  }
}

watch(prefill, applyPrefill, { immediate: true })

// The account can resolve after the first render; fall back to its name then.
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && !form.value.name) {
      form.value.name = newUser.name
    }
  },
  { immediate: true },
)

const showCoupon = ref(false)
const couponCode = ref("")

const toggleCoupon = () => {
  showCoupon.value = !showCoupon.value
}

const productIds = computed(() => {
  if (cartStore.is_direct_order) return [directOrderProduct.value.product_id]
  return cartItems.value.map((item) => item.product.id)
})

/** Savings already applied to the line prices, across the whole cart. */
const productSaving = computed(() => {
  if (cartStore.is_direct_order) return 0
  return Math.round(cartItems.value.reduce((total, item) => total + (Number(item.saving) || 0), 0))
})

const applyingCoupon = ref(false)

const removeCoupon = () => {
  appliedCoupon.value = null
  couponCode.value = ""
  form.value.discount = 0
}

const applyCoupon = async () => {
  const code = couponCode.value.trim()

  if (!code) {
    toast.error("Enter a coupon code.")
    return
  }

  applyingCoupon.value = true

  try {
    const res = await fetch("/checkout/check-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || "") },
      credentials: "same-origin",
      body: JSON.stringify({ coupon_code: code, product_ids: productIds.value }),
    })
    const data = await res.json()

    if (data.success) {
      const coupon = data.success
      appliedCoupon.value = coupon

      const amount = Number(coupon.discount_amount) || 0
      const discount = coupon.discount_type === "percentage"
        ? (subtotal.value * amount) / 100
        : amount

      // Never discount below zero — a fixed coupon can exceed a small basket.
      form.value.discount = Math.min(discount, subtotal.value)

      toast.success("Coupon applied.")
    } else {
      // The server says why: expired, used up, or not valid for these items.
      // Collapsing all of it into "invalid code" sent people hunting for a
      // typo that was not there.
      toast.error(data.error || "That coupon could not be applied.")
    }
  } catch (error) {
    console.error("Error applying coupon:", error)
    toast.error("Could not check that coupon. Please try again.")
  } finally {
    applyingCoupon.value = false
  }
}

const updateQuantity = (item, change) => {
  let newQuantity = item.quantity + change
  if (newQuantity < 1) return

  const attributeValues = item.attributes?.length
    ? item.attributes.map((attr) => attr.attribute_option_id)
    : []

  if (newQuantity > 0) {
    cartStore.updateCartItemQuantity(
      item.id || item.product_id,
      item.id ? change : newQuantity,
      attributeValues,
      !!item.id,
    )
  }

  if (!item.id) {
    directOrderProduct.value = JSON.parse(
      localStorage.getItem("directOrderProductData"),
    )
  }
}

const removeCartItem = (item) => {
  if (cartStore.is_direct_order) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("directOrderProductData")
    }
    directOrderProduct.value = null
    cartStore.is_direct_order = false
  } else {
    cartStore.removeItem(item.id)
  }
}

const validateFormBasic = () => {
  fieldErrors.value = { name: "", mobile: "", address: "", delivery_area: "", email: "", password: "" }
  let valid = true
  if (!form.value.name) {
    fieldErrors.value.name = "নাম দিন"
    valid = false
  }
  if (!form.value.mobile || !phoneValid.value) {
    fieldErrors.value.mobile = "সঠিক মোবাইল নম্বর দিন"
    valid = false
  }
  if (!form.value.address) {
    fieldErrors.value.address = "ঠিকানা দিন"
    valid = false
  }
  // When the guest opts to create an account, email + password become required.
  if (!isLoggedIn.value && form.value.create_account) {
    if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
      fieldErrors.value.email = "একটি সঠিক ইমেইল দিন"
      valid = false
    }
    if (!form.value.password || form.value.password.length < 8) {
      fieldErrors.value.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"
      valid = false
    }
  }
  return valid
}

const validateForm = () => {
  const basicOk = validateFormBasic()
  if (!form.value.delivery_area) {
    fieldErrors.value.delivery_area = "ডেলিভারি এলাকা সিলেক্ট করুন"
    return false
  }
  return basicOk
}

watch(
  () => [form.value.mobile, phoneValid.value],
  ([, valid]) => {
    if (valid) {
      createIncompleteOrder()
    }
  },
)

const createIncompleteOrder = async () => {
  if (!validateFormBasic()) return

  let items = []

  if (cartStore.is_direct_order && typeof window !== "undefined") {
    const directOrderData = JSON.parse(
      localStorage.getItem("directOrderProductData"),
    )
    if (directOrderData) {
      const individualPrice = parseFloat(directOrderData.price) || 0
      const quantity = directOrderData.quantity || 1
      items = [
        {
          product_id: directOrderData.product_id,
          quantity,
          individual_price: individualPrice,
          total: individualPrice * quantity || 0,
          attributes: directOrderData.selectedAttributes || [],
          attributeOptionId: null,
          campaign_discount: 0,
          coupon_discount: 0,
          original_price: individualPrice,
          blouse_choice: directOrderData.has_blouse_option ? directOrderData.blouse_choice : null,
        },
      ]
    }
  } else {
    if (!cartStore.cartItems || cartStore.cartItems.length === 0) return

    items = cartStore.cartItems.map((item) => {
      const individualPrice = parseFloat(item.individual_price)
      const quantity = item.quantity || 1
      return {
        product_id: item.product_id || item.id,
        quantity,
        individual_price: individualPrice,
        total: individualPrice * quantity || 0,
        attributes: item.attributes || [],
        attributeOptionId: item.attributeOptionId || "",
        campaign_discount: item.campaign_discount || 0,
        coupon_discount: item.coupon_discount || 0,
        original_price: parseFloat(item.original_price || item.price || 0),
        blouse_choice: item.blouse_choice || null,
      }
    })
  }

  let user_id = cartStore.user_id
  if (typeof window !== "undefined") {
    user_id = user_id || localStorage.getItem("guest_id")
  }

  const orderData = {
    items,
    user_id,
    user_name: form.value.name,
    address: form.value.address,
    phone_number: form.value.mobile,
    note: form.value.note || "",
    order_status: "incomplete",
    order_type: "checkout",
    delivery: form.value.delivery,
    delivery_charge: form.value.delivery_charge,
    shipping_price: 0,
    subtotal: cartStore.subtotal || 0,
    total_campaign_discount: 0,
    total_coupon_discount: form.value.discount || 0,
    final_total: parseFloat(cartStore.total) || 0,
    is_direct_order: cartStore.is_direct_order || false,
    incomplete_order_id: 0,
  }

  // Incomplete order tracking removed — handled server-side
}

const placeOrder = () => {
  if (!validateForm()) return

  // GA4 tracking
  if (typeof window !== "undefined") {
    const items = buildCheckoutItems()
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "add_payment_info",
      ecommerce: {
        currency: "BDT",
        value: total.value,
        payment_type: form.value.delivery === "cod" ? "Cash on Delivery" : form.value.delivery,
        items,
      },
    })
  }

  isPlacingOrder.value = true

  const payload = {
    user_name:       form.value.name,
    phone_number:    form.value.mobile,
    email:           form.value.email || null,
    address:         form.value.address,
    delivery_area:   form.value.delivery_area || "inside",
    delivery:        form.value.delivery      || "cod",
    payment_type:    chosenPaymentType(),
    delivery_charge: form.value.delivery_charge,
    note:            form.value.note          || "",
    coupon_code:     appliedCoupon.value?.code || null,
    guest_id:        cartStore.getGuestId(),
    create_account:  !isLoggedIn.value && form.value.create_account,
    password:        form.value.create_account ? form.value.password : null,
  }

  // "Buy now" keeps its item in the browser, not the cart. It was never sent,
  // so the server found an empty cart and every Buy now order failed. Only the
  // identity of the line travels; the server prices it.
  if (cartStore.is_direct_order && directOrderProduct.value) {
    payload.direct_item = {
      product_id:       directOrderProduct.value.product_id,
      quantity:         directOrderProduct.value.quantity || 1,
      blouse_choice:    directOrderProduct.value.blouse_choice || null,
      attribute_values: directOrderProduct.value.attribute_values || [],
    }
  }

  router.post("/checkout/submit", payload, {
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("directOrderProductData")
        localStorage.removeItem("incomplete_order_id")
      }
      cartStore.is_direct_order = false
    },
    onError: (errors) => {
      console.error("[Checkout] errors:", errors)
      isPlacingOrder.value = false
      const msg = errors.cart || errors.user_name || errors.phone_number || errors.address || errors.delivery_area || Object.values(errors)[0]
      toast.error(msg || "Failed to place order. Please try again.")
    },
    onFinish: () => { isPlacingOrder.value = false },
  })
}

const buildCheckoutItems = () => {
  if (cartStore.is_direct_order && directOrderProduct.value) {
    return [
      {
        item_name: directOrderProduct.value.product_name || "",
        item_id: directOrderProduct.value.product_id,
        price: directOrderProduct.value.price || 0,
        quantity: directOrderProduct.value.quantity,
        item_variant:
          directOrderProduct.value.selectedAttributes
            ?.map((attr) => attr.attribute_option)
            .join(", ") || "",
      },
    ]
  }
  return cartItems.value.map((item) => ({
    item_name: item.product.product_name || "",
    item_id: item.product.id,
    price: item.individual_price || 0,
    quantity: item.quantity,
    item_variant: item.attributes
      ? item.attributes.map((attr) => attr.attribute_option).join(", ")
      : "",
  }))
}

const pushBeginCheckoutEvent = () => {
  const items = buildCheckoutItems()

  const totalValue = items.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: totalValue,
        items: items,
      },
    })
  }
}

onMounted(() => {
  if (!window.checkoutEventFired) {
    pushBeginCheckoutEvent()
    window.checkoutEventFired = true
  }
})

onUnmounted(() => {
  window.checkoutEventFired = false
})
</script>

<template>
  <div class="py-8 md:py-12">
    <div class="container max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- ========== LEFT COLUMN: FORM ========== -->
        <div class="lg:col-span-8">
          <!-- Shipping Address Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">ডেলিভারি ঠিকানা</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="checkout-label">ইমেইল</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@email.com"
                  class="checkout-input"
                />
                <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
                <p v-else class="checkout-hint">
                  আপনার ক্যাশ মেমো পেতে অনুগ্রহ করে ইমেইল দিন।
                </p>
              </div>
              <div>
                <label class="checkout-label"
                  >ফোন নম্বর <span class="text-red-500">*</span></label
                >
                <PhoneField
                  v-model="form.mobile"
                  v-model:valid="phoneValid"
                  :invalid="!!fieldErrors.mobile"
                />
                <p v-if="fieldErrors.mobile" class="text-red-500 text-xs mt-1">{{ fieldErrors.mobile }}</p>
              </div>
            </div>

            <!-- Optional: create an account (guests only) -->
            <div v-if="!isLoggedIn" class="mt-5">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" v-model="form.create_account" class="h-4 w-4" />
                <span class="checkout-label mb-0">অ্যাকাউন্ট তৈরি করুন</span>
              </label>
              <p class="checkout-hint">আপনার ইমেইলই হবে ইউজারনেম। পরবর্তীতে দ্রুত চেকআউটের জন্য একটি পাসওয়ার্ড দিন। টিক না দিলে অতিথি হিসেবে অর্ডার সম্পন্ন হবে, কোনো অ্যাকাউন্ট তৈরি হবে না।</p>

              <div v-if="form.create_account" class="mt-3">
                <label class="checkout-label">পাসওয়ার্ড <span class="text-red-500">*</span></label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  :class="['checkout-input', fieldErrors.password ? 'border-red-500' : '']"
                />
                <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>
              </div>
            </div>

            <div class="mt-5">
              <label class="checkout-label"
                >আপনার নাম <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="আপনার সম্পূর্ণ নাম"
                :class="['checkout-input', fieldErrors.name ? 'border-red-500' : '']"
              />
              <p v-if="fieldErrors.name" class="text-red-500 text-xs mt-1">{{ fieldErrors.name }}</p>
            </div>

            <div class="mt-5">
              <label class="checkout-label"
                >সম্পূর্ণ ঠিকানা <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.address"
                type="text"
                placeholder="বাসা/ফ্ল্যাটি নাম্বর, রোড নাম্বর, এলাকা, শহর"
                :class="['checkout-input', fieldErrors.address ? 'border-red-500' : '']"
              />
              <p v-if="fieldErrors.address" class="text-red-500 text-xs mt-1">{{ fieldErrors.address }}</p>
            </div>
          </div>

          <!-- Delivery Method Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">ডেলিভারি পদ্ধতি</h2>

            <div
              class="flex items-start gap-4 bg-[#FFF8F0] border border-[#f0e6d8] rounded-xl p-5"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                >
                  <path
                    d="M3.85645 21.2945L4.53368 18.5855H11.9832L11.306 21.2945H3.85645ZM12.6605 30.3355C11.5318 30.3355 10.5723 29.9405 9.78223 29.1504C8.99213 28.3603 8.59707 27.4008 8.59707 26.2721H5.21091L5.88814 23.3262H12.8975L14.1165 18.3824H16.9609L18.654 11.61H9.27431L9.47748 10.7973C9.61292 10.1653 9.92355 9.65192 10.4093 9.25732C10.8952 8.86272 11.4649 8.66497 12.1187 8.66406H27.5596L26.3067 14.0819H30.2685L34.3319 19.4998L32.9775 26.2721H30.2685C30.2685 27.4008 29.8735 28.3603 29.0834 29.1504C28.2933 29.9405 27.3338 30.3355 26.2051 30.3355C25.0764 30.3355 24.117 29.9405 23.3269 29.1504C22.5368 28.3603 22.1417 27.4008 22.1417 26.2721H16.7239C16.7239 27.4008 16.3288 28.3603 15.5387 29.1504C14.7486 29.9405 13.7892 30.3355 12.6605 30.3355ZM6.56538 16.3507L7.24261 13.6417H16.0466L15.3694 16.3507H6.56538ZM12.6605 27.6266C13.0442 27.6266 13.3661 27.4966 13.6262 27.2365C13.8863 26.9764 14.0158 26.655 14.0149 26.2721C14.014 25.8893 13.884 25.5678 13.6249 25.3077C13.3657 25.0477 13.0442 24.9177 12.6605 24.9177C12.2767 24.9177 11.9552 25.0477 11.6961 25.3077C11.4369 25.5678 11.3069 25.8893 11.306 26.2721C11.3051 26.655 11.4351 26.9769 11.6961 27.2378C11.9571 27.4988 12.2785 27.6284 12.6605 27.6266ZM26.2051 27.6266C26.5889 27.6266 26.9108 27.4966 27.1709 27.2365C27.4309 26.9764 27.5605 26.655 27.5596 26.2721C27.5587 25.8893 27.4287 25.5678 27.1695 25.3077C26.9104 25.0477 26.5889 24.9177 26.2051 24.9177C25.8214 24.9177 25.4999 25.0477 25.2407 25.3077C24.9816 25.5678 24.8516 25.8893 24.8507 26.2721C24.8498 26.655 24.9798 26.9769 25.2407 27.2378C25.5017 27.4988 25.8232 27.6284 26.2051 27.6266ZM24.7491 20.8543H31.2844L31.4198 20.1432L28.9141 16.7909H25.6972L24.7491 20.8543Z"
                    fill="#D4A276"
                  />
                </svg>
              </div>
              <div>
                <p class="body-1-sb text-gray-800">
                  ঢাকার ভেতরে ডেলিভারি: ২-৩ দিন
                </p>
                <p class="body-1-r text-gray-500">
                  ঢাকার বাইরে ডেলিভারি: ৩-৪ দিন
                </p>
              </div>
            </div>

            <div class="mt-5">
              <label class="checkout-label"
                >আপনার এরিয়া সিলেক্ট করুন
                <span class="text-red-500">*</span></label
              >
              <select
                :class="['checkout-input', fieldErrors.delivery_area ? 'border-red-500' : '']"
                v-model="form.delivery_area"
                @change="updateDeliveryCharge"
              >
                <option value="" selected disabled>
                  আপনার এরিয়া সিলেক্ট করুন
                </option>
                <option value="inside">ঢাকার ভেতরে</option>
                <option value="outside">ঢাকার বাহিরে</option>
              </select>
              <p v-if="fieldErrors.delivery_area" class="text-red-500 text-xs mt-1">{{ fieldErrors.delivery_area }}</p>
            </div>

          </div>

          <!-- Delivery Note Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">ডেলিভারি নোট (অপশনাল)</h2>
            <textarea
              v-model="form.note"
              rows="3"
              placeholder="বিশেষ কোনো ডেলিভারি নির্দেশনা থাকলে এখানে লিখুন..."
              class="checkout-input resize-none"
            ></textarea>
          </div>

          <!-- Payment Method Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">পেমেন্ট মেথড</h2>

            <div class="space-y-3">
              <!-- Cash on delivery -->
              <label
                class="payment-option"
                :class="{ 'payment-option--active': form.payment_type === 'cod' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  v-model="form.payment_type"
                  class="sr-only"
                />
                <div
                  class="payment-radio"
                  :class="{ 'payment-radio--active': form.payment_type === 'cod' }"
                >
                  <div
                    class="payment-radio-dot"
                    :class="{
                      'scale-100': form.payment_type === 'cod',
                      'scale-0': form.payment_type !== 'cod',
                    }"
                  ></div>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-600"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <div>
                    <span class="body-1-sb text-gray-700">ক্যাশ অন ডেলিভারি</span>
                    <span class="payment-note">পণ্য হাতে পেয়ে টাকা দিন</span>
                  </div>
                </div>
              </label>

              <!-- Online payment. Replaces the card and bKash placeholders,
                   which were never wired to anything; SSLCommerz covers both. -->
              <label
                v-if="onlinePaymentAvailable"
                class="payment-option"
                :class="{ 'payment-option--active': form.payment_type === 'online' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  v-model="form.payment_type"
                  class="sr-only"
                />
                <div
                  class="payment-radio"
                  :class="{ 'payment-radio--active': form.payment_type === 'online' }"
                >
                  <div
                    class="payment-radio-dot"
                    :class="{
                      'scale-100': form.payment_type === 'online',
                      'scale-0': form.payment_type !== 'online',
                    }"
                  ></div>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-600"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <path d="M2 10h20"></path>
                    <path d="M6 15h4"></path>
                  </svg>
                  <div>
                    <span class="body-1-sb text-gray-700">অনলাইনে পেমেন্ট করুন</span>
                    <span class="payment-note">কার্ড, বিকাশ, নগদ বা ব্যাংক</span>
                  </div>
                </div>
              </label>

              <!-- bKash Tokenized Checkout, switched on under Integrations › bKash. -->
              <label
                v-if="bkashPaymentAvailable"
                class="payment-option"
                :class="{ 'payment-option--active': form.payment_type === 'bkash' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  v-model="form.payment_type"
                  class="sr-only"
                />
                <div
                  class="payment-radio"
                  :class="{ 'payment-radio--active': form.payment_type === 'bkash' }"
                >
                  <div
                    class="payment-radio-dot"
                    :class="{
                      'scale-100': form.payment_type === 'bkash',
                      'scale-0': form.payment_type !== 'bkash',
                    }"
                  ></div>
                </div>
                <div class="flex items-center gap-3">
                  <img
                    :src="bkashLogo"
                    alt="bKash"
                    class="payment-logo"
                    width="52"
                    height="20"
                  />
                  <div>
                    <span class="body-1-sb text-gray-700">বিকাশ</span>
                    <span class="payment-note">বিকাশ অ্যাকাউন্ট থেকে পেমেন্ট করুন</span>
                  </div>
                </div>
              </label>
            </div>

            <p v-if="form.payment_type === 'online'" class="payment-hint">
              অর্ডার নিশ্চিত করলে আপনি নিরাপদ পেমেন্ট পেজে যাবেন।
            </p>
            <p v-if="form.payment_type === 'bkash'" class="payment-hint">
              অর্ডার নিশ্চিত করলে আপনি বিকাশ পেমেন্ট পেজে যাবেন।
            </p>
            <p v-if="paymentError" class="payment-error" role="alert">{{ paymentError }}</p>
          </div>
        </div>

        <!-- ========== RIGHT COLUMN: ORDER SUMMARY ========== -->
        <div class="lg:col-span-4">
          <div class="lg:sticky lg:top-25">
            <div class="checkout-card">
              <h2 class="checkout-card-title">অর্ডার সামারি</h2>

              <!-- Pre Order Banner -->
              <div
                v-if="isPreOrder"
                class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r mb-5"
              >
                <span class="font-bold">প্রি-অর্ডার:</span>
                আপনার অর্ডারে এক বা একাধিক পণ্য বর্তমানে স্টকে নেই।
              </div>

              <!-- Direct Order Product -->
              <div
                v-if="cartStore.is_direct_order && directOrderProduct"
                class="order-item"
              >
                <div class="flex gap-4">
                  <div
                    class="w-[70px] h-[85px] rounded-xl overflow-hidden bg-gray-100 shrink-0"
                  >
                    <img
                      :src="directOrderProduct?.featured_image"
                      :alt="directOrderProduct?.product_name"
                      class="w-full h-full object-cover"
                      fetchpriority="low"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="body-1-sb text-gray-800 truncate">
                        {{ directOrderProduct?.product_name }}
                      </h3>
                      <button
                        @click="removeCartItem(directOrderProduct)"
                        class="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <p class="body-1-r text-[#356019] mt-0.5">
                      {{ directOrderProduct?.price }}
                      <span class="bangla-font">৳</span>
                    </p>
                    <span
                      v-if="directOrderProduct?.has_blouse_option && directOrderProduct?.blouse_choice"
                      class="blouse-badge"
                      :class="directOrderProduct.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                    >
                      {{ directOrderProduct.blouse_choice === 'with' ? 'With Blouse' : 'Without Blouse' }}
                    </span>
                    <div class="flex items-center gap-0 mt-2">
                      <button
                        @click="updateQuantity(directOrderProduct, -1)"
                        class="qty-btn rounded-l-lg"
                      >
                        —
                      </button>
                      <span class="qty-value">{{
                        directOrderProduct?.quantity
                      }}</span>
                      <button
                        @click="updateQuantity(directOrderProduct, 1)"
                        class="qty-btn rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cart Products -->
              <template v-if="!cartStore.is_direct_order">
                <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="order-item"
                >
                  <div class="flex gap-4">
                    <div
                      class="w-[70px] h-[85px] rounded-xl overflow-hidden bg-gray-100 shrink-0"
                    >
                      <img
                        :src="item.product.featured_image"
                        :alt="item.product.product_name"
                        class="w-full h-full object-cover"
                        fetchpriority="low"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="body-1-sb text-gray-800 truncate">
                          {{ item.product.product_name }}
                        </h3>
                        <button
                          @click="removeCartItem(item)"
                          class="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <p class="body-1-r mt-0.5">
                        <span
                          v-if="item.regular_individual_price"
                          class="text-gray-400 line-through mr-1.5"
                        >
                          {{ item.regular_individual_price }}
                          <span class="bangla-font">৳</span>
                        </span>
                        <span class="text-[#356019]">
                          {{ item.individual_price }}
                          <span class="bangla-font">৳</span>
                        </span>
                      </p>
                      <span
                        v-if="item.blouse_choice"
                        class="blouse-badge"
                        :class="item.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                      >
                        {{ item.blouse_choice === 'with' ? 'With Blouse' : 'Without Blouse' }}
                      </span>
                      <div class="flex items-center gap-0 mt-2">
                        <button
                          @click="updateQuantity(item, -1)"
                          class="qty-btn rounded-l-lg"
                        >
                          —
                        </button>
                        <span class="qty-value">{{ item.quantity }}</span>
                        <button
                          @click="updateQuantity(item, 1)"
                          class="qty-btn rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Coupon -->
              <div class="mt-6">
                <label class="checkout-label">কুপন কোড</label>

                <!-- Applied: show what was accepted, with a way back out.
                     Previously an applied coupon looked the same as none. -->
                <div v-if="appliedCoupon" class="coupon-applied">
                  <span class="coupon-applied-code">{{ appliedCoupon.code }}</span>
                  <span class="coupon-applied-note">প্রয়োগ করা হয়েছে</span>
                  <button type="button" class="coupon-remove" @click="removeCoupon">বাতিল</button>
                </div>

                <div v-else class="flex gap-2">
                  <input
                    v-model="couponCode"
                    type="text"
                    placeholder="কুপন কোড লিখুন"
                    class="checkout-input flex-1"
                    :disabled="applyingCoupon"
                    @keyup.enter="applyCoupon"
                  />
                  <button type="button" class="coupon-submit-btn" :disabled="applyingCoupon" @click="applyCoupon">
                    {{ applyingCoupon ? '...' : 'Submit' }}
                  </button>
                </div>
              </div>

              <!-- Totals -->
              <div class="mt-6 space-y-3 pt-5 border-t border-[#f0e6d8]">
                <div class="flex justify-between body-1-r text-gray-600">
                  <span>সাবটোটাল</span>
                  <span>৳{{ subtotal }}</span>
                </div>
                <!-- What the product discounts already took off, so the saving
                     is visible rather than just baked into the subtotal. -->
                <div
                  v-if="productSaving > 0"
                  class="flex justify-between body-1-r text-green-600"
                >
                  <span>পণ্যে ছাড়</span>
                  <span>-৳{{ productSaving }}</span>
                </div>
                <div
                  v-if="form.discount > 0"
                  class="flex justify-between body-1-r text-green-600"
                >
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{{ form.discount }}</span>
                </div>
                <!-- A waived fee is said in words rather than shown as ৳0, so the
                     customer reads it as a saving instead of a missing figure. -->
                <div
                  class="flex justify-between body-1-r"
                  :class="deliveryIsFree ? 'text-green-600' : 'text-gray-600'"
                >
                  <span>ডেলিভারি চার্জ</span>
                  <span v-if="deliveryIsFree" class="font-semibold">Delivery Free</span>
                  <span v-else>৳{{ form.delivery_charge }}</span>
                </div>
              </div>

              <!-- Total -->
              <div
                class="flex justify-between items-center mt-5 pt-5 border-t border-[#f0e6d8]"
              >
                <span class="title-2 text-gray-900">মোট মূল্য</span>
                <span class="title-2 text-gray-900">৳{{ total }}</span>
              </div>

              <!-- Place Order Button -->
              <button
                @click.prevent="placeOrder"
                :disabled="isPlacingOrder"
                :class="[
                  'checkout-order-btn mt-6',
                  isPreOrder ? 'bg-orange-500 hover:bg-orange-600' : '',
                  isPlacingOrder ? 'opacity-70 cursor-not-allowed' : '',
                ]"
              >
                <span v-if="isPlacingOrder" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  অর্ডার প্রক্রিয়াধীন...
                </span>
                <span v-else>
                  {{
                    isPreOrder
                      ? "প্রি-অর্ডার নিশ্চিত করুন"
                      : "অর্ডার নিশ্চিত করুন"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== CARD ===== */
.checkout-card {
  background: white;
  border: 1px solid #f0e6d8;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .checkout-card {
    padding: 32px;
  }
}

.checkout-card-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .checkout-card-title {
    font-size: 22px;
  }
}

/* ===== FORM ELEMENTS ===== */
.checkout-label {
  display: block;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

/* The phone input lives inside PhoneField, so scoped `.checkout-input` cannot
   reach it — it is styled here by the same rules to stay identical. Its
   left padding is left alone: intl-tel-input sets it from the flag width. */
.checkout-input,
.phone-field :deep(.iti__tel-input) {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e0d8;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #fffaf4;
  transition: border-color 0.2s ease;
}

.checkout-input:focus,
.phone-field :deep(.iti__tel-input):focus {
  outline: none;
  border-color: #356019;
  box-shadow: 0 0 0 3px rgba(53, 96, 25, 0.08);
}

.checkout-input::placeholder,
.phone-field :deep(.iti__tel-input)::placeholder {
  color: #9ca3af;
}

.phone-field.is-invalid :deep(.iti__tel-input) {
  border-color: #ef4444;
}

.phone-field :deep(.iti) {
  --iti-border-color: #e5e0d8;
  --iti-country-selector-bg: #fffaf4;
  --iti-hover-color: rgba(53, 96, 25, 0.06);
  --iti-icon-color: #6b7280;
}

.checkout-input:disabled {
  background-color: #fff5ee;
  color: #9ca3af;
}

.payment-note {
  display: block;
  margin-top: 1px;
  font-size: 12px;
  color: #8a8378;
}

.payment-logo {
  width: 52px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.payment-error {
  margin-top: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  background: #fdecec;
  font-size: 12px;
  color: #a12020;
}

.payment-hint {
  margin-top: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  background: #f4f7f1;
  font-size: 12px;
  color: #47603a;
}

.checkout-hint {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6d6560;
  margin-top: 6px;
}

/* ===== PAYMENT OPTIONS ===== */
.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid #e5e0d8;
  border-radius: 12px;
  background-color: #fffaf4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: #356019;
}

.payment-option--active {
  border-color: #356019;
  background-color: #f8fdf5;
}

.payment-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s ease;
}

.payment-radio--active {
  border-color: #356019;
}

.payment-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #356019;
  transition: transform 0.2s ease;
}

/* ===== ORDER ITEMS ===== */
.order-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0e6d8;
}

.order-item:first-of-type {
  padding-top: 0;
}

/* ===== QUANTITY BUTTONS ===== */
.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #d1d5db;
  background: #fffaf4;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.qty-btn:hover {
  background-color: #f3f4f6;
}

.qty-value {
  width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1.5px solid #d1d5db;
  border-bottom: 1.5px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: #fffaf4;
}

/* ===== COUPON ===== */
.coupon-applied {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eef3ea;
  border: 1px solid #cfe0c4;
  border-radius: 10px;
  padding: 10px 14px;
}
.coupon-applied-code { font-weight: 700; color: #2C5015; }
.coupon-applied-note { font-size: 0.85rem; color: #5b7a4a; }
.coupon-remove {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #B23113;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.coupon-remove:hover { text-decoration: underline; }

.coupon-submit-btn {
  padding: 12px 24px;
  background: #fffaf4;
  border: 1.5px solid #356019;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #356019;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.coupon-submit-btn:hover {
  background-color: #356019;
  color: white;
}

/* ===== ORDER BUTTON ===== */
.checkout-order-btn {
  width: 100%;
  padding: 16px 24px;
  background-color: #356019;
  color: white;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkout-order-btn:hover {
  background-color: #2a4d14;
}

.blouse-badge {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.blouse-badge--with {
  background-color: #356019;
}

.blouse-badge--without {
  background-color: #8c7256;
}
</style>
