<template>
  <div class="dropdown status-dropdown">
    <button
      ref="trigger"
      class="table-pill-btn dropdown-toggle"
      :class="statusMeta(order.order_status).btn"
      type="button"
      :data-bs-toggle="portal ? undefined : 'dropdown'"
      :aria-expanded="portal ? opened : false"
      :aria-controls="portal ? menuId : undefined"
      :aria-haspopup="portal ? 'menu' : undefined"
      :disabled="saving"
      @click="portal && toggleMenu()"
      @keydown.down.prevent="portal && openMenu()"
    >
      {{ capitalize(order.order_status) }}
    </button>
    <Teleport to="body" :disabled="!portal">
      <ul
        v-if="!portal || opened"
        :id="menuId"
        ref="menu"
        class="dropdown-menu"
        :class="{ 'show order-status-popover': portal }"
        :style="portal ? menuStyle : undefined"
        :role="portal ? 'menu' : undefined"
        :aria-label="portal ? 'Order status' : undefined"
        @keydown="portal && onMenuKeydown($event)"
      >
        <li v-for="status in STATUS_OPTIONS" :key="status" :role="portal ? 'none' : undefined">
          <a
            class="dropdown-item"
            :class="portal ? undefined : statusMeta(status).item"
            href="#"
            :role="portal ? 'menuitemradio' : undefined"
            :aria-checked="portal ? order.order_status === status : undefined"
            @click.prevent="updateStatus(status)"
          >
            {{ capitalize(status === 'shipped' ? 'Partial delivery' : status) }}
          </a>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup>
import axios from 'axios'
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'
import { capitalize } from '@/utils/orderFormatting'
import { STATUS_OPTIONS, statusMeta } from '@/utils/orderStatusMeta'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, required: true },
  portal: { type: Boolean, default: false },
})

const trigger = ref(null)
const menu = ref(null)
const opened = ref(false)
const saving = ref(false)
const menuId = `order-status-${useId()}`
const menuStyle = ref({ visibility: 'hidden' })

function positionMenu() {
  if (!opened.value || !trigger.value || !menu.value) return
  const anchor = trigger.value.getBoundingClientRect()
  const viewport = window.visualViewport
  const leftEdge = viewport?.offsetLeft ?? 0
  const topEdge = viewport?.offsetTop ?? 0
  const width = viewport?.width ?? window.innerWidth
  const height = viewport?.height ?? window.innerHeight
  if (anchor.bottom <= topEdge || anchor.top >= topEdge + height || anchor.right <= leftEdge || anchor.left >= leftEdge + width) {
    closeMenu()
    return
  }
  const margin = 8
  const popupWidth = Math.min(Math.max(anchor.width, 184), width - margin * 2)
  const below = Math.max(0, topEdge + height - anchor.bottom - margin - 4)
  const above = Math.max(0, anchor.top - topEdge - margin - 4)
  const naturalHeight = menu.value.scrollHeight
  const flip = below < naturalHeight && above > below
  const available = flip ? above : below
  const popupHeight = Math.min(naturalHeight, available)
  menuStyle.value = {
    position: 'fixed',
    left: `${Math.max(leftEdge + margin, Math.min(anchor.left, leftEdge + width - popupWidth - margin))}px`,
    top: `${flip ? Math.max(topEdge + margin, anchor.top - popupHeight - 4) : anchor.bottom + 4}px`,
    width: `${popupWidth}px`,
    maxHeight: `${available}px`,
    visibility: 'visible',
  }
}

function detachListeners() {
  document.removeEventListener('pointerdown', onOutsidePointer)
  window.removeEventListener('scroll', positionMenu, true)
  window.removeEventListener('resize', positionMenu)
  window.visualViewport?.removeEventListener('resize', positionMenu)
  window.visualViewport?.removeEventListener('scroll', positionMenu)
}

function closeMenu(restoreFocus = false) {
  opened.value = false
  detachListeners()
  if (restoreFocus) trigger.value?.focus()
}

function onOutsidePointer(event) {
  if (!trigger.value?.contains(event.target) && !menu.value?.contains(event.target)) closeMenu()
}

async function openMenu() {
  if (!props.portal || opened.value || saving.value) return
  opened.value = true
  menuStyle.value = { visibility: 'hidden' }
  await nextTick()
  if (!opened.value) return
  positionMenu()
  document.addEventListener('pointerdown', onOutsidePointer)
  window.addEventListener('scroll', positionMenu, true)
  window.addEventListener('resize', positionMenu)
  window.visualViewport?.addEventListener('resize', positionMenu)
  window.visualViewport?.addEventListener('scroll', positionMenu)
  menu.value?.querySelector('[aria-checked="true"]')?.focus()
  if (!menu.value?.contains(document.activeElement)) menu.value?.querySelector('.dropdown-item')?.focus()
}

function toggleMenu() {
  if (opened.value) closeMenu(true)
  else openMenu()
}

function onMenuKeydown(event) {
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); return }
  if (event.key === 'Tab') { closeMenu(); return }
  const items = [...menu.value.querySelectorAll('.dropdown-item')]
  const index = items.indexOf(document.activeElement)
  let next
  if (event.key === 'ArrowDown') next = (index + 1) % items.length
  if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = items.length - 1
  if (next !== undefined) { event.preventDefault(); items[next].focus() }
  if (event.key === ' ') { event.preventDefault(); document.activeElement?.click() }
}

onBeforeUnmount(() => { if (typeof document !== 'undefined') detachListeners() })

async function updateStatus(status) {
  if (saving.value) return
  if (props.portal) closeMenu(true)
  saving.value = true
  try {
    await axios.post(route('admin.orders.updateStatus'), { order_id: props.order.id, status })
    props.order.order_status = status
    toast('success', 'Order status updated')
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Failed to update status')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.order-status-popover {
  z-index: 1080;
  min-width: 0;
  margin: 0;
  padding: 5px;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: 8px;
  background: var(--surface, #fff);
  box-shadow: 0 8px 24px rgba(26, 33, 16, .16);
  font-size: 12px;
}
.order-status-popover .dropdown-item {
  padding: 8px 10px;
  border-radius: 4px;
  background: var(--surface, #fff);
  color: var(--text, #1a1817);
  white-space: nowrap;
}
.order-status-popover .dropdown-item:hover,
.order-status-popover .dropdown-item:focus,
.order-status-popover .dropdown-item:active {
  background: var(--surface-sunk, #f5f4f2);
  color: var(--text, #1a1817);
}
</style>
