<template>
  <AdminLayout>
    <div class="page-content p-4">
      <div class="card shadow-sm border-0">
        <div class="card-header py-3">
          <h5 class="card-title mb-0 fs-5 fw-medium">Balance Transfer</h5>
        </div>
        <div class="card-body p-4">
          <form id="balanceTransferForm" :action="route('admin.account.balance-transfer')" method="POST" @submit="handleSubmit">
            <input type="hidden" name="_token" :value="csrfToken">
            <!-- From Account -->
            <div class="row mb-4 align-items-center">
              <label for="from_balance" class="col-sm-3 col-form-label fw-medium">From Account</label>
              <div class="col-sm-9">
                <select id="from_balance" name="from_balance" class="form-select form-select-lg">
                  <option value="">Select Source Account</option>
                  <option v-for="account in accounts" :key="account.id" :value="account.id" :data-balance="account.total_amount">
                    {{ account.name }} ({{ account.total_amount }})
                  </option>
                </select>
                <div id="from_balance_error" class="invalid-feedback d-block"></div>
              </div>
            </div>
            <!-- To Account -->
            <div class="row mb-4 align-items-center">
              <label for="to_balance" class="col-sm-3 col-form-label fw-medium">To Account</label>
              <div class="col-sm-9">
                <select id="to_balance" name="to_balance" class="form-select form-select-lg">
                  <option value="">Select Destination Account</option>
                  <option v-for="account in accounts" :key="account.id" :value="account.id" :data-balance="account.total_amount">
                    {{ account.name }} ({{ account.total_amount }})
                  </option>
                </select>
                <div id="to_balance_error" class="invalid-feedback d-block"></div>
              </div>
            </div>
            <!-- Amount Fields -->
            <div class="bg-light p-4 rounded-3 mb-4">
              <div class="row mb-3 align-items-center">
                <label for="amount" class="col-sm-3 col-form-label fw-medium">Transfer Amount</label>
                <div class="col-sm-9">
                  <input type="number" id="amount" name="amount" class="form-control form-control-lg" placeholder="Enter amount" v-model="amount" @input="updateTransferAmount" value="0">
                  <div id="amount_error" class="invalid-feedback d-block"></div>
                </div>
              </div>
              <div class="row mb-3 align-items-center">
                <label for="cost" class="col-sm-3 col-form-label fw-medium">Transfer Fee</label>
                <div class="col-sm-9">
                  <div class="input-group">
                    <input type="number" id="cost" name="cost" class="form-control form-control-lg" placeholder="Enter fee" v-model="cost" @input="updateTransferAmount" value="0">
                    <span class="input-group-text bg-white">%</span>
                  </div>
                  <div id="cost_error" class="invalid-feedback d-block"></div>
                </div>
              </div>
              <div class="row align-items-center">
                <label for="transfer_amount" class="col-sm-3 col-form-label fw-medium">Net Amount</label>
                <div class="col-sm-9">
                  <input type="number" id="transfer_amount" name="transfer_amount" class="form-control form-control-lg bg-light" :value="transferAmount" readonly>
                </div>
              </div>
            </div>
            <!-- Comment -->
            <div class="row mb-4 align-items-center">
              <label for="comment" class="col-sm-3 col-form-label fw-medium">Notes</label>
              <div class="col-sm-9">
                <textarea id="comment" name="comment" class="form-control form-control-lg" rows="2" placeholder="Add transfer notes"></textarea>
              </div>
            </div>
            <!-- Submit -->
            <div class="row mt-5">
              <div class="col-sm-9 offset-sm-3">
                <button type="submit" class="btn btn-fig-primary btn-fig-md w-100 py-1">
                  <i class="admin-icon me-2" data-lucide="arrow-left-right"></i>Confirm Transfer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  accounts: { type: Array, default: () => [] },
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content
const amount = ref(0)
const cost = ref(0)

const transferAmount = computed(() => {
  return (parseFloat(amount.value) || 0) - (parseFloat(cost.value) || 0)
})

function updateTransferAmount() {
  // computed handles reactively
}

function clearErrors() {
  document.querySelectorAll('.invalid-feedback').forEach(el => el.innerText = '')
}

function showError(elementId, message) {
  const el = document.getElementById(elementId)
  if (el) el.innerText = message
}

function handleSubmit(event) {
  event.preventDefault()
  clearErrors()

  const fromEl = document.getElementById('from_balance')
  const toEl = document.getElementById('to_balance')
  let isValid = true

  if (fromEl.value === toEl.value) {
    showError('to_balance_error', 'Source and destination accounts must be different')
    isValid = false
  }

  if (parseFloat(amount.value) <= 0 || isNaN(amount.value)) {
    showError('amount_error', 'Please enter a valid transfer amount')
    isValid = false
  }

  const fromBalance = parseFloat(fromEl.options[fromEl.selectedIndex]?.dataset.balance)
  if (fromBalance < parseFloat(amount.value)) {
    showError('amount_error', 'Insufficient balance in source account')
    isValid = false
  }

  if (isValid) event.target.submit()
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
