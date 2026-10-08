<template>
  <AdminLayout>
    <div class="page-content dashboard-page">

      <div class="dashboard-header flex-shrink-0">
        <h5 class="mb-2 fw-bold">Order Overview</h5>
      </div>

      <!-- Stats cards -->
      <div class="dashboard-stats-grid flex-shrink-0">
        <div v-for="card in statCards" :key="card.status" class="dashboard-stat-col">
          <a :href="card.href ?? route('admin.orders.index', { status: card.status })" class="text-decoration-none d-block h-100">
            <div class="card status-card dashboard-stat-card h-100" :class="{ 'stat-primary': card.primary }">
              <div class="card-body d-flex align-items-center justify-content-between">
                <div class="stat-meta">
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
      <div class="dashboard-chart-card-wrapper flex-grow-1">
        <div class="card radius-10 w-100 h-100 m-0 dashboard-chart-card">
          <div class="card-body d-flex flex-column h-100">
            <div class="d-flex align-items-center mb-2 flex-shrink-0">
              <h6 class="mb-0 fw-semibold">Performance</h6>
            </div>
            <div id="chart-container" class="position-relative flex-grow-1">
              <div id="chart-loading" class="text-center" v-if="chartLoading">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div id="chart" ref="chartEl"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
let chartInstance = null

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

onMounted(async () => {
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

  await nextTick()

  if (typeof window.ApexCharts !== 'undefined' && chartEl.value) {
    chartInstance = new window.ApexCharts(chartEl.value, {
      series: seriesData,
      chart: { height: '100%', type: 'area' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: { type: 'datetime', categories },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    })
    chartInstance.render()
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.dashboard-page {
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .dashboard-page {
    height: calc(100vh - 60px);
    max-height: calc(100vh - 60px);
    padding: 14px 20px 14px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

@media (max-width: 991px) {
  .dashboard-page {
    min-height: calc(100vh - 60px);
    padding: 14px 14px 24px !important;
  }
}

.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

@media (min-width: 1600px) {
  .dashboard-stats-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 991px) {
  .dashboard-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 575px) {
  .dashboard-stats-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-stat-card {
  border-radius: 10px !important;
  margin-bottom: 0 !important;
}

.dashboard-stat-card .card-body {
  padding: 8px 12px !important;
  gap: 8px;
}

.dashboard-stat-card .stat-number {
  font-size: 19px !important;
  line-height: 1.1 !important;
}

.dashboard-stat-card .stat-label {
  font-size: 11px !important;
  margin-top: 1px !important;
  white-space: nowrap;
}

.dashboard-stat-card .stat-icon {
  width: 34px !important;
  height: 34px !important;
  border-radius: 8px !important;
}

.dashboard-stat-card .stat-lucide-icon {
  width: 17px !important;
  height: 17px !important;
}

.dashboard-chart-card-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.dashboard-chart-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-chart-card .card-body {
  padding: 12px 16px !important;
}

#chart-container {
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

#chart {
  height: 100%;
  width: 100%;
  min-height: 0;
}

#chart :deep(.apexcharts-canvas) {
  width: 100% !important;
  height: 100% !important;
}

#chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
