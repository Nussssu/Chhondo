<script setup>
import { ref, computed } from "vue"
import WriteReviewModal from "@/components/Product/WriteReviewModal.vue"
import ImageLightbox from "@/components/Product/ImageLightbox.vue"

const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
  product: {
    type: Object,
    default: null,
  },
})

const VISIBLE_COUNT = 3

const expanded = ref(false)
const isReviewModalOpen = ref(false)

const visibleReviews = computed(() =>
  expanded.value ? props.reviews : props.reviews.slice(0, VISIBLE_COUNT)
)

const averageRating = computed(() => {
  if (!props.reviews.length) return 0
  const sum = props.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / props.reviews.length) * 10) / 10
})

const initial = (name) => (name ? name.charAt(0).toUpperCase() : "C")

// Lightbox for the photos attached to a review
const lightboxImages = ref([])
const lightboxIndex = ref(0)
const isLightboxOpen = ref(false)

const openLightbox = (images, index) => {
  lightboxImages.value = images
  lightboxIndex.value = index
  isLightboxOpen.value = true
}
</script>

<template>
  <!-- Always rendered: with no approved reviews yet the section still has to
       offer the "Write a review" button. -->
  <section class="reviews-section">
    <div class="container">
      <div class="max-w-[1130px] mx-auto">
        <!-- Header -->
        <div class="flex items-end justify-between gap-4 flex-wrap mb-8 md:mb-12">
          <div>
            <h2 class="reviews-heading">ছন্দময়ীদের গল্প</h2>
            <div v-if="reviews.length > 0" class="flex items-center gap-2 mt-2" aria-label="Average rating">
              <div class="flex gap-1">
                <svg
                  v-for="n in 5"
                  :key="n"
                  width="24"
                  height="24"
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
              <span class="reviews-avg">{{ averageRating.toFixed(1) }}</span>
              <span class="reviews-count">({{ reviews.length }} reviews)</span>
            </div>
          </div>
          <button type="button" class="reviews-write-btn" @click="isReviewModalOpen = true">
            আপনার অভিজ্ঞতা জানান
          </button>
        </div>

        <!-- Empty state -->
        <p v-if="reviews.length === 0" class="reviews-empty">
          এই পণ্যের জন্য এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!
        </p>

        <!-- Review cards -->
        <div v-else class="flex flex-col gap-4">
          <article v-for="(review, i) in visibleReviews" :key="i" class="review-row">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <img
                  v-if="review.image"
                  :src="review.image"
                  :alt="review.name"
                  class="review-row-avatar"
                  loading="lazy"
                />
                <span v-else class="review-row-avatar review-row-avatar--initial">{{ initial(review.name) }}</span>
                <div>
                  <p class="review-row-name">{{ review.name }}</p>
                  <p v-if="review.city" class="review-row-city">{{ review.city }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="flex gap-1">
                  <svg
                    v-for="n in 5"
                    :key="n"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    :fill="n <= (review.rating || 5) ? '#d6af51' : 'none'"
                    stroke="#d6af51"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span class="review-row-rating">{{ review.rating || 5 }}</span>
              </div>
            </div>

            <p class="review-row-text">&ldquo;{{ review.review }}&rdquo;</p>

            <div v-if="review.images && review.images.length" class="review-row-photos">
              <button
                v-for="(img, n) in review.images"
                :key="n"
                type="button"
                class="review-row-photo"
                :aria-label="`View photo ${n + 1} from ${review.name}'s review`"
                @click="openLightbox(review.images, n)"
              >
                <img :src="img" alt="Customer photo" loading="lazy" />
              </button>
            </div>
          </article>
        </div>

        <!-- See more -->
        <div v-if="reviews.length > VISIBLE_COUNT" class="text-center mt-6">
          <button
            type="button"
            class="reviews-see-more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
          >
            <span>{{ expanded ? 'See less' : 'See more' }}</span>
            <svg
              class="reviews-see-more-icon"
              :class="{ 'is-expanded': expanded }"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <WriteReviewModal
      :isOpen="isReviewModalOpen"
      :product="product"
      @close="isReviewModalOpen = false"
    />

    <ImageLightbox
      :isOpen="isLightboxOpen"
      :images="lightboxImages"
      :startIndex="lightboxIndex"
      @close="isLightboxOpen = false"
    />
  </section>
</template>

<style scoped>
/* White band on the cream page, like the design */
.reviews-section {
  background-color: #ffffff;
  padding: 48px 0 56px;
}

.reviews-heading {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  color: #2c1a0e;
}

@media (min-width: 768px) {
  .reviews-heading {
    font-size: 40px;
    line-height: 52px;
  }
}

.reviews-avg {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c1a0e;
}

.reviews-count {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #7a5c3e;
}

.reviews-write-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c5015;
  transition: color 0.2s ease;
}

