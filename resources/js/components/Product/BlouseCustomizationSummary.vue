<script setup>
// `badge`: the cart and checkout show just the option's name, highlighted.
// `detailed`: admin order details — sleeve, size and the requirement text after
// "চাহিদা :"; the price sits in the Price column, never the customer note.
// `withChoice` (with `badge`): the cart also names the chosen sleeve and size.
defineProps({ customization: { type: Object, default: null }, showNote: { type: Boolean, default: false }, compact: { type: Boolean, default: false }, badge: { type: Boolean, default: false }, detailed: { type: Boolean, default: false }, withChoice: { type: Boolean, default: false } })
</script>
<template>
  <span v-if="customization && badge && withChoice" class="blouse-custom-choice">
    <span class="blouse-custom-badge">{{ customization.label || 'Custom Blouse' }}</span>
    <span class="blouse-custom-choice-text">{{ customization.sleeve_title || 'Sleeve Type' }}: {{ customization.sleeve_label }} · {{ customization.size_title || 'Size' }}: {{ customization.size_label }}</span>
  </span>
  <span v-else-if="customization && badge" class="blouse-custom-badge">{{ customization.label || 'Custom Blouse' }}</span>
  <div v-else-if="customization && detailed" class="blouse-customization-summary">
    <strong>{{ customization.label || 'Custom Blouse' }}</strong>
    <span>{{ customization.sleeve_title || 'Sleeve Type' }}: {{ customization.sleeve_label }} · {{ customization.size_title || 'Size' }}: {{ customization.size_label }}</span>
    <p v-if="customization.requirements" class="blouse-requirements"><span class="blouse-requirements-title">চাহিদা :</span> {{ customization.requirements }}</p>
  </div>
  <div v-else-if="customization" class="blouse-customization-summary" :class="{ 'is-compact': compact }" :title="compact ? customization.requirements : undefined">
    <strong>{{ customization.label }} (+৳{{ Number(customization.unit_price || 0).toLocaleString('en-US', { maximumFractionDigits: 2 }) }})</strong>
    <span>{{ customization.sleeve_title || 'Sleeve Type' }}: {{ customization.sleeve_label }} · {{ customization.size_title || 'Size' }}: {{ customization.size_label }}</span>
    <p v-if="customization.requirements" class="blouse-requirements">{{ customization.requirements }}</p>
    <p v-if="showNote && customization.note">{{ customization.note }}</p>
  </div>
</template>
<style scoped>
.blouse-customization-summary { display: grid; gap: 3px; margin-top: 5px; font-size: 11px; line-height: 1.5; color: #5b614f; min-width: 0; overflow-wrap: anywhere; }
.blouse-customization-summary strong { font-weight: 600; }
.blouse-customization-summary p { margin: 0; }
.blouse-requirements { white-space: pre-line; }
.blouse-requirements-title { font-weight: 600; }
.blouse-custom-badge { display: inline-block; width: fit-content; margin-top: 4px; padding: 2px 8px; border: 1px solid #ecd9a8; border-radius: 4px; background: #fbf3dc; color: #7a5a17; font-size: 12px; font-weight: 600; line-height: 1.5; }
.blouse-custom-choice { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; min-width: 0; }
.blouse-custom-choice-text { font-size: 12px; line-height: 1.5; color: #5b614f; overflow-wrap: anywhere; }
.is-compact > * { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
