<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head, Link } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>Page not found</title>
  </Head>

  <AppLayout>
    <div class="notfound">
      <img
        :src="'/assets/images/errors/404-graphic.png'"
        alt=""
        aria-hidden="true"
        class="notfound-bg"
      />

      <div class="notfound-content">
        <h1 class="notfound-title">Page not found</h1>
        <p class="notfound-text">
          চারুকথন আমাদের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই
        </p>

        <Link href="/" class="notfound-btn">
          Continue shopping
          <img :src="'/assets/images/errors/chevron-right.svg'" alt="" class="notfound-btn-icon" />
        </Link>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.notfound {
  position: relative;
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fffaf4;
  overflow: hidden;
  padding: 48px 20px;
}

.notfound-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 1017px);
  height: auto;
  user-select: none;
  pointer-events: none;
}

.notfound-content {
  position: relative;
  text-align: center;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.notfound-title {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: clamp(34px, 6vw, 56px);
  line-height: 1.21;
  color: #1c330d;
}

.notfound-text {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #6d6560;
}

.notfound-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  background: #356019;
  color: #fff;
  font-family: "Manrope", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  border-radius: 8px;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.notfound-btn:hover {
  background: #2a4d14;
}

.notfound-btn-icon {
  width: 7px;
  height: 12px;
}
</style>
