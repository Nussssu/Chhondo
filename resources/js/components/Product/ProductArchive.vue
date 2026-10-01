<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue"
import { router } from "@inertiajs/vue3"
import { ChevronDown, SlidersHorizontal, X } from "lucide-vue-next"
import CollectionCard from "@/components/Product/CollectionCard.vue"
import ProductPreviewModal from "@/components/Product/ProductPreviewModel.vue"

/**
 * Shared product-archive layout used by every shop archive page
 * (the /shop page and /product-category/{slug} pages) so they share
 * one design: content header, breadcrumb + sort row, a sidebar with
 * price / category / attribute filters, and a grid of product cards.
 *
 * This component is presentational: it owns the filter UI state and
 * emits intent. The parent page performs the actual Inertia navigation
 * (the URL differs between shop and category archives).
 */
const props = defineProps({
  title:            { type: String, default: "" },
  description:      { type: String, default: "" },
  breadcrumbs:      { type: Array,  default: () => [] }, // [{ label, href }]
  products:         { type: Array,  default: () => [] },
  loading:          { type: Boolean, default: false },
  currentPage:      { type: Number, default: 1 },
  lastPage:         { type: Number, default: 1 },
  total:            { type: Number, default: 0 },
  categories:       { type: Array,  default: () => [] }, // [{ id, name, slug }]
  attributes:       { type: Array,  default: () => [] }, // [{ name, values: [] }]
  activeCategorySlug: { type: String, default: null },
  initialFilters:   { type: Object, default: () => ({}) },
})

const emit = defineEmits(["filter-change", "page-change"])

const MIN_PRICE = 0
const MAX_PRICE = 5000
const MIN_GAP = 100

const filters = reactive({
  min_price:  Number(props.initialFilters.min_price ?? MIN_PRICE),
  max_price:  Number(props.initialFilters.max_price ?? MAX_PRICE),
  sort:       props.initialFilters.sort || "",
  attributes: { ...(props.initialFilters.attributes || {}) },
})

let oldMinPrice = filters.min_price

const emitChange = () => {
  emit("filter-change", {
    min_price:  filters.min_price,
    max_price:  filters.max_price,
    sort:       filters.sort,
    attributes: filters.attributes,
  })
}

/* ---- Price slider ---- */
const updatePrice = () => {
  filters.min_price = Number(filters.min_price)
  filters.max_price = Number(filters.max_price)
  if (filters.max_price - filters.min_price < MIN_GAP) {
    if (filters.min_price === oldMinPrice) {
      filters.min_price = Math.max(MIN_PRICE, filters.max_price - MIN_GAP)
    } else {
      filters.max_price = Math.min(MAX_PRICE, filters.min_price + MIN_GAP)
    }
  }
  oldMinPrice = filters.min_price
  emitChange()
}

const priceTrackStyle = computed(() => ({
  left:  `${((filters.min_price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
  right: `${100 - ((filters.max_price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
}))

/* ---- Category selector (navigates to the category archive) ---- */
const goToCategory = (category) => {
  if (props.activeCategorySlug === category.slug) return
  router.visit(`/product-category/${category.slug}`)
}

/* ---- Attribute filter ---- */
const isAttributeChecked = (name, value) =>
  Array.isArray(filters.attributes[name]) && filters.attributes[name].includes(value)

const updateAttribute = (name, value, checked) => {
  if (!Array.isArray(filters.attributes[name])) filters.attributes[name] = []
  if (checked) {
    if (!filters.attributes[name].includes(value)) filters.attributes[name].push(value)
  } else {
    filters.attributes[name] = filters.attributes[name].filter((v) => v !== value)
  }
  emitChange()
}

/* ---- Sort dropdown ---- */
const sortOpen = ref(false)
const sortOptions = [
  { value: "", label: "Newest" },
  { value: "low_to_high", label: "Price: (Low to High)" },
  { value: "high_to_low", label: "Price: (High to Low)" },
]
const currentSortLabel = computed(
  () => sortOptions.find((o) => o.value === filters.sort)?.label || "Newest"
)
const updateSort = (value) => {
  filters.sort = value
  sortOpen.value = false
  emitChange()
}

const sortRef = ref(null)
const handleClickOutside = (e) => {
  if (sortRef.value && !sortRef.value.contains(e.target)) sortOpen.value = false
}

/* ---- Mobile sidebar ---- */
const showSidebar = ref(false)
const toggleSidebar = () => { showSidebar.value = !showSidebar.value }

onMounted(() => document.addEventListener("click", handleClickOutside))
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside))

/* ---- Pagination ---- */
const visiblePages = computed(() => {
  const total = props.lastPage
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("...")
  pages.push(total)
  return pages
})
const goToPage = (page) => {
  if (page < 1 || page > props.lastPage || page === props.currentPage) return
  emit("page-change", page)
}

/* ---- Quick preview modal ---- */
const isModalOpen = ref(false)
const selectedProduct = ref(null)
const openPreview = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}
</script>

