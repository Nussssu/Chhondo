<script setup>
/**
 * Store settings › Email.
 *
 * Two jobs on one screen: where email is sent from, and what each of those
 * emails says. The server settings and the template wording are saved
 * separately, so editing one cannot lose unsaved work in the other.
 */
import { computed, ref } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { STORE_TABS } from '@/settingsTabs'
import { confirmDelete } from '@/utils/confirmDelete'
import { ChevronRight, Send, ExternalLink, RotateCcw, Mail, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  smtp: { type: Object, default: null },
  // The saved password never leaves the server; this only says whether one exists.
  hasPassword: { type: Boolean, default: false },
  templates: { type: Array, default: () => [] },
  logoSet: { type: Boolean, default: false },
})

/* ---------------------------------------------------------- server -- */

const form = useForm({
  email_from: props.smtp?.email_from ?? '',
  email_from_name: props.smtp?.email_from_name ?? '',
  contact_email: props.smtp?.contact_email ?? '',
  admin_email: props.smtp?.admin_email ?? '',
  use_smtp: Boolean(props.smtp?.use_smtp),
  smtp_host: props.smtp?.smtp_host ?? '',
  smtp_port: props.smtp?.smtp_port ?? '',
  smtp_encryption: props.smtp?.smtp_encryption || 'tls',
  smtp_username: props.smtp?.smtp_username ?? '',
  // Left blank on purpose: blank means "keep the saved password".
  smtp_password: '',
})

// The port and the encryption method go together; setting one on its own is
// the usual reason a connection silently fails.
const PORT_HINTS = { ssl: '465', tls: '587', none: '25' }

function onEncryptionChange() {
  const suggested = PORT_HINTS[form.smtp_encryption]
  const wasSuggested = Object.values(PORT_HINTS).includes(String(form.smtp_port))

  if (!form.smtp_port || wasSuggested) form.smtp_port = suggested
}

function submit() {
  form.post(route('admin.manage.storeOrUpdateSmtp'), {
    preserveScroll: true,
    onSuccess: () => { form.smtp_password = '' },
  })
}

/* ------------------------------------------------------------ test -- */

const testForm = useForm({ to: props.smtp?.contact_email ?? '', key: '' })

function sendTest() {
  testForm.post(route('admin.manage.sendTestEmail'), { preserveScroll: true })
}

/* ------------------------------------------------------- templates -- */

const openKey = ref(null)

// One form per template, built up front so switching between them keeps any
// edits that have not been saved yet.
const templateForms = Object.fromEntries(
  props.templates.map((t) => [
    t.key,
    useForm({
      subject: t.subject ?? '',
      heading: t.heading ?? '',
      intro: t.intro ?? '',
      outro: t.outro ?? '',
      is_enabled: t.is_enabled,
    }),
  ])
)

function toggleTemplate(key) {
  openKey.value = openKey.value === key ? null : key
}

function saveTemplate(key) {
  templateForms[key].post(route('admin.manage.emailTemplate.update', key), { preserveScroll: true })
}

async function resetTemplate(template) {
  const ok = await confirmDelete({
    title: `Reset “${template.label}”?`,
    text: 'Your wording will be replaced with the text this email ships with.',
    confirmButtonText: 'Reset wording',
  })

  if (ok) router.delete(route('admin.manage.emailTemplate.reset', template.key), { preserveScroll: true })
}

function insertPlaceholder(key, field, token) {
  templateForms[key][field] = `${templateForms[key][field] ?? ''}${token}`
}

