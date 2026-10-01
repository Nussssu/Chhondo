<template>
  <AdminLayout>
    <!--
      Till layout: browse on the left, the running ticket pinned on the right.
      Each pane scrolls on its own so the Checkout button and the product
      search are always on screen, however long the order gets.
    -->
    <div class="page-content pos">
      <div ref="shellRef" class="pos-shell">

        <!-- LEFT: product catalogue -->
        <section class="pos-catalog" aria-label="Products">
          <PosProductGrid
            ref="gridRef"
            :initial-products="products"
            :products-route="route('admin.pos.manage')"
            :categories="categories"
            @quick-add="onQuickAdd"
          />
        </section>

        <!-- RIGHT: the order being built -->
        <aside class="pos-ticket" aria-label="Current order">
          <header class="pt-head">
            <div class="pt-customer">
              <div class="pt-customer-search">
                <PosUserSearch @select="onUserSelect" />
              </div>
              <button type="button" class="btn btn-fig-secondary btn-fig-sm pt-new-customer"
                title="Create a new customer" @click="showCreateUserModal = true">
                <UserPlus :size="15" />
              </button>
            </div>

            <div class="pt-customer-chip" :class="{ 'is-walkin': !namedCustomer }">
              <User :size="13" />
              <span class="pt-customer-name">{{ selectedUser?.name || 'Walk-in customer' }}</span>
              <span v-if="selectedUser?.phone" class="pt-customer-phone">{{ selectedUser.phone }}</span>
              <button v-if="namedCustomer" type="button" class="pt-customer-clear"
                title="Clear customer" @click="clearCustomer">&times;</button>
            </div>
          </header>

          <!-- Line items -->
          <div class="pt-items">
            <div v-if="!cart.length" class="pt-empty">
              <ShoppingCart :size="30" />
              <p class="mb-0 mt-2">No items yet</p>
              <p class="pt-empty-hint mb-0">Tap a product to start the order.</p>
            </div>

            <div v-for="(item, i) in cart" :key="i" class="pt-line">
              <div class="pt-line-main">
                <span class="pt-line-name" :title="item.name">{{ item.name }}</span>
                <button type="button" class="pt-line-remove" title="Remove" @click="removeItem(i)">
                  <X :size="13" />
                </button>
              </div>

              <div v-if="item.selected?.length" class="pt-line-variants">
                <span v-for="s in item.selected" :key="s.name" class="pt-chip">{{ s.value }}</span>
              </div>

              <div class="pt-line-controls">
                <div class="pt-stepper">
                  <button type="button" class="pt-step" :disabled="item.quantity <= 1" @click="step(item, -1)">−</button>
                  <input v-model.number="item.quantity" type="number" min="1" :max="item.availableQty"
                    class="pt-step-input" @change="recalcItem(item)">
                  <button type="button" class="pt-step" :disabled="item.quantity >= item.availableQty" @click="step(item, 1)">+</button>
                </div>

                <label class="pt-unit">
                  <span class="pt-unit-label">৳</span>
                  <input v-model.number="item.price" type="number" min="0" step="0.01"
                    class="pt-unit-input" title="Unit price" @change="recalcItem(item)">
                </label>

                <span class="pt-line-total">৳{{ Number(item.totalPrice).toFixed(2) }}</span>
              </div>

              <p v-if="item.quantity >= item.availableQty" class="pt-line-note">
                Only {{ item.availableQty }} in stock
              </p>
            </div>
          </div>

          <!-- Totals and checkout -->
          <footer class="pt-foot">
            <div class="pt-fields">
              <label class="pt-field">
                <span>Delivery</span>
                <select v-model="deliveryArea" class="form-select form-select-sm">
                  <option value="">Collected in store</option>
                  <option value="inside">Inside Dhaka · ৳{{ deliveryCharges.inside_dhaka }}</option>
                  <option value="outside">Outside Dhaka · ৳{{ deliveryCharges.outside_dhaka }}</option>
                </select>
              </label>
              <label class="pt-field">
                <span>Discount</span>
                <input v-model.number="discount" type="number" min="0" class="form-control form-control-sm" placeholder="0">
              </label>
            </div>

            <div v-if="needsDelivery" class="pt-fields">
              <label class="pt-field">
                <span>Phone</span>
                <input v-model="phone" type="text" class="form-control form-control-sm" placeholder="01XXXXXXXXX">
              </label>
              <label class="pt-field">
                <span>Address</span>
                <input v-model="address" type="text" class="form-control form-control-sm" placeholder="Delivery address">
              </label>
            </div>

            <div class="pt-pay">
              <span class="pt-field-label">Payment</span>
              <div class="pt-pay-types">
                <button
                  v-for="(label, key) in paymentTypes"
                  :key="key"
                  type="button"
                  class="pt-pay-type"
                  :class="{ 'is-on': paymentType === key }"
                  @click="setPaymentType(key)"
                >{{ label }}</button>
              </div>

              <!-- Which provider only matters once the payment is online. -->
              <div v-if="paymentType === 'online'" class="pt-pay-methods">
                <div v-for="group in methodGroups" :key="group.name" class="pt-pay-group">
                  <span class="pt-pay-group-name">{{ group.name }}</span>
                  <div class="pt-pay-chips">
                    <button
                      v-for="m in group.items"
                      :key="m.value"
                      type="button"
                      class="pt-pay-chip"
                      :class="{ 'is-on': paymentMethod === m.value }"
                      @click="paymentMethod = m.value"
                    >{{ m.label }}</button>
                  </div>
                </div>

                <input
                  v-model="paymentReference"
                  type="text"
                  class="form-control form-control-sm mt-2"
                  :placeholder="referencePlaceholder"
                >
              </div>
            </div>

            <dl class="pt-totals">
              <div><dt>Subtotal <span class="pt-count">{{ itemCount }} item{{ itemCount === 1 ? '' : 's' }}</span></dt><dd>৳{{ subtotal.toFixed(2) }}</dd></div>
              <div v-if="discount > 0"><dt>Discount</dt><dd class="is-minus">− ৳{{ Number(discount).toFixed(2) }}</dd></div>
              <div v-if="shippingLocation > 0"><dt>Delivery</dt><dd>৳{{ Number(shippingLocation).toFixed(2) }}</dd></div>
              <div class="pt-grand"><dt>Total</dt><dd>৳{{ total.toFixed(2) }}</dd></div>
            </dl>

            <div v-if="takesCash" class="pt-paid">
              <label class="pt-field pt-field--paid">
                <span>Cash received</span>
                <input v-model.number="paid" type="number" min="0" class="form-control form-control-sm" placeholder="0">
              </label>
              <div class="pt-change" :class="{ 'is-short': changeDue < 0 }">
                <span>{{ changeDue < 0 ? 'Short by' : 'Change' }}</span>
                <strong>৳{{ Math.abs(changeDue).toFixed(2) }}</strong>
              </div>
            </div>

            <p v-if="validationMessage" class="pt-warn">{{ validationMessage }}</p>

            <div class="pt-actions">
              <button type="button" class="btn btn-fig-secondary btn-fig-md" :disabled="!cart.length" @click="resetCart">
                Clear
              </button>
              <button type="button" class="btn btn-fig-primary btn-fig-md pt-checkout"
                :disabled="checkingOut || !cart.length" @click="checkout">
                {{ checkingOut ? 'Processing…' : `Charge ৳${total.toFixed(2)}` }}
              </button>
            </div>
          </footer>
        </aside>
      </div>

      <PosCreateUserModal v-if="showCreateUserModal" @close="showCreateUserModal = false" @created="onUserCreated" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PosProductGrid from './Partials/PosProductGrid.vue'
