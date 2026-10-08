<script setup>
import { ref, watch, computed } from "vue";
import {
    PhMapPin,
    PhArrowCounterClockwise,
    PhShieldCheck,
    PhCaretRight,
    PhSignOut,
    PhHeadset,
    PhHeart,
    PhX,
} from "@phosphor-icons/vue";
import { Link, usePage } from "@inertiajs/vue3";
import { useAuthStore } from "@/Store/authStore";

const authStore = useAuthStore();
const headerSettings = computed(() => {
    const settings = usePage().props.layout?.header ?? {};
    return settings.options_enabled === false ? { ...settings, show_account: false, show_wishlist: false } : settings;
});

const props = defineProps({
    menuItems: {
        type: Array,
        required: true,
    },
    isMobileMenuOpen: Boolean,
    toggleMobileMenu: Function,
});

const openSubmenuIds = ref(new Set());

const toggleSubmenu = (id) => {
    if (openSubmenuIds.value.has(id)) {
        openSubmenuIds.value.delete(id);
    } else {
        openSubmenuIds.value.add(id);
    }
    // Force reactivity for the Set
    openSubmenuIds.value = new Set(openSubmenuIds.value);
};

const isSubmenuOpen = (id) => openSubmenuIds.value.has(id);

const userName = computed(() => authStore.user?.name || "");
const userInitial = computed(() =>
    userName.value ? userName.value.charAt(0).toUpperCase() : "U"
);

// Lock the page behind the drawer while it is open
watch(
    () => props.isMobileMenuOpen,
    (open) => {
        if (typeof document === "undefined") return;
        document.body.style.overflow = open ? "hidden" : "";
    }
);

// Managed in the admin: Settings › Header & footer › Header.
const ICONS = {
    track: PhMapPin,
    refund: PhArrowCounterClockwise,
    privacy: PhShieldCheck,
    contact: PhHeadset,
};

function isBlogLink(link) {
    if (link.icon === 'blog') return true;
    const label = String(link.label ?? link.title ?? '').trim().toLowerCase();
    if (label === 'blog' || label === 'ব্লগ') return true;
    try {
        return /^\/blog(?:\/|$)/.test(new URL(link.url ?? link.href ?? '/', 'http://localhost').pathname);
    } catch {
        return false;
    }
}

function withoutBlog(items) {
    return items.filter(item => !isBlogLink(item)).map(item => ({
        ...item,
        submenu: withoutBlog(item.submenu ?? []),
    }));
}

const visibleMenuItems = computed(() => withoutBlog(props.menuItems));

const quickLinks = computed(() =>
    (usePage().props.layout?.header?.mobile_links_enabled === false ? [] : usePage().props.layout?.header?.mobile_links ?? []).filter(link => link.enabled !== false && !isBlogLink(link)).map((link) => ({
        // Labels and links: Settings › Header & footer › Header.
        label: link.label,
        href: link.url,
        icon: ICONS[link.icon] ?? PhHeadset,
    }))
);
</script>

