<template>
  <AdminLayout>
    <div class="page-content">
      <div class="container-fluid">

        <!-- Page Title -->
        <div class="row mb-3">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 class="mb-sm-0">Promotion SMS</h4>
              <div class="page-title-right">
                <button type="button" class="btn btn-fig-primary btn-fig-sm" data-bs-toggle="modal" data-bs-target="#sendSmsModal">
                  <Send :size="16" class="me-1" /> Send New SMS
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SMS History Table -->
        <div class="row">
          <div class="col-lg-12">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="card-title mb-0">SMS Sending History</h5>
              </div>
              <div class="card-body">
                <div class="table-compact-wrapper">
                  <table class="table table-compact align-middle">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Campaign Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Total Numbers</th>
                        <th scope="col">SMS Content</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="promotions.data && promotions.data.length > 0">
                        <tr v-for="(promo, i) in promotions.data" :key="promo.id">
                          <td>{{ i + 1 }}</td>
                          <td>{{ promo.campaign_title }}</td>
                          <td class="text-capitalize">{{ (promo.category || '').replace('_', ' ') }}</td>
                          <td>{{ promo.numbers ? promo.numbers.length : 0 }}</td>
                          <td>{{ promo.sms ? promo.sms.substring(0, 60) : '' }}</td>
                          <td>
                            <span v-if="promo.status === 'sent'" class="badge bg-soft-success">Sent</span>
                            <span v-else-if="promo.status === 'pending'" class="badge bg-soft-warning">Pending</span>
                            <span v-else-if="promo.status === 'no_numbers'" class="badge bg-soft-warning">No numbers</span>
                            <span v-else class="badge bg-soft-danger">Failed</span>
                          </td>
                          <td>{{ formatDate(promo.created_at) }}</td>
                        </tr>
                      </template>
                      <tr v-else>
                        <td colspan="7" class="text-center text-muted">No SMS history found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Send SMS Modal -->
    <div class="modal fade" id="sendSmsModal" tabindex="-1" aria-labelledby="sendSmsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sendSmsModalLabel">Compose and Send Promotional SMS</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Validation Errors -->
            <div id="validation-errors" class="alert alert-danger" v-if="validationErrors.length > 0">
              <div v-for="err in validationErrors" :key="err">{{ err }}</div>
            </div>

            <form id="sendSmsForm" @submit.prevent="sendSms">
              <input type="hidden" name="_token" :value="csrfToken">

              <!-- Targeting Options -->
              <div class="mb-3">
                <label class="form-label fw-bold">1. Choose Target Audience</label>
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="target_type" id="targetCategory" value="category" v-model="targetType">
                    <label class="form-check-label" for="targetCategory">Category Wise</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="target_type" id="targetCustomer" value="customer" v-model="targetType">
                    <label class="form-check-label" for="targetCustomer">Customer Wise</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="target_type" id="targetProduct" value="product" v-model="targetType">
                    <label class="form-check-label" for="targetProduct">Product Wise</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="target_type" id="targetCustomerType" value="customer_type" v-model="targetType">
                    <label class="form-check-label" for="targetCustomerType">Customer Type Wise</label>
                  </div>
                </div>
              </div>

              <!-- Conditional Inputs -->
              <div class="mb-3">
                <!-- Category Wise -->
                <div v-if="targetType === 'category'">
                  <label for="category-select" class="form-label">Select Product Categories</label>
                  <select id="category-select" name="categories[]" multiple class="form-select">
                    <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                </div>

                <!-- Customer Wise -->
                <div v-if="targetType === 'customer'">
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" name="all_customers" id="selectAllCustomersCheckbox" v-model="allCustomers">
                    <label class="form-check-label" for="selectAllCustomersCheckbox">Send to All Customers</label>
                  </div>
                  <div v-if="!allCustomers">
                    <label for="customer-select" class="form-label">Select Specific Customers</label>
                    <select id="customer-select" name="customers[]" multiple class="form-select">
                      <option v-for="item in users" :key="item.id" :value="item.id">
                        {{ item.name }} ({{ item.phone || (item.address ? item.address.phone : '') }})
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Product Wise -->
                <div v-if="targetType === 'product'">
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" name="all_products" id="selectAllProductsCheckbox" v-model="allProducts">
                    <label class="form-check-label" for="selectAllProductsCheckbox">Send to users who bought from All Products</label>
                  </div>
                  <div v-if="!allProducts">
                    <label for="product-select" class="form-label">Select Specific Products</label>
                    <select id="product-select" name="products[]" multiple class="form-select">
                      <option v-for="item in products" :key="item.id" :value="item.id">{{ item.product_name }} ({{ item.product_code }})</option>
                    </select>
                  </div>
                </div>

                <!-- Customer Type Wise -->
                <div v-if="targetType === 'customer_type'">
                  <label for="customer-type-select" class="form-label">Select Customer Type</label>
                  <select id="customer-type-select" class="form-select" name="customer_type">
                    <option value="" selected disabled>Choose a type...</option>
                    <option value="new">New Customers</option>
                    <option value="regular">Regular Customers</option>
                    <option value="vip">VIP Customers</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">2. Campaign name</label>
                <input type="text" class="form-control" name="campaign_name" v-model="campaignName">
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">3. Compose SMS</label>
                <textarea class="form-control" name="message" rows="4" v-model="smsMessage"
                  placeholder="Enter your SMS content here..."></textarea>
                <div class="form-text text-end">{{ smsMessage.length }} characters</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-sm" :disabled="sending" @click="sendSms">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="sending"></span>
              Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { toast } from '@/utils/toast'
import { Send } from 'lucide-vue-next'

const props = defineProps({
  categories: Array,
  users: Array,
  products: Array,
  promotions: Object
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content
const targetType = ref('category')
const allCustomers = ref(false)
const allProducts = ref(false)
const campaignName = ref('')
const smsMessage = ref('')
const sending = ref(false)
const validationErrors = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function sendSms() {
  validationErrors.value = []
  const errors = []

  if (smsMessage.value.trim() === '') errors.push('SMS message cannot be empty.')
  if (campaignName.value.trim() === '') errors.push('Campaign name cannot be empty.')

  if (errors.length > 0) {
    validationErrors.value = errors
    return
  }

  sending.value = true

  const formData = new FormData(document.getElementById('sendSmsForm'))

  fetch(route('sms.promotion.send'), {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      'Accept': 'application/json'
    },
    body: formData
  })
    .then(r => r.json())
    .then(data => {
      if (data.status || data.success) {
        const modal = window.bootstrap?.Modal?.getInstance(document.getElementById('sendSmsModal'))
        if (modal) modal.hide()
        // A native alert() blocks the page and looks nothing like the rest of
        // the panel; every other save reports itself through the toast host.
        toast('success', data.message || 'SMS sent.')
        // Reload the campaign list in place rather than reloading the browser,
        // which would discard the toast before it could be read.
        router.reload({ only: ['promotions'] })
      } else {
        const message = data.message || 'Something went wrong.'
        validationErrors.value = [message]
        toast('error', message)
      }
    })
    .catch(err => {
      console.error(err)
      validationErrors.value = ['An unexpected error occurred.']
      toast('error', 'An unexpected error occurred.')
    })
    .finally(() => {
      sending.value = false
    })
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
