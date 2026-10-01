<script setup>
/**
 * Blog post editor — one form shared by Create and Edit.
 *
 * The old pages were raw HTML forms that posted the whole page, so validation
 * errors vanished silently and the description was edited as bare HTML. This is
 * an Inertia form with a Visual / HTML / Preview editor and a publish sidebar.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { slugify } from '@/utils/slug'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import { toast } from '@/utils/toast'
import {
  ArrowLeft, Eye, Code2, Type, ImagePlus, Trash2, X, UploadCloud, Loader2,
} from 'lucide-vue-next'

const props = defineProps({
  // null → create
  blog: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
})

const isEdit = computed(() => Boolean(props.blog?.id))

const form = useForm({
  title: props.blog?.title ?? '',
  // Only sent for an existing post: a new one gets its address from the title.
  slug: props.blog?.slug ?? '',
  category_id: props.blog?.category_id ?? '',
  tags: Array.isArray(props.blog?.tags) ? [...props.blog.tags] : [],
  description: props.blog?.description ?? '',
  image_library_path: props.blog?.image ?? '',
  status: props.blog?.status ?? 'Published',
  meta_title: props.blog?.meta_title ?? '',
  meta_description: props.blog?.meta_description ?? '',
})

/* ---------------------------------------------------------------- editor -- */

const TABS = [
  { key: 'visual', label: 'Visual', icon: Type },
  { key: 'html', label: 'HTML', icon: Code2 },
  { key: 'preview', label: 'Preview', icon: Eye },
]

const tab = ref('visual')
const editorEl = ref(null)
let summernoteReady = false

const hasSummernote = () =>
  typeof window.$ !== 'undefined' && Boolean(window.$.fn?.summernote)

function initEditor() {
  if (!hasSummernote() || summernoteReady || !editorEl.value) return

  window.$(editorEl.value).summernote({
    height: 460,
    placeholder: 'Write the post here…',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'underline', 'clear']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video']],
      ['view', ['fullscreen', 'codeview']],
    ],
    callbacks: {
      onChange(contents) {
        form.description = contents
      },
      onBlur() {
        form.description = window.$(editorEl.value).summernote('code')
      },
    },
  })

  window.$(editorEl.value).summernote('code', form.description || '')
  summernoteReady = true
}

function destroyEditor() {
  if (summernoteReady && hasSummernote()) {
    window.$(editorEl.value).summernote('destroy')
  }
  summernoteReady = false
}

onMounted(() => {
  nextTick(initEditor)
})

onBeforeUnmount(destroyEditor)

// Switching back to Visual re-mounts the editor with whatever the HTML tab left.
watch(tab, (next, prev) => {
  if (prev === 'visual') {
    if (summernoteReady && hasSummernote()) {
      form.description = window.$(editorEl.value).summernote('code')
    }
    destroyEditor()
  }

  if (next === 'visual') {
    nextTick(initEditor)
  }
})

const wordCount = computed(() => {
  const text = form.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text ? text.split(' ').length : 0
})

/* ------------------------------------------------------------------ tags -- */

const tagDraft = ref('')

function addTag() {
  const value = tagDraft.value.trim().replace(/,$/, '')
  if (!value) return
  if (!form.tags.includes(value)) form.tags.push(value)
  tagDraft.value = ''
}

function removeTag(tag) {
  form.tags = form.tags.filter((t) => t !== tag)
}

function onTagKey(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && !tagDraft.value && form.tags.length) {
    form.tags.pop()
  }
}

/* ----------------------------------------------------------------- image -- */

const showPicker = ref(false)
const uploading = ref(false)
const dragging = ref(false)
const fileInput = ref(null)

function onLibrarySelect(item) {
  showPicker.value = false
  form.image_library_path = item.url
}

async function uploadFiles(files) {
  const file = files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast('error', 'That file is not an image.')
    return
  }

  uploading.value = true

  try {
    const data = new FormData()
    data.append('files[]', file)

    const res = await fetch(route('admin.media-library.upload'), {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content,
        Accept: 'application/json',
      },
      body: data,
    })

    const payload = await res.json()

    if (payload.items?.length) {
      // Uploads land in the Media Library, so the image is reusable elsewhere.
      form.image_library_path = payload.items[0].url
      toast('success', 'Image uploaded')
    } else {
      toast('error', payload.errors?.[0]?.message || 'Upload failed.')
    }
  } catch (e) {
    toast('error', 'Upload failed.')
  } finally {
    uploading.value = false
  }
}

