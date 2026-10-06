<template>
  <div class="container pdp-wrap">
    <!-- Figma: 555px gallery, 20px gap, 785px info column (23px inset) -->
    <div class="pdp-grid">
      <!-- Product Images (sticky on desktop) -->
      <div class="pdp-gallery-col">
        <ProductImages
          :product="product"
          @imageFunction="handleImageFunction"
        />
      </div>

      <!-- Product Info -->
      <section
        id="product-section"
        v-if="product"
        class="pdp-info-col"
      >
        <!-- Product Name + rating + price -->
        <div class="space-y-3">
          <div class="space-y-2">
            <h1 class="product-title">
              {{ product.product_name }}
            </h1>

            <!-- Star Row -->
            <div v-if="pageReviews.length > 0" class="flex items-center gap-2" aria-label="Rating">
              <div class="flex gap-0.5">
                <svg
                  v-for="n in 5"
                  :key="n"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  :fill="n <= Math.round(averageRating) ? '#d6af51' : 'none'"
                  stroke="#d6af51"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span class="pdp-rating-text">{{ averageRating.toFixed(1) }}</span>
              <span class="pdp-rating-text">({{ pageReviews.length }} reviews)</span>
            </div>
          </div>

          <!-- Price + Stock Status -->
          <div class="flex items-center gap-3 flex-wrap">
            <span class="product-price" :class="{ 'price-flash': priceFlash }">
              {{ displayPrice }} <span class="product-price-sign">৳</span>
            </span>
            <!-- Strike the price this was reduced from: the coupon or campaign
                 price when one applies, otherwise the regular previous price. -->
            <span
              v-if="wasPrice"
              class="body-2-r text-gray-400 line-through"
            >
              {{ wasPrice }}৳
            </span>
            <span v-if="savingAmount > 0" class="pdp-saving">
              {{ savingAmount }}৳ ছাড়
            </span>
            <span v-if="isPreOrderProduct" class="pdp-stock pdp-stock--preorder">Pre Order</span>
            <span v-else-if="isSoldOut" class="pdp-stock pdp-stock--soldout">Out of Stock</span>
            <span v-else class="pdp-stock">In stock</span>
          </div>
        </div>

        <!-- Short Description -->
        <div
          class="pdp-description"
          v-html="rebrand(product.short_description)"
        ></div>

        <!-- Blouse Option (only when has_blouse_option) -->
        <div v-if="hasBlouseOption" class="space-y-2">
          <label class="pdp-option-label">ব্লাউজ:</label>
          <div class="pdp-blouse-row">
            <label
              v-for="opt in blouseChoices"
              :key="opt.value"
              :class="[
                'pdp-pill',
                blouseChoice === opt.value ? 'pdp-pill--active' : '',
              ]"
            >
              <input
                type="radio"
                name="blouse_option"
                :value="opt.value"
                v-model="blouseChoice"
                class="sr-only"
              />
              <span>{{ opt.label }}</span>
              <span v-if="opt.value === 'with' && blouseExtra" class="whitespace-nowrap">(+ {{ blouseExtra }}৳)</span>
              <span v-if="blouseChoice === opt.value" class="pdp-pill-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </label>
          </div>
        </div>

        <!-- Dynamic Attributes -->
        <div
          v-for="attributeName in sortedAttributeNames"
          :key="attributeName"
          class="space-y-2"
        >
          <label class="pdp-option-label">{{ attributeName }}:</label>
          <div class="flex flex-wrap gap-4">
            <button
              v-for="option in groupedAttributes[attributeName]"
              :key="option.id"
              @click="
                selectAttribute(
                  attributeName,
                  option.attribute_option.id,
                  option.attribute_option.name,
                )
              "
              :class="[
                'pdp-pill',
                selectedAttributes[attributeName] === option.attribute_option.id
                  ? 'pdp-pill--active'
                  : '',
              ]"
            >
              <span>{{ option.attribute_option.name }}</span>
              <span
                v-if="selectedAttributes[attributeName] === option.attribute_option.id"
                class="pdp-pill-check"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <span class="text-orange-500 body-1-r" v-if="attributeSelectionAlert">
          যেকোনো একটি সিলেক্ট করুন
        </span>

        <!-- Quantity Selector. Hidden entirely when nothing can be bought: a
             quantity to choose implies an order to place. The sold-out notice
             takes its place in the same row. -->
        <div class="space-y-2">
          <label v-if="!cannotBuy" class="pdp-option-label">পরিমাণ:</label>
          <div class="pdp-qty-row" :class="{ 'is-soldout': cannotBuy }">
          <div v-if="cannotBuy" class="pdp-soldout-row" role="status">
            <span class="pdp-soldout-text">
              {{ isSoldOut
                ? "এই পণ্যটি বর্তমানে স্টকে নেই।"
                : "নির্বাচিত অপশনটি স্টকে নেই। অন্য একটি বেছে নিন।" }}
            </span>

            <button type="button" class="pdp-soldout-btn" disabled aria-disabled="true">
              {{ isSoldOut ? "স্টকে নেই" : "অপশন নেই" }}
            </button>
          </div>

          <div v-else class="pdp-qty-stepper">
            <button
              @click="decrementQuantity"
              class="pdp-qty-btn"
              :disabled="quantity <= 1"
              aria-label="Decrease quantity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span class="pdp-qty-value">{{ quantity }}</span>
            <button
              @click="incrementQuantity"
              class="pdp-qty-btn"
              aria-label="Increase quantity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>

          </div>
        </div>

        <!-- Pre Order Notice, with whatever the shop wrote about timing -->
        <div
          v-if="isPreOrderProduct"
          class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r"
        >
          এই পণ্যটি প্রি-অর্ডারের জন্য উন্মুক্ত। অর্ডার করলে স্টক আসার সাথে সাথে পাঠানো হবে।
          <span v-if="preOrderTiming" class="block mt-1 font-medium">{{ preOrderTiming }}</span>
        </div>

        <!-- Action Buttons — Figma: Add to cart + Buy now side by side, h56.
             Sold out drops the row entirely rather than showing a disabled
             pair: there is no action to offer, and the notice above already
             says so. -->
        <div v-if="!cannotBuy" class="pdp-actions">
          <button
            type="button"
            @click="addToCart"
            :class="[
              'pdp-btn flex-1',
              isPreOrderProduct ? 'pdp-btn--preorder' : 'pdp-btn--primary',
            ]"
          >
            <img v-if="!isPreOrderProduct" :src="'/assets/chhondo/cart-light.svg'" alt="" width="24" height="24" />
            {{ isPreOrderProduct ? "প্রি-অর্ডার কার্টে যোগ করুন" : "কার্টে রাখুন" }}
          </button>

          <button
            type="button"
            @click="buyNow"
            :class="[
              'pdp-btn flex-1',
              isPreOrderProduct ? 'pdp-btn--preorder-outline' : 'pdp-btn--outline-green',
            ]"
          >
            {{ isPreOrderProduct ? "প্রি-অর্ডার করুন" : "এখনই কিনুন" }}
          </button>
        </div>

        <!-- Call / WhatsApp / Share row -->
        <div class="pdp-contact-row">
          <a
            :href="`tel:${otherInfo.phone_number}`"
            class="pdp-btn pdp-btn--ghost pdp-btn--call"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              ></path>
            </svg>
            কল করুন
          </a>
          <a
            :href="`https://wa.me/${otherInfo.whatsapp_number}`"
            target="_blank"
            class="pdp-btn pdp-btn--ghost pdp-btn--whatsapp"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            হোয়াটসঅ্যাপ
          </a>
          <button type="button" class="pdp-btn pdp-btn--ghost" @click="shareProduct">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 5.5V3l8 7.5-8 7.5v-2.6c-5.2 0-8.6 1.6-11 5.1.9-5 3.8-9.9 11-11V5.5z" />
            </svg>
            শেয়ার করুন
          </button>
        </div>

        <!-- Accordion Description -->
        <div class="pd-accordion">
          <div
            v-for="(item, index) in accordionItems"
            :key="index"
            class="pd-accordion-item"
          >
            <button
              class="pd-accordion-header"
              @click="toggleAccordion(index, $event)"
            >
              <span>{{ item.title }}</span>
              <svg
                :class="[
                  'pd-accordion-chevron',
                  { 'rotate-180': openIndex === index },
                ]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <Transition
              name="pd-accordion"
              @enter="onAccordionEnter"
              @after-enter="onAccordionAfterEnter"
              @leave="onAccordionLeave"
            >
              <div v-if="openIndex === index" class="pd-accordion-body">
                <div
                  v-if="item.html"
                  v-html="item.html"
                  class="product-description"
                />
                <p v-else class="pd-accordion-text">{{ item.content }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <div v-else class="p-4 text-center">Loading product details...</div>
    </div>
  </div>


  <ProductReviews :reviews="pageReviews" :product="product" />

  <RecentlyViewed :product="product" :openPreview="openPreview" />

  <RelatedProducts
    :related_products="related_products"
    :openPreview="openPreview"
  />
</template>

<script setup>
import { rebrand } from "@/utils/rebrand"
import { ref, computed, watch, onMounted } from "vue"
import { toast } from "@steveyuowo/vue-hot-toast"
import { router } from "@inertiajs/vue3"
import { useAuthStore } from "@/Store/authStore"
import { useCartStore } from "@/Store/cartStore"
import { useHomeStore } from "@/Store/homeStore"

import ProductImages from "./ProductImages.vue"
import ProductReviews from "./ProductReviews.vue"
import RecentlyViewed from "./RecentlyViewed.vue"
import RelatedProducts from "./RelatedProducts.vue"
import { useHead } from "@vueuse/head"
import { usePage } from "@inertiajs/vue3"
import { isOutOfStock, isPreOrder, isVariantOutOfStock, preOrderNote } from '@/utils/stock'
import { priceFor, priceForAmount, wasPriceFor, discountFor, blousePriceFor } from '@/utils/productPrice'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
  related_products: {
    type: Object,
    default: () => ({}),
  },
  otherInfo: {
    type: Object,
    default: () => ({}),
  },
  openPreview: {
    type: Function,
    default: null,
  },
})

