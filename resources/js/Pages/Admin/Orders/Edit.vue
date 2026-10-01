<template>
  <AdminLayout>
    <div class="page-content">

      <div class="col-12">
        <div class="col-12 p-0">
          <div class="card">
            <div class="card-header">
              <h5>Edit Order</h5>
              <p>Invoice No: {{ order.invoice_number }}</p>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row w-full m-auto">

            <div class="col-md-6 card">
              <div class="card-header">
                <h6>Customer Information</h6>
              </div>
              <div class="card-body">

                <OrderInfoFields
                  :form="form"
                  :order="order"
                  :payment-types="paymentTypes"
                  :payment-methods="paymentMethods"
                  @area-change="onDeliveryAreaChange"
                />

              </div>
            </div>

            <!-- Order items (products in this order) -->
            <div class="col-md-6 p-0 ps-md-3">
              <div class="card">
                <div class="card-header">
                  <h5 class="fw-400">Order Products</h5>
                </div>
                <div class="card-body">
                  <ProductPicker
                    :initial-products="products"
                    :products-route="editRoute"
                    class="mb-4"
                    @add-to-cart="addToCart"
                  />

                  <div v-if="loadingCart" class="d-flex gap-2 justify-content-center align-items-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
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

                  <button type="button" class="btn btn-fig-primary btn-fig-md w-100 mt-4" :disabled="submitting" @click="submitOrderUpdate">
                    {{ submitting ? 'Updating...' : 'Update' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import OrderInfoFields from './Partials/OrderInfoFields.vue'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import ProductPicker from './Partials/ProductPicker.vue'
import CartTable from './Partials/CartTable.vue'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: Object,
  orders: Object,
  product_attribute_data: Array,
  pathao_city: Array,
  comments: Array,
  couriar_settings: Object,
  products: Object,
  redux: Array,
  pathao_couriar_settings: Object,
  deliveryCharge: Object,
  categories: Array,
  paymentTypes: { type: Object, default: () => ({}) },
  paymentMethods: { type: Array, default: () => [] },
})

const editRoute = route('admin.orders.edit', { id: props.order.id })
const carPushRoute = route('admin.orders.carPush', { id: props.order.id })

const form = reactive({
  name: props.order.customer_name,
  address: props.order.address,
  phone: props.order.phone_number,
  order_status: props.order.order_status,
  note: props.order.note ?? '',
  // Previously N/A was blanked, so every counter sale opened with an empty
  // area field even though a value was recorded.
  delivery_charge_area: props.order.delivery ?? '',
  alternative_phone: props.order.alternative_phone_number ?? '',
  email: props.order.email ?? '',
  payment_type: props.order.payment_type ?? '',
  payment_method: props.order.payment_method ?? '',
  payment_reference: props.order.payment_reference ?? '',
  courier: props.order.couriar_name ?? '',
  courier_note: props.order.courier_note ?? '',
})

const cart = ref([])
const cartProducts = ref([])
const loadingCart = ref(true)
const submitting = ref(false)
const discount = ref(Number(props.order.discount ?? 0))
const deliveryCharge = ref(Number(props.order.delivery_charge ?? 0))

function pushCart(nextCart) {
  return axios.post(carPushRoute, { cart: nextCart }).then((res) => {
    cart.value = res.data.cart
    cartProducts.value = res.data.products
  })
}

function onCartChange(nextCart) {
  pushCart(nextCart)
}

function addToCart(payload) {
  const idx = cart.value.findIndex((p) =>
    String(p.productId) === String(payload.productId) &&
    JSON.stringify(p.selected) === JSON.stringify(payload.selected) &&
    String(p.combinationId ?? '') === String(payload.combinationId ?? '')
  )

  let next
  if (idx > -1) {
    if (cart.value[idx].quantity + 1 > payload.qty) {
      toast('warning', 'Not enough stock')
      return
    }
    next = cart.value.map((c, i) => i === idx
      ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * payload.price }
      : c)
  } else {
    next = [...cart.value, {
      productId: payload.productId,
      name: payload.name,
      combinationId: payload.combinationId,
      selected: payload.selected,
      price: payload.price,
      quantity: 1,
      availableQty: payload.qty,
      totalPrice: payload.price,
    }]
  }

  if (window.audioPath === undefined) window.audioPath = '/public_audio_add-tocart.mp3'
  try { new Audio(window.audioPath).play() } catch (e) { /* ignore */ }

  pushCart(next)
}

function onDeliveryAreaChange() {
  if (!props.deliveryCharge) return
  deliveryCharge.value = form.delivery_charge_area === 'inside'
    ? Number(props.deliveryCharge.shipping_charge_inside_dhaka)
    : form.delivery_charge_area === 'outside'
      ? Number(props.deliveryCharge.shipping_charge_outside_dhaka)
      : 0
}

function submitOrderUpdate() {
  submitting.value = true
  const subtotal = cart.value.reduce((s, i) => s + Number(i.totalPrice || 0), 0)
  const total = subtotal - Number(discount.value || 0) + Number(deliveryCharge.value || 0)

  axios.post(route('admin.orders.orderInfoUpdate'), {
    order_id: props.order.id,
    name: form.name,
    address: form.address,
    phone: form.phone,
    alternativephone: form.alternative_phone,
    email: form.email,
    order_status: form.order_status,
    note: form.note,
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
      if (res.data.success) {
        window.location.href = document.referrer || route('admin.orders.index')
      } else {
        toast('error', res.data?.message || 'Something went wrong. Please try again.')
      }
    })
    .catch((err) => {
      toast('error', err.response?.data?.message || 'Something went wrong. Please try again.')
    })
    .finally(() => { submitting.value = false })
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  pushCart([]).finally(() => { loadingCart.value = false })
})
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
