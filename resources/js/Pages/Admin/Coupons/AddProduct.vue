<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader
        :title="`Products for ${coupon.code}`"
        subtitle="Tick the products this coupon can be used against"
        :breadcrumbs="[{ label: 'Coupons', href: route('admin.coupons.index') }, { label: coupon.code }]"
      >
        <template #actions>
          <a :href="route('admin.coupons.index')" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
            <ArrowLeft :size="16" class="me-1" /> Back to coupons
          </a>
          <button
            type="button"
            class="btn btn-fig-danger btn-fig-sm d-inline-flex align-items-center"
            :disabled="!linkedCount"
            @click="removeAll"
          >
            <Trash2 :size="16" class="me-1" /> Remove all
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search products…"
            :per-page="pageSize"
            :selected-count="selected.length"
            @update:per-page="pageSize = Number($event)"
            @clear-selection="selected = []"
          >
            <template #bulk>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="saving" @click="save">
                {{ saving ? 'Saving…' : `Apply to ${selected.length} product${selected.length === 1 ? '' : 's'}` }}
              </button>
            </template>
          </Toolbar>

          <DataTable
            v-model:selected="selected"
            :columns="columns"
            :rows="rows"
            :sort="sort"
            selectable
            empty-title="No products found"
            empty-message="Try a different search term."
            empty-variant="filtered"
            @sort="onSort"
          >
            <template #cell-product_name="{ row }">
              <span class="fw-semibold">{{ row.product_name }}</span>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>

        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="text-muted small">
            {{ selected.length }} of {{ products.length }} selected
          </span>
          <button type="button" class="btn btn-fig-primary btn-fig-md" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Save selection' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { ArrowLeft, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  products: { type: Array, default: () => [] },
  coupon: { type: Object, required: true },
})

const columns = [
  { key: 'product_name', label: 'Product', sortable: true },
  { key: 'product_code', label: 'Code', sortable: true },
]

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'products'),
  { searchKeys: ['product_name', 'product_code'], perPage: 20 }
)

// Seed the selection from the products already attached to this coupon.
const linkedIds = (props.coupon.products ?? []).map((p) => p.id)
const selected = ref([...linkedIds])
const linkedCount = computed(() => linkedIds.length)

const saving = ref(false)

function save() {
  saving.value = true
  router.post(
    route('admin.coupons.store.product'),
    { coupon_id: props.coupon.id, product_ids: selected.value },
    { preserveScroll: true, onFinish: () => (saving.value = false) }
  )
}

async function removeAll() {
  const ok = await confirmDelete({
    title: 'Remove all products from this coupon?',
    text: `${props.coupon.code} will no longer apply to any product.`,
    confirmButtonText: 'Remove all',
  })
  if (!ok) return

  router.delete(route('admin.coupons.delete.coupon.product', props.coupon.id), {
    data: { coupon_id: props.coupon.id, product_ids: props.products.map((p) => p.id).join(',') },
    preserveScroll: true,
    onSuccess: () => (selected.value = []),
  })
}
</script>
