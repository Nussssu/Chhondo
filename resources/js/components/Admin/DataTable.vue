<script setup>
/**
 * The one table in the admin panel.
 *
 * Replaces six competing table conventions and, on the seven screens that
 * used it, jQuery DataTables — which owned the same DOM as Vue and lost its
 * state on every Inertia visit.
 *
 * Columns are declared as objects:
 *   { key, label, align?, width?, sortable?, nowrap? }
 *
 * Cells render as plain text by default; override any column with a
 * `cell-<key>` slot. Row actions go in the `actions` slot.
 *
 * Under 768px the table becomes stacked cards, with each cell labelled by
 * its column header, so the columns that matter stay readable on a phone
 * instead of disappearing off the side.
 */
import { computed, useSlots } from 'vue'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next'
import EmptyState from './EmptyState.vue'

const slots = useSlots()

const props = defineProps({
  columns:  { type: Array, required: true },
  rows:     { type: Array, default: () => [] },
  rowKey:   { type: String, default: 'id' },
  loading:  { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  selected: { type: Array, default: () => [] },
  // { key, dir: 'asc' | 'desc' } — sorting is emitted, never done here, so
  // the server stays the single source of order.
  sort:     { type: Object, default: null },
  // Passed through to EmptyState.
  emptyTitle:   { type: String, default: '' },
  emptyMessage: { type: String, default: '' },
  emptyVariant: { type: String, default: 'empty' },
  // Skeleton row count while loading.
  skeletonRows: { type: Number, default: 5 },
})

const emit = defineEmits(['update:selected', 'sort', 'row-click'])

const hasActions = computed(() => Boolean(slots.actions))

const colCount = computed(
  () => props.columns.length + (props.selectable ? 1 : 0) + (hasActions.value ? 1 : 0)
)

const keyOf = (row, i) => row?.[props.rowKey] ?? i

const allSelected = computed(
  () => props.rows.length > 0 && props.rows.every((r, i) => props.selected.includes(keyOf(r, i)))
)

const someSelected = computed(
  () => props.selected.length > 0 && !allSelected.value
)

function toggleAll(e) {
  emit('update:selected', e.target.checked ? props.rows.map((r, i) => keyOf(r, i)) : [])
}

function toggleRow(row, i) {
  const id = keyOf(row, i)
  const next = props.selected.includes(id)
    ? props.selected.filter((s) => s !== id)
    : [...props.selected, id]
  emit('update:selected', next)
}

function onSort(col) {
  if (!col.sortable) return
  const dir = props.sort?.key === col.key && props.sort?.dir === 'asc' ? 'desc' : 'asc'
  emit('sort', { key: col.key, dir })
}

function sortIcon(col) {
  if (props.sort?.key !== col.key) return ChevronsUpDown
  return props.sort.dir === 'asc' ? ChevronUp : ChevronDown
}

function valueOf(row, col) {
  // Supports dotted paths: { key: 'product.name' }
  return col.key.split('.').reduce((acc, part) => acc?.[part], row)
}

const alignClass = (col) => (col.align ? `is-${col.align}` : '')
</script>

<template>
  <div class="dt">
    <div class="dt-scroll">
      <table class="dt-table">
        <thead>
          <tr>
            <th v-if="selectable" class="dt-check-col">
              <input
                type="checkbox"
                class="dt-check"
                aria-label="Select all rows"
                :checked="allSelected"
                :indeterminate.prop="someSelected"
                @change="toggleAll"
              />
            </th>

            <th
              v-for="col in columns"
              :key="col.key"
              :class="[alignClass(col), { 'is-sortable': col.sortable, 'is-sorted': sort?.key === col.key }]"
              :style="col.width ? { width: col.width } : null"
              :aria-sort="sort?.key === col.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined"
            >
              <button v-if="col.sortable" type="button" class="dt-sort" @click="onSort(col)">
                {{ col.label }}
                <component :is="sortIcon(col)" :size="13" class="dt-sort-icon" aria-hidden="true" />
              </button>
              <template v-else>{{ col.label }}</template>
            </th>

            <th v-if="hasActions" class="dt-actions-col is-right">Actions</th>
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr v-for="n in skeletonRows" :key="`sk-${n}`" class="dt-skeleton-row">
            <td v-for="c in colCount" :key="c"><span class="dt-skeleton"></span></td>
          </tr>
        </tbody>

        <tbody v-else-if="rows.length">
          <tr
            v-for="(row, i) in rows"
            :key="keyOf(row, i)"
            :class="{ 'is-selected': selectable && selected.includes(keyOf(row, i)) }"
            @click="emit('row-click', row)"
          >
            <td v-if="selectable" class="dt-check-col" @click.stop>
              <input
                type="checkbox"
                class="dt-check"
                :aria-label="`Select row ${i + 1}`"
                :checked="selected.includes(keyOf(row, i))"
                @change="toggleRow(row, i)"
              />
            </td>

            <td
              v-for="col in columns"
              :key="col.key"
              :class="[alignClass(col), { 'is-nowrap': col.nowrap }]"
              :data-label="col.label"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="valueOf(row, col)" :index="i">
                {{ valueOf(row, col) ?? '—' }}
              </slot>
            </td>

            <td v-if="hasActions" class="dt-actions-col is-right" data-label="Actions" @click.stop>
              <div class="dt-actions">
                <slot name="actions" :row="row" :index="i" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <slot v-if="!loading && !rows.length" name="empty">
      <EmptyState :title="emptyTitle" :message="emptyMessage" :variant="emptyVariant">
        <template v-if="$slots['empty-action']" #action>
          <slot name="empty-action" />
        </template>
      </EmptyState>
    </slot>
  </div>
</template>

<style scoped>
.dt { width: 100%; }

.dt-scroll {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
}

.dt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
  color: var(--text);
}

