<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="Your shop's name, contact numbers and theme colours" />
      <SettingsTabs :tabs="STORE_TABS" />

      <!-- Maintenance mode — saved on its own, the moment it is switched. -->
      <div class="card mt-3" :class="{ 'border-warning': maintenanceOn }">
        <div class="card-body d-flex align-items-center gap-3">
          <div class="flex-grow-1">
            <h5 class="mb-1">
              Maintenance mode
              <span v-if="maintenanceOn" class="badge bg-warning text-dark ms-2 align-middle">On</span>
            </h5>
            <p class="mb-0 text-muted small">
              While on, every storefront page shows a “We’ll be back shortly” notice.
              Signed-in staff can still browse the shop and use this panel. Payment and
              courier callbacks keep working.
            </p>
          </div>
          <div class="form-check form-switch m-0">
            <input id="maintenance_mode" class="form-check-input" type="checkbox" role="switch"
              style="width: 3em; height: 1.5em; cursor: pointer;"
              :checked="maintenanceOn" :disabled="savingMaintenance"
              @change="toggleMaintenance($event)">
            <label class="form-check-label visually-hidden" for="maintenance_mode">Maintenance mode</label>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">
          <h5 class="mb-1">General</h5>
          <p class="mb-0 text-muted small">
            Delivery charges and free shipping moved to the Delivery tab. Page copy —
            titles, footer and checkout text — is edited under Content › Pages.
          </p>
        </div>

        <div class="card-body">
          <form :action="route('admin.manage.storeOrUpdate')" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="_token" :value="csrfToken">
            <input v-if="siteInfo" type="hidden" name="_method" value="PUT">

            <div class="row">

              <!-- App Name -->
              <div class="col-md-6 mb-3">
                <label for="app_name" class="form-label">App Name</label>
                <input type="text" id="app_name" name="app_name" class="form-control"
                  :value="siteInfo?.app_name ?? ''" required>
              </div>

              <!-- Phone Number -->
              <div class="col-md-6 mb-3">
                <label for="phone_number" class="form-label">Phone Number</label>
                <input type="text" id="phone_number" name="phone_number" class="form-control"
                  :value="siteInfo?.phone_number ?? ''" required>
              </div>

              <!-- WhatsApp Number -->
              <div class="col-md-6 mb-3">
                <label for="whatsapp_number" class="form-label">WhatsApp Number</label>
                <input type="text" id="whatsapp_number" name="whatsapp_number" class="form-control"
                  :value="siteInfo?.whatsapp_number ?? ''" required>
              </div>

              <!-- Quantity Indicator -->
              <div class="col-md-6 mb-3">
                <label for="quantity_indicator" class="form-label">Quantity Indicator</label>
                <input type="number" id="quantity_indicator" name="quantity_indicator" class="form-control"
                  :value="siteInfo?.quantity_indicator ?? ''">
              </div>

              <div class="col-12 mb-3">
                <label for="group_link" class="form-label">Group link</label>
                <input id="group_link" name="group_link" class="form-control"
                  :value="siteInfo?.group_link ?? ''">
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Main color" name="mainColor"
                  :model-value="siteInfo?.mainColor" fallback="#356019" />
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Secondary color" name="secondColor"
                  :model-value="siteInfo?.secondColor" fallback="#80532E" />
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Cart button color" name="cart_bg"
                  :model-value="siteInfo?.cart_bg" fallback="#d89b02" />
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Order now button color" name="order_now_bg"
                  :model-value="siteInfo?.order_now_bg" fallback="#d89b02" />
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Call now button color" name="call_now_bg"
                  :model-value="siteInfo?.call_now_bg" fallback="#ff0000" />
              </div>

              <div class="col-md-6 mb-3">
                <ColorField label="Whatsapp button color" name="whatsapp_bg"
                  :model-value="siteInfo?.whatsapp_bg" fallback="#00c220" />
              </div>

            </div>

            <div class="mb-3">
              <button type="submit" class="btn btn-fig-primary btn-fig-md">Save</button>
            </div>
          </form>
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
import ColorField from '@/components/Admin/ColorField.vue'
import { STORE_TABS } from '@/settingsTabs'

const props = defineProps({
  siteInfo: {
    type: Object,
    default: null
  }
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

const maintenanceOn = computed(() => Boolean(props.siteInfo?.maintenance_mode))
const savingMaintenance = ref(false)

function toggleMaintenance(event) {
  const enabled = event.target.checked

  if (enabled && !window.confirm('Turn on maintenance mode? Customers will not be able to browse or order until you turn it off.')) {
    event.target.checked = false
    return
  }

  savingMaintenance.value = true
  router.post(route('admin.manage.maintenanceMode'), { enabled }, {
    preserveScroll: true,
    // If the save fails, put the switch back to what is actually stored.
    onError: () => { event.target.checked = maintenanceOn.value },
    onFinish: () => { savingMaintenance.value = false },
  })
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
