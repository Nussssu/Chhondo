<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Link, Head } from "@inertiajs/vue3"
import { on } from "@/utils/cms"
import { defineProps, watch } from "vue"

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

// Figma shows the status in Bangla ("পেন্ডিং").
const STATUS_BN = {
  pending: "পেন্ডিং",
  processed: "প্রসেসিং",
  shipped: "শিপড",
  "on delivery": "ডেলিভারিতে",
  "pending delivery": "ডেলিভারির অপেক্ষায়",
  delivered: "ডেলিভারড",
  returned: "রিটার্নড",
  cancelled: "বাতিল",
  "pre order": "প্রি-অর্ডার",
  incomplete: "অসম্পূর্ণ",
}
const statusLabel = (status) => STATUS_BN[(status || "").toLowerCase()] || status

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
    <title>{{ texts.tab_title }}</title>
  </Head>
  <AppLayout>
    <!-- Figma "Order Placed Successfully Popup" -->
    <div class="success-page" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
      <div class="success-card">
        <div class="success-content">
          <div class="success-head">
            <h1 id="order-success-title" class="success-title">{{ texts.title }}</h1>
            <p v-if="on(texts.text_show)" class="success-desc">{{ texts.text }}</p>
          </div>

          <!-- Invoice, customer, total and status -->
          <div class="success-box">
            <p class="success-line success-line--invoice"><span>{{ texts.invoice_label }}</span> <strong>{{ order.invoice_number }}</strong></p>
            <p class="success-line"><span>{{ texts.customer_label }}</span> <strong>{{ order.customer_name || '—' }}</strong></p>
            <p class="success-line"><span>{{ texts.total_label }}</span> <strong>{{ money(totals.grand) }}</strong></p>
            <p class="success-line success-line--status">
              <span>{{ texts.status_label }}</span>
              <span :class="getStatusClass(order.order_status)" class="status-label">
                {{ statusLabel(order.order_status) }}
              </span>
            </p>
          </div>
        </div>

        <Link v-if="on(texts.button_show)" :href="texts.button_url || '/'" class="home-btn">{{ texts.button_label }}</Link>
      </div>
    </div>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.success-page {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  background: rgba(0, 0, 0, .36);
  -webkit-backdrop-filter: blur(2.05px);
  backdrop-filter: blur(2.05px);
}

/* Figma popup: 1072 × 537, r16, 72px padding. */
.success-card {
  width: 100%;
  max-width: 1072px;
  min-height: 537px;
  padding: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 16px;
  background: #fff;
}

.success-content { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
.success-head { display: flex; flex-direction: column; align-items: center; gap: 13px; text-align: center; }

.success-title {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 20px;
  color: #1a1817;
}

.success-desc {
  max-width: 928px;
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}

/* Gold/200 hairline box — auto-sizes to its content, wraps long values */
.success-box {
  width: auto;
  min-width: min(250px, 100%);
  max-width: min(100%, 480px);
  min-height: 0;
  margin-inline: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid #e8d19b;
  border-radius: 8px;
}

.success-line {
  margin: 0;
  max-width: 100%;
  font-family: "Li Ador Noirrit", "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #3c3834;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.success-line span { font-family: "Li Ador Noirrit", "Poppins", sans-serif; }
.success-line strong { font-family: "Poppins", "Li Ador Noirrit", sans-serif; font-weight: 600; color: #4d4944; }
.success-line--invoice span { color: #6d6560; }
.success-line--status { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; font-weight: 600; }

.status-label {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 4px 12px;
  border-radius: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  background: #b47f54;
}
.status-pending,
.status-processed,
.status-pre-order { background: #b47f54; }
.status-shipped,
.status-on-delivery,
.status-pending-delivery { background: #1d4ed8; }
.status-delivered { background: #2d4a2d; }
.status-returned,
.status-cancelled { background: #dc2626; }
.status-incomplete,
.status-default { background: #6d6560; }

/* Olive/500, 56px, r8, Li Ador SB 20/28 */
.home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 153px;
  height: 56px;
  padding: 0 24px;
  border-radius: 8px;
  background: #252f17;
  color: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  transition: background-color .2s ease, transform .2s ease;
}
.home-btn:hover { background: #1a2110; transform: translateY(-2px); }

@media (max-width: 767px) {
  .success-page { align-items: flex-start; padding: 20px; }
  .success-card { min-height: 0; margin: auto 0; padding: 32px 20px; gap: 28px; }
  .success-title { font-size: 20px; line-height: 24px; }
  .success-line { font-size: 17px; line-height: 26px; }
  .success-box { width: 100%; max-width: 420px; }
  .home-btn { height: 48px; font-size: 18px; }
}
</style>
