<template>
  <AdminLayout>
    <div class="page-content">

      <h4 class="mb-3 fw-bold">Order Overview</h4>

      <!-- Stats cards -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 mb-3">
        <div class="col" v-for="card in statCards" :key="card.status">
          <a :href="card.href ?? route('admin.orders.index', { status: card.status })" class="text-decoration-none">
            <div class="card status-card" :class="{ 'stat-primary': card.primary }">
              <div class="card-body d-flex align-items-center justify-content-between gap-3">
                <div>
                  <div class="stat-number">{{ card.value }}</div>
                  <div class="stat-label">{{ card.label }}</div>
                </div>
                <div class="stat-icon flex-shrink-0">
                  <i :data-lucide="card.icon" class="stat-lucide-icon"></i>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Performance chart -->
      <div class="row">
        <div class="col-12">
          <div class="card radius-10 w-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <h5 class="mb-0">Performance</h5>
              </div>
              <div id="chart-container" class="position-relative">
                <div id="chart-loading" class="text-center" v-if="chartLoading">
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
                <div id="chart" ref="chartEl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  orderChartData: { type: Array, default: () => [] },
  total_order:     { type: Number, default: 0 },
  pending_order:   { type: Number, default: 0 },
  processed_order: { type: Number, default: 0 },
  on_delivery:     { type: Number, default: 0 },
  shipped_order:   { type: Number, default: 0 },
  incomplete_order: { type: Number, default: 0 },
  delivered_order: { type: Number, default: 0 },
  cancelled_order: { type: Number, default: 0 },
  returned_order:  { type: Number, default: 0 },
})

const chartEl = ref(null)
const chartLoading = ref(true)

const statCards = computed(() => [
  { label: 'Total Orders',      value: props.total_order,     status: '',            icon: 'layout-dashboard', primary: true },
  { label: 'Pending Orders',    value: props.pending_order,   status: 'pending',     icon: 'clock' },
  { label: 'Processed Orders',  value: props.processed_order, status: 'processed',   icon: 'settings-2' },
  { label: 'On Delivery',       value: props.on_delivery,     status: 'on delivery', icon: 'truck' },
  { label: 'Incomplete Orders', value: props.incomplete_order, status: 'incomplete', icon: 'file-clock', href: route('admin.incompelete.index') },
  { label: 'Delivered Orders',  value: props.delivered_order, status: 'delivered',   icon: 'package-check' },
  { label: 'Cancelled Orders',  value: props.cancelled_order, status: 'cancelled',   icon: 'x-circle' },
  { label: 'Return Orders',     value: props.returned_order,  status: 'returned',    icon: 'undo-2' },
])

onMounted(() => {
  // Re-init Lucide for stat icons
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  // Build ApexCharts
  const orderData = props.orderChartData
  let seriesData = [], categories = []

  orderData.forEach(order => {
    const orderDate = new Date(order.order_date).toISOString()
    if (!categories.includes(orderDate)) categories.push(orderDate)
    const existing = seriesData.find(s => s.name === order.order_status)
    if (existing) existing.data.push(order.total)
    else seriesData.push({ name: order.order_status, data: [order.total] })
  })

  chartLoading.value = false

  if (typeof window.ApexCharts !== 'undefined' && chartEl.value) {
    new window.ApexCharts(chartEl.value, {
      series: seriesData,
      chart: { height: 500, type: 'area' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: { type: 'datetime', categories },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    }).render()
  }
})
</script>
