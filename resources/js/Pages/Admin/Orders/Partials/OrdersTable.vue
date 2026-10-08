<template>
  <div class="orders-table" :class="{ 'is-daily-compact': dailyCompact, 'is-reference-compact': referenceCompact }">
    <DataTable
      v-model:selected="selectedIds"
      :columns="columns"
      :rows="orders.data ?? []"
      selectable
      empty-title="No orders found"
      empty-message="Orders appear here as customers check out."
    >
      <!-- Keep the list scannable: the full invoice, staff and note details
           remain available from the order view/edit flows. -->
      <template #cell-created_at="{ row }">
        <div class="date-cell-date">
          <span class="date-cell-value" :title="formatDate(row.created_at)">{{ isRecent(row.created_at) ? timeAgo(row.created_at) : formatDate(row.created_at) }}</span>
          <span v-if="!row.viewed_at" class="new-order-tag">New</span>
        </div>
        <div v-if="referenceCompact" class="date-cell-meta">#{{ row.invoice_number }}</div>
      </template>

      <template #cell-customer="{ row }">
        <OrderCustomerCell :order="row" :compact="dailyCompact && !referenceCompact" />
      </template>

      <template #cell-products="{ row }">
        <OrderProductsCell
          :order="row"
          :expanded="expandedRows.has(row.id)"
          :compact="dailyCompact && !referenceCompact"
          @toggle-expanded="toggleExpanded(row.id)"
        />
      </template>

      <!-- Total carries the payment summary underneath, so payment does not
           need a column of its own. -->
      <template #cell-total_price="{ row }">
        <div class="total-cell">
          <span class="total-amount">{{ orderTotal(row) }}</span>
          <div v-if="!referenceCompact" class="total-pay">
            <PaymentMethodBadge :order="row" />
            <StatusPill
              v-if="row.payment_type === 'online'"
              :tone="paymentStatus(row).tone"
              :label="paymentStatus(row).label"
              :dot="false"
            />
          </div>
        </div>
      </template>

      <template #cell-order_status="{ row }">
        <OrderStatusDropdown :order="row" :portal="dailyCompact" />
      </template>

      <template #cell-payment="{ row }">
        <div class="pay-cell">
          <PaymentMethodBadge :order="row" />
          <StatusPill
            v-if="row.payment_type === 'online'"
            :tone="paymentStatus(row).tone"
            :label="paymentStatus(row).label"
            :dot="false"
          />
        </div>
      </template>

      <template #cell-couriar_name="{ row }">
        <div v-if="row.couriar_name" class="courier-cell">
          <span class="courier-name">{{ capitalize(row.couriar_name) }}</span>
          <div class="courier-links">
            <a :href="row.tracking_code" target="_blank" rel="noopener">Track</a>
            <span class="courier-sep">·</span>
            <a href="#" @click.prevent="consignmentModalOrder = row">{{ row.consignment_id }}</a>
          </div>
        </div>
        <span v-else class="text-muted">—</span>
      </template>

      <template #cell-comment="{ row }">
        <div class="note-cell">
          <span class="note-cell-text" :title="row.comment?.name ?? 'No comment'">{{ row.comment?.name ?? '—' }}</span>
          <button type="button" class="table-icon-btn comment-edit-btn" title="Edit comment" @click="commentModalOrder = row">
            <Pencil :size="12" />
          </button>
        </div>
      </template>

      <template #actions="{ row }">
        <button type="button" class="table-icon-btn" title="Fraud check" @click="fraudModalOrder = row">
          <ShieldCheck :size="14" />
        </button>
        <button type="button" class="table-icon-btn" title="View order" @click="$emit('view-order', row.id)">
          <FileText :size="14" />
        </button>
        <button type="button" class="table-icon-btn is-primary" title="Edit order" @click="$emit('edit-order', row.id)">
          <SquarePen :size="14" />
        </button>
        <button v-if="!referenceCompact" type="button" class="table-icon-btn" title="Edit comment" @click="commentModalOrder = row">
          <MessageSquareText :size="14" />
        </button>
        <button
          type="button"
          class="table-icon-btn"
          :class="row.consignment_id ? 'is-sent' : 'is-courier'"
          :title="row.consignment_id ? `Already sent — consignment ${row.consignment_id}` : 'Send to Steadfast'"
          @click="courierModalOrder = row"
        >
          <Truck :size="14" />
        </button>
        <button type="button" class="table-icon-btn is-danger" title="Delete order" @click="deleteOrder(row)">
          <Trash2 :size="14" />
        </button>
      </template>
    </DataTable>

    <!-- Was a list of plain <a href> links, which triggered a full browser
         navigation and dropped the page's Inertia state on every page change. -->
    <Pagination :paginator="orders" :only="['orders']" />

    <SendCourierModal
      v-if="courierModalOrder"
      :order="courierModalOrder"
      @close="courierModalOrder = null"
      @sent="onCourierSent"
    />


    <OrderConsignmentModal v-if="consignmentModalOrder" :order="consignmentModalOrder" @close="consignmentModalOrder = null" />

    <OrderCommentModal
      v-if="commentModalOrder"
      :order="commentModalOrder"
      :comments="commentsList"
      @close="commentModalOrder = null"
      @saved="onCommentSaved"
      @comments-updated="commentsList = $event"
    />

    <OrderFraudCheckModal v-if="fraudModalOrder" :order="fraudModalOrder" @close="fraudModalOrder = null" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import axios from 'axios'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import OrderCustomerCell from './OrderCustomerCell.vue'
