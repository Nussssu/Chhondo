import { ref } from 'vue'

/**
 * Reorder an array ref by dragging its tiles, or with the arrow keys.
 *
 * The array is rearranged live while dragging, so the tiles move under the
 * pointer and the order the operator lets go on is the order that is saved —
 * the array itself is the sequence, there is no separate position field.
 *
 * Bind the returned handlers on each tile:
 *   <div v-for="(img, i) in list" draggable="true"
 *        @dragstart="onDragStart(i, $event)" @dragover.prevent="onDragOver(i)"
 *        @drop.prevent @dragend="onDragEnd" @keydown="onKeydown(i, $event)">
 */
export function useDragSort(list) {
  const dragIndex = ref(null)

  function move(from, to) {
    if (from === to || to < 0 || to >= list.value.length) return
    const items = [...list.value]
    const [item] = items.splice(from, 1)
    items.splice(to, 0, item)
    list.value = items
  }

  function onDragStart(index, event) {
    dragIndex.value = index
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      // Firefox will not start a drag without some data set.
      event.dataTransfer.setData('text/plain', String(index))
    }
  }

  function onDragOver(index) {
    if (dragIndex.value === null || dragIndex.value === index) return
    move(dragIndex.value, index)
    dragIndex.value = index
  }

  function onDragEnd() {
    dragIndex.value = null
  }

  // Keyboard and touch-screen fallback: focus a tile, then ← / →.
  function onKeydown(index, event) {
    const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key]
    if (!step) return
    event.preventDefault()
    const to = index + step
    if (to < 0 || to >= list.value.length) return
    move(index, to)
    // Keep focus on the tile that moved so repeated presses keep moving it.
    const tiles = event.currentTarget?.parentElement?.children
    requestAnimationFrame(() => tiles?.[to]?.focus())
  }

  return { dragIndex, move, onDragStart, onDragOver, onDragEnd, onKeydown }
}
