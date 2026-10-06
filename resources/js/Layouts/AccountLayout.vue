<template>
  <AppLayout>
    <div class="account-shell">
      <div class="account-titlebar">
        <div class="account-titlebar-inner">
          <div>
            <p class="account-eyebrow">আমার অ্যাকাউন্ট</p>
            <h1 class="account-heading">ফিরে আসায় স্বাগতম, {{ firstName }} 👋</h1>
          </div>

          <div class="account-titlebar-actions">
            <Link href="/shop" class="account-back-btn">
              <img :src="'/assets/images/account/back-to-shop.svg'" alt="" class="account-back-icon" />
              শপে ফিরে যান
            </Link>

            <!-- Desktop keeps this in the sidebar; on mobile the nav is a tab
                 strip with no room for it, so it sits here beside Back to Shop. -->
            <button
              v-if="authStore.isAuthenticated"
              type="button"
              class="account-signout-top"
              @click="authStore.logout"
            >
              <img :src="'/assets/images/account/sign-out.svg'" alt="" class="account-signout-icon" />
              সাইন আউট
            </button>
          </div>
        </div>
      </div>

      <div class="account-body">
        <aside class="account-sidebar">
          <Sidebar />
        </aside>

        <main class="account-main">
          <slot />
        </main>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Sidebar from '@/components/Account/Sidebar.vue';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { useAuthStore } from '@/Store/authStore';

const authStore = useAuthStore();
const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'there');
</script>

<style scoped>
.account-shell {
  background: #fffaf4;
  min-height: calc(100vh - 90px);
}

.account-titlebar {
  background: #fffaf4;
  border-bottom: 1px solid rgba(44, 26, 14, 0.12);
}

.account-titlebar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.account-eyebrow {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #2d4a2d;
  margin-bottom: 4px;
}

.account-heading {
  font-family: "Playfair Display", "Poppins", serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 36px;
  color: #2c1a0e;
}

.account-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 17px;
  border: 1px solid rgba(44, 26, 14, 0.12);
  border-radius: 9999px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #7a5c3e;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.account-back-btn:hover {
  background: #fef1dd;
}

.account-back-icon {
  width: 15px;
  height: 15px;
}

.account-body {
  max-width: 1300px;
  margin: 0 auto;
  padding: 32px 20px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.account-sidebar {
  width: 310px;
  flex-shrink: 0;
}

.account-main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .account-body {
    flex-direction: column;
    gap: 16px;
    padding: 0 12px 28px;
    /* The base rule sets flex-start, which on a column container is the
       horizontal axis — so the main panel shrank to its content and sat on
       the left. Stacked, both children should span the width. */
    align-items: stretch;
  }

  .account-sidebar {
    width: 100%;
    /* Follows the page, so switching section never means scrolling back up. */
    position: sticky;
    top: 0;
    z-index: 20;
    padding: 12px 0 4px;
    background: #fffaf4;
  }

  /* The title block was a 28px serif heading plus a pill button — most of a
     phone's first screen before any content. */
  .account-titlebar-inner {
    padding: 14px 16px;
    gap: 10px;
  }

  .account-heading {
    font-size: 19px;
    line-height: 26px;
  }

  .account-eyebrow {
    font-size: 11px;
    margin-bottom: 2px;
  }

  .account-back-btn {
    padding: 7px 13px;
    font-size: 13px;
  }
}

.account-titlebar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Only on mobile — the sidebar still carries sign out on desktop. */
.account-signout-top {
  display: none;
}

@media (max-width: 1024px) {
  .account-signout-top {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border: 1px solid rgba(44, 26, 14, 0.12);
    border-radius: 9999px;
    background: transparent;
    font-family: "DM Sans", "Poppins", sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: #7a5c3e;
    white-space: nowrap;
    cursor: pointer;
  }

  .account-signout-top:hover {
    background: #fef1dd;
  }

  .account-signout-icon {
    width: 14px;
    height: 14px;
  }
}

/* ===== Figma "My Profile" shell ===== */
.account-shell { background: #fff; }
.account-titlebar { background: #fff; border-bottom: 1px solid #e4e1e0; padding-top: 36px; }
.account-titlebar-inner { max-width: 1360px; padding: 0 0 28px; align-items: flex-end; }
.account-eyebrow {
  margin-bottom: 2px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  text-transform: none;
  color: #4c5441;
}
.account-heading {
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #2c1a0e;
}
.account-back-btn {
  height: 44px;
  padding: 0 16px;
  border: 1px solid #1a2110;
  border-radius: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a2110;
}
.account-back-btn:hover { background: #faf5e9; }
.account-back-icon { width: 24px; height: 24px; }
.account-body { max-width: 1360px; padding: 40px 0; gap: 20px; }
.account-sidebar { width: 325px; }

@media (max-width: 1391px) {
  .account-titlebar-inner,
  .account-body { padding-left: 16px; padding-right: 16px; }
}
@media (max-width: 1024px) {
  .account-titlebar { padding-top: 16px; }
  .account-titlebar-inner { padding: 0 16px 14px; }
  .account-body { padding: 0 12px 28px; }
  .account-sidebar { width: 100%; background: #fff; }
  .account-heading { font-size: 19px; line-height: 26px; }
  .account-eyebrow { font-size: 13px; line-height: 20px; }
}

/* Account sidebar: sticky left nav on desktop (all subpages). The parent
   uses align-items: flex-start, so both columns start at the same top;
   sticky holds the sidebar while the right content scrolls, and it is
   bounded by .account-body — once both reach the same bottom alignment
   the sidebar scrolls upward naturally with the section. Mobile keeps its
   existing tab-strip behavior. */
@media (min-width: 1025px) {
  .account-body {
    align-items: flex-start;
  }

  .account-body .account-sidebar {
    position: sticky;
    top: 24px;
    align-self: flex-start;
  }
}

@media (min-width: 1280px) {
  /* Site header is sticky (76px) at this width — hold the sidebar below it
     so the two columns stay top-aligned while scrolling. */
  .account-body .account-sidebar {
    top: 100px;
  }
}

/* Phones: every account page ends the same 48px above the footer — no
   screen-height minimum stretching short pages, no tighter gap on long ones. */
@media (max-width: 767px) {
  .account-shell { min-height: 0; }
  .account-body { padding-bottom: 48px; }
}
</style>
