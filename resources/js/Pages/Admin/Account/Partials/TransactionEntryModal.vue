<template>
  <FormModal :title="isIncome ? 'Add Income' : 'Add Expense'" :show-footer="false" :busy="form.processing || showPicker" :dirty="form.isDirty" @close="$emit('close')">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label for="transaction-entry-date" class="form-label">Date</label>
        <input id="transaction-entry-date" v-model="form.transaction_date" type="date" :max="today" class="form-control" required />
        <p v-if="form.errors.transaction_date" class="entry-error">{{ form.errors.transaction_date }}</p>
      </div>
      <div class="mb-3">
        <label for="transaction-entry-purpose" class="form-label">Purpose</label>
        <select id="transaction-entry-purpose" v-model="form.purpose_id" class="form-select" required>
          <option value="" disabled>Select purpose</option>
          <option v-for="purpose in purposes" :key="purpose.id" :value="purpose.id">{{ purpose.name }}</option>
        </select>
        <p v-if="form.errors.purpose_id" class="entry-error">{{ form.errors.purpose_id }}</p>
      </div>
      <div class="mb-3">
        <label for="transaction-entry-amount" class="form-label">Amount</label>
        <input id="transaction-entry-amount" v-model="form.amount" type="number" inputmode="decimal" min="0" step="0.01" class="form-control" placeholder="Enter amount" required />
        <p v-if="form.errors.amount" class="entry-error">{{ form.errors.amount }}</p>
      </div>
      <div class="mb-3">
        <label for="transaction-entry-account" class="form-label">{{ isIncome ? 'Credit to' : 'Debit from' }}</label>
        <select id="transaction-entry-account" v-model="form.account_id" class="form-select" required>
          <option value="" disabled>Select account</option>
          <option v-for="account in accountTypes" :key="account.id" :value="account.id">{{ account.name }}</option>
        </select>
        <p v-if="form.errors.account_id" class="entry-error">{{ form.errors.account_id }}</p>
      </div>
      <div class="mb-3">
        <label for="transaction-entry-comments" class="form-label">Comment</label>
        <textarea id="transaction-entry-comments" v-model="form.comments" rows="2" maxlength="255" class="form-control" placeholder="Optional comment"></textarea>
        <p v-if="form.errors.comments" class="entry-error">{{ form.errors.comments }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label">Document</label>
        <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showPicker = true">Choose from Media Library</button>
        <p class="small text-muted mt-2 mb-0">{{ documentName || 'No document selected' }}</p>
        <p v-if="form.errors.document_library_path" class="entry-error">{{ form.errors.document_library_path }}</p>
      </div>
      <p v-if="form.errors._token" class="entry-error">{{ form.errors._token }}</p>
      <div class="d-flex justify-content-end gap-2 pt-3 border-top">
        <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">{{ form.processing ? 'Saving…' : (isIncome ? 'Add income' : 'Add expense') }}</button>
      </div>
    </form>
    <MediaLibraryPickerModal v-if="showPicker" kind="document,image" @close="showPicker = false" @select="selectDocument" />
  </FormModal>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'

const props = defineProps({
  type: { type: String, required: true, validator: value => ['credit', 'debit'].includes(value) },
  accountTypes: { type: Array, default: () => [] },
  purposes: { type: Array, default: () => [] },
})
const emit = defineEmits(['close'])
const isIncome = computed(() => props.type === 'credit')
const currentDate = new Date()
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
const showPicker = ref(false)
const documentName = ref('')
let active = true
onBeforeUnmount(() => { active = false })
watch(showPicker, async visible => {
  if (!visible) {
    await nextTick()
    if (active && typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }
})
const form = useForm({
  _token: typeof document === 'undefined' ? '' : document.querySelector('meta[name="csrf-token"]')?.content ?? '',
  transaction_date: today,
  purpose_id: '', amount: '', comments: '', account_id: '',
  transaction_type: props.type,
  document_library_path: null,
})
function selectDocument(item) {
  form.document_library_path = item.url
  documentName.value = item.title || item.path || item.url
  showPicker.value = false
}
function submit() {
  form.post(route('admin.account.store-debit'), {
    preserveScroll: true,
    onSuccess: () => emit('close'),
  })
}
</script>

<style scoped>
.entry-error { margin: 5px 0 0; color: var(--st-danger, #b42318); font-size: 12px; }
</style>