<template>
    <nav>
        <!-- Backdrop -->
        <transition name="mm-fade">
            <div
                v-show="isMobileMenuOpen"
                class="mm-backdrop"
                @click="toggleMobileMenu"
            ></div>
        </transition>

        <!-- Drawer -->
        <div class="mm-drawer" :class="{ 'mm-drawer--open': isMobileMenuOpen }">
            <!-- Header -->
            <div class="mm-header">
                <Link href="/" class="mm-brand" aria-label="Chhondo home" @click="toggleMobileMenu">
                    <img :src="'/assets/chhondo/logo-mark-dark.svg'" alt="" class="mm-brand-mark" />
                    <img :src="'/assets/chhondo/logo-word-dark.svg'" alt="Chhondo" class="mm-brand-word" />
                </Link>
                <button
                    @click="toggleMobileMenu"
                    class="mm-close"
                    aria-label="Close menu"
                >
                    <PhX :size="18" weight="bold" />
                </button>
            </div>

            <!-- Scrollable body -->
            <div class="mm-body">
                <!-- Account card -->
                <div v-if="headerSettings.show_account !== false" class="mm-account">
                    <template v-if="authStore.isAuthenticated">
                        <Link
                            href="/account"
                            class="mm-account-main"
                            @click="toggleMobileMenu"
                        >
                            <span class="mm-avatar">{{ userInitial }}</span>
                            <span class="min-w-0">
                                <span class="mm-account-name">{{ userName }}</span>
                                <span class="mm-account-sub">আমার অ্যাকাউন্ট দেখুন</span>
                            </span>
                        </Link>
                        <button
                            class="mm-logout"
                            @click="authStore.logout()"
                            aria-label="Log out"
                        >
                            <PhSignOut :size="18" />
                        </button>
                    </template>

                    <template v-else>
                        <div class="mm-account-greeting">
                            <span class="mm-account-name">স্বাগতম</span>
                            <span class="mm-account-sub">
                                দ্রুত চেকআউটের জন্য লগ ইন করুন
                            </span>
                        </div>
                        <div class="mm-auth-actions">
                            <Link
                                href="/login"
                                class="mm-btn mm-btn--solid"
                                @click="toggleMobileMenu"
                            >
                                লগ ইন করুন
                            </Link>
                            <Link
                                href="/register"
                                class="mm-btn mm-btn--ghost"
                                @click="toggleMobileMenu"
                            >
                                অ্যাকাউন্ট খুলুন
                            </Link>
                        </div>
                    </template>
                </div>

                <!-- Main navigation -->
                <p class="mm-section-label">শপ</p>
                <ul class="mm-list">
                    <li v-for="item in visibleMenuItems" :key="item.id">
                        <div
                            class="mm-row"
                            :class="{ 'mm-row--open': isSubmenuOpen(item.id) }"
                        >
                            <a
                                :href="item.url"
                                class="mm-row-link"
                                @click="toggleMobileMenu"
                                >{{ item.title }}</a
                            >
                            <button
                                v-if="item.submenu?.length"
                                @click.prevent="toggleSubmenu(item.id)"
                                class="mm-caret"
                                :class="{ 'mm-caret--open': isSubmenuOpen(item.id) }"
                                :aria-expanded="isSubmenuOpen(item.id)"
                                :aria-label="`Toggle ${item.title} submenu`"
                            >
                                <PhCaretRight :size="14" weight="bold" />
                            </button>
                        </div>

                        <!-- Level 2 -->
                        <div
                            v-if="item.submenu?.length"
                            class="mm-sub"
                            :class="{ 'mm-sub--open': isSubmenuOpen(item.id) }"
                        >
                            <ul class="mm-sub-inner">
                                <li
                                    v-for="subItem in item.submenu"
                                    :key="subItem.id"
                                >
                                    <div class="mm-row mm-row--sub">
                                        <a
                                            :href="subItem.url"
                                            class="mm-row-link"
                                            @click="toggleMobileMenu"
                                            >{{ subItem.title }}</a
                                        >
                                        <button
                                            v-if="subItem.submenu?.length"
                                            @click.prevent="toggleSubmenu(subItem.id)"
                                            class="mm-caret"
                                            :class="{
                                                'mm-caret--open': isSubmenuOpen(subItem.id),
                                            }"
                                            :aria-expanded="isSubmenuOpen(subItem.id)"
                                        >
                                            <PhCaretRight :size="12" weight="bold" />
                                        </button>
                                    </div>

                                    <!-- Level 3 -->
                                    <div
                                        v-if="subItem.submenu?.length"
                                        class="mm-sub"
                                        :class="{
                                            'mm-sub--open': isSubmenuOpen(subItem.id),
                                        }"
                                    >
                                        <ul class="mm-sub-inner">
                                            <li
                                                v-for="thirdItem in subItem.submenu"
                                                :key="thirdItem.id"
                                            >
                                                <div class="mm-row mm-row--sub">
                                                    <a
                                                        :href="thirdItem.url"
                                                        class="mm-row-link"
                                                        @click="toggleMobileMenu"
                                                        >{{ thirdItem.title }}</a
                                                    >
                                                    <button
                                                        v-if="thirdItem.submenu?.length"
                                                        @click.prevent="
                                                            toggleSubmenu(thirdItem.id)
                                                        "
                                                        class="mm-caret"
                                                        :class="{
                                                            'mm-caret--open':
                                                                isSubmenuOpen(thirdItem.id),
                                                        }"
                                                        :aria-expanded="
                                                            isSubmenuOpen(thirdItem.id)
                                                        "
                                                    >
                                                        <PhCaretRight
                                                            :size="12"
                                                            weight="bold"
                                                        />
                                                    </button>
                                                </div>

                                                <!-- Level 4 -->
                                                <div
                                                    v-if="thirdItem.submenu?.length"
                                                    class="mm-sub"
                                                    :class="{
                                                        'mm-sub--open':
                                                            isSubmenuOpen(thirdItem.id),
                                                    }"
                                                >
                                                    <ul class="mm-sub-inner">
                                                        <li
                                                            v-for="fourthItem in thirdItem.submenu"
                                                            :key="fourthItem.id"
                                                        >
                                                            <a
                                                                :href="fourthItem.url"
                                                                class="mm-row mm-row--sub mm-row-link"
                                                                @click="toggleMobileMenu"
                                                                >{{ fourthItem.title }}</a
                                                            >
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                <!-- Quick links -->
                <p v-if="quickLinks.length" class="mm-section-label">সহায়তা</p>
                <div v-if="quickLinks.length" class="mm-card">
                    <Link
                        v-for="link in quickLinks"
                        :key="link.href"
                        :href="link.href"
                        class="mm-quick"
                        @click="toggleMobileMenu"
                    >
                        <span class="mm-quick-icon">
                            <component :is="link.icon" :size="17" />
                        </span>
                        <span class="mm-quick-label">{{ link.label }}</span>
                        <PhCaretRight :size="13" class="mm-quick-caret" />
                    </Link>

                    <Link
                        v-if="authStore.isAuthenticated && headerSettings.show_wishlist !== false"
                        href="/account/wishlist"
                        class="mm-quick"
                        @click="toggleMobileMenu"
                    >
                        <span class="mm-quick-icon">
                            <PhHeart :size="17" />
                        </span>
                        <span class="mm-quick-label">পছন্দের তালিকা</span>
                        <PhCaretRight :size="13" class="mm-quick-caret" />
                    </Link>
                </div>

                <p class="mm-footnote">ছন্দ — ঐতিহ্যের গল্প</p>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* ===== Shell ===== */
