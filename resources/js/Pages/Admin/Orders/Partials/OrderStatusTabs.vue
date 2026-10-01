<template>
  <div class="order-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.status || 'all'"
      type="button"
      class="order-tab"
      :class="[`is-${tab.tone}`, { 'is-on': current === tab.status }]"
      @click="$emit('select', tab.status)"
    >
      {{ tab.label }}
      <span class="order-tab-count">{{ tab.value ?? 0 }}</span>
    </button>
  </div>
</template>

<script setup>
/**
 * The status filter row, shared by the storefront order list and the POS
 * order list so the two look and behave the same. Each page supplies its own
 * counts, which is what keeps their figures separate.
 */
defineProps({
  tabs: { type: Array, required: true },
  current: { type: String, default: '' },
})

defineEmits(['select'])
</script>

<style scoped>
/* With a full row to themselves the tabs wrap instead of scrolling sideways,
   so every status stays reachable without a hidden overflow. */
.order-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.order-tab {
  --tone: #64748b;
  --tone-bg: #f1f5f9;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--tone-bg);
  color: var(--tone);
  font-size: .82rem;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  transition: background .15s, color .15s, box-shadow .15s;
}

.order-tab:hover { border-color: var(--tone); }

.order-tab.is-on {
  background: var(--tone);
  color: #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, .16);
}

.order-tab-count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .72);
  color: var(--tone);
  font-size: .72rem;
  font-weight: 700;
  text-align: center;
}

.order-tab.is-on .order-tab-count {
  background: rgba(255, 255, 255, .24);
  color: #fff;
}

.order-tab.is-all        { --tone: #334155; --tone-bg: #e9edf3; }
.order-tab.is-pending    { --tone: #b45309; --tone-bg: #fef3c7; }
.order-tab.is-processed  { --tone: #1d4ed8; --tone-bg: #dbeafe; }
.order-tab.is-delivery   { --tone: #6d28d9; --tone-bg: #ede9fe; }
.order-tab.is-delivered  { --tone: #15803d; --tone-bg: #dcfce7; }
.order-tab.is-incomplete { --tone: #57534e; --tone-bg: #ececea; }
.order-tab.is-cancelled  { --tone: #b91c1c; --tone-bg: #fee2e2; }
.order-tab.is-returned   { --tone: #c2410c; --tone-bg: #ffedd5; }
</style>
