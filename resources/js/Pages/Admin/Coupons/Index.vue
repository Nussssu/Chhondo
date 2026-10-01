<template>
  <AdminLayout>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="d-flex mb-3 justify-content-between align-items-center gap-2 flex-wrap">
            <h5 class="mb-0">Coupon List</h5>
            <div class="d-flex align-items-center gap-2">
              <input type="text" v-model="search" class="form-control orders-toolbar-search"
                placeholder="Search coupons...">
              <button type="button" class="btn btn-fig-primary btn-fig-sm d-flex align-items-center text-nowrap"
                @click="openCreate">
                <Plus :size="16" class="me-1" /> Create Coupon
              </button>
            </div>
          </div>

          <div class="orders-table-wrapper">
            <table class="table table-striped table-hover orders-table-compact">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Valid From</th>
                  <th>Expiry Date</th>
                  <th>Usage Limit</th>
                  <th>With Product</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coupon in filteredCoupons" :key="coupon.id">
                  <td class="fw-semibold">{{ coupon.code }}</td>
                  <td>{{ capitalize(coupon.discount_type) }} ({{ coupon.discount_amount }})</td>
                  <td>{{ formatDate(coupon.valid_from) }}</td>
                  <td>{{ formatDate(coupon.expiry_date) }}</td>
                  <td>{{ coupon.usage_limit }}</td>
                  <td>
                    <ul class="product-list mb-0">
                      <li v-for="product in coupon.products" :key="product.id" class="small">{{ product.product_name }}</li>
                      <li v-if="!coupon.products || !coupon.products.length" class="text-muted small">—</li>
                    </ul>
                  </td>
                  <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <button type="button" class="table-icon-btn" title="Add / Remove Product"
                        @click="openProducts(coupon)">
                        <Package :size="14" />
                      </button>
                      <button type="button" class="table-icon-btn is-primary" title="Edit"
                        @click="openEdit(coupon)">
                        <Pencil :size="14" />
                      </button>
                      <button type="button" class="table-icon-btn is-danger" title="Delete"
                        @click="destroy(coupon)">
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredCoupons.length">
                  <td colspan="7" class="text-center">No coupons found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CouponFormModal
        v-if="showModal"
        :coupon="editingCoupon"
        @close="closeModal"
        @saved="onSaved"
      />

      <CouponProductModal
        v-if="productCoupon"
        :coupon="productCoupon"
        @close="productCoupon = null"
        @saved="onProductsSaved"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Plus, Pencil, Trash2, Package } from 'lucide-vue-next'
import CouponFormModal from './Partials/CouponFormModal.vue'
import CouponProductModal from './Partials/CouponProductModal.vue'

const props = defineProps({
  coupons: { type: Array, default: () => [] },
})

const search = ref('')
const showModal = ref(false)
const editingCoupon = ref(null)
const productCoupon = ref(null)

const filteredCoupons = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.coupons
  return props.coupons.filter((c) =>
    [c.code, c.discount_type].some((v) => (v ?? '').toString().toLowerCase().includes(q))
  )
})

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.substring(0, 10)
}

function openCreate() {
  editingCoupon.value = null
  showModal.value = true
}

function openEdit(coupon) {
  editingCoupon.value = coupon
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCoupon.value = null
}

function onSaved() {
  router.reload({ only: ['coupons'] })
}

function openProducts(coupon) {
  productCoupon.value = coupon
}

function onProductsSaved() {
  productCoupon.value = null
  router.reload({ only: ['coupons'] })
}

async function destroy(coupon) {
  if (await confirmDelete({ title: 'Delete this coupon?', text: "You won't be able to revert this!" })) {
    router.delete(route('admin.coupons.destroy', coupon.id), { preserveScroll: true })
  }
}
</script>

<style scoped>
.product-list {
  max-height: 60px;
  overflow-y: auto;
  padding-left: 0;
  list-style-type: none;
}
</style>
