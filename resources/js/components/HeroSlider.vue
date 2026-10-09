<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade, Keyboard } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { computed, ref, shallowRef, watch } from "vue";
import { Link } from "@inertiajs/vue3";
import { variantSrcset } from "@/utils/responsiveImage";
import { rich } from "@/utils/cms";

const modules = [Navigation, Pagination, Autoplay, EffectFade, Keyboard];

const props = defineProps({
    slideshowEnabled: { type: Boolean, default: false },
    autoplayEnabled: { type: Boolean, default: true },
    slideSeconds: { type: [String, Number], default: 5 },
    sliders: {
        type: Array,
        required: true,
    },
    desktopImage: {
        type: String,
        default: "",
    },
    mobileImage: {
        type: String,
        default: "",
    },
    // Figma hero copy laid over the slides: { eyebrow, title, ctaLabel, ctaUrl }.
    overlay: {
        type: Object,
        default: null,
    },
});

/**
 * The slides: the hero image first, then the extra images added under it in
 * the admin, in their order. With no extra images there is nothing to rotate
 * and the hero renders as the single image it always was.
 */
const slides = computed(() => {
    if (!props.sliders.length) return [];
    const hero = props.desktopImage
        ? [{
            id: "hero",
            plain: true,
            image_path: props.desktopImage,
            mobile_or_desktop_image: props.mobileImage || props.desktopImage,
            title: "উৎসবের আমেজে বাঙালিয়ানা সাজ",
        }]
        : [];
    return [...hero, ...props.sliders];
});

const autoplay = computed(() => props.autoplayEnabled && slides.value.length > 1
    ? {
        delay: Math.max(1, Math.min(120, Number(props.slideSeconds) || 5)) * 1000,
        disableOnInteraction: false,
        // Hovering a banner holds it, so its link can be read and clicked.
        pauseOnMouseEnter: true,
    }
    : false);

const activeSlideIndex = ref(0);
const swiperInstance = shallowRef(null);
const currentOverlay = computed(() => {
    const slide = slides.value[activeSlideIndex.value] || slides.value[0];
    if (!slide || slide.plain) return props.overlay;
    return {
        title: slide.heading || "",
        eyebrow: slide.show_subtext !== false ? slide.subtext : null,
        ctaLabel: slide.show_cta !== false ? slide.cta_label : null,
        ctaUrl: slide.cta_url || "/shop",
    };
});

function syncAutoplay() {
    const swiper = swiperInstance.value;
    if (!swiper?.autoplay || swiper.destroyed) return;
    swiper.autoplay.stop();
    if (!swiper.params.autoplay || typeof swiper.params.autoplay !== "object") swiper.params.autoplay = {};
    if (autoplay.value) {
        Object.assign(swiper.params.autoplay, autoplay.value, { enabled: true });
        swiper.autoplay.start();
    } else {
        swiper.params.autoplay.enabled = false;
    }
}
watch([() => props.autoplayEnabled, () => props.slideSeconds, () => slides.value.length], syncAutoplay);

// A banner's link: a site page opens in place (Inertia), anything else as a
// plain link, in a new tab when the admin asked for one.
const isInternal = (url) => typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
const linkAttrs = (slide) => slide.link_new_tab
    ? { href: slide.link_url, target: "_blank", rel: "noopener noreferrer" }
    : { href: slide.link_url };

/**
 * The banner is the largest thing painted, so it sets the LCP. Banners are
 * authored at 1900x560 and were served at that size to every visitor,
 * phones included; the first slide also carried no priority hint, so the
 * browser discovered it late.
 *
 * Written as functions rather than computed values because <picture> needs
 * one srcset per slide per art-direction breakpoint. variantSrcset() returns
 * undefined for anything it cannot build, which correctly leaves the element
 * with its plain src.
 */
/**
 * Slides whose variants failed to load, which fall back to the plain src.
 *
 * The banner is the LCP element, so it is the worst thing on the page to
 * break. A srcset candidate that 404s does not fall back on its own — the
 * browser renders a broken image — so a failure here drops the srcset and
 * lets the original through, exactly as ResponsiveImage.vue does for cards.
 */
