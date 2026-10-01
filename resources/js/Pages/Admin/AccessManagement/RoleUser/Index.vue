<template>
  <AdminLayout>
    <div class="page-content">
      <SettingsTabs :tabs="ACCESS_TABS" />
      <PageHeader title="Admin users" subtitle="People who can sign in to the admin panel">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add admin user
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search by name, email or role…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          />

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No admin users yet"
            empty-message="Add a user and assign them a role to give them access."
            :empty-variant="search ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-name="{ row }">
              <span class="fw-semibold">{{ row.name }}</span>
              <span class="d-block text-muted small">{{ row.email }}</span>
            </template>

            <template #cell-role="{ row }">
              <StatusPill
                v-if="roleOf(row)"
                :tone="roleOf(row) === 'Super Admin' ? 'progress' : 'info'"
                :label="roleOf(row)"
                :dot="false"
              />
              <span v-else class="text-muted">No role</span>
            </template>

            <template #actions="{ row }">
              <template v-if="roleOf(row) !== 'Super Admin'">
                <button type="button" class="table-icon-btn is-primary" title="Edit user" @click="openEdit(row)">
                  <Pencil :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Delete user" @click="destroy(row)">
                  <Trash2 :size="14" />
                </button>
              </template>
              <span v-else class="text-muted small">Locked</span>
            </template>

            <template #empty-action>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="openCreate">
                <Plus :size="16" class="me-1" /> Add admin user
              </button>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>

      <AdminUserModal v-if="modalOpen" :admin="editing" :roles="roles" @close="closeModal" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { ACCESS_TABS } from '@/settingsTabs'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import AdminUserModal from './Partials/AdminUserModal.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  admins: { type: Array, default: () => [] },
  roles: { type: Array, default: () => [] },
})

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(admin) {
  editing.value = admin
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

const columns = [
  { key: 'name', label: 'User', sortable: true },
  { key: 'role', label: 'Role' },
]

const roleOf = (row) => row.roles?.[0]?.name ?? ''

// Flatten the role onto the row so it can be searched and sorted like a column.
const enriched = computed(() =>
  props.admins.map((a) => ({ ...a, role: roleOf(a) }))
)

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(enriched, {
  searchKeys: ['name', 'email', 'role'],
  perPage: 10,
})

async function destroy(row) {
  const ok = await confirmDelete({
    title: 'Delete this admin user?',
    text: `${row.name} will lose access to the admin panel.`,
  })
  if (ok) router.delete(route('role-user.destroy', row.id), { preserveScroll: true })
}
</script>
