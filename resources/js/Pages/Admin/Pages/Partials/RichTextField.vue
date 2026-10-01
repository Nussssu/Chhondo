<script setup>
/**
 * Summernote bound to a v-model, so a widget can hold formatted copy without
 * anyone touching HTML. Falls back to a plain textarea when the CDN script is
 * unavailable, rather than leaving an editor that silently does nothing.
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  height: { type: Number, default: 240 },
})

const emit = defineEmits(['update:modelValue'])

const el = ref(null)
const ready = ref(false)
const hasPlugin = ref(true)

const available = () => typeof window.$ !== 'undefined' && Boolean(window.$.fn?.summernote)

onMounted(async () => {
  await nextTick()

  if (!available()) {
    hasPlugin.value = false
    return
  }

  window.$(el.value).summernote({
    height: props.height,
    placeholder: 'Write here…',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'underline', 'clear']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['insert', ['link', 'picture']],
      ['view', ['codeview']],
    ],
    callbacks: {
      onChange: (contents) => emit('update:modelValue', contents),
      onBlur: () => emit('update:modelValue', window.$(el.value).summernote('code')),
    },
  })

  window.$(el.value).summernote('code', props.modelValue || '')
  ready.value = true
})

onBeforeUnmount(() => {
  if (ready.value && available()) {
    window.$(el.value).summernote('destroy')
  }
})
</script>

<template>
  <div>
    <textarea v-show="hasPlugin" ref="el" class="form-control" rows="8"></textarea>
    <textarea
      v-if="!hasPlugin"
      :value="modelValue"
      class="form-control mt-2"
      rows="6"
      placeholder="<p>Write HTML here…</p>"
      @input="emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>