/* ── Header ── */
.dt-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: var(--sp-3) var(--cell-pad-x);
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--surface-sunk);
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
}

.dt-sort {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: inherit;
  cursor: pointer;
}

.dt-sort:hover { color: var(--text); }

/* The sort affordance is faint until hovered, solid on the active column. */
.dt-sort-icon { opacity: .35; transition: opacity var(--dur) var(--ease); }
.dt-sort:hover .dt-sort-icon { opacity: .7; }
.dt-table thead th.is-sorted { color: var(--text); }
.dt-table thead th.is-sorted .dt-sort-icon { opacity: 1; color: var(--admin-green-600); }

/* ── Body ── */
.dt-table tbody td {
  height: var(--row-h);
  padding: var(--cell-pad-y) var(--cell-pad-x);
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.dt-table tbody tr:last-child td { border-bottom: 0; }

/* No zebra striping — it fights the status colours. */
.dt-table tbody tr {
  transition: background var(--dur) var(--ease);
}

.dt-table tbody tr:hover { background: var(--surface-alt); }
.dt-table tbody tr.is-selected { background: var(--accent-soft, #e6efdd); }

.is-right  { text-align: right; }
.is-center { text-align: center; }
.is-nowrap { white-space: nowrap; }

/* Numeric columns line up */
td.is-right, th.is-right { font-variant-numeric: tabular-nums; }

/* ── Selection ── */
.dt-check-col { width: 44px; text-align: center; }

.dt-check {
  width: 16px;
  height: 16px;
  accent-color: var(--admin-green-600);
  cursor: pointer;
}

/* ── Actions ── */
.dt-actions-col { width: 1%; white-space: nowrap; }

.dt-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-1);
}

/* ── Loading skeleton ── */
.dt-skeleton {
  display: block;
  height: 12px;
  border-radius: var(--r-sm);
  background: linear-gradient(90deg, var(--surface-sunk) 25%, var(--line) 37%, var(--surface-sunk) 63%);
  background-size: 400% 100%;
  animation: dt-shimmer 1.4s ease infinite;
}

@keyframes dt-shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .dt-skeleton { animation: none; }
}

/* ── Mobile: stacked cards ────────────────────────────────
   Below 768px the row becomes a card and each cell is labelled by its
   column header, rather than pushing the useful columns off-screen. */
@media (max-width: 767px) {
  .dt-scroll { border: 0; background: none; overflow-x: visible; }

  .dt-table thead { display: none; }
  .dt-table, .dt-table tbody, .dt-table tr, .dt-table td { display: block; width: 100%; }

  .dt-table tbody tr {
    margin-bottom: var(--sp-3);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    background: var(--surface);
    box-shadow: var(--el-1);
  }

  .dt-table tbody td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    height: auto;
    text-align: right;
    border-bottom: 1px solid var(--line);
  }

  .dt-table tbody td::before {
    content: attr(data-label);
    flex-shrink: 0;
    font-size: var(--fs-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
    color: var(--text-muted);
    text-align: left;
  }

  /* The select checkbox has no useful label in card form. */
  .dt-table tbody td.dt-check-col {
    justify-content: flex-start;
    width: 100%;
  }

  .dt-table tbody td.dt-check-col::before { content: 'Select'; }
  .dt-actions { justify-content: flex-end; }
}
</style>
