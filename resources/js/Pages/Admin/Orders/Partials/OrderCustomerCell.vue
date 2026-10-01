<template>
  <div class="d-flex align-items-center gap-2 text-dark text-decoration-none">
    <a :href="route('users', { user_id: order.user_identifier })">
      <img v-if="order.customer_info && order.customer_info.image" :src="asset(order.customer_info.image)" width="30" height="30" style="border-radius:100%" :alt="order.customer_name">
      <img v-else :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name || 'Unknown')}&size=25&background=random`" width="30" height="30" style="border-radius:100%" :alt="order.customer_name">
    </a>
    <div>
      <div class="customer-info-item fw-bold">
        <CircleUserRound :size="13" />
        {{ limit(order.customer_name, 15) }}
      </div>
      <a :href="`tel:${order.phone_number}`" class="customer-info-item">
        <Phone :size="11" />
        {{ order.phone_number }}
      </a>
      <div class="customer-info-item customer-address" :title="order.address">
        <MapPin :size="11" />
        <span>{{ order.address }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { asset, limit } from '@/utils/orderFormatting'
import { CircleUserRound, Phone, MapPin } from 'lucide-vue-next'

defineProps({
  order: { type: Object, required: true },
})
</script>