const failed = ref(new Set());

const onError = (id) => { failed.value = new Set(failed.value).add(id); };

const desktopSrcset = (slide) =>
    slide.plain || failed.value.has(slide.id) ? undefined : variantSrcset(slide.image_path);

// Falls back to the bare URL so the <source> still applies on mobile even
// when no variants can be built for it — dropping the attribute entirely
// would let the desktop crop through instead.
const mobileSrcset = (slide) => {
    const url = slide.mobile_or_desktop_image || slide.image_path;
    if (slide.plain || failed.value.has(slide.id)) return url;
    return variantSrcset(url) ?? url;
};
</script>

<template>
    <div class="swiper-container w-full min-h-auto mx-auto relative">
        <div v-if="desktopImage && slides.length < 2" class="hero-slide">
            <picture>
                <source
                    v-if="mobileImage"
                    media="(max-width: 767px)"
                    :srcset="mobileImage"
                    sizes="100vw"
                />
                <img
                    :src="desktopImage"
                    alt="উৎসবের আমেজে বাঙালিয়ানা সাজ"
                    class="hero-slide-img"
                    width="1920"
                    height="848"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                />
            </picture>
        </div>
        <swiper
            v-else
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :loop="slides.length > 1"
            effect="fade"
            :fade-effect="{ crossFade: true }"
            :speed="800"
            :keyboard="{ enabled: true }"
            :navigation="slides.length > 1 ? { prevEl: '.hero-nav--prev', nextEl: '.hero-nav--next' } : false"
            :pagination="{ clickable: true }"
            :autoplay="autoplay"
            @swiper="swiperInstance = $event; activeSlideIndex = $event.realIndex || 0"
            @slide-change="activeSlideIndex = $event.realIndex || 0"
        >
            <swiper-slide v-for="(slide, index) in slides" :key="slide.id">
                <component
                    :is="slide.link_url ? (isInternal(slide.link_url) && !slide.link_new_tab ? Link : 'a') : 'div'"
                    v-bind="slide.link_url ? linkAttrs(slide) : {}"
                    class="hero-slide"
                    :class="{ 'is-link': slide.link_url }"
                    :aria-label="slide.link_url ? (slide.title || 'Open banner') : undefined"
                >
                    <picture>
                        <!-- Phones get the square crop, falling back to the
                             desktop image when no mobile one was uploaded. -->
                        <source
                            media="(max-width: 767px)"
                            :srcset="mobileSrcset(slide)"
                            sizes="100vw"
                        />
                        <img
                            :src="slide.image_path"
                            :srcset="desktopSrcset(slide)"
                            sizes="100vw"
                            :alt="slide.title || 'Slider'"
                            class="hero-slide-img"
                            :width="1900"
                            :height="560"
                            :loading="index === 0 ? 'eager' : 'lazy'"
                            :fetchpriority="index === 0 ? 'high' : 'auto'"
                            decoding="async"
                            @error="onError(slide.id)"
                        />
                    </picture>
                </component>
            </swiper-slide>
        </swiper>

        <!-- Previous / next, on wider screens; phones swipe. -->
        <template v-if="slides.length > 1">
            <button type="button" class="hero-nav hero-nav--prev" aria-label="Previous banner">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="hero-nav hero-nav--next" aria-label="Next banner">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </template>

        <!-- Figma: a blurred dark fade along the bottom, the copy on the left
             and the button on the right, both on the container edge. -->
        <div v-if="currentOverlay && (currentOverlay.title || currentOverlay.eyebrow || currentOverlay.ctaLabel)" class="hero-overlay">
            <div class="hero-fade" aria-hidden="true"></div>
            <div class="container hero-copy-row">
                <div class="hero-copy">
                    <p v-if="currentOverlay.eyebrow" class="hero-eyebrow">{{ currentOverlay.eyebrow }}</p>
                    <h1 v-if="currentOverlay.title" class="hero-title" v-html="rich(currentOverlay.title)"></h1>
                </div>
                <component :is="isInternal(currentOverlay.ctaUrl) ? Link : 'a'" v-if="currentOverlay.ctaLabel" :href="currentOverlay.ctaUrl || '/shop'" class="hero-cta">
                    <span>{{ currentOverlay.ctaLabel }}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </component>
            </div>
        </div>
    </div>
