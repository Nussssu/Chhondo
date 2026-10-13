<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';


const emptyCartIcon = ref('/assets/images/icons/empty-cart.png');


</script>



<template>
  <div class="empty-cart flex items-center justify-center p-4">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-6 w-[300px] mx-auto">
        <img :src="emptyCartIcon" alt="Empty cart" class="mx-auto" />
      </div>
      
      <h1 class="headline-3 mb-6">
        আপনার কার্ট বর্তমানে খালি।
      </h1>
      
      <p class="body-2-r text-gray-600 mb-8 max-w-lg mx-auto">
        চেকআউটে যাওয়ার আগে কার্টে পণ্য যোগ করুন। আমাদের শপ পেজে আপনার পছন্দের অনেক পণ্য পাবেন।
      </p>
      
      <Link href="/shop" 
        class="btn__primary inline-block"
      >
        শপে ফিরে যান
      </Link>
    </div>
  </div>
</template>

<style scoped>
/* The 40px headline wraps to three lines on a phone. */
@media (max-width: 767px) {
  .headline-3 { font-size: 28px; line-height: 36px; }
  /* The page already ends with 48px; no extra gap above the footer. */
  .empty-cart { padding-bottom: 0; }
}
</style>
