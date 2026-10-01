<script setup>
/**
 * Maps a status string to its semantic colour. One place to change what
 * "on delivery" looks like across the whole panel.
 *
 * Shape carries meaning alongside colour — a dot for live states, so the
 * pill is not relying on hue alone.
 */
import { computed } from 'vue'

const props = defineProps({
  status: { type: [String, Boolean, Number], default: '' },
  // Overrides the lookup when a screen has its own vocabulary.
  tone:   { type: String, default: '' },
  label:  { type: String, default: '' },
  dot:    { type: Boolean, default: true },
})

const TONES = {
  // Order lifecycle
  pending:      'warning',
  processed:    'info',
  'on delivery':'progress',
  shipped:      'progress',
  delivered:    'success',
  completed:    'success',
  cancelled:    'danger',
  canceled:     'danger',
  returned:     'return',
  incomplete:   'neutral',
  // Publication / record state
  active:       'success',
  published:    'success',
  approved:     'success',
  inactive:     'neutral',
  hidden:       'neutral',
  draft:        'neutral',
  unpublished:  'neutral',
  // Payment
  paid:         'success',
  unpaid:       'danger',
  partial:      'warning',
  due:          'warning',
  refunded:     'return',
  failed:       'danger',
}

const key = computed(() => String(props.status ?? '').trim().toLowerCase())

const tone = computed(() => {
  if (props.tone) return props.tone
  if (typeof props.status === 'boolean') return props.status ? 'success' : 'neutral'
  return TONES[key.value] ?? 'neutral'
})

const text = computed(() => {
  if (props.label) return props.label
  if (typeof props.status === 'boolean') return props.status ? 'Active' : 'Inactive'
  const raw = String(props.status ?? '')
  return raw.charAt(0).toUpperCase() + raw.slice(1)
})

// Live states get the dot; settled ones read as finished without it.
const showDot = computed(() =>
  props.dot && ['warning', 'info', 'progress'].includes(tone.value)
)
</script>

<template>
  <span class="pill" :class="`is-${tone}`">
    <span v-if="showDot" class="pill-dot" aria-hidden="true"></span>
    {{ text }}
  </span>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: var(--r-full);
  font-size: var(--fs-xs);
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--r-full);
  background: currentColor;
}

.pill.is-neutral  { background: var(--st-neutral-soft);  color: var(--st-neutral); }
.pill.is-info     { background: var(--st-info-soft);     color: var(--st-info); }
.pill.is-progress { background: var(--st-progress-soft); color: var(--st-progress); }
.pill.is-success  { background: var(--st-success-soft);  color: var(--st-success); }
.pill.is-warning  { background: var(--st-warning-soft);  color: var(--st-warning); }
.pill.is-danger   { background: var(--st-danger-soft);   color: var(--st-danger); }
.pill.is-return   { background: var(--st-return-soft);   color: var(--st-return); }
</style>
