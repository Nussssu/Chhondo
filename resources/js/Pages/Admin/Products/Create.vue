<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader
        title="Add product"
        :breadcrumbs="[{ label: 'Products', href: route('products.index') }, { label: 'Add' }]"
      />

      <!-- A rejected save reloads this page with an empty form, so without this
           list it looked as if saving had simply done nothing. -->
      <div v-if="errorList.length" ref="errorBox" class="alert alert-danger" role="alert">
        <strong>The product was not saved.</strong>
        <ul class="mb-0 mt-1">
          <li v-for="(msg, i) in errorList" :key="i">{{ msg }}</li>
        </ul>
      </div>

      <!-- Laid out like Products/Edit, section for section, so adding and
           editing a product are the same form. -->
      <form
        method="POST"
        :action="route('products.store')"
        enctype="multipart/form-data"
        id="createProductForm"
        novalidate
        @submit="checkBeforeSubmit"
      >
        <input type="hidden" name="_token" :value="csrfToken">

        <!-- Panels stay in the DOM and are hidden with the `hidden` attribute
             rather than v-if, so every field still posts with the native form
             submit no matter which tab is open. -->
        <nav class="pf-tabs" role="tablist">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            class="pf-tab"
            :class="{ 'is-on': tab === t.id, 'has-error': tabErrors[t.id] }"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >
            {{ t.label }}
            <span v-if="tabErrors[t.id]" class="pf-tab-error" :title="`${tabErrors[t.id]} problem(s) in this section`">
              {{ tabErrors[t.id] }}
            </span>
          </button>
        </nav>

        <div class="pf-panel" :hidden="tab !== 'basics'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="fw-500">Insert Product</h5>
              </div>
              <div class="card-body">
                <div class="col-md-12">
                  <label for="product_name" class="form-label">Product Name <span class="req">*</span></label>
                  <input type="text" class="form-control" id="product_name" name="product_name" v-model="productName">
                </div>
                <div class="col-md-12 mt-2">
                  <label for="product_code" class="form-label">Product Code <span class="req">*</span></label>
                  <input type="text" class="form-control" id="product_code" name="product_code" v-model="productCode">
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="col-md-12">
                  <label class="form-label">Categories <span class="req">*</span></label>
                  <CategoryMultiSelect :categories="categories" required />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'pricing'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="col-md-12 mt-2">
                  <!-- The pair reads left to right the way the storefront shows it:
                       the struck-through price, then what is actually charged. -->
                  <div class="row g-2">
                    <div class="col-md-6">
                      <label for="previous_price" class="form-label">Price <span class="req">*</span></label>
                      <input type="number" step="0.01" min="0" class="form-control" id="previous_price" name="previous_price">
                      <small class="text-muted">Struck through when a sale price is set.</small>
                    </div>
                    <div class="col-md-6">
                      <label for="price" class="form-label">Sale Price</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="price" name="price">
                      <small class="text-muted">What the customer pays. Leave blank if not on sale.</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 mt-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="has_blouse_option" name="has_blouse_option" value="1">
                    <label class="form-check-label" for="has_blouse_option">Add Price With Blouse</label>
                  </div>
                </div>
                <div class="col-md-12 mt-2" id="price_with_blouse_wrap" style="display:none">
                  <div class="row g-2">
                    <div class="col-md-6">
                      <label for="previous_price_with_blouse" class="form-label">Price With Blouse</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="previous_price_with_blouse" name="previous_price_with_blouse">
                      <small class="text-muted">Struck through when a sale price is set.</small>
                    </div>
                    <div class="col-md-6">
                      <label for="price_with_blouse" class="form-label">Sale Price With Blouse</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="price_with_blouse" name="price_with_blouse">
                      <small class="text-muted">Optional — blank charges the price beside it.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <ProductStockFields required model-status="instock" :model-quantity="0" model-stock-option="Manual" />
              </div>
            </div>
            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'media'" role="tabpanel">
          <div class="row">
            <div class="col-12">

            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Featured image <span class="req">*</span></h2>
                <p class="pf-hint">Shown in listings and as the main product image. Must be 2:3 ratio.</p>

                <div class="pf-media-row">
                  <div class="pf-thumb pf-thumb--featured">
                    <img v-if="featuredPath" :src="featuredPath" alt="Chosen featured image" />
                    <span v-else class="pf-thumb-empty">None</span>
                  </div>

                  <div class="pf-media-controls">
                    <input type="hidden" name="featured_image_library_path" id="featured_image_library_path" :value="featuredPath">
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showFeaturedPicker = true">
                      {{ featuredPath ? 'Change image' : 'Choose from library' }}
                    </button>
                    <button v-if="featuredPath" type="button" class="btn btn-link btn-sm p-0 text-danger" @click="featuredPath = ''">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Gallery</h2>
                <p class="pf-hint">
                  Extra images shown on the product page, in this order after the featured image.
                  Drag to reorder, or focus an image and use the arrow keys.
                </p>

                <div class="pf-media-controls pf-media-controls--row">
                  <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showGalleryPicker = true">
                    Add from library
                  </button>
                </div>

                <div v-if="galleryImages.length" id="existingGalleryPreview" class="pf-gallery">
                  <div
                    v-for="(imageUrl, index) in galleryImages"
                    :key="imageUrl"
                    class="gallery-img-container"
                    :class="{ 'is-dragging': dragIndex === index }"
                    draggable="true"
                    tabindex="0"
                    :aria-label="`Gallery image ${index + 1} of ${galleryImages.length}`"
                    @dragstart="onDragStart(index, $event)"
                    @dragover.prevent="onDragOver(index)"
                    @drop.prevent
                    @dragend="onDragEnd"
                    @keydown="onKeydown(index, $event)"
                  >
                    <img :src="imageUrl" :alt="`Gallery image ${index + 1}`" draggable="false">
                    <!-- Posted in array order, which is the saved sequence. -->
                    <input type="hidden" name="gallery_images_existing[]" :value="imageUrl">
                    <span class="pf-gallery-pos">{{ index + 1 }}</span>
                    <button type="button" class="remove-btn" :aria-label="`Remove image ${index + 1}`" @click="removeGalleryImage(index)">&times;</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Video</h2>
                <p class="pf-hint">Optional. Shown on the product page below the gallery.</p>

                <div class="pf-video">
                  <div class="pf-video-host">
                    <label for="video_host" class="form-label">Where is it hosted?</label>
                    <select class="form-select" id="video_host" name="video_host" v-model="videoHost">
                      <option value="">No video</option>
                      <option value="Youtube">YouTube</option>
                      <option value="Gdrive">Google Drive</option>
                      <option value="Local">Upload a file</option>
                    </select>
                  </div>

                  <div v-if="videoHost === 'Local'" class="pf-video-input">
                    <label class="form-label">Video file</label>
                    <input type="hidden" name="video_library_path" :value="videoLibraryPath ?? ''">
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm mt-2" @click="showVideoPicker = true">
                      Choose from library
                    </button>
                    <div v-if="videoLibraryPath" class="pf-video-preview mt-2">
                      <video :src="videoLibraryPath" controls preload="metadata"></video>
                      <p class="pf-video-current">Selected</p>
                    </div>
                  </div>

                  <div v-else-if="videoHost" class="pf-video-input">
                    <label for="video_link" class="form-label">
                      {{ videoHost === 'Youtube' ? 'YouTube link' : 'Google Drive link' }}
                    </label>
                    <input
                      type="url"
                      name="video_link"
                      id="video_link"
                      class="form-control"
                      :placeholder="videoHost === 'Youtube'
                        ? 'https://www.youtube.com/watch?v=…'
                        : 'https://drive.google.com/file/d/…/view'"
                    >
                    <small class="pf-hint">
                      {{ videoHost === 'Youtube'
                        ? 'Just the video link — copy it from the address bar or Share.'
                        : 'Just the share link. Set it to “Anyone with the link” or it will not play.' }}
                    </small>
                  </div>
                </div>

                <details v-if="videoHost" class="pf-more">
                  <summary>Optional headings</summary>
                  <div class="pf-more-body">
                    <div>
                      <label for="video_section_title" class="form-label">Section heading</label>
                      <input type="text" class="form-control" id="video_section_title" name="video_section_title">
                    </div>
                    <div>
                      <label for="video_title" class="form-label">Video heading</label>
                      <input type="text" class="form-control" id="video_title" name="video_title">
                    </div>
                    <div>
                      <label for="sec_video_title" class="form-label">Second video heading</label>
                      <input type="text" class="form-control" id="sec_video_title" name="sec_video_title">
                    </div>
                  </div>
                </details>
              </div>
            </div>

            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'content'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Short description</h2>
                <p class="pf-hint">A sentence or two shown near the price.</p>
                <textarea name="short_description" class="form-control summernote"></textarea>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Full description</h2>
                <p class="pf-hint">The main product copy, shown in the description tab.</p>
                <textarea class="form-control summernote" name="description" rows="3"></textarea>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'seo'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h5 class="mt-2">SEO Information</h5>
                <div class="col-md-12">
                  <label for="slug" class="form-label">Permalink</label>
                  <div class="input-group">
                    <span class="input-group-text">/product/</span>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.slug }"
                      id="slug"
                      name="slug"
                      v-model="slug"
                      :placeholder="suggestedSlug"
                    >
                  </div>
                  <div v-if="errors.slug" class="text-danger small mt-1">{{ errors.slug }}</div>
                  <small class="text-muted d-block mt-1">
                    The product's address. Leave blank to build it from the name and code.
                  </small>
                </div>
                <div class="col-md-12 mt-2">
                  <label for="meta_title" class="form-label">Meta Title</label>
                  <input type="text" class="form-control" id="meta_title" name="meta_title">
                </div>
                <div class="col-md-12 mt-2">
                  <label for="meta_description" class="form-label">Meta Description</label>
                  <textarea class="form-control" name="meta_description" id="meta_description" rows="3"></textarea>
                </div>
                <div class="mt-2">
                  <label for="tags-input" class="form-label">Product Tags</label>
                  <input id="tags-input" type="text" name="product_tag[]" placeholder="Type tags and separate with commas" class="form-control">
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Sticky save bar, as on Edit. -->
        <div class="pf-savebar">
          <span v-if="errorList.length" class="pf-savebar-errors">
            {{ errorList.length }} field{{ errorList.length === 1 ? '' : 's' }} need attention
          </span>
          <span v-else class="pf-savebar-hint">Fields marked * are required</span>
          <div class="pf-savebar-actions">
            <a :href="route('products.index')" class="btn btn-fig-secondary btn-fig-sm">Cancel</a>
            <button type="submit" class="btn btn-fig-primary btn-fig-md" id="submit-product">Create product</button>
          </div>
        </div>
      </form>
    </div>

    <MediaLibraryPickerModal v-if="showFeaturedPicker" @close="showFeaturedPicker = false" @select="onFeaturedSelected" />
    <MediaLibraryPickerModal v-if="showGalleryPicker" multiple @close="showGalleryPicker = false" @select-multiple="onGallerySelected" />
    <MediaLibraryPickerModal v-if="showVideoPicker" kind="video" @close="showVideoPicker = false" @select="onVideoSelected" />
  </AdminLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import ProductStockFields from './Partials/ProductStockFields.vue'
