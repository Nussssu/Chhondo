<template>
  <AdminLayout>
    <div class="page-content">
      <div class="container-fluid">
        <!-- Page Title -->
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 class="mb-sm-0">Purchase Details</h4>
            </div>
          </div>
        </div>

        <!-- Purchase Information -->
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                  <i class="ri-shopping-cart-line me-2"></i>Purchase Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Purchase ID:</label>
                      <span class="ms-2">#{{ purchase.id }}</span>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-bold">Purchase Date:</label>
                      <span class="ms-2">{{ formatDate(purchase.created_at) }}</span>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-bold">Status:</label>
                      <span v-if="purchase.purchasing_paid > 0 && purchase.purchasing_due > 0" class="badge bg-warning ms-2">Partial</span>
                      <span v-else-if="purchase.purchasing_paid > 0 && purchase.purchasing_due <= 0" class="badge bg-success ms-2">Paid</span>
                      <span v-else class="badge bg-danger ms-2">Due</span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Supplier:</label>
                      <span class="ms-2">{{ purchase.supplier?.supplier_name || 'N/A' }}</span>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-bold">Reference:</label>
                      <span class="ms-2">{{ purchase.reference || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products List -->
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="ri-product-hunt-line me-2"></i>Products in this Purchase
                </h5>
                <span class="badge bg-light text-dark">{{ items.length }} item{{ items.length === 1 ? '' : 's' }}</span>
              </div>
              <div class="card-body">
                <div v-if="items.length > 0" class="table-responsive">
                  <table class="table table-hover table-bordered align-middle">
                    <thead class="table-dark">
                      <tr>
                        <th style="width: 48px;">#</th>
                        <th>Item</th>
                        <th style="width: 130px;">Code</th>
                        <th style="width: 90px;">Qty</th>
                        <th style="width: 130px;">Purchase price</th>
                        <th style="width: 130px;">Selling price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- The items recorded on the purchase itself. These are
                           typed by hand and are not catalogue products, so there
                           is no image or variant to show. -->
                      <tr v-for="(item, index) in items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.product_code || '—' }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>৳{{ Number(item.purchasing_price || 0).toFixed(2) }}</td>
                        <td>৳{{ Number(item.price || 0).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="!items.length">
                        <td colspan="6" class="text-center text-muted py-3">No items recorded.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="text-center py-5">
                  <i class="ri-inbox-line display-4 text-muted"></i>
                  <h5 class="mt-3 text-muted">No Products Found</h5>
                  <p class="text-muted">No items were recorded on this purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History Section -->
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="ri-history-line me-2"></i>Payment History
                </h5>
                <span class="badge bg-light text-dark">{{ paymentHistory.purchase_info?.count_payments }} Payments</span>
              </div>
              <div class="card-body">
                <!-- Payment Summary -->
                <div class="row mb-4">
                  <div class="col-md-3">
                    <div class="text-center p-3 bg-light rounded">
                      <h6 class="mb-1">Total Amount</h6>
                      <h4 class="text-primary mb-0">৳{{ formatNumber(paymentHistory.purchase_info?.purchasing_price) }}</h4>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 bg-light rounded">
                      <h6 class="mb-1">Total Paid</h6>
                      <h4 class="text-success mb-0">৳{{ formatNumber(paymentHistory.purchase_info?.total_paid) }}</h4>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 bg-light rounded">
                      <h6 class="mb-1">Due Amount</h6>
                      <h4 class="text-danger mb-0">৳{{ formatNumber(paymentHistory.purchase_info?.due_amount) }}</h4>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 bg-light rounded">
                      <h6 class="mb-1">Payment Status</h6>
                      <span :class="`badge fs-6 ${paymentStatusBadge}`">{{ paymentStatusLabel }}</span>
                    </div>
                  </div>
                </div>

                <template v-if="paymentHistory.all_payments?.length > 0 || purchase.purchasing_paid > 0">
                  <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle">
                      <thead class="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Payment Date</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Initial Payment Row -->
                        <tr v-if="purchase.purchasing_paid > 0">
                          <td>1</td>
                          <td><span class="fw-bold">{{ formatDateShort(purchase.created_at) }}</span></td>
                          <td><span class="fw-bold text-success">৳{{ formatNumber(initialPayment) }}</span></td>
                          <td><span class="badge bg-info">Initial Payment</span></td>
                          <td><small class="text-muted">{{ formatDate(purchase.created_at) }}</small></td>
                        </tr>
                        <!-- Other Payments -->
                        <tr v-for="(payment, index) in paymentHistory.all_payments" :key="payment.id">
                          <td>{{ purchase.purchasing_paid > 0 ? index + 2 : index + 1 }}</td>
                          <td><span class="fw-bold">{{ formatDateShort(payment.payment_date) }}</span></td>
                          <td><span class="fw-bold text-success">৳{{ formatNumber(payment.payment_amount) }}</span></td>
                          <td>
                            <span :class="`badge ${methodBadge(payment.payment_method)}`">
                              {{ payment.payment_method }}
                            </span>
                          </td>
                          <td><small class="text-muted">{{ formatDate(payment.created_at) }}</small></td>
                        </tr>
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <th colspan="2" class="text-end">Total Payments:</th>
                          <th class="text-success">৳{{ formatNumber(totalPayments) }}</th>
                          <th colspan="3"></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </template>
                <div v-else class="text-center py-5">
                  <i class="ri-wallet-line display-4 text-muted"></i>
                  <h5 class="mt-3 text-muted">No Payment History</h5>
                  <p class="text-muted">No payments have been made for this purchase yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center">
                <a :href="route('admin.purchase.index')" class="btn btn-fig-secondary btn-fig-md me-2">
                  <i class="ri-arrow-left-line me-1"></i>Back to Purchases
                </a>
                <button class="btn btn-fig-primary btn-fig-md me-2" @click="printPurchase">
                  <i class="ri-printer-line me-1"></i>Print Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  purchase: Object,
  suppliers: Array,
  paymentHistory: Object
})

const items = computed(() => props.purchase?.products_data ?? [])

const initialPayment = computed(() => {
  const totalFromPayments = (props.paymentHistory?.all_payments || [])
    .reduce((acc, p) => acc + parseFloat(p.payment_amount || 0), 0)
  return parseFloat(props.purchase?.purchasing_paid || 0) - totalFromPayments
})

const totalPayments = computed(() => {
  return parseFloat(props.purchase?.purchasing_paid || 0)
})

const paymentStatusBadge = computed(() => {
  const due = props.purchase?.purchasing_due
  const paid = props.purchase?.purchasing_paid
  if (due == 0) return 'bg-success'
  if (paid == 0) return 'bg-danger'
  return 'bg-warning'
})

const paymentStatusLabel = computed(() => {
  const due = props.purchase?.purchasing_due
  const paid = props.purchase?.purchasing_paid
  if (due == 0) return 'Fully Paid'
  if (paid == 0) return 'Due'
  return 'Partially Paid'
})

function formatNumber(val) {
  return parseFloat(val || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' })
}

function methodBadge(method) {
  const m = (method || '').toLowerCase()
  if (m === 'cash') return 'bg-success'
  if (m === 'bank' || m === 'bank_transfer') return 'bg-primary'
  if (m === 'card' || m === 'credit_card') return 'bg-info'
  if (m === 'check') return 'bg-warning'
  return 'bg-secondary'
}

function printPurchase() {
  window.print()
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el))
})
</script>

<style scoped>
.card { border: none; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.2s ease-in-out; }
.card:hover { transform: translateY(-3px); }
.card-header { border-radius: 10px 10px 0 0; padding: 1.25rem; }
.product-image { transition: transform 0.3s ease; border-radius: 5px; border: 1px solid #dee2e6; }
.product-image:hover { transform: scale(1.1); }
</style>
