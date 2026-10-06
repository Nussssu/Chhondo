<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import HeroSlider from "@/components/HeroSlider.vue"
import ProductPreviewModal from "@/components/Product/ProductPreviewModel.vue"
import CustomerReviews from "@/components/Home/CustomerReviews.vue"
import { Link, Head, router } from "@inertiajs/vue3"
import { rich, plain, on, shown } from "@/utils/cms"
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

const blocksOfType = (type) => computed(() =>
  (props.blocks || []).filter((block) => block.type === type),
)

// Product sections and the banner are widgets in Content › Pages › Home —
// their headings, products and links all come from there.
const productBlocks = blocksOfType("product_section")
const ctaBlocks = blocksOfType("cta_banner")
const videoBlocks = blocksOfType("video_strip")
const otherBlocks = computed(() =>
  (props.blocks || []).filter((block) =>
    !["product_section", "cta_banner", "video_strip"].includes(block.type),
  ),
)

const visualProducts = computed(() => {
  const configured = productBlocks.value.flatMap((block) => block.products || [])
  return configured.length ? configured : (props.products || [])
})

/*
 * Everything below is managed in Content › Pages › Home. Each section has a
 * Show switch; lists can be added to, reordered and hidden row by row.
 */
const t = computed(() => props.texts || {})

const heroOverlay = computed(() => ({
  eyebrow: on(t.value.hero_eyebrow_show) ? t.value.hero_eyebrow : null,
  title: t.value.hero_title || "",
  ctaLabel: on(t.value.hero_cta_show) ? t.value.hero_cta_label : null,
  ctaUrl: t.value.hero_cta_url || "/shop",
}))

// A photo without its own link opens the product in the same position.
const imageStrip = computed(() =>
  on(t.value.gallery_show)
    ? shown(t.value.gallery)
        .filter((row) => row.image)
        .map((row, index) => {
          const product = visualProducts.value[index]
          return {
            id: `gallery-${index}`,
            src: row.image,
            href: row.url || (product?.slug ? `/product/${product.slug}` : "/shop"),
            alt: product?.product_name || "Chhondo saree gallery",
          }
        })
    : [],
)

const storyDarkImages = computed(() =>
  on(t.value.story_dark_show)
    ? [t.value.story_dark_image_1, t.value.story_dark_image_2]
        .filter(Boolean)
        .map((src, i) => ({ id: `story-dark-${i}`, src, alt: "Chhondo saree story", href: t.value.story_dark_button_url || "/shop" }))
    : [],
)

const storyLightImages = computed(() =>
  on(t.value.story_light_show)
    ? [t.value.story_light_image_1, t.value.story_light_image_2]
        .filter(Boolean)
        .map((src, i) => ({ id: `story-light-${i}`, src, alt: "Chhondo saree tradition", href: t.value.story_light_link || "/shop" }))
    : [],
)

