<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import { Head } from "@inertiajs/vue3"

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  content: String,
})
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>

  <AppLayout>
    <section class="about-page min-h-screen py-12 md:py-16">
      <div class="container flex flex-col gap-24">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="headline-1 text-[#3E3C3A]">{{ texts.t2 }}</h1>
          <p class="about-description mt-4">{{ texts.t3 }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div class="rounded-xl overflow-hidden">
            <img
              :src="texts.img_goal"
              alt="Our goal"
              class="w-full h-[260px] md:h-[320px] object-cover"
            />
          </div>
          <div class="md:max-w-[520px]">
            <h2 class="title-1 text-[#3E3C3A]">{{ texts.t4 }}</h2>
            <p class="about-description about-description-left mt-4">{{ texts.t5 }}</p>
          </div>
        </div>

        <div>
          <h2 class="title-1 text-[#3E3C3A] text-center">{{ texts.t6 }}</h2>
          <div
            class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div v-for="(card, i) in texts.cards || []" :key="i" class="about-card">
              <h3 class="body-2-sb text-[#3E3C3A]">{{ card.title }}</h3>
              <p class="about-description mt-2">{{ card.text }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div class="md:max-w-[520px]">
            <h2 class="title-1 text-[#3E3C3A]">{{ texts.t15 }}</h2>
            <p class="about-description about-description-left mt-4">{{ texts.t16 }}</p>
          </div>

          <div class="relative rounded-xl overflow-hidden">
            <img
              :src="texts.img_craft"
              alt="Traditional makeover"
              class="w-full h-[280px] md:h-[350px] object-cover"
            />
          </div>
        </div>

        <div>
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="title-1 text-[#3E3C3A]">{{ texts.t17 }}</h2>
            <p class="about-description mt-3">{{ texts.t18 }}</p>
          </div>

          <div class="mt-6 rounded-xl overflow-hidden">
            <img
              :src="texts.img_daily"
              alt="Daily tradition showcase"
              class="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.about-page {
  background-color: #fffaf4;
}

.about-card {
  background-color: #fef1dd;
  border: 1px solid #f2e3cf;
  border-radius: 8px;
  padding: 18px 16px;
  text-align: center;
  min-height: 146px;
}

.about-description {
  color: var(--Black-500, #6d6560);
  text-align: center;
  font-family: "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.about-description-left {
  text-align: left;
}
</style>
