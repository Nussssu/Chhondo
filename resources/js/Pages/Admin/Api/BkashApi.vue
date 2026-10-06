<script setup>
/**
 * bKash settings.
 *
 * Tokenized Checkout credentials, the sandbox/live switch, the on/off switch
 * that shows bKash at checkout, and a connection test against bKash itself.
 */
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { INTEGRATION_TABS } from '@/settingsTabs'
import { toast } from '@/utils/toast'
import { KeyRound, Copy, Check, TriangleAlert, PlugZap, FlaskConical } from 'lucide-vue-next'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  sandboxCredentials: { type: Object, default: () => ({}) },
  callbackUrl: { type: String, default: '' },
})

const form = useForm({
  username: props.config.username ?? '',
  app_key: props.config.app_key ?? '',
  // Left blank keeps whatever secret is already stored.
  password: '',
  app_secret: '',
  sandbox: props.config.sandbox !== false,
  is_active: Boolean(props.config.is_active),
})

function submit() {
  form.post(route('bkash.store'), {
    preserveScroll: true,
    onSuccess: () => {
      form.password = ''
      form.app_secret = ''
    },
  })
}

// bKash's public sandbox account, so the flow can be tried before a merchant
// account exists. Still has to be saved.
function useSandboxCredentials() {
  Object.assign(form, props.sandboxCredentials, { sandbox: true })
  toast('success', 'Sandbox credentials filled in — save to use them.')
}

const testing = ref(false)
const testResult = ref(null)

async function testConnection() {
  if (form.isDirty) {
    toast('error', 'Save your changes first — the test uses the saved credentials.')
    return
  }

  testing.value = true
  testResult.value = null

  try {
    const { data } = await axios.post(route('bkash.test'))
    testResult.value = data
  } catch {
    testResult.value = { ok: false, message: 'The test request failed.' }
  } finally {
    testing.value = false
  }
}

// Served from public/, so bound as a string rather than bundled by Vite.
const bkashLogo = "/assets/images/payment/bkash-pay.png"

const copied = ref(false)

