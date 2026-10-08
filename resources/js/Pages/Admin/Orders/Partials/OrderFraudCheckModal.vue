<template>
  <FormModal title="Order Verification & Risk Assessment" size="md" @close="$emit('close')">
    <template #header>
      <div class="risk-header">
        <span class="risk-header-icon"><ShieldCheck :size="18" /></span>
        <div>
          <h2>Order Verification &amp; Risk Assessment</h2>
          <p>Order #{{ order.invoice_number || order.id }}</p>
        </div>
      </div>
    </template>

    <div v-if="loading" class="risk-loading" role="status">
      <span class="spinner-border spinner-border-sm"></span>
      Checking order records…
    </div>
    <div v-else-if="error" role="alert">
      <div class="alert alert-danger">{{ error }}</div>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="checkFraud">Try again</button>
    </div>
    <div v-else-if="assessment" class="risk-content">
      <div class="risk-banner" :class="assessment.risk">
        <component :is="assessment.risk === 'low' ? CircleCheck : ShieldAlert" :size="19" class="risk-banner-icon" />
        <div>
          <strong>{{ assessment.title }}</strong>
          <p>{{ assessment.description }}</p>
        </div>
        <span class="risk-level">{{ assessment.risk === 'medium' ? 'REVIEW' : assessment.risk.toUpperCase() }}</span>
      </div>

      <div class="risk-summary">
        <div class="risk-stat">
          <span class="risk-label">TOTAL ORDERS (PHONE)</span>
          <div><strong>{{ assessment.total_orders }}</strong> <span class="risk-unit">orders</span></div>
        </div>
        <div class="risk-stat">
          <span class="risk-label">CANCELLATIONS</span>
          <strong>{{ assessment.cancellations }}</strong>
        </div>
        <div class="risk-stat">
          <span class="risk-label">CUSTOMER PHONE</span>
          <strong class="risk-detail">{{ assessment.phone || 'Not recorded' }}</strong>
        </div>
        <div class="risk-stat">
          <span class="risk-label">CUSTOMER IP ADDRESS</span>
          <strong class="risk-detail">{{ assessment.ip_address || 'Not recorded' }}</strong>
        </div>
      </div>

      <div class="risk-checks">
        <h3>Automated Fraud Checks</h3>
        <ul>
          <li v-for="(check, index) in assessment.checks" :key="index" :class="check.status">
            <component :is="check.status === 'pass' ? CircleCheck : check.status === 'fail' ? CircleX : CircleHelp" :size="15" />
            <span>{{ check.label }}</span>
          </li>
        </ul>
      </div>
      <p class="risk-source">Based on {{ assessment.source }}. IP is from the saved customer profile.</p>
      <p v-if="!assessment.courier_verified" class="risk-provider-note">{{ assessment.courier_note }}</p>
    </div>

    <template #footer>
      <button type="button" class="risk-close" @click="$emit('close')">Close</button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { ShieldCheck, ShieldAlert, CircleCheck, CircleX, CircleHelp } from 'lucide-vue-next'

const props = defineProps({ order: { type: Object, required: true } })
defineEmits(['close'])
const loading = ref(true)
const assessment = ref(null)
const error = ref('')
let request = null

async function checkFraud() {
  request?.abort()
  request = new AbortController()
  loading.value = true
  error.value = ''
  assessment.value = null
  try {
    const response = await axios.get(route('admin.orders.fraudAssessment', props.order.id), { signal: request.signal, timeout: 15000 })
    if (!response.data?.risk || !Array.isArray(response.data.checks)) throw new Error('Unable to assess this order. Please try again.')
    assessment.value = response.data
  } catch (e) {
    if (!axios.isCancel(e)) error.value = e.response?.data?.message || 'Unable to assess this order. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(checkFraud)
onBeforeUnmount(() => request?.abort())
</script>

<style scoped>
.risk-header { display: flex; align-items: center; gap: 10px; }
.risk-header-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; border-radius: 12px; background: #d1fae5; color: #059669; }
.risk-header h2 { margin: 0; font-size: 14px; font-weight: 600; line-height: 1.4; color: #182238; }
.risk-header p { margin: 2px 0 0; font: 11px/1.4 monospace; color: #7285a3; overflow-wrap: anywhere; }
.risk-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 28px 0; color: #64748b; }
.risk-content { display: grid; gap: 18px; }
.risk-banner { display: flex; align-items: center; gap: 10px; padding: 16px; border: 1px solid #fde68a; border-radius: 16px; background: #fffbeb; color: #92400e; }
.risk-banner.low { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
.risk-banner.high { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
.risk-banner-icon { flex-shrink: 0; }
.risk-banner > div { min-width: 0; flex: 1; }
.risk-banner strong { display: block; font-size: 14px; line-height: 1.4; }
.risk-banner p { margin: 3px 0 0; font-size: 11px; line-height: 1.5; }
.risk-level { flex-shrink: 0; padding: 3px 10px; border-radius: 999px; background: #d97706; color: #fff; font-size: 12px; font-weight: 700; }
.low .risk-level { background: #059669; }
.high .risk-level { background: #dc2626; }
.risk-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.risk-stat { display: flex; flex-direction: column; gap: 5px; padding: 13px; background: #f7f9fc; border: 1px solid #edf2f8; border-radius: 12px; min-width: 0; }
.risk-label { color: #859bbb; font-size: 10px; line-height: 1.4; }
.risk-stat strong { color: #243247; font-size: 18px; line-height: 1.3; }
.risk-unit { color: #7285a3; font-size: 11px; }
.risk-stat .risk-detail { font: 600 12px/1.5 monospace; overflow-wrap: anywhere; }
.risk-checks { padding: 16px; border: 1px solid #edf2f8; border-radius: 16px; background: #f7f9fc; }
.risk-checks h3 { font-size: 12px; font-weight: 600; color: #334155; margin: 0 0 8px; }
.risk-checks ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
.risk-checks li { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; line-height: 1.5; color: #475569; }
.risk-checks li svg { flex-shrink: 0; margin-top: 2px; color: #d97706; }
.risk-checks li.pass svg { color: #10b981; }
.risk-checks li.fail svg { color: #dc2626; }
.risk-source, .risk-provider-note { margin: 0; font-size: 11px; line-height: 1.5; color: #64748b; }
.risk-provider-note { padding: 10px 12px; background: #fffbeb; border-radius: 8px; color: #92400e; }
.risk-close { border: 0; border-radius: 12px; padding: 8px 16px; background: #eef2f8; color: #334155; font-size: 12px; cursor: pointer; }
.risk-close:hover { background: #e2e8f0; }
@media (max-width: 380px) {
  .risk-banner { flex-wrap: wrap; padding: 12px; }
  .risk-level { margin-left: 29px; }
  .risk-summary { gap: 8px; }
  .risk-stat { padding: 10px; }
}
</style>
