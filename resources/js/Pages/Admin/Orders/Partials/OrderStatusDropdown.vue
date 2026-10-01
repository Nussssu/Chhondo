<template>
  <div class="dropdown status-dropdown">
    <button class="table-pill-btn dropdown-toggle" :class="statusMeta(order.order_status).btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{ capitalize(order.order_status) }}
    </button>
    <ul class="dropdown-menu">
      <li v-for="status in STATUS_OPTIONS" :key="status">
        <a class="dropdown-item" :class="statusMeta(status).item" href="#" @click.prevent="updateStatus(status)">
          {{ capitalize(status === 'shipped' ? 'Partial delivery' : status) }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import axios from 'axios'
import { capitalize } from '@/utils/orderFormatting'
import { STATUS_OPTIONS, statusMeta } from '@/utils/orderStatusMeta'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, required: true },
})

async function updateStatus(status) {
  try {
    await axios.post(route('admin.orders.updateStatus'), { order_id: props.order.id, status })
    props.order.order_status = status
    toast('success', 'Order status updated')
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Failed to update status')
  }
}
</script>
