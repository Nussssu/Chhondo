<script setup>
/**
 * A dropdown for the address form that always opens inside the screen.
 *
 * A native <select> draws its list as a desktop pop-up in a narrow browser
 * window or a device preview, and that list could spill past the screen
 * edge. This one keeps the same look as the other fields, opens within the
 * field's own width, and opens upward when there is no room below.
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  // { value: label }
  options: { type: Object, required: true },
  placeholder: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const upward = ref(false)
const root = ref(null)
const list = ref(null)

const label = computed(() => props.options[props.modelValue] ?? '')

function onOutside(e) {
  if (root.value && !root.value.contains(e.target)) close()
}

async function toggle() {
  if (open.value) return close()
  open.value = true
  document.addEventListener('pointerdown', onOutside)
  await nextTick()
  // Open upward when the list would run past the bottom of the screen.
  const box = root.value.getBoundingClientRect()
  const needed = list.value?.offsetHeight ?? 0
  upward.value = box.bottom + needed + 8 > window.innerHeight && box.top > needed + 8
  list.value?.querySelector('[aria-selected="true"], [role="option"]')?.focus()
}

function close() {
  open.value = false
  document.removeEventListener('pointerdown', onOutside)
}

function choose(value) {
  emit('update:modelValue', value)
  close()
  root.value?.querySelector('.as-trigger')?.focus()
}

function onListKey(e) {
  const items = [...list.value.querySelectorAll('[role="option"]')]
  const i = items.indexOf(document.activeElement)
  if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus() }
  if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(i - 1, 0)]?.focus() }
  if (e.key === 'Escape') { e.preventDefault(); close(); root.value?.querySelector('.as-trigger')?.focus() }
  if (e.key === 'Tab') close()
}

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="as-root">
    <button
      type="button"
      class="af-input as-trigger"
      :class="{ 'is-invalid': invalid, 'is-placeholder': !label }"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
      @keydown.down.prevent="!open && toggle()"
    >
      <span class="as-value">{{ label || placeholder }}</span>
      <svg class="as-caret" :class="{ 'is-open': open }" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <ul
      v-show="open"
      ref="list"
      class="as-list"
      :class="{ 'is-up': upward }"
      role="listbox"
      @keydown="onListKey"
    >
      <li
        v-for="(text, value) in options"
        :key="value"
        role="option"
        tabindex="-1"
        class="as-option"
        :class="{ 'is-selected': value === modelValue }"
        :aria-selected="value === modelValue"
        @click="choose(value)"
        @keydown.enter.prevent="choose(value)"
        @keydown.space.prevent="choose(value)"
      >
        {{ text }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.as-root { position: relative; width: 100%; }

/* Looks like the other fields (.af-input comes from AddressFields). */
.as-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8d4b0;
  border-radius: 9px;
  background: #fff;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}
.as-trigger:focus, .as-trigger[aria-expanded="true"] { border-color: #356019; }
.as-trigger.is-invalid { border-color: #dc2626; }
.as-trigger.is-placeholder .as-value { color: #9c9591; }
.as-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.as-caret { flex: none; color: #7a5c3e; transition: transform 0.15s ease; }
.as-caret.is-open { transform: rotate(180deg); }

/* Never wider than the field, so it cannot leave the screen sideways. */
.as-list {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 30;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  border: 1px solid #e8d4b0;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(44, 26, 14, 0.12);
}
.as-list.is-up { top: auto; bottom: calc(100% + 4px); }

.as-option {
  padding: 9px 10px;
  border-radius: 6px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
  cursor: pointer;
  outline: none;
}
.as-option:hover, .as-option:focus { background: #faf5e9; }
.as-option.is-selected { font-weight: 600; color: #356019; }
</style>
