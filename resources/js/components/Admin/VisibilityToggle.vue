<script setup>
/**
 * Active / Hidden button for the top of a section. One switch for both the
 * desktop and the mobile version of the storefront.
 */
import { Eye, EyeOff } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Boolean, default: true },
  switchOnly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button
    type="button"
    class="vt-btn"
    :class="[modelValue ? 'is-on' : 'is-off', { 'is-switch': switchOnly }]"
    :role="switchOnly ? 'switch' : undefined"
    :aria-checked="switchOnly ? modelValue : undefined"
    :aria-pressed="switchOnly ? undefined : modelValue"
    :aria-label="switchOnly ? 'Section visibility' : undefined"
    :title="modelValue ? 'Shown on desktop and mobile — click to hide' : 'Hidden on desktop and mobile — click to show'"
    @click.stop="emit('update:modelValue', !modelValue)"
  >
    <span v-if="switchOnly" class="vt-thumb" aria-hidden="true"></span>
    <template v-else>
      <component :is="modelValue ? Eye : EyeOff" :size="13" />
      {{ modelValue ? 'Active' : 'Hidden' }}
    </template>
  </button>
</template>

<style scoped>
.vt-btn {
  display: inline-flex; align-items: center; gap: 5px; flex: none;
  height: 28px; padding: 0 11px; border-radius: 999px;
  font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap; cursor: pointer;
  border: 1px solid transparent; transition: background-color .15s ease, color .15s ease;
}
.vt-btn.is-on { background: #eef4e6; color: #1a2110; border-color: #cfdcbd; }
.vt-btn.is-on:hover { background: #e2ecd5; }
.vt-btn.is-off { background: #f1efec; color: #8b847d; border-color: #e2ddd6; }
.vt-btn.is-off:hover { background: #e9e5e0; color: #5f5952; }
.vt-btn.is-switch {
  position: relative;
  width: 40px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 999px;
}
.vt-btn.is-switch.is-on { background: var(--admin-green-600, #252f17); }
.vt-btn.is-switch.is-off { background: #cbd1c5; }
.vt-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
  transition: transform .15s ease;
}
.vt-btn.is-on .vt-thumb { transform: translateX(18px); }
.vt-btn.is-switch:focus-visible { outline: 2px solid var(--admin-green-600, #252f17); outline-offset: 3px; }
</style>
