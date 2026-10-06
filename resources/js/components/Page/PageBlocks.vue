<script setup>
/**
 * Renders the widgets built in the admin (Content › Pages).
 *
 * Static widgets — headings, copy, images, galleries, video, raw HTML — render
 * as written. Product sections arrive with their products already resolved by
 * the server, so a section pointed at "new arrivals" or a category stays
 * current without the page being re-saved.
 */
import { computed } from "vue"
import { Link } from "@inertiajs/vue3"
import CollectionCard from "@/components/Product/CollectionCard.vue"
import { videoEmbedUrl } from "@/utils/videoEmbed"

const props = defineProps({
  blocks: { type: Array, default: () => [] },
  // Passed through to the product cards so quick view keeps working.
  openPreview: { type: Function, default: null },
})

const items = computed(() => props.blocks ?? [])

function embed(url) {
  if (!url) return null
  const host = /drive\.google\.com/i.test(url) ? "Gdrive" : "Youtube"
  return videoEmbedUrl(host, url, { autoplay: false })
}

// A pasted file URL (mp4/webm) plays natively; anything else is an embed.
function isFileVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "")
}

/**
 * Figma section titles end in gold: the last word of a one-line title
 * ("শারদীয় <gold>কালেকশন</gold>"), or everything after the first word of the
 * last line of a two-line one ("হোক <gold>উৎসবের আনন্দ</gold>").
 */
function accentTitle(value) {
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const lines = String(value ?? '').trim().split('\n')
  const last = lines.pop().trim()
  const words = last.split(/\s+/)
  const cut = lines.length ? 1 : Math.max(words.length - 1, 0)
  const plain = words.slice(0, cut).join(' ')
  const gold = words.slice(cut).join(' ')
  const tail = (plain ? esc(plain) + ' ' : '') + (gold ? `<span class="pb-accent">${esc(gold)}</span>` : '')
  return [...lines.map(esc), tail].join('<br />')
}

/** The strip always fills four columns, repeating if fewer were added. */
function stripItems(block) {
  const items = (block.items ?? []).filter((i) => i.url)
  if (!items.length) return []

  const out = []
  for (let i = 0; i < 4; i++) out.push(items[i % items.length])
  return out
}

function gridClass(block) {
  const columns = Number(block.columns) || 4
  return {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-4",
    5: "sm:grid-cols-3 md:grid-cols-5",
    6: "sm:grid-cols-3 md:grid-cols-6",
  }[columns] ?? "sm:grid-cols-2 md:grid-cols-4"
}
</script>

