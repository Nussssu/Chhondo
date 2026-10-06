<template>
  <div>
    <div class="d-flex gap-2 mb-2">
      <select v-if="categories" v-model="category" @change="reload" class="form-select form-select-sm" style="max-width:200px;">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <input type="text" v-model="search" @keyup.enter="reload" class="form-control" placeholder="Search products...">
      <button type="button" class="btn btn-fig-tertiary btn-fig-sm" @click="reload">Search</button>
    </div>

    <div v-if="loading" class="text-center p-4">Loading...</div>

    <div v-else class="table-responsive">
      <table class="table align-middle">
        <thead class="table-light">
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products.data" :key="product.id">
            <td>
              <div class="d-flex flex-column">
                <img v-if="product.featured_image" :src="asset(product.featured_image)" alt="product-photo" class="product-photo">
                <span>{{ limit(product.product_name, 60) }}</span>
                <b><i class="text-warning">#{{ product.product_code }}</i></b>
              </div>
            </td>
            <td class="product-price-cell">{{ rowState(product).price.toFixed(2) }}</td>
            <td>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="add(product)">Add</button>
            </td>
          </tr>
          <tr v-if="!products.data?.length">
            <td colspan="4" class="text-center">No products found</td>
          </tr>
        </tbody>
      </table>
      <div class="mt-2" v-if="products.links">
        <nav>
          <ul class="pagination">
            <li v-for="link in products.links" :key="link.label" class="page-item" :class="{ active: link.active, disabled: !link.url }">
              <a class="page-link" href="#" v-html="link.label" @click.prevent="link.url && goToUrl(link.url)"></a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { toast } from '@/utils/toast'
// Shared with the POS till so both price a variant identically.
import { rowState as priceFor } from '@/utils/productPricing'

const props = defineProps({
  initialProducts: { type: Object, required: true },
  productsRoute: { type: String, required: true },
  categories: { type: Array, default: null },
})

const emit = defineEmits(['add-to-cart'])

const products = ref(props.initialProducts)
const search = ref('')
const category = ref('')
const loading = ref(false)

const rowState = (product) => priceFor(product)

function add(product) {
  const state = rowState(product)
  if (!(state.qty > 0)) {
    toast('warning', 'Invalid or unavailable combination')
    return
  }
  emit('add-to-cart', {
    productId: product.id,
    name: product.product_name,
    combinationId: state.combinationId,
    selected: state.selected,
    price: state.price,
    qty: state.qty,
  })
}

function asset(path) {
  if (!path) return '/placeholder.svg'
  return path.startsWith('http') ? path : `/${path.replace(/^\//, '')}`
}

function limit(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

function reload(page = null) {
  loading.value = true
  axios.get(props.productsRoute, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    params: { search: search.value, category: category.value, page },
  }).then((res) => {
    products.value = res.data.products
  }).finally(() => { loading.value = false })
}

function goToUrl(url) {
  const page = new URL(url, window.location.origin).searchParams.get('page')
  reload(page)
}
</script>

<style scoped>
.product-photo {
  width: 60px;
  height: 60px;
  object-fit: cover;
}
</style>
