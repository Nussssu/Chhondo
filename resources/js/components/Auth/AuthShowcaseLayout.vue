<script setup>
import { computed } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue";

const props = defineProps({
    reviews: { type: Array, default: () => [] },
    // Log in and Sign up have no footer in the Figma.
    hideFooter: { type: Boolean, default: false },
    // The four collage photos, from Content › Pages › Log in & Sign up.
    photos: { type: Array, default: () => [] },
    // Section on/off switch for the collage in Content › Pages.
    showPhotos: { type: Boolean, default: true },
    blocks: { type: Array, default: () => [] },
});

// Fallback reviews so the panel is never empty (e.g. before any are added).
const fallbackReviews = [
    {
        name: "Nusrat Jahan",
        city: "Chittagong",
        rating: 5,
        review: "Finally a brand that celebrates our heritage without compromise. The Chondrika for Eid drew compliments all evening.",
        image: "/assets/images/slider/Web-Slider_01.webp",
    },
    {
        name: "Sabrina Islam",
        city: "Sylhet",
        rating: 5,
        review: "Authentic handwoven quality you can feel immediately. My mother was moved to tears — this is what we grew up with.",
        image: "/assets/images/slider/Web-Slider_02.jpg",
    },
];

// The four Figma collage photos (Log in 2319:5826 / Sign up 2466:9462).
const FIGMA_PHOTOS = [
    "/assets/chhondo/auth/auth-1.jpg",
    "/assets/chhondo/auth/auth-2.jpg",
    "/assets/chhondo/auth/auth-3.jpg",
    "/assets/chhondo/auth/auth-4.jpg",
];

const reviews = computed(() =>
    props.reviews && props.reviews.length ? props.reviews : fallbackReviews
);

/*
 * Figma's two columns: left is card, photo 1, photo 2; right is photo 3,
 * card, photo 4. The cards carry the reviews' own words. Each column is
 * doubled for a seamless loop.
 */
const columns = computed(() => {
    const list = reviews.value;
    const card = (i) => ({ type: "card", review: list[i % list.length] });
    // Switched off in Content › Pages: the collage hides, the review cards stay.
    if (props.showPhotos === false) {
        return [
            { dir: "up", items: [card(0), card(1), card(0), card(1)] },
            { dir: "down", items: [card(1), card(0), card(1), card(0)] },
        ];
    }
    const photo = (n) => ({ type: "photo", src: props.photos[n] || FIGMA_PHOTOS[n] });
    const colA = [card(0), photo(0), photo(1)];
    const colB = [photo(2), card(1), photo(3)];
    return [
        { dir: "up", items: [...colA, ...colA] },
        { dir: "down", items: [...colB, ...colB] },
    ];
});

const initial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
</script>

<template>
    <AppLayout :hide-footer="hideFooter">
        <div class="auth-page container" :class="{ 'auth-page--fit': hideFooter }">
            <!-- Left: two sliding columns of reviews (desktop only) -->
            <aside class="auth-showcase">
                <div class="marquee">
                    <div v-for="(col, ci) in columns" :key="ci" class="marquee-col">
                        <div class="marquee-track" :class="col.dir === 'up' ? 'marquee-up' : 'marquee-down'">
                            <!-- Figma: 325 × 400 photos and testimonial cards -->
                            <template v-for="(item, i) in col.items" :key="ci + '-' + i">
                                <div v-if="item.type === 'photo'" class="review-image">
                                    <img :src="item.src" alt="" loading="eager" />
                                </div>
                                <article v-else class="review-slide">
                                    <div class="review-author">
                                        <span class="review-avatar">{{ initial(item.review.name) }}</span>
                                        <div>
                                            <p class="review-name">{{ item.review.name }}</p>
                                            <p class="review-city">{{ item.review.city }}</p>
                                        </div>
                                    </div>
                                    <div class="review-stars">
                                        <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" :fill="s <= (item.review.rating || 5) ? '#d6af51' : '#efe0bb'" stroke="none">
                                            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <p class="review-text">"{{ item.review.review }}"</p>
                                </article>
                            </template>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Right: form -->
            <section class="auth-form-panel">
                <div class="auth-form-inner">
                    <slot />
                </div>
            </section>
        </div>
        <PageBlocks :blocks="blocks" />
    </AppLayout>
</template>

<style scoped>
/* Figma: 670 + 20 + 670 inside the 1360 container, 850px under the header */
.auth-page {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    background: #fff;
    min-height: 850px;
}

@media (min-width: 1024px) {
    .auth-page {
        grid-template-columns: 1fr 1fr;
    }
}

/* Left showcase */
.auth-showcase {
    display: none;
}

@media (min-width: 1024px) {
    .auth-showcase {
        display: block;
        height: 850px;
        overflow: hidden;
    }
}

.marquee {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 100%;
}

.marquee-col {
    position: relative;
    overflow: hidden;
}

.marquee-track {
    display: flex;
    flex-direction: column;
    gap: 16px;
    will-change: transform;
}

.marquee-up {
    animation: marquee-up 45s linear infinite;
}

.marquee-down {
    animation: marquee-down 45s linear infinite;
}

/* Stop on interaction. */
.auth-showcase:hover .marquee-track,
.auth-showcase:focus-within .marquee-track {
    animation-play-state: paused;
}

@keyframes marquee-up {
    from { transform: translateY(0); }
    to   { transform: translateY(-50%); }
}

@keyframes marquee-down {
    from { transform: translateY(-50%); }
    to   { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
    .marquee-up,
    .marquee-down {
        animation: none;
    }
}

/* Photo tile — 325 × 400, r16 */
.review-image {
    width: 100%;
    aspect-ratio: 325 / 400;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 16px;
    background: #f3f3f3;
}

.review-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Testimonial card — white, Gold/100 hairline, r16, p16, 12px rhythm */
.review-slide {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid #efe0bb;
    border-radius: 16px;
    background: #fff;
}

.review-author {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f3f3f3;
}

.review-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 9999px;
    background: #d1ddc9;
    color: #2d4a2d;
    font: 700 14px/20px "DM Sans", "Poppins", sans-serif;
}

.review-name {
    margin: 0;
    font: 600 14px/20px "DM Sans", "Poppins", "Li Ador Noirrit", sans-serif;
    color: #1a1817;
}

.review-city {
    margin: 0;
    font: 400 12px/16px "DM Sans", "Poppins", "Li Ador Noirrit", sans-serif;
    color: #6d6560;
}

.review-stars {
    display: flex;
    gap: 2px;
}

.review-text {
    margin: 0;
    font: 400 12px/20px "Poppins", "Li Ador Noirrit", sans-serif;
    color: #3c3834;
}

/* Right form panel — 438px form, 88px side padding, centred */
.auth-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px 20px;
}

.auth-form-inner {
    width: 100%;
    max-width: 438px;
}

@media (max-width: 1023px) {
    /* Without the collage the form sits at the top, not centred in 850px. */
    .auth-page { min-height: 0; }
}

@media (max-width: 767px) {
    .auth-form-panel { padding: 40px 0 56px; }
}

/* Log in / Sign up (Figma 2319:5826): header plus content fill exactly one
   screen, so the page itself never scrolls. */
@media (min-width: 1024px) {
    .auth-page--fit {
        height: calc(100vh - 76px);
        height: calc(100dvh - 76px);
        min-height: 0;
        overflow: hidden;
    }
    .auth-page--fit .auth-showcase { height: 100%; }
    .auth-page--fit .auth-form-panel { padding-top: 0; padding-bottom: 0; overflow-y: auto; }
}
</style>
