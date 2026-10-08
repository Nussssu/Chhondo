<script setup>
import {
    ref,
    nextTick,
    onMounted,
    onUnmounted,
    computed,
    watch,
} from "vue";
import { Link, usePage, router } from "@inertiajs/vue3";
import axios from "axios";
import {
    PhMagnifyingGlass,
} from "@phosphor-icons/vue";
import { SearchIcon, XIcon } from "lucide-vue-next";
import NavigationMenu from "@/components/Header/NavigationMenu.vue";
import MobileMenu from "@/components/Header/MobileMenu.vue";
import CartSidebar from "@/components/Header/CartSidebar.vue";
import HeaderSearch from "@/components/Header/HeaderSearch.vue";
import { useAuthStore } from "@/Store/authStore";
import { useCartStore } from "@/Store/cartStore";
import { useHomeStore } from "@/Store/homeStore";
import { useWishlistStore } from "@/Store/wishlistStore";
import { useAuthPromptStore } from "@/Store/authPromptStore";

const cartStore = useCartStore();
const authStore = useAuthStore();
const homeStore = useHomeStore();
const wishlistStore = useWishlistStore();
const authPrompt = useAuthPromptStore();

// User icon → account when logged in, otherwise the login page.
const goToAccount = () => {
    router.visit(authStore.isAuthenticated ? "/account" : "/login");
};

// Heart icon → wishlist page when logged in, otherwise prompt to log in.
const goToWishlist = () => {
    if (authStore.isAuthenticated) {
        router.visit("/account/wishlist");
    } else {
        authPrompt.open("পছন্দের তালিকায় রাখা পণ্যগুলো দেখতে লগ ইন করুন।");
    }
};

const globalCategories = computed(() => usePage().props.globalCategories);
const categories = computed(() => globalCategories.value?.categories || []);
const colors = computed(() => globalCategories.value.colors || []);
// The colour variables are printed on :root by app.blade.php; this component
// used to re-set them here from an array index that never existed.

// The menu is managed in the admin (Settings › Header & footer). The old
// hardcoded list is the fallback only when nothing has been set up yet.
const layout = computed(() => usePage().props.layout ?? {});
const headerSettings = computed(() => {
    const settings = layout.value.header ?? {};
    return settings.options_enabled === false
        ? { ...settings, show_search: false, show_wishlist: false, show_account: false, show_categories_menu: false }
        : settings;
});

/*
 * The menu is managed in the admin (Settings › Header & footer › Menu):
 * labels, links, order, on/off and categories dropdowns all come from there.
 */
const toSubmenu = (list) =>
    (list ?? []).map((entry) => ({
        id: entry.id,
        // Carried through so the menu can hold a categories dropdown.
        type: entry.type,
        // Which categories a dropdown lists; empty means all of them.
        categoryIds: entry.category_ids ?? [],
        title: entry.label,
        url: entry.url,
        target: entry.target,
        submenu: toSubmenu(entry.children),
    }));

const menuItems = computed(() => headerSettings.value.menu_enabled === false ? [] : toSubmenu(layout.value.menu));

// The categories a dropdown item lists: its chosen ones, or all of them.
const categoriesFor = (item) => {
    const ids = (item.categoryIds || []).map(String);
    return ids.length ? categories.value.filter((c) => ids.includes(String(c.id))) : categories.value;
};

// The drawer expands sub items only, so a categories item carries them there.
const mobileMenuItems = computed(() =>
    menuItems.value.filter(item => item.type !== 'categories' || headerSettings.value.show_categories_menu !== false).map((item) =>
        item.type === "categories"
            ? {
                  ...item,
                  submenu: categoriesFor(item).map((c) => ({
                      id: `cat-${c.id}`,
                      title: c.name,
                      url: `/product-category/${c.slug}`,
                      submenu: [],
                  })),
              }
            : item
    )
);

// Mobile Menu
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (isMobileMenuOpen.value) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
};

watch(() => usePage().url, () => {
    if (!isMobileMenuOpen.value) return;
    isMobileMenuOpen.value = false;
    document.body.style.overflow = "";
});
watch(() => headerSettings.value.enabled, (enabled) => {
    if (enabled === false && isMobileMenuOpen.value) {
        isMobileMenuOpen.value = false;
        document.body.style.overflow = "";
    }
});

const isOpen = ref(false);

