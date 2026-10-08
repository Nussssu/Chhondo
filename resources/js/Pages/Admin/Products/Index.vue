<template>
  <AdminLayout>
    <div class="page-content products-admin-page">
      <PageHeader title="Products" :subtitle="`${props.product.length} products in the catalogue`">
        <template #actions>
          <button
            type="button"
            class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center"
            :disabled="!props.product.length"
            @click="showSocialExport = true"
          >
            <Share2 :size="16" class="me-1" /> Export for social media
          </button>
          <button type="button" @click="productEditor = { productId: null }" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center">
            <Plus :size="16" class="me-1" /> Add product
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search products…"
            :per-page="pageSize"
            :per-page-options="[10, 20, 50, 100]"
            :selected-count="selected.length"
            @update:per-page="pageSize = Number($event)"
            @clear-selection="selected = []"
          >
            <template #filters>
              <select
                class="form-select w-auto"
                aria-label="Filter by category"
                :value="String(selectedCategory ?? '')"
                @change="filterCategory($event.target.value)"
              >
                <option value="">All categories</option>
                <option v-for="cat in category" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </template>

            <template #bulk>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="busy" @click="bulkPublish(true)">
                Publish
              </button>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="busy" @click="bulkPublish(false)">
                Unpublish
              </button>
              <button type="button" class="btn btn-fig-danger btn-fig-sm" :disabled="busy" @click="bulkDelete">
                Delete
              </button>
            </template>
          </Toolbar>

          <DataTable
            v-model:selected="selected"
            :columns="columns"
            :rows="rows"
            :sort="sort"
            selectable
            :empty-variant="search ? 'filtered' : 'empty'"
            empty-title="No products found"
            :empty-message="search
              ? 'Try a different search term or clear the category filter.'
              : 'Add your first product to start selling.'"
            @sort="onSort"
          >
            <template #cell-product_name="{ row }">
              <div class="d-flex align-items-center gap-2">
                <img :src="row.featured_image || '/placeholder.svg'" width="36" height="36" class="rounded flex-shrink-0" alt="" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
                <div class="min-w-0">
                  <div class="fw-semibold text-truncate" :title="row.product_name">{{ row.product_name }}</div>
                  <div class="text-muted small text-truncate">{{ row.product_code || '—' }}</div>
                </div>
              </div>
            </template>

            <template #cell-category="{ row }">
              <!-- Primary first, then the other shelves it sits on. -->
              <span class="product-category" :title="categoryLabel(row)">{{ categoryLabel(row) }}</span>
            </template>

            <template #cell-price="{ row }">
              <div v-for="line in priceLines(row)" :key="line.label ?? 'price'" class="price-line">
                <span v-if="line.label" class="price-choice text-muted small">{{ line.label }}</span>
                <span v-if="line.price > 0" class="fw-semibold">{{ money(line.price) }}</span>
                <span v-else class="text-muted small">Not priced</span>
                <s v-if="line.previous > line.price" class="text-muted small">{{ money(line.previous) }}</s>
              </div>
            </template>

            <template #cell-status="{ row }">
              <button type="button" class="pill-btn" :disabled="busy" @click="toggleStatus(row)">
                <StatusPill :status="row.status" />
              </button>
            </template>

            <template #cell-stock_status="{ row }">
              <StatusPill :tone="stockPill(row).tone" :label="stockPill(row).label" />
            </template>

            <template #cell-is_new_arrival="{ row }">
              <button
                type="button"
                class="switch"
                role="switch"
                :aria-checked="!!row.is_new_arrival"
                :aria-label="`New arrival for ${row.product_name}`"
                @click="toggleNewArrival(row)"
              >
                <span class="switch-track"><span class="switch-knob" /></span>
                <span class="switch-label">{{ row.is_new_arrival ? 'On' : 'Off' }}</span>
              </button>
            </template>

            <template #actions="{ row }">
              <button type="button" @click="productEditor = { productId: row.id }" class="table-icon-btn is-primary" title="Edit product">
                <Pencil :size="14" />
              </button>
              <a
                :href="`${frontendUrl}/product/${row.slug}`"
                class="table-icon-btn"
                title="View on storefront"
                target="_blank"
                rel="noopener"
              >
                <Eye :size="14" />
              </a>
              <button type="button" class="table-icon-btn" title="Duplicate product" @click="duplicate(row)">
                <Copy :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete product" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>

            <template #empty-action>
              <button type="button" @click="productEditor = { productId: null }" class="btn btn-fig-primary btn-fig-sm">
                <Plus :size="16" class="me-1" /> Add product
              </button>
            </template>
          </DataTable>

          <Pagination
            v-model:page="page"
            :per-page="pageSize"
            :total-items="total"
          />
        </div>
      </div>
    </div>

    <SocialExportModal v-if="showSocialExport" :products="props.product" @close="showSocialExport = false" />
    <ProductFormModal v-if="productEditor" :product-id="productEditor.productId" @close="productEditor = null" @complete="finishProductEditor" />
  </AdminLayout>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import axios from 'axios'
