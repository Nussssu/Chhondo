<template>
  <FormModal title="Purchase Details" size="lg" @close="$emit('close')">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger mb-0">{{ error }}</div>

    <div v-else-if="purchase">
      <!-- Summary -->
      <div class="row g-3 flex-nowrap mb-3">
        <div class="col text-center">
          <div class="text-muted small">Invoice</div>
          <div class="fw-semibold text-truncate">{{ purchase.invoice_number }}</div>
        </div>
        <div class="col text-center">
          <div class="text-muted small">Purchase Name</div>
          <div class="fw-semibold text-truncate">{{ purchase.purchase_name }}</div>
        </div>
        <div class="col text-center">
          <div class="text-muted small">Supplier</div>
          <div class="fw-semibold text-truncate">
            {{ purchase.supplier?.supplier_name || 'N/A' }}
            <span class="text-muted small" v-if="purchase.supplier?.company_name">({{ purchase.supplier.company_name }})</span>
          </div>
        </div>
        <div class="col text-center">
          <div class="text-muted small">Date</div>
          <div class="fw-semibold text-truncate">{{ formatDate(purchase.created_at) }}</div>
        </div>
        <div class="col text-center">
          <div class="text-muted small">Status</div>
          <span class="badge" :class="statusInfo.class">{{ statusInfo.label }}</span>
        </div>
      </div>

      <!-- Totals -->
      <div class="row g-2 mb-3">
        <div class="col-4">
          <div class="border rounded p-2 text-center">
            <div class="text-muted small">Total</div>
            <div class="fw-bold">৳{{ money(purchase.purchasing_price) }}</div>
          </div>
        </div>
        <div class="col-4">
          <div class="border rounded p-2 text-center">
            <div class="text-muted small">Paid</div>
            <div class="fw-bold text-success">৳{{ money(purchase.purchasing_paid) }}</div>
          </div>
        </div>
        <div class="col-4">
          <div class="border rounded p-2 text-center">
            <div class="text-muted small">Due</div>
            <div class="fw-bold text-danger">৳{{ money(purchase.purchasing_due) }}</div>
          </div>
        </div>
      </div>

      <!-- Products -->
      <h6 class="fw-semibold mb-2">Products</h6>
      <div class="orders-table-wrapper mb-3">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Variant</th>
              <th class="text-end">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.product_id ?? index">
              <td>{{ index + 1 }}</td>
              <td>{{ product.product_name || 'N/A' }}</td>
              <td><span v-if="product.option_name">{{ product.option_name }}</span><span v-else class="text-muted">—</span></td>
              <td class="text-end">{{ product.quantity }}</td>
            </tr>
            <tr v-if="!products.length">
              <td colspan="4" class="text-center text-muted py-3">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payments -->
      <h6 class="fw-semibold mb-2">Payment History</h6>
      <div class="orders-table-wrapper">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Method</th>
              <th class="text-end">Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in payments" :key="payment.id ?? index">
              <td>{{ index + 1 }}</td>
              <td>{{ payment.payment_method || '—' }}</td>
              <td class="text-end">৳{{ money(payment.payment_amount) }}</td>
              <td>{{ formatDate(payment.payment_date || payment.created_at) }}</td>
            </tr>
            <tr v-if="!payments.length">
              <td colspan="4" class="text-center text-muted py-3">No payments recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Close</button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  purchaseId: { type: [Number, String], required: true },
})

defineEmits(['close'])

const loading = ref(true)
const error = ref('')
const purchase = ref(null)

const products = computed(() => purchase.value?.products_data || [])
const payments = computed(() => purchase.value?.payments || [])

const statusInfo = computed(() => {
  const p = purchase.value
  if (!p) return { label: '', class: 'bg-secondary' }
  if (p.status === 'cancelled') return { label: 'Cancelled', class: 'bg-danger' }
  if (Number(p.purchasing_due) <= 0 && Number(p.purchasing_paid) > 0) return { label: 'Paid', class: 'bg-success' }
  return { label: 'Pay', class: 'bg-warning text-dark' }
})

function money(v) {
  return Number(v || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: '2-digit', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await axios.get(route('admin.purchase.show', props.purchaseId), {
      headers: { Accept: 'application/json' },
    })
    purchase.value = data.purchase
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load purchase.'
  } finally {
    loading.value = false
  }
})
</script>
