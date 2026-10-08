<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head, Link } from "@inertiajs/vue3"
import { computed } from "vue"
import { rich, plain, on, shown } from "@/utils/cms"

const props = defineProps({
  // Everything on this page is managed in Content › Pages › About us.
  texts: { type: Object, default: () => ({}) },
  content: String,
  blocks: { type: Array, default: () => [] },
})

const t = computed(() => props.texts || {})

// The hero mosaic, in its four corners.
const heroImages = computed(() =>
  [
    { src: t.value.hero_image_1, cls: "ab-mosaic-img--1" },
    { src: t.value.hero_image_2, cls: "ab-mosaic-img--4" },
    { src: t.value.hero_image_3, cls: "ab-mosaic-img--2" },
    { src: t.value.hero_image_4, cls: "ab-mosaic-img--3" },
  ].filter((image) => image.src),
)

const stats = computed(() => shown(t.value.stats))
const values = computed(() => shown(t.value.values))
</script>

<template>
  <Head>
    <title>{{ plain(t.tab_title) }}</title>
  </Head>

  <AppLayout>
    <!-- Hero: four leaf-cornered photos and the story -->
    <section v-if="on(t.hero_show)" class="ab-hero">
      <div class="container ab-hero-grid">
        <div class="ab-mosaic" aria-hidden="true">
          <img v-for="image in heroImages" :key="image.cls" :src="image.src" alt="" class="ab-mosaic-img" :class="image.cls" />
        </div>

        <div class="ab-hero-copy">
          <div class="ab-text">
            <h1 class="ab-title" v-html="rich(t.hero_title)"></h1>
            <p v-if="on(t.hero_text_show)" class="ab-lead" v-html="rich(t.hero_text)"></p>
          </div>

          <dl v-if="on(t.stats_show) && stats.length" class="ab-stats">
            <div v-for="(stat, i) in stats" :key="i" class="ab-stat">
              <dt class="ab-stat-value">{{ stat.value }}</dt>
              <dd class="ab-stat-label" v-html="rich(stat.label)"></dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Everyday band -->
    <section v-if="on(t.band_show)" class="ab-band">
      <div class="container ab-band-grid">
        <div class="ab-band-copy">
          <div class="ab-text">
            <h2 class="ab-title ab-title--light" v-html="rich(t.band_title)"></h2>
            <p v-if="on(t.band_text_show)" class="ab-body ab-body--light" v-html="rich(t.band_text)"></p>
          </div>
          <Link v-if="on(t.band_button_show) && t.band_button_label" :href="t.band_button_url || '/shop'" class="ab-ghost-btn">
            {{ t.band_button_label }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        </div>

        <div class="ab-band-media" aria-hidden="true">
          <img v-if="t.band_image_1" :src="t.band_image_1" alt="" loading="lazy" class="ab-band-img ab-band-img--short" />
          <img v-if="t.band_image_2" :src="t.band_image_2" alt="" loading="lazy" class="ab-band-img ab-band-img--tall" />
        </div>
      </div>
    </section>

    <!-- Craftsmanship -->
    <section v-if="on(t.craft_show)" class="ab-craft">
      <span class="ab-watermark" aria-hidden="true"></span>
      <div class="container ab-craft-grid">
        <div class="ab-craft-media" aria-hidden="true">
          <span v-if="t.craft_image_1" class="ab-frame ab-frame--small">
            <img :src="t.craft_image_1" alt="" loading="lazy" />
          </span>
          <span v-if="t.craft_image_2" class="ab-frame ab-frame--large">
            <img :src="t.craft_image_2" alt="" loading="lazy" />
          </span>
        </div>

        <div class="ab-text ab-craft-copy">
          <h2 class="ab-title" v-html="rich(t.craft_title)"></h2>
          <p v-if="on(t.craft_text_show)" class="ab-body" v-html="rich(t.craft_text)"></p>
        </div>
      </div>
    </section>

    <!-- Our values -->
    <section v-if="on(t.values_show)" class="ab-values">
      <div class="container">
        <h2 class="ab-title ab-title--center" v-html="rich(t.values_title)"></h2>

        <div class="ab-values-grid">
          <article v-for="(item, i) in values" :key="i" class="ab-value">
            <img v-if="item.image" :src="item.image" alt="" class="ab-value-numeral" aria-hidden="true" loading="lazy" />
            <p class="ab-value-eyebrow">{{ item.eyebrow }}</p>
            <h3 class="ab-value-title">{{ item.title }}</h3>
            <p class="ab-value-text">{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Founder's words -->
    <section v-if="on(t.quote_show)" class="ab-quote">
      <div class="container">
        <blockquote class="ab-quote-text" v-html="rich(t.quote_text, { breaks: 'desktop' })"></blockquote>
        <div v-if="on(t.quote_by_show)" class="ab-quote-by">
          <span class="ab-quote-avatar" aria-hidden="true"><span></span></span>
          <div>
            <p class="ab-quote-name">{{ t.quote_name }}</p>
            <p class="ab-quote-role">{{ t.quote_role }}</p>
          </div>
        </div>
      </div>
    </section>
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.ab-accent { color: #cc9b25; }
.ab-text { display: flex; flex-direction: column; gap: 16px; }

.ab-title {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}
.ab-title--light { color: #fff; }
.ab-title--center { text-align: center; }

.ab-lead,
.ab-body {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #3c3834;
}
.ab-body { font-weight: 400; }
.ab-body--light { color: #fff; }

/* ── Hero — 636 × 464 mosaic, 88px gap, 636px copy ── */
.ab-hero { position: relative; overflow: hidden; padding: 112px 0; background: #fff; }
/* Oversized Bengali "ছন্দ" outline watermark (Figma): transparent fill,
   hairline light-gray stroke, extremely subtle, cropped by the left section
   edge and kept behind all content. */
.ab-hero::before {
  content: "";
  position: absolute;
  z-index: 0;
  left: -410px;
  top: 32px;
  width: 835px;
  height: 868px;
  background: none;
  pointer-events: none;
}
.ab-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 636px 636px; gap: 88px; align-items: center; }
.ab-mosaic { position: relative; aspect-ratio: 636 / 464; }
.ab-mosaic-img {
  position: absolute;
  object-fit: cover;
  border-radius: 74px 6px 74px 6px;
  transition: transform .7s ease;
}
.ab-mosaic-img:hover { transform: scale(1.02); }
.ab-mosaic-img--1 { left: 10.06%; top: 10.56%; width: 39.62%; height: 39.01%; }
.ab-mosaic-img--4 { left: 50.63%; top: .43%; width: 49.37%; height: 49.14%; }
.ab-mosaic-img--2 { left: 0; top: 50.86%; width: 49.37%; height: 49.14%; }
.ab-mosaic-img--3 { left: 50.63%; top: 50.86%; width: 39.62%; height: 39.01%; }

.ab-hero-copy { display: flex; flex-direction: column; gap: 44px; }
.ab-stats { display: flex; align-items: flex-start; gap: 40px; height: 104px; margin: 0; }
.ab-stat { display: flex; flex-direction: column; gap: 4px; }
.ab-stat + .ab-stat { position: relative; padding-left: 40px; }
.ab-stat + .ab-stat::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 104px;
  background: #cbcdc7;
}
.ab-stat-value {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 52px;
  color: #4c5441;
}
.ab-stat-label {
  margin: 0;
  font-family: "Li Ador Noirrit", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}

/* ── Dark band — same build as the home page story band ── */
.ab-band { padding: 128px 0; background: #1a2110; }
.ab-band-grid { display: grid; grid-template-columns: 670px 670px; gap: 20px; align-items: center; }
.ab-band-copy { display: flex; flex-direction: column; gap: 88px; padding-right: 192px; }
.ab-ghost-btn {
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
.ab-ghost-btn:hover { background: #fff; color: #1a2110; transform: translateY(-2px); }
.ab-band-media { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: end; }
.ab-band-img { width: 100%; object-fit: cover; border-radius: 5.3px 69.6px 5.3px 69.6px; }
.ab-band-img--short { aspect-ratio: 325 / 349; }
.ab-band-img--tall { aspect-ratio: 325 / 474; }

/* ── Artisans — gold-framed leaf photos ── */
.ab-craft { position: relative; overflow: hidden; padding: 112px 0 0; background: #fff; }
/* Same "ছন্দ" outline family, tall crop: cropped by the right section edge,
   behind the copy and frames. */
.ab-watermark {
  position: absolute;
  z-index: 0;
  right: -190px;
  top: 64px;
  width: 498px;
  height: 825px;
  background: none;
  pointer-events: none;
}
.ab-craft-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 675px 665px; gap: 20px; align-items: center; }
.ab-craft-media { display: flex; align-items: flex-end; gap: 16px; }
.ab-frame { display: block; background: #fff; border: 1.5px solid #d6af51; overflow: hidden; }
.ab-frame img { width: 100%; height: 100%; object-fit: cover; }
.ab-frame--small { width: 40.7%; aspect-ratio: 275 / 411; padding: 16px; border-radius: 8px 64px 8px 64px; }
.ab-frame--small img { border-radius: 8px 48px 8px 48px; }
.ab-frame--large { width: 56.9%; aspect-ratio: 384 / 578; padding: 12px; border-radius: 12px 88px 12px 88px; }
.ab-frame--large img { border-radius: 6px 74px 6px 74px; }
.ab-craft-copy { padding-left: 32px; }

/* ── Values — three 440 × 288 cards, leaf corners, faint numerals ── */
.ab-values { padding: 112px 0 68px; background: #fff; }
.ab-values .ab-title { margin-bottom: 48px; }
.ab-values-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.ab-value {
  position: relative;
  min-height: 288px;
  padding: 48px 56px;
  border: 1px solid #f3f3f3;
  border-radius: 4px 40px 4px 40px;
  background: #fff;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
  transition: transform .3s ease, box-shadow .3s ease;
}
.ab-value:hover { transform: translateY(-3px); box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .28); }
.ab-value-numeral {
  position: absolute;
  top: 36px;
  right: 38px;
  width: auto;
  height: 64px;
  pointer-events: none;
}
.ab-value-eyebrow {
  position: relative;
  margin: 0 0 24px;
  font: 400 14px/20px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #cc9b25;
}
.ab-value-title {
  position: relative;
  margin: 0 0 16px;
  font: 600 24px/20px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #1a1817;
}
.ab-value-text {
  position: relative;
  margin: 0;
  font: 300 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #3c3834;
}

/* ── Quote ── */
.ab-quote { padding: 132px 0; background: #fff; text-align: center; }
.ab-quote-text {
  max-width: 1116px;
  margin: 0 auto 36px;
  font: 400 48px/58px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #1a1817;
}
.ab-quote-by { display: flex; align-items: center; justify-content: center; gap: 20px; text-align: left; }
.ab-quote-avatar {
  display: flex;
  width: 56px;
  height: 56px;
  padding: 4px;
  border: 2px solid #cc9b25;
  border-radius: 9999px;
}
.ab-quote-avatar span { flex: 1; border-radius: 9999px; background: #252f17; }
.ab-quote-name { margin: 0; font: 600 20px/28px "Li Ador Noirrit", "Hind Siliguri", sans-serif; color: #1a1817; }
.ab-quote-role { margin: 0; font: 400 12px/20px "Li Ador Noirrit", "Hind Siliguri", sans-serif; color: #3c3834; }

@media (max-width: 1279px) {
  .ab-title { font-size: 44px; line-height: 56px; }
  .ab-band-copy { padding-right: 48px; }
  .ab-value { padding: 40px 32px; }
  .ab-quote-text { font-size: 36px; line-height: 48px; }
  .ab-hero::before { left: -304px; top: 24px; width: 620px; height: 644px; background-size: 620px 644px; }
  .ab-watermark { right: -141px; top: 48px; width: 370px; height: 613px; background-size: 370px 613px; }
}

/* Phone: stacked, 20px gutters, 32/40 titles */
@media (max-width: 767px) {
  .ab-hero,
  .ab-band { padding: 48px 0; }
  .ab-craft,
  .ab-values { padding-top: 48px; }
  .ab-quote { padding: 64px 0 48px; }
  .ab-hero .container,
  .ab-band .container,
  .ab-craft .container,
  .ab-values .container,
  .ab-quote .container { padding-inline: 20px; }
  .ab-hero-grid,
  .ab-band-grid,
  .ab-craft-grid { grid-template-columns: 1fr; gap: 40px; }
  .ab-title { font-size: 32px; line-height: 40px; }
  .ab-stats { gap: 16px; }
  .ab-stat + .ab-stat { padding-left: 16px; }
  .ab-stat-value { font-size: 28px; line-height: 36px; }
  .ab-stat-label { font-size: 14px; line-height: 20px; }
  .ab-band-copy { gap: 40px; padding-right: 0; }
  .ab-ghost-btn { height: 44px; font-size: 16px; line-height: 24px; }
  .ab-band-media { gap: 10px; }
  .ab-band-img { border-radius: 4px 32px 4px 32px; }
  /* Keep the outline watermark visible but scaled + cropped on phones. */
  .ab-hero::before { left: -150px; top: 10px; width: 300px; height: 312px; background-size: 300px 312px; opacity: .9; }
  .ab-watermark { right: -95px; top: 20px; width: 220px; height: 364px; background-size: 220px 364px; opacity: .9; }
  .ab-craft-media { order: 2; }
  .ab-craft-copy { padding-left: 0; }
  .ab-frame--small { padding: 8px; }
  .ab-frame--large { padding: 8px; }
  .ab-values .ab-title { margin-bottom: 32px; }
  .ab-values-grid { grid-template-columns: 1fr; gap: 16px; }
  .ab-value { min-height: 0; padding: 32px 24px; }
  .ab-value-numeral { top: 20px; right: 24px; height: 48px; }
  .ab-quote-text { font-size: 24px; line-height: 34px; }
}
</style>
