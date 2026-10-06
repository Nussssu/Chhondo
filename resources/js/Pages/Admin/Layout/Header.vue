<script setup>
/**
 * Header settings: the storefront menu, built the way WordPress builds one —
 * items with a label and a link, one level of nesting, reorderable — plus the
 * few things the header itself shows.
 */
import { computed, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { LAYOUT_TABS } from '@/settingsTabs'
import { confirmDelete } from '@/utils/confirmDelete'
import {
  Plus, Trash2, ChevronUp, ChevronDown, IndentIncrease, IndentDecrease, Link2, GripVertical,
} from 'lucide-vue-next'

const props = defineProps({
  menu: { type: Array, default: () => [] },
  maxDepth: { type: Number, default: 3 },
  categoryOptions: { type: Array, default: () => [] },
  settings: { type: Object, default: () => ({}) },
  suggestions: { type: Object, default: () => ({ pages: [], categories: [] }) },
})

/**
 * The builder works on a flat list where each row carries its own `depth`,
 * which is how WordPress models a menu: indent sets the hierarchy, and moving a
 * row moves everything nested under it. The nested tree is rebuilt on save.
 */
function flatten(rows, parentId = null, depth = 0) {
  return rows
    .filter((r) => (r.parent_id ?? null) === parentId)
    .flatMap((r) => [{ ...r, depth, children: undefined }, ...flatten(rows, r.id, depth + 1)])
}

function nest(flat) {
  const roots = []
  // stack[d] is the item the next row at depth d + 1 belongs under.
  const stack = []

  flat.forEach((row) => {
    const node = { ...row, children: [] }
    delete node.depth

    if (row.depth === 0) {
      roots.push(node)
    } else {
      (stack[row.depth - 1]?.children ?? roots).push(node)
    }

    stack[row.depth] = node
    stack.length = row.depth + 1
  })

  return roots
}

const form = useForm({
  settings: { ...props.settings },
  menu: flatten(props.menu),
})

const itemCount = computed(() => form.menu.length)

/* ------------------------------------------------------------ hierarchy -- */

/** How many rows below `index` are nested under it. */
function descendantCount(index) {
  return descendantCountIn(form.menu, index)
}

/** The deepest this row may sit: one below the row above it. */
function maxDepthFor(index) {
  if (index === 0) return 0
  return Math.min(form.menu[index - 1].depth + 1, props.maxDepth)
}

function canIndent(index) {
  return form.menu[index].depth < maxDepthFor(index)
}

function canOutdent(index) {
  return form.menu[index].depth > 0
}

/** Re-indent a row and everything nested under it, so the block keeps its shape. */
function shift(index, delta) {
  const span = descendantCount(index)
  const copy = [...form.menu]
  for (let i = index; i <= index + span; i++) copy[i] = { ...copy[i], depth: copy[i].depth + delta }
  form.menu = copy
}

function indent(index) {
  if (canIndent(index)) shift(index, 1)
}

function outdent(index) {
  if (canOutdent(index)) shift(index, -1)
}

/** Rows nested under `index` within an arbitrary list. */
function descendantCountIn(list, index) {
  const depth = list[index].depth
  let n = 0
  while (index + 1 + n < list.length && list[index + 1 + n].depth > depth) n++
  return n
}

/**
 * The first row of the block that ends at `index` — walk back past anything
 * nested deeper, which belongs to that block rather than preceding it.
 */
function blockStart(list, index, depth) {
  let start = index
  while (start > 0 && list[start].depth > depth) start--
  return start
}

/**
 * Move a row and everything nested under it past the neighbouring block, then
 * clamp depths so the list never starts mid-hierarchy or skips a level.
 */
function move(index, direction) {
  const span = descendantCount(index)
  const depth = form.menu[index].depth
  const copy = [...form.menu]
  const block = copy.splice(index, span + 1)

  let to
  if (direction < 0) {
    if (index === 0) return
    to = blockStart(copy, index - 1, depth)
  } else {
    if (index >= copy.length) return
    to = index + descendantCountIn(copy, index) + 1
  }

  copy.splice(to, 0, ...block)
  form.menu = clampDepths(copy)
}

/** No row may be deeper than one below the row before it, or past maxDepth. */
function clampDepths(list) {
  return list.map((row, i) => {
    const ceiling = i === 0 ? 0 : Math.min(list[i - 1].depth + 1, props.maxDepth)
    return row.depth > ceiling ? { ...row, depth: ceiling } : row
  })
}

/* ------------------------------------------------------------ menu edits -- */

function addItem(link = null) {
  form.menu.push({
    id: null,
    type: 'link',
    category_ids: [],
    label: link?.label ?? 'New item',
    url: link?.url ?? '/',
    target: '_self',
    is_active: true,
    depth: 0,
  })
}

function addMobileLink() {
  if (!Array.isArray(form.settings.mobile_links)) form.settings.mobile_links = []
  form.settings.mobile_links.push({ label: '', url: '/', icon: 'contact' })
}

function addCategoriesItem() {
  form.menu.push({
    id: null,
    type: 'categories',
    // Empty means every category, which is how the dropdown has always behaved.
    category_ids: [],
    label: 'Saree',
    url: '/shop',
    target: '_self',
    is_active: true,
    depth: 0,
  })
}

/* -------------------------------------------------- categories dropdown -- */

/** Toggle one category in a dropdown item's selection. */
function toggleCategory(item, id) {
  const current = Array.isArray(item.category_ids) ? item.category_ids : []
  item.category_ids = current.includes(id)
    ? current.filter((c) => c !== id)
    : [...current, id]
}

function isCategoryPicked(item, id) {
  return Array.isArray(item.category_ids) && item.category_ids.includes(id)
}

function selectedCount(item) {
  return Array.isArray(item.category_ids) ? item.category_ids.length : 0
}

function clearCategories(item) {
  item.category_ids = []
}

async function removeItem(index) {
  const item = form.menu[index]
  const span = descendantCount(index)

  const ok = await confirmDelete({
    title: `Remove “${item.label}”?`,
    text: span
      ? `Its ${span} sub item(s) are removed with it.`
      : 'It stops showing in the header when you save.',
    confirmButtonText: 'Remove',
  })

  if (ok) form.menu.splice(index, span + 1)
}

/* ------------------------------------------------------ drag to reorder -- */

const dragFrom = ref(null)
const dragTo = ref(null)

function onDragStart(index, event) {
  dragFrom.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(index))
}

