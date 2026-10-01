<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue";
import { Head } from "@inertiajs/vue3";

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
    intro: { type: Object, default: () => ({}) },
    blocks: { type: Array, default: () => [] },
    content: String,
});
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>

  <AppLayout>
    <section class="privacy-page py-12 md:py-16">
      <div class="container max-w-4xl mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="headline-1 text-[#3E3C3A]">{{ intro?.title || 'Privacy Policy' }}</h1>
          <p v-if="intro?.subtitle" class="body-1-r text-[#6E6C69] mt-4 leading-relaxed">{{ intro.subtitle }}</p>
        </div>

        <div class="mt-10 md:mt-12 privacy-content body-1-r text-[#666460] leading-relaxed" v-html="content"></div>
      </div>
    </section>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.privacy-page {
  background-color: #fffaf4;
}

@media (max-width: 767px) {
  .privacy-page :deep(.headline-1) {
    font-size: 30px;
    line-height: 35px;
    max-width: 300px;
    margin-inline: auto;
  }
}

.privacy-content :deep(h1),
.privacy-content :deep(h2),
.privacy-content :deep(h3),
.privacy-content :deep(h4) {
  font-weight: 600;
  color: #4A4846;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.privacy-content :deep(p) {
  margin-bottom: 0.5rem;
}

.privacy-content :deep(ul),
.privacy-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.privacy-content :deep(li) {
  margin-bottom: 0.25rem;
}
</style>
