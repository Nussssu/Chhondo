<template>
  <AdminLayout>
    <div class="page-content messages-page">
      <PageHeader
        title="Messages"
        :subtitle="unreadCount ? `${unreadCount} unread` : 'All messages read'"
      />

      <div class="lead-summary">
        <article v-for="card in summaryCards" :key="card.label" class="lead-card">
          <span class="lead-card-icon" :class="card.status"><component :is="card.icon" :size="19" /></span>
          <div><strong>{{ card.count }}</strong><span>{{ card.label }}</span></div>
        </article>
      </div>

      <div class="lead-filter-row">
        <div class="lead-tabs" role="group" aria-label="Lead status filters">
          <button v-for="tab in statusTabs" :key="tab.value" type="button" :class="{ 'is-active': activeStatus === tab.value }" @click="activeStatus = tab.value">
            {{ tab.label }} <span>{{ tab.count }}</span>
          </button>
        </div>
        <div class="lead-dates">
          <label>From<input v-model="dateFrom" type="date" :max="dateTo || undefined" /></label>
          <label>To<input v-model="dateTo" type="date" :min="dateFrom || undefined" /></label>
          <button v-if="dateFrom || dateTo" class="date-reset" type="button" @click="dateFrom = ''; dateTo = ''">Clear</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search leads…"
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
            <template #cell-status="{ row }">
              <select class="lead-status" :class="statusOf(row)" :value="statusOf(row)" :disabled="savingIds.has(row.id)" :aria-label="`Status for ${row.name}`" @change="updateStatus(row, $event.target.value)">
                <option v-for="status in leadStatuses" :key="status.value" :value="status.value">{{ status.label }}</option>
              </select>
            </template>

            <template #cell-name="{ row }">
              <div class="lead-name" :class="{ 'is-unread': !row.is_read }">
                <span class="lead-avatar">
                  {{ (row.name || '?').charAt(0).toUpperCase() }}
                  <span v-if="!row.is_read" class="lead-dot" aria-hidden="true"></span>
                </span>
                <div><strong>{{ row.name }}</strong><span v-if="!row.is_read" class="unread-label">● Unread</span></div>
              </div>
            </template>

            <template #cell-contact="{ row }"><div class="lead-contact"><a :href="`mailto:${row.email}`" :title="row.email">{{ row.email }}</a><a v-if="row.phone" :href="`tel:${row.phone}`">{{ row.phone }}</a></div></template>

            <template #cell-subject="{ row }"><div class="lead-subject" :title="row.subject || row.message">{{ row.subject || row.message || 'Contact enquiry' }}</div></template>

            <template #cell-created_at="{ value }">
              <div class="lead-received"><span>{{ formatDay(value) }}</span><small>{{ formatTime(value) }}</small></div>
            </template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="Read message" @click="open(row)">
                <Eye :size="14" />
              </button>
              <a class="table-icon-btn" title="Reply by email" :href="replyHref(row)"><Reply :size="14" /></a>
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

        <p class="msg-label">Status</p>
        <select
          class="lead-status lead-status--modal mb-3"
          :class="statusOf(reading)"
          :value="statusOf(reading)"
          :disabled="savingIds.has(reading.id)"
          aria-label="Lead status"
          @change="updateStatus(reading, $event.target.value)"
        >
          <option v-for="status in leadStatuses" :key="status.value" :value="status.value">{{ status.label }}</option>
        </select>

        <p class="msg-label">Message</p>
        <div class="msg-body">{{ reading.message }}</div>

        <template #footer>
          <button type="button" class="btn btn-fig-danger btn-fig-sm" @click="destroy(reading)">Delete</button>
          <a :href="replyHref(reading)" class="btn btn-fig-primary btn-fig-sm">Reply by email</a>
        </template>
      </FormModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import FormModal from '@/components/Admin/FormModal.vue'
import axios from 'axios'
import { Eye, Trash2, Reply, Users, Mail, PhoneCall, BadgeCheck, CircleCheck } from 'lucide-vue-next'

const props = defineProps({
  messages: { type: Array, default: () => [] },
})

