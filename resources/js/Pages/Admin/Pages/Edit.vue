<script setup>
/**
 * One editor for every storefront page.
 *
 * Content is edited as a list of widgets rather than one HTML blob; the server
 * renders them into the page's `content`, which is what the storefront reads.
 * A page that owns banners (Home) manages them here too, so there is no
 * separate Banners screen.
 */
import { computed, ref, toRaw } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import BannerEditModal from '@/Pages/Admin/Sliders/Partials/BannerEditModal.vue'
import RichTextField from './Partials/RichTextField.vue'
import ProductSequenceModal from './Partials/ProductSequenceModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { slugify } from '@/utils/slug'
import { toast } from '@/utils/toast'
import { useMediaUploader } from '@/composables/useMediaUploader'
import {
  ArrowLeft, Heading, Type, Image as ImageIcon, Columns2, Code2,
  Images, Video, Clapperboard, LayoutGrid, Megaphone, X,
  ChevronUp, ChevronDown, ChevronRight, Trash2, Plus, Eye, EyeOff,
  ExternalLink, Pencil, GripVertical, Copy, FoldVertical, UnfoldVertical,
  ListOrdered,
} from 'lucide-vue-next'

const props = defineProps({
  page: { type: Object, required: true },
  banners: { type: Array, default: () => [] },
  // Options for the product-section widget
  categories: { type: Array, default: () => [] },
})

const WIDGETS = [
  { type: 'heading', label: 'Heading', icon: Heading },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'image_text', label: 'Image + text', icon: Columns2 },
  { type: 'gallery', label: 'Image gallery', icon: Images },
  { type: 'video_strip', label: 'Video strip', icon: Clapperboard },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'cta_banner', label: 'Call to action', icon: Megaphone },
  { type: 'feature_cards', label: 'Feature cards', icon: LayoutGrid },
  { type: 'product_section', label: 'Product section', icon: LayoutGrid },
  { type: 'html', label: 'Custom HTML', icon: Code2 },
]

// Where a product section takes its products from.
const PRODUCT_SOURCES = [
  { value: 'new_arrival', label: 'New arrivals — products flagged in the product list' },
  { value: 'category', label: 'A category' },
  { value: 'featured', label: 'Featured products' },
  { value: 'latest', label: 'Latest products' },
]

const WIDGET_LABELS = Object.fromEntries(WIDGETS.map((w) => [w.type, w.label]))

let uid = 0
const nextId = () => `b${Date.now()}${uid++}`

const form = useForm({
  label: props.page.page_label ?? '',
  texts: { ...(props.page.texts ?? {}) },
  title: props.page.title ?? '',
  subtitle: props.page.subtitle ?? '',
  blocks: (props.page.blocks ?? []).map((b) => ({ id: b.id ?? nextId(), ...b })),
  is_published: props.page.is_published ?? true,
  // A page you created owns its address and its own search-engine wording; a
  // built-in page's URL is a fixed route, so these are sent for custom pages only.
  slug: props.page.slug ?? '',
  meta_title: props.page.meta_title ?? '',
  meta_description: props.page.meta_description ?? '',
  // Settings that belong to this page (contact details, footer text, titles…)
  fields: Object.fromEntries((props.page.fields ?? []).map((f) => [f.key, f.value ?? ''])),
})

// The slug follows the title only while it has never been set by hand, so
// renaming a live page does not silently move its address.
const slugTouched = ref(Boolean(props.page.slug))

function onCustomTitle() {
  if (slugTouched.value) return
  form.slug = slugify(form.title)
}

const pageFields = computed(() => props.page.fields ?? [])
const canSave = computed(() => props.page.editable || pageFields.value.length > 0)
const fieldPicker = ref(null)

function openFieldPicker(key) {
  fieldPicker.value = key
}

function onFieldImageSelected(item) {
  if (fieldPicker.value) form.fields[fieldPicker.value] = item.url
  fieldPicker.value = null
}

const showPreview = ref(false)

/* ------------------------------------------------------------- widgets -- */

function addWidget(type, at = null) {
  const base = { id: nextId(), type }

  if (type === 'heading') Object.assign(base, { text: '', level: 2 })
  if (type === 'text') Object.assign(base, { html: '' })
  if (type === 'image') Object.assign(base, { url: '', alt: '', caption: '' })
  if (type === 'image_text') Object.assign(base, { url: '', alt: '', html: '', position: 'left' })
  if (type === 'html') Object.assign(base, { code: '' })
  if (type === 'gallery') Object.assign(base, { title: '', items: [], columns: 4 })
  if (type === 'video_strip') Object.assign(base, { title: '', items: [] })
  if (type === 'video') Object.assign(base, { title: '', video_url: '', caption: '' })
  if (type === 'cta_banner') Object.assign(base, { title: '', text: '', button_label: '', button_url: '/shop' })
  if (type === 'feature_cards') Object.assign(base, { title: '', items: [{ title: '', text: '' }] })
  if (type === 'product_section') {
    Object.assign(base, {
      title: '', subtitle: '', source: 'new_arrival', category_id: null,
      limit: 4, columns: 4, cta_label: '', cta_url: '/shop',
      // Manual order, set through the Sequence modal. Empty means the source's
      // own order (newest first) stands.
      product_ids: [],
    })
  }

  // `at` is the gap the + was clicked in; without it the widget lands at the end.
  if (at === null || at >= form.blocks.length) {
    form.blocks.push(base)
  } else {
    form.blocks.splice(Math.max(0, at), 0, base)
  }

  insertAt.value = null
  return base
}

function move(index, delta) {
  const target = index + delta
  if (target < 0 || target >= form.blocks.length) return

  const copy = [...form.blocks]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  form.blocks = copy
}

function duplicateWidget(index) {
  // structuredClone keeps nested gallery/strip items from being shared by reference.
  const copy = { ...structuredClone(toRaw(form.blocks[index])), id: nextId() }
  form.blocks.splice(index + 1, 0, copy)
}

async function removeWidget(index) {
  const ok = await confirmDelete({
    title: 'Remove this widget?',
    text: 'Its content will be removed from the page when you save.',
    confirmButtonText: 'Remove',
  })

  if (ok) form.blocks.splice(index, 1)
}

/* ------------------------------------------------------- collapse state -- */

// Ids are collapsed rather than indexes, so reordering does not collapse the
// wrong widget.
const collapsed = ref(new Set())

// Text sections start closed, so a page with many fields is still scannable.
const closedSections = ref(new Set((props.page.text_sections ?? []).map((s) => s.key)))

function toggleSection(key) {
  const next = new Set(closedSections.value)
  next.has(key) ? next.delete(key) : next.add(key)
  closedSections.value = next
}

// Which text field the media picker is filling: a field key, or
// { key, row, sub } for an image inside a repeater row.
const textPicker = ref(null)

/* ------------------------------------------------------- repeaters -- */

const repDragFrom = ref(null)
const repDragOver = ref(null)

function addRow(field) {
  if (!Array.isArray(form.texts[field.key])) form.texts[field.key] = []
  // A blank row shaped like the others, so every sub-field binds.
  form.texts[field.key].push(
    // An on/off switch starts on, so a new row shows straight away.
    Object.fromEntries(Object.entries(field.fields).map(([k, sub]) => [k, sub.type === 'toggle' ? '1' : '']))
  )
}

