<template>
  <AdminLayout>
    <div class="page-content">
      <SettingsTabs :tabs="ACCESS_TABS" />
      <PageHeader title="Roles &amp; permissions" subtitle="What each role is allowed to do in the admin panel">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Create role
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search roles…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          />

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No roles yet"
            empty-message="Create a role to control what your team can access."
            :empty-variant="search ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-name="{ row }">
              <span class="fw-semibold">{{ row.name }}</span>
              <span v-if="row.name === 'Super Admin'" class="d-block text-muted small">Full access — cannot be edited</span>
            </template>

            <template #cell-permissions="{ row }">
              <div v-if="row.permissions?.length" class="perm-list">
                <span v-for="p in row.permissions" :key="p.id" class="perm-chip">{{ p.name }}</span>
              </div>
              <span v-else class="text-muted">No permissions assigned</span>
            </template>

            <template #actions="{ row }">
              <template v-if="row.name !== 'Super Admin'">
                <button type="button" class="table-icon-btn is-primary" title="Edit role" @click="openEdit(row)">
                  <Pencil :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Delete role" @click="destroy(row)">
                  <Trash2 :size="14" />
                </button>
              </template>
              <span v-else class="text-muted small">Locked</span>
            </template>

            <template #empty-action>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
                <Plus :size="16" class="me-1" /> Create role
              </button>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>

      <RoleModal v-if="modalOpen" :role="editing" :permissions="permissions" @close="closeModal" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { ACCESS_TABS } from '@/settingsTabs'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import RoleModal from './Partials/RoleModal.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  roles: { type: Array, default: () => [] },
  permissions: { type: Object, default: () => ({}) },
})

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(role) {
  editing.value = role
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

const columns = [
  { key: 'name',        label: 'Role', sortable: true, width: '220px' },
  { key: 'permissions', label: 'Permissions' },
]

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'roles'),
  { searchKeys: ['name'], perPage: 10 }
)

// Deleting a role previously submitted a bare form with no confirmation at
// all — one stray click removed a role and everyone's access with it.
async function destroy(row) {
  const ok = await confirmDelete({
    title: `Delete the “${row.name}” role?`,
    text: 'Users assigned to this role will lose its permissions.',
  })
  if (ok) router.delete(route('role-permission.destroy', row.id), { preserveScroll: true })
}
</script>

<style scoped>
.perm-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.perm-chip {
  padding: 2px 8px;
  border-radius: var(--r-full);
  background: var(--st-info-soft);
  color: var(--st-info);
  font-size: var(--fs-xs);
  font-weight: 500;
  white-space: nowrap;
}
</style>
