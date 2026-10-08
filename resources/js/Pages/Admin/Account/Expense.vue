<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Summary Cards Section -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
        <div class="col">
          <div class="card shadow-sm border-start-success h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-shape bg-success bg-opacity-10 rounded-3 p-3">
                  <img :src="'/uploads/total income.png'" style="width: 40px; height: 35px" />
                </div>
                <div>
                  <h6 class="mb-1 text-muted">Total Income</h6>
                  <h3 class="mb-0 fw-semibold">{{ income ?? 0 }} ৳</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card shadow-sm border-start-danger h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-shape bg-danger bg-opacity-10 rounded-3 p-3">
                  <img :src="'/uploads/total expense.png'" style="width: 40px; height: 35px" />
                </div>
                <div>
                  <h6 class="mb-1 text-muted">Total Expense</h6>
                  <h3 class="mb-0 fw-semibold">{{ expense ?? 0 }} ৳</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card shadow-sm h-100" :class="balance < 0 ? 'border-start-danger' : 'border-start-success'">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-shape rounded-3 p-3" :class="balance < 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'">
                  <img :src="'/uploads/total balance.png'" style="width: 40px; height: 35px" />
                </div>
                <div>
                  <h6 class="mb-1 text-muted">Current Balance</h6>
                  <h3 class="mb-0 fw-semibold">
                    {{ balance }} ৳
                    <img v-if="balance < 0" :src="'/uploads/arrow-down.png'" style="width: 20px; height: 20px" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="arrow-up" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 12.293V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card shadow-sm border-start-info h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-shape bg-info bg-opacity-10 rounded-3 p-3">
                  <img :src="'/uploads/account type.png'" style="width: 40px; height: 35px" />
                </div>
                <div>
                  <h6 class="mb-1 text-muted">Account Type</h6>
                  <h3 class="mb-0 fw-semibold">{{ accountType ?? 'N/A' }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Section -->
      <div class="card shadow-sm border-0">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="card-title mb-0">Transaction History</h5>
            <div class="d-flex gap-2">
              <button class="btn btn-fig-primary btn-fig-sm" @click="goToAddDebit">
                <i class="admin-icon me-1" data-lucide="plus-circle"></i>Add Debit
              </button>
              <button class="btn btn-fig-tertiary btn-fig-sm" @click="exportTable">
                <i class="admin-icon me-1" data-lucide="download"></i>Export
              </button>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-12 col-md-4">
              <div class="input-group">
                <span class="input-group-text"><i class="admin-icon" data-lucide="calendar"></i></span>
                <input type="date" class="form-control" id="startDate" placeholder="Start Date">
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="input-group">
                <span class="input-group-text"><i class="admin-icon" data-lucide="calendar"></i></span>
                <input type="date" class="form-control" id="endDate" placeholder="End Date">
              </div>
            </div>
            <div class="col-12 col-md-4">
              <select class="form-select" id="accountTypeSelect">
                <option v-for="at in accountTypes" :key="at.id" :value="at.id">{{ at.name }}</option>
              </select>
            </div>
          </div>

          <div class="table-responsive" id="transactionsTable">
            <table class="table table-hover table-borderless">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Account/Purpose</th>
                  <th class="text-end">Amount</th>
                  <th>Notes</th>
                  <th>Inserted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(debit, index) in debits.data" :key="debit.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-semibold">{{ formatDate(debit.created_at) }}</span>
                      <small class="text-muted">{{ diffForHumans(debit.created_at) }}</small>
                    </div>
                  </td>
                  <td>
                    <span :class="debit.transaction_type === 'debit' ? 'badge bg-danger' : 'badge bg-success'">
                      {{ capitalize(debit.transaction_type) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-semibold">{{ debit.account?.name }}</span>
                      <small class="text-muted">{{ debit.purpose?.name }}</small>
                    </div>
                  </td>
                  <td class="text-end fw-semibold">{{ numberFormat(debit.amount) }} ৳</td>
                  <td>{{ debit.comments ?? 'N/A' }}</td>
                  <td>Admin</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-4" v-if="debits.meta">
            <div class="text-muted">
              Showing {{ debits.meta.from }} to {{ debits.meta.to }} of {{ debits.meta.total }} entries
            </div>
            <nav>
              <ul class="pagination pagination-bootstrap-5">
                <li class="page-item" v-for="link in adminPaginationLinks(debits.meta)" :key="link.label" :class="{ active: link.active, disabled: !link.url }">
                  <a class="page-link" :href="link.url || '#'" v-html="link.label"></a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <TransactionEntryModal v-if="entryOpen" type="debit" :account-types="accountTypes" :purposes="purposes" @close="entryOpen = false" />
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import TransactionEntryModal from './Partials/TransactionEntryModal.vue'
import { adminPaginationLinks } from '@/utils/adminPagination'

const props = defineProps({
  credits: { type: Object, default: () => ({ data: [], meta: null }) },
  debits: { type: Object, default: () => ({ data: [], meta: null }) },
  accountTypes: { type: Array, default: () => [] },
  purposes: { type: Array, default: () => [] },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  accountType: { type: Number, default: 0 },
})

const entryOpen = ref(false)
function goToAddDebit() { entryOpen.value = true }

function exportTable() {
  const table = document.getElementById('transactionsTable')
  if (!table) return
  const html = table.outerHTML
  const url = 'data:application/vnd.ms-excel,' + escape(html)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.xls'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function diffForHumans(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function numberFormat(val) {
  return parseFloat(val || 0).toFixed(2)
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
