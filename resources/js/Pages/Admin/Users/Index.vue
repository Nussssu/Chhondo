<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Customers" subtitle="Everyone who has registered on the storefront" />

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search by name, email or phone…"
          />

          <DataTable
            :columns="columns"
            :rows="users.data ?? []"
            empty-title="No customers found"
            :empty-message="search
              ? 'Try a different search term.'
              : 'Customers appear here once they register.'"
            :empty-variant="search ? 'filtered' : 'empty'"
          >
            <template #cell-name="{ row }">
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="avatarFor(row)"
                  width="32"
                  height="32"
                  class="user-avatar flex-shrink-0"
                  alt=""
                  loading="lazy"
                />
                <div class="min-w-0">
                  <div class="fw-semibold text-truncate">{{ row.name }}</div>
                  <div class="text-muted small text-truncate">{{ row.email }}</div>
                </div>
              </div>
            </template>

            <template #cell-phone="{ row }">
              {{ row.phone || '—' }}
              <span v-if="row.ip_address" class="d-block text-muted small">{{ row.ip_address }}</span>
            </template>

            <template #cell-is_block="{ row }">
              <StatusPill
                :tone="row.is_block ? 'danger' : 'success'"
                :label="row.is_block ? 'Blocked' : 'Active'"
                :dot="false"
              />
            </template>

            <template #cell-orders_count="{ row }">
              {{ row.orders_count ?? 0 }}
            </template>

            <template #actions="{ row }">
              <button type="button" class="table-icon-btn is-primary" title="View customer" @click="openView(row)">
                <Eye :size="14" />
              </button>
              <template v-if="!isAdmin(row)">
                <button
                  type="button"
                  class="table-icon-btn"
                  :title="row.is_block ? 'Unblock customer' : 'Block customer'"
                  @click="toggleBlock(row)"
                >
                  <ShieldCheck v-if="row.is_block" :size="14" />
                  <ShieldBan v-else :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Delete customer" @click="deleteUser(row)">
                  <Trash2 :size="14" />
                </button>
              </template>
            </template>
          </DataTable>

          <Pagination :paginator="users" :only="['users']" />
        </div>
      </div>
    </div>

    <!-- Customer View Modal -->
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
        <h6 class="fw-bold mb-2">Order History <span class="text-muted">({{ viewData.orders.length }})</span></h6>
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
        <div class="d-flex justify-content-between align-items-center mt-2" v-if="productPageCount > 1">
          <small class="text-muted">Page {{ productPage }} of {{ productPageCount }}</small>
          <div class="btn-group">
            <button class="btn btn-fig-sm btn-fig-secondary" :disabled="productPage === 1" @click="productPage--">Prev</button>
            <button class="btn btn-fig-sm btn-fig-secondary" :disabled="productPage === productPageCount" @click="productPage++">Next</button>
          </div>
        </div>
      </div>
    </FormModal>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { router } from '@inertiajs/vue3'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Eye, ShieldBan, ShieldCheck, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  users: Object,
})

const columns = [
  { key: 'name',         label: 'Customer' },
  { key: 'phone',        label: 'Phone / IP' },
  { key: 'is_block',     label: 'Status' },
  { key: 'orders_count', label: 'Orders', align: 'right' },
]

const avatarFor = (row) =>
  row.image
    ? `/${row.image}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name ?? 'C')}&background=e6efdd&color=234011`

async function deleteUser(item) {
  const ok = await confirmDelete({
    title: 'Delete this customer?',
    text: `${item.name} and their account data will be removed. This cannot be undone.`,
  })
  if (ok) router.delete(route('users.delete', { id: item.id }), { preserveScroll: true })
}

// Was a <form method="POST"> per row, which made a full page load and lost
// scroll position on every block/unblock.
function toggleBlock(item) {
  router.patch(route('users.toggle-block', item.id), {}, { preserveScroll: true, preserveState: true })
}

// Seed the controls from the current URL so the state survives navigation.
const initialParams = new URLSearchParams(window.location.search)
const search = ref(initialParams.get('search') ?? '')

const isAdmin = (item) => Array.isArray(item.role_names) && item.role_names.includes('Admin')

// Server-side search (debounced) so results cover the whole dataset, not just
// the current page.
let debounce = null
function applyQuery() {
  router.get(
    route('users'),
    { search: search.value || undefined },
    { preserveState: true, replace: true, preserveScroll: true }
  )
}

watch(search, () => {
  clearTimeout(debounce)
  debounce = setTimeout(applyQuery, 400)
})

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
</style>
