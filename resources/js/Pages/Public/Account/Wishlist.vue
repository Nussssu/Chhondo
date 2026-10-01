<template>
  <Head>
    <title>My Wishlist</title>
  </Head>

  <AccountLayout>
    <ProductPreviewModal :isOpen="isModalOpen" :product="selectedProduct" @close="isModalOpen = false" />

    <div class="wishlist-page">
      <div class="section-header">
        <span class="section-header-icon">
          <img :src="'/assets/images/account/nav-wishlist.svg'" alt="" />
        </span>
        <div>
          <p class="section-header-title">Wishlist</p>
          <p class="section-header-subtitle">পছন্দের তালিকা</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="wishlist-empty">
        <div class="wishlist-empty-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <p class="wishlist-empty-text">Your wishlist is empty.</p>
        <Link href="/shop" class="wishlist-shop-btn">Continue shopping</Link>
      </div>

      <!-- Wishlist grid -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <CollectionCard
          v-for="item in items"
          :key="item.id"
          :product="item.product"
          :openPreview="openPreview"
        />
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from '@/Layouts/AccountLayout.vue';
import CollectionCard from '@/components/Product/CollectionCard.vue';
import ProductPreviewModal from '@/components/Product/ProductPreviewModel.vue';
import { Head, Link } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { useWishlistStore } from '@/Store/wishlistStore';

const props = defineProps({
  wishlist: {
    type: Array,
    default: () => [],
  },
});

const wishlistStore = useWishlistStore();

// Filtered live against the store so un-hearting a card (via CollectionCard)
// removes it from this list immediately instead of waiting for a reload.
const items = computed(() => props.wishlist.filter((item) => wishlistStore.isWishlisted(item.product)));

const isModalOpen = ref(false);
const selectedProduct = ref(null);
const openPreview = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};
</script>

<style scoped>
.wishlist-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #d4e0c8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header-icon img {
  width: 18px;
  height: 18px;
}

.section-header-title {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #2c1a0e;
}

.section-header-subtitle {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

/* The parent is a column flex container, so relying on text-align alone left
   this sitting wherever the flex item happened to land. Centre the box itself,
   on both axes, and give it room to sit in. */
.wishlist-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 46vh;
  padding: 32px 16px;
  text-align: center;
}

.wishlist-empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  margin: 0 0 16px;
  border-radius: 9999px;
  background: #ecf1e8;
  color: #356019;
}

.wishlist-empty-text {
  font-family: "DM Sans", "Poppins", sans-serif;
  color: #7a5c3e;
  margin: 0 0 16px;
}

.wishlist-shop-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #356019;
  color: #fff;
  font-family: "Manrope", "Poppins", sans-serif;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.wishlist-shop-btn:hover {
  background: #2a4d14;
}
</style>
