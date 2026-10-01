<script setup>
import { computed } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";

const props = defineProps({
    reviews: { type: Array, default: () => [] },
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

const reviews = computed(() =>
    props.reviews && props.reviews.length ? props.reviews : fallbackReviews
);

// Two columns of review cards. Each holds all reviews (second column reversed
// so the columns don't look identical), duplicated once for a seamless loop.
const columns = computed(() => {
    const base = reviews.value;
    const colA = base;
    const colB = base.length > 1 ? [...base].slice().reverse() : base;
    return [
        { dir: "up", items: [...colA, ...colA] },
        { dir: "down", items: [...colB, ...colB] },
    ];
});

const initial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
</script>

<template>
    <AppLayout>
        <div class="auth-page">
            <!-- Left: two sliding columns of reviews (desktop only) -->
            <aside class="auth-showcase">
                <div class="marquee">
                    <div v-for="(col, ci) in columns" :key="ci" class="marquee-col">
                        <div class="marquee-track" :class="col.dir === 'up' ? 'marquee-up' : 'marquee-down'">
                            <article
                                v-for="(r, i) in col.items"
                                :key="ci + '-' + i"
                                class="review-slide"
                            >
                                <div v-if="r.image" class="review-image">
                                    <img :src="r.image" :alt="r.name" loading="lazy" />
                                </div>
                                <div class="review-body">
                                    <div class="review-stars">
                                        <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" :fill="s <= (r.rating || 5) ? '#e5a83b' : '#e5e7eb'" stroke="none">
                                            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <p class="review-text">"{{ r.review }}"</p>
                                    <div class="review-author">
                                        <span class="review-avatar">{{ initial(r.name) }}</span>
                                        <div>
                                            <p class="review-name">{{ r.name }}</p>
                                            <p class="review-city">{{ r.city }}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
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
    </AppLayout>
</template>

<style scoped>
.auth-page {
    display: grid;
    grid-template-columns: 1fr;
    background: #fffaf4;
    min-height: calc(100vh - 90px);
    padding-top: 48px;
    padding-bottom: 48px;
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
        /* Fill the space left after the header (90px) and the 48px top/bottom
           padding on .auth-page, so the top and bottom gaps are equal. */
        height: calc(100vh - 90px - 96px);
        min-height: 480px;
        padding: 0 24px;
        overflow: hidden;
    }
}

.marquee {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    height: 100%;
}

.marquee-col {
    position: relative;
    overflow: hidden;
}

.marquee-track {
    display: flex;
    flex-direction: column;
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

/* Review card (image + text) */
.review-slide {
    margin-bottom: 16px;
    background: #fff;
    border: 1px solid #f0e6d8;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(139, 105, 20, 0.06);
}

.review-image {
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #f0ece6;
}

.review-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.review-body {
    padding: 16px;
}

.review-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 10px;
}

.review-text {
    font-size: 13px;
    line-height: 1.55;
    color: #3f3f46;
    margin-bottom: 14px;
}

.review-author {
    display: flex;
    align-items: center;
    gap: 10px;
}

.review-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    background: #ecf1e8;
    color: #356019;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
}

.review-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.2;
}

.review-city {
    font-size: 12px;
    color: #9a663f;
}

/* Right form panel */
.auth-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
}

.auth-form-inner {
    width: 100%;
    max-width: 420px;
}
</style>
