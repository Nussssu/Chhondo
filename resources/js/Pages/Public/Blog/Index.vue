<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import { rebrand } from "@/utils/rebrand"
import { on } from "@/utils/cms"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head, Link, router } from "@inertiajs/vue3"
import { computed } from "vue"

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  intro: { type: Object, default: () => ({}) },
  posts: { type: Object, default: () => ({ data: [], links: [] }) },
  categories: { type: Array, default: () => [] },
  activeCategory: { type: String, default: null },
})

const items = computed(() => props.posts?.data ?? [])
const featured = computed(() => items.value[0] ?? null)
const rest = computed(() => items.value.slice(1))

// Page 2 onwards has no "featured" post — the lead card belongs to page one.
const onFirstPage = computed(() => (props.posts?.current_page ?? 1) === 1)
const gridPosts = computed(() => (onFirstPage.value ? rest.value : items.value))

function formatDate(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function filterBy(slug) {
  router.get("/blog", slug ? { category: slug } : {}, {
    preserveScroll: true,
    preserveState: true,
  })
}
</script>

<template>
  <Head>
    <title>{{ texts.tab_title }}</title>
    <meta
      name="description"
      :content="texts.meta_description"
    />
  </Head>

  <AppLayout>
    <section class="blog-page">
      <div class="container">
        <!-- Header -->
        <header class="blog-hero">
          <span v-if="intro?.label !== ''" class="blog-eyebrow">
            {{ intro?.label || 'ছন্দ ব্লগ' }}
          </span>
          <h1 class="blog-hero-title">{{ intro?.title || 'গল্প, যত্ন আর ঐতিহ্যের কথা' }}</h1>
          <p class="blog-hero-sub">
            {{ intro?.subtitle || 'শাড়ির যত্ন নেওয়ার সহজ উপায়, উৎসবের সাজ আর আমাদের তাঁতিদের হাতের গল্প — সবই এক জায়গায়।' }}
          </p>
        </header>

        <!-- Category filter -->
        <template v-if="on(texts.listing_show)">
        <nav v-if="categories.length" class="blog-filters">
          <button
            type="button"
            class="blog-chip"
            :class="{ 'is-active': !activeCategory }"
            @click="filterBy(null)"
          >{{ texts.t2 }}</button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="blog-chip"
            :class="{ 'is-active': activeCategory === cat.slug }"
            @click="filterBy(cat.slug)"
          >
            {{ cat.name }}
          </button>
        </nav>

        <!-- Empty -->
        <p v-if="!items.length" class="blog-empty">{{ texts.t3 }}</p>

        <!-- Featured -->
        <Link
          v-if="featured && onFirstPage"
          :href="`/blog/${featured.slug}`"
          class="blog-featured"
        >
          <div class="blog-featured-media">
            <img :src="featured.image" :alt="featured.title" loading="lazy" />
          </div>
          <div class="blog-featured-body">
            <span v-if="featured.category" class="blog-tag">{{ featured.category.name }}</span>
            <h2 class="blog-featured-title">{{ featured.title }}</h2>
            <p class="blog-featured-excerpt">{{ featured.excerpt }}</p>
            <div class="blog-meta">
              <span>{{ formatDate(featured.published_at) }}</span>
              <span class="blog-meta-dot"></span>
              <span>{{ featured.reading_time }} {{ texts.t5 }}</span>
            </div>
            <span class="blog-readmore">{{ texts.t4 }}</span>
          </div>
        </Link>

        <!-- Grid -->
        <div v-if="gridPosts.length" class="blog-grid">
          <Link
            v-for="post in gridPosts"
            :key="post.id"
            :href="`/blog/${post.slug}`"
            class="blog-card"
          >
            <div class="blog-card-media">
              <img :src="post.image" :alt="post.title" loading="lazy" />
              <span v-if="post.category" class="blog-tag blog-tag--float">
                {{ post.category.name }}
              </span>
            </div>
            <div class="blog-card-body">
              <h3 class="blog-card-title">{{ rebrand(post.title) }}</h3>
              <p class="blog-card-excerpt">{{ rebrand(post.excerpt) }}</p>
              <div class="blog-meta">
                <span>{{ formatDate(post.published_at) }}</span>
                <span class="blog-meta-dot"></span>
                <span>{{ post.reading_time }} {{ texts.t5 }}</span>
              </div>
            </div>
          </Link>
        </div>

        <!-- Pagination -->
        <nav v-if="posts.last_page > 1" class="blog-pagination">
          <template v-for="link in posts.links" :key="link.label">
            <Link
              v-if="link.url"
              :href="link.url"
              class="blog-page-btn"
              :class="{ 'is-active': link.active }"
              preserve-scroll
              v-html="link.label"
            />
            <span v-else class="blog-page-btn is-disabled" v-html="link.label" />
          </template>
        </nav>
        </template>
      </div>
    </section>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.blog-page {
  /* 48px at the foot: the gap every phone page keeps above the footer. */
  padding: 40px 0 48px;
  background: #fffaf4;
}

@media (min-width: 768px) {
  .blog-page {
    padding: 56px 0 80px;
  }
}

/* ===== Hero ===== */
.blog-hero {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.blog-eyebrow {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: #f3e9dd;
  color: #80532e;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.blog-hero-title {
  margin-top: 14px;
  font-family: "Sora", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 42px;
  color: #3e3c3a;
}

.blog-hero-sub {
  margin-top: 12px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 28px;
  color: #6b5f54;
}

@media (min-width: 768px) {
  .blog-hero-title {
    font-size: 44px;
    line-height: 58px;
  }
}

/* ===== Filters ===== */
.blog-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 28px 0 32px;
}

.blog-chip {
  height: 38px;
  padding: 0 18px;
  border: 1px solid #e6dbcd;
  border-radius: 999px;
  background: #fff;
  color: #6b5f54;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.blog-chip:hover {
  border-color: #c9a87c;
  color: #3e3c3a;
}

.blog-chip.is-active {
  background: #2c5015;
  border-color: #2c5015;
  color: #fff;
}

.blog-empty {
  padding: 48px 0;
  text-align: center;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #8b7f74;
}

/* ===== Shared bits ===== */
.blog-tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  background: #eef4e7;
  color: #2c5015;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.blog-tag--float {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(4px);
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 13px;
  color: #9b8d80;
}

