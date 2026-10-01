<template>
  <Head><title>Steadfast Order Information</title></Head>
  <div class="steadfast-page">
    <div class="p-3">
      <div class="card">
        <div class="card-header">
          <div class="header-row">
            <img v-if="logoUrl" :src="logoUrl" width="70" height="70">
            <p v-else>No logo available</p>
            <h6>Steadfast Order Information</h6>
            <p>Date : {{ today }}</p>
            <button class="btn btn-fig-primary btn-fig-md" @click="downloadCsv">Download CSV</button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped" id="steadfastTable">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Contact Name</th>
                  <th>Contact Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>{{ order.invoice_number }}</td>
                  <td>{{ order.customer_name }}</td>
                  <td>{{ order.address }}</td>
                  <td>{{ order.phone_number }}</td>
                  <td>{{ order.total_price }}</td>
                  <td>None</td>
                  <td>{{ authUser?.name }}</td>
                  <td>{{ authUser?.phone }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'

defineProps({
  orders: { type: Array, default: () => [] },
  comments: { type: Array, default: () => [] },
  logoUrl: { type: String, default: null },
})

const page = usePage()
const authUser = computed(() => page.props.auth?.user ?? null)
const today = new Date().toISOString().slice(0, 10)

function downloadCsv() {
  const rows = document.querySelectorAll('#steadfastTable tbody tr')
  const csvData = Array.from(rows).map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent.trim()).join(',')
  )

  const blob = new Blob([csvData.join('\n')], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'orders.csv'
  link.click()
}
</script>

<style scoped>
.steadfast-page {
  min-height: 100vh;
  background: #fff;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
