<script setup>
/**
 * Hand-orders the products a Product-section widget shows.
 *
 * The widget pulls its products live, which keeps a section current but leaves
 * no way to say "this one first". This asks the server for the same list the
 * storefront will resolve, lets it be dragged into order, and hands back the
 * ids — the widget stores them and the resolver renders to them.
 *
 * Drag-and-drop is the native HTML5 kind, matching the widget list on the
 * editor behind it rather than pulling in a library for one modal.
 */
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { GripVertical, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  // The widget being sequenced: source, category_id, limit, product_ids.
  block: { type: Object, required: true },
})

const emit = defineEmits(['close', 'save'])

const loading = ref(true)
const error = ref(null)
const items = ref([])
const limit = ref(props.block.limit ?? 4)

const opened = ref([])

const dragFrom = ref(null)
const dragOver = ref(null)

async function load() {
  loading.value = true
  error.value = null

  try {
    const { data } = await axios.get(route('admin.pages.widgets.product-section'), {
      params: {
        source: props.block.source,
        category_id: props.block.source === 'category' ? props.block.category_id : undefined,
        limit: props.block.limit,
        // Sent so the list comes back already in the saved order — the modal
        // opens showing what the page shows.
        product_ids: props.block.product_ids ?? [],
      },
    })

    items.value = data.products
    limit.value = data.limit
    // What the list opened as. Compared against on close, so a modal that was
    // only looked at does not claim unsaved changes.
    opened.value = data.products.map((i) => i.id)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'The product list could not be loaded.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

/** True once the list no longer matches the order it opened with. */
const dirty = computed(() =>
  items.value.some((item, i) => item.id !== opened.value[i])
)

function onDragStart(index, event) {
  dragFrom.value = index
  event.dataTransfer.effectAllowed = 'move'
  // Firefox ignores a drag that carries no payload.
  event.dataTransfer.setData('text/plain', String(index))
}

function onDragOver(index) {
  if (dragFrom.value !== null) dragOver.value = index
}

function onDrop(index) {
  const from = dragFrom.value
  dragFrom.value = null
  dragOver.value = null

  if (from === null || from === index) return

  const copy = [...items.value]
  const [moved] = copy.splice(from, 1)
  // Removing the dragged row shifts everything after it up by one.
  copy.splice(from < index ? index - 1 : index, 0, moved)
  items.value = copy
}

function onDragEnd() {
  dragFrom.value = null
  dragOver.value = null
}

/** Move a row with the keyboard, so the ordering is not mouse-only. */
function nudge(index, delta) {
  const target = index + delta
  if (target < 0 || target >= items.value.length) return

  const copy = [...items.value]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  items.value = copy
}

/** Drop the manual order and go back to whatever the source produces. */
function reset() {
  emit('save', [])
}

function save() {
  emit('save', items.value.map((i) => i.id))
}
</script>

<template>
  <FormModal
    title="Sequence"
    subtitle="Drag to set the order these products appear in on the page."
    size="lg"
    :dirty="dirty"
    @close="emit('close')"
  >
    <p v-if="loading" class="ps-note">Loading products…</p>
    <p v-else-if="error" class="ps-note is-error">{{ error }}</p>
    <p v-else-if="!items.length" class="ps-note">
      This widget resolves to no products yet. Choose a different source, or publish
      some products for this one.
    </p>

    <ol v-else class="ps-list" @dragend="onDragEnd">
      <template v-for="(item, i) in items" :key="item.id">
        <li
          v-if="i === limit"
          class="ps-cut"
          aria-hidden="true"
        >
          Shows {{ limit }} — everything below is out of view until the limit is raised
        </li>

        <li
          class="ps-row"
          :class="{ 'is-dragging': dragFrom === i, 'is-over': dragOver === i && dragFrom !== null, 'is-hidden': i >= limit }"
          draggable="true"
          @dragstart="onDragStart(i, $event)"
          @dragover.prevent="onDragOver(i)"
          @drop.prevent="onDrop(i)"
        >
          <span class="ps-grip" title="Drag to reorder"><GripVertical :size="16" /></span>
          <span class="ps-index">{{ i + 1 }}</span>

          <img v-if="item.image" :src="item.image" :alt="item.name" class="ps-thumb" />
          <span v-else class="ps-thumb is-empty" aria-hidden="true"></span>

          <span class="ps-name">{{ item.name }}</span>
          <span class="ps-price">{{ item.price }}</span>

          <span class="ps-keys">
            <button type="button" :disabled="i === 0" title="Move up" @click="nudge(i, -1)">↑</button>
            <button type="button" :disabled="i === items.length - 1" title="Move down" @click="nudge(i, 1)">↓</button>
          </span>
        </li>
      </template>
    </ol>

    <template #footer>
      <button
        v-if="(block.product_ids ?? []).length"
        type="button"
        class="btn btn-fig-secondary btn-fig-sm me-auto"
        title="Go back to the order the source produces"
        @click="reset"
      >
        <RotateCcw :size="14" class="me-1" /> Clear sequence
      </button>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="loading || !items.length" @click="save">
        Save sequence
      </button>
    </template>
  </FormModal>
</template>

<style scoped>
.ps-note {
  margin: 0;
  padding: var(--sp-5) 0;
  text-align: center;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.ps-note.is-error { color: var(--st-danger); }

.ps-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ps-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2);
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  margin-bottom: 6px;
  background: var(--surface);
  cursor: grab;
}

.ps-row.is-dragging { opacity: .45; }

.ps-row.is-over {
  border-color: var(--bs-primary, #356019);
  box-shadow: inset 0 2px 0 var(--bs-primary, #356019);
}

/* Below the widget's limit: still orderable, just not rendered on the page. */
.ps-row.is-hidden { background: var(--surface-sunk); color: var(--text-muted); }

.ps-grip { display: flex; color: var(--text-faint); }

.ps-index {
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.ps-thumb {
  flex-shrink: 0;
  width: 34px;
  height: 46px;
  border-radius: 4px;
  object-fit: cover;
  background: var(--surface-sunk);
}

.ps-thumb.is-empty { display: block; border: 1px dashed var(--line-strong); }

.ps-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--fs-md);
}

.ps-price {
  flex-shrink: 0;
  font-size: var(--fs-sm);
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.ps-keys { display: flex; flex-shrink: 0; gap: 2px; }

.ps-keys button {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text-muted);
  line-height: 1;
  cursor: pointer;
}

.ps-keys button:hover:not(:disabled) { background: var(--surface-sunk); color: var(--text); }
.ps-keys button:disabled { opacity: .35; cursor: not-allowed; }

.ps-cut {
  margin: var(--sp-3) 0 var(--sp-2);
  padding-top: var(--sp-2);
  border-top: 1px dashed var(--line-strong);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

@media (max-width: 575px) {
  .ps-price { display: none; }
}
</style>
