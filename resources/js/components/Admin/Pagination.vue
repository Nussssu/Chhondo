<script setup>
/**
 * Renders a Laravel paginator. Takes the paginator object straight from the
 * Inertia prop — { data, links, from, to, total, current_page, last_page }.
 *
 * Adds the count line ("Showing 1–20 of 340") that the hand-rolled versions
 * left out, so a user can tell how much is behind the list.
 */
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { adminPaginationLinks } from '@/utils/adminPagination'

const props = defineProps({
  // Server mode: pass the Laravel paginator straight through.
  paginator: { type: Object, default: null },
  // Inertia props to refresh; omit to reload everything.
  only: { type: Array, default: () => [] },

  // Client mode: for screens whose controller returns a plain array. Used
  // where jQuery DataTables previously did the paging in the browser.
  page:       { type: Number, default: null },
  perPage:    { type: Number, default: 10 },
  totalItems: { type: Number, default: 0 },
})

const emit = defineEmits(['update:page'])

const isClient = computed(() => props.page !== null)

const total = computed(() =>
  isClient.value ? props.totalItems : (props.paginator?.total ?? 0)
)

const lastPage = computed(() => isClient.value
  ? Math.max(1, Math.ceil(total.value / props.perPage))
  : Math.max(1, Number(props.paginator?.last_page ?? 1)))

const from = computed(() => {
  if (!isClient.value) return props.paginator?.from ?? 0
  return total.value === 0 ? 0 : (props.page - 1) * props.perPage + 1
})

const to = computed(() => {
  if (!isClient.value) return props.paginator?.to ?? 0
  return Math.min(props.page * props.perPage, total.value)
})

/**
 * Client mode builds the same {url,label,active} shape the Laravel paginator
 * emits, so one set of markup renders both modes in groups of five.
 */
const links = computed(() => adminPaginationLinks(props.paginator ?? {}, isClient.value
  ? { page: props.page, lastPage: lastPage.value, urlForPage: page => page }
  : {}))

// A single page needs no controls, but the count line is still useful.
const hasPages = computed(() => links.value.length > 3)

function go(url) {
  if (!url) return

  if (isClient.value) {
    emit('update:page', url)
    return
  }

  router.get(url, {}, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: props.only.length ? props.only : undefined,
  })
}

// Laravel emits "&laquo; Previous" / "Next &raquo;" as HTML entities.
function labelOf(link) {
  const raw = String(link.label ?? '')
  if (raw.includes('Previous')) return '‹'
  if (raw.includes('Next')) return '›'
  return raw.replace(/&laquo;|&raquo;/g, '').trim()
}

function ariaOf(link) {
  const raw = String(link.label ?? '')
  if (raw.includes('Previous')) return 'Previous group of pages'
  if (raw.includes('Next')) return 'Next group of pages'
  return `Page ${labelOf(link)}`
}
</script>

<template>
  <div v-if="total > 0" class="pg">
    <p class="pg-count">
      Showing <strong>{{ from }}</strong>–<strong>{{ to }}</strong> of <strong>{{ total }}</strong>
    </p>

    <nav v-if="hasPages" class="pg-nav" aria-label="Pagination">
      <button
        v-for="(link, i) in links"
        :key="i"
        type="button"
        class="pg-link"
        :class="{ 'is-active': link.active, 'is-gap': labelOf(link) === '...' }"
        :disabled="!link.url || link.active || labelOf(link) === '...'"
        :aria-label="ariaOf(link)"
        :aria-current="link.active ? 'page' : undefined"
        @click="go(link.url)"
      >
        {{ labelOf(link) }}
      </button>
    </nav>
  </div>
</template>

<style scoped>
.pg {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  flex-wrap: wrap;
  padding-top: var(--sp-4);
  margin-top: var(--sp-4);
  border-top: 1px solid var(--line);
}

.pg-count {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.pg-count strong { color: var(--text); font-weight: 600; }

.pg-nav {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  flex-wrap: wrap;
}

.pg-link {
  min-width: 34px;
  height: 34px;
  padding: 0 var(--sp-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.pg-link:hover:not(:disabled) {
  background: var(--surface-sunk);
  border-color: var(--admin-green-600);
}

.pg-link:focus-visible {
  outline: 2px solid var(--admin-green-600);
  outline-offset: 2px;
}

.pg-link.is-active {
  background: var(--admin-green-600);
  border-color: var(--admin-green-600);
  color: #fff;
  cursor: default;
}

.pg-link:disabled:not(.is-active) {
  opacity: .45;
  cursor: not-allowed;
}

.pg-link.is-gap {
  border-color: transparent;
  background: none;
  opacity: 1;
}
</style>
