<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader
        title="Pages"
        subtitle="Every storefront page — edit its content, banners and visibility in one place"
      >
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm d-inline-flex align-items-center" @click="openCreate">
            <Plus :size="16" class="me-1" /> Add page
          </button>
        </template>
      </PageHeader>

      <div class="card">
        <div class="card-body">
          <div class="table-compact-wrapper">
            <table class="table table-compact align-middle w-100">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>URL</th>
                  <th style="width: 150px;">Status</th>
                  <th style="width: 160px;">Last updated</th>
                  <th style="width: 120px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in pages" :key="page.type">
                  <td>
                    <span class="pg-name">
                      {{ page.label }}
                      <span v-if="page.is_custom" class="pg-tag">Your page</span>
                    </span>
                    <span v-if="page.note" class="pg-note">{{ page.note }}</span>
                  </td>
                  <td>
                    <a v-if="page.url" :href="page.url" target="_blank" class="pg-url">{{ page.url }}</a>
                    <span v-else class="text-muted">—</span>
                  </td>
                  <td>
                    <span :title="page.is_published ? PUBLISHED_HINT : HIDDEN_HINT">
                      <StatusPill
                        :tone="page.is_published ? 'success' : 'neutral'"
                        :label="page.is_published ? 'Published' : 'Content hidden'"
                        :dot="false"
                      />
                    </span>
                  </td>
                  <td class="text-muted">{{ page.updated_at ? formatDate(page.updated_at) : 'Never' }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-1">
                      <a
                        :href="route('admin.pages.edit', page.type)"
                        class="table-icon-btn is-primary"
                        title="Edit page"
                      >
                        <Pencil :size="14" />
                      </a>
                      <a
                        v-if="page.url"
                        :href="page.url"
                        target="_blank"
                        class="table-icon-btn"
                        title="View on site"
                      >
                        <ExternalLink :size="14" />
                      </a>
                      <button
                        v-if="page.editable"
                        type="button"
                        class="table-icon-btn"
                        title="Duplicate into a new page"
                        @click="duplicate(page)"
                      >
                        <Copy :size="14" />
                      </button>
                      <button
                        v-if="page.editable"
                        type="button"
                        class="table-icon-btn is-danger"
                        :title="page.is_custom ? 'Delete page' : 'Clear content'"
                        :disabled="!page.is_custom && !page.has_content"
                        @click="clear(page)"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
import { ref } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import StatusPill from '@/components/Admin/StatusPill.vue'
import FormModal from '@/components/Admin/FormModal.vue'
import { confirmDelete } from '@/utils/confirmDelete'
import { slugify } from '@/utils/slug'
import { Pencil, Trash2, ExternalLink, Plus, Copy } from 'lucide-vue-next'

defineProps({
  pages: { type: Array, default: () => [] },
})

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
const PUBLISHED_HINT = 'The content written in the editor is shown on this page.'
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
  color: #2c5015;
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
  color: #2c5015;
}

.pg-url:hover {
  text-decoration: underline;
}
</style>
