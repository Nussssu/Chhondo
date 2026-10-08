<template>
  <component :is="embedded ? 'div' : AdminLayout">
    <div class="page-content" :class="{ 'product-embedded': embedded }">
      <PageHeader
        v-if="!embedded"
        title="Edit product"
        :subtitle="product.product_name"
        :breadcrumbs="[{ label: 'Products', href: route('products.index') }, { label: 'Edit' }]"
      />

      <form
        method="POST"
        :action="route('products.update', product.id)"
        enctype="multipart/form-data"
        id="editProductForm"
      >
        <input type="hidden" name="_token" :value="csrfToken">
        <input v-if="embedded" type="hidden" name="_modal" value="1">
        <input type="hidden" name="_method" value="PUT">

        <!-- Section tabs. Panels stay in the DOM and are hidden with the
             `hidden` attribute rather than v-if, so every field still posts
             with the native form submit no matter which tab is open. -->
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
            <!-- Product Name / Code -->
            <div class="card">
              <div class="card-header">
                <h5 class="fw-500">Update Product</h5>
              </div>
              <div class="card-body">
                <input type="text" name="product_id" :value="product.id" hidden>
                <div class="col-md-12">
                  <label for="product_name" class="form-label">Product Name</label>
                  <input type="text" class="form-control" id="product_name" name="product_name" :value="product.product_name">
                </div>
                <div class="col-md-12 mt-2">
                  <label for="product_code" class="form-label">Product Code</label>
                  <input type="text" class="form-control" id="product_code" name="product_code" :value="product.product_code">
                </div>
              </div>
            </div>

            <!-- Category -->
            <div class="card">
              <div class="card-body">
                <div class="col-md-12">
                  <label class="form-label">Categories</label>
                  <CategoryMultiSelect :categories="categories" :model-value="selectedCategoryIds" required />
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'pricing'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <!-- Price -->
            <div class="card">
              <div class="card-body">
                <div class="col-md-12 mt-2">
                  <!-- The pair reads left to right the way the storefront shows it:
                       the struck-through price, then what is actually charged. -->
                  <div class="row g-2">
                    <div class="col-md-6">
                      <label for="previous_price" class="form-label">Price</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="previous_price" name="previous_price" :value="mainPrice.regular">
                      <small class="text-muted">Struck through when a sale price is set.</small>
                    </div>
                    <div class="col-md-6">
                      <label for="price" class="form-label">Sale Price</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="price" name="price" :value="mainPrice.sale">
                      <small class="text-muted">What the customer pays.</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 mt-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="has_blouse_option" name="has_blouse_option" value="1" :checked="!!product.has_blouse_option">
                    <label class="form-check-label" for="has_blouse_option">Add Price With Blouse</label>
                  </div>
                </div>
                <div class="col-md-12 mt-2" id="price_with_blouse_wrap" :style="product.has_blouse_option ? '' : 'display:none'">
                  <!-- Same pair again for the with-blouse option, so choosing it on
                       the product page swaps both figures, not just the price. -->
                  <div class="row g-2">
                    <div class="col-md-6">
                      <label for="previous_price_with_blouse" class="form-label">Price With Blouse</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="previous_price_with_blouse" name="previous_price_with_blouse" :value="blousePrice.regular">
                      <small class="text-muted">Struck through when a sale price is set.</small>
                    </div>
                    <div class="col-md-6">
                      <label for="price_with_blouse" class="form-label">Sale Price With Blouse</label>
                      <input type="number" step="0.01" min="0" class="form-control" id="price_with_blouse" name="price_with_blouse" :value="blousePrice.sale">
                      <small class="text-muted">Optional — blank charges the price beside it.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stock -->
            <div class="card">
              <div class="card-body">
                <ProductStockFields
                  :model-status="product.stock_status ?? 'manage'"
                  :model-quantity="product.quantity"
                  :model-stock-option="product.stock_option"
                  :model-preorder-note="product.preorder_note ?? ''"
                />
              </div>
            </div>

            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'media'" role="tabpanel">
          <div class="row">
            <div class="col-12">

            <!-- Featured image -->
            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Featured image <span class="req">*</span></h2>
                <p class="pf-hint">Shown in listings and as the main product image. Must be 2:3 ratio.</p>

                <div class="pf-media-row">
                  <div class="pf-thumb pf-thumb--featured">
                    <img v-if="product.featured_image" :src="product.featured_image" alt="Current featured image" @error="$event.target.src = '/placeholder.svg'" />
                    <span v-else class="pf-thumb-empty">None</span>
                  </div>

                  <div class="pf-media-controls">
                    <input type="hidden" name="featured_image_library_path" id="featured_image_library_path">
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showFeaturedPicker = true">
                      Choose from library
                    </button>
                    <div id="featured-preview"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gallery -->
            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Gallery</h2>
                <p class="pf-hint">
                  Extra images shown on the product page, in this order after the featured image.
                  Drag to reorder, or focus an image and use the arrow keys.
                </p>

                <div class="pf-media-controls pf-media-controls--row">
                  <!-- The array order is the saved sequence; the controller stores it as posted. -->
                  <input type="hidden" name="existing_gallery_images" id="existing_gallery_images" :value="JSON.stringify(galleryImages)">
                  <input type="hidden" name="existing_color_links" id="existing_color_links" :value="JSON.stringify(product.color_links || [])">
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
                    <span class="pf-gallery-pos">{{ index + 1 }}</span>
                    <button type="button" class="remove-btn" :aria-label="`Remove image ${index + 1}`" @click="removeGalleryImage(index)">&times;</button>
                  </div>
                </div>

              </div>
            </div>

            <!-- Video: moved here from the Description tab. Only the host and
                 the one input that host needs are shown. -->
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
                    <label for="video" class="form-label">Video file</label>
                    <input type="hidden" name="video_library_path" :value="videoLibraryPath ?? ''">
                    <button type="button" class="btn btn-fig-secondary btn-fig-sm mt-2" @click="showVideoPicker = true">
                      Choose from library
                    </button>
                    <!-- Shows the saved video too, so a product that already has
                         one does not look empty after saving. -->
                    <div v-if="videoPreview" class="pf-video-preview mt-2">
                      <video :src="videoPreview" controls preload="metadata"></video>
                      <p class="pf-video-current">
                        {{ videoLibraryPath ? 'Selected — save to apply' : 'Current video' }}
                      </p>
                    </div>
                    <small class="pf-hint">Leave empty to keep the current file.</small>
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
                      :value="product.video_link || ''"
                    >
                    <small class="pf-hint">
                      {{ videoHost === 'Youtube'
                        ? 'Just the video link — copy it from the address bar or Share.'
                        : 'Just the share link. Set it to “Anyone with the link” or it will not play.' }}
                    </small>
                  </div>
                </div>

                <!-- Captions stay available but out of the way. They are still
                     submitted: the controller writes '' for any absent field,
                     so dropping them would blank the storefront headings. -->
                <details v-if="videoHost" class="pf-more">
                  <summary>Optional headings</summary>
                  <div class="pf-more-body">
                    <div>
                      <label for="video_section_title" class="form-label">Section heading</label>
                      <input type="text" class="form-control" id="video_section_title" name="video_section_title" :value="product.video_section_title">
                    </div>
                    <div>
                      <label for="video_title" class="form-label">Video heading</label>
                      <input type="text" class="form-control" id="video_title" name="video_title" :value="product.video_title || ''">
                    </div>
                    <div>
                      <label for="sec_video_title" class="form-label">Second video heading</label>
                      <input type="text" class="form-control" id="sec_video_title" name="sec_video_title" :value="product.sec_video_title || ''">
                    </div>
                  </div>
                </details>

                <!-- When no video is set, keep the existing values intact
                     rather than letting the controller overwrite them with ''. -->
                <template v-if="!videoHost">
                  <input type="hidden" name="video_section_title" :value="product.video_section_title || ''">
                  <input type="hidden" name="video_title" :value="product.video_title || ''">
                  <input type="hidden" name="sec_video_title" :value="product.sec_video_title || ''">
                  <input type="hidden" name="video_link" :value="product.video_link || ''">
                </template>
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
                <textarea name="short_description" class="form-control summernote">{{ product.short_description }}</textarea>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h2 class="pf-section">Full description</h2>
                <p class="pf-hint">The main product copy, shown in the description tab.</p>
                <textarea class="form-control summernote" name="description" rows="3">{{ product.description }}</textarea>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div class="pf-panel" :hidden="tab !== 'seo'" role="tabpanel">
          <div class="row">
            <div class="col-12">
            <!-- SEO -->
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
                    >
                  </div>
                  <div v-if="errors.slug" class="text-danger small mt-1">{{ errors.slug }}</div>
                  <small class="text-muted d-block mt-1">
                    The product's address. Changing it breaks links people have already saved or shared.
                    <button type="button" class="btn btn-link btn-sm p-0 align-baseline" @click="slug = suggestedSlug">
                      Rebuild from the name
                    </button>
                  </small>
                </div>
                <div class="col-md-12 mt-2">
                  <label for="meta_title" class="form-label">Meta Title</label>
                  <input type="text" class="form-control" id="meta_title" name="meta_title" :value="product.meta_title">
                </div>
                <div class="col-md-12 mt-2">
                  <label for="meta_description" class="form-label">Meta Description</label>
                  <textarea class="form-control" name="meta_description" id="meta_description" rows="3"> {{ product.meta_description }} </textarea>
                </div>
                <div class="mt-2">
                  <label for="tag-imput" class="form-label">Product Tags</label>
                  <input id="tags-input" type="text" name="product_tag[]" placeholder="Type tags and separate with commas" class="form-control" :value="JSON.stringify(tagValues)">
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Sticky save bar: the form is long enough that a submit button at
             the very bottom was easy to miss. -->
        <div class="pf-savebar">
          <span v-if="errorCount" class="pf-savebar-errors">
            {{ errorCount }} field{{ errorCount === 1 ? '' : 's' }} need attention
          </span>
          <span v-else class="pf-savebar-hint">All sections complete</span>
          <div class="pf-savebar-actions">
            <a :href="route('products.index')" class="btn btn-fig-secondary btn-fig-sm">Cancel</a>
            <button type="submit" class="btn btn-fig-primary btn-fig-md">Update product</button>
          </div>
        </div>
      </form>
    </div>

    <MediaLibraryPickerModal v-if="showFeaturedPicker" @close="showFeaturedPicker = false" @select="onFeaturedSelected" />
    <MediaLibraryPickerModal v-if="showGalleryPicker" multiple @close="showGalleryPicker = false" @select-multiple="onGallerySelected" />
    <MediaLibraryPickerModal v-if="showVideoPicker" kind="video" @close="showVideoPicker = false" @select="onVideoSelected" />
  </component>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import ProductStockFields from './Partials/ProductStockFields.vue'
