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
  { value: "", label: "নতুন সংযোজন" },
  { value: "low_to_high", label: "দাম (কম থেকে বেশি)" },
  { value: "high_to_low", label: "দাম (বেশি থেকে কম)" },
]
const currentSortLabel = computed(
  () => sortOptions.find((o) => o.value === filters.sort)?.label || sortOptions[0].label
)

/* ---- Figma copy helpers ---- */
const bnDigits = (value) => String(value).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])

// The closing word of the title in gold ("আমাদের সুতি শাড়ির <gold>কালেকশন</gold>").
const titleParts = computed(() => {
  const words = (props.title || "").trim().split(/\s+/)
  return { lead: words.slice(0, -1).join(" "), accent: words.at(-1) || "" }
})
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
  if (props.loading || page < 1 || page > props.lastPage || page === props.currentPage) return
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
        <h1 class="archive-title">{{ titleParts.lead ? `${titleParts.lead} ` : "" }}<span class="archive-accent">{{ titleParts.accent }}</span></h1>
        <p v-if="description" class="archive-description">{{ description }}</p>
      </div>
    </div>

    <!-- Archive Body -->
    <div class="archive-body">
      <div class="container">
        <div class="archive-inner">
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
                <svg v-if="i < breadcrumbs.length - 1" class="breadcrumb-sep" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
              </template>
            </nav>

            <div class="flex items-center gap-4">
              <!-- Mobile Filter Toggle -->
              <button class="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-800" @click="toggleSidebar">
                <SlidersHorizontal class="w-5 h-5" />
                <span class="body-1-sb">ফিল্টার</span>
              </button>

              <div ref="sortRef" class="relative">
                  <button @click="sortOpen = !sortOpen" class="sort-trigger">
                    <span class="sort-trigger-label">সর্ট করুন</span>
                    <span class="sort-trigger-value">{{ currentSortLabel }}</span>
                    <ChevronDown class="sort-chevron transition-transform shrink-0" :class="{ 'rotate-180': sortOpen }" />
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

          <div class="archive-layout flex flex-col lg:flex-row gap-6 lg:gap-5">
            <!-- Mobile Overlay -->
            <div v-if="showSidebar" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="toggleSidebar"></div>

            <!-- Sidebar Filters -->
            <aside class="filter-sidebar" :class="{ 'is-open': showSidebar }">
              <div class="filter-sticky">
              <div class="flex items-center justify-between lg:hidden mb-6">
                <h2 class="filter-heading !mb-0">ফিল্টার</h2>
                <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-800"><X class="w-5 h-5" /></button>
              </div>

              <!-- Price Filter -->
              <div class="filter-item">
                <h3 class="filter-heading">দাম অনুযায়ী খুঁজুন</h3>
                <div class="price-box">
                  <div class="price-slider relative w-full">
                    <div class="price-rail"></div>
                    <div class="price-fill" :style="priceTrackStyle"></div>
                    <input type="range" v-model="filters.min_price" :min="MIN_PRICE" :max="MAX_PRICE" class="price-range" @change="updatePrice" />
                    <input type="range" v-model="filters.max_price" :min="MIN_PRICE" :max="MAX_PRICE" class="price-range" @change="updatePrice" />
                  </div>
                  <div class="price-caption">
                    মূল্য ({{ bnDigits(filters.min_price) }}৳ - {{ bnDigits(filters.max_price) }}৳)
                  </div>
                </div>
              </div>

              <!-- Category Filter -->
              <div class="filter-item">
                <h3 class="filter-heading">শাড়ির ক্যাটাগরি</h3>
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
              <div v-if="attributes.length" class="filter-item filter-item--attributes">
                <div>
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
              <div v-if="loading && products.length === 0" class="archive-grid grid grid-cols-2 lg:grid-cols-3">
                <div v-for="n in 6" :key="n" class="skeleton-card">
                  <div class="skeleton-image animate-pulse"></div>
                  <div class="skeleton-info">
                    <div class="skeleton-line w-3/4 animate-pulse"></div>
                    <div class="skeleton-line w-1/2 animate-pulse mt-2"></div>
                  </div>
                  <div class="skeleton-btn animate-pulse"></div>
                </div>
              </div>

              <div v-else-if="products.length > 0" class="archive-grid grid grid-cols-2 lg:grid-cols-3">
                <CollectionCard
                  v-for="product in products"
                  :key="product.id"
                  :product="product"
                  button-label="কার্টে রাখুন"
                  :openPreview="openPreview"
                />
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-16">
                <h3 class="archive-empty-title">কোনো শাড়ি পাওয়া যায়নি</h3>
                <p class="archive-empty-note">ফিল্টার বদলে আবার চেষ্টা করুন।</p>
              </div>

              <!-- Pagination -->
              <nav v-if="lastPage > 1" class="pagination-wrap" aria-label="Pagination" :aria-busy="loading">
                <button class="pagination-arrow" :disabled="loading || currentPage === 1" @click="goToPage(currentPage - 1)" aria-label="Previous page">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <template v-for="(p, idx) in visiblePages" :key="idx">
                  <span v-if="p === '...'" class="pagination-ellipsis">…</span>
                  <button v-else class="pagination-page" :disabled="loading" :class="{ 'is-active': p === currentPage }" @click="goToPage(p)" :aria-current="p === currentPage ? 'page' : undefined">{{ p }}</button>
                </template>
                <button class="pagination-arrow" :disabled="loading || currentPage === lastPage" @click="goToPage(currentPage + 1)" aria-label="Next page">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </nav>

              <p v-if="total > 0" class="pagination-info">
                পৃষ্ঠা {{ bnDigits(currentPage) }} / {{ bnDigits(lastPage) }} · মোট {{ bnDigits(total) }}টি শাড়ি
              </p>
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive { background-color: #fff; }

/* ===== PAGE HEADER — Figma: Li Ador SB 56/68, 16px gap, Li Ador Light 16/24 ===== */
.archive-header { padding: 64px 0 48px; }
.archive-title {
  margin: 0 0 16px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  color: #1a1817;
}
.archive-accent { color: #cc9b25; }
.archive-description {
  white-space: pre-line;
  max-width: 647px;
  margin: 0 auto;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 28px;
  color: #1a1817;
}
@media (min-width: 768px) {
  .archive-title { font-size: 56px; line-height: 68px; }
}

.archive-inner { padding: 0 0 76px; }

/* ===== TOOLBAR (breadcrumb + sort row), 24px above the Black/200 rule ===== */
/* Figma: the breadcrumb/sort row is the 1203px title column, not the grid */
.archive-toolbar {
  max-width: 1203px;
  margin-inline: auto;
  padding-bottom: 24px;
  border-bottom: 1px solid #e4e1e0;
  margin-bottom: 48px;
}

/* ===== BREADCRUMB — Li Ador 20/28, Black/400 links, Black/900 current ===== */
.breadcrumb-link,
.breadcrumb-current {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}
.breadcrumb-link {
  color: #9c9591;
  transition: color 0.2s ease;
}
.breadcrumb-link:hover { color: #cc9b25; }
.breadcrumb-current { color: #1a1817; }
.breadcrumb-sep { color: #9c9591; }
@media (min-width: 768px) {
  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 20px;
    line-height: 28px;
  }
}

/* ===== SORT — Figma: 288×50, Gold/500 1px, r8, 12/24 padding ===== */
.sort-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  border: 1px solid #cc9b25;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .2s ease, box-shadow .2s ease;
}
@media (min-width: 768px) {
  .sort-trigger {
    min-width: 288px;
    height: 50px;
    gap: 16px;
    padding: 12px 24px;
  }
}
.sort-trigger:hover { border-color: #705514; box-shadow: 0 4px 16px -4px rgba(0, 0, 0, .12); }
.sort-trigger-label {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  color: #1a1817;
}
.sort-trigger-value {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 24px;
  color: #4d4944;
  flex: 1;
  text-align: left;
}
.sort-chevron { width: 24px; height: 24px; color: #1a1817; stroke-width: 1.25; }
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
  border: 1px solid #efe0bb;
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.sort-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 24px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
  cursor: pointer;
  background-color: #fff;
  border: none;
  transition: background-color 0.15s ease, color .15s ease;
}
.sort-option:hover { background-color: #faf5ea; color: #1a1817; }
.sort-option--active { background-color: #faf5ea; color: #1a1817; font-weight: 600; }

/* ===== FILTER SIDEBAR — 325 wide, 20px from the grid ===== */
.filter-sidebar {
  width: 100%;
  flex-shrink: 0;
  background-color: transparent;
  border: 0;
  padding: 0;
}
@media (min-width: 1024px) {
  .filter-sidebar {
    width: 325px;
    display: block !important;
    position: static;
    transform: none;
    border-radius: 0;
  }

  .filter-sticky {
    position: sticky;
    top: 24px;
  }
}

/* Below the sticky site header (sticky only at ≥1280px, 76px tall) */
@media (min-width: 1280px) {
  .filter-sticky {
    top: 100px;
  }
}
@media (max-width: 1023px) {
  .filter-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 325px;
    max-width: 88%;
    z-index: 50;
    overflow-y: auto;
    padding: 24px 20px;
    background: #fff;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  .filter-sidebar.is-open { transform: translateX(0); box-shadow: 6px 0 40px rgba(26, 24, 23, .18); }
}

/* Groups 40px apart; the attribute group sits 64px below the cards */
.filter-item { margin-bottom: 40px; }
.filter-item:last-child { margin-bottom: 0; }
.filter-item--attributes { margin-top: 64px; }
.filter-heading {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
  margin-bottom: 16px;
}
.filter-item--attributes .filter-heading { margin-bottom: 28px; }
.filter-empty {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
}

/* White cards — r12, 20/39 padding, the shared soft shadow */
.price-box,
.category-box {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px 39px;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.price-slider { height: 16px; }
.price-rail,
.price-fill {
  position: absolute;
  top: 50%;
  height: 3px;
  transform: translateY(-50%);
}
.price-rail { left: 0; right: 0; background: #e4e1e0; }
.price-fill { background: #1a1817; }
.price-caption {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #4d4944;
}

.category-box { display: flex; flex-direction: column; }
.category-row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0;
  background: transparent;
  border: none;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #4d4944;
  cursor: pointer;
  transition: color 0.2s ease;
}
.category-row + .category-row { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e4e1e0; }
.category-row:hover { color: #cc9b25; }
.category-row.is-active { color: #1a1817; font-weight: 600; }

/* Range slider — 16px square Black/900 handles */
.price-range {
  position: absolute;
  top: 50%;
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
  width: 16px;
  height: 16px;
  border-radius: 0;
  background: #1a1817;
  cursor: pointer;
}
.price-range::-moz-range-thumb {
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border-radius: 0;
  background: #1a1817;
  cursor: pointer;
  border: none;
}
.price-range:nth-of-type(2) { z-index: 2; }

/* Checkbox */
.shop-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #252f17;
  border-radius: 3px;
  cursor: pointer;
}

/* ===== GRID — 325px cards, 20px apart ===== */
.archive-grid { gap: 20px; }
@media (max-width: 767px) {
  .archive-grid { gap: 12px; }
  /* The subtitle's line break is set for the desktop width; a phone wraps it itself. */
  .archive-description { white-space: normal; }
  /* The shared 48px gap above the footer on phones. */
  .archive-inner { padding-bottom: 48px; }
}

.archive-empty-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #3c3834;
}
.archive-empty-note {
  margin-top: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #9c9591;
}

/* ===== SKELETON LOADING ===== */
.skeleton-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
@media (min-width: 768px) { .skeleton-card { padding: 20px; } }
.skeleton-image { aspect-ratio: 285 / 322; border-radius: 8px; background-color: #f3f3f3; }
.skeleton-info { padding: 16px 8px 0; flex-grow: 1; }
.skeleton-line { height: 14px; border-radius: 6px; background-color: #f3f3f3; }
.skeleton-btn { margin-top: 16px; height: 44px; border-radius: 8px; background-color: #f3f3f3; }

/* ===== PAGINATION — brand olive and gold ===== */
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
  background-color: #fff;
  border: 1px solid #efe0bb;
  border-radius: 8px;
  color: #3c3834;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.pagination-page:hover:not(.is-active),
.pagination-arrow:hover:not(:disabled) {
  background-color: #faf5ea;
  border-color: #d6af51;
}
.pagination-page.is-active {
  background-color: #1a2110;
  border-color: #1a2110;
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
  color: #9c9591;
  font-weight: 600;
  user-select: none;
}
.pagination-info {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #6d6560;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
}
@media (min-width: 768px) {
  .pagination-wrap { gap: 8px; margin-top: 56px; }
  .pagination-page,
  .pagination-arrow { min-width: 44px; height: 44px; font-size: 16px; }
}

/* Phone: 20px gutters like the rest of the Figma phone frames */
@media (max-width: 767px) {
  .archive-header { padding: 40px 0 32px; }
  .archive-header .container,
  .archive-body .container { padding-inline: 20px; }
  .archive-toolbar { margin-bottom: 24px; }
}
</style>