</template>

<style scoped>
.swiper-container {
    padding: 0rem 0;
}

/* ── Figma hero overlay ─────────────────────────────────── */
.hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
}

/* 216 of 848px: transparent → 71% black, with a blur ramping 0 → 20px. */
.hero-fade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 25.5%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .71) 100%);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 100%);
}

.hero-copy-row {
    position: relative;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    padding-bottom: clamp(32px, 4.6vw, 88px);
}

.hero-copy { display: flex; flex-direction: column; gap: 8px; color: #fff; }

.hero-eyebrow {
    margin: 0;
    font: 300 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
}

.hero-title {
    margin: 0;
    font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-weight: 600;
    font-size: 56px;
    line-height: 68px;
    color: #fff;
    animation: hero-rise .9s cubic-bezier(.2, .7, .2, 1) both;
}

.hero-cta {
    pointer-events: auto;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 56px;
    padding: 0 16px;
    border-radius: 8px;
    background: #fff;
    color: #1a1817;
    font: 600 20px/28px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    transition: background-color .2s ease, transform .2s ease;
}
.hero-cta:hover { background: #cc9b25; transform: translateY(-2px); }

@keyframes hero-rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
}

/* The fade sits over the bullets, so they ride above it. */
:deep(.swiper-pagination) { z-index: 3; }

/* Figma phone hero: copy and button stacked bottom-left, 20px in. */
@media (max-width: 767px) {
    .hero-fade { height: 40%; }
    .hero-copy-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 0 20px 24px;
    }
    .hero-eyebrow { font-size: 14px; line-height: 20px; }
    .hero-title { font-size: 32px; line-height: 40px; }
    .hero-cta { height: 44px; font-size: 16px; line-height: 24px; }
}

/*
 * The banner box owns its height so the page never jumps between slides of
 * different proportions, and every image is cropped to fill it. Desktop keeps
 * the wide hero ratio; phones use a square.
 */
.hero-slide {
    position: relative;
    width: 100%;
    /* The approved Chhondo hero is intentionally tall and editorial. */
    aspect-ratio: 1920 / 848;
    overflow: hidden;
    background-color: #e4e1e0;
}

.hero-slide picture,
.hero-slide-img {
    display: block;
    width: 100%;
    height: 100%;
}

.hero-slide-img {
    object-fit: cover;
    object-position: center;
}

@media (max-width: 767px) {
    /* Figma phone hero: 402 × 514. */
    .hero-slide {
        aspect-ratio: 402 / 514;
    }
}

:deep(.swiper-pagination-bullet) {
    background-color: white;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    opacity: 1;
}

/* Slides crossfade (Swiper's fade effect sets each slide's opacity). */

/* Until Swiper starts — the server-rendered page, before scripts load — no
   slide is marked active yet, so show the first rather than an empty banner. */
:deep(.swiper:not(.swiper-initialized) .swiper-slide:not(:first-child)) {
    display: none;
}

.hero-slide.is-link { display: block; cursor: pointer; }

/* Previous / next arrows: above the fade and the overlay copy. */
.hero-nav {
    position: absolute;
    top: 50%;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-top: -22px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, .78);
    color: #1a1817;
    cursor: pointer;
    opacity: 0;
    transition: opacity .25s ease, background-color .2s ease;
}
.hero-nav--prev { left: 20px; }
.hero-nav--next { right: 20px; }
.swiper-container:hover .hero-nav,
.hero-nav:focus-visible { opacity: 1; }
.hero-nav:hover { background: #fff; }
.hero-nav:global(.swiper-button-disabled) { opacity: .35; cursor: default; }
@media (max-width: 767px), (hover: none) {
    .hero-nav { display: none; }
}
</style>
