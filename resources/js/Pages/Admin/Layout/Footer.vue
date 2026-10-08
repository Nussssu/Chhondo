<script setup>
/**
 * Footer settings. Everything the storefront footer shows is edited here —
 * the about text, the link columns, the contact block, the trust badges and
 * the bottom bar — instead of being written into the component.
 */
import { useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { LAYOUT_TABS } from '@/settingsTabs'
import { confirmDelete } from '@/utils/confirmDelete'
import VisibilityToggle from '@/components/Admin/VisibilityToggle.vue'
import { Plus, Trash2, ChevronUp, ChevronDown, Copy } from 'lucide-vue-next'

const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  site: { type: Object, default: () => ({}) },
  suggestions: { type: Object, default: () => ({ pages: [], categories: [] }) },
})

const ICONS = [
  { value: 'security', label: 'Shield / secure payment' },
  { value: 'support', label: 'Headset / support' },
  { value: 'delivery', label: 'Van / delivery' },
]

const SOCIAL_PROFILES = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'x', label: 'X' },
]

const form = useForm({
  settings: {
    enabled: true,
    socials_enabled: true,
    bottom_bar_enabled: true,
    // A section with no saved switch yet is on, as it has always been.
    about_enabled: true,
    columns_enabled: true,
    columns: [],
    badges: [],
    legal_links: [],
    ...JSON.parse(JSON.stringify(props.settings)),
  },
  site: {
    ...props.site,
    ...Object.fromEntries(SOCIAL_PROFILES.map(({ key }) => [`${key}_active`, props.site[`${key}_active`] !== false])),
  },
})

/* --------------------------------------------------------------- columns -- */

function addColumn() {
  form.settings.columns.push({ title: 'New column', links: [] })
}

async function removeColumn(index) {
  const ok = await confirmDelete({
    title: 'Remove this column?',
    text: 'Its links go with it.',
    confirmButtonText: 'Remove',
  })
  if (ok) form.settings.columns.splice(index, 1)
}

// Copies land right after the original; deep copies, so a copied column's
// links are its own.
const clone = (value) => JSON.parse(JSON.stringify(value))

function duplicateColumn(index) {
  form.settings.columns.splice(index + 1, 0, clone(form.settings.columns[index]))
}

function duplicateLink(column, index) {
  column.links.splice(index + 1, 0, clone(column.links[index]))
}

function duplicateBadge(index) {
  form.settings.badges.splice(index + 1, 0, clone(form.settings.badges[index]))
}

function duplicateLegalLink(index) {
  form.settings.legal_links.splice(index + 1, 0, clone(form.settings.legal_links[index]))
}

function addLink(column, link = null) {
  column.links.push({ label: link?.label ?? '', url: link?.url ?? '' })
}

function removeLink(column, index) {
  column.links.splice(index, 1)
}

function moveLink(column, index, delta) {
  const target = index + delta
  if (target < 0 || target >= column.links.length) return
  const copy = [...column.links]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  column.links = copy
}

/* ---------------------------------------------------------------- badges -- */

/* ------------------------------------------------------- bottom links -- */

function addLegalLink() {
  form.settings.legal_links.push({ label: '', url: '' })
}

function addBadge() {
  form.settings.badges.push({ title: '', text: '', icon: 'security' })
}

function removeBadge(index) {
  form.settings.badges.splice(index, 1)
}

