<template>
  <AdminLayout>
    <div class="page-content purchases-page">
      <div class="container-fluid p-0">
        <PageHeader title="Purchases" subtitle="Purchase orders and supplier payments">
          <template #actions>
            <a :href="exportUrl" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
              <FileSpreadsheet :size="16" class="me-1" /> Export
            </a>
            <button
              type="button"
              class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#purchaseCreateModal"
            >
              <Plus :size="16" class="me-1" /> Add purchase
            </button>
          </template>
        </PageHeader>

        <!-- Summary strip. Was four stat cards that pushed the table below the
             fold; the numbers matter but the card chrome did not. -->
        <div class="pu-summary mb-3">
          <div class="pu-summary-item">
            <span class="pu-summary-label">Purchases</span>
            <span class="pu-summary-value">{{ totals.count }}</span>
          </div>
          <div class="pu-summary-item">
            <span class="pu-summary-label">Total</span>
            <span class="pu-summary-value">৳{{ totalAmount }}</span>
          </div>
          <div class="pu-summary-item">
            <span class="pu-summary-label">Paid</span>
            <span class="pu-summary-value is-paid">৳{{ totalPaid }}</span>
          </div>
          <div class="pu-summary-item">
            <span class="pu-summary-label">Due</span>
            <span class="pu-summary-value" :class="parseFloat(totalDue) > 0 ? 'is-due' : ''">৳{{ totalDue }}</span>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <Toolbar
              v-model="search"
              search-placeholder="Search invoice or purchase name…"
              search-on-enter
              @search="applyFilters"
            >
              <template #filters>
                <select
                  v-model="supplierId"
                  class="form-select w-auto"
                  aria-label="Filter by supplier"
                  @change="applyFilters"
                >
                  <option value="">All suppliers</option>
                  <option v-for="s in suppliers" :key="s.id" :value="s.id">
                    {{ s.supplier_name }} ({{ s.company_name }})
                  </option>
                </select>

                <div class="pu-date-range">
                  <label for="pu-date-from">From</label>
                  <input id="pu-date-from" v-model="dateFrom" type="date" class="form-control" :max="dateTo || undefined" @change="applyFilters" />
                  <label for="pu-date-to">To</label>
                  <input id="pu-date-to" v-model="dateTo" type="date" class="form-control" :min="dateFrom || undefined" @change="applyFilters" />
                </div>

                <button
                  v-if="hasFilters"
                  type="button"
                  class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center"
                  @click="resetFilters"
                >
                  <RotateCcw :size="15" class="me-1" /> Reset
                </button>
              </template>
            </Toolbar>

            <DataTable
              :columns="columns"
              :rows="purchases.data ?? []"
              empty-title="No purchases found"
              :empty-message="hasFilters
                ? 'Try a different search term, supplier or date range.'
                : 'Record a purchase to start tracking stock and supplier payments.'"
              :empty-variant="hasFilters ? 'filtered' : 'empty'"
            >
              <template #cell-purchase_name="{ row }">
                <div class="pu-primary fw-semibold" :title="row.purchase_name">{{ row.purchase_name }}</div>
                <div class="pu-secondary text-muted" :title="row.invoice_number">{{ row.invoice_number }}</div>
              </template>

              <template #cell-supplier="{ row }">
                <div class="pu-primary" :title="row.supplier?.supplier_name">{{ row.supplier?.supplier_name ?? '—' }}</div>
                <div class="pu-secondary text-muted" :title="row.supplier?.company_name">{{ row.supplier?.company_name }}</div>
              </template>

              <template #cell-products="{ row }">
                <div class="product-list-p">
                  <div v-for="product in visibleProducts(row)" :key="product.product_id" class="pu-product">
                    <div class="pu-primary" :title="product.product_name">{{ product.product_name || 'N/A' }}</div>
                    <div class="pu-product-details">
                      <span v-if="product.option_name" class="pu-secondary text-muted" :title="product.option_name">{{ product.option_name }}</span>
                      <span class="badge bg-secondary">Qty: {{ product.quantity }}</span>
                    </div>
                  </div>
                  <button
                    v-if="(row.products_data?.length || 0) > PRODUCT_PREVIEW"
                    type="button"
                    class="btn btn-link btn-sm p-0 text-decoration-none"
                    @click="expandedProducts[row.id] = !expandedProducts[row.id]"
                  >
                    {{ expandedProducts[row.id] ? 'Show less' : `Show ${row.products_data.length - PRODUCT_PREVIEW} more` }}
                  </button>
                </div>
              </template>

              <template #cell-purchasing_price="{ row }">৳{{ formatNumber(row.purchasing_price) }}</template>

              <template #cell-purchasing_paid="{ row }">
                <span class="text-success fw-semibold">৳{{ formatNumber(row.purchasing_paid) }}</span>
              </template>

              <template #cell-purchasing_due="{ row }">
                <button
                  v-if="row.purchasing_due > 0"
                  type="button"
                  class="due-amount"
                  :class="dueClass(row.purchasing_due)"
                  title="Record a payment"
                  data-bs-toggle="modal"
                  data-bs-target="#paymentModal"
                  @click="openPaymentModal(row)"
                >৳{{ formatNumber(row.purchasing_due) }}</button>
                <span v-else class="text-muted">৳{{ formatNumber(row.purchasing_due) }}</span>
              </template>

              <template #cell-created_at="{ row }">
                <div class="pu-primary">{{ formatDate(row.created_at) }}</div>
                <div class="pu-secondary text-muted">{{ timeAgo(row.created_at) }}</div>
              </template>

              <template #cell-status="{ row }">
                <button
                  v-if="row.status !== 'cancelled' && row.purchasing_due > 0"
                  type="button"
                  class="btn btn-fig-primary pay-btn d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#paymentModal"
                  @click="openPaymentModal(row)"
                >
                  <CreditCard :size="12" class="me-1" />Pay
                </button>
                <StatusPill v-else :status="statusOf(row)" />
              </template>

              <template #actions="{ row }">
                <button type="button" class="table-icon-btn is-primary" title="Edit purchase" @click="openEditModal(row)">
                  <Pencil :size="14" />
                </button>
                <button type="button" class="table-icon-btn" title="View purchase" @click="openViewModal(row)">
                  <Eye :size="14" />
                </button>
                <button
                  v-if="row.status === 'cancelled' || row.purchasing_due > 0"
                  type="button"
                  class="table-icon-btn"
                  :class="row.status === 'cancelled' ? 'is-primary' : 'is-danger'"
                  :title="row.status === 'cancelled' ? 'Restore purchase' : 'Cancel purchase'"
                  @click="toggleCancel(row)"
                >
                  <RotateCcw v-if="row.status === 'cancelled'" :size="14" />
                  <Ban v-else :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Delete purchase" @click="deletePurchase(row)">
                  <Trash2 :size="14" />
                </button>
              </template>
            </DataTable>

            <Pagination :paginator="purchases" :only="['purchases']" />
          </div>
        </div>

        <!-- Payment Modal -->
        <div class="modal fade modal-modern" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title fw-bold" id="paymentModalLabel">Process Payment</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="paymentForm" @submit.prevent="submitPayment">
                  <input type="hidden" name="_token" :value="csrfToken">
                  <input type="hidden" id="purchase_id" name="purchase_id" v-model="paymentForm.purchase_id">

                  <div class="mb-4">
                    <label for="invoice_number" class="form-label fw-semibold">Invoice Number</label>
                    <input type="text" id="invoice_number" v-model="paymentForm.invoice_number"
                      class="form-control form-control-modern" readonly>
                  </div>

                  <div class="mb-4">
                    <label for="due_amount" class="form-label fw-semibold">Due Amount</label>
                    <input type="text" id="due_amount" v-model="paymentForm.due_display"
                      class="form-control form-control-modern" readonly>
                  </div>

                  <div class="mb-4">
                    <label for="payment_amount" class="form-label fw-semibold">Payment Amount</label>
                    <input type="number" id="payment_amount" name="payment_amount" v-model="paymentForm.payment_amount"
                      class="form-control form-control-modern" required min="0" step="0.01"
                      placeholder="Enter payment amount">
                  </div>

                  <div class="mb-4">
                    <label for="payment_method" class="form-label fw-semibold">Payment Method</label>
                    <select id="payment_method" name="payment_method" v-model="paymentForm.payment_method"
                      class="form-select form-select-modern" required>
                      <option value="">Select Payment Method</option>
                      <option value="credit_card">💳 Debit Card</option>
                      <option value="bank_transfer">🏦 Bank Transfer</option>
                      <option value="cash">💵 Cash</option>
                      <option value="Bkash">💵 Bkash</option>
                      <option value="Nagad">💵 Nagad</option>
                      <option value="Roket">💵 Roket</option>
                    </select>
                  </div>

                  <button type="submit" class="btn btn-fig-primary btn-fig-md w-100">Process Payment</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Purchase modal (merged from the old create page) -->
        <PurchaseFormModal :suppliers="suppliers" />

        <!-- Edit Purchase modal (replaces the old edit page) -->
        <PurchaseEditModal
          v-if="editingPurchase"
          :purchase="editingPurchase"
          @close="editingPurchase = null"
        />

        <!-- View Purchase modal (replaces the old view page) -->
        <PurchaseViewModal
          v-if="viewingPurchaseId"
          :purchase-id="viewingPurchaseId"
          @close="viewingPurchaseId = null"
        />

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import PurchaseFormModal from './Partials/PurchaseFormModal.vue'
import PurchaseEditModal from './Partials/PurchaseEditModal.vue'
import PurchaseViewModal from './Partials/PurchaseViewModal.vue'
import {
  Plus, FileSpreadsheet, ShoppingCart, DollarSign, Clock, CheckCircle,
  Search, RotateCcw, Pencil, Eye, Trash2, Ban, CreditCard,
} from 'lucide-vue-next'

