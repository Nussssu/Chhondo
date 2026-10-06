<template>
  <!-- Bootstrap modal kept always in the DOM so the legacy purchase.js can bind
       to the form elements once on mount. Toggled via data-bs-target. -->
  <div class="modal fade" id="purchaseCreateModal" tabindex="-1" aria-labelledby="purchaseCreateModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold" id="purchaseCreateModalLabel">Create Purchase</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="purchaseForm">
            <input type="hidden" name="_token" :value="csrfToken">

            <!-- 1 — what this purchase is -->
            <p class="pf-legend">Purchase details</p>
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label for="product" class="form-label">Purchase name</label>
                <input type="text" class="form-control" id="product" name="purchase_name" required
                  placeholder="e.g. October saree restock">
                <span id="purchase_name_error" class="text-danger small"></span>
              </div>
              <div class="col-md-6">
                <label class="form-label">Supplier</label>
                <select class="form-select select2-purchase" name="supplier_id" id="supplier_id">
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.supplier_name }}
                  </option>
                </select>
                <span id="supplier_id_error" class="text-danger small"></span>
              </div>
              <div class="col-md-6">
                <label for="invoice_number" class="form-label">Invoice number</label>
                <input type="text" class="form-control" id="invoice_number" required name="invoice_number">
                <span id="invoice_number_error" class="text-danger small"></span>
              </div>
              <div class="col-md-6">
                <label for="purchase_date" class="form-label">Purchase date</label>
                <input type="date" class="form-control" id="purchase_date" required name="purchase_date">
                <span id="purchase_date_error" class="text-danger small"></span>
              </div>
            </div>

            <!-- 2 — choosing what was bought. The button sits with the field it
                 acts on rather than floating below the form. -->
            <p class="pf-legend">Items</p>
            <!-- Typed by hand: this records what was bought from a supplier,
                 which need not be anything in the storefront catalogue. -->
            <div class="row g-3 align-items-end mb-3">
              <div class="col-md-6">
                <label class="form-label" for="itemName">Item name</label>
                <input type="text" class="form-control" id="itemName"
                  placeholder="e.g. Cotton fabric roll — 40 yd" autocomplete="off">
                <span id="productSelectError" class="text-danger small"></span>
              </div>
              <div class="col-md-3">
                <label class="form-label" for="itemCode">Code <span class="text-muted">(optional)</span></label>
                <input type="text" class="form-control" id="itemCode" placeholder="Supplier's ref" autocomplete="off">
              </div>
              <div class="col-md-3">
                <button type="button" class="btn btn-fig-secondary btn-fig-md w-100" id="addProductButton">
                  Add to purchase
                </button>
              </div>
            </div>

            <div class="table-responsive pf-items">
              <table class="table table-compact align-middle mb-0">
                <thead>
                  <tr>
                    <th style="width: 36px;"><input type="checkbox" id="selectAll"></th>
                    <th style="width: 44px;">#</th>
                    <th style="width: 130px;">Code</th>
                    <th>Item</th>
                    <th style="width: 110px;">Quantity</th>
                    <th style="width: 140px;">Purchase price</th>
                    <th style="width: 140px;">Selling price</th>
                    <th style="width: 70px;">Action</th>
                  </tr>
                </thead>
                <tbody id="variantTableBody"></tbody>
                <tfoot>
                  <tr>
                    <td colspan="5" class="text-end fw-semibold">Grand total</td>
                    <td colspan="3" class="fw-bold" id="totalAmount">৳0.00</td>
                  </tr>
                </tfoot>
              </table>
              <p class="pf-empty-hint">Type an item name above and add it to build this purchase.</p>
            </div>

            <!-- 3 — the money. Due is derived, so it reads as a result rather
                 than another thing to fill in. -->
            <p class="pf-legend">Payment</p>
            <div class="row g-3">
              <div class="col-md-4">
                <label for="purchasing_price" class="form-label">Total cost</label>
                <input type="number" class="form-control" id="purchasing_price" name="purchasing_price" readonly>
                <span id="purchasing_price_error" class="text-danger small"></span>
              </div>
              <div class="col-md-4">
                <label for="purchasing_paid" class="form-label">Paid now</label>
                <input type="number" class="form-control" id="purchasing_paid" name="purchasing_paid" step="0.01"
                  placeholder="0.00">
                <span id="purchasing_paid_error" class="text-danger small"></span>
              </div>
              <div class="col-md-4">
                <label for="purchasing_due" class="form-label">Due</label>
                <input type="number" class="form-control pf-due" id="purchasing_due" name="purchasing_due" readonly>
                <span id="purchasing_due_error" class="text-danger small"></span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-fig-secondary btn-fig-sm" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-fig-primary btn-fig-md" id="submitSelectedButton">
<Save :size="15" class="me-1" /> Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Save } from 'lucide-vue-next'

const props = defineProps({
  suppliers: { type: Array, default: () => [] },
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

function initSelect2() {
  if (typeof window.$ === 'undefined' || !window.$.fn.select2) return
  window.$('.select2-purchase').each(function () {
    const $el = window.$(this)
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy')
    $el.select2({
      theme: 'bootstrap-5',
      width: '100%',
      dropdownParent: window.$('#purchaseCreateModal'),
    })
  })
}

onMounted(() => {
  // Load the legacy purchase JS once; it binds handlers to the form elements
  // which are always present in the DOM (the modal is display:none, not v-if).
  const script = document.createElement('script')
  script.src = '/assets/Admin/purchase/purchase.js'
  script.onload = initSelect2
  document.body.appendChild(script)

  // Re-size select2 correctly each time the modal becomes visible.
  if (typeof window.$ !== 'undefined') {
    window.$('#purchaseCreateModal').on('shown.bs.modal', initSelect2)
  }
})
</script>

<style scoped>
.pf-legend {
  font-size: 11.5px;
  font-weight: 700;
  color: #1a2110;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin: 0 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eceff1;
}

.pf-items {
  border: 1px solid #e6e9ec;
  border-radius: 10px;
  padding: 4px 4px 0;
  margin-bottom: 22px;
}

/* Shown only while the table has no rows, so an empty purchase explains itself. */
.pf-empty-hint {
  margin: 0;
  padding: 14px;
  text-align: center;
  font-size: .8rem;
  color: #90a4ae;
}
#variantTableBody:not(:empty) ~ tfoot { display: table-footer-group; }
.pf-items:has(#variantTableBody:not(:empty)) .pf-empty-hint { display: none; }

.pf-due { font-weight: 700; }
</style>
