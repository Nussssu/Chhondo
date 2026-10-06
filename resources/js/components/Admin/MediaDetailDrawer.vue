<template>
  <aside class="md-drawer" role="complementary" aria-label="File details">
    <header class="md-head">
      <h6 class="mb-0">File details</h6>
      <button type="button" class="md-close" aria-label="Close details" @click="$emit('close')">&times;</button>
    </header>

    <div class="md-body">
      <div class="md-preview">
        <img v-if="item.kind === 'image'" :src="item.url" :alt="item.alt_text || item.title">
        <video v-else-if="item.kind === 'video'" :src="item.url" controls preload="metadata"></video>
        <a v-else :href="item.url" target="_blank" rel="noopener" class="md-doc">
          <FileText :size="40" />
          <span>{{ item.extension }}</span>
        </a>
      </div>

      <dl class="md-meta">
        <div><dt>File name</dt><dd :title="item.filename">{{ item.filename }}</dd></div>
        <div><dt>Type</dt><dd>{{ item.mime_type || item.extension }}</dd></div>
        <div v-if="item.human_size"><dt>Size</dt><dd>{{ item.human_size }}</dd></div>
        <div v-if="item.width"><dt>Dimensions</dt><dd>{{ item.width }} × {{ item.height }}</dd></div>
        <div><dt>Uploaded</dt><dd>{{ uploadedOn }}</dd></div>
        <div v-if="item.uploader"><dt>By</dt><dd>{{ item.uploader.name }}</dd></div>
      </dl>

      <div class="md-url">
        <label class="form-label">File URL</label>
        <div class="input-group input-group-sm">
          <input ref="urlInput" type="text" class="form-control" :value="absoluteUrl" readonly @focus="$event.target.select()">
          <button type="button" class="btn btn-outline-secondary" @click="copyUrl">
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <div class="md-field">
        <label class="form-label" for="md-title">Title</label>
        <input id="md-title" v-model="form.title" type="text" class="form-control form-control-sm">
      </div>

      <div v-if="item.kind === 'image'" class="md-field">
        <label class="form-label" for="md-alt">Alt text</label>
        <input id="md-alt" v-model="form.alt_text" type="text" class="form-control form-control-sm"
          placeholder="Describe the image for accessibility and SEO">
      </div>

      <div class="md-field">
        <label class="form-label" for="md-desc">Description</label>
        <textarea id="md-desc" v-model="form.description" class="form-control form-control-sm" rows="3"></textarea>
      </div>

      <div class="md-usage">
        <p class="md-usage-title">
          Used by
          <span class="md-usage-count" :class="{ 'is-none': !usage.length }">{{ usage.length }}</span>
        </p>
        <p v-if="loadingUsage" class="md-usage-empty">Checking...</p>
        <p v-else-if="!usage.length" class="md-usage-empty">
          Nothing references this file. Safe to delete.
        </p>
        <ul v-else class="md-usage-list">
          <li v-for="(use, i) in usage" :key="i">
            <span class="md-usage-type">{{ use.type }}</span>
            <span class="md-usage-label" :title="use.label">{{ use.label }}</span>
          </li>
        </ul>
      </div>

      <div v-if="error" class="alert alert-danger py-2 mb-0">{{ error }}</div>
    </div>

    <footer class="md-foot">
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="saving" @click="save">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
      <button type="button" class="btn btn-outline-danger btn-sm ms-auto" @click="$emit('delete', item)">
        Delete
      </button>
    </footer>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { FileText } from 'lucide-vue-next'

const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved', 'delete'])

const form = ref({ title: '', alt_text: '', description: '' })
const usage = ref([])
const loadingUsage = ref(false)
const saving = ref(false)
const copied = ref(false)
const error = ref(null)

const absoluteUrl = computed(() => window.location.origin + props.item.url)

const uploadedOn = computed(() => {
  if (!props.item.created_at) return '—'
  return new Date(props.item.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
})

const loadUsage = async (id) => {
  loadingUsage.value = true
  usage.value = []
  try {
    const { data } = await axios.get(route('admin.media-library.usage', id))
    usage.value = data.usage || []
  } catch {
    usage.value = []
  } finally {
    loadingUsage.value = false
  }
}

watch(
  () => props.item,
  (item) => {
    form.value = {
      title: item.title ?? '',
      alt_text: item.alt_text ?? '',
      description: item.description ?? '',
    }
    error.value = null
    copied.value = false

    // The list payload already carries usage; only fetch when it doesn't.
    if (Array.isArray(item.usage)) {
      usage.value = item.usage
    } else {
      loadUsage(item.id)
    }
  },
  { immediate: true }
)

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(absoluteUrl.value)
  } catch {
    // Clipboard needs a secure context; fall back to selecting the field.
    document.querySelector('.md-url input')?.select()
    document.execCommand?.('copy')
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
}

const save = async () => {
  saving.value = true
  error.value = null
  try {
    const { data } = await axios.patch(route('admin.media-library.update', props.item.id), form.value)
    emit('saved', data.item)
  } catch (e) {
    const errors = e.response?.data?.errors
    error.value = errors ? Object.values(errors).flat().join(' ') : 'Could not save.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.md-drawer {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e3e6ea;
  border-radius: 12px;
  max-height: calc(100vh - 130px);
  position: sticky;
  top: 84px;
}
.md-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-bottom: 1px solid #eceff1;
}
.md-close {
  border: 0; background: transparent; font-size: 22px; line-height: 1;
  color: #90a4ae; cursor: pointer; padding: 0 4px;
}
.md-close:hover { color: #455a64; }
.md-body { padding: 14px; overflow-y: auto; flex: 1; }
.md-preview {
  border-radius: 8px; overflow: hidden; background: #eceff1; margin-bottom: 14px;
}
.md-preview img, .md-preview video { width: 100%; max-height: 220px; object-fit: contain; display: block; background: #000; }
.md-doc {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; height: 150px; color: #546e7a; text-decoration: none; font-weight: 700;
}
.md-meta { margin: 0 0 14px; font-size: 12px; }
.md-meta > div { display: flex; gap: 10px; padding: 3px 0; }
.md-meta dt { color: #90a4ae; font-weight: 500; min-width: 82px; }
.md-meta dd { margin: 0; color: #37474f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-url { margin-bottom: 14px; }
.md-field { margin-bottom: 12px; }
.md-field .form-label, .md-url .form-label { font-size: 12px; font-weight: 600; color: #546e7a; margin-bottom: 4px; }
.md-usage { border-top: 1px solid #eceff1; padding-top: 12px; }
.md-usage-title {
  font-size: 12px; font-weight: 700; color: #546e7a; margin-bottom: 6px;
  display: flex; align-items: center; gap: 6px;
}
.md-usage-count {
  background: #e4f2e4; color: #1A2110; border-radius: 999px;
  padding: 1px 8px; font-size: 11px;
}
.md-usage-count.is-none { background: #fff0d3; color: #B9770E; }
.md-usage-empty { font-size: 12px; color: #90a4ae; margin: 0; }
.md-usage-list { list-style: none; margin: 0; padding: 0; max-height: 150px; overflow-y: auto; }
.md-usage-list li {
  display: flex; gap: 8px; align-items: baseline;
  font-size: 12px; padding: 3px 0; border-bottom: 1px dashed #eceff1;
}
.md-usage-type { color: #90a4ae; min-width: 88px; flex-shrink: 0; }
.md-usage-label { color: #37474f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-foot {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; border-top: 1px solid #eceff1;
}
</style>