const props = defineProps({
  purchases: Object,
  suppliers: Array,
  attributes: { type: Array, default: () => [] },
  products: { type: Array, default: () => [] },
  totals: {
    type: Object,
    default: () => ({ count: 0, amount: 0, paid: 0, due: 0 })
  },
  currentFilters: {
    type: Object,
    default: () => ({})
  }
})

const columns = [
  { key: 'purchase_name',    label: 'Purchase', width: '14%' },
  { key: 'supplier',         label: 'Supplier', width: '12%' },
  { key: 'products',         label: 'Products' },
  { key: 'purchasing_price', label: 'Total', width: '9%', align: 'right', nowrap: true },
  { key: 'purchasing_paid',  label: 'Paid', width: '9%', align: 'right', nowrap: true },
  { key: 'purchasing_due',   label: 'Due', width: '9%', align: 'right', nowrap: true },
  { key: 'created_at',       label: 'Date', width: '11%', nowrap: true },
  { key: 'status',           label: 'Status', width: '8%' },
]

// ── Filters ────────────────────────────────────────────────
// Was a <form method="GET"> that reloaded the whole page on every filter
// change; these go through Inertia and keep scroll position.
const search = ref(props.currentFilters.search ?? '')
const supplierId = ref(props.currentFilters.supplier_id ?? '')
const initialDates = (props.currentFilters.date_range ?? '').split(' to ')
const dateFrom = ref(props.currentFilters.start_date ?? initialDates[0] ?? '')
const dateTo = ref(props.currentFilters.end_date ?? initialDates[1] ?? '')
const dateRange = computed(() => dateFrom.value && dateTo.value ? `${dateFrom.value} to ${dateTo.value}` : '')