import PosUserSearch from '../Orders/Partials/PosUserSearch.vue'
import PosCreateUserModal from '../Orders/Partials/PosCreateUserModal.vue'
import { ShoppingCart, X, User, UserPlus } from 'lucide-vue-next'
import { toast } from '@/utils/toast'
import { confirmDelete } from '@/utils/confirmDelete'

const props = defineProps({
  products: { type: Object, required: true },
  deliveryCharges: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  user: { type: Object, default: null },
  paymentTypes: { type: Object, default: () => ({}) },
  paymentMethods: { type: Array, default: () => [] },
})

const cart = ref([])
const selectedUser = ref(props.user)
const phone = ref(props.user?.phone ?? '')
const address = ref(props.user?.address ?? '')
// The area is what the order records; the charge is derived from it, so the
// two can never disagree.
const deliveryArea = ref('')
const discount = ref(0)
const paid = ref(null)
const paymentType = ref('cash')
const paymentMethod = ref(null)
const paymentReference = ref('')
const showCreateUserModal = ref(false)
const checkingOut = ref(false)
const gridRef = ref(null)
const shellRef = ref(null)

/**
 * The till fills whatever is left below the admin chrome. Measuring the shell's
 * own offset beats hardcoding a topbar height, which silently breaks the layout
 * the next time that chrome changes.
 */
