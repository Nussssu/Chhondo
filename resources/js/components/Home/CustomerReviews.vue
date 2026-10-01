<script setup>
import { computed, useId } from "vue"
import { usePage } from "@inertiajs/vue3"
import { Swiper, SwiperSlide } from "swiper/vue"
import ResponsiveImage from "@/components/ResponsiveImage.vue"
import { Navigation, Pagination, A11y } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
})

// The grid showed two rows of three; a slider can carry more without taking
// more vertical space.
const displayReviews = computed(() => (props.reviews || []).slice(0, 12))

const initial = (name) => (name ? name.charAt(0).toUpperCase() : "C")

/*
 * Editable under Content > Pages > Home > Customer reviews. The section keeps
 * its own design — only the wording comes from the admin, and the page's own
 * defaults fill any gap, so an empty field changes nothing.
 */
const texts = computed(() => usePage().props.texts ?? {})

const heading = computed(
  () => texts.value.reviews_heading || "আমাদের গ্রাহকরা যা বলেন"
)

const subheading = computed(
  () => texts.value.reviews_subheading || "আমাদের গ্রাহকদের ভালোবাসা এবং আস্থাই আমাদের চলার পথের অনুপ্রেরণা।"
)

const modules = [Navigation, Pagination, A11y]

/*
 * Swiper resolves these when it initialises, by which point the elements are
 * in the DOM. Template refs would still be null at the moment the props are
 * evaluated, so ids are used instead — unique per instance, in case the
 * section is ever rendered more than once on a page.
 */
const uid = useId().replace(/[^\w-]/g, "")
const prevId = `reviews-prev-${uid}`
const nextId = `reviews-next-${uid}`
const dotsId = `reviews-dots-${uid}`

/*
 * On phones the track runs to the edge of the screen — the card after the
 * first one peeks in, which is what tells people it scrolls. The offsets keep
 * the first card's left edge on the same line as the heading above it.
 */
const CONTAINER_PADDING = 16

