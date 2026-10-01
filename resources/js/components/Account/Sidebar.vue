<template>
  <nav class="account-sidenav">
    <div class="account-sidenav-scroller">
      <div ref="strip" class="account-sidenav-items" @scroll.passive="updateScrollHints">
      <Link
      v-for="item in navItems"
      :key="item.href"
      :href="item.href"
      class="account-sidenav-item"
      :class="{ 'is-active': isActive(item.href) }"
    >
      <span class="account-sidenav-icon">
        <img :src="item.icon" alt="" />
      </span>
      <span class="account-sidenav-labels">
        <span class="account-sidenav-label">{{ item.label }}</span>
        <span class="account-sidenav-sublabel">{{ item.labelBn }}</span>
      </span>
        <span v-if="isActive(item.href)" class="account-sidenav-accent" />
      </Link>
      </div>

      <!-- Only rendered while the strip actually overflows, so it is never a
           hint pointing at nothing. -->
      <span v-if="canScrollRight" class="account-sidenav-hint" aria-hidden="true">
        <ChevronRight :size="16" />
      </span>
    </div>

    <div class="account-sidenav-divider">
      <button
        v-if="authStore.isAuthenticated"
        type="button"
        class="account-signout-btn"
        @click="authStore.logout"
      >
        <img :src="'/assets/images/account/sign-out.svg'" alt="" class="account-signout-icon" />
        Sign Out
      </button>
    </div>
  </nav>
</template>

<script setup>
import { onBeforeUnmount, onMounted, nextTick, ref } from 'vue';
import { useAuthStore } from '@/Store/authStore';
import { Link, usePage } from '@inertiajs/vue3';
import { ChevronRight } from 'lucide-vue-next';

const authStore = useAuthStore();
const page = usePage();

const navItems = [
  {
    href: '/account',
    label: 'My Profile',
    labelBn: 'প্রোফাইল',
    icon: '/assets/images/account/nav-profile.svg',
  },
  {
    href: '/account/orders',
    label: 'Order History',
    labelBn: 'অর্ডার ইতিহাস',
    icon: '/assets/images/account/nav-order-history.svg',
  },
  {
    href: '/account/wishlist',
    label: 'Wishlist',
    labelBn: 'পছন্দের তালিকা',
    icon: '/assets/images/account/nav-wishlist.svg',
  },
  {
    href: '/account/track-order',
    label: 'Track Order',
    labelBn: 'অর্ডার ট্র্যাক',
    icon: '/assets/images/account/nav-track-order.svg',
  },
];

const isActive = (href) => page.url === href || (href !== '/account' && page.url.startsWith(href));

/* ------------------------------------------------- mobile scroll hint -- */

const strip = ref(null);
const canScrollRight = ref(false);

/** Whether anything is still hidden off the right edge of the strip. */
function updateScrollHints() {
  const el = strip.value;
  if (!el) return;

  // A pixel of slack, because sub-pixel widths never land exactly.
  canScrollRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
}

onMounted(async () => {
  await nextTick();
  updateScrollHints();
  window.addEventListener('resize', updateScrollHints);
});

onBeforeUnmount(() => window.removeEventListener('resize', updateScrollHints));
</script>

<style scoped>
.account-sidenav {
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-sidenav-scroller {
  position: relative;
  min-width: 0;
}

.account-sidenav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Desktop stacks vertically and never overflows, so no hint is needed. */
.account-sidenav-hint { display: none; }

.account-sidenav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  transition: background-color 0.15s ease;
}

.account-sidenav-item:hover:not(.is-active) {
  background: #f7efdd;
}

.account-sidenav-item.is-active {
  background: #d4e0c8;
}

.account-sidenav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.account-sidenav-icon img {
  width: 100%;
  height: 100%;
}

.account-sidenav-labels {
  display: flex;
  flex-direction: column;
}

.account-sidenav-label {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #7a5c3e;
}

.account-sidenav-item.is-active .account-sidenav-label {
  color: #2d4a2d;
}

.account-sidenav-sublabel {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #7a5c3e;
  opacity: 0.7;
}

.account-sidenav-item.is-active .account-sidenav-sublabel {
  color: #2d4a2d;
}

.account-sidenav-accent {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  border-radius: 9999px;
  background: #2d4a2d;
}

.account-sidenav-divider {
  border-top: 1px solid rgba(44, 26, 14, 0.12);
  margin-top: 8px;
  padding-top: 9px;
}

.account-signout-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  border-radius: 14px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #c4763a;
  transition: background-color 0.15s ease;
}

.account-signout-btn:hover {
  background: #fdece1;
}

.account-signout-icon {
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
}

/* ── Mobile ──────────────────────────────────────────────────
   Stacked vertically this nav pushed the actual page content most of a screen
   down, on every account page. Below the two-column breakpoint it becomes a
   horizontal strip that scrolls sideways instead. */
@media (max-width: 1024px) {
  .account-sidenav {
    padding: 6px;
    border-radius: 12px;
  }

  .account-sidenav-items {
    flex-direction: row;
    gap: 2px;
    padding-right: 34px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .account-sidenav-items::-webkit-scrollbar { display: none; }

  /* Tabs run past the edge with nothing to say so. A fade plus a chevron
     shows there is more, and disappears once the end is reached. */
  .account-sidenav-hint {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 46px;
    padding-right: 4px;
    pointer-events: none;
    color: #7a5c3e;
    background: linear-gradient(
      to right,
      rgba(254, 250, 243, 0),
      #fefaf3 62%
    );
    animation: account-nav-nudge 1.6s ease-in-out 3;
  }

  @keyframes account-nav-nudge {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .account-sidenav-hint { animation: none; }
  }

  .account-sidenav-item {
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 9px 14px;
    border-radius: 10px;
    text-align: center;
  }

  .account-sidenav-label {
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
  }

  /* The English label alone identifies the tab; the Bangla one doubles the
     strip's height for no extra meaning at this size. */
  .account-sidenav-sublabel { display: none; }

  /* The accent was a bar down the right edge, which reads as nothing on a
     horizontal tab. Underline the active one instead. */
  .account-sidenav-accent {
    right: auto;
    top: auto;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 3px;
  }

  /* Sign out moves to the foot of the page, so it is not in the way of the tabs. */
  .account-sidenav-divider { display: none; }
}
</style>