<template>
  <template v-for="(block, index) in items" :key="block.id ?? index">
    <!-- Heading -->
    <section v-if="block.type === 'heading'" class="pb-block pb-block--prose pb-block--heading">
      <div class="container">
        <component
          :is="`h${block.level || 2}`"
          class="pb-heading"
          :class="`pb-heading--h${block.level || 2}`"
        >
          {{ block.text }}
        </component>
      </div>
    </section>

    <!-- Rich text -->
    <section v-else-if="block.type === 'text'" class="pb-block pb-block--prose">
      <div class="container">
        <div class="pb-prose" v-html="block.html"></div>
      </div>
    </section>

    <!-- Image -->
    <figure v-else-if="block.type === 'image'" class="pb-block pb-figure">
      <div class="container">
        <img :src="block.url" :alt="block.alt || ''" loading="lazy" />
        <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
      </div>
    </figure>

    <!-- Image + text -->
    <section v-else-if="block.type === 'image_text'" class="pb-block">
      <div class="container pb-split" :class="{ 'pb-split--right': block.position === 'right' }">
        <div v-if="block.url" class="pb-split-media">
          <img :src="block.url" :alt="block.alt || ''" loading="lazy" />
        </div>
        <div class="pb-prose" v-html="block.html"></div>
      </div>
    </section>

    <!-- Video -->
    <section v-else-if="block.type === 'video'" class="pb-block">
      <div class="container">
        <h2 v-if="block.title" class="pb-section-title">{{ block.title }}</h2>
        <div class="pb-video">
          <video v-if="isFileVideo(block.video_url)" :src="block.video_url" controls playsinline></video>
          <iframe
            v-else-if="embed(block.video_url)"
            :src="embed(block.video_url)"
            title="Video"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <p v-if="block.caption" class="pb-caption">{{ block.caption }}</p>
      </div>
    </section>

    <!-- Full-width video strip (the row of short clips) -->
    <section v-else-if="block.type === 'video_strip'" class="pb-video-strip">
      <h2 v-if="block.title" class="pb-section-title pb-strip-title">{{ block.title }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-0">
        <div
          v-for="(item, i) in stripItems(block)"
          :key="i"
          class="pb-strip-item"
        >
          <video
            v-if="isFileVideo(item.url)"
            :src="item.url"
            :poster="item.poster || undefined"
            class="w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          ></video>
          <iframe
            v-else-if="embed(item.url)"
            :src="embed(item.url)"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Image gallery -->
    <section v-else-if="block.type === 'gallery'" class="pb-block">
      <div class="container">
        <h2 v-if="block.title" class="pb-section-title">{{ block.title }}</h2>
        <div class="pb-gallery" :class="gridClass(block)">
          <img
            v-for="(item, i) in block.items || []"
            :key="i"
            :src="item.url"
            :alt="item.alt || ''"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Call to action band -->
    <section v-else-if="block.type === 'cta_banner'" class="pb-block pb-cta-band">
      <div class="container text-center">
        <div>
          <h2 v-if="block.title" class="pb-cta-title" v-html="accentTitle(block.title)"></h2>
          <p v-if="block.text" class="pb-section-sub">{{ block.text }}</p>
        </div>
        <Link
          v-if="block.button_label"
          :href="block.button_url || '/shop'"
          class="pb-cta-band-btn"
        >
          {{ block.button_label }}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </section>

    <!-- Feature cards -->
    <section v-else-if="block.type === 'feature_cards'" class="pb-block pb-cards">
      <div class="container">
        <h2 v-if="block.title" class="pb-section-title text-center">{{ block.title }}</h2>
        <div class="pb-cards-grid" :class="{ 'has-title': block.title }">
          <div v-for="(card, i) in block.items || []" :key="i" class="pb-card">
            <h3 v-if="card.title" class="pb-card-title">{{ card.title }}</h3>
            <p v-if="card.text" class="pb-card-text">{{ card.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product section — repeatable; each one has its own source -->
    <section v-else-if="block.type === 'product_section'" class="pb-block pb-products">
      <!-- Figma: the outlined logo mark at 10%, bleeding off the page edge -->
      <span class="pb-watermark pb-watermark--left" aria-hidden="true"></span>
      <span class="pb-watermark pb-watermark--right" aria-hidden="true"></span>
      <div class="container">
        <div v-if="block.title || block.subtitle || (block.cta_label && block.cta_url)" class="pb-products-head">
          <div class="pb-products-copy">
            <h2 v-if="block.title" class="pb-section-title" v-html="accentTitle(block.title)"></h2>
            <p v-if="block.subtitle" class="pb-section-sub">{{ block.subtitle }}</p>
          </div>
          <Link v-if="block.cta_label && block.cta_url" :href="block.cta_url" class="pb-cta-btn">
            {{ block.cta_label }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        </div>

        <div class="pb-products-grid grid grid-cols-2" :class="gridClass(block)">
          <CollectionCard
            v-for="product in block.products || []"
            :key="product.id"
            :product="product"
            :openPreview="openPreview"
          />
        </div>

      </div>
    </section>

    <!-- Raw HTML -->
    <section v-else-if="block.type === 'html'" class="pb-block">
      <div class="container">
        <div class="pb-prose" v-html="block.code"></div>
      </div>
    </section>
  </template>
</template>

<style scoped>
.pb-block {
  padding: 32px 0;
}

.pb-block:first-child {
  padding-top: 40px;
}

/*
 * Headings and body copy are one continuous document, not a stack of
 * sections. Each was carrying a full section's padding, so a heading sat 64px
 * from the paragraph it introduces — on a policy page of twenty blocks that
 * read as huge gaps. They flow tightly here; the standalone sections below
 * (banners, product grids, galleries) keep their original spacing.
 */
.pb-block--prose {
  padding: 0;
}

/* Space belongs above a heading, so it groups with the text that follows. */
.pb-block--heading {
  padding-top: 28px;
}

.pb-block--prose:first-child,
.pb-block--heading:first-child {
  padding-top: 40px;
}

.pb-block--prose:last-child {
  padding-bottom: 40px;
}

/* A heading straight after body copy still needs room; two headings in a row
   do not. */
.pb-block--heading + .pb-block--heading {
  padding-top: 8px;
}

/* A little air under a heading, so it is not glued to its first line. */
.pb-block--heading .pb-heading {
  margin-bottom: 10px;
}

/* The paragraph rhythm already spaces the copy; the last one would otherwise
   add its margin on top of the block's own spacing. */
.pb-prose :deep(p:last-child),
.pb-prose :deep(ul:last-child),
.pb-prose :deep(ol:last-child) {
  margin-bottom: 0;
}

/* ===== Headings ===== */
.pb-heading {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-weight: 600;
  color: #3e3c3a;
}

.pb-heading--h1 {
  font-family: "Sora", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 30px;
  line-height: 42px;
}

.pb-heading--h2 {
  font-size: 24px;
  line-height: 34px;
}

.pb-heading--h3 {
  font-size: 19px;
  line-height: 28px;
}

@media (min-width: 768px) {
  .pb-heading--h1 { font-size: 42px; line-height: 56px; }
  .pb-heading--h2 { font-size: 30px; line-height: 42px; }
}

.pb-section-title {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  color: #1a1817;
  text-align: center;
}

.pb-section-sub {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  line-height: 26px;
  color: #6d6560;
  text-align: center;
}

/* ===== Prose ===== */
.pb-prose {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 30px;
  color: #4a423b;
}

.pb-prose :deep(p) { margin-bottom: 16px; }
.pb-prose :deep(h2) { font-size: 22px; font-weight: 600; color: #3e3c3a; margin: 20px 0 10px; }
.pb-prose :deep(h3) { font-size: 18px; font-weight: 600; color: #3e3c3a; margin: 18px 0 8px; }
.pb-prose :deep(ul) { list-style: disc; padding-left: 22px; margin-bottom: 16px; }
.pb-prose :deep(ol) { list-style: decimal; padding-left: 22px; margin-bottom: 16px; }
.pb-prose :deep(a) { color: #2c5015; text-decoration: underline; }
.pb-prose :deep(img) { max-width: 100%; border-radius: 12px; }

/* ===== Media ===== */
.pb-figure img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.pb-figure figcaption {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 13px;
  color: #9b8d80;
  text-align: center;
}

.pb-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
}

@media (min-width: 768px) {
  .pb-split { grid-template-columns: 1fr 1fr; gap: 40px; }
  .pb-split--right .pb-split-media { order: 2; }
}

.pb-split-media img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.pb-video {
  position: relative;
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f0eb;
  aspect-ratio: 16 / 9;
}

.pb-video iframe,
.pb-video video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
}

.pb-caption {
  margin-top: 10px;
  text-align: center;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 13px;
  color: #9b8d80;
}

.pb-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.pb-gallery img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;
}

/* ===== Video strip ===== */
.pb-video-strip {
  width: 100%;
  overflow: hidden;
}

.pb-strip-title {
  padding: 32px 0 20px;
}

.pb-strip-item {
  position: relative;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  background: #f5f0eb;
  /* Grid tracks land on fractional pixels at most viewport widths, which
     leaves a hairline gap between clips (most visible at the middle seam of
     the 4-column desktop row). Overlap each item 1px into the next so no
     seam can show; .pb-video-strip clips the last item's overhang. */
  width: calc(100% + 1px);
}

/* Figma tiles: 480 × 652, four across edge to edge */
@media (min-width: 768px) {
  .pb-strip-item { aspect-ratio: 480 / 652; }
}

.pb-strip-item video,
.pb-strip-item iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border: 0;
}

/* ===== CTA band — Figma "শারদ স্নিগ্ধতায় উদ্‌যাপিত হোক উৎসবের আনন্দ" ===== */
.pb-block.pb-cta-band {
  background: #fff;
  padding: 132px 0 48px;
}

.pb-cta-band .container { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; text-align: left; }

.pb-cta-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
  margin-bottom: 0;
}

.pb-cta-band-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 16px;
  border-radius: 8px;
  background: #1a2110;
  color: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  transition: background-color 0.2s ease, transform .2s ease;
}

.pb-cta-band-btn:hover { background: #252f17; transform: translateY(-2px); }

/* ===== Products — Figma "শারদীয় কালেকশন" ===== */
.pb-block.pb-products {
  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 132px 0;
}

.pb-products .container { position: relative; z-index: 1; }

/* Two-tone section titles (see accentTitle) */
.pb-block :deep(.pb-accent) { color: #cc9b25; }

.pb-watermark {
  position: absolute;
  width: 972px;
  height: 868px;
  background: url('/assets/chhondo/logo-outline.svg') no-repeat center / contain;
  opacity: .1;
  pointer-events: none;
}
.pb-watermark--left { left: -274px; top: 338px; }
.pb-watermark--right { right: -445px; top: 189px; }

.pb-products-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 48px;
  text-align: left;
}

.pb-products-copy { display: flex; flex-direction: column; gap: 16px; }

.pb-products-head .pb-section-title,
.pb-products-head .pb-section-sub { text-align: left; }

.pb-products .pb-section-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}

.pb-products .pb-section-sub {
  margin: 0;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #3c3834;
}

.pb-products-grid { gap: 48px 20px; }

.pb-cta {
  margin-top: 28px;
  text-align: center;
}

/* Gold/300 button with Gold/800 label and chevron */
.pb-cta-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  background: #ddbc6d;
  color: #564110;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  transition: background-color 0.2s ease, transform .2s ease;
}

