<script setup>
import { computed } from "vue";
import { Link, usePage } from "@inertiajs/vue3";
import { useCartStore } from "@/Store/cartStore";
import { useAuthStore } from "@/Store/authStore";

const cartStore = useCartStore();
const authStore = useAuthStore();

const currentUrl = computed(() => usePage().url);

const navItems = computed(() => [
  {
    label: "Home",
    href: "/",
    activeIcon: "/assets/images/icons/icoHomeActive.svg",
    inactiveIcon: "/assets/images/icons/icoHomeInactive.svg",
    match: (url) => url === "/" || url === "",
    action: null,
  },
  {
    label: "Categories",
    href: "/categories",
    activeIcon: "/assets/images/icons/icoCategoriesActive.svg",
    inactiveIcon: "/assets/images/icons/icoCategoriesInActive.svg",
    match: (url) => url.startsWith("/categories") || url.startsWith("/product-category"),
    action: null,
  },
  {
    label: "Cart",
    href: null,
    activeIcon: "/assets/images/icons/icoCartActive.svg",
    inactiveIcon: "/assets/images/icons/icoCartInActive.svg",
    match: () => false,
    action: () => cartStore.toggleCart(),
  },
  {
    // Account when logged in, otherwise the login page — same as the header.
    label: "Account",
    href: authStore.isAuthenticated ? "/account" : "/login",
    activeIcon: "/assets/images/icons/icoAccountActive.svg",
    inactiveIcon: "/assets/images/icons/icoAccountInActive.svg",
    match: (url) => url.startsWith("/account") || url.startsWith("/login"),
    action: null,
  },
]);

const isActive = (item) => item.match(currentUrl.value);
</script>

<template>
  <nav class="mobile-bottom-nav">
    <template v-for="item in navItems" :key="item.label">
      <!-- Button for cart (no navigation) -->
      <button
        v-if="item.action"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item) }"
        @click="item.action"
      >
        <div class="nav-icon-wrapper">
          <img
            :src="isActive(item) ? item.activeIcon : item.inactiveIcon"
            :alt="item.label"
            class="nav-icon"
          />
          <span
            v-if="item.label === 'Cart' && cartStore.cartCount > 0"
            class="cart-badge"
          >
            {{ cartStore.cartCount }}
          </span>
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </button>

      <!-- Link for navigation items -->
      <Link
        v-else
        :href="item.href"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item) }"
      >
        <img
          :src="isActive(item) ? item.activeIcon : item.inactiveIcon"
          :alt="item.label"
          class="nav-icon"
        />
        <span class="nav-label">{{ item.label }}</span>
      </Link>
    </template>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 767px) {
  .mobile-bottom-nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background-color: #ffffff;
    border-top: 1px solid #f0e6d8;
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.06);
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  padding: 6px 0;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.nav-icon-wrapper {
  position: relative;
  display: inline-flex;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-label {
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  line-height: 1;
}

.nav-item--active .nav-label {
  color: #8B6914;
  font-weight: 600;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
