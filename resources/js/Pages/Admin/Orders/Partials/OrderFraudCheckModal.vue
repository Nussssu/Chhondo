<template>
  <FormModal title="Fraud Check" size="lg" :show-footer="false" @close="$emit('close')">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="data">
      <p class="fw-bold">Phone Number: {{ order.phone_number }}</p>
      <table class="table table-sm">
        <thead>
          <tr><th>Courier</th><th>Order</th><th>Delivery</th><th>Cancel</th><th>Delivery %</th></tr>
        </thead>
        <tbody>
          <tr v-for="[courier, info] in courierEntries" :key="courier">
            <td>{{ capitalize(courier) }}</td>
            <td>{{ info.total_parcels ?? info.total ?? 0 }}</td>
            <td>{{ info.delivered_parcels ?? info.delivered ?? 0 }}</td>
            <td>{{ info.returned ?? 0 }}</td>
            <td>{{ info.success_ratio ?? 0 }}%</td>
          </tr>
        </tbody>
      </table>
      <p class="text-success fw-bold text-center">
        Success Rate: {{ data.courierData?.total_courier?.success_rate ?? 0 }}%
      </p>
    </div>
  </FormModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { capitalize } from '@/utils/orderFormatting'

const props = defineProps({
  order: { type: Object, required: true },
})
defineEmits(['close'])

const loading = ref(true)
const data = ref(null)
const error = ref('')

const courierEntries = computed(() =>
  Object.entries(data.value?.courierData ?? {}).filter(([courier]) => courier !== 'total_courier')
)

onMounted(() => {
  axios.get(route('admin.orders.froudeCheckJson', props.order.phone_number))
    .then((res) => { data.value = res.data })
    .catch((e) => { error.value = e.response?.data?.error ?? 'Unable to check fraud status.' })
    .finally(() => { loading.value = false })
})
</script>
