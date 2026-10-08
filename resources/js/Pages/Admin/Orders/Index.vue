<template>
  <AdminLayout>
    <div class="page-content orders-reference-page">
      <PageHeader title="Orders" />

      <div class="order-filterbar mb-3">
        <div class="status-filter-row">
          <OrderStatusTabs :tabs="statusTabs" :current="currentStatus" @select="filterByStatus" />

          <div ref="dateFilterRef" class="date-filter">
            <button
              type="button"
              class="date-filter-trigger"
              :aria-expanded="dateFilterOpen"
              @click="dateFilterOpen = !dateFilterOpen"
            >
              <CalendarDays :size="15" />
              <span>{{ activeDateLabel }}</span>
              <ChevronDown :size="14" :class="{ 'is-open': dateFilterOpen }" />
            </button>

            <div v-if="dateFilterOpen" class="date-filter-menu">
              <button
                v-for="preset in datePresets"
                :key="preset.value"
                type="button"
                class="date-preset"
                :class="{ 'is-active': isDatePresetActive(preset.value) }"
                @click="applyDatePreset(preset.value)"
              >
                {{ preset.label }}
              </button>

              <div class="date-custom">
                <span class="date-custom-title">Custom range</span>
                <label>
                  <span>From</span>
                  <input v-model="dateFrom" type="date" :max="dateTo || undefined" />
                </label>
                <label>
                  <span>To</span>
                  <input v-model="dateTo" type="date" :min="dateFrom || undefined" />
                </label>
                <button type="button" class="date-apply" :disabled="!dateFrom && !dateTo" @click="applyCustomDate">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="card">
        <div class="card-body orders-card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search orders…"
            search-on-enter
            :per-page="pagination"
            :per-page-options="[10, 20, 50, 100, 500]"
            :selected-count="selectedCount"
            @search="applyFilters"
            @update:per-page="pagination = $event; applyFilters()"
            @clear-selection="ordersTableRef?.selectedIds && (ordersTableRef.selectedIds = [])"
          >
            <template #actions>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center" @click="exportCsv">
                <FileSpreadsheet :size="15" class="me-1" /> Export CSV
              </button>
            </template>

            <template #bulk>
              <div class="dropdown">
                <button class="btn btn-fig-secondary btn-fig-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Update status
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li v-for="s in bulkStatuses" :key="s.value">
                    <a class="dropdown-item" href="#" @click.prevent="updateSelectedStatus(s.value)">{{ s.label }}</a>
                  </li>
                </ul>
              </div>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="exportCsv">Export selected</button>
              <button type="button" class="btn btn-fig-danger btn-fig-sm" @click="deleteSelected">Delete</button>
            </template>
          </Toolbar>

          <OrdersTable
            ref="ordersTableRef"
            :orders="orders"
            :comments="comments"
            daily-compact
            reference-compact
            @view-order="viewingOrderId = $event"
            @edit-order="editingOrderId = $event"
          />
        </div>
      </div>

      <OrderViewModal v-if="viewingOrderId" :order-id="viewingOrderId" @close="onViewClosed" />
      <OrderEditModal
        v-if="editingOrderId"
        :order-id="editingOrderId"
        @close="editingOrderId = null"
        @updated="onOrderUpdated"
      />
      <OrderCsvExportModal v-if="showCsvExportModal" @close="showCsvExportModal = false" />

    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import { CalendarDays, ChevronDown, FileSpreadsheet } from 'lucide-vue-next'
import OrdersTable from './Partials/OrdersTable.vue'
import OrderStatusTabs from './Partials/OrderStatusTabs.vue'
import OrderViewModal from './Partials/OrderViewModal.vue'
import OrderEditModal from './Partials/OrderEditModal.vue'
import OrderCsvExportModal from './Partials/OrderCsvExportModal.vue'

const props = defineProps({
  orders: Object,
  comments: Array,
  courier_settings: Object,
  total_order: Number,
  pending_order: Number,
  processed_order: Number,
  shipped_order: Number,
  delivered_order: Number,
  cancelled_order: Number,
  returned_order: Number,
  on_delivery: Number,
  incomplete_order: Number,
  new_order: Number,
  salesSummary: {
    type: Object,
    default: () => ({
      total_sale_with_delivery: '0.00',
      total_sale_without_delivery: '0.00',
      total_orders: 0,
      online_orders: 0,
      offline_orders: 0,
    }),
  },
})