const searchQuery = ref("");
const searchInput = ref(null);
const showDropdown = ref(false); // Controls dropdown visibility
const isLoading = ref(false);

/*
 * Results come from the server.
 *
 * This used to filter `homeStore.products`, which is only present on the home,
 * shop and category pages — so search returned nothing at all on the blog,
 * cart, checkout or a product page, and elsewhere searched only the products
 * that page happened to be showing rather than the catalogue.
 */
const filteredProducts = ref([]);
const totalResults = ref(0);
const searchError = ref(false);

const MIN_QUERY = 2;

let searchTimer = null;
// Rising id, so a slow reply for an old query cannot overwrite a newer one.
let searchToken = 0;

async function runSearch(term) {
    const token = ++searchToken;

    if (term.trim().length < MIN_QUERY) {
        filteredProducts.value = [];
        totalResults.value = 0;
        isLoading.value = false;
        searchError.value = false;
        return;
    }

    isLoading.value = true;
    searchError.value = false;

    try {
        const { data } = await axios.get("/search/products", { params: { q: term } });
        if (token !== searchToken) return;

        filteredProducts.value = data.results ?? [];
        totalResults.value = data.total ?? 0;
    } catch {
        if (token !== searchToken) return;
        filteredProducts.value = [];
        totalResults.value = 0;
        searchError.value = true;
    } finally {
        if (token === searchToken) isLoading.value = false;
    }
}

const onSearchInputChange = () => {
    showDropdown.value = searchQuery.value.length > 0;

    clearTimeout(searchTimer);
    // Waits for a pause in typing rather than firing on every keystroke.
    searchTimer = setTimeout(() => runSearch(searchQuery.value), 250);
};

/** Whether to tell the visitor their search found nothing. */
const showNoResults = computed(
    () =>
        !isLoading.value &&
        !searchError.value &&
        searchQuery.value.trim().length >= MIN_QUERY &&
        filteredProducts.value.length === 0
);

/** How many more matches exist than the ones listed. */
const moreResults = computed(() => Math.max(0, totalResults.value - filteredProducts.value.length));

function submitSearch() {
    const term = searchQuery.value.trim();
    if (!term) return;
    closeSearch();
    router.visit(`/shop?name=${encodeURIComponent(term)}`);
}

// Handle clicks outside the input and dropdown
const handleClickOutside = (event) => {
    if (searchInput.value && !searchInput.value.contains(event.target)) {
        showDropdown.value = false; // Hide dropdown
    }
};

// Add event listener when component is mounted
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    if (isMobileMenuOpen.value) {
        document.body.style.overflow = "";
    }
});

const openSearch = () => {
    isOpen.value = true;
    searchQuery.value = ""; // Reset search query
    nextTick(() => {
        searchInput.value.focus();
    });
};

const toggleSearch = () => (isOpen.value ? closeSearch() : openSearch());

const closeSearch = () => {
    isOpen.value = false;
    searchQuery.value = "";
    filteredProducts.value = [];
    totalResults.value = 0;
    showDropdown.value = false;
    clearTimeout(searchTimer);
};

// IP-based blocking check removed — handled server-side via middleware if needed
const sendIpDetails = (_userId) => {};
watch(
    () => authStore.user,
    (newUser) => {
        const userId = newUser?.id ?? null;
        sendIpDetails(userId);
    },
    { immediate: true }
);
</script>

