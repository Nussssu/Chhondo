<template>
  <FormModal size="lg" @close="$emit('close')">
    <template #header>
      <h5 class="mb-0">Add / Remove Products — <span class="text-primary">{{ coupon.code }}</span></h5>
    </template>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger mb-0">{{ error }}</div>

    <div v-else>
      <input type="text" v-model="search" class="form-control mb-3" placeholder="Search products...">

      <div class="orders-table-wrapper" style="max-height: 55vh; overflow-y: auto;">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th style="width: 60px;">
                <input class="form-check-input" type="checkbox" :checked="allVisibleSelected" @change="toggleAll">
              </th>
              <th>Product Name</th>
              <th>Product Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" role="switch"
                    :value="product.id" v-model="selected">
                </div>
              </td>
              <td>{{ product.product_name }}</td>
              <td>{{ product.product_code }}</td>
            </tr>
            <tr v-if="!filteredProducts.length">
              <td colspan="3" class="text-center text-muted py-3">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <span class="text-muted small me-auto">{{ selected.length }} selected</span>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="loading || saving" @click="save">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { toast } from '@/utils/toast'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  coupon: { type: Object, required: true },
})

const emit = defineEmits(['close', 'saved'])

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const products = ref([])
const selected = ref([])
const search = ref('')

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((p) =>
    [p.product_name, p.product_code].some((v) => (v ?? '').toString().toLowerCase().includes(q))
  )
})

const allVisibleSelected = computed(() =>
  filteredProducts.value.length > 0 && filteredProducts.value.every((p) => selected.value.includes(p.id))
)

function toggleAll(e) {
  const ids = filteredProducts.value.map((p) => p.id)
  if (e.target.checked) {
    selected.value = [...new Set([...selected.value, ...ids])]
  } else {
    selected.value = selected.value.filter((id) => !ids.includes(id))
  }
}

async function load() {
  try {
    const { data } = await axios.get(route('admin.coupons.add.product', props.coupon.id), {
      headers: { Accept: 'application/json' },
    })
    products.value = data.products || []
    selected.value = (data.coupon?.products || []).map((p) => p.id)
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('coupon_id', props.coupon.id)
    selected.value.forEach((id) => fd.append('product_ids[]', id))
    const { data } = await axios.post(route('admin.coupons.store.product'), fd, {
      headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
    })
    toast('success', data.message || 'Products updated successfully')
    emit('saved')
  } catch (e) {
    toast('error', e.response?.data?.message || 'Failed to update products')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
