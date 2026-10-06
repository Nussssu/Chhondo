<script setup>
import { computed } from "vue"
import { rich } from "@/utils/cms"

const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
  // Content › Pages › Home › Customer reviews; *stars* mark the gold word.
  title: { type: String, default: "ছন্দময়ীদের *গল্প*" },
})

const displayReviews = computed(() => (props.reviews || []).slice(0, 12))

/*
 * Figma "ছন্দময়ীদের গল্প": two rows of cards drifting in opposite directions,
 * bleeding off both edges. Reviews alternate between the rows; each row is
 * repeated so the loop is seamless, and padded out when there are only a few.
 */
const fill = (row) => {
  const filled = []
  while (filled.length < 6) filled.push(...row)
  return filled
}

// Phones show a single row (Figma), so it carries every review.
const rows = computed(() => {
  const list = displayReviews.value
  if (!list.length) return []
  // Figma always has two rows; with few reviews the second runs them reversed.
  const split = list.length > 3
    ? [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)]
    : [list, [...list].reverse()]
  return [
    ...split.map((row, i) => ({ items: fill(row), cls: ["reviews-marquee--desktop", i === 1 && "reviews-marquee--reverse"] })),
    { items: fill(list), cls: ["reviews-marquee--phone"] },
  ]
})

const initial = (name) => (name ? name.charAt(0).toUpperCase() : "?")
</script>

<template>
  <section v-if="displayReviews.length > 0" class="reviews-section">
    <h2 class="reviews-title" v-html="rich(title)"></h2>

    <div class="reviews-rows">
      <div
        v-for="(row, r) in rows"
        :key="r"
        class="reviews-marquee"
        :class="row.cls"
      >
        <!-- Two identical halves: the track slides by one half and repeats. -->
        <div class="reviews-track" :style="{ '--count': row.items.length }">
          <template v-for="copy in 2" :key="copy">
            <article
              v-for="(review, i) in row.items"
              :key="`${copy}-${i}`"
              class="review-card"
              :aria-hidden="copy === 2 ? 'true' : undefined"
            >
              <div class="review-card-head">
                <span class="review-card-avatar review-card-avatar--initial" aria-hidden="true">{{ initial(review.name) }}</span>
                <div class="min-w-0">
                  <p class="review-card-name">{{ review.name }}</p>
                  <p v-if="review.city" class="review-card-city">{{ review.city }}</p>
                </div>
              </div>

              <div class="review-card-body">
                <div class="review-card-stars" :aria-label="`${review.rating || 5} / 5`">
                  <svg
                    v-for="n in 5"
                    :key="n"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    :fill="n <= (review.rating || 5) ? '#d6af51' : '#efe0bb'"
                    aria-hidden="true"
                  >
                    <path d="M12 2.6l2.83 5.95 6.52.82-4.79 4.5 1.22 6.46L12 17.17l-5.78 3.16 1.22-6.46-4.79-4.5 6.52-.82L12 2.6z" />
                  </svg>
                </div>
                <p class="review-card-text">{{ review.review }}</p>
              </div>
            </article>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews-section {
  background: #fff;
  padding: 0 0 132px;
  overflow: hidden;
}

.reviews-title {
  margin: 0 0 48px;
  padding-inline: 20px;
  text-align: center;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}

.reviews-accent { color: #cc9b25; }

.reviews-rows { display: flex; flex-direction: column; gap: 20px; }

.reviews-marquee { overflow: hidden; }
.reviews-marquee--phone { display: none; }

.reviews-track {
  display: flex;
  gap: 20px;
  width: max-content;
  /* ~7s per card keeps the drift slow enough to read */
  animation: reviews-drift calc(var(--count) * 7s) linear infinite;
}

.reviews-marquee--reverse .reviews-track {
  animation-direction: reverse;
  margin-left: -230px;
}

.reviews-marquee:hover .reviews-track { animation-play-state: paused; }

@keyframes reviews-drift {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 10px)); }
}

@media (prefers-reduced-motion: reduce) {
  .reviews-track { animation: none; }
  .reviews-marquee { overflow-x: auto; }
}

/* Card — 440 × 264, Gold/100 1px border, r24, 24/42 padding */
.review-card {
  flex: 0 0 440px;
  min-height: 264px;
  display: flex;
  flex-direction: column;
  padding: 24px 42px;
  border: 1px solid #efe0bb;
  border-radius: 24px;
  background: #fff;
  transition: box-shadow .3s ease, border-color .3s ease;
}

.review-card:hover {
  border-color: #d6af51;
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, .12);
}

.review-card-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9eff5;
}

.review-card-avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 9999px;
  object-fit: cover;
  background: #d9d9d9;
}

.review-card-avatar--initial {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3c3834;
  font: 600 20px/1 "Poppins", sans-serif;
}

.review-card-name {
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: 600 20px/30px "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #0f1125;
}

.review-card-city {
  margin: 0;
  font: 500 16px/24px "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #717276;
}

.review-card-body { display: flex; flex-direction: column; gap: 12px; padding-top: 24px; }

.review-card-stars { display: flex; gap: 2px; }

.review-card-text {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font: 400 16px/20px "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #3c3834;
}

/* Figma phone: one row of ~313px cards at 71% scale */
@media (max-width: 767px) {
  .reviews-section { padding-bottom: 48px; }
  .reviews-title { margin-bottom: 24px; font-size: 32px; line-height: 40px; }
  .reviews-marquee--desktop { display: none; }
  .reviews-marquee--phone { display: block; }
  .review-card { flex-basis: 313px; min-height: 0; padding: 17px 30px; border-radius: 17px; }
  .reviews-track { gap: 14px; }
  .review-card-head { gap: 11px; padding-bottom: 17px; }
  .review-card-avatar { width: 40px; height: 40px; }
  .review-card-name { font-size: 14px; line-height: 21px; }
  .review-card-city { font-size: 11.4px; line-height: 17px; }
  .review-card-body { gap: 9px; padding-top: 17px; }
  .review-card-stars svg { width: 17px; height: 17px; }
  .review-card-text { font-size: 11.4px; line-height: 20px; }
}
</style>