// Drives the heart beside the quantity stepper. The store keeps guests in
// localStorage and signed-in customers on the server, so this works either way.

const homeStore = useHomeStore()

// Accordion
const openIndex = ref(0)

/*
 * Opening a panel used to move the page under the cursor: only one panel is
 * open at a time, so the one that closes takes its height with it and
 * everything below — including the header just clicked — slides up.
 *
 * The header's position is held still for the length of the animation, so the
 * panels resize around it instead of the page jumping.
 */
function toggleAccordion(index, event) {
  const header = event.currentTarget
  const before = header.getBoundingClientRect().top

  openIndex.value = openIndex.value === index ? null : index

  const started = performance.now()

  const hold = () => {
    const drift = header.getBoundingClientRect().top - before

    if (Math.abs(drift) > 0.5) window.scrollBy(0, drift)

    // A little past the 320ms transition, to settle the final frame.
    if (performance.now() - started < 380) requestAnimationFrame(hold)
  }

  requestAnimationFrame(hold)
}

/*
 * Height is measured rather than guessed. The panel used to animate to a fixed
 * max-height of 600px, which both clipped longer descriptions and made short
 * ones spend most of the animation on empty space.
 */
function onAccordionEnter(el) {
  el.style.height = '0'
  el.style.opacity = '0'
  void el.offsetHeight
  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
}

