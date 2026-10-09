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
import MainBannerModal from './Partials/MainBannerModal.vue'
import VisibilityToggle from '@/components/Admin/VisibilityToggle.vue'
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
const collapsed = ref(new Set(form.blocks.filter(block => widgetSlot(block)).map(block => block.id)))

// Text sections start closed, so a page with many fields is still scannable.
// The page's other rows (settings, banners, header, visibility) do too; their
// keys start with "_" so they never clash with a section's.
const closedSections = ref(new Set([
  ...(props.page.text_sections ?? []).map((s) => s.key),
  '_settings', '_seo', '_header', '_fields',
]))
const isOpen = (key) => !closedSections.value.has(key)

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

/** Move a list item one place up or down. */
function moveRow(field, i, delta) {
  const rows = [...form.texts[field.key]]
  const to = i + delta
  if (to < 0 || to >= rows.length) return
  ;[rows[i], rows[to]] = [rows[to], rows[i]]
  form.texts[field.key] = rows
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
function widgetSlot(block) {
  return (props.page.text_sections ?? []).find(section => section.widget_types && (
    section.widget_types.includes('other')
      ? !['product_section', 'cta_banner', 'video_strip'].includes(block.type)
      : section.widget_types.includes(block.type)
  ))
}
const slotBlocks = (section) =>
  form.blocks.filter((block) =>
    section.widget_types.includes('other')
      ? !SLOT_TYPES.includes(block.type)
      : section.widget_types.includes(block.type)
  )
const slotInserter = ref(null)
const slotWidgetOptions = (section) => WIDGETS.filter((widget) =>
  section.widget_types.includes('other')
    ? !SLOT_TYPES.includes(widget.type)
    : section.widget_types.includes(widget.type)
)
function addSlotWidget(section, type) {
  addWidget(type)
  slotInserter.value = null
}
/* --------------------------------------------- section fields -- */

// A section's own on/off switch ("hero_show" for "hero"). It sits on the
// section's header as Active / Hidden rather than among its fields, and
// covers the desktop and the mobile version together.
const mainToggleKey = (section) =>
  (section.fields ?? []).some((f) => f.type === 'toggle' && f.key === `${section.key}_show`)
    ? `${section.key}_show`
    : null

function sectionFields(section) {
  const main = mainToggleKey(section)
  // Every field of the section shows together — where the desktop and the
  // mobile banner differ (e.g. Home hero) both options sit in the same
  // section, so there is no separate mobile/desktop view to flip.
  // On a page with hero banners the main Desktop / Mobile banner is row 1 of
  // the banner list (edited in a popup), not a pair of inline fields.
  const bannerList = section.key === 'hero' && props.page.banners
  return section.fields.filter((f) =>
    f.key !== main
    && !['hero_slideshow_enabled', 'hero_autoplay_enabled', 'hero_slide_seconds'].includes(f.key)
    && !(bannerList && f.type === 'banner')
    && !(bannerList && ['hero_title', 'hero_eyebrow', 'hero_eyebrow_show', 'hero_cta_show', 'hero_cta_label', 'hero_cta_url'].includes(f.key))
    // A paired switch sits beside its box's label, not on a row of its own.
    && !f.pair
  )
}

/** The small on/off that belongs to a field, if it has one. */
function pairSwitch(section, field) {
  return section.fields.find((f) => [].concat(f.pair ?? []).includes(field.key)) ?? null
}

/* ------------------------------------------------------- main banner -- */

const mainBannerOpen = ref(false)
const mainBannerCopy = computed(() => ({
  heading: form.texts.hero_title ?? '',
  subtext: form.texts.hero_eyebrow ?? '',
  cta_label: form.texts.hero_cta_label ?? '',
  cta_url: form.texts.hero_cta_url ?? '/shop',
  show_subtext: isOn(form.texts.hero_eyebrow_show),
  show_cta: isOn(form.texts.hero_cta_show),
}))

/** Save the main banner's images: they are page fields, so the page saves. */
function saveMainBanner({ desktop, mobile, copy }) {
  form.texts.hero_image_desktop = desktop
  form.texts.hero_image_mobile = mobile
  form.texts.hero_title = copy.heading ?? ''
  form.texts.hero_eyebrow = copy.subtext ?? ''
  form.texts.hero_cta_label = copy.cta_label ?? ''
  form.texts.hero_cta_url = copy.cta_url ?? ''
  form.texts.hero_eyebrow_show = copy.show_subtext ? '1' : '0'
  form.texts.hero_cta_show = copy.show_cta ? '1' : '0'
  form.put(route('admin.pages.update', props.page.type), {
    preserveScroll: true,
    onSuccess: () => { mainBannerOpen.value = false },
  })
}

/** Whether a section can be switched off, and whether it is on. */
function sectionVisibilityTargets(section) {
  const targets = []
  for (const field of section.fields ?? []) {
    if (field.type === 'toggle' && /(^show$|_show$|_enabled$)/.test(field.key)) {
      targets.push({ object: form.texts, key: field.key })
    }
    if (field.type === 'repeater') {
      for (const row of form.texts[field.key] ?? []) {
        for (const [key, sub] of Object.entries(field.fields ?? {})) {
          if (sub.type === 'toggle' && /(^show$|_show$|_enabled$)/.test(key)) targets.push({ object: row, key })
        }
      }
    }
  }
  return targets
}
const hasSwitch = (section) => Boolean(mainToggleKey(section)) || Boolean(section.widget_types) || sectionVisibilityTargets(section).length > 0
function sectionOn(section) {
  const key = mainToggleKey(section)
  if (key) return isOn(form.texts[key])
  if (section.widget_types) return slotVisible(section)
  return sectionVisibilityTargets(section).some(({ object, key }) => isOn(object[key]))
}
function setSectionOn(section, on) {
  const key = mainToggleKey(section)
  if (key) form.texts[key] = on ? '1' : '0'
  else if (section.widget_types) setSlotVisible(section, on)
  else sectionVisibilityTargets(section).forEach(({ object, key }) => { object[key] = on ? '1' : '0' })
}

// A widget slot is active while any of its widgets shows.
const slotVisible = (section) => slotBlocks(section).some((b) => !b.hidden)
function setSlotVisible(section, on) {
  slotBlocks(section).forEach((b) => { b.hidden = !on })
}

/** Copy a widget listed in a section, right after the original. */
function duplicateSlotWidget(block) {
  const index = form.blocks.findIndex((b) => b.id === block.id)
  if (index >= 0) duplicateWidget(index)
}

/** Copy a row of a list (cards, images, links…), right after the original. */
function duplicateRow(field, i) {
  form.texts[field.key].splice(i + 1, 0, structuredClone(toRaw(form.texts[field.key][i])))
}

const widgetLabel = (block) =>
  block.title || WIDGETS.find((w) => w.type === block.type)?.label || block.type

function goToWidget(block) {
  toggleCollapse(block.id)
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

// Order and on/off are saved straight away, like adding or deleting a banner.
const bannerBusy = ref(false)
const bannerSaveOptions = {
  preserveScroll: true,
  preserveState: true,
  only: ['banners', 'flash'],
  onFinish: () => { bannerBusy.value = false },
}

function moveBanner(index, delta) {
  const ids = props.banners.map((b) => b.id)
  const to = index + delta
  if (to < 0 || to >= ids.length) return
  ;[ids[index], ids[to]] = [ids[to], ids[index]]
  bannerBusy.value = true
  router.patch(route('admin.sliders.banner.reorder'), { ids }, bannerSaveOptions)
}

function setBannerActive(banner, on) {
  bannerBusy.value = true
  router.post(route('admin.sliders.banner.update', banner.id), { _method: 'PATCH', is_active: on }, bannerSaveOptions)
}

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
    <div class="page-content pg-editor" :class="{ 'has-savebar': canSave }">
      <PageHeader :title="page.label" :subtitle="page.note || 'Edit what this page shows on the storefront'">
        <template #title>
          <span class="pg-page-title">
            {{ page.label }}
            <VisibilityToggle
              v-if="page.editable"
              v-model="form.is_published"
              switch-only
              :aria-label="`Show ${page.label} content`"
            />
          </span>
        </template>
        <template #actions>
          <a :href="route('admin.pages.index')" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
            <ArrowLeft :size="16" class="me-1" /> All pages
          </a>
          <a v-if="page.url" :href="page.url" target="_blank" class="btn btn-fig-secondary btn-fig-sm ms-2 d-inline-flex align-items-center">
            <ExternalLink :size="16" class="me-1" /> View
          </a>
        </template>
      </PageHeader>

      <div class="pg-layout" :class="{ 'has-preview': showPreview }">
        <div class="pg-main" :class="`pe-page-${page.type}`">
          <!-- Track order runs two storefront pages; each gets its own heading. -->
          <template v-if="page.type === 'track_order'">
            <div class="pe-group pe-r-group-customer">
              <div>
                <h5 class="pe-group-title">Customer Order Tracking <span>(কাস্টমার অর্ডার ট্র্যাকিং)</span></h5>
              </div>
              <a href="/account/track-order" target="_blank" class="pe-group-link"><ExternalLink :size="14" /> View page</a>
            </div>
            <div class="pe-group pe-r-group-guest">
              <div>
                <h5 class="pe-group-title">Guest Order Tracking <span>(গেস্ট অর্ডার ট্র্যাকিং)</span></h5>
              </div>
              <a href="/track-order" target="_blank" class="pe-group-link"><ExternalLink :size="14" /> View page</a>
            </div>
          </template>
          <!-- ── SEO (built-in pages; a page you created has it under Page settings) -->
          <div v-if="page.editable && !page.is_custom" class="card pe-row pe-r-seo">
            <div class="card-header pe-row-head">
              <button type="button" class="pe-row-title" :aria-expanded="isOpen('_seo')" @click="toggleSection('_seo')">
                <h6 class="mb-0">SEO</h6>
              </button>
              <button type="button" class="pe-chev" :class="{ 'is-open': isOpen('_seo') }" aria-label="Expand section" @click="toggleSection('_seo')">
                <ChevronDown :size="18" />
              </button>
            </div>
            <div v-show="isOpen('_seo')" class="card-body">
              <label class="form-label" for="pg-seo-title">Meta title (SEO)</label>
              <input
                id="pg-seo-title"
                v-model="form.meta_title"
                type="text"
                maxlength="255"
                class="form-control"
                :class="{ 'is-invalid': form.errors.meta_title }"
                :placeholder="form.texts.tab_title || page.label"
              />
              <div class="invalid-feedback">{{ form.errors.meta_title }}</div>
              <small class="text-muted d-block mt-1">
                Shown in the browser tab and in Google results. Leave empty to use the page's browser tab title.
              </small>

              <label class="form-label mt-3" for="pg-seo-desc">Meta description (SEO)</label>
              <textarea
                id="pg-seo-desc"
                v-model="form.meta_description"
                maxlength="500"
                rows="3"
                class="form-control"
                :class="{ 'is-invalid': form.errors.meta_description }"
              ></textarea>
              <div class="invalid-feedback">{{ form.errors.meta_description }}</div>
              <small class="text-muted d-block mt-1">
                The short summary under the title in Google results — about 150–160 characters
                ({{ (form.meta_description || '').length }} now). Leave empty for none.
              </small>
            </div>
          </div>

          <!-- ── Page settings (pages you created) ────────────────── -->
          <div v-if="page.is_custom" class="card pe-row">
            <div class="card-header pe-row-head">
              <button type="button" class="pe-row-title" :aria-expanded="isOpen('_settings')" @click="toggleSection('_settings')">
                <h6 class="mb-0">Page settings &amp; SEO</h6>
              </button>
              <button type="button" class="pe-chev" :class="{ 'is-open': isOpen('_settings') }" aria-label="Expand section" @click="toggleSection('_settings')">
                <ChevronDown :size="18" />
              </button>
            </div>
            <div v-show="isOpen('_settings')" class="card-body">
              <p class="pe-help">The name of this page, the address it answers on, and what search engines show.</p>
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

          <!-- ── Page header ─────────────────────────────────────── -->
          <div v-if="page.editable && page.has_header" class="card pe-row pe-r-header">
            <div class="card-header pe-row-head">
              <button type="button" class="pe-row-title" :aria-expanded="isOpen('_header')" @click="toggleSection('_header')">
                <h6 class="mb-0">{{ page.type === 'track_order' ? 'পেজের শিরোনাম (Track Your Order)' : 'Page header' }}</h6>
              </button>
              <button type="button" class="pe-chev" :class="{ 'is-open': isOpen('_header') }" aria-label="Expand section" @click="toggleSection('_header')">
                <ChevronDown :size="18" />
              </button>
            </div>
            <div v-show="isOpen('_header')" class="card-body">
              <p class="pe-help">
                The heading and the line under it at the top of the page. Leave them
                blank to keep the storefront's built-in wording.
              </p>
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
            class="card pe-row pg-textsec"
            :class="[`pe-r-sec-${section.key}`, { 'is-collapsed': closedSections.has(section.key), 'is-off': hasSwitch(section) && !sectionOn(section) }]"
          >
            <div class="card-header pe-row-head">
              <button
                type="button"
                class="pe-row-title"
                :aria-expanded="!closedSections.has(section.key)"
                @click="toggleSection(section.key)"
              >
                <span class="pg-block-type">{{ section.title }}</span>
                <span class="pg-block-summary">
                  <template v-if="section.widget_types">{{ slotBlocks(section).length }} widget{{ slotBlocks(section).length === 1 ? '' : 's' }}</template>
                  <template v-else>{{ section.fields.length }} field{{ section.fields.length === 1 ? '' : 's' }}</template>
                </span>
              </button>
              <!-- One switch for the desktop and the mobile version -->
              <VisibilityToggle
                v-if="hasSwitch(section)"
                switch-only
                :disabled="!!section.widget_types && !slotBlocks(section).length"
                :model-value="sectionOn(section)"
                :aria-label="`Show ${section.title}`"
                @update:model-value="setSectionOn(section, $event)"
              />
              <button
                type="button"
                class="pe-chev"
                :class="{ 'is-open': !closedSections.has(section.key) }"
                aria-label="Expand section"
                @click="toggleSection(section.key)"
              >
                <ChevronDown :size="18" />
              </button>
            </div>

            <div v-show="!closedSections.has(section.key)" class="card-body">
              <!-- Widgets that render here on the page -->
              <div v-if="section.widget_types" class="pg-slot">
                <p class="pg-text-note mb-2">Widgets saved here appear in this position on the storefront. Edit expands their details directly below.</p>
                <div v-for="block in slotBlocks(section)" :key="block.id" class="pg-slot-item">
                <div class="pg-slot-row">
                  <span class="pg-slot-name">{{ widgetLabel(block) }}</span>
                  <div class="d-flex align-items-center gap-2">
                    <VisibilityToggle
                      switch-only
                      :model-value="!block.hidden"
                      :aria-label="`Show ${widgetLabel(block)}`"
                      @update:model-value="block.hidden = !$event"
                    />
                    <button
                      type="button"
                      class="table-icon-btn is-primary"
                      :title="collapsed.has(block.id) ? 'Edit' : 'Collapse'"
                      :aria-label="collapsed.has(block.id) ? 'Edit' : 'Collapse'"
                      :aria-expanded="!collapsed.has(block.id)"
                      @click="goToWidget(block)"
                    >
                      <Pencil :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn" title="Duplicate" @click="duplicateSlotWidget(block)">
                      <Copy :size="14" />
                    </button>
                  </div>
                </div>
                <div :id="`pg-slot-editor-${block.id}`" class="pg-slot-editor"></div>
                </div>
                <p v-if="!slotBlocks(section).length" class="text-muted small mb-0">No widgets added to this section yet.</p>
                <button type="button" class="pe-add" @click="slotInserter = slotInserter === section.key ? null : section.key">
                  <Plus :size="15" /> Add widget
                </button>
                <div v-if="slotInserter === section.key" class="pg-inserter">
                  <button
                    v-for="widget in slotWidgetOptions(section)"
                    :key="widget.type"
                    type="button"
                    class="pg-inserter-btn"
                    @click="addSlotWidget(section, widget.type)"
                  >
                    <component :is="widget.icon" :size="14" />
                    <span>{{ widget.label }}</span>
                  </button>
                </div>
              </div>

              <div v-else class="pg-text-grid">
                <div
                  v-for="field in sectionFields(section)"
                  :key="field.key"
                  class="pg-text-field"
                  :class="{ 'is-wide': field.type === 'textarea' || field.type === 'image' || field.type === 'banner' }"
                >
                  <div v-if="pairSwitch(section, field)" class="pe-label-row">
                    <label class="form-label mb-0" :for="`pt-${field.key}`">{{ field.label }}</label>
                    <label class="form-check form-switch mb-0 pe-mini-switch" :title="isOn(form.texts[pairSwitch(section, field).key]) ? 'Shown on the site' : 'Hidden on the site'">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :aria-label="pairSwitch(section, field).label"
                        :checked="isOn(form.texts[pairSwitch(section, field).key])"
                        @change="form.texts[pairSwitch(section, field).key] = $event.target.checked ? '1' : '0'"
                      />
                    </label>
                  </div>
                  <label v-else class="form-label" :for="`pt-${field.key}`">{{ field.label }}</label>

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
                      <!-- Numbered item header: drag, move, copy, remove -->
                      <div class="pe-item-head">
                        <span
                          class="pg-drag"
                          title="Drag to reorder"
                          draggable="true"
                          @dragstart="repDragFrom = i"
                          @dragend="repDragFrom = null; repDragOver = null"
                        >
                          <GripVertical :size="15" />
                        </span>
                        <span class="pe-item-title">{{ field.label }} #{{ i + 1 }}</span>
                        <div class="pe-item-actions">
                          <button type="button" class="table-icon-btn" title="Move up" :disabled="i === 0" @click="moveRow(field, i, -1)">
                            <ChevronUp :size="14" />
                          </button>
                          <button type="button" class="table-icon-btn" title="Move down" :disabled="i === (form.texts[field.key] ?? []).length - 1" @click="moveRow(field, i, 1)">
                            <ChevronDown :size="14" />
                          </button>
                          <button type="button" class="table-icon-btn" title="Duplicate" @click="duplicateRow(field, i)">
                            <Copy :size="14" />
                          </button>
                          <button
                            type="button"
                            class="table-icon-btn is-danger"
                            title="Remove"
                            @click="form.texts[field.key].splice(i, 1)"
                          >
                            <Trash2 :size="14" />
                          </button>
                        </div>
                      </div>

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

                    </div>

                    <button type="button" class="pe-add" @click="addRow(field)">
                      <Plus :size="15" /> Add {{ field.label }}
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

              <!-- More hero images: added one after another, they rotate with the
                   hero image above. With none added the hero stays a single image. -->
              <div v-if="section.key === 'hero' && page.banners" class="hs-block">
                <label class="form-label mb-1">Hero banners</label>
                <p class="pe-help">
                  The main banner shows first. Add more and they follow it in this order, changing
                  using the timer below when enabled. With the timer off, visitors can swipe or use the slide controls.
                </p>
                <!-- Every hero banner, in display order: the main one first -->
              <div class="bc-list">
                <div class="bc-row bc-row--main">
                  <span class="bc-num">1</span>
                  <img :src="form.texts.hero_image_desktop || '/assets/chhondo/hero-home-desktop.webp'" alt="" class="bc-thumb" loading="lazy" />
                  <img :src="form.texts.hero_image_mobile || form.texts.hero_image_desktop || '/assets/chhondo/hero-home-mobile.webp'" alt="" class="bc-thumb bc-thumb--m" loading="lazy" />
                  <div class="bc-meta">
                    <span class="bc-title">Main banner <span class="bc-badge">Always first</span></span>
                    <span class="bc-link">Desktop &amp; mobile image</span>
                  </div>
                  <div class="bc-actions">
                    <button type="button" class="table-icon-btn is-primary" title="Edit main banner" @click="mainBannerOpen = true">
                      <Pencil :size="14" />
                    </button>
                  </div>
                </div>
                <div v-for="(banner, bi) in banners" :key="banner.id" class="bc-row" :class="{ 'is-off': banner.is_active === false }">
                  <span class="bc-num">{{ bi + 2 }}</span>
                  <img :src="banner.image_path" alt="" class="bc-thumb" loading="lazy" />
                  <img :src="banner.mobile_image_path || banner.image_path" alt="" class="bc-thumb bc-thumb--m" loading="lazy" :title="banner.mobile_image_path ? 'Mobile image' : 'No mobile image — the desktop one is used'" />
                  <div class="bc-meta">
                    <span class="bc-title">
                      {{ banner.heading || banner.title || `Banner ${bi + 2}` }}
                      <span v-if="banner.is_active === false" class="pe-hidden">Hidden</span>
                    </span>
                    <span class="bc-link">{{ banner.link_url ? `→ ${banner.link_url}${banner.link_new_tab ? ' (new tab)' : ''}` : 'No link' }}</span>
                  </div>
                  <div class="bc-actions">
                    <button type="button" class="table-icon-btn" title="Move up" :disabled="bi === 0 || bannerBusy" @click="moveBanner(bi, -1)">
                      <ChevronUp :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn" title="Move down" :disabled="bi === banners.length - 1 || bannerBusy" @click="moveBanner(bi, 1)">
                      <ChevronDown :size="14" />
                    </button>
                    <label class="form-check form-switch mb-0 pe-switch" :title="banner.is_active === false ? 'Hidden from the carousel' : 'Shown in the carousel'">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :aria-label="`Show banner ${bi + 2}`"
                        :checked="banner.is_active !== false"
                        :disabled="bannerBusy"
                        @change="setBannerActive(banner, $event.target.checked)"
                      />
                    </label>
                    <button type="button" class="table-icon-btn is-primary" title="Edit banner" @click="bannerModal = banner">
                      <Pencil :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn is-danger" title="Delete" @click="removeBanner(banner)">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
              </div>
                <button type="button" class="pe-add" @click="bannerModal = 'new'">
                  <Plus :size="15" /> Add banner
                </button>
                <div class="hs-speed">
                  <div class="pg-banner-option mb-2"><label class="form-label mb-0" for="hero-autoplay-toggle">Auto-play / timer</label><VisibilityToggle id="hero-autoplay-toggle" switch-only :model-value="isOn(form.texts.hero_autoplay_enabled)" aria-label="Automatically rotate Home banners" @update:model-value="form.texts.hero_autoplay_enabled = $event ? '1' : '0'" /></div>
                  <label for="hero-slide-seconds" class="form-label">Change image every (seconds)</label>
                  <input
                    id="hero-slide-seconds"
                    :value="form.texts.hero_slide_seconds || '5'"
                    :disabled="!isOn(form.texts.hero_autoplay_enabled)"
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    class="form-control"
                    @input="form.texts.hero_slide_seconds = $event.target.value"
                  />
                </div>
              </div>

              <p v-if="!section.widget_types" class="pg-text-note">Clear a field to put back the wording this page came with.</p>
            </div>
          </div>

          <!-- ── Page settings ───────────────────────────────────── -->
          <div v-if="pageFields.length" class="card pe-row">
            <div class="card-header pe-row-head">
              <button type="button" class="pe-row-title" :aria-expanded="isOpen('_fields')" @click="toggleSection('_fields')">
                <h6 class="mb-0">Page settings</h6>
              </button>
              <button type="button" class="pe-chev" :class="{ 'is-open': isOpen('_fields') }" aria-label="Expand section" @click="toggleSection('_fields')">
                <ChevronDown :size="18" />
              </button>
            </div>
            <div v-show="isOpen('_fields')" class="card-body">
              <p class="pe-help">What this page shows besides its body copy.</p>
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
                <h6 class="mb-1">No additional widgets yet</h6>
                <p class="text-muted small mb-3">Add a widget below the page's existing content, then save to publish it.</p>
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
                v-if="!widgetSlot(block)"
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

            <Teleport :to="widgetSlot(block) ? `#pg-slot-editor-${block.id}` : 'body'" :disabled="!widgetSlot(block)" defer>
            <div v-show="!widgetSlot(block) || !collapsed.has(block.id)"
              :id="`pg-w-${block.id}`"
              class="card pe-row pg-block"
              :class="{ 'is-dragging': dragFrom === index, 'is-collapsed': collapsed.has(block.id), 'is-hidden': block.hidden, 'is-off': block.hidden }"
              @dragover.prevent="onDragOver(index)"
              @drop.prevent="onDrop(index)"
            >
              <div class="card-header pe-row-head">
                <!-- Order: the arrows move it, and the column can be dragged -->
                <div
                  class="pe-arrows"
                  title="Drag to reorder"
                  draggable="true"
                  @dragstart="onDragStart(index, $event)"
                  @dragend="onDragEnd"
                >
                  <button type="button" title="Move up" aria-label="Move section up" :disabled="index === 0" @click="move(index, -1)">
                    <ChevronUp :size="16" />
                  </button>
                  <button type="button" title="Move down" aria-label="Move section down" :disabled="index === form.blocks.length - 1" @click="move(index, 1)">
                    <ChevronDown :size="16" />
                  </button>
                </div>

                <button
                  type="button"
                  class="pe-row-title"
                  :aria-expanded="!collapsed.has(block.id)"
                  @click="toggleCollapse(block.id)"
                >
                  <span class="pg-block-type">{{ WIDGET_LABELS[block.type] || block.type }}</span>
                  <span class="pg-block-summary">{{ summarise(block) }}</span>
                </button>

                <!-- Show / hide this widget on the site (desktop and mobile) -->
                <VisibilityToggle
                  switch-only
                  :model-value="!block.hidden"
                  :aria-label="`Show ${WIDGET_LABELS[block.type] || block.type}`"
                  @update:model-value="block.hidden = !$event"
                />
                <button type="button" class="table-icon-btn" title="Duplicate" @click="duplicateWidget(index)">
                  <Copy :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Remove" @click="removeWidget(index)">
                  <Trash2 :size="14" />
                </button>
                <button
                  type="button"
                  class="pe-chev"
                  :class="{ 'is-open': !collapsed.has(block.id) }"
                  aria-label="Expand section"
                  @click="toggleCollapse(block.id)"
                >
                  <ChevronDown :size="18" />
                </button>
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
            </Teleport>
            </template>

            <!-- Drop zone + insert point at the end of the page -->
            <div
              class="pg-gap"
              :class="{ 'is-over': dragOver === form.blocks.length && dragFrom !== null, 'is-open': insertAt === form.blocks.length }"
              @dragover.prevent="onDragOver(form.blocks.length)"
              @drop.prevent="onDrop(form.blocks.length)"
            >
              <button type="button" class="pe-add" @click="openInserter(form.blocks.length)">
                <Plus :size="15" /> Add widget
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

      </div>
    </div>

    <div v-if="canSave" class="pg-savebar">
      <template v-if="form.isDirty">
        <span class="pg-savebar-text">Unsaved changes</span>
        <button
          type="button"
          class="btn btn-fig-secondary btn-fig-sm"
          :disabled="form.processing"
          @click="form.reset()"
        >
          Discard
        </button>
      </template>
      <button
        type="button"
        class="btn btn-fig-primary btn-fig-sm"
        :disabled="form.processing"
        @click="submit"
      >
        {{ form.processing ? 'Saving…' : 'Save changes' }}
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
    <MainBannerModal
      v-if="mainBannerOpen"
      :desktop="form.texts.hero_image_desktop || ''"
      :mobile="form.texts.hero_image_mobile || ''"
      :saving="form.processing"
      :copy="mainBannerCopy"
      @close="mainBannerOpen = false"
      @save="saveMainBanner"
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
.pg-banner-settings { display: grid; gap: 14px; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.pg-banner-option { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 13px; }
.pg-banner-settings .form-control { max-width: 160px; }
.pg-slot-editor:has(.pg-block:not(.is-collapsed)) { margin-top: 10px; }
.pg-slot-editor .pg-block { margin: 0; }
.pg-page-title { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.pg-editor :deep(.dv-switch) {
  gap: 3px;
  padding: 3px;
  border-radius: 8px;
}
.pg-editor :deep(.dv-switch button) {
  min-height: 30px;
  padding: 4px 11px;
  border-radius: 5px;
  font-size: 12px;
  line-height: 20px;
}
.pg-editor :deep(.dv-switch button svg) { width: 14px; height: 14px; }

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
  grid-template-areas: 'main';
  gap: var(--sp-4, 16px);
  align-items: start;
}
.pg-layout.has-preview { grid-template-areas: 'main' 'preview'; }

.pg-main { grid-area: main; }
.pg-preview-pane { grid-area: preview; }
.pg-side { grid-area: side; }

@media (min-width: 992px) {
  .pg-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }

  /* Below three-column width the preview sits under the editor rather than
     squeezing both into an unusable width. */
  .pg-layout.has-preview {
    grid-template-areas: 'main' 'preview';
  }
}

@media (min-width: 1500px) {
  .pg-layout.has-preview {
    grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
    grid-template-areas: 'main preview';
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
  position: fixed;
  left: 250px;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  margin: 0;
  padding: var(--sp-3, 12px) var(--sp-4, 16px) calc(var(--sp-3, 12px) + env(safe-area-inset-bottom, 0px));
  border: 1px solid var(--line, #e4e1e0);
  border-radius: 0;
  background: var(--surface, #fff);
  box-shadow: var(--el-2, 0 8px 24px rgba(26, 33, 16, .12));
}

.pg-editor.has-savebar { padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px)); }

@media (min-width: 992px) and (max-width: 1440px) {
  .pg-savebar { left: 200px; }
}
@media (min-width: 992px) {
  :global(.wrapper.toggled) .pg-savebar { left: 68px; }
}
@media (max-width: 991px) {
  .pg-savebar { left: 0; }
}
@media (max-width: 575px) {
  .pg-savebar { flex-wrap: wrap; row-gap: 6px; }
  .pg-savebar-text { flex-basis: 100%; }
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

.pg-rep-actions { display: flex; flex-direction: column; gap: 4px; }

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

/* A widget switched off stays editable but reads as hidden */
.pg-block.is-hidden { opacity: .6; }
.pg-show { display: inline-flex; align-items: center; gap: 4px; }

/* ════════════════════════════════════════════════════════════════════
   Section-row layout: one narrow column of compact rows, each with its
   name, a Hidden tag when off, an on/off switch and an expand arrow;
   numbered item cards inside; the Save bar fixed to the bottom.
   Fonts and font sizes are left exactly as they were.
   ════════════════════════════════════════════════════════════════════ */
@media (min-width: 992px) {
  .pg-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main';
  }
  .pg-layout.has-preview { grid-template-areas: 'main' 'preview'; }
}
@media (min-width: 1500px) {
  .pg-layout.has-preview {
    grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
    grid-template-areas: 'main preview';
  }
}

.pg-editor .pe-row {
  border: 1px solid var(--line, #ebe5d8) !important;
  border-radius: 16px !important;
  box-shadow: none !important;
  overflow: hidden;
  background: var(--surface, #fff);
}
.pg-editor .pe-row-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 16px 10px 10px !important;
  background: transparent !important;
  border-bottom: 1px solid transparent !important;
  border-radius: 0 !important;
  transition: background-color .15s ease;
}
.pg-editor .pe-row-head:hover { background: rgba(37, 47, 23, .03) !important; }
.pg-editor .pe-row > .card-body {
  padding: 16px 20px 20px;
  border-top: 1px solid var(--line, #f0ebe0);
}

/* A switched-off section is faded, like the reference. */
.pg-editor .pe-row.is-off { background: #fbf9f4; }
.pg-editor .pe-row.is-off > .pe-row-head { opacity: .62; }

.pe-row-title {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 4px 6px;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}
.pe-row-title .pg-block-summary { margin-left: 4px; }

.pe-hidden {
  flex: none;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f1ece3;
  color: #8b847d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: 10px;
  line-height: 1.4;
}

.pe-chev {
  flex: none;
  display: inline-flex;
  padding: 4px;
  border: 0;
  background: none;
  color: var(--text-muted, #6d6560);
  cursor: pointer;
}
.pe-chev svg { transition: transform .2s ease; }
.pe-chev.is-open svg { transform: rotate(180deg); }

/* Stacked ↑ ↓ — the column is also the drag handle. */
.pe-arrows {
  flex: none;
  display: flex;
  flex-direction: column;
  cursor: grab;
}
.pe-arrows button {
  display: inline-flex;
  padding: 0 2px;
  border: 0;
  background: none;
  color: var(--text-muted, #6d6560);
  line-height: 0;
  cursor: pointer;
}
.pe-arrows button:hover:not(:disabled) { color: var(--admin-green-600, #252f17); }
.pe-arrows button:disabled { opacity: .25; cursor: not-allowed; }

/* The on/off switch: larger, no label beside it. */
.pe-switch { flex: none; padding-left: 0; min-height: 0; display: inline-flex; align-items: center; }
.pe-switch .form-check-input {
  float: none;
  margin: 0;
  width: 42px;
  height: 24px;
  cursor: pointer;
}

.pe-help { margin: -2px 0 14px; color: var(--text-muted, #6d6560); font-size: .875em; }

/* "+ Add …" link under a list. */
.pe-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 6px 2px;
  border: 0;
  background: none;
  color: var(--admin-green-600, #252f17);
  font-weight: 600;
  cursor: pointer;
}
.pe-add:hover { text-decoration: underline; }

/* Fields stack one per line. */
.pg-editor .pg-text-grid { grid-template-columns: 1fr; gap: 18px; }

/* Numbered item cards. */
.pg-editor .pg-rep-row {
  display: block;
  padding: 12px 14px 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: #fbf9f4;
}
.pe-item-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.pe-item-title {
  color: var(--text-muted, #6d6560);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.pe-item-actions { margin-left: auto; display: flex; gap: 2px; }
.pg-editor .pg-rep-fields { grid-template-columns: 1fr; gap: 12px; }

/* Save bar: always there, button on the right. */
.pg-editor ~ .pg-savebar,
.pg-savebar { justify-content: flex-end; }

@media (max-width: 575px) {
  .pg-editor .pe-row-head { padding: 8px 10px 8px 6px !important; }
  .pg-editor .pe-row > .card-body { padding: 14px; }
  .pe-row-title .pg-block-summary { display: none; }
}

/* ── Home banner carousel list ── */
.bc-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
.bc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line, #ebe5d8);
  border-radius: 12px;
  background: #fbf9f4;
}
.bc-row.is-off > :not(.bc-actions) { opacity: .55; }
.bc-num { flex: none; width: 20px; text-align: center; font-weight: 600; color: var(--text-muted, #6d6560); }
.bc-thumb { flex: none; width: 112px; aspect-ratio: 1900 / 560; object-fit: cover; border-radius: 6px; background: #e4e1e0; }
.bc-thumb--m { width: 34px; aspect-ratio: 402 / 514; }
.bc-meta { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bc-title { display: flex; align-items: center; gap: 6px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-link { color: var(--text-muted, #6d6560); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .875em; }
.bc-actions { flex: none; display: flex; align-items: center; gap: 2px; }
.bc-actions .pe-switch { margin: 0 6px; }
@media (max-width: 575px) {
  .bc-row { flex-wrap: wrap; }
  .bc-meta { flex-basis: calc(100% - 200px); }
  .bc-actions { width: 100%; justify-content: flex-end; }
}

/* More hero images, inside the Hero section */
.hs-block { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line, #f0ebe0); }
.hs-speed { margin-top: 14px; }
.hs-speed .form-control { max-width: 160px; }

/* The main banner leads the hero banner list. */
.bc-row--main { background: #f5f1e8; }
.bc-badge {
  padding: 1px 7px;
  border-radius: 999px;
  background: #eef4e6;
  color: #1a2110;
  font-size: 11px;
  font-weight: 600;
}

/* A field's own small on/off, beside its label. */
.pe-label-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: .5rem; }
.pe-mini-switch { padding-left: 0; min-height: 0; display: inline-flex; }
.pe-mini-switch .form-check-input { float: none; margin: 0; width: 30px; height: 16px; cursor: pointer; }

/* Track order: two groups, each in its page's own top-to-bottom order.
   Customer Order Tracking (My Account) first, then Guest Order Tracking
   (/track-order) with its widgets, browser tab / copy message and SEO.
   Other pages keep their order. */
.pe-page-track_order > * { order: 9; }
.pe-page-track_order > .pe-r-group-customer { order: 1; }
.pe-page-track_order > .pe-r-sec-acc_header { order: 2; }
.pe-page-track_order > .pe-r-sec-acc_search { order: 3; }
.pe-page-track_order > .pe-r-sec-acc_result { order: 4; }
.pe-page-track_order > .pe-r-group-guest { order: 5; }
.pe-page-track_order > .pe-r-header { order: 6; }
.pe-page-track_order > .pe-r-sec-search { order: 7; }
.pe-page-track_order > .pe-r-sec-result { order: 8; }
.pe-page-track_order > .pe-r-sec-page { order: 10; }
.pe-page-track_order > .pe-r-seo { order: 0; } /* SEO first, as on every page */

.pe-group {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding: 0 4px;
}
.pe-group.pe-r-group-guest { margin-top: 24px; }
.pe-group-title { margin: 0; font-weight: 700; color: var(--admin-green-600, #252f17); }
.pe-group-title span { font-weight: 500; color: var(--text-muted, #6d6560); }
.pe-group-link {
  display: inline-flex; align-items: center; gap: 5px; flex: none;
  color: var(--admin-green-600, #252f17); font-weight: 600; font-size: .875em; white-space: nowrap;
}
.pe-group-link:hover { text-decoration: underline; }
</style>
