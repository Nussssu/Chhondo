<template>
  <FormModal :title="modalTitle" size="xl" :show-footer="false" @close="$emit('close')">
    <div class="media-picker" v-bind="dropHandlers">
      <div v-if="isDragging" class="media-picker-drop">
        <UploadCloud :size="34" />
        <p class="mb-0 mt-2">Drop to upload</p>
      </div>

      <div class="d-flex align-items-center gap-2 mb-3">
        <input
          v-model="search"
          type="text"
          class="form-control"
          :placeholder="`Search by title, alt text, or filename...`"
          @input="onSearchInput"
        >
        <label class="btn btn-fig-primary btn-fig-sm mb-0 text-nowrap" style="cursor:pointer;">
          <UploadCloud :size="14" class="me-1" /> Upload
          <input type="file" :accept="acceptAttr" multiple hidden @change="onUpload">
        </label>
      </div>

      <MediaUploadQueue :queue="queue" :uploading="uploading" @clear="clearFinished" />
      <div v-if="uploadError" class="alert alert-danger py-2 mb-3">{{ uploadError }}</div>

      <div v-if="loading && !items.length" class="text-center text-muted py-5">Loading...</div>
      <div v-else-if="!items.length" class="text-center text-muted py-5">No {{ kindNoun }} found.</div>

      <div v-else class="media-picker-grid">
        <div
          v-for="item in items"
          :key="item.id"
          class="media-picker-cell"
          :class="{ 'is-selected': isSelected(item) }"
          @click="toggleOrSelect(item)"
        >
          <div v-if="item.kind === 'image' && missingIds.has(item.id)" class="media-picker-doc media-picker-missing" title="This file is not on the server">
            <FileText :size="30" />
            <span>File missing</span>
          </div>
          <img v-else-if="item.kind === 'image'" :src="item.url" :alt="item.alt_text || item.title" loading="lazy" @error="markMissing(item.id)">
          <video v-else-if="item.kind === 'video'" :src="item.url" muted preload="metadata"></video>
          <div v-else class="media-picker-doc">
            <FileText :size="30" />
            <span>{{ extensionOf(item.path) }}</span>
          </div>
          <button type="button" class="media-picker-edit-btn" title="Edit details" @click.stop="openEdit(item)">
            <Pencil :size="12" />
          </button>
          <div v-if="multiple && isSelected(item)" class="media-picker-check">
            <Check :size="14" />
          </div>
          <div class="media-picker-caption">{{ item.title || 'Untitled' }}</div>
        </div>
      </div>

      <div v-if="lastPage > 1" class="d-flex justify-content-center gap-2 mt-3">
        <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="goToPage(page - 1)">Prev</button>
        <span class="align-self-center small text-muted">Page {{ page }} / {{ lastPage }}</span>
        <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page >= lastPage" @click="goToPage(page + 1)">Next</button>
      </div>

      <div v-if="multiple" class="d-flex justify-content-end mt-3">
        <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="!selected.length" @click="confirmSelection">
          Insert {{ selected.length }} selected
        </button>
      </div>
    </div>

    <MediaLibraryEditPopup
      v-if="editingItem"
      :item="editingItem"
      @close="editingItem = null"
      @saved="onEditSaved"
    />
  </FormModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import MediaLibraryEditPopup from '@/components/Admin/MediaLibraryEditPopup.vue'
import MediaUploadQueue from '@/components/Admin/MediaUploadQueue.vue'
import { useMediaUploader, useDropZone } from '@/composables/useMediaUploader'
import { UploadCloud, Pencil, Check, FileText } from 'lucide-vue-next'

const props = defineProps({
  multiple: { type: Boolean, default: false },
  // Which asset types this field accepts: 'image' (default), 'video',
  // 'document', a comma-separated combination, or null for everything. A
  // featured-image field must never be offered a video.
  kind: { type: String, default: 'image' },
})
const emit = defineEmits(['close', 'select', 'select-multiple'])

