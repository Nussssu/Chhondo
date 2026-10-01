<template>
  <FormModal
    title="Send to Steadfast"
    subtitle="A delivery request will be created with the courier"
    size="md"
    :show-footer="false"
    :busy="sending"
    @close="$emit('close')"
  >
    <!-- Already dispatched: show what exists rather than offering a re-send by
         default, since a second consignment means a second COD collection. -->
    <div v-if="alreadySent && !result" class="sc-warn">
      <AlertTriangle :size="18" />
      <div>
        <p class="mb-1"><b>This order has already been sent.</b></p>
        <p class="mb-0">Consignment {{ order.consignment_id }}. Sending again creates a second delivery.</p>
      </div>
    </div>

    <dl v-if="!result" class="sc-facts">
      <div><dt>Invoice</dt><dd>{{ order.invoice_number }}</dd></div>
      <div><dt>Recipient</dt><dd>{{ order.customer_name }}</dd></div>
      <div><dt>Phone</dt><dd :class="{ 'is-missing': !order.phone_number }">{{ order.phone_number || 'Missing' }}</dd></div>
      <div><dt>Address</dt><dd :class="{ 'is-missing': !order.address }">{{ order.address || 'Missing' }}</dd></div>
      <div class="sc-cod">
        <dt>COD to collect</dt>
        <dd>৳{{ codAmount }}<small v-if="isPrepaid" class="sc-prepaid"> — paid online, nothing to collect</small></dd>
      </div>
    </dl>

    <p v-if="!result && blockingReason" class="sc-blocked">{{ blockingReason }}</p>

    <div v-if="result" class="sc-result" :class="result.success ? 'is-ok' : 'is-error'">
      <component :is="result.success ? CheckCircle2 : XCircle" :size="18" />
      <div>
        <p class="mb-1">{{ result.message }}</p>
        <p v-if="result.consignment_id" class="mb-0 sc-result-meta">
          Consignment {{ result.consignment_id }}
          <a v-if="result.tracking_code" :href="result.tracking_code" target="_blank" rel="noopener">Track</a>
        </p>
      </div>
    </div>

    <div class="sc-actions">
      <button type="button" class="btn btn-fig-secondary btn-fig-md" :disabled="sending" @click="$emit('close')">
        {{ result?.success ? 'Done' : 'Cancel' }}
      </button>
      <button
        v-if="!result?.success"
        type="button"
        class="btn btn-fig-primary btn-fig-md flex-fill"
        :disabled="sending || !!blockingReason"
        @click="send"
      >
        <Truck :size="15" class="me-1" />
        {{ sending ? 'Sending…' : (alreadySent ? 'Send again anyway' : 'Confirm and send') }}
      </button>
    </div>
  </FormModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { Truck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-vue-next'

const props = defineProps({
  order: { type: Object, required: true },
})
const emit = defineEmits(['close', 'sent'])

const sending = ref(false)
const result = ref(null)

const alreadySent = computed(() => Boolean(props.order.consignment_id))

const isPrepaid = computed(() => props.order.payment_type === 'online' && props.order.payment_status === 'paid')

// Order::courierCollectAmount(), computed on the server — the exact figure sent
// as cod_amount, so the operator confirms what the courier will collect.
const codAmount = computed(() => Number(props.order.courier_collect_amount ?? 0).toFixed(2))

const blockingReason = computed(() => {
  if (!props.order.phone_number) return 'This order needs a phone number before it can be sent.'
  if (!props.order.address) return 'This order needs a delivery address before it can be sent.'
  return null
})

async function send() {
  sending.value = true
  result.value = null

  try {
    const { data } = await axios.post(
      route('admin.orders.steadfast', props.order.id),
      { force: alreadySent.value }
    )
    result.value = data
    if (data.success) emit('sent', data)
  } catch (error) {
    result.value = {
      success: false,
      message: error.response?.data?.message ?? 'Could not reach Steadfast. Please try again.',
    }
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.sc-warn, .sc-result {
  display: flex; gap: 10px; align-items: flex-start;
  border-radius: 8px; padding: 10px 12px; margin-bottom: 14px; font-size: .84rem;
}
.sc-warn { background: #fff4e0; color: #8a5a00; }
.sc-result.is-ok { background: #e4f2e4; color: #2C5015; }
.sc-result.is-error { background: #fdecea; color: #b71c1c; }
.sc-result-meta { font-size: .78rem; opacity: .85; }
.sc-result-meta a { margin-left: 8px; color: inherit; }

.sc-facts { margin: 0 0 14px; font-size: .86rem; }
.sc-facts > div {
  display: flex; justify-content: space-between; gap: 14px;
  padding: 7px 0; border-bottom: 1px dashed #eceff1;
}
.sc-facts > div:last-child { border-bottom: 0; }
.sc-facts dt { color: #90a4ae; font-weight: 500; flex-shrink: 0; }
.sc-facts dd { margin: 0; color: #37474f; font-weight: 600; text-align: right; }
.sc-facts dd.is-missing { color: #c62828; }
.sc-cod dt, .sc-cod dd { font-size: .95rem; }
.sc-cod dd { color: #356019; font-weight: 800; }
.sc-prepaid { font-weight: 600; font-size: .8rem; color: #6b7563; }

.sc-blocked {
  background: #fdecea; color: #b71c1c; border-radius: 8px;
  padding: 8px 12px; font-size: .8rem; margin-bottom: 14px;
}

.sc-actions { display: flex; gap: 8px; }
</style>
