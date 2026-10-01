<template>
  <AdminLayout>
    <div class="page-content">
      <div class="row justify-content-center mt-4">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <a :href="route('admin.account.income')" class="btn btn-fig-secondary btn-fig-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                </svg>
              </a>
              <p class="mb-0 text-center flex-grow-1">Add Credit</p>
            </div>

            <div v-if="$page.props.errors && Object.keys($page.props.errors).length" class="alert alert-danger mb-0">
              <ul class="mb-0">
                <li v-for="(error, key) in $page.props.errors" :key="key">{{ error }}</li>
              </ul>
            </div>

            <div class="card-body">
              <form :action="route('admin.account.store-debit')" method="POST" enctype="multipart/form-data" id="debit-form" @submit="handleSubmit">
                <input type="hidden" name="_token" :value="csrfToken">
                <div class="form-row">
                  <div class="col-md-12 mb-3">
                    <label for="date">Date</label>
                    <input type="date" class="form-control" id="date" name="transaction_date" placeholder="Select Date" required>
                    <div class="invalid-feedback">Please select a valid date.</div>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label for="purpose">Purpose</label>
                    <select class="form-select" id="purpose" name="purpose_id" required>
                      <option v-for="purpose in purposes" :key="purpose.id" :value="purpose.id">{{ purpose.name }}</option>
                    </select>
                    <div class="invalid-feedback">Please select a purpose.</div>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label for="amount">Amount</label>
                    <input type="text" class="form-control" id="amount" name="amount" placeholder="Enter Amount" required>
                    <div class="invalid-feedback">Please enter a valid amount.</div>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label for="comments">Comment</label>
                    <input type="text" class="form-control" id="comment" name="comments" placeholder="Optional Comment">
                  </div>
                  <div class="col-md-12 mb-3">
                    <label for="account_id">Debit From</label>
                    <select class="form-select" id="account_id" name="account_id" required>
                      <option v-for="account in accountTypes" :key="account.id" :value="account.id">{{ account.name }}</option>
                    </select>
                    <div class="invalid-feedback">Please select an account.</div>
                  </div>
                  <input type="hidden" name="transaction_type" value="credit">
                  <div class="col-md-12 mb-3">
                    <label for="document">Upload Document</label>
                    <input type="hidden" name="document_library_path" :value="documentLibraryPath ?? ''">
                    <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="showPicker = true">
                      <i class="admin-icon" data-lucide="upload"></i> Choose from Media Library
                    </button>
                    <div id="file-preview" class="form-text text-muted mt-2">No file selected</div>
                    <div class="form-text text-muted">Upload the document in the media library, then pick it here.</div>
                  </div>
                  <div class="col-md-12 mt-4">
                    <button type="submit" class="btn btn-fig-primary btn-fig-md btn-block" id="submit-btn" :disabled="submitting">Add Debit</button>
                    <div v-if="submitting" class="spinner-border text-primary d-inline-block" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MediaLibraryPickerModal v-if="showPicker" kind="document,image" @close="showPicker = false" @select="onLibrarySelected" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'

const props = defineProps({
  accountTypes: { type: Array, default: () => [] },
  purposes: { type: Array, default: () => [] },
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content
const submitting = ref(false)
const showPicker = ref(false)
const documentLibraryPath = ref(null)

function onLibrarySelected(item) {
  showPicker.value = false
  documentLibraryPath.value = item.url

  const filePreview = document.getElementById('file-preview')
  if (filePreview) filePreview.textContent = `From library: ${item.title || item.path}`
}

function handleSubmit(e) {
  e.preventDefault()
  submitting.value = true
  setTimeout(() => {
    e.target.submit()
  }, 2000)
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
  const dateInput = document.getElementById('date')
  if (dateInput && typeof window.flatpickr !== 'undefined') {
    window.flatpickr(dateInput, {
      altInput: true,
      altFormat: 'F j, Y',
      dateFormat: 'Y-m-d',
      defaultDate: new Date(),
      maxDate: 'today',
    })
  }
})
</script>
