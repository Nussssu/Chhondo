import { reactive } from 'vue'

// Shared toast queue, rendered by components/Admin/ToastHost.vue (mounted once
// in AdminLayout). Previously this delegated to SweetAlert2's toast mode.
export const toasts = reactive([])

let nextId = 0

export function dismiss(id) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

/**
 * Show a toast.
 *
 * Signature is unchanged from the SweetAlert version — toast(tone, text) —
 * so all existing call sites keep working.
 *
 * @param {'success'|'error'|'warning'|'info'} tone
 * @param {string} text
 * @param {number} duration ms; errors linger longer because they are read
 */
export function toast(tone, text, duration) {
  const id = ++nextId
  const ms = duration ?? (tone === 'error' ? 6000 : 3500)

  toasts.push({ id, tone, text })

  // Cap the stack so a burst of failures cannot fill the screen.
  if (toasts.length > 4) toasts.shift()

  setTimeout(() => dismiss(id), ms)

  return id
}
