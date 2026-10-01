<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader
        title="Messages"
        :subtitle="unreadCount ? `${unreadCount} unread` : 'All messages read'"
      />

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search by name, email or phone…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          >
            <template #filters>
              <button
                type="button"
                class="btn btn-fig-sm"
                :class="unreadOnly ? 'btn-fig-primary' : 'btn-fig-secondary'"
                :aria-pressed="unreadOnly"
                @click="unreadOnly = !unreadOnly"
              >
                Unread only
              </button>
            </template>
          </Toolbar>

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No messages"
            empty-message="Enquiries sent from the contact page arrive here."
            :empty-variant="search || unreadOnly ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-is_read="{ row }">
              <StatusPill
                :tone="row.is_read ? 'neutral' : 'warning'"
                :label="row.is_read ? 'Read' : 'New'"
                :dot="!row.is_read"
              />
            </template>

            <template #cell-name="{ row }">
              <span class="fw-semibold">{{ row.name }}</span>
              <span class="d-block text-muted small">{{ row.email }}</span>
            </template>

            <template #cell-phone="{ value }">{{ value || '—' }}</template>

            <template #cell-created_at="{ value }">{{ formatDate(value) }}</template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="Read message" @click="open(row)">
                <Eye :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete message" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>

      <FormModal v-if="reading" size="lg" :title="reading.name" :subtitle="formatDate(reading.created_at)" @close="reading = null">
        <dl class="msg-meta">
          <dt>Email</dt>
          <dd><a :href="`mailto:${reading.email}`">{{ reading.email }}</a></dd>
          <template v-if="reading.phone">
            <dt>Phone</dt>
            <dd><a :href="`tel:${reading.phone}`">{{ reading.phone }}</a></dd>
          </template>
        </dl>

        <p class="msg-label">Message</p>
        <div class="msg-body">{{ reading.message }}</div>

        <template #footer>
          <button type="button" class="btn btn-fig-danger btn-fig-sm" @click="destroy(reading)">Delete</button>
          <a :href="`mailto:${reading.email}`" class="btn btn-fig-primary btn-fig-sm">Reply by email</a>
        </template>
      </FormModal>
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
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import FormModal from '@/components/Admin/FormModal.vue'
import axios from 'axios'
import { Eye, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  messages: { type: Array, default: () => [] },
})

const columns = [
  { key: 'is_read',    label: 'Status' },
  { key: 'name',       label: 'From', sortable: true },
  { key: 'phone',      label: 'Phone' },
  { key: 'created_at', label: 'Received', sortable: true, nowrap: true },
]

const reading = ref(null)

// The body already ships with the index payload, so opening a message is
// instant; the request only records that it has been read.
async function open(row) {
  reading.value = row
  if (row.is_read) return
  try {
    await axios.get(route('admin.contact-messages.show', row.id))
    row.is_read = true
    // The sidebar badge is a shared prop, so it needs fetching again — without
    // this it keeps showing the message that was just read.
    router.reload({ only: ['adminUnreadMessageCount'] })
  } catch {
    // Not being able to mark it read should not stop it being read.
  }
}

const unreadOnly = ref(false)
const unreadCount = computed(() => props.messages.filter((m) => !m.is_read).length)

// Newest first by default — the inbox's whole job.
const visible = computed(() => {
  const list = unreadOnly.value ? props.messages.filter((m) => !m.is_read) : props.messages
  return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(visible, {
  searchKeys: ['name', 'email', 'phone'],
  perPage: 20,
})

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-AU', {
    month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

async function destroy(row) {
  const ok = await confirmDelete({
    title: 'Delete this message?',
    text: `The enquiry from ${row.name} will be removed. This cannot be undone.`,
  })
  if (!ok) return

  // Was a raw fetch() followed by window.location.reload(), which threw away
  // the whole page to remove one row.
  reading.value = null
  router.delete(route('admin.contact-messages.destroy', row.id), {
    preserveScroll: true,
    onError: () => toast('error', 'Could not delete the message. Please try again.'),
  })
}
</script>

<style scoped>
.msg-meta {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--sp-1) var(--sp-4);
  margin: 0 0 var(--sp-4);
  font-size: var(--fs-md);
}

.msg-meta dt { color: var(--text-muted); }
.msg-meta dd { margin: 0; }

.msg-label {
  margin: 0 0 var(--sp-2);
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--text-muted);
}

.msg-body {
  padding: var(--sp-3);
  background: var(--surface-sunk);
  border-radius: var(--r-sm);
  white-space: pre-wrap;
  font-size: var(--fs-md);
  line-height: var(--lh-base);
}
</style>
