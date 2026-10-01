<script setup>
/**
 * REVE SMS settings.
 *
 * Credentials, the message customers get when they place an order, and two
 * checks — balance and a test send — so the setup can be proven without
 * placing a real order.
 */
import { computed, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { INTEGRATION_TABS } from '@/settingsTabs'
import { toast } from '@/utils/toast'
import { Wallet, Send, KeyRound } from 'lucide-vue-next'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  defaultBaseUrl: { type: String, default: '' },
  defaultTemplate: { type: String, default: '' },
  placeholders: { type: Array, default: () => [] },
})

const form = useForm({
  api_key: props.config.api_key ?? '',
  // Left blank keeps whatever secret is already stored.
  secret_key: '',
  sender_id: props.config.sender_id ?? '',
  client_id: props.config.client_id ?? '',
  base_url: props.config.base_url || props.defaultBaseUrl,
  order_message: props.config.order_message || props.defaultTemplate,
  is_active: Boolean(props.config.is_active),
})

function submit() {
  form.post(route('sms.store'), {
    preserveScroll: true,
    onSuccess: () => { form.secret_key = '' },
  })
}

/* ---------------------------------------------------------- diagnostics -- */

const balance = ref(null)
const checkingBalance = ref(false)

async function checkBalance() {
  checkingBalance.value = true
  try {
    const { data } = await axios.post(route('sms.getBalance'))
    balance.value = data.message
    if (!data.ok) toast('error', data.message)
  } catch {
    toast('error', 'Could not reach the gateway.')
  } finally {
    checkingBalance.value = false
  }
}

const testPhone = ref('')
const testing = ref(false)

async function sendTest() {
  if (!testPhone.value.trim()) {
    toast('error', 'Type a number to send the test to.')
    return
  }

  testing.value = true
  try {
    const { data } = await axios.post(route('sms.test'), { phone: testPhone.value })
    toast(data.ok ? 'success' : 'error', data.message)
  } catch {
    toast('error', 'Could not reach the gateway.')
  } finally {
    testing.value = false
  }
}

/* ------------------------------------------------------------- template -- */

function insertPlaceholder(token) {
  form.order_message = `${form.order_message} ${token}`.replace(/\s+/g, ' ').trim()
}

/**
 * A Bangla SMS is Unicode: 70 characters per part, 67 once it is split. Latin
 * text gets the usual 160/153. Operators bill per part, so the count is worth
 * showing while the message is being written.
 */
