<script setup>
import { ref, watch } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head, router, usePage } from "@inertiajs/vue3";
import { toast } from "@steveyuowo/vue-hot-toast";

// Props from Inertia (server passes orderData and invoice from trackOrder method)
const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
    intro: { type: Object, default: () => ({}) },
    orderData: { type: Object, default: null },
    invoice:   { type: String, default: "" },
});

const page          = usePage();
const invoiceNumber = ref(props.invoice || "");
const orderData     = ref(props.orderData || null);
const loading       = ref(false);
const errorMessage  = ref("");

// Sync when Inertia navigates back with results
watch(() => page.props.orderData, (val) => {
    orderData.value = val;
    if (!val && invoiceNumber.value) {
        errorMessage.value = props.texts.search_not_found;
    } else {
        errorMessage.value = "";
    }
});

const trackOrder = () => {
    if (!invoiceNumber.value) {
        errorMessage.value = props.texts.search_empty;
        return;
    }
    loading.value     = true;
    errorMessage.value = "";

    router.get("/track-order", { invoice: invoiceNumber.value }, {
        preserveState:  true,
        preserveScroll: true,
        onFinish: () => { loading.value = false; },
    });
};

// Copying anything here (the order ID, say) confirms with a small toast.
const onCopy = () => toast.success("কপি হয়েছে!");
</script>

