<script setup>
import { watch, provide, reactive, computed } from "vue";
import { usePage, Head } from "@inertiajs/vue3";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer.vue";
import MobileBottomNav from "@/components/MobileBottomNav.vue";
import Preloader from "@/components/Preloader/Preloader.vue";
import LoginPromptModal from "@/components/Auth/LoginPromptModal.vue";
import { Toaster, toast } from "@steveyuowo/vue-hot-toast";
import ClientOnly from "@/components/ClientOnly.vue";
import { useHomeStore } from "@/Store/homeStore";

// Log in and Sign up have no footer in the Figma.
defineProps({ hideFooter: { type: Boolean, default: false } });

const homeStore = useHomeStore();
const globalLoadingState = reactive({ isLoading: false });
provide('globalLoadingState', globalLoadingState);

const page = usePage();

// Landing only — the 76px mobile content pad plus the footer's own top pad
// stack into ~190px of dead space below the last home section.

// Server-side flash messages, surfaced through the Toaster that was already
// mounted here but had nothing feeding it. Watching the prop rather than
// reading it once matters: most storefront writes redirect back to the page
// they were made on, which patches this layout in place instead of remounting
// it. Each response carries a fresh props object, so repeating the same
// message twice still fires.
//
// This is the single source for anything that round-trips to the server —
// components should not also toast their own copy of a message the server
// already sent, or it appears twice.
watch(
    () => page.props.flash,
    (next) => {
        // Browser only. The toast queue is module state, which on the SSR
        // server is shared by every request: a message queued while rendering
        // one customer's page could surface in another's.
        if (!next || typeof window === "undefined") return;
        if (next.success) toast.success(next.success);
        if (next.error) toast.error(next.error);
    },
    { immediate: true }
);

// Dynamically set favicon
const updateFavicon = (faviconUrl) => {
    // The <head> is the browser's; on the server there is none to edit.
    if (!faviconUrl || typeof document === "undefined") return;
    
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(el => el.remove());
    
    // Create new favicon link.
    //
    // No `type` is declared: uploads are re-encoded to WebP, so announcing
    // image/x-icon described the file wrongly and browsers that trust the
    // declaration over the bytes dropped it. With no type they sniff, which
    // is correct for every format the admin can upload.
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = faviconUrl;
    document.head.appendChild(link);
};

// Watch for favicon changes
watch(
    () => homeStore.favicon,
    (newFavicon) => {
        updateFavicon(newFavicon);
    },
    { immediate: true }
);

const injectMarketingScripts = () => {
    if (typeof document === "undefined") return;

    // Remove previously injected scripts
    document.querySelectorAll(".marketing-script").forEach((el) => el.remove());

    if (!homeStore.siteinfos || !Array.isArray(homeStore.siteinfos.marketing))
        return;

    homeStore.siteinfos.marketing.forEach((scriptObj) => {
        if (!scriptObj.script) return;

        // Inject the script block (raw, without div) into <head>
        const headFragment = document
            .createRange()
            .createContextualFragment(scriptObj.script.trim());
        headFragment.childNodes.forEach((node) => {
            if (
                node.nodeType === Node.ELEMENT_NODE ||
                node.nodeType === Node.COMMENT_NODE ||
                node.nodeType === Node.TEXT_NODE
            ) {
                node.classList?.add?.("marketing-script"); // for cleanup tracking
                document.head.appendChild(node);
            }
        });

        // If Google Tag Manager: append second_script right after <body> (inside a div)
        if (
            scriptObj.name &&
            scriptObj.name.toLowerCase().includes("google tag manager") &&
            scriptObj.second_script
        ) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("marketing-script");
            wrapper.innerHTML = scriptObj.second_script.trim();
            document.body.insertAdjacentElement("afterbegin", wrapper);
        }
    });
};

// Watch for changes and re-inject scripts
watch(
    () => homeStore.siteinfos.marketing,
    () => {
        injectMarketingScripts();
    },
    { deep: true, immediate: true }
);