function sizeShell() {
  const el = shellRef.value
  if (!el) return
  el.style.setProperty('--pos-top', `${Math.round(el.getBoundingClientRect().top)}px`)
}

onMounted(() => {
  sizeShell()
  window.addEventListener('resize', sizeShell)
})

onBeforeUnmount(() => window.removeEventListener('resize', sizeShell))

const WALK_IN = 'walking@user.com'

/** The seeded walk-in account is a placeholder, not a real named customer. */
const namedCustomer = computed(() =>
  !!selectedUser.value && selectedUser.value.id !== props.user?.id
)

const itemCount = computed(() => cart.value.reduce((n, i) => n + Number(i.quantity || 0), 0))
const subtotal = computed(() => cart.value.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0))
const shippingLocation = computed(() => {
  if (deliveryArea.value === 'inside') return Number(props.deliveryCharges.inside_dhaka) || 0
  if (deliveryArea.value === 'outside') return Number(props.deliveryCharges.outside_dhaka) || 0
  return 0
})

const total = computed(() =>
  Math.max(0, subtotal.value - Number(discount.value || 0) + shippingLocation.value)
)
const changeDue = computed(() => Number(paid.value || 0) - total.value)
const needsDelivery = computed(() => deliveryArea.value !== '')

// Cash changes hands at the counter; the other two do not, so the change
// calculator only applies to a cash sale.
const takesCash = computed(() => paymentType.value === 'cash')

const methodGroups = computed(() => {
  const groups = []
  for (const m of props.paymentMethods) {
    let group = groups.find((g) => g.name === m.group)
    if (!group) groups.push(group = { name: m.group, items: [] })
    group.items.push(m)
  }
  return groups
})

const referencePlaceholder = computed(() => {
  if (paymentMethod.value === 'cheque') return 'Cheque number (optional)'
  if (paymentMethod.value === 'bank') return 'Reference / account (optional)'
  if (paymentMethod.value === 'card') return 'Last 4 digits (optional)'
  return 'Transaction ID (optional)'
})

function setPaymentType(key) {
  paymentType.value = key
  if (key !== 'online') {
    paymentMethod.value = null
    paymentReference.value = ''
  }
  if (key !== 'cash') paid.value = null
}

// A delivery order is normally paid on delivery; an in-store sale is not.
watch(needsDelivery, (delivery) => {
  if (delivery && paymentType.value === 'cash') setPaymentType('cod')
  if (!delivery && paymentType.value === 'cod') setPaymentType('cash')
})

const validationMessage = computed(() => {
  if (Number(discount.value || 0) > subtotal.value) return 'Discount is larger than the subtotal.'
  if (paymentType.value === 'online' && !paymentMethod.value) return 'Choose which payment method was used.'
  if (needsDelivery.value && !phone.value.trim()) return 'A delivery order needs a phone number.'
  if (needsDelivery.value && !address.value.trim()) return 'A delivery order needs an address.'
  return null
})

