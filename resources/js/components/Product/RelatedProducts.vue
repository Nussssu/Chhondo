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
  <div v-if="hasProducts" class="bg-[#FFFAF4] py-12 md:py-16">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-8 md:mb-12">
        <h2 class="related-title">আপনার পছন্দ হতে পারে</h2>
        <p class="related-subtitle">
          প্রিমিয়াম কোয়ালিটির শাড়ি, হস্তনির্মিত নকশা এবং ঐতিহ্যবাহী কারুশিল্পের এক অনন্য সংগ্রহ।
        </p>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1300px] mx-auto">
        <CollectionCard
          v-for="product in displayProducts"
          :key="product.id"
          :product="product"
          :openPreview="openPreview"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.related-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: #3c3834;
}

.related-subtitle {
  max-width: 640px;
  margin: 16px auto 0;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6d6560;
}

@media (min-width: 768px) {
  .related-title {
    font-size: 56px;
    line-height: 68px;
  }
}
</style>