import { router } from '@inertiajs/vue3'
import { Plus, Pencil, Eye, Trash2, Copy, Share2 } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import SocialExportModal from './Partials/SocialExportModal.vue'
import ProductFormModal from './Partials/ProductFormModal.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import { listPricesFor } from '@/utils/productPrice'

const props = defineProps({
  product: { type: Array, default: () => [] },
  category: { type: Array, default: () => [] },
  selectedCategory: { type: [String, Number], default: '' },
  frontendUrl: { type: String, default: '' },
})

const productEditor = ref(null)
function finishProductEditor() {
  productEditor.value = null
  router.reload({ only: ['product', 'category'], preserveScroll: true })
}

const columns = [
  { key: 'product_name',      label: 'Product', width: '22%', sortable: true },
  { key: 'category',          label: 'Category', width: '14%' },
  { key: 'price',             label: 'Price', width: '16%', sortable: true },
  { key: 'status',            label: 'Status', width: '10%', sortable: true },
  { key: 'stock_status',      label: 'Stock status', width: '12%', sortable: true },
  // Feeds the "New arrivals" widget on any page built in Content › Pages.
  { key: 'is_new_arrival',    label: 'New arrival', width: '8%' },
]

// The controller returns every product as a plain array, so search, sort and
// paging happen here — the job jQuery DataTables used to do.
const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'product'),
  { searchKeys: ['product_name', 'product_code', 'category.name', 'status'], perPage: 10 }
)

const selected = ref([])
const busy = ref(false)
const showSocialExport = ref(false)

const csrf = computed(() => document.querySelector('meta[name=csrf-token]')?.content)

function refresh() {
  selected.value = []
  router.reload({ only: ['product'] })
}

/**
 * How a product's availability reads in the list.
 *
 * Mirrors Product::getInStockAttribute(), fallback included, so this column
 * cannot disagree with what the storefront actually does. "Track quantity"
 * shows the count, since that is the only status where the number means
 * anything.
 */
function stockPill(row) {
  const qty = Number(row.quantity) || 0
  const counted = qty > 0
    ? { tone: 'success', label: `In stock · ${qty}` }
    : { tone: 'danger', label: 'Out of stock' }

  switch (row.stock_status) {
    case 'instock':    return { tone: 'success', label: 'In stock' }
    case 'outofstock': return { tone: 'danger',  label: 'Out of stock' }
    case 'preorder':   return { tone: 'info',    label: 'Pre-order' }
    case 'manage':     return counted
    // Rows saved before stock_status existed are judged on quantity.
    default:           return counted
  }
}

const money = (amount) => `৳${Number(amount).toFixed(2)}`

/**
 * The list prices a product sells at, one line per blouse choice.
 *
 * Read through listPricesFor() so this column shows the same pair the
 * storefront does — including a with-blouse option priced only at its regular
 * price. Coupons and campaigns are left out: this is what was typed in.
 */
function priceLines(row) {
  if (!row.has_blouse_option) return [listPricesFor(row)]

  return [
    { label: 'Without blouse', ...listPricesFor(row) },
    { label: 'With blouse', ...listPricesFor(row, true) },
  ]
}

/** Every category a product is filed under, primary named first. */
function categoryLabel(row) {
  const primary = row.category?.name
  const others = (row.categories ?? [])
    .map((c) => c.name)
    .filter((name) => name && name !== primary)

  return [primary, ...others].filter(Boolean).join(', ') || '—'
}

