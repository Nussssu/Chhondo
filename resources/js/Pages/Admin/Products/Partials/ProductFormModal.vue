<script setup>
import { computed, ref } from 'vue'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({ productId: { type: [Number, String], default: null } })
const emit = defineEmits(['close', 'complete'])
const frame = ref(null)
const loading = ref(true)
const source = computed(() => {
  const url = new URL(props.productId ? route('products.edit', props.productId) : route('products.create'), window.location.origin)
  url.searchParams.set('modal', '1')
  return url.href
})

function onLoad() {
  loading.value = false
  // Existing native form submissions retain every file/field and validation.
  // A completed save or Cancel returns to the list inside this same-origin frame.
  const location = frame.value?.contentWindow?.location
  if (location?.origin === window.location.origin && location.pathname === new URL(route('products.index'), window.location.origin).pathname) {
    emit('complete')
  }
}
</script>

<template>
  <FormModal :title="productId ? 'Edit product' : 'Add product'" size="xl" :show-footer="false" @close="$emit('close')">
    <div class="product-form-popup">
      <div v-if="loading" class="product-form-loading" role="status">Loading product form…</div>
      <iframe ref="frame" :src="source" :title="productId ? 'Edit product form' : 'Add product form'" class="product-form-frame" @load="onLoad"></iframe>
    </div>
  </FormModal>
</template>

<style scoped>
.product-form-popup { position: relative; }
.product-form-frame { display: block; width: 100%; height: 72vh; height: 72dvh; border: 0; }
.product-form-loading { position: absolute; inset: 0; display: grid; place-items: center; background: var(--surface, #fff); color: var(--text-muted); z-index: 1; }
</style>