import OrderProductsCell from './OrderProductsCell.vue'
import OrderStatusDropdown from './OrderStatusDropdown.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import PaymentMethodBadge from '@/components/Admin/PaymentMethodBadge.vue'
import { paymentStatus } from '@/utils/orderPayment'
import OrderConsignmentModal from './OrderConsignmentModal.vue'
import OrderCommentModal from './OrderCommentModal.vue'
import OrderFraudCheckModal from './OrderFraudCheckModal.vue'
import SendCourierModal from './SendCourierModal.vue'
import { capitalize, formatDate, isRecent, timeAgo } from '@/utils/orderFormatting'
import { ShieldCheck, FileText, SquarePen, MessageSquareText, Pencil, Trash2, Truck } from 'lucide-vue-next'

const props = defineProps({
  orders: { type: Object, required: true },
  comments: { type: Array, default: () => [] },
  dailyCompact: { type: Boolean, default: false },
  referenceCompact: { type: Boolean, default: false },
})

defineEmits(['view-order', 'edit-order'])

const columns = computed(() => {
  if (props.referenceCompact) {
    return [
      { key: 'created_at',   label: 'Date',     width: '8%' },
      { key: 'customer',     label: 'Customer', width: '13%' },
      { key: 'products',     label: 'Products', width: '18%' },
      { key: 'total_price',  label: 'Total',    width: '7%', align: 'right', nowrap: true },
      { key: 'order_status', label: 'Status',   width: '10%' },
      { key: 'payment',      label: 'Payment',  width: '7%' },
      { key: 'couriar_name', label: 'Courier',  width: '8%' },
      { key: 'comment',      label: 'Comment',  width: '7%' },
    ]
  }

  return [
    { key: 'created_at',   label: 'Date',     width: props.dailyCompact ? '94px' : '100px' },
    { key: 'customer',     label: 'Customer', width: props.dailyCompact ? '126px' : '132px' },
    { key: 'products',     label: 'Products', width: props.dailyCompact ? '176px' : undefined },
    { key: 'total_price',  label: 'Total',    width: '88px', align: 'right', nowrap: true },
    { key: 'order_status', label: 'Status',   width: '108px' },
    // Payment stays under Total, avoiding a redundant standalone column.
    { key: 'couriar_name', label: 'Courier',  width: '100px' },
  ]
})

