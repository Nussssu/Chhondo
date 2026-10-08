<template>
  <AdminLayout>
    <div class="page-content homepage-reviews-page">
      <PageHeader title="Reviews" subtitle="Manage homepage testimonials and product reviews from one place">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm add-review-btn" @click="openCreate"><Plus :size="15" /> Add homepage review</button>
        </template>
      </PageHeader>

      <div class="review-summary">
        <article class="summary-card"><span class="summary-icon is-total"><MessageSquareText :size="18" /></span><div><strong>{{ summary.total }}</strong><span>Total Reviews</span></div></article>
        <article class="summary-card"><span class="summary-icon is-published"><CircleCheck :size="18" /></span><div><strong>{{ summary.published }}</strong><span>Published</span></div></article>
        <article class="summary-card"><span class="summary-icon is-hidden"><EyeOff :size="18" /></span><div><strong>{{ summary.pending }}</strong><span>Hidden / Pending</span></div></article>
        <article class="summary-card"><span class="summary-icon is-rating"><Star :size="18" /></span><div><strong>{{ Number(summary.average || 0).toFixed(1) }}</strong><span>Average Rating</span></div></article>
      </div>

      <div class="card">
        <div class="card-body reviews-card-body">
          <Toolbar
            v-model="search"
            search-placeholder="Search reviewer, city or review…"
            search-on-enter
            :per-page="pagination"
            :per-page-options="[10, 20, 50, 100]"
            @search="applyFilters"
            @update:per-page="pagination = $event; applyFilters()"
          >
            <template #filters>
              <select v-model="type" class="form-select form-select-sm" aria-label="Review type" @change="applyFilters">
                <option value="">All review types</option><option value="homepage">Homepage</option><option value="product">Product</option>
              </select>
              <select v-model="status" class="form-select form-select-sm" aria-label="Review status" @change="applyFilters">
                <option value="">All statuses</option><option value="published">Published</option><option value="pending">Hidden / Pending</option><option value="featured">Featured</option>
              </select>
              <select v-model="rating" class="form-select form-select-sm rating-filter" aria-label="Rating" @change="applyFilters">
                <option value="">All ratings</option><option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }} stars</option>
              </select>
              <div class="date-range">
                <input v-model="dateFrom" type="date" class="form-control form-control-sm" aria-label="Reviews from date" :max="dateTo || undefined" />
                <span>to</span>
                <input v-model="dateTo" type="date" class="form-control form-control-sm" aria-label="Reviews to date" :min="dateFrom || undefined" />
                <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="applyFilters">Apply</button>
                <button v-if="dateFrom || dateTo" type="button" class="date-clear" title="Clear date range" @click="clearDates"><X :size="14" /></button>
              </div>
            </template>
          </Toolbar>

          <DataTable :columns="columns" :rows="reviews.data ?? []" empty-title="No reviews found" empty-message="Reviews and homepage testimonials will appear here.">
            <template #cell-context="{ row }">
              <div class="context-cell" :class="`is-${row.review_type}`">
                <img v-if="row.product_image" :src="asset(row.product_image)" :alt="row.product_name || ''" />
                <span v-else class="context-icon"><Home :size="14" /></span>
                <div><strong>{{ row.review_type === 'product' ? row.product_name : 'Homepage' }}</strong><span>{{ row.review_type === 'product' ? 'Product review' : 'Testimonial' }}</span></div>
              </div>
            </template>
            <template #cell-reviewer="{ row }">
              <div class="reviewer-cell">
                <span class="reviewer-avatar"><img v-if="row.image" :src="asset(row.image)" :alt="row.name" /><template v-else>{{ (row.name || '?').charAt(0).toUpperCase() }}</template></span>
                <div><strong>{{ row.name }}</strong><span>{{ row.city || 'No city' }}</span></div>
              </div>
            </template>
            <template #cell-rating="{ row }">
              <div class="stars" :aria-label="`${row.rating} out of 5 stars`"><Star v-for="n in 5" :key="n" :size="13" :class="{ 'is-on': n <= row.rating }" /><span>{{ row.rating }}.0</span></div>
            </template>
            <template #cell-review="{ row }">
              <div class="review-copy"><p class="review-text" :title="row.review">{{ row.review }}</p><span v-if="row.admin_reply"><MessageSquareReply :size="11" /> Replied</span></div>
            </template>
            <template #cell-status="{ row }">
              <div class="status-stack"><span class="review-status" :class="row.is_active ? 'is-published' : 'is-hidden'">{{ row.is_active ? 'Published' : (row.review_type === 'product' ? 'Pending' : 'Hidden') }}</span><span v-if="row.is_featured" class="featured-label"><Star :size="10" /> Featured</span></div>
            </template>
            <template #cell-created_at="{ row }"><span class="review-date">{{ formatDate(row.created_at) }}</span></template>
            <template #actions="{ row }">
              <button type="button" class="table-icon-btn" :title="row.is_active ? 'Hide review' : 'Publish review'" @click="toggleStatus(row)"><EyeOff v-if="row.is_active" :size="14" /><Eye v-else :size="14" /></button>
              <button v-if="row.review_type === 'product'" type="button" class="table-icon-btn" :class="{ 'is-featured': row.is_featured }" :title="row.is_featured ? 'Unfeature review' : 'Feature review'" @click="toggleFeatured(row)"><Star :size="14" /></button>
              <button v-if="row.review_type === 'product'" type="button" class="table-icon-btn" :class="{ 'has-reply': row.admin_reply }" title="Reply / comment" @click="replyingReview = row"><MessageSquareReply :size="14" /></button>
              <button type="button" class="table-icon-btn is-primary" title="Edit review" @click="openEdit(row)"><Pencil :size="14" /></button>
              <button type="button" class="table-icon-btn is-danger" title="Delete review" @click="destroyReview(row)"><Trash2 :size="14" /></button>
            </template>
          </DataTable>
          <Pagination :paginator="reviews" :only="['reviews', 'summary']" />
        </div>
      </div>
    </div>
    <HomepageReviewModal v-if="modalOpen && editingReview?.review_type !== 'product'" :review="editingReview" @close="closeModal" />
    <ProductReviewModal v-if="modalOpen && editingReview?.review_type === 'product'" :open="true" :review="editingReview" @close="closeModal" />
    <ReviewReplyModal v-if="replyingReview" :review="replyingReview" @close="replyingReview = null" />
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import Toolbar from '@/components/Admin/Toolbar.vue'
import DataTable from '@/components/Admin/DataTable.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import HomepageReviewModal from './Partials/HomepageReviewModal.vue'
import ProductReviewModal from './Partials/ProductReviewModal.vue'
import ReviewReplyModal from '@/Pages/Admin/ProductReviews/Partials/ReviewReplyModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { asset, formatDate } from '@/utils/orderFormatting'
import { CircleCheck, Eye, EyeOff, Home, MessageSquareReply, MessageSquareText, Pencil, Plus, Star, Trash2, X } from 'lucide-vue-next'