<template>
    <header v-if="headerSettings.enabled !== false" class="header-area header-sticky">
        <!-- Announcement bar (Settings › Header & footer) -->
        <div v-if="headerSettings.announcement_enabled && headerSettings.announcement_text" class="header-announcement">
            <div class="container text-center">
                <component
                    :is="headerSettings.announcement_url ? 'a' : 'span'"
                    :href="headerSettings.announcement_url || undefined"
                >
                    {{ headerSettings.announcement_text }}
                </component>
            </div>
        </div>

        <div
            class="header-top-area py-4 border-b border-gray-200 hidden xl:block bg-[#FFFAF4]"
        >
            <div class="container">
                <div class="flex items-center justify-between">
                    <!-- Logo, with the menu beside it (Figma: 51px apart) -->
                    <div class="flex items-center gap-[51px] min-w-0">
                        <div class="logo_area shrink-0">
                            <Link href="/" class="chhondo-logo" aria-label="Chhondo home">
                                <img :src="'/assets/chhondo/logo-mark-dark.svg'" alt="" class="chhondo-logo-mark" />
                                <img :src="'/assets/chhondo/logo-word-dark.svg'" alt="Chhondo" class="chhondo-logo-word" />
                            </Link>
                        </div>

                        <NavigationMenu :menuItems="menuItems" :categories="categories" />
                    </div>

                    <!-- Right: Search, account, wishlist, cart -->
                    <div class="header-actions flex items-center shrink-0">
                        <!-- Search -->
                        <div v-if="false && headerSettings.show_search !== false" class="desktop-search-area relative" ref="searchInput">
                            <div class="desktop-search-box">
                                <span class="desktop-search-icon">
                                    <PhMagnifyingGlass :size="15" weight="bold" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search Here"
                                    v-model="searchQuery"
                                    @input="onSearchInputChange"
                                    @focus="showDropdown = true"
                                    class="desktop-search-input body-1-r"
                                />
                            </div>

                            <!-- Search Results Dropdown -->
                            <div
                                v-if="showDropdown && searchQuery.length > 0"
                                class="search_results absolute bg-white shadow-lg mt-1 w-[320px] right-0 z-30 rounded-lg overflow-hidden"
                            >
                                <div v-if="isLoading" class="p-4 text-center text-gray-500">Loading...</div>
                                <ul v-else-if="filteredProducts.length > 0" class="max-h-80 overflow-y-auto">
                                    <li
                                        v-for="product in filteredProducts"
                                        :key="product.id"
                                        class="p-2 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        <Link class="flex items-center space-x-3" :href="`/product/${product.slug}`">
                                            <img
                                                :src="product.featured_image || '/placeholder.svg'"
                                                :alt="product.product_name"
                                                class="w-10 h-10 rounded object-cover"
                                            />
                                            <div class="flex-grow">
                                                <p class="body-1-sb text-gray-800">{{ product.product_name }}</p>
                                                <p class="body-1-r text-gray-500">{{ product.price }}<span class="bangla-font">৳</span></p>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                                <div v-else class="p-4 text-center text-gray-500 body-1-r">No products found</div>
                            </div>
                        </div>

                        <!-- Opens inside the navbar, beside the icons -->
                        <HeaderSearch v-if="headerSettings.show_search !== false" />

                        <!-- User Icon -->
                        <button
                            v-if="headerSettings.show_account !== false"
                            @click="goToAccount"
                            type="button"
                            class="header-icon-btn"
                            :title="authStore.isAuthenticated ? 'My Account' : 'Login'"
                            :aria-label="authStore.isAuthenticated ? 'My Account' : 'Login'"
                        >
                            <!-- Figma: the same outline icon signed in or out -->
                            <img :src="'/assets/chhondo/profile.svg'" alt="" class="header-figma-icon-img" />
                        </button>

                        <!-- Wishlist Icon -->
                        <button
                            v-if="headerSettings.show_wishlist !== false"
                            @click="goToWishlist"
                            type="button"
                            class="header-icon-btn"
                            title="Wishlist"
                            :aria-label="`Wishlist (${wishlistStore.count})`"
                        >
                            <img :src="'/assets/chhondo/heart.svg'" alt="" class="header-figma-icon-img" />
                            <span v-if="wishlistStore.count > 0" class="header-count-badge">{{ wishlistStore.count > 99 ? '99+' : wishlistStore.count }}</span>
                        </button>

                        <!-- Cart Icon -->
                        <div class="cart-icon-wrapper">
                                                        <button @click="cartStore.toggleCart" type="button" class="cart-icon-btn" :aria-label="`Cart (${cartStore.cartCount})`">
                                <img :src="'/assets/chhondo/cart.svg'" alt="" class="header-figma-icon-img" />
                                <span v-if="cartStore.cartCount > 0" class="header-count-badge">{{ cartStore.cartCount > 99 ? '99+' : cartStore.cartCount }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Header -->
        <div class="mobile-header xl:hidden">
            <div class="flex items-center justify-between">
                <!-- Left: Logo -->
                <div class="logo_area">
                    <Link href="/" class="chhondo-logo" aria-label="Chhondo home">
                        <img :src="'/assets/chhondo/logo-mark-dark.svg'" alt="" class="chhondo-logo-mark" />
                        <img :src="'/assets/chhondo/logo-word-dark.svg'" alt="Chhondo" class="chhondo-logo-word" />
                    </Link>
                </div>

                <!-- Right: Search + Burger on phones (Figma); tablets also keep
                     account and wishlist, as they have no bottom nav. -->
                <div class="flex items-center gap-5">
                    <HeaderSearch v-if="headerSettings.show_search !== false" compact />
                    <!-- Account lives in the bottom nav on phones; kept here for
                         tablets (768px+), where the bottom nav is hidden. -->
                    <button
                        v-if="headerSettings.show_account !== false"
                        @click="goToAccount"
                        class="hidden md:inline-flex text-gray-600 hover:text-theme focus:outline-none"
                        :aria-label="authStore.isAuthenticated ? 'My Account' : 'Login'"
                    >
                        <img :src="'/assets/chhondo/profile.svg'" alt="" class="w-6 h-6" />
                    </button>
                    <button
                        v-if="headerSettings.show_wishlist !== false"
                        @click="goToWishlist"
                        class="relative hidden md:inline-flex text-gray-600 hover:text-theme focus:outline-none"
                        aria-label="Wishlist"
                    >
                        <img :src="'/assets/chhondo/heart.svg'" alt="" class="w-6 h-6" />
                    </button>
                    <button
                        @click="toggleMobileMenu"
                        class="mobile-header-icon"
                        aria-label="Open menu"
                    >
                        <img :src="'/assets/chhondo/menu.svg'" alt="" />
                    </button>
                </div>
            </div>
        </div>

        <MobileMenu
            :menuItems="mobileMenuItems"
            :isMobileMenuOpen="isMobileMenuOpen"
            :toggleMobileMenu="toggleMobileMenu"
        />
    </header>


    <CartSidebar />
</template>

<style scoped>
.header-top-area {
    height: 76px;
    padding-block: 12px !important;
    background: #fff !important;
    border-bottom: 0 !important;
}

.chhondo-logo {
    display: grid;
    grid-template-rows: 42px 7px;
    align-items: center;
    justify-items: center;
    width: 57px;
    height: 52px;
    overflow: hidden;
}

.chhondo-logo-mark { width: 48px; height: 42px; display: block; }
.chhondo-logo-word { width: 57px; height: 7px; display: block; }
/* Figma phone header: 92px tall, 20px padding, 24px icons 20px apart. */
.mobile-header { padding: 20px; background: #fff; }
@media (min-width: 768px) { .mobile-header { padding-inline: 32px; } }
.mobile-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: opacity .2s ease;
}
.mobile-header-icon:hover { opacity: .68; }
.mobile-header-icon > img { width: 24px; height: 24px; display: block; }

.header-figma-icon {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: opacity .2s ease, transform .2s ease;
}
.header-figma-icon:hover { opacity: .68; transform: translateY(-1px); }
.header-figma-icon > img,
.header-figma-icon-img { width: 28px; height: 28px; display: block; }
.header-area { background: #fff; }

/* Figma: 28px icons, 28px apart. The buttons are 28px wide, so the gap is
   the spacing itself. */
.header-actions { gap: 28px; }
.header-actions .header-figma-icon,
.header-actions .header-icon-btn,
.header-actions .cart-icon-btn { width: 28px; height: 28px; }
.header-actions .desktop-search-area { display: none; }

/* ── Mobile search sheet ─────────────────────────────────── */
.sr-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid #eee4d8;
}

.sr-field {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
}

.sr-field-icon {
    position: absolute;
    left: 12px;
    color: #9ca3af;
    pointer-events: none;
}

.sr-input {
    width: 100%;
    padding: 11px 36px 11px 38px;
    border: 1.5px solid #e5e0d8;
    border-radius: 999px;
    background: #fffaf4;
    font-size: 15px;
    color: #374151;
    outline: none;
}

.sr-input:focus { border-color: var(--color-theme); }
.sr-input::-webkit-search-cancel-button { display: none; }

.sr-clear,
.sr-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: none;
    color: #6b7280;
    cursor: pointer;
}