function onAccordionAfterEnter(el) {
  // Back to auto, so the panel reflows if its content or the window changes.
  el.style.height = 'auto'
  el.style.opacity = ''
}

function onAccordionLeave(el) {
  el.style.height = `${el.scrollHeight}px`
  void el.offsetHeight
  el.style.height = '0'
  el.style.opacity = '0'
}
const accordionItems = computed(() => [
  {
    title: "যেভাবে শাড়ি যত্নে রাখবেন:",
    html: rebrand(props.product?.description || ""),
  },
  {
    title: "রিফান্ড ও রিটার্ন পলিসি",
    content: `অর্ডার করার আগে প্রোডাক্ট সম্পর্কিত সকল তথ্য জেনে অর্ডার করুন।

ডিভাইস বা আলোর তারতম্যের কারণে কাপড় বা ব্লক প্রিন্ট এর রং ছবিতে এবং বাস্তবে হালকা পার্থক্য মনে হতে পারে। রং নিয়ে কোন কনফিউশন থাকলে কেনার আগে আমাদের ফেইসবুক পেইজে নক করতে পারেন। আমরা সর্বোচ্চ চেষ্টা করি গ্রাহককে ছবি দিয়ে সহায়তা করতে।

প্রডাক্টটি অবশ্যই ডেলিভারি ম্যান এর সামনে চেক করতে হবে। রিটার্ন করতে চাইলে সাথে সাথে ডেলিভারি ম্যান কে ফেরত দিতে পারবেন। রিটার্ন করতে চাইলে ডেলিভারি চার্জ আপনাকে দিতে হবে। ছন্দ সেই খরচ বহন করবে না।

শুধু মাত্র শাড়িতে কোন ছেঁড়াফাটা থাকলে ফিরিয়ে দিতে পারবেন। সেই ক্ষেত্রে যাবতীয় খরচ ছন্দ বহন করবে।

ডেলিভারি ম্যান চলে আসার পর আর কোন রকম রিটার্ন বা কমপ্লেইন নেয়া হবে না।`,
  },
  {
    title: "ডেলিভারি চার্জ",
    html: `<ul class="delivery-charge-list">
      <li>ঢাকার মধ্যে ডেলিভারি চার্জ <span class="taka-highlight">৳${homeStore.siteinfos?.[0]?.shipping_charge_inside_dhaka || 70}</span></li>
      <li>ঢাকার বাইরে সারাদেশে ডেলিভারি চার্জ <span class="taka-highlight">৳${homeStore.siteinfos?.[0]?.shipping_charge_outside_dhaka || 130}</span></li>
    </ul>`,
  },
  {
    title: "ডেলিভারির সময়",
    content:
      "ঢাকার মধ্যে মাত্র ২-৩ দিন এবং সারাদেশে ৩-৪ দিনের মধ্যে পেয়ে যাবেন।",
  },
])

onMounted(() => {
  homeStore.fetchData()
})

onMounted(() => {
  if (props.product?.id) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: props.product.price || 0,
        items: [
          {
            item_name: props.product.product_name || "",
            item_id: props.product.id,
            price: props.product.price || 0,
            item_category: props.product.category?.name || "",
            quantity: 1,
          },
        ],
      },
    })
  }
})
const attributeSelectionAlert = ref(false)

const quantity = ref(1)
const basePrice = ref(0)

// Blouse option (optional, off by default)
const hasBlouseOption = computed(
  () => !!props.product?.has_blouse_option && blousePriceFor(props.product) > 0
)
const blouseChoice = ref("without") // 'without' | 'with' — default Without Blouse
const blouseChoices = [
  { value: "without", label: "ব্লাউজ পিস ছাড়া" },
  { value: "with", label: "ব্লাউজ পিস সহ" },
]

// Extra cost of the with-blouse option, shown as "+ N৳" on the pill
const blouseExtra = computed(() => {
  const withPrice = blousePriceFor(props.product)
  const base = parseFloat(props.product?.price)
  if (withPrice > 0 && !isNaN(base) && withPrice > base) {
    return Math.round(withPrice - base)
  }
  return null
})

// Site reviews shared by the page — used for the star row and reviews section
const pageReviews = computed(() => usePage().props.reviews || [])

const averageRating = computed(() => {
  const reviews = pageReviews.value
  if (!reviews.length) return 0
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
})

const shareProduct = async () => {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.product.product_name, url })
    } catch (e) {
      // user dismissed the share sheet
    }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url)
    toast.success("লিংক কপি হয়েছে!")
  }
}
const currentBaseProductPrice = computed(() => {
  if (hasBlouseOption.value && blouseChoice.value === "with") {
    return blousePriceFor(props.product)
  }
  return parseFloat(props.product?.price) || 0
})

// Three distinct states: a pre-order sells, a sold-out product does not, and
// neither of them is in stock.
const isPreOrderProduct = computed(() => isPreOrder(props.product))
const isSoldOut = computed(() => isOutOfStock(props.product))
const preOrderTiming = computed(() => preOrderNote(props.product))

const selectedAttributes = ref({})
const selectedCombination = ref(null)