const hasFilters = computed(() => Boolean(search.value || supplierId.value || dateFrom.value || dateTo.value))

function applyFilters() {
  router.get(
    route('admin.purchase.index'),
    {
      search: search.value || undefined,
      supplier_id: supplierId.value || undefined,
      date_range: dateRange.value || undefined,
      start_date: dateFrom.value || undefined,
      end_date: dateTo.value || undefined,
    },
    { preserveState: true, preserveScroll: true, replace: true }
  )
}

function resetFilters() {
  search.value = ''
  supplierId.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  applyFilters()
}

// Maps a purchase onto the shared status vocabulary used by StatusPill.
function statusOf(purchase) {
  if (purchase.status === 'cancelled') return 'cancelled'
  return parseFloat(purchase.purchasing_due) > 0 ? 'due' : 'paid'
}

// Build the Excel export URL carrying the currently applied filters
const exportUrl = computed(() =>
  route('admin.purchase.export', {
    supplier_id: props.currentFilters.supplier_id || undefined,
    search: props.currentFilters.search || undefined,
    date_range: props.currentFilters.date_range || undefined,
    start_date: props.currentFilters.start_date || undefined,
    end_date: props.currentFilters.end_date || undefined,
  })
)

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

const paymentForm = ref({
  purchase_id: '',
  invoice_number: '',
  due_display: '',
  payment_amount: '',
  payment_method: ''
})

