<template>
  <div class="ocust">
    <a :href="route('users', { user_id: order.user_identifier })" class="ocust-name" :title="order.customer_name">
      {{ limit(order.customer_name, 18) }}
    </a>
    <a v-if="!compact" :href="`tel:${order.phone_number}`" class="ocust-phone">{{ order.phone_number }}</a>
    <div v-if="!compact" class="ocust-addr" :title="order.address">
      <span>{{ order.address }}</span>
    </div>
  </div>
</template>

<script setup>
import { limit } from '@/utils/orderFormatting'

defineProps({
  order: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})
</script>

<style scoped>
/* Text-only customer cell: the avatar photo cost ~38px plus an external
   image request per row. Its link to the customer list moved onto the name,
   so no navigation is lost. */
.ocust {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  font-size: 11.5px;
  line-height: 1.45;
}

.ocust-name {
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ocust-name:hover {
  color: var(--admin-green-600);
  text-decoration: underline;
}

.ocust-phone {
  color: var(--admin-green-600);
  text-decoration: none;
  white-space: nowrap;
}

.ocust-phone:hover { text-decoration: underline; }

.ocust-addr {
  color: var(--text-muted);
  min-width: 0;
}

.ocust-addr span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