import CategoryMultiSelect from '@/components/Admin/CategoryMultiSelect.vue'
import { useStickyTab } from '@/composables/useStickyTab'
import { useDragSort } from '@/composables/useDragSort'
import { slugify } from '@/utils/slug'

const props = defineProps({
  categories: { type: Array, default: () => [] },
})

const tabs = [
  { id: 'basics',   label: 'Basics' },
  { id: 'pricing',  label: 'Pricing & stock' },
  { id: 'media',    label: 'Media' },
  { id: 'content',  label: 'Description' },
  { id: 'seo',      label: 'SEO' },
]

const tab = useStickyTab(tabs.map((t) => t.id), 'basics')

// Which tab owns which field, so a failed save points at the section holding
// the problem instead of leaving it hidden behind a closed tab.
const FIELD_TAB = {
  product_name: 'basics', product_code: 'basics', purchase_product_code: 'basics',
  category_id: 'basics', category_ids: 'basics',
  price: 'pricing', previous_price: 'pricing', price_with_blouse: 'pricing',
  previous_price_with_blouse: 'pricing', stock_option: 'pricing', stock_status: 'pricing',
  quantity: 'pricing', preorder_note: 'pricing',
  featured_image: 'media', featured_image_library_path: 'media', gallery_images: 'media',
  gallery_images_existing: 'media', video_link: 'media', video_host: 'media', video: 'media',
  video_title: 'media', video_section_title: 'media', sec_video_title: 'media',
  short_description: 'content', description: 'content',
  meta_title: 'seo', meta_description: 'seo', product_tag: 'seo', slug: 'seo',
}

