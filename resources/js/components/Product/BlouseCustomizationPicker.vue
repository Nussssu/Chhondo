<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
  settings: { type: Object, required: true },
  // The product page draws the option cards in its own blouse row (same
  // design as the blouse-piece cards); then only the details panel shows here.
  inlineOptions: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const errors = ref({})
const options = computed(() => (props.settings.options || []).filter(row => row.enabled !== false))
const sleeves = computed(() => (props.settings.sleeves || []).filter(row => row.enabled !== false))
const sizes = computed(() => (props.settings.sizes || []).filter(row => row.enabled !== false))
// "হাতা:" — a trailing colon only when the admin's label has none.
const heading = (text) => (text && !/[:：]$/.test(text.trim()) ? `${text}:` : text)

function update(key, value) {
  errors.value = { ...errors.value, [key]: '' }
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
function choose(option) {
  errors.value = {}
  emit('update:modelValue', props.modelValue?.option_id === option.id ? null : { option_id: option.id, sleeve_type: '', size: '', requirements: '' })
}
/** Checked when the customer adds to cart or buys: sleeve and size are required. */
function validate() {
  errors.value = {}
  if (!props.modelValue?.option_id) return true
  if (!options.value.some(row => row.id === props.modelValue.option_id)) errors.value.option_id = 'এই ব্লাউজ অপশনটি এখন পাওয়া যাচ্ছে না।'
  if (!sleeves.value.some(row => row.id === props.modelValue.sleeve_type)) errors.value.sleeve_type = `${props.settings.sleeve_label} নির্বাচন করুন।`
  if (!sizes.value.some(row => row.id === props.modelValue.size)) errors.value.size = `${props.settings.size_label} নির্বাচন করুন।`
  if ((props.modelValue.requirements || '').length > 2000) errors.value.requirements = 'সর্বোচ্চ ২০০০ অক্ষর লেখা যাবে।'
  return !Object.values(errors.value).some(Boolean)
}
defineExpose({ validate })
</script>

<template>
  <div v-if="settings.enabled && options.length && (!inlineOptions || modelValue?.option_id)" class="custom-blouse-picker">
    <template v-if="!inlineOptions">
      <p class="custom-blouse-label">{{ settings.label }}</p>
      <div class="custom-blouse-options">
        <button v-for="option in options" :key="option.id" type="button" class="custom-blouse-choice" :class="{ 'is-selected': modelValue?.option_id === option.id }" :aria-pressed="modelValue?.option_id === option.id" @click="choose(option)">
          {{ option.label }} <span>(+৳{{ Number(option.price).toLocaleString('en-US', { maximumFractionDigits: 2 }) }})</span>
        </button>
      </div>
    </template>

    <!-- Details: sleeve and size as chips, requirements, and the contact note -->
    <div v-if="modelValue?.option_id" class="custom-blouse-panel">
      <div class="cb-group">
        <p class="cb-label">{{ heading(settings.sleeve_label) }} <span class="cb-req" aria-hidden="true">*</span></p>
        <div class="cb-chips" role="radiogroup" :aria-label="settings.sleeve_label">
          <button
            v-for="row in sleeves"
            :key="row.id"
            type="button"
            role="radio"
            class="cb-chip"
            :class="{ 'is-active': modelValue.sleeve_type === row.id }"
            :aria-checked="modelValue.sleeve_type === row.id"
            @click="update('sleeve_type', row.id)"
          >{{ row.label }}<span v-if="modelValue.sleeve_type === row.id" class="cb-chip-check" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></button>
        </div>
        <small v-if="errors.sleeve_type" class="custom-blouse-error">{{ errors.sleeve_type }}</small>
      </div>

      <div class="cb-group">
        <p class="cb-label">{{ heading(settings.size_label) }} <span class="cb-req" aria-hidden="true">*</span></p>
        <div class="cb-chips" role="radiogroup" :aria-label="settings.size_label">
          <button
            v-for="row in sizes"
            :key="row.id"
            type="button"
            role="radio"
            class="cb-chip cb-chip--size"
            :class="{ 'is-active': modelValue.size === row.id }"
            :aria-checked="modelValue.size === row.id"
            @click="update('size', row.id)"
          >{{ row.label }}<span v-if="modelValue.size === row.id" class="cb-chip-check" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></button>
        </div>
        <small v-if="errors.size" class="custom-blouse-error">{{ errors.size }}</small>
      </div>

      <div class="cb-group">
        <label class="cb-label" for="cb-requirements">{{ heading(settings.requirements_label) }}</label>
        <textarea
          id="cb-requirements"
          :value="modelValue.requirements"
          :placeholder="settings.requirements_placeholder"
          maxlength="2000"
          rows="3"
          class="cb-textarea"
          @input="update('requirements', $event.target.value)"
        ></textarea>
        <small v-if="errors.requirements" class="custom-blouse-error">{{ errors.requirements }}</small>
        <!-- Store settings › Product details -->
        <p v-if="settings.note" class="custom-blouse-note">
          <svg class="custom-blouse-note-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>{{ settings.note }}</span>
        </p>
      </div>
      <p v-if="errors.option_id" class="custom-blouse-error">{{ errors.option_id }}</p>
    </div>
  </div>
</template>

<style scoped>
.custom-blouse-picker { color: #3c3834; }
.custom-blouse-label { margin: 0 0 10px; font-size: 15px; font-weight: 500; }
.custom-blouse-options { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.custom-blouse-choice { padding: 10px 14px; border: 1px solid #d8d3c8; border-radius: 8px; background: #fff; font-size: 14px; cursor: pointer; }
.custom-blouse-choice.is-selected { color: #fff; border-color: #252f17; background: #252f17; }
.custom-blouse-choice span { white-space: nowrap; }

/* The details panel, as in the reference: a white box under the option
   buttons, small labels, compact chips and the note in a grey strip. */
.custom-blouse-panel {
  display: grid;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e4e1e0;
  border-radius: 12px;
  background: #fff;
}
.cb-group { display: grid; gap: 8px; min-width: 0; }
.cb-label { margin: 0; font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; font-size: 15px; font-weight: 600; color: #3c3834; }
.cb-req { display: none; }
.cb-chips { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 4px; }

/* Chips in the option buttons' look: same border, radius and font, the
   1.5px green border when chosen. */
.cb-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: #fff;
  color: #2c5015;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .15s ease, color .15s ease;
}
.cb-chip--size { padding: 0 10px; }
.cb-chip:hover { border-color: #3e711d; }
.cb-chip.is-active { border: 2px solid #3e711d; color: #2c5015; }
/* The same green tick as the selected blouse option button. */
.cb-chip-check {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-radius: 9999px;
  background: #3e711d;
  color: #fff;
}
.cb-chip-check svg { width: 10px; height: 10px; }
.cb-chip:focus-visible { outline: 2px solid #3e711d; outline-offset: 2px; }

.cb-textarea {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #d1cdca;
  border-radius: 8px;
  background: #fff;
  color: #3c3834;
  font: 14px/1.5 "Li Ador Noirrit", "Poppins", sans-serif;
  resize: vertical;
}
.cb-textarea::placeholder { color: #a5a09b; }
.cb-textarea:focus { border-color: #3e711d; outline: none; }

.custom-blouse-error { display: block; color: #b42318; font-size: 12px; }
.custom-blouse-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 4px 0 0;
  padding: 8px 12px;
  border: 1px solid #cfe8d6;
  border-radius: 8px;
  background: #ecf7ef;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #2c5015;
}
.custom-blouse-note-icon { flex: none; margin-top: 3px; color: #3e711d; }
@media (max-width: 767px) {
  .custom-blouse-panel { padding: 14px; gap: 14px; }
  .cb-chip { height: 36px; font-size: 13px; }
}
</style>
