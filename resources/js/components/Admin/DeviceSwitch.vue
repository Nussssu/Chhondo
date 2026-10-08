<script setup>
/**
 * Desktop | Mobile switch for the content editors. The storefront content is
 * shared by both versions; the switch decides which device's pieces the
 * editor shows (a desktop or a mobile banner, the mobile drawer's links…), so
 * each version can be checked and edited on its own. The choice is remembered
 * per editor in this browser.
 */
import { watch } from 'vue'
import { Monitor, Smartphone } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: 'desktop' },
  // localStorage key, so each editor remembers its own choice.
  storageKey: { type: String, default: '' },
  note: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

if (props.storageKey) {
  try {
    const saved = localStorage.getItem(`device:${props.storageKey}`)
    if (saved === 'desktop' || saved === 'mobile') emit('update:modelValue', saved)
  } catch {}
}

watch(() => props.modelValue, (v) => {
  if (!props.storageKey) return
  try { localStorage.setItem(`device:${props.storageKey}`, v) } catch {}
})

const OPTIONS = [
  { value: 'desktop', label: 'Desktop', icon: Monitor },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
]
</script>

<template>
  <div class="dv-bar">
    <div class="dv-switch" role="tablist" aria-label="Device version">
      <button
        v-for="o in OPTIONS"
        :key="o.value"
        type="button"
        role="tab"
        :aria-selected="modelValue === o.value"
        :class="{ 'is-active': modelValue === o.value }"
        @click="emit('update:modelValue', o.value)"
      >
        <component :is="o.icon" :size="15" /> {{ o.label }}
      </button>
    </div>
    <p v-if="note" class="dv-note">{{ note }}</p>
  </div>
</template>

<style scoped>
.dv-bar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px;
  margin-bottom: 16px;
}
.dv-switch {
  display: inline-flex; gap: 4px; padding: 4px;
  background: var(--surface, #fff); border: 1px solid var(--line, #e7e2d6); border-radius: 10px;
}
.dv-switch button {
  display: inline-flex; align-items: center; gap: 6px;
  border: 0; background: transparent; padding: 6px 14px; border-radius: 7px;
  font-size: 13px; font-weight: 600; color: var(--text-muted, #6b6b5f); cursor: pointer; white-space: nowrap;
}
.dv-switch button.is-active { background: var(--admin-green-600, #252f17); color: #fff; }
.dv-note { margin: 0; font-size: 12px; color: var(--text-muted, #6b6b5f); flex: 1 1 260px; }
</style>