function onDragOver(index) {
  // A block cannot be dropped inside itself.
  if (dragFrom.value === null) return
  const span = descendantCount(dragFrom.value)
  if (index > dragFrom.value && index <= dragFrom.value + span) return
  dragTo.value = index
}

function onDrop(index) {
  const from = dragFrom.value
  onDragEnd()

  if (from === null || from === index) return

  const span = descendantCount(from)
  if (index > from && index <= from + span) return

  const copy = [...form.menu]
  const block = copy.splice(from, span + 1)
  copy.splice(from < index ? index - span - 1 : index, 0, ...block)
  form.menu = clampDepths(copy)
}

function onDragEnd() {
  dragFrom.value = null
  dragTo.value = null
}

/* ------------------------------------------------------------- row state -- */

const openRow = ref(null)

function toggleRow(index) {
  openRow.value = openRow.value === index ? null : index
}

/** What the collapsed row shows on the right — WordPress's "Custom Link" hint. */
function rowKind(item) {
  if (item.type === 'categories') return 'Categories dropdown'
  return item.target === '_blank' ? 'Link — new tab' : 'Link'
}

/* ---------------------------------------------------------------- links -- */

const showLinks = ref(false)

function submit() {
  form
    .transform((data) => ({ ...data, menu: nest(data.menu) }))
    .put(route('admin.layout.header.update'), { preserveScroll: true })
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Header" subtitle="The storefront menu and what the header bar shows">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing" @click="submit">
            {{ form.processing ? 'Saving…' : 'Save header' }}
          </button>
        </template>
      </PageHeader>

      <SettingsTabs :tabs="LAYOUT_TABS" />

      <div class="hd-layout">
        <!-- ── Menu builder ────────────────────────────────────── -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-0">Menu</h6>
              <p class="mb-0 text-muted small">
                {{ itemCount }} item(s). Drag a row to reorder it, and use ⇥ to nest it under the one above —
                up to {{ maxDepth + 1 }} levels deep.
              </p>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="addCategoriesItem()">
                <Plus :size="15" class="me-1" /> Categories dropdown
              </button>
              <button type="button" class="btn btn-fig-primary btn-fig-sm" @click="addItem()">
                <Plus :size="15" class="me-1" /> Add item
              </button>
            </div>
          </div>

          <div class="card-body">
            <p v-if="!form.menu.length" class="text-muted mb-0">
              No menu items yet — add one, or pick a page from the panel on the right.
            </p>

            <div
              v-for="(item, index) in form.menu"
              :key="item.id ?? `n${index}`"
              class="hd-item"
              :class="{
                'is-dragging': dragFrom === index,
                'is-over': dragTo === index && dragFrom !== null,
                'is-open': openRow === index,
              }"
              :style="{ marginLeft: `${item.depth * 28}px` }"
              @dragover.prevent="onDragOver(index)"
              @drop.prevent="onDrop(index)"
            >
              <!-- Collapsed summary: the whole strip opens the row -->
              <div class="hd-head">
                <span
                  class="hd-grip"
                  title="Drag to reorder"
                  draggable="true"
                  @dragstart="onDragStart(index, $event)"
                  @dragend="onDragEnd"
                >
                  <GripVertical :size="15" />
                </span>

                <button type="button" class="hd-summary" @click="toggleRow(index)">
                  <span class="hd-label">{{ item.label || 'Untitled' }}</span>
                  <span v-if="!item.is_active" class="hd-flag">Hidden</span>
                  <span class="hd-kind">{{ rowKind(item) }}</span>
                  <ChevronDown :size="14" class="hd-caret" />
                </button>

                <div class="hd-actions">
                  <button
                    type="button"
                    class="table-icon-btn"
                    title="Move out one level"
                    :disabled="!canOutdent(index)"
                    @click="outdent(index)"
                  >
                    <IndentDecrease :size="14" />
                  </button>
                  <button
                    type="button"
                    class="table-icon-btn"
                    title="Make a sub item of the one above"
                    :disabled="!canIndent(index)"
                    @click="indent(index)"
                  >
                    <IndentIncrease :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn" title="Move up" :disabled="index === 0" @click="move(index, -1)">
                    <ChevronUp :size="14" />
                  </button>
                  <button
                    type="button"
                    class="table-icon-btn"
                    title="Move down"
                    :disabled="index + descendantCount(index) >= form.menu.length - 1"
                    @click="move(index, 1)"
                  >
                    <ChevronDown :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn is-danger" title="Remove" @click="removeItem(index)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <!-- Expanded editor -->
              <div v-if="openRow === index" class="hd-body">
                <div class="hd-fields">
                  <label class="form-label">Label</label>
                  <input v-model="item.label" type="text" class="form-control" placeholder="Label" />
                </div>
                <div class="hd-fields">
                  <label class="form-label">Link</label>
                  <input
                    v-model="item.url"
                    type="text"
                    class="form-control"
                    :placeholder="item.type === 'categories' ? 'Link for the label itself' : '/link'"
                  />
                </div>
                <div v-if="item.depth === 0" class="hd-fields">
                  <label class="form-label">Type</label>
                  <select v-model="item.type" class="form-select">
                    <option value="link">Link</option>
                    <option value="categories">Categories dropdown</option>
                  </select>
                </div>
                <div class="hd-fields">
                  <label class="form-label">Opens in</label>
                  <select v-model="item.target" class="form-select">
                    <option value="_self">Same tab</option>
                    <option value="_blank">New tab</option>
                  </select>
                </div>
                <div class="hd-fields hd-fields--switch">
                  <div class="form-check form-switch hd-switch">
                    <input :id="`act${index}`" v-model="item.is_active" class="form-check-input" type="checkbox" role="switch" />
                    <label class="form-check-label" :for="`act${index}`">Visible in the menu</label>
                  </div>
                </div>

                <!-- Which categories this dropdown lists -->
                <div v-if="item.type === 'categories'" class="hd-cats">
                  <div class="hd-cats-head">
                    <span class="form-label mb-0">Categories in this dropdown</span>
                    <span class="hd-cats-count">
                      {{ selectedCount(item) ? `${selectedCount(item)} selected` : 'All categories' }}
                    </span>
                    <button
                      v-if="selectedCount(item)"
                      type="button"
                      class="hd-cats-clear"
                      @click="clearCategories(item)"
                    >
                      Show all
                    </button>
                  </div>

                  <p class="hd-note mb-2">
                    Tick the ones to show. Leave every box clear to list all of them, which is
                    what this dropdown did before.
                  </p>

                  <div v-if="categoryOptions.length" class="hd-cats-grid">
                    <label
                      v-for="cat in categoryOptions"
                      :key="cat.id"
                      class="hd-cat"
                      :class="{ 'is-on': isCategoryPicked(item, cat.id) }"
                    >
                      <input
                        type="checkbox"
                        :checked="isCategoryPicked(item, cat.id)"
                        @change="toggleCategory(item, cat.id)"
                      />
                      <span>{{ cat.name }}</span>
                    </label>
                  </div>
                  <p v-else class="hd-note mb-0">No active categories yet.</p>
                </div>
                <p v-else-if="descendantCount(index)" class="hd-note">
                  {{ descendantCount(index) }} item(s) nested under this one.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Side panel ─────────────────────────────────────── -->
        <aside class="hd-side">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">Add a link</h6>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showLinks = !showLinks">
                <Link2 :size="14" class="me-1" /> {{ showLinks ? 'Hide' : 'Browse' }}
              </button>
            </div>
            <div v-if="showLinks" class="card-body hd-links">
              <p class="hd-links-title">Pages</p>
              <button
                v-for="link in suggestions.pages"
                :key="link.url"
                type="button"
                class="hd-link-btn"
                @click="addItem(link)"
              >
                <Plus :size="13" /> {{ link.label }}
              </button>

              <p class="hd-links-title mt-3">Categories</p>
              <button
                v-for="link in suggestions.categories"
                :key="link.url"
                type="button"
                class="hd-link-btn"
                @click="addItem(link)"
              >
                <Plus :size="13" /> {{ link.label }}
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h6 class="mb-0">Announcement bar</h6></div>
            <div class="card-body">
              <div class="form-check form-switch mb-2">
                <input id="ann" v-model="form.settings.announcement_enabled" class="form-check-input" type="checkbox" role="switch" />
                <label class="form-check-label" for="ann">Show a strip above the header</label>
              </div>
              <input v-model="form.settings.announcement_text" type="text" class="form-control" placeholder="e.g. ফ্রি ডেলিভারি ১৫০০৳+ অর্ডারে" />
              <input v-model="form.settings.announcement_url" type="text" class="form-control mt-2" placeholder="Link (optional)" />
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">Mobile menu links</h6>
                <p class="mb-0 text-muted small">The "Help & Support" card in the mobile drawer.</p>
              </div>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="addMobileLink">
                <Plus :size="14" />
              </button>
            </div>
            <div class="card-body">
              <div v-for="(link, mi) in form.settings.mobile_links ?? []" :key="mi" class="hd-mobile-link">
                <input v-model="link.label" type="text" class="form-control" placeholder="Label" />
                <input v-model="link.url" type="text" class="form-control" placeholder="/link" />
                <select v-model="link.icon" class="form-select">
                  <option value="blog">Blog</option>
                  <option value="track">Track</option>
                  <option value="refund">Refund</option>
                  <option value="privacy">Privacy</option>
                  <option value="contact">Contact</option>
                </select>
                <button type="button" class="table-icon-btn is-danger" title="Remove" @click="form.settings.mobile_links.splice(mi, 1)">
                  <Trash2 :size="14" />
                </button>
              </div>
              <p v-if="!(form.settings.mobile_links ?? []).length" class="text-muted small mb-0">No links.</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h6 class="mb-0">Header options</h6></div>
            <div class="card-body">
              <div class="form-check form-switch mb-3">
                <input id="cats" v-model="form.settings.show_categories_menu" class="form-check-input" type="checkbox" role="switch" />
                <label class="form-check-label" for="cats">Show categories dropdowns</label>
              </div>

              <div class="form-check form-switch mb-2">
                <input id="srch" v-model="form.settings.show_search" class="form-check-input" type="checkbox" role="switch" />
                <label class="form-check-label" for="srch">Search</label>
              </div>
              <div class="form-check form-switch mb-2">
                <input id="wish" v-model="form.settings.show_wishlist" class="form-check-input" type="checkbox" role="switch" />
                <label class="form-check-label" for="wish">Wishlist</label>
              </div>
              <div class="form-check form-switch">
                <input id="acct" v-model="form.settings.show_account" class="form-check-input" type="checkbox" role="switch" />
                <label class="form-check-label" for="acct">Account</label>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-fig-primary w-100" :disabled="form.processing" @click="submit">
            {{ form.processing ? 'Saving…' : 'Save header' }}
          </button>
        </aside>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.hd-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4, 16px);
  align-items: start;
}