function dropRow(field, to) {
  const from = repDragFrom.value
  repDragFrom.value = null
  repDragOver.value = null

  if (from === null || from === to) return

  const rows = [...form.texts[field.key]]
  const [moved] = rows.splice(from, 1)
  rows.splice(from < to ? to - 1 : to, 0, moved)
  form.texts[field.key] = rows
}

function onTextImageSelected(item) {
  const target = textPicker.value
  if (target && typeof target === 'object') {
    form.texts[target.key][target.row][target.sub] = item.url
  } else if (target) {
    form.texts[target] = item.url
  }
  textPicker.value = null
}

/* ---------------------------------------------------------- banners -- */

// Desktop / Mobile banner: a file picked here goes into the Media Library and
// straight into the field; Save stores the page as usual.
const { upload: uploadMedia } = useMediaUploader()
const bannerUploading = ref(null)

async function uploadBanner(field, event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  bannerUploading.value = field.key
  try {
    const { uploaded } = await uploadMedia([file])
    if (uploaded?.[0]?.url) {
      form.texts[field.key] = uploaded[0].url
      toast.success('Banner uploaded — press Save to publish it.')
    } else {
      toast.error('The banner could not be uploaded.')
    }
  } finally {
    bannerUploading.value = null
  }
}

/* ------------------------------------------------------ widget slots -- */

// A slot shows, in page order, the widgets that render at that point.
const SLOT_TYPES = ['product_section', 'cta_banner', 'video_strip']
const slotBlocks = (section) =>
  form.blocks.filter((block) =>
    section.widget_types.includes('other')
      ? !SLOT_TYPES.includes(block.type)
      : section.widget_types.includes(block.type)
  )
const widgetLabel = (block) =>
  block.title || WIDGETS.find((w) => w.type === block.type)?.label || block.type

