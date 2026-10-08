<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Summary Cards Section -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card bg-success text-white shadow-lg hover-transform">
            <div class="card-body d-flex align-items-center">
              <div class="icon-shape bg-success bg-opacity-10 rounded-3 p-3">
                <img :src="'/uploads/total income.png'" style="width: 40px; height: 35px" />
              </div>
              <div class="flex-grow-1 ms-3">
                <h5 class="card-title mb-1">Total Income</h5>
                <h2 class="mb-0">{{ numberFormat(totalCredit) }}৳</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card bg-danger text-white shadow-lg hover-transform">
            <div class="card-body d-flex align-items-center">
              <div class="flex-shrink-0">
                <img :src="'/uploads/total expense.png'" style="width: 40px; height: 35px" />
              </div>
              <div class="flex-grow-1 ms-3">
                <h5 class="card-title mb-1">Total Expenses</h5>
                <h2 class="mb-0">{{ numberFormat(totalDebit) }}৳</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card text-white shadow-lg hover-transform" :class="netTotal < 0 ? 'bg-danger' : 'bg-primary'">
            <div class="card-body d-flex align-items-center">
              <div class="flex-shrink-0">
                <img :src="'/uploads/total balance.png'" style="width: 40px; height: 35px" />
              </div>
              <div class="flex-grow-1 ms-3">
                <h5 class="card-title mb-1">Net Balance</h5>
                <h2 class="mb-0">{{ numberFormat(netTotal) }}৳</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="card shadow-lg mb-4 border-0">
        <div class="card-header py-3">
          <h4 class="mb-0"><i class="admin-icon me-2" data-lucide="filter"></i>Filter Transactions</h4>
        </div>
        <div class="card-body">
          <form id="filterForm" method="GET" :action="route('admin.account.account-report')">
            <div class="row g-4">
              <div class="col-md-3">
                <label for="startDate" class="form-label text-primary">Start Date</label>
                <input type="date" id="startDate" class="form-control shadow-sm" name="startDate">
              </div>
              <div class="col-md-3">
                <label for="endDate" class="form-label text-primary">End Date</label>
                <input type="date" id="endDate" class="form-control shadow-sm" name="endDate">
              </div>
              <div class="col-md-3">
                <label for="transactionType" class="form-label text-primary">Transaction Type</label>
                <select id="transactionType" class="form-select shadow-sm" name="transaction_type">
                  <option value="">All Transactions</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="accountType" class="form-label text-primary">Account Category</label>
                <select id="accountType" class="form-select shadow-sm" name="account_type">
                  <option value="">All Categories</option>
                  <option v-for="type in accountTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
              </div>
              <div class="col-md-12 d-flex justify-content-end gap-2">
                <button type="reset" class="btn btn-fig-secondary btn-fig-md">Reset</button>
                <button type="submit" class="btn btn-fig-primary btn-fig-md">Apply Filters</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Data Sections -->
      <div class="row">
        <!-- Transactions Section -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-lg border-0">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Transaction Overview</h4>
                <button class="btn btn-fig-tertiary btn-fig-sm" id="downloadCSV" @click="downloadCSV">Export CSV</button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0" id="transactionsTable">
                  <thead class="bg-light-success">
                    <tr>
                      <th class="ps-4">Date</th>
                      <th>Transaction ID</th>
                      <th>Type</th>
                      <th class="text-end">Amount</th>
                      <th>Description</th>
                      <th class="pe-4">Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="transactions.data && transactions.data.length">
                      <tr v-for="transaction in transactions.data" :key="transaction.id" class="cursor-pointer">
                        <td class="ps-4">
                          <div class="d-flex flex-column">
                            <span class="fw-medium">{{ formatDate(transaction.transaction_date) }}</span>
                            <small class="text-muted">{{ diffForHumans(transaction.transaction_date) }}</small>
                          </div>
                        </td>
                        <td>#{{ transaction.id }}</td>
                        <td>
                          <span :class="transaction.transaction_type === 'debit' ? 'badge bg-danger rounded-pill' : 'badge bg-success rounded-pill'">
                            {{ transaction.transaction_type === 'debit' ? 'Expense' : 'Income' }}
                          </span>
                        </td>
                        <td class="text-end fw-medium" :class="transaction.transaction_type === 'debit' ? 'text-danger' : 'text-success'">
                          {{ numberFormat(transaction.amount) }}৳
                        </td>
                        <td>{{ transaction.purpose?.name ?? '-' }}</td>
                        <td class="pe-4">{{ transaction.account?.name ?? '-' }}</td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="6" class="text-center py-4 text-muted">No transactions found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Transfers Section -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-lg border-0">
            <div class="card-header py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Fund Transfers</h4>
                <button class="btn btn-fig-tertiary btn-fig-sm" id="downloadTransferCSV" @click="downloadTransferCSV">Export CSV</button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0" id="transfersTable">
                  <thead class="bg-light-purple">
                    <tr>
                      <th class="ps-4">Date</th>
                      <th>Transfer ID</th>
                      <th class="text-end">Amount</th>
                      <th>From Account</th>
                      <th>To Account</th>
                      <th class="pe-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="transfers && transfers.length">
                      <tr v-for="transfer in transfers" :key="transfer.id">
                        <td class="ps-4">{{ formatDate(transfer.transfer_date) }}</td>
                        <td>#{{ transfer.id }}</td>
                        <td class="text-end fw-medium text-primary">{{ numberFormat(transfer.transfer_amount) }}৳</td>
                        <td>{{ transfer.from_balance ?? '-' }}</td>
                        <td>{{ transfer.to_balance ?? '-' }}</td>
                        <td class="pe-4 text-danger fw-medium">{{ numberFormat(transfer.cost) }}</td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="6" class="text-center py-4 text-muted">No transfers found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4" v-if="transactions.meta">
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-separated pagination-lg">
            <li class="page-item" v-for="link in adminPaginationLinks(transactions.meta)" :key="link.label" :class="{ active: link.active, disabled: !link.url }">
              <a class="page-link" :href="link.url || '#'" v-html="link.label"></a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { adminPaginationLinks } from '@/utils/adminPagination'

const props = defineProps({
  accountTypes: { type: Array, default: () => [] },
  transactions: { type: Object, default: () => ({ data: [], meta: null }) },
  netTotal: { type: Number, default: 0 },
  totalCredit: { type: Number, default: 0 },
  totalDebit: { type: Number, default: 0 },
  transfers: { type: Array, default: () => [] },
})

function numberFormat(val) {
  return parseFloat(val || 0).toFixed(2)
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

function tableToCSV(tableId, filename) {
  const rows = document.querySelectorAll(`#${tableId} tr`)
  let csvFile = ''
  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th')
    const rowData = Array.from(cols).map(col => col.innerText)
    csvFile += rowData.join(',') + '\n'
  })
  const blob = new Blob([csvFile], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadCSV() {
  tableToCSV('transactionsTable', 'transaction.csv')
}

function downloadTransferCSV() {
  tableToCSV('transfersTable', 'transfer.csv')
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>

<style scoped>
.hover-transform {
  transition: transform 0.3s ease;
}
.hover-transform:hover {
  transform: translateY(-5px);
}
.bg-light-purple {
  background-color: #F1F2EE;
}
.bg-light-success {
  background-color: #e6ffed;
}
.pagination-separated .page-item {
  margin: 0 2px;
}
.pagination-separated .page-link {
  border-radius: 8px !important;
}
</style>