async function copyCallback() {
  try {
    await navigator.clipboard.writeText(props.callbackUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    toast('error', 'Could not copy — select the text instead.')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="bKash" subtitle="bKash Tokenized Checkout — customers pay from their bKash wallet" />

      <SettingsTabs :tabs="INTEGRATION_TABS" />

      <form @submit.prevent="submit">
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card">
              <div class="card-header bk-header">
                <div>
                  <h6 class="mb-0">bKash credentials</h6>
                  <p class="mb-0 text-muted small">From your bKash merchant (PGW) onboarding email.</p>
                </div>
                <img :src="bkashLogo" alt="bKash" class="bk-logo">
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="bk-user">Username</label>
                    <input
                      id="bk-user"
                      v-model="form.username"
                      type="text"
                      autocomplete="off"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.username }"
                    >
                    <div class="invalid-feedback">{{ form.errors.username }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="bk-pass">
                      Password
                      <span v-if="config.has_password" class="bk-saved"><KeyRound :size="12" /> saved</span>
                    </label>
                    <input
                      id="bk-pass"
                      v-model="form.password"
                      type="password"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.password }"
                      :placeholder="config.has_password ? 'Leave blank to keep the saved password' : ''"
                    >
                    <div class="invalid-feedback">{{ form.errors.password }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="bk-key">App key</label>
                    <input
                      id="bk-key"
                      v-model="form.app_key"
                      type="text"
                      autocomplete="off"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.app_key }"
                    >
                    <div class="invalid-feedback">{{ form.errors.app_key }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="bk-secret">
                      App secret
                      <span v-if="config.has_app_secret" class="bk-saved"><KeyRound :size="12" /> saved</span>
                    </label>
                    <input
                      id="bk-secret"
                      v-model="form.app_secret"
                      type="password"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.app_secret }"
                      :placeholder="config.has_app_secret ? 'Leave blank to keep the saved secret' : ''"
                    >
                    <div class="invalid-feedback">{{ form.errors.app_secret }}</div>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="bk-sandbox" v-model="form.sandbox" class="form-check-input" type="checkbox" role="switch">
                      <label class="form-check-label" for="bk-sandbox">
                        {{ form.sandbox ? 'Sandbox — test payments only, no real money' : 'Live — real payments' }}
                      </label>
                    </div>
                    <small class="bk-hint">
                      Sandbox and live each need their own credentials.
                      <button type="button" class="bk-link" @click="useSandboxCredentials">
                        <FlaskConical :size="12" /> Fill in bKash's public sandbox credentials
                      </button>
                    </small>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="bk-active" v-model="form.is_active" class="form-check-input" type="checkbox" role="switch">
                      <label class="form-check-label" for="bk-active">
                        {{ form.is_active ? 'Enabled — bKash is offered at checkout' : 'Disabled — bKash is hidden at checkout' }}
                      </label>
                    </div>
                  </div>

                  <div v-if="!form.sandbox && form.is_active" class="col-12">
                    <p class="bk-warn">
                      <TriangleAlert :size="15" />
                      Live mode is on. Customers' bKash wallets will be charged.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header">
                <h6 class="mb-0">Callback URL</h6>
                <p class="mb-0 text-muted small">
                  Sent with every payment, so nothing needs to be set in bKash. Give it to
                  bKash if they ask for it during onboarding.
                </p>
              </div>
              <div class="card-body">
                <div class="bk-url-row">
                  <code class="bk-url">{{ callbackUrl }}</code>
                  <button type="button" class="table-icon-btn" title="Copy callback URL" @click="copyCallback">
                    <Check v-if="copied" :size="14" />
                    <Copy v-else :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card">
              <div class="card-header"><h6 class="mb-0">How it works</h6></div>
              <div class="card-body">
                <ol class="bk-steps">
                  <li>The customer picks <strong>bKash</strong> at checkout.</li>
                  <li>The order is saved as <strong>unpaid</strong> and they go to the bKash page.</li>
                  <li>They enter their bKash number, the OTP and their PIN.</li>
                  <li>
                    We complete the payment with bKash directly and check the amount before
                    marking it paid — the redirect from the browser alone is never trusted.
                  </li>
                  <li>The confirmation SMS goes out once the money is in.</li>
                </ol>
                <p class="bk-hint mb-0">
                  Sandbox test wallet: <strong>01929918378</strong> (or 01619777283), OTP <strong>123456</strong>, PIN <strong>12121</strong>.
                </p>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-body d-grid gap-2">
                <button type="submit" class="btn btn-fig-primary w-100" :disabled="form.processing">
                  {{ form.processing ? 'Saving…' : 'Save bKash settings' }}
                </button>
                <button
                  type="button"
                  class="btn btn-fig-secondary w-100"
                  :disabled="testing || !config.has_password"
                  @click="testConnection"
                >
                  <PlugZap :size="14" />
                  {{ testing ? 'Testing…' : 'Test connection' }}
                </button>
                <p v-if="testResult" class="bk-result" :class="testResult.ok ? 'is-ok' : 'is-bad'">
                  {{ testResult.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.bk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bk-logo { height: 34px; width: auto; }

.bk-hint {
  display: block;
  margin-top: 4px;
  font-size: var(--fs-xs, 12px);
  line-height: 1.5;
  color: var(--text-faint, #9c9591);
}

.bk-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 4px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-weight: 600;
  color: #e2136e;
  cursor: pointer;
}

.bk-link:hover { text-decoration: underline; }

.bk-saved {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 6px;
  padding: 1px 7px;
  border-radius: var(--r-full, 999px);
  background: var(--st-success-soft, #dcfce7);
  font-size: 11px;
  font-weight: 600;
  color: var(--st-success, #15803d);
}

.bk-warn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 9px 12px;
  border-radius: var(--r-sm, 6px);
  background: var(--st-warning-soft, #fef3c7);
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
  color: var(--st-warning, #b45309);
}

.bk-url-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.bk-url {
  overflow-x: auto;
  padding: 4px 8px;
  border-radius: var(--r-sm, 6px);
  background: var(--surface-sunk, #f5f4f2);
  font-size: 12px;
  color: var(--text, #1a1817);
  white-space: nowrap;
}

.bk-steps {
  margin: 0 0 12px;
  padding-left: 18px;
  font-size: var(--fs-sm, 13px);
  line-height: 1.7;
  color: var(--text-muted, #6d6560);
}

.bk-result {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--r-sm, 6px);
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
}

.bk-result.is-ok { background: var(--st-success-soft, #dcfce7); color: var(--st-success, #15803d); }
.bk-result.is-bad { background: var(--st-danger-soft, #fee2e2); color: var(--st-danger, #b91c1c); }
</style>