.mm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(26, 24, 23, 0.45);
    backdrop-filter: blur(3px);
}

.mm-fade-enter-active,
.mm-fade-leave-active {
    transition: opacity 0.28s ease;
}

.mm-fade-enter-from,
.mm-fade-leave-to {
    opacity: 0;
}

.mm-drawer {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    width: 87%;
    max-width: 350px;
    height: 100%;
    background: #fff;
    border-radius: 0 20px 20px 0;
    /* No shadow while parked off-screen: its 40px blur reached back into the
       page as a grey haze down the left edge. */
    box-shadow: none;
    visibility: hidden;
    transform: translateX(-102%);
    transition: transform 0.34s cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 0.34s ease, visibility 0s linear 0.34s;
}

.mm-drawer--open {
    visibility: visible;
    box-shadow: 6px 0 40px rgba(26, 24, 23, 0.18);
    transform: translateX(0);
    transition: transform 0.34s cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 0.34s ease, visibility 0s;
}

/* ===== Header ===== */
.mm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px 14px;
    border-bottom: 1px solid #e4e1e0;
    background: #fff;
    border-radius: 0 20px 0 0;
}

.mm-brand { display: flex; width: 64px; flex-direction: column; align-items: center; gap: 2px; }
.mm-brand-mark { display: block; width: 52px; height: 45px; }
.mm-brand-word { display: block; width: 62px; height: 8px; }

