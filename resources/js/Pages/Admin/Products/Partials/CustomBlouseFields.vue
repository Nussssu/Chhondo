<script setup>
/**
 * Pricing & stock › Custom Blouse for one product: on/off, its price pair and
 * its own sleeve and size lists. Posted with the native product form as one
 * JSON field, `custom_blouse`. A product never saved with it follows
 * Products › Blouse options, which also fills the form the first time.
 */
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  value: { type: Object, default: null },
  defaults: { type: Object, default: () => ({}) },
})

const tagsOf = (rows) => (rows || []).filter(row => row.enabled !== false).map(row => ({ id: String(row.id), label: String(row.label) }))
const defaultOption = computed(() => (props.defaults.options || [])[0] || {})

const own = props.value
const state = reactive({
  enabled: own ? !!own.enabled : props.defaults.enabled !== false && defaultOption.value.enabled !== false,
  price: own ? (own.price ?? '') : (defaultOption.value.price ?? ''),
  sale_price: own ? (own.sale_price ?? '') : '',
  sleeves: own?.sleeves?.length ? own.sleeves.map(r => ({ ...r })) : tagsOf(props.defaults.sleeves),
  sizes: own?.sizes?.length ? own.sizes.map(r => ({ ...r })) : tagsOf(props.defaults.sizes),
})
const newSleeve = ref('')
const newSize = ref('')

const payload = computed(() => JSON.stringify(state))
const saleError = computed(() => Number(state.sale_price) > 0 && Number(state.price) > 0 && Number(state.sale_price) >= Number(state.price)
  ? 'The sale price must be lower than the price.' : '')

// The template unwraps refs, so it names the box instead of passing it.
const inputs = { sleeves: newSleeve, sizes: newSize }
function add(group) {
  const input = inputs[group]
  // Sizes read in Bangla digits on the storefront, as the defaults do.
  const typed = input.value.trim()
  const label = group === 'sizes' ? typed.replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]) : typed
  if (!label) return
  if (!state[group].some(row => row.label.toLowerCase() === label.toLowerCase() || row.id.toLowerCase() === label.toLowerCase())) {
    state[group].push({ id: label, label })
  }
  input.value = ''
}
function remove(group, index) {
  state[group].splice(index, 1)
}
function resetLists() {
  state.sleeves = tagsOf(props.defaults.sleeves)
  state.sizes = tagsOf(props.defaults.sizes)
}
</script>

<template>
  <div class="cbf">
    <input type="hidden" name="custom_blouse" :value="payload">
    <div class="form-check form-switch">
      <input id="offer_custom_blouse" v-model="state.enabled" class="form-check-input" type="checkbox" role="switch">
      <label class="form-check-label" for="offer_custom_blouse">Offer Custom Blouse</label>
    </div>

    <div v-show="state.enabled" class="mt-2">
      <div class="row g-2">
        <div class="col-md-6">
          <label for="custom_blouse_price" class="form-label">Custom Blouse Price</label>
          <input id="custom_blouse_price" v-model="state.price" type="number" step="0.01" min="0" class="form-control">
          <small class="text-muted">Added to the saree price (without blouse). Struck through when a sale price is set.</small>
        </div>
        <div class="col-md-6">
          <label for="custom_blouse_sale_price" class="form-label">Custom Blouse Sale Price</label>
          <input id="custom_blouse_sale_price" v-model="state.sale_price" type="number" step="0.01" min="0" class="form-control" :class="{ 'is-invalid': saleError }">
          <small v-if="saleError" class="invalid-feedback d-block">{{ saleError }}</small>
          <small v-else class="text-muted">Optional — what the customer pays for it while on sale. Leave blank if not on sale.</small>
        </div>
      </div>

      <div class="row g-2 mt-2">
        <div class="col-md-6">
          <label class="form-label" for="cbf-sleeve">Sleeve options</label>
          <div class="cbf-tags">
            <span v-for="(row, i) in state.sleeves" :key="row.id" class="cbf-tag">
              {{ row.label }}
              <button type="button" class="cbf-tag-x" :aria-label="`Remove ${row.label}`" @click="remove('sleeves', i)">×</button>
            </span>
          </div>
          <div class="cbf-add">
            <input id="cbf-sleeve" v-model="newSleeve" type="text" maxlength="60" class="form-control" placeholder="যেমন: থ্রি-কোয়ার্টার হাতা" @keydown.enter.prevent="add('sleeves')">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="add('sleeves')">Add</button>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="cbf-size">Sizes</label>
          <div class="cbf-tags">
            <span v-for="(row, i) in state.sizes" :key="row.id" class="cbf-tag">
              {{ row.label }}
              <button type="button" class="cbf-tag-x" :aria-label="`Remove ${row.label}`" @click="remove('sizes', i)">×</button>
            </span>
          </div>
          <div class="cbf-add">
            <input id="cbf-size" v-model="newSize" type="text" maxlength="60" class="form-control" placeholder="যেমন: ৫০" @keydown.enter.prevent="add('sizes')">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="add('sizes')">Add</button>
          </div>
        </div>
      </div>
      <small v-if="!state.sleeves.length || !state.sizes.length" class="text-muted d-block mt-1">An empty list uses the default sleeves or sizes.</small>
      <button type="button" class="btn btn-link p-0 mt-2 cbf-reset" @click="resetLists">Reset sleeves and sizes to default</button>
    </div>
  </div>
</template>

<style scoped>
.cbf-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; min-height: 4px; }
.cbf-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px 3px 10px;
  border: 1px solid var(--border, #d8d3c8);
  border-radius: 999px;
  background: var(--surface, #fff);
  font-size: 13px;
  line-height: 1.4;
}
.cbf-tag-x {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}
.cbf-tag-x:hover { background: rgba(180, 35, 24, .1); color: #b42318; }
.cbf-add { display: flex; gap: 8px; align-items: center; }
.cbf-add .form-control { flex: 1; min-width: 0; }
.cbf-add .btn { flex: none; }
.cbf-reset { font-size: 13px; }
</style>
