<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Categories" subtitle="Group your products, and nest a category under a parent" />

      <div class="row g-3 mt-0">
        <!-- Add form: always open, so adding several in a row costs no clicks -->
        <div class="col-lg-4 col-xl-3">
          <div class="card cat-form-card">
            <div class="card-header">
              <h6 class="mb-0">Add new category</h6>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitCreate">
                <div class="mb-3">
                  <label class="form-label" for="cat-name">Name</label>
                  <input
                    id="cat-name"
                    v-model="createForm.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': createForm.errors.name }"
                    placeholder="e.g. Jamdani"
                  >
                  <div class="invalid-feedback">{{ createForm.errors.name }}</div>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="cat-title">Page heading</label>
                  <input
                    id="cat-title"
                    v-model="createForm.title"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': createForm.errors.title }"
                    :placeholder="`আমাদের সব ${createForm.name || '…'}`"
                  >
                  <div class="invalid-feedback">{{ createForm.errors.title }}</div>
                  <small class="cat-hint">Shown at the top of this category's page. Blank uses the wording above.</small>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="cat-subtitle">Page subtitle</label>
                  <textarea
                    id="cat-subtitle"
                    v-model="createForm.subtitle"
                    class="form-control"
                    rows="2"
                    :class="{ 'is-invalid': createForm.errors.subtitle }"
                    placeholder="প্রিমিয়াম কোয়ালিটির শাড়ি আর আধুনিকতার মেলবন্ধনে, নিজেকে সাজান ঐতিহ্যবাহী কারুশিল্পে।"
                  ></textarea>
                  <div class="invalid-feedback">{{ createForm.errors.subtitle }}</div>
                  <small class="cat-hint">Leave blank to use the site's default line.</small>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="cat-parent">Parent category</label>
                  <select
                    id="cat-parent"
                    v-model="createForm.parent_id"
                    class="form-select"
                    :class="{ 'is-invalid': createForm.errors.parent_id }"
                  >
                    <option :value="null">None (top level)</option>
                    <option v-for="option in parentOptions" :key="option.id" :value="option.id">
                      {{ option.label }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ createForm.errors.parent_id }}</div>
                  <small class="cat-hint">Leave as “None” for a main category.</small>
                </div>

                <div class="mb-3 form-check">
                  <input id="cat-show-in-filter" v-model="createForm.show_in_filter" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="cat-show-in-filter">Show in the storefront filter</label>
                </div>

                <div class="mb-3">
                  <label class="form-label">Image</label>
                  <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('create')">
                    {{ createPreview ? 'Change image' : 'Choose from Media Library' }}
                  </button>
                  <div v-if="createPreview" class="cat-thumb mt-2">
                    <img :src="createPreview" alt="">
                    <button type="button" class="cat-thumb-clear" title="Remove" @click="clearCreateImage">&times;</button>
                  </div>
                </div>

                <button type="submit" class="btn btn-fig-primary btn-fig-md w-100" :disabled="createForm.processing">
                  <Plus :size="15" class="me-1" /> Add category
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Listing -->
        <div class="col-lg-8 col-xl-9">
          <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-0">All categories</h6>
                <p class="mb-0 text-muted small">
                  Drag a row to set the sequence — the storefront filter and menus follow it.
                  Sub-categories sit under their parent.
                </p>
              </div>
              <span class="text-muted small">{{ categories.length }} total</span>
            </div>
            <div class="card-body">
              <div class="table-compact-wrapper">
                <table id="categoryTable" class="table table-compact align-middle w-100">
                  <thead>
                    <tr>
                      <th style="width: 62px;">Order</th>
                      <th>Category</th>
                      <th style="width: 78px;">Image</th>
                      <th style="width: 96px;">Products</th>
                      <th style="width: 120px;">Status</th>
                      <th style="width: 108px;">In filter</th>
                      <th style="width: 96px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody @dragend="onDragEnd">
                    <tr
                      v-for="(item, i) in categories"
                      :key="item.id"
                      :data-id="item.id"
                      :class="{ 'is-dragging': dragFrom === i, 'is-over': dragOver === i && dragFrom !== null }"
                      draggable="true"
                      @dragstart="onDragStart(i, $event)"
                      @dragover.prevent="onDragOver(i)"
                      @drop.prevent="onDrop(i)"
                    >
                      <td>
                        <div class="cat-seq">
                          <span class="drag-handle" title="Drag to set the sequence"><GripVertical :size="14" /></span>
                          <span class="cat-seq-keys">
                            <button type="button" :disabled="i === 0" title="Move up" @click="nudge(i, -1)">↑</button>
                            <button type="button" :disabled="i === categories.length - 1" title="Move down" @click="nudge(i, 1)">↓</button>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span class="cat-name" :style="{ paddingLeft: `${item.depth * 20}px` }">
                          <span v-if="item.depth" class="cat-branch" aria-hidden="true">└</span>
                          {{ item.name }}
                        </span>
                      </td>
                      <td>
                        <img v-if="item.image" :src="item.image" alt="" class="cat-row-img">
                        <span v-else class="text-muted">—</span>
                      </td>
                      <td>
                        <span class="table-pill-btn bg-soft-primary">{{ item.products_count ?? 0 }}</span>
                      </td>
                      <td>
                        <div class="dropdown">
                          <button :id="'statusButton' + item.id"
                            class="table-pill-btn dropdown-toggle"
                            :class="item.status === 'Active' ? 'bg-soft-success' : 'bg-soft-secondary'"
                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ item.status }}
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click.prevent="updateStatus(item.id, 'Active')">Activate</a></li>
                            <li><a class="dropdown-item" href="#" @click.prevent="updateStatus(item.id, 'Deactive')">Deactivate</a></li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="table-pill-btn"
                          :class="item.show_in_filter ? 'bg-soft-success' : 'bg-soft-secondary'"
                          :title="item.show_in_filter
                            ? 'Shown in the storefront filter — click to hide it'
                            : 'Hidden from the storefront filter — click to show it'"
                          @click="toggleFilter(item)"
                        >
                          {{ item.show_in_filter ? 'Shown' : 'Hidden' }}
                        </button>
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
                      <td colspan="7" class="text-center text-muted py-4">
                        No categories yet — add your first one on the left.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Editing stays in a popup -->
      <FormModal v-if="editingId" title="Edit category" :show-footer="false" @close="resetEdit">
        <form @submit.prevent="submitEdit">
          <div class="mb-3">
            <label class="form-label" for="edit-name">Name</label>
            <input
              id="edit-name"
              v-model="editForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': editForm.errors.name }"
            >
            <div class="invalid-feedback">{{ editForm.errors.name }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="edit-slug">Address</label>
            <div class="input-group">
              <span class="input-group-text">/product-category/</span>
              <input
                id="edit-slug"
                v-model="editForm.slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': editForm.errors.slug }"
              >
              <div class="invalid-feedback">{{ editForm.errors.slug }}</div>
            </div>
            <small class="cat-hint">
              Changing this changes the link people may have saved.
              <button type="button" class="btn btn-link btn-sm p-0 align-baseline" @click="editForm.slug = slugify(editForm.name)">
                Rebuild from the name
              </button>
            </small>
          </div>

          <div class="mb-3">
            <label class="form-label" for="edit-title">Page heading</label>
            <input
              id="edit-title"
              v-model="editForm.title"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': editForm.errors.title }"
              :placeholder="`আমাদের সব ${editForm.name || '…'}`"
            >
            <div class="invalid-feedback">{{ editForm.errors.title }}</div>
            <small class="cat-hint">Shown at the top of this category's page. Blank uses the wording above.</small>
          </div>

          <div class="mb-3">
            <label class="form-label" for="edit-subtitle">Page subtitle</label>
            <textarea
              id="edit-subtitle"
              v-model="editForm.subtitle"
              class="form-control"
              rows="2"
              :class="{ 'is-invalid': editForm.errors.subtitle }"
              placeholder="প্রিমিয়াম কোয়ালিটির শাড়ি আর আধুনিকতার মেলবন্ধনে, নিজেকে সাজান ঐতিহ্যবাহী কারুশিল্পে।"
            ></textarea>
            <div class="invalid-feedback">{{ editForm.errors.subtitle }}</div>
            <small class="cat-hint">Leave blank to use the site's default line.</small>
          </div>

          <div class="mb-3">
            <label class="form-label" for="edit-parent">Parent category</label>
            <select
              id="edit-parent"
              v-model="editForm.parent_id"
              class="form-select"
              :class="{ 'is-invalid': editForm.errors.parent_id }"
            >
              <option :value="null">None (top level)</option>
              <option v-for="option in editParentOptions" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
            <div class="invalid-feedback">{{ editForm.errors.parent_id }}</div>
            <small class="cat-hint">A category cannot be moved inside its own sub-categories.</small>
          </div>

          <div class="mb-3 form-check">
            <input id="edit-show-in-filter" v-model="editForm.show_in_filter" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="edit-show-in-filter">Show in the storefront filter</label>
            <small class="cat-hint d-block">
              Unticking this only removes it from the filter list — its own page stays live.
            </small>
          </div>

          <div class="mb-3">
            <label class="form-label">Image</label>
            <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('edit')">
              {{ editPreview || editCurrentImage ? 'Change image' : 'Choose from Media Library' }}
            </button>
            <div v-if="editPreview || editCurrentImage" class="cat-thumb mt-2">
              <img :src="editPreview || editCurrentImage" alt="">
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="resetEdit">Cancel</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="editForm.processing">Update</button>
          </div>
        </form>
      </FormModal>
    </div>

    <MediaLibraryPickerModal v-if="pickerFor" @close="pickerFor = null" @select="onLibrarySelected" />
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import { slugify } from '@/utils/slug'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-vue-next'
import { toast } from '@/utils/toast'
import axios from 'axios'

const props = defineProps({
  categories: { type: Array, default: () => [] },
})

/**
 * The rows, held locally so a drag reorders them immediately.
 *
 * The server is told the new sequence straight away; re-reading the prop would
 * make every drop wait for a round trip and snap the row back in the meantime.
 */
const rows = ref([...props.categories])

watch(() => props.categories, (next) => { rows.value = [...next] })

const categories = computed(() => rows.value)

/** Indented labels so the select shows the shape of the tree. */
const parentOptions = computed(() =>
  props.categories.map((c) => ({
    id: c.id,
    label: `${'— '.repeat(c.depth ?? 0)}${c.name}`,
  }))
)

/* ---------- create ---------- */

const createPreview = ref(null)

const createForm = useForm({
  name: '',
  title: '',
  subtitle: '',
  parent_id: null,
  // Sent explicitly rather than relying on a checkbox being present, so
  // unticking it reaches the server as false instead of as nothing.
  show_in_filter: true,
  image_library_path: null,
})

function submitCreate() {
  createForm.post(route('admin.categories.store'), {
    preserveScroll: true,
    onSuccess: () => {
      createForm.reset()
      createPreview.value = null
    },
  })
}

function clearCreateImage() {
  createForm.image_library_path = null
  createPreview.value = null
}

/* ---------- edit ---------- */

const editingId = ref(null)
const editCurrentImage = ref(null)
const editPreview = ref(null)

const editForm = useForm({
  name: '',
  slug: '',
  title: '',
  subtitle: '',
  parent_id: null,
  show_in_filter: true,
  image_library_path: null,
})

/**
 * A category cannot be its own parent, nor sit inside its own sub-tree — that
 * would detach the whole branch. The server enforces this too.
 */
const editParentOptions = computed(() => {
  if (!editingId.value) return parentOptions.value

  const banned = new Set()
  const collect = (id) => {
    banned.add(id)
    props.categories.filter((c) => c.parent_id === id).forEach((c) => collect(c.id))
  }
  collect(editingId.value)

  return parentOptions.value.filter((option) => !banned.has(option.id))
})

function edit(item) {
  editingId.value = item.id
  editCurrentImage.value = item.image
  editPreview.value = null
  editForm.name = item.name
  editForm.slug = item.slug ?? ''
  editForm.title = item.title ?? ''
  editForm.subtitle = item.subtitle ?? ''
  editForm.parent_id = item.parent_id ?? null
  editForm.show_in_filter = item.show_in_filter ?? true
  editForm.image_library_path = null
  editForm.clearErrors()
}

function submitEdit() {
  editForm.post(route('admin.categories.update', editingId.value), {
    preserveScroll: true,
    onSuccess: resetEdit,
  })
}

function resetEdit() {
  editingId.value = null
  editCurrentImage.value = null
  editPreview.value = null
  editForm.reset()
  editForm.clearErrors()
}

/* ---------- shared image picker ---------- */

const pickerFor = ref(null)

const openPicker = (target) => { pickerFor.value = target }

function onLibrarySelected(item) {
  if (pickerFor.value === 'create') {
    createForm.image_library_path = item.url
    createPreview.value = item.url
  } else {
    editForm.image_library_path = item.url
    editPreview.value = item.url
  }
  pickerFor.value = null
}

/* ---------- row actions ---------- */

async function destroy(item) {
  const childCount = props.categories.filter((c) => c.parent_id === item.id).length
  const text = childCount
    ? `Its ${childCount} sub-categor${childCount === 1 ? 'y' : 'ies'} will move up a level, not be deleted.`
    : "You won't be able to revert this!"

  if (await confirmDelete({ title: 'Delete this category?', text })) {
    router.delete(route('admin.categories.destroy', item.id), {
      preserveScroll: true,
      onSuccess: () => { if (editingId.value === item.id) resetEdit() },
    })
  }
}

function updateStatus(categoryId, status) {
  window.$.ajax({
    url: route('admin.categories.updateStatus'),
    type: 'POST',
    data: {
      _token: document.querySelector('meta[name=csrf-token]')?.content,
      id: categoryId,
      status: status
    },
    success: function (response) {
      if (response.success) {
        const category = props.categories.find((c) => c.id === categoryId)
        if (category) category.status = response.status
        toast('success', 'Status updated')
      }
    },
    error: function () {
      toast('error', 'Could not update the status. Please try again.')
    }
  })
}

/* ---------- sequence (drag to reorder) ---------- */

/*
 * This used to be handed to SortableJS via `window.Sortable`, but that library
 * is never loaded on the admin, so the handler was dead and the rows could not
 * be reordered at all. It is now the same native HTML5 drag-and-drop the page
 * editor uses, which drops both that dependency and the jQuery call behind it.
 */

const dragFrom = ref(null)
const dragOver = ref(null)

function onDragStart(index, event) {
  dragFrom.value = index
  event.dataTransfer.effectAllowed = 'move'
  // Firefox ignores a drag that carries no payload.
  event.dataTransfer.setData('text/plain', String(index))
}

function onDragOver(index) {
  if (dragFrom.value !== null) dragOver.value = index
}

function onDrop(index) {
  const from = dragFrom.value
  dragFrom.value = null
  dragOver.value = null

  if (from === null || from === index) return

  const next = [...rows.value]
  const [moved] = next.splice(from, 1)
  // Removing the dragged row shifts everything after it up by one.
  next.splice(from < index ? index - 1 : index, 0, moved)
  rows.value = next

  saveOrder()
}

function onDragEnd() {
  dragFrom.value = null
  dragOver.value = null
}

/** Move a row without a mouse, so the sequence is reachable from the keyboard. */
function nudge(index, delta) {
  const target = index + delta
  if (target < 0 || target >= rows.value.length) return

  const next = [...rows.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  rows.value = next

  saveOrder()
}

async function saveOrder() {
  try {
    await axios.post(route('admin.categories.serialUpdate'), {
      order: rows.value.map((row, index) => ({ id: row.id, position: index + 1 })),
    })
    toast('success', 'Sequence saved')
  } catch (e) {
    toast('error', 'Could not save the sequence. Please try again.')
    // Put the rows back the way the server still has them.
    rows.value = [...props.categories]
  }
}

/* ---------- filter visibility ---------- */

/**
 * Show or hide a category in the storefront's filter, without touching whether
 * it is Active — its own page stays live either way.
 */
async function toggleFilter(item) {
  const next = !item.show_in_filter
  item.show_in_filter = next

  try {
    await axios.post(route('admin.categories.updateFilterVisibility'), {
      id: item.id,
      show_in_filter: next,
    })
    toast('success', next ? 'Shown in the filter' : 'Hidden from the filter')
  } catch (e) {
    item.show_in_filter = !next
    toast('error', 'Could not change that. Please try again.')
  }
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>

<style scoped>
.cat-form-card { position: sticky; top: 84px; }

/* Sequence column: the grip drags, the arrows do the same job from a keyboard. */
.cat-seq { display: flex; align-items: center; gap: 2px; }

.drag-handle {
  display: inline-flex;
  color: var(--text-faint);
  cursor: grab;
}

.cat-seq-keys { display: flex; gap: 1px; }

.cat-seq-keys button {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
}

.cat-seq-keys button:hover:not(:disabled) { background: var(--surface-sunk); color: var(--text); }
.cat-seq-keys button:disabled { opacity: .3; cursor: not-allowed; }

tbody tr.is-dragging { opacity: .45; }
tbody tr.is-over td { box-shadow: inset 0 2px 0 var(--bs-primary, #252f17); }

.cat-hint {
  display: block;
  margin-top: 4px;
  font-size: .74rem;
  color: #90a4ae;
}

.cat-name { display: inline-flex; align-items: center; gap: 6px; }
.cat-branch { color: #b0bec5; font-size: .82rem; }

.cat-row-img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
}

.cat-thumb { position: relative; display: inline-block; }
.cat-thumb img {
  height: 76px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}
.cat-thumb-clear {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: #c62828;
  color: #fff;
  line-height: 1;
  cursor: pointer;
}

@media (max-width: 991px) {
  .cat-form-card { position: static; }
}
</style>