const courierModalOrder = ref(null)

/** Refresh so the row picks up its new consignment and tracking link. */
function onCourierSent() {
  courierModalOrder.value = null
  toast('success', 'Delivery request sent to Steadfast')
  router.reload({ only: ['orders'] })
}

const selectedIds = ref([])
const expandedRows = ref(new Set())
const commentsList = ref([...props.comments])

function toggleExpanded(id) {
  if (expandedRows.value.has(id)) expandedRows.value.delete(id)
  else expandedRows.value.add(id)
  expandedRows.value = new Set(expandedRows.value)
}

const orderTotal = (order) =>
  (Number(order.total_price || 0) + Number(order.delivery_charge || 0) - Number(order.discount || 0)).toFixed(2)

// How the order is being paid. Cash on delivery needs no further detail —
// nothing is owed until the courier hands it over. An online order does: it
// exists from the moment the customer is sent to the gateway, so one abandoned
// there would look exactly like a paid one unless its status is shown.

const consignmentModalOrder = ref(null)
const commentModalOrder = ref(null)
const fraudModalOrder = ref(null)

function onCommentSaved(comment) {
  if (commentModalOrder.value) commentModalOrder.value.comment = comment
  commentModalOrder.value = null
}

async function deleteOrder(order) {
  const ok = await confirmDelete({
    title: 'Delete this order?',
    text: `Invoice #${order.invoice_number} will be removed. This cannot be undone.`,
  })
  if (ok) router.delete(route('admin.orders.delete', order.id), { preserveScroll: true })
}

async function bulkDelete() {
  if (!selectedIds.value.length) return

  const ok = await confirmDelete({
    title: `Delete ${selectedIds.value.length} order${selectedIds.value.length === 1 ? '' : 's'}?`,
    text: 'This cannot be undone.',
  })
  if (!ok) return

  try {
    await axios.post(route('admin.orders.bulkDelete'), { order_ids: selectedIds.value })
    selectedIds.value = []
    router.reload({ only: ['orders'] })
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Could not delete the selected orders.')
  }
}

async function bulkUpdateStatus(status) {
  if (!selectedIds.value.length) {
    toast('warning', 'Select at least one order first')
    return
  }
  try {
    await axios.post(route('admin.orders.bulkStatusUpdate'), { order_ids: selectedIds.value, status })
    selectedIds.value = []
    toast('success', 'Order statuses updated')
    router.reload({ only: ['orders', 'pending_order', 'processed_order', 'shipped_order', 'delivered_order', 'cancelled_order', 'returned_order', 'on_delivery', 'total_order'] })
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Could not update the order statuses.')
  }
}

defineExpose({ selectedIds, bulkDelete, bulkUpdateStatus })
</script>

<style scoped>
/* Fixed layout so the columns honour their widths and the table never grows
   wider than the card — content wraps inside cells instead of scrolling the
   page sideways. The flexible Products column absorbs the leftover width. */
.orders-table :deep(.dt-table) {
  table-layout: fixed;
  width: 100%;
}

.orders-table :deep(.dt-table th),
.orders-table :deep(.dt-table td) {
  padding: 8px 10px;
  /* No overflow:hidden here: the status dropdown menu must escape its cell.
     Long text is truncated by the inner cell elements instead. */
}

.orders-table :deep(.dt-check-col) { width: 36px; }

/* Six action buttons in one row cost ~180px; wrapped 3+3 they cost ~90px. */
.orders-table :deep(.dt-actions-col) { width: 90px; }

.orders-table :deep(.dt-actions) {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 2px;
  max-width: 86px;
}

/* Used only by Orders and POS Orders. Keep every summary on one visual line;
   full details remain available in the View action. */
