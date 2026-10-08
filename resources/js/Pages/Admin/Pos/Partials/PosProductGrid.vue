<template>
  <div class="pg">
    <!-- Search + categories stay pinned so the operator never scrolls to reach them -->
    <div class="pg-controls">
      <div class="pg-search">
        <Search :size="16" class="pg-search-icon" />
        <input
          ref="searchInput"
          v-model="search"
          type="search"
          class="form-control"
          placeholder="Scan a barcode, or search by name / code…"
          @input="onSearchInput"
          @keyup.enter="onEnter"
          @keyup.esc="clearSearch"
        >
        <kbd class="pg-kbd">F2</kbd>
      </div>

      <div v-if="categories?.length" class="pg-cats">
        <button
          type="button"
          class="pg-cat"
          :class="{ 'is-on': category === '' }"
          @click="setCategory('')"
        >All</button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="pg-cat"
          :class="{ 'is-on': String(category) === String(cat.id) }"
          @click="setCategory(cat.id)"
        >{{ cat.name }}</button>
      </div>
    </div>

    <div class="pg-scroll">
      <div v-if="loading" class="pg-state">Loading products…</div>

      <div v-else-if="!products.data?.length" class="pg-state">
        <PackageSearch :size="34" />
        <p class="mb-0 mt-2">No products match that search.</p>
      </div>

      <div v-else class="pg-grid">
        <button
          v-for="product in products.data"
          :key="product.id"
          type="button"
          class="pg-tile"
          :class="{ 'is-out': stockOf(product) <= 0 }"
          :disabled="stockOf(product) <= 0"
          @click="pick(product)"
        >
          <span class="pg-thumb">
            <img v-if="product.featured_image" :src="asset(product.featured_image)" :alt="product.product_name" loading="lazy">
            <ImageIcon v-else :size="22" />
          </span>

          <span class="pg-name" :title="product.product_name">{{ product.product_name }}</span>
          <span class="pg-code">#{{ product.product_code }}</span>

          <span class="pg-foot">
            <span class="pg-price">৳{{ basePrice(product).toFixed(2) }}</span>
            <span class="pg-stock" :class="stockTone(product)">
              {{ stockLabel(product) }}
            </span>
          </span>
        </button>
      </div>

      <nav v-if="pageLinks.length > 3" class="pg-pager">
        <button
          v-for="link in pageLinks"
          :key="link.label"
          type="button"
          class="btn btn-sm"
          :class="link.active ? 'btn-fig-primary' : 'btn-outline-secondary'"
          :disabled="!link.url || link.active"
          :aria-current="link.active ? 'page' : undefined"
          @click="goToUrl(link.url)"
        >{{ link.label }}</button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { adminPaginationLinks } from '@/utils/adminPagination'
import { Search, PackageSearch, Image as ImageIcon } from 'lucide-vue-next'
import { rowState } from '@/utils/productPricing'
import { sellableQuantity } from '@/utils/stock'

