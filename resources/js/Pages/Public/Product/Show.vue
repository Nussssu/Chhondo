<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import ProductDetail from '@/components/Product/ProductDetail.vue';
import ProductPreviewModal from '@/components/Product/ProductPreviewModel.vue';
import NotFound from '@/components/Error/NotFound.vue';
import { defineProps, ref } from 'vue'
import { Head } from '@inertiajs/vue3';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  related_products: {
    type: Object,
    required: true
  },
  otherInfo: {
    type: Object,
    required: true
  }
});

const isModalOpen = ref(false);
const selectedProduct = ref(null);

const openPreview = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};
</script>

<template>
  <Head>
    <title>{{ product?.meta_title ?? product?.product_name }}</title>
    <meta name="description" :content="product.meta_description ?? product.product_name">
  </Head>
  <AppLayout>
    <!-- Breadcrumb -->
    <div class="bg-[#FFFAF4] pt-8 pb-2 md:pt-12 md:pb-4">
      <div class="container">
        <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
          <a href="/" class="pdp-breadcrumb-link">Home</a>
          <svg class="pdp-breadcrumb-sep" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <a v-if="product?.category" :href="`/product-category/${product.category.slug}`" class="pdp-breadcrumb-link">{{ product.category.name }}</a>
          <svg v-if="product?.category" class="pdp-breadcrumb-sep" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="pdp-breadcrumb-current">{{ product?.product_name }}</span>
        </nav>
      </div>
    </div>

    <div class="product-detail-page">
      <ProductDetail :product="product" :related_products="related_products" :otherInfo="otherInfo" :openPreview="openPreview" />
    </div>
  </AppLayout>
  <ProductPreviewModal
    :isOpen="isModalOpen"
    :product="selectedProduct"
    @close="isModalOpen = false"
  />
</template>

<style scoped>
.product-detail-page {
  background-color: #FFFAF4;
  min-height: 60vh;
}

/* Breadcrumb — Figma: 16/24, links Black/500, current Black/900 */
.pdp-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pdp-breadcrumb-link,
.pdp-breadcrumb-current {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
}

.pdp-breadcrumb-link {
  color: #6d6560;
  transition: color 0.2s ease;
}

.pdp-breadcrumb-link:hover {
  color: #356019;
}

.pdp-breadcrumb-current {
  color: #1a1817;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60vw;
}

.pdp-breadcrumb-sep {
  color: #9c9591;
  flex-shrink: 0;
}
</style>
