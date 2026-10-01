<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Account purposes" subtitle="What income and expenses get recorded against">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add purpose
          </button>
        </template>
      </PageHeader>

      <!-- Money summary. Was three full-width coloured cards; the figures are
           worth showing but not at that size. -->
      <div class="ap-summary mb-3">
        <div class="ap-summary-item">
          <span class="ap-summary-label">Income</span>
          <span class="ap-summary-value is-in">{{ numberFormat(income) }}৳</span>
        </div>
        <div class="ap-summary-item">
          <span class="ap-summary-label">Expenses</span>
          <span class="ap-summary-value is-out">{{ numberFormat(expense) }}৳</span>
        </div>
        <div class="ap-summary-item">
          <span class="ap-summary-label">Net balance</span>
          <span class="ap-summary-value" :class="balance < 0 ? 'is-out' : 'is-in'">{{ numberFormat(balance) }}৳</span>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search purposes…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          />

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No purposes yet"
            empty-message="Add a purpose so income and expenses can be categorised."
            :empty-variant="search ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-name="{ row }">
              <span class="fw-semibold">{{ row.name }}</span>
            </template>

            <template #cell-created_at="{ value }">
              <div>{{ formatDate(value) }}</div>
              <div class="text-muted small">{{ diffForHumans(value) }}</div>
            </template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="Edit purpose" @click="openEdit(row)">
                <Pencil :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete purpose" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>

            <template #empty-action>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
                <Plus :size="16" class="me-1" /> Add purpose
              </button>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>

      <NameFieldModal
        v-if="modalOpen"
        :record="editing"
        noun="purpose"
        label="Purpose name"
        placeholder="e.g. Courier charges"
        store-route="admin.account.storePurpose"
        update-route="admin.account.updatePurpose"
        @close="closeModal"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import NameFieldModal from '@/components/Admin/NameFieldModal.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  purposes: { type: Array, default: () => [] },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
})

const columns = [
  { key: 'name',       label: 'Purpose', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true, nowrap: true },
]

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'purposes'),
  { searchKeys: ['name'], perPage: 10 }
)

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(row) {
  editing.value = row
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

async function destroy(row) {
  const ok = await confirmDelete({
    title: 'Delete this purpose?',
    text: `“${row.name}” will be removed. Existing entries using it may be affected.`,
  })
  if (ok) router.delete(route('admin.account.destroyPurpose', row.id), { preserveScroll: true })
}

function numberFormat(val) {
  return parseFloat(val || 0).toFixed(2)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function diffForHumans(value) {
  if (!value) return ''
  const diff = Math.floor((Date.now() - new Date(value)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}
</script>

<style scoped>
.ap-summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2) var(--sp-6);
  padding: var(--sp-3) var(--sp-4);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
}

.ap-summary-item { display: flex; align-items: baseline; gap: var(--sp-2); }

.ap-summary-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--text-muted);
}

.ap-summary-value {
  font-size: var(--fs-base);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.ap-summary-value.is-in  { color: var(--st-success); }
.ap-summary-value.is-out { color: var(--st-danger); }
</style>
