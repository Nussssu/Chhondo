<script setup>

import AppLayout from '@/Layouts/AppLayout.vue'
import PageBlocks from "@/components/Page/PageBlocks.vue"

defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  intro: { type: Object, default: () => ({}) },
})
import ShoppingCart from '@/components/Cart/ShoppingCart.vue'
import { Head } from '@inertiajs/vue3';

</script>


<template>  
  <Head>
    <title>{{ texts.tab_title }}</title>
  </Head>
  <AppLayout>
    <div class="cartPage">
      <ShoppingCart />
    </div>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>