function submit() {
  form.put(route('admin.layout.footer.update'), { preserveScroll: true })
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Footer" subtitle="Everything shown at the bottom of every storefront page">
        <template #title><span class="layout-editor-title">Footer <VisibilityToggle v-model="form.settings.enabled" switch-only aria-label="Show storefront footer" /></span></template>
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing" @click="submit">
            {{ form.processing ? 'Saving…' : 'Save footer' }}
          </button>
        </template>
      </PageHeader>

      <SettingsTabs :tabs="LAYOUT_TABS" />

      <div class="ft-layout">
        <div class="ft-main">
          <!-- About -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center gap-2">
              <h6 class="mb-0">About</h6>
              <VisibilityToggle v-model="form.settings.about_enabled" switch-only aria-label="Show footer About section" />
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-3"><span>Store logo</span><VisibilityToggle v-model="form.settings.show_logo" switch-only aria-label="Show footer logo" /></div>

              <label class="form-label">About text</label>
              <textarea v-model="form.settings.about_text" class="form-control" rows="3"></textarea>

              <label class="form-label mt-3">"Follow us" label</label>
              <input v-model="form.settings.follow_label" type="text" class="form-control" />
              <small class="text-muted">Social links come from the profiles below.</small>
            </div>
          </div>

          <!-- Link columns -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">Link columns</h6>
                <p class="mb-0 text-muted small">Up to four columns of links.</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <VisibilityToggle v-model="form.settings.columns_enabled" switch-only aria-label="Show footer link columns" />
                <button
                  type="button"
                  class="btn btn-fig-primary btn-fig-sm"
                  :disabled="form.settings.columns.length >= 4"
                  @click="addColumn"
                >
                  <Plus :size="15" class="me-1" /> Add column
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-for="(column, ci) in form.settings.columns" :key="ci" class="ft-column">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <input v-model="column.title" type="text" class="form-control" placeholder="Column title" />
                  <VisibilityToggle :model-value="column.enabled !== false" switch-only :aria-label="`Show ${column.title || 'link column'}`" @update:model-value="column.enabled = $event" />
                  <button type="button" class="table-icon-btn" title="Duplicate column" :disabled="form.settings.columns.length >= 4" @click="duplicateColumn(ci)">
                    <Copy :size="14" />
                  </button>
                  <button type="button" class="table-icon-btn is-danger" title="Remove column" @click="removeColumn(ci)">
                    <Trash2 :size="14" />
                  </button>
                </div>

                <div v-for="(link, li) in column.links" :key="li" class="ft-link">
                  <input v-model="link.label" type="text" class="form-control" placeholder="Label" />
                  <input v-model="link.url" type="text" class="form-control" placeholder="/link" />
                  <VisibilityToggle :model-value="link.enabled !== false" switch-only :aria-label="`Show ${link.label || 'footer link'}`" @update:model-value="link.enabled = $event" />
                  <div class="d-flex gap-1">
                    <button type="button" class="table-icon-btn" title="Move up" :disabled="li === 0" @click="moveLink(column, li, -1)">
                      <ChevronUp :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn" title="Move down" :disabled="li === column.links.length - 1" @click="moveLink(column, li, 1)">
                      <ChevronDown :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn" title="Duplicate" :disabled="column.links.length >= 12" @click="duplicateLink(column, li)">
                      <Copy :size="14" />
                    </button>
                    <button type="button" class="table-icon-btn is-danger" title="Remove" @click="removeLink(column, li)">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2 mt-2">
                  <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="addLink(column)">
                    <Plus :size="14" class="me-1" /> Add link
                  </button>
                  <select class="form-select form-select-sm w-auto" @change="addLink(column, JSON.parse($event.target.value)); $event.target.selectedIndex = 0">
                    <option>Add a page…</option>
                    <option v-for="p in suggestions.pages" :key="p.url" :value="JSON.stringify(p)">{{ p.label }}</option>
                  </select>
                </div>
              </div>

              <p v-if="!form.settings.columns.length" class="text-muted mb-0">No columns yet.</p>
            </div>
          </div>

          <!-- Trust badges -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">Trust badges</h6>
                <p class="mb-0 text-muted small">The band above the footer.</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <VisibilityToggle v-model="form.settings.show_badges" switch-only aria-label="Show trust badges" />
                <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.settings.badges.length >= 6" @click="addBadge">
                  <Plus :size="14" class="me-1" /> Add
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-for="(badge, bi) in form.settings.badges" :key="bi" class="ft-badge">
                <input v-model="badge.title" type="text" class="form-control" placeholder="Title" />
                <input v-model="badge.text" type="text" class="form-control" placeholder="Short line under the title" />
                <select v-model="badge.icon" class="form-select">
                  <option v-for="i in ICONS" :key="i.value" :value="i.value">{{ i.label }}</option>
                </select>
                <VisibilityToggle :model-value="badge.enabled !== false" switch-only :aria-label="`Show ${badge.title || 'trust badge'}`" @update:model-value="badge.enabled = $event" />
                <button type="button" class="table-icon-btn" title="Duplicate" :disabled="form.settings.badges.length >= 6" @click="duplicateBadge(bi)">
                  <Copy :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Remove" @click="removeBadge(bi)">
                  <Trash2 :size="14" />
                </button>
              </div>
              <p v-if="!form.settings.badges.length" class="text-muted mb-0">No badges.</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="ft-side">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center gap-2">
              <h6 class="mb-0">Contact block</h6>
              <VisibilityToggle v-model="form.settings.show_contact" switch-only aria-label="Show footer contact section" />
            </div>
            <div class="card-body">
              <label class="form-label">Title</label>
              <input v-model="form.settings.contact_title" type="text" class="form-control mb-3" />

              <!-- The footer's own details; the store's contact settings
                   (used by emails and the contact page) are left alone. -->
              <label class="form-label">Address</label>
              <input v-model="form.settings.contact_address" type="text" class="form-control mb-2" />
              <label class="form-label">Email</label>
              <input v-model="form.settings.contact_email" type="text" class="form-control mb-2" />
              <label class="form-label">Phone</label>
              <input v-model="form.settings.contact_phone" type="text" class="form-control" />
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center"><h6 class="mb-0">Social profiles</h6><VisibilityToggle v-model="form.settings.socials_enabled" switch-only aria-label="Show footer social profiles" /></div>
            <div class="card-body">
              <div v-for="profile in SOCIAL_PROFILES" :key="profile.key" class="ft-social-profile">
                <label class="form-label" :for="`footer-${profile.key}`">{{ profile.label }}</label>
                <VisibilityToggle
                  :model-value="form.site[`${profile.key}_active`] !== false"
                  switch-only
                  :aria-label="`Show ${profile.label} in the footer`"
                  @update:model-value="form.site[`${profile.key}_active`] = $event"
                />
                <input :id="`footer-${profile.key}`" v-model="form.site[`${profile.key}_url`]" type="url" class="form-control" :placeholder="`${profile.label} URL`" />
              </div>
              <div class="ft-social-profile">
                <label class="form-label" for="footer-linkedin">LinkedIn</label>
                <VisibilityToggle
                  :model-value="form.settings.linkedin_active !== false"
                  switch-only
                  aria-label="Show LinkedIn in the footer"
                  @update:model-value="form.settings.linkedin_active = $event"
                />
                <input id="footer-linkedin" v-model="form.settings.linkedin_url" type="url" class="form-control" placeholder="LinkedIn URL" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center"><h6 class="mb-0">Bottom bar</h6><VisibilityToggle v-model="form.settings.bottom_bar_enabled" switch-only aria-label="Show copyright and legal links" /></div>
            <div class="card-body">
              <label class="form-label">Footer text</label>
              <textarea v-model="form.site.footer_text" class="form-control" rows="2"></textarea>
              <label class="form-label mt-3">Copyright line</label>
              <input v-model="form.settings.copyright" type="text" class="form-control" placeholder="Leave empty for the default" />
              <small class="text-muted d-block mt-1">{year} becomes the current year.</small>

              <label class="form-label mt-3">Links beside the copyright</label>
              <div v-for="(link, li) in form.settings.legal_links" :key="li" class="ft-legal-link mb-2">
                <input v-model="link.label" type="text" class="form-control" placeholder="Label" />
                <input v-model="link.url" type="text" class="form-control" placeholder="/link" />
                <VisibilityToggle :model-value="link.enabled !== false" switch-only :aria-label="`Show ${link.label || 'legal link'}`" @update:model-value="link.enabled = $event" />
                <button type="button" class="table-icon-btn" title="Duplicate" :disabled="form.settings.legal_links.length >= 4" @click="duplicateLegalLink(li)">
                  <Copy :size="14" />
                </button>
                <button type="button" class="table-icon-btn is-danger" title="Remove" @click="form.settings.legal_links.splice(li, 1)">×</button>
              </div>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.settings.legal_links.length >= 4" @click="addLegalLink">+ Add link</button>
            </div>
          </div>

        </aside>
      </div>
      <button type="button" class="btn btn-fig-primary w-100 ft-save" :disabled="form.processing" @click="submit">
        {{ form.processing ? 'Saving…' : 'Save footer' }}
      </button>
    </div>
  </AdminLayout>
</template>

<style scoped>
.layout-editor-title { display: inline-flex; align-items: center; gap: 12px; }
.ft-social-profile { display: grid; grid-template-columns: minmax(0, 1fr) 40px; gap: 6px; align-items: center; margin-bottom: 12px; }
.ft-social-profile:last-child { margin-bottom: 0; }
.ft-social-profile .form-label { margin: 0; }
.ft-social-profile .form-control { grid-column: 1 / -1; }
.ft-layout .form-control, .ft-layout .form-select { min-width: 0; }
.ft-layout .card-header, .ft-layout .card-body { padding: 12px; }
.ft-save { margin-top: var(--sp-4, 16px); }
.ft-legal-link { display: grid; grid-template-columns: minmax(0, 1fr) 40px 24px 24px; gap: 6px; align-items: center; }
.ft-legal-link > input:first-child { grid-column: 1 / -1; }
.ft-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4, 16px);
  align-items: start;
}

@media (min-width: 992px) {
  .ft-layout { grid-template-columns: minmax(0, 1fr) 280px; }
  .ft-main { position: sticky; top: 84px; align-self: start; }
}

.ft-main,
.ft-side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4, 16px);
  min-width: 0;
}

.ft-column + .ft-column {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line, #efe9e1);
}

.ft-link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) 40px 112px;
  gap: 8px;
  margin-bottom: 6px;
}
.ft-link .table-icon-btn { width: 22px; height: 24px; flex: 0 0 22px; }
.ft-link > .d-flex { flex-wrap: nowrap; }

.ft-badge {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(100px, 140px) 40px 24px 24px;
  gap: 8px;
  margin-bottom: 8px;
}

@media (max-width: 900px) {
  .ft-link,
  .ft-badge { grid-template-columns: 1fr; }
}
</style>
