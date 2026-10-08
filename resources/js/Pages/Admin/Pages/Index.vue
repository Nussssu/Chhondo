<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader
        title="Pages"
        subtitle="Every storefront page — edit its content, banners and visibility in one place"
      >
        <template #actions>
          <a :href="route('admin.layout.header')" class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center">
            <PanelsTopLeft :size="16" class="me-1" /> Header &amp; Footer
          </a>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center ms-2" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add page
          </button>
        </template>
      </PageHeader>

      <!-- Search -->
      <div class="card pl-search-card">
        <div class="card-body">
          <label class="pl-search">
            <Search :size="16" aria-hidden="true" />
            <input v-model="search" type="search" placeholder="Search pages…" aria-label="Search pages" />
          </label>
        </div>
      </div>

      <div class="card pl-card">
        <div class="table-compact-wrapper">
          <table class="table table-compact align-middle w-100 pl-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>URL</th>
                <th style="width: 80px;">Visibility</th>
                <th style="width: 170px;">Last updated</th>
                <th class="text-end" style="width: 190px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="page in filteredPages" :key="page.type">
                <td data-label="Page">
                  <div class="pl-page">
                    <span class="pl-icon"><component :is="iconFor(page)" :size="16" /></span>
                    <div class="min-w-0">
                      <span class="pg-name">
                        {{ page.label }}
                        <span v-if="page.is_custom" class="pg-tag">Your page</span>
                        <span
                          v-if="page.editable && !page.is_published"
                          class="pl-chip"
                          :title="HIDDEN_HINT"
                        >Content hidden</span>
                      </span>
                      <span v-if="page.note" class="pg-note">{{ page.note }}</span>
                    </div>
                  </div>
                </td>
                <td data-label="URL">
                  <a v-if="page.url" :href="page.url" target="_blank" class="pg-url">{{ page.url }}</a>
                  <span v-else class="text-muted">—</span>
                </td>
                <td data-label="Visibility">
                  <VisibilityToggle
                    v-if="page.editable"
                    switch-only
                    :model-value="page.is_published"
                    :aria-label="`Show ${page.label} content`"
                    :disabled="savingPages.has(page.type)"
                    @update:model-value="setPageVisibility(page, $event)"
                  />
                </td>
                <td data-label="Last updated">
                  <span v-if="page.updated_at" class="text-muted">{{ formatDate(page.updated_at) }}</span>
                  <span v-else class="pl-chip">Default content</span>
                </td>
                <td data-label="Actions">
                  <div class="pl-actions">
                    <a
                      :href="route('admin.pages.edit', page.type)"
                      class="pl-act"
                      title="Edit page"
                    >
                      <Pencil :size="15" />
                    </a>
                    <a
                      v-if="page.url"
                      :href="page.url"
                      target="_blank"
                      class="pl-act"
                      title="View on site"
                    >
                      <ExternalLink :size="15" />
                    </a>
                    <span v-else class="pl-act is-disabled" aria-hidden="true"><ExternalLink :size="15" /></span>
                    <button
                      v-if="page.editable"
                      type="button"
                      class="pl-act"
                      title="Duplicate into a new page"
                      @click="duplicate(page)"
                    >
                      <Copy :size="15" />
                    </button>
                    <button
                      v-if="page.editable"
                      type="button"
                      class="pl-act is-danger"
                      :title="page.is_custom ? 'Delete page' : 'Clear content'"
                      :disabled="!page.is_custom && !page.has_content"
                      @click="clear(page)"
                    >
                      <Trash2 :size="15" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredPages.length">
                <td colspan="5" class="text-center text-muted py-4">No pages match “{{ search }}”.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <FormModal v-if="creating" title="Add a page" :show-footer="false" @close="creating = false">
        <form @submit.prevent="submitCreate">
          <div class="mb-3">
            <label class="form-label" for="pg-new-title">Page title</label>
            <input
              id="pg-new-title"
              v-model="createForm.title"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': createForm.errors.title }"
              placeholder="e.g. Size guide"
              autofocus
              @input="onCreateTitle"
            >
            <div class="invalid-feedback">{{ createForm.errors.title }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="pg-new-slug">Address</label>
            <div class="input-group">
              <span class="input-group-text">/</span>
              <input
                id="pg-new-slug"
                v-model="createForm.slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': createForm.errors.slug }"
                placeholder="size-guide"
                @input="slugTouched = true"
              >
              <div class="invalid-feedback">{{ createForm.errors.slug }}</div>
            </div>
            <small class="pg-note">Filled in from the title. You can change it here or later in the editor.</small>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="creating = false">Cancel</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="createForm.processing">
              Create &amp; edit
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import VisibilityToggle from '@/components/Admin/VisibilityToggle.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { slugify } from '@/utils/slug'
import {
  Pencil, Trash2, ExternalLink, Plus, Copy, Search, PanelsTopLeft,
  Home, ShoppingBag, Info, Mail, FileText, LogIn, Newspaper, CreditCard,
  Truck, ShoppingCart, LayoutGrid, CircleAlert, CircleCheck, File,
} from 'lucide-vue-next'

const props = defineProps({
  pages: { type: Array, default: () => [] },
})

/* ---------- search ---------- */

const search = ref('')
const savingPages = ref(new Set())
function setPageVisibility(page, on) {
  savingPages.value.add(page.type)
  router.patch(route('admin.pages.visibility', page.type), { is_published: on }, {
    preserveScroll: true,
    onFinish: () => savingPages.value.delete(page.type),
  })
}
const filteredPages = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.pages
  return props.pages.filter((p) =>
    [p.label, p.note, p.url].some((v) => (v ?? '').toLowerCase().includes(q))
  )
})

