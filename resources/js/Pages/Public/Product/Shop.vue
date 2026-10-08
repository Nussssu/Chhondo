<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"

const props = defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
})
import ProductArchive from "@/components/Product/ProductArchive.vue"
import { ref, computed } from "vue"
import { Head, router, usePage } from "@inertiajs/vue3"

const page = usePage()

const products     = computed(() => page.props.products || [])
const currentPage  = computed(() => page.props.currentPage || 1)
const lastPage     = computed(() => page.props.lastPage || 1)
const total        = computed(() => page.props.total || 0)
const categories   = computed(() => page.props.filterCategories || [])
const attributes   = computed(() => page.props.filterAttributes || [])
const initialFilters = computed(() => page.props.filters || {})

const isLoading = ref(false)

// Active category name (when the shop is scoped to a category_id via the URL)
const activeCategoryName = computed(() => {
  const id = page.props.filters?.category_id
  if (!id) return null
  return categories.value.find((c) => String(c.id) === String(id))?.name || null
})

/*
 * Heading, the line under it and the breadcrumb: Content › Pages › Shop. A
 * category filter names itself through the shop's "category heading" pattern.
 */
const shopTexts = computed(() => props.texts || {})

const title = computed(() => {
  if (activeCategoryName.value) {
    return (shopTexts.value.category_title || "{category}").replace("{category}", activeCategoryName.value)
  }
  return props.intro?.title || ""
})

const description = computed(() => props.intro?.subtitle || "")

const breadcrumbs = computed(() => {
  const crumbs = [{ label: shopTexts.value.breadcrumb, href: "/shop" }]
  if (activeCategoryName.value) crumbs.push({ label: activeCategoryName.value, href: null })
  return crumbs
})

// Track the current filter set so pagination preserves it
const currentFilters = ref({ ...initialFilters.value })

const buildParams = (extra = {}) => {
  const f = currentFilters.value
  const params = {
    per_page:  12,
    min_price: f.min_price,
    max_price: f.max_price,
    ...extra,
  }
  if (page.props.filters?.category_id) params.category_id = page.props.filters.category_id
  if (f.sort) params.sort = f.sort
  if (f.attributes && Object.keys(f.attributes).length) params.attributes = f.attributes
  return params
}

const navigate = (extra, preserveScroll = false) => {
  isLoading.value = true
  router.get("/shop", buildParams(extra), {
    preserveState: true,
    preserveScroll,
    onFinish: () => { isLoading.value = false },
  })
}

const onFilterChange = (filters) => {
  currentFilters.value = { ...filters }
  navigate({ page: 1 })
}

const onPageChange = (pageNum) => {
  navigate({ page: pageNum }, true)
}
</script>

<template>
  <Head><title>{{ shopTexts.tab_title }}</title></Head>
  <AppLayout>
    <ProductArchive
      :title="title"
      :description="description"
      :breadcrumbs="breadcrumbs"
      :products="products"
      :loading="isLoading"
      :current-page="currentPage"
      :last-page="lastPage"
      :total="total"
      :categories="categories"
      :attributes="attributes"
      :active-category-slug="null"
      :initial-filters="initialFilters"
      @filter-change="onFilterChange"
      @page-change="onPageChange"
    />

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>