const groupedAttributes = computed(() => {
  if (!props.product || !props.product.product_attributes) {
    return {}
  }

  const grouped = {}
  props.product.product_attributes.forEach((attr) => {
    if (!attr.attribute || !attr.attribute.name) {
      console.warn("Invalid attribute structure:", attr)
      return
    }

    if (!grouped[attr.attribute.name]) {
      grouped[attr.attribute.name] = []
    }

    const optionExists = grouped[attr.attribute.name].some(
      (existingOption) =>
        existingOption.attribute_option.id === attr.attribute_option.id,
    )
    if (!optionExists) {
      grouped[attr.attribute.name].push(attr)
    }
  })

  return grouped
})

const sortedAttributeNames = computed(() => {
  return Object.keys(groupedAttributes.value).sort((a, b) => {
    const aOrder =
      props.product.product_attributes.find((attr) => attr.attribute.name === a)
        ?.attribute.order || 0
    const bOrder =
      props.product.product_attributes.find((attr) => attr.attribute.name === b)
        ?.attribute.order || 0
    return aOrder - bOrder
  })
})

const allAttributesSelected = computed(() => {
  return sortedAttributeNames.value.every(
    (attr) => selectedAttributes.value[attr],
  )
})

const imageFunction = ref(null)

const handleImageFunction = (fn) => {
  imageFunction.value = fn
}

const selectAttribute = (attributeName, optionId, optionName) => {
  selectedAttributes.value = {
    ...selectedAttributes.value,
    [attributeName]: optionId,
  }

  updateSelectedCombination()

  if (
    props.product.color_links &&
    Array.isArray(props.product.color_links) &&
    props.product.color_links.length > 0 &&
    imageFunction.value
  ) {
    const hasCombinations = props.product.product_attributes.some(
      (attr) => attr.combination_id !== null,
    )

    let colorIndex = -1

    if (
      hasCombinations &&
      allAttributesSelected.value &&
      selectedCombination.value
    ) {
      const sortedAttributeIds = sortedAttributeNames.value
        .filter((attrName) => selectedAttributes.value[attrName])
        .map((attrName) => selectedAttributes.value[attrName])
        .join("_")

      colorIndex = props.product.color_links.findIndex(
        (link) => link && link.toString() === sortedAttributeIds,
      )
    } else {
      colorIndex = props.product.color_links.findIndex(
        (link) => link && link.toString() === optionId.toString(),
      )
    }

    if (colorIndex !== -1) {
      imageFunction.value(colorIndex)
    }
  }

  if (allAttributesSelected) {
    attributeSelectionAlert.value = false
  } else {
    attributeSelectionAlert.value = true
  }
}

const updateSelectedCombination = () => {
  const sortedAttributes = sortedAttributeNames.value
    .filter((attributeName) => selectedAttributes.value[attributeName])
    .map((attributeName) => {
      const optionId = selectedAttributes.value[attributeName]
      const attribute = groupedAttributes.value[attributeName].find(
        (attr) => attr.attribute_option.id === optionId,
      )
      return {
        attributeId: attribute.attribute_id,
        optionId: optionId,
        optionName: attribute.attribute_option.name,
        price: parseFloat(attribute.price) || 0,
      }
    })

  const selectedCombinationString = JSON.stringify(
    sortedAttributes.map(({ attributeId, optionId, optionName }) => ({
      attributeId,
      optionId,
      optionName,
    })),
  )

  selectedCombination.value = (
    props.product.product_attributes_combaine || []
  ).find((combo) => combo.combination_string === selectedCombinationString)

  const base = currentBaseProductPrice.value
  let optionPrice = sortedAttributes.reduce((sum, attr) => sum + attr.price, 0)

  const finalPrice = base + optionPrice

  updateBasePrice(finalPrice)
}

const getSelectedAttributeIds = () => {
  if (selectedCombination.value) {
    return props.product.product_attributes
      .filter((attr) => attr.combination_id === selectedCombination.value.id)
      .map((attr) => attr.id)
  } else {
    return Object.entries(selectedAttributes.value)
      .map(([attributeName, optionId]) => {
        const attribute = props.product.product_attributes.find(
          (attr) =>
            attr.attribute.name === attributeName &&
            attr.attribute_option.id === optionId,
        )
        return attribute ? attribute.id : null
      })
      .filter((id) => id !== null)
  }
}

/**
 * Whether the size/colour currently chosen has run out.
 *
 * A product can be in stock overall while one variant is not — the quantity is
 * held per option row — so the buttons follow the selection, not just the
 * product. Only meaningful once every option has been picked.
 */
const selectedVariantSoldOut = computed(() => {
  if (!allAttributesSelected.value) return false

  const ids = getSelectedAttributeIds()
  const rows = (props.product?.product_attributes ?? []).filter((attr) => ids.includes(attr.id))

  return isVariantOutOfStock(props.product, rows)
})

/** The single question both buy buttons ask. */
const cannotBuy = computed(() => isSoldOut.value || selectedVariantSoldOut.value)

const displayPrice = computed(() => {
  return formatPrice(basePrice.value)
})

const formatPrice = (price) => {
  const numPrice = parseFloat(price)
  if (isNaN(numPrice)) return "0"
  // Whole prices render without decimals ("1750"), like the design
  return Number.isInteger(numPrice) ? String(numPrice) : numPrice.toFixed(2)
}
// The shared rule covers a campaign and a product coupon, and matches what
// the cart will charge.
/** True while the customer has the with-blouse option selected. */
const withBlouse = computed(() => hasBlouseOption.value && blouseChoice.value === 'with')

