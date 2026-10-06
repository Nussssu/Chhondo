<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue";
import PolicyLayout from "@/components/Page/PolicyLayout.vue";
import { Head } from "@inertiajs/vue3";
import { computed } from "vue";
import { plain } from "@/utils/cms";

const props = defineProps({
  // Wording for this page, editable in Content › Pages.
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
});

// Headings and text are laid out by PolicyLayout; any other widget (an image,
// a video) still renders after it.
const otherBlocks = computed(() =>
  (props.blocks ?? []).filter((block) => !["heading", "text"].includes(block.type)),
);
</script>

<template>
  <Head>
    <title>{{ plain(texts.tab_title) }}</title>
  </Head>

  <AppLayout>
    <PolicyLayout
      :title="intro.title || plain(texts.tab_title)"
      :subtitle="intro.subtitle"
      :blocks="blocks"
      :content="content"
    />

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="otherBlocks" />
  </AppLayout>
</template>