<template>
  <div class="archive">
    <ProductPreviewModal :isOpen="isModalOpen" :product="selectedProduct" @close="isModalOpen = false" />

    <!-- Page Header -->
    <div class="archive-header">
      <div class="container text-center">
        <h1 class="archive-title mb-4">{{ title }}</h1>
        <p v-if="description" class="archive-description">{{ description }}</p>
      </div>
    </div>

    <!-- Archive Body -->
    <div class="archive-body">
      <div class="container">
        <div class="py-8">
          <!-- Breadcrumb & Sort Row -->
          <div class="archive-toolbar flex items-center justify-between gap-4 flex-wrap">
            <nav class="flex items-center gap-2 md:gap-3 flex-wrap" aria-label="Breadcrumb">
              <template v-for="(crumb, i) in breadcrumbs" :key="i">
                <a
                  v-if="crumb.href && i < breadcrumbs.length - 1"
                  :href="crumb.href"
                  class="breadcrumb-link"
                >{{ crumb.label }}</a>
                <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
                <svg v-if="i < breadcrumbs.length - 1" class="breadcrumb-sep" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </template>
            </nav>

            <div class="flex items-center gap-4">
              <!-- Mobile Filter Toggle -->
              <button class="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-800" @click="toggleSidebar">
                <SlidersHorizontal class="w-5 h-5" />
                <span class="body-1-sb">Filters</span>
              </button>

              <div ref="sortRef" class="relative">
                  <button @click="sortOpen = !sortOpen" class="sort-trigger">
                    <span class="sort-trigger-label">Sort By:</span>
                    <span class="sort-trigger-value">{{ currentSortLabel }}</span>
                    <ChevronDown class="w-4 h-4 text-gray-500 transition-transform shrink-0" :class="{ 'rotate-180': sortOpen }" />
                  </button>
                  <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                    <div v-if="sortOpen" class="sort-dropdown">
                      <button
                        v-for="opt in sortOptions"
                        :key="opt.value"
                        @click="updateSort(opt.value)"
                        class="sort-option body-1-r"
                        :class="{ 'sort-option--active': filters.sort === opt.value }"
                      >{{ opt.label }}</button>
                    </div>
                  </Transition>
              </div>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 lg:gap-5">
            <!-- Mobile Overlay -->
            <div v-if="showSidebar" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="toggleSidebar"></div>

            <!-- Sidebar Filters -->
            <aside class="filter-sidebar" :class="{ 'is-open': showSidebar }">
              <div class="filter-sticky">
              <div class="flex items-center justify-between lg:hidden mb-6">
                <h2 class="text-lg font-semibold text-gray-800">Filters</h2>
                <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-800"><X class="w-5 h-5" /></button>
              </div>

              <!-- Price Filter -->
              <div class="filter-item">
                <h3 class="filter-heading">FILTER BY PRICE</h3>
                <div class="price-box">
                  <div class="relative w-full pt-1">
                    <div class="absolute w-full h-[3px] bg-gray-200 rounded"></div>
                    <div class="absolute h-[3px] bg-[#1a1a1a] rounded" :style="priceTrackStyle"></div>
                    <input type="range" v-model="filters.min_price" :min="MIN_PRICE" :max="MAX_PRICE" class="price-range" @change="updatePrice" />
                    <input type="range" v-model="filters.max_price" :min="MIN_PRICE" :max="MAX_PRICE" class="price-range" @change="updatePrice" />
                  </div>
                  <div class="price-caption">
                    Price: {{ filters.min_price }}৳ — {{ filters.max_price }}৳
                  </div>
                </div>
              </div>

              <!-- Category Filter -->
              <div class="filter-item">
                <h3 class="filter-heading">PRODUCT CATEGORIES</h3>
                <div class="category-box">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    type="button"
                    @click="goToCategory(category)"
                    class="category-row"
                    :class="{ 'is-active': activeCategorySlug === category.slug }"
                  >{{ category.name }}</button>
                </div>
              </div>

              <!-- Attribute Filter -->
              <div class="filter-item !border-b-0 !pb-0">
                <h3 class="filter-heading">PRODUCT ATTRIBUTES</h3>
                <div v-if="attributes.length === 0" class="body-1-r text-gray-400">No attributes available.</div>
                <div v-else>
                  <div v-for="(attribute, index) in attributes" :key="index" class="mb-4">
                    <h4 class="body-1-sb text-gray-700 mb-2">{{ attribute.name }}</h4>
                    <ul>
                      <li v-for="(value, i) in attribute.values" :key="i" class="py-0.5">
                        <label class="cursor-pointer body-1-r text-gray-500 hover:text-gray-700 flex items-center gap-2">
                          <input
                            class="shop-checkbox"
                            type="checkbox"
                            :value="value"
                            :checked="isAttributeChecked(attribute.name, value)"
                            @change="updateAttribute(attribute.name, value, $event.target.checked)"
                          />
                          {{ value }}
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            </aside>

            <!-- Product Grid -->
            <main class="flex-1 min-w-0">
              <!-- Skeleton Loading -->
              <div v-if="loading && products.length === 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <div v-for="n in 6" :key="n" class="skeleton-card">
                  <div class="skeleton-image animate-pulse"></div>
                  <div class="skeleton-info">
                    <div class="skeleton-line w-3/4 animate-pulse"></div>
                    <div class="skeleton-line w-1/2 animate-pulse mt-2"></div>
                  </div>
                  <div class="skeleton-btn animate-pulse"></div>
                </div>
              </div>

              <div v-else-if="products.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <CollectionCard
                  v-for="product in products"
                  :key="product.id"
                  :product="product"
                  :openPreview="openPreview"
                />
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-16">
                <h3 class="text-2xl font-semibold text-gray-500">No products found</h3>
                <p class="text-gray-400 mt-2">Try adjusting your filters.</p>
              </div>

              <!-- Pagination -->
              <nav v-if="!loading && lastPage > 1" class="pagination-wrap" aria-label="Pagination">
                <button class="pagination-arrow" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" aria-label="Previous page">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <template v-for="(p, idx) in visiblePages" :key="idx">
                  <span v-if="p === '...'" class="pagination-ellipsis">…</span>
                  <button v-else class="pagination-page" :class="{ 'is-active': p === currentPage }" @click="goToPage(p)" :aria-current="p === currentPage ? 'page' : undefined">{{ p }}</button>
                </template>
                <button class="pagination-arrow" :disabled="currentPage === lastPage" @click="goToPage(currentPage + 1)" aria-label="Next page">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </nav>

              <p v-if="!loading && total > 0" class="pagination-info">
                Showing page {{ currentPage }} of {{ lastPage }} · {{ total }} products
              </p>
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive { background-color: #FFFAF4; }

/* ===== PAGE HEADER ===== */
/* Figma: title Poppins SB 56/68 Black/700, gap 24, subtitle 16/24 Black/500 */
.archive-header { padding: 56px 0 44px; }
.archive-title {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: #3c3834;
  margin-bottom: 16px;
}
.archive-description {
  max-width: 640px;
  margin: 0 auto;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6d6560;
}
@media (min-width: 768px) {
  .archive-title {
    font-size: 56px;
    line-height: 68px;
    margin-bottom: 24px;
  }
}

/* ===== TOOLBAR (breadcrumb + sort row) ===== */
.archive-toolbar {
  padding-bottom: 24px;
  border-bottom: 1px solid #f7e2cb;
  margin-bottom: 40px;
}
@media (min-width: 768px) {
  .archive-toolbar { margin-bottom: 48px; }
}

/* ===== BREADCRUMB ===== */
/* Figma: Hind Siliguri 20/28, gap 12, links Black/500, current Black/900 */
.breadcrumb-link,
.breadcrumb-current {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}
.breadcrumb-link {
  color: #6d6560;
  transition: color 0.2s ease;
}
.breadcrumb-link:hover { color: #356019; }
.breadcrumb-current { color: #1a1817; }
.breadcrumb-sep { color: #9c9591; }
@media (min-width: 768px) {
  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 20px;
    line-height: 28px;
  }
}

/* ===== SORT DROPDOWN ===== */
/* Figma: 306x48, transparent bg, Warm/300 border, r8, px24 py12,
   label Poppins SB 16 Black/900, value Poppins R 16 Black/600 */
.sort-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: transparent;
  border: 1px solid #f7e2cb;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  white-space: nowrap;
}
@media (min-width: 768px) {
  .sort-trigger {
    min-width: 306px;
    gap: 16px;
    padding: 12px 24px;
  }
}
.sort-trigger:hover { border-color: #e9c39c; }
.sort-trigger-label {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
}
.sort-trigger-value {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 14px;
  line-height: 24px;
  color: #4d4944;
  flex: 1;
  text-align: left;
}
@media (min-width: 768px) {
  .sort-trigger-label,
  .sort-trigger-value { font-size: 16px; }
}
.sort-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 100%;
  background-color: #fff;
  border: 1px solid #f7e2cb;
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.sort-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  color: #374151;
  cursor: pointer;
  background-color: #fff;
  border: none;
  transition: background-color 0.15s ease;
}
.sort-option:hover { background-color: #f8f4ec; }
.sort-option--active { background-color: #f8f4ec; font-weight: 600; }

/* ===== FILTER SIDEBAR ===== */
/* Figma: 310 wide, Warm/100 bg, Warm/300 border, r16, p20 */
.filter-sidebar {
  width: 100%;
  flex-shrink: 0;
  background-color: #FFF6EA;
  border: 1px solid #f7e2cb;
  padding: 24px 20px;
}
@media (min-width: 1024px) {
  /* The card background stretches the full height of the products section;
     the filter content inside sticks while scrolling. */
  .filter-sidebar {
    width: 310px;
    display: block !important;
    position: static;
    transform: none;
    border-radius: 16px;
  }

  .filter-sticky {
    position: sticky;
    top: 24px;
  }
}

/* Below the sticky site header (sticky only at ≥1280px, ~88px tall) */
@media (min-width: 1280px) {
  .filter-sticky {
    top: 112px;
  }
}
@media (max-width: 1023px) {
  .filter-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 300px;
    max-width: 85%;
    z-index: 50;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  .filter-sidebar.is-open { transform: translateX(0); }
}

.filter-item {
  margin-bottom: 28px;
}
.filter-item:last-child { margin-bottom: 0; }
.filter-heading {
  font-family: 'Poppins', 'Hind Siliguri', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #3c3834;
  margin-bottom: 16px;
}

/* White inner boxes (price + categories) — Figma: white, r8, Warm/200 border */
.price-box {
  background-color: #fff;
  border: 1px solid #fff0df;
  border-radius: 8px;
  padding: 18px 12px 10px;
}
.price-caption {
  margin-top: 14px;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 12px;
  color: #6d6560;
}

.category-box {
  background-color: #fff;
  border: 1px solid #fff0df;
  border-radius: 8px;
  overflow: hidden;
}
.category-row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 17px 19px;
  background: transparent;
  border: none;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #1a1817;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.category-row + .category-row { border-top: 1px solid #f3ede3; }
.category-row:hover { color: #356019; background-color: #fdfaf5; }
.category-row.is-active { color: #356019; font-weight: 600; }

/* Range slider */
.price-range {
  position: absolute;
  width: 100%;
  height: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
}
.price-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #1a1a1a;
  cursor: pointer;
}
.price-range::-moz-range-thumb {
  pointer-events: auto;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #1a1a1a;
  cursor: pointer;
  border: none;
}
.price-range:nth-of-type(2) { z-index: 2; }

/* Checkbox */
.shop-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #356019;
  border-radius: 3px;
  cursor: pointer;
}

/* ===== SKELETON LOADING ===== */
.skeleton-card {
  background-color: #fff0df;
  border: 1px solid #f7e2cb;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) { .skeleton-card { padding: 20px; } }
.skeleton-image { aspect-ratio: 377 / 468; border-radius: 8px; background-color: #f0ece6; }
.skeleton-info { padding: 12px 4px 0; flex-grow: 1; }
.skeleton-line { height: 14px; border-radius: 6px; background-color: #f0ece6; }
.skeleton-btn { margin: 12px 4px 0; height: 44px; border-radius: 10px; background-color: #f0ece6; }

/* ===== PAGINATION ===== */
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 40px;
}
.pagination-page,
.pagination-arrow {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fff0df;
  border: 1px solid #f7e2cb;
  border-radius: 10px;
  color: #5a3a1a;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.pagination-page:hover:not(.is-active),
.pagination-arrow:hover:not(:disabled) {
  background-color: #fbe2c4;
  border-color: #E9C39C;
}
.pagination-page.is-active {
  background-color: #356019;
  border-color: #356019;
  color: #fff;
  cursor: default;
}
.pagination-arrow:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 40px;
  color: #9a7a52;
  font-weight: 600;
  user-select: none;
}
.pagination-info {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #8c7256;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
}
@media (min-width: 768px) {
  .pagination-wrap { gap: 8px; margin-top: 56px; }
  .pagination-page,
  .pagination-arrow { min-width: 44px; height: 44px; font-size: 16px; }
}
</style>
