<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import { Head, Link } from "@inertiajs/vue3"
import { onBeforeUnmount, onMounted, ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation, Pagination } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const props = defineProps({
  post: { type: Object, required: true },
  related: { type: Array, default: () => [] },
})

/**
 * The header is sticky from 1280px up, so a sidebar stuck to the viewport top
 * slides underneath it. Offset the sticky position by the header's real height
 * (it changes with the top bar and between breakpoints) instead of guessing.
 */
const asideTop = ref("24px")
let observer = null

function updateAsideTop() {
    if (typeof window === "undefined") return

    const header = document.querySelector(".header-sticky")
    const headerIsSticky = window.innerWidth >= 1280 && header

    asideTop.value = headerIsSticky
        ? `${Math.round(header.getBoundingClientRect().height) + 16}px`
        : "24px"
}

onMounted(() => {
    updateAsideTop()
    window.addEventListener("resize", updateAsideTop)

    const header = document.querySelector(".header-sticky")
    if (header && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(updateAsideTop)
        observer.observe(header)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateAsideTop)
    observer?.disconnect()
    observer = null
})

function formatDate(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function share() {
  const url = window.location.href

  if (navigator.share) {
    navigator.share({ title: props.post.title, url }).catch(() => {})
    return
  }

  navigator.clipboard?.writeText(url)
}
</script>

<template>
  <Head>
    <title>{{ post.meta_title || post.title }}</title>
    <meta name="description" :content="post.meta_description || post.excerpt" />
  </Head>

  <AppLayout>
    <article class="post-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="post-crumbs">
          <Link href="/">হোম</Link>
          <span>/</span>
          <Link href="/blog">ব্লগ</Link>
          <span>/</span>
          <span class="post-crumb-current">{{ post.title }}</span>
        </nav>

        <!-- Hero: title and cover share one row on desktop -->
        <div class="post-hero">
          <header class="post-header">
            <Link
              v-if="post.category"
              :href="`/blog?category=${post.category.slug}`"
              class="blog-tag"
            >
              {{ post.category.name }}
            </Link>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span>{{ formatDate(post.published_at) }}</span>
              <span class="post-meta-dot"></span>
              <span>{{ post.reading_time }} মিনিট পড়া</span>
              <button type="button" class="post-share" @click="share">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                শেয়ার
              </button>
            </div>
          </header>

          <!-- Cover -->
          <figure v-if="post.image" class="post-cover">
            <img :src="post.image" :alt="post.title" />
          </figure>
        </div>

        <div class="post-layout">
          <!-- Article -->
          <div class="post-main">
            <div class="post-body" v-html="post.description"></div>

            <!-- Tags -->
            <div v-if="post.tags?.length" class="post-tags">
              <span class="post-tags-label">ট্যাগ</span>
              <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>

            <!-- Back -->
            <div class="post-back">
              <Link href="/blog" class="post-back-btn">← সব লেখা দেখুন</Link>
            </div>
          </div>

          <!-- Sidebar: fills the width the reading column leaves over -->
          <aside class="post-aside" :style="{ '--aside-top': asideTop }">
            <div class="post-aside-card">
              <h2 class="post-aside-title">এই লেখাটি</h2>
              <dl class="post-aside-list">
                <div v-if="post.category">
                  <dt>বিভাগ</dt>
                  <dd>
                    <Link :href="`/blog?category=${post.category.slug}`">{{ post.category.name }}</Link>
                  </dd>
                </div>
                <div>
                  <dt>প্রকাশ</dt>
                  <dd>{{ formatDate(post.published_at) }}</dd>
                </div>
                <div>
                  <dt>পড়তে সময়</dt>
                  <dd>{{ post.reading_time }} মিনিট</dd>
                </div>
              </dl>
              <button type="button" class="post-aside-share" @click="share">
                লেখাটি শেয়ার করুন
              </button>
            </div>

            <div v-if="related.length" class="post-aside-card">
              <h2 class="post-aside-title">পরের লেখা</h2>
              <ul class="post-aside-links">
                <li v-for="item in related" :key="item.id">
                  <Link :href="`/blog/${item.slug}`">
                    <img :src="item.image" :alt="item.title" loading="lazy" />
                    <span>{{ item.title }}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <!-- Related -->
      <section v-if="related.length" class="post-related">
        <div class="container">
          <header class="post-related-head">
            <h2 class="post-related-title">আরও পড়ুন</h2>
            <div class="post-related-nav">
              <button type="button" class="rel-arrow rel-prev" aria-label="আগের লেখা">
                <ChevronLeft :size="18" />
              </button>
              <button type="button" class="rel-arrow rel-next" aria-label="পরের লেখা">
                <ChevronRight :size="18" />
              </button>
            </div>
          </header>

          <!-- Slides run off the canvas on mobile so the next card peeks in -->
          <Swiper
            :modules="[Navigation, Pagination]"
            :space-between="16"
            :slides-per-view="1.15"
            :breakpoints="{
              480: { slidesPerView: 1.6, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }"
            :navigation="{ prevEl: '.rel-prev', nextEl: '.rel-next' }"
            :pagination="{ el: '.rel-dots', clickable: true }"
            class="post-related-swiper"
          >
            <SwiperSlide v-for="item in related" :key="item.id" class="post-related-slide">
              <Link :href="`/blog/${item.slug}`" class="blog-card">
                <div class="blog-card-media">
                  <img :src="item.image" :alt="item.title" loading="lazy" />
                </div>
                <div class="blog-card-body">
                  <span v-if="item.category" class="blog-tag">{{ item.category.name }}</span>
                  <h3 class="blog-card-title">{{ item.title }}</h3>
                  <div class="post-meta">
                    <span>{{ formatDate(item.published_at) }}</span>
                    <span class="post-meta-dot"></span>
                    <span>{{ item.reading_time }} মিনিট পড়া</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          </Swiper>

          <div class="rel-dots"></div>
        </div>
      </section>
    </article>
  </AppLayout>
</template>

<style scoped>
.post-page {
  padding: 24px 0 0;
  background: #fffaf4;
}

/* The page uses the site container, so its edges line up with the header
   and footer; the reading column is capped inside it instead. */
.post-layout {
  margin-top: 36px;
  /* Padding, not margin on the children: the sticky sidebar can travel to the
     bottom of the grid row, so the clearance before the next section has to sit
     outside the row or the card ends up flush against its border. */
  padding-bottom: 48px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;
}

@media (min-width: 1024px) {
  .post-layout {
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 48px;
  }
}

.post-main {
  min-width: 0;
  max-width: 780px;
}

/* ===== Breadcrumb ===== */
.post-crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 13px;
  color: #9b8d80;
}