const bulkStatuses = [
  { value: 'pending',      label: 'Pending' },
  { value: 'processed',    label: 'Processed' },
  { value: 'on delivery',  label: 'On delivery' },
  { value: 'shipped',      label: 'Partial delivery' },
  { value: 'delivered',    label: 'Delivered' },
  { value: 'cancelled',    label: 'Cancelled' },
  { value: 'returned',     label: 'Returned' },
]

const viewingOrderId = ref(null)
const editingOrderId = ref(null)
const showCsvExportModal = ref(false)
const ordersTableRef = ref(null)

const selectedCount = computed(() => ordersTableRef.value?.selectedIds?.length ?? 0)

function deleteSelected() {
  ordersTableRef.value?.bulkDelete()
}

function updateSelectedStatus(status) {
  ordersTableRef.value?.bulkUpdateStatus(status)
}

function exportCsv() {
  const ids = ordersTableRef.value?.selectedIds ?? []
  if (ids.length) {
    window.location.href = route('admin.orders.export', { ids: ids.join(',') })
    return
  }
  showCsvExportModal.value = true
}

const initialParams = new URLSearchParams(window.location.search)
const search = ref(initialParams.get('search') ?? '')
const pagination = ref(initialParams.get('pagination') ?? '10')
const activeDay = ref(initialParams.get('day') ?? '')
const activeRange = ref(initialParams.get('range') ?? '')
const dateFrom = ref(initialParams.get('date_from') ?? '')
const dateTo = ref(initialParams.get('date_to') ?? '')
const dateFilterOpen = ref(false)
const dateFilterRef = ref(null)

const datePresets = [
  { value: '1', label: 'Today' },
  { value: '3', label: 'Last 7 days' },
  { value: '4', label: 'Last 30 days' },
  { value: 'last_90', label: 'Last 90 days' },
  { value: 'last_12_months', label: 'Last 12 months' },
  { value: '5', label: 'This month' },
  { value: '6', label: 'Last month' },
  { value: 'this_year', label: 'This year' },
  { value: '', label: 'All time' },
]

const activeDateLabel = computed(() => {
  if (activeRange.value) return datePresets.find((preset) => preset.value === activeRange.value)?.label ?? 'Custom range'
  if (dateFrom.value || dateTo.value) return 'Custom range'
  return datePresets.find((preset) => preset.value === activeDay.value)?.label ?? 'All time'
})

function isDatePresetActive(value) {
  if (!value) return !activeDay.value && !activeRange.value && !dateFrom.value && !dateTo.value
  if (/^\d+$/.test(value)) return activeDay.value === value && !activeRange.value
  return activeRange.value === value
}

function inputDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function navigate(overrides = {}, clear = []) {
  const params = {
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    search: search.value,
    pagination: pagination.value,
    ...overrides,
  }
  clear.forEach((key) => delete params[key])
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
  })
  router.get(route('admin.orders.index'), params, { preserveState: true, replace: true })
}

function applyFilters() {
  navigate()
}

function filterByStatus(status) {
  currentStatus.value = status
  navigate({ status })
}

function applyDatePreset(value) {
  activeDay.value = /^\d+$/.test(value) ? value : ''
  activeRange.value = !activeDay.value ? value : ''
  dateFrom.value = ''
  dateTo.value = ''
  dateFilterOpen.value = false

  if (activeDay.value) {
    navigate({ day: activeDay.value }, ['range', 'date_from', 'date_to'])
    return
  }

  if (!value) {
    navigate({}, ['day', 'range', 'date_from', 'date_to'])
    return
  }

  const today = new Date()
  const from = new Date(today)
  if (value === 'last_90') from.setDate(from.getDate() - 90)
  if (value === 'last_12_months') from.setFullYear(from.getFullYear() - 1)
  if (value === 'this_year') from.setMonth(0, 1)
  dateFrom.value = inputDate(from)
  dateTo.value = inputDate(today)
  navigate({ range: value, date_from: dateFrom.value, date_to: dateTo.value }, ['day'])
}

function applyCustomDate() {
  activeDay.value = ''
  activeRange.value = ''
  dateFilterOpen.value = false
  navigate({ date_from: dateFrom.value, date_to: dateTo.value }, ['day', 'range'])
}

function closeDateFilter(event) {
  if (dateFilterRef.value && !dateFilterRef.value.contains(event.target)) dateFilterOpen.value = false
}

onMounted(() => document.addEventListener('click', closeDateFilter))
onBeforeUnmount(() => document.removeEventListener('click', closeDateFilter))

function onOrderUpdated() {
  editingOrderId.value = null
  // Processing an order changes its status, so the sidebar tally and the
  // status tab counts both have to come back with it.
  router.reload({ only: ['orders', 'adminPendingOrderCount', 'pending_order', 'processed_order'] })
}

