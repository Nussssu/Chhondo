<script setup>
import ClientOnly from "@/components/ClientOnly.vue";
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
    PhList,
} from "@phosphor-icons/vue";
import { SearchIcon, XIcon } from "lucide-vue-next";
import NavigationMenu from "@/components/Header/NavigationMenu.vue";
import MobileMenu from "@/components/Header/MobileMenu.vue";
import CartSidebar from "@/components/Header/CartSidebar.vue";
import UserIcon from "@/components/Icons/UserIcon.vue";
import HeartIcon from "@/components/Icons/HeartIcon.vue";
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

// First letter of the logged-in user's name, shown in the header avatar.
const userInitial = computed(() => {
    const name = authStore.user?.name || "";
    return name ? name.charAt(0).toUpperCase() : "U";
});

// User icon → account when logged in, otherwise the login page.
const goToAccount = () => {
    router.visit(authStore.isAuthenticated ? "/account" : "/login");
};

// Heart icon → wishlist page when logged in, otherwise prompt to log in.
const goToWishlist = () => {
    if (authStore.isAuthenticated) {
        router.visit("/account/wishlist");
    } else {
        authPrompt.open("Log in to view the items saved to your wishlist.");
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
const headerSettings = computed(() => layout.value.header ?? {});

const menuItems = computed(() => {
    const items = layout.value.menu ?? [];

    if (!items.length) {
        return [
            { id: 1, title: "Our Story", url: "/about-us", submenu: [] },
            { id: 2, title: "Contact Us", url: "/contact-us", submenu: [] },
        ];
    }

    // Recursive, so a sub item's own sub items reach the dropdown instead of
    // being dropped one level down.
    const toSubmenu = (list) =>
        (list ?? []).map((entry) => ({
            id: entry.id,
            // Carried through so the menu can hold a categories dropdown.
            type: entry.type,
            // Which categories a dropdown item lists; empty means all of them.
            categoryIds: entry.category_ids ?? [],
            title: entry.label,
            url: entry.url,
            target: entry.target,
            submenu: toSubmenu(entry.children),
        }));

    return toSubmenu(items);
});

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
});

