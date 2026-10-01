<script setup>
/**
 * The one modal in the admin panel.
 *
 * Replaces the two byte-identical BaseModal copies, and adds what both were
 * missing: it teleports to <body> (so it can never be clipped by a scrolled
 * or positioned ancestor), closes on Esc, locks body scroll, traps focus,
 * restores focus to whatever opened it, and can guard against closing with
 * unsaved changes.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // Controlled either by v-if at the call site (default true) or :open.
  open:        { type: Boolean, default: true },
  title:       { type: String,  default: '' },
  subtitle:    { type: String,  default: '' },
  // sm 420 · md 560 · lg 800 · xl 1040
  size:        { type: String,  default: 'md' },
  showFooter:  { type: Boolean, default: true },
  // Disables backdrop/Esc dismissal — use while a save is in flight.
  busy:        { type: Boolean, default: false },
  // When true, dismissing asks for confirmation first.
  dirty:       { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

const panel = ref(null)
let lastFocused = null

const sizeClass = computed(() => `is-${props.size}`)

function requestClose(source) {
  if (props.busy) return
  if (source === 'backdrop' && !props.closeOnBackdrop) return
  if (props.dirty && !window.confirm('Discard your unsaved changes?')) return
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    requestClose('esc')
    return
  }
  if (e.key !== 'Tab' || !panel.value) return

  // Focus trap: keep Tab cycling inside the dialog.
  const focusable = panel.value.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function activate() {
  if (typeof document === 'undefined') return
  lastFocused = document.activeElement
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown, true)

  nextTick(() => {
    const target =
      panel.value?.querySelector('[data-autofocus]') ??
      panel.value?.querySelector('input:not([type="hidden"]), select, textarea') ??
      panel.value
    target?.focus?.()
  })
}

function deactivate() {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown, true)
  // Send focus back to the row/button that opened the modal.
  lastFocused?.focus?.()
  lastFocused = null
}

// Activation runs after mount rather than immediately in setup, so the panel
// ref exists when focus is moved into it.
watch(() => props.open, (isOpen) => (isOpen ? activate() : deactivate()))

onMounted(() => {
  if (props.open) activate()
})

onBeforeUnmount(deactivate)
</script>

<template>
  <Teleport to="body">
    <Transition name="fm">
      <div
        v-if="open"
        class="fm-backdrop"
        @mousedown.self="requestClose('backdrop')"
      >
        <div
          ref="panel"
          class="fm-panel"
          :class="sizeClass"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <header class="fm-head">
            <div class="fm-head-text">
              <slot name="header">
                <h2 class="fm-title">{{ title }}</h2>
                <p v-if="subtitle" class="fm-subtitle">{{ subtitle }}</p>
              </slot>
            </div>
            <button
              type="button"
              class="fm-close"
              aria-label="Close"
              :disabled="busy"
              @click="requestClose('button')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <div class="fm-body">
            <slot />
          </div>

          <footer v-if="showFooter" class="fm-foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  background: rgba(21, 27, 17, 0.55);
}

.fm-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(90vh, 900px);
  background: var(--surface);
  border-radius: var(--r-md);
  box-shadow: var(--el-2);
  overflow: hidden;
}

.fm-panel:focus { outline: none; }

.fm-panel.is-sm { max-width: 420px; }
.fm-panel.is-md { max-width: 560px; }
.fm-panel.is-lg { max-width: 800px; }
.fm-panel.is-xl { max-width: 1040px; }

.fm-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.fm-head-text { min-width: 0; }

.fm-title {
  margin: 0;
  font-size: var(--fs-lg);
  line-height: var(--lh-tight);
  font-weight: 600;
  color: var(--text);
}

.fm-subtitle {
  margin: var(--sp-1) 0 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.fm-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.fm-close:hover:not(:disabled) {
  background: var(--surface-sunk);
  color: var(--text);
}

.fm-close:disabled { opacity: .5; cursor: not-allowed; }

.fm-body {
  padding: var(--sp-5);
  overflow-y: auto;
  flex: 1 1 auto;
}

.fm-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-5);
  border-top: 1px solid var(--line);
  background: var(--surface-alt);
  flex-shrink: 0;
}

.fm-enter-active,
.fm-leave-active { transition: opacity var(--dur) var(--ease); }
.fm-enter-from,
.fm-leave-to { opacity: 0; }

.fm-enter-active .fm-panel { transition: transform var(--dur) var(--ease); }
.fm-enter-from .fm-panel { transform: translateY(8px); }

@media (max-width: 575px) {
  .fm-backdrop { padding: 0; align-items: flex-end; }
  .fm-panel {
    max-width: none;
    max-height: 92vh;
    border-radius: var(--r-md) var(--r-md) 0 0;
  }
}
</style>