import CategoryMultiSelect from '@/components/Admin/CategoryMultiSelect.vue'
import { useStickyTab } from '@/composables/useStickyTab'
import { useDragSort } from '@/composables/useDragSort'
import { slugify } from '@/utils/slug'
import { parseGalleryImages } from '@/utils/galleryImages'

const props = defineProps({
  embedded: { type: Boolean, default: false },
  product: { type: Object, default: () => ({}) },
  tagValues: { type: Array, default: () => [] },
  specifications: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  // Primary first — see Product::categoryIds().
  selectedCategoryIds: { type: Array, default: () => [] },
})

const tabs = [
  { id: 'basics',   label: 'Basics' },
  { id: 'pricing',  label: 'Pricing & stock' },
  { id: 'media',    label: 'Media' },
  { id: 'content',  label: 'Description' },
  { id: 'seo',      label: 'SEO' },
]

// Survives the reload that follows a save, so the operator stays where they were.
const tab = useStickyTab(tabs.map((t) => t.id), 'basics')

// Which tab owns which field, so a failed save points at the section holding
// the problem instead of leaving it hidden behind a closed tab.
const FIELD_TAB = {
  product_name: 'basics', product_code: 'basics', category_id: 'basics', category: 'basics',
  category_ids: 'basics',
  price: 'pricing', previous_price: 'pricing', price_with_blouse: 'pricing',
  previous_price_with_blouse: 'pricing',
  stock_option: 'pricing', quantity: 'pricing',
  featured_image: 'media', gallery_images: 'media',
  short_description: 'content', description: 'content',
  video_link: 'content', video_title: 'content', video_host: 'content', video: 'content',
  meta_title: 'seo', meta_description: 'seo', product_tag: 'seo', slug: 'seo',
}