const columns = [
  { key: 'name', label: 'Lead', width: '18%', sortable: true },
  { key: 'contact', label: 'Contact', width: '22%' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status', width: '118px' },
  { key: 'created_at', label: 'Received', width: '145px', sortable: true },
]

const leadStatuses = [{ value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'qualified', label: 'Qualified' }, { value: 'converted', label: 'Converted' }]
const activeStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const savingIds = ref(new Set())
const statusOf = (row) => row.status || 'new'
const dateFiltered = computed(() => props.messages.filter((row) => {
  const day = String(row.created_at || '').slice(0, 10)
  return (!dateFrom.value || day >= dateFrom.value) && (!dateTo.value || day <= dateTo.value)
}))
const statusTabs = computed(() => [{ value: '', label: 'All', count: dateFiltered.value.length }, ...leadStatuses.map((status) => ({ ...status, count: dateFiltered.value.filter((row) => statusOf(row) === status.value).length }))])
const summaryCards = computed(() => [{ label: 'Total Leads', count: dateFiltered.value.length, icon: Users, status: 'total' }, ...leadStatuses.map((status, i) => ({ label: status.label, count: dateFiltered.value.filter((row) => statusOf(row) === status.value).length, icon: [Mail, PhoneCall, BadgeCheck, CircleCheck][i], status: status.value }))])
function replyHref(row) {
  return `mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject || 'Your contact enquiry'}`)}`
}
async function updateStatus(row, status) {
  savingIds.value.add(row.id)
  try {
    const response = await axios.patch(route('admin.contact-messages.status', row.id), { status })
    row.status = response.data.status
    toast('success', 'Lead status updated')
  } catch {
    toast('error', 'Could not update lead status')
  } finally { savingIds.value.delete(row.id) }
}

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
  const list = dateFiltered.value.filter((row) => (!activeStatus.value || statusOf(row) === activeStatus.value) && (!unreadOnly.value || !row.is_read))
  return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(visible, {
  searchKeys: ['name', 'email', 'phone', 'subject', 'message'],
  perPage: 20,
})

watch([activeStatus, dateFrom, dateTo, unreadOnly], () => { page.value = 1 })

const formatDay = (value) => value
  ? new Date(value).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—'
const formatTime = (value) => value
  ? new Date(value).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })
  : ''

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
  try {
    await axios.delete(route('admin.contact-messages.destroy', row.id))
    router.reload({ only: ['messages', 'adminUnreadMessageCount'] })
    toast('success', 'Message deleted')
  } catch { toast('error', 'Could not delete the message. Please try again.') }
}
</script>

<style scoped>
.messages-page { min-width: 0; }
.lead-summary { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
.lead-card { display: flex; align-items: center; gap: 10px; padding: 15px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--surface); box-shadow: var(--el-1); }
.lead-card-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border-radius: 10px; color: var(--admin-green-700); background: var(--accent-soft, #e6efdd); }
.lead-card-icon.new { color: #b45309; background: #fef3c7; }
.lead-card-icon.contacted { color: #2563eb; background: #dbeafe; }
.lead-card-icon.qualified { color: #7c3aed; background: #ede9fe; }
.lead-card-icon.converted { color: #15803d; background: #dcfce7; }
.lead-card div { min-width: 0; display: grid; gap: 2px; }
.lead-card strong { font-size: 23px; line-height: 1.1; color: var(--text); }
.lead-card div span { font-size: 11px; color: var(--text-muted); }
.lead-filter-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.lead-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.lead-tabs button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--text-muted); font-size: 12px; }
.lead-tabs button.is-active { background: var(--admin-green-600); border-color: var(--admin-green-600); color: #fff; }
.lead-tabs button span { padding: 1px 5px; border-radius: 999px; background: rgba(128, 128, 128, .12); font-size: 10px; }
.lead-dates { display: flex; align-items: flex-end; gap: 7px; flex-wrap: wrap; }
.lead-dates label { display: grid; gap: 3px; color: var(--text-muted); font-size: 10px; }
.lead-dates input { height: 33px; max-width: 145px; padding: 5px 8px; border: 1px solid var(--line-strong); border-radius: var(--r-sm); background: var(--surface); color: var(--text); font-size: 12px; }
.date-reset { height: 33px; border: 0; background: none; color: var(--admin-green-600); font-size: 12px; }
.messages-page :deep(.card-body) { padding: 12px; }
.messages-page :deep(.dt-table) { table-layout: fixed; }
.messages-page :deep(.dt-table th), .messages-page :deep(.dt-table td) {
  padding: 10px 8px !important;
  text-align: left !important;
  vertical-align: middle !important;
}
/* View, reply and delete stay on one line. */
.messages-page :deep(.dt-actions-col) { width: 112px; }
.messages-page :deep(.dt-actions) { gap: 3px; flex-wrap: nowrap !important; }
.messages-page :deep(.dt-actions),
.messages-page .lead-name { justify-content: flex-start !important; }
.messages-page :deep(.dt-actions) { margin-inline: 0 !important; }
.messages-page .lead-status { text-align: left !important; }
.lead-name { display: flex; gap: 8px; align-items: center; min-width: 0; }
.lead-avatar { display: grid; place-items: center; width: 30px; height: 30px; flex: 0 0 30px; border-radius: 50%; background: var(--surface-sunk); color: var(--admin-green-700); font-weight: 700; }
.lead-name div { display: grid; min-width: 0; }
.lead-name strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.unread-label { font-size: 10px; color: #b45309; font-weight: 600; }
/* Unread leads stand out: gold edge on the row, a dot on the avatar. */
.messages-page :deep(tr:has(.lead-name.is-unread)) td:first-child { box-shadow: inset 3px 0 0 var(--admin-gold, #cc9b25); }
.lead-name.is-unread strong { font-weight: 800; }
.lead-avatar { position: relative; }
.lead-dot { position: absolute; top: -1px; right: -1px; width: 9px; height: 9px; border: 2px solid var(--surface); border-radius: 50%; background: var(--admin-gold, #cc9b25); }
.lead-received { display: grid; line-height: 1.3; }
.lead-received span { white-space: nowrap; }
.lead-received small { color: var(--text-muted); font-size: 11px; }
.lead-status--modal { max-width: 180px; padding: 6px 10px; }
.lead-contact { display: grid; gap: 2px; min-width: 0; }
.lead-contact a { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text-muted); text-decoration: none; font-size: 11px; }
.lead-contact a:hover { color: var(--admin-green-600); text-decoration: underline; }
.lead-subject { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; font-size: 12px; }
.lead-status { width: 100%; max-width: 110px; padding: 4px 5px; border: 1px solid transparent; border-radius: 999px; font-size: 11px; font-weight: 600; cursor: pointer; }
.lead-status.new { background: #fef3c7; color: #b45309; }
.lead-status.contacted { background: #dbeafe; color: #2563eb; }
.lead-status.qualified { background: #ede9fe; color: #7c3aed; }
.lead-status.converted { background: #dcfce7; color: #15803d; }
.lead-status option { background: #fff; color: #1a1817; }
.lead-status:disabled { opacity: .6; }
@media (max-width: 1100px) { .lead-summary { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) { .lead-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } .messages-page :deep(.dt-actions-col) { width: 100%; } .lead-contact { max-width: 70%; } }
/* Phones: two cards a row, Total Leads across the top. */
@media (max-width: 767px) { .lead-card:first-child { grid-column: 1 / -1; } }
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
