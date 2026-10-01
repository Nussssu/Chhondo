<script setup>

import AppLayout from '@/Layouts/AppLayout.vue'
import PageBlocks from "@/components/Page/PageBlocks.vue"

defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
})
import CheckoutForm from '@/components/Checkout/CheckoutForm.vue';
import { Head } from '@inertiajs/vue3';

</script>


<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>
  <AppLayout>
    <!-- Breadcrumb -->
    <div class="bg-[#FFFAF4] py-4">
      <div class="container max-w-6xl mx-auto">
        <nav class="flex items-center gap-2 text-sm text-gray-400">
          <a href="/" class="hover:text-gray-600 transition-colors">{{ texts.t2 }}</a>
          <span>></span>
          <span class="text-gray-800 font-medium">{{ texts.t1 }}</span>
        </nav>
      </div>
    </div>
    <div class="checkout-page-wrap">
      <CheckoutForm />
    </div>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.checkout-page-wrap {
  background-color: #FFFAF4;
  min-height: 60vh;
}
</style>