const openSearch = () => {
    isOpen.value = true;
    searchQuery.value = ""; // Reset search query
    nextTick(() => {
        searchInput.value.focus();
    });
};

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
    <header class="header-area header-sticky">
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
                    <!-- Logo -->
                    <div class="logo_area shrink-0">
                        <Link href="/" class="logo w-[180px] block">
                            <img
                                :src="homeStore.logo"
                                alt="Site Logo"
                                class="site-logo"
                            />
                        </Link>
                    </div>

                    <!-- Center Nav -->
                    <div class="flex-grow flex justify-center">
                        <NavigationMenu :menuItems="menuItems" :categories="categories" />
                    </div>

                    <!-- Right: Search + Cart -->
                    <div class="flex items-center gap-3 shrink-0">
                        <!-- Search -->
                        <div v-if="headerSettings.show_search !== false" class="desktop-search-area relative" ref="searchInput">
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

                        <!-- User Icon -->
                        <button
                            v-if="headerSettings.show_account !== false"
                            @click="goToAccount"
                            type="button"
                            class="header-icon-btn"
                            :title="authStore.isAuthenticated ? 'My Account' : 'Login'"
                            :aria-label="authStore.isAuthenticated ? 'My Account' : 'Login'"
                        >
                            <span v-if="authStore.isAuthenticated" class="user-avatar">{{ userInitial }}</span>
                            <UserIcon v-else :size="34" />
                        </button>

                        <!-- Wishlist Icon -->
                        <button
                            v-if="headerSettings.show_wishlist !== false"
                            @click="goToWishlist"
                            type="button"
                            class="header-icon-btn"
                            :class="{ 'has-items': wishlistStore.count > 0 }"
                            title="Wishlist"
                            aria-label="Wishlist"
                        >
                            <HeartIcon :size="26" :filled="wishlistStore.count > 0" />
                            <span
                                v-if="wishlistStore.count > 0"
                                class="header-badge"
                            >{{ wishlistStore.count }}</span>
                        </button>

                        <!-- Cart Icon -->
                        <div class="cart-icon-wrapper">
                            <button @click="cartStore.toggleCart" type="button" class="cart-icon-btn">
                                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6668 9.33329V7.99996C10.6668 6.58547 11.2287 5.22892 12.2289 4.22872C13.2291 3.22853 14.5857 2.66663 16.0002 2.66663C17.4147 2.66663 18.7712 3.22853 19.7714 4.22872C20.7716 5.22892 21.3335 6.58547 21.3335 7.99996V9.33329H25.3335C26.0695 9.33329 26.6668 9.93196 26.6668 10.676V26.6773C26.6668 28.144 25.4735 29.3333 24.0082 29.3333H7.99216C7.2875 29.3333 6.61166 29.0535 6.11314 28.5555C5.61462 28.0575 5.3342 27.382 5.3335 26.6773V10.6773C5.3335 9.93329 5.92683 9.33329 6.66683 9.33329H10.6668ZM12.2668 9.33329H19.7335V7.99996C19.7335 7.00982 19.3402 6.06023 18.64 5.36009C17.9399 4.65996 16.9903 4.26663 16.0002 4.26663C15.01 4.26663 14.0604 4.65996 13.3603 5.36009C12.6602 6.06023 12.2668 7.00982 12.2668 7.99996V9.33329ZM10.6668 10.9333H6.9335V26.6773C6.9335 27.2586 7.40816 27.7333 7.99216 27.7333H24.0082C24.2885 27.7333 24.5574 27.6221 24.7558 27.4242C24.9543 27.2262 25.0661 26.9576 25.0668 26.6773V10.9333H21.3335V14.6666H19.7335V10.9333H12.2668V14.6666H10.6668V10.9333Z" fill="#252120"/>
                                </svg>
                                <span class="cart_count" :class="{ 'cart_count--active': cartStore.cartCount > 0 }">{{ cartStore.cartCount }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Header -->
        <div class="container xl:hidden py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <!-- Left: Logo -->
                <div class="logo_area">
                    <Link href="/" class="logo w-[120px] block">
                        <img :src="homeStore.logo" alt="logo" />
                    </Link>
                </div>

                <!-- Right: Search + User + Wishlist + Burger -->
                <div class="flex items-center gap-4">
                    <button
                        v-if="headerSettings.show_search !== false"
                        @click="openSearch"
                        class="text-gray-600 hover:text-theme focus:outline-none"
                    >
                        <PhMagnifyingGlass :size="24" />
                    </button>
                    <!-- Account lives in the bottom nav on phones; kept here for
                         tablets (768px+), where the bottom nav is hidden. -->
                    <button
                        @click="goToAccount"
                        class="hidden md:inline-flex text-gray-600 hover:text-theme focus:outline-none"
                        :aria-label="authStore.isAuthenticated ? 'My Account' : 'Login'"
                    >
                        <span v-if="authStore.isAuthenticated" class="user-avatar user-avatar--sm">{{ userInitial }}</span>
                        <UserIcon v-else :size="30" />
                    </button>
                    <button
                        v-if="headerSettings.show_wishlist !== false"
                        @click="goToWishlist"
                        class="relative text-gray-600 hover:text-theme focus:outline-none"
                        :style="wishlistStore.count > 0 ? { color: 'var(--color-theme)' } : {}"
                        aria-label="Wishlist"
                    >
                        <HeartIcon :size="23" :filled="wishlistStore.count > 0" />
                        <span
                            v-if="wishlistStore.count > 0"
                            class="header-badge"
                        >{{ wishlistStore.count }}</span>
                    </button>
                    <button
                        @click="toggleMobileMenu"
                        class="text-gray-600 hover:text-theme focus:outline-none"
                    >
                        <PhList :size="28" v-if="!isMobileMenuOpen" />
                    </button>
                </div>
            </div>
        </div>

        <MobileMenu
            :menuItems="menuItems"
            :isMobileMenuOpen="isMobileMenuOpen"
            :toggleMobileMenu="toggleMobileMenu"
        />
    </header>

    <div class="search">
        <ClientOnly><Teleport to="body">
            <Transition name="slide-up">
                <div
                    v-if="isOpen"
                    class="fixed inset-0 z-50 flex items-start sm:items-center justify-center"
                >
                    <div
                        class="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        @click="closeSearch"
                    ></div>
                    <div
                        class="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[90vw] rounded-md max-w-3xl py-12 bg-white shadow-xl overflow-hidden flex flex-col"
                    >
                        <!-- Input and close on one row, so the sheet does not
                             waste a whole band of height on a Close button. -->
                        <div class="sr-bar">
                            <div class="sr-field">
                                <SearchIcon :size="18" class="sr-field-icon" />
                                <input
                                    ref="searchInput"
                                    v-model="searchQuery"
                                    type="search"
                                    inputmode="search"
                                    enterkeyhint="search"
                                    placeholder="পণ্য খুঁজুন…"
                                    class="sr-input"
                                    @input="onSearchInputChange"
                                    @keydown.enter="submitSearch"
                                    @keydown.esc="closeSearch"
                                />
                                <button
                                    v-if="searchQuery"
                                    type="button"
                                    class="sr-clear"
                                    aria-label="Clear"
                                    @click="searchQuery = ''; onSearchInputChange()"
                                >
                                    <XIcon :size="15" />
                                </button>
                            </div>
                            <button type="button" class="sr-close" aria-label="Close search" @click="closeSearch">
                                <XIcon :size="20" />
                            </button>
                        </div>

                        <div class="sr-body">
                            <p v-if="isLoading" class="sr-state">খুঁজছি…</p>

                            <p v-else-if="searchError" class="sr-state">
                                খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
                            </p>

                            <template v-else-if="filteredProducts.length">
                                <Link
                                    v-for="product in filteredProducts"
                                    :key="product.id"
                                    :href="`/product/${product.slug}`"
                                    class="sr-item"
                                    @click="closeSearch"
                                >
                                    <img
                                        :src="product.featured_image || '/placeholder.svg'"
                                        :alt="product.product_name"
                                        class="sr-thumb"
                                        loading="lazy"
                                    />
                                    <span class="sr-meta">
                                        <span class="sr-name">{{ product.product_name }}</span>
                                        <span v-if="product.category" class="sr-cat">{{ product.category }}</span>
                                        <span class="sr-price">
                                            <span class="sr-now">৳{{ product.price }}</span>
                                            <span
                                                v-if="product.previous_price && Number(product.previous_price) > Number(product.price)"
                                                class="sr-was"
                                            >৳{{ product.previous_price }}</span>
                                            <span v-if="!product.in_stock" class="sr-oos">স্টকে নেই</span>
                                        </span>
                                    </span>
                                </Link>

                                <button v-if="moreResults" type="button" class="sr-more" @click="submitSearch">
                                    আরও {{ moreResults }}টি ফলাফল দেখুন
                                </button>
                            </template>

                            <div v-else-if="showNoResults" class="sr-empty">
                                <SearchIcon :size="26" class="sr-empty-icon" />
                                <p class="sr-empty-title">“{{ searchQuery }}” এর কোনো ফলাফল নেই</p>
                                <p class="sr-empty-note">বানান দেখে নিন, বা অন্য শব্দ দিয়ে খুঁজুন।</p>
                            </div>

                            <p v-else class="sr-state">পণ্যের নাম বা কোড লিখে খুঁজুন।</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport></ClientOnly>
    </div>

    <CartSidebar />
</template>

<style scoped>
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
    font-family: "Hind Siliguri", "Poppins", sans-serif;
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
        background-color: #FFFAF4;
    }
}
</style>