const breakpoints = {
  0: {
    slidesPerView: 1.1,
    spaceBetween: 12,
    slidesOffsetBefore: CONTAINER_PADDING,
    slidesOffsetAfter: CONTAINER_PADDING,
  },
  480: {
    slidesPerView: 1.6,
    spaceBetween: 14,
    slidesOffsetBefore: CONTAINER_PADDING,
    slidesOffsetAfter: CONTAINER_PADDING,
  },
  768: { slidesPerView: 2, spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
  1024: { slidesPerView: 3, spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
}
</script>

<template>
  <section v-if="displayReviews.length > 0" class="bg-[#FFFAF4] py-16">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-10">
        <h2 class="reviews-title text-gray-900 mb-4">{{ heading }}</h2>
        <p class="body-2-r text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {{ subheading }}
        </p>
      </div>

      <!-- Slider — same card design as the product detail page -->
      <div class="reviews-slider">
        <Swiper
          :modules="modules"
          :breakpoints="breakpoints"
          :space-between="12"
          :slides-per-view="1.1"
          :watch-overflow="true"
          :pagination="{ clickable: true, el: `#${dotsId}` }"
          :navigation="{ prevEl: `#${prevId}`, nextEl: `#${nextId}` }"
          :a11y="{ prevSlideMessage: 'Previous review', nextSlideMessage: 'Next review' }"
        >
          <SwiperSlide v-for="(review, i) in displayReviews" :key="i">
        <article class="review-row">
          <!-- Top: author on the left, rating on the right -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3.5 min-w-0">
              <!-- 44px on screen, so the srcset keeps it to the smallest
                   copy. These were loading the full-size upload — 136KB and
                   171KB for two circles the size of a thumbnail. -->
              <ResponsiveImage
                v-if="review.image"
                :src="review.image"
                :alt="review.name"
                :width="44"
                :height="44"
                sizes="44px"
                img-class="review-row-avatar"
              />
              <span v-else class="review-row-avatar review-row-avatar--initial">{{ initial(review.name) }}</span>
              <div class="min-w-0">
                <p class="review-row-name">{{ review.name }}</p>
                <p v-if="review.city" class="review-row-city">{{ review.city }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <div class="flex gap-1">
                <svg
                  v-for="n in 5"
                  :key="n"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  :fill="n <= (review.rating || 5) ? '#b47f54' : 'none'"
                  stroke="#b47f54"
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
        </article>
          </SwiperSlide>
        </Swiper>

        <!-- Arrows: desktop only, where there is room beside the cards -->
        <button :id="prevId" type="button" class="reviews-arrow reviews-arrow--prev" aria-label="Previous review">
          <ChevronLeft :size="20" />
        </button>
        <button :id="nextId" type="button" class="reviews-arrow reviews-arrow--next" aria-label="Next review">
          <ChevronRight :size="20" />
        </button>
      </div>

      <div :id="dotsId" class="reviews-dots"></div>
    </div>
  </section>
</template>

<style scoped>
.reviews-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .reviews-title {
    font-size: 48px;
  }
}

/* ── Slider frame ─────────────────────────────────────────────
   On phones the track breaks out of the container's 1rem padding so it runs
   to the screen edge; Swiper's slidesOffsetBefore puts the first card back on
   the heading's line, so the peek happens on the right only. */
.reviews-slider {
  position: relative;
  margin-inline: -1rem;
}

@media (min-width: 768px) {
  .reviews-slider {
    margin-inline: 0;
  }
}

/* Cards in a row match the tallest, rather than each shrinking to its text. */
.reviews-slider :deep(.swiper-slide) {
  height: auto;
  display: flex;
}

.reviews-slider :deep(.swiper-slide) > .review-row {
  width: 100%;
}

/* ── Arrows ───────────────────────────────────────────────── */
.reviews-arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid #f0dcc2;
  border-radius: 9999px;
  background-color: #fff;
  color: #5a3a1e;
  box-shadow: 0 2px 10px rgba(139, 105, 20, 0.08);
  transform: translateY(-50%);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
}

@media (min-width: 1024px) {
  .reviews-arrow {
    display: flex;
  }
}

.reviews-arrow:hover {
  border-color: #d8a877;
  color: #2c1a0e;
  box-shadow: 0 6px 18px rgba(139, 105, 20, 0.16);
}

.reviews-arrow--prev { left: 4px; }
.reviews-arrow--next { right: 4px; }

/* Past the container's 1300px cap there is margin to sit in, so the arrows
   move out of the way of the cards. */
@media (min-width: 1400px) {
  .reviews-arrow--prev { left: -22px; }
  .reviews-arrow--next { right: -22px; }
}

/* Swiper adds this when there is nothing further to move to. */
.reviews-arrow.swiper-button-disabled {
  opacity: 0.35;
  pointer-events: none;
}

/* watchOverflow hides the controls entirely when every card already fits. */
.reviews-arrow.swiper-button-lock {
  display: none;
}

/* ── Dots ─────────────────────────────────────────────────── */
.reviews-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
}

.reviews-dots :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  margin: 0;
  border-radius: 9999px;
  background-color: #e2c8a8;
  opacity: 1;
  transition: width 0.25s ease, background-color 0.25s ease;
}

.reviews-dots :deep(.swiper-pagination-bullet-active) {
  width: 24px;
  background-color: #b47f54;
}

.reviews-dots :deep(.swiper-pagination-lock) {
  display: none;
}

/* Review card — matches the product detail page review row */
.review-row {
  background-color: #fff;
  border: 1px solid #f7e2cb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.review-row:hover {
  border-color: #e9c39c;
  box-shadow: 0 4px 16px rgba(139, 105, 20, 0.1);
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
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c1a0e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-row-city {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
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
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #5a3a1e;
  border-top: 1px solid #fff0df;
  padding-top: 16px;
  margin-top: -4px;
  flex-grow: 1;
}
</style>
