<template>
  <div>
    <DataTable
      v-model:selected="selectedIds"
      :columns="columns"
      :rows="orders.data ?? []"
      selectable
      empty-title="No orders found"
      empty-message="Orders appear here as customers check out."
    >
      <!-- Date + invoice -->
      <template #cell-created_at="{ row }">
        <div class="date-cell-date">
          {{ isRecent(row.created_at) ? timeAgo(row.created_at) : formatDate(row.created_at) }}
          <span v-if="!row.viewed_at" class="new-order-tag">New</span>
        </div>
        <div class="date-cell-meta">
          #{{ row.invoice_number }}<span v-if="orderNumber(row)"> · {{ orderNumber(row) }} order</span>
        </div>
        <div v-if="row.author" class="date-cell-author"><UserCheck :size="11" /> {{ row.author.name }}</div>
      </template>

      <template #cell-customer="{ row }">
        <OrderCustomerCell :order="row" />
      </template>

      <template #cell-products="{ row }">
        <OrderProductsCell
          :order="row"
          :expanded="expandedRows.has(row.id)"
          @toggle-expanded="toggleExpanded(row.id)"
        />
      </template>

      <template #cell-total_price="{ row }">
        {{ orderTotal(row) }}
      </template>

      <template #cell-order_status="{ row }">
        <OrderStatusDropdown :order="row" />
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
          <span class="note-cell-text">{{ row.comment?.name ?? '—' }}</span>
          <button type="button" class="table-icon-btn is-primary" title="Edit comment" @click="commentModalOrder = row">
            <Pencil :size="13" />
          </button>
        </div>
      </template>

      <template #actions="{ row }">
        <button type="button" class="table-icon-btn" title="Fraud check" @click="fraudModalOrder = row">
          <ShieldCheck :size="14" />
        </button>
        <a :href="route('admin.orders.show', row.id)" target="_blank" rel="noopener" class="table-icon-btn" title="View invoice">
          <Eye :size="14" />
        </a>
        <button type="button" class="table-icon-btn" title="View order" @click="$emit('view-order', row.id)">
          <FileText :size="14" />
        </button>
        <button type="button" class="table-icon-btn is-primary" title="Edit order" @click="$emit('edit-order', row.id)">
          <SquarePen :size="14" />
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
import { ref } from 'vue'
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
import { limit, capitalize, formatDate, isRecent, timeAgo, orderNumber } from '@/utils/orderFormatting'
import { UserCheck, Pencil, ShieldCheck, Eye, FileText, SquarePen, Trash2, Truck } from 'lucide-vue-next'

const props = defineProps({
  orders: { type: Object, required: true },
  comments: { type: Array, default: () => [] },
})

defineEmits(['view-order', 'edit-order'])

const columns = [
  { key: 'created_at',   label: 'Date', width: '15%' },
  { key: 'customer',     label: 'Customer' },
  { key: 'products',     label: 'Products' },
  { key: 'total_price',  label: 'Total', align: 'right' },
  { key: 'order_status', label: 'Status' },
  // The note is still written by customers at checkout and edited in the order
  // modals; it just does not earn a column here.
  { key: 'payment',      label: 'Payment' },
  { key: 'couriar_name', label: 'Courier' },
  { key: 'comment',      label: 'Comment', align: 'center' },
]

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
.date-cell-date {
  font-weight: 600;
  color: var(--admin-green-800);
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

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

.date-cell-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

.date-cell-author {
  font-size: 10.5px;
  color: var(--text-faint);
  margin-top: 2px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.pay-cell {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  white-space: nowrap;
}

.note-cell { display: flex; align-items: center; justify-content: center; gap: 6px; }

.note-cell-text {
  font-size: 11.5px;
  color: var(--text);
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.courier-cell { display: flex; flex-direction: column; gap: 2px; }
.courier-name { font-weight: 600; font-size: 11.5px; color: var(--admin-green-800); }
.courier-links { font-size: 11px; }
.courier-links a { color: var(--admin-green-600); text-decoration: none; }
.courier-links a:hover { text-decoration: underline; }
.courier-sep { color: var(--text-faint); margin: 0 3px; }
</style>
