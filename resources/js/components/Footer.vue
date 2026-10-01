<script setup>
import { Facebook, Instagram } from "lucide-vue-next"
import { DotLottieVue } from "@lottiefiles/dotlottie-vue"
import { Link, usePage } from "@inertiajs/vue3"
import { useHomeStore } from "@/Store/homeStore"
import { useStoreInfo } from "@/Store/storeInfo"
import { ref, onMounted, computed } from "vue"

const homeStore = useHomeStore()
const storeInfo = useStoreInfo()

// Fetch store data when the component is mounted
onMounted(() => {
  storeInfo.fetchStoreData()
})
const siteInfo = computed(() => storeInfo.storeInfo)
const currentYear = new Date().getFullYear()

// Hide the trust-badge band on the auth pages (login / register).
const page = usePage()
const showTrustBadges = computed(() => {
  const url = page.url || ""
  return !url.startsWith("/login") && !url.startsWith("/register")
})

// Everything below is managed in the admin: Settings › Header & footer.
const footer = computed(() => page.props.layout?.footer ?? {})
const columns = computed(() => footer.value.columns ?? [])
const badges = computed(() => footer.value.badges ?? [])

const badgeLottie = {
  security: "/assets/images/icons/lottieSecurity.lottie",
  support: "/assets/images/icons/lottieCustomerSupport.lottie",
  delivery: "/assets/images/icons/lottieDelivery.lottie",
}

const hoveredBadge = ref(null)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  checkMobile()
  window.addEventListener("resize", checkMobile)
})
</script>