/* ---------- customer ---------- */

function onUserSelect(user) {
  selectedUser.value = user
  phone.value = user.phone ?? ''
  address.value = user.address ?? ''
}

function onUserCreated(user) {
  onUserSelect(user)
  showCreateUserModal.value = false
}

function clearCustomer() {
  selectedUser.value = props.user
  phone.value = props.user?.phone ?? ''
  address.value = props.user?.address ?? ''
}

/* ---------- cart ---------- */

function addLine({ product, state, quantity = 1 }) {
  const idx = cart.value.findIndex((p) =>
    String(p.productId) === String(product.id) &&
    JSON.stringify(p.selected) === JSON.stringify(state.selected) &&
    String(p.combinationId ?? '') === String(state.combinationId ?? '')
  )

  if (idx > -1) {
    const line = cart.value[idx]
    if (line.quantity + quantity > line.availableQty) {
      toast('warning', `Only ${line.availableQty} in stock`)
      return
    }
    line.quantity += quantity
    line.totalPrice = line.quantity * line.price
  } else {
    cart.value.unshift({
      productId: product.id,
      name: product.product_name,
      combinationId: state.combinationId,
      selected: state.selected,
      price: state.price,
      quantity,
      availableQty: Number(state.qty) || quantity,
      totalPrice: state.price * quantity,
    })
  }

  chime()
}

function onQuickAdd(payload) {
  addLine(payload)
}

function step(item, delta) {
  const next = Number(item.quantity || 1) + delta
  item.quantity = Math.min(Math.max(1, next), item.availableQty)
  recalcItem(item)
}

function recalcItem(item) {
  let qty = parseInt(item.quantity) || 1
  if (qty > item.availableQty) qty = item.availableQty
  if (qty < 1) qty = 1
  item.quantity = qty
  item.price = Math.max(0, Number(item.price) || 0)
  item.totalPrice = qty * item.price
}

function removeItem(index) {
  cart.value.splice(index, 1)
}

function resetCart() {
  cart.value = []
  discount.value = 0
  deliveryArea.value = ''
  paid.value = null
  setPaymentType('cash')
  clearCustomer()
  gridRef.value?.focusSearch()
}

function chime() {
  if (window.audioPath === undefined) window.audioPath = '/public_audio_add-tocart.mp3'
  try { new Audio(window.audioPath).play() } catch { /* a missing sound must not stop a sale */ }
}

/* ---------- checkout ---------- */

function checkout() {
  if (!cart.value.length) {
    toast('warning', 'The order is empty')
    return
  }

  if (validationMessage.value) {
    toast('warning', validationMessage.value)
    return
  }

  checkingOut.value = true

  axios.post(route('admin.pos.checkout'), {
    user_id: selectedUser.value?.id ?? null,
    phone: phone.value,
    address: address.value,
    cart: cart.value,
    sub_total: subtotal.value,
    discount: discount.value,
    delivery_charge: shippingLocation.value,
    delivery_area: deliveryArea.value || null,
    total: total.value,
    payment_type: paymentType.value,
    payment_method: paymentMethod.value,
    payment_reference: paymentReference.value || null,
  })
    .then((res) => {
      resetCart()
      confirmDelete({
        title: 'Order completed',
        text: 'Open the invoice for this order?',
        confirmButtonText: 'Show invoice',
        cancelButtonText: 'Next customer',
        tone: 'question',
      }).then((confirmed) => {
        if (confirmed) window.location.href = `/admin/orders/${res.data.order_id}/invoice`
      })
    })
    .catch(() => {
      toast('error', 'Checkout failed. Please try again.')
    })
    .finally(() => { checkingOut.value = false })
}
</script>

<style scoped>
/* The till fills the viewport below the topbar; nothing here scrolls the page. */
.pos { padding-top: 0; }
.pos-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 14px;
  /* --pos-top is measured on mount; the fallback keeps the layout sane before
     the first measurement and if JS never runs. */
  height: calc(100dvh - var(--pos-top, 104px) - 16px);
  min-height: 520px;
}