const page = usePage()
const errors = computed(() => page?.props?.errors ?? {})

// Problems found before posting, as [field, message] pairs.
const clientErrors = ref([])

const errorList = computed(() => clientErrors.value.length
  ? clientErrors.value.map(([, msg]) => msg)
  : Object.values(errors.value).flat())

const tabErrors = computed(() => {
  const fields = clientErrors.value.length
    ? clientErrors.value.map(([field]) => field)
    : Object.keys(errors.value)
  const counts = {}
  for (const key of fields) {
    // Laravel reports array fields as "gallery_images.0"
    const owner = FIELD_TAB[key.split('.')[0]] ?? 'basics'
    counts[owner] = (counts[owner] ?? 0) + 1
  }
  return counts
})

const errorBox = ref(null)

const openFirstBadTab = async () => {
  const firstBad = tabs.find((t) => tabErrors.value[t.id])
  if (firstBad) tab.value = firstBad.id
  await nextTick()
  errorBox.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Open the first tab that has a problem after a rejected save.
onMounted(openFirstBadTab)

const productName = ref('')
const productCode = ref('')
const slug = ref('')
const suggestedSlug = computed(() =>
  slugify([productName.value, productCode.value].filter(Boolean).join('-'))
)

/**
 * The form is a plain POST, so a rejection comes back as a blank form and
 * everything typed is lost. The mistakes that are easy to make are caught here
 * first, while the fields still hold what was entered. The server still
 * validates everything.
 */
const checkBeforeSubmit = (event) => {
  const form = event.target
  const value = (name) => (form.elements[name]?.value ?? '').trim()
  const problems = []

  if (!value('product_name')) problems.push(['product_name', 'Enter a product name.'])
  if (!value('product_code')) problems.push(['product_code', 'Enter a product code.'])
  if (!form.querySelector('input[name="category_ids[]"]')) problems.push(['category_ids', 'Choose at least one category.'])
  if (!value('price') && !value('previous_price')) problems.push(['price', 'Enter a price.'])
  if (value('price') && value('previous_price') && Number(value('previous_price')) <= Number(value('price'))) {
    problems.push(['previous_price', 'The sale price must be lower than the price.'])
  }
  if (!featuredPath.value) problems.push(['featured_image', 'Choose a featured image from the media library.'])

  clientErrors.value = problems
  if (problems.length) {
    event.preventDefault()
    openFirstBadTab()
  }
}

const videoHost = ref('')
const showFeaturedPicker = ref(false)
const showGalleryPicker = ref(false)
const showVideoPicker = ref(false)
const videoLibraryPath = ref(null)
const featuredPath = ref('')

const onVideoSelected = (item) => {
  showVideoPicker.value = false
  videoLibraryPath.value = item.url
}

const onFeaturedSelected = (item) => {
  showFeaturedPicker.value = false
  featuredPath.value = item.url
}

const galleryImages = ref([])
const { dragIndex, onDragStart, onDragOver, onDragEnd, onKeydown } = useDragSort(galleryImages)

const removeGalleryImage = (index) => {
  galleryImages.value = galleryImages.value.filter((_, i) => i !== index)
}

const onGallerySelected = (items) => {
  showGalleryPicker.value = false
  const added = items.map((i) => i.url).filter((url) => url && !galleryImages.value.includes(url))
  galleryImages.value = [...galleryImages.value, ...added]
}

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  const $ = window.$

  const tagsInput = document.querySelector('#tags-input')
  if (tagsInput && typeof window.Tagify !== 'undefined') {
    new window.Tagify(tagsInput, { delimiters: ',', whitelist: [] })
  }

  // Blouse toggle
  const checkbox = document.getElementById('has_blouse_option')
  const wrap = document.getElementById('price_with_blouse_wrap')
  const priceInput = document.getElementById('price_with_blouse')
  // Cleared alongside the price it belongs to, so turning the option off cannot
  // leave a "was" figure behind for a variant that no longer exists.
  const prevPriceInput = document.getElementById('previous_price_with_blouse')
  if (checkbox && wrap && priceInput) {
    const sync = () => {
      if (checkbox.checked) {
        wrap.style.display = ''
      } else {
        wrap.style.display = 'none'
        priceInput.value = ''
        if (prevPriceInput) prevPriceInput.value = ''
      }
    }
    checkbox.addEventListener('change', sync)
    sync()
  }

  if ($ && $.fn && $.fn.summernote) {
    $('.summernote').summernote({ height: 200 })
  }
})
</script>

