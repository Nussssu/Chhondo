<script setup>
/**
 * The admin sidebar.
 *
 * Replaces the jQuery metisMenu accordion, which needed re-initialising on
 * every Inertia visit and lost its open/closed state each time. Structure
 * comes from resources/js/navigation.js.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { ChevronDown } from 'lucide-vue-next'
import { visibleNav } from '@/navigation'

const props = defineProps({
  logo: { type: String, default: '/assets/images/logo/logo.png' },
  collapsed: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

const page = usePage()

const can = (permission) => page.props.adminPermissions?.[permission] === true

const groups = computed(() => visibleNav(can))

const version = computed(() => page.props.adminVersion ?? 'unknown')

function isActive(pattern) {
  const current = route().current()
  if (!current || !pattern) return false
  const escaped = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`).test(current)
}

// `match` may be a single pattern or a list of them, for entries that gather
// several screens behind one nav item.
const itemActive = (item) => {
  const patterns = item.match ?? item.route
  return Array.isArray(patterns) ? patterns.some(isActive) : isActive(patterns)
}

const parentActive = (item) => item.children?.some(itemActive) ?? false

function badgeCount(item) {
  if (item.badge) return page.props[item.badge] ?? 0
  // A collapsed parent surfaces its children's counts so nothing hides.
  return (item.children ?? []).reduce((n, c) => n + (c.badge ? (page.props[c.badge] ?? 0) : 0), 0)
}

// A bare number says nothing about what it counts — spell it out on hover.
function badgeLabel(item) {
  const count = badgeCount(item)
  if (!count) return undefined

  const what = item.badgeTitle
    ?? (item.children ?? []).find((c) => c.badgeTitle && (page.props[c.badge] ?? 0) > 0)?.badgeTitle
  return what ? `${count} ${what}` : undefined
}

// ── Open/closed state, remembered per user ──────────────────
const OPEN_KEY = 'admin.sidebarOpenGroups'
const open = ref(new Set())

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(OPEN_KEY) ?? '[]')
    open.value = new Set(saved)
  } catch {
    open.value = new Set()
  }
}

function persist() {
  localStorage.setItem(OPEN_KEY, JSON.stringify([...open.value]))
}

function toggle(item) {
  if (open.value.has(item.label)) open.value.delete(item.label)
  else open.value.add(item.label)
  open.value = new Set(open.value)
  persist()
}

const isOpen = (item) => open.value.has(item.label) || parentActive(item)

// Always reveal the group containing the current page.
function openActiveGroup() {
  for (const group of groups.value) {
    for (const item of group.items) {
      if (item.children && parentActive(item)) open.value.add(item.label)
    }
  }
  open.value = new Set(open.value)
}

onMounted(() => {
  restore()
  openActiveGroup()
  scrollActiveIntoView()
})

// The layout remounts on every Inertia visit, so the sidebar always starts
// scrolled to the top — bring the active item back into view.
function scrollActiveIntoView() {
  requestAnimationFrame(() => {
    document.querySelector('.sb-link.is-active')?.scrollIntoView({ block: 'center' })
  })
}

watch(() => page.url, () => {
  openActiveGroup()
  scrollActiveIntoView()
})
</script>

<template>
  <nav class="sb" :class="{ 'is-collapsed': collapsed }" aria-label="Admin navigation">
    <div class="sb-header">
      <a :href="route('dashboard')" class="sb-logo">
        <img :src="logo" alt="Admin home" />
      </a>
      <button
        type="button"
        class="sb-collapse"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!collapsed"
        @click="emit('toggle')"
      >
        <ChevronDown :size="16" class="sb-collapse-icon" />
      </button>
    </div>

    <div class="sb-scroll">
      <template v-for="(group, gi) in groups" :key="gi">
        <p v-if="group.label" class="sb-group">{{ group.label }}</p>

        <template v-for="item in group.items" :key="item.label">
          <!-- Leaf -->
          <a
            v-if="!item.children"
            :href="route(item.route)"
            class="sb-link"
            :class="{ 'is-active': itemActive(item) }"
            :title="collapsed ? item.label : undefined"
          >
            <i :data-lucide="item.icon" class="sb-icon"></i>
            <span class="sb-label">{{ item.label }}</span>
            <span v-if="badgeCount(item) > 0" class="sb-badge" :title="badgeLabel(item)">{{ badgeCount(item) }}</span>
          </a>

          <!-- Parent with children -->
          <div v-else class="sb-branch">
            <button
              type="button"
              class="sb-link sb-parent"
              :class="{ 'is-active': parentActive(item), 'is-open': isOpen(item) }"
              :aria-expanded="isOpen(item)"
              :title="collapsed ? item.label : undefined"
              @click="toggle(item)"
            >
              <i :data-lucide="item.icon" class="sb-icon"></i>
              <span class="sb-label">{{ item.label }}</span>
              <span v-if="badgeCount(item) > 0" class="sb-badge" :title="badgeLabel(item)">{{ badgeCount(item) }}</span>
              <ChevronDown :size="14" class="sb-chevron" :class="{ 'is-open': isOpen(item) }" />
            </button>

            <div v-show="isOpen(item)" class="sb-children">
              <a
                v-for="child in item.children"
                :key="child.label"
                :href="route(child.route)"
                class="sb-link sb-child"
                :class="{ 'is-active': itemActive(child) }"
              >
                <span class="sb-dot" aria-hidden="true"></span>
                <span class="sb-label">{{ child.label }}</span>
                <span v-if="child.badge && (page.props[child.badge] ?? 0) > 0" class="sb-badge" :title="badgeLabel(child)">
                  {{ page.props[child.badge] }}
                </span>
              </a>
            </div>
          </div>
        </template>
      </template>
    </div>

    <p v-if="!collapsed" class="sb-version">v{{ version }}</p>
  </nav>
</template>

<style scoped>
.sb {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  flex-shrink: 0;
}

.sb-logo img { max-width: 120px; height: auto; }
.sb.is-collapsed .sb-logo img { max-width: 40px; }

.sb-collapse {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .65);
  cursor: pointer;
}

.sb-collapse:hover { background: rgba(255, 255, 255, .16); color: #fff; }
.sb-collapse-icon { transform: rotate(90deg); }
.sb.is-collapsed .sb-collapse-icon { transform: rotate(-90deg); }

.sb-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--sp-2) var(--sp-5);

  /* The OS default draws light chrome on a dark sidebar. This is a thin
     translucent thumb on no track: faint at rest so it does not compete with
     the navigation, and clearer once the pointer is in the sidebar. */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, .16) transparent;
}

