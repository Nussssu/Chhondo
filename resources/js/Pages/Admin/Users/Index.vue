<template>
  <AdminLayout>
    <div class="page-content customers-page">
      <PageHeader
        title="Customers"
        :subtitle="`${counts.all ?? 0} registered · ${counts.active ?? 0} active · ${counts.blocked ?? 0} blocked`"
      />

      <!-- Status tabs and the joined-date range -->
      <div class="cu-filter-row">
        <div class="cu-tabs" role="group" aria-label="Customer status">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            type="button"
            :class="{ 'is-active': status === tab.value }"
            @click="status = tab.value"
          >
            {{ tab.label }} <span>{{ tab.count }}</span>
          </button>
        </div>
        <div class="cu-dates">
          <label>Joined from<input v-model="from" type="date" :max="to || undefined" /></label>
          <label>To<input v-model="to" type="date" :min="from || undefined" /></label>
          <button v-if="from || to" type="button" class="cu-date-reset" @click="from = ''; to = ''">Clear</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search customers…"
            :per-page="perPage"
            @update:per-page="perPage = Number($event)"
          >
            <template #filters>
              <!-- Sorting for small screens, where the column headers collapse -->
              <select v-model="sortChoice" class="form-select cu-sort" aria-label="Sort customers">
                <option v-for="o in SORTS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </template>
          </Toolbar>

          <DataTable
            :columns="columns"
            :rows="users.data ?? []"
            :sort="sort"
            empty-title="No customers found"
            :empty-message="hasFilters ? 'Try a different search or filter.' : 'Customers appear here once they register.'"
            :empty-variant="hasFilters ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-name="{ row }">
              <div class="cu-person">
                <img :src="avatarFor(row)" width="32" height="32" class="cu-avatar" alt="" loading="lazy" @error="onAvatarError($event, row)" />
                <div class="cu-person-text">
                  <strong>{{ row.name }}</strong>
                  <span>{{ row.email }}</span>
                  <span v-if="row.phone" class="cu-phone">{{ row.phone }}</span>
                </div>
              </div>
            </template>

            <template #cell-created_at="{ value }">
              <span class="cu-date">{{ formatDay(value) }}</span>
            </template>

            <template #cell-orders_count="{ row }">
              <span class="cu-num">{{ row.orders_count ?? 0 }}</span>
            </template>

            <template #cell-lifetime_spend="{ row }">
              <span class="cu-num">{{ money(row.lifetime_spend) }}</span>
            </template>

            <template #cell-last_order_at="{ value }">
              <span class="cu-date" :class="{ 'is-none': !value }">{{ value ? formatDay(value) : 'No orders' }}</span>
            </template>

            <template #cell-is_block="{ row }">
              <StatusPill
                :tone="row.is_block ? 'danger' : 'success'"
                :label="row.is_block ? 'Blocked' : 'Active'"
              />
            </template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="View orders" @click="openView(row)">
                <ShoppingBag :size="14" />
              </button>
                <button type="button" class="table-icon-btn" :disabled="isAdmin(row)" :title="isAdmin(row) ? 'Admin accounts are edited under Profile settings' : 'Edit customer'" @click="openEdit(row)">
                  <Pencil :size="14" />
                </button>
                <button type="button" class="table-icon-btn" :disabled="isAdmin(row)" :title="isAdmin(row) ? 'Admin passwords are changed under Profile settings' : 'Send password reset link'" @click="resetPassword(row)">
                  <KeyRound :size="14" />
                </button>
                <button
                  type="button"
                  class="table-icon-btn"
                  :disabled="isAdmin(row)"
                  :title="isAdmin(row) ? 'Admin accounts cannot be blocked' : (row.is_block ? 'Unblock customer' : 'Block customer')"
                  @click="toggleBlock(row)"
                >
                  <ShieldCheck v-if="row.is_block" :size="14" />
                  <ShieldBan v-else :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" :disabled="isAdmin(row)" :title="isAdmin(row) ? 'Admin accounts cannot be deleted' : 'Delete customer'" @click="deleteUser(row)">
                  <Trash2 :size="14" />
                </button>
            </template>
          </DataTable>

          <Pagination :paginator="users" :only="['users', 'counts', 'filters']" />
        </div>
      </div>
    </div>

    <!-- Edit customer -->
    <FormModal v-if="editing" title="Edit customer" :subtitle="editing.email" @close="editing = null">
      <form id="cu-edit-form" class="cu-edit" @submit.prevent="saveEdit">
        <label class="form-label" for="cu-name">Name</label>
        <input id="cu-name" v-model="editForm.name" type="text" class="form-control" required />
        <p v-if="editForm.errors.name" class="cu-error">{{ editForm.errors.name }}</p>

        <label class="form-label mt-3" for="cu-email">Email</label>
        <input id="cu-email" v-model="editForm.email" type="email" class="form-control" required />
        <p v-if="editForm.errors.email" class="cu-error">{{ editForm.errors.email }}</p>

        <label class="form-label mt-3" for="cu-phone">Phone</label>
        <input id="cu-phone" v-model="editForm.phone" type="text" class="form-control" />
        <p v-if="editForm.errors.phone" class="cu-error">{{ editForm.errors.phone }}</p>
      </form>
      <template #footer>
        <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="editing = null">Cancel</button>
        <button type="submit" form="cu-edit-form" class="btn btn-fig-primary btn-fig-sm" :disabled="editForm.processing">
          {{ editForm.processing ? 'Saving…' : 'Save changes' }}
        </button>
      </template>
    </FormModal>

    <FormModal v-if="viewOpen" size="xl" :show-footer="false" title="Customer Details" @close="closeView">
      <div v-if="loadingView" class="text-center py-5 text-muted">Loading…</div>

      <div v-else-if="viewData">
        <!-- Customer info -->
        <div class="d-flex align-items-center gap-3 mb-4">
          <img :src="viewData.customer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewData.customer.name)}`"
               width="64" height="64" class="user-avatar" />
          <div>
            <h5 class="mb-1 fw-bold">{{ viewData.customer.name }}</h5>
            <span v-if="viewData.customer.is_block" class="badge bg-danger">Blocked</span>
            <span v-else class="badge bg-success">Active</span>
          </div>
        </div>

        <!-- Profile fields -->
        <div class="row g-3 mb-4">
          <div class="col-md-4"><small class="text-muted d-block">Email</small>{{ viewData.customer.email || 'N/A' }}</div>
          <div class="col-md-4"><small class="text-muted d-block">Phone</small>{{ viewData.customer.phone || 'N/A' }}</div>
          <div class="col-md-4"><small class="text-muted d-block">IP Address</small>{{ viewData.customer.ip_address || 'N/A' }}</div>
          <div class="col-md-4"><small class="text-muted d-block">Date of Birth</small>{{ viewData.customer.date_of_birth || 'N/A' }}</div>
          <div class="col-md-4"><small class="text-muted d-block">Joined</small>{{ viewData.customer.joined || 'N/A' }}</div>
        </div>

        <!-- Aggregate tiles -->
        <div class="row g-2 mb-4">
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num">{{ viewData.customer.orders_count ?? 0 }}</span><span class="stat-lbl">Total Orders</span></div></div>
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num text-success">{{ viewData.customer.delivered_orders ?? 0 }}</span><span class="stat-lbl">Delivered</span></div></div>
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num text-danger">{{ viewData.customer.canceled_orders ?? 0 }}</span><span class="stat-lbl">Cancelled</span></div></div>
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num">{{ viewData.customer.total_spent ?? 0 }}৳</span><span class="stat-lbl">Total Spent</span></div></div>
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num">{{ viewData.customer.wishlist_count ?? 0 }}</span><span class="stat-lbl">Wishlist</span></div></div>
          <div class="col-6 col-md"><div class="stat-tile"><span class="stat-num">{{ viewData.customer.address_count ?? 0 }}</span><span class="stat-lbl">Addresses</span></div></div>
        </div>

        <!-- Addresses -->
        <h6 class="fw-bold mb-2">Addresses <span class="text-muted">({{ viewData.addresses.length }})</span></h6>
        <div v-if="viewData.addresses.length" class="row g-2 mb-4">
          <div v-for="(a, i) in viewData.addresses" :key="i" class="col-md-6">
            <div class="address-box">
              <div class="d-flex justify-content-between">
                <strong>{{ a.name || 'N/A' }}</strong>
                <span>
                  <span v-if="a.type" class="badge bg-light text-dark text-capitalize me-1">{{ a.type }}</span>
                  <span v-if="a.is_default" class="badge bg-success">Default</span>
                </span>
              </div>
              <div class="small text-muted">{{ [a.address, a.city].filter(Boolean).join(', ') || 'N/A' }}</div>
              <div class="small">{{ a.phone || '' }}</div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted small mb-4">No saved addresses.</p>

        <!-- Order history -->
        <h6 id="cu-order-history" class="fw-bold mb-2">Order History <span class="text-muted">({{ viewData.orders.length }})</span></h6>
        <div class="orders-table-wrapper mb-4">
          <table class="table table-striped table-hover orders-table-compact">
            <thead>
              <tr><th>Invoice</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="(o, i) in viewData.orders" :key="i">
                <td>{{ o.invoice || 'N/A' }}</td>
                <td>{{ o.date }}</td>
                <td>{{ o.items_count }}</td>
                <td>{{ o.total_price }}৳</td>
                <td><span class="badge bg-secondary text-capitalize">{{ o.status }}</span></td>
              </tr>
              <tr v-if="!viewData.orders.length"><td colspan="5" class="text-center text-muted py-3">No orders yet.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Wishlist -->
        <h6 class="fw-bold mb-2">Wishlist <span class="text-muted">({{ viewData.wishlist.length }})</span></h6>
        <div v-if="viewData.wishlist.length" class="d-flex flex-wrap gap-2 mb-4">
          <div v-for="(w, i) in viewData.wishlist" :key="i" class="wishlist-chip">
            <img v-if="w.image" :src="w.image" width="28" height="28" style="object-fit:cover;border-radius:4px;" />
            <span>{{ w.product_name }}</span>
            <small class="text-muted">{{ w.price }}৳</small>
          </div>
        </div>
        <p v-else class="text-muted small mb-4">Wishlist is empty.</p>

        <!-- Purchased products -->
        <h6 class="fw-bold mb-2">Purchased Products <span class="text-muted">({{ viewData.products.length }})</span></h6>
        <div class="orders-table-wrapper">
          <table class="table table-striped table-hover orders-table-compact">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Invoice</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in pagedProducts" :key="i">
                <td>{{ (productPage - 1) * PRODUCTS_PER_PAGE + i + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img v-if="p.image" :src="p.image" width="32" height="32" style="object-fit:cover;border-radius:4px;" />
                    <span>{{ p.product_name }}</span>
                  </div>
                </td>
                <td>{{ p.price }}৳</td>
                <td>{{ p.quantity }}</td>
                <td>{{ p.invoice || 'N/A' }}</td>
                <td><span class="badge bg-secondary text-capitalize">{{ p.order_status }}</span></td>
                <td>{{ p.date }}</td>
              </tr>
              <tr v-if="!viewData.products.length">
                <td colspan="7" class="text-center text-muted py-3">No purchases yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Products pagination (10 per page) -->
        <Pagination
          v-if="productPageCount > 1"
          v-model:page="productPage"
          :per-page="PRODUCTS_PER_PAGE"
          :total-items="viewData.products.length"
        />
      </div>
    </FormModal>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { ShieldBan, ShieldCheck, Trash2, ShoppingBag, Pencil, KeyRound } from 'lucide-vue-next'

const props = defineProps({
  users: Object,
  counts: { type: Object, default: () => ({}) },
  filters: { type: Object, default: () => ({}) },
})

const columns = [
  { key: 'name',           label: 'Customer', sortable: true },
  { key: 'created_at',     label: 'Joined', sortable: true, align: 'center', width: '110px' },
  { key: 'orders_count',   label: 'Orders', sortable: true, align: 'center', width: '80px' },
  { key: 'lifetime_spend', label: 'Lifetime Spend', sortable: true, align: 'center', width: '130px' },
  { key: 'last_order_at',  label: 'Last Order', sortable: true, align: 'center', width: '115px' },
  { key: 'is_block',       label: 'Status', align: 'center', width: '100px' },
]

const avatarFor = (row) =>
  row.image
    ? (/^(https?:)?\/\//.test(row.image) ? row.image : `/${String(row.image).replace(/^\/+/, '')}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name ?? 'C')}&background=e6efdd&color=234011`

// A missing upload falls back to the initials avatar.
function onAvatarError(e, row) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name ?? 'C')}&background=e6efdd&color=234011`
  if (e.target.src !== fallback) e.target.src = fallback
}

const formatDay = (value) => value
  ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—'
const money = (value) => `৳${Math.round(Number(value) || 0).toLocaleString('en-IN')}`

const isAdmin = (item) => Array.isArray(item.role_names) && item.role_names.includes('Admin')

/* ------------------------------------------------- filters and sort -- */
// Everything runs on the server, so search, filters and sort cover every
// customer, not just the page on screen. The URL keeps the state.
// An empty query reaches us as [] (PHP), where `.sort` would be Array#sort.
const f = Array.isArray(props.filters) ? {} : props.filters
const search = ref(f.search ?? '')
const status = ref(f.status ?? '')
const from = ref(f.from ?? '')
const to = ref(f.to ?? '')
const perPage = ref(Number(f.per_page) || 20)
const sort = ref({ key: f.sort || 'created_at', dir: f.dir === 'asc' ? 'asc' : 'desc' })

const statusTabs = computed(() => [
  { value: '', label: 'All', count: props.counts.all ?? 0 },
  { value: 'active', label: 'Active', count: props.counts.active ?? 0 },
  { value: 'blocked', label: 'Blocked', count: props.counts.blocked ?? 0 },
])

const SORTS = [
  { value: 'created_at:desc', label: 'Newest first' },
  { value: 'created_at:asc', label: 'Oldest first' },
  { value: 'lifetime_spend:desc', label: 'Top spenders' },
  { value: 'orders_count:desc', label: 'Most orders' },
  { value: 'last_order_at:desc', label: 'Recent buyers' },
  { value: 'name:asc', label: 'Name A–Z' },
]
const sortChoice = computed({
  get: () => `${sort.value.key}:${sort.value.dir}`,
  set: (v) => { const [key, dir] = v.split(':'); sort.value = { key, dir } },
})

function onSort(next) { sort.value = next }

const hasFilters = computed(() => Boolean(search.value || status.value || from.value || to.value))

function applyQuery() {
  router.get(
    route('users'),
    {
      search: search.value || undefined,
      status: status.value || undefined,
      from: from.value || undefined,
      to: to.value || undefined,
      sort: sort.value.key !== 'created_at' || sort.value.dir !== 'desc' ? sort.value.key : undefined,
      dir: sort.value.key !== 'created_at' || sort.value.dir !== 'desc' ? sort.value.dir : undefined,
      per_page: perPage.value !== 20 ? perPage.value : undefined,
    },
    { preserveState: true, replace: true, preserveScroll: true, only: ['users', 'counts', 'filters'] }
  )
}

let debounce = null
watch(search, () => { clearTimeout(debounce); debounce = setTimeout(applyQuery, 400) })
watch([status, from, to, perPage, () => sort.value.key, () => sort.value.dir], applyQuery)

/* ----------------------------------------------------------- actions -- */
async function deleteUser(item) {
  const ok = await confirmDelete({
    title: 'Delete this customer?',
    text: `${item.name} and their account data will be removed. This cannot be undone.`,
  })
  if (ok) router.delete(route('users.delete', { id: item.id }), { preserveScroll: true })
}

function toggleBlock(item) {
  router.patch(route('users.toggle-block', item.id), {}, { preserveScroll: true, preserveState: true })
}

async function resetPassword(item) {
  const ok = await confirmDelete({
    title: 'Send a password reset link?',
    text: `${item.email} will get an email with a link to choose a new password.`,
    confirmButtonText: 'Send link',
    tone: 'question',
  })
  if (ok) router.post(route('users.reset-password', item.id), {}, { preserveScroll: true, preserveState: true })
}

// Edit
const editing = ref(null)
const editForm = useForm({ name: '', email: '', phone: '' })
function openEdit(item) {
  editForm.clearErrors()
  editForm.name = item.name ?? ''
  editForm.email = item.email ?? ''
  editForm.phone = item.phone ?? ''
  editing.value = item
}
function saveEdit() {
  editForm.patch(route('users.update', editing.value.id), {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => { editing.value = null },
  })
}

// --- Customer view modal ---
const viewOpen = ref(false)
const loadingView = ref(false)
const viewData = ref(null)
const productPage = ref(1)
const PRODUCTS_PER_PAGE = 10

const pagedProducts = computed(() => {
  if (!viewData.value) return []
  const start = (productPage.value - 1) * PRODUCTS_PER_PAGE
  return viewData.value.products.slice(start, start + PRODUCTS_PER_PAGE)
})

const productPageCount = computed(() => {
  if (!viewData.value) return 0
  return Math.ceil(viewData.value.products.length / PRODUCTS_PER_PAGE)
})

// Each opening starts at the top; order history is reached by manual scrolling.
async function openView(item) {
  viewOpen.value = true
  loadingView.value = true
  viewData.value = null
  productPage.value = 1
  try {
    const { data } = await axios.get(route('users.show', { id: item.id }))
    viewData.value = data
  } catch (e) {
    viewData.value = null
  } finally {
    loadingView.value = false
  }
}

function closeView() {
  viewOpen.value = false
  viewData.value = null
}
</script>

<style scoped>


.min-w-0 { min-width: 0; }

.user-card { box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 12px; }
.user-avatar { border-radius: 50%; object-fit: cover; border: 2px solid #ddd; }
.stat-tile {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 10px 6px; height: 100%;
}
.stat-num { font-size: 1.1rem; font-weight: 700; }
.stat-lbl { font-size: 0.7rem; color: #6c757d; text-transform: uppercase; letter-spacing: 0.03em; }
.address-box { border: 1px solid #e9ecef; border-radius: 8px; padding: 10px 12px; height: 100%; }
.wishlist-chip {
  display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid #e9ecef; border-radius: 20px; padding: 4px 10px; font-size: 0.8rem;
}

/* ---- Customers list ---- */
.cu-filter-row {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 10px; margin-bottom: 12px;
}
.cu-tabs {
  display: inline-flex; gap: 4px; padding: 4px;
  background: var(--surface, #fff); border: 1px solid var(--line, #e7e2d6); border-radius: var(--r-md, 10px);
}
.cu-tabs button {
  border: 0; background: transparent; padding: 6px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 600; color: var(--text-muted, #6b6b5f); cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
}
.cu-tabs button span {
  font-size: 11px; padding: 1px 7px; border-radius: 999px; background: rgba(0,0,0,.06);
}
.cu-tabs button.is-active { background: var(--admin-green-600, #4b5a1f); color: #fff; }
.cu-tabs button.is-active span { background: rgba(255,255,255,.22); }
.cu-dates { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.cu-dates label {
  display: inline-flex; align-items: center; gap: 6px; margin: 0;
  font-size: 12px; font-weight: 600; color: var(--text-muted, #6b6b5f);
}
.cu-dates input {
  height: 34px; padding: 0 8px; font-size: 13px;
  border: 1px solid var(--line, #e7e2d6); border-radius: 8px; background: var(--surface, #fff); color: inherit;
}
.cu-date-reset {
  border: 0; background: none; font-size: 12px; font-weight: 600;
  color: var(--admin-green-600, #4b5a1f); text-decoration: underline; cursor: pointer;
}
.cu-sort { height: 34px; font-size: 13px; min-width: 150px; }

.cu-person { display: flex; align-items: center; gap: 10px; min-width: 0; }
.cu-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex: none; }
.cu-person-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.cu-person-text strong { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cu-person-text span { font-size: 12px; color: var(--text-muted, #6b6b5f); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cu-date { font-size: 13px; white-space: nowrap; }
.cu-date.is-none { color: var(--text-muted, #6b6b5f); font-size: 12px; }
.customers-page :deep(.dt-actions) { flex-wrap: nowrap; }
.customers-page :deep(.dt-table thead th.is-center),
.customers-page :deep(.dt-table thead th.dt-actions-col) { text-align: center; }
@media (min-width: 768px) {
  .customers-page :deep(.dt-table tbody td.is-center),
  .customers-page :deep(.dt-table tbody td.dt-actions-col) { text-align: center; }
  .customers-page :deep(.dt-actions) { justify-content: center; }
}
.cu-num { font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }
.cu-error { color: #b42318; font-size: 12px; margin: 4px 0 0; }

@media (max-width: 640px) {
  .cu-filter-row { flex-direction: column; align-items: stretch; }
  .cu-tabs { display: flex; }
  .cu-tabs button { flex: 1; justify-content: center; }
  .cu-dates { display: grid; grid-template-columns: auto 1fr; }
  .cu-dates label { display: contents; }
  .cu-dates input { width: 100%; min-width: 0; }
  .cu-date-reset { grid-column: 2; justify-self: start; }
  .cu-sort { width: 100%; }
}
</style>
