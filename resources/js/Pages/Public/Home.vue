<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import HeroSlider from "@/components/HeroSlider.vue"
import ProductCard from "@/components/Product/ProductCard.vue"
import ProductPreviewModal from "@/components/Product/ProductPreviewModel.vue"
import TopCategories from "@/components/Category/TopCategories.vue"
import CustomerReviews from "@/components/Home/CustomerReviews.vue"
import { Link, Head, router } from "@inertiajs/vue3"
import { ref, defineProps, computed, onMounted, onUnmounted } from "vue"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  products: Array,
  categories: Array,
  sliders: Array,
  featureProducts: Array,
  campaigns: Array,
  reviews: {
    type: Array,
    default: () => [],
  },
  tiktokImages: {
    type: Array,
    default: () => [],
  },
})

const activeCampaigns = computed(() =>
  (props.campaigns || []).filter((c) => {
    if (!c.expiry_date) return true
    return dayjs(c.expiry_date).isAfter(dayjs())
  }),
)

const countdownTick = ref(0)
let countdownTimer = null
onMounted(() => {
  countdownTimer = setInterval(() => countdownTick.value++, 1000)
})
onUnmounted(() => clearInterval(countdownTimer))

const campaignTimeLeftMap = computed(() => {
  countdownTick.value // reactive dependency
  const now = dayjs()
  const map = {}
  for (const c of activeCampaigns.value) {
    if (!c.expiry_date) { map[c.id] = null; continue }
    const diff = dayjs(c.expiry_date).diff(now)
    if (diff <= 0) { map[c.id] = "শেষ হয়েছে"; continue }
    const d = dayjs.duration(diff)
    const days = Math.floor(d.asDays())
    if (days > 0) {
      map[c.id] = `${days}d ${d.hours()}h ${d.minutes()}m`
    } else {
      map[c.id] = `${String(d.hours()).padStart(2, "0")}:${String(d.minutes()).padStart(2, "0")}:${String(d.seconds()).padStart(2, "0")}`
    }
  }
  return map
})

function getCampaignTimeLeft(campaignId) {
  return campaignTimeLeftMap.value[campaignId]
}

function getCampaignDiscountedPrice(product, discount) {
  let price = parseFloat(product.price)
  if (!discount) return price
  if (typeof discount === "string" && discount.includes("%")) {
    price -= (price * parseFloat(discount)) / 100
  } else if (!isNaN(parseFloat(discount))) {
    price -= parseFloat(discount)
  }
  return Math.max(0, price)
}

const isModalOpen = ref(false)
const selectedProduct = ref(null)

// Function to open modal with selected product
const openPreview = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

// Function to close modal
const closePreview = () => {
  isModalOpen.value = false
}
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>
  <AppLayout>
    <HeroSlider :sliders="sliders" />

    <!-- Everything between the gallery and the reviews is built in the admin:
         Content › Pages › Home -->
    <PageBlocks :blocks="blocks" :openPreview="openPreview" />

    <!-- Customer Reviews Section -->
    <CustomerReviews :reviews="reviews" />

    <!-- Campaign Sections -->
    <template v-if="activeCampaigns.length > 0">
      <section
        v-for="campaign in activeCampaigns"
        :key="campaign.id"
        v-show="campaign.products && campaign.products.length > 0"
        class="campaign-section py-14"
      >
        <div class="container">
          <!-- Campaign Header -->
          <div class="campaign-header mb-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span class="campaign-badge">{{ texts.t2 }}</span>
                <h2 class="campaign-title mt-2">{{ campaign.name }}</h2>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div
                  v-if="getCampaignTimeLeft(campaign.id)"
                  class="campaign-countdown"
                >
                  <span class="campaign-countdown-label">{{ texts.t3 }}</span>
                  <span class="campaign-countdown-time">{{
                    getCampaignTimeLeft(campaign.id)
                  }}</span>
                </div>
              </div>
            </div>
            <div class="campaign-divider mt-4"></div>
          </div>

          <!-- Campaign Products Grid -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5"
          >
            <div
              v-for="product in campaign.products"
              :key="product.id"
              class="campaign-card"
              @click="router.visit(`/product/${product.slug}`)"
            >
              <!-- Discount Badge -->
              <div class="campaign-card-image-wrap group/img">
                <img
                  :src="product.featured_image"
                  :alt="product.product_name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  loading="lazy"
                />
                <div class="campaign-discount-badge">{{ texts.t4 }}</div>
                <button
                  @click.stop="openPreview(product)"
                  class="campaign-quick-preview hidden md:flex"
                >{{ texts.t5 }}</button>
              </div>

              <!-- Product Info -->
              <div class="campaign-card-info">
                <h3 class="campaign-card-name">{{ product.product_name }}</h3>
                <div class="campaign-card-price-row">
                  <span class="campaign-card-original"
                    >{{ product.price }}৳</span
                  >
                  <span class="campaign-card-discounted">
                    {{
                      getCampaignDiscountedPrice(product, campaign.discount)
                    }}৳
                  </span>
                </div>
              </div>

              <!-- Order Button -->
              <div class="campaign-card-btn-wrap">
                <Link
                  :href="`/product/${product.slug}`"
                  @click.stop
                  class="campaign-order-btn"
                >{{ texts.t6 }}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </AppLayout>
  <ProductPreviewModal
    :isOpen="isModalOpen"
    :product="selectedProduct"
    @close="isModalOpen = false"
  />