// Follows the blouse choice, so the struck-through figure always belongs to the
// same variant as the price beside it.
const wasPrice = computed(() => {
  const was = wasPriceFor(props.product, withBlouse.value)
  return was ? Math.round(was) : null
})

const savingAmount = computed(() => Math.round(discountFor(props.product)))

/**
 * Set the displayed price from the amount the current selection resolves to.
 *
 * Every call site passes that amount — the with/without-blouse price plus any
 * attribute option prices. The argument used to be ignored here, so the page
 * showed the plain without-blouse price no matter what was chosen.
 */
const updateBasePrice = (amount = null) => {
  basePrice.value = amount === null
    ? priceFor(props.product, withBlouse.value)
    : priceForAmount(props.product, amount)
}

watch(
  () => props.product.price,
  (newPrice) => {
    if (newPrice !== undefined) {
      updateBasePrice(currentBaseProductPrice.value)
    }
  },
)

// Flash animation flag — toggles on every blouse change so the user
// visually catches the price update.
const priceFlash = ref(false)
let priceFlashTimer = null

// Recompute the price when the blouse selection toggles, factoring in any
// attribute option prices currently chosen.
watch(blouseChoice, () => {
  const sortedAttributes = Object.entries(selectedAttributes.value)
    .map(([attributeName, optionId]) => {
      const matchingAttribute = props.product.product_attributes?.find(
        (attr) =>
          attr.attribute.name === attributeName &&
          attr.attribute_option.id === optionId,
      )
      return matchingAttribute ? parseFloat(matchingAttribute.price) || 0 : 0
    })
  const optionPrice = sortedAttributes.reduce((sum, p) => sum + p, 0)
  updateBasePrice(currentBaseProductPrice.value + optionPrice)

  // Retrigger the flash even on rapid toggles.
  priceFlash.value = false
  if (priceFlashTimer) clearTimeout(priceFlashTimer)
  requestAnimationFrame(() => {
    priceFlash.value = true
    priceFlashTimer = setTimeout(() => {
      priceFlash.value = false
    }, 700)
  })
})

// Also set during setup: onMounted never runs in the server render, which
// would otherwise send the page out priced at 0 until the browser took over.
// Everything it reads comes from props and default selections, so the server
// and the browser arrive at the same figure.
if (props.product && props.product.price) {
  updateBasePrice(currentBaseProductPrice.value)
}

onMounted(() => {
  if (props.product && props.product.price) {
    updateBasePrice(currentBaseProductPrice.value)
  }
})

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const getStorage = () => {
  if (typeof window !== "undefined") {
    return {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    }
  }
  return {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
  }
}

const pushAddToCartEvent = (product, quantity, selectedAttributes) => {
  if (product?.id) {
    const unitPrice = basePrice.value || product.price || 0
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: unitPrice * quantity,
        items: [
          {
            item_name: product.product_name || "",
            item_id: product.id,
            price: unitPrice,
            item_category: product.category?.name || "",
            quantity: quantity,
          },
        ],
      },
    })
  }
}

/**
 * Refuse to act on something that cannot be bought, and say why.
 *
 * Returns true when the caller should stop. Both buy paths ask, so neither can
 * be driven from the console or by a button re-enabled in DevTools.
 */
const guardUnavailable = () => {
  if (isSoldOut.value) {
    toast.error("এই পণ্যটি বর্তমানে স্টকে নেই।")
    return true
  }

  if (selectedVariantSoldOut.value) {
    toast.error("নির্বাচিত অপশনটি বর্তমানে স্টকে নেই।")
    return true
  }

  return false
}

const addToCart = () => {
  const cartStore = useCartStore()

  // The button is gone, so this catches a re-enabled one, a page left open
  // since before the product sold out, and a call from anywhere else.
  if (guardUnavailable()) return

  if (allAttributesSelected.value) {
    const selectedAttributeIds = getSelectedAttributeIds()

    cartStore.addToCart({
      product_id:       props.product.id,
      quantity:         quantity.value,
      blouse_choice:    hasBlouseOption.value ? blouseChoice.value : null,
      attribute_values: selectedAttributeIds,
    }, props.product)

    cartStore.cartOrder()
  } else {
    attributeSelectionAlert.value = true
  }
  pushAddToCartEvent(props.product, quantity.value, selectedAttributes)
}

const buyNow = () => {
  const cartStore = useCartStore()

  if (guardUnavailable()) return

  if (allAttributesSelected.value) {
    const selectedAttributeIds = getSelectedAttributeIds()
    const productData = {
      product_id: props.product.id,
      product_name: props.product.product_name,
      price: basePrice.value,
      featured_image: props.product.featured_image,
      quantity: quantity.value,
      is_pre_order: isPreOrderProduct.value,
      has_blouse_option: hasBlouseOption.value,
      blouse_choice: hasBlouseOption.value ? blouseChoice.value : null,
      // What the server prices the line from; see CheckoutWebController.
      attribute_values: selectedAttributeIds,
      selectedAttributes: selectedAttributeIds.map((id) => {
        const attr = props.product.product_attributes.find((a) => a.id === id)
        return {
          attribute_id: attr.attribute_id,
          attribute_option_id: attr.attribute_option_id,
          attribute_name: attr.attribute.name,
          attribute_option: attr.attribute_option.name,
          attribute_option_price: attr.price,
        }
      }),
    }

    cartStore.directOrder()

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "directOrderProductData",
        JSON.stringify(productData),
      )
    }
    pushAddToCartEvent(props.product, quantity.value, selectedAttributes)
    router.get("/checkout")
  } else {
    attributeSelectionAlert.value = true
  }
}

