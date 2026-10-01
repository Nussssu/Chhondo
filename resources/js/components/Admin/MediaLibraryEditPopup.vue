<template>
  <FormModal title="Edit File Details" size="md" :show-footer="false" @close="$emit('close')">
    <div class="text-center mb-3">
      <img
        v-if="item.kind === 'image'"
        :src="item.url"
        :alt="item.alt_text || item.title"
        style="max-height: 160px; border-radius: 8px; object-fit: cover;"
      >
      <video
        v-else-if="item.kind === 'video'"
        :src="item.url"
        controls
        style="max-height: 160px; max-width: 100%; border-radius: 8px;"
      ></video>
      <a v-else :href="item.url" target="_blank" rel="noopener" class="d-inline-block text-muted">
        {{ item.path }}
      </a>
    </div>

    <div class="mb-3">
      <label class="form-label">Title</label>
      <input v-model="form.title" type="text" class="form-control">
    </div>
    <div v-if="item.kind === 'image'" class="mb-3">
      <label class="form-label">Alt Text</label>
      <input v-model="form.alt_text" type="text" class="form-control" placeholder="Describe the image for accessibility/SEO">
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea v-model="form.description" class="form-control" rows="3"></textarea>
    </div>

    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-outline-secondary btn-fig-sm" @click="$emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="saving" @click="save">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </FormModal>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved'])

const form = ref({
  title: props.item.title || '',
  alt_text: props.item.alt_text || '',
  description: props.item.description || '',
})
const saving = ref(false)
const error = ref('')

const save = async () => {
  saving.value = true
  error.value = ''
  try {
    const { data } = await axios.patch(route('admin.media-library.update', props.item.id), form.value)
    emit('saved', data.item)
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to save changes.'
  } finally {
    saving.value = false
  }
}
</script>