const KIND_META = {
  image: { label: 'Images', noun: 'images', accept: 'image/*' },
  video: { label: 'Video', noun: 'videos', accept: 'video/*' },
  document: { label: 'Documents', noun: 'documents', accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv' },
}

const kinds = computed(() =>
  (props.kind || '').split(',').map((k) => k.trim()).filter((k) => k in KIND_META)
)

const modalTitle = computed(() =>
  kinds.value.length ? `Media Library — ${kinds.value.map((k) => KIND_META[k].label).join(' & ')}` : 'Media Library'
)

const kindNoun = computed(() =>
  kinds.value.length ? kinds.value.map((k) => KIND_META[k].noun).join(' or ') : 'files'
)

// Undefined lets the browser offer everything when no kind is constrained.
const acceptAttr = computed(() =>
  kinds.value.length ? kinds.value.map((k) => KIND_META[k].accept).join(',') : undefined
)

const allows = (item) => !kinds.value.length || kinds.value.includes(item.kind)

const extensionOf = (path) => (path || '').split('.').pop().toUpperCase()

const items = ref([])

// Library rows whose file is not on disk. The broken image rendered as a plain
// black tile, indistinguishable from a dark photo; this names it instead.
const missingIds = ref(new Set())
const markMissing = (id) => { missingIds.value = new Set(missingIds.value).add(id) }
const search = ref('')
const page = ref(1)
const lastPage = ref(1)
const loading = ref(false)
const uploadError = ref(null)
const selected = ref([])
const editingItem = ref(null)
let searchTimeout = null

const fetchItems = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(route('admin.media-library.picker'), {
      params: { search: search.value || undefined, page: page.value, kind: props.kind || undefined },
    })
    items.value = data.data
    lastPage.value = data.last_page
  } finally {
    loading.value = false
  }
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
  fetchItems()
}

const isSelected = (item) => selected.value.some((i) => i.id === item.id)

const toggleOrSelect = (item) => {
  if (!props.multiple) {
    emit('select', item)
    return
  }
  if (isSelected(item)) {
    selected.value = selected.value.filter((i) => i.id !== item.id)
  } else {
    selected.value.push(item)
  }
}

const confirmSelection = () => {
  emit('select-multiple', selected.value)
}

const { queue, uploading, upload, clearFinished } = useMediaUploader()

const handleFiles = async (files) => {
  uploadError.value = null

  let offered = 0
  let total = 0

  await upload(files, (fresh) => {
    total += fresh.length
    // Only surface uploads this picker is allowed to offer.
    const allowed = fresh.filter(allows)
    offered += allowed.length
    items.value = [...allowed, ...items.value]
  })

  if (offered < total) {
    uploadError.value = `Uploaded, but only ${kindNoun.value} can be picked here. Find the rest in the Media Library.`
  }
}

const { isDragging, dropHandlers } = useDropZone(handleFiles)

const onUpload = (e) => {
  handleFiles(e.target.files)
  e.target.value = ''
}

const openEdit = (item) => {
  editingItem.value = item
}

const onEditSaved = (updated) => {
  const idx = items.value.findIndex((i) => i.id === updated.id)
  if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updated }
  editingItem.value = null
}

onMounted(fetchItems)
</script>

<style scoped>
.media-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  max-height: 55vh;
  overflow-y: auto;
}
.media-picker-cell {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
}
.media-picker-cell.is-selected {
  border-color: var(--bs-primary, #5b6ee1);
}
.media-picker-cell img,
.media-picker-cell video {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
  background: #000;
}
.media-picker-missing { background: #fdecea; color: #b3261e; }
.media-picker { position: relative; }
.media-picker-drop {
  position: absolute; inset: 0; z-index: 5;
  background: rgba(255, 255, 255, .94);
  border: 2px dashed #252f17; border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #252f17; font-weight: 600; pointer-events: none;
}
.media-picker-doc {
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #6c757d;
  background: #eceff1;
}
.media-picker-doc span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .04em;
}
.media-picker-caption {
  font-size: 11px;
  padding: 4px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(0,0,0,0.03);
}
.media-picker-edit-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 3px 5px;
  line-height: 0;
}
.media-picker-check {
  position: absolute;
  top: 4px;
  left: 4px;
  background: var(--bs-primary, #5b6ee1);
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