const props = defineProps({
  reviews: { type: Object, required: true },
  summary: { type: Object, default: () => ({ total: 0, published: 0, pending: 0, average: 0 }) },
})
const initial = new URLSearchParams(window.location.search)
const search = ref(initial.get('search') ?? '')
const type = ref(initial.get('type') ?? '')
const status = ref(initial.get('status') ?? '')
const rating = ref(initial.get('rating') ?? '')
const dateFrom = ref(initial.get('date_from') ?? '')
const dateTo = ref(initial.get('date_to') ?? '')
const pagination = ref(initial.get('pagination') ?? '20')
const modalOpen = ref(false)
const editingReview = ref(null)
const replyingReview = ref(null)
const columns = [
  { key: 'context', label: 'Type / Product', width: '18%' },
  { key: 'reviewer', label: 'Reviewer', width: '16%' },
  { key: 'rating', label: 'Rating', width: '105px' },
  { key: 'review', label: 'Review' },
  { key: 'status', label: 'Status', width: '105px' },
  { key: 'created_at', label: 'Date', width: '96px' },
]
function applyFilters() {
  const params = { search: search.value, type: type.value, status: status.value, rating: rating.value, date_from: dateFrom.value, date_to: dateTo.value, pagination: pagination.value }
  Object.keys(params).forEach((key) => { if (!params[key]) delete params[key] })
  router.get(route('admin.pages.reviews.index'), params, { preserveState: true, replace: true })
}
function clearDates() { dateFrom.value = ''; dateTo.value = ''; applyFilters() }
function openCreate() { editingReview.value = null; modalOpen.value = true }
function openEdit(review) { editingReview.value = review; modalOpen.value = true }
function closeModal() { modalOpen.value = false; editingReview.value = null }
function toggleStatus(review) {
  const target = review.review_type === 'product' ? 'admin.product-reviews.status' : 'admin.pages.reviews.status'
  router.patch(route(target, review.id), { is_active: !review.is_active }, { preserveScroll: true, only: ['reviews', 'summary', 'flash'] })
}
function toggleFeatured(review) {
  router.patch(route('admin.product-reviews.featured', review.id), { is_featured: !review.is_featured }, { preserveScroll: true, only: ['reviews', 'summary', 'flash'] })
}
async function destroyReview(review) {
  const confirmed = await confirmDelete({ title: 'Delete this review?', text: 'This review and any uploaded photos will be permanently removed.', confirmButtonText: 'Delete review' })
  if (!confirmed) return
  const target = review.review_type === 'product' ? 'admin.pages.reviews.product.destroy' : 'admin.pages.reviews.destroy'
  router.delete(route(target, review.id), { preserveScroll: true })
}
</script>

