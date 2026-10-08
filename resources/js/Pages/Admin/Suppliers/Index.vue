<template>
  <AdminLayout>
    <div class="page-content suppliers-admin-page">
      <PageHeader
        title="Suppliers"
        subtitle="Companies you purchase stock from"
      >
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add supplier
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search suppliers…"
          />

          <DataTable
            :columns="columns"
            :rows="filteredSuppliers"
            empty-title="No suppliers yet"
            empty-message="Add a supplier to start recording purchases against them."
            :empty-variant="search ? 'filtered' : 'empty'"
          >
            <template #cell-supplier_name="{ row }">
              <span class="fw-semibold">{{ row.supplier_name }}</span>
              <span v-if="row.company_phone" class="d-block text-muted small">{{ row.company_phone }}</span>
            </template>

            <template #cell-company_address="{ value }">
              {{ value || '—' }}
            </template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="Edit supplier" @click="openEdit(row)">
                <Pencil :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete supplier" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>

            <template #empty-action>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
                <Plus :size="16" class="me-1" /> Add supplier
              </button>
            </template>
          </DataTable>
        </div>
      </div>

      <SupplierFormModal
        v-if="showModal"
        :supplier="editingSupplier"
        @close="closeModal"
        @saved="onSaved"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import SupplierFormModal from './Partials/SupplierFormModal.vue'

const props = defineProps({
  suppliers: { type: Array, default: () => [] },
})

const columns = [
  { key: 'supplier_name',   label: 'Supplier' },
  { key: 'company_name',    label: 'Company' },
  { key: 'company_address', label: 'Address' },
]

const search = ref('')
const showModal = ref(false)
const editingSupplier = ref(null)

const filteredSuppliers = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.suppliers
  return props.suppliers.filter((s) =>
    [s.supplier_name, s.company_name, s.company_phone, s.company_address]
      .some((v) => (v ?? '').toString().toLowerCase().includes(q))
  )
})

function openCreate() {
  editingSupplier.value = null
  showModal.value = true
}

function openEdit(supplier) {
  editingSupplier.value = supplier
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingSupplier.value = null
}

function onSaved() {
  router.reload({ only: ['suppliers'] })
}

async function destroy(supplier) {
  const ok = await confirmDelete({
    title: 'Delete this supplier?',
    text: `${supplier.supplier_name} will be removed. This cannot be undone.`,
  })
  if (ok) {
    router.delete(route('admin.suppliers.destroy', supplier.id), { preserveScroll: true })
  }
}
</script>

<style scoped>
@media (min-width: 768px) {
  .suppliers-admin-page :deep(.dt-table th.dt-actions-col),
  .suppliers-admin-page :deep(.dt-table td.dt-actions-col) {
    width: 112px;
    text-align: center;
  }
  .suppliers-admin-page :deep(.dt-actions) {
    justify-content: center;
    flex-wrap: nowrap;
  }
}
</style>
