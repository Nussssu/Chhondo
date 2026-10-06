<template>
  <FormModal
    title="Export for social media"
    subtitle="Tick the products to include in the Facebook / Instagram catalogue CSV."
    size="lg"
    @close="$emit('close')"
  >
    <div class="se-tools">
      <input
        v-model="search"
        type="search"
        class="form-control"
        placeholder="Search by name or code…"
        aria-label="Search products"
        data-autofocus
      />
      <div class="se-tools-actions">
        <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="!visible.length" @click="selectVisible">
          Select {{ search ? 'shown' : 'all' }}
        </button>
        <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="!selected.length" @click="selected = []">
          Clear
        </button>
      </div>
    </div>

    <ul v-if="visible.length" class="se-list">
      <li v-for="row in visible" :key="row.id">
        <label class="se-item" :class="{ 'is-checked': isSelected(row.id) }">
          <input
            type="checkbox"
            class="form-check-input flex-shrink-0 m-0"
            :checked="isSelected(row.id)"
            @change="toggle(row.id)"
          />
          <img :src="row.featured_image || '/placeholder.svg'" width="48" height="48" class="se-thumb" alt="" loading="lazy" decoding="async" @error="$event.target.src = '/placeholder.svg'" />
          <span class="se-text">
            <span class="se-name" :title="row.product_name">{{ row.product_name }}</span>
            <span class="se-meta">#{{ row.id }}<template v-if="row.product_code"> · {{ row.product_code }}</template></span>
          </span>
          <span class="se-price">{{ money(row.discounted_price ?? row.price) }}</span>
          <span class="se-pills">
            <StatusPill :tone="availability(row).tone" :label="availability(row).label" />
            <!-- An unpublished product's link opens a 404 page, which the ad would send people to. -->
            <StatusPill v-if="row.status !== 'Published'" :status="row.status" />
          </span>
        </label>
      </li>
    </ul>
    <p v-else class="text-muted text-center my-4">No products match “{{ search }}”.</p>

    <template #footer>
      <span class="se-count me-auto">{{ selected.length }} of {{ products.length }} selected</span>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" :disabled="!selected.length" @click="exportCsv">
        <Download :size="16" class="me-1" /> Export CSV
      </button>
    </template>
  </FormModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import FormModal from '@/components/Admin/FormModal.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'

const props = defineProps({
  products: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const search = ref('')
const selected = ref([])

const visible = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return props.products

  return props.products.filter((row) =>
    [row.product_name, row.product_code, String(row.id)]
      .some((value) => String(value ?? '').toLowerCase().includes(term))
  )
})

const isSelected = (id) => selected.value.includes(id)

function toggle(id) {
  selected.value = isSelected(id)
    ? selected.value.filter((x) => x !== id)
    : [...selected.value, id]
}

function selectVisible() {
  const ids = visible.value.map((row) => row.id)
  selected.value = [...new Set([...selected.value, ...ids])]
}

/** What the catalogue will be told — the same rule SocialCatalogExport applies. */
function availability(row) {
  if (row.is_preorder) return { tone: 'info', label: 'Pre-order' }
  return row.in_stock
    ? { tone: 'success', label: 'In stock' }
    : { tone: 'danger', label: 'Out of stock' }
}

const money = (amount) => `৳${Number(amount || 0).toFixed(0)}`

// Rows go out in the order the list shows them, not the order they were ticked.
function exportCsv() {
  const ids = props.products.map((row) => row.id).filter(isSelected)
  window.location.href = route('products.export_social', { ids: ids.join(',') })
  emit('close')
}
</script>

<style scoped>
.se-tools {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.se-tools-actions {
  display: flex;
  gap: var(--sp-2);
  flex-shrink: 0;
}

.se-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
}

.se-list li + li { border-top: 1px solid var(--line); }

.se-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  margin: 0;
  cursor: pointer;
}

.se-item:hover { background: var(--surface-sunk); }
.se-item.is-checked { background: var(--surface-alt); }

.se-thumb {
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--surface-sunk);
}

.se-text {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.se-name {
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.se-meta,
.se-count {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.se-price {
  flex-shrink: 0;
  font-weight: 600;
  white-space: nowrap;
}

.se-pills {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--sp-1);
  flex-shrink: 0;
}

@media (max-width: 575px) {
  .se-tools { flex-direction: column; }
  .se-item { flex-wrap: wrap; }
  .se-pills { flex-direction: row; }
}
</style>
