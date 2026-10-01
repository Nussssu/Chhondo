<script setup>
/**
 * Distinguishes "nothing here yet" from "nothing matches your filter" —
 * the two need different words and different actions, and a blank table
 * gives neither.
 */
import { Inbox, SearchX } from 'lucide-vue-next'

defineProps({
  title:    { type: String, default: '' },
  message:  { type: String, default: '' },
  // 'empty' → nothing exists yet · 'filtered' → a search/filter excluded everything
  variant:  { type: String, default: 'empty' },
})
</script>

<template>
  <div class="es">
    <div class="es-icon" aria-hidden="true">
      <slot name="icon">
        <component :is="variant === 'filtered' ? SearchX : Inbox" :size="26" />
      </slot>
    </div>

    <p class="es-title">
      {{ title || (variant === 'filtered' ? 'No matches' : 'Nothing here yet') }}
    </p>
    <p class="es-message">
      {{ message || (variant === 'filtered'
        ? 'Try a different search term or clear your filters.'
        : 'Records will appear here once they are created.') }}
    </p>

    <div v-if="$slots.action" class="es-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.es {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--sp-2);
  padding: var(--sp-7) var(--sp-5);
}

.es-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--sp-2);
  border-radius: var(--r-full);
  background: var(--surface-sunk);
  color: var(--text-faint);
}

.es-title {
  margin: 0;
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text);
}

.es-message {
  margin: 0;
  max-width: 46ch;
  font-size: var(--fs-md);
  color: var(--text-muted);
}

.es-action { margin-top: var(--sp-3); }
</style>
