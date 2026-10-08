<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 class="mb-1 fw-bold">Account</h4>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-success">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Income</p>
                <h4 class="fw-bold mb-1">৳{{ numberFormat(income) }}</h4>
                <span v-if="metrics.incomeChange !== undefined" class="small" :class="metrics.incomeChange >= 0 ? 'text-success' : 'text-danger'">
                  {{ metrics.incomeChange >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.incomeChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style="width:48px;height:48px;">
                <TrendingUp :size="22" class="text-success" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-danger">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Expenses</p>
                <h4 class="fw-bold mb-1">৳{{ numberFormat(expense) }}</h4>
                <span v-if="metrics.expensesChange !== undefined" class="small" :class="metrics.expensesChange >= 0 ? 'text-danger' : 'text-success'">
                  {{ metrics.expensesChange >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.expensesChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10" style="width:48px;height:48px;">
                <TrendingDown :size="22" class="text-danger" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4" :class="balance < 0 ? 'border-danger' : 'border-primary'">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Net Balance</p>
                <h4 class="fw-bold mb-1" :class="balance < 0 ? 'text-danger' : ''">৳{{ numberFormat(balance) }}</h4>
                <span v-if="metrics.netBalanceChange !== undefined" class="small" :class="metrics.netBalanceChange >= 0 ? 'text-primary' : 'text-danger'">
                  {{ metrics.netBalanceChange >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.netBalanceChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10" style="width:48px;height:48px;">
                <Wallet :size="22" class="text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-info">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Account Types</p>
                <h4 class="fw-bold mb-1">{{ accountTypeCount }}</h4>
                <span class="small text-muted">{{ purposes.length }} purposes</span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10" style="width:48px;height:48px;">
                <Layers :size="22" class="text-info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <div class="card-header pb-0">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a href="#" class="nav-link" :class="{ active: activeTab === 'transactions' }" @click.prevent="activeTab = 'transactions'">
                Transactions
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" :class="{ active: activeTab === 'transfers' }" @click.prevent="activeTab = 'transfers'">
                Fund Transfers
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" :class="{ active: activeTab === 'types' }" @click.prevent="activeTab = 'types'">
                Account Types
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" :class="{ active: activeTab === 'purposes' }" @click.prevent="activeTab = 'purposes'">
                Purposes
              </a>
            </li>
          </ul>
        </div>

        <div class="card-body">
          <!-- ============ TRANSACTIONS TAB ============ -->
          <div v-show="activeTab === 'transactions'">
            <!-- Toolbar -->
            <div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
              <form method="GET" :action="route('admin.account.dashboard')" class="d-flex flex-wrap align-items-end gap-2">
                <input type="hidden" name="tab" value="transactions" />
                <div>
                  <label class="form-label small mb-1">Start Date</label>
                  <input type="date" class="form-control form-control-sm" name="startDate" :value="currentFilters.startDate" />
                </div>
                <div>
                  <label class="form-label small mb-1">End Date</label>
                  <input type="date" class="form-control form-control-sm" name="endDate" :value="currentFilters.endDate" />
                </div>
                <div>
                  <label class="form-label small mb-1">Type</label>
                  <select class="form-select form-select-sm" name="transaction_type">
                    <option value="">All</option>
                    <option value="income" :selected="currentFilters.transaction_type === 'income'">Income</option>
                    <option value="expense" :selected="currentFilters.transaction_type === 'expense'">Expense</option>
                  </select>
                </div>
                <div>
                  <label class="form-label small mb-1">Account</label>
                  <select class="form-select form-select-sm" name="account_type">
                    <option value="">All</option>
                    <option v-for="at in accountTypes" :key="at.id" :value="at.id" :selected="String(currentFilters.account_type) === String(at.id)">{{ at.name }}</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-fig-primary btn-fig-sm">Filter</button>
                <a :href="route('admin.account.dashboard')" class="btn btn-fig-secondary btn-fig-sm">Reset</a>
              </form>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-fig-tertiary btn-fig-sm" @click="entryType = 'credit'"><Plus :size="14" /> Income</button>
                <button type="button" class="btn btn-fig-tertiary btn-fig-sm" @click="entryType = 'debit'"><Plus :size="14" /> Expense</button>
              </div>
            </div>

            <div class="table-compact-wrapper">
              <table class="table table-compact align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>#ID</th>
                    <th>Type</th>
                    <th class="text-end">Amount</th>
                    <th>Purpose</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="transactions.data && transactions.data.length">
                    <tr v-for="t in transactions.data" :key="t.id">
                      <td>
                        <span class="fw-medium">{{ formatDate(t.transaction_date) }}</span><br>
                        <small class="text-muted">{{ diffForHumans(t.transaction_date) }}</small>
                      </td>
                      <td>#{{ t.id }}</td>
                      <td>
                        <span :class="t.transaction_type === 'debit' ? 'badge bg-danger' : 'badge bg-success'">
                          {{ t.transaction_type === 'debit' ? 'Expense' : 'Income' }}
                        </span>
                      </td>
                      <td class="text-end fw-medium" :class="t.transaction_type === 'debit' ? 'text-danger' : 'text-success'">
                        ৳{{ numberFormat(t.amount) }}
                      </td>
                      <td>{{ t.purpose?.name ?? '-' }}</td>
                      <td>{{ t.account?.name ?? '-' }}</td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="6" class="text-center py-4 text-muted">No transactions found</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Pagination :meta="transactions.meta" />
          </div>

          <!-- ============ FUND TRANSFERS TAB ============ -->
          <div v-show="activeTab === 'transfers'">
            <div class="d-flex justify-content-end mb-3">
              <a :href="route('admin.account.balance-transfer-form')" class="btn btn-fig-primary btn-fig-sm"><Plus :size="14" /> New Transfer</a>
            </div>
            <div class="table-compact-wrapper">
              <table class="table table-compact align-middle mb-0">
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
                  <template v-if="transfer.data && transfer.data.length">
                    <tr v-for="(item, key) in transfer.data" :key="item.id">
                      <td>{{ (transfer.meta ? transfer.meta.from : 1) + key }}</td>
                      <td>{{ formatDate(item.transfer_date) }}</td>
                      <td>{{ item.from_balance }}</td>
                      <td>{{ item.to_balance }}</td>
                      <td class="text-end fw-bold text-success">৳{{ numberFormat(item.transfer_amount) }}</td>
                      <td class="text-end text-danger">৳{{ numberFormat(item.cost) }}</td>
                      <td>{{ item.comments ?? 'N/A' }}</td>
                      <td><span class="badge bg-soft-info">{{ item.user?.name ?? 'Admin' }}</span></td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="8" class="text-center py-4 text-muted">No transfers found</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Pagination :meta="transfer.meta" />
          </div>

          <!-- ============ ACCOUNT TYPES TAB ============ -->
          <div v-show="activeTab === 'types'">
            <div class="row g-3">
              <div class="col-12 col-lg-4">
                <form :action="route('admin.account.store')" method="POST" class="border rounded p-3">
                  <input type="hidden" name="_token" :value="csrfToken">
                  <label class="form-label">Account Name</label>
                  <input type="text" class="form-control mb-3" name="name" placeholder="Enter account type" required>
                  <button type="submit" class="btn btn-fig-primary btn-fig-sm w-100">Add Account Type</button>
                </form>
              </div>
              <div class="col-12 col-lg-8">
                <div class="table-compact-wrapper">
                  <table class="table table-compact mb-0">
                    <thead>
                      <tr>
                        <th class="text-center">SL</th>
                        <th>Account Name</th>
                        <th class="text-center">Created At</th>
                        <th class="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(at, index) in accountTypes" :key="at.id">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>{{ at.name }}</td>
                        <td class="text-center">
                          <span class="fw-bold text-primary">{{ formatDate(at.created_at) }}</span><br>
                          <small class="text-muted">{{ diffForHumans(at.created_at) }}</small>
                        </td>
                        <td class="text-center">
                          <div class="d-flex align-items-center justify-content-center gap-1">
                            <button type="button" class="table-icon-btn is-primary" title="Edit account type" @click="openType(at)"><Pencil :size="14" /></button>
                            <form :action="route('admin.account.destroy', at.id)" method="POST" class="d-inline" @submit.prevent="handleDelete($event)">
                              <input type="hidden" name="_token" :value="csrfToken">
                              <input type="hidden" name="_method" value="DELETE">
                              <button type="submit" class="table-icon-btn is-danger" title="Delete"><Trash2 :size="14" /></button>
                            </form>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!accountTypes.length">
                        <td colspan="4" class="text-center py-4 text-muted">No account types found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ PURPOSES TAB ============ -->
          <div v-show="activeTab === 'purposes'">
            <div class="d-flex justify-content-end mb-3">
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openPurpose(null)"><Plus :size="14" /> Add purpose</button>
            </div>
            <div class="table-compact-wrapper">
              <table class="table table-compact mb-0">
                <thead>
                  <tr>
                    <th class="text-center">SL</th>
                    <th>Purpose Name</th>
                    <th class="text-center">Created At</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(purpose, index) in purposes" :key="purpose.id">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{ purpose.name }}</td>
                    <td class="text-center">
                      <span class="fw-bold text-primary">{{ formatDate(purpose.created_at) }}</span><br>
                      <small class="text-muted">{{ diffForHumans(purpose.created_at) }}</small>
                    </td>
                    <td class="text-center">
                      <div class="d-flex align-items-center justify-content-center gap-1">
                        <button type="button" class="table-icon-btn is-primary" title="Edit purpose" @click="openPurpose(purpose)"><Pencil :size="14" /></button>
                        <form :action="route('admin.account.destroyPurpose', purpose.id)" method="POST" class="d-inline" @submit.prevent="handleDelete($event)">
                          <input type="hidden" name="_token" :value="csrfToken">
                          <input type="hidden" name="_method" value="DELETE">
                          <button type="submit" class="table-icon-btn is-danger" title="Delete"><Trash2 :size="14" /></button>
                        </form>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!purposes.length">
                    <td colspan="4" class="text-center py-4 text-muted">No purposes found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NameFieldModal
      v-if="typeModalOpen"
      :record="editingType"
      noun="account type"
      label="Account name"
      store-route="admin.account.store"
      update-route="admin.account.update"
      @close="typeModalOpen = false"
    />

    <NameFieldModal
      v-if="purposeModalOpen"
      :record="editingPurpose"
      noun="purpose"
      label="Purpose name"
      store-route="admin.account.storePurpose"
      update-route="admin.account.updatePurpose"
      @close="purposeModalOpen = false"
    />
    <TransactionEntryModal v-if="entryType" :type="entryType" :account-types="accountTypes" :purposes="purposes" @close="entryType = null" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import NameFieldModal from '@/components/Admin/NameFieldModal.vue'
import TransactionEntryModal from './Partials/TransactionEntryModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Plus, Pencil, Trash2, Wallet, Layers, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { useStickyTab } from '@/composables/useStickyTab'
import { adminPaginationLinks } from '@/utils/adminPagination'

const props = defineProps({
  accountTypes: { type: Array, default: () => [] },
  purposes: { type: Array, default: () => [] },
  transactions: { type: Object, default: () => ({ data: [], meta: null }) },
  transfer: { type: Object, default: () => ({ data: [], meta: null }) },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  accountTypeCount: { type: Number, default: 0 },
  metrics: { type: Object, default: () => ({}) },
  currentFilters: { type: Object, default: () => ({}) },
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

// Account types and purposes are edited in place — the standalone
// add/edit pages they used to link to are gone.
const typeModalOpen = ref(false)
const entryType = ref(null)
const editingType = ref(null)
const purposeModalOpen = ref(false)
const editingPurpose = ref(null)

function openType(record) {
  editingType.value = record
  typeModalOpen.value = true
}

function openPurpose(record) {
  editingPurpose.value = record
  purposeModalOpen.value = true
}

// Restore the active tab from the URL, and keep it there as tabs are switched,
// so a filtered request or a save lands back on the same tab.
const activeTab = useStickyTab(['transactions', 'transfers', 'types', 'purposes'], 'transactions')

// Lightweight pagination component reused by the transactions & transfers tabs.
const Pagination = {
  props: { meta: { type: Object, default: null } },
  setup(p) {
    return () => {
      if (!p.meta || !p.meta.links) return null
      return h('div', { class: 'd-flex justify-content-between align-items-center mt-3 flex-wrap gap-2' }, [
        h('div', { class: 'small text-muted' }, `Showing ${p.meta.from ?? 0} to ${p.meta.to ?? 0} of ${p.meta.total ?? 0}`),
        h('nav', {}, h('ul', { class: 'pagination pagination-sm mb-0' },
          adminPaginationLinks(p.meta).map((link) =>
            h('li', { class: ['page-item', { active: link.active, disabled: !link.url }] },
              h('a', { class: 'page-link', href: link.url || '#', innerHTML: link.label })
            )
          )
        )),
      ])
    }
  },
}

async function handleDelete(e) {
  if (await confirmDelete()) e.target.submit()
}

function numberFormat(val) {
  return parseFloat(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