.post-crumbs a:hover {
  color: #2c5015;
}

.post-crumb-current {
  color: #6b5f54;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Header ===== */
.post-hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
  align-items: stretch;
}

@media (min-width: 900px) {
  .post-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    margin-top: 28px;
  }
}

.post-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
  min-width: 0;
  padding: 4px 0;
}

.blog-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 14px;
  border-radius: 999px;
  background: #eef4e7;
  color: #2c5015;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.post-title {
  font-family: "Sora", "Hind Siliguri", sans-serif;
  font-size: 27px;
  font-weight: 600;
  line-height: 40px;
  color: #3e3c3a;
}

@media (min-width: 768px) {
  .post-title {
    font-size: 38px;
    line-height: 54px;
  }
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 13px;
  color: #9b8d80;
}

.post-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: #cbbfb2;
}

.post-share {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 4px;
  padding: 5px 12px;
  border: 1px solid #e6dbcd;
  border-radius: 999px;
  background: #fff;
  color: #80532e;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.post-share:hover {
  border-color: #c9a87c;
  background: #fdf6ee;
}

/* ===== Cover ===== */
.post-cover {
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #f5f0eb;
  aspect-ratio: 16 / 10;
}

@media (min-width: 900px) {
  /* Fills its column edge to edge, so it lines up with the container — and
     with the header and footer above and below it. */
  .post-cover {
    aspect-ratio: auto;
    height: 100%;
    min-height: 320px;
    max-height: 420px;
  }
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== Body ===== */
.post-body {
  padding: 20px 0 8px;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 17px;
  line-height: 32px;
  color: #4a423b;
}

.post-body :deep(p) {
  margin: 0 0 20px;
}

.post-body :deep(h2) {
  margin: 34px 0 12px;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 34px;
  color: #3e3c3a;
}

.post-body :deep(h3) {
  margin: 26px 0 10px;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #3e3c3a;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 0 0 20px;
  padding-left: 22px;
}

.post-body :deep(ul) {
  list-style: disc;
}

.post-body :deep(ol) {
  list-style: decimal;
}

.post-body :deep(li) {
  margin-bottom: 8px;
}

.post-body :deep(a) {
  color: #2c5015;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-body :deep(blockquote) {
  margin: 26px 0;
  padding: 16px 20px;
  border-left: 3px solid #c9a87c;
  border-radius: 0 12px 12px 0;
  background: #fdf6ee;
  color: #6b5f54;
  font-style: italic;
}

.post-body :deep(blockquote p) {
  margin: 0;
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 14px;
}

/* ===== Tags ===== */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  border-top: 1px solid #f0e6d8;
}

