<template>
  <Head>
    <title>My Orders</title>
  </Head>

  <AccountLayout>
    <div class="orders-page">
      <div class="section-header">
        <span class="section-header-icon">
          <img :src="'/assets/images/account/nav-order-history.svg'" alt="" />
        </span>
        <div>
          <p class="section-header-title">Order History</p>
          <p class="section-header-subtitle">অর্ডার ইতিহাস</p>
        </div>
      </div>

      <p v-if="orders.length === 0" class="orders-empty">You haven't placed any orders yet.</p>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <button type="button" class="order-card-header" @click="toggle(order.id)">
            <span class="order-thumb">
              <img :src="order.items?.[0]?.product_info?.featured_image || '/placeholder.svg'" alt="" />
            </span>

            <span class="order-main">
              <span class="order-id-row">
                <span class="order-id">{{ order.invoice_number }}</span>
                <!--
                  A span, not a <button>: it sits inside the header <button>,
                  and a button inside a button is invalid HTML — the parser
                  closes the outer one early, so the server-rendered page came
                  apart from what the browser built.
                -->
                <span
                  role="button"
                  tabindex="0"
                  class="order-copy-btn"
                  title="Copy order ID"
                  @click.stop="copyId(order.invoice_number)"
                  @keydown.enter.stop.prevent="copyId(order.invoice_number)"
                  @keydown.space.stop.prevent="copyId(order.invoice_number)"
                >
                  <img :src="'/assets/images/account/copy.svg'" alt="" />
                </span>
              </span>
              <span class="order-meta">{{ formatDate(order.created_at) }} · {{ (order.items?.length || 0) }} item{{ (order.items?.length || 0) === 1 ? '' : 's' }}</span>
            </span>

            <span class="order-right">
              <span class="order-price">৳{{ order.total_price }}</span>
              <span class="order-status-pill" :style="badgeStyle(order.order_status)">{{ order.order_status }}</span>
              <img
                :src="'/assets/images/account/expand-chevron.svg'"
                alt=""
                class="order-expand-icon"
                :class="{ 'is-open': expandedId === order.id }"
              />
            </span>
          </button>

          <div v-if="expandedId === order.id" class="order-card-body">
            <OrderStepper v-if="!isExceptionStatus(order.order_status)" :current-step-index="getOrderStepIndex(order.order_status) ?? 0" />

            <div class="order-items">
              <div v-for="(item, idx) in order.items" :key="idx" class="order-item-row">
                <img :src="item.product_info?.featured_image || '/placeholder.svg'" alt="" class="order-item-thumb" />
                <div class="order-item-info">
                  <p class="order-item-name">{{ item.product_info?.product_name }}</p>
                  <p class="order-item-qty">Qty: {{ item.quantity }}</p>
                </div>
                <p class="order-item-price">৳{{ item.price }}</p>
              </div>
            </div>

            <div class="order-footer">
              <span class="order-address">
                <img :src="'/assets/images/account/location-pin.svg'" alt="" />
                {{ order.address || 'No address on file' }}
              </span>
              <Link :href="`/account/track-order?invoice=${order.invoice_number}`" class="order-track-btn">Track</Link>
            </div>
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
import { Head, Link, usePage } from "@inertiajs/vue3";
import { toast } from "@steveyuowo/vue-hot-toast";
import { getOrderStepIndex, getOrderStatusBadge, isExceptionStatus } from "@/utils/orderStatus";

const page   = usePage();
const orders = ref(page.props.orders || []);

watch(() => page.props.orders, (val) => {
  orders.value = val || [];
});

const expandedId = ref(null);
const toggle = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const badgeStyle = (status) => {
  const { bg, text } = getOrderStatusBadge(status);
  return { backgroundColor: bg, color: text };
};

const copyId = async (invoice) => {
  try {
    await navigator.clipboard.writeText(invoice);
    toast.success('Order ID copied!');
  } catch {
    toast.error('Could not copy order ID.');
  }
};
</script>

<style scoped>
.orders-page {
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

.orders-empty {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #7a5c3e;
  padding: 24px 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  overflow: hidden;
}

.order-card-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-align: left;
}

.order-thumb {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.order-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-id-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-id {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2c1a0e;
}

.order-copy-btn {
  opacity: 0.4;
  transition: opacity 0.15s ease;
}

.order-copy-btn:hover {
  opacity: 0.8;
}

.order-copy-btn img {
  width: 13px;
  height: 13px;
}

.order-meta {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #7a5c3e;
}

.order-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.order-price {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #2c1a0e;
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

.order-expand-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.order-expand-icon.is-open {
  transform: rotate(180deg);
}

.order-card-body {
  border-top: 1px solid rgba(44, 26, 14, 0.12);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.order-address {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

.order-address img {
  width: 12px;
  height: 12px;
}

.order-track-btn {
  background: #2d4a2d;
  color: #fff;
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
}

@media (max-width: 640px) {
  .order-card-header {
    flex-wrap: wrap;
  }

  .order-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
