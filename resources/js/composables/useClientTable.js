import { computed, ref, watch } from 'vue'

/**
 * Client-side search, sort and paging for screens whose controller returns a
 * plain array rather than a Laravel paginator.
 *
 * This replaces what jQuery DataTables was doing on those screens — but in
 * Vue, so the state belongs to the component instead of to a second library
 * that owned the same DOM and lost its state on every Inertia visit.
 *
 * For genuinely large tables the right answer is server-side pagination;
 * this keeps behaviour identical without a controller change.
 *
 * @param {import('vue').Ref<Array>} source  reactive list of rows
 * @param {object} options
 * @param {string[]} options.searchKeys  row keys (dotted paths allowed) to match against
 * @param {number}   options.perPage
 */
export function useClientTable(source, { searchKeys = [], perPage = 10 } = {}) {
  const search = ref('')
  const page = ref(1)
  const pageSize = ref(perPage)
  const sort = ref(null)

  const valueAt = (row, path) =>
    path.split('.').reduce((acc, part) => acc?.[part], row)

  const searched = computed(() => {
    const rows = source.value ?? []
    const q = search.value.trim().toLowerCase()
    if (!q) return rows

    const keys = searchKeys.length ? searchKeys : Object.keys(rows[0] ?? {})
    return rows.filter((row) =>
      keys.some((k) => String(valueAt(row, k) ?? '').toLowerCase().includes(q))
    )
  })

  const sorted = computed(() => {
    if (!sort.value) return searched.value

    const { key, dir } = sort.value
    const factor = dir === 'desc' ? -1 : 1

    return [...searched.value].sort((a, b) => {
      const av = valueAt(a, key)
      const bv = valueAt(b, key)

      if (av == null && bv == null) return 0
      if (av == null) return 1 * factor
      if (bv == null) return -1 * factor

      // Numeric columns must not sort lexicographically ("10" < "9").
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor

      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * factor
    })
  })

  const total = computed(() => sorted.value.length)

  const rows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return sorted.value.slice(start, start + pageSize.value)
  })

  // Narrowing the result set can strand the user on a page that no longer
  // exists — reset instead of showing an empty table.
  watch([search, () => source.value?.length, pageSize], () => {
    page.value = 1
  })

  function onSort(next) {
    sort.value = next
    page.value = 1
  }

  return { search, page, pageSize, sort, rows, total, onSort }
}
