<script setup>
import { useForm, Link } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import VisibilityToggle from '@/components/Admin/VisibilityToggle.vue'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next'

const props = defineProps({ settings: { type: Object, required: true } })
const form = useForm({ settings: JSON.parse(JSON.stringify(props.settings)) })
const groups = [{ key: 'options', label: 'Blouse options' }, { key: 'sleeves', label: 'Sleeve types' }, { key: 'sizes', label: 'Sizes' }]
const labels = [{ key: 'legacy_without_label', label: 'Without blouse label' }, { key: 'legacy_with_label', label: 'With blouse label' }, { key: 'label', label: 'Section label' }, { key: 'sleeve_label', label: 'Sleeve dropdown label' }, { key: 'size_label', label: 'Size dropdown label' }, { key: 'requirements_label', label: 'Requirements label' }, { key: 'requirements_placeholder', label: 'Requirements placeholder' }]
function add(group) {
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  form.settings[group].push({ id: `${group}-${id}`, label: '', enabled: true, ...(group === 'options' ? { price: 550 } : {}) })
}
function move(group, index, delta) {
  const rows = form.settings[group]
  if (index + delta < 0 || index + delta >= rows.length) return
  ;[rows[index], rows[index + delta]] = [rows[index + delta], rows[index]]
}
function save() { form.put(route('products.blouse-settings.update'), { preserveScroll: true }) }
</script>
<template>
  <AdminLayout>
    <div class="page-content blouse-settings">
      <PageHeader title="Blouse customization">
        <template #actions><Link :href="route('products.index')" class="btn btn-fig-secondary btn-fig-sm">Products</Link><button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing" @click="save">Save changes</button></template>
      </PageHeader>
      <div v-if="Object.keys(form.errors).length" class="alert alert-danger" role="alert"><div v-for="(error, key) in form.errors" :key="key">{{ error }}</div></div>
      <div class="card"><div class="card-body d-flex align-items-center justify-content-between"><span>Show blouse customization on all products</span><VisibilityToggle v-model="form.settings.enabled" switch-only aria-label="Enable blouse customization" /></div></div>
      <div v-for="group in groups" :key="group.key" class="card">
        <div class="card-header d-flex align-items-center justify-content-between"><h6 class="mb-0">{{ group.label }}</h6><button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="add(group.key)"><Plus :size="14" /> Add</button></div>
        <div class="card-body">
          <div v-for="(row, index) in form.settings[group.key]" :key="row.id" class="blouse-repeat-row">
            <label class="blouse-row-label">Label<input v-model="row.label" class="form-control" maxlength="150" /></label>
            <label v-if="group.key === 'options'">Extra price (৳)<input v-model="row.price" class="form-control" type="number" min="0" max="100000" step="0.01" /></label>
            <div class="blouse-row-actions"><VisibilityToggle v-model="row.enabled" switch-only :aria-label="`Enable ${row.label || group.label}`" /><button type="button" class="table-icon-btn" title="Move up" :disabled="index === 0" @click="move(group.key, index, -1)"><ChevronUp :size="14" /></button><button type="button" class="table-icon-btn" title="Move down" :disabled="index === form.settings[group.key].length - 1" @click="move(group.key, index, 1)"><ChevronDown :size="14" /></button><button type="button" class="table-icon-btn is-danger" title="Remove" @click="form.settings[group.key].splice(index, 1)"><Trash2 :size="14" /></button></div>
          </div>
          <p v-if="!form.settings[group.key].length" class="text-muted mb-0">No {{ group.label.toLowerCase() }} configured.</p>
        </div>
      </div>
      <div class="card"><div class="card-header"><h6 class="mb-0">Labels and contact note</h6></div><div class="card-body"><div class="blouse-label-grid"><label v-for="label in labels" :key="label.key">{{ label.label }}<input v-model="form.settings[label.key]" class="form-control" maxlength="150" /></label></div><label class="mt-3 d-block">Note shown after confirmation<textarea v-model="form.settings.note" class="form-control" rows="2" maxlength="1000"></textarea></label></div></div>
      <button type="button" class="btn btn-fig-primary w-100" :disabled="form.processing" @click="save">{{ form.processing ? 'Saving…' : 'Save changes' }}</button>
    </div>
  </AdminLayout>
</template>
<style scoped>
.blouse-settings .card { margin-bottom: 16px; }
.blouse-repeat-row { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 12px; }
.blouse-repeat-row label { min-width: 0; font-size: 12px; }
.blouse-row-label { flex: 1; }
.blouse-repeat-row input, .blouse-label-grid input { margin-top: 5px; }
.blouse-row-actions { display: flex; align-items: center; gap: 4px; padding-bottom: 6px; flex-shrink: 0; }
.blouse-label-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 767px) { .blouse-repeat-row { flex-wrap: wrap; }.blouse-row-label { flex-basis: 100%; }.blouse-row-actions { margin-left: auto; }.blouse-label-grid { grid-template-columns: 1fr; } }
</style>