const customerTemplates = computed(() => props.templates.filter((t) => t.audience === 'customer'))
const adminTemplates = computed(() => props.templates.filter((t) => t.audience === 'admin'))
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="Where email is sent from, and what each email says" />
      <SettingsTabs :tabs="STORE_TABS" />

      <div class="row g-3">
        <!-- ── Sending ──────────────────────────────────────────── -->
        <div class="col-lg-7">
          <form @submit.prevent="submit">
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Sending</h6>
                <p class="mb-0 text-muted small">Who your emails appear to come from, and where your own copies go.</p>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="email_from">From address</label>
                    <input
                      id="email_from"
                      v-model="form.email_from"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.email_from }"
                      placeholder="orders@yourshop.com"
                    >
                    <div class="invalid-feedback">{{ form.errors.email_from }}</div>
                    <small class="em-hint">Must be an address your mail server is allowed to send as.</small>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="email_from_name">From name</label>
                    <input
                      id="email_from_name"
                      v-model="form.email_from_name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.email_from_name }"
                      placeholder="Chhondo"
                    >
                    <div class="invalid-feedback">{{ form.errors.email_from_name }}</div>
                    <small class="em-hint">The name customers see in their inbox.</small>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="contact_email">Contact address</label>
                    <input
                      id="contact_email"
                      v-model="form.contact_email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.contact_email }"
                    >
                    <div class="invalid-feedback">{{ form.errors.contact_email }}</div>
                    <small class="em-hint">Shown to customers as the way to reach you.</small>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="admin_email">Order notifications to</label>
                    <input
                      id="admin_email"
                      v-model="form.admin_email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.admin_email }"
                      :placeholder="form.contact_email || 'you@yourshop.com'"
                    >
                    <div class="invalid-feedback">{{ form.errors.admin_email }}</div>
                    <small class="em-hint">Where the "new order" email lands. Blank uses the contact address.</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Mail server ────────────────────────────────────── -->
            <div class="card">
              <div class="card-header d-flex align-items-start justify-content-between">
                <div>
                  <h6 class="mb-0">Mail server</h6>
                  <p class="mb-0 text-muted small">
                    Switch this on to send through your own SMTP server. Off means the
                    server the site is hosted on sends the mail.
                  </p>
                </div>
                <div class="form-check form-switch mt-1">
                  <input
                    id="use_smtp"
                    v-model="form.use_smtp"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  >
                  <label class="form-check-label" for="use_smtp">Use SMTP</label>
                </div>
              </div>

              <div v-if="form.use_smtp" class="card-body">
                <div class="row g-3">
                  <div class="col-md-8">
                    <label class="form-label" for="smtp_host">SMTP host</label>
                    <input
                      id="smtp_host"
                      v-model="form.smtp_host"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.smtp_host }"
                      placeholder="smtp.gmail.com"
                      autocomplete="off"
                    >
                    <div class="invalid-feedback">{{ form.errors.smtp_host }}</div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label" for="smtp_port">Port</label>
                    <input
                      id="smtp_port"
                      v-model="form.smtp_port"
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.smtp_port }"
                      :placeholder="PORT_HINTS[form.smtp_encryption]"
                    >
                    <div class="invalid-feedback">{{ form.errors.smtp_port }}</div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label" for="smtp_encryption">Encryption</label>
                    <select
                      id="smtp_encryption"
                      v-model="form.smtp_encryption"
                      class="form-select"
                      :class="{ 'is-invalid': form.errors.smtp_encryption }"
                      @change="onEncryptionChange"
                    >
                      <option value="tls">TLS / STARTTLS (port 587)</option>
                      <option value="ssl">SSL (port 465)</option>
                      <option value="none">None (port 25)</option>
                    </select>
                    <div class="invalid-feedback">{{ form.errors.smtp_encryption }}</div>
                  </div>

                  <div class="col-md-8">
                    <label class="form-label" for="smtp_username">Username</label>
                    <input
                      id="smtp_username"
                      v-model="form.smtp_username"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.smtp_username }"
                      autocomplete="off"
                    >
                    <div class="invalid-feedback">{{ form.errors.smtp_username }}</div>
                    <small class="em-hint">Usually the full email address.</small>
                  </div>

                  <div class="col-md-12">
                    <label class="form-label" for="smtp_password">Password</label>
                    <input
                      id="smtp_password"
                      v-model="form.smtp_password"
                      type="password"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.smtp_password }"
                      :placeholder="hasPassword ? '•••••••• (saved — leave blank to keep it)' : ''"
                      autocomplete="new-password"
                    >
                    <div class="invalid-feedback">{{ form.errors.smtp_password }}</div>
                    <small class="em-hint">
                      Gmail and most providers need an app password, not your account password.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-fig-primary btn-fig-md" :disabled="form.processing">
                {{ form.processing ? 'Saving…' : 'Save email settings' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ── Test + branding ──────────────────────────────────── -->
        <div class="col-lg-5">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Send a test</h6>
              <p class="mb-0 text-muted small">Proves the settings above work, without placing an order.</p>
            </div>
            <div class="card-body">
              <label class="form-label" for="test_to">Send to</label>
              <div class="input-group">
                <input
                  id="test_to"
                  v-model="testForm.to"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': testForm.errors.to }"
                  placeholder="you@example.com"
                  @keyup.enter="sendTest"
                >
                <button type="button" class="btn btn-fig-secondary" :disabled="testForm.processing" @click="sendTest">
                  <Send :size="15" class="me-1" />
                  {{ testForm.processing ? 'Sending…' : 'Send' }}
                </button>
              </div>
              <div v-if="testForm.errors.to" class="text-danger small mt-2">{{ testForm.errors.to }}</div>
              <small class="em-hint mt-2 d-block">Save your changes first — the test uses the saved settings.</small>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Branding</h6>
            </div>
            <div class="card-body">
              <p class="mb-2 small text-muted">
                Every email uses the logo set in <strong>Store settings › Site logo</strong>. The file is
                attached to the message itself rather than linked from the site, so it shows even when the
                reader's mail client blocks remote images — and it keeps working if the site's address changes.
              </p>
              <p v-if="logoSet" class="mb-0 small em-ok">
                <Mail :size="14" class="me-1" /> A logo is set and will be embedded in every email.
              </p>
              <p v-else class="mb-0 small em-warn">
                <AlertTriangle :size="14" class="me-1" />
                No logo is set — emails fall back to the shop name in text.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Templates ──────────────────────────────────────────── -->
      <div class="card mt-1">
        <div class="card-header">
          <h6 class="mb-0">Email templates</h6>
          <p class="mb-0 text-muted small">
            What each automatic email says. Leave a field blank to use the wording it ships with.
          </p>
        </div>
        <div class="card-body">
          <template v-for="group in [
            { title: 'To your customers', items: customerTemplates },
            { title: 'To you', items: adminTemplates },
          ]" :key="group.title">
            <p v-if="group.items.length" class="em-group">{{ group.title }}</p>

            <div v-for="template in group.items" :key="template.key" class="em-tpl" :class="{ 'is-open': openKey === template.key }">
              <button type="button" class="em-tpl-head" @click="toggleTemplate(template.key)">
                <ChevronRight :size="14" class="em-caret" />
                <span class="em-tpl-name">{{ template.label }}</span>
                <span class="em-tpl-desc">{{ template.description }}</span>
                <span class="em-tpl-state" :class="template.always_on || templateForms[template.key].is_enabled ? 'is-on' : 'is-off'">
                  {{ template.always_on ? 'Always on' : (templateForms[template.key].is_enabled ? 'On' : 'Off') }}
                </span>
              </button>

              <div v-show="openKey === template.key" class="em-tpl-body">
                <p v-if="template.always_on" class="em-tpl-locked">
                  This email is always sent — customers use it to get back into their
                  account. You can still change the wording below.
                </p>
                <div v-else class="form-check form-switch mb-3">
                  <input
                    :id="`enabled-${template.key}`"
                    v-model="templateForms[template.key].is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  >
                  <label class="form-check-label" :for="`enabled-${template.key}`">Send this email</label>
                </div>

                <label class="form-label" :for="`subject-${template.key}`">Subject</label>
                <input
                  :id="`subject-${template.key}`"
                  v-model="templateForms[template.key].subject"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': templateForms[template.key].errors.subject }"
                >
                <div class="invalid-feedback">{{ templateForms[template.key].errors.subject }}</div>

                <label class="form-label mt-3" :for="`heading-${template.key}`">Heading</label>
                <input
                  :id="`heading-${template.key}`"
                  v-model="templateForms[template.key].heading"
                  type="text"
                  class="form-control"
                >

                <label class="form-label mt-3" :for="`intro-${template.key}`">Opening text</label>
                <textarea
                  :id="`intro-${template.key}`"
                  v-model="templateForms[template.key].intro"
                  class="form-control"
                  rows="3"
                ></textarea>

                <label class="form-label mt-3" :for="`outro-${template.key}`">Closing text</label>
                <textarea
                  :id="`outro-${template.key}`"
                  v-model="templateForms[template.key].outro"
                  class="form-control"
                  rows="2"
                ></textarea>

                <div class="em-tokens">
                  <span class="em-tokens-label">Insert into the closing text:</span>
                  <button
                    v-for="token in template.placeholders"
                    :key="token"
                    type="button"
                    class="em-token"
                    @click="insertPlaceholder(template.key, 'outro', token)"
                  >{{ token }}</button>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="d-flex gap-2">
                    <a
                      :href="route('admin.manage.emailTemplate.preview', template.key)"
                      target="_blank"
                      rel="noopener"
                      class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center"
                    >
                      <ExternalLink :size="14" class="me-1" /> Preview
                    </a>
                    <button
                      type="button"
                      class="btn btn-fig-secondary btn-fig-sm d-inline-flex align-items-center"
                      @click="resetTemplate(template)"
                    >
                      <RotateCcw :size="14" class="me-1" /> Reset wording
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-fig-primary btn-fig-sm"
                    :disabled="templateForms[template.key].processing"
                    @click="saveTemplate(template.key)"
                  >
                    {{ templateForms[template.key].processing ? 'Saving…' : 'Save template' }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.em-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

.em-ok { color: #1a2110; }
.em-warn { color: #a15c00; }

.em-group {
  margin: 14px 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-muted, #9ca3af);
}

.em-group:first-child { margin-top: 0; }

.em-tpl {
  border: 1px solid #ece7e0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.em-tpl.is-open { border-color: #d9d2c8; }

.em-tpl-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 14px;
  background: #fff;
  border: 0;
  text-align: left;
}

.em-tpl.is-open .em-tpl-head { background: #faf7f2; }

.em-caret { transition: transform 0.15s ease; flex: none; }
.em-tpl.is-open .em-caret { transform: rotate(90deg); }

.em-tpl-name { font-weight: 600; flex: none; }

.em-tpl-desc {
  flex: 1;
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.em-tpl-state {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.em-tpl-state.is-on { background: #eef4e6; color: #1a2110; }
.em-tpl-state.is-off { background: #f1efec; color: #8b847d; }

.em-tpl-locked {
  margin: 0 0 1rem;
  padding: 0.6rem 0.75rem;
  background: #f6f8f2;
  border-left: 3px solid #1a2110;
  border-radius: 4px;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #55605f;
}

.em-tpl-body {
  padding: 4px 14px 16px;
  border-top: 1px solid #f1ede7;
}

.em-tokens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

.em-tokens-label {
  font-size: 12px;
  color: var(--ink-muted, #9ca3af);
}

.em-token {
  padding: 2px 7px;
  border: 1px solid #e4ded6;
  border-radius: 4px;
  background: #fbf9f6;
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 11px;
  color: #5c5751;
}

.em-token:hover { background: #f2ede6; }
</style>
