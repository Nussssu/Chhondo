<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';


const emptyCartIcon = ref('/assets/images/icons/empty-cart.png');


</script>



<template>
  <div class=" flex items-center justify-center p-4">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-6 w-[300px] mx-auto">
        <img :src="emptyCartIcon" alt="Empty cart" class="mx-auto" />
      </div>
      
      <h1 class="headline-3 mb-6">
        Your cart is currently empty.
      </h1>
      
      <p class="body-2-r text-gray-600 mb-8 max-w-lg mx-auto">
        Before proceed to checkout you must add some products to your shopping cart. 
        You will find a lot of interesting products on our "Shop" page.
      </p>
      
      <Link href="/shop" 
        class="btn__primary inline-block"
      >
        RETURN TO SHOP
      </Link>
    </div>
  </div>
</template>