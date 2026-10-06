<template>
  <AdminLayout>
    <div class="page-content reviews-page">
      <div class="container-fluid p-3 p-lg-4">

        <!-- Page header -->
        <div class="rv-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rv-header-icon"><Star :size="22" /></div>
            <div>
              <h4 class="mb-1 fw-bold rv-title">Customer Reviews</h4>
              <p class="mb-0 rv-subtitle">Curated testimonials for the homepage, plus reviews submitted on product pages</p>
            </div>
          </div>
          <div class="rv-stats d-flex gap-2">
            <div class="rv-stat">
              <div class="rv-stat-value">{{ currentStats.total }}</div>
              <div class="rv-stat-label">Total</div>
            </div>
            <div class="rv-stat" v-if="isProductTab">
              <div class="rv-stat-value rv-stat-pending">{{ pendingCount }}</div>
              <div class="rv-stat-label">Pending</div>
            </div>
            <div class="rv-stat">
              <div class="rv-stat-value">{{ currentStats.active }}</div>
              <div class="rv-stat-label">Active</div>
            </div>
            <div class="rv-stat">
              <div class="rv-stat-value">{{ currentStats.average }} <span class="rv-star-inline">★</span></div>
              <div class="rv-stat-label">Avg. rating</div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="rv-tabs mb-4">
          <button type="button" class="rv-tab" :class="{ 'is-on': tab === 'site' }" @click="tab = 'site'">
            <Star :size="15" /> Homepage Reviews
            <span class="rv-tab-count">{{ reviews.length }}</span>
          </button>
          <button type="button" class="rv-tab" :class="{ 'is-on': tab === 'product-active' }" @click="tab = 'product-active'">
            <MessageSquare :size="15" /> Product Reviews — Active
            <span class="rv-tab-count">{{ activeProductReviews.length }}</span>
          </button>
          <button type="button" class="rv-tab" :class="{ 'is-on': tab === 'product-pending' }" @click="tab = 'product-pending'">
            <Clock :size="15" /> Product Reviews — Pending
            <span class="rv-tab-count" :class="{ 'is-alert': pendingCount > 0 }">{{ pendingCount }}</span>
          </button>
        </div>

        <div v-show="tab === 'site'" class="row g-4">
          <!-- Form -->
          <div class="col-lg-4">
            <div class="rv-card rv-form-card">
              <div class="rv-card-head">
                <h6 class="mb-0 fw-semibold d-flex align-items-center gap-2">
                  <component :is="editingId ? Pencil : Plus" :size="16" />
                  {{ editingId ? 'Edit Review' : 'Add Review' }}
                </h6>
              </div>
              <div class="rv-card-body">
                <form @submit.prevent="submit">
                  <div class="mb-3">
                    <label class="rv-label">Name <span class="rv-req">*</span></label>
                    <input v-model="form.name" class="form-control rv-input" :class="{ 'is-invalid': form.errors.name }" placeholder="Customer name" />
                    <div class="invalid-feedback">{{ form.errors.name }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="rv-label">City</label>
                    <input v-model="form.city" class="form-control rv-input" placeholder="e.g. Dhaka" />
                  </div>

                  <div class="mb-3">
                    <label class="rv-label">Rating</label>
                    <div class="rv-star-input">
                      <button
                        v-for="n in 5" :key="n" type="button"
                        class="rv-star-btn"
                        :class="{ 'is-on': n <= (hoverRating || form.rating) }"
                        @click="form.rating = n"
                        @mouseenter="hoverRating = n"
                        @mouseleave="hoverRating = 0"
                        :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                      >
                        <svg viewBox="0 0 24 24" width="26" height="26"><polygon points="12,2 15,9 22,9.3 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.3 9,9" /></svg>
                      </button>
                      <span class="rv-star-caption">{{ form.rating }} / 5</span>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="rv-label">Review <span class="rv-req">*</span></label>
                    <textarea v-model="form.review" rows="4" class="form-control rv-input" :class="{ 'is-invalid': form.errors.review }" placeholder="What did the customer say?"></textarea>
                    <div class="invalid-feedback">{{ form.errors.review }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="rv-label">Photo</label>
                    <div class="rv-upload">
                      <div class="rv-upload-preview">
                        <img v-if="preview || currentImage" :src="preview || currentImage" alt="preview" />
                        <div v-else class="rv-upload-fallback">{{ (form.name || '?').charAt(0).toUpperCase() }}</div>
                      </div>
                      <div class="flex-grow-1">
                        <button type="button" class="btn rv-btn-ghost btn-sm" @click="showPicker = true">
                          {{ preview || currentImage ? 'Change photo' : 'Choose from Media Library' }}
                        </button>
                        <small class="rv-hint">Optional. Falls back to an initial avatar.</small>
                      </div>
                    </div>
                  </div>

                  <div class="row g-2 align-items-end mb-3">
                    <div class="col-6">
                      <label class="rv-label">Sort order</label>
                      <input v-model.number="form.sort_order" type="number" min="0" class="form-control rv-input" />
                    </div>
                    <div class="col-6">
                      <label class="rv-switch">
                        <input type="checkbox" v-model="form.is_active" />
                        <span class="rv-switch-track"></span>
                        <span class="rv-switch-label">{{ form.is_active ? 'Active' : 'Hidden' }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="submit" class="btn rv-btn-primary flex-fill" :disabled="form.processing">
                      <component :is="editingId ? Check : Plus" :size="16" />
                      {{ editingId ? 'Update' : 'Add' }} Review
                    </button>
                    <button v-if="editingId" type="button" class="btn rv-btn-ghost" @click="resetForm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- List -->
          <div class="col-lg-8">
            <div v-if="reviews.length === 0" class="rv-empty">
              <Star :size="40" />
              <h6 class="mt-3 mb-1">No reviews yet</h6>
              <p class="mb-0">Add your first testimonial from the form on the left.</p>
            </div>

            <div v-else class="rv-grid">
              <div v-for="r in reviews" :key="r.id" class="rv-review-card" :class="{ 'is-hidden': !r.is_active }">
                <div class="rv-review-top">
                  <div class="rv-avatar">
                    <img v-if="r.image" :src="r.image" :alt="r.name" />
                    <span v-else>{{ (r.name || '?').charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="rv-review-id">
                    <div class="rv-review-name">{{ r.name }}</div>
                    <div class="rv-review-city" v-if="r.city">{{ r.city }}</div>
                  </div>
                  <span class="rv-badge" :class="r.is_active ? 'is-active' : 'is-hidden'">
                    {{ r.is_active ? 'Active' : 'Hidden' }}
                  </span>
                </div>

                <div class="rv-review-stars">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" width="16" height="16" :class="{ 'on': n <= r.rating }">
                    <polygon points="12,2 15,9 22,9.3 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.3 9,9" />
                  </svg>
                </div>

                <p class="rv-review-text">{{ r.review }}</p>

                <div class="rv-review-actions">
                  <button type="button" class="rv-icon-btn is-edit" title="Edit" @click="edit(r)"><Pencil :size="15" /></button>
                  <button type="button" class="rv-icon-btn is-del" title="Delete" @click="destroy(r)"><Trash2 :size="15" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product reviews submitted by customers -->
        <div v-show="isProductTab">
          <div v-if="visibleProductReviews.length === 0" class="rv-empty">
            <component :is="tab === 'product-pending' ? Clock : MessageSquare" :size="40" />
            <h6 class="mt-3 mb-1">
              {{ tab === 'product-pending' ? 'Nothing waiting for approval' : 'No published product reviews' }}
            </h6>
            <p class="mb-0">
              {{ tab === 'product-pending'
                ? 'New reviews submitted from a product page will land here for approval.'
                : 'Approve a pending review to publish it on the product page.' }}
            </p>
          </div>

          <div v-else class="rv-grid">
            <div
              v-for="r in visibleProductReviews" :key="r.id"
              class="rv-review-card"
              :class="{ 'is-hidden': !r.is_active, 'is-pending': !r.is_active }"
            >
              <div class="rv-review-top">
                <div class="rv-avatar">
                  <img v-if="r.images && r.images.length" :src="r.images[0]" :alt="r.name" />
                  <span v-else>{{ (r.name || '?').charAt(0).toUpperCase() }}</span>
                </div>
                <div class="rv-review-id">
                  <div class="rv-review-name">{{ r.name }}</div>
                  <div class="rv-review-city">{{ r.contact }}</div>
                </div>
                <span class="rv-badge" :class="r.is_active ? 'is-active' : 'is-pending'">
                  {{ r.is_active ? 'Active' : 'Pending' }}
                </span>
              </div>

              <div v-if="r.product_name" class="rv-product-chip" :title="r.product_name">
                <Package :size="13" /> {{ r.product_name }}
              </div>

              <div class="rv-review-stars">
                <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" width="16" height="16" :class="{ 'on': n <= r.rating }">
                  <polygon points="12,2 15,9 22,9.3 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.3 9,9" />
                </svg>
              </div>

              <p class="rv-review-text">{{ r.review }}</p>

              <div v-if="r.images && r.images.length" class="rv-thumbs">
                <img v-for="img in r.images.slice(0, 4)" :key="img" :src="img" alt="review photo" />
                <span v-if="r.images.length > 4" class="rv-thumb-more">+{{ r.images.length - 4 }}</span>
              </div>

              <div class="rv-review-actions">
                <span class="rv-review-date">{{ r.created_at }}</span>
                <button type="button" class="rv-icon-btn is-edit" title="Edit" @click="openProductReview(r)"><Pencil :size="15" /></button>
                <button type="button" class="rv-icon-btn is-del" title="Delete" @click="destroyProductReview(r)"><Trash2 :size="15" /></button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <ProductReviewModal
      :open="modalOpen"
      :review="editingProductReview"
      @close="modalOpen = false"
    />

    <MediaLibraryPickerModal v-if="showPicker" @close="showPicker = false" @select="onLibrarySelected" />
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { ref, computed } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import { confirmDelete } from '@/utils/confirmDelete'
import { Pencil, Trash2, Star, Plus, Check, MessageSquare, Package, Clock } from 'lucide-vue-next'
import ProductReviewModal from './Partials/ProductReviewModal.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import { useStickyTab } from '@/composables/useStickyTab'

const props = defineProps({
  reviews: { type: Array, default: () => [] },
  productReviews: { type: Array, default: () => [] },
})

const editingId = ref(null)
const currentImage = ref(null)
const preview = ref(null)
const hoverRating = ref(0)
const showPicker = ref(false)

// Land on the pending tab when something is waiting for approval.
// Land on the pending tab when something is waiting, unless the URL says
// otherwise — a save reloads the page and would otherwise reset the choice.
const tab = useStickyTab(
  ['site', 'product-active', 'product-pending'],
  props.productReviews.some(r => !r.is_active) ? 'product-pending' : 'site'
)
const modalOpen = ref(false)
const editingProductReview = ref(null)

const activeProductReviews = computed(() => props.productReviews.filter(r => r.is_active))
const pendingProductReviews = computed(() => props.productReviews.filter(r => !r.is_active))
const pendingCount = computed(() => pendingProductReviews.value.length)

const isProductTab = computed(() => tab.value.startsWith('product-'))

const visibleProductReviews = computed(() =>
  tab.value === 'product-pending' ? pendingProductReviews.value : activeProductReviews.value
)

const statsFor = (list) => ({
  total: list.length,
  active: list.filter(r => r.is_active).length,
  average: list.length
    ? (list.reduce((a, r) => a + Number(r.rating || 0), 0) / list.length).toFixed(1)
    : '0.0',
})

const currentStats = computed(() =>
  statsFor(isProductTab.value ? props.productReviews : props.reviews)
)

const openProductReview = (r) => {
  editingProductReview.value = r
  modalOpen.value = true
}

const destroyProductReview = async (r) => {
  if (await confirmDelete()) {
    router.delete(route('admin.pages.reviews.product.destroy', r.id), { preserveScroll: true })
  }
}

const form = useForm({
  name: '',
  city: '',
  rating: 5,
  review: '',
  sort_order: 0,
  is_active: true,
  image: null,
  image_library_path: null,
})

const onLibrarySelected = (item) => {
  showPicker.value = false
  form.image = null
  form.image_library_path = item.url
  preview.value = item.url
}

const submit = () => {
  const options = { forceFormData: true, preserveScroll: true, onSuccess: resetForm }
  if (editingId.value) {
    form.post(route('admin.pages.reviews.update', editingId.value), options)
  } else {
    form.post(route('admin.pages.reviews.store'), options)
  }
}

const edit = (r) => {
  editingId.value = r.id
  currentImage.value = r.image
  preview.value = null
  form.name = r.name
  form.city = r.city
  form.rating = r.rating
  form.review = r.review
  form.sort_order = r.sort_order
  form.is_active = r.is_active
  form.image = null
  form.image_library_path = null
  form.clearErrors()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const destroy = async (r) => {
  if (await confirmDelete()) {
    router.delete(route('admin.pages.reviews.destroy', r.id), { preserveScroll: true })
  }
}

const resetForm = () => {
  editingId.value = null
  currentImage.value = null
  preview.value = null
  hoverRating.value = 0
  form.reset()
  form.rating = 5
  form.is_active = true
}
</script>

<style scoped>
/* Palette matched to the storefront (Figma) review components */
.reviews-page {
  --rv-cream: #FAF5E9;
  --rv-cream-2: #EFE0BB;
  --rv-border: #EFE0BB;
  --rv-border-strong: #E9C39C;
  --rv-green: #252f17;
  --rv-green-dark: #1A2110;
  --rv-ink: #2C1A0E;
  --rv-body: #4B4033;
  --rv-muted: #7A5C3E;
  --rv-star: #F5A623;
  --rv-shadow: 0 6px 20px rgba(139, 105, 20, 0.08);
}

/* Header */
.rv-header-icon {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: var(--rv-green); color: #fff; flex-shrink: 0;
}
.rv-title { color: var(--rv-ink); }
.rv-subtitle { color: var(--rv-muted); font-size: .85rem; }
.rv-stats { flex-wrap: wrap; }
.rv-stat {
  background: #fff; border: 1px solid var(--rv-border);
  border-radius: 12px; padding: 8px 16px; min-width: 84px; text-align: center;
}
.rv-stat-value { font-size: 1.25rem; font-weight: 700; color: var(--rv-green); line-height: 1.1; }
.rv-stat-label { font-size: .7rem; color: var(--rv-muted); text-transform: uppercase; letter-spacing: .03em; }
.rv-star-inline { color: var(--rv-star); }
.rv-stat-pending { color: #B9770E !important; }

/* Tabs */
.rv-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.rv-tab {
  display: inline-flex; align-items: center; gap: 7px;
  background: #fff; border: 1px solid var(--rv-border); border-radius: 999px;
  padding: 8px 16px; font-size: .85rem; font-weight: 600; color: var(--rv-body); cursor: pointer;
  transition: all .15s;
}
.rv-tab:hover { border-color: var(--rv-border-strong); }
.rv-tab.is-on { background: var(--rv-green); border-color: var(--rv-green); color: #fff; }
.rv-tab-count {
  background: var(--rv-cream-2); color: var(--rv-muted); border-radius: 999px;
  padding: 1px 8px; font-size: .72rem; font-weight: 700;
}
.rv-tab.is-on .rv-tab-count { background: rgba(255, 255, 255, .2); color: #fff; }
.rv-tab-count.is-alert { background: #F5A623; color: #3B2A06; }
.rv-tab.is-on .rv-tab-count.is-alert { background: #F5A623; color: #3B2A06; }

/* Cards */
.rv-card {
  background: #fff; border: 1px solid var(--rv-border);
  border-radius: 18px; box-shadow: var(--rv-shadow); overflow: hidden;
}
.rv-form-card { position: sticky; top: 84px; }
.rv-card-head {
  padding: 14px 18px; background: var(--rv-cream-2);
  border-bottom: 1px solid var(--rv-border); color: var(--rv-ink);
}
.rv-card-body { padding: 18px; }

/* Form controls */
.rv-label { font-size: .8rem; font-weight: 600; color: var(--rv-body); margin-bottom: 5px; display: block; }
.rv-req { color: #C0392B; }
.rv-input {
  border: 1px solid var(--rv-border); border-radius: 10px; background: var(--rv-cream);
  font-size: .88rem;
}
.rv-input:focus {
  border-color: var(--rv-green); box-shadow: 0 0 0 3px rgba(37, 47, 23, 0.12); background: #fff;
}
.rv-hint { color: var(--rv-muted); font-size: .72rem; display: block; margin-top: 4px; }

/* Star input */
.rv-star-input { display: flex; align-items: center; gap: 4px; }
.rv-star-btn { border: 0; background: transparent; padding: 0; cursor: pointer; line-height: 0; }
.rv-star-btn svg { fill: #E4D4C2; transition: fill .12s ease, transform .12s ease; }
.rv-star-btn.is-on svg { fill: var(--rv-star); }
.rv-star-btn:hover svg { transform: scale(1.12); }
.rv-star-caption { margin-left: 8px; font-size: .8rem; color: var(--rv-muted); font-weight: 600; }

/* Toggle switch */
.rv-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; margin: 0; height: 38px; }
.rv-switch input { display: none; }
.rv-switch-track {
  width: 40px; height: 22px; border-radius: 999px; background: #D9C7B2; position: relative; transition: background .2s;
}
.rv-switch-track::after {
  content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
  background: #fff; border-radius: 50%; transition: transform .2s;
}
.rv-switch input:checked + .rv-switch-track { background: var(--rv-green); }
.rv-switch input:checked + .rv-switch-track::after { transform: translateX(18px); }
.rv-switch-label { font-size: .82rem; font-weight: 600; color: var(--rv-body); }

/* Upload */
.rv-upload { display: flex; align-items: center; gap: 12px; }
.rv-upload-preview { width: 56px; height: 56px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid var(--rv-border); }
.rv-upload-preview img { width: 100%; height: 100%; object-fit: cover; }
.rv-upload-fallback {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  background: var(--rv-cream-2); color: var(--rv-green); font-weight: 700; font-size: 1.2rem;
}

/* Buttons */
.rv-btn-primary {
  background: var(--rv-green); color: #fff; border: 0; border-radius: 10px;
  font-weight: 600; font-size: .88rem; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.rv-btn-primary:hover { background: var(--rv-green-dark); color: #fff; }
.rv-btn-ghost {
  background: #fff; color: var(--rv-body); border: 1px solid var(--rv-border); border-radius: 10px; font-weight: 600; font-size: .88rem;
}
.rv-btn-ghost:hover { background: var(--rv-cream); }

/* Review grid */
.rv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.rv-review-card {
  background: #fff; border: 1px solid var(--rv-border); border-radius: 16px; padding: 16px;
  display: flex; flex-direction: column; transition: border-color .15s, box-shadow .15s, transform .15s;
}
.rv-review-card:hover { border-color: var(--rv-border-strong); box-shadow: var(--rv-shadow); transform: translateY(-2px); }
.rv-review-card.is-hidden { background: #FBF6EF; opacity: .82; }
.rv-review-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.rv-avatar {
  width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  background: var(--rv-green); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;
}
.rv-avatar img { width: 100%; height: 100%; object-fit: cover; }
.rv-review-id { flex-grow: 1; min-width: 0; }
.rv-review-name { font-weight: 700; color: var(--rv-ink); font-size: .92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rv-review-city { font-size: .76rem; color: var(--rv-muted); }
.rv-badge { font-size: .66rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; padding: 3px 8px; border-radius: 999px; }
.rv-badge.is-active { background: #E4F2E4; color: #1A2110; }
.rv-badge.is-hidden { background: #EDE6DC; color: #8A7660; }
.rv-badge.is-pending { background: #FFF0D3; color: #B9770E; }
.rv-review-card.is-pending { border-left: 3px solid var(--rv-star); }

/* Product chip + photo thumbs (product reviews tab) */
.rv-product-chip {
  display: inline-flex; align-items: center; gap: 5px; max-width: 100%;
  background: var(--rv-cream-2); color: var(--rv-muted); border-radius: 8px;
  padding: 4px 8px; font-size: .72rem; font-weight: 600; margin-bottom: 8px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rv-thumbs { display: flex; gap: 6px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
.rv-thumbs img { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; border: 1px solid var(--rv-border); }
.rv-thumb-more { font-size: .72rem; font-weight: 700; color: var(--rv-muted); }
.rv-review-date { font-size: .7rem; color: var(--rv-muted); margin-right: auto; }
.rv-review-stars { display: flex; gap: 2px; margin-bottom: 8px; }
.rv-review-stars svg { fill: #E4D4C2; }
.rv-review-stars svg.on { fill: var(--rv-star); }
.rv-review-text {
  color: var(--rv-body); font-size: .86rem; line-height: 1.5; margin-bottom: 12px; flex-grow: 1;
  display: -webkit-box; -webkit-line-clamp: 4; line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
}
.rv-review-actions { display: flex; gap: 8px; justify-content: flex-end; border-top: 1px dashed var(--rv-border); padding-top: 10px; }
.rv-icon-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--rv-border);
  background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
}
.rv-icon-btn.is-edit { color: var(--rv-green); }
.rv-icon-btn.is-edit:hover { background: var(--rv-green); color: #fff; border-color: var(--rv-green); }
.rv-icon-btn.is-del { color: #C0392B; }
.rv-icon-btn.is-del:hover { background: #C0392B; color: #fff; border-color: #C0392B; }

/* Empty state */
.rv-empty {
  background: #fff; border: 1px dashed var(--rv-border-strong); border-radius: 18px;
  padding: 48px 24px; text-align: center; color: var(--rv-muted);
}
.rv-empty svg { color: var(--rv-border-strong); }
.rv-empty h6 { color: var(--rv-ink); }

@media (max-width: 991px) {
  .rv-form-card { position: static; }
}
</style>
