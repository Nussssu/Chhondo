<template>
  <FormModal title="Export Orders to CSV" @close="$emit('close')">
    <p class="text-muted small mb-2">
      All statuses are selected by default, which exports every order. Uncheck any status you want to leave out.
    </p>

    <div class="form-check mb-2 pb-2 border-bottom">
      <input class="form-check-input" type="checkbox" id="export-select-all" :checked="allSelected" @change="toggleAll">
      <label class="form-check-label fw-bold" for="export-select-all">Select All</label>
    </div>

    <div class="form-check" v-for="opt in statusOptions" :key="opt.value">
      <input class="form-check-input" type="checkbox" :id="'export-status-' + opt.value" v-model="selected" :value="opt.value">
      <label class="form-check-label" :for="'export-status-' + opt.value">{{ opt.label }}</label>
    </div>

    <div class="mt-3 pt-3 border-top">
      <label class="form-label small mb-2">Date range <span class="text-muted">(optional)</span></label>
      <div class="d-flex gap-2">
        <div class="flex-fill">
          <label class="form-label small text-muted mb-1" for="export-date-from">From</label>
          <input type="date" id="export-date-from" class="form-control form-control-sm" v-model="dateFrom" :max="dateTo || undefined">
        </div>
        <div class="flex-fill">
          <label class="form-label small text-muted mb-1" for="export-date-to">To</label>
          <input type="date" id="export-date-to" class="form-control form-control-sm" v-model="dateTo" :min="dateFrom || undefined">
        </div>
      </div>
    </div>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="!selected.length" @click="confirmExport">
        <i class="admin-icon me-1" data-lucide="file-spreadsheet"></i> Export CSV
      </button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  // 'pos' restricts the export to counter sales; omitted means storefront.
  scope: { type: String, default: null },
})

const emit = defineEmits(['close'])

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processed', label: 'Processed' },
  { value: 'on delivery', label: 'On Delivery' },
  { value: 'shipped', label: 'Partial Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
  { value: 'incomplete', label: 'Incomplete' },
]

const selected = ref(statusOptions.map((o) => o.value))
const dateFrom = ref('')
const dateTo = ref('')

const allSelected = computed(() => selected.value.length === statusOptions.length)

function toggleAll(e) {
  selected.value = e.target.checked ? statusOptions.map((o) => o.value) : []
}

function confirmExport() {
  const params = { statuses: selected.value }
  if (props.scope) params.scope = props.scope
  if (dateFrom.value) params.date_from = dateFrom.value
  if (dateTo.value) params.date_to = dateTo.value
  window.location.href = route('admin.orders.export', params)
  emit('close')
}
</script>
