<template>
  <div class="oi">
    <!-- What the order is, before what can be changed about it. -->
    <div class="oi-facts">
      <span><b>Invoice</b> {{ order.invoice_number }}</span>
      <span><b>Placed</b> {{ placedOn }}</span>
      <span><b>Source</b> {{ order.order_type === 'pos' ? 'Counter sale (POS)' : 'Storefront' }}</span>
      <span v-if="order.couriar_name"><b>Courier</b> {{ order.couriar_name }}</span>
      <span v-if="order.tracking_code"><b>Tracking</b> {{ order.tracking_code }}</span>
      <span v-if="order.consignment_id"><b>Consignment</b> {{ order.consignment_id }}</span>
    </div>

    <p class="oi-section">Customer</p>
    <div class="oi-grid">
      <div class="form-group">
        <label :for="`${uid}-name`">আপনার নাম</label>
        <input :id="`${uid}-name`" v-model="form.name" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label :for="`${uid}-phone`">আপনার মোবাইল</label>
        <input :id="`${uid}-phone`" v-model="form.phone" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label :for="`${uid}-altphone`">Alternative phone</label>
        <input :id="`${uid}-altphone`" v-model="form.alternative_phone" type="text" class="form-control" placeholder="Optional">
      </div>
      <div class="form-group">
        <label :for="`${uid}-email`">Email</label>
        <input :id="`${uid}-email`" v-model="form.email" type="email" class="form-control" placeholder="Optional">
      </div>
      <div class="form-group span-2">
        <label :for="`${uid}-address`">আপনার ঠিকানা</label>
        <input :id="`${uid}-address`" v-model="form.address" type="text" class="form-control">
      </div>
    </div>

    <p class="oi-section">Order</p>
    <div class="oi-grid">
      <div class="form-group">
        <label :for="`${uid}-status`">Status</label>
        <select :id="`${uid}-status`" v-model="form.order_status" class="form-select">
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status === 'shipped' ? 'Courier Order' : status.charAt(0).toUpperCase() + status.slice(1) }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label :for="`${uid}-area`">আপনার এরিয়া সিলেক্ট করুন</label>
        <select :id="`${uid}-area`" v-model="form.delivery_charge_area" class="form-select" @change="$emit('area-change')">
          <option value="">Select area</option>
          <option value="inside">ঢাকার ভেতরে</option>
          <option value="outside">ঢাকার বাহিরে</option>
        </select>
      </div>
      <div class="form-group span-2">
        <label :for="`${uid}-note`">Order Note</label>
        <textarea :id="`${uid}-note`" v-model="form.note" class="form-control" rows="2"></textarea>
      </div>
    </div>

    <p class="oi-section">Payment</p>
    <div class="oi-grid">
      <div class="form-group">
        <label :for="`${uid}-paytype`">Payment type</label>
        <select :id="`${uid}-paytype`" v-model="form.payment_type" class="form-select" @change="onPaymentTypeChange">
          <option value="">Not recorded</option>
          <option v-for="(label, key) in paymentTypes" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <!-- Which provider only matters once the payment is online. -->
      <div v-if="form.payment_type === 'online'" class="form-group">
        <label :for="`${uid}-paymethod`">Payment method</label>
        <select :id="`${uid}-paymethod`" v-model="form.payment_method" class="form-select">
          <option value="">Select method</option>
          <option v-for="m in paymentMethods" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
      <div v-if="form.payment_type === 'online'" class="form-group">
        <label :for="`${uid}-payref`">Transaction reference</label>
        <input :id="`${uid}-payref`" v-model="form.payment_reference" type="text" class="form-control" placeholder="Optional">
      </div>
    </div>

    <p class="oi-section">Courier</p>
    <div class="oi-grid">
      <div class="form-group">
        <label :for="`${uid}-courier`">Courier</label>
        <input :id="`${uid}-courier`" v-model="form.courier" type="text" class="form-control" placeholder="Not sent to a courier yet">
      </div>
      <div class="form-group">
        <label :for="`${uid}-couriernote`">Courier note</label>
        <input :id="`${uid}-couriernote`" v-model="form.courier_note" type="text" class="form-control" placeholder="Optional">
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Every editable field on an order, shared by the edit modal and the
 * full-page editor. They were separate copies of the same form, which is how
 * the same two select bugs came to exist in both.
 *
 * `form` is a reactive object owned by the parent and mutated here directly —
 * with a dozen fields, v-model plumbing per field would be pure noise.
 */
import { computed } from 'vue'

const props = defineProps({
  form: { type: Object, required: true },
  order: { type: Object, required: true },
  paymentTypes: { type: Object, default: () => ({}) },
  paymentMethods: { type: Array, default: () => [] },
})

defineEmits(['area-change'])

// Ids must be unique when both editors are ever on one page.
const uid = `oi-${Math.random().toString(36).slice(2, 8)}`

const KNOWN_STATUSES = [
  'pending', 'processed', 'on delivery', 'shipped',
  'delivered', 'cancelled', 'returned', 'incomplete',
]

/**
 * A status the list does not know about renders as a blank select, which hides
 * the order's real state and invites an accidental change on save. Anything
 * stored is offered, so the field always reflects the record.
 */
const statuses = computed(() => {
  const current = props.form.order_status
  return current && !KNOWN_STATUSES.includes(current)
    ? [...KNOWN_STATUSES, current]
    : KNOWN_STATUSES
})

const placedOn = computed(() =>
  props.order.created_at
    ? new Date(props.order.created_at).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '—'
)

function onPaymentTypeChange() {
  // A provider is meaningless once the payment is no longer online.
  if (props.form.payment_type !== 'online') {
    props.form.payment_method = ''
    props.form.payment_reference = ''
  }
}
</script>

<style scoped>
.oi-facts {
  display: flex; flex-wrap: wrap; gap: 6px 18px;
  background: #F7F6F4; border-radius: 8px;
  padding: 10px 14px; margin-bottom: 18px;
  font-size: 12px; color: #5C554E;
}
.oi-facts b { color: #3C3834; font-weight: 700; margin-right: 4px; }

.oi-section {
  font-size: 11.5px; font-weight: 700; color: #234011;
  text-transform: uppercase; letter-spacing: .05em;
  margin: 0 0 10px;
}
.oi-section:not(:first-of-type) { margin-top: 20px; }

.oi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 22px;
}
.oi-grid .form-group.span-2 { grid-column: 1 / -1; }
.oi-grid label {
  display: block; font-size: 12.5px; font-weight: 600; color: #3C3834; margin-bottom: 6px;
}

@media (max-width: 700px) {
  .oi-grid { grid-template-columns: 1fr; }
}
</style>