function onDrop(e) {
  dragging.value = false
  uploadFiles(e.dataTransfer?.files)
}

/* ---------------------------------------------------------------- submit -- */

function submit() {
  if (tab.value === 'visual' && summernoteReady && hasSummernote()) {
    form.description = window.$(editorEl.value).summernote('code')
  }

  if (isEdit.value) {
    form.put(route('blogs.update', props.blog.id), { preserveScroll: true })
  } else {
    form.post(route('blogs.store'), { preserveScroll: true })
  }
}
</script>

<template>
  <AdminLayout>
    <div class="page-content blog-editor">
      <PageHeader
        :title="isEdit ? 'Edit post' : 'New post'"
        :subtitle="isEdit ? blog.title : 'Write and publish a blog post'"
      >
        <template #actions>
          <a :href="route('blogs.index')" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
            <ArrowLeft :size="16" class="me-1" /> Back
          </a>
          <button
            type="submit"
            form="blog-form"
            class="btn btn-fig-primary btn-fig-sm ms-2"
            :disabled="form.processing"
          >
            {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : 'Publish') }}
          </button>
        </template>
      </PageHeader>

      <form id="blog-form" class="be-layout" @submit.prevent="submit">
        <!-- ── Main column ─────────────────────────────────────────── -->
        <div class="be-main">
          <div class="be-card">
            <input
              v-model="form.title"
              type="text"
              class="be-title-input"
              :class="{ 'is-invalid': form.errors.title }"
              placeholder="Post title"
            />
            <p v-if="form.errors.title" class="be-error">{{ form.errors.title }}</p>

            <!-- Editor tabs -->
            <div class="be-tabs">
              <button
                v-for="t in TABS"
                :key="t.key"
                type="button"
                class="be-tab"
                :class="{ 'is-active': tab === t.key }"
                @click="tab = t.key"
              >
                <component :is="t.icon" :size="14" /> {{ t.label }}
              </button>
              <span class="be-wordcount">{{ wordCount }} words</span>
            </div>

            <!-- Visual -->
            <div v-show="tab === 'visual'" class="be-editor">
              <textarea ref="editorEl" class="form-control" rows="14"></textarea>
              <p v-if="!hasSummernote()" class="be-hint be-hint--warn">
                The rich text toolbar could not load — use the HTML tab instead.
              </p>
            </div>

            <!-- HTML -->
            <div v-show="tab === 'html'" class="be-editor">
              <textarea
                v-model="form.description"
                class="form-control be-html"
                rows="20"
                spellcheck="false"
                placeholder="<p>Write HTML here…</p>"
              ></textarea>
              <p class="be-hint">Edits here appear in the Visual tab when you switch back.</p>
            </div>

            <!-- Preview -->
            <div v-show="tab === 'preview'" class="be-editor">
              <div class="be-preview">
                <h1 class="be-preview-title">{{ form.title || 'Post title' }}</h1>
                <img v-if="form.image_library_path" :src="form.image_library_path" class="be-preview-cover" alt="" />
                <div
                  v-if="form.description"
                  class="be-preview-body"
                  v-html="form.description"
                ></div>
                <p v-else class="be-hint">Nothing written yet.</p>
              </div>
              <p class="be-hint">This is how the post reads on the storefront.</p>
            </div>

            <p v-if="form.errors.description" class="be-error">{{ form.errors.description }}</p>
          </div>

          <!-- SEO -->
          <div class="be-card">
            <h2 class="be-card-title">Search engine listing</h2>
            <div class="be-serp">
              <span class="be-serp-url">charukothon.com/blog/{{ form.slug || '…' }}</span>
              <span class="be-serp-title">{{ form.meta_title || form.title || 'Post title' }}</span>
              <span class="be-serp-desc">
                {{ form.meta_description || form.description.replace(/<[^>]*>/g, ' ').slice(0, 160) || 'Add a description so search results read well.' }}
              </span>
            </div>

            <template v-if="isEdit">
              <label class="form-label mt-3" for="be-slug">Address</label>
              <div class="input-group">
                <span class="input-group-text">/blog/</span>
                <input
                  id="be-slug"
                  v-model="form.slug"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.slug }"
                />
              </div>
              <p v-if="form.errors.slug" class="be-error">{{ form.errors.slug }}</p>
              <small class="text-muted d-block mt-1">
                Changing this changes the link people may have saved.
                <button type="button" class="btn btn-link btn-sm p-0 align-baseline" @click="form.slug = slugify(form.title)">
                  Rebuild from the title
                </button>
              </small>
            </template>

            <label class="form-label mt-3">Meta title</label>
            <input v-model="form.meta_title" type="text" class="form-control" :placeholder="form.title" />

            <label class="form-label mt-3">Meta description</label>
            <textarea v-model="form.meta_description" class="form-control" rows="3"></textarea>
          </div>
        </div>

        <!-- ── Sidebar ─────────────────────────────────────────────── -->
        <aside class="be-side">
          <!-- Publish -->
          <div class="be-card">
            <h2 class="be-card-title">Publish</h2>
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-select">
              <option value="Published">Published — visible on the site</option>
              <option value="Draft">Draft — hidden from visitors</option>
            </select>
            <button
              type="submit"
              class="btn btn-fig-primary w-100 mt-3"
              :disabled="form.processing"
            >
              {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : 'Publish post') }}
            </button>
            <a
              v-if="isEdit && blog.slug"
              :href="`/blog/${blog.slug}`"
              target="_blank"
              class="be-view-link"
            >
              View on site ↗
            </a>
          </div>

          <!-- Featured image -->
          <div class="be-card">
            <h2 class="be-card-title">Featured image</h2>

            <div
              v-if="!form.image_library_path"
              class="be-drop"
              :class="{ 'is-dragging': dragging, 'is-busy': uploading }"
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="onDrop"
              @click="fileInput?.click()"
            >
              <Loader2 v-if="uploading" :size="22" class="be-spin" />
              <UploadCloud v-else :size="22" />
              <span>{{ uploading ? 'Uploading…' : 'Drop an image here' }}</span>
              <small>or click to choose a file</small>
            </div>

            <div v-else class="be-thumb">
              <img :src="form.image_library_path" alt="Featured image" />
              <button type="button" class="be-thumb-remove" title="Remove" @click="form.image_library_path = ''">
                <Trash2 :size="14" />
              </button>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="uploadFiles($event.target.files)"
            />

            <div class="d-flex gap-2 mt-2">
              <button type="button" class="btn btn-fig-secondary btn-fig-sm flex-1" @click="showPicker = true">
                <ImagePlus :size="14" class="me-1" /> Library
              </button>
              <button
                v-if="form.image_library_path"
                type="button"
                class="btn btn-fig-secondary btn-fig-sm"
                @click="fileInput?.click()"
              >
                Replace
              </button>
            </div>

            <p v-if="form.errors.image || form.errors.image_library_path" class="be-error">
              {{ form.errors.image || form.errors.image_library_path }}
            </p>
            <p class="be-hint">Uploads are saved to the Media Library so they can be reused.</p>
          </div>

          <!-- Category -->
          <div class="be-card">
            <h2 class="be-card-title">Category</h2>
            <select
              v-model="form.category_id"
              class="form-select"
              :class="{ 'is-invalid': form.errors.category_id }"
            >
              <option value="" disabled>Choose a category…</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <p v-if="form.errors.category_id" class="be-error">{{ form.errors.category_id }}</p>
            <a :href="route('blog-category.index')" class="be-hint-link">Manage categories</a>
          </div>

          <!-- Tags -->
          <div class="be-card">
            <h2 class="be-card-title">Tags</h2>
            <div class="be-tagbox" @click="$refs.tagField?.focus()">
              <span v-for="tag in form.tags" :key="tag" class="be-chip">
                {{ tag }}
                <button type="button" @click.stop="removeTag(tag)"><X :size="12" /></button>
              </span>
              <input
                ref="tagField"
                v-model="tagDraft"
                type="text"
                class="be-tagfield"
                :placeholder="form.tags.length ? '' : 'Type and press Enter'"
                @keydown="onTagKey"
                @blur="addTag"
              />
            </div>
            <p class="be-hint">Enter or comma adds a tag; Backspace removes the last one.</p>
          </div>
        </aside>
      </form>

      <MediaLibraryPickerModal
        v-if="showPicker"
        kind="image"
        @close="showPicker = false"
        @select="onLibrarySelect"
      />
    </div>
  </AdminLayout>