useHead({
  meta: [
    {
      property: "og:title",
      content: props.product.product_name || "Default Title",
    },
    {
      property: "og:description",
      content: props.product.short_description || "Default Description",
    },
    {
      property: "og:url",
      // The server render has no window; the page URL resolves to the same
      // address the browser would report.
      content: typeof window !== "undefined"
        ? window.location.href
        : new URL(usePage().url, route("home")).href,
    },
    {
      property: "og:image",
      content:
        props.product.featured_image || "/placeholder.svg",
    },
    {
      property: "product:availability",
      content: props.product.availability || "in stock",
    },
    {
      property: "product:condition",
      content: props.product.feature || "new",
    },
    {
      property: "product:price:amount",
      content: props.product.price || "0.00",
    },
    { property: "product:price:currency", content: "BDT" },
  ],
})
</script>

<style scoped>
/* The saving, stated plainly beside the price. */
.pdp-saving {
  background: #e4f2e4;
  color: #2C5015;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.8rem;
  font-weight: 700;
}

/* ===== PRODUCT TITLE — Figma: HS SB 40/52 Black/700 ===== */
.product-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #3c3834;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .product-title {
    font-size: 40px;
    line-height: 52px;
  }
}

.pdp-rating-text {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #3c3834;
}

/* ===== PRICE — Figma: Poppins Medium 28/32 Warm/700 ===== */
.product-price {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #9a663f;
}

@media (min-width: 768px) {
  .product-price {
    font-size: 28px;
    line-height: 32px;
  }
}

.pdp-stock {
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: #24a148;
}

@media (min-width: 768px) {
  .pdp-stock {
    font-size: 20px;
  }
}

/* Out of stock reads as a warm red across the storefront — light ground,
   solid red text — so it is never mistaken for a disabled-but-loading
   control. Same pair on the cards, the cart drawer and the quick view.

   The exception is this line beside the price: it sits alongside "In stock",
   which is plain green text, so a filled pill here would read as a different
   kind of element rather than the same field with a different value. */
.pdp-stock--soldout {
  color: #c0392b;
}

/* The message and the dead button share one row at every width. The message
   takes the slack and shrinks; the button is sized by its own text so it never
   wraps to a second line. */
/* Sharing the quantity row with the wishlist heart, so it must take the
   slack and never push the heart onto a line of its own. */
.pdp-qty-row.is-soldout {
  flex-wrap: nowrap;
}

.pdp-soldout-row {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 12px 10px 16px;
  background: #fdecec;
  border: 1px solid #f3c9c9;
  border-radius: 12px;
}

.pdp-soldout-text {
  flex: 1;
  min-width: 0;
  color: #c0392b;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 15px;
  line-height: 22px;
}

.pdp-soldout-btn {
  flex: none;
  padding: 8px 16px;
  border: 1px solid #e9a8a8;
  border-radius: 8px;
  background: #f8dcdc;
  color: #c0392b;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .pdp-soldout-row {
    gap: 8px;
    padding: 8px 8px 8px 12px;
  }

  .pdp-soldout-text {
    font-size: 13px;
    line-height: 19px;
  }

  .pdp-soldout-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}

.pdp-stock--preorder {
  color: #f97316;
}

/* ===== DESCRIPTION — HS 16/24 Black/600 ===== */
.pdp-description {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #4d4944;
}

.pdp-description :deep(p) {
  margin-bottom: 8px;
}

/* ===== OPTION LABELS ===== */
.pdp-option-label {
  display: block;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1a1817;
}

/* ===== OPTION PILLS (blouse + attributes) — Figma: h56, r8, px32,
   Manrope SB 20 Green/700; selected 2px Green/500 border + check ===== */
.pdp-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 20px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: white;
  font-family: "Manrope", "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  color: #2c5015;
  cursor: pointer;
  transition: border-color 0.2s ease;
  user-select: none;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .pdp-pill {
    height: 56px;
    padding: 0 32px;
    font-size: 20px;
  }
}

/* ===== BLOUSE OPTION ROW — both pills forced onto ONE row on mobile ===== */
.pdp-blouse-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.pdp-blouse-row .pdp-pill {
  width: 100%;
  height: 40px;
  padding: 0 8px;
  gap: 6px;
  font-size: 14px;
  line-height: 20px;
}

@media (min-width: 768px) {
  .pdp-blouse-row {
    display: flex;
    gap: 16px;
  }

  .pdp-blouse-row .pdp-pill {
    width: auto;
    height: 56px;
    padding: 0 32px;
    font-size: 20px;
    line-height: 28px;
  }
}

.pdp-pill:hover {
  border-color: #3e711d;
}

.pdp-pill--active {
  border: 2px solid #3e711d;
}

.pdp-pill-check {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3e711d;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 9999px;
}

/* ===== QUANTITY STEPPER — Figma: h56, px18, gap 32, r8, #D1CDCA ===== */
.pdp-qty-stepper {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  height: 48px;
  padding: 8px 16px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: white;
}

@media (min-width: 768px) {
  .pdp-qty-stepper {
    gap: 32px;
    height: 56px;
    padding: 8px 18px;
  }
}

/* Stepper row (or the sold-out notice in its place). */
.pdp-qty-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pdp-qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #1a1817;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.pdp-qty-btn:hover:not(:disabled) {
  background-color: #f5f0eb;
}

.pdp-qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pdp-qty-value {
  min-width: 20px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #1a1817;
}

