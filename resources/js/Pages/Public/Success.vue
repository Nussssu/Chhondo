<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Link, Head } from "@inertiajs/vue3"
import { Check } from "lucide-vue-next"
import { computed, defineProps, watch } from "vue"

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  intro: { type: Object, default: () => ({}) },
  order: Object,
  // Priced on the server so this page can never disagree with the invoice.
  totals: { type: Object, default: () => ({}) },
  // e.g. "bKash — Paid"; worded on the server, as on the invoice and email.
  paymentSummary: { type: String, default: '' },
  checkoutMessage: String,
})

const items = computed(() => props.order?.items ?? [])

const discount = computed(
  () => Number(props.totals.item_discount || 0) + Number(props.totals.order_discount || 0),
)

/** Taka, grouped, and without the float noise of adding prices in the template. */
const money = (value) =>
  '৳' + Number(value || 0).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

/** The chosen options for a line, e.g. "Red, M". */
const variantOf = (item) =>
  (item.options ?? [])
    .map((option) => option.attribute_option?.name)
    .filter(Boolean)
    .join(', ')

/**
 * The labels are written in the admin with their punctuation ("Invoice #:"),
 * which suited the old run-on layout. Here they head their own column, so the
 * trailing colon is dropped rather than making shop owners re-edit them.
 */
const stripLabel = (label) => String(label ?? '').replace(/\s*[:：]\s*$/, '')

// Function to push "purchase" event
const pushPurchaseEvent = () => {
  // The browser's dataLayer only: the server render must not report a sale,
  // and the browser pushes it once when it takes over the page.
  if (typeof window === "undefined") return

  try {
    // Ensure dataLayer exists
    if (!window.dataLayer) {
      window.dataLayer = []
    }

    // Validate order object
    if (!props.order || !props.order.id) {
      console.error("[ERROR] Order is missing or invalid. Event not pushed.")
      return
    }

    // Push the purchase event
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: props.order.invoice_number || props.order.id,
        value: props.order.total_price,
        shipping: props.order.delivery_charge || 0,
        currency: "BDT",
        items:
          props.order.items?.map((item) => ({
            item_name: item.product?.product_name || "Unknown Product",
            item_id: item.product_id || "N/A",
            price: item.price || 0,
            quantity: item.quantity || 0,
            item_category: item.product?.category?.name || "",
            // `options` is the relation that is actually loaded; the old
            // `selectedAttributes` matched nothing, so every purchase event
            // reported a product with no variant.
            item_variant: variantOf(item),
          })) || [],
      },
    })

  } catch (err) {
    console.error("[ERROR] Failed to push purchase event:", err)
  }
}

// Watch for order changes (handles async loading)
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder && newOrder.id) {
      pushPurchaseEvent()
    }
  },
  { immediate: true },
)

// Utility for dynamic classes
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "status-pending"
    case "processed":
      return "status-processed"
    case "shipped":
      return "status-shipped"
    case "returned":
      return "status-returned"
    case "delivered":
      return "status-delivered"
    case "cancelled":
      return "status-cancelled"
    case "on delivery":
      return "status-on-delivery"
    case "pending delivery":
      return "status-pending-delivery"
    case "pre order":
      return "status-pre-order"
    case "incomplete":
      return "status-incomplete"
    default:
      return "status-default"
  }
}
</script>

<template>
  <Head>
    <title>{{ texts.t1 }}</title>
  </Head>
  <AppLayout>
    <div class="success-page">
      <div class="success-card">
        <!-- Confirmation -->
        <div class="success-head">
          <span class="success-tick" aria-hidden="true">
            <Check :size="26" :stroke-width="3" />
          </span>
          <h1 class="success-title">{{ texts.t2 }}</h1>
          <p v-if="checkoutMessage" class="success-desc">{{ checkoutMessage }}</p>
        </div>

        <!-- Invoice and status, the two things people screenshot -->
        <div class="order-strip">
          <div class="order-strip-item">
            <span class="order-label">{{ stripLabel(texts.t3) }}</span>
            <span class="order-invoice">{{ order.invoice_number }}</span>
          </div>
          <div class="order-strip-item is-end">
            <span class="order-label">{{ stripLabel(texts.t6) }}</span>
            <span :class="getStatusClass(order.order_status)" class="status-label capitalize">
              {{ order.order_status }}
            </span>
          </div>
        </div>

        <!-- What was ordered -->
        <ul v-if="items.length" class="order-items">
          <li v-for="item in items" :key="item.id" class="order-item">
            <img
              v-if="item.product?.featured_image"
              :src="item.product.featured_image"
              :alt="item.product?.product_name || ''"
              class="order-item-img"
              width="56"
              height="56"
              loading="lazy"
            />
            <div class="order-item-body">
              <p class="order-item-name">{{ item.product?.product_name || '—' }}</p>
              <p v-if="variantOf(item)" class="order-item-variant">{{ variantOf(item) }}</p>
              <p class="order-item-qty">× {{ item.quantity }}</p>
            </div>
            <p class="order-item-price">{{ money(item.quantity * Number(item.price)) }}</p>
          </li>
        </ul>

        <!-- Money -->
        <dl class="order-sums">
          <div v-if="totals.subtotal" class="order-sum">
            <dt>Subtotal</dt>
            <dd>{{ money(totals.subtotal) }}</dd>
          </div>
          <div v-if="discount > 0" class="order-sum is-discount">
            <dt>Discount</dt>
            <dd>− {{ money(discount) }}</dd>
          </div>
          <div v-if="totals.shipping" class="order-sum">
            <dt>Delivery</dt>
            <dd>{{ money(totals.shipping) }}</dd>
          </div>
          <div class="order-sum is-total">
            <dt>{{ stripLabel(texts.t5) }}</dt>
            <dd>{{ money(totals.grand) }}</dd>
          </div>
          <!-- Paid online: say so, so the customer is not left expecting to
               hand the courier cash they have already paid. -->
          <template v-if="Number(totals.paid) > 0">
            <div class="order-sum">
              <dt>Paid</dt>
              <dd>{{ money(totals.paid) }}</dd>
            </div>
            <div class="order-sum">
              <dt>Due on delivery</dt>
              <dd>{{ money(totals.due) }}</dd>
            </div>
          </template>
        </dl>

        <!-- Where it is going, so a wrong address is caught now and not on delivery day -->
        <div class="order-meta">
          <div class="order-meta-row">
            <span class="order-label">{{ stripLabel(texts.t4) }}</span>
            <span class="order-meta-value">{{ order.customer_name || '—' }}</span>
          </div>
          <div v-if="order.phone_number" class="order-meta-row">
            <span class="order-label">Phone</span>
            <span class="order-meta-value">{{ order.phone_number }}</span>
          </div>
          <div v-if="order.address" class="order-meta-row">
            <span class="order-label">Delivery to</span>
            <span class="order-meta-value">{{ order.address }}</span>
          </div>
          <div v-if="paymentSummary" class="order-meta-row">
            <span class="order-label">Payment</span>
            <span class="order-meta-value">{{ paymentSummary }}</span>
          </div>
        </div>

        <Link href="/" class="home-btn">{{ texts.t7 }}</Link>
      </div>
    </div>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.success-page {
  background: #fffaf4;
  display: flex;
  justify-content: center;
  padding: 56px 16px;
}