<template>
  <!-- Trust Badges Section (hidden on auth pages) -->
  <div v-if="showTrustBadges && footer.show_badges !== false && badges.length" class="bg-[#FFFAF4] py-16">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(badge, index) in badges"
          :key="index"
          class="trust-badge-card bg-[#FFF5E6] rounded-xl p-8 flex flex-col items-center text-center"
          @mouseenter="hoveredBadge = index"
          @mouseleave="hoveredBadge = null"
        >
          <div class="badge-icon-frame text-theme">
            <DotLottieVue
              v-if="isMobile || hoveredBadge === index"
              class="badge-lottie"
              :class="{ 'badge-lottie--delivery': badge.icon === 'delivery' }"
              :src="badgeLottie[badge.icon] ?? badgeLottie.security"
              autoplay
              loop
            />
            <DotLottieVue
              v-else
              class="badge-lottie"
              :class="{ 'badge-lottie--delivery': badge.icon === 'delivery' }"
              :src="badgeLottie[badge.icon] ?? badgeLottie.security"
            />
          </div>
          <h4 class="title-2 text-gray-800 mb-2">{{ badge.title }}</h4>
          <p class="body-1-r text-gray-500">{{ badge.text }}</p>
        </div>
      </div>
    </div>
  </div>

  <footer class="bg-[#1C330D] text-white">
    <div class="container">
      <div class="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Col 1: Logo + Description + Social (5 columns) -->
        <div class="lg:col-span-5 flex flex-col items-start gap-4">
          <img
            v-if="footer.show_logo !== false"
            :src="homeStore.logo"
            alt="logo"
            class="site-logo brightness-0 invert max-w-[160px]"
          />
          <p v-if="footer.about_text" class="body-1-r text-gray-300 leading-relaxed max-w-[280px]">
            {{ footer.about_text }}
          </p>
          <div>
            <p class="body-2-sb text-white mb-2">{{ footer.follow_label || 'Follow Us' }}</p>
            <div class="flex gap-3" v-if="siteInfo">
              <!-- Facebook -->
              <a
                v-if="siteInfo.facebook_url"
                :href="siteInfo.facebook_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <path
                    d="M33.3333 16.6667C33.3333 7.46667 25.8667 0 16.6667 0C7.46667 0 0 7.46667 0 16.6667C0 24.7333 5.73333 31.45 13.3333 33V21.6667H10V16.6667H13.3333V12.5C13.3333 9.28333 15.95 6.66667 19.1667 6.66667H23.3333V11.6667H20C19.0833 11.6667 18.3333 12.4167 18.3333 13.3333V16.6667H23.3333V21.6667H18.3333V33.25C26.75 32.4167 33.3333 25.3167 33.3333 16.6667Z"
                    fill="white"
                  />
                </svg>
              </a>

              <!-- TikTok -->
              <a
                v-if="siteInfo.tiktok_url"
                :href="siteInfo.tiktok_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M19.9997 3.3335C16.7033 3.3335 13.481 4.31098 10.7402 6.14234C7.99936 7.97369 5.86315 10.5767 4.60169 13.6221C3.34023 16.6675 3.01017 20.0187 3.65326 23.2517C4.29635 26.4847 5.88369 29.4544 8.21457 31.7853C10.5454 34.1162 13.5152 35.7035 16.7482 36.3466C19.9812 36.9897 23.3323 36.6596 26.3777 35.3982C29.4232 34.1367 32.0261 32.0005 33.8575 29.2597C35.6889 26.5188 36.6663 23.2965 36.6663 20.0002C36.6619 15.5812 34.9046 11.3446 31.7799 8.21992C28.6553 5.09527 24.4186 3.33791 19.9997 3.3335ZM29.898 16.1885V17.2652C29.898 17.3476 29.8816 17.4291 29.8495 17.5051C29.8175 17.581 29.7706 17.6497 29.7115 17.7072C29.6525 17.7647 29.5825 17.8098 29.5058 17.8398C29.429 17.8698 29.3471 17.8841 29.2647 17.8818C27.5049 17.7575 25.8214 17.1149 24.4263 16.0352V23.9152C24.426 24.7873 24.2519 25.6506 23.9142 26.4547C23.5765 27.2588 23.0821 27.9876 22.4597 28.5985C21.8322 29.2254 21.0859 29.7208 20.2646 30.0556C19.4432 30.3904 18.5633 30.558 17.6763 30.5485C15.8928 30.5459 14.1809 29.8461 12.9063 28.5985C12.0953 27.7808 11.5112 26.7661 11.2113 25.6542C10.9115 24.5422 10.9063 23.3714 11.1963 22.2568C11.4613 21.1868 11.9963 20.2035 12.7513 19.4018C13.3144 18.7136 14.0241 18.16 14.8287 17.7814C15.6332 17.4027 16.5122 17.2087 17.4013 17.2135H18.768V20.0518C18.7686 20.1343 18.7516 20.2159 18.7182 20.2912C18.6848 20.3666 18.6357 20.434 18.5742 20.4888C18.5127 20.5437 18.4402 20.5849 18.3615 20.6095C18.2829 20.6342 18.1998 20.6418 18.118 20.6318C17.3245 20.3935 16.4694 20.4725 15.7331 20.8523C14.9967 21.2321 14.4366 21.883 14.1708 22.6677C13.9049 23.4525 13.9542 24.3098 14.3081 25.0589C14.662 25.8081 15.293 26.3905 16.068 26.6835C16.518 26.9418 17.0213 27.0935 17.538 27.1285C17.938 27.1452 18.338 27.0952 18.718 26.9752C19.3524 26.7611 19.9042 26.3545 20.2965 25.812C20.6887 25.2694 20.9019 24.618 20.9063 23.9485V9.59016C20.9063 9.43132 20.9693 9.27896 21.0815 9.16649C21.1937 9.05401 21.3458 8.9906 21.5047 8.99016H23.863C24.0162 8.99035 24.1636 9.04916 24.2749 9.15453C24.3861 9.25989 24.4528 9.40383 24.4613 9.55683C24.5473 10.2922 24.7809 11.0027 25.148 11.6456C25.5152 12.2886 26.0084 12.8507 26.598 13.2985C27.3948 13.8966 28.3412 14.2634 29.333 14.3585C29.4816 14.3712 29.6205 14.4373 29.7241 14.5445C29.8276 14.6518 29.8888 14.7929 29.8963 14.9418L29.898 16.1885Z"
                    fill="white"
                  />
                </svg>
              </a>

              <!-- Instagram -->
              <a
                v-if="siteInfo.instagram_url"
                :href="siteInfo.instagram_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M22.6834 20.405C22.6734 20.933 22.5068 21.4461 22.2048 21.8793C21.9028 22.3124 21.4789 22.6462 20.987 22.8382C20.4951 23.0303 19.9573 23.072 19.4416 22.958C18.926 22.844 18.4558 22.5795 18.0907 22.198C17.7256 21.8165 17.482 21.3351 17.3907 20.815C17.2995 20.2949 17.3647 19.7594 17.5781 19.2764C17.7915 18.7933 18.1436 18.3846 18.5896 18.1019C19.0356 17.8191 19.5555 17.6752 20.0834 17.6883C20.7849 17.7143 21.4487 18.0125 21.9341 18.5196C22.4195 19.0268 22.6883 19.703 22.6834 20.405Z"
                    fill="white"
                  />
                  <path
                    d="M24.6054 12.0552H15.5638C14.6691 12.0552 13.8111 12.4106 13.1785 13.0432C12.5458 13.6758 12.1904 14.5338 12.1904 15.4285V24.6735C12.1904 25.1165 12.2777 25.5552 12.4472 25.9644C12.6167 26.3737 12.8652 26.7456 13.1785 27.0588C13.4917 27.3721 13.8636 27.6205 14.2728 27.7901C14.6821 27.9596 15.1208 28.0468 15.5638 28.0468H24.6054C25.0484 28.0468 25.4871 27.9596 25.8963 27.7901C26.3056 27.6205 26.6775 27.3721 26.9907 27.0588C27.304 26.7456 27.5525 26.3737 27.722 25.9644C27.8915 25.5552 27.9788 25.1165 27.9788 24.6735V15.4452C27.9805 15.0009 27.8946 14.5607 27.7259 14.1497C27.5572 13.7387 27.309 13.365 26.9957 13.0501C26.6823 12.7351 26.3098 12.4852 25.8997 12.3144C25.4895 12.1437 25.0497 12.0556 24.6054 12.0552ZM20.0838 24.9268C19.1887 24.947 18.3079 24.7001 17.5538 24.2175C16.7997 23.735 16.2065 23.0386 15.8499 22.2174C15.4933 21.3962 15.3894 20.4874 15.5516 19.6069C15.7138 18.7265 16.1346 17.9143 16.7604 17.274C17.3862 16.6338 18.1886 16.1945 19.0651 16.0123C19.9417 15.8301 20.8527 15.9131 21.6818 16.2509C22.5109 16.5887 23.2206 17.1659 23.7202 17.9088C24.2199 18.6516 24.4869 19.5266 24.4871 20.4218C24.4944 21.0069 24.3862 21.5877 24.1687 22.1309C23.9512 22.6741 23.6288 23.1691 23.2198 23.5876C22.8108 24.006 22.3233 24.3397 21.7851 24.5695C21.247 24.7993 20.6689 24.9208 20.0838 24.9268ZM24.9771 15.9185C24.8671 15.9185 24.7582 15.8966 24.6568 15.854C24.5555 15.8114 24.4636 15.7491 24.3866 15.6705C24.3096 15.592 24.2491 15.4989 24.2085 15.3966C24.168 15.2944 24.1482 15.1851 24.1504 15.0752C24.1504 14.8515 24.2393 14.637 24.3974 14.4788C24.5556 14.3207 24.7701 14.2318 24.9938 14.2318C25.2174 14.2318 25.4319 14.3207 25.5901 14.4788C25.7482 14.637 25.8371 14.8515 25.8371 15.0752C25.8404 15.1942 25.818 15.3126 25.7713 15.4222C25.7246 15.5318 25.6548 15.63 25.5666 15.71C25.4784 15.7901 25.374 15.8502 25.2605 15.8862C25.1469 15.9222 25.027 15.9332 24.9088 15.9185H24.9771Z"
                    fill="white"
                  />
                  <path
                    d="M20.0832 3.33322C15.6629 3.31112 11.4149 5.04587 8.2737 8.15584C5.13246 11.2658 3.35532 15.4963 3.33322 19.9165C3.31112 24.3368 5.04587 28.5848 8.15584 31.7261C11.2658 34.8673 15.4963 36.6444 19.9165 36.6665C22.1052 36.6775 24.2747 36.2572 26.3009 35.4298C28.3272 34.6023 30.1707 33.3838 31.7261 31.8439C33.2815 30.304 34.5183 28.4728 35.366 26.4549C36.2137 24.437 36.6556 22.2719 36.6665 20.0832C36.6775 17.8945 36.2572 15.7251 35.4298 13.6988C34.6023 11.6725 33.3838 9.82908 31.8439 8.2737C30.304 6.71831 28.4728 5.48147 26.4549 4.63378C24.437 3.78609 22.2719 3.34416 20.0832 3.33322ZM30.2049 24.5032C30.2095 25.2509 30.0657 25.9921 29.7818 26.6839C29.4978 27.3756 29.0794 28.0041 28.5507 28.5329C28.0221 29.0617 27.3937 29.4803 26.7021 29.7645C26.0104 30.0486 25.2693 30.1926 24.5215 30.1882H15.6482C14.9005 30.1929 14.1593 30.049 13.4676 29.7651C12.7758 29.4811 12.1474 29.0627 11.6186 28.5341C11.0897 28.0054 10.6711 27.3771 10.387 26.6854C10.1028 25.9938 9.95879 25.2526 9.96322 24.5049V15.6299C9.95857 14.8822 10.1024 14.141 10.3863 13.4492C10.6703 12.7575 11.0887 12.129 11.6174 11.6002C12.146 11.0714 12.7744 10.6528 13.466 10.3686C14.1577 10.0845 14.8988 9.94046 15.6465 9.94488H24.5215C25.2691 9.94046 26.0102 10.0844 26.7017 10.3685C27.3932 10.6525 28.0215 11.071 28.5501 11.5996C29.0788 12.1283 29.4972 12.7565 29.7813 13.4481C30.0653 14.1396 30.2093 14.8806 30.2049 15.6282V24.5032Z"
                    fill="white"
                  />
                </svg>
              </a>

              <!-- YouTube -->
              <a
                v-if="siteInfo.youtube_url"
                :href="siteInfo.youtube_url"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 3.333C10.795 3.333 3.333 10.795 3.333 20S10.795 36.667 20 36.667 36.667 29.205 36.667 20 29.205 3.333 20 3.333Zm8.63 21.4a2.26 2.26 0 0 1-1.59 1.597c-1.404.378-7.04.378-7.04.378s-5.635 0-7.039-.378a2.26 2.26 0 0 1-1.59-1.598c-.376-1.41-.376-4.35-.376-4.35s0-2.942.376-4.352a2.26 2.26 0 0 1 1.59-1.597c1.404-.378 7.04-.378 7.04-.378s5.635 0 7.039.378a2.26 2.26 0 0 1 1.59 1.597c.376 1.41.376 4.351.376 4.351s0 2.941-.376 4.351Z"
                    fill="white"
                  />
                  <path d="M18.182 23.06 22.89 20.38l-4.708-2.68v5.36Z" fill="white" />
                </svg>
              </a>

              <!-- X -->
              <a
                v-if="siteInfo.x_url"
                :href="siteInfo.x_url"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path
                    d="M17 0C7.611 0 0 7.611 0 17s7.611 17 17 17 17-7.611 17-17S26.389 0 17 0Zm5.032 25.5-4.79-6.98-5.86 6.98H9.087l7.062-8.41L9 8.5h5.968l4.44 6.47 5.43-6.47h1.296l-6.14 7.313L28 25.5h-5.968Z"
                    fill="white"
                  />
                  <path
                    d="m11.53 9.72 10.31 14.56h1.836L13.366 9.72H11.53Z"
                    fill="#1D2226"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Link columns + contact, all managed in the admin -->
        <div class="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div v-for="(column, ci) in columns" :key="ci">
            <h3 v-if="column.title" class="body-2-sb text-white mb-5">{{ column.title }}</h3>
            <ul class="space-y-3">
              <li v-for="(link, li) in column.links ?? []" :key="li">
                <Link
                  :href="link.url"
                  class="body-1-r text-gray-300 hover:text-white transition-colors"
                >
                  {{ link.label }}
                </Link>
              </li>
            </ul>
          </div>

          <div v-if="footer.show_contact !== false" class="col-span-2 md:col-span-1">
            <h3 class="body-2-sb text-white mb-5">{{ footer.contact_title || 'Contact Us' }}</h3>
            <ul class="space-y-4" v-if="siteInfo">
              <!-- Email -->
              <li>
                <a
                  class="flex items-start gap-2 text-gray-300 hover:text-white transition-colors body-1-r"
                  :href="`mailto:${siteInfo.store_email}`"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="shrink-0 mt-0.5"
                  >
                    <path
                      d="M4 9L10.2 13.65C11.2667 14.45 12.7333 14.45 13.8 13.65L20 9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 9.2C3 8.45 3.4 7.78 4.03 7.43L11.03 3.54C11.63 3.2 12.37 3.2 12.97 3.54L19.97 7.43C20.6 7.78 21 8.45 21 9.18V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V9.18Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  <span>{{ siteInfo.store_email }}</span>
                </a>
              </li>

              <!-- Phone -->
              <li>
                <a
                  class="flex items-start gap-2 text-gray-300 hover:text-white transition-colors body-1-r"
                  :href="`tel:${siteInfo.phone_number}`"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="shrink-0 mt-0.5"
                  >
                    <path
                      d="M22 16.92V20a2 2 0 0 1-2.18 2 
           19.79 19.79 0 0 1-8.63-3.07 
           19.5 19.5 0 0 1-6-6 
           19.79 19.79 0 0 1-3.07-8.63 
           A2 2 0 0 1 4 2h3.09a2 2 0 0 1 2 1.72 
           c.13 1.21.45 2.38.94 3.47 
           a2 2 0 0 1-.45 2.11L8.09 10.91 
           a16 16 0 0 0 6 6l1.61-1.61 
           a2 2 0 0 1 2.11-.45 
           c1.09.49 2.26.81 3.47.94 
           A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ siteInfo.phone_number }}</span>
                </a>
              </li>

              <!-- Address -->
              <li>
                <div class="flex items-start gap-2 text-gray-300 body-1-r">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="shrink-0 mt-0.5"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                  </svg>
                  <span>{{ siteInfo.address }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="border-t border-white/10 pt-10 pb-[86px] md:pb-10">
      <p v-if="siteInfo?.footer_text" class="body-1-r text-gray-400 text-center mb-3">
        {{ siteInfo.footer_text }}
      </p>
      <p v-if="footer.copyright" class="body-1-r text-gray-400 text-center">
        {{ footer.copyright }}
      </p>
      <p v-else class="body-1-r text-gray-400 text-center">
        Copyright © {{ currentYear }} <template v-if="siteInfo">{{ siteInfo.app_name }}</template>.
        All rights reserved | Design & Developed by
        <a
          target="_blank"
          href="https://www.marketorr.com.bd/"
          class="text-gray-300 hover:text-white transition-colors"
          >Marketorr</a
        >
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-logo {
  max-height: 50px;
}

.trust-badge-card {
  cursor: default;
}

.badge-icon-frame {
  width: 72px;
  height: 72px;
  margin-bottom: 1rem;
  position: relative;
  display: grid;
  place-items: center;
}

.badge-icon-frame svg {
  width: 72px;
  height: 72px;
  transition: opacity 0.2s ease;
}

.badge-lottie {
  position: absolute;
  inset: 0;
  width: 72px;
  height: 72px;
  overflow: hidden;
  background-color: #fffaf4;
  border: 1.5px solid #f7e2cb;
  border-radius: 8.25px;
  box-sizing: border-box;
  pointer-events: none;
}

.badge-lottie :deep(canvas),
.badge-lottie :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.badge-lottie--delivery :deep(canvas),
.badge-lottie--delivery :deep(svg) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 125% !important;
  height: 125% !important;
  transform: translate(-50%, -50%);
}
</style>
