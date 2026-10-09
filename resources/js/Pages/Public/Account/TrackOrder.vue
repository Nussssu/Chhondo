<template>
  <Head><title>{{ tx('acc_tab_title', 'Track Order') }}</title></Head>

  <AccountLayout>
    <div class="track-page" @copy="onCopy">
      <div class="section-header">
        <span class="section-header-icon"><img :src="'/assets/images/account/track-heading.svg'" alt="" /></span>
        <div>
          <p class="section-header-title">{{ tx('acc_title', 'Track Order') }}</p>
          <p class="section-header-subtitle">{{ tx('acc_subtitle', 'অর্ডার ট্র্যাক') }}</p>
        </div>
      </div>

      <section class="track-card track-search-card">
        <div class="track-card-heading">
          <h2>{{ tx('acc_search_heading', 'Track Your Order') }}</h2>
          <p>{{ tx('acc_search_text', 'Enter your order ID to see real-time status') }}</p>
        </div>

        <div class="track-search-row">
          <input v-model="invoiceNumber" type="text" :placeholder="tx('acc_search_placeholder', 'e.g. CHK-2025-0481')" class="track-search-input" @keyup.enter="trackOrder" />
          <button type="button" class="track-search-btn" :disabled="loading" @click="trackOrder">
            <img v-if="!loading" :src="'/assets/images/account/track-button.svg'" alt="" />
            <span v-else class="track-spinner" aria-hidden="true" />
            {{ loading ? tx('acc_search_loading', 'Searching...') : tx('acc_search_button', 'Track') }}
          </button>
        </div>

        <p v-if="errorMessage" class="track-error" role="alert">{{ errorMessage }}</p>
      </section>

      <div v-if="orderData" class="track-results">
        <section class="track-card track-summary-card">
          <div class="track-summary-header">
            <div class="track-summary-copy">
              <p class="track-summary-label">{{ tx('acc_order_id_label', 'ORDER ID') }}</p>
              <p class="track-summary-value">{{ orderData.invoice_number }}</p>
              <p class="track-summary-meta">{{ tx('acc_placed_on', 'Placed on') }} {{ formatDate(orderData.created_at) }}</p>
            </div>
            <span class="order-status-pill" :style="badgeStyle(orderData.order_status)">{{ statusLabel(orderData.order_status) }}</span>
          </div>
          <p class="track-summary-address">
            <img :src="'/assets/images/account/track-location.svg'" alt="" />
            <span>{{ orderData.address || tx('acc_no_address', 'কোনো ঠিকানা নেই') }}</span>
          </p>
        </section>

        <section v-if="!isExceptionStatus(orderData.order_status)" class="track-card track-progress-card">
          <h2 class="track-section-title">{{ tx('acc_progress_title', 'Shipment Progress') }}</h2>
          <OrderStepper variant="vertical" :current-step-index="getOrderStepIndex(orderData.order_status) ?? 0" :placed-at="orderData.created_at" :updated-at="orderData.updated_at" />
        </section>

        <section class="track-card track-items-card">
          <div class="order-items">
            <div v-for="(item, idx) in (orderData.items || [])" :key="item.id ?? idx" class="order-item-row">
              <img :src="item.product?.featured_image || '/placeholder.svg'" :alt="item.product?.product_name || ''" class="order-item-thumb" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
              <div class="order-item-info">
                <p class="order-item-name">{{ item.product?.product_name || 'পণ্য' }}</p>
                <p class="order-item-qty">{{ tx('acc_qty_label', 'Qty:') }} {{ item.quantity }}</p>
              </div>
              <p class="order-item-price"><span>৳</span>{{ formatMoney(item.price) }}</p>
            </div>
          </div>
          <div class="track-total-row">
            <span>{{ tx('acc_total_label', 'Total') }}</span>
            <span class="track-total-price"><span>৳</span>{{ formatMoney(orderData.total_price) }}</span>
          </div>
          <div v-if="orderData.payment_summary" class="track-payment-row"><span>{{ tx('acc_payment_label', 'পেমেন্ট') }}</span><span>{{ orderData.payment_summary }}</span></div>
        </section>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from "@/Layouts/AccountLayout.vue";
