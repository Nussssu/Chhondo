<template>
  <AdminLayout>
    <div class="page-content">

      <div class="card">
        <div class="card-body">
          <div class="card-header d-flex flex-wrap justify-content-between">
            <h6>Incomplete Order</h6>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <OrdersTable
            :orders="orders"
            :comments="comments"
            @view-order="viewingOrderId = $event"
            @edit-order="editingOrderId = $event"
          />
        </div>
      </div>

      <OrderViewModal v-if="viewingOrderId" :order-id="viewingOrderId" @close="viewingOrderId = null" />
      <OrderEditModal
        v-if="editingOrderId"
        :order-id="editingOrderId"
        @close="editingOrderId = null"
        @updated="onOrderUpdated"
      />

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import OrdersTable from './Partials/OrdersTable.vue'
import OrderViewModal from './Partials/OrderViewModal.vue'
import OrderEditModal from './Partials/OrderEditModal.vue'

defineProps({
  orders: Object,
  comments: Array,
})

const viewingOrderId = ref(null)
const editingOrderId = ref(null)

function onOrderUpdated() {
  editingOrderId.value = null
  router.reload({ only: ['orders'] })
}
</script>
