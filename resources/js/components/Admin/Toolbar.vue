<script setup>
/**
 * The strip above a table: search on the left, filters in the middle,
 * actions on the right — in that order on every screen.
 *
 * When rows are selected it swaps to a selection bar, so bulk actions only
 * appear once they can actually be used.
 */
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue:      { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Search…' },
  showSearch:      { type: Boolean, default: true },
  // Set when search runs server-side: the value is applied on Enter, not per keystroke.
  searchOnEnter:   { type: Boolean, default: false },
  selectedCount:   { type: Number, default: 0 },
  perPage:         { type: [String, Number], default: null },
  perPageOptions:  { type: Array, default: () => [10, 20, 50, 100] },
})

const emit = defineEmits(['update:modelValue', 'search', 'update:perPage', 'clear-selection'])

function onInput(e) {
  const value = e.target.value
  emit('update:modelValue', value)
  if (!props.searchOnEnter) emit('search', value)
}

function onEnter() {
  emit('search', props.modelValue)
}

function clearSearch() {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <div class="tb" :class="{ 'is-selecting': selectedCount > 0 }">
    <template v-if="selectedCount > 0">
      <div class="tb-selection">
        <strong>{{ selectedCount }}</strong>
        <span>{{ selectedCount === 1 ? 'row selected' : 'rows selected' }}</span>
        <button type="button" class="tb-clear" @click="emit('clear-selection')">Clear</button>
      </div>
      <div class="tb-right">
        <slot name="bulk" />
      </div>
    </template>

    <template v-else>
      <div class="tb-left">
        <div v-if="showSearch" class="tb-search">
          <Search :size="15" class="tb-search-icon" aria-hidden="true" />
          <input
            type="search"
            class="tb-search-input"
            :value="modelValue"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            @input="onInput"
            @keyup.enter="onEnter"
          />
          <button
            v-if="modelValue"
            type="button"
            class="tb-search-clear"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <X :size="14" />
          </button>
        </div>

        <select
          v-if="perPage !== null"
          class="tb-select"
          aria-label="Rows per page"
          :value="perPage"
          @change="emit('update:perPage', $event.target.value)"
        >
          <option v-for="n in perPageOptions" :key="n" :value="n">{{ n }} per page</option>
        </select>

        <slot name="filters" />
      </div>

      <div class="tb-right">
        <slot name="actions" />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* One inline row: search and filters left, actions right. Controls share a
   height so they line up regardless of which page supplied them. */
.tb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2) var(--sp-3);
  flex-wrap: nowrap;
  margin-bottom: var(--sp-4);
  min-height: 38px;
}

.tb.is-selecting {
  padding: var(--sp-2) var(--sp-3);
  background: var(--accent-soft, #e6efdd);
  border-radius: var(--r-sm);
}

.tb-left,
.tb-right {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: nowrap;
  min-width: 0;
}

/* The filter side may overflow on narrow desktops; scroll it rather than
   letting it push the actions off the row. */
.tb-left { overflow-x: auto; scrollbar-width: thin; padding-bottom: 1px; }
.tb-right { flex-shrink: 0; }

/*
 * Page-supplied filters land in the #filters slot as plain <select>, <input>
 * or <button>. Normalise them here so every table's filter row matches
 * without each page restating the same sizing.
 */
.tb-left :deep(.form-select),
.tb-left :deep(.form-control),
.tb-left :deep(.btn),
.tb-right :deep(.btn) {
  height: 38px;
  min-height: 0; /* the height above (or a page's own) decides */
  flex-shrink: 0;
  white-space: nowrap;
}

.tb-left :deep(.form-select),
.tb-left :deep(.form-control) {
  width: auto;
  min-width: 140px;
  font-size: var(--fs-md);
  border-color: var(--line-strong);
  border-radius: var(--r-sm);
}

.tb-left :deep(.form-select:focus),
.tb-left :deep(.form-control:focus) {
  border-color: var(--admin-green-600);
  box-shadow: 0 0 0 3px rgba(37, 47, 23, 0.12);
}

.tb-right :deep(.btn) {
  display: inline-flex;
  align-items: center;
}

.tb-selection {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-md);
  color: var(--text);
}

.tb-clear {
  border: 0;
  background: none;
  padding: 0 var(--sp-1);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--admin-green-600);
  cursor: pointer;
  text-decoration: underline;
}

.tb-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 220px;
  max-width: 320px;
  min-width: 160px;
}

.tb-search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-faint);
  pointer-events: none;
}

.tb-search-input {
  width: 100%;
  height: 38px;
  padding: 0 32px 0 32px;
  font-size: var(--fs-md);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.tb-search-input::-webkit-search-cancel-button { display: none; }

.tb-search-input:focus {
  outline: none;
  border-color: var(--admin-green-600);
  box-shadow: 0 0 0 3px rgba(37, 47, 23, 0.12);
}

.tb-search-clear {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: var(--r-full);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
}

.tb-search-clear:hover { background: var(--surface-sunk); color: var(--text); }

.tb-select {
  height: 38px;
  padding: 0 var(--sp-3);
  font-size: var(--fs-md);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  cursor: pointer;
}

.tb-select:focus {
  outline: none;
  border-color: var(--admin-green-600);
  box-shadow: 0 0 0 3px rgba(37, 47, 23, 0.12);
}

/* Below tablet the single row stops fitting, so it wraps rather than
   forcing a horizontal scroll across the whole bar. */
@media (max-width: 767px) {
  .tb { flex-wrap: wrap; }
  .tb-left, .tb-right { flex-wrap: wrap; width: 100%; }
  .tb-left { overflow-x: visible; }
  .tb-right { justify-content: flex-end; }
  .tb-search { max-width: none; flex: 1 1 100%; }
}
</style>
