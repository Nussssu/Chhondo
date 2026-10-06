<template>
  <div class="modal-backdrop-custom" @click.self="$emit('close')">
    <div class="edit-modal" ref="modalRoot">
      <div class="modal-header-custom">
        <div>
          <h5 class="mb-0">Edit Order</h5>
          <small class="text-muted" v-if="order">Invoice No: {{ order.invoice_number }}</small>
        </div>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>

      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border" role="status"></div>
      </div>

      <div v-else-if="order" class="modal-body-custom">
        <OrderInfoFields
          :form="form"
          :order="order"
          :payment-types="paymentTypes"
          :payment-methods="paymentMethods"
          @area-change="onDeliveryAreaChange"
        />

        <div class="products-section">
          <h6 class="products-title">Order Products</h6>
          <div v-if="loadingCart" class="d-flex gap-2 justify-content-center align-items-center py-4">
            <div class="spinner-border" role="status"></div>
            <span>Loading products....</span>
          </div>
          <CartTable
            v-else
            :cart="cart"
            :products="cartProducts"
            v-model:discount="discount"
            v-model:delivery-charge="deliveryCharge"
            @update:cart="onCartChange"
          />
        </div>
      </div>

      <div v-if="order" class="modal-footer-custom">
        <button type="button" class="btn btn-fig-secondary btn-fig-md" @click="$emit('close')">Cancel</button>
        <button type="button" class="btn btn-fig-primary btn-fig-md" :disabled="saving" @click="submitUpdate">
          {{ saving ? 'Saving...' : 'Update' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import CartTable from './CartTable.vue'
import OrderInfoFields from './OrderInfoFields.vue'
import { toast } from '@/utils/toast'

const props = defineProps({
  orderId: { type: [Number, String], required: true },
})
const emit = defineEmits(['close', 'updated'])

const loading = ref(true)
const saving = ref(false)
const loadingCart = ref(true)
const order = ref(null)
const deliveryChargeSettings = ref(null)
const modalRoot = ref(null)

const cart = ref([])
const cartProducts = ref([])
const discount = ref(0)
const deliveryCharge = ref(0)

const paymentTypes = ref({})
const paymentMethods = ref([])

const form = reactive({
  name: '',
  address: '',
  phone: '',
  alternative_phone: '',
  email: '',
  order_status: 'pending',
  note: '',
  delivery_charge_area: '',
  payment_type: '',
  payment_method: '',
  payment_reference: '',
  courier: '',
  courier_note: '',
})

function pushCart(nextCart) {
  return axios.post(route('admin.orders.carPush', { id: props.orderId }), { cart: nextCart }).then((res) => {
    cart.value = res.data.cart
    cartProducts.value = res.data.products
  })
}

function onCartChange(nextCart) {
  pushCart(nextCart)
}

function onDeliveryAreaChange() {
  if (!deliveryChargeSettings.value) return
  deliveryCharge.value = form.delivery_charge_area === 'inside'
    ? Number(deliveryChargeSettings.value.shipping_charge_inside_dhaka)
    : form.delivery_charge_area === 'outside'
      ? Number(deliveryChargeSettings.value.shipping_charge_outside_dhaka)
      : 0
}

function submitUpdate() {
  saving.value = true
  const subtotal = cart.value.reduce((s, i) => s + Number(i.totalPrice || 0), 0)
  const total = subtotal - Number(discount.value || 0) + Number(deliveryCharge.value || 0)

  axios.post(route('admin.orders.orderInfoUpdate'), {
    order_id: props.orderId,
    name: form.name,
    address: form.address,
    phone: form.phone,
    alternativephone: form.alternative_phone,
    email: form.email,
    order_status: form.order_status,
    note: form.note ?? '',
    delivery_charge_area: form.delivery_charge_area,
    payment_type: form.payment_type,
    payment_method: form.payment_method,
    payment_reference: form.payment_reference,
    courier: form.courier,
    courier_note: form.courier_note,
    delivery_charge: deliveryCharge.value,
    cart: cart.value,
    subtotal,
    discount: discount.value,
    total,
  })
    .then((res) => {
      saving.value = false
      if (res.data.success) {
        emit('updated')
      } else {
        toast('error', res.data?.message || 'Something went wrong. Please try again.')
      }
    })
    .catch((err) => {
      saving.value = false
      toast('error', err.response?.data?.message || 'Something went wrong. Please try again.')
    })
}

onMounted(() => {
  fetch(route('admin.orders.editData', { id: props.orderId }), {
    headers: { Accept: 'application/json' },
  })
    .then((r) => r.json())
    .then((data) => {
      order.value = data.order
      deliveryChargeSettings.value = data.deliveryCharge
      form.name = data.order.customer_name
      form.address = data.order.address
      form.phone = data.order.phone_number
      form.order_status = data.order.order_status
      form.note = data.order.note ?? ''
      // Previously N/A was blanked, so every counter sale opened with an empty
      // area field even though a value was recorded.
      form.delivery_charge_area = data.order.delivery ?? ''
      form.alternative_phone = data.order.alternative_phone_number ?? ''
      form.email = data.order.email ?? ''
      form.payment_type = data.order.payment_type ?? ''
      form.payment_method = data.order.payment_method ?? ''
      form.payment_reference = data.order.payment_reference ?? ''
      form.courier = data.order.couriar_name ?? ''
      form.courier_note = data.order.courier_note ?? ''
      paymentTypes.value = data.paymentTypes ?? {}
      paymentMethods.value = data.paymentMethods ?? []
      discount.value = Number(data.order.discount ?? 0)
      deliveryCharge.value = Number(data.order.delivery_charge ?? 0)
      loading.value = false

      pushCart([]).finally(() => { loadingCart.value = false })
      axios.post(route('admin.orders.markViewed'), { order_id: props.orderId }).catch(() => {})
    })

  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 1055; padding: 20px;
}
.edit-modal {
  background: white; border-radius: 10px; width: 95vw; max-width: 1180px; max-height: 92vh;
  overflow-y: auto; display: flex; flex-direction: column;
}
.modal-header-custom {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid #F0EDE9;
}
.modal-body-custom { padding: 24px; overflow-y: auto; }
.modal-footer-custom {
  display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px; border-top: 1px solid #F0EDE9;
}

.edit-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  margin-bottom: 24px;
}
.edit-form-grid .form-group.span-2 { grid-column: 1 / -1; }
.edit-form-grid label {
  display: block; font-size: 12.5px; font-weight: 600; color: #3C3834; margin-bottom: 6px;
}

.products-section { border-top: 1px solid #F0EDE9; padding-top: 18px; }
.products-title {
  font-size: 12.5px; font-weight: 700; color: #1a2110;
  text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 12px;
}

@media (max-width: 640px) {
  .edit-form-grid { grid-template-columns: 1fr; }
  .edit-form-grid .form-group.span-2 { grid-column: auto; }
}
</style>
