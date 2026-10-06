<script setup>
/**
 * The fields of one delivery address.
 *
 * Address, city and type only — name, email and phone belong to the account
 * and are edited in Personal Information above.
 *
 * `city` holds the checkout's own delivery-area values rather than a free-text
 * city, which is what lets a saved address set the shipping zone directly.
 */
import { CITIES, TYPES } from '@/constants/address'

defineProps({
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="af-grid">
    <div class="af-field af-field--full">
      <label class="af-label">বিস্তারিত ঠিকানা</label>
      <textarea
        v-model="modelValue.address"
        class="af-input"
        rows="2"
        :class="{ 'is-invalid': errors.address }"
        placeholder="House, road, area"
      ></textarea>
      <p v-if="errors.address" class="af-error">{{ errors.address }}</p>
    </div>

    <div class="af-field">
      <label class="af-label">শহর</label>
      <select v-model="modelValue.city" class="af-input" :class="{ 'is-invalid': errors.city }">
        <option value="" disabled>নির্বাচন করুন</option>
        <option v-for="(label, key) in CITIES" :key="key" :value="key">{{ label }}</option>
      </select>
      <p v-if="errors.city" class="af-error">{{ errors.city }}</p>
    </div>

    <div class="af-field">
      <label class="af-label">ঠিকানার ধরন</label>
      <select v-model="modelValue.type" class="af-input" :class="{ 'is-invalid': errors.type }">
        <option v-for="(label, key) in TYPES" :key="key" :value="key">{{ label }}</option>
      </select>
      <p v-if="errors.type" class="af-error">{{ errors.type }}</p>
    </div>
  </div>
</template>

<style scoped>
.af-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;
}

.af-field--full { grid-column: 1 / -1; }

@media (max-width: 640px) {
  .af-grid { grid-template-columns: 1fr; }
}

.af-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.af-label {
  margin-bottom: 4px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #7a5c3e;
}

.af-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8d4b0;
  border-radius: 9px;
  background: #fff;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
  outline: none;
  transition: border-color 0.15s ease;
}

.af-input:focus { border-color: #356019; }
.af-input.is-invalid { border-color: #dc2626; }

.af-error {
  margin: 4px 0 0;
  font-size: 12px;
  color: #dc2626;
}
</style>