</template>

<style scoped>
@media (max-width: 767px) {
  .shop-now-title {
    font-size: 22px;
    line-height: 35px;
    width: 270px;
    text-align: -webkit-center;
    margin-left: auto;
    margin-right: auto;
  }
}

/* ── Campaign Section ── */
.campaign-section {
  background: linear-gradient(135deg, #fffaf4 0%, #fff5e9 100%);
  border-top: 1px solid #f0e0cc;
  border-bottom: 1px solid #f0e0cc;
}

.campaign-badge {
  display: inline-block;
  background: var(--color-theme, #c0392b);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}

.campaign-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .campaign-title {
    font-size: 36px;
  }
}

.campaign-countdown {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1a1a1a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
}

.campaign-countdown-label {
  opacity: 0.7;
  font-weight: 400;
  font-size: 12px;
}

.campaign-countdown-time {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.campaign-view-all {
  color: var(--color-theme, #c0392b);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.campaign-view-all:hover {
  opacity: 0.75;
}

.campaign-divider {
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-theme, #c0392b) 0%,
    transparent 100%
  );
  border-radius: 2px;
  opacity: 0.35;
}

/* Campaign product card */
.campaign-card {
  background: #fff;
  border: 1px solid #f0e0cc;
  border-radius: 16px;
  padding: 10px 10px 14px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.25s;
}

.campaign-card:hover {
  border-color: #e9c39c;
  box-shadow: 0 6px 20px rgba(139, 80, 20, 0.12);
  transform: translateY(-2px);
}

.campaign-card-image-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 10px;
  background: #f5ece2;
}

.campaign-discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-theme, #c0392b);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  z-index: 5;
}


.campaign-quick-preview {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 0 0 10px 10px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 5;
}

.campaign-card-image-wrap:hover .campaign-quick-preview {
  opacity: 1;
  transform: translateY(0);
}

.campaign-card-info {
  padding: 10px 4px 0;
  flex-grow: 1;
}

.campaign-card-name {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  text-decoration: underline transparent;
  transition: text-decoration-color 0.2s;
}

.campaign-card:hover .campaign-card-name {
  text-decoration-color: #1a1a1a;
}

@media (min-width: 768px) {
  .campaign-card-name {
    font-size: 16px;
  }
}

.campaign-card-price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.campaign-card-original {
  font-size: 12px;
  color: #aaa;
  text-decoration: line-through;
}

.campaign-card-discounted {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-theme, #c0392b);
}

@media (min-width: 768px) {
  .campaign-card-discounted {
    font-size: 17px;
  }
}

.campaign-card-btn-wrap {
  padding: 0 4px;
  margin-top: 10px;
}

.campaign-order-btn {
  display: block;
  text-align: center;
  width: 100%;
  padding: 9px 12px;
  background: var(--color-theme, #c0392b);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.campaign-order-btn:hover {
  opacity: 0.85;
}

@media (min-width: 768px) {
  .campaign-order-btn {
    padding: 11px 14px;
    font-size: 14px;
  }
}
</style>