/**
 * The product's address, editable here rather than regenerated on save.
 *
 * Held in a ref so the "rebuild" shortcut can rewrite it; the server normalises
 * whatever arrives, so a typed value never has to be perfect.
 */
/**
 * The two boxes of a price pair, read back out of how it is stored.
 *
 * The record keeps the charged figure in `price` and the struck-through one in
 * `previous_price`; the form shows a price with an optional sale price under
 * it. Without this the boxes reopen swapped whenever a product is not on sale.
 */
function pricePair(struckField, chargedField) {
  const struck = Number(props.product?.[struckField]) || 0
  const charged = Number(props.product?.[chargedField]) || 0

  // Nothing struck through means the product is not on sale, so the charged
  // figure is its normal price and the sale box is empty.
  return struck > 0
    ? { regular: struck, sale: charged || '' }
    : { regular: charged || '', sale: '' }
}

const mainPrice = computed(() => pricePair('previous_price', 'price'))
const blousePrice = computed(() => pricePair('previous_price_with_blouse', 'price_with_blouse'))

const slug = ref(props.product?.slug ?? '')

const suggestedSlug = computed(() =>
  slugify([props.product?.product_name, props.product?.product_code].filter(Boolean).join('-'))
)

const page = usePage()
const errors = computed(() => page?.props?.errors ?? {})
const errorCount = computed(() => Object.keys(errors.value).length)

