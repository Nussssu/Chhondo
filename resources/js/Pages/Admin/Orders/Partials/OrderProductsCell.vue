<template>
  <div :class="{ 'is-compact': compact }">
    <div class="product-grid">
      <div v-for="(item, index) in order.items" :key="item.id" class="product-item" v-show="index === 0 || (!compact && expanded)">
        <div class="product-thumb">
          <img :src="asset(item.product_info?.featured_image)" width="30" height="30" :alt="item.product_info?.product_name ?? ''">
        </div>
        <div class="product-text">
          <span :title="item.product_info?.product_name" class="product-name fw-bold">{{ limit(item.product_info?.product_name, compact ? 16 : 11) }}</span><br v-if="!compact">
          <span class="product-meta text-muted">{{ compact ? `×${item.quantity}` : `${item.product_info?.product_code} · Qty ${item.quantity}` }}</span><br v-if="!compact">
          <span v-for="opt in compact ? [] : (item.option || [])" :key="opt.id" class="text-muted">
            {{ opt.attributeOption?.attribute?.name ?? 'N/A' }}: {{ opt.attributeOption?.name ?? 'N/A' }}<br>
          </span>
          <span v-if="!compact && item.blouse_choice" class="badge" :style="{ backgroundColor: item.blouse_choice === 'with' ? '#252f17' : '#8c7256', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }">
            {{ item.blouse_choice === 'with' ? 'With Blouse' : 'Without Blouse' }}
          </span>
        </div>
      </div>
    </div>
    <span v-if="compact && (order.items?.length || 0) > 1" class="more-count">+{{ order.items.length - 1 }}</span>
    <button v-else-if="(order.items?.length || 0) > 1" class="btn btn-fig-link btn-fig-sm p-0" @click="$emit('toggle-expanded')">
      {{ expanded ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<script setup>
import { asset, limit } from '@/utils/orderFormatting'

defineProps({
  order: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})
defineEmits(['toggle-expanded'])
</script>

<style scoped>
/* Single column that fills the cell: the global auto-fit grid enforced a
   170px minimum per chip, which alone could overflow narrow content widths. */
.product-grid {
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
}

.product-item {
  gap: 6px;
  padding: 4px 6px;
  min-width: 0;
}

.product-text {
  min-width: 0;
  overflow-wrap: anywhere;
}

.product-thumb {
  flex-shrink: 0;
}

.product-thumb img {
  display: block;
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.is-compact {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
}

.is-compact .product-grid { min-width: 0; flex: 1; }
.is-compact .product-item { padding: 0; }
.is-compact .product-thumb img { width: 26px; height: 26px; }
.is-compact .product-text {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  white-space: nowrap;
}
.is-compact .product-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.is-compact .product-meta,
.more-count {
  flex-shrink: 0;
  font-size: 10.5px;
  color: var(--text-muted);
}
</style>