function filterCategory(categoryId) {
  router.get(route('products.index'), { category_id: categoryId }, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}

// ── Row toggles ─────────────────────────────────────────────
// Each writes through and then reloads the prop, so the row always shows
// what the server actually stored rather than an optimistic guess.
async function toggleStatus(row) {
  busy.value = true
  try {
    await axios.patch(route('products.toggleStatus', row.id), {}, { headers: { 'X-CSRF-TOKEN': csrf.value } })
    toast('success', 'Product status updated')
    refresh()
  } catch {
    toast('error', 'Could not update the product status. Please try again.')
  } finally {
    busy.value = false
  }
}

function toggleNewArrival(row) {
  router.patch(route('products.new_arrival_toggle', { id: row.id }), {}, { preserveScroll: true })
}

// Opens the copy in the editor, which is where the operator is heading next.
function duplicate(row) {
  router.post(route('products.duplicate', row.id))
}

// ── Single delete ───────────────────────────────────────────
async function destroy(row) {
  const ok = await confirmDelete({
    title: 'Delete this product?',
    text: `${row.product_name} will be removed. This cannot be undone.`,
  })
  if (!ok) return
  router.delete(route('products.destroy', row.id), { preserveScroll: true, onSuccess: () => (selected.value = []) })
}

// ── Bulk actions ────────────────────────────────────────────
async function bulkDelete() {
  const ok = await confirmDelete({
    title: `Delete ${selected.value.length} product${selected.value.length === 1 ? '' : 's'}?`,
    text: 'This cannot be undone.',
  })
  if (!ok) return

  busy.value = true
  try {
    await axios.post('/admin/products/bulk-delete', { ids: selected.value }, { headers: { 'X-CSRF-TOKEN': csrf.value } })
    toast('success', 'Products deleted')
    refresh()
  } catch {
    toast('error', 'Could not delete the selected products. Please try again.')
  } finally {
    busy.value = false
  }
}

async function bulkPublish(publish) {
  const verb = publish ? 'Publish' : 'Unpublish'
  const ok = await confirmDelete({
    title: `${verb} ${selected.value.length} product${selected.value.length === 1 ? '' : 's'}?`,
    text: publish
      ? 'They will become visible on the storefront.'
      : 'They will be hidden from the storefront.',
    confirmButtonText: verb,
    tone: 'question',
  })
  if (!ok) return

  busy.value = true
  try {
    const url = publish ? route('products.bulk.publish') : route('products.bulk.unpublish')
    const { data } = await axios.post(url, { ids: selected.value }, { headers: { 'X-CSRF-TOKEN': csrf.value } })
    toast('success', data?.message || `Products ${publish ? 'published' : 'unpublished'}`)
    refresh()
  } catch {
    toast('error', `Could not ${verb.toLowerCase()} the selected products. Please try again.`)
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.products-admin-page :deep(.card-body) { padding: 12px; }
.products-admin-page :deep(.dt-table) { table-layout: fixed; width: 100%; font-size: 12px; }
.products-admin-page :deep(.dt-table th), .products-admin-page :deep(.dt-table td) { padding: 8px 6px; }
.products-admin-page :deep(.dt-table th) { font-size: 10px; letter-spacing: .025em; }
.products-admin-page :deep(.dt-check-col) { width: 32px; }
.products-admin-page :deep(.dt-actions-col) { width: 112px; }
.products-admin-page :deep(.dt-table thead th.dt-actions-col) { text-align: center; }
.products-admin-page :deep(.dt-actions) { gap: 2px; flex-wrap: nowrap; white-space: nowrap; }
.products-admin-page :deep(.dt-actions .table-icon-btn) { width: 22px; height: 24px; flex: 0 0 22px; }
.products-admin-page :deep(.dt-table td .d-flex) { flex-wrap: nowrap; }
.product-category { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
@media (min-width: 768px) {
  .products-admin-page :deep(.dt-actions) { justify-content: center; }
}
@media (max-width: 767px) {
  .products-admin-page :deep(.dt-check-col), .products-admin-page :deep(.dt-actions-col) { width: 100%; }
}
/* Toggle cells: the pill is the control, so strip the button chrome. */
.pill-btn {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  border-radius: var(--r-full);
}

.pill-btn:disabled { opacity: .6; cursor: progress; }
.pill-btn:focus-visible { outline: 2px solid var(--admin-green-600); outline-offset: 2px; }

/* On/off switch for the boolean flag columns. The whole button is the hit
   area, so the track and the label both respond to a single click. */
.switch {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.switch-track {
  position: relative;
  flex: 0 0 auto;
  width: 34px;
  height: 20px;
  border-radius: var(--r-full);
  background: var(--st-neutral-soft);
  transition: background-color .15s ease;
}

.switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: var(--r-full);
  background: var(--surface);
  box-shadow: var(--el-1);
  transition: transform .15s ease;
}

.switch-label {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.switch[aria-checked='true'] .switch-track { background: var(--admin-green-600); }
.switch[aria-checked='true'] .switch-knob { transform: translateX(14px); }
.switch[aria-checked='true'] .switch-label { color: var(--text); }

.switch:disabled { opacity: .6; cursor: progress; }
.switch:focus-visible { outline: 2px solid var(--admin-green-600); outline-offset: 3px; border-radius: var(--r-sm); }

.min-w-0 { min-width: 0; }

/* One line per blouse choice: label, price, then the struck-through one. */
.price-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 2px 4px;
  white-space: nowrap;
}
.price-choice { grid-column: 1 / -1; font-size: 10px; overflow: hidden; text-overflow: ellipsis; }
.price-line + .price-line { margin-top: 4px; }
</style>
