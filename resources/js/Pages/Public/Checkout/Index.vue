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
import { on, shown } from '@/utils/cms';

</script>


<template>
  <Head>
    <title>{{ texts.tab_title }}</title>
  </Head>
  <AppLayout>
    <!-- Breadcrumb -->
    <div class="checkout-breadcrumb-wrap">
      <div class="container">
        <!-- Figma: Li Ador 20/28, Black/400 links, chevrons, Black/900 current -->
        <nav v-if="on(texts.breadcrumb_show)" class="checkout-breadcrumb" aria-label="Breadcrumb">
          <template v-for="(crumb, i) in shown(texts.crumbs)" :key="i">
            <a :href="crumb.url || '/shop'" class="checkout-breadcrumb-link">{{ crumb.label }}</a>
            <img :src="'/assets/chhondo/chevron.svg'" alt="" />
          </template>
          <span class="checkout-breadcrumb-current">{{ texts.crumb_current }}</span>
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
  background-color: #fff;
  min-height: 60vh;
}

.checkout-breadcrumb-wrap { padding-top: 64px; }
.checkout-breadcrumb { display: flex; align-items: center; gap: 8px; color: #9c9591; }
.checkout-breadcrumb-link,
.checkout-breadcrumb-current { font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif; font-size: 20px; line-height: 28px; }
.checkout-breadcrumb-link { color: #9c9591; transition: color .2s ease; }
.checkout-breadcrumb-link:hover { color: #cc9b25; }
.checkout-breadcrumb-current { color: #1a1817; }

@media (max-width: 767px) {
  .checkout-breadcrumb-wrap { padding-top: 24px; }
  .checkout-breadcrumb-wrap .container { padding-inline: 20px; }
  .checkout-breadcrumb-link,
  .checkout-breadcrumb-current { font-size: 16px; line-height: 24px; }
}
</style>
