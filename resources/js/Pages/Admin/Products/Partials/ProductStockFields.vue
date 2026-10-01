<template>
  <div class="ps">
    <div class="ps-field">
      <label class="form-label" :for="`${uid}-status`">
        Stock status <span v-if="required" class="ps-req">*</span>
      </label>
      <select :id="`${uid}-status`" v-model="status" name="stock_status" class="form-select">
        <option value="instock">In stock</option>
        <option value="outofstock">Out of stock</option>
        <option value="preorder">Pre-order</option>
        <option value="manage">Track quantity</option>
      </select>
      <small class="ps-hint">{{ hint }}</small>
    </div>

    <!-- Only a pre-order has a delivery expectation to set. -->
    <div v-if="isPreOrder" class="ps-field">
      <label class="form-label" :for="`${uid}-preorder-note`">Pre-order note</label>
      <input
        :id="`${uid}-preorder-note`"
        v-model="preorderNote"
        type="text"
        name="preorder_note"
        maxlength="500"
        class="form-control"
        placeholder="e.g. Ships within 10–14 days of ordering"
      >
      <small class="ps-hint">
        Shown to customers beside the pre-order button. Leave blank to say nothing about timing.
      </small>
    </div>

    <!-- The form posts natively, so the column still needs a value when the
         field above is not on screen. -->
    <input v-else type="hidden" name="preorder_note" :value="preorderNote">

    <!-- Quantity only means anything while the product is being counted. -->
    <template v-if="tracksStock">
      <div class="ps-field">
        <label class="form-label" :for="`${uid}-qty`">Quantity</label>
        <input
          :id="`${uid}-qty`"
          v-model.number="quantity"
          type="number"
          min="0"
          name="quantity"
          class="form-control"
        >
        <small class="ps-hint">
          The product is hidden as sold out once this reaches zero.
        </small>
      </div>

      <div class="ps-field">
        <label class="form-label" :for="`${uid}-source`">Stock source</label>
        <select :id="`${uid}-source`" v-model="stockOption" name="stock_option" class="form-select">
          <option value="Manual">Set by hand</option>
          <option value="From Purchase">From purchase entries</option>
        </select>
        <small class="ps-hint">
          “From purchase entries” lets stock arrive through the Purchases screen.
        </small>
      </div>
    </template>

    <!-- The form posts natively, so untracked products still need to submit a
         value for these columns rather than dropping them. -->
    <template v-else>
      <input type="hidden" name="quantity" :value="quantity">
      <input type="hidden" name="stock_option" :value="stockOption">
    </template>
  </div>
</template>

<script setup>
/**
 * Availability the way WooCommerce models it: a product is simply in or out of
 * stock unless you opt into counting it. Before this, the only way to say
 * "always available" was to type a large number — which is why live data holds
 * quantities like 49999991.
 *
 * "Pre-order" is its own status rather than a reading of "out of stock". The
 * storefront used to offer a pre-order button for anything sold out, so there
 * was no way to mark a product genuinely unavailable.
 */
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // Available by default — this shop does not count stock.
  modelStatus: { type: String, default: 'instock' },
  modelQuantity: { type: [Number, String], default: 0 },
  modelStockOption: { type: String, default: 'Manual' },
  modelPreorderNote: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:tracksStock'])

const uid = `ps-${Math.random().toString(36).slice(2, 8)}`

const status = ref(props.modelStatus || 'instock')
const quantity = ref(Number(props.modelQuantity) || 0)
const stockOption = ref(props.modelStockOption || 'Manual')
const preorderNote = ref(props.modelPreorderNote || '')

const tracksStock = computed(() => status.value === 'manage')
const isPreOrder = computed(() => status.value === 'preorder')

const hint = computed(() => ({
  instock: 'Always available. No quantity is counted.',
  outofstock: 'Shown as sold out. Customers cannot add it to the cart or check out.',
  // Pre-order is what "out of stock" used to be doing implicitly; the two are
  // now separate so a sold-out product can actually be sold out.
  preorder: 'Not in stock, but customers can still order it. No quantity is counted.',
  manage: 'Availability follows the quantity below.',
}[status.value]))

// The attributes panel is only meaningful for hand-counted stock, and the
// parent hides it, so it needs to know.
watch(tracksStock, (value) => emit('update:tracksStock', value), { immediate: true })
</script>

<style scoped>
.ps-field { margin-bottom: 14px; }
.ps-field:last-child { margin-bottom: 0; }
.ps-req { color: #C0392B; font-weight: 700; }
.ps-hint {
  display: block; margin-top: 4px;
  font-size: .74rem; color: #90a4ae; line-height: 1.4;
}
</style>