.orders-table.is-daily-compact .date-cell-date,
.orders-table.is-daily-compact .courier-name,
.orders-table.is-daily-compact .courier-links {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.orders-table.is-daily-compact .courier-links {
  display: block;
}

.orders-table.is-daily-compact .date-cell-date { gap: 3px; min-width: 0; }
.orders-table.is-daily-compact .date-cell-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.orders-table.is-daily-compact .new-order-tag { flex: 0 0 auto; white-space: nowrap; }

/* Reference layout used by the storefront Orders page only. */
.orders-table.is-reference-compact :deep(.dt-table) {
  font-size: 11.5px;
}

.orders-table.is-reference-compact :deep(.dt-table th),
.orders-table.is-reference-compact :deep(.dt-table td) {
  padding: 7px 6px;
}

.orders-table.is-reference-compact :deep(.dt-table tbody td) {
  height: 56px;
}

.orders-table.is-reference-compact :deep(.dt-check-col) { width: 30px; }
.orders-table.is-reference-compact :deep(.dt-actions-col) { width: 126px; }

.orders-table.is-reference-compact :deep(.dt-actions) {
  max-width: none;
  flex-wrap: nowrap;
  gap: 1px;
}

.orders-table.is-reference-compact :deep(.table-icon-btn) {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
}

.orders-table.is-reference-compact :deep(.product-item) { padding: 2px 4px; gap: 5px; }
.orders-table.is-reference-compact :deep(.product-thumb img) { width: 26px; height: 26px; }
.orders-table.is-reference-compact :deep(.ocust) { font-size: 11px; line-height: 1.3; }

.orders-table.is-reference-compact .date-cell-date,
.orders-table.is-reference-compact .date-cell-meta,
.orders-table.is-reference-compact .courier-name,
.orders-table.is-reference-compact .courier-links {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-cell-date {
  font-weight: 600;
  color: var(--admin-green-800);
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-cell-meta { margin-top: 2px; color: var(--text-muted); font-size: 10.5px; }

.new-order-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--admin-green-600);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  line-height: 1.5;
}

.total-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.total-amount {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.total-pay {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.total-pay :deep(.pm-logo) {
  width: 44px;
  height: 17px;
}

.pay-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-width: 0;
}

.pay-cell :deep(.pm-logo) { width: 40px; height: 16px; }

.note-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  min-width: 0;
}

.note-cell-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
}

.comment-edit-btn { flex: 0 0 22px; width: 22px; height: 22px; }

.courier-cell { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.courier-name { font-weight: 600; font-size: 11.5px; color: var(--admin-green-800); }
.courier-links { font-size: 11px; display: flex; flex-wrap: wrap; column-gap: 4px; overflow-wrap: anywhere; }
.courier-links a { color: var(--admin-green-600); text-decoration: none; }
.courier-links a:hover { text-decoration: underline; }
.courier-sep { color: var(--text-faint); }

/* Only the Orders and POS Orders lists share this centered column layout. */
@media (min-width: 768px) {
  .orders-table.is-daily-compact :deep(.dt-table thead th),
  .orders-table.is-daily-compact :deep(.dt-table tbody td) { text-align: center; }
  .orders-table.is-daily-compact .date-cell-date,
  .orders-table.is-daily-compact .note-cell,
  .orders-table.is-daily-compact .courier-links,
  .orders-table.is-daily-compact :deep(.dt-actions),
  .orders-table.is-daily-compact :deep(.product-item) { justify-content: center; }
  .orders-table.is-daily-compact .total-cell,
  .orders-table.is-daily-compact .total-pay,
  .orders-table.is-daily-compact .pay-cell { align-items: center; }
  .orders-table.is-daily-compact :deep(.dt-actions) { margin-inline: auto; }
}

/* Narrow laptops: shave the fixed columns further before scrolling. */
@media (max-width: 1280px) {
  .orders-table :deep(.dt-table th),
  .orders-table :deep(.dt-table td) {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