const props = defineProps({
  initialProducts: { type: Object, required: true },
  productsRoute: { type: String, required: true },
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['quick-add'])

const products = ref(props.initialProducts)
const search = ref('')
const category = ref('')
const loading = ref(false)
const searchInput = ref(null)
let searchTimeout = null

const pageLinks = computed(() => adminPaginationLinks(products.value))

const basePrice = (product) => Number(product.price ?? 0)

const stockOf = (product) => sellableQuantity(product)

/** Uncounted products have no number to show, only availability. */
function stockLabel(product) {
  const stock = stockOf(product)
  if (stock <= 0) return 'Out'
  return Number.isFinite(stock) ? `${stock} left` : 'In stock'
}

function stockTone(product) {
  const stock = stockOf(product)
  if (stock <= 0) return 'is-out'
  return stock <= 5 ? 'is-low' : 'is-ok'
}

function pick(product) {
  if (stockOf(product) <= 0) return

  emit('quick-add', { product, state: rowState(product) })
}

/**
 * Barcode scanners type the code then press Enter. If the term identifies
 * exactly one product, ring it up without a second interaction.
 */
async function onEnter() {
  const term = search.value.trim()
  if (!term) return

  await reload()

  const list = products.value.data ?? []
  const exact = list.filter((p) => String(p.product_code ?? '').toLowerCase() === term.toLowerCase())
  const target = exact.length === 1 ? exact[0] : (list.length === 1 ? list[0] : null)

  if (target && stockOf(target) > 0) {
    pick(target)
    clearSearch()
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(reload, 300)
}

function clearSearch() {
  search.value = ''
  reload()
}

function setCategory(id) {
  category.value = id
  reload()
}

function reload(page = null) {
  loading.value = true
  return axios.get(props.productsRoute, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    params: { search: search.value, category: category.value, page },
  }).then((res) => {
    products.value = res.data.products
  }).finally(() => { loading.value = false })
}

function goToUrl(url) {
  if (!url) return
  const page = new URL(url, window.location.origin).searchParams.get('page')
  reload(page)
  document.querySelector('.pg-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
}

function asset(path) {
  if (!path) return '/placeholder.svg'
  return path.startsWith('http') ? path : `/${path.replace(/^\//, '')}`
}

const focusSearch = () => searchInput.value?.focus()

// F2 is the till convention for "back to the product search".
function onKeydown(event) {
  if (event.key === 'F2') {
    event.preventDefault()
    focusSearch()
    searchInput.value?.select()
  }
}

watch(() => props.initialProducts, (value) => { products.value = value })

onMounted(() => {
  focusSearch()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(searchTimeout)
})

defineExpose({ focusSearch })
</script>

<style scoped>
.pg { display: flex; flex-direction: column; height: 100%; min-height: 0; }

/* Controls */
.pg-controls {
  flex-shrink: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line, #e6e9ec);
}
.pg-search { position: relative; display: flex; align-items: center; }
.pg-search .form-control { padding-left: 36px; padding-right: 44px; height: 44px; font-size: .95rem; }
.pg-search-icon { position: absolute; left: 12px; color: #90a4ae; pointer-events: none; }
.pg-kbd {
  position: absolute; right: 10px;
  background: #eceff1; color: #78909c; border-radius: 4px;
  padding: 1px 6px; font-size: 10px; font-weight: 700;
}
.pg-cats { display: flex; gap: 6px; overflow-x: auto; padding: 10px 0 2px; scrollbar-width: thin; }
.pg-cat {
  flex-shrink: 0;
  border: 1px solid #e0e4e8; background: #fff; color: #546e7a;
  border-radius: 999px; padding: 5px 13px; font-size: .8rem; font-weight: 600; cursor: pointer;
  transition: background .12s, color .12s, border-color .12s;
}
.pg-cat:hover { border-color: #252f17; color: #252f17; }
.pg-cat.is-on { background: #252f17; border-color: #252f17; color: #fff; }

/* Grid */
.pg-scroll { flex: 1; min-height: 0; overflow-y: auto; padding-top: 12px; }
.pg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.pg-tile {
  display: flex; flex-direction: column; gap: 3px;
  padding: 8px; text-align: left;
  background: #fff; border: 1px solid #e6e9ec; border-radius: 10px;
  cursor: pointer;
  transition: border-color .12s, box-shadow .12s, transform .08s;
}
.pg-tile:hover:not(:disabled) {
  border-color: #252f17;
  box-shadow: 0 4px 14px rgba(37, 47, 23, .12);
  transform: translateY(-2px);
}
.pg-tile:active:not(:disabled) { transform: translateY(0); }
.pg-tile.is-out { opacity: .5; cursor: not-allowed; }

.pg-thumb {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 100%; aspect-ratio: 1 / 1;
  border-radius: 7px; overflow: hidden; background: #f1f3f5; color: #b0bec5;
}
.pg-thumb img { width: 100%; height: 100%; object-fit: cover; }

.pg-name {
  font-size: .8rem; font-weight: 600; color: #263238; line-height: 1.25;
  display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.1em;
}
.pg-code { font-size: .68rem; color: #90a4ae; }
.pg-foot { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: 2px; }
.pg-price { font-size: .88rem; font-weight: 700; color: #252f17; }
.pg-stock { font-size: .64rem; font-weight: 700; border-radius: 999px; padding: 1px 6px; }
.pg-stock.is-ok  { background: #e4f2e4; color: #1A2110; }
.pg-stock.is-low { background: #fff0d3; color: #B9770E; }
.pg-stock.is-out { background: #fdecea; color: #b71c1c; }

.pg-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 56px 20px; color: #90a4ae; text-align: center;
}
.pg-pager { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; padding: 16px 0 4px; }
</style>
