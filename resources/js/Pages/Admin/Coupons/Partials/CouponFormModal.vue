<template>
  <FormModal :title="isEdit ? 'Edit Coupon' : 'Create Coupon'" size="lg" @close="$emit('close')">
    <form id="couponForm" class="row g-3" @submit.prevent="submit">
      <div class="col-md-6">
        <label for="code" class="form-label">Coupon Code</label>
        <div class="input-group">
          <input type="text" class="form-control" id="code" v-model="form.code" placeholder="Enter coupon code">
          <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="generateCode">Generate</button>
        </div>
        <span v-if="form.errors.code" class="text-danger small">{{ form.errors.code }}</span>
      </div>

      <div class="col-md-6">
        <label for="discount_amount" class="form-label">Discount Amount</label>
        <div class="input-group">
          <select v-model="form.discount_type" class="form-select" style="max-width: 140px;">
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
          <input type="text" class="form-control" id="discount_amount" v-model="form.discount_amount"
            placeholder="Enter discount amount">
        </div>
        <span v-if="form.errors.discount_amount" class="text-danger small">{{ form.errors.discount_amount }}</span>
      </div>

      <div class="col-md-6">
        <label for="valid_from" class="form-label">Valid From</label>
        <input type="date" class="form-control" id="valid_from" v-model="form.valid_from">
        <span v-if="form.errors.valid_from" class="text-danger small">{{ form.errors.valid_from }}</span>
      </div>

      <div class="col-md-6">
        <label for="expiry_date" class="form-label">Expiry Date</label>
        <input type="date" class="form-control" id="expiry_date" v-model="form.expiry_date">
        <span v-if="form.errors.expiry_date" class="text-danger small">{{ form.errors.expiry_date }}</span>
      </div>

      <div class="col-md-6">
        <label for="usage_limit" class="form-label">Usage Limit</label>
        <input type="number" min="1" class="form-control" id="usage_limit" v-model="form.usage_limit"
          placeholder="Enter usage limit">
        <span v-if="form.errors.usage_limit" class="text-danger small">{{ form.errors.usage_limit }}</span>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="submit" form="couponForm" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ isEdit ? 'Update Coupon' : 'Add Coupon' }}
      </button>
    </template>
  </FormModal>
</template>

<script setup>
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  coupon: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.coupon?.id)

const toDate = (v) => (v ? String(v).substring(0, 10) : '')

const form = useForm({
  code: props.coupon?.code ?? '',
  discount_type: props.coupon?.discount_type ?? 'fixed',
  discount_amount: props.coupon?.discount_amount ?? '',
  valid_from: toDate(props.coupon?.valid_from),
  expiry_date: toDate(props.coupon?.expiry_date),
  usage_limit: props.coupon?.usage_limit ?? '',
})

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  form.code = code
}

function submit() {
  const opts = {
    preserveScroll: true,
    onSuccess: () => {
      emit('saved')
      emit('close')
    },
  }
  if (isEdit.value) {
    form.patch(route('admin.coupons.update', props.coupon.id), opts)
  } else {
    form.post(route('admin.coupons.store'), opts)
  }
}
</script>