<style scoped>
/* ── Section rhythm inside a panel ── */
.pf-section {
  margin: 0 0 4px;
  font-size: var(--fs-base);
  font-weight: 650;
  color: var(--text);
}

.pf-section--sub { font-size: var(--fs-md); margin-top: var(--sp-2); }

.pf-hint {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.req { color: var(--st-danger); }

/* ── Media rows ── */
.pf-media-row { display: flex; gap: var(--sp-4); align-items: flex-start; flex-wrap: wrap; }

.pf-thumb {
  flex-shrink: 0;
  width: 96px;
  height: 128px; /* 2:3, matching the required ratio */
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--surface-sunk);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pf-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pf-thumb-empty { font-size: var(--fs-xs); color: var(--text-faint); }

.pf-media-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-2);
  flex: 1 1 260px;
  min-width: 0;
}

.pf-media-controls--row { flex-direction: row; align-items: center; flex-wrap: wrap; }
.pf-media-controls .form-control { max-width: 380px; }

/* ── Gallery: fixed-size tiles, not quarter-width columns ── */
.pf-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}

.pf-gallery:empty { display: none; margin: 0; }

/* ── Video ── */
.pf-video {
  display: grid;
  grid-template-columns: minmax(180px, 220px) 1fr;
  gap: var(--sp-3) var(--sp-4);
  align-items: start;
}

