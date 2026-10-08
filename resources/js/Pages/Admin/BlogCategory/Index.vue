<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Blog categories" subtitle="Group your posts so readers can browse by topic">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add blog category
          </button>
        </template>
      </PageHeader>

      <div class="row g-3 mt-0">
        <!-- Listing -->
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-0">All categories</h6>
                <p class="mb-0 text-muted small">
                  Disabled categories stay hidden from the blog filter.
                </p>
              </div>
              <span class="text-muted small">{{ categories.length }} total</span>
            </div>
            <div class="card-body">
              <div class="table-compact-wrapper">
                <table class="table table-compact align-middle w-100">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Slug</th>
                      <th style="width: 90px;">Posts</th>
                      <th style="width: 120px;">Status</th>
                      <th style="width: 96px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in categories" :key="item.id">
                      <td>
                        <span class="cat-name">{{ item.name }}</span>
                      </td>
                      <td class="text-muted">{{ item.slug }}</td>
                      <td>
                        <span class="table-pill-btn bg-soft-primary">{{ item.blogs_count ?? 0 }}</span>
                      </td>
                      <td>
                        <div class="dropdown">
                          <button
                            :id="'bcStatus' + item.id"
                            class="table-pill-btn dropdown-toggle"
                            :class="item.status === 'Enable' ? 'bg-soft-success' : 'bg-soft-secondary'"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-popper-config='{"strategy":"fixed"}'
                            aria-expanded="false"
                            :disabled="busyId === item.id"
                          >
                            {{ item.status === 'Enable' ? 'Enabled' : 'Disabled' }}
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click.prevent="updateStatus(item, 'Enable')">Enable</a></li>
                            <li><a class="dropdown-item" href="#" @click.prevent="updateStatus(item, 'Disable')">Disable</a></li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center gap-1">
                          <button type="button" class="table-icon-btn is-primary" title="Edit" @click="edit(item)">
                            <Pencil :size="14" />
                          </button>
                          <button type="button" class="table-icon-btn is-danger" title="Delete" @click="destroy(item)">
                            <Trash2 :size="14" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!categories.length">
                      <td colspan="5" class="text-center text-muted py-4">
                        No categories yet — use “Add blog category” to create the first one.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Adding a category: the same form, in a popup -->
      <FormModal v-if="creating" title="Add new category" :show-footer="false" @close="closeCreate">
        <form @submit.prevent="submitCreate">
          <div class="mb-3">
            <label class="form-label" for="bc-name">Name</label>
            <input
              id="bc-name"
              v-model="createForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': createForm.errors.name }"
              placeholder="e.g. Styling tips"
              autofocus
              @input="onCreateName"
            >
            <div class="invalid-feedback">{{ createForm.errors.name }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="bc-slug">Slug</label>
            <input
              id="bc-slug"
              v-model="createForm.slug"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': createForm.errors.slug }"
              placeholder="styling-tips"
              @input="createSlugTouched = true"
            >
            <div class="invalid-feedback">{{ createForm.errors.slug }}</div>
            <small class="cat-hint">Used in the URL: /blog?category=slug</small>
          </div>

          <div class="mb-3">
            <label class="form-label" for="bc-status">Status</label>
            <select id="bc-status" v-model="createForm.status" class="form-select">
              <option value="Enable">Enabled</option>
              <option value="Disable">Disabled</option>
            </select>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="closeCreate">Cancel</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="createForm.processing">
              <Plus :size="15" class="me-1" /> Add category
            </button>
          </div>
        </form>
      </FormModal>

      <!-- Editing stays in a popup -->
      <FormModal v-if="editingId" title="Edit category" :show-footer="false" @close="resetEdit">
        <form @submit.prevent="submitEdit">
          <div class="mb-3">
            <label class="form-label" for="bc-edit-name">Name</label>
            <input
              id="bc-edit-name"
              v-model="editForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': editForm.errors.name }"
            >
            <div class="invalid-feedback">{{ editForm.errors.name }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="bc-edit-slug">Slug</label>
            <input
              id="bc-edit-slug"
              v-model="editForm.slug"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': editForm.errors.slug }"
            >
            <div class="invalid-feedback">{{ editForm.errors.slug }}</div>
            <small class="cat-hint">Changing this changes the link people may have saved.</small>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="resetEdit">Cancel</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="editForm.processing">Update</button>
          </div>
        </form>
      </FormModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
// Shared with the server's normaliser, so a Bangla name still yields a slug
// instead of the empty string the old ASCII-only rule produced.
import { slugify } from '@/utils/slug'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const props = defineProps({
  blog_categories: { type: Array, default: () => [] },
})

const categories = computed(() => props.blog_categories)

/* ---------- create ---------- */

const creating = ref(false)
const createSlugTouched = ref(false)

const createForm = useForm({
  name: '',
  slug: '',
  status: 'Enable',
})

function onCreateName() {
  if (createSlugTouched.value) return
  createForm.slug = slugify(createForm.name)
}

function openCreate() {
  createForm.reset()
  createForm.clearErrors()
  createForm.status = 'Enable'
  createSlugTouched.value = false
  creating.value = true
}

function closeCreate() {
  creating.value = false
}

function submitCreate() {
  createForm.post(route('blog-category.store'), {
    preserveScroll: true,
    onSuccess: () => {
      createForm.reset()
      createForm.status = 'Enable'
      createSlugTouched.value = false
      creating.value = false
    },
  })
}

/* ---------- edit ---------- */

const editingId = ref(null)

const editForm = useForm({
  name: '',
  slug: '',
})

function edit(item) {
  editingId.value = item.id
  editForm.name = item.name
  editForm.slug = item.slug
  editForm.clearErrors()
}

function submitEdit() {
  editForm.put(route('blog-category.update', editingId.value), {
    preserveScroll: true,
    onSuccess: resetEdit,
  })
}

function resetEdit() {
  editingId.value = null
  editForm.reset()
  editForm.clearErrors()
}

/* ---------- row actions ---------- */

const busyId = ref(null)

async function updateStatus(item, next) {
  if (item.status === next) return

  busyId.value = item.id

  try {
    await axios.post(route('blog-category.toggle-status'), { id: item.id, status: next })
    item.status = next
    toast('success', `Category ${next === 'Enable' ? 'enabled' : 'disabled'}`)
  } catch (e) {
    toast('error', 'Could not update the category status. Please try again.')
  } finally {
    busyId.value = null
  }
}

async function destroy(item) {
  const count = item.blogs_count ?? 0
  const ok = await confirmDelete({
    title: `Delete “${item.name}”?`,
    text: count
      ? `${count} post${count === 1 ? '' : 's'} use this category and will lose it.`
      : 'This category will be removed.',
  })

  if (ok) router.delete(route('blog-category.destroy', item.id), { preserveScroll: true })
}
</script>

<style scoped>
.cat-name {
  font-weight: 500;
}

.cat-hint {
  display: block;
  margin-top: 4px;
  color: var(--ink-muted, #9ca3af);
  font-size: 12px;
}
</style>