.mm-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid #f0e6d8;
    background: #fffaf4;
    color: #80532e;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.mm-close:active {
    background: #f5e9dc;
}

/* ===== Body ===== */
.mm-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 16px 14px calc(28px + env(safe-area-inset-bottom, 0px));
    scrollbar-width: thin;
    scrollbar-color: #ded3c6 transparent;
}

.mm-body::-webkit-scrollbar {
    width: 5px;
}

.mm-body::-webkit-scrollbar-thumb {
    background: #ded3c6;
    border-radius: 3px;
}

/* ===== Account card ===== */
.mm-account {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px;
    border-radius: 16px;
    background: #252f17;
    color: #fff;
    box-shadow: 0 6px 18px rgba(37, 47, 23, 0.22);
}

.mm-account-main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
    color: inherit;
}

.mm-account-greeting {
    flex: 1;
    min-width: 0;
}

.mm-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.32);
    font-family: "Poppins", sans-serif;
    font-size: 17px;
    font-weight: 600;
}

.mm-account-name {
    display: block;
    font-family: "Poppins", sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mm-account-sub {
    display: block;
    font-size: 12px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.78);
}

.mm-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
}

.mm-auth-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.mm-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 600;
    transition: opacity 0.2s ease;
}

.mm-btn--solid {
    background: #fff;
    color: #252f17;
}

.mm-btn--ghost {
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #fff;
}

/* ===== Section labels ===== */
.mm-section-label {
    margin: 22px 6px 8px;
    font-family: "Poppins", sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #a08a72;
}

/* ===== Nav rows ===== */
.mm-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.mm-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 48px;
    padding: 6px 8px 6px 14px;
    border-radius: 12px;
    color: #3a322b;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.mm-row:active {
    background: #f5ece1;
}

.mm-row--open {
    background: #fff;
    color: #252f17;
    box-shadow: 0 2px 10px rgba(128, 83, 46, 0.08);
}

.mm-row-link {
    flex: 1;
    min-width: 0;
    font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    color: inherit;
}

.mm-row--sub {
    min-height: 42px;
    padding-left: 12px;
    border-radius: 10px;
}

.mm-row--sub .mm-row-link {
    font-size: 14px;
    font-weight: 400;
    color: #6b5f54;
}

.mm-caret {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 999px;
    background: #f3e9dd;
    color: #80532e;
    transition: transform 0.25s ease, background-color 0.2s ease;
}

.mm-caret--open {
    transform: rotate(90deg);
    background: #e4f0d8;
    color: #2c5015;
}

/* ===== Submenus ===== */
.mm-sub {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease, opacity 0.25s ease;
    opacity: 0;
}

.mm-sub--open {
    grid-template-rows: 1fr;
    opacity: 1;
}

.mm-sub > .mm-sub-inner {
    overflow: hidden;
    min-height: 0;
    margin-left: 20px;
    padding-left: 10px;
    border-left: 1.5px solid #ecdfd0;
}

/* ===== Quick links card ===== */
.mm-card {
    background: #fff;
    border: 1px solid #f0e6d8;
    border-radius: 16px;
    overflow: hidden;
}

.mm-quick {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    color: #3a322b;
    border-bottom: 1px solid #f6efe6;
    transition: background-color 0.2s ease;
}

.mm-quick:last-child {
    border-bottom: none;
}

.mm-quick:active {
    background: #fdf6ee;
}

.mm-quick-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #f7efe5;
    color: #80532e;
}

.mm-quick-label {
    flex: 1;
    font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
}

.mm-quick-caret {
    color: #c4b5a5;
    flex-shrink: 0;
}

.mm-footnote {
    margin-top: 24px;
    text-align: center;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 12px;
    line-height: 20px;
    color: #b3a191;
}
</style>