.post-tags-label {
  font-family: "Hind Siliguri", sans-serif;
  font-size: 13px;
  color: #9b8d80;
}

.post-tag {
  padding: 4px 12px;
  border: 1px solid #e6dbcd;
  border-radius: 999px;
  background: #fff;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 13px;
  color: #6b5f54;
}

/* ===== Back ===== */
.post-back {
  padding-bottom: 8px;
}

.post-back-btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border: 1px solid #2c5015;
  border-radius: 10px;
  color: #2c5015;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.post-back-btn:hover {
  background: #2c5015;
  color: #fff;
}

/* ===== Sidebar ===== */
.post-aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 1024px) {
  .post-aside {
    position: sticky;
    top: var(--aside-top, 24px);
    /* Never taller than the space under the header, so long sidebars can
       still scroll rather than clipping their last card. */
    max-height: calc(100vh - var(--aside-top, 24px) - 32px);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .post-aside::-webkit-scrollbar {
    display: none;
  }
}

.post-aside-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #f0e6d8;
  border-radius: 16px;
}

.post-aside-title {
  margin-bottom: 14px;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #3e3c3a;
}

.post-aside-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
}

.post-aside-list dt {
  font-size: 12px;
  color: #9b8d80;
}

.post-aside-list dd {
  font-size: 14px;
  color: #4a423b;
}

.post-aside-list a:hover {
  color: #2c5015;
}

.post-aside-share {
  width: 100%;
  height: 42px;
  margin-top: 18px;
  border: 1px solid #2c5015;
  border-radius: 10px;
  background: #fff;
  color: #2c5015;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.post-aside-share:hover {
  background: #2c5015;
  color: #fff;
}

.post-aside-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-aside-links a {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-aside-links img {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 10px;
  object-fit: cover;
  background: #f5f0eb;
}

.post-aside-links span {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #4a423b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-aside-links a:hover span {
  color: #2c5015;
}

/* ===== Related ===== */
.post-related {
  padding: 40px 0 64px;
  overflow: hidden;
  background: #fdf6ee;
  border-top: 1px solid #f0e6d8;
}

.post-related-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.post-related-title {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #3e3c3a;
}

.post-related-nav {
  display: flex;
  gap: 8px;
}

.rel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e6dbcd;
  border-radius: 999px;
  background: #fff;
  color: #80532e;
  transition: all 0.2s ease;
}

.rel-arrow:hover:not(.swiper-button-disabled) {
  background: #2c5015;
  border-color: #2c5015;
  color: #fff;
}

.rel-arrow.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
}

/* The swiper is allowed to bleed past the container on mobile, so the next
   card is visible off the canvas edge instead of being clipped flush. */
.post-related-swiper {
  overflow: visible;
  padding-bottom: 4px;
}

.post-related-slide {
  height: auto;
}

.post-related-slide > .blog-card {
  height: 100%;
}

.rel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 22px;
}

.rel-dots :deep(.swiper-pagination-bullet) {
  width: 7px;
  height: 7px;
  margin: 0;
  border-radius: 999px;
  background: #d9cbbb;
  opacity: 1;
  transition: all 0.25s ease;
}

.rel-dots :deep(.swiper-pagination-bullet-active) {
  width: 22px;
  background: #2c5015;
}

.blog-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #f0e6d8;
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.blog-card:hover {
  box-shadow: 0 12px 30px rgba(128, 83, 46, 0.1);
  transform: translateY(-2px);
}

.blog-card-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f5f0eb;
}

.blog-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-card:hover .blog-card-media img {
  transform: scale(1.05);
}

.blog-card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
}

.blog-card-title {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 26px;
  color: #3e3c3a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
