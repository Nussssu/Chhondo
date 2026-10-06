<template>
  <AdminLayout>
    <div class="page-content ph">
      <PageHeader title="Supplier payments" subtitle="What you owe each supplier, and what has been paid" />

      <!-- The question this page answers, before any detail -->
      <div class="ph-summary mb-3">
        <div class="ph-stat ph-stat--owed">
          <span class="ph-stat-label">Outstanding</span>
          <span class="ph-stat-value">৳{{ money(summary.outstanding) }}</span>
          <span class="ph-stat-note">{{ summary.overdue }} purchase{{ summary.overdue === 1 ? '' : 's' }} not fully paid</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Purchased</span>
          <span class="ph-stat-value">৳{{ money(summary.purchased) }}</span>
          <span class="ph-stat-note">{{ summary.purchases }} purchase{{ summary.purchases === 1 ? '' : 's' }}</span>
        </div>
        <div class="ph-stat">
          <span class="ph-stat-label">Paid</span>
          <span class="ph-stat-value">৳{{ money(summary.paid) }}</span>
          <span class="ph-stat-note">across {{ summary.suppliers }} supplier{{ summary.suppliers === 1 ? '' : 's' }}</span>
        </div>
      </div>

      <!-- Filters: one row, no ceremony -->
      <div class="card mb-3">
        <div class="card-body ph-filters">
          <form method="GET" :action="route('admin.purchase.payment.history')" class="ph-filter-row">
            <div class="ph-field ph-field--grow">
              <label class="form-label" for="supplier_name">Supplier</label>
              <input id="supplier_name" name="supplier_name" type="text" class="form-control form-control-sm"
                :value="currentFilters.supplier_name" placeholder="Search by name…">
            </div>
            <div class="ph-field">
              <label class="form-label" for="start_date">From</label>
              <input id="start_date" name="start_date" type="date" class="form-control form-control-sm"
                :value="currentFilters.start_date">
            </div>
            <div class="ph-field">
              <label class="form-label" for="end_date">To</label>
              <input id="end_date" name="end_date" type="date" class="form-control form-control-sm"
                :value="currentFilters.end_date">
            </div>
            <div class="ph-field">
              <label class="form-label" for="payment_status">Status</label>
              <select id="payment_status" name="payment_status" class="form-select form-select-sm">
                <option value="">All</option>
                <option value="unpaid" :selected="currentFilters.payment_status === 'unpaid'">Unpaid</option>
                <option value="partially_paid" :selected="currentFilters.payment_status === 'partially_paid'">Partly paid</option>
                <option value="fully_paid" :selected="currentFilters.payment_status === 'fully_paid'">Fully paid</option>
              </select>
            </div>
            <div class="ph-field ph-field--actions">
              <button type="submit" class="btn btn-fig-primary btn-fig-sm">Apply</button>
              <a v-if="hasFilters" :href="route('admin.purchase.payment.history')"
                class="btn btn-fig-secondary btn-fig-sm">Clear</a>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center gap-1"
                :disabled="exporting" @click="exportExcel">
                <FileSpreadsheet :size="14" />
                {{ exporting ? 'Generating…' : 'Export' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="!suppliers.data.length" class="ph-empty">
        <Receipt :size="34" />
        <p class="mb-1 mt-3 fw-semibold">{{ hasFilters ? 'No purchases match those filters' : 'No supplier purchases yet' }}</p>
        <p class="mb-0 small">{{ hasFilters ? 'Try widening the date range or clearing the status.' : 'Record a purchase and it will appear here.' }}</p>
      </div>

      <!-- One block per supplier: their position first, their purchases inside -->
      <div v-for="supplier in suppliers.data" :key="supplier.id" class="card ph-supplier">
        <button type="button" class="ph-supplier-head" :aria-expanded="isOpen(supplier.id)" @click="toggle(supplier.id)">
          <ChevronRight :size="16" class="ph-chevron" :class="{ 'is-open': isOpen(supplier.id) }" />

          <span class="ph-supplier-id">
            <span class="ph-supplier-name">{{ supplier.supplier_name }}</span>
            <span class="ph-supplier-meta">
              {{ supplier.company_name || '—' }}
              <template v-if="supplier.company_phone"> · {{ supplier.company_phone }}</template>
            </span>
          </span>

          <span class="ph-supplier-figures">
            <span class="ph-figure">
              <span class="ph-figure-label">Purchased</span>
              <span class="ph-figure-value">৳{{ money(supplier.purchased) }}</span>
            </span>
            <span class="ph-figure">
              <span class="ph-figure-label">Paid</span>
              <span class="ph-figure-value">৳{{ money(supplier.paid) }}</span>
            </span>
            <span class="ph-figure" :class="supplier.outstanding > 0 ? 'is-owed' : 'is-clear'">
              <span class="ph-figure-label">{{ supplier.outstanding > 0 ? 'Owed' : 'Settled' }}</span>
              <span class="ph-figure-value">৳{{ money(supplier.outstanding) }}</span>
            </span>
          </span>
        </button>

        <div v-show="isOpen(supplier.id)" class="ph-purchases">
          <table class="table table-compact align-middle mb-0">
            <thead>
              <tr>
                <th>Purchase</th>
                <th style="width: 120px;">Date</th>
                <th style="width: 130px;">Value</th>
                <th style="width: 130px;">Paid</th>
                <th style="width: 130px;">Due</th>
                <th style="width: 130px;">Status</th>
                <th style="width: 90px;"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="purchase in supplier.purchases" :key="purchase.id">
                <tr>
                  <td>
                    <div class="fw-semibold">{{ purchase.purchase_name }}</div>
                    <div class="text-muted small">#{{ purchase.invoice_number }}</div>
                  </td>
                  <td class="text-nowrap">{{ purchase.purchase_date || '—' }}</td>
                  <td>৳{{ money(purchase.purchasing_price) }}</td>
                  <td>৳{{ money(purchase.total_paid) }}</td>
                  <td :class="{ 'ph-due': purchase.due_amount > 0 }">৳{{ money(purchase.due_amount) }}</td>
                  <td>
                    <StatusPill
                      :tone="statusTone(purchase.payment_status)"
                      :label="statusLabel(purchase.payment_status)"
                      :dot="false"
                    />
                  </td>
                  <td>
                    <button v-if="purchase.payments.length" type="button" class="ph-link"
                      @click="togglePayments(purchase.id)">
                      {{ openPayments.has(purchase.id) ? 'Hide' : `${purchase.payments.length} payment${purchase.payments.length === 1 ? '' : 's'}` }}
                    </button>
                    <span v-else class="text-muted small">No payments</span>
                  </td>
                </tr>

                <!-- Payments stay collapsed: most of the time the totals answer
                     the question, and the detail is only wanted for one row. -->
                <tr v-if="openPayments.has(purchase.id)" class="ph-payments-row">
                  <td colspan="7">
                    <ul class="ph-payments">
                      <li v-for="payment in purchase.payments" :key="payment.id">
                        <span class="ph-payment-date">{{ payment.payment_date || '—' }}</span>
                        <span class="ph-payment-amount">৳{{ money(payment.payment_amount) }}</span>
                        <span class="ph-payment-method">{{ payment.payment_method || 'Not recorded' }}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <Pagination v-if="suppliers.last_page > 1" :paginator="suppliers" class="mt-3" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { FileSpreadsheet, Receipt, ChevronRight } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const props = defineProps({
  suppliers: { type: Object, default: () => ({ data: [], last_page: 1 }) },
  summary: {
    type: Object,
    default: () => ({ purchased: 0, paid: 0, outstanding: 0, purchases: 0, suppliers: 0, overdue: 0 }),
  },
  currentFilters: { type: Object, default: () => ({}) },
})

const hasFilters = computed(() =>
  Object.values(props.currentFilters).some((value) => value !== null && value !== '')
)

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* Suppliers with something owed open by default — that is what the page is for. */
const openSuppliers = ref(
  new Set(props.suppliers.data.filter((s) => s.outstanding > 0).map((s) => s.id))
)

const isOpen = (id) => openSuppliers.value.has(id)

function toggle(id) {
  const next = new Set(openSuppliers.value)
  next.has(id) ? next.delete(id) : next.add(id)
  openSuppliers.value = next
}

const openPayments = ref(new Set())

function togglePayments(id) {
  const next = new Set(openPayments.value)
  next.has(id) ? next.delete(id) : next.add(id)
  openPayments.value = next
}

const statusLabel = (status) => ({
  fully_paid: 'Fully paid',
  partially_paid: 'Partly paid',
  unpaid: 'Unpaid',
}[status] ?? status)

const statusTone = (status) => ({
  fully_paid: 'success',
  partially_paid: 'warning',
  unpaid: 'danger',
}[status] ?? 'neutral')

/* ---------- export ---------- */

const exporting = ref(false)

function exportExcel() {
  exporting.value = true
  try {
    const rows = [['Supplier', 'Company', 'Purchase', 'Invoice', 'Date', 'Value', 'Paid', 'Due', 'Status']]

    props.suppliers.data.forEach((supplier) => {
      supplier.purchases.forEach((purchase) => {
        rows.push([
          supplier.supplier_name,
          supplier.company_name ?? '',
          purchase.purchase_name,
          purchase.invoice_number,
          purchase.purchase_date ?? '',
          purchase.purchasing_price,
          purchase.total_paid,
          purchase.due_amount,
          statusLabel(purchase.payment_status),
        ])
      })
    })

    // A quoted CSV opens in Excel and needs no library.
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' }))
    link.download = `supplier-payments-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch {
    toast('error', 'Could not generate the export.')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
/* Summary */
.ph-summary { display: flex; flex-wrap: wrap; gap: 12px; }
.ph-stat {
  display: flex; flex-direction: column; gap: 2px;
  background: #fff; border: 1px solid #e6e9ec; border-radius: 12px;
  padding: 12px 18px; min-width: 190px;
}
.ph-stat-label {
  font-size: .66rem; font-weight: 700; color: #90a4ae;
  text-transform: uppercase; letter-spacing: .04em;
}
.ph-stat-value { font-size: 1.35rem; font-weight: 800; color: #37474f; font-variant-numeric: tabular-nums; }
.ph-stat-note { font-size: .72rem; color: #b0bec5; }

/* The figure the page exists for. */
.ph-stat--owed { border-color: #f3d7c6; background: #faf5e9; }
.ph-stat--owed .ph-stat-value { color: #B23113; }
.ph-stat--owed .ph-stat-note { color: #b0796a; }

/* Filters */
.ph-filters { padding: 12px 14px; }
.ph-filter-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
.ph-field { display: flex; flex-direction: column; gap: 3px; min-width: 140px; }
.ph-field--grow { flex: 1; min-width: 200px; }
.ph-field--actions { flex-direction: row; gap: 6px; min-width: 0; }
.ph-field .form-label {
  margin: 0; font-size: .68rem; font-weight: 700; color: #78909c;
  text-transform: uppercase; letter-spacing: .03em;
}

/* Supplier block */
.ph-supplier { margin-bottom: 12px; overflow: hidden; }

.ph-supplier-head {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 14px 16px; border: 0; background: #fff; text-align: left; cursor: pointer;
}
.ph-supplier-head:hover { background: #fafbfc; }

.ph-chevron { color: #b0bec5; flex-shrink: 0; transition: transform .15s ease; }
.ph-chevron.is-open { transform: rotate(90deg); }

.ph-supplier-id { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
.ph-supplier-name { font-weight: 700; color: #263238; }
.ph-supplier-meta {
  font-size: .76rem; color: #90a4ae;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.ph-supplier-figures { display: flex; gap: 22px; flex-shrink: 0; }
.ph-figure { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.ph-figure-label {
  font-size: .62rem; font-weight: 700; color: #b0bec5;
  text-transform: uppercase; letter-spacing: .04em;
}
.ph-figure-value { font-size: .92rem; font-weight: 700; color: #455a64; font-variant-numeric: tabular-nums; }
.ph-figure.is-owed .ph-figure-value { color: #B23113; }
.ph-figure.is-clear .ph-figure-value { color: #1A2110; }

.ph-purchases { border-top: 1px solid #eceff1; }
.ph-due { color: #B23113; font-weight: 600; }

.ph-link {
  border: 0; background: transparent; padding: 0;
  color: #252f17; font-size: .78rem; font-weight: 600; cursor: pointer;
}
.ph-link:hover { text-decoration: underline; }

.ph-payments-row td { background: #fafbfc; }
.ph-payments { list-style: none; margin: 0; padding: 4px 0; }
.ph-payments li {
  display: flex; gap: 20px; align-items: baseline;
  padding: 4px 0; font-size: .8rem;
}
.ph-payment-date { color: #90a4ae; min-width: 96px; }
.ph-payment-amount { font-weight: 700; color: #1A2110; font-variant-numeric: tabular-nums; min-width: 110px; }
.ph-payment-method { color: #607d8b; text-transform: capitalize; }

/* Empty */
.ph-empty {
  background: #fff; border: 1px dashed #cfd8dc; border-radius: 12px;
  padding: 48px 24px; text-align: center; color: #90a4ae;
}

@media (max-width: 767px) {
  .ph-supplier-head { flex-wrap: wrap; }
  .ph-supplier-figures { width: 100%; justify-content: space-between; gap: 12px; padding-left: 28px; }
}
</style>