const totalAmount = computed(() => Number(props.totals.amount || 0).toFixed(2))
const totalPaid = computed(() => Number(props.totals.paid || 0).toFixed(2))
const totalDue = computed(() => Number(props.totals.due || 0).toFixed(2))

function formatNumber(val) {
  return parseFloat(val || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: '2-digit', year: 'numeric' })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

function statusInfo(purchase) {
  if (purchase.status === 'cancelled') return { label: 'Cancelled', class: 'bg-danger' }
  if (Number(purchase.purchasing_due) <= 0 && Number(purchase.purchasing_paid) > 0) {
    return { label: 'Paid', class: 'bg-success' }
  }
  return { label: 'Pay', class: 'bg-warning text-dark' }
}

async function toggleCancel(purchase) {
  const newStatus = purchase.status === 'cancelled' ? 'active' : 'cancelled'
  const confirmed = await confirmDelete({
    title: newStatus === 'cancelled' ? 'Cancel this purchase?' : 'Restore this purchase?',
    text: newStatus === 'cancelled'
      ? `${purchase.invoice_number} will be marked cancelled.`
      : `${purchase.invoice_number} will be made active again.`,
    confirmButtonText: newStatus === 'cancelled' ? 'Cancel purchase' : 'Restore',
    tone: newStatus === 'cancelled' ? 'warning' : 'question',
  })
  if (!confirmed) return
  try {
    const fd = new FormData()
    fd.append('_method', 'PATCH')
    fd.append('status', newStatus)
    const res = await fetch(`/admin/purchase/${purchase.id}/status`, {
      method: 'POST',
      body: fd,
      headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to update status')
    purchase.status = newStatus
    toast('success', newStatus === 'cancelled' ? 'Purchase cancelled' : 'Purchase restored')
  } catch {
    toast('error', 'Could not update the purchase. Please try again.')
  }
}

function dueClass(due) {
  const d = parseFloat(due)
  if (d > 1000) return 'due-high'
  if (d > 0) return 'due-medium'
  return 'due-low'
}

const editingPurchase = ref(null)
const viewingPurchaseId = ref(null)

// How many products to show per row before "Load more"
const PRODUCT_PREVIEW = 3
const expandedProducts = reactive({})

function visibleProducts(purchase) {
  const list = purchase.products_data || []
  return expandedProducts[purchase.id] ? list : list.slice(0, PRODUCT_PREVIEW)
}

function openEditModal(purchase) {
  editingPurchase.value = purchase
}

function openViewModal(purchase) {
  viewingPurchaseId.value = purchase.id
}

function openPaymentModal(purchase) {
  paymentForm.value.purchase_id = purchase.id
  paymentForm.value.invoice_number = purchase.invoice_number
  paymentForm.value.due_display = '৳' + parseFloat(purchase.purchasing_due).toFixed(2)
  paymentForm.value.payment_amount = purchase.purchasing_due
  paymentForm.value.payment_method = ''
}

async function submitPayment() {
  try {
    const formData = new FormData()
    formData.append('purchase_id', paymentForm.value.purchase_id)
    formData.append('payment_amount', paymentForm.value.payment_amount)
    formData.append('payment_method', paymentForm.value.payment_method)

    const response = await fetch('/admin/purchase/pay', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    if (data.success) {
      toast('success', 'Payment recorded')
        .then(() => location.reload())
    } else {
      throw new Error(data.message || 'Payment failed!')
    }
  } catch (error) {
    toast('error', error.message || 'Could not record the payment. Please try again.')
  }
}

async function deletePurchase(purchase) {
  const ok = await confirmDelete({
    title: 'Delete this purchase?',
    text: `Invoice ${purchase.invoice_number} will be removed. This cannot be undone.`,
  })
  if (!ok) return

  try {
    const response = await fetch(`/admin/purchase/${purchase.id}`, {
      method: 'DELETE',
      headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
    })
    if (!response.ok) throw new Error('failed')
    toast('success', 'Purchase deleted')
    // Was location.reload() — reloading the whole page to drop one row.
    router.reload({ only: ['purchases', 'totals'] })
  } catch {
    toast('error', 'Could not delete the purchase. Please try again.')
  }
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

})
</script>

<style scoped>
.purchases-page { min-width: 0; }
.purchases-page :deep(.card-body) { padding: 12px; }
.purchases-page :deep(.dt-table) { width: 100%; table-layout: fixed; font-size: 12px; }
.purchases-page :deep(.dt-table th),
.purchases-page :deep(.dt-table td) {
  padding: 10px 8px !important;
  text-align: left !important;
  vertical-align: middle !important;
}
.purchases-page :deep(.dt-table th) { font-size: 10px; letter-spacing: .025em; }
.purchases-page :deep(.dt-actions-col) { width: 112px; }
.purchases-page :deep(.dt-actions) { gap: 2px; flex-wrap: nowrap; white-space: nowrap; }
.purchases-page :deep(.dt-actions),
.purchases-page .pu-product-details { justify-content: flex-start !important; }
.purchases-page :deep(.dt-actions) { margin-inline: 0 !important; }
.purchases-page :deep(.tb), .purchases-page :deep(.tb-left) { flex-wrap: wrap; }
.purchases-page :deep(.tb-left) { overflow-x: visible; }
.pu-date-range { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.pu-date-range label { margin: 0; font-size: 11px; color: var(--text-muted); }
.purchases-page :deep(.pu-date-range .form-control) { min-width: 0; width: 132px; padding: 6px 8px; font-size: 12px; }
.purchases-page :deep(.dt-actions .table-icon-btn) { width: 22px; height: 24px; flex: 0 0 22px; }
.pu-primary, .pu-secondary { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; line-height: 1.4; }
.pu-primary { font-size: 12px; }
.pu-secondary { font-size: 10.5px; margin-top: 2px; }
.pu-product { min-width: 0; margin-bottom: 6px; }
.pu-product:last-of-type { margin-bottom: 0; }
.pu-product-details { display: flex; align-items: center; gap: 5px; min-width: 0; margin-top: 2px; }
.pu-product-details .pu-secondary { margin-top: 0; }
.pu-product-details .badge { flex-shrink: 0; padding: 2px 4px; font-size: 9px; line-height: 14px; }
.product-list-p > .btn { font-size: 10.5px; line-height: 16px; }
@media (max-width: 767px) {
  .purchases-page :deep(.dt-actions-col) { width: 100%; }
}
/* Summary strip — replaces the four .stats-card tiles */
.pu-summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2) var(--sp-6);
  padding: var(--sp-3) var(--sp-4);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
}

.pu-summary-item { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }

.pu-summary-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--text-muted);
}

