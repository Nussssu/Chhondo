<script setup>
/**
 * A modal for records that are just a name — account types, account
 * purposes, and anything else where a whole page was being spent on one
 * input.
 *
 * The caller supplies the store/update routes; everything else is generic.
 */
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from './FormModal.vue'

const props = defineProps({
  // null → create, object → edit. Must carry `id` and `name`.
  record:     { type: Object, default: null },
  noun:       { type: String, required: true },   // e.g. 'account type'
  label:      { type: String, default: 'Name' },
  placeholder:{ type: String, default: '' },
  hint:       { type: String, default: '' },
  storeRoute: { type: String, required: true },
  updateRoute:{ type: String, default: '' },
  // Some endpoints expect PATCH, others PUT.
  updateMethod: { type: String, default: 'patch' },
})

const emit = defineEmits(['close'])

const isEdit = computed(() => Boolean(props.record?.id))

const form = useForm({ name: props.record?.name ?? '' })

const titleCase = computed(() => props.noun.charAt(0).toUpperCase() + props.noun.slice(1))

function submit() {
  const options = { preserveScroll: true, onSuccess: () => emit('close') }

  if (isEdit.value) {
    form[props.updateMethod](route(props.updateRoute, props.record.id), options)
  } else {
    form.post(route(props.storeRoute), options)
  }
}
</script>

<template>
  <FormModal
    :title="isEdit ? `Edit ${noun}` : `Add ${noun}`"
    size="sm"
    :busy="form.processing"
    :dirty="form.isDirty"
    @close="emit('close')"
  >
    <form id="name-field-form" @submit.prevent="submit">
      <label for="nf-name" class="form-label">{{ label }} <span class="req">*</span></label>
      <input
        id="nf-name"
        v-model="form.name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': form.errors.name }"
        :placeholder="placeholder"
        data-autofocus
      />
      <small v-if="hint" class="text-muted">{{ hint }}</small>
      <p v-if="form.errors.name" class="invalid-note">{{ form.errors.name }}</p>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" form="name-field-form" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : `Add ${noun}`) }}
      </button>
    </template>
  </FormModal>
</template>

<style scoped>
.req { color: var(--st-danger); font-weight: 700; }
.invalid-note { margin: 4px 0 0; font-size: var(--fs-sm); color: var(--st-danger); }
</style>