<template>
    <Head>
        <title>{{ texts.tab_title }}</title>
    </Head>

    <AppLayout>
        <section class="track-page min-h-screen py-10 md:py-16" @copy="onCopy">
            <div class="container max-w-3xl mx-auto px-4">

                <!-- Page Header -->
                <div class="text-center mb-8">
                    <h1 class="track-title">{{ intro?.title }}</h1>
                    <p v-if="intro?.subtitle" class="track-sub">{{ intro.subtitle }}</p>
                </div>

                <!-- Search Card -->
                <div class="track-card p-5 md:p-6 mb-6">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="relative flex-grow">
                            <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                v-model="invoiceNumber"
                                @keyup.enter="trackOrder"
                                :placeholder="texts.search_placeholder"
                                class="track-input w-full pl-12 pr-4 focus:outline-none text-sm"
                            />
                        </div>
                        <button
                            @click="trackOrder"
                            :disabled="loading"
                            class="track-btn flex items-center justify-center gap-2 px-6 text-white text-nowrap transition-all"
                        >
                            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            {{ loading ? texts.search_loading : texts.search_button }}
                        </button>
                    </div>

                    <!-- Error -->
                    <div v-if="errorMessage" class="mt-4 flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ errorMessage }}
                    </div>
                </div>

                <!-- Order Details -->
                <div v-if="orderData" class="flex flex-col gap-5">

                    <!-- Summary Card -->
                    <div class="track-card p-5 md:p-7 rounded-2xl">
                        <div class="flex items-start justify-between flex-wrap gap-3 pb-5 mb-5 border-b border-[#f2e3cf]">
                            <div>
                                <h2 class="body-2-sb text-[#3E3C3A]">{{ texts.t2 }}</h2>
                                <p class="text-xs text-[#9ca3af] mt-0.5 tracking-wide">{{ texts.t13 }}{{ orderData.invoice_number }}</p>
                            </div>
                            <span :class="['status-badge', 'badge-' + orderData.order_status?.toLowerCase().replace(/\s+/g, '_')]">
                                {{ orderData.order_status }}
                            </span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="info-row">
                                <div class="info-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="info-label">{{ texts.t3 }}</p>
                                    <p class="info-value">{{ orderData.customer_name ?? 'N/A' }}</p>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="info-label">{{ texts.t4 }}</p>
                                    <p class="info-value font-semibold text-theme">৳ {{ orderData.total_price }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <template v-if="orderData.items.length > 0">
                        <div class="track-card rounded-2xl overflow-hidden">
                            <div class="px-5 md:px-7 py-4 border-b border-[#f2e3cf]">
                                <h3 class="body-2-sb text-[#3E3C3A]">{{ texts.t5 }}</h3>
                            </div>

                            <!-- Desktop Table -->
                            <div class="hidden md:block overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="bg-[#FEF8F0]">
                                            <th class="px-7 py-3 text-left text-xs font-semibold text-[#6d6560] uppercase tracking-wider">{{ texts.t6 }}</th>
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider">{{ texts.t7 }}</th>
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider">{{ texts.t8 }}</th>
                                            <th class="px-7 py-3 text-right text-xs font-semibold text-[#6d6560] uppercase tracking-wider">{{ texts.t9 }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-[#f2e3cf]">
                                        <tr v-for="(item, index) in orderData.items" :key="index" class="hover:bg-[#fffdf9] transition-colors">
                                            <td class="px-7 py-4">
                                                <div class="flex items-center gap-3">
                                                    <img :src="item.product.featured_image || '/placeholder.svg'" alt="Product Image" class="w-14 h-14 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0" loading="lazy" decoding="async" width="56" height="56" @error="$event.target.src = '/placeholder.svg'" />
                                                    <span class="text-sm font-medium text-[#3E3C3A]">{{ item.product.product_name }}</span>
                                                </div>
                                            </td>
                                            <td class="px-4 py-4 text-center text-sm text-[#6d6560]">{{ item.quantity }}</td>
                                            <td class="px-4 py-4 text-center text-sm text-[#6d6560]">৳ {{ item.price }}</td>
                                            <td class="px-7 py-4 text-right text-sm font-semibold text-theme">৳ {{ (item.price * item.quantity).toFixed(2) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Mobile Cards -->
                            <div class="md:hidden divide-y divide-[#f2e3cf]">
                                <div v-for="(item, index) in orderData.items" :key="index" class="flex gap-3.5 p-4">
                                    <img :src="item.product.featured_image || '/placeholder.svg'" alt="Product Image" class="w-16 h-16 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0" loading="lazy" decoding="async" width="64" height="64" @error="$event.target.src = '/placeholder.svg'" />
                                    <div class="flex-grow min-w-0">
                                        <p class="text-sm font-medium text-[#3E3C3A] leading-snug">{{ item.product.product_name }}</p>
                                        <div class="flex flex-wrap gap-x-4 mt-1.5">
                                            <span class="text-xs text-[#9ca3af]">{{ texts.t10 }}<span class="text-[#3E3C3A] font-medium">{{ item.quantity }}</span></span>
                                            <span class="text-xs text-[#9ca3af]">{{ texts.t11 }}<span class="text-[#3E3C3A] font-medium">৳ {{ item.price }}</span></span>
                                        </div>
                                        <p class="mt-1.5 text-sm font-semibold text-theme">৳ {{ (item.price * item.quantity).toFixed(2) }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Total Footer -->
                            <div class="px-5 md:px-7 py-4 bg-[#FEF8F0] border-t border-[#f2e3cf] flex items-center justify-between">
                                <p class="text-sm text-[#6d6560]">{{ orderData.items.length }} {{ texts.t14 }}{{ orderData.items.length !== 1 ? 's' : '' }}</p>
                                <div class="text-right">
                                    <p class="text-xs text-[#9ca3af] uppercase tracking-wider font-medium">{{ texts.t12 }}</p>
                                    <p class="text-xl font-bold text-theme">৳ {{ orderData.total_price }}</p>
                                    <p v-if="orderData.payment_summary" class="mt-0.5 text-xs text-[#6d6560]">Payment: {{ orderData.payment_summary }}</p>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </section>
  
    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.track-page {
    background-color: #fffaf4;
}

.track-card {
    background-color: #ffffff;
    border: 1px solid #f2e3cf;
}

.track-btn {
    background-color: var(--color-theme);
}
.track-btn:hover:not(:disabled) {
    background-color: var(--color-secondary);
}
.track-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}
.badge-pending      { background-color: #FEF3C7; color: #D97706; }
.badge-processing   { background-color: #FEF3C7; color: #D97706; }
.badge-on_delivery  { background-color: #D1FAE5; color: #059669; }
.badge-shipped      { background-color: #D1FAE5; color: #059669; }
.badge-delivered    { background-color: #DCFCE7; color: #16A34A; }
.badge-cancelled    { background-color: #FEE2E2; color: #DC2626; }

/* Info Rows */
.info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    background-color: #fffaf4;
    border: 1px solid #f2e3cf;
    border-radius: 12px;
}
.info-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: #FEF1DD;
    color: var(--color-theme);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.info-label {
    font-size: 10px;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}
.info-value {
    font-size: 14px;
    color: #3E3C3A;
    font-weight: 500;
    margin-top: 2px;
}

/* ===== Figma "Track Order" card ===== */
.track-page { background-color: #fff; }
.track-title { margin: 0; font: 600 28px/36px "Poppins", "Li Ador Noirrit", sans-serif; color: #1a1817; }
.track-sub { margin-top: 8px; font: 400 16px/24px "Poppins", "Li Ador Noirrit", sans-serif; color: #6d6560; }
.track-card {
    border: 0;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.track-input {
    height: 56px;
    border: 1px solid #e4e1e0;
    border-radius: 8px;
    background: #f3f3f3;
    font-family: "Poppins", sans-serif;
    color: #1a1817;
}
.track-input:focus { border-color: #d6af51; background: #fff; box-shadow: 0 0 0 3px rgba(214, 175, 81, .18); }
.track-btn {
    height: 56px;
    border-radius: 8px;
    background-color: #1a2110;
    font: 500 20px/24px "Poppins", sans-serif;
}
.track-btn:hover:not(:disabled) { background-color: #252f17; }

/* Phones: no full-screen minimum — the page ends 48px below the last card
   (its own 24px margin plus 24px), the gap every phone page keeps. */
@media (max-width: 767px) {
  .track-page { min-height: 0; padding-bottom: 24px; }
}
</style>