.pu-summary-value {
  font-size: var(--fs-base);
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.pu-summary-value.is-paid { color: var(--st-success); }
.pu-summary-value.is-due  { color: var(--st-danger); }

:root {
  --primary-color: #252f17;
  --primary-hover: #1a2110;
  --success-color: #24A148;
  --warning-color: #FFB612;
  --danger-color: #F9461C;
  --info-color: #4C5441;
}
.glass-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
.filter-card { background: linear-gradient(145deg,#ffffff,#f8fafc); border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 16px; }
.modern-table { border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: none; }
.modern-table thead { background: linear-gradient(135deg,#252f17,#1A2110); color: white; }
.modern-table thead th { border: none; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 1rem 0.75rem; }
.modern-table tbody tr { border: none; transition: all 0.3s ease; }
.modern-table tbody tr:hover { background: linear-gradient(90deg,rgba(37, 47, 23,0.05),rgba(44,80,21,0.05)); }
.modern-table tbody td { border: none; padding: 1rem 0.75rem; vertical-align: middle; }
.modern-table tfoot { background: linear-gradient(135deg,#f3f4f6,#e5e7eb); font-weight: 600; }
.due-amount { font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 6px; transition: all 0.3s ease; }
.due-high { background: linear-gradient(135deg,#fef2f2,#fee2e2); color: #F9461C; border: 1px solid #fecaca; }
.due-medium { background: linear-gradient(135deg,#fffbeb,#fef3c7); color: #FFB612; border: 1px solid #fed7aa; }
.due-low { background: linear-gradient(135deg,#f0fdf4,#dcfce7); color: #24A148; border: 1px solid #bbf7d0; }
.page-title { background: linear-gradient(135deg,#252f17,#1A2110); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; font-size: 2rem; }
.stats-card { background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.stats-card:hover { transform: translateY(-5px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
.vibrant-blue { background: linear-gradient(135deg,#252f17,#1a2110); color: #ffffff; }
.vibrant-blue p { color: #ffffff !important; }
.vibrant-green { background: linear-gradient(135deg,#24A148,#15803d); color: #ffffff; }
.vibrant-green p { color: #ffffff !important; }
.vibrant-yellow { background: linear-gradient(135deg,#FFB612,#ca8a04); color: #ffffff; }
.vibrant-yellow p { color: #ffffff !important; }
.vibrant-purple { background: linear-gradient(135deg,#9A663F,#6b4a28); color: #ffffff; }
.vibrant-purple p { color: #ffffff !important; }
.badge-success-modern { background: linear-gradient(135deg,#24A148,#1a7a35); color: white; padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.75rem; }
.modal-modern .modal-content { border: none; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden; }
.modal-modern .modal-header { background: linear-gradient(135deg,#252f17,#1A2110); color: white; border: none; padding: 1.5rem 2rem; }
.modal-modern .modal-body { padding: 2rem; }
.form-control-modern, .form-select-modern { border: 2px solid #e5e7eb; border-radius: 10px; padding: 0.75rem 1rem; transition: all 0.3s ease; }
.form-control-modern:focus, .form-select-modern:focus { border-color: #252f17; box-shadow: 0 0 0 3px rgba(37, 47, 23,0.1); outline: none; }
.pay-btn { padding: 2px 10px; font-size: 0.75rem; line-height: 1.2; border-radius: 6px; }
.product-list-p { width: 100%; min-width: 0; max-width: 100%; }
.action-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.purchase-table tr:nth-child(even) { background: #dffcf4; }
</style>