import OrderStepper from "@/components/Account/OrderStepper.vue";
import { ref, watch } from "vue";
import { Head, router, usePage } from "@inertiajs/vue3";
import { toast } from "@steveyuowo/vue-hot-toast";
import { getOrderStepIndex, getOrderStatusBadge, isExceptionStatus } from "@/utils/orderStatus";

const props = defineProps({
  orderData: { type: Object, default: null },
  invoice: { type: String, default: "" },
  // Wording from Content › Pages › Track order (the "মাই অ্যাকাউন্ট" sections).
  texts: { type: Object, default: () => ({}) },
});

// A saved wording, or the one this page always showed.
const tx = (key, fallback) => props.texts?.[key] || fallback;
const page = usePage();
const invoiceNumber = ref(props.invoice || "");
const orderData = ref(props.orderData || null);
const loading = ref(false);
// Opened with a number that matches no order (a shared link, a refresh):
// say so straight away.
const errorMessage = ref(props.invoice && !props.orderData ? tx('acc_search_not_found', 'Order not found.') : "");

watch(() => page.props.orderData, (value) => {
  orderData.value = value;
  errorMessage.value = (!value && invoiceNumber.value) ? tx('acc_search_not_found', 'Order not found.') : "";
});

const trackOrder = () => {
  const invoice = invoiceNumber.value.trim();
  if (!invoice) { errorMessage.value = tx('acc_search_empty', 'Please enter a valid order ID.'); return; }
  invoiceNumber.value = invoice;
  loading.value = true;
  errorMessage.value = "";
  router.get("/account/track-order", { invoice }, {
    preserveState: true,
    preserveScroll: true,
    // The watcher only fires when the result changes, so a second wrong
    // number in a row showed nothing; say so on every search that misses.
    onSuccess: (visit) => {
      const found = visit.props.orderData;
      orderData.value = found || null;
      errorMessage.value = found ? "" : tx('acc_search_not_found', 'Order not found.');
    },
    onFinish: () => { loading.value = false; },
  });
};

const trackSuggested = (invoice) => { invoiceNumber.value = invoice; trackOrder(); };
const formatDate = (dateString) => dateString
  ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateString))
  : "—";
const formatMoney = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value) || 0);
const badgeStyle = (status) => { const { bg, text } = getOrderStatusBadge(status); return { backgroundColor: bg, color: text }; };
const statusLabel = (status) => String(status || "Pending").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

// Copying anything here (the order ID, say) confirms with a small toast.
const onCopy = () => toast.success("কপি হয়েছে!");
</script>