.sr-clear {
    position: absolute;
    right: 10px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #ece5da;
}

.sr-close {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 999px;
}

.sr-close:hover { background: #f3efe9; color: #1f2937; }

/* ── Results ─────────────────────────────────────────────── */
.sr-body { flex-grow: 1; overflow-y: auto; }

.sr-state {
    margin: 0;
    padding: 28px 16px;
    text-align: center;
    font-size: 14px;
    color: #8a8378;
}

.sr-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-bottom: 1px solid #f4ece1;
}

.sr-item:hover { background: #fffaf4; }

.sr-thumb {
    flex-shrink: 0;
    width: 52px;
    height: 66px;
    object-fit: cover;
    border-radius: 8px;
    background: #f4ece1;
}

.sr-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.sr-name {
    font-size: 14px;
    font-weight: 600;
    color: #2c1a0e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sr-cat { font-size: 12px; color: #8a8378; }

.sr-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 1px;
}

.sr-now { font-size: 14px; font-weight: 600; color: var(--color-theme); }

.sr-was {
    font-size: 12px;
    color: #a89f93;
    text-decoration: line-through;
}

.sr-oos {
    padding: 1px 7px;
    border-radius: 999px;
    background: #fdecec;
    font-size: 11px;
    color: #b91c1c;
}

.sr-more {
    display: block;
    width: 100%;
    padding: 14px;
    border: 0;
    background: none;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-theme);
    cursor: pointer;
}

