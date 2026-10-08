<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Summary Cards Section -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
        <!-- Income Card -->
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
        <!-- Expense Card -->
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
        <!-- Balance Card -->
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
        <!-- Account Type Card -->
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

      <div class="row mb-3">
        <div class="col-md-12">
          <div class="d-flex justify-content-start mb-3 gap-2">
            <button class="btn btn-fig-primary btn-fig-sm ml-3" id="addFormButton" @click="handleAddForm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="plus-circle" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
            </button>
            <a class="nav-link" href="#" @click.prevent="toggleAction">
              <div v-show="selectedAction === 'credit'" id="creditSection">
                <button class="btn btn-fig-tertiary btn-fig-sm" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="admin-icon" data-lucide="credit-card" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                  </svg> Income
                </button>
              </div>
              <div v-show="selectedAction === 'debit'" id="debitSection">
                <button class="btn btn-fig-tertiary btn-fig-sm" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="admin-icon" data-lucide="credit-card" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                  </svg> Expense
                </button>
              </div>
            </a>

            <a href="#" @click.prevent="exportTable" class="btn btn-fig-tertiary btn-fig-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 44px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
              </svg>
            </a>
          </div>

          <!-- Credit Section -->
          <div class="card mb-12" v-show="selectedAction === 'credit'">
            <p class="text-center">Credit/Income Records</p>
            <div class="card-body">
              <form :action="route('admin.account.income')" method="GET">
                <div class="form-row d-flex justify-content-between align-items-end flex-wrap gap-2">
                  <div class="col-md-3 mb-3">
                    <input type="text" class="form-control date-inputn sDate" placeholder="Start Date" name="startDate" onfocus="(this.type='date')" onblur="(this.type='text')" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <input type="text" class="form-control date-input nDate" placeholder="End Date" name="endDate" onfocus="(this.type='date')" onblur="(this.type='text')" />
                  </div>
                  <input type="hidden" name="transaction_type" value="credit">
                  <div class="col-md-4 mb-3">
                    <select class="form-select" name="account_type">
                      <option v-for="at in accountTypes" :key="at.id" :value="at.id">{{ at.name }}</option>
                    </select>
                  </div>
                  <div class="col-md-auto d-flex align-items-center mb-3 gap-2">
                    <button class="btn btn-fig-tertiary btn-fig-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;" type="submit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="refresh-cw" viewBox="0 0 16 16">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                      </svg>
                    </button>
                    <a :href="route('admin.account.income')" class="btn btn-fig-secondary btn-fig-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="rotate-cw" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                      </svg>
                    </a>
                  </div>
                </div>
              </form>

              <table class="table table-striped" id="transactionsTable">
                <thead class="bg-light-purple">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Purpose</th>
                    <th>Credit In</th>
                    <th>Amount</th>
                    <th>Comment</th>
                    <th>Inserted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(credit, index) in credits.data" :key="credit.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="text-primary">{{ formatDate(credit.created_at) }}</span><br>
                      <span class="text-success">{{ diffForHumans(credit.created_at) }}</span>
                    </td>
                    <td>{{ credit.purpose?.name }}</td>
                    <td>{{ credit.account?.name }} <span class="badge bg-success">{{ credit.transaction_type }}</span></td>
                    <td>{{ credit.amount }}</td>
                    <td>{{ credit.comments ?? 'N/A' }}</td>
                    <td>Admin</td>
                  </tr>
                </tbody>
                <tfoot v-if="credits.data && credits.data.length">
                  <tr>
                    <td colspan="4" class="text-end"></td>
                    <td><strong>= {{ creditsSum }} ৳</strong></td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>

              <div class="d-flex justify-content-between" v-if="credits.meta">
                <div>Showing {{ credits.meta.from }} to {{ credits.meta.to }} of total {{ credits.meta.total }} entries</div>
                <div>
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" v-for="link in adminPaginationLinks(credits.meta)" :key="link.label" :class="{ active: link.active, disabled: !link.url }">
                        <a class="page-link" :href="link.url || '#'" v-html="link.label"></a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- Debit Section -->
          <div class="card mb-12" v-show="selectedAction === 'debit'">
            <p class="text-center">Debit/Expense Records</p>
            <div class="card-body">
              <form :action="route('admin.account.income')" method="GET">
                <div class="form-row d-flex justify-content-between align-items-end flex-wrap gap-2">
                  <div class="col-md-3 mb-3">
                    <input type="text" class="form-control date-input sDate" placeholder="Start Date" name="startDate" onfocus="(this.type='date')" onblur="(this.type='text')" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <input type="text" class="form-control date-input nDate" placeholder="End Date" name="endDate" onfocus="(this.type='date')" onblur="(this.type='text')" />
                  </div>
                  <input type="hidden" name="transaction_type" value="debit">
                  <div class="col-md-4 mb-3">
                    <select class="form-select" name="account_type">
                      <option v-for="at in accountTypes" :key="at.id" :value="at.id">{{ at.name }}</option>
                    </select>
                  </div>
                  <div class="col-md-auto d-flex align-items-center mb-3 gap-2">
                    <button class="btn btn-fig-tertiary btn-fig-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;" type="submit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="refresh-cw" viewBox="0 0 16 16">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                      </svg>
                    </button>
                    <a :href="route('admin.account.income')" class="btn btn-fig-secondary btn-fig-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="rotate-cw" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                      </svg>
                    </a>
                  </div>
                </div>
              </form>

              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Purpose</th>
                    <th>Debit From</th>
                    <th>Amount</th>
                    <th>Comment</th>
                    <th>Inserted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(debit, index) in debits.data" :key="debit.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="text-primary">{{ formatDate(debit.created_at) }}</span><br>
                      <span class="text-success">{{ diffForHumans(debit.created_at) }}</span>
                    </td>
                    <td>{{ debit.purpose?.name }}</td>
                    <td>{{ debit.account?.name }} <span class="badge bg-danger">{{ debit.transaction_type }}</span></td>
                    <td>{{ debit.amount }}</td>
                    <td>{{ debit.comments ?? 'N/A' }}</td>
                    <td>Admin</td>
                  </tr>
                </tbody>
                <tfoot v-if="debits.data && debits.data.length">
                  <tr>
                    <td colspan="4" class="text-end"></td>
                    <td><strong>= {{ debitsSum }} ৳</strong></td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>

              <div class="d-flex justify-content-between" v-if="debits.meta">
                <div>Showing {{ debits.meta.from }} to {{ debits.meta.to }} of total {{ debits.meta.total }} entries</div>
                <div>
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" v-for="link in adminPaginationLinks(debits.meta)" :key="link.label" :class="{ active: link.active, disabled: !link.url }">
                        <a class="page-link" :href="link.url || '#'" v-html="link.label"></a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TransactionEntryModal v-if="entryType" :type="entryType" :account-types="accountTypes" :purposes="purposes" @close="entryType = null" />
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const selectedAction = ref('credit')
const entryType = ref(null)

const creditsSum = computed(() => {
  return (props.credits.data || []).reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)
})

const debitsSum = computed(() => {
  return (props.debits.data || []).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)
})

function toggleAction() {
  selectedAction.value = selectedAction.value === 'credit' ? 'debit' : 'credit'
}

function handleAddForm() {
  entryType.value = selectedAction.value
}

function exportTable() {
  const table = document.getElementById('transactionsTable')
  if (!table) return
  const html = table.outerHTML
  const url = 'data:application/vnd.ms-excel,' + escape(html)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transaction-history.xls'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
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
