<script setup>
/**
 * The panel's own confirmation dialog, styled like the rest of the admin
 * instead of like a third-party alert.
 *
 * Mounted once in AdminLayout and driven by the shared store in
 * utils/confirmDelete.js, so every existing `await confirmDelete()` call
 * site picks it up without changing.
 */
import { computed } from 'vue'
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-vue-next'
import { confirmState, resolveConfirm } from '@/utils/confirmDelete'

const tone = computed(() => confirmState.tone ?? 'danger')

const icon = computed(() => ({
  danger: Trash2,
  warning: AlertTriangle,
  question: HelpCircle,
}[tone.value] ?? HelpCircle))

function onKeydown(e) {
  if (e.key === 'Escape') resolveConfirm(false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cd">
      <div
        v-if="confirmState.open"
        class="cd-backdrop"
        role="alertdialog"
        aria-modal="true"
        :aria-label="confirmState.title"
        tabindex="-1"
        @mousedown.self="resolveConfirm(false)"
        @keydown="onKeydown"
      >
        <div class="cd-panel" :class="`is-${tone}`">
          <div class="cd-icon" aria-hidden="true">
            <component :is="icon" :size="22" />
          </div>

          <h2 class="cd-title">{{ confirmState.title }}</h2>
          <p v-if="confirmState.text" class="cd-text">{{ confirmState.text }}</p>

          <div class="cd-actions">
            <button type="button" class="cd-btn is-ghost" @click="resolveConfirm(false)">
              {{ confirmState.cancelText }}
            </button>
            <button
              type="button"
              class="cd-btn is-confirm"
              autofocus
              @click="resolveConfirm(true)"
            >
              {{ confirmState.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1070; /* above FormModal — a confirm can be raised from inside one */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  background: rgba(21, 27, 17, 0.55);
}

.cd-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--sp-2);
  width: 100%;
  max-width: 400px;
  padding: var(--sp-6) var(--sp-5) var(--sp-5);
  background: var(--surface);
  border-radius: var(--r-md);
  box-shadow: var(--el-2);
}

.cd-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: var(--sp-2);
  border-radius: var(--r-full);
}

.is-danger   .cd-icon { background: var(--st-danger-soft);  color: var(--st-danger); }
.is-warning  .cd-icon { background: var(--st-warning-soft); color: var(--st-warning); }
.is-question .cd-icon { background: var(--st-info-soft);    color: var(--st-info); }

.cd-title {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--text);
}

.cd-text {
  margin: 0;
  font-size: var(--fs-md);
  color: var(--text-muted);
}

.cd-actions {
  display: flex;
  gap: var(--sp-2);
  width: 100%;
  margin-top: var(--sp-4);
}

.cd-btn {
  flex: 1;
  height: 40px;
  padding: 0 var(--sp-4);
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  font-size: var(--fs-md);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.cd-btn:focus-visible { outline: 2px solid var(--admin-green-600); outline-offset: 2px; }

.cd-btn.is-ghost {
  background: var(--surface);
  border-color: var(--line-strong);
  color: var(--text);
}

.cd-btn.is-ghost:hover { background: var(--surface-sunk); }

.is-danger   .cd-btn.is-confirm { background: var(--st-danger);  color: #fff; }
.is-warning  .cd-btn.is-confirm { background: var(--st-warning); color: #fff; }
.is-question .cd-btn.is-confirm { background: var(--admin-green-600); color: #fff; }

.cd-btn.is-confirm:hover { filter: brightness(0.92); }

.cd-enter-active,
.cd-leave-active { transition: opacity var(--dur) var(--ease); }
.cd-enter-from,
.cd-leave-to { opacity: 0; }
</style>