/* ===== ACTION BUTTONS — Figma: h56, r8, Manrope SB 20 ===== */
/*
 * Call, WhatsApp and Share.
 *
 * On a phone these wrapped onto two lines, which left a stray button sitting
 * alone. A three-column grid keeps them on one row; the type, icons and
 * padding shrink to fit rather than the row breaking.
 */
.pdp-contact-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.pdp-contact-row .pdp-btn {
  height: 44px;
  padding: 0 6px;
  gap: 5px;
  font-size: 13px;
  min-width: 0;
}

.pdp-contact-row .pdp-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .pdp-contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  /* Back to the shared button sizing once there is room. */
  .pdp-contact-row .pdp-btn {
    height: 48px;
    padding: 0 20px;
    gap: 8px;
    font-size: 16px;
  }

  .pdp-contact-row .pdp-btn svg {
    width: 22px;
    height: 22px;
  }
}

@media (min-width: 768px) {
  .pdp-contact-row .pdp-btn {
    height: 56px;
    padding: 0 24px;
    font-size: 20px;
  }
}

.pdp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 20px;
  font-family: "Manrope", "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .pdp-btn {
    height: 56px;
    padding: 0 24px;
    font-size: 20px;
  }
}

/* Colours come from Store settings (General); the brand values are the
   fallbacks, so the page looks the same when nothing is configured. */