@media (min-width: 992px) {
  .hd-layout { grid-template-columns: minmax(0, 1fr) 320px; }
}

.hd-side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4, 16px);
}

/* ── Menu rows ─────────────────────────────────────────────
   Indentation is the hierarchy, so a row's margin-left is set inline from
   its depth and the card carries the rest of the styling. */
.hd-item {
  margin-bottom: 6px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-sm, 6px);
  background: var(--surface, #fff);
  transition: border-color .12s ease, box-shadow .12s ease;
}

.hd-item.is-open {
  border-color: var(--line-strong, #d1cdca);
  box-shadow: var(--el-1, 0 1px 3px rgba(26, 33, 16, .05));
}

.hd-item.is-dragging { opacity: .4; }
.hd-item.is-over { border-color: var(--admin-green-600, #252f17); }

.hd-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  padding: 6px 8px;
  min-width: 0;
}

.hd-grip {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--text-faint, #9c9591);
  cursor: grab;
}

.hd-grip:active { cursor: grabbing; }

.hd-summary {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  flex: 1 1 auto;
  min-width: 0;
  padding: 2px 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.hd-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
  color: var(--text, #1a1817);
}

.hd-kind {
  margin-left: auto;
  flex-shrink: 0;
  font-size: var(--fs-xs, 12px);
  color: var(--text-muted, #6d6560);
}

.hd-flag {
  flex-shrink: 0;
  padding: 1px 7px;
  border-radius: var(--r-full, 999px);
  background: var(--st-neutral-soft, #eceef1);
  font-size: 11px;
  font-weight: 600;
  color: var(--st-neutral, #475467);
}

.hd-caret {
  flex-shrink: 0;
  color: var(--text-faint, #9c9591);
  transition: transform .15s ease;
}

.hd-item.is-open .hd-caret { transform: rotate(180deg); }

.hd-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--sp-3, 12px);
  padding: 0 8px 12px 30px;
}

.hd-fields { min-width: 0; }
.hd-fields .form-label { font-size: var(--fs-xs, 12px); margin-bottom: 3px; }
.hd-fields--switch { display: flex; align-items: flex-end; }

@media (max-width: 900px) {
  .hd-body { grid-template-columns: 1fr; }
}

.hd-switch { margin: 0; white-space: nowrap; }
.hd-switch .form-check-label { font-size: 12px; }

.hd-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.hd-mobile-link {
  display: grid;
  grid-template-columns: 1fr 1fr 110px auto;
  gap: 6px;
  margin-bottom: 6px;
}

/* ── Category picker on a dropdown item ──────────────────── */
.hd-cats {
  grid-column: 1 / -1;
  padding-top: var(--sp-2, 8px);
  border-top: 1px solid var(--line, #e4e1e0);
}

.hd-cats-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  margin-bottom: 2px;
}

.hd-cats-count {
  font-size: var(--fs-xs, 12px);
  color: var(--text-muted, #6d6560);
}

.hd-cats-clear {
  margin-left: auto;
  padding: 0;
  border: 0;
  background: none;
  font-size: var(--fs-xs, 12px);
  color: var(--admin-green-600, #252f17);
  text-decoration: underline;
  cursor: pointer;
}

.hd-cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 4px;
  max-height: 190px;
  overflow-y: auto;
  padding: 2px;
}

.hd-cat {
  display: flex;
  align-items: center;
  gap: var(--sp-2, 8px);
  padding: 5px 9px;
  border: 1px solid var(--line, #e4e1e0);
  border-radius: var(--r-sm, 6px);
  font-size: var(--fs-sm, 13px);
  cursor: pointer;
}

.hd-cat:hover { border-color: var(--line-strong, #d1cdca); }

.hd-cat.is-on {
  border-color: var(--admin-green-600, #252f17);
  background: rgba(37, 47, 23, .06);
}

.hd-cat input { margin: 0; cursor: pointer; }

.hd-note {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: var(--text-muted, #6d6560);
}

.hd-links-title {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-muted, #9ca3af);
}

.hd-link-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  text-align: left;
}

.hd-link-btn:hover {
  border-color: #252f17;
  background: #f2f7ec;
  color: #1a2110;
}
</style>
