<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Integrations" subtitle="Connect the services the shop depends on" />
      <SettingsTabs :tabs="INTEGRATION_TABS" />

      <div v-if="$page.props.errors && Object.keys($page.props.errors).length" class="alert alert-danger">
        <ul>
          <li v-for="(error, key) in $page.props.errors" :key="key">{{ error }}</li>
        </ul>
      </div>

      <div class="row g-4 mt-5">
        <div class="col-md-12 row">

          <!-- Steadfast & Redx Form -->
          <div class="col-md-6">
            <form :action="route('couriarApi.store')" method="POST">
              <input type="hidden" name="_token" :value="csrfToken">

              <div class="row">

                <!-- Steadfast Card -->
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-center">
                        <img class="img-fluid" style="height: 250px" :src="'/uploads/Steadfast.png'" />
                      </div>

                      <div class="d-flex flex-column align-items-center">
                        <p class="fw-bold" style="margin: 0; padding: 0; color: #5e72e4">Select Steadfast</p>
                        <input type="hidden" name="steadfast" value="no">
                        <div class="form-check form-switch mt-2">
                          <input
                            type="checkbox"
                            class="form-check-input toggle-switch"
                            name="steadfast"
                            value="yes"
                            style="cursor: pointer"
                            :checked="courierSetting && courierSetting.steadfast === 'yes'"
                          />
                        </div>
                      </div>

                      <div class="col-md-12">
                        <label for="api_key" class="form-label">Courier API Key</label>
                        <input type="text" name="api_key" class="form-control" id="api_key" placeholder="API Key"
                          :value="courierSetting ? courierSetting.api_key : ''">
                      </div>

                      <div class="col-md-12 mt-2">
                        <label for="secret_key" class="form-label">Courier Secret Key</label>
                        <input type="text" name="secret_key" class="form-control" id="secret_key"
                          placeholder="Secret Key"
                          :value="courierSetting ? courierSetting.secret_key : ''">
                      </div>

                      <button class="btn btn-fig-primary btn-fig-md w-100 mt-3 mb-5">Submit</button>
                    </div>
                  </div>
                </div>

                <!-- Redx Card -->
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-center">
                        <img class="img-fluid" style="height: 250px" :src="'/uploads/Redx.png'" />
                      </div>

                      <div class="d-flex flex-column align-items-center">
                        <p class="fw-bold" style="margin: 0; padding: 0; color: #5e72e4">Select Redx</p>
                        <input type="hidden" name="redx" value="no">
                        <div class="form-check form-switch mt-2">
                          <input
                            type="checkbox"
                            class="form-check-input toggle-switch"
                            name="redx"
                            value="yes"
                            style="cursor: pointer"
                            :checked="courierSetting && courierSetting.redx === 'yes'"
                          />
                        </div>
                      </div>

                      <div class="col-md-12">
                        <label for="redx_sandbox" class="form-label">RedX Sandbox Url</label>
                        <input type="text" class="form-control" id="redx_sandbox" name="redx_sandbox"
                          :value="courierSetting ? courierSetting.redx_sandbox : ''"
                          placeholder="RedX Sandbox Mode" disabled>
                      </div>

                      <div class="col-md-12 mt-2">
                        <label for="redx_access_token" class="form-label">RedX Access Token</label>
                        <input type="text" class="form-control" id="redx_access_token" name="redx_access_token"
                          :value="courierSetting ? courierSetting.redx_access_token : ''"
                          placeholder="RedX Access Token">
                      </div>

                      <button class="btn btn-fig-primary btn-fig-md w-100 mt-3 mb-5">Submit</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>

          <!-- Pathao Form -->
          <div class="col-md-5">
            <div class="row">
              <div class="col-md-12">
                <div class="card shadow-sm">
                  <div class="card-body">
                    <form method="POST" :action="route('generateApiToken')">
                      <input type="hidden" name="_token" :value="csrfToken">

                      <div class="d-flex justify-content-center align-center" style="height: 200px; align-items: center;">
                        <img class="img-fluid" style="height: 200px; align-items: center;" :src="'/uploads/Pathao.png'" />
                      </div>

                      <div class="d-flex flex-column align-items-center">
                        <p class="fw-bold" style="margin: 0; padding: 0; color: #5e72e4">Select Pathao</p>
                        <div class="form-check form-switch mt-2">
                          <input
                            type="checkbox"
                            class="form-check-input toggle-switch"
                            name="is_enabled"
                            value="yes"
                            style="cursor: pointer"
                            id="is_enabled"
                            :checked="patho && patho.is_enabled === 'yes'"
                          />
                        </div>
                      </div>

                      <div class="col-md-12 row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="client_id" class="form-label">Client ID</label>
                            <input type="text" name="client_id" class="form-control" id="client_id" placeholder="Enter Client ID" :value="patho ? patho.client_id : ''" required>
                          </div>
                          <div class="mb-3">
                            <label for="client_secret" class="form-label">Client Secret</label>
                            <input type="text" name="client_secret" class="form-control" id="client_secret" placeholder="Enter Client Secret" :value="patho ? patho.client_secret : ''" required>
                          </div>
                          <div class="mb-3">
                            <label for="store_id" class="form-label">Store ID</label>
                            <input type="text" name="StoreId" class="form-control" id="store_id" placeholder="Enter Store ID" :value="patho ? patho.StoreId : ''" required>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="email" name="username" class="form-control" id="username" placeholder="Enter Email" :value="patho ? patho.username : ''" required>
                          </div>
                          <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" id="password" placeholder="Enter Password" :value="patho ? patho.password : ''" required>
                          </div>
                        </div>
                      </div>

                      <div class="d-grid">
                        <button type="submit" class="btn btn-fig-primary btn-fig-md">Generate Token</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Steadfast delivery updates — saved on its own, the moment it is switched. -->
      <div class="card mt-4">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3">
            <div class="flex-grow-1">
              <h5 class="mb-1">Steadfast delivery updates</h5>
              <p class="mb-0 text-muted small">
                When on, Steadfast tells the shop when a parcel is delivered, partly delivered
                or cancelled, and the order status is updated automatically.
              </p>
            </div>
            <div class="form-check form-switch m-0">
              <input id="steadfast_webhook" class="form-check-input" type="checkbox" role="switch"
                style="width: 3em; height: 1.5em; cursor: pointer;"
                :checked="webhookOn" :disabled="savingWebhook"
                @change="toggleWebhook($event)">
              <label class="form-check-label visually-hidden" for="steadfast_webhook">Steadfast delivery updates</label>
            </div>
          </div>

          <div class="mt-3">
            <label class="form-label small mb-1" for="steadfast_webhook_url">Webhook URL — paste this into your Steadfast account</label>
            <div class="input-group">
              <input id="steadfast_webhook_url" class="form-control" :value="steadfastWebhook?.url" readonly>
              <button type="button" class="btn btn-outline-secondary" @click="copyUrl">{{ copied ? 'Copied' : 'Copy' }}</button>
            </div>
          </div>

          <div v-if="webhookOn && !steadfastWebhook?.tokenSet" class="alert alert-warning small mt-3 mb-0">
            No webhook token is set, so every update from Steadfast will be refused. Add
            <code>STEADFAST_BEARER_TOKEN</code> to the server's <code>.env</code> with the token from your
            Steadfast account.
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { INTEGRATION_TABS } from '@/settingsTabs'

const props = defineProps({
  courierSetting: Object,
  patho: Object,
  steadfastWebhook: Object,
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

const webhookOn = computed(() => Boolean(props.steadfastWebhook?.enabled))
const savingWebhook = ref(false)
const copied = ref(false)

function toggleWebhook(event) {
  savingWebhook.value = true
  router.post(route('couriarApi.steadfastWebhook'), { enabled: event.target.checked }, {
    preserveScroll: true,
    // If the save fails, put the switch back to what is actually stored.
    onError: () => { event.target.checked = webhookOn.value },
    onFinish: () => { savingWebhook.value = false },
  })
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(props.steadfastWebhook?.url ?? '')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    document.getElementById('steadfast_webhook_url')?.select()
  }
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