function goToWidget(block) {
  const next = new Set(collapsed.value)
  next.delete(block.id)
  collapsed.value = next
  document.getElementById(`pg-w-${block.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** On/off fields are stored as '1' / '0', like every other text value. */
const isOn = (value) => value !== '0' && value !== 0 && value !== false

function toggleCollapse(id) {
  const next = new Set(collapsed.value)
  next.has(id) ? next.delete(id) : next.add(id)
  collapsed.value = next
}

const allCollapsed = computed(
  () => form.blocks.length > 0 && form.blocks.every((b) => collapsed.value.has(b.id))
)

function toggleAll() {
  collapsed.value = allCollapsed.value ? new Set() : new Set(form.blocks.map((b) => b.id))
}

/** What a collapsed widget shows so it can be identified without opening it. */
function summarise(block) {
  const text = (value) => {
    const plain = String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return plain.length > 70 ? `${plain.slice(0, 70)}…` : plain
  }

  switch (block.type) {
    case 'heading':    return text(block.text) || 'Empty heading'
    case 'text':       return text(block.html) || 'Empty text'
    case 'image':      return text(block.caption) || text(block.alt) || (block.url ? 'Image set' : 'No image chosen')
    case 'image_text': return text(block.html) || (block.url ? 'Image set' : 'Empty')
    case 'gallery':    return `${(block.items || []).length} image(s)${block.title ? ` — ${text(block.title)}` : ''}`
    case 'video_strip':return `${(block.items || []).length} clip(s)${block.title ? ` — ${text(block.title)}` : ''}`
    case 'video':      return text(block.title) || text(block.video_url) || 'No video set'
    case 'cta_banner': return text(block.title) || text(block.button_label) || 'Empty banner'
    case 'feature_cards': return `${(block.items || []).length} card(s)${block.title ? ` — ${text(block.title)}` : ''}`
    case 'product_section': {
      const source = PRODUCT_SOURCES.find((s) => s.value === block.source)
      const sequenced = (block.product_ids ?? []).length ? ' · sequenced' : ''
      return `${block.limit || 0} products — ${source ? source.label.split(' — ')[0] : block.source}${sequenced}`
    }
    case 'html':       return text(block.code) || 'Empty HTML'
    default:           return ''
  }
}

/* ---------------------------------------------- product section sequence -- */

// The widget whose Sequence modal is open, or null when none is.
const sequenceFor = ref(null)

function openSequence(block) {
  sequenceFor.value = block
}

function onSequenceSaved(ids) {
  if (sequenceFor.value) sequenceFor.value.product_ids = ids
  sequenceFor.value = null

  toast('success', ids.length ? 'Sequence set — save the page to publish it.' : 'Sequence cleared.')
}

/**
 * A sequence is a list of specific products, so it means nothing once the
 * widget is pointed somewhere else. Rather than silently carrying a stale
 * order into the new source, it is dropped and the operator is told.
 */
function onSourceChanged(block) {
  if (block.source !== 'category') block.category_id = null

  if ((block.product_ids ?? []).length) {
    block.product_ids = []
    toast('info', 'The products changed, so the saved sequence was cleared.')
  }
}

/* -------------------------------------------------- insert between blocks -- */

// Index of the gap whose widget menu is open, or null when none is.
const insertAt = ref(null)

function openInserter(index) {
  insertAt.value = insertAt.value === index ? null : index
}

/* ------------------------------------------------------ drag to reorder -- */

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

  const copy = [...form.blocks]
  const [moved] = copy.splice(from, 1)
  // Removing the dragged widget shifts everything after it up by one.
  copy.splice(from < index ? index - 1 : index, 0, moved)
  form.blocks = copy
}

function onDragEnd() {
  dragFrom.value = null
  dragOver.value = null
}

/* --------------------------------------------------------------- image -- */

const pickerFor = ref(null)
const galleryFor = ref(null)

function openPicker(block) {
  pickerFor.value = block
}

function onLibrarySelected(item) {
  if (pickerFor.value) pickerFor.value.url = item.url
  pickerFor.value = null
}

/* --------------------------------------------------------------- gallery -- */

function openGalleryPicker(block) {
  galleryFor.value = block
}

function onGallerySelected(items) {
  const chosen = Array.isArray(items) ? items : [items]

  if (galleryFor.value) {
    galleryFor.value.items = [
      ...(galleryFor.value.items ?? []),
      ...chosen.map((i) => ({ url: i.url, alt: '' })),
    ]
  }

  galleryFor.value = null
}

function removeGalleryItem(block, index) {
  block.items.splice(index, 1)
}

/* ---------------------------------------------------------- video strip -- */

const stripFor = ref(null)

function addCard(block) {
  if (!Array.isArray(block.items)) block.items = []
  block.items.push({ title: '', text: '' })
}

function addStripItem(block) {
  if (!Array.isArray(block.items)) block.items = []
  block.items.push({ url: '', poster: '' })
}

function openStripPicker(block, index) {
  stripFor.value = { block, index }
}

function onStripSelected(item) {
  if (stripFor.value) {
    stripFor.value.block.items[stripFor.value.index].url = item.url
  }
  stripFor.value = null
}

/* ------------------------------------------------------------- video -- */

const videoFor = ref(null)

function onVideoSelected(item) {
  if (videoFor.value) videoFor.value.video_url = item.url
  videoFor.value = null
}

/**
 * Whether a value points at a file on this site, so a thumbnail can be drawn.
 * A YouTube or Drive link cannot be previewed in a <video> tag.
 */
function isLocalVideo(url) {
  return typeof url === 'string' && /^\/.+\.(mp4|webm|ogv|mov|m4v)$/i.test(url.trim())
}

/* ------------------------------------------------------------- preview -- */

const previewHtml = computed(() =>
  form.blocks
    .map((b) => {
      if (b.type === 'heading' && b.text) return `<h${b.level || 2}>${escapeHtml(b.text)}</h${b.level || 2}>`
      if (b.type === 'text') return b.html || ''
      if (b.type === 'image' && b.url) {
        return `<figure><img src="${b.url}" alt="${escapeHtml(b.alt || '')}">${b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ''}</figure>`
      }
      if (b.type === 'image_text') {
        const media = b.url ? `<div class="page-split-media"><img src="${b.url}" alt=""></div>` : ''
        const body = `<div class="page-split-body">${b.html || ''}</div>`
        return `<div class="page-split page-split--${b.position || 'left'}">${b.position === 'right' ? body + media : media + body}</div>`
      }
      if (b.type === 'html') return b.code || ''
      return ''
    })
    .filter(Boolean)
    .join('\n')
)

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

/* -------------------------------------------------------------- banners -- */

// null = closed, 'new' = adding, or the banner being edited.
const bannerModal = ref(null)

async function removeBanner(banner) {
  const ok = await confirmDelete({
    title: 'Delete this banner?',
    text: 'It will stop showing on the storefront.',
  })

  if (ok) router.delete(route('admin.sliders.banner.destroy', banner.id), { preserveScroll: true })
}

/* --------------------------------------------------------------- submit -- */

function submit() {
  form.put(route('admin.pages.update', props.page.type), { preserveScroll: true })
}
</script>

<template>
  <AdminLayout>
    <div class="page-content pg-editor">
      <PageHeader :title="page.label" :subtitle="page.note || 'Edit what this page shows on the storefront'">
        <template #actions>
          <a :href="route('admin.pages.index')" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
            <ArrowLeft :size="16" class="me-1" /> All pages
          </a>
          <a v-if="page.url" :href="page.url" target="_blank" class="btn btn-fig-secondary btn-fig-sm ms-2 d-inline-flex align-items-center">
            <ExternalLink :size="16" class="me-1" /> View
          </a>
          <button
            v-if="canSave"
            type="button"
            class="btn btn-fig-primary btn-fig-sm ms-2"
            :disabled="form.processing"
            @click="submit"
          >
            {{ form.processing ? 'Saving…' : 'Save page' }}
          </button>
        </template>
      </PageHeader>

      <div class="pg-layout" :class="{ 'has-preview': showPreview }">
        <div class="pg-main">
          <!-- ── Page settings (pages you created) ────────────────── -->
          <div v-if="page.is_custom" class="card">
            <div class="card-header">
              <h6 class="mb-0">Page settings</h6>
              <p class="mb-0 text-muted small">
                The name of this page and the address it answers on.
              </p>
            </div>
            <div class="card-body">
              <label class="form-label" for="pg-custom-title">Title</label>
              <input
                id="pg-custom-title"
                v-model="form.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': form.errors.title }"
                @input="onCustomTitle"
              />
              <div class="invalid-feedback">{{ form.errors.title }}</div>

              <label class="form-label mt-3" for="pg-custom-slug">Address</label>
              <div class="input-group">
                <span class="input-group-text">/</span>
                <input
                  id="pg-custom-slug"
                  v-model="form.slug"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.slug }"
                  @input="slugTouched = true"
                />
                <div class="invalid-feedback">{{ form.errors.slug }}</div>
              </div>
              <small class="text-muted d-block mt-1">
                Changing this changes the link people may have saved or shared.
              </small>

              <label class="form-label mt-3" for="pg-custom-subtitle">Subtitle</label>
              <textarea
                id="pg-custom-subtitle"
                v-model="form.subtitle"
                class="form-control"
                rows="2"
              ></textarea>
              <small class="text-muted d-block mt-1">The line under the heading. Leave blank for none.</small>

              <label class="form-label mt-3" for="pg-custom-meta-title">Meta title</label>
              <input
                id="pg-custom-meta-title"
                v-model="form.meta_title"
                type="text"
                class="form-control"
                :placeholder="form.title"
              />

              <label class="form-label mt-3" for="pg-custom-meta-desc">Meta description</label>
              <textarea
                id="pg-custom-meta-desc"
                v-model="form.meta_description"
                class="form-control"
                rows="2"
              ></textarea>
              <small class="text-muted d-block mt-1">What search engines show under the title.</small>
            </div>
          </div>

          <!-- ── Banners ─────────────────────────────────────────── -->
          <div v-if="page.banners" class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">Banners</h6>
                <p class="mb-0 text-muted small">
                  Hero images at the top of the page. 1900×560 for desktop, plus an
                  optional square image for phones.
                </p>
              </div>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="bannerModal = 'new'">
                <Plus :size="15" class="me-1" /> Add banner
              </button>
            </div>
            <div class="card-body">
              <div v-if="banners.length" class="pg-banners">
                <figure v-for="banner in banners" :key="banner.id" class="pg-banner">
                  <img :src="banner.image_path" alt="" />
                  <span class="pg-banner-tag" :class="{ 'is-missing': !banner.mobile_image_path }">
                    {{ banner.mobile_image_path ? 'Mobile set' : 'No mobile image' }}
                  </span>
                  <figcaption>
                    <button type="button" class="table-icon-btn is-primary" title="Replace images" @click="bannerModal = banner">
                      <Pencil :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn is-danger" title="Delete" @click="removeBanner(banner)">
                      <Trash2 :size="14" />
                    </button>
                  </figcaption>
                </figure>
              </div>
              <p v-else class="text-muted mb-0">No banners yet — add the first one.</p>
            </div>
          </div>

          <!-- ── Page header ─────────────────────────────────────── -->
          <div v-if="page.editable && page.has_header" class="card">
            <div class="card-header">
              <h6 class="mb-0">Page header</h6>
              <p class="mb-0 text-muted small">
                The heading and the line under it at the top of the page. Leave them
                blank to keep the storefront's built-in wording.
              </p>
            </div>
            <div class="card-body">
              <template v-if="page.has_label">
                <label class="form-label" for="pg-label">Label</label>
                <input id="pg-label" v-model="form.label" type="text" class="form-control" />
                <small class="text-muted d-block mb-3">The small line above the heading.</small>
              </template>

              <label class="form-label" for="pg-title">Title</label>
              <input id="pg-title" v-model="form.title" type="text" class="form-control" />

              <label class="form-label mt-3" for="pg-subtitle">Subtitle</label>
              <textarea id="pg-subtitle" v-model="form.subtitle" class="form-control" rows="2"></textarea>
            </div>
          </div>

          <!-- ── Page text, grouped as the page renders it ───────── -->
          <div
            v-for="section in page.text_sections ?? []"
            :key="section.key"
            class="card pg-textsec"
            :class="{ 'is-collapsed': closedSections.has(section.key) }"
          >
            <div class="card-header pg-block-head">
              <button
                type="button"
                class="pg-block-toggle"
                :aria-expanded="!closedSections.has(section.key)"
                @click="toggleSection(section.key)"
              >
                <ChevronRight :size="14" class="pg-caret" />
                <span class="pg-block-type">{{ section.title }}</span>
                <span class="pg-block-summary">
                  <template v-if="section.widget_types">{{ slotBlocks(section).length }} widget{{ slotBlocks(section).length === 1 ? '' : 's' }}</template>
                  <template v-else>{{ section.fields.length }} field{{ section.fields.length === 1 ? '' : 's' }}</template>
                </span>
              </button>
            </div>

            <div v-show="!closedSections.has(section.key)" class="card-body">
              <!-- Widgets that render here on the page -->
              <div v-if="section.widget_types" class="pg-slot">
                <p class="pg-text-note mb-2">Shown here on the page. Edit them in Widgets below.</p>
                <div v-for="block in slotBlocks(section)" :key="block.id" class="pg-slot-row">
                  <span class="pg-slot-name">{{ widgetLabel(block) }}</span>
                  <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="goToWidget(block)">Edit</button>
                </div>
                <p v-if="!slotBlocks(section).length" class="text-muted small mb-0">None yet.</p>
              </div>

              <div v-else class="pg-text-grid">
                <div
                  v-for="field in section.fields"
                  :key="field.key"
                  class="pg-text-field"
                  :class="{ 'is-wide': field.type === 'textarea' || field.type === 'image' || field.type === 'banner' }"
                >
                  <label class="form-label" :for="`pt-${field.key}`">{{ field.label }}</label>

                  <!-- Repeater: a list the operator can grow, prune and reorder -->
                  <div v-if="field.type === 'repeater'" class="pg-rep">
                    <div
                      v-for="(row, i) in form.texts[field.key] ?? []"
                      :key="i"
                      class="pg-rep-row"
                      :class="{ 'is-over': repDragOver === i && repDragFrom !== null }"
                      @dragover.prevent="repDragOver = i"
                      @drop.prevent="dropRow(field, i)"
                    >
                      <span
                        class="pg-drag"
                        title="Drag to reorder"
                        draggable="true"
                        @dragstart="repDragFrom = i"
                        @dragend="repDragFrom = null; repDragOver = null"
                      >
                        <GripVertical :size="15" />
                      </span>

                      <div class="pg-rep-fields">
                        <div v-for="(sub, subKey) in field.fields" :key="subKey" class="pg-rep-field">
                          <label class="form-label">{{ sub.label }}</label>
                          <textarea
                            v-if="sub.type === 'textarea'"
                            v-model="row[subKey]"
                            class="form-control"
                            rows="2"
                          ></textarea>
                          <!-- An image in a row, from the Media Library -->
                          <div v-else-if="sub.type === 'image'" class="pg-image-row">
                            <div class="pg-image-preview">
                              <img v-if="row[subKey]" :src="row[subKey]" alt="" />
                              <span v-else>No image</span>
                            </div>
                            <div class="d-flex gap-2 flex-wrap">
                              <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="textPicker = { key: field.key, row: i, sub: subKey }">
                                <Images :size="14" class="me-1" />
                                {{ row[subKey] ? 'Replace' : 'Choose from library' }}
                              </button>
                              <button v-if="row[subKey]" type="button" class="btn btn-fig-secondary btn-fig-sm" @click="row[subKey] = ''">Remove</button>
                            </div>
                          </div>
                          <!-- Show / hide this row -->
                          <div v-else-if="sub.type === 'toggle'" class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              :checked="isOn(row[subKey])"
                              @change="row[subKey] = $event.target.checked ? '1' : '0'"
                            />
                            <span class="small text-muted">{{ isOn(row[subKey]) ? 'Shown' : 'Hidden' }}</span>
                          </div>
                          <input v-else v-model="row[subKey]" type="text" class="form-control" />
                        </div>
                      </div>

                      <button
                        type="button"
                        class="table-icon-btn is-danger"
                        title="Remove"
                        @click="form.texts[field.key].splice(i, 1)"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>

                    <button type="button" class="btn btn-fig-secondary btn-fig-sm mt-2" @click="addRow(field)">
                      <Plus :size="14" class="me-1" /> Add
                    </button>
                  </div>

                  <!-- Desktop / Mobile banner -->
                  <div v-else-if="field.type === 'banner'" class="pg-banner">
                    <div class="pg-banner-preview" :class="`is-${field.variant || 'desktop'}`">
                      <img v-if="form.texts[field.key]" :src="form.texts[field.key]" alt="" />
                      <span v-else>No banner</span>
                    </div>
                    <div class="d-flex gap-2 flex-wrap mt-2">
                      <label class="btn btn-fig-secondary btn-fig-sm mb-0" :class="{ disabled: bannerUploading === field.key }">
                        <Images :size="14" class="me-1" />
                        {{ bannerUploading === field.key ? 'Uploading…' : (form.texts[field.key] ? 'Change' : 'Upload') }}
                        <input type="file" accept="image/*" hidden @change="uploadBanner(field, $event)" />
                      </label>
                      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="textPicker = field.key">From library</button>
                      <button v-if="form.texts[field.key]" type="button" class="btn btn-fig-secondary btn-fig-sm" @click="form.texts[field.key] = ''">Reset to original</button>
                      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing" @click="submit">Save</button>
                    </div>
                  </div>

                  <!-- Image: picked from the Media Library -->
                  <div v-else-if="field.type === 'image'" class="pg-image-row">
                    <div class="pg-image-preview">
                      <img v-if="form.texts[field.key]" :src="form.texts[field.key]" alt="" />
                      <span v-else>No image</span>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex gap-2">
                        <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="textPicker = field.key">
                          <Images :size="14" class="me-1" />
                          {{ form.texts[field.key] ? 'Replace' : 'Choose from library' }}
                        </button>
                        <button
                          v-if="form.texts[field.key]"
                          type="button"
                          class="btn btn-fig-secondary btn-fig-sm"
                          @click="form.texts[field.key] = ''"
                        >
                          Reset
                        </button>
                      </div>
                      <small class="pg-text-path">{{ form.texts[field.key] || 'Using the image it shipped with' }}</small>
                    </div>
                  </div>

                  <!-- Show / hide a section -->
                  <div v-else-if="field.type === 'toggle'" class="form-check form-switch">
                    <input
                      :id="`pt-${field.key}`"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      :checked="isOn(form.texts[field.key])"
                      @change="form.texts[field.key] = $event.target.checked ? '1' : '0'"
                    />
                    <span class="small text-muted">{{ isOn(form.texts[field.key]) ? 'Shown on the site' : 'Hidden' }}</span>
                  </div>

                  <textarea
                    v-else-if="field.type === 'textarea'"
                    :id="`pt-${field.key}`"
                    v-model="form.texts[field.key]"
                    class="form-control"
                    rows="2"
                  ></textarea>

                  <input
                    v-else
                    :id="`pt-${field.key}`"
                    v-model="form.texts[field.key]"
                    :type="field.type === 'url' ? 'text' : 'text'"
                    class="form-control"
                  />

                  <small v-if="field.help" class="text-muted d-block mt-1">{{ field.help }}</small>
                </div>
              </div>

              <p v-if="!section.widget_types" class="pg-text-note">Clear a field to put back the wording this page came with.</p>
            </div>
          </div>

          <!-- ── Page settings ───────────────────────────────────── -->
          <div v-if="pageFields.length" class="card">
            <div class="card-header">
              <h6 class="mb-0">Page settings</h6>
              <p class="mb-0 text-muted small">What this page shows besides its body copy.</p>
            </div>
            <div class="card-body">
              <div v-for="field in pageFields" :key="field.key" class="mb-3">
                <label class="form-label" :for="`pf-${field.key}`">{{ field.label }}</label>

                <div v-if="field.type === 'image'" class="pg-image-row">
                  <div class="pg-image-preview">
                    <img v-if="form.fields[field.key]" :src="form.fields[field.key]" alt="" />
                    <span v-else>No image</span>
                  </div>
                  <div>
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="openFieldPicker(field.key)">
                      {{ form.fields[field.key] ? 'Change image' : 'Choose from Media Library' }}
                    </button>
                  </div>
                </div>

                <textarea
                  v-else-if="field.type === 'textarea'"
                  :id="`pf-${field.key}`"
                  v-model="form.fields[field.key]"
                  class="form-control"
                  rows="3"
                ></textarea>

                <input
                  v-else
                  :id="`pf-${field.key}`"
                  v-model="form.fields[field.key]"
                  :type="field.type === 'email' ? 'email' : (field.type === 'url' ? 'url' : 'text')"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors[`fields.${field.key}`] }"
                />

                <p v-if="form.errors[`fields.${field.key}`]" class="pg-error">
                  {{ form.errors[`fields.${field.key}`] }}
                </p>
              </div>
            </div>
          </div>

          <!-- ── Widgets ─────────────────────────────────────────── -->
          <template v-if="page.editable && page.widgets !== false">
            <div class="pg-toolbar">
              <span class="pg-toolbar-count">
                {{ form.blocks.length }} widget{{ form.blocks.length === 1 ? '' : 's' }}
              </span>
              <button
                v-if="form.blocks.length"
                type="button"
                class="pg-toolbar-btn"
                @click="toggleAll"
              >
                <component :is="allCollapsed ? UnfoldVertical : FoldVertical" :size="14" />
                {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
              </button>
              <button type="button" class="pg-toolbar-btn ms-auto" @click="showPreview = !showPreview">
                <component :is="showPreview ? EyeOff : Eye" :size="14" />
                {{ showPreview ? 'Hide preview' : 'Live preview' }}
              </button>
            </div>

            <div v-if="!form.blocks.length" class="card pg-empty">
              <div class="card-body text-center">
                <h6 class="mb-1">This page is empty</h6>
                <p class="text-muted small mb-3">Pick a widget to start building it.</p>
                <div class="pg-empty-grid">
                  <button
                    v-for="w in WIDGETS"
                    :key="w.type"
                    type="button"
                    class="pg-inserter-btn"
                    @click="addWidget(w.type)"
                  >
                    <component :is="w.icon" :size="14" />
                    <span>{{ w.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <template v-for="(block, index) in form.blocks" :key="block.id">
              <!-- Drop zone + insert point above this widget -->
              <div
                class="pg-gap"
                :class="{ 'is-over': dragOver === index && dragFrom !== null, 'is-open': insertAt === index }"
                @dragover.prevent="onDragOver(index)"
                @drop.prevent="onDrop(index)"
              >
                <button type="button" class="pg-gap-btn" title="Add a widget here" @click="openInserter(index)">
                  <Plus :size="13" />
                </button>
                <div v-if="insertAt === index" class="pg-inserter">
                  <button
                    v-for="w in WIDGETS"
                    :key="w.type"
                    type="button"
                    class="pg-inserter-btn"
                    @click="addWidget(w.type, index)"
                  >
                    <component :is="w.icon" :size="14" />
                    <span>{{ w.label }}</span>
                  </button>
                </div>
              </div>

            <div
              :id="`pg-w-${block.id}`"
              class="card pg-block"
              :class="{ 'is-dragging': dragFrom === index, 'is-collapsed': collapsed.has(block.id) }"
              @dragover.prevent="onDragOver(index)"
              @drop.prevent="onDrop(index)"
            >
              <div class="card-header pg-block-head">
                <span
                  class="pg-drag"
                  title="Drag to reorder"
                  draggable="true"
                  @dragstart="onDragStart(index, $event)"
                  @dragend="onDragEnd"
                >
                  <GripVertical :size="15" />
                </span>

                <button
                  type="button"
                  class="pg-block-toggle"
                  :aria-expanded="!collapsed.has(block.id)"
                  @click="toggleCollapse(block.id)"
                >
                  <ChevronRight :size="14" class="pg-caret" />
                  <span class="pg-block-type">{{ WIDGET_LABELS[block.type] || block.type }}</span>
                  <span class="pg-block-summary">{{ summarise(block) }}</span>
                </button>

                <div class="d-flex align-items-center gap-1 flex-shrink-0">
                  <button type="button" class="table-icon-btn" title="Duplicate" @click="duplicateWidget(index)">
                    <Copy :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn" title="Move up" :disabled="index === 0" @click="move(index, -1)">
                    <ChevronUp :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn" title="Move down" :disabled="index === form.blocks.length - 1" @click="move(index, 1)">
                    <ChevronDown :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn is-danger" title="Remove" @click="removeWidget(index)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div v-show="!collapsed.has(block.id)" class="card-body">
                <!-- Heading -->
                <template v-if="block.type === 'heading'">
                  <div class="row g-2">
                    <div class="col-md-9">
                      <input v-model="block.text" type="text" class="form-control" placeholder="Heading text" />
                    </div>
                    <div class="col-md-3">
                      <select v-model.number="block.level" class="form-select">
                        <option :value="1">H1 — largest</option>
                        <option :value="2">H2</option>
                        <option :value="3">H3</option>
                      </select>
                    </div>
                  </div>
                </template>

                <!-- Text -->
                <RichTextField v-else-if="block.type === 'text'" v-model="block.html" />

                <!-- Image -->
                <template v-else-if="block.type === 'image'">
                  <div class="pg-image-row">
                    <div class="pg-image-preview">
                      <img v-if="block.url" :src="block.url" alt="" />
                      <span v-else>No image</span>
                    </div>
                    <div class="flex-grow-1">
                      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="openPicker(block)">
                        {{ block.url ? 'Change image' : 'Choose from Media Library' }}
                      </button>
                      <input v-model="block.alt" type="text" class="form-control mt-2" placeholder="Alt text (for screen readers)" />
                      <input v-model="block.caption" type="text" class="form-control mt-2" placeholder="Caption (optional)" />
                    </div>
                  </div>
                </template>

                <!-- Image + text -->
                <template v-else-if="block.type === 'image_text'">
                  <div class="pg-image-row mb-2">
                    <div class="pg-image-preview">
                      <img v-if="block.url" :src="block.url" alt="" />
                      <span v-else>No image</span>
                    </div>
                    <div class="flex-grow-1">
                      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="openPicker(block)">
                        {{ block.url ? 'Change image' : 'Choose from Media Library' }}
                      </button>
                      <select v-model="block.position" class="form-select mt-2">
                        <option value="left">Image on the left</option>
                        <option value="right">Image on the right</option>
                      </select>
                    </div>
                  </div>
                  <RichTextField v-model="block.html" />
                </template>

                <!-- Image gallery -->
                <template v-else-if="block.type === 'gallery'">
                  <input v-model="block.title" type="text" class="form-control mb-2" placeholder="Section title (optional)" />
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="openGalleryPicker(block)">
                      <Plus :size="14" class="me-1" /> Add images
                    </button>
                    <select v-model.number="block.columns" class="form-select form-select-sm w-auto">
                      <option :value="2">2 per row</option>
                      <option :value="3">3 per row</option>
                      <option :value="4">4 per row</option>
                      <option :value="6">6 per row</option>
                    </select>
                    <span class="text-muted small">{{ (block.items || []).length }} image(s)</span>
                  </div>
                  <div v-if="(block.items || []).length" class="pg-gallery-grid">
                    <div v-for="(item, i) in block.items" :key="i" class="pg-gallery-item">
                      <img :src="item.url" alt="" />
                      <button type="button" class="pg-gallery-remove" title="Remove" @click="removeGalleryItem(block, i)">
                        <X :size="12" />
                      </button>
                    </div>
                  </div>
                </template>

                <!-- Video strip -->
                <template v-else-if="block.type === 'video_strip'">
                  <input v-model="block.title" type="text" class="form-control mb-2" placeholder="Section title (optional)" />

                  <div v-for="(item, i) in block.items ?? []" :key="i" class="pg-strip-row">
                    <span class="pg-strip-thumb">
                      <video v-if="isLocalVideo(item.url)" :src="item.url" muted preload="metadata"></video>
                      <Clapperboard v-else :size="16" />
                    </span>
                    <input v-model="item.url" type="text" class="form-control" placeholder="Choose from the library, or paste a link" />
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="openStripPicker(block, i)">
                      <Images :size="14" class="me-1" /> Library
                    </button>
                    <button type="button" class="table-icon-btn is-danger" title="Remove" @click="block.items.splice(i, 1)">
                      <Trash2 :size="14" />
                    </button>
                  </div>

                  <button type="button" class="btn btn-fig-secondary btn-fig-sm mt-2" @click="addStripItem(block)">
                    <Plus :size="14" class="me-1" /> Add video
                  </button>
                  <small class="text-muted d-block mt-2">
                    A full-width row of short looping clips, picked from the Media Library.
                    Fewer than four repeat to fill the row.
                  </small>
                </template>

                <!-- Video -->
                <template v-else-if="block.type === 'video'">
                  <input v-model="block.title" type="text" class="form-control mb-2" placeholder="Section title (optional)" />
                  <div class="pg-strip-row">
                    <span class="pg-strip-thumb">
                      <video v-if="isLocalVideo(block.video_url)" :src="block.video_url" muted preload="metadata"></video>
                      <Video v-else :size="16" />
                    </span>
                    <input
                      v-model="block.video_url"
                      type="text"
                      class="form-control"
                      placeholder="Choose from the library, or paste a YouTube / Drive link"
                    />
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="videoFor = block">
                      <Images :size="14" class="me-1" /> Library
                    </button>
                  </div>
                  <input v-model="block.caption" type="text" class="form-control mt-2" placeholder="Caption (optional)" />
                  <small class="text-muted">
                    Pick an uploaded file from the Media Library, or paste a YouTube or Drive
                    link and the page builds the player.
                  </small>
                </template>

                <!-- Call to action band -->
                <template v-else-if="block.type === 'cta_banner'">
                  <label class="form-label">Headline</label>
                  <textarea
                    v-model="block.title"
                    class="form-control"
                    rows="2"
                    placeholder="e.g. পূজার আনন্দে নিজেকে সাজান"
                  ></textarea>
                  <small class="text-muted d-block mb-2">Each new line becomes a new line on the banner.</small>

                  <label class="form-label">Sub text</label>
                  <input v-model="block.text" type="text" class="form-control mb-2" placeholder="Optional line under the headline" />

                  <div class="row g-2">
                    <div class="col-md-6">
                      <label class="form-label">Button label</label>
                      <input v-model="block.button_label" type="text" class="form-control" placeholder="e.g. Shop Now" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Button link</label>
                      <input v-model="block.button_url" type="text" class="form-control" placeholder="/shop" />
                    </div>
                  </div>

                  <small class="text-muted d-block mt-2">
                    A full-width band with a headline and one button. The button is hidden
                    when it has no label.
                  </small>
                </template>

                <!-- Feature cards -->
                <template v-else-if="block.type === 'feature_cards'">
                  <label class="form-label">Section title</label>
                  <input v-model="block.title" type="text" class="form-control mb-3" placeholder="e.g. কেন ছন্দ আপনার জন্য?" />

                  <div v-for="(card, i) in block.items ?? []" :key="i" class="pg-card-row">
                    <input v-model="card.title" type="text" class="form-control" placeholder="Card title" />
                    <textarea v-model="card.text" class="form-control" rows="2" placeholder="Card text"></textarea>
                    <button type="button" class="table-icon-btn is-danger" title="Remove" @click="block.items.splice(i, 1)">
                      <Trash2 :size="14" />
                    </button>
                  </div>

                  <button type="button" class="btn btn-fig-secondary btn-fig-sm mt-2" @click="addCard(block)">
                    <Plus :size="14" class="me-1" /> Add card
                  </button>
                  <small class="text-muted d-block mt-2">
                    A row of short titled notes — four fit across on a desktop.
                  </small>
                </template>

                <!-- Product section -->
                <template v-else-if="block.type === 'product_section'">
                  <div class="row g-2 mb-2">
                    <div class="col-md-6">
                      <label class="form-label">Section title</label>
                      <input v-model="block.title" type="text" class="form-control" placeholder="e.g. নতুন কালেকশন" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Products from</label>
                      <div class="pg-source-row">
                        <select v-model="block.source" class="form-select" @change="onSourceChanged(block)">
                          <option v-for="s in PRODUCT_SOURCES" :key="s.value" :value="s.value">{{ s.label }}</option>
                        </select>
                        <button
                          type="button"
                          class="btn btn-fig-secondary btn-fig-sm pg-seq-btn"
                          :class="{ 'is-set': (block.product_ids ?? []).length }"
                          title="Put these products in your own order"
                          @click="openSequence(block)"
                        >
                          <ListOrdered :size="14" /> Sequence
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row g-2 mb-2">
                    <div v-if="block.source === 'category'" class="col-md-6">
                      <label class="form-label">Category</label>
                      <select v-model.number="block.category_id" class="form-select" @change="onSourceChanged(block)">
                        <option :value="null" disabled>Choose a category…</option>
                        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label">How many</label>
                      <input v-model.number="block.limit" type="number" min="1" max="24" class="form-control" />
                    </div>
                    <div class="col-md-3">
                      <label class="form-label">Per row</label>
                      <select v-model.number="block.columns" class="form-select">
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="4">4</option>
                        <option :value="5">5</option>
                      </select>
                    </div>
                  </div>

                  <textarea v-model="block.subtitle" class="form-control mb-2" rows="2" placeholder="Short description under the title (optional)"></textarea>

                  <div class="row g-2">
                    <div class="col-md-6">
                      <input v-model="block.cta_label" type="text" class="form-control" placeholder="Button label (optional) — e.g. সব দেখুন" />
                    </div>
                    <div class="col-md-6">
                      <input v-model="block.cta_url" type="text" class="form-control" placeholder="Button link — e.g. /shop" />
                    </div>
                  </div>

                  <small class="text-muted d-block mt-2">
                    Products are pulled live, so the section stays current on its own. Add this widget as many
                    times as you like — one per collection.
                    <template v-if="(block.product_ids ?? []).length">
                      The first {{ block.product_ids.length }} are shown in the order you set; changing the
                      source clears it.
                    </template>
                  </small>
                </template>

                <!-- Raw HTML -->
                <template v-else-if="block.type === 'html'">
                  <textarea v-model="block.code" class="form-control pg-code" rows="10" spellcheck="false"></textarea>
                  <small class="text-muted">Pasted as written — used when the original markup is too custom to split into widgets.</small>
                </template>
              </div>
            </div>
            </template>

            <!-- Drop zone + insert point at the end of the page -->
            <div
              class="pg-gap"
              :class="{ 'is-over': dragOver === form.blocks.length && dragFrom !== null, 'is-open': insertAt === form.blocks.length }"
              @dragover.prevent="onDragOver(form.blocks.length)"
              @drop.prevent="onDrop(form.blocks.length)"
            >
              <button type="button" class="pg-gap-btn" title="Add a widget here" @click="openInserter(form.blocks.length)">
                <Plus :size="13" />
              </button>
              <div v-if="insertAt === form.blocks.length" class="pg-inserter">
                <button
                  v-for="w in WIDGETS"
                  :key="w.type"
                  type="button"
                  class="pg-inserter-btn"
                  @click="addWidget(w.type, form.blocks.length)"
                >
                  <component :is="w.icon" :size="14" />
                  <span>{{ w.label }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- ── Live preview ────────────────────────────────────── -->
        <aside v-if="showPreview && page.editable && page.widgets !== false" class="pg-preview-pane">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">Live preview</h6>
              <button type="button" class="table-icon-btn" title="Hide preview" @click="showPreview = false">
                <X :size="14" />
              </button>
            </div>
            <div class="card-body">
              <p v-if="!previewHtml" class="text-muted small mb-0">
                Nothing to preview yet — the widgets on this page are all live ones
                (products, video, gallery), which only render on the storefront.
              </p>
              <div v-else class="pg-preview" v-html="previewHtml"></div>
            </div>
          </div>
        </aside>

        <!-- ── Sidebar ─────────────────────────────────────────── -->
        <aside class="pg-side">
          <div v-if="page.editable && page.widgets !== false" class="card">
            <div class="card-header"><h6 class="mb-0">Add a widget</h6></div>
            <div class="card-body pg-widget-list">
              <button
                v-for="w in WIDGETS"
                :key="w.type"
                type="button"
                class="pg-widget-btn"
                @click="addWidget(w.type)"
              >
                <component :is="w.icon" :size="16" />
                <span>{{ w.label }}</span>
                <Plus :size="14" class="ms-auto" />
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h6 class="mb-0">Show this content</h6></div>
            <div class="card-body">
              <div class="form-check form-switch">
                <input
                  id="pg-published"
                  v-model="form.is_published"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :disabled="!page.editable"
                />
                <label class="form-check-label" for="pg-published">
                  {{ form.is_published ? 'Published' : 'Content hidden' }}
                </label>
              </div>
              <p class="text-muted small mb-0 mt-2">
                The page itself always stays live on the storefront. Turning this
                off only holds back the content written here.
              </p>
              <p class="text-muted small mb-0 mt-2">
                Last saved: {{ page.updated_at ? new Date(page.updated_at).toLocaleString() : 'never' }}
              </p>

            </div>
          </div>
        </aside>
      </div>
    </div>

    <div v-if="canSave && form.isDirty" class="pg-savebar">
      <span class="pg-savebar-text">Unsaved changes</span>
      <button
        type="button"
        class="btn btn-fig-secondary btn-fig-sm"
        :disabled="form.processing"
        @click="form.reset()"
      >
        Discard
      </button>
      <button
        type="button"
        class="btn btn-fig-primary btn-fig-sm"
        :disabled="form.processing"
        @click="submit"
      >
        {{ form.processing ? 'Saving…' : 'Save page' }}
      </button>
    </div>

    <MediaLibraryPickerModal v-if="pickerFor" kind="image" @close="pickerFor = null" @select="onLibrarySelected" />
    <MediaLibraryPickerModal v-if="fieldPicker" kind="image" @close="fieldPicker = null" @select="onFieldImageSelected" />
    <MediaLibraryPickerModal v-if="textPicker" kind="image" @close="textPicker = null" @select="onTextImageSelected" />
    <MediaLibraryPickerModal
      v-if="stripFor"
      kind="video"
      @close="stripFor = null"
      @select="onStripSelected"
    />
    <MediaLibraryPickerModal
      v-if="videoFor"
      kind="video"
      @close="videoFor = null"
      @select="onVideoSelected"
    />
    <MediaLibraryPickerModal
      v-if="galleryFor"
      kind="image"
      multiple
      @close="galleryFor = null"
      @select="onGallerySelected"
      @select-multiple="onGallerySelected"
    />
    <BannerEditModal
      v-if="bannerModal"
      :banner="bannerModal === 'new' ? null : bannerModal"
      @close="bannerModal = null"
    />

    <!-- Keyed on the widget id so reopening for another widget remounts and
         reloads, rather than showing the previous widget's products. -->
    <ProductSequenceModal
      v-if="sequenceFor"
      :key="sequenceFor.id"
      :block="sequenceFor"
      @close="sequenceFor = null"
      @save="onSequenceSaved"
    />
  </AdminLayout>
</template>

<style scoped>
/* The Sequence button sits with the source it orders, not on its own row. */
.pg-source-row {
  display: flex;
  gap: var(--sp-2, 8px);
  align-items: stretch;
}

.pg-source-row .form-select { min-width: 0; }

.pg-seq-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  white-space: nowrap;
}

/* A widget carrying a manual order says so without being opened. */
.pg-seq-btn.is-set {
  border-color: var(--bs-primary, #252f17);
  color: var(--bs-primary, #252f17);
}

.pg-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4, 16px);
  align-items: start;
}

.pg-main { grid-area: main; }
.pg-preview-pane { grid-area: preview; }
.pg-side { grid-area: side; }

@media (min-width: 992px) {
  .pg-layout {
    grid-template-columns: minmax(0, 1fr) 300px;
    grid-template-areas: 'main side';
  }

  /* Below three-column width the preview sits under the editor rather than
     squeezing both into an unusable width. */
  .pg-layout.has-preview {
    grid-template-areas: 'main side' 'preview side';
  }
}

@media (min-width: 1500px) {
  .pg-layout.has-preview {
    grid-template-columns: minmax(0, 1fr) minmax(0, 520px) 300px;
    grid-template-areas: 'main preview side';
  }
}

.pg-main,
.pg-side,
.pg-preview-pane {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4, 16px);
  min-width: 0;
}

@media (min-width: 992px) {
  .pg-side,
  .pg-preview-pane {
    position: sticky;
    top: 16px;
  }
}

.pg-preview-pane .card-body {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

/* ── Content toolbar ─────────────────────────────────────── */
.pg-toolbar {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  padding: 0 2px;
}

.pg-toolbar-count {
  font-size: var(--fs-xs, 12px);
  font-weight: 600;
  color: var(--text-muted, #6d6560);
  text-transform: uppercase;
  letter-spacing: .04em;
}

.pg-toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-sm, 6px);
  background: var(--surface, #fff);
  font-size: var(--fs-xs, 12px);
  color: var(--text-muted, #6d6560);
  cursor: pointer;
}

.pg-toolbar-btn:hover {
  border-color: var(--line-strong, #d1cdca);
  color: var(--text, #1a1817);
}

/* ── Block card ──────────────────────────────────────────── */
.pg-block.is-dragging {
  opacity: .4;
}

.pg-block-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  min-width: 0;
}

.pg-drag {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--text-faint, #9c9591);
  cursor: grab;
}

.pg-drag:active { cursor: grabbing; }

/* The header doubles as the collapse control, so the whole strip is clickable. */
.pg-block-toggle {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.pg-caret {
  flex-shrink: 0;
  color: var(--text-faint, #9c9591);
  transition: transform .15s ease;
  transform: rotate(90deg);
}

.pg-block.is-collapsed .pg-caret { transform: rotate(0deg); }

.pg-block-summary {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--fs-xs, 12px);
  color: var(--text-muted, #6d6560);
}

/* ── Insert-between gap ──────────────────────────────────── */
.pg-gap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 18px;
  margin: calc(var(--sp-4, 16px) * -1 + 2px) 0;
}

.pg-gap::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: var(--r-full, 999px);
  background: transparent;
  transition: background-color .12s ease;
}

.pg-gap:hover::before,
.pg-gap.is-open::before { background: var(--line-strong, #d1cdca); }
.pg-gap.is-over::before { background: var(--admin-green-600, #252f17); }

.pg-gap-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-full, 999px);
  background: var(--surface, #fff);
  color: var(--text-faint, #9c9591);
  opacity: 0;
  cursor: pointer;
  transition: opacity .12s ease;
}

.pg-gap:hover .pg-gap-btn,
.pg-gap.is-open .pg-gap-btn { opacity: 1; }

.pg-gap.is-open .pg-gap-btn {
  border-color: var(--admin-green-600, #252f17);
  color: var(--admin-green-600, #252f17);
}

.pg-inserter {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 2px;
  width: max-content;
  padding: 6px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-md, 10px);
  background: var(--surface, #fff);
  box-shadow: var(--el-2, 0 8px 24px rgba(26, 33, 16, .12));
  transform: translateX(-50%);
}

.pg-inserter-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  padding: 7px 10px;
  border: 0;
  border-radius: var(--r-sm, 6px);
  background: none;
  font-size: var(--fs-sm, 13px);
  color: var(--text, #1a1817);
  white-space: nowrap;
  cursor: pointer;
}

.pg-inserter-btn:hover { background: var(--surface-sunk, #f5f4f2); }

.pg-empty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 2px;
  max-width: 460px;
  margin: 0 auto;
}

/* ── Sticky save bar ─────────────────────────────────────── */
.pg-savebar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  margin-top: var(--sp-4, 16px);
  padding: var(--sp-3, 12px) var(--sp-4, 16px);
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-md, 10px);
  background: var(--surface, #fff);
  box-shadow: var(--el-2, 0 8px 24px rgba(26, 33, 16, .12));
}

.pg-savebar-text {
  margin-right: auto;
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
  color: var(--st-warning, #b45309);
}

.pg-error {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--st-danger, #c0392b);
}

.pg-block-type {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-muted, #6b7280);
}

.pg-empty {
  border-style: dashed;
}

.pg-widget-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pg-widget-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line, #e9e4dd);
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: all 0.15s ease;
}

.pg-widget-btn:hover {
  border-color: #252f17;
  background: #f2f7ec;
  color: #1a2110;
}

/* ── Page text sections ──────────────────────────────────── */
.pg-textsec .pg-block-toggle { cursor: pointer; }

.pg-text-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-3, 12px) var(--sp-4, 16px);
}

@media (max-width: 900px) {
  .pg-text-grid { grid-template-columns: 1fr; }
}

/* Long copy and media get the full width; short labels pair up. */
.pg-text-field.is-wide { grid-column: 1 / -1; }

.pg-text-field { min-width: 0; }

.pg-rep-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--sp-2, 8px);
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-sm, 6px);
  background: var(--surface, #fff);
}

.pg-rep-row.is-over { border-color: var(--admin-green-600, #252f17); }

.pg-rep-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 8px;
  min-width: 0;
}

@media (max-width: 900px) {
  .pg-rep-fields { grid-template-columns: 1fr; }
}

.pg-rep-field .form-label { font-size: var(--fs-xs, 12px); margin-bottom: 3px; }

.pg-text-path {
  display: block;
  margin-top: 6px;
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--text-faint, #9c9591);
  overflow-wrap: anywhere;
}

.pg-text-note {
  margin: var(--sp-3, 12px) 0 0;
  font-size: var(--fs-xs, 12px);
  color: var(--text-faint, #9c9591);
}

.pg-card-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) auto;
  align-items: start;
  gap: 6px;
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .pg-card-row { grid-template-columns: 1fr; }
}

.pg-strip-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 46px;
  height: 34px;
  overflow: hidden;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-sm, 6px);
  background: var(--surface-sunk, #f5f4f2);
  color: var(--text-faint, #9c9591);
}

.pg-strip-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* thumbnail · url · library · remove — the single-video row omits the last. */
.pg-strip-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.pg-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
}

.pg-gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-2, #f4f1ec);
}

.pg-gallery-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.pg-gallery-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #c0392b;
}

.pg-image-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.pg-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 100px;
  flex-shrink: 0;
  border: 1px solid var(--line, #e9e4dd);
  border-radius: 10px;
  background: var(--surface-2, #f7f4f0);
  overflow: hidden;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

.pg-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pg-code {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 13px;
  line-height: 22px;
}

.pg-banner-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 8px;
  border-radius: var(--r-full);
  background: var(--st-success-soft);
  font-size: 11px;
  font-weight: 600;
  color: var(--st-success);
}

.pg-banner-tag.is-missing {
  background: var(--st-neutral-soft);
  color: var(--st-neutral);
}

.pg-banners {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.pg-banner {
  position: relative;
  margin: 0;
  border: 1px solid var(--line, #e9e4dd);
  border-radius: 12px;
  overflow: hidden;
}

.pg-banner img {
  width: 100%;
  aspect-ratio: 1900 / 560;
  object-fit: cover;
  display: block;
}

.pg-banner figcaption {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 8px;
  background: var(--surface-2, #faf8f5);
}

/* Reads roughly like the storefront so the preview is honest. */
.pg-preview {
  font-family: 'Hind Siliguri', 'Poppins', sans-serif;
  font-size: 15px;
  line-height: 28px;
  color: #4a423b;
}

.pg-preview :deep(h1) { font-size: 26px; font-weight: 600; margin: 20px 0 10px; }
.pg-preview :deep(h2) { font-size: 21px; font-weight: 600; margin: 18px 0 8px; }
.pg-preview :deep(h3) { font-size: 17px; font-weight: 600; margin: 16px 0 6px; }
.pg-preview :deep(p) { margin: 0 0 14px; }
.pg-preview :deep(ul) { list-style: disc; padding-left: 20px; margin-bottom: 14px; }
.pg-preview :deep(ol) { list-style: decimal; padding-left: 20px; margin-bottom: 14px; }
.pg-preview :deep(img) { max-width: 100%; border-radius: 10px; }
.pg-preview :deep(figure) { margin: 0 0 16px; }
.pg-preview :deep(figcaption) { font-size: 13px; color: #9b8d80; margin-top: 6px; }
.pg-preview :deep(.page-split) { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center; margin-bottom: 18px; }

/* Desktop / Mobile banner preview, at each banner's shape */
.pg-banner-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface-sunk);
  color: var(--text-faint);
  font-size: var(--fs-sm);
}
.pg-banner-preview.is-desktop { width: 100%; aspect-ratio: 1920 / 848; }
.pg-banner-preview.is-mobile { width: 220px; aspect-ratio: 402 / 512; }
.pg-banner-preview img { width: 100%; height: 100%; object-fit: cover; }

/* Widgets listed where they render */
.pg-slot-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-2) 0;
  border-bottom: 1px solid var(--line);
}
.pg-slot-row:last-of-type { border-bottom: 0; }
.pg-slot-name { font-weight: 500; }
</style>