// Search title / description for the current page; empty when none was set.
const seo = computed(() => usePage().props.seo ?? {});
</script>

<template>
    <!-- The page's search title and description, set in the admin
         (Content › Pages › SEO, or a category's SEO fields). -->
    <Head v-if="seo.title || seo.description">
        <title v-if="seo.title">{{ seo.title }}</title>
        <meta v-if="seo.description" head-key="description" name="description" :content="seo.description" />
        <meta v-if="seo.title" head-key="og:title" property="og:title" :content="seo.title" />
        <meta v-if="seo.description" head-key="og:description" property="og:description" :content="seo.description" />
    </Head>
    <div class="app-layout">
        <!-- The toaster teleports to <body>; see ClientOnly. -->
        <ClientOnly><Toaster /></ClientOnly>
        <Preloader />
        <!-- Only staff reach the storefront while maintenance mode is on. -->
        <div v-if="page.props.storeInfo?.maintenance_mode"
            class="bg-amber-400 text-amber-950 text-center text-sm font-medium px-4 py-2">
            Maintenance mode is on — customers see the maintenance page, not this.
            <a href="/admin/manage" class="underline font-semibold ml-1">Turn it off</a>
        </div>
        <Header />
        <!-- Phones: the fixed bottom nav is cleared below the footer, so every
             page keeps the same gap above it. Without a footer the content
             clears it instead. -->
        <div class="storefront-content" :class="hideFooter || page.props.layout?.footer?.enabled === false ? 'pb-[76px] md:pb-0' : null">
            <slot />
        </div>
        <Footer v-if="!hideFooter" />
        <MobileBottomNav />
        <LoginPromptModal />
    </div>
</template>

<style scoped>
@media (max-width: 767px) {
    .storefront-content {
        --mobile-section-spacing: 48px;
        --mobile-content-spacing: 32px;
    }

    /* Main sections use a common vertical rhythm; prose blocks stay grouped
       with their headings, and image strips keep their edge-to-edge layout. */
    .storefront-content :deep(.blog-page),
    .storefront-content :deep(.categories-page),
    .storefront-content :deep(> section.track-page),
    .storefront-content :deep(.policy-page),
    .storefront-content :deep(.contact-page),
    .storefront-content :deep(.ab-hero),
    .storefront-content :deep(.ab-band),
    .storefront-content :deep(.ab-craft),
    .storefront-content :deep(.ab-values),
    .storefront-content :deep(.ab-quote),
    .storefront-content :deep(.chhondo-story),
    .storefront-content :deep(.chhondo-editorial),
    .storefront-content :deep(.reviews-section),
    .storefront-content :deep(.related-section),
    .storefront-content :deep(.recently-viewed),
    .storefront-content :deep(.post-related),
    .storefront-content :deep(.pb-block:not(.pb-block--prose)) {
        padding-block: var(--mobile-section-spacing);
    }

    .storefront-content :deep(.policy-inner),
    .storefront-content :deep(.policy-body),
    .storefront-content :deep(.checkout-grid),
    .storefront-content :deep(.ab-values-grid),
    .storefront-content :deep(.profile-address-row) {
        gap: var(--mobile-content-spacing);
    }

    .storefront-content :deep(.checkout-form-col) {
        gap: var(--mobile-content-spacing);
    }

    .storefront-content :deep(.auth-page) { gap: var(--mobile-content-spacing); }
    .storefront-content :deep(.blog-featured) { margin-bottom: var(--mobile-section-spacing); }
    .storefront-content :deep(.archive-header) { padding-bottom: var(--mobile-content-spacing); }
    .storefront-content :deep(.archive-inner) { padding-bottom: var(--mobile-section-spacing); }
    .storefront-content :deep(.cartPage > .container > .flex) { gap: var(--mobile-content-spacing); }

    .storefront-content :deep(.account-body) {
        padding-top: var(--mobile-content-spacing);
        gap: var(--mobile-content-spacing);
    }

    .storefront-content :deep(.account-titlebar-inner) {
        padding-bottom: var(--mobile-content-spacing);
    }
}
</style>