.blog-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: #cbbfb2;
}

/* ===== Featured ===== */
.blog-featured {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  background: #fff;
  border: 1px solid #f0e6d8;
  border-radius: 20px;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.blog-featured:hover {
  box-shadow: 0 16px 40px rgba(128, 83, 46, 0.12);
  transform: translateY(-2px);
}

.blog-featured-media {
  overflow: hidden;
  background: #f5f0eb;
  aspect-ratio: 16 / 10;
}

.blog-featured-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-featured:hover .blog-featured-media img {
  transform: scale(1.04);
}

.blog-featured-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
}

.blog-featured-title {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  color: #3e3c3a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-featured-excerpt {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  line-height: 26px;
  color: #6b5f54;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-readmore {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2c5015;
}

@media (min-width: 900px) {
  .blog-featured {
    grid-template-columns: 1.15fr 1fr;
    align-items: stretch;
  }

  .blog-featured-media {
    aspect-ratio: auto;
    height: 100%;
    /* A fixed band rather than a floor: the card no longer grows to fit
       whatever the image or the copy happens to be. */
    min-height: 320px;
    max-height: 360px;
  }

  .blog-featured-body {
    justify-content: center;
    padding: 40px;
  }

  .blog-featured-title {
    font-size: 28px;
    line-height: 40px;
  }
}

/* ===== Grid ===== */
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 24px;
}

@media (min-width: 640px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-top: 28px;
  }
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
  position: relative;
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
  gap: 10px;
  padding: 18px;
}

.blog-card-title {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 27px;
  color: #3e3c3a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-excerpt {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 24px;
  color: #6b5f54;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Pagination ===== */
.blog-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
}

.blog-page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e6dbcd;
  border-radius: 10px;
  background: #fff;
  color: #6b5f54;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
}

.blog-page-btn:hover {
  border-color: #c9a87c;
}

.blog-page-btn.is-active {
  background: #2c5015;
  border-color: #2c5015;
  color: #fff;
}

.blog-page-btn.is-disabled {
  opacity: 0.4;
}
</style>
