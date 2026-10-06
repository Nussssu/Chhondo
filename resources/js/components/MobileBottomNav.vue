<script setup>
import { computed } from "vue";
import { Link, usePage } from "@inertiajs/vue3";
import { useCartStore } from "@/Store/cartStore";

const cartStore = useCartStore();

const currentUrl = computed(() => usePage().url);

// Figma "phone navbar": Home, Categories, Cart, Contact. Account and wishlist
// stay one tap away in the menu drawer.
const navItems = computed(() => [
  {
    label: "Home",
    href: "/",
    icon: "/assets/chhondo/nav-home.svg",
    match: (url) => url === "/" || url === "",
    action: null,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: "/assets/chhondo/nav-categories.svg",
    match: (url) => url.startsWith("/categories") || url.startsWith("/product-category"),
    action: null,
  },
  {
    label: "Cart",
    href: null,
    icon: "/assets/chhondo/nav-bag.svg",
    match: () => false,
    action: () => cartStore.toggleCart(),
  },
  {
    label: "Contact",
    href: "/contact-us",
    icon: "/assets/chhondo/nav-contact.svg",
    match: (url) => url.startsWith("/contact-us"),
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
        <span class="nav-icon-wrapper">
          <span class="nav-icon" :style="{ '--icon': `url('${item.icon}')` }" aria-hidden="true"></span>
          <span v-if="cartStore.cartCount > 0" class="cart-badge">{{ cartStore.cartCount > 99 ? '99+' : cartStore.cartCount }}</span>
        </span>
        <span class="nav-label">{{ item.label }}</span>
      </button>

      <!-- Link for navigation items -->
      <Link
        v-else
        :href="item.href"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item) }"
      >
        <span class="nav-icon" :style="{ '--icon': `url('${item.icon}')` }" aria-hidden="true"></span>
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
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background-color: #ffffff;
    padding: 16px 37px calc(16px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.03), 0 -4px 16px -4px rgba(0, 0, 0, 0.12);
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0;
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
  display: block;
  width: 24px;
  height: 24px;
  background-color: #d6af51;
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.nav-item:active .nav-icon { transform: scale(0.92); }

.nav-label {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #1a1817;
}

.nav-item--active .nav-icon { background-color: #cc9b25; }
.nav-item--active .nav-label { font-weight: 500; }

.cart-badge {
  position: absolute;
  top: -6px;
  right: -9px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: #252f17;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
