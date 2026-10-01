<script setup>
import { ref, onMounted } from "vue"
import CollectionCard from "@/components/Product/CollectionCard.vue"

const props = defineProps({
  // The product currently being viewed — recorded into history, excluded from display
  product: {
    type: Object,
    required: true,
  },
  openPreview: {
    type: Function,
    default: null,
  },
})

const STORAGE_KEY = "recently_viewed_products"
const MAX_STORED = 8
// Matches the four-column grid below; three left a gap in the last row.
const MAX_SHOWN = 4

const recentProducts = ref([])

/**
 * The stored ids, tolerating the old format.
 *
 * This used to hold whole product objects copied out of the page. Browsers
 * still carry those, so an entry that is an object is read for its id and the
 * rest of it discarded — the next write replaces the list with plain ids.
 */
function readStoredIds() {
  let stored = []

  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch (e) {
    stored = []
  }

  if (!Array.isArray(stored)) return []

  return stored
    .map((entry) => (entry && typeof entry === "object" ? entry.id : entry))
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0)
}

onMounted(async () => {
  if (typeof window === "undefined" || !props.product?.id) return

  const stored = readStoredIds()

  // Record the current product at the front, as ids only. What each product
  // *is* — its price, its stock, whether it still exists — is the server's
  // answer, fetched below, not something this row keeps a copy of.
  const updated = [props.product.id, ...stored.filter((id) => id !== props.product.id)]
    .slice(0, MAX_STORED)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    // A full or blocked store only costs this visitor their history.
  }

  const toShow = updated.filter((id) => id !== props.product.id).slice(0, MAX_SHOWN)

  if (toShow.length === 0) return

  // Anything the server does not return — deleted, or no longer published —
  // simply does not appear. The old code rendered its stale copy instead,
  // which is how a deleted product kept showing with a broken image.
  try {
    const response = await fetch(`/recently-viewed?ids=${toShow.join(",")}`, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) return

    const data = await response.json()

    recentProducts.value = Array.isArray(data?.products) ? data.products : []
  } catch (e) {
    // Offline or a failed request: show no history rather than a wrong one.
    recentProducts.value = []
  }
})

</script>

<template>
  <section v-if="recentProducts.length > 0" class="bg-[#FFFAF4] py-12 md:py-16">
    <div class="container">
      <h2 class="recently-viewed-title text-center mb-8 md:mb-12">Recently viewed</h2>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1300px] mx-auto">
        <CollectionCard
          v-for="p in recentProducts"
          :key="p.id"
          :product="p"
          :openPreview="openPreview"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.recently-viewed-title {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: #3c3834;
}

@media (min-width: 768px) {
  .recently-viewed-title {
    font-size: 56px;
    line-height: 68px;
  }
}
</style>
