<script setup>
import { computed } from "vue";
import { Link, usePage } from "@inertiajs/vue3";
import { useCartStore } from "@/Store/cartStore";

const cartStore = useCartStore();

const currentUrl = computed(() => usePage().url.split('?')[0]);

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
    match: (url) => cartStore.isCartOpen || url === '/cart' || url === '/checkout',
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
  <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
    <template v-for="item in navItems" :key="item.label">
      <!-- Button for cart (no navigation) -->
      <button
        v-if="item.action"
        type="button"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item) }"
        :aria-label="`Cart (${cartStore.cartCount})`"
        :aria-expanded="cartStore.isCartOpen"
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
        :aria-current="isActive(item) ? 'page' : undefined"
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
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    gap: 4px;
    background-color: rgba(255, 255, 255, .97);
    border-top: 1px solid #eee5d4;
    border-radius: 20px 20px 0 0;
    padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -6px 24px rgba(37, 47, 23, .08);
    backdrop-filter: blur(12px);
  }
}

.nav-item {
  position: relative;
  min-width: 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  background: none;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .2s ease, color .2s ease;
}

.nav-item--active { background: #f6f0e2; }
.nav-item:focus-visible { outline: 2px solid #cc9b25; outline-offset: -2px; }

.nav-icon-wrapper {
  position: relative;
  display: inline-flex;
}

.nav-icon {
  display: block;
  width: 24px;
  height: 24px;
  background-color: #8c8066;
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.nav-item:active .nav-icon { transform: scale(0.92); }

.nav-label {
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  color: #746b59;
  white-space: nowrap;
}

.nav-item--active .nav-icon { background-color: #252f17; }
.nav-item--active .nav-label { color: #252f17; font-weight: 600; }

.cart-badge {
  position: absolute;
  top: -6px;
  right: -9px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: #cc9b25;
  color: #1a2110;
  box-shadow: 0 0 0 2px #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
