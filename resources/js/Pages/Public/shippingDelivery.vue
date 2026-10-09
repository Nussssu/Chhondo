<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue";
import PolicyLayout from "@/components/Page/PolicyLayout.vue";
import { Head } from "@inertiajs/vue3";
import { computed } from "vue";
import { on, plain, shown } from "@/utils/cms";

const props = defineProps({
  // Content › Pages: the heading and intro come from "Page header", the
  // sections and contact block from their own cards.
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
});

const t = computed(() => props.texts || {});

// One bullet per line of "Points".
const sections = computed(() =>
  on(t.value.sections_show) === false ? [] : shown(t.value.sections).map((row) => ({
    title: row.title,
    lines: String(row.lines || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
  })),
);

const contact = computed(() => ({
  title: t.value.contact_title,
  address: on(t.value.contact_address_show) ? t.value.contact_address : "",
  email: on(t.value.contact_email_show) ? t.value.contact_email : "",
  phone: on(t.value.contact_phone_show) ? t.value.contact_phone : "",
  locationIcon: "/assets/chhondo/refund-location.svg",
  emailIcon: "/assets/chhondo/refund-email.svg",
  phoneIcon: "/assets/chhondo/refund-phone.svg",
}));

// Headings and text are laid out by PolicyLayout; any other widget (an image,
// a video) still renders after it.
const otherBlocks = computed(() =>
  (props.blocks ?? []).filter((block) => !["heading", "text"].includes(block.type)),
);
</script>

<template>
  <Head>
    <title>{{ plain(t.tab_title) }}</title>
  </Head>

  <AppLayout>
    <!-- The standard policy header (as Privacy / Terms): title, then the body -->
    <PolicyLayout
      :title="intro.title || plain(t.tab_title)"
      :subtitle="intro.subtitle"
      :sections="sections"
      :show-contact="on(t.contact_show)"
      :contact-details="contact"
    />

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="otherBlocks" />
  </AppLayout>
</template>