<style scoped>
.track-page { display: flex; flex-direction: column; gap: 24px; width: 100%; }
.section-header { display: flex; align-items: center; gap: 8px; height: 44px; }
.section-header-icon { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: #d4e0c8; flex-shrink: 0; }
.section-header-icon img { display: block; }
.section-header-title { margin: 0; font: 600 16px/24px "Poppins", sans-serif; color: #1a1817; }
.section-header-subtitle { margin: 0; font: 600 12px/20px "Li Ador Noirrit", sans-serif; color: #3c3834; }

.track-card { padding: 24px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 2px 6px -2px rgba(0,0,0,.03), 0 4px 16px -4px rgba(0,0,0,.12); }
.track-search-card { display: flex; flex-direction: column; gap: 16px; }
.track-card-heading { display: flex; flex-direction: column; gap: 4px; }
.track-card-heading h2, .track-section-title { margin: 0; font: 600 14px/20px "Poppins", sans-serif; color: #1a1817; }
.track-card-heading p { margin: 0; font: 400 12px/16px "DM Sans", "Poppins", sans-serif; color: #3c3834; }
.track-search-row { display: flex; align-items: flex-start; gap: 12px; }
.track-search-input { flex: 1 1 auto; min-width: 0; height: 56px; padding: 16px; border: 1px solid #e4e1e0; border-radius: 8px; background: #f3f3f3; font: 400 16px/24px "Poppins", sans-serif; color: #1a1817; }
.track-search-input::placeholder { color: #9c9591; opacity: 1; }
.track-search-input:focus { border-color: #d6af51; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(214,175,81,.18); }
.track-search-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 120px; height: 56px; padding: 0 16px; border-radius: 8px; background: #1a2110; font: 500 20px/24px "Poppins", sans-serif; color: #fff; white-space: nowrap; }
.track-search-btn img { display: block; }
.track-search-btn:hover:not(:disabled) { background: #252f17; }
.track-search-btn:disabled { opacity: .7; cursor: not-allowed; }
.track-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: track-spin .7s linear infinite; }
@keyframes track-spin { to { transform: rotate(360deg); } }
.track-suggestions { margin: 0; font: 400 12px/20px "Poppins", sans-serif; color: #4c5441; }
.track-suggestions button { padding: 0; border: 0; background: none; font: 400 16px/24px "Poppins", sans-serif; color: #cc9b25; text-decoration: underline; text-underline-position: from-font; }
.track-error { margin: -4px 0 0; font: 400 12px/20px "Poppins", sans-serif; color: #b91c1c; }

.track-results { display: flex; flex-direction: column; gap: 20px; }
.track-summary-card { display: flex; flex-direction: column; gap: 8px; }
.track-summary-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 72px; overflow: hidden; }
.track-summary-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 0; }
.track-summary-label { margin: 0; font: 600 12px/20px "Poppins", sans-serif; color: #3c3834; }
.track-summary-value { margin: 0; font: 600 16px/24px "Poppins", sans-serif; color: #2c1a0e; }
.track-summary-meta { margin: 0; font: 400 12px/20px "Poppins", sans-serif; color: #cc9b25; }
.order-status-pill { padding: 4px 10px; border-radius: 9999px; font: 600 12px/16px "DM Sans", "Poppins", sans-serif; white-space: nowrap; }
.track-summary-address { display: flex; align-items: center; gap: 8px; margin: 0; padding-top: 13px; border-top: 1px solid #e4e1e0; font: 400 12px/20px "Poppins", sans-serif; color: #cc9b25; }
.track-summary-address img { display: block; flex-shrink: 0; }

.track-progress-card { min-height: 458px; }
.track-section-title { margin-bottom: 20px; color: #2c1a0e; }
.track-items-card { display: flex; flex-direction: column; gap: 16px; }
.order-items { display: flex; flex-direction: column; gap: 8px; }
.order-item-row { display: flex; align-items: center; gap: 12px; padding: 8px 0 9px; border-bottom: 1px solid #e4e1e0; }
.order-item-thumb { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.order-item-info { flex: 1 1 auto; min-width: 0; }
.order-item-name { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 14px/20px "Li Ador Noirrit", sans-serif; color: #1a1817; }
.order-item-qty { margin: 0; font: 400 12px/20px "Poppins", sans-serif; color: #7a5c3e; }
.order-item-price, .track-total-price { margin: 0; flex-shrink: 0; font: 600 14px/20px "Poppins", sans-serif; color: #2d4a2d; }
.order-item-price span, .track-total-price span { font: 700 16px/24px "Li Ador Noirrit", sans-serif; }
.track-total-row { display: flex; align-items: center; justify-content: space-between; padding-top: 13px; border-top: 1px solid #e4e1e0; font: 600 14px/20px "Poppins", sans-serif; color: #1a1817; }
.track-payment-row { display: flex; justify-content: space-between; font: 400 12px/20px "Li Ador Noirrit", "Poppins", sans-serif; color: #6d6560; }

@media (max-width: 767px) {
  .track-page { gap: 16px; }
  .track-search-row { flex-direction: column; }
  .track-search-btn { width: 100%; }
  .track-card { padding: 20px; }
  .track-suggestions { white-space: normal; }
  .track-progress-card { min-height: 0; }
}
</style>
