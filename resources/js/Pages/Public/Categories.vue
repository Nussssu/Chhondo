<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue"

defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
    intro: { type: Object, default: () => ({}) },
});
import { Link, usePage } from "@inertiajs/vue3";
import { Head } from "@inertiajs/vue3";
import { computed } from "vue";
import { useHomeStore } from "@/Store/homeStore";

const homeStore = useHomeStore();
const globalCategories = computed(() => usePage().props.globalCategories);

const categories = computed(() => {
  // Prefer globalCategories from Inertia, fallback to homeStore
  if (globalCategories.value?.categories?.length > 0) {
    return globalCategories.value.categories;
  }
  return homeStore.categories || [];
});
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>
  <AppLayout>
    <div class="categories-page">
      <div class="container px-4">
        <!-- Header -->
        <div class="py-8 text-center">
          <h1 class="categories-title">{{ intro?.title || 'ক্যাটাগরি সমূহ' }}</h1>
          <p class="body-1-r text-gray-500 mt-2">{{ intro?.subtitle || 'আপনার পছন্দের ক্যাটাগরি বেছে নিন' }}</p>
        </div>

        <!-- Category Grid -->
        <div class="category-grid pb-10">
          <Link
            v-for="category in categories"
            :key="category.id"
            :href="`/product-category/${category.slug}`"
            class="category-card"
          >
            <div class="category-image-wrap">
              <img
                :src="category.image"
                :alt="category.name"
                class="category-image"
                loading="lazy"
              />
            </div>
            <p class="category-name">{{ category.name }}</p>
          </Link>
        </div>

        <!-- Empty State -->
        <div v-if="categories.length === 0" class="text-center py-20">
          <p class="body-2-r text-gray-400">{{ texts.t2 }}</p>
        </div>
      </div>
    </div>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.categories-page {
  background-color: #FFFAF4;
  min-height: 60vh;
}

.categories-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Grid: 2 columns on mobile */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}

/* Card */
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFF0DF;
  border: 1px solid #f7e2cb;
  border-radius: 16px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.category-card:active {
  transform: scale(0.97);
}

@media (min-width: 768px) {
  .category-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

/* Square image */
.category-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f0ece6;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image {
  transform: scale(1.05);
}

/* Name */
.category-name {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-top: 12px;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .category-name {
    font-size: 18px;
  }
}
</style>
