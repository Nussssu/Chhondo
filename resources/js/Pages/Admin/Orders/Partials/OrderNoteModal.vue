<template>
  <FormModal title="Order Note" @close="$emit('close')">
    <textarea class="form-control" v-model="noteText" rows="4"></textarea>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Close</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="saving" @click="save">Save</button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved'])

const noteText = ref(props.order.note ?? '')
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await axios.post(route('admin.orders.ordernote'), { order_id: props.order.id, note: noteText.value })
    toast('success', 'Order note updated')
    emit('saved', noteText.value)
    emit('close')
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Failed to save note')
  } finally {
    saving.value = false
  }
}
</script>
