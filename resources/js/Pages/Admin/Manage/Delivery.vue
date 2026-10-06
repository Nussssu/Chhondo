<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="What delivery costs, and when it is free" />
      <SettingsTabs :tabs="STORE_TABS" />

      <form :action="route('admin.manage.storeOrUpdate')" method="POST">
        <input type="hidden" name="_token" :value="csrfToken">
        <input v-if="siteInfo" type="hidden" name="_method" value="PUT">

        <div class="card mt-3">
          <div class="card-header">
            <h5 class="mb-1">Delivery charges</h5>
            <p class="mb-0 text-muted small">
              What a customer is quoted at checkout, by area. These are also what the
              order screens fall back to.
            </p>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="shipping_charge_inside_dhaka" class="form-label">Inside Dhaka</label>
                <div class="input-group">
                  <span class="input-group-text">৳</span>
                  <input
                    id="shipping_charge_inside_dhaka"
                    name="shipping_charge_inside_dhaka"
                    type="number" step="0.01" min="0"
                    class="form-control"
                    :class="{ 'is-invalid': errors.shipping_charge_inside_dhaka }"
                    :value="siteInfo?.shipping_charge_inside_dhaka ?? ''"
                  >
                  <div class="invalid-feedback">{{ errors.shipping_charge_inside_dhaka }}</div>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="shipping_charge_outside_dhaka" class="form-label">Outside Dhaka</label>
                <div class="input-group">
                  <span class="input-group-text">৳</span>
                  <input
                    id="shipping_charge_outside_dhaka"
                    name="shipping_charge_outside_dhaka"
                    type="number" step="0.01" min="0"
                    class="form-control"
                    :class="{ 'is-invalid': errors.shipping_charge_outside_dhaka }"
                    :value="siteInfo?.shipping_charge_outside_dhaka ?? ''"
                  >
                  <div class="invalid-feedback">{{ errors.shipping_charge_outside_dhaka }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-header">
            <h5 class="mb-1">Free shipping</h5>
            <p class="mb-0 text-muted small">
              Waives the delivery charge above, for every area.
            </p>
          </div>

          <div class="card-body">
            <!-- An unticked checkbox posts nothing, so the "off" value is sent
                 by this hidden field sitting in front of it. -->
            <input type="hidden" name="free_shipping_enabled" value="0">

            <div class="form-check form-switch mb-1">
              <input
                id="free_shipping_enabled"
                v-model="enabled"
                name="free_shipping_enabled"
                class="form-check-input"
                type="checkbox"
                value="1"
              >
              <label class="form-check-label" for="free_shipping_enabled">
                Offer free shipping
              </label>
            </div>
            <p class="text-muted small mb-0">
              {{ enabled ? 'Choose when it applies.' : 'Every order is charged the delivery rate for its area.' }}
            </p>

            <div v-if="enabled" class="fs-options mt-3">
              <label class="fs-option" :class="{ 'is-on': mode === 'all' }">
                <input v-model="mode" type="radio" name="free_shipping_mode" value="all">
                <span>
                  <strong>Apply to all products</strong>
                  <small>No delivery charge on any order, whatever it comes to.</small>
                </span>
              </label>

              <label class="fs-option" :class="{ 'is-on': mode === 'minimum' }">
                <input v-model="mode" type="radio" name="free_shipping_mode" value="minimum">
                <span>
                  <strong>Above a minimum purchase</strong>
                  <small>Free once the order reaches the amount below.</small>
                </span>
              </label>
            </div>

            <div v-if="enabled && mode === 'minimum'" class="row mt-3">
              <div class="col-md-6">
                <label for="free_shipping_min_amount" class="form-label">Minimum purchase</label>
                <div class="input-group">
                  <span class="input-group-text">৳</span>
                  <input
                    id="free_shipping_min_amount"
                    v-model="minAmount"
                    name="free_shipping_min_amount"
                    type="number" step="0.01" min="0.01"
                    class="form-control"
                    :class="{ 'is-invalid': errors.free_shipping_min_amount }"
                    placeholder="e.g. 4000"
                  >
                  <div class="invalid-feedback">{{ errors.free_shipping_min_amount }}</div>
                </div>
                <small class="text-muted d-block mt-1">
                  Measured on the order total before any coupon — what the customer
                  actually put in the basket.
                </small>
              </div>
            </div>

            <p v-if="enabled" class="fs-summary mt-3">{{ summary }}</p>
          </div>
        </div>

        <div class="mt-3 mb-4">
          <button type="submit" class="btn btn-fig-primary btn-fig-md">Save</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
/**
 * Delivery rates and the shop-wide free-shipping rule, on one screen.
 *
 * The rates used to sit among the general store settings, where their
 * relationship to free shipping was not visible. The rule mirrors
 * SiteInfo::shipsFree(), which is what the checkout actually charges.
 */
import { computed, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { STORE_TABS } from '@/settingsTabs'

const props = defineProps({
  siteInfo: { type: Object, default: null },
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

const errors = computed(() => usePage().props.errors ?? {})

const enabled = ref(Boolean(props.siteInfo?.free_shipping_enabled))
const mode = ref(props.siteInfo?.free_shipping_mode || 'all')
const minAmount = ref(props.siteInfo?.free_shipping_min_amount ?? '')

/** Says the saved rule back in the words a shopper would hear it in. */
const summary = computed(() => {
  if (mode.value !== 'minimum') {
    return 'Every order ships free — no delivery charge is added at checkout.'
  }

  const amount = Number(minAmount.value) || 0

  return amount > 0
    ? `Orders of ৳${amount} or more ship free. Below that, the rate for the customer's area applies.`
    : 'Enter a minimum purchase — until then no order qualifies for free shipping.'
})
</script>

<style scoped>
.fs-options {
  display: grid;
  gap: var(--sp-2);
}

@media (min-width: 768px) {
  .fs-options { grid-template-columns: 1fr 1fr; }
}

.fs-option {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  cursor: pointer;
}

.fs-option:hover { background: var(--surface-sunk); }

.fs-option.is-on {
  border-color: var(--bs-primary, #252f17);
  background: color-mix(in srgb, var(--bs-primary, #252f17) 5%, #fff);
}

.fs-option input { margin-top: 3px; }

.fs-option strong {
  display: block;
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--text);
}

.fs-option small {
  display: block;
  margin-top: 2px;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.fs-summary {
  margin: 0;
  padding: var(--sp-3);
  border-radius: var(--r-sm);
  background: var(--surface-sunk);
  font-size: var(--fs-sm);
  color: var(--text);
}
</style>
