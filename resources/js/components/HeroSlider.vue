<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { ref } from "vue";
import { variantSrcset } from "@/utils/responsiveImage";

const modules = [Navigation, Pagination, Autoplay];

defineProps({
    sliders: {
        type: Array,
        required: true,
    },
});

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
    failed.value.has(slide.id) ? undefined : variantSrcset(slide.image_path);

// Falls back to the bare URL so the <source> still applies on mobile even
// when no variants can be built for it — dropping the attribute entirely
// would let the desktop crop through instead.
const mobileSrcset = (slide) => {
    const url = slide.mobile_or_desktop_image || slide.image_path;
    if (failed.value.has(slide.id)) return url;
    return variantSrcset(url) ?? url;
};
</script>

<template>
    <div class="swiper-container w-full min-h-auto mx-auto relative">
        <swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :loop="sliders.length > 1"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
        >
            <swiper-slide v-for="(slide, index) in sliders" :key="slide.id">
                <div class="hero-slide">
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
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<style scoped>
.swiper-container {
    padding: 0rem 0;
}

/*
 * The banner box owns its height so the page never jumps between slides of
 * different proportions, and every image is cropped to fill it. Desktop keeps
 * the wide hero ratio; phones use a square.
 */
.hero-slide {
    position: relative;
    width: 100%;
    /* 1900x560, the size the banners are authored at. */
    aspect-ratio: 1900 / 560;
    overflow: hidden;
    background-color: #f5efe7;
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
    .hero-slide {
        aspect-ratio: 1 / 1;
    }
}

:deep(.swiper-pagination-bullet) {
    background-color: white;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    opacity: 1;
}

:deep(.swiper-slide) {
    opacity: 0 !important;
    transition: opacity 0.3s ease;
}

:deep(.swiper-slide-active) {
    opacity: 1 !important;
}

/* Until Swiper starts — the server-rendered page, before scripts load — no
   slide is marked active yet, so show the first rather than an empty banner. */
:deep(.swiper:not(.swiper-initialized) .swiper-slide:first-child) {
    opacity: 1 !important;
}
</style>