// A small icon per page, so the list scans at a glance.
const ICONS = {
  home: Home, shop: ShoppingBag, about: Info, contact: Mail,
  refund: FileText, shipping_delivery: FileText, policies: FileText, terms: FileText,
  auth: LogIn, blog: Newspaper, checkout: CreditCard, track_order: Truck,
  cart: ShoppingCart, categories: LayoutGrid, not_found: CircleAlert, order_success: CircleCheck,
}
const iconFor = (page) => ICONS[page.type] ?? File

/* ---------- adding a page of your own ---------- */

const creating = ref(false)
const slugTouched = ref(false)

const createForm = useForm({ title: '', slug: '' })

function openCreate() {
  createForm.reset()
  createForm.clearErrors()
  slugTouched.value = false
  creating.value = true
}

function onCreateTitle() {
  if (slugTouched.value) return
  createForm.slug = slugify(createForm.title)
}

function submitCreate() {
  createForm.post(route('admin.pages.store'), {
    onSuccess: () => { creating.value = false },
  })
}

// Copying a built-in page is allowed: the copy is a page of your own, so the
// original keeps its fixed address and the copy gets its own.
function duplicate(page) {
  router.post(route('admin.pages.duplicate', page.type), {}, { preserveScroll: true })
}

// "Hidden" never takes a page off the storefront — every page here is a fixed
// route that always answers. It only controls whether the widgets written in
// the editor are rendered on it. See PageController::pageBlocks().
const HIDDEN_HINT = 'The page is still live on the storefront — only the content written in the editor is held back.'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }) + ' ' + new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

// A built-in page is a fixed part of the storefront, so this empties it rather
// than removing the route from under visitors. A page you created has no fixed
// route to protect, so the same action removes it outright.
async function clear(page) {
  const ok = await confirmDelete(
    page.is_custom
      ? {
          title: `Delete “${page.label}”?`,
          text: `The page and its address (${page.url}) will stop working. This cannot be undone.`,
          confirmButtonText: 'Delete page',
        }
      : {
          title: `Clear “${page.label}”?`,
          text: 'Everything written on this page will be removed. The page itself stays on the site.',
          confirmButtonText: 'Clear content',
        }
  )

  if (ok) router.delete(route('admin.pages.destroy', page.type), { preserveScroll: true })
}
</script>

<style scoped>
.pg-name {
  display: block;
  font-weight: 600;
}

.pg-tag {
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  background: #eef4e6;
  color: #1a2110;
  font-size: 11px;
  font-weight: 500;
  vertical-align: middle;
}

.pg-note {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

.pg-url {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 13px;
  color: #1a2110;
}

.pg-url:hover {
  text-decoration: underline;
}

/* ── Search card, icon + name rows, square actions ── */
.pl-search-card .card-body { padding: 16px; }
.pl-search {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0 14px;
  height: 42px;
  border: 1px solid var(--line, #e7e2d6);
  border-radius: 8px;
  background: #fbf9f4;
  color: var(--text-muted, #6d6560);
}
.pl-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
}
.pl-card { overflow: hidden; }
.pl-table th:first-child, .pl-table td:first-child { padding-left: 16px; }
.pl-table th:last-child, .pl-table td:last-child { padding-right: 16px; }

.pl-page { display: flex; align-items: center; gap: 12px; min-width: 0; }
.pl-icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f5f1e8;
  color: #1a2110;
}
.min-w-0 { min-width: 0; }

.pl-chip {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #f1ece3;
  color: #6d6560;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  vertical-align: middle;
}
td > .pl-chip { margin-left: 0; }

.pl-actions { display: flex; justify-content: flex-end; gap: 6px; }
.pl-act {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--line, #e7e2d6);
  border-radius: 6px;
  background: var(--surface, #fff);
  color: #1a2110;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease;
}
.pl-act:hover:not(:disabled):not(.is-disabled) { background: #f5f1e8; border-color: #d9d2c4; }
.pl-act.is-danger { color: #b23113; }
.pl-act:disabled, .pl-act.is-disabled { opacity: .35; cursor: not-allowed; }

/* Phones: each page becomes a card. */
@media (max-width: 767px) {
  .pl-table thead { display: none; }
  .pl-table, .pl-table tbody, .pl-table tr, .pl-table td { display: block; width: 100%; }
  .pl-table tr { padding: 12px 14px; border-bottom: 1px solid var(--line, #efe9e1); }
  .pl-table td { padding: 4px 0 !important; border: 0; }
  .pl-table td[data-label="URL"], .pl-table td[data-label="Last updated"] { padding-left: 48px !important; }
  .pl-actions { justify-content: flex-start; padding-left: 48px; margin-top: 6px; }
}
</style>
