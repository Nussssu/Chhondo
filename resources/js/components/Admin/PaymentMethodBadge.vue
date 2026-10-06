<script setup>
/**
 * How an order was paid, at a glance: the bKash logo for bKash, otherwise the
 * method's name (Online, COD, Cash, or the online method such as Nagad).
 *
 * payment_method is only meaningful for online orders — the admin clears it
 * whenever the type is changed to anything else.
 */
import { computed } from 'vue'
import { paymentMethodLabel } from '@/utils/orderPayment'

const props = defineProps({
  order: { type: Object, required: true },
})

// Served from public/, so bound as a string rather than bundled by Vite.
const bkashLogo = '/assets/images/payment/bkash-pay.png'

const isBkash = computed(() => props.order.payment_type === 'online' && props.order.payment_method === 'bkash')
</script>

<template>
  <span class="pm-badge" :title="isBkash ? 'Paid with bKash' : undefined">
    <img v-if="isBkash" :src="bkashLogo" alt="bKash" class="pm-logo" width="54" height="21">
    <span v-else class="pm-text">{{ paymentMethodLabel(order) }}</span>
  </span>
</template>

<style scoped>
.pm-badge {
  display: inline-flex;
  align-items: center;
}

/* The logo file carries generous whitespace; contain keeps its proportions. */
.pm-logo {
  display: block;
  width: 54px;
  height: 21px;
  object-fit: contain;
}

.pm-text {
  font-size: var(--fs-sm, 13px);
  font-weight: 600;
  color: var(--text, #1a1817);
}
</style>