const tabErrors = computed(() => {
  const counts = {}
  for (const key of Object.keys(errors.value)) {
    // Laravel reports array fields as "gallery_images.0"
    const owner = FIELD_TAB[key.split('.')[0]] ?? 'basics'
    counts[owner] = (counts[owner] ?? 0) + 1
  }
  return counts
})

// Open the first tab that has a problem after a rejected save.
onMounted(() => {
  const firstBad = tabs.find((t) => tabErrors.value[t.id])
  if (firstBad) tab.value = firstBad.id
})

// Drives which single video input is shown. Replaces the old
// toggleVideoInput() that hid/showed containers by id.
const videoHost = ref(props.product?.video_host ?? '')

const showFeaturedPicker = ref(false)
const showGalleryPicker = ref(false)
const showVideoPicker = ref(false)
const videoLibraryPath = ref(null)

// A newly picked video wins; otherwise show whatever is already saved. Stored
// values are relative to public/, so they need a leading slash to resolve.
const videoPreview = computed(() => {
  if (videoLibraryPath.value) return videoLibraryPath.value
  const saved = props.product?.video
  if (!saved) return null
  return /^(https?:)?\/\//.test(saved) ? saved : '/' + String(saved).replace(/^\/+/, '')
})

const onVideoSelected = (item) => {
  showVideoPicker.value = false
  videoLibraryPath.value = item.url
}

const onFeaturedSelected = (item) => {
  showFeaturedPicker.value = false
  // Library-only now: there is no file input to clear. Touching the old
  // #featured_image threw, so the preview below was never drawn.
  document.getElementById('featured_image_library_path').value = item.url
  const preview = document.getElementById('featured-preview')
  preview.innerHTML = `<div class="gallery-img-container" style="max-width: 150px"><img src="${item.url}" class="img-fluid" alt="Featured Preview"><button type="button" class="remove-btn" onclick="removeFeaturedPreview()">&times;</button></div>`
}

// The gallery in its saved order. Posted back whole as existing_gallery_images,
// so reordering here is all it takes to change the order on the storefront.
const galleryImages = ref(parseGalleryImages(props.product?.gallery_images))
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

  // Tagify
  const tagsInput = document.querySelector('#tags-input')
  if (tagsInput && typeof window.Tagify !== 'undefined') {
    new window.Tagify(tagsInput, { delimiters: ',', whitelist: [] })
  }

  // Video host toggle

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
        // Not marked required: a blouse option priced only at its regular
        // price is valid, and the sale half is what may be left blank.
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

  // Summernote
  if ($ && $.fn && $.fn.summernote) {
    $('.summernote').summernote({ height: 200 })
  }

  // Specification section toggle
  if ($) {
    $('#flexSwitchCheckDefault1').change(function () {
      if ($(this).prop('checked')) {
        $('#specification-section').show()
      } else {
        $('#specification-section').hide()
        $('#dynamic-input-container').empty()
      }
    })

    $('#add-specification').click(function () {
      const newInputField = `<div class="row mt-2"><div class="col-md-5"><input type="text" class="form-control" name="specification[]" placeholder="Specification name" /></div><div class="col-md-5"><input type="text" class="form-control" name="specification[]" placeholder="Specification Description" /></div><div class="col-md-2"><button class="btn btn-fig-danger btn-fig-sm remove-input"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="admin-icon" data-lucide="trash-2" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg></button></div></div>`
      $('#dynamic-input-container').append(newInputField)
    })

    $(document).on('click', '.remove-input', function () { $(this).closest('.row').remove() })
  }

  window.removeFeaturedPreview = function () {
    document.getElementById('featured_image_library_path').value = ''
    document.getElementById('featured-preview').innerHTML = ''
  }

})
</script>

<style scoped>
.product-embedded { padding: 0 !important; }
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
  background: var(--admin-cream, #FAF5E9);
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
