<template>
  <FormModal title="Purchase Products" size="lg" @close="$emit('close')">
    <div class="mb-3">
      <span class="badge bg-secondary me-2">{{ purchase.invoice_number }}</span>
      <span class="text-muted small">{{ purchase.purchase_name }}</span>
    </div>

    <div class="orders-table-wrapper">
      <table class="table table-striped align-middle mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Variant</th>
            <th class="text-end">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.product_id ?? index">
            <td>{{ index + 1 }}</td>
            <td>{{ product.product_name || 'N/A' }}</td>
            <td>
              <span v-if="product.option_name">{{ product.option_name }}</span>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="text-end">{{ product.quantity }}</td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="4" class="text-center text-muted py-3">No products found for this purchase.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Close</button>
    </template>
  </FormModal>
</template>

<script setup>
import { computed } from 'vue'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  purchase: { type: Object, required: true },
})

defineEmits(['close'])

// Products live on the purchase record itself (products_data JSON), not as
// separate Product rows keyed by purchase_id.
const products = computed(() => props.purchase.products_data || [])
</script>
