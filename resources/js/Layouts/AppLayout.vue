<script setup>
import { watch, provide, reactive } from "vue";
import { usePage } from "@inertiajs/vue3";
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
</script>

<template>
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
        <div :class="hideFooter ? 'pb-[76px] md:pb-0' : null">
            <slot />
        </div>
        <Footer v-if="!hideFooter" />
        <MobileBottomNav />
        <LoginPromptModal />
    </div>
</template>