.pdp-btn--primary {
  background-color: var(--color-cart-bg, #356019);
  color: white;
  border: none;
}

.pdp-btn--primary:hover {
  filter: brightness(0.9);
}

.pdp-btn--outline-green {
  background-color: transparent;
  color: var(--color-order-now-bg, #2c5015);
  border: 1px solid var(--color-order-now-bg, #2c5015);
}

.pdp-btn--outline-green:hover {
  background-color: var(--color-order-now-bg, #2c5015);
  color: white;
}

.pdp-btn--ghost {
  background-color: transparent;
  color: #4d4944;
  border: 1px solid #d1cdca;
}

.pdp-btn--ghost:hover {
  border-color: #3e711d;
  color: #2c5015;
}

.pdp-btn--call:hover {
  border-color: var(--color-call-now-bg, #3e711d);
  color: var(--color-call-now-bg, #2c5015);
}

.pdp-btn--whatsapp:hover {
  border-color: var(--color-whatsapp-bg, #3e711d);
  color: var(--color-whatsapp-bg, #2c5015);
}

.pdp-btn--preorder {
  background-color: #f97316;
  color: white;
  border: none;
}

.pdp-btn--preorder:hover {
  background-color: #ea580c;
}

.pdp-btn--preorder-outline {
  background-color: transparent;
  color: #f97316;
  border: 1px solid #f97316;
}

.pdp-btn--preorder-outline:hover {
  background-color: #fff7ed;
}

/* ===== ACCORDION — Figma: flat rows, Warm/300 bottom border, py24,
   title HS 20/28 Black/900 ===== */
.pd-accordion {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.pd-accordion-item {
  border-bottom: 1px solid #f7e2cb;
  background: transparent;
}

.pd-accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  color: #1a1817;
  text-align: left;
}

@media (min-width: 768px) {
  .pd-accordion-header {
    font-size: 20px;
  }
}

.pd-accordion-header:hover {
  color: #356019;
}

.pd-accordion-chevron {
  flex-shrink: 0;
  color: #1a1817;
  transition: transform 0.25s ease;
}

.pd-accordion-chevron.rotate-180 {
  transform: rotate(180deg);
}

.pd-accordion-body {
  padding: 0 0 24px;
  background: transparent;
  overflow: hidden;
}

/*
 * Height is set from JS, so the panel animates to its real size — no 600px cap
 * to clip longer copy, and no wasted travel on short copy.
 *
 * Padding is part of the transition too. It used to appear the instant the
 * panel opened, which showed as a jolt before the smooth part began.
 */
.pd-accordion-enter-active,
.pd-accordion-leave-active {
  overflow: hidden;
  transition:
    height 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.24s ease,
    padding-bottom 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height;
}

.pd-accordion-enter-from,
.pd-accordion-leave-to {
  height: 0;
  opacity: 0;
  padding-bottom: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pd-accordion-enter-active,
  .pd-accordion-leave-active {
    transition: none;
  }
}

.pd-accordion-text {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
  white-space: pre-line;
}

/* ===== PRODUCT DESCRIPTION ===== */
.product-description {
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
}

.product-description :deep(h1),
.product-description :deep(h2),
.product-description :deep(h3),
.product-description :deep(h4),
.product-description :deep(h5),
.product-description :deep(h6) {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 24px;
  margin-bottom: 10px;
}

.product-description :deep(h2) {
  font-size: 22px;
}

.product-description :deep(h3) {
  font-size: 20px;
}

.product-description :deep(p) {
  margin-bottom: 8px;
}

.product-description :deep(ul),
.product-description :deep(ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

.product-description :deep(li) {
  margin-bottom: 4px;
}

/* ===== DELIVERY CHARGE LIST ===== */
.product-description :deep(.delivery-charge-list) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-description :deep(.delivery-charge-list li) {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 0;
}

.product-description :deep(.delivery-charge-list li::before) {
  content: "•";
  color: #356019;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

.product-description :deep(.taka-highlight) {
  font-weight: 700;
  color: #356019;
  background-color: #f0f7eb;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 15px;
}

/* ===== PRICE FLASH (on blouse toggle) ===== */
.product-price {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
  transform-origin: left center;
}

.price-flash {
  animation: price-flash 0.7s ease-out;
}

@keyframes price-flash {
  0% {
    background-color: rgba(53, 96, 25, 0);
    transform: scale(1);
  }
  25% {
    background-color: rgba(53, 96, 25, 0.18);
    transform: scale(1.08);
  }
  60% {
    background-color: rgba(53, 96, 25, 0.10);
    transform: scale(1.02);
  }
  100% {
    background-color: rgba(53, 96, 25, 0);
    transform: scale(1);
  }
}

/* ===== Figma "Product Details" (💫 Final design) ===== */
.pdp-wrap { padding-top: 40px; padding-bottom: 76px; }
.pdp-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}
@media (min-width: 1024px) {
  .pdp-grid { grid-template-columns: minmax(0, 555fr) minmax(0, 785fr); gap: 20px; }
  .pdp-gallery-col { position: sticky; top: 24px; }
  .pdp-info-col { padding-left: 23px; }
}
@media (min-width: 1280px) {
  .pdp-gallery-col { top: 100px; }
}
.pdp-info-col { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.pdp-gallery-col { min-width: 0; }

/* Name — Hind Siliguri SB 40/52, Black/700 */
.product-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 52px;
  color: #3c3834;
}
.pdp-rating-text {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #3c3834;
}

/* Price — Gold/600 Poppins SB 32/40, ৳ in Hind 32 */
.product-price {
  padding: 0;
  background: none;
  font-family: "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  color: #ba8d22;
}
.product-price-sign { font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; }
.pdp-stock {
  padding: 0;
  border: 0;
  background: none;
  font-family: "Poppins", "Li Ador Noirrit", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #24a148;
}
.pdp-stock--soldout { background: none; color: #c0392b; }
.pdp-stock--preorder { background: none; color: #ea580c; }

.pdp-description,
.pdp-description :deep(*) {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #4d4944;
}

.pdp-option-label {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1a1817;
}

/* Blouse pills — 56px, 32px side padding, r8, Li Ador SB 20/28 */
.pdp-blouse-row { display: flex; flex-wrap: wrap; gap: 16px; }
.pdp-pill {
  position: relative;
  height: 56px;
  padding: 0 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #2c5015;
  cursor: pointer;
  transition: border-color .2s ease;
}
.pdp-pill:hover { border-color: #3e711d; }
.pdp-pill--active { border: 2px solid #3e711d; background: #fff; color: #2c5015; }
.pdp-pill-check {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #3e711d;
  color: #fff;
}
.pdp-pill-check svg { width: 13px; height: 13px; }

/* Quantity — 174 × 56, Black/300 border */
.pdp-qty-stepper {
  width: 174px;
  height: 56px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: #fff;
}
.pdp-qty-btn { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; color: #1a1817; border-radius: 6px; }
.pdp-qty-btn:hover:not(:disabled) { background: #faf5e9; }
.pdp-qty-value { font-family: "Li Ador Noirrit", "Poppins", sans-serif; font-size: 20px; line-height: 28px; color: #1a1817; }

/* Add to cart + Buy now — 56px, 16px apart, Li Ador SB 20/28 */
.pdp-actions { display: flex; gap: 16px; margin-top: 8px; }
.pdp-actions .pdp-btn {
  flex: 1 1 0;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.pdp-btn--primary { background: #1a2110; color: #fff; border: 1px solid #1a2110; }
.pdp-btn--primary:hover { background: #252f17; }
.pdp-btn--outline-green { background: #fff; color: #1a2110; border: 1px solid #1a2110; }
.pdp-btn--outline-green:hover { background: #1a2110; color: #fff; }

/* Call / WhatsApp / Share — outlined 56px chips */
.pdp-contact-row { display: flex; flex-wrap: wrap; gap: 16px; }
.pdp-contact-row .pdp-btn {
  height: 56px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: #fff;
  color: #3c3834;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  transition: border-color .2s ease, background-color .2s ease;
}
.pdp-contact-row .pdp-btn svg { width: 24px; height: 24px; color: #1a1817; }
.pdp-contact-row .pdp-btn:hover { border-color: #d6af51; background: #faf5e9; }

/* Accordion — Li Ador 20/28 headers, 28px chevrons, Gold/100 rules */
.pd-accordion { margin-top: 24px; border: 0; }
.pd-accordion-item { border: 0; border-bottom: 1px solid #efe0bb; padding: 0 0 24px; margin-bottom: 24px; background: none; }
.pd-accordion-item:last-child { margin-bottom: 0; }
.pd-accordion-header {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: none;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #1a1817;
  text-align: left;
}
.pd-accordion-chevron { width: 28px; height: 28px; flex-shrink: 0; color: #1a1817; transition: transform .3s ease; }
.pd-accordion-body { padding-top: 20px; }
.pd-accordion-text,
.pd-accordion-body :deep(p),
.pd-accordion-body :deep(li) {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 32px;
  color: #3c3834;
}

@media (max-width: 767px) {
  .pdp-wrap { padding-top: 20px; padding-bottom: 64px; padding-inline: 20px; }
  .product-title { font-size: 28px; line-height: 36px; }
  .product-price { font-size: 26px; line-height: 34px; }
  .pdp-stock { font-size: 16px; }
  .pdp-pill { height: 48px; padding: 0 18px; font-size: 16px; line-height: 24px; }
  .pdp-actions .pdp-btn { height: 52px; font-size: 18px; }
  .pdp-contact-row { gap: 10px; }
  .pdp-contact-row .pdp-btn { flex: 1 1 auto; justify-content: center; height: 48px; padding: 0 12px; font-size: 16px; }
  .pd-accordion-header { font-size: 18px; }
}
</style>