.reviews-write-btn:hover {
  color: #356019;
  text-decoration: underline;
}

/* Review row card — Figma: white, Warm/300 border, r16, p21 */
.review-row {
  background-color: #fff;
  border: 1px solid #f7e2cb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-row-avatar {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
}

.review-row-avatar--initial {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff0df;
  color: #5a3a1e;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
}

.review-row-name {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c1a0e;
}

.review-row-city {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #7a5c3e;
}

.review-row-rating {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2c1a0e;
}

/* Divider above the review text */
.review-row-text {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #5a3a1e;
  border-top: 1px solid #fff0df;
  padding-top: 16px;
  margin-top: -4px;
}

.review-row-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.review-row-photo {
  width: 72px;
  height: 72px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0e3d4;
  background: none;
  cursor: zoom-in;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.review-row-photo:hover {
  transform: scale(1.04);
  border-color: #e9c39c;
}

.review-row-photo:focus-visible {
  outline: 2px solid #b47f54;
  outline-offset: 2px;
}

.review-row-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.reviews-empty {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 26px;
  color: #7a5c3e;
  background: #fffaf4;
  border: 1px dashed #e9c39c;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.reviews-see-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #356019;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.reviews-see-more:hover {
  opacity: 0.8;
}

.reviews-see-more:focus-visible {
  outline: 2px solid #356019;
  outline-offset: 2px;
  border-radius: 6px;
}

.reviews-see-more-icon {
  transition: transform 0.25s ease;
}

.reviews-see-more-icon.is-expanded {
  transform: rotate(180deg);
}

/* ===== Figma "ছন্দময়ীদের গল্প" (product page) ===== */
.reviews-section { background: #fff; padding: 132px 0 0; }
.reviews-heading {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 52px;
  color: #1a1817;
}
.reviews-avg,
.reviews-count { font-family: "Poppins", sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; color: #3c3834; }
.reviews-write-btn {
  padding: 0;
  border: 0;
  background: none;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #252f17;
  text-decoration: underline;
  text-underline-offset: 3px;
  box-shadow: none;
}
.reviews-write-btn:hover { color: #cc9b25; background: none; }

.review-row {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.review-row > div:first-child { padding-bottom: 16px; border-bottom: 1px solid #efe0bb; align-items: center; }
.review-row-avatar { width: 44px; height: 44px; }
.review-row-avatar--initial { background: #cbcdc7; color: #1a1817; }
.review-row-name { font-family: "Poppins", "Li Ador Noirrit", sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; color: #1a1817; }
.review-row-city { font-family: "Poppins", "Li Ador Noirrit", sans-serif; font-size: 12px; line-height: 20px; color: #6d6560; }
.review-row-rating { font-family: "Poppins", sans-serif; font-size: 12px; font-weight: 600; color: #1a1817; }
.review-row-text {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}
.review-row-photos { display: flex; flex-wrap: wrap; gap: 16px; }
.review-row-photo { width: 100px; height: 100px; border-radius: 6px; overflow: hidden; }
.reviews-see-more { font-family: "Poppins", sans-serif; font-size: 16px; color: #1a1817; }

@media (max-width: 767px) {
  .reviews-section { padding-top: 48px; }
  .reviews-section .container { padding-inline: 20px; }
  .reviews-heading { font-size: 28px; line-height: 36px; }
  .review-row-photo { width: 72px; height: 72px; }
}
</style>
