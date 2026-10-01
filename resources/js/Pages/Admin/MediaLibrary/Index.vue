<template>
  <AdminLayout>
    <div class="page-content ml-page" v-bind="dropHandlers">
      <div class="row mt-3">
        <div :class="selectedItem ? 'col-lg-8 col-xl-9' : 'col-12'">
          <div class="card">
            <div class="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <h6 class="mb-0">Media Library</h6>
                <p class="mb-0 text-muted small">
                  Every image, video and document on the site. Drag files anywhere on this page to upload.
                </p>
              </div>
              <label class="btn btn-fig-primary btn-fig-sm mb-0" style="cursor:pointer;">
                <UploadCloud :size="14" class="me-1" /> Upload files
                <input type="file" multiple hidden @change="onPick">
              </label>
            </div>

            <div class="card-body">
              <MediaUploadQueue :queue="queue" :uploading="uploading" @clear="clearFinished" />

              <!-- Filters -->
              <div class="ml-filters">
                <div class="btn-group btn-group-sm">
                  <button
                    v-for="option in KIND_FILTERS"
                    :key="option.value ?? 'all'"
                    type="button"
                    class="btn"
                    :class="kind === option.value ? 'btn-fig-primary' : 'btn-outline-secondary'"
                    @click="setFilter({ kind: option.value })"
                  >
                    {{ option.label }}
                    <span class="ml-count">{{ stats.counts?.[option.value ?? 'all'] ?? 0 }}</span>
                  </button>
                </div>

                <select v-if="stats.periods?.length" class="form-select form-select-sm ml-period"
                  :value="period" @change="setFilter({ period: $event.target.value })">
                  <option value="">All dates</option>
                  <option v-for="p in stats.periods" :key="p" :value="p">{{ formatPeriod(p) }}</option>
                </select>

                <input
                  v-model="search"
                  type="search"
                  class="form-control form-control-sm ml-search"
                  placeholder="Search by title, alt text, or filename..."
                  @input="onSearchInput"
                >

                <div class="btn-group btn-group-sm ms-auto">
                  <button type="button" class="btn" :class="view === 'grid' ? 'btn-fig-primary' : 'btn-outline-secondary'"
                    title="Grid view" @click="view = 'grid'">
                    <LayoutGrid :size="14" />
                  </button>
                  <button type="button" class="btn" :class="view === 'list' ? 'btn-fig-primary' : 'btn-outline-secondary'"
                    title="List view" @click="view = 'list'">
                    <List :size="14" />
                  </button>
                </div>
              </div>

              <!-- Bulk action bar -->
              <div v-if="selectMode" class="ml-bulk">
                <label class="ml-bulk-all">
                  <input type="checkbox" :checked="allOnPageSelected" @change="toggleAllOnPage">
                  Select all on page
                </label>
                <span class="ml-bulk-count">{{ selectedIds.size }} selected</span>
                <button type="button" class="btn btn-outline-danger btn-sm" :disabled="!selectedIds.size || deleting"
                  @click="deleteSelected">
                  {{ deleting ? 'Deleting...' : `Delete ${selectedIds.size || ''}` }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="exitSelectMode">Cancel</button>
              </div>
              <div v-else class="ml-bulk ml-bulk--idle">
                <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="!items.length"
                  @click="selectMode = true">
                  Select
                </button>
                <span class="text-muted small">{{ total }} file{{ total === 1 ? '' : 's' }}</span>
              </div>

              <div v-if="loading" class="text-center text-muted py-5">Loading...</div>

              <div v-else-if="!items.length" class="ml-empty">
                <UploadCloud :size="38" />
                <p class="mb-1 mt-3 fw-semibold">{{ search || kind || period ? 'Nothing matches those filters' : 'No files yet' }}</p>
                <p class="mb-0 small">Drag files here, or use the Upload button.</p>
              </div>

              <!-- Grid -->
              <div v-else-if="view === 'grid'" class="ml-grid">
                <div
                  v-for="item in items"
                  :key="item.id"
                  class="ml-cell"
                  :class="{ 'is-active': selectedItem?.id === item.id, 'is-picked': selectedIds.has(item.id) }"
                  @click="onCellClick(item)"
                >
                  <label v-if="selectMode" class="ml-check" @click.stop>
                    <input type="checkbox" :checked="selectedIds.has(item.id)" @change="toggleSelected(item.id)">
                  </label>

                  <div v-if="item.kind === 'image' && missingIds.has(item.id)" class="ml-doc ml-missing" title="This file is not on the server"><FileText :size="30" /><span>File missing</span></div>
                  <img v-else-if="item.kind === 'image'" :src="item.url" :alt="item.alt_text || item.title" loading="lazy" @error="markMissing(item.id)">
                  <video v-else-if="item.kind === 'video'" :src="item.url" preload="metadata" muted></video>
                  <div v-else class="ml-doc"><FileText :size="30" /><span>{{ item.extension }}</span></div>

                  <span v-if="item.kind === 'video'" class="ml-badge"><Play :size="10" /> Video</span>
                  <span v-if="item.usage && !item.usage.length" class="ml-unused" title="Nothing references this file">Unused</span>

                  <div class="ml-caption">{{ item.title || item.filename }}</div>
                </div>
              </div>

              <!-- List -->
              <div v-else class="table-compact-wrapper">
                <table class="table table-compact align-middle mb-0">
                  <thead>
                    <tr>
                      <th v-if="selectMode" style="width: 34px;"></th>
                      <th style="width: 54px;"></th>
                      <th>File</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Used by</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      class="ml-row"
                      :class="{ 'is-active': selectedItem?.id === item.id }"
                      @click="onCellClick(item)"
                    >
                      <td v-if="selectMode" @click.stop>
                        <input type="checkbox" :checked="selectedIds.has(item.id)" @change="toggleSelected(item.id)">
                      </td>
                      <td>
                        <div v-if="item.kind === 'image' && missingIds.has(item.id)" class="ml-row-thumb ml-row-thumb--doc" title="This file is not on the server">missing</div>
                        <img v-else-if="item.kind === 'image'" :src="item.url" :alt="item.title" class="ml-row-thumb" loading="lazy" @error="markMissing(item.id)">
                        <div v-else class="ml-row-thumb ml-row-thumb--doc">{{ item.extension }}</div>
                      </td>
                      <td>
                        <div class="fw-semibold">{{ item.title || '—' }}</div>
                        <div class="text-muted small">{{ item.filename }}</div>
                      </td>
                      <td class="text-capitalize">{{ item.kind }}</td>
                      <td>{{ item.human_size || '—' }}</td>
                      <td>
                        <span v-if="item.usage?.length" class="table-pill-btn bg-soft-success">{{ item.usage.length }}</span>
                        <span v-else class="table-pill-btn bg-soft-secondary">Unused</span>
                      </td>
                      <td class="text-nowrap">{{ formatDate(item.created_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="lastPage > 1" class="d-flex justify-content-center align-items-center gap-2 mt-3">
                <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="goToPage(page - 1)">Prev</button>
                <span class="small text-muted">Page {{ page }} / {{ lastPage }}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page >= lastPage" @click="goToPage(page + 1)">Next</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedItem" class="col-lg-4 col-xl-3">
          <MediaDetailDrawer
            :item="selectedItem"
            @close="selectedItem = null"
            @saved="onItemSaved"
            @delete="deleteOne"
          />
        </div>
      </div>
    </div>

    <!-- Drop overlay -->
    <Teleport to="body">
      <div v-if="isDragging" class="ml-dropzone">
        <div class="ml-dropzone-inner">
          <UploadCloud :size="46" />
          <p class="mb-0 mt-3">Drop files to upload to the media library</p>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import MediaDetailDrawer from '@/components/Admin/MediaDetailDrawer.vue'
import MediaUploadQueue from '@/components/Admin/MediaUploadQueue.vue'
import { useMediaUploader, useDropZone } from '@/composables/useMediaUploader'
import { confirmDelete } from '@/utils/confirmDelete'
import { toast } from '@/utils/toast'
import { UploadCloud, FileText, LayoutGrid, List, Play } from 'lucide-vue-next'

const props = defineProps({
  items: { type: Object, default: () => ({ data: [], last_page: 1, total: 0 }) },
  search: { type: String, default: null },
  kind: { type: String, default: null },
  stats: { type: Object, default: () => ({ counts: {}, periods: [] }) },
})

const KIND_FILTERS = [
  { label: 'All', value: null },
  { label: 'Images', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Documents', value: 'document' },
]

const items = ref(props.items.data ?? [])
const total = ref(props.items.total ?? 0)
const lastPage = ref(props.items.last_page ?? 1)

// Library rows whose file is not on disk. The broken image rendered as a plain
// black tile, indistinguishable from a dark photo; this names it instead.
const missingIds = ref(new Set())
const markMissing = (id) => { missingIds.value = new Set(missingIds.value).add(id) }
const stats = ref(props.stats)

const search = ref(props.search ?? '')
const kind = ref(props.kind ?? null)
const period = ref('')
const page = ref(1)
const view = ref('grid')
const loading = ref(false)

const selectedItem = ref(null)
const selectMode = ref(false)
const selectedIds = ref(new Set())
const deleting = ref(false)

let searchTimeout = null

const { queue, uploading, upload, clearFinished } = useMediaUploader()

const fetchItems = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(route('admin.media-library.picker'), {
      params: {
        search: search.value || undefined,
        kind: kind.value || undefined,
        period: period.value || undefined,
        page: page.value,
        with_usage: 1,
      },
    })
    items.value = data.data
    lastPage.value = data.last_page
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const setFilter = ({ kind: newKind, period: newPeriod }) => {
  if (newKind !== undefined) kind.value = newKind
  if (newPeriod !== undefined) period.value = newPeriod
  page.value = 1
  fetchItems()
}

const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchItems()
  }, 350)
}

const goToPage = (p) => {
  page.value = p
  selectedIds.value = new Set()
  fetchItems()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------- uploading ---------- */

const handleFiles = async (files) => {
  const { failed } = await upload(files, (fresh) => {
    // Show new arrivals immediately, respecting the active kind filter.
    const visible = kind.value ? fresh.filter((i) => i.kind === kind.value) : fresh
    items.value = [...visible, ...items.value]
    total.value += visible.length
    bumpCounts(fresh, 1)
  })

  if (failed) toast('error', `${failed} file${failed === 1 ? '' : 's'} could not be uploaded.`)
}

/** Keep the filter-bar tallies honest without another round trip. */
const bumpCounts = (changed, direction) => {
  const counts = { ...(stats.value.counts ?? {}) }
  changed.forEach((item) => {
    counts.all = (counts.all ?? 0) + direction
    counts[item.kind] = (counts[item.kind] ?? 0) + direction
  })
  stats.value = { ...stats.value, counts }
}

const onPick = (event) => {
  handleFiles(event.target.files)
  event.target.value = ''
}

const { isDragging, dropHandlers } = useDropZone(handleFiles)

/* ---------- selection ---------- */

const allOnPageSelected = computed(
  () => items.value.length > 0 && items.value.every((i) => selectedIds.value.has(i.id))
)

const toggleSelected = (id) => {
  const next = new Set(selectedIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selectedIds.value = next
}

const toggleAllOnPage = () => {
  const next = new Set(selectedIds.value)
  if (allOnPageSelected.value) {
    items.value.forEach((i) => next.delete(i.id))
  } else {
    items.value.forEach((i) => next.add(i.id))
  }
  selectedIds.value = next
}

const exitSelectMode = () => {
  selectMode.value = false
  selectedIds.value = new Set()
}

const onCellClick = (item) => {
  if (selectMode.value) {
    toggleSelected(item.id)
    return
  }
  selectedItem.value = selectedItem.value?.id === item.id ? null : item
}

/* ---------- editing and deleting ---------- */

const onItemSaved = (updated) => {
  const idx = items.value.findIndex((i) => i.id === updated.id)
  if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updated }
  if (selectedItem.value?.id === updated.id) {
    selectedItem.value = { ...selectedItem.value, ...updated }
  }
  toast('success', 'File details saved')
}

const deleteOne = async (item) => {
  const inUse = item.usage?.length ?? 0
  const warning = inUse
    ? `This file is used in ${inUse} place${inUse === 1 ? '' : 's'}. Deleting it will leave them broken.`
    : 'Nothing references this file.'

  if (!(await confirmDelete({ title: 'Delete this file?', text: warning }))) return

  await axios.delete(route('admin.media-library.destroy', item.id))
  items.value = items.value.filter((i) => i.id !== item.id)
  total.value = Math.max(0, total.value - 1)
  bumpCounts([item], -1)
  if (selectedItem.value?.id === item.id) selectedItem.value = null
  toast('success', 'File deleted')
}

const deleteSelected = async () => {
  const ids = [...selectedIds.value]
  if (!ids.length) return

  const inUse = items.value.filter((i) => selectedIds.value.has(i.id) && i.usage?.length).length
  const warning = inUse
    ? `${inUse} of these are still in use. Deleting them will leave those pages broken.`
    : 'None of these are referenced anywhere.'

  if (!(await confirmDelete({ title: `Delete ${ids.length} file(s)?`, text: warning }))) return

  deleting.value = true
  try {
    const { data } = await axios.post(route('admin.media-library.bulk-delete'), { ids })
    bumpCounts(items.value.filter((i) => selectedIds.value.has(i.id)), -1)
    items.value = items.value.filter((i) => !selectedIds.value.has(i.id))
    total.value = Math.max(0, total.value - (data.deleted ?? ids.length))
    if (selectedItem.value && selectedIds.value.has(selectedItem.value.id)) selectedItem.value = null
    exitSelectMode()
    toast('success', `${data.deleted ?? ids.length} file(s) deleted`)
  } catch {
    toast('error', 'Could not delete the selected files.')
  } finally {
    deleting.value = false
  }
}

/* ---------- formatting ---------- */

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const formatPeriod = (value) => {
  const [year, month] = value.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>

<style scoped>
.ml-page { min-height: 70vh; }

/* Filters */
.ml-filters {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px;
}
.ml-search { max-width: 260px; }
.ml-period { max-width: 170px; }
.ml-count {
  background: rgba(0, 0, 0, .08); border-radius: 999px;
  padding: 0 6px; margin-left: 5px; font-size: 11px; font-weight: 700;
}
.btn-fig-primary .ml-count { background: rgba(255, 255, 255, .25); }

/* Bulk bar */
.ml-bulk {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; margin-bottom: 12px;
  background: #f6f8fa; border: 1px solid #e3e6ea; border-radius: 8px;
  font-size: 13px;
}
.ml-bulk--idle { background: transparent; border-color: transparent; padding-left: 0; }
.ml-bulk-all { display: flex; align-items: center; gap: 6px; margin: 0; cursor: pointer; }
.ml-bulk-count { color: #6c757d; margin-right: auto; }

/* Grid */
.ml-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}
.ml-cell {
  position: relative;
  border: 2px solid transparent;
  outline: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
  cursor: pointer;
  transition: outline-color .15s, transform .15s;
}
.ml-cell:hover { outline-color: #b0bec5; transform: translateY(-2px); }
.ml-cell.is-active { border-color: #356019; outline-color: #356019; }
.ml-cell.is-picked { border-color: #356019; }
.ml-cell img, .ml-cell video {
  width: 100%; height: 120px; object-fit: cover; display: block; background: #000;
}
.ml-doc {
  height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; background: #eceff1; color: #546e7a;
}
.ml-doc span { font-size: 12px; font-weight: 700; letter-spacing: .04em; }
.ml-missing { background: #fdecea; color: #b3261e; }
.ml-caption {
  padding: 6px 8px; font-size: 12px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  background: #fff; border-top: 1px solid #eceff1;
}
.ml-check {
  position: absolute; top: 6px; left: 6px; z-index: 2; margin: 0;
  background: rgba(255, 255, 255, .9); border-radius: 4px; padding: 2px 4px; line-height: 0;
}
.ml-badge {
  position: absolute; top: 6px; right: 6px;
  display: inline-flex; align-items: center; gap: 3px;
  background: rgba(0, 0, 0, .6); color: #fff;
  border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 600;
}
.ml-unused {
  position: absolute; bottom: 34px; left: 6px;
  background: #fff0d3; color: #B9770E;
  border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;
}

/* List */
.ml-row { cursor: pointer; }
.ml-row:hover { background: #f6f8fa; }
.ml-row.is-active { background: #eef3ea; }
.ml-row-thumb {
  width: 42px; height: 42px; object-fit: cover; border-radius: 6px; display: block; background: #eceff1;
}
.ml-row-thumb--doc {
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #546e7a;
}

/* Empty state */
.ml-empty {
  border: 1px dashed #cfd8dc; border-radius: 12px;
  padding: 46px 20px; text-align: center; color: #90a4ae;
}

/* Drop overlay */
.ml-dropzone {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(53, 96, 25, .12);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.ml-dropzone-inner {
  background: #fff; border: 2px dashed #356019; border-radius: 16px;
  padding: 40px 56px; text-align: center; color: #356019; font-weight: 600;
  box-shadow: 0 18px 50px rgba(0, 0, 0, .16);
}
</style>