const smsParts = computed(() => {
  const text = form.order_message || ''
  const unicode = /[^\u0000-\u007F]/.test(text)
  const single = unicode ? 70 : 160
  const multi = unicode ? 67 : 153

  if (text.length === 0) return { unicode, chars: 0, parts: 0 }

  return {
    unicode,
    chars: text.length,
    parts: text.length <= single ? 1 : Math.ceil(text.length / multi),
  }
})
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="SMS" subtitle="REVE SMS gateway and the message customers get when they order" />

      <SettingsTabs :tabs="INTEGRATION_TABS" />

      <form @submit.prevent="submit">
        <div class="row g-4">
          <!-- ── Credentials ─────────────────────────────────── -->
          <div class="col-lg-7">
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Gateway credentials</h6>
                <p class="mb-0 text-muted small">From your REVE portal at smpp.revesms.com.</p>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="sms-key">API key</label>
                    <input
                      id="sms-key"
                      v-model="form.api_key"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.api_key }"
                    >
                    <div class="invalid-feedback">{{ form.errors.api_key }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="sms-secret">
                      Secret key
                      <span v-if="config.has_secret" class="sms-saved"><KeyRound :size="12" /> saved</span>
                    </label>
                    <input
                      id="sms-secret"
                      v-model="form.secret_key"
                      type="password"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.secret_key }"
                      :placeholder="config.has_secret ? 'Leave blank to keep the saved key' : ''"
                    >
                    <div class="invalid-feedback">{{ form.errors.secret_key }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="sms-sender">Sender ID</label>
                    <input
                      id="sms-sender"
                      v-model="form.sender_id"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.sender_id }"
                    >
                    <div class="invalid-feedback">{{ form.errors.sender_id }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="sms-client">Client ID <span class="text-muted">(optional)</span></label>
                    <input id="sms-client" v-model="form.client_id" type="text" class="form-control">
                    <small class="sms-hint">Only needed for the balance check.</small>
                  </div>

                  <div class="col-12">
                    <label class="form-label" for="sms-url">API URL</label>
                    <input
                      id="sms-url"
                      v-model="form.base_url"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.base_url }"
                    >
                    <div class="invalid-feedback">{{ form.errors.base_url }}</div>
                    <small class="sms-hint">
                      Default {{ defaultBaseUrl }} — use the http port 7788 address if https is blocked on your server.
                    </small>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="sms-active" v-model="form.is_active" class="form-check-input" type="checkbox" role="switch">
                      <label class="form-check-label" for="sms-active">
                        {{ form.is_active ? 'On — order confirmations are sent' : 'Off — nothing is sent' }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Order message ─────────────────────────────── -->
            <div class="card mt-4">
              <div class="card-header">
                <h6 class="mb-0">Order confirmation message</h6>
                <p class="mb-0 text-muted small">Sent to the customer as soon as an order is placed.</p>
              </div>
              <div class="card-body">
                <textarea
                  v-model="form.order_message"
                  class="form-control"
                  rows="4"
                  :class="{ 'is-invalid': form.errors.order_message }"
                ></textarea>
                <div class="invalid-feedback">{{ form.errors.order_message }}</div>

                <div class="d-flex flex-wrap align-items-center gap-2 mt-2">
                  <span class="sms-hint me-1">Insert:</span>
                  <button
                    v-for="token in placeholders"
                    :key="token"
                    type="button"
                    class="sms-token"
                    @click="insertPlaceholder(token)"
                  >
                    {{ token }}
                  </button>
                </div>

                <p class="sms-count mt-2">
                  {{ smsParts.chars }} characters ·
                  {{ smsParts.parts }} SMS part{{ smsParts.parts === 1 ? '' : 's' }} ·
                  {{ smsParts.unicode ? 'Unicode (Bangla), 70 characters per part' : 'Latin, 160 characters per part' }}
                </p>
              </div>
            </div>
          </div>

          <!-- ── Checks ──────────────────────────────────────── -->
          <div class="col-lg-5">
            <div class="card">
              <div class="card-header"><h6 class="mb-0">Check the setup</h6></div>
              <div class="card-body">
                <button type="button" class="btn btn-fig-secondary btn-fig-sm w-100" :disabled="checkingBalance" @click="checkBalance">
                  <Wallet :size="15" class="me-1" />
                  {{ checkingBalance ? 'Checking…' : 'Check balance' }}
                </button>
                <p v-if="balance" class="sms-balance mt-2">{{ balance }}</p>

                <hr class="my-3">

                <label class="form-label" for="sms-test">Send a test message</label>
                <div class="d-flex gap-2">
                  <input id="sms-test" v-model="testPhone" type="tel" class="form-control" placeholder="01XXXXXXXXX">
                  <button type="button" class="btn btn-fig-secondary btn-fig-sm flex-shrink-0" :disabled="testing" @click="sendTest">
                    <Send :size="15" class="me-1" />
                    {{ testing ? 'Sending…' : 'Send' }}
                  </button>
                </div>
                <small class="sms-hint">Uses the saved settings, so save first if you have just changed them.</small>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-body">
                <button type="submit" class="btn btn-fig-primary w-100" :disabled="form.processing">
                  {{ form.processing ? 'Saving…' : 'Save SMS settings' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.sms-hint {
  font-size: var(--fs-xs, 12px);
  color: var(--text-faint, #98a08f);
}

.sms-saved {
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

.sms-token {
  padding: 2px 9px;
  border: 1px solid var(--line, #e5e8df);
  border-radius: var(--r-full, 999px);
  background: var(--surface, #fff);
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--text-muted, #6b7563);
  cursor: pointer;
}

.sms-token:hover {
  border-color: var(--admin-green-600, #356019);
  color: var(--admin-green-600, #356019);
}

.sms-count {
  margin: 0;
  font-size: var(--fs-xs, 12px);
  color: var(--text-muted, #6b7563);
}

.sms-balance {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--r-sm, 6px);
  background: var(--surface-sunk, #f7f8f5);
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
  color: var(--text, #1f2a17);
}
</style>
