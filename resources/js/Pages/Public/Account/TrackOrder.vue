<template>
  <Head>
    <title>Track Order</title>
  </Head>

  <AccountLayout>
    <div class="track-page">
      <div class="section-header">
        <span class="section-header-icon">
          <img :src="'/assets/images/account/nav-track-order.svg'" alt="" />
        </span>
        <div>
          <p class="section-header-title">Track Order</p>
          <p class="section-header-subtitle">অর্ডার ট্র্যাক</p>
        </div>
      </div>

      <div class="track-card">
        <p class="track-card-title">Track Your Order</p>
        <p class="track-card-subtitle">Enter your order ID to see real-time status</p>

        <div class="track-search-row">
          <input
            v-model="invoiceNumber"
            type="text"
            placeholder="e.g. CHK-2025-0481"
            class="track-search-input"
            @keyup.enter="trackOrder"
          />
          <button type="button" class="track-search-btn" :disabled="loading" @click="trackOrder">
            {{ loading ? 'Searching...' : 'Track' }}
          </button>
        </div>

        <p v-if="errorMessage" class="track-error">{{ errorMessage }}</p>
      </div>

      <div v-if="orderData" class="track-results">
        <div class="track-card">
          <div class="track-summary-header">
            <div>
              <p class="track-summary-label">ORDER ID</p>
              <p class="track-summary-value">{{ orderData.invoice_number }}</p>
              <p class="track-summary-meta">Placed on {{ formatDate(orderData.created_at) }}</p>
            </div>
            <span class="order-status-pill" :style="badgeStyle(orderData.order_status)">{{ orderData.order_status }}</span>
          </div>
          <p class="track-summary-address">
            <img :src="'/assets/images/account/location-pin.svg'" alt="" />
            {{ orderData.address || 'No address on file' }}
          </p>
        </div>

        <div v-if="!isExceptionStatus(orderData.order_status)" class="track-card">
          <p class="track-card-title">Shipment Progress</p>
          <OrderStepper :current-step-index="getOrderStepIndex(orderData.order_status) ?? 0" />
        </div>

        <div class="track-card">
          <p class="track-card-title">Items in this Order</p>
          <div class="order-items">
            <div v-for="(item, idx) in orderData.items" :key="idx" class="order-item-row">
              <img :src="item.product?.featured_image || '/placeholder.svg'" alt="" class="order-item-thumb" />
              <div class="order-item-info">
                <p class="order-item-name">{{ item.product?.product_name }}</p>
                <p class="order-item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <p class="order-item-price">৳{{ item.price }}</p>
            </div>
          </div>
          <div class="track-total-row">
            <span>Total</span>
            <span>৳{{ orderData.total_price }}</span>
          </div>
          <div v-if="orderData.payment_summary" class="track-payment-row">
            <span>Payment</span>
            <span>{{ orderData.payment_summary }}</span>
          </div>
        </div>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from "@/Layouts/AccountLayout.vue";
import OrderStepper from "@/components/Account/OrderStepper.vue";
import { ref, watch } from "vue";
import { Head, router, usePage } from "@inertiajs/vue3";
import { getOrderStepIndex, getOrderStatusBadge, isExceptionStatus } from "@/utils/orderStatus";

const props = defineProps({
  orderData: { type: Object, default: null },
  invoice:   { type: String, default: "" },
});

const page          = usePage();
const invoiceNumber = ref(props.invoice || "");
const orderData     = ref(props.orderData || null);
const loading       = ref(false);
const errorMessage  = ref("");

watch(() => page.props.orderData, (val) => {
  orderData.value = val;
  errorMessage.value = (!val && invoiceNumber.value) ? "Order not found." : "";
});

const trackOrder = () => {
  if (!invoiceNumber.value) {
    errorMessage.value = "Please enter a valid order ID.";
    return;
  }
  loading.value = true;
  errorMessage.value = "";

  router.get("/account/track-order", { invoice: invoiceNumber.value }, {
    preserveState: true,
    preserveScroll: true,
    onFinish: () => { loading.value = false; },
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const badgeStyle = (status) => {
  const { bg, text } = getOrderStatusBadge(status);
  return { backgroundColor: bg, color: text };
};
</script>

<style scoped>
.track-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.section-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #d4e0c8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header-icon img {
  width: 18px;
  height: 18px;
}

.section-header-title {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #2c1a0e;
}

.section-header-subtitle {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

.track-card {
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  padding: 21px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.track-card-title {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #2c1a0e;
}

.track-card-subtitle {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 13px;
  color: #7a5c3e;
  margin-top: -8px;
}

.track-search-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.track-search-input {
  flex: 1;
  min-width: 200px;
  height: 46px;
  padding: 0 17px;
  border: 1px solid rgba(44, 26, 14, 0.12);
  border-radius: 14px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
  background: #fff;
}

.track-search-input:focus {
  outline: none;
  border-color: #356019;
  box-shadow: 0 0 0 1px #356019;
}

.track-search-btn {
  height: 46px;
  padding: 0 24px;
  background: #356019;
  color: #fff;
  font-family: "Manrope", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  border-radius: 14px;
  transition: background-color 0.2s ease;
}

.track-search-btn:hover:not(:disabled) {
  background: #2a4d14;
}

.track-search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.track-error {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 13px;
  color: #dc2626;
}

.track-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.track-summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.track-summary-label {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #7a5c3e;
}

.track-summary-value {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #2c1a0e;
}

.track-summary-meta {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
  margin-top: 2px;
}

.order-status-pill {
  padding: 4px 10px;
  border-radius: 9999px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: capitalize;
  white-space: nowrap;
}

.track-summary-address {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

.track-summary-address img {
  width: 12px;
  height: 12px;
}

.order-items {
  display: flex;
  flex-direction: column;
}

.order-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(44, 26, 14, 0.12);
}

.order-item-row:last-child {
  border-bottom: none;
}

.order-item-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-name {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2c1a0e;
}

.order-item-qty {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

.order-item-price {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2d4a2d;
  flex-shrink: 0;
}

.track-payment-row {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 13px;
  color: #6d6560;
}

.track-total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(44, 26, 14, 0.12);
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #2c1a0e;
}
</style>
