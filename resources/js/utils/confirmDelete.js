import { reactive } from 'vue'

// Shared confirmation state, rendered by components/Admin/ConfirmDialog.vue
// (mounted once in AdminLayout). Previously this called SweetAlert2; the
// dialog is now the panel's own so confirmations match everything else.
export const confirmState = reactive({
  open: false,
  title: '',
  text: '',
  confirmText: '',
  cancelText: 'Cancel',
  tone: 'danger',
})

let pending = null

export function resolveConfirm(result) {
  confirmState.open = false
  pending?.(result)
  pending = null
}

/**
 * Ask the user to confirm a destructive action.
 * Returns a promise resolving to true (confirmed) or false (dismissed).
 *
 * The signature is unchanged from the SweetAlert version, so all existing
 * `await confirmDelete({ ... })` call sites keep working.
 */
export function confirmDelete({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'Cancel',
  tone = 'danger',
} = {}) {
  // A second call while one is open would strand the first promise.
  if (pending) resolveConfirm(false)

  Object.assign(confirmState, {
    open: true,
    title,
    text,
    confirmText: confirmButtonText,
    cancelText: cancelButtonText,
    tone,
  })

  return new Promise((resolve) => {
    pending = resolve
  })
}
