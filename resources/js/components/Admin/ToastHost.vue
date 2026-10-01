<script setup>
/**
 * The panel's own toasts, replacing SweetAlert2's toast mode.
 *
 * Mounted once in AdminLayout and driven by utils/toast.js, so every
 * existing `toast('success', '…')` call site picks it up unchanged.
 */
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-vue-next'
import { toasts, dismiss } from '@/utils/toast'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}
</script>

<template>
  <Teleport to="body">
    <div class="th" role="status" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="th">
        <div v-for="t in toasts" :key="t.id" class="th-item" :class="`is-${t.tone}`">
          <component :is="ICONS[t.tone] ?? Info" :size="18" class="th-icon" aria-hidden="true" />
          <p class="th-text">{{ t.text }}</p>
          <button type="button" class="th-close" aria-label="Dismiss" @click="dismiss(t.id)">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.th {
  position: fixed;
  top: var(--sp-4);
  right: var(--sp-4);
  z-index: 1090; /* above modals — a save confirmation must be visible over one */
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  width: min(360px, calc(100vw - 2 * var(--sp-4)));
  pointer-events: none;
}

.th-item {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border-radius: var(--r-sm);
  border-left: 3px solid var(--tone, var(--st-neutral));
  background: var(--surface);
  box-shadow: var(--el-2);
  pointer-events: auto;
}

.th-item.is-success { --tone: var(--st-success); }
.th-item.is-error   { --tone: var(--st-danger); }
.th-item.is-warning { --tone: var(--st-warning); }
.th-item.is-info    { --tone: var(--st-info); }

.th-icon { color: var(--tone); flex-shrink: 0; margin-top: 1px; }

.th-text {
  flex: 1;
  margin: 0;
  font-size: var(--fs-md);
  line-height: 1.45;
  color: var(--text);
}

.th-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: none;
  color: var(--text-faint);
  cursor: pointer;
}

.th-close:hover { background: var(--surface-sunk); color: var(--text); }

.th-enter-active,
.th-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.th-enter-from   { opacity: 0; transform: translateX(12px); }
.th-leave-to     { opacity: 0; transform: translateX(12px); }
.th-move         { transition: transform var(--dur) var(--ease); }

@media (max-width: 575px) {
  .th { top: auto; bottom: var(--sp-4); left: var(--sp-4); right: var(--sp-4); width: auto; }
}
</style>
