<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Account types" subtitle="The ledgers money is recorded against">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add account type
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search account types…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          />

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No account types yet"
            empty-message="Add an account type before recording income or expenses."
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
              <button type="button" class="table-icon-btn is-primary" title="Edit account type" @click="openEdit(row)">
                <Pencil :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete account type" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>

            <template #empty-action>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
                <Plus :size="16" class="me-1" /> Add account type
              </button>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>

      <NameFieldModal
        v-if="modalOpen"
        :record="editing"
        noun="account type"
        label="Account name"
        placeholder="e.g. Cash in hand"
        store-route="admin.account.store"
        update-route="admin.account.update"
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
  accountTypes: { type: Array, default: () => [] },
})

const columns = [
  { key: 'name',       label: 'Account type', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true, nowrap: true },
]

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'accountTypes'),
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
    title: 'Delete this account type?',
    text: `“${row.name}” will be removed. Transactions recorded against it may be affected.`,
  })
  if (ok) router.delete(route('admin.account.destroy', row.id), { preserveScroll: true })
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
