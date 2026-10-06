<template>
  <div>
    <div class="product-grid">
      <div v-for="(item, index) in order.items" :key="item.id" class="product-item" v-show="index === 0 || expanded">
        <div>
          <img :src="asset(item.product_info?.featured_image)" width="38" height="38">
        </div>
        <div>
          <span :title="item.product_info?.product_name" class="fw-bold" style="cursor:pointer;">{{ limit(item.product_info?.product_name, 11) }}</span><br>
          <span class="text-muted">{{ item.product_info?.product_code }} · Qty {{ item.quantity }}</span><br>
          <span v-for="opt in item.option || []" :key="opt.id" class="text-muted">
            {{ opt.attributeOption?.attribute?.name ?? 'N/A' }}: {{ opt.attributeOption?.name ?? 'N/A' }}<br>
          </span>
          <span v-if="item.blouse_choice" class="badge" :style="{ backgroundColor: item.blouse_choice === 'with' ? '#252f17' : '#8c7256', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }">
            {{ item.blouse_choice === 'with' ? 'With Blouse' : 'Without Blouse' }}
          </span>
        </div>
      </div>
    </div>
    <button v-if="(order.items?.length || 0) > 1" class="btn btn-fig-link btn-fig-sm p-0" @click="$emit('toggle-expanded')">
      {{ expanded ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<script setup>
import { asset, limit } from '@/utils/orderFormatting'

defineProps({
  order: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})
defineEmits(['toggle-expanded'])
</script>
