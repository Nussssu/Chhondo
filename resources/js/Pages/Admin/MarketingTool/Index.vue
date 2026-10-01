<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Custom code" subtitle="Scripts injected into the storefront — pixels, tags, verification and anything else">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add code
          </button>
        </template>
      </PageHeader>

      <EmptyState
        v-if="!marketingTools.length"
        title="No custom code yet"
        message="Add a Meta Pixel, Google Tag Manager container or any other snippet, and choose which pages it runs on."
      >
        <template #action>
          <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add code
          </button>
        </template>
      </EmptyState>

      <div v-else class="card">
        <div class="card-body">
          <div class="d-flex mb-3 justify-content-between align-items-center gap-2 flex-wrap">
            <h5 class="mb-0">{{ filtered.length }} snippet{{ filtered.length === 1 ? '' : 's' }}</h5>
            <div class="d-flex align-items-center gap-2">
              <input
                v-model="search"
                type="text"
                class="form-control orders-toolbar-search"
                placeholder="Search title or code…"
              />
              <select v-model="locationFilter" class="form-select form-select-sm mt-filter">
                <option value="">All locations</option>
                <option v-for="l in LOCATION_ORDER" :key="l.value" :value="l.value">{{ l.label }}</option>
              </select>
            </div>
          </div>

          <div class="orders-table-wrapper">
            <table class="table table-striped table-hover orders-table-compact align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Target page</th>
                  <th>Location</th>
                  <th class="text-center">Priority</th>
                  <th class="text-center">Status</th>
                  <th>Code</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tool in filtered" :key="tool.id" :class="{ 'mt-row-paused': !tool.is_active }">
                  <td>
                    <span class="fw-semibold">{{ tool.title || tool.name }}</span>
                    <span v-if="tool.identifier" class="d-block text-muted small">{{ tool.identifier }}</span>
                  </td>
                  <td>
                    {{ targetLabel(tool) }}
                    <span v-if="tool.target === 'custom'" class="d-block text-muted small mt-mono">
                      {{ customPatterns(tool) }}
                    </span>
                  </td>
                  <td>
                    <span class="mt-badge is-location">{{ locationLabel(tool.location) }}</span>
                  </td>
                  <td class="text-center">{{ tool.priority ?? 10 }}</td>
                  <td class="text-center">
                    <span class="mt-badge" :class="tool.is_active ? 'is-live' : 'is-off'">
                      {{ tool.is_active ? 'Live' : 'Paused' }}
                    </span>
                  </td>
                  <td class="mt-code-cell">
                    <code class="mt-code-peek" :title="tool.script">{{ preview(tool.script) }}</code>
                  </td>
                  <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <button type="button" class="table-icon-btn is-primary" title="Edit code" @click="openEdit(tool)">
                        <Pencil :size="14" />
                      </button>
                      <button type="button" class="table-icon-btn is-danger" title="Delete code" @click="destroy(tool)">
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filtered.length">
                  <td colspan="7" class="text-center">No snippets match this filter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MarketingToolModal v-if="modalOpen" :tool="editing" @close="closeModal" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import EmptyState from '@/components/Admin/EmptyState.vue'
import MarketingToolModal from './Partials/MarketingToolModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  marketingTools: { type: Array, default: () => [] },
  groupedTools: { type: Object, default: () => ({}) },
})

const LOCATION_ORDER = [
  { value: 'head', label: 'Head' },
  { value: 'body_start', label: 'Body start' },
  { value: 'body_end', label: 'Body end' },
]

const TARGET_LABELS = {
  entire_site: 'Entire site',
  home: 'Home page',
  shop: 'Shop',
  category: 'Category pages',
  product: 'Product pages',
  cart: 'Cart',
  checkout: 'Checkout',
  order_success: 'Order success',
  account: 'Account',
  contact: 'Contact',
  custom: 'Custom URLs',
}

const modalOpen = ref(false)
const editing = ref(null)
const search = ref('')
const locationFilter = ref('')

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()

  return props.marketingTools.filter((tool) => {
    if (locationFilter.value && tool.location !== locationFilter.value) return false
    if (!term) return true

    return (
      (tool.title || '').toLowerCase().includes(term) ||
      (tool.name || '').toLowerCase().includes(term) ||
      (tool.identifier || '').toLowerCase().includes(term) ||
      (tool.script || '').toLowerCase().includes(term)
    )
  })
})

function locationLabel(value) {
  return LOCATION_ORDER.find((l) => l.value === value)?.label || 'Head'
}

function customPatterns(tool) {
  return String(tool.target_urls || '')
    .split(/[\r\n,]+/)
    .filter(Boolean)
    .join(', ')
}

function targetLabel(tool) {
  if (tool.target === 'custom') {
    const count = customPatterns(tool).split(', ').filter(Boolean).length
    return count ? `${count} custom URL${count > 1 ? 's' : ''}` : 'Custom URLs'
  }
  return TARGET_LABELS[tool.target] || 'Entire site'
}

// The code column is a peek, not the whole snippet — the modal shows all of it.
function preview(script) {
  const flat = String(script || '').replace(/\s+/g, ' ').trim()
  if (!flat) return '— no code —'
  return flat.length > 70 ? `${flat.slice(0, 70)}…` : flat
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(tool) {
  editing.value = tool
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

// Removing a tracking script silently breaks analytics, so it is worth a question.
async function destroy(tool) {
  const ok = await confirmDelete({
    title: `Remove ${tool.title || tool.name}?`,
    text: 'Its code will stop loading on the storefront.',
    confirmButtonText: 'Remove',
  })
  if (ok) router.delete(route('admin.marketing-tools.destroy', tool.id), { preserveScroll: true })
}
</script>

<style scoped>
.mt-filter {
  width: auto;
  min-width: 150px;
}

.mt-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}

.mt-badge.is-location {
  background: var(--surface-2, #f3f4f6);
  color: var(--ink-muted, #4b5563);
}

.mt-badge.is-live {
  background: #e7f5e9;
  color: #1e7a35;
}

.mt-badge.is-off {
  background: #fdeaea;
  color: #a52c2c;
}

.mt-row-paused td {
  opacity: 0.6;
}

.mt-code-cell {
  max-width: 340px;
}

.mt-code-peek {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 12px;
  color: var(--ink-muted, #6b7280);
}

.mt-mono {
  font-family: var(--mono, ui-monospace, monospace);
}
</style>
