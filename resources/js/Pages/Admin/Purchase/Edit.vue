<template>
  <AdminLayout>
    <div class="page-content">
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row mb-4 align-items-center">
          <div class="col">
            <h2 class="mb-0">Purchase Products</h2>
          </div>
          <div class="col-auto">
            <button type="submit" form="purchaseProductsForm" class="btn btn-fig-primary btn-fig-md" id="submitBtn">
              <i class="admin-icon me-2" data-lucide="save"></i>Save All Changes
            </button>
          </div>
        </div>

        <!-- Mini Toast -->
        <div id="miniToast" class="mini-toast"></div>

        <!-- Main Form -->
        <form id="purchaseProductsForm" :action="route('admin.purchase.update.purchase')" method="POST">
          <input type="hidden" name="_token" :value="csrfToken">
          <input type="hidden" name="_method" value="PUT">
          <input type="hidden" name="purchase_id" :value="purchase.id">

          <!-- Products List -->
          <div class="row">
            <div v-for="product in purchases" :key="product.id" class="col-12">
              <div class="card product-card mb-4">
                <div class="card-header d-flex align-items-center">
                  <img :src="product.featured_image || '/placeholder.svg'" :alt="product.product_name" class="product-image me-3" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'">
                  <div>
                    <h5 class="mb-1">{{ product.product_name }}</h5>
                    <div class="d-flex align-items-center">
                      <span class="badge bg-secondary me-2">{{ product.product_code }}</span>
                      <span class="text-muted small">Base Price: ৳{{ product.price }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-fixed mb-0 table-striped">
                      <thead>
                        <tr>
                          <th width="30%">Attribute</th>
                          <th width="20%">Price</th>
                          <th width="20%">Quantity</th>
                          <th width="15%">Status</th>
                          <th width="15%">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Base product (no attributes) -->
                        <template v-if="getCombinations(product).length === 0">
                          <tr :id="`row-${product.id}-base`">
                            <td>
                              <span class="combination-badge">No Varient</span>
                              <div class="small text-muted mt-1">ID: {{ product.id }}</div>
                            </td>
                            <td :id="`price-display-${product.id}-base`">৳{{ product.price }}</td>
                            <td :id="`qty-display-${product.id}-base`">{{ product.quantity }}</td>
                            <td>
                              <span class="status-badge" :class="product.status === 'Published' ? 'status-enabled' : 'status-disabled'">
                                {{ product.status }}
                              </span>
                            </td>
                            <td>
                              <button type="button" class="btn btn-fig-tertiary btn-fig-sm edit-btn"
                                :data-product-id="product.id" data-combination-id="base">
                                <i class="admin-icon" data-lucide="pencil"></i> Edit
                              </button>
                            </td>
                          </tr>
                          <tr :id="`form-row-${product.id}-base`" class="d-none">
                            <td colspan="5">
                              <div class="p-3 border-top">
                                <div class="row g-3">
                                  <div class="col-md-4">
                                    <label class="form-label">Price</label>
                                    <input type="number" step="0.01" class="form-control"
                                      :name="`base[${product.id}][price]`"
                                      :value="product.purchasing_price" required readonly>
                                  </div>
                                  <div class="col-md-4">
                                    <label class="form-label">Quantity</label>
                                    <input type="number" class="form-control"
                                      :name="`base[${product.id}][quantity]`"
                                      :value="product.quantity" required>
                                  </div>
                                  <div class="col-md-4">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" :name="`base[${product.id}][status]`" required>
                                      <option value="Published" :selected="product.status === 'Published'">Published</option>
                                      <option value="Draft" :selected="product.status === 'Draft'">Draft</option>
                                    </select>
                                  </div>
                                  <div class="col-12 text-end">
                                    <button type="button" class="btn btn-fig-secondary btn-fig-sm cancel-btn"
                                      :data-product-id="product.id" data-combination-id="base">Cancel</button>
                                    <button type="button" class="btn btn-fig-primary btn-fig-sm save-btn"
                                      :data-product-id="product.id" data-combination-id="base">Save Changes</button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </template>

                        <!-- Combinations -->
                        <template v-else>
                          <template v-for="(combination, combinationKey) in getCombinationsMap(product)" :key="combinationKey">
                            <tr :id="`row-${product.id}-${combination.formKey}`">
                              <td>
                                <span class="combination-badge">{{ combination.name }}</span>
                                <div class="small text-muted mt-1">ID: {{ combination.id || 'Single Attribute' }}</div>
                              </td>
                              <td :id="`price-display-${product.id}-${combination.formKey}`">
                                ৳{{ combination.purchasing_price }}
                              </td>
                              <td :id="`qty-display-${product.id}-${combination.formKey}`">
                                {{ combination.quantity }}
                              </td>
                              <td>
                                <span class="status-badge" :class="combination.status === 'enable' ? 'status-enabled' : 'status-disabled'">
                                  {{ combination.status }}
                                </span>
                              </td>
                              <td>
                                <button type="button" class="btn btn-fig-tertiary btn-fig-sm edit-btn"
                                  :data-product-id="product.id" :data-combination-id="combination.formKey">
                                  <i class="admin-icon" data-lucide="pencil"></i> Edit
                                </button>
                              </td>
                            </tr>
                            <tr :id="`form-row-${product.id}-${combination.formKey}`" class="d-none">
                              <td colspan="5">
                                <div class="p-3 border-top">
                                  <div class="row g-3">
                                    <div class="col-md-4">
                                      <label class="form-label">Price</label>
                                      <input type="number" step="0.01" class="form-control"
                                        :name="`combinations[${product.id}][${combination.formKey}][purchasing_price]`"
                                        :value="combination.purchasing_price" required readonly>
                                    </div>
                                    <div class="col-md-4">
                                      <label class="form-label">Quantity</label>
                                      <input type="number" class="form-control"
                                        :name="`combinations[${product.id}][${combination.formKey}][quantity]`"
                                        :value="combination.quantity" required>
                                    </div>
                                    <div class="col-md-4">
                                      <label class="form-label">Status</label>
                                      <select class="form-select"
                                        :name="`combinations[${product.id}][${combination.formKey}][status]`" required>
                                        <option value="enable" :selected="combination.status === 'enable'">Enabled</option>
                                        <option value="disable" :selected="combination.status === 'disable'">Disabled</option>
                                      </select>
                                    </div>
                                    <input v-for="attrId in combination.attribute_ids" :key="attrId"
                                      type="hidden"
                                      :name="`combinations[${product.id}][${combination.formKey}][attribute_ids][]`"
                                      :value="attrId">
                                    <div class="col-12 text-end">
                                      <button type="button" class="btn btn-fig-secondary btn-fig-sm cancel-btn"
                                        :data-product-id="product.id" :data-combination-id="combination.formKey">Cancel</button>
                                      <button type="button" class="btn btn-fig-primary btn-fig-sm save-btn"
                                        :data-product-id="product.id" :data-combination-id="combination.formKey">Save Changes</button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  purchase: Object,
  purchases: Array,
  suppliers: Array
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

function getCombinations(product) {
  if (!product.product_attributes || product.product_attributes.length === 0) return []
  return product.product_attributes
}

function getCombinationsMap(product) {
  const combinations = {}
  for (const attr of (product.product_attributes || [])) {
    const key = attr.combination_id ?? `null_${attr.attribute_option_id}`
    if (!combinations[key]) {
      combinations[key] = {
        id: attr.combination_id,
        formKey: attr.combination_id ?? key,
        attributes: [],
        purchasing_price: attr.purchasing_price,
        quantity: attr.quantity,
        status: attr.status,
        attribute_ids: [],
        name: ''
      }
    }
    combinations[key].attribute_ids.push(attr.id)
    combinations[key].attributes.push(attr)
  }
  // Build names
  for (const key in combinations) {
    combinations[key].name = combinations[key].attributes
      .map(a => a.attribute_option?.name || '')
      .join(' + ')
  }
  return combinations
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  const toast = document.getElementById('miniToast')
  const submitBtn = document.getElementById('submitBtn')
  const form = document.getElementById('purchaseProductsForm')

  const showToast = (message, type = 'success') => {
    toast.textContent = message
    toast.className = `mini-toast ${type}`
    toast.style.display = 'block'
    setTimeout(() => (toast.style.display = 'none'), 2000)
  }

  const toggleRows = (productId, combinationId, showForm) => {
    const displayRow = document.getElementById(`row-${productId}-${combinationId}`)
    const formRow = document.getElementById(`form-row-${productId}-${combinationId}`)
    if (displayRow && formRow) {
      displayRow.classList.toggle('d-none', showForm)
      formRow.classList.toggle('d-none', !showForm)
    }
  }

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId, combinationId } = btn.dataset
      toggleRows(productId, combinationId, true)
    })
  })

  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId, combinationId } = btn.dataset
      toggleRows(productId, combinationId, false)
    })
  })

  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId, combinationId } = btn.dataset
      const formRow = document.getElementById(`form-row-${productId}-${combinationId}`)
      if (!formRow) return

      const isBase = combinationId === 'base'
      const priceInput = formRow.querySelector(
        isBase ? `input[name="base[${productId}][price]"]` : `input[name="combinations[${productId}][${combinationId}][purchasing_price]"]`
      )
      const quantityInput = formRow.querySelector(
        isBase ? `input[name="base[${productId}][quantity]"]` : `input[name="combinations[${productId}][${combinationId}][quantity]"]`
      )
      const statusSelect = formRow.querySelector(
        isBase ? `select[name="base[${productId}][status]"]` : `select[name="combinations[${productId}][${combinationId}][status]"]`
      )

      const inputs = [priceInput, quantityInput, statusSelect]
      const isValid = inputs.every(input => {
        if (!input || !input.value.trim()) {
          if (input) input.classList.add('is-invalid')
          return false
        }
        input.classList.remove('is-invalid')
        return true
      })

      if (!isValid) {
        showToast('Please fill all required fields!', 'error')
        return
      }

      const displayRow = document.getElementById(`row-${productId}-${combinationId}`)
      if (displayRow) {
        const priceDisplay = displayRow.querySelector(`#price-display-${productId}-${combinationId}`)
        const qtyDisplay = displayRow.querySelector(`#qty-display-${productId}-${combinationId}`)
        if (priceDisplay) priceDisplay.textContent = `৳${parseFloat(priceInput.value).toFixed(2)}`
        if (qtyDisplay) qtyDisplay.textContent = quantityInput.value

        const statusBadge = displayRow.querySelector('.status-badge')
        const statusValue = statusSelect.value
        statusBadge.className = `status-badge ${isBase ? statusValue === 'Published' ? 'status-enabled' : 'status-disabled' : statusValue === 'enable' ? 'status-enabled' : 'status-disabled'}`
        statusBadge.textContent = statusValue.charAt(0).toUpperCase() + statusValue.slice(1)
      }

      showToast('Changes saved successfully!')
      toggleRows(productId, combinationId, false)
    })
  })

  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      const isValid = Array.from(form.querySelectorAll('input[required], select[required]')).every(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid')
          return false
        }
        return true
      })
      if (!isValid) {
        e.preventDefault()
        showToast('Please fill all required fields before submitting!', 'error')
        return
      }
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Saving...`
      submitBtn.disabled = true
    })
  }
})
</script>

<style scoped>
.product-card { border: 1px solid #dee2e6; border-radius: 8px; }
.product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #dee2e6; }
.combination-badge { font-weight: 500; color: #2c3e50; }
.status-badge { padding: 4px 8px; border-radius: 20px; font-size: 0.85rem; }
.status-enabled { background-color: #d1fae5; color: #065f46; }
.status-disabled { background-color: #fee2e2; color: #991b1b; }
.mini-toast { display: none; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; color: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 1000; }
.mini-toast.success { background: #4CAF50; }
.mini-toast.error { background: #dc3545; }
.is-invalid { border-color: #dc3545; }
.table-fixed { table-layout: fixed; }
</style>
