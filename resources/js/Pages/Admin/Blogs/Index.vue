<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Blog posts" :subtitle="subtitle">
        <template #actions>
          <a :href="route('blogs.create')" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center">
            <Plus :size="16" class="me-1" /> Add post
          </a>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search posts…"
            :per-page="pageSize"
            @update:per-page="pageSize = Number($event)"
          />

          <DataTable
            :columns="columns"
            :rows="rows"
            :sort="sort"
            empty-title="No blog posts yet"
            empty-message="Write your first post to start the blog."
            :empty-variant="search ? 'filtered' : 'empty'"
            @sort="onSort"
          >
            <template #cell-title="{ row }">
              <div class="d-flex align-items-center gap-2">
                <img :src="row.image" width="44" height="44" class="rounded flex-shrink-0" alt="" loading="lazy" />
                <span class="fw-semibold">{{ row.title }}</span>
              </div>
            </template>

            <template #cell-blog_category.name="{ value }">
              {{ value || '—' }}
            </template>

            <template #cell-status="{ row }">
              <span
                class="table-pill-btn"
                :class="row.status === 'Draft' ? 'bg-soft-secondary' : 'bg-soft-success'"
              >
                {{ row.status === 'Draft' ? 'Draft' : 'Published' }}
              </span>
            </template>

            <template #actions="{ row }">
              <a :href="route('blogs.edit', row.id)" class="table-icon-btn is-primary" title="Edit post">
                <Pencil :size="14" />
              </a>
              <button type="button" class="table-icon-btn" title="Duplicate post" @click="duplicate(row)">
                <Copy :size="14" />
              </button>
              <button type="button" class="table-icon-btn is-danger" title="Delete post" @click="destroy(row)">
                <Trash2 :size="14" />
              </button>
            </template>

            <template #empty-action>
              <a :href="route('blogs.create')" class="btn btn-fig-primary btn-fig-sm">
                <Plus :size="16" class="me-1" /> Add post
              </a>
            </template>
          </DataTable>

          <Pagination v-model:page="page" :per-page="pageSize" :total-items="total" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useClientTable } from '@/composables/useClientTable'
import { confirmDelete } from '@/utils/confirmDelete'
import { Plus, Pencil, Trash2, Copy } from 'lucide-vue-next'

const props = defineProps({
  blogs: { type: Array, default: () => [] },
})

const columns = [
  { key: 'title',             label: 'Title', sortable: true },
  { key: 'blog_category.name', label: 'Category', sortable: true },
  { key: 'status',            label: 'Status', sortable: true },
]

const subtitle = computed(() => {
  const published = props.blogs.filter((b) => b.status !== 'Draft').length
  const drafts = props.blogs.length - published

  return drafts
    ? `${published} published · ${drafts} draft${drafts === 1 ? '' : 's'}`
    : `${published} published article${published === 1 ? '' : 's'}`
})

const { search, page, pageSize, sort, rows, total, onSort } = useClientTable(
  toRef(props, 'blogs'),
  { searchKeys: ['title', 'blog_category.name', 'status'], perPage: 10 }
)

// Opens the copy in the editor, which is where the operator is heading next.
function duplicate(row) {
  router.post(route('blogs.duplicate', row.id))
}

async function destroy(row) {
  const ok = await confirmDelete({
    title: 'Delete this post?',
    text: `“${row.title}” will be removed. This cannot be undone.`,
  })
  if (ok) router.delete(route('blogs.destroy', row.id), { preserveScroll: true })
}
</script>