function onViewClosed() {
  viewingOrderId.value = null
  router.reload({ only: ['orders', 'adminPendingOrderCount'] })
}

const statusTabs = computed(() => [
  { label: 'All',         value: props.total_order,      status: '',            tone: 'all' },
  { label: 'Pending',     value: props.pending_order,    status: 'pending',     tone: 'pending' },
  { label: 'Processed',   value: props.processed_order,  status: 'processed',   tone: 'processed' },
  { label: 'On Delivery', value: props.on_delivery,      status: 'on delivery', tone: 'delivery' },
  { label: 'Delivered',   value: props.delivered_order,  status: 'delivered',   tone: 'delivered' },
  { label: 'Incomplete',  value: props.incomplete_order, status: 'incomplete',  tone: 'incomplete' },
  { label: 'Cancelled',   value: props.cancelled_order,  status: 'cancelled',   tone: 'cancelled' },
  { label: 'Returned',    value: props.returned_order,   status: 'returned',    tone: 'returned' },
])

// Kept in a ref rather than read off window.location each time: the filter
// navigation uses preserveState, so the component is not re-created.
const currentStatus = ref(initialParams.get('status') ?? '')
</script>

<style scoped>
/* Status filters on their own row, sales summary on the row below. */
.order-filterbar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sp-2);
}

.status-filter-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.status-filter-row :deep(.order-tabs) { flex: 1 1 auto; }

.orders-reference-page :deep(.order-tab) {
  padding: 6px 12px;
  gap: 6px;
  border-color: var(--line);
  background: var(--surface);
  font-size: 12px;
}

.orders-reference-page :deep(.order-tab.is-on) {
  border-color: var(--tone);
  background: var(--tone);
}

.date-filter { position: relative; flex: 0 0 auto; }

.date-filter-trigger {
  height: 34px;
  min-width: 126px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 11px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.date-filter-trigger svg:last-child { transition: transform .15s ease; }
.date-filter-trigger svg:last-child.is-open { transform: rotate(180deg); }

.date-filter-menu {
  position: absolute;
  top: calc(100% + 7px);
  right: 0;
  z-index: 30;
  width: 238px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  box-shadow: 0 14px 32px rgba(15, 23, 42, .14);
}

.date-preset {
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--text);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.date-preset:hover,
.date-preset.is-active {
  background: var(--surface-sunk);
  color: var(--admin-green-700);
  font-weight: 700;
}

.date-custom {
  display: grid;
  gap: 7px;
  margin-top: 7px;
  padding: 10px 4px 2px;
  border-top: 1px solid var(--line);
}

.date-custom-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.date-custom label { display: grid; gap: 3px; font-size: 10px; color: var(--text-muted); }
.date-custom input {
  width: 100%;
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--line-strong);
  border-radius: 5px;
  background: var(--surface);
  color: var(--text);
  font-size: 12px;
}

.date-apply {
  height: 34px;
  margin-top: 2px;
  border: 0;
  border-radius: 5px;
  background: var(--admin-green-600);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.date-apply:disabled { opacity: .45; cursor: not-allowed; }

/* ---- Compact sales summary strip ---- */
.order-summary {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  /* Sits on its own row, but only as wide as its contents. */
  align-self: flex-start;
  flex-shrink: 0;
  padding: 7px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-full);
  white-space: nowrap;
}

.order-summary-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.order-summary-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .03em;
}

.order-summary-value {
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.orders-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}
.orders-toolbar-search {
  flex: 1 1 160px;
  min-width: 120px;
  max-width: 260px;
}
.orders-toolbar-actions .btn,
.orders-toolbar-actions .dropdown {
  flex-shrink: 0;
}

/* Tighter card padding gives the table ~8px more width to fit its columns. */
.orders-card-body { padding: 10px; }

.orders-reference-page :deep(.tb) { margin-bottom: 10px; min-height: 34px; }
.orders-reference-page :deep(.tb-search-input),
.orders-reference-page :deep(.tb-select),
.orders-reference-page :deep(.tb-right .btn) { height: 34px; font-size: 12px; }
.orders-reference-page :deep(.tb-search) { max-width: 384px; }

@media (max-width: 640px) {
  .status-filter-row { flex-direction: column; }
  .date-filter { align-self: flex-end; }
  .order-summary { flex-wrap: wrap; white-space: normal; border-radius: var(--r-md); }
  .orders-card-body { padding: 10px; }
}
</style>