// A tile without its own link opens the category in the same position.
const editorialCategories = computed(() =>
  on(t.value.editorial_show)
    ? shown(t.value.editorial_cards).map((card, index) => {
        const category = (props.categories || [])[index]
        return {
          id: `editorial-${index}`,
          image: card.image,
          name: card.title,
          subtitle: card.subtitle,
          href: card.url || (category?.slug ? `/product-category/${category.slug}` : "/shop"),
        }
      })
    : [],
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
    <title>{{ plain(t.tab_title) }}</title>
  </Head>
  <AppLayout>
    <HeroSlider
      v-if="on(t.hero_show)"
      :sliders="sliders"
      :desktop-image="t.hero_image_desktop"
      :mobile-image="t.hero_image_mobile"
      :overlay="heroOverlay"
    />

    <!-- Everything between the gallery and the reviews is built in the admin:
         Content › Pages › Home -->
    <PageBlocks :blocks="productBlocks" :openPreview="openPreview" />

    <!-- Figma gallery strip: five rounded frames, the even ones taller,
         centred and bleeding off both edges. -->
    <section v-if="imageStrip.length" class="chhondo-image-strip" aria-label="Chhondo collection">
      <span class="chhondo-watermark chhondo-watermark--right chhondo-watermark--strip" aria-hidden="true"></span>
      <div class="chhondo-image-strip__track">
        <Link
          v-for="(item, index) in imageStrip"
          :key="item.id"
          :href="item.href"
          class="chhondo-image-strip__item"
          :class="{ 'is-tall': index % 2 === 1 }"
        >
          <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
        </Link>
        <!-- Phones: a second run of the same photos, so the marquee loops
             without a seam. Hidden on wider screens. -->
        <Link
          v-for="(item, index) in imageStrip"
          :key="`clone-${item.id}`"
          :href="item.href"
          class="chhondo-image-strip__item chhondo-image-strip__item--clone"
          :class="{ 'is-tall': index % 2 === 1 }"
          aria-hidden="true"
          tabindex="-1"
        >
          <img :src="item.src" alt="" loading="lazy" decoding="async" />
        </Link>
      </div>
    </section>

    <PageBlocks :blocks="ctaBlocks" :openPreview="openPreview" />
    <PageBlocks :blocks="videoBlocks" :openPreview="openPreview" />

    <!-- Figma "আপনার সাজে মিশে থাক ছন্দ" -->
    <section v-if="storyDarkImages.length" class="chhondo-story chhondo-story--dark">
      <div class="container chhondo-story__grid">
        <div class="chhondo-story__copy">
          <div class="chhondo-story__text">
            <h2 v-html="rich(t.story_dark_title)"></h2>
            <p v-if="on(t.story_dark_text_show)" v-html="rich(t.story_dark_text)"></p>
          </div>
          <Link v-if="on(t.story_dark_button_show) && t.story_dark_button_label" :href="t.story_dark_button_url || '/shop'" class="chhondo-ghost-button">
            {{ t.story_dark_button_label }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        </div>
        <div class="chhondo-story__media chhondo-story__media--pair">
          <Link v-for="item in storyDarkImages" :key="item.id" :href="item.href">
            <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
          </Link>
        </div>
      </div>
    </section>

    <!-- Figma "ঐতিহ্য, যা বয়ে চলে আপনারই সঙ্গে" -->
    <section v-if="storyLightImages.length" class="chhondo-story chhondo-story--light">
      <span class="chhondo-watermark chhondo-watermark--right" aria-hidden="true"></span>
      <div class="container chhondo-story__grid chhondo-story__grid--reverse">
        <div class="chhondo-story__media chhondo-story__media--layered">
          <Link
            v-for="(item, i) in storyLightImages"
            :key="item.id"
            :href="item.href"
            class="chhondo-story__frame"
            :class="i === 0 ? 'chhondo-story__frame--back' : 'chhondo-story__frame--front'"
          >
            <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
          </Link>
        </div>
        <div class="chhondo-story__copy chhondo-story__copy--light">
          <div class="chhondo-story__text">
            <h2 v-html="rich(t.story_light_title)"></h2>
            <p v-if="on(t.story_light_text_show)" v-html="rich(t.story_light_text)"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Reviews Section -->
    <CustomerReviews v-if="on(t.reviews_show)" :reviews="reviews" :title="t.reviews_title" />

    <!-- Figma "খুঁজে নিন আপনার নিজস্ব 'ছন্দ'": one tall tile and two stacked -->
    <section v-if="editorialCategories.length" class="chhondo-editorial">
      <span class="chhondo-watermark chhondo-watermark--left" aria-hidden="true"></span>
      <div class="container">
        <div class="chhondo-section-heading">
          <h2 v-html="rich(t.editorial_title)"></h2>
          <p v-if="on(t.editorial_text_show)" v-html="rich(t.editorial_text, { breaks: 'desktop' })"></p>
        </div>
        <div class="chhondo-editorial__grid" :class="`chhondo-editorial__grid--${editorialCategories.length}`">
          <Link
            v-for="(category, index) in editorialCategories"
            :key="category.id"
            :href="category.href"
            class="chhondo-editorial__card"
            :class="`chhondo-editorial__card--${index + 1}`"
          >
            <img :src="category.image || '/placeholder.svg'" :alt="category.name" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
            <span class="chhondo-editorial__bar">
              <span class="chhondo-editorial__copy">
                <span class="chhondo-editorial__name">{{ category.name }}</span>
                <span v-if="category.subtitle" class="chhondo-editorial__sub">{{ category.subtitle }}</span>
              </span>
              <span v-if="on(t.editorial_explore_show)" class="chhondo-editorial__explore">
                {{ t.editorial_explore }}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>

    <PageBlocks :blocks="otherBlocks" :openPreview="openPreview" />

    <!-- Campaign Sections -->
    <template v-if="on(t.campaign_show) && activeCampaigns.length > 0">
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
                  :src="product.featured_image || '/placeholder.svg'"
                  :alt="product.product_name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="500"
                  @error="$event.target.src = '/placeholder.svg'"
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
.chhondo-accent { color: #cc9b25; }

/* ── Gallery strip — Figma: 417×522 / 479×599 frames, r16, 24px apart ── */
.chhondo-image-strip {
  width: 100%;
  overflow: hidden;
  padding-bottom: 132px;
}
.chhondo-image-strip__track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: max-content;
  margin-inline: 50%;
  transform: translateX(-50%);
}
.chhondo-image-strip__item {
  display: block;
  flex: 0 0 auto;
  width: clamp(150px, 21.7vw, 417px);
  aspect-ratio: 417 / 522;
  border-radius: 16px;
  overflow: hidden;
}
.chhondo-image-strip__item--clone { display: none; }
.chhondo-image-strip__item:nth-child(even) {
  width: clamp(172px, 24.95vw, 479px);
  aspect-ratio: 479 / 599;
}
.chhondo-image-strip img,
.chhondo-story img,
.chhondo-editorial img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s ease; }
.chhondo-image-strip__item:hover img,
.chhondo-story__media a:hover img,
.chhondo-editorial__card:hover img { transform: scale(1.035); }

/* ── Story sections ── */
.chhondo-story { position: relative; overflow: hidden; padding: 128px 0; }
.chhondo-story--dark { background: #1a2110; color: #fff; }
.chhondo-story--light { background: #fff; color: #1a1817; padding: 132px 0; }
.chhondo-story__grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center; }
.chhondo-story__copy { display: flex; flex-direction: column; gap: 88px; padding-right: 192px; }
.chhondo-story__copy--light { padding: 0 0 0 24px; }
.chhondo-story__text { display: flex; flex-direction: column; gap: 24px; }
.chhondo-story h2,
.chhondo-section-heading h2 {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
}
.chhondo-story__text p {
  margin: 0;
  font: 400 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
}
.chhondo-story--light .chhondo-story__text p { color: #3c3834; }

/* Outline button on the dark band — white 1px, r8, Li Ador SB 20/28 */
.chhondo-ghost-button {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #fff;
  border-radius: 8px;
  color: #fff;
  font: 600 20px/28px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  transition: background-color .2s ease, color .2s ease, transform .2s ease;
}
.chhondo-ghost-button:hover { background: #fff; color: #1a2110; transform: translateY(-2px); }

/* Pair — 325×349 bottom-aligned beside 325×474; leaf corners (TL/BR 5, TR/BL 70) */
.chhondo-story__media--pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: end; }
.chhondo-story__media--pair a {
  display: block;
  overflow: hidden;
  border-radius: 5.3px 69.6px 5.3px 69.6px;
}
.chhondo-story__media--pair a:first-child { aspect-ratio: 325 / 349; }
.chhondo-story__media--pair a:last-child { aspect-ratio: 325 / 474; order: 2; }

/* Layered frames — gold 1.5px outline, 13px white mat, leaf corners */
.chhondo-story__media--layered { position: relative; aspect-ratio: 670 / 623; }
.chhondo-story__frame {
  position: absolute;
  display: block;
  background: #fff;
  border: 1.5px solid #d6af51;
}
.chhondo-story__frame img { border-radius: inherit; }
.chhondo-story__frame--back {
  left: 1.6%;
  top: 0;
  width: 62.2%;
  height: 100%;
  padding: 13px;
  border-radius: 12px 88px 12px 88px;
}
.chhondo-story__frame--back img { border-radius: 6px 74px 6px 74px; }
.chhondo-story__frame--front {
  left: 54.2%;
  top: 22%;
  width: 44.5%;
  height: 71.4%;
  padding: 16px;
  border-radius: 8px 64px 8px 64px;
}
.chhondo-story__frame--front img { border-radius: 8px 48px 8px 48px; }

/* Oversized Bengali "ছন্দ" outline watermark (Figma): transparent fill, hairline
   light-gray stroke, extremely subtle, cropped by the section edges and kept
   behind all content. Artwork is the 835x868 Figma vector export; the offsets
   below reproduce the Figma crop (527px visible right / 423px visible left). */
.chhondo-watermark {
  position: absolute;
  z-index: 0;
  width: 835px;
  height: 868px;
  background: none;
  font-weight: 200;
  pointer-events: none;
}
.chhondo-watermark--right { right: -445px; top: -55px; }
.chhondo-watermark--left { left: -549px; top: -69px; }
.chhondo-watermark--strip { top: -140px; }
.chhondo-image-strip { position: relative; }
.chhondo-image-strip__track { position: relative; z-index: 1; }

/* ── Categories — Figma "খুঁজে নিন আপনার নিজস্ব 'ছন্দ'" ── */
.chhondo-editorial { position: relative; overflow: hidden; padding: 132px 0; background: #fff; }
.chhondo-editorial .container { position: relative; z-index: 1; }
.chhondo-section-heading { display: flex; flex-direction: column; gap: 24px; max-width: 688px; margin-bottom: 48px; }
.chhondo-section-heading h2 { color: #1a1817; }
.chhondo-section-heading p { margin: 0; color: #3c3834; font: 400 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif; }

.chhondo-editorial__grid {
  display: grid;
  grid-template-columns: 785fr 555fr;
  grid-template-rows: repeat(2, 282px);
  gap: 24px 20px;
}
.chhondo-editorial__card {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 16px;
}
.chhondo-editorial__card--1 { grid-row: 1 / 3; border-radius: 90px 16px 16px 0; }
.chhondo-editorial__card--2 { border-radius: 16px 90px 16px 16px; }
.chhondo-editorial__card--3 { border-radius: 16px 16px 24px 16px; }
.chhondo-editorial__grid--1 { grid-template-columns: 1fr; }
.chhondo-editorial__grid--2 .chhondo-editorial__card--2 { grid-row: 1 / 3; }

/* Bottom fade into Olive/500 (63% → 97%) */
.chhondo-editorial__card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(37, 47, 23, 0) 63%, #252f17 97%);
  pointer-events: none;
}
.chhondo-editorial__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
}
.chhondo-editorial__card--1 .chhondo-editorial__bar { align-items: flex-end; }
.chhondo-editorial__copy { display: flex; flex-direction: column; min-width: 0; }
.chhondo-editorial__name { color: #fff; font: 600 28px/36px "Li Ador Noirrit", "Hind Siliguri", sans-serif; }
.chhondo-editorial__sub { color: #d1cdca; font: 400 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif; }
.chhondo-editorial__explore {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  color: #fff;
  font: 600 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  transition: background-color .2s ease;
}
.chhondo-editorial__card:hover .chhondo-editorial__explore { background: rgba(255, 255, 255, .16); }

@media (max-width: 1279px) {
  .chhondo-story h2,
  .chhondo-section-heading h2 { font-size: 44px; line-height: 56px; }
  .chhondo-story__copy { padding-right: 48px; }
  .chhondo-watermark { width: 620px; height: 644px; background-size: 620px 644px; }
  .chhondo-watermark--right { right: -330px; top: -40px; }
  .chhondo-watermark--left { left: -408px; top: -50px; }
}

/* Figma phone: stacked, 20px gutters, 32/40 titles */
@media (max-width: 767px) {
  /* Phones: the photos drift past in a continuous marquee (paused while
     touched), alternating short and tall frames as on desktop. */
  .chhondo-image-strip {
    padding-bottom: 48px;
    overflow: hidden;
  }
  .chhondo-image-strip__track {
    gap: 12px;
    margin-inline: 0;
    padding-inline: 0;
    transform: none;
    justify-content: flex-start;
    animation: chhondo-strip-marquee 36s linear infinite;
  }
  .chhondo-image-strip:hover .chhondo-image-strip__track,
  .chhondo-image-strip:active .chhondo-image-strip__track { animation-play-state: paused; }
  .chhondo-image-strip__item--clone { display: block; }
  .chhondo-image-strip__item,
  .chhondo-image-strip__item:nth-child(even) {
    width: 240px;
    aspect-ratio: 417 / 522;
    flex: 0 0 auto;
    border-radius: 16px;
  }
  .chhondo-image-strip__item.is-tall {
    width: 276px;
    aspect-ratio: 479 / 599;
  }
  @keyframes chhondo-strip-marquee {
    from { transform: translateX(0); }
    /* One full run of photos plus one gap: the clones then sit exactly
       where the originals started. */
    to { transform: translateX(calc(-50% - 6px)); }
  }
  @media (prefers-reduced-motion: reduce) {
    .chhondo-image-strip { overflow-x: auto; }
    .chhondo-image-strip__track { animation: none; }
  }
  .chhondo-story,
  .chhondo-story--light { padding: 40px 0 48px; }
  .chhondo-story .container,
  .chhondo-editorial .container { padding-inline: 20px; }
  .chhondo-story__grid,
  .chhondo-story__grid--reverse { grid-template-columns: 1fr; gap: 48px; }
  .chhondo-story__grid--reverse .chhondo-story__media { order: 2; }
  .chhondo-story__copy,
  .chhondo-story__copy--light { gap: 40px; padding: 0; }
  .chhondo-story h2,
  .chhondo-section-heading h2 { font-size: 32px; line-height: 40px; }
  .chhondo-ghost-button { height: 44px; font-size: 16px; line-height: 24px; }
  .chhondo-story__media--pair { gap: 10px; }
  .chhondo-story__media--pair a { border-radius: 4px 32px 4px 32px; }
  .chhondo-story__frame--back { padding: 7px; border-radius: 8px 48px 8px 48px; }
  .chhondo-story__frame--back img { border-radius: 4px 40px 4px 40px; }
  .chhondo-story__frame--front { padding: 8px; border-radius: 6px 36px 6px 36px; }
  .chhondo-story__frame--front img { border-radius: 4px 28px 4px 28px; }
  /* Keep the outline watermark visible but scaled + cropped on phones. */
  .chhondo-watermark { width: 360px; height: 374px; background-size: 360px 374px; opacity: .9; }
  .chhondo-watermark--right { right: -195px; top: -30px; }
  .chhondo-watermark--left { left: -238px; top: -36px; }
  .chhondo-watermark--strip { top: -80px; }
  .chhondo-editorial { padding: 48px 0; }
  /* Tighten only the landing's final section into the footer on phones:
     :last-of-type keeps mid-page rhythm untouched — this matches only when
     the section actually closes the page (campaigns render last). */
  .campaign-section:last-of-type,
  .chhondo-section-heading { align-items: center; gap: 16px; margin-bottom: 32px; text-align: center; }
  .chhondo-editorial__grid,
  .chhondo-editorial__grid--2 { grid-template-columns: 1fr 1fr; grid-template-rows: 244px 280px; gap: 12px; }
  .chhondo-editorial__card--1,
  .chhondo-editorial__grid--2 .chhondo-editorial__card--2 { grid-row: auto; grid-column: 1 / -1; border-radius: 48px 16px 16px 0; }
  .chhondo-editorial__grid--2 .chhondo-editorial__card--2 { border-radius: 16px; }
  .chhondo-editorial__card--2,
  .chhondo-editorial__card--3 { border-radius: 8px; }
  .chhondo-editorial__card--2 .chhondo-editorial__bar,
  .chhondo-editorial__card--3 .chhondo-editorial__bar { flex-direction: column; align-items: flex-start; padding: 16px; gap: 12px; }
  .chhondo-editorial__bar { padding: 24px; }
  .chhondo-editorial__name { font-size: 20px; line-height: 28px; }
  .chhondo-editorial__sub { font-size: 14px; line-height: 20px; }
  .chhondo-editorial__explore { height: 40px; padding: 0 12px; white-space: nowrap; background: rgba(255, 255, 255, .16); }
  .chhondo-editorial__card--2 .chhondo-editorial__explore,
  .chhondo-editorial__card--3 .chhondo-editorial__explore { height: 36px; font-size: 14px; }
}

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
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
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
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
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
