<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
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

const formatPrice = (value) => new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
}).format(Number(value) || 0)

// Set by PageController::checkout(); false keeps checkout cash-only.
const onlinePaymentAvailable = computed(() => Boolean(usePage().props.onlinePaymentAvailable))
// Set by PageController::checkout() from the bKash switch in Integrations.
const bkashPaymentAvailable = computed(() => Boolean(usePage().props.bkashPaymentAvailable))

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

const form = ref({
  email: "",
  name: "",
  mobile: "",
  address: "",
  note: "",
  order_status: "pending",
  order_type: "checkout",
  delivery: "cod",
  delivery_area: "inside",
  payment_type: "",
  delivery_charge: 0,
  discount: 0,
  create_account: false,
  password: "",
})

const phoneValid = computed(() =>
  /^(?:\+?88)?01[3-9]\d{8}$/.test(form.value.mobile.replace(/[\s()-]/g, "")),
)

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
    toast.error("কুপন কোড লিখুন।")
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

      toast.success("কুপন প্রয়োগ করা হয়েছে।")
    } else {
      // The server says why: expired, used up, or not valid for these items.
      // Collapsing all of it into "invalid code" sent people hunting for a
      // typo that was not there.
      toast.error(data.error || "এই কুপনটি প্রয়োগ করা যায়নি।")
    }
  } catch (error) {
    console.error("Error applying coupon:", error)
    toast.error("কুপনটি যাচাই করা যায়নি। আবার চেষ্টা করুন।")
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

const clearCheckoutCart = () => {
  if (cartStore.is_direct_order) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("directOrderProductData")
      localStorage.removeItem("is_direct_order")
    }
    directOrderProduct.value = null
    cartStore.is_direct_order = false
    return
  }

  cartStore.clearCart()
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
      toast.error(msg || "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।")
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
  <div class="checkout-shell">
    <div class="container">
      <!-- Figma: 900px form column, 20px gap, 440px cart summary -->
      <div class="checkout-grid">
        <!-- ========== LEFT COLUMN: FORM ========== -->
        <div class="checkout-form-col">
          <!-- Shipping Address Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">ডেলিভারির ঠিকানা</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="checkout-label">ই-মেইল</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@email.com"
                  class="checkout-input checkout-placeholder--poppins"
                />
                <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
                <p v-else class="checkout-hint">
                  ক্যাশ মেমো পেতে আপনার ই-মেইল অ্যাড্রেসটি দিন।
                </p>
              </div>
              <div>
                <label class="checkout-label">ফোন নম্বর</label>
                <input
                  v-model="form.mobile"
                  type="tel"
                  inputmode="tel"
                  placeholder="01XXXXXXXXX"
                  :class="['checkout-input checkout-placeholder--poppins', fieldErrors.mobile ? 'border-red-500' : '']"
                />
                <p v-if="fieldErrors.mobile" class="text-red-500 text-xs mt-1">{{ fieldErrors.mobile }}</p>
              </div>
            </div>

            <div class="mt-5">
              <label class="checkout-label">সম্পূর্ণ নাম</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="সম্পূর্ণ নাম"
                :class="['checkout-input checkout-placeholder--poppins', fieldErrors.name ? 'border-red-500' : '']"
              />
              <p v-if="fieldErrors.name" class="text-red-500 text-xs mt-1">{{ fieldErrors.name }}</p>
            </div>

            <div class="mt-5">
              <label class="checkout-label">বিস্তারিত ঠিকানা</label>
              <textarea
                v-model="form.address"
                rows="4"
                placeholder="বাড়ি/ফ্ল্যাট নম্বর, রাস্তা, এলাকা, শহর"
                :class="['checkout-input checkout-textarea checkout-placeholder--bangla resize-none', fieldErrors.address ? 'border-red-500' : '']"
              ></textarea>
              <p v-if="fieldErrors.address" class="text-red-500 text-xs mt-1">{{ fieldErrors.address }}</p>
            </div>
          </div>

          <!-- Delivery Method Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title">ডেলিভারির ধরন</h2>

            <div class="checkout-delivery-box">
              <img :src="'/assets/chhondo/checkout/delivery-truck.svg'" alt="" class="checkout-delivery-icon" />
              <div>
                <p class="checkout-delivery-line">
                  ঢাকার ভেতরে ডেলিভারি: ১-২ দিন
                </p>
                <p class="checkout-delivery-line">
                  ঢাকার বাইরে ডেলিভারি: ২-৩ দিন
                </p>
              </div>
            </div>

            <!-- Delivery note — Figma keeps it inside this card -->
            <div class="mt-5">
              <label class="checkout-label">ডেলিভারি ইন্সট্রাকশন যোগ করুন</label>
              <textarea
                v-model="form.note"
                rows="4"
                placeholder="পার্সেল রিসিভ করার ক্ষেত্রে কোনো বিশেষ নির্দেশনা থাকলে এখানে লিখুন..."
                class="checkout-input checkout-textarea checkout-placeholder--bangla resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Payment Method Card -->
          <div class="checkout-card">
            <h2 class="checkout-card-title checkout-card-title--payment">পেমেন্টের মাধ্যম</h2>

            <div class="payment-options">
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
                <div class="payment-option-content">
                  <img :src="'/assets/chhondo/checkout/cash.svg'" alt="" class="payment-icon payment-icon--cash" />
                  <span class="payment-name">ক্যাশ অন ডেলিভারি</span>
                </div>
              </label>

              <!-- Online payment. Replaces the card and bKash placeholders,
                   which were never wired to anything; SSLCommerz covers both. -->
              <label
                class="payment-option"
                :class="{ 'payment-option--active': form.payment_type === 'online' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  v-model="form.payment_type"
                  class="sr-only"
                  :disabled="!onlinePaymentAvailable"
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
                <div class="payment-option-content">
                  <img :src="'/assets/chhondo/checkout/credit-card.svg'" alt="" class="payment-icon" />
                  <span class="payment-name">ডেবিট / ক্রেডিট কার্ড</span>
                </div>
              </label>

              <!-- bKash Tokenized Checkout, switched on under Integrations › bKash. -->
              <label
                class="payment-option"
                :class="{ 'payment-option--active': form.payment_type === 'bkash' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  v-model="form.payment_type"
                  class="sr-only"
                  :disabled="!bkashPaymentAvailable"
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
                <div class="payment-option-content">
                  <img :src="'/assets/chhondo/checkout/bkash.svg'" alt="" class="payment-icon payment-icon--bkash" />
                  <span class="payment-name">বিকাশ</span>
                </div>
              </label>
            </div>

            <p v-if="paymentError" class="payment-error" role="alert">{{ paymentError }}</p>
          </div>
        </div>

        <!-- ========== RIGHT COLUMN: ORDER SUMMARY ========== -->
        <div class="checkout-summary-col">
          <div class="lg:sticky lg:top-25">
            <div class="checkout-card checkout-card--summary">
              <div class="checkout-summary-head">
                <h2 class="checkout-card-title">আপনার কার্ট ({{ String(cartStore.is_direct_order ? (directOrderProduct?.quantity || 0) : cartStore.cartCount).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) }})</h2>
                <button type="button" class="checkout-clear" @click="clearCheckoutCart">
                  <span>সব মুছুন</span>
                  <span class="checkout-clear-icon"><img :src="'/assets/chhondo/checkout/clear.svg'" alt="" /></span>
                </button>
              </div>

              <!-- Pre Order Banner -->
              <div
                v-if="isPreOrder"
                class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r mb-5"
              >
                <span class="font-bold">প্রি-অর্ডার:</span>
                আপনার অর্ডারে এক বা একাধিক পণ্য বর্তমানে স্টকে নেই।
              </div>

              <div class="checkout-order-list">
                <!-- Direct Order Product -->
                <div
                  v-if="cartStore.is_direct_order && directOrderProduct"
                  class="order-item"
                >
                <div class="flex gap-4">
                  <div
                    class="order-item-thumb"
                  >
                    <img
                      :src="directOrderProduct?.featured_image || '/placeholder.svg'"
                      :alt="directOrderProduct?.product_name"
                      class="w-full h-full object-cover"
                      fetchpriority="low"
                      loading="lazy"
                      decoding="async"
                      width="80"
                      height="80"
                      @error="$event.target.src = '/placeholder.svg'"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="order-item-name">
                        {{ directOrderProduct?.product_name }}
                      </h3>
                      <button type="button" @click="removeCartItem(directOrderProduct)" class="order-remove">
                        <img :src="'/assets/chhondo/checkout/trash.svg'" alt="" />
                      </button>
                    </div>
                    <p class="order-item-price">
                      {{ directOrderProduct?.price }}
                      <span class="bangla-font">৳</span>
                    </p>
                    <span
                      v-if="directOrderProduct?.has_blouse_option && directOrderProduct?.blouse_choice"
                      class="blouse-badge"
                      :class="directOrderProduct.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                    >
                      {{ directOrderProduct.blouse_choice === 'with' ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া' }}
                    </span>
                    <div class="checkout-qty">
                      <button
                        @click="updateQuantity(directOrderProduct, -1)"
                        class="qty-btn rounded-l-lg"
                      >
                        <img :src="'/assets/chhondo/checkout/minus.svg'" alt="" />
                      </button>
                      <span class="qty-value">{{
                        directOrderProduct?.quantity
                      }}</span>
                      <button
                        @click="updateQuantity(directOrderProduct, 1)"
                        class="qty-btn rounded-r-lg"
                      >
                        <img :src="'/assets/chhondo/checkout/plus.svg'" alt="" />
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
                      class="order-item-thumb"
                    >
                      <img
                        :src="item.product.featured_image || '/placeholder.svg'"
                        :alt="item.product.product_name"
                        class="w-full h-full object-cover"
                        fetchpriority="low"
                        loading="lazy"
                        decoding="async"
                        width="80"
                        height="80"
                        @error="$event.target.src = '/placeholder.svg'"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="order-item-name">
                          {{ item.product.product_name }}
                        </h3>
                        <button type="button" @click="removeCartItem(item)" class="order-remove">
                          <img :src="'/assets/chhondo/checkout/trash.svg'" alt="" />
                        </button>
                      </div>
                      <p class="order-item-price">
                        <span
                          v-if="item.regular_individual_price"
                          class="order-item-was"
                        >
                          {{ item.regular_individual_price }}
                          <span class="bangla-font">৳</span>
                        </span>
                        <span>
                          {{ item.individual_price }}
                          <span class="bangla-font">৳</span>
                        </span>
                      </p>
                      <span
                        v-if="item.blouse_choice"
                        class="blouse-badge"
                        :class="item.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                      >
                        {{ item.blouse_choice === 'with' ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া' }}
                      </span>
                      <div class="checkout-qty">
                        <button
                          @click="updateQuantity(item, -1)"
                          class="qty-btn rounded-l-lg"
                        >
                          <img :src="'/assets/chhondo/checkout/minus.svg'" alt="" />
                        </button>
                        <span class="qty-value">{{ item.quantity }}</span>
                        <button
                          @click="updateQuantity(item, 1)"
                          class="qty-btn rounded-r-lg"
                        >
                          <img :src="'/assets/chhondo/checkout/plus.svg'" alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </template>
              </div>

              <!-- Coupon -->
              <div class="checkout-coupon-section">
                <label class="checkout-label">কুপন কোড</label>

                <!-- Applied: show what was accepted, with a way back out.
                     Previously an applied coupon looked the same as none. -->
                <div v-if="appliedCoupon" class="coupon-applied">
                  <span class="coupon-applied-code">{{ appliedCoupon.code }}</span>
                  <span class="coupon-applied-note">প্রয়োগ করা হয়েছে</span>
                  <button type="button" class="coupon-remove" @click="removeCoupon">বাতিল</button>
                </div>

                <div v-else class="checkout-coupon-row">
                  <input
                    v-model="couponCode"
                    type="text"
                    placeholder="কুপন কোড লিখুন"
                    class="checkout-input checkout-coupon-input checkout-placeholder--bangla"
                    :disabled="applyingCoupon"
                    @keyup.enter="applyCoupon"
                  />
                  <button type="button" class="coupon-submit-btn" :disabled="applyingCoupon" @click="applyCoupon">
                    {{ applyingCoupon ? '...' : 'সাবমিট' }}
                  </button>
                </div>
              </div>

              <!-- Totals -->
              <div class="checkout-totals">
                <div class="checkout-total-row">
                  <span>সাবটোটাল</span>
                  <span>৳{{ formatPrice(subtotal) }}</span>
                </div>
                <!-- What the product discounts already took off, so the saving
                     is visible rather than just baked into the subtotal. -->
                <div
                  v-if="productSaving > 0"
                  class="checkout-total-row text-green-600"
                >
                  <span>পণ্যে ছাড়</span>
                  <span>-৳{{ formatPrice(productSaving) }}</span>
                </div>
                <div
                  v-if="form.discount > 0"
                  class="checkout-total-row text-green-600"
                >
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{{ formatPrice(form.discount) }}</span>
                </div>
                <!-- A waived fee is said in words rather than shown as ৳0, so the
                     customer reads it as a saving instead of a missing figure. -->
                <div
                  class="checkout-total-row"
                  :class="deliveryIsFree ? 'text-green-600' : 'text-gray-600'"
                >
                  <span>ডেলিভারি চার্জ</span>
                  <span v-if="deliveryIsFree" class="font-semibold">ফ্রি ডেলিভারি</span>
                  <span v-else>৳{{ formatPrice(form.delivery_charge) }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="checkout-final">
                <div class="checkout-final-row">
                  <span class="checkout-total-label">মোট মূল্য</span>
                  <span class="checkout-total-label">৳{{ formatPrice(total) }}</span>
                </div>

                <button
                  @click.prevent="placeOrder"
                  :disabled="isPlacingOrder"
                  :class="[
                    'checkout-order-btn',
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
                        : "চেকআউট করুন"
                    }}
                  </span>
                </button>
              </div>
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
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
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
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
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
  flex: 0 0 101px;
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
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
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

/* ===== Figma "Check Out Process" (💫 Final design) ===== */
.checkout-shell { padding: 40px 0 96px; }
.checkout-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: start; }
@media (min-width: 1024px) {
  .checkout-grid { grid-template-columns: minmax(0, 900fr) minmax(0, 440fr); }
}
.checkout-form-col { display: flex; flex-direction: column; gap: 32px; min-width: 0; }
.checkout-summary-col { min-width: 0; }
@media (min-width: 1024px) {
  /* Sticky summary: fixed while the left form column scrolls. The grid uses
     align-items: start, so this column is only as tall as its content and
     sticky binds it to the grid row — once both columns' bottoms align, the
     row ends and they scroll upward together naturally. The panel expands
     with its content; all scrolling is handled by the main page. */
  .checkout-summary-col {
    position: sticky;
    top: 100px;
    align-self: start;
  }
}

.checkout-card {
  margin: 0;
  padding: 32px;
  border: 0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.checkout-card--summary { padding: 42px; }

.checkout-card-title {
  margin-bottom: 20px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #3c3834;
}
.checkout-card-title--payment {
  font-family: "Poppins", sans-serif;
  font-variation-settings: "wdth" 100;
}
.checkout-card--summary .checkout-card-title { margin: 0; color: #1a1817; }

.checkout-summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 48px;
}
.checkout-clear {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  border: 0;
  background: none;
  color: #1a1817;
  font: 400 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
}
.checkout-clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  padding: 8px;
  border: 1px solid #efe0bb;
  border-radius: 2px;
  background: #faf5e9;
}
.checkout-clear-icon img { display: block; }

.checkout-label {
  display: block;
  margin-bottom: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
}

/* Fields — Black/50 fill, Black/200 hairline, r8, 56px */
.checkout-input {
  width: 100%;
  min-height: 56px;
  padding: 16px;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  background: #f3f3f3;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #1a1817;
}
.checkout-input:focus { border-color: #d6af51; background: #fff; box-shadow: 0 0 0 3px rgba(214, 175, 81, .18); outline: none; }
.checkout-input::placeholder {
  color: #9c9591;
  opacity: 1;
  font: 400 16px/24px "Li Ador Noirrit", sans-serif;
  font-style: normal;
  letter-spacing: 0;
  font-synthesis: none;
}
.checkout-placeholder--poppins,
.checkout-placeholder--poppins::placeholder {
  font-family: "Poppins", sans-serif;
}
.checkout-placeholder--poppins::placeholder {
  font: 400 16px/24px "Poppins", sans-serif;
  font-variation-settings: "wdth" 100;
}
.checkout-placeholder--bangla,
.checkout-placeholder--bangla::placeholder {
  font-family: "Li Ador Noirrit", sans-serif;
}
.checkout-textarea { min-height: 141px; }
.checkout-hint {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #6d6560;
}

/* Delivery box — Gold/50 fill, Gold/100 hairline */
.checkout-delivery-box {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  border: 1px solid #efe0bb;
  border-radius: 8px;
  background: #faf5e9;
}
.checkout-delivery-line {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}
.checkout-delivery-line + .checkout-delivery-line { margin-top: 4px; }
.checkout-delivery-icon { display: block; flex-shrink: 0; }

/* Payment — grey 56px rows with a 20px radio */
.payment-option {
  min-height: 56px;
  padding: 8px 16px;
  gap: 16px;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  background: #f3f3f3;
}
.payment-option:hover { border-color: #d6af51; }
.payment-option--active { border-color: #252f17; background: #fff; }
.payment-option:has(input:disabled) { cursor: not-allowed; }
.payment-radio { width: 20px; height: 20px; border: 1.5px solid #9c9591; }
.payment-radio--active { border-color: #252f17; }
.payment-radio-dot { background: #252f17; }
.payment-name {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6d6560;
}
.payment-note { display: none; }
.payment-options { display: flex; flex-direction: column; gap: 20px; }
.payment-option-content { display: flex; align-items: center; gap: 8px; }
.payment-icon { display: block; flex-shrink: 0; }

/* Summary items — 96 × 102 thumbs, 24px apart */
.checkout-order-list { display: flex; flex-direction: column; gap: 24px; }
.order-item { padding: 0; border: 0; margin: 0; }
.order-item:first-of-type { padding-top: 0; }
.order-item-thumb { width: 96px; height: 102px; flex-shrink: 0; overflow: hidden; border-radius: 8px; background: #f3f3f3; }
.order-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.order-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #3c3834;
}
.order-item-price {
  margin-top: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #cc9b25;
}
.order-item-was { margin-right: 6px; color: #9c9591; font-weight: 400; font-size: 14px; text-decoration: line-through; }
.order-remove { width: 20px; height: 20px; padding: 0; flex-shrink: 0; border: 0; background: none; }
.order-remove img { display: block; }
.checkout-qty { display: flex; align-items: center; gap: 8px; height: 32px; margin-top: 8px; }
.qty-btn img { display: block; }

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1cdca;
  border-radius: 9999px !important;
  background: #fff;
  color: #1a1817;
  font-size: 14px;
  padding: 0;
}
.qty-btn:hover { background: #faf5e9; border-color: #d6af51; }
.qty-value { width: auto; min-width: 28px; height: 32px; border: 0; background: none; font-family: "Poppins", sans-serif; font-size: 14px; color: #1a1817; }

.checkout-coupon-section {
  margin-top: 28px;
  padding: 28px 0;
  border-top: 1px solid #e4e1e0;
  border-bottom: 1px solid #e4e1e0;
}
.checkout-coupon-row { display: flex; align-items: center; gap: 8px; }
.checkout-coupon-input { flex: 1 1 auto; min-width: 0; }

/* Coupon — 56px field + outlined Submit */
.coupon-submit-btn {
  flex: 0 0 101px;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #1a2110;
  border-radius: 8px;
  background: #fff;
  color: #1a2110;
  font-family: "Li Ador Noirrit", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
}
.coupon-submit-btn:hover:not(:disabled) { background: #1a2110; color: #fff; }

.checkout-totals {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
  font: 400 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #6d6560;
}
.checkout-total-row { display: flex; align-items: center; justify-content: space-between; }
.checkout-total-row > :last-child {
  font-family: "Poppins", "Li Ador Noirrit", sans-serif;
  font-weight: 600;
  color: #3c3834;
}
.checkout-final { margin-top: 28px; padding-top: 28px; border-top: 1px solid #e4e1e0; }
.checkout-final-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }

.checkout-total-label {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #3c3834;
}

.checkout-order-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: #1a2110;
  color: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.checkout-order-btn:hover { background: #252f17; }

@media (max-width: 767px) {
  .checkout-shell { padding: 20px 0 48px; }
  .checkout-shell .container { padding-inline: 20px; }
  .checkout-card,
  .checkout-card--summary { padding: 20px; }
  .checkout-card-title,
  .checkout-total-label { font-size: 22px; line-height: 30px; }
  .checkout-summary-head { margin-bottom: 24px; }
}

/* Phone field matches its Figma siblings */
.phone-field :deep(.iti__tel-input) {
  height: 56px;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  background: #f3f3f3;
  color: #1a1817;
}
.phone-field :deep(.iti__tel-input):focus { border-color: #d6af51; background: #fff; box-shadow: 0 0 0 3px rgba(214, 175, 81, .18); }
</style>