<style scoped>
.homepage-reviews-page { min-width: 0; }
.add-review-btn { display: inline-flex; align-items: center; gap: 5px; }
.review-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.summary-card { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--surface); box-shadow: var(--el-1); }
.summary-icon { width: 38px; height: 38px; flex: 0 0 38px; display: grid; place-items: center; border-radius: 10px; }
.summary-icon.is-total { background: #eef2e9; color: var(--admin-green-700); }
.summary-icon.is-published { background: #dcfce7; color: #15803d; }
.summary-icon.is-hidden { background: #f1f5f9; color: #64748b; }
.summary-icon.is-rating { background: #fff7df; color: #d18a00; }
.summary-card div { min-width: 0; display: grid; }
.summary-card strong { color: var(--text); font-size: 20px; line-height: 1.15; font-variant-numeric: tabular-nums; }
.summary-card span:last-child { overflow: hidden; color: var(--text-muted); font-size: 11px; white-space: nowrap; text-overflow: ellipsis; }
.reviews-card-body { padding: 12px; }
.rating-filter { min-width: 116px !important; }
.date-range { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.date-range > span { color: var(--text-muted); font-size: 11px; }
.date-range .form-control { width: 132px !important; min-width: 132px !important; }
.date-clear { width: 28px; height: 28px; display: grid; place-items: center; padding: 0; border: 0; border-radius: var(--r-sm); background: none; color: var(--text-muted); }
.date-clear:hover { background: var(--surface-sunk); color: var(--text); }
.homepage-reviews-page :deep(.dt-table) { width: 100%; table-layout: fixed; }
.homepage-reviews-page :deep(.dt-table th), .homepage-reviews-page :deep(.dt-table td) { padding: 8px; }
.homepage-reviews-page :deep(.dt-actions-col) { width: 138px; }
.homepage-reviews-page :deep(.dt-actions) { flex-wrap: nowrap; gap: 2px; }
.context-cell { display: flex; align-items: center; gap: 8px; min-width: 0; }
.context-cell img, .context-icon { width: 32px; height: 32px; flex: 0 0 32px; border-radius: 6px; }
.context-cell img { object-fit: cover; background: var(--surface-sunk); }
.context-icon { display: grid; place-items: center; background: var(--accent-soft, #e6efdd); color: var(--admin-green-700); }
.context-cell div { display: grid; min-width: 0; }
.context-cell strong, .context-cell span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.context-cell strong { color: var(--text); font-size: 11.5px; }
.context-cell div span { color: var(--text-muted); font-size: 10px; }
.reviewer-cell { display: flex; align-items: center; gap: 8px; min-width: 0; }
.reviewer-avatar { width: 32px; height: 32px; flex: 0 0 32px; display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: var(--accent-soft, #e6efdd); color: var(--admin-green-700); font-size: 11px; font-weight: 700; }
.reviewer-avatar img { width: 100%; height: 100%; object-fit: cover; }
.reviewer-cell div { display: grid; min-width: 0; }
.reviewer-cell strong, .reviewer-cell div span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.reviewer-cell strong { color: var(--text); font-size: 11.5px; }
.reviewer-cell div span { color: var(--text-muted); font-size: 10.5px; }
.stars { display: flex; align-items: center; gap: 1px; color: #d6d3cd; white-space: nowrap; }
.stars svg.is-on { color: #e9a30c; fill: currentColor; }
.stars span { margin-left: 3px; color: var(--text-muted); font-size: 10px; }
.review-text { display: -webkit-box; overflow: hidden; margin: 0; color: var(--text); font-size: 11.5px; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
.review-copy { min-width: 0; }
.review-copy > span { display: inline-flex; align-items: center; gap: 3px; margin-top: 3px; color: var(--admin-green-600); font-size: 10px; font-weight: 600; }
.status-stack { display: grid; justify-items: start; gap: 4px; }
.review-status { display: inline-block; padding: 3px 8px; border-radius: var(--r-full); font-size: 10px; font-weight: 700; }
.review-status.is-published { background: #dcfce7; color: #15803d; }
.review-status.is-hidden { background: #f1f5f9; color: #64748b; }
.featured-label { display: inline-flex; align-items: center; gap: 3px; color: #a16207; font-size: 9.5px; font-weight: 700; }
.featured-label svg { fill: currentColor; }
.table-icon-btn.is-featured { color: #d18a00; background: #fff7df; }
.table-icon-btn.is-featured svg { fill: currentColor; }
.table-icon-btn.has-reply { color: var(--admin-green-600); background: var(--accent-soft, #e6efdd); }
.sort-order { display: block; color: var(--text-muted); font-size: 11px; text-align: center; font-variant-numeric: tabular-nums; }
.review-date { color: var(--text-muted); font-size: 10.5px; white-space: nowrap; }
@media (max-width: 1100px) { .review-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } .homepage-reviews-page :deep(.dt-table th), .homepage-reviews-page :deep(.dt-table td) { padding-left: 6px; padding-right: 6px; } }
@media (max-width: 767px) { .review-summary { grid-template-columns: 1fr; } .date-range { flex-wrap: wrap; width: 100%; } .date-range .form-control { flex: 1 1 135px; width: auto !important; } .homepage-reviews-page :deep(.dt-actions-col) { width: 100%; } }
</style>
