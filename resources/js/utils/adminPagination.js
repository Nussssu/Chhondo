/** Admin page numbers are shown in groups: 1–5, 6–10, 11–15, … */
export function adminPaginationLinks(paginator = {}, options = {}) {
  const original = paginator.links ?? []
  const numbered = original.filter(link => /^\d+$/.test(String(link.label)))
  const active = numbered.find(link => link.active)
  const last = Math.max(1, Number(options.lastPage ?? paginator.last_page ?? (
    paginator.total != null && paginator.per_page
      ? Math.ceil(paginator.total / paginator.per_page)
      : Math.max(1, ...numbered.map(link => Number(link.label)))
  )) || 1)
  const current = Math.min(last, Math.max(1, Number(options.page ?? paginator.current_page ?? active?.label ?? 1) || 1))
  const start = Math.floor((current - 1) / 5) * 5 + 1
  const end = Math.min(start + 4, last)

  const source = numbered.find(link => link.url)?.url ?? paginator.first_page_url ?? paginator.path
  function urlFor(page) {
    if (options.urlForPage) return options.urlForPage(page)
    if (!source) return null
    const url = new URL(source, typeof window === 'undefined' ? 'http://localhost' : window.location.origin)
    // Keep custom paginator query names as well as filters already in its URL.
    const seed = numbered.find(link => link.url)
    const pageKey = seed
      ? [...url.searchParams.entries()].find(([key, value]) => /page$/i.test(key) && value === String(seed.label))?.[0] ?? 'page'
      : 'page'
    url.searchParams.set(pageKey, String(page))
    return /^https?:\/\//.test(source) ? url.href : url.pathname + url.search + url.hash
  }

  const result = [{ label: 'Previous', url: start > 1 ? urlFor(Math.max(1, start - 5)) : null, active: false }]
  for (let page = start; page <= end; page++) {
    result.push({ label: String(page), url: urlFor(page), active: page === current })
  }
  result.push({ label: 'Next', url: end < last ? urlFor(end + 1) : null, active: false })
  return result
}
