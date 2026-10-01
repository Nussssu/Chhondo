<template>
  <AdminLayout>
    <div class="page-content">
      <div class="row">
        <div class="col-md-12">
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Balance Transfers</h5>
                <a :href="route('admin.account.balance-transfer-form')" class="btn btn-fig-primary btn-fig-sm">
                  <Plus :size="16" /> New Transfer
                </a>
              </div>
            </div>
            <div class="card-body">
              <div v-if="transfer.data && transfer.data.length > 0" class="table-compact-wrapper">
                <table class="table table-compact align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>From Account</th>
                      <th>To Account</th>
                      <th class="text-end">Amount</th>
                      <th class="text-end">Cost</th>
                      <th>Comment</th>
                      <th>Created By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in transfer.data" :key="item.id">
                      <td>{{ (transfer.meta ? transfer.meta.from : 1) + key }}</td>
                      <td>{{ formatDate(item.transfer_date) }}</td>
                      <td>{{ item.from_balance }}</td>
                      <td>{{ item.to_balance }}</td>
                      <td class="text-end fw-bold text-success">৳{{ numberFormat(item.transfer_amount) }}</td>
                      <td class="text-end text-danger">৳{{ numberFormat(item.cost) }}</td>
                      <td>{{ item.comments ?? 'N/A' }}</td>
                      <td>
                        <span class="badge bg-soft-info">{{ item.user?.name }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-warning text-center">
                No balance transfers found.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps({
  transfer: { type: Object, default: () => ({ data: [], meta: null }) },
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function numberFormat(val) {
  return parseFloat(val || 0).toFixed(2)
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
