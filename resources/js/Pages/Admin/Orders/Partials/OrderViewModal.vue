<template>
  <div class="modal-backdrop-custom" @click.self="$emit('close')">
    <div class="view-modal">
      <div class="modal-header-custom">
        <div>
          <h5 class="mb-0">Order Details</h5>
          <small class="text-muted" v-if="order">Invoice No: {{ order.invoice_number }}</small>
        </div>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>

      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border" role="status"></div>
      </div>

      <div v-else-if="order" class="modal-body-custom">
        <div class="row mb-3">
          <div class="col-md-6">
            <h6>Customer</h6>
            <p class="mb-1"><strong>Name:</strong> {{ order.customer_name }}</p>
            <p class="mb-1"><strong>Phone:</strong> {{ order.phone_number }}</p>
            <p class="mb-1"><strong>Address:</strong> {{ order.address }}</p>
          </div>
          <div class="col-md-6">
            <h6>Order</h6>
            <p class="mb-1"><strong>Status:</strong> <span class="badge bg-primary text-capitalize">{{ order.order_status }}</span></p>
            <p class="mb-1"><strong>Placed:</strong> {{ formatDate(order.created_at) }}</p>
            <p class="mb-1" v-if="order.note"><strong>Note:</strong> {{ order.note }}</p>
          </div>
        </div>

        <!-- How the customer paid, and through which gateway. -->
        <div class="pay-box mb-3">
          <h6 class="mb-2">Payment</h6>
          <div class="pay-grid">
            <div class="pay-item">
              <span class="pay-label">Gateway</span>
              <span class="pay-value">{{ paymentGatewayLabel(order) }}</span>
            </div>
            <div class="pay-item">
              <span class="pay-label">Method</span>
              <PaymentMethodBadge :order="order" />
            </div>
            <div v-if="order.payment_type === 'online'" class="pay-item">
              <span class="pay-label">Status</span>
              <StatusPill :tone="paymentStatus(order).tone" :label="paymentStatus(order).label" :dot="false" />
            </div>
            <div v-if="order.payment_type === 'online' && order.payment_reference" class="pay-item">
              <span class="pay-label">{{ order.payment_status === 'paid' ? 'Transaction ID' : 'Payment ID' }}</span>
              <code class="pay-value">{{ order.payment_reference }}</code>
            </div>
            <div v-if="Number(order.paid_amount) > 0" class="pay-item">
              <span class="pay-label">Paid</span>
              <span class="pay-value">৳{{ Number(order.paid_amount).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <h6>Items</h6>
        <div class="table-responsive">
          <table class="table table-sm table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Attributes</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td>{{ item.product_info?.product_name ?? 'N/A' }}</td>
                <td>
                  <span v-if="item.option && item.option.length">
                    <span v-for="(opt, i) in item.option" :key="opt.id">
                      {{ opt.attributeOption?.attribute?.name }}: {{ opt.attributeOption?.name }}<span v-if="i < item.option.length - 1">, </span>
                    </span>
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price }}</td>
                <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
              <tr v-if="!order.items || !order.items.length">
                <td colspan="5" class="text-center text-muted">No items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end">
          <table class="table table-sm w-auto">
            <tbody>
              <tr><td class="text-end pe-3">Subtotal</td><td class="text-end">{{ subtotal.toFixed(2) }}</td></tr>
              <tr><td class="text-end pe-3">Discount</td><td class="text-end">{{ order.discount ?? 0 }}</td></tr>
              <tr><td class="text-end pe-3">Delivery</td><td class="text-end">{{ order.delivery_charge ?? 0 }}</td></tr>
              <tr class="fw-bold"><td class="text-end pe-3">Total</td><td class="text-end">{{ orderTotal }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="order" class="modal-footer-custom">
        <a :href="route('admin.orders.show', order.id)" target="_blank" rel="noopener" class="btn btn-fig-tertiary btn-fig-md">View Invoice</a>
        <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import StatusPill from '@/components/Admin/StatusPill.vue'
import PaymentMethodBadge from '@/components/Admin/PaymentMethodBadge.vue'
import { paymentGatewayLabel, paymentStatus } from '@/utils/orderPayment'

const props = defineProps({
  orderId: { type: [Number, String], required: true },
})
defineEmits(['close'])

const loading = ref(true)
const order = ref(null)

const subtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
})

// Read from the order's stored totals, as the order table does. It showed
// total_price alone — the goods without delivery — so an order paid ৳100 read
// "Total 30.00".
const orderTotal = computed(() => (
  Number(order.value?.total_price ?? 0)
  + Number(order.value?.delivery_charge ?? 0)
  - Number(order.value?.discount ?? 0)
).toFixed(2))

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

onMounted(() => {
  fetch(route('admin.orders.details', { id: props.orderId }), {
    headers: { Accept: 'application/json' },
  })
    .then((r) => r.json())
    .then((data) => {
      order.value = data.order
      loading.value = false
      axios.post(route('admin.orders.markViewed'), { order_id: props.orderId }).catch(() => {})
    })
})
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 1055; padding: 20px;
}
.view-modal {
  background: white; border-radius: 8px; width: 100%; max-width: 800px; max-height: 90vh;
  overflow-y: auto; display: flex; flex-direction: column;
}
.modal-header-custom {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #e0e0e0;
}
.modal-body-custom { padding: 20px; overflow-y: auto; }
.pay-box { padding: 12px 14px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafaf7; }
.pay-grid { display: flex; flex-wrap: wrap; gap: 10px 28px; }
.pay-item { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.pay-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #7a7a70; }
.pay-value { font-size: 14px; font-weight: 600; color: #1f2a17; word-break: break-all; }
.modal-footer-custom {
  display: flex; justify-content: flex-end; gap: 8px; padding: 16px 20px; border-top: 1px solid #e0e0e0;
}
</style>
