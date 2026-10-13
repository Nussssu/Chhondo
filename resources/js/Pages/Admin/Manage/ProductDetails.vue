<script setup>
/**
 * Store settings › Product details.
 *
 * The three blouse buttons on every product page — without blouse, with
 * blouse and custom blouse — each with its own wording and on/off, and the
 * note shown under the custom blouse requirements box.
 */
import { useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import VisibilityToggle from '@/components/Admin/VisibilityToggle.vue'
import { STORE_TABS } from '@/settingsTabs'

const props = defineProps({
  buttons: { type: Object, default: () => ({}) },
  note: { type: String, default: '' },
})

const BUTTONS = [
  { key: 'without', title: 'Without blouse button' },
  { key: 'with', title: 'With blouse button' },
  { key: 'custom', title: 'Custom blouse button' },
]

const form = useForm({
  buttons: { ...props.buttons },
  note: props.note,
})

function save() {
  form.put(route('admin.manage.product-details.update'), { preserveScroll: true })
}
</script>

<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="The blouse buttons and the note on every product page">
        <template #actions>
          <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing" @click="save">
            {{ form.processing ? 'Saving…' : 'Save changes' }}
          </button>
        </template>
      </PageHeader>
      <SettingsTabs :tabs="STORE_TABS" />

      <div class="card mt-3">
        <div class="card-header">
          <h5 class="mb-0">Blouse buttons</h5>
        </div>
        <div class="card-body">
          <div v-for="b in BUTTONS" :key="b.key" class="pd-btn-row">
            <label class="pd-btn-label" :for="`pd-${b.key}`">
              {{ b.title }}
              <input
                :id="`pd-${b.key}`"
                v-model="form.buttons[`${b.key}_label`]"
                type="text"
                maxlength="60"
                class="form-control"
                :class="{ 'is-invalid': form.errors[`buttons.${b.key}_label`] }"
              />
              <span class="invalid-feedback">{{ form.errors[`buttons.${b.key}_label`] }}</span>
            </label>
            <VisibilityToggle
              v-model="form.buttons[`${b.key}_enabled`]"
              switch-only
              :aria-label="`Show the ${b.title.toLowerCase()}`"
            />
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">
          <h5 class="mb-0">Custom blouse note</h5>
        </div>
        <div class="card-body">
          <label class="form-label" for="pd-note">Shown under the requirements box when Custom Blouse is chosen</label>
          <textarea
            id="pd-note"
            v-model="form.note"
            rows="3"
            maxlength="1000"
            class="form-control"
            :class="{ 'is-invalid': form.errors.note }"
          ></textarea>
          <div class="invalid-feedback">{{ form.errors.note }}</div>
        </div>
      </div>

      <button type="button" class="btn btn-fig-primary w-100 mt-3" :disabled="form.processing" @click="save">
        {{ form.processing ? 'Saving…' : 'Save changes' }}
      </button>
    </div>
  </AdminLayout>
</template>

<style scoped>
.pd-btn-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 14px;
}
.pd-btn-row:last-child { margin-bottom: 0; }
.pd-btn-label { flex: 1; min-width: 0; margin: 0; font-size: 13px; font-weight: 600; }
.pd-btn-label .form-control { margin-top: 6px; }
.pd-btn-row :deep(.vt-btn) { margin-bottom: 9px; }
</style>