.pb-cta-btn:hover {
  background: #d6af51;
  transform: translateY(-2px);
}

/* Feature cards — four across on a desktop, matching the About page design
   they were lifted from. */
.pb-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.pb-cards-grid.has-title { margin-top: 24px; }

@media (min-width: 640px) {
  .pb-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .pb-cards-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.pb-card {
  padding: 20px;
  border: 1px solid #f0e0cc;
  border-radius: 14px;
  background: #fffaf4;
}

@media (max-width: 1279px) {
  .pb-products .pb-section-title,
  .pb-cta-title { font-size: 44px; line-height: 56px; }
}

/* Figma phone: 20px gutters, 32/40 titles, buttons under the copy, 12px grid */
@media (max-width: 767px) {
  .pb-block.pb-products { padding: 36px 0 48px; }
  .pb-products .container { padding-inline: 20px; }
  .pb-watermark { display: none; }
  .pb-products-head { align-items: flex-start; flex-direction: column; gap: 32px; margin-bottom: 36px; }
  .pb-products .pb-section-title { font-size: 32px; line-height: 40px; }
  .pb-products-grid { gap: 12px; }
  .pb-block.pb-cta-band { padding: 48px 0 24px; }
  .pb-cta-band .container { align-items: center; flex-direction: column; gap: 32px; text-align: center; padding-inline: 20px; }
  .pb-cta-title { font-size: 32px; line-height: 40px; }
  .pb-cta-band-btn { height: 44px; font-size: 16px; line-height: 24px; }
}

.pb-card-title {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #3e3c3a;
}

.pb-card-text {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 24px;
  color: #6b5f54;
}
</style>