.sb-scroll::-webkit-scrollbar {
  width: 6px;
}

.sb-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sb-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, .16);
  border-radius: 999px;
  transition: background-color .18s ease;
}

/* Brighter once the pointer is anywhere in the sidebar, so the affordance
   appears when it is wanted without flickering as the pointer crosses rows. */
.sb:hover .sb-scroll {
  scrollbar-color: rgba(255, 255, 255, .3) transparent;
}

.sb:hover .sb-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, .3);
}

.sb-scroll::-webkit-scrollbar-thumb:hover,
.sb-scroll::-webkit-scrollbar-thumb:active {
  background-color: rgba(255, 255, 255, .48);
}

/* Collapsed to icons there is barely any width to spare, and the rail reads
   as a solid strip — a visible bar there is just noise. */
.sb.is-collapsed .sb-scroll {
  scrollbar-width: none;
}

.sb.is-collapsed .sb-scroll::-webkit-scrollbar {
  width: 0;
}

.sb-group {
  margin: var(--sp-4) 0 var(--sp-1);
  padding: 0 var(--sp-3);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, .38);
}

.sb.is-collapsed .sb-group { text-align: center; padding: 0; overflow: hidden; }

.sb-link {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  padding: 9px var(--sp-3);
  border: 0;
  border-radius: var(--r-sm);
  background: none;
  color: rgba(255, 255, 255, .78);
  font-size: var(--fs-md);
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.sb-link:hover { background: rgba(255, 255, 255, .08); color: #fff; }
.sb-link:focus-visible { outline: 2px solid rgba(255, 255, 255, .6); outline-offset: -2px; }

/* Active state uses a rail plus a tinted ground, not colour alone. */
.sb-link.is-active {
  background: rgba(255, 255, 255, .12);
  color: #fff;
  font-weight: 600;
}

.sb-link.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #fff;
}

.sb-icon { width: 18px; height: 18px; flex-shrink: 0; }
.sb-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sb-badge {
  flex-shrink: 0;
  min-width: 20px;
  padding: 1px 6px;
  border-radius: var(--r-full);
  background: var(--st-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.sb-chevron { flex-shrink: 0; opacity: .5; transition: transform var(--dur) var(--ease); }
.sb-chevron.is-open { transform: rotate(180deg); }

.sb-children { padding-left: var(--sp-5); }

.sb-child { padding: 7px var(--sp-3); font-size: var(--fs-sm); }

.sb-dot {
  width: 5px;
  height: 5px;
  border-radius: var(--r-full);
  background: currentColor;
  opacity: .45;
  flex-shrink: 0;
}

.sb-child.is-active .sb-dot { opacity: 1; }

.sb-version {
  flex-shrink: 0;
  margin: 0;
  padding: var(--sp-2) var(--sp-4);
  border-top: 1px solid rgba(255, 255, 255, .08);
  font-size: 11px;
  color: rgba(255, 255, 255, .35);
}

/* Collapsed: icons only, labels revealed by the title tooltip. */
.sb.is-collapsed .sb-label,
.sb.is-collapsed .sb-chevron,
.sb.is-collapsed .sb-children { display: none; }

.sb.is-collapsed .sb-link { justify-content: center; padding-left: 0; padding-right: 0; }

.sb.is-collapsed .sb-badge {
  position: absolute;
  top: 3px;
  right: 6px;
  min-width: 16px;
  padding: 0 4px;
  font-size: 10px;
}
</style>
