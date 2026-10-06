<script setup>
import { computed } from "vue"
import CollectionCard from "@/components/Product/CollectionCard.vue"

const props = defineProps({
  related_products: {
    type: Object,
    required: true,
    default: () => [],
  },
  openPreview: {
    type: Function,
    default: null,
  },
})

const hasProducts = computed(() => props.related_products && props.related_products.length > 0)

// One design row of 3 cards
const displayProducts = computed(() => {
  if (!props.related_products) return []
  // Four fill the row on desktop; the server sends up to eight.
  return props.related_products.slice(0, 4)
})
</script>

<template>
  <div v-if="hasProducts" class="related-section">
    <div class="container">
      <!-- Section Header — Figma "আপনার ভালো লাগতে পারে" -->
      <div class="related-head">
        <h2 class="related-title">আপনার ভালো <span class="related-accent">লাগতে পারে</span></h2>
        <p class="related-subtitle">
          নিত্যদিনের স্বাচ্ছন্দ্য আর স্নিগ্ধতার ছন্দে বোনা আরও কিছু শাড়ি
        </p>
      </div>

      <!-- Product Grid -->
      <div class="related-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <CollectionCard
          v-for="product in displayProducts"
          :key="product.id"
          :product="product"
          button-label="কার্টে রাখুন"
          :openPreview="openPreview"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.related-section { background: #fff; padding: 132px 0; }
.related-head { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 48px; text-align: center; }
.related-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  color: #1a1817;
}
.related-accent { color: #cc9b25; }
.related-subtitle {
  max-width: 640px;
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #3c3834;
}
.related-grid { gap: 20px; }

@media (min-width: 768px) {
  .related-title { font-size: 56px; line-height: 68px; }
}
@media (max-width: 767px) {
  .related-section { padding: 48px 0; }
  .related-section .container { padding-inline: 20px; }
  .related-head { margin-bottom: 32px; }
  .related-grid { gap: 12px; }
}
</style>
