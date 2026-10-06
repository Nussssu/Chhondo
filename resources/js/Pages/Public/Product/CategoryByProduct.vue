<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import ProductArchive from "@/components/Product/ProductArchive.vue"
import { ref, computed } from "vue"
import { Head, router, usePage } from "@inertiajs/vue3"

const props = defineProps({
  slug: { type: String, required: true },
  basePath: { type: String, default: "/product-category" },
})

const page = usePage()

const products     = computed(() => page.props.products || [])
const categoryName = computed(() => page.props.categoryName || "")
const currentPage  = computed(() => page.props.currentPage || 1)
const lastPage     = computed(() => page.props.lastPage || 1)
const total        = computed(() => page.props.total || 0)
const categories   = computed(() => page.props.filterCategories || [])
const attributes   = computed(() => page.props.filterAttributes || [])
const initialFilters = computed(() => page.props.filters || {})

const isLoading = ref(false)

// A category's own title and subtitle (Categories › Edit) come first; otherwise
// the shop's wording from Content › Pages › Shop.
const texts = computed(() => page.props.texts || {})

const title = computed(() => {
  const custom = page.props.categoryTitle
  if (custom) return custom

  return (texts.value.category_title || "{category}").replace("{category}", categoryName.value)
})

const description = computed(() => page.props.categorySubtitle || page.props.intro?.subtitle || "")

const breadcrumbs = computed(() => [
  { label: texts.value.breadcrumb, href: "/shop" },
  { label: categoryName.value, href: null },
])

const currentFilters = ref({ ...initialFilters.value })

const buildParams = (extra = {}) => {
  const f = currentFilters.value
  const params = {
    per_page:  12,
    min_price: f.min_price,
    max_price: f.max_price,
    ...extra,
  }
  if (f.sort) params.sort = f.sort
  if (f.attributes && Object.keys(f.attributes).length) params.attributes = f.attributes
  return params
}

const navigate = (extra) => {
  isLoading.value = true
  router.get(`${props.basePath}/${props.slug}`, buildParams(extra), {
    preserveState: true,
    preserveScroll: false,
    onFinish: () => { isLoading.value = false },
  })
}

const onFilterChange = (filters) => {
  currentFilters.value = { ...filters }
  navigate({ page: 1 })
}

const onPageChange = (pageNum) => {
  navigate({ page: pageNum })
}
</script>

<template>
  <Head><title>{{ categoryName }}</title></Head>
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
      :active-category-slug="slug"
      :initial-filters="initialFilters"
      @filter-change="onFilterChange"
      @page-change="onPageChange"
    />
  </AppLayout>
</template>
