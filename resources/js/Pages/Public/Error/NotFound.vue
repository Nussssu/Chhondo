<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head, Link } from '@inertiajs/vue3'
import { on } from '@/utils/cms'

// Content › Pages › 404 page.
defineProps({
  texts: { type: Object, default: () => ({}) },
})
</script>

<template>
  <Head>
    <title>{{ texts.title }}</title>
  </Head>

  <AppLayout>
    <!-- Figma "404 page": a 5% "404" behind the copy -->
    <div class="notfound">
      <div class="notfound-stage">
        <img
          :src="'/assets/chhondo/404-backdrop.svg'"
          alt=""
          aria-hidden="true"
          class="notfound-bg"
        />

        <div class="notfound-content">
          <h1 class="notfound-title">{{ texts.title }}</h1>
          <p v-if="on(texts.text_show)" class="notfound-text">{{ texts.text }}</p>

          <Link v-if="on(texts.button_show)" :href="texts.button_url || '/'" class="notfound-btn">
            {{ texts.button_label }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.notfound { padding: 160px 20px 248px; background: #fff; }

/* 1016 × 400 stage; the copy sits 106/116px inside it */
.notfound-stage {
  position: relative;
  max-width: 1016px;
  margin: 0 auto;
  padding: 106px 116px;
}
.notfound-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: .05;
  pointer-events: none;
}

.notfound-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  text-align: center;
}
.notfound-title {
  margin: 0 0 -20px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}
.notfound-text {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}

/* Green/700, 44px, r8, Li Ador SB 16/24 + chevron */
.notfound-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  background: #1a2110;
  color: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  transition: background-color .2s ease, transform .2s ease;
}
.notfound-btn:hover { background: #252f17; transform: translateY(-2px); }

@media (max-width: 767px) {
  .notfound { padding: 64px 20px 48px; }
  .notfound-stage { padding: 48px 0; }
  .notfound-title { font-size: 32px; line-height: 40px; margin-bottom: -16px; }
}
</style>
