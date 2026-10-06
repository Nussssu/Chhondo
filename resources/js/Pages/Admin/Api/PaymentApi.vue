<script setup>
/**
 * SSLCommerz settings.
 *
 * Store credentials, the sandbox/live switch, and the callback URLs to paste
 * into the SSLCommerz merchant panel.
 */
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { INTEGRATION_TABS } from '@/settingsTabs'
import { toast } from '@/utils/toast'
import { KeyRound, Copy, Check, TriangleAlert } from 'lucide-vue-next'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  callbacks: { type: Object, default: () => ({}) },
})

const form = useForm({
  store_id: props.config.store_id ?? '',
  // Left blank keeps whatever password is already stored.
  store_password: '',
  sandbox: props.config.sandbox !== false,
  is_active: Boolean(props.config.is_active),
})

function submit() {
  form.post(route('payment.store'), {
    preserveScroll: true,
    onSuccess: () => { form.store_password = '' },
  })
}

const copied = ref(null)

async function copy(key, value) {
  try {
    await navigator.clipboard.writeText(value)
    copied.value = key
    setTimeout(() => { if (copied.value === key) copied.value = null }, 1500)
  } catch {
    toast('error', 'Could not copy — select the text instead.')
  }
}

const callbackRows = [
  ['success', 'Success URL'],
  ['fail', 'Fail URL'],
  ['cancel', 'Cancel URL'],
  ['ipn', 'IPN URL'],
]
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Payment gateway" subtitle="SSLCommerz — cards, mobile banking and internet banking" />

      <SettingsTabs :tabs="INTEGRATION_TABS" />

      <form @submit.prevent="submit">
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">SSLCommerz credentials</h6>
                <p class="mb-0 text-muted small">From your SSLCommerz merchant panel.</p>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="pg-store">Store ID</label>
                    <input
                      id="pg-store"
                      v-model="form.store_id"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.store_id }"
                    >
                    <div class="invalid-feedback">{{ form.errors.store_id }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="pg-pass">
                      Store password
                      <span v-if="config.has_password" class="pg-saved"><KeyRound :size="12" /> saved</span>
                    </label>
                    <input
                      id="pg-pass"
                      v-model="form.store_password"
                      type="password"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.store_password }"
                      :placeholder="config.has_password ? 'Leave blank to keep the saved password' : ''"
                    >
                    <div class="invalid-feedback">{{ form.errors.store_password }}</div>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="pg-sandbox" v-model="form.sandbox" class="form-check-input" type="checkbox" role="switch">
                      <label class="form-check-label" for="pg-sandbox">
                        {{ form.sandbox ? 'Sandbox — test payments only, no real money' : 'Live — real payments' }}
                      </label>
                    </div>
                    <small class="pg-hint">
                      Sandbox talks to sandbox.sslcommerz.com; live talks to securepay.sslcommerz.com.
                      Each needs its own store ID and password.
                    </small>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="pg-active" v-model="form.is_active" class="form-check-input" type="checkbox" role="switch">
                      <label class="form-check-label" for="pg-active">
                        {{ form.is_active ? 'On — customers can pay online at checkout' : 'Off — cash on delivery only' }}
                      </label>
                    </div>
                  </div>

                  <div v-if="!form.sandbox && form.is_active" class="col-12">
                    <p class="pg-warn">
                      <TriangleAlert :size="15" />
                      Live mode is on. Real cards will be charged.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header">
                <h6 class="mb-0">Callback URLs</h6>
                <p class="mb-0 text-muted small">
                  Paste these into your SSLCommerz panel. They are sent with every payment
                  request too, so most accounts work without changing anything there.
                </p>
              </div>
              <div class="card-body">
                <div v-for="[key, label] in callbackRows" :key="key" class="pg-url-row">
                  <span class="pg-url-label">{{ label }}</span>
                  <code class="pg-url">{{ callbacks[key] }}</code>
                  <button type="button" class="table-icon-btn" :title="`Copy ${label}`" @click="copy(key, callbacks[key])">
                    <Check v-if="copied === key" :size="14" />
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
                <ol class="pg-steps">
                  <li>The customer picks <strong>Pay online</strong> at checkout.</li>
                  <li>The order is saved as <strong>unpaid</strong> and they go to SSLCommerz.</li>
                  <li>They pay by card, bKash, Nagad or bank.</li>
                  <li>
                    We confirm the payment with SSLCommerz directly before marking it paid —
                    the return from the browser alone is never trusted.
                  </li>
                  <li>The confirmation SMS goes out once the money is in.</li>
                </ol>
                <p class="pg-hint mb-0">
                  Cash on delivery keeps working whether this is on or off.
                </p>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-body">
                <button type="submit" class="btn btn-fig-primary w-100" :disabled="form.processing">
                  {{ form.processing ? 'Saving…' : 'Save payment settings' }}
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
.pg-hint {
  display: block;
  margin-top: 4px;
  font-size: var(--fs-xs, 12px);
  line-height: 1.5;
  color: var(--text-faint, #9c9591);
}

.pg-saved {
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

.pg-warn {
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

.pg-url-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line, #e4e1e0);
}

.pg-url-row:last-child { border-bottom: 0; }

.pg-url-label {
  font-size: var(--fs-xs, 12px);
  font-weight: 600;
  color: var(--text-muted, #6d6560);
}

.pg-url {
  overflow-x: auto;
  padding: 4px 8px;
  border-radius: var(--r-sm, 6px);
  background: var(--surface-sunk, #f5f4f2);
  font-size: 12px;
  color: var(--text, #1a1817);
  white-space: nowrap;
}

.pg-steps {
  margin: 0 0 12px;
  padding-left: 18px;
  font-size: var(--fs-sm, 13px);
  line-height: 1.7;
  color: var(--text-muted, #6d6560);
}
</style>
