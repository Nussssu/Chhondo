<template>
  <FormModal :title="isEdit ? 'Edit Supplier' : 'Add Supplier'" @close="$emit('close')">
    <form id="supplierForm" class="row g-3" @submit.prevent="submit">
      <div class="col-md-6">
        <label for="supplier_name" class="form-label">Supplier Name</label>
        <input type="text" class="form-control" id="supplier_name" v-model="form.supplier_name"
          placeholder="Enter supplier name">
        <span v-if="form.errors.supplier_name" class="text-danger small">{{ form.errors.supplier_name }}</span>
      </div>
      <div class="col-md-6">
        <label for="company_name" class="form-label">Company Name</label>
        <input type="text" class="form-control" id="company_name" v-model="form.company_name"
          placeholder="Enter company name">
        <span v-if="form.errors.company_name" class="text-danger small">{{ form.errors.company_name }}</span>
      </div>
      <div class="col-md-12">
        <label for="company_phone" class="form-label">Company Phone</label>
        <input type="tel" class="form-control" id="company_phone" v-model="form.company_phone"
          placeholder="0178....">
        <span v-if="form.errors.company_phone" class="text-danger small">{{ form.errors.company_phone }}</span>
      </div>
      <div class="col-md-12">
        <label for="company_address" class="form-label">Company Address</label>
        <textarea class="form-control" id="company_address" rows="4" v-model="form.company_address"
          placeholder="Enter company address"></textarea>
        <span v-if="form.errors.company_address" class="text-danger small">{{ form.errors.company_address }}</span>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="submit" form="supplierForm" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ isEdit ? 'Update Supplier' : 'Create Supplier' }}
      </button>
    </template>
  </FormModal>
</template>

<script setup>
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  supplier: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.supplier?.id)

const form = useForm({
  supplier_name: props.supplier?.supplier_name ?? '',
  company_name: props.supplier?.company_name ?? '',
  company_phone: props.supplier?.company_phone ?? '',
  company_address: props.supplier?.company_address ?? '',
})

function submit() {
  const opts = {
    preserveScroll: true,
    onSuccess: () => {
      emit('saved')
      emit('close')
    },
  }

  if (isEdit.value) {
    form.patch(route('admin.suppliers.update', props.supplier.id), opts)
  } else {
    form.post(route('admin.suppliers.store'), opts)
  }
}
</script>
