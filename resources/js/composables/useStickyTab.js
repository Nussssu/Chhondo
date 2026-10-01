import { ref, watch } from 'vue'

/**
 * Keeps the open tab in the URL so a save does not throw the operator back to
 * the first tab.
 *
 * Most admin forms post natively and the controller answers with
 * `redirect()->back()`, which reloads the page and resets any tab held only in
 * component state. Laravel builds that redirect from the Referer header, which
 * carries the query string but *not* the fragment — so the tab has to live in
 * `?tab=`, not `#tab`.
 *
 * The URL is rewritten with replaceState so switching tabs does not fill the
 * browser history with entries the back button has to walk through.
 *
 * @param {string[]} tabs   valid tab ids
 * @param {string}   fallback  used when the URL holds nothing usable
 * @param {string}   key    query parameter name
 * @returns {import('vue').Ref<string>}
 */
export function useStickyTab(tabs, fallback, key = 'tab') {
  const valid = new Set(tabs)

  const fromUrl = new URLSearchParams(window.location.search).get(key)
  const tab = ref(valid.has(fromUrl) ? fromUrl : fallback)

  watch(tab, (value) => {
    if (!valid.has(value)) return

    const url = new URL(window.location.href)

    // The fallback needs no parameter — keeps the common URL clean.
    if (value === fallback) {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, value)
    }

    window.history.replaceState(window.history.state, '', url)
  })

  return tab
}

/**
 * The same behaviour for Bootstrap's own tab markup, where the active tab lives
 * in the DOM rather than in a ref. Reads `?tab=` on mount and records every
 * switch, so a password change no longer drops the operator back on Profile.
 *
 * @param {string} key  query parameter name
 * @returns {() => void} teardown, for onBeforeUnmount
 */
export function useStickyBootstrapTabs(key = 'tab') {
  const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="tab"]'))
  if (!triggers.length) return () => {}

  const idOf = (el) => (el.getAttribute('href') || el.dataset.bsTarget || '').replace('#', '')

  const wanted = new URLSearchParams(window.location.search).get(key)
  if (wanted) {
    const target = triggers.find((el) => idOf(el) === wanted)
    // Bootstrap may not be loaded on every page; falling back to a click keeps
    // this working either way.
    if (target) {
      const Tab = window.bootstrap?.Tab
      Tab ? Tab.getOrCreateInstance(target).show() : target.click()
    }
  }

  const onShown = (event) => {
    const id = idOf(event.target)
    if (!id) return

    const url = new URL(window.location.href)
    // The first tab is the default, so it needs no parameter.
    id === idOf(triggers[0]) ? url.searchParams.delete(key) : url.searchParams.set(key, id)
    window.history.replaceState(window.history.state, '', url)
  }

  triggers.forEach((el) => el.addEventListener('shown.bs.tab', onShown))

  return () => triggers.forEach((el) => el.removeEventListener('shown.bs.tab', onShown))
}
