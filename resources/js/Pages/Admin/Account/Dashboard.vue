<template>
  <AdminLayout>
    <div class="page-content">
      <!-- Header -->
      <div class="mb-4">
        <h4 class="mb-1 fw-bold">Financial Overview</h4>
      </div>

      <!-- Quick Stats -->
      <div class="row g-3 mb-3">
        <!-- Total Income -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-success">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Income</p>
                <h4 class="fw-bold mb-1">৳{{ numberFormat(income) }}</h4>
                <span class="small" :class="incomeChange >= 0 ? 'text-success' : 'text-danger'">
                  {{ incomeChange >= 0 ? '↑' : '↓' }} {{ Math.abs(incomeChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style="width:48px;height:48px;">
                <i class="admin-icon fs-4 text-success" data-lucide="wallet"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-danger">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Expenses</p>
                <h4 class="fw-bold mb-1">৳{{ numberFormat(expenses) }}</h4>
                <span class="small" :class="expensesChange >= 0 ? 'text-danger' : 'text-success'">
                  {{ expensesChange >= 0 ? '↑' : '↓' }} {{ Math.abs(expensesChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10" style="width:48px;height:48px;">
                <i class="admin-icon fs-4 text-danger" data-lucide="shopping-cart"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Net Balance -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-primary">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Net Balance</p>
                <h4 class="fw-bold mb-1">৳{{ numberFormat(netBalance) }}</h4>
                <span class="small" :class="netBalanceChange >= 0 ? 'text-primary' : 'text-danger'">
                  {{ netBalanceChange >= 0 ? '↑' : '↓' }} {{ Math.abs(netBalanceChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10" style="width:48px;height:48px;">
                <i class="admin-icon fs-4 text-primary" data-lucide="wallet"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Savings Rate -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-start border-4 border-info">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Savings Rate</p>
                <h4 class="fw-bold mb-1">{{ numberFormat(savingsRate) }}%</h4>
                <span class="small" :class="savingsRateChange >= 0 ? 'text-info' : 'text-danger'">
                  {{ savingsRateChange >= 0 ? '↑' : '↓' }} {{ Math.abs(savingsRateChange).toFixed(2) }}% vs last month
                </span>
              </div>
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10" style="width:48px;height:48px;">
                <i class="admin-icon fs-4 text-info" data-lucide="pie-chart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row g-3 mb-3">
        <div class="col-12 col-lg-7">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Monthly Overview</h6>
              <div style="position:relative;height:320px;">
                <canvas id="monthlyOverview"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Income Distribution</h6>
              <div style="position:relative;height:320px;">
                <canvas id="incomeDistributions"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Recent Transactions</h6>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ transaction.transaction_date }}</td>
                  <td>{{ transaction.comments || 'No description' }}</td>
                  <td>{{ accountTypes.find(a => a.id === transaction.account_id)?.name || 'Unknown' }}</td>
                  <td :class="transaction.transaction_type === 'credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'">
                    ৳{{ parseFloat(transaction.amount).toLocaleString() }}
                  </td>
                </tr>
                <tr v-if="!transactions.length">
                  <td colspan="4" class="text-center text-muted py-4">No transactions found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  accountTypes: { type: Array, default: () => [] },
  transactions: { type: Array, default: () => [] },
  income: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  netBalance: { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 },
  incomeChange: { type: Number, default: 0 },
  expensesChange: { type: Number, default: 0 },
  netBalanceChange: { type: Number, default: 0 },
  savingsRateChange: { type: Number, default: 0 },
})

function numberFormat(val) {
  return Number(val || 0).toLocaleString()
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  const backendTransactions = props.transactions
  const accountTypes = props.accountTypes

  const monthlyCtx = document.getElementById('monthlyOverview')?.getContext('2d')
  if (monthlyCtx) {
    const monthlyData = backendTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.transaction_date).toLocaleString('default', { month: 'short' })
      const amount = parseFloat(transaction.amount)
      if (transaction.transaction_type === 'credit') {
        acc.income[month] = (acc.income[month] || 0) + amount
      } else {
        acc.expenses[month] = (acc.expenses[month] || 0) + amount
      }
      return acc
    }, { income: {}, expenses: {} })

    new window.Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: Object.keys(monthlyData.income),
        datasets: [{
          label: 'Income',
          data: Object.values(monthlyData.income),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Expenses',
          data: Object.values(monthlyData.expenses),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }

  const distributionCtx = document.getElementById('incomeDistributions')?.getContext('2d')
  if (distributionCtx) {
    const accountTotals = backendTransactions.reduce((acc, transaction) => {
      const account = accountTypes.find(a => a.id === transaction.account_id)?.name || 'Unknown'
      acc[account] = (acc[account] || 0) + parseFloat(transaction.amount)
      return acc
    }, {})

    new window.Chart(distributionCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(accountTotals),
        datasets: [{
          data: Object.values(accountTotals),
          backgroundColor: [
            '#10B981', '#3B82F6', '#F59E0B', '#6366F1',
            '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    })
  }
})
</script>