.pf-video-input { min-width: 0; }

/* Unstyled, the <video> rendered at its intrinsic size and swamped the form. */
.pf-video-preview { max-width: 260px; }
.pf-video-preview video {
  width: 100%;
  max-height: 160px;
  border-radius: 8px;
  background: #000;
  display: block;
}
.pf-video-current {
  margin: 4px 0 0;
  font-size: .72rem;
  color: #90a4ae;
}

@media (max-width: 640px) {
  .pf-video { grid-template-columns: 1fr; }
}

/* ── Optional extras ── */
.pf-more {
  margin-top: var(--sp-4);
  border-top: 1px solid var(--line);
  padding-top: var(--sp-3);
}

.pf-more summary {
  cursor: pointer;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--admin-green-600);
  list-style: none;
}

.pf-more summary::-webkit-details-marker { display: none; }
.pf-more summary::before { content: '▸ '; }
.pf-more[open] summary::before { content: '▾ '; }

.pf-more-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

/* Cards inside a panel need breathing room between them. */
.pf-panel .card { margin-bottom: var(--sp-4); }
.pf-panel .card:last-child { margin-bottom: 0; }

/* ── Section tabs ── */
.pf-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
  margin-bottom: var(--sp-4);
  border-bottom: 1px solid var(--line);
  padding-bottom: var(--sp-2);
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--admin-cream, #FFFAF4);
}

