<script setup>
/**
 * A page the shop created in Content › Pages.
 *
 * It has no wording of its own to fall back on — every word on it was written
 * in the editor — so the header only draws when a title was set, and the body
 * is whatever widgets the page holds.
 */
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head } from "@inertiajs/vue3"
import { rebrand } from "@/utils/rebrand"

defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  label: { type: String, default: "" },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
})
</script>

<template>
  <Head>
    <title>{{ metaTitle || title }}</title>
    <meta v-if="metaDescription" name="description" :content="metaDescription" />
  </Head>

  <AppLayout>
    <section v-if="title || subtitle" class="cp-header py-12 md:py-16">
      <div class="container max-w-4xl mx-auto px-4 text-center">
        <span v-if="label" class="cp-label">{{ label }}</span>
        <h1 v-if="title" class="headline-1 text-[#3E3C3A]">{{ title }}</h1>
        <p v-if="subtitle" class="body-1-r text-[#6E6C69] mt-4 leading-relaxed">{{ subtitle }}</p>
      </div>
    </section>

    <section v-if="content" class="cp-body">
      <div class="container max-w-4xl mx-auto px-4">
        <div class="cp-content body-1-r text-[#666460] leading-relaxed" v-html="rebrand(content)"></div>
      </div>
    </section>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.cp-header,
.cp-body {
  background-color: #fffaf4;
}

.cp-body {
  padding-bottom: 3rem;
}

.cp-label {
  display: block;
  margin-bottom: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a08a6a;
}

@media (max-width: 767px) {
  .cp-header :deep(.headline-1) {
    font-size: 30px;
    line-height: 35px;
  }
}

.cp-content :deep(h1),
.cp-content :deep(h2),
.cp-content :deep(h3),
.cp-content :deep(h4) {
  font-weight: 600;
  color: #4a4846;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.cp-content :deep(p) {
  margin-bottom: 0.5rem;
}

.cp-content :deep(ul),
.cp-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.cp-content :deep(li) {
  margin-bottom: 0.25rem;
}
</style>