.sr-empty { padding: 34px 20px; text-align: center; }
.sr-empty-icon { margin: 0 auto 10px; color: #cbbfae; }

.sr-empty-title {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 600;
    color: #3e3c3a;
}

.sr-empty-note { margin: 0; font-size: 13px; color: #8a8378; }

/* Desktop search */
.desktop-search-box {
    display: flex;
    align-items: center;
    border: 1.5px solid #d1d5db;
    border-radius: 50px;
    overflow: hidden;
    background: white;
    transition: border-color 0.2s ease;
}
.desktop-search-box:focus-within {
    border-color: var(--color-theme);
}
.desktop-search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px 0 12px;
    color: #9ca3af;
}
.desktop-search-input {
    height: 36px;
    width: 140px;
    border: none;
    outline: none;
    padding-right: 12px;
    background: white;
    transition: width 0.3s ease;
}
.desktop-search-input:focus {
    width: 170px;
}

/* Header action icons (user, wishlist) */
.header-icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 36px;
    color: #252120;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease, opacity 0.2s ease;
}
.header-icon-btn:hover {
    color: var(--color-theme);
    opacity: 0.85;
}
.header-icon-btn.has-items {
    color: var(--color-theme);
}

/* Logged-in user avatar (initial + frame ring) */
.user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background: #ecf1e8;
    color: var(--color-theme, #356019);
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 15px;
    line-height: 1;
    border: 2px solid var(--color-theme, #356019);
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(53, 96, 25, 0.25);
    transition: transform 0.2s ease;
}

.user-avatar:hover {
    transform: scale(1.05);
}

.user-avatar--sm {
    width: 30px;
    height: 30px;
    font-size: 13px;
}

.header-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background-color: #3E711D;
    color: white;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    font-weight: 700;
}

/* Cart icon wrapper */
.cart-icon-wrapper {
    transition: opacity 0.2s ease;
}
.cart-icon-wrapper:hover {
    opacity: 0.8;
}
.cart-icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 36px;
    border: 0;
    background: transparent;
    cursor: pointer;
}

/* Cart and wishlist counts */
.header-count-badge {
    position: absolute;
    top: -6px;
    right: -8px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9999px;
    background: #cc9b25;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font: 600 11px/1 "Poppins", sans-serif;
    pointer-events: none;
}

.cart_count {
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: #d1d5db;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
}

.cart_count--active {
    background-color: #3E711D;
}

/* Mobile search area (unchanged) */
.search_area input {
    width: 100%; height: 3rem; border-radius: 0.375rem;
    border: 1px solid var(--color-theme); padding: 0 4rem 0 1.25rem;
    outline: none;
}
.search_area input:focus { box-shadow: 0 0 0 1px #e5e7eb; }
.search_btn {
    background: var(--color-theme); color: white; height: 3rem; width: 3.5rem;
    display: flex; align-items: center; justify-content: center;
    position: absolute; right: 0; border-radius: 0 0.375rem 0.375rem 0;
}

.transition-transform {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Announcement bar */
.header-announcement {
    background-color: var(--color-theme, #356019);
    color: #fff;
    padding: 8px 0;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 13px;
    line-height: 20px;
}

.header-announcement a:hover {
    text-decoration: underline;
}

/* Sticky header — desktop only */
@media (min-width: 1280px) {
    .header-sticky {
        position: sticky;
        top: 0;
        z-index: 50;
        background-color: #fff;
    }
}
</style>
