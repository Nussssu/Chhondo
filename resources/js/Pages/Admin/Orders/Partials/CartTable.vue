<template>
  <div class="table-responsive">
    <table class="cart-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Attribute</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in cart" :key="`${item.productId}-${item.combinationId}-${i}`">
          <td class="text-muted">{{ i + 1 }}</td>
          <td>
            <div class="cart-product-cell">
              <img v-if="productFor(item)?.featured_image" :src="asset(productFor(item).featured_image)" width="40" height="40" class="cart-product-thumb">
              <span class="cart-item-name" :title="item.name">{{ limit(item.name, 24) }}</span>
            </div>
          </td>
          <td>
            <div v-if="attributeText(item).length" class="cart-attr-list">
              <span v-for="(text, idx) in attributeText(item)" :key="idx">{{ text }}</span>
            </div>
            <span v-else class="text-muted">N/A</span>
          </td>
          <td>
            <div class="qty-stepper">
              <button type="button" class="qty-btn" @click="decrease(item)"><Minus :size="12" /></button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button type="button" class="qty-btn" @click="increase(item)"><Plus :size="12" /></button>
            </div>
          </td>
          <td class="cart-num-cell">{{ Number(item.price).toFixed(2) }}</td>
          <td class="cart-num-cell fw-bold">{{ Number(item.totalPrice).toFixed(2) }}</td>
          <td class="text-center">
            <button type="button" class="table-icon-btn is-danger" title="Remove" @click="remove(item)">
              <Trash2 :size="14" />
            </button>
          </td>
        </tr>
        <tr v-if="!cart.length">
          <td colspan="7" class="text-center text-muted py-4">No products added</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="cart-summary-label">SubTotal</td>
          <td colspan="2" class="cart-num-cell text-green">{{ subtotal.toFixed(2) }}</td>
        </tr>
        <tr>
          <td colspan="5" class="cart-summary-label">Discount</td>
          <td colspan="2">
            <input type="number" v-model.number="discount" class="cart-footer-input text-red">
          </td>
        </tr>
        <tr>
          <td colspan="5" class="cart-summary-label">Delivery</td>
          <td colspan="2">
            <input type="number" v-model.number="deliveryCharge" class="cart-footer-input text-red">
          </td>
        </tr>
        <tr class="cart-total-row">
          <td colspan="5" class="cart-summary-label">Total</td>
          <td colspan="2" class="cart-num-cell text-green">{{ total.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Minus, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from '@/utils/toast'

const props = defineProps({
  cart: { type: Array, required: true },
  products: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:cart'])

const discount = defineModel('discount', { default: 0 })
const deliveryCharge = defineModel('deliveryCharge', { default: 0 })

const subtotal = computed(() => props.cart.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0))
const total = computed(() => subtotal.value - Number(discount.value || 0) + Number(deliveryCharge.value || 0))

function productFor(item) {
  return props.products.find((p) => String(p.id) === String(item.productId))
}

function attributeText(item) {
  const product = productFor(item)
  if (!item.selected?.length) return []
  return item.selected.map((sel) => {
    const optionId = sel.optionId ?? sel.attribute_options_id
    const match = product?.product_attributes?.find((pa) => String(pa.attribute_option_id) === String(optionId))
    if (match) return `${match.attribute?.name ?? ''}: ${match.attributeOption?.name ?? ''}`
    if (sel.name && sel.value) return `${sel.name}: ${sel.value}`
    return null
  }).filter(Boolean)
}

function asset(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `/${path.replace(/^\//, '')}`
}

function limit(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

function emitCart(next) {
  emit('update:cart', next)
}

function increase(item) {
  const max = Number(item.availableQty ?? Infinity)
  if (item.quantity >= max) {
    toast('warning', 'Not enough stock')
    return
  }
  const next = props.cart.map((c) => c === item ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * Number(c.price) } : c)
  emitCart(next)
}

function decrease(item) {
  if (item.quantity <= 1) return
  const next = props.cart.map((c) => c === item ? { ...c, quantity: c.quantity - 1, totalPrice: (c.quantity - 1) * Number(c.price) } : c)
  emitCart(next)
}

function remove(item) {
  emitCart(props.cart.filter((c) => c !== item))
}
</script>

<style scoped>
.cart-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.cart-table thead th {
  background: #FFFAF4;
  color: #6D6560;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: left;
  padding: 8px 12px;
  border-bottom: 2px solid #F7E2CB;
  white-space: nowrap;
}
.cart-table tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid #F0EDE9;
  vertical-align: middle;
}
.cart-table tfoot td {
  padding: 8px 12px;
  border-bottom: none;
  vertical-align: middle;
}
.cart-table tbody tr:hover { background-color: #FFFAF4; }

.cart-product-cell { display: flex; align-items: center; gap: 8px; }
.cart-product-thumb { border-radius: 6px; object-fit: cover; flex-shrink: 0; }
.cart-item-name { font-weight: 600; color: #3C3834; }

.cart-attr-list { display: flex; flex-direction: column; gap: 2px; color: #6D6560; font-size: 11.5px; }

.qty-stepper {
  display: inline-flex; align-items: center; gap: 4px;
  border: 1px solid #F0EDE9; border-radius: 999px; padding: 4px;
}
.qty-btn {
  width: 20px; height: 20px; border: none; border-radius: 50%; background: #FFF6EA;
  color: #234011; display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background-color 0.15s ease;
}
.qty-btn:hover { background-color: rgba(53,96,25,0.14); }
.qty-value { min-width: 18px; text-align: center; font-weight: 600; font-size: 12px; }

.cart-num-cell { text-align: right; white-space: nowrap; }
.cart-summary-label { text-align: right; color: #6D6560; font-size: 12px; }
.cart-total-row td { border-top: 2px solid #F7E2CB; border-bottom: none; padding-top: 12px; padding-bottom: 12px; }
.cart-total-row .cart-summary-label { color: #234011; font-weight: 700; }

.cart-footer-input {
  width: 80px; margin-left: auto; display: block;
  border: none; border-bottom: 1px dashed #F7E2CB; border-radius: 0; padding: 0;
  font-size: 12.5px; line-height: inherit; text-align: right; background: transparent;
}
.cart-footer-input:focus { outline: none; border-bottom-color: #356019; }

.text-green { font-weight: 600; color: #24A148; }
.text-red { font-weight: 600; color: #F9461C; }
.text-muted { color: #9C9591; }
</style>