</template>

<style scoped>
.be-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4, 16px);
  align-items: start;
}

@media (min-width: 992px) {
  .be-layout {
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}

.be-main,
.be-side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4, 16px);
  min-width: 0;
}

.be-card {
  padding: var(--sp-4, 16px);
  background: var(--surface, #fff);
  border: 1px solid var(--line, #e9e4dd);
  border-radius: var(--r-md, 12px);
}

.be-card-title {
  margin: 0 0 12px;
  font-size: var(--fs-md, 14px);
  font-weight: 600;
}

/* ── Title ── */
.be-title-input {
  width: 100%;
  padding: 6px 0 12px;
  border: none;
  border-bottom: 1px solid var(--line, #e9e4dd);
  font-size: 24px;
  font-weight: 600;
  color: var(--ink, #2c1a0e);
  background: transparent;
}

.be-title-input:focus {
  outline: none;
  border-bottom-color: #356019;
}

.be-title-input.is-invalid {
  border-bottom-color: var(--st-danger, #c0392b);
}

/* ── Tabs ── */
.be-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 14px 0 10px;
}

.be-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ink-muted, #6b7280);
  font-size: 13px;
  font-weight: 500;
}

.be-tab:hover {
  background: var(--surface-2, #f6f2ec);
}

.be-tab.is-active {
  background: #eef4e7;
  border-color: #d5e5c4;
  color: #2c5015;
}

.be-wordcount {
  margin-left: auto;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

/* ── Editor panes ── */
.be-html {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 13px;
  line-height: 22px;
}

.be-preview {
  padding: 20px;
  background: #fffaf4;
  border: 1px solid #f0e6d8;
  border-radius: 12px;
  max-height: 620px;
  overflow-y: auto;
}

.be-preview-title {
  margin: 0 0 14px;
  font-family: "Sora", "Hind Siliguri", sans-serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 38px;
  color: #3e3c3a;
}

.be-preview-cover {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 18px;
}

/* Mirrors the storefront article styles so the preview is honest. */
.be-preview-body {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 30px;
  color: #4a423b;
}

.be-preview-body :deep(p) { margin: 0 0 18px; }
.be-preview-body :deep(h2) {
  margin: 28px 0 10px;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #3e3c3a;
}
.be-preview-body :deep(h3) {
  margin: 22px 0 8px;
  font-size: 17px;
  font-weight: 600;
  color: #3e3c3a;
}
.be-preview-body :deep(ul) { list-style: disc; padding-left: 22px; margin-bottom: 18px; }
.be-preview-body :deep(ol) { list-style: decimal; padding-left: 22px; margin-bottom: 18px; }
.be-preview-body :deep(li) { margin-bottom: 6px; }
.be-preview-body :deep(a) { color: #2c5015; text-decoration: underline; }
.be-preview-body :deep(blockquote) {
  margin: 20px 0;
  padding: 14px 18px;
  border-left: 3px solid #c9a87c;
  border-radius: 0 10px 10px 0;
  background: #fdf6ee;
  font-style: italic;
}
.be-preview-body :deep(img) { max-width: 100%; border-radius: 10px; margin: 14px 0; }

/* ── SERP preview ── */
.be-serp {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  background: var(--surface-2, #f8f6f3);
  border-radius: 10px;
}

.be-serp-url { font-size: 12px; color: #4b8b3b; }
.be-serp-title {
  font-size: 16px;
  color: #1a0dab;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.be-serp-desc {
  font-size: 13px;
  line-height: 20px;
  color: var(--ink-muted, #4b5563);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Featured image ── */
.be-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 26px 12px;
  border: 1.5px dashed var(--line, #ddd5cb);
  border-radius: 12px;
  background: var(--surface-2, #faf8f5);
  color: var(--ink-muted, #6b7280);
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.be-drop:hover,
.be-drop.is-dragging {
  border-color: #356019;
  background: #f2f7ec;
  color: #2c5015;
}

.be-drop small { font-size: 11px; opacity: 0.75; }
.be-drop.is-busy { pointer-events: none; opacity: 0.75; }

.be-spin { animation: be-rotate 0.9s linear infinite; }

@keyframes be-rotate {
  to { transform: rotate(360deg); }
}

.be-thumb {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-2, #f4f1ec);
}

.be-thumb img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.be-thumb-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #c0392b;
}

.flex-1 { flex: 1; }

/* ── Tags ── */
.be-tagbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  padding: 6px 8px;
  border: 1px solid var(--line, #ddd5cb);
  border-radius: 8px;
  background: #fff;
  cursor: text;
}

.be-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #eef4e7;
  color: #2c5015;
  font-size: 12px;
  font-weight: 500;
}

.be-chip button {
  display: inline-flex;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.7;
}

.be-chip button:hover { opacity: 1; }

.be-tagfield {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  font-size: 13px;
}

/* ── Misc ── */
.be-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

.be-hint--warn { color: #b45309; }

.be-hint-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  color: #2c5015;
  text-decoration: underline;
}

.be-error {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--st-danger, #c0392b);
}

.be-view-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #2c5015;
}
</style>
