<script setup>
/**
 * ⌘K / Ctrl-K navigation.
 *
 * On a panel this size the sidebar stops being the fastest way to get
 * somewhere. Destinations come from the same navigation.js the sidebar
 * uses, so anything reachable in one is reachable in the other.
 *
 * It opens in place in the topbar: the Search button widens into the input
 * and the destinations drop down beneath it.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { Search, CornerDownLeft } from 'lucide-vue-next'
import { navDestinations } from '@/navigation'

const props = defineProps({
  /** How this platform writes the shortcut key, e.g. "⌘" or "Ctrl ". */
  metaKey: { type: String, default: 'Ctrl ' },
})

const page = usePage()
const can = (permission) => page.props.adminPermissions?.[permission] === true

const isOpen = ref(false)
const query = ref('')
const cursor = ref(0)
const input = ref(null)
const listbox = ref(null)
const root = ref(null)

const destinations = computed(() => navDestinations(can))

/**
 * Subsequence match, so "ordinc" finds "Orders › Incomplete". Results are
 * ranked: a prefix hit on the label beats a hit anywhere in the group.
 */
function score(item, q) {
  const label = item.label.toLowerCase()
  const group = (item.group ?? '').toLowerCase()
  const hay = `${group} ${label}`

  if (label.startsWith(q)) return 100
  if (label.includes(q)) return 80
  if (hay.includes(q)) return 60

  let i = 0
  for (const ch of hay) if (ch === q[i]) i++
  return i === q.length ? 30 : 0
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return destinations.value.slice(0, 12)

  return destinations.value
    .map((item) => ({ item, s: score(item, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 12)
    .map((r) => r.item)
})

watch(results, () => { cursor.value = 0 })

function open() {
  isOpen.value = true
  query.value = ''
  cursor.value = 0
  nextTick(() => input.value?.focus())
}

function close() {
  isOpen.value = false
}

function go(item) {
  close()
  router.visit(route(item.route))
}

function onKeydown(e) {
  const mod = e.metaKey || e.ctrlKey

  if (mod && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
    return
  }

  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor.value = (cursor.value + 1) % Math.max(results.value.length, 1)
    scrollCursorIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    cursor.value = (cursor.value - 1 + results.value.length) % Math.max(results.value.length, 1)
    scrollCursorIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const target = results.value[cursor.value]
    if (target) go(target)
  }
}

function scrollCursorIntoView() {
  nextTick(() => {
    listbox.value?.querySelector('.cp-item.is-cursor')?.scrollIntoView({ block: 'nearest' })
  })
}

/** A click anywhere outside the search closes it. */
function onPointerDown(e) {
  if (isOpen.value && root.value && !root.value.contains(e.target)) close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onPointerDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onPointerDown)
})

defineExpose({ open })
</script>

<template>
  <div ref="root" class="cp-inline" :class="{ 'is-open': isOpen }">
    <button v-if="!isOpen" type="button" class="topbar-search" @click="open">
      <Search :size="14" aria-hidden="true" />
      <span>Search</span>
      <kbd>{{ props.metaKey }}K</kbd>
    </button>

    <div v-else class="cp-panel" role="dialog" aria-label="Search the admin panel">
      <div class="cp-search">
        <Search :size="16" class="cp-search-icon" aria-hidden="true" />
        <input
          ref="input"
          v-model="query"
          type="text"
          class="cp-input"
          placeholder="Go to…"
          aria-label="Search the admin panel"
          autocomplete="off"
          role="combobox"
          aria-expanded="true"
          aria-controls="cp-listbox"
        />
        <kbd class="cp-kbd">esc</kbd>
      </div>

      <Transition name="cp" appear>
        <div class="cp-drop">
          <ul v-if="results.length" id="cp-listbox" ref="listbox" class="cp-list" role="listbox">
            <li
              v-for="(item, i) in results"
              :key="`${item.group}-${item.label}`"
              class="cp-item"
              :class="{ 'is-cursor': i === cursor }"
              role="option"
              :aria-selected="i === cursor"
              @mouseenter="cursor = i"
              @click="go(item)"
            >
              <span class="cp-item-label">{{ item.label }}</span>
              <span v-if="item.group" class="cp-item-group">{{ item.group }}</span>
              <CornerDownLeft v-if="i === cursor" :size="13" class="cp-item-enter" aria-hidden="true" />
            </li>
          </ul>

          <p v-else class="cp-empty">Nothing matches “{{ query }}”.</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.cp-inline { position: relative; }

/* Open: the button's place widens into the search field. */
.cp-panel {
  position: relative;
  width: 360px;
  animation: cp-widen var(--dur) var(--ease);
}

@keyframes cp-widen {
  from { width: 120px; }
  to { width: 360px; }
}

.cp-search {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  height: 34px;
  padding: 0 10px 0 12px;
  border: 1px solid var(--admin-gold, #cc9b25);
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(204, 155, 37, 0.15);
}

/* The destinations drop down under the field. */
.cp-drop {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 1080;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  box-shadow: var(--el-2);
  overflow: hidden;
}

.cp-search-icon { color: var(--text-faint); flex-shrink: 0; }

.cp-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: none;
  font-size: var(--fs-sm);
  color: var(--text);
}

.cp-input:focus { outline: none; }

.cp-kbd {
  flex-shrink: 0;
  padding: 2px 6px;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--surface-sunk);
}

.cp-list {
  list-style: none;
  margin: 0;
  padding: var(--sp-2);
  max-height: 48vh;
  overflow-y: auto;
}

.cp-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 9px var(--sp-3);
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: var(--fs-md);
  color: var(--text);
}

.cp-item.is-cursor { background: var(--accent-soft, #e6efdd); }

.cp-item-label { font-weight: 500; }

.cp-item-group {
  margin-left: auto;
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

.cp-item-enter { color: var(--admin-green-600); flex-shrink: 0; }

.cp-empty {
  margin: 0;
  padding: var(--sp-6) var(--sp-4);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--fs-md);
}

.cp-enter-active,
.cp-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.cp-enter-from,
.cp-leave-to { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  .cp-panel { animation: none; }
}
</style>
