<template>
  <FormModal title="Create User" @close="$emit('close')" :show-footer="false">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-control" v-model="form.name" required>
        <div v-if="errors.name" class="text-danger small">{{ errors.name }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Phone</label>
        <input type="text" class="form-control" v-model="form.phone" required>
        <div v-if="errors.phone" class="text-danger small">{{ errors.phone }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Address</label>
        <textarea class="form-control" v-model="form.address" rows="2"></textarea>
        <div v-if="errors.address" class="text-danger small">{{ errors.address }}</div>
      </div>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="submitting">
          {{ submitting ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </FormModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { toast } from '@/utils/toast'

const emit = defineEmits(['close', 'created'])

const form = reactive({ name: '', phone: '', address: '' })
const errors = ref({})
const submitting = ref(false)

function submit() {
  submitting.value = true
  errors.value = {}
  axios.post(route('admin.pos.create.user'), form)
    .then((res) => {
      if (res.data.status === 'success') {
        emit('created', res.data.user)
      }
    })
    .catch((err) => {
      errors.value = err.response?.data?.errors
        ? Object.fromEntries(Object.entries(err.response.data.errors).map(([k, v]) => [k, v[0]]))
        : {}
      if (!Object.keys(errors.value).length) {
        toast('error', 'Could not create the user. Please check the details and try again.')
      }
    })
    .finally(() => { submitting.value = false })
}
</script>

