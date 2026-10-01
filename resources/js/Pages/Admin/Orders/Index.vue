<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Orders" subtitle="Every order placed on the storefront" />

      <!-- Two rows: the status filters, then the sales summary beneath them. -->
      <div class="order-filterbar mb-3">
        <OrderStatusTabs :tabs="statusTabs" :current="currentStatus" @select="filterByStatus" />

        <div class="order-summary">
          <div class="order-summary-item">
            <span class="order-summary-label">Sales</span>
            <span class="order-summary-value">৳{{ salesSummary.total_sale_with_delivery }}</span>
          </div>
          <div class="order-summary-item">
            <span class="order-summary-label">Excl. delivery</span>
            <span class="order-summary-value">৳{{ salesSummary.total_sale_without_delivery }}</span>
          </div>
          <div class="order-summary-item">
            <span class="order-summary-label">Orders</span>
            <span class="order-summary-value">{{ salesSummary.total_orders }}</span>
          </div>
          <div class="order-summary-item">
            <span class="order-summary-label">On / Off</span>
            <span class="order-summary-value">{{ salesSummary.online_orders }} / {{ salesSummary.offline_orders }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
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
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import { FileSpreadsheet } from 'lucide-vue-next'
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

function applyFilters() {
  router.get(route('admin.orders.index'), {
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    search: search.value,
    pagination: pagination.value,
  }, { preserveState: true, replace: true })
}

function filterByStatus(status) {
  currentStatus.value = status
  router.get(route('admin.orders.index'), {
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    status,
  }, { preserveState: true, replace: true })
}

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

@media (max-width: 640px) {
  .order-summary { flex-wrap: wrap; white-space: normal; border-radius: var(--r-md); }
}
</style>
