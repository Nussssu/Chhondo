<template>
  <FormModal title="Consignment Status" :show-footer="false" @close="$emit('close')">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Fetching status...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <pre v-else class="mb-0">{{ JSON.stringify(data, null, 2) }}</pre>
  </FormModal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  order: { type: Object, required: true },
})
defineEmits(['close'])

const loading = ref(true)
const data = ref(null)
const error = ref('')

onMounted(() => {
  axios.get(route('admin.orders.consignment_status'), { params: { consignment_id: props.order.consignment_id } })
    .then((res) => { data.value = res.data })
    .catch((e) => { error.value = e.response?.data?.error ?? 'Unable to fetch consignment status.' })
    .finally(() => { loading.value = false })
})
</script>