.pos-catalog,
.pos-ticket {
  background: #fff;
  border: 1px solid #e6e9ec;
  border-radius: 12px;
  min-height: 0;
}
.pos-catalog { padding: 14px; overflow: hidden; }

/* ---- Ticket ---- */
.pos-ticket { display: flex; flex-direction: column; overflow: hidden; }

.pt-head { padding: 12px; border-bottom: 1px solid #eceff1; flex-shrink: 0; }
.pt-customer { display: flex; gap: 6px; }
.pt-customer-search { flex: 1; min-width: 0; }
.pt-new-customer { flex-shrink: 0; display: inline-flex; align-items: center; }

.pt-customer-chip {
  display: flex; align-items: center; gap: 6px; margin-top: 8px;
  background: #eef3ea; color: #2C5015;
  border-radius: 999px; padding: 5px 10px; font-size: .78rem; font-weight: 600;
}
.pt-customer-chip.is-walkin { background: #f1f3f5; color: #607d8b; }
.pt-customer-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pt-customer-phone { color: inherit; opacity: .7; font-weight: 500; }
.pt-customer-clear {
  margin-left: auto; border: 0; background: transparent; color: inherit;
  font-size: 16px; line-height: 1; cursor: pointer; padding: 0 2px;
}

/* Items */
.pt-items { flex: 1; min-height: 0; overflow-y: auto; padding: 6px 12px; }
.pt-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; color: #b0bec5; text-align: center;
}
.pt-empty-hint { font-size: .78rem; }

.pt-line { padding: 9px 0; border-bottom: 1px dashed #eceff1; }
.pt-line:last-child { border-bottom: 0; }
.pt-line-main { display: flex; align-items: flex-start; gap: 8px; }
.pt-line-name {
  flex: 1; font-size: .84rem; font-weight: 600; color: #263238; line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pt-line-remove {
  flex-shrink: 0; width: 22px; height: 22px; border: 0; border-radius: 50%;
  background: #fdecea; color: #c62828; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.pt-line-remove:hover { background: #c62828; color: #fff; }

.pt-line-variants { display: flex; flex-wrap: wrap; gap: 4px; margin: 4px 0 6px; }
.pt-chip {
  background: #f1f3f5; color: #607d8b; border-radius: 4px;
  padding: 1px 6px; font-size: .68rem; font-weight: 600;
}

.pt-line-controls { display: flex; align-items: center; gap: 8px; }
.pt-stepper { display: inline-flex; align-items: center; border: 1px solid #dfe4e8; border-radius: 7px; overflow: hidden; }
.pt-step {
  width: 28px; height: 30px; border: 0; background: #f6f8fa; color: #37474f;
  font-size: 1rem; font-weight: 700; cursor: pointer; line-height: 1;
}
.pt-step:hover:not(:disabled) { background: #eceff1; }
.pt-step:disabled { opacity: .35; cursor: not-allowed; }
.pt-step-input {
  width: 40px; height: 30px; border: 0;
  border-left: 1px solid #dfe4e8; border-right: 1px solid #dfe4e8;
  text-align: center; font-weight: 700; font-size: .82rem;
}

.pt-unit {
  display: inline-flex; align-items: center; margin: 0;
  border: 1px solid #dfe4e8; border-radius: 7px; overflow: hidden; height: 30px;
}
.pt-unit-label { padding: 0 6px; font-size: .78rem; color: #90a4ae; background: #f6f8fa; line-height: 30px; }
.pt-unit-input { width: 68px; height: 28px; border: 0; text-align: right; padding-right: 6px; font-size: .82rem; }

.pt-line-total { margin-left: auto; font-size: .88rem; font-weight: 700; color: #263238; }
.pt-line-note { margin: 5px 0 0; font-size: .68rem; color: #B9770E; }

/* Footer */
.pt-foot { flex-shrink: 0; padding: 12px; border-top: 1px solid #eceff1; background: #fafbfc; }
.pt-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.pt-field { display: flex; flex-direction: column; gap: 3px; margin: 0; }
.pt-field > span { font-size: .68rem; font-weight: 700; color: #78909c; text-transform: uppercase; letter-spacing: .03em; }

/* Payment */
.pt-pay { margin-bottom: 10px; }
.pt-field-label {
  display: block; font-size: .68rem; font-weight: 700; color: #78909c;
  text-transform: uppercase; letter-spacing: .03em; margin-bottom: 4px;
}
.pt-pay-types { display: flex; gap: 5px; }
.pt-pay-type {
  flex: 1; border: 1px solid #dfe4e8; background: #fff; color: #546e7a;
  border-radius: 7px; padding: 7px 4px; font-size: .74rem; font-weight: 700; cursor: pointer;
  transition: background .12s, color .12s, border-color .12s;
}
.pt-pay-type:hover { border-color: #356019; color: #356019; }
.pt-pay-type.is-on { background: #356019; border-color: #356019; color: #fff; }

.pt-pay-methods {
  margin-top: 8px; padding: 8px; border-radius: 8px;
  background: #fff; border: 1px solid #e6e9ec;
}
.pt-pay-group + .pt-pay-group { margin-top: 7px; }
.pt-pay-group-name {
  display: block; font-size: .62rem; font-weight: 700; color: #b0bec5;
  text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px;
}
.pt-pay-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.pt-pay-chip {
  border: 1px solid #dfe4e8; background: #fff; color: #37474f;
  border-radius: 999px; padding: 4px 11px; font-size: .74rem; font-weight: 600; cursor: pointer;
  transition: background .12s, color .12s, border-color .12s;
}
.pt-pay-chip:hover { border-color: #356019; }
.pt-pay-chip.is-on { background: #356019; border-color: #356019; color: #fff; }

.pt-totals { margin: 10px 0; font-size: .84rem; }
.pt-totals > div { display: flex; justify-content: space-between; align-items: baseline; padding: 2px 0; }
.pt-totals dt { color: #607d8b; font-weight: 500; }
.pt-totals dd { margin: 0; font-weight: 600; color: #37474f; font-variant-numeric: tabular-nums; }
.pt-totals dd.is-minus { color: #c62828; }
.pt-count { font-size: .68rem; color: #b0bec5; margin-left: 4px; }
.pt-grand { border-top: 1px solid #e0e4e8; margin-top: 5px; padding-top: 7px !important; }
.pt-grand dt { font-size: .92rem; font-weight: 700; color: #263238; }
.pt-grand dd { font-size: 1.15rem; font-weight: 800; color: #356019; }

.pt-paid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: end; margin-bottom: 10px; }
.pt-change {
  display: flex; flex-direction: column; gap: 1px;
  background: #eef3ea; border-radius: 7px; padding: 5px 10px; text-align: right;
}
.pt-change span { font-size: .64rem; font-weight: 700; color: #7a8b6f; text-transform: uppercase; letter-spacing: .03em; }
.pt-change strong { font-size: .98rem; color: #2C5015; font-variant-numeric: tabular-nums; }
.pt-change.is-short { background: #fdecea; }
.pt-change.is-short span { color: #b0736f; }
.pt-change.is-short strong { color: #b71c1c; }

.pt-warn {
  background: #fff4e0; color: #8a5a00; border-radius: 7px;
  padding: 7px 10px; font-size: .76rem; margin-bottom: 10px;
}

.pt-actions { display: flex; gap: 8px; }
.pt-checkout { flex: 1; font-weight: 700; }

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }

/* Below a laptop the ticket drops under the catalogue and the page scrolls. */
@media (max-width: 991px) {
  .pos-shell { grid-template-columns: 1fr; height: auto; }
  .pos-catalog { height: 60vh; }
  .pos-ticket { max-height: none; }
  .pt-items { max-height: 340px; }
}
</style>