/* The card was a fixed 250px box holding four run-on lines, so long invoice
   numbers and names wrapped mid-value and everything sat in one cramped
   column. It is now a fluid card with each section on its own row. */
.success-card {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border: 1px solid #ecdcc9;
  border-radius: 20px;
  padding: clamp(24px, 5vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 1px 2px rgba(80, 60, 40, 0.04), 0 8px 28px rgba(80, 60, 40, 0.06);
}

.success-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.success-tick {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #eaf3e2;
  color: #356019;
  margin-bottom: 2px;
}

.success-title {
  margin: 0;
  font-family: "Hind Siliguri", sans-serif;
  font-size: clamp(20px, 4vw, 25px);
  font-weight: 700;
  line-height: 1.3;
  color: #3e3c3a;
  text-wrap: balance;
}

.success-desc {
  margin: 0;
  color: #6d6560;
  font-family: "Hind Siliguri", sans-serif;
  font-size: 15px;
  line-height: 24px;
  max-width: 46ch;
}

/* Invoice + status */
.order-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #fffaf4;
  border: 1px solid #ffe3c3;
  border-radius: 12px;
}

.order-strip-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.order-strip-item.is-end { align-items: flex-end; }

.order-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #9a8f86;
}

.order-invoice {
  font-size: 16px;
  font-weight: 700;
  color: #3e3c3a;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

/* Items */
.order-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f4ece2;
}

.order-item:first-child { padding-top: 0; }
.order-item:last-child { border-bottom: 0; padding-bottom: 0; }

.order-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #f0e6da;
  flex-shrink: 0;
}

.order-item-body { flex: 1; min-width: 0; }

.order-item-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #3e3c3a;
  line-height: 1.35;
}

.order-item-variant,
.order-item-qty {
  margin: 3px 0 0;
  font-size: 13px;
  color: #8b8078;
}

.order-item-price {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #3e3c3a;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Money */
.order-sums {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-top: 18px;
  border-top: 1px solid #f0e6da;
}

.order-sum {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  font-size: 14px;
  color: #6d6560;
}

.order-sum dt, .order-sum dd { margin: 0; }
.order-sum dd { font-variant-numeric: tabular-nums; }
.order-sum.is-discount dd { color: #356019; }

.order-sum.is-total {
  margin-top: 5px;
  padding-top: 13px;
  border-top: 1px dashed #e4d7c7;
  font-size: 17px;
  font-weight: 700;
  color: #3e3c3a;
}

/* Delivery details */
.order-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #fbf7f2;
  border-radius: 12px;
}

.order-meta-row {
  display: flex;
  gap: 14px;
  justify-content: space-between;
  align-items: baseline;
}

.order-meta-value {
  font-size: 14px;
  color: #3e3c3a;
  text-align: right;
  line-height: 1.45;
  min-width: 0;
  word-break: break-word;
}

.home-btn {
  display: block;
  text-align: center;
  background-color: #356019;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.home-btn:hover { background-color: #2a4d14; }
.home-btn:focus-visible { outline: 2px solid #356019; outline-offset: 3px; }

/* Status badge */
.status-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-pending { background-color: #fef3c7; color: #d97706; }
.status-processed { background-color: #dbeafe; color: #1d4ed8; }
.status-shipped { background-color: #d1fae5; color: #059669; }
.status-on-delivery { background-color: #d1fae5; color: #059669; }
.status-pending-delivery { background-color: #fef3c7; color: #d97706; }
.status-delivered { background-color: #dcfce7; color: #16a34a; }
.status-returned { background-color: #fee2e2; color: #dc2626; }
.status-cancelled { background-color: #fee2e2; color: #dc2626; }
.status-pre-order { background-color: #fef3c7; color: #d97706; }
.status-incomplete { background-color: #f3f4f6; color: #6b7280; }
.status-default { background-color: #f3f4f6; color: #6b7280; }

@media (max-width: 480px) {
  .order-strip { flex-direction: column; align-items: flex-start; gap: 12px; }
  .order-strip-item.is-end { align-items: flex-start; }
  .order-meta-row { flex-direction: column; gap: 3px; }
  .order-meta-value { text-align: left; }
}
</style>
