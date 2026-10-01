<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue";
import { Head, usePage } from "@inertiajs/vue3";
import { computed } from "vue";
import { Phone, Mail, MapPin } from "lucide-vue-next";

// `content` and `intro` were sent by the controller but never declared, so what
// was written under Content › Pages › Refund policy could not reach the page.
defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
  intro: { type: Object, default: () => ({}) },
});

// Contact details were hardcoded here, and had drifted to a different address
// than the one in Settings. Read the single source instead.
const page = usePage();
const contact = computed(() => page.props.contact ?? {});
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>

  <AppLayout>
    <section class="refund-page py-12 md:py-16">
      <div class="container max-w-4xl mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="headline-1 text-[#3E3C3A]">{{ intro?.title || 'Refund and Returns Policy' }}</h1>
          <p class="body-1-r text-[#6E6C69] mt-4 md:mt-5 leading-relaxed">
            {{ intro?.subtitle || 'চারুকথন বাংলাদেশের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই নিচের রিটার্ন ও রিফান্ড নীতিমালা প্রযোজ্য।' }}
          </p>
        </div>

        <!-- Written in the admin under Content › Pages › Refund policy -->
        <div
          v-if="content"
          class="mt-10 md:mt-12 refund-content body-1-r text-[#666460] leading-relaxed"
          v-html="content"
        ></div>

        <div v-else class="mt-10 md:mt-12 space-y-8 text-[#4A4846]">
          <div>
            <h2 class="body-3-sb">{{ texts.t2 }}</h2>
            <div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed">
              <p>{{ texts.t3 }}</p>
              <p>{{ texts.t4 }}</p>
            </div>
          </div>

          <div>
            <h2 class="body-3-sb">{{ texts.t5 }}</h2>
            <div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed">
              <p>{{ texts.t6 }}</p>
              <p>{{ texts.t7 }}</p>
            </div>
          </div>

          <div>
            <h2 class="body-3-sb">{{ texts.t8 }}</h2>
            <div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed">
              <p>{{ texts.t9 }}</p>
              <p>{{ texts.t10 }}</p>
            </div>
          </div>

          <div>
            <h2 class="body-3-sb">{{ texts.t11 }}</h2>
            <div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed">
              <p>{{ texts.t12 }}</p>
            </div>
          </div>

          <div>
            <h2 class="body-3-sb">{{ texts.t13 }}</h2>
            <div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed">
              <p>{{ texts.t14 }}</p>
            </div>
          </div>
        </div>

        <div v-if="contact.phone || contact.email || contact.address" class="mt-10 md:mt-12">
          <h3 class="body-3-sb text-[#3E3C3A]">{{ texts.t15 }}</h3>
          <div class="mt-4 space-y-3 body-1-r text-[#5F5D59]">
            <p v-if="contact.phone" class="flex items-center gap-2">
              <Phone class="w-[15px] h-[15px] shrink-0" />
              <span dir="ltr">{{ contact.phone }}</span>
            </p>
            <p v-if="contact.email" class="flex items-center gap-2">
              <Mail class="w-[15px] h-[15px] shrink-0" />
              <span>{{ contact.email }}</span>
            </p>
            <p v-if="contact.address" class="flex items-center gap-2">
              <MapPin class="w-[15px] h-[15px] shrink-0" />
              <span>{{ contact.address }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.refund-page {
  background-color: #fffaf4;
}

.refund-content :deep(h2),
.refund-content :deep(h3) {
  margin: 22px 0 8px;
  font-weight: 600;
  color: #3e3c3a;
}

.refund-content :deep(p) { margin-bottom: 10px; }
.refund-content :deep(ul) { margin: 0 0 10px 20px; list-style: disc; }

@media (max-width: 767px) {
  .refund-page :deep(.headline-1) {
    font-size: 30px;
    line-height: 35px;
    max-width: 300px;
    margin-inline: auto;
  }
}
</style>
