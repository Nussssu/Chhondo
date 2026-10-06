<template>
  <AdminLayout>
    <div class="page-content">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 class="fw-bold mb-0">Analytics Dashboard</h4>
        <select v-model="range" class="form-select w-auto" @change="updateDashboard">
          <option value="1">Today</option>
          <option value="4">Last 7 days</option>
        </select>
      </div>

      <!-- Metric Cards -->
      <div class="row g-3 mb-3">
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 border-start border-4 border-primary">
            <div class="card-body">
              <div class="text-muted small mb-1">Total Visitors</div>
              <h4 class="fw-bold mb-0">{{ numberFormat(metrics.total_visitors) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 border-start border-4 border-success">
            <div class="card-body">
              <div class="text-muted small mb-1">Unique Visitors</div>
              <h4 class="fw-bold mb-0">{{ numberFormat(metrics.unique_visitors) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 border-start border-4 border-info">
            <div class="card-body">
              <div class="text-muted small mb-1">Avg. Session Duration</div>
              <h4 class="fw-bold mb-0">{{ metrics.avg_session_duration }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 border-start border-4 border-warning">
            <div class="card-body">
              <div class="text-muted small mb-1">Live Visitors</div>
              <h4 class="fw-bold mb-0">
                <span class="live-indicator"></span>{{ metrics.live_visitors }}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-3 mb-3">
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Visitor Trends</h6>
                <select v-model="days" class="form-select form-select-sm w-auto" @change="updateDashboard">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              <div style="position:relative;height:300px;">
                <canvas ref="trendCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="fw-bold mb-3">User Engagement</h6>
              <div style="position:relative;height:300px;">
                <canvas ref="engagementCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Active Pages -->
      <div class="card mb-3">
        <div class="card-header">
          <h6 class="fw-bold mb-0">Most Active Pages</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th style="width:48px;">#</th>
                  <th>Page</th>
                  <th class="text-end">Visits</th>
                  <th style="width:35%;">Share</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(page, idx) in most_active_pages" :key="idx">
                  <td class="text-muted">{{ idx + 1 }}</td>
                  <td class="text-truncate" style="max-width:320px;">{{ prettyUrl(page.url) }}</td>
                  <td class="text-end fw-semibold">{{ numberFormat(page.visits) }}</td>
                  <td>
                    <div class="progress" style="height:8px;">
                      <div class="progress-bar" role="progressbar"
                        :style="{ width: pageSharePercent(page.visits) + '%', backgroundColor: '#252f17' }"></div>
                    </div>
                  </td>
                </tr>
                <tr v-if="!most_active_pages.length">
                  <td colspan="4" class="text-center text-muted py-4">No page activity yet</td>
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
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  total_visitors: { type: Number, default: 0 },
  unique_visitors: { type: Number, default: 0 },
  avg_session_duration: { default: 0 },
  live_visitors: { default: 0 },
  visitor_trends: { type: Object, default: () => ({ labels: [], total: [], unique: [] }) },
  user_engagement: { type: Array, default: () => [] },
  most_active_pages: { type: Array, default: () => [] },
})

const range = ref('1')
const days = ref('7')

const trendCanvas = ref(null)
const engagementCanvas = ref(null)

let trendChart = null
let engagementChart = null
let pollTimer = null

const metrics = reactive({
  total_visitors: props.total_visitors,
  unique_visitors: props.unique_visitors,
  avg_session_duration: props.avg_session_duration,
  live_visitors: props.live_visitors,
})

function numberFormat(v) {
  return new Intl.NumberFormat().format(Number(v || 0))
}

function prettyUrl(url) {
  if (!url || url === 'N/A') return 'Unknown'
  try {
    const u = new URL(url)
    return (u.pathname + u.search) || '/'
  } catch {
    return url
  }
}

function pageSharePercent(visits) {
  const total = props.most_active_pages.reduce((a, p) => a + Number(p.visits || 0), 0) || 1
  return (Number(visits) / total) * 100
}

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { usePointStyle: true, padding: 16 } } },
}

function buildCharts() {
  if (typeof window.Chart === 'undefined') return

  if (trendCanvas.value) {
    trendChart = new window.Chart(trendCanvas.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: props.visitor_trends.labels || [],
        datasets: [
          { label: 'Total Visitors', data: props.visitor_trends.total || [], borderColor: '#1a2110', backgroundColor: 'rgba(26, 33, 16,0.1)', tension: 0.3, fill: true, pointRadius: 3 },
          { label: 'Unique Visitors', data: props.visitor_trends.unique || [], borderColor: '#cc9b25', backgroundColor: 'rgba(204, 155, 37,0.1)', tension: 0.3, fill: true, pointRadius: 3 },
        ],
      },
      options: { ...commonOptions, scales: { y: { beginAtZero: true } } },
    })
  }

  if (engagementCanvas.value) {
    engagementChart = new window.Chart(engagementCanvas.value.getContext('2d'), {
      type: 'bar',
      data: {
        labels: props.user_engagement.map(i => i.duration_range),
        datasets: [{ label: 'Session Duration', data: props.user_engagement.map(i => i.count), backgroundColor: '#1a2110' }],
      },
      options: { ...commonOptions, scales: { y: { beginAtZero: true } } },
    })
  }
}

function updateDashboard() {
  fetch(`/admin/analytics?range=${range.value}&days=${days.value}`, {
    headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
  })
    .then(r => r.json())
    .then(data => {
      metrics.total_visitors = data.total_visitors
      metrics.unique_visitors = data.unique_visitors
      metrics.avg_session_duration = data.avg_session_duration
      metrics.live_visitors = data.live_visitors

      if (trendChart && data.visitor_trends) {
        trendChart.data.labels = data.visitor_trends.labels
        trendChart.data.datasets[0].data = data.visitor_trends.total
        trendChart.data.datasets[1].data = data.visitor_trends.unique
        trendChart.update()
      }
      if (engagementChart && data.user_engagement) {
        engagementChart.data.labels = data.user_engagement.map(i => i.duration_range)
        engagementChart.data.datasets[0].data = data.user_engagement.map(i => i.count)
        engagementChart.update()
      }
    })
    .catch(err => console.error('Analytics update error:', err))
}

onMounted(async () => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
  await nextTick()
  buildCharts()
  // Refresh live data every 30s
  pollTimer = setInterval(updateDashboard, 30000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (trendChart) trendChart.destroy()
  if (engagementChart) engagementChart.destroy()
})
</script>

<style scoped>
.live-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #24A148;
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
