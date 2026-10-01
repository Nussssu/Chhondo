<script setup>
/**
 * Tab strip for a settings area.
 *
 * Each tab is its own screen (and its own route), so a tab keeps working like
 * the page it always was — the strip just gathers them under one nav entry
 * instead of a sidebar dropdown.
 */
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps({
  // [{ label, route, permission? }]
  tabs: { type: Array, required: true },
})

const page = usePage()

const can = (permission) =>
  !permission || Boolean(page.props.adminPermissions?.[permission])

const visible = computed(() => props.tabs.filter((tab) => can(tab.permission)))

const isActive = (tab) => {
  try {
    return route().current(tab.route)
  } catch (e) {
    return false
  }
}
</script>

<template>
  <nav v-if="visible.length > 1" class="settings-tabs">
    <Link
      v-for="tab in visible"
      :key="tab.route"
      :href="route(tab.route)"
      class="settings-tab"
      :class="{ 'is-active': isActive(tab) }"
    >
      {{ tab.label }}
    </Link>
  </nav>
</template>

<style scoped>
.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--sp-4, 16px);
  padding-bottom: 2px;
  border-bottom: 1px solid var(--line, #e9e4dd);
  overflow-x: auto;
}

.settings-tab {
  position: relative;
  padding: 9px 16px;
  border-radius: 8px 8px 0 0;
  color: var(--ink-muted, #6b7280);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.settings-tab:hover {
  background: var(--surface-2, #f6f2ec);
  color: var(--ink, #2c1a0e);
}

.settings-tab.is-active {
  color: #2c5015;
  font-weight: 600;
}

.settings-tab.is-active::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -3px;
  height: 2px;
  border-radius: 2px;
  background: #356019;
}
</style>