.pf-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 0;
  border-radius: var(--r-sm);
  background: none;
  color: var(--text-muted);
  font-size: var(--fs-md);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.pf-tab:hover { background: var(--surface-sunk); color: var(--text); }
.pf-tab:focus-visible { outline: 2px solid var(--admin-green-600); outline-offset: 2px; }

.pf-tab.is-on {
  background: var(--admin-green-600);
  color: #fff;
}

.pf-tab.has-error { color: var(--st-danger); }
.pf-tab.is-on.has-error { background: var(--st-danger); color: #fff; }

.pf-tab-error {
  min-width: 18px;
  padding: 1px 6px;
  border-radius: var(--r-full);
  background: var(--st-danger);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
}

.pf-tab.is-on .pf-tab-error { background: rgba(255, 255, 255, .28); }

/* Hidden panels keep their fields in the DOM so the native form still posts
   them; [hidden] alone is overridden by Bootstrap's display rules. */
.pf-panel[hidden] { display: none !important; }

/* ── Sticky save bar ── */
.pf-savebar {
  position: sticky;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  flex-wrap: wrap;
  padding: var(--sp-3) var(--sp-4);
  margin-top: var(--sp-4);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  box-shadow: var(--el-2);
}

.pf-savebar-actions { display: flex; gap: var(--sp-2); align-items: center; }
.pf-savebar-hint { font-size: var(--fs-sm); color: var(--text-muted); }

.pf-savebar-errors {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--st-danger);
}

/*
 * These tiles are built at runtime with createElement/innerHTML, so they never
 * receive the scoped [data-v-*] attribute — a plain scoped selector silently
 * does not apply and the images render at full intrinsic size. :deep() anchors
 * the rule on the container, which IS in the template, so the generated
 * descendants match.
 */
.pf-gallery :deep(.gallery-img-container),
#featured-preview :deep(.gallery-img-container) {
  position: relative;
  cursor: grab;
  margin: 0;
  max-width: none !important; /* the injected markup sets an inline max-width */
}

.pf-gallery :deep(.gallery-img-container:active) { cursor: grabbing; }

.pf-gallery :deep(.gallery-img-container:focus-visible) {
  outline: 2px solid var(--admin-green-600);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}

.pf-gallery :deep(.gallery-img-container.is-dragging) { opacity: .45; }

.pf-gallery-pos {
  position: absolute;
  left: 3px;
  bottom: 3px;
  min-width: 18px;
  padding: 0 5px;
  border-radius: var(--r-full);
  background: rgba(0, 0, 0, .62);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  pointer-events: none;
}

.pf-gallery :deep(.gallery-img-container img) {
  display: block;
  width: 100%;
  height: 88px;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
}

#featured-preview :deep(.gallery-img-container img) {
  display: block;
  width: 96px;
  height: 128px;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
}

.pf-gallery :deep(.remove-btn),
#featured-preview :deep(.remove-btn) {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(185, 28, 28, .92);
  color: #fff;
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pf-gallery :deep(.remove-btn:hover),
#featured-preview :deep(.remove-btn:hover) { background: rgba(150, 20, 20, 1); }
.color-link-item { display: flex; align-items: center; margin-bottom: 10px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 5px; background: #f9f9f9; }
.color-link-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px; }
.color-link-item select { flex: 1; max-width: 200px; }
</style>
