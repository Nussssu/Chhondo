<script setup>
/**
 * Add / edit a custom code snippet: a title, where it runs (target pages),
 * where it is printed (head / body start / body end) and the code itself.
 */
import { computed, ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  // null → create, object → edit
  tool: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const LOCATIONS = [
  { value: 'head', label: 'Head', hint: 'Printed inside <head> — pixels, verification tags, styles.' },
  { value: 'body_start', label: 'Body start', hint: 'Right after the opening <body> — GTM noscript, chat widgets.' },
  { value: 'body_end', label: 'Body end', hint: 'Just before </body> — anything that should load last.' },
]

const TARGETS = [
  { value: 'entire_site', label: 'Entire site' },
  { value: 'home', label: 'Home page' },
  { value: 'shop', label: 'Shop / product list' },
  { value: 'category', label: 'Category pages' },
  { value: 'product', label: 'Product detail pages' },
  { value: 'cart', label: 'Cart' },
  { value: 'checkout', label: 'Checkout' },
  { value: 'order_success', label: 'Order success / thank you' },
  { value: 'account', label: 'Account pages' },
  { value: 'contact', label: 'Contact page' },
  { value: 'custom', label: 'Custom URLs…' },
]

const isEdit = computed(() => Boolean(props.tool?.id))

const form = useForm({
  title: props.tool?.title ?? props.tool?.name ?? '',
  name: props.tool?.name ?? '',
  identifier: props.tool?.identifier ?? '',
  location: props.tool?.location ?? 'head',
  target: props.tool?.target ?? 'entire_site',
  target_urls: props.tool?.target_urls ?? '',
  script: props.tool?.script ?? '',
  second_script: props.tool?.second_script ?? '',
  is_active: props.tool ? Boolean(props.tool.is_active) : true,
  priority: props.tool?.priority ?? 10,
})

const isCustomTarget = computed(() => form.target === 'custom')

const locationHint = computed(
  () => LOCATIONS.find((l) => l.value === form.location)?.hint ?? ''
)

// A rough guard against pasting a snippet in the wrong slot.
const looksLikeNoscript = computed(
  () => /<noscript/i.test(form.script) && form.location === 'head'
)

const charCount = computed(() => form.script.length)

function submit() {
  const options = {
    preserveScroll: true,
    onSuccess: () => emit('close'),
  }

  if (isEdit.value) {
    form.patch(route('admin.marketing-tools.update', props.tool.id), options)
  } else {
    form.post(route('admin.marketing-tools.store'), options)
  }
}
</script>

<template>
  <FormModal
    :title="isEdit ? 'Edit custom code' : 'Add custom code'"
    subtitle="Scripts injected into the storefront"
    size="lg"
    :busy="form.processing"
    :dirty="form.isDirty"
    @close="emit('close')"
  >
    <form id="marketing-tool-form" @submit.prevent="submit">
      <!-- Title -->
      <div class="mb-3">
        <label for="mt-title" class="form-label">Title</label>
        <input
          id="mt-title"
          v-model="form.title"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': form.errors.title }"
          placeholder="e.g. Meta Pixel — main"
          data-autofocus
        />
        <p v-if="form.errors.title" class="invalid-note">{{ form.errors.title }}</p>
      </div>

      <div class="row g-3 mb-3">
        <!-- Target -->
        <div class="col-md-6">
          <label for="mt-target" class="form-label">Target page</label>
          <select id="mt-target" v-model="form.target" class="form-select">
            <option v-for="t in TARGETS" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
          <p v-if="form.errors.target" class="invalid-note">{{ form.errors.target }}</p>
        </div>

        <!-- Location -->
        <div class="col-md-6">
          <label for="mt-location" class="form-label">Location</label>
          <select id="mt-location" v-model="form.location" class="form-select">
            <option v-for="l in LOCATIONS" :key="l.value" :value="l.value">{{ l.label }}</option>
          </select>
          <small class="text-muted d-block mt-1">{{ locationHint }}</small>
        </div>
      </div>

      <!-- Custom URL patterns -->
      <div v-if="isCustomTarget" class="mb-3">
        <label for="mt-urls" class="form-label">URL patterns</label>
        <textarea
          id="mt-urls"
          v-model="form.target_urls"
          class="form-control script-box"
          rows="3"
          :class="{ 'is-invalid': form.errors.target_urls }"
          placeholder="product/*&#10;shop&#10;product-category/saree"
        ></textarea>
        <small class="text-muted">
          One path per line, without the domain. <code>*</code> matches anything —
          <code>product/*</code> covers every product page. Use <code>/</code> for the home page.
        </small>
        <p v-if="form.errors.target_urls" class="invalid-note">{{ form.errors.target_urls }}</p>
      </div>

      <!-- Code -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-baseline">
          <label for="mt-script" class="form-label">Code</label>
          <small class="text-muted">{{ charCount }} characters</small>
        </div>
        <textarea
          id="mt-script"
          v-model="form.script"
          class="form-control script-box"
          rows="10"
          spellcheck="false"
          :class="{ 'is-invalid': form.errors.script }"
          placeholder="<!-- Paste the full snippet, including its <script> tags -->"
        ></textarea>
        <small class="text-muted">
          Pasted exactly as written, including <code>&lt;script&gt;</code>, <code>&lt;noscript&gt;</code>
          and <code>&lt;meta&gt;</code> tags.
        </small>
        <p v-if="looksLikeNoscript" class="warn-note">
          This contains a &lt;noscript&gt; tag — those usually belong in <strong>Body start</strong>, not Head.
        </p>
        <p v-if="form.errors.script" class="invalid-note">{{ form.errors.script }}</p>
      </div>

      <!-- Advanced -->
      <details class="mt-advanced">
        <summary>Advanced</summary>
        <div class="row g-3 mt-1">
          <div class="col-md-6">
            <label for="mt-identifier" class="form-label">Identifier (optional)</label>
            <input
              id="mt-identifier"
              v-model="form.identifier"
              type="text"
              class="form-control"
              placeholder="e.g. GTM-XXXXXX"
            />
            <small class="text-muted">Reference only — not injected.</small>
          </div>
          <div class="col-md-6">
            <label for="mt-priority" class="form-label">Priority</label>
            <input
              id="mt-priority"
              v-model.number="form.priority"
              type="number"
              min="0"
              max="999"
              class="form-control"
            />
            <small class="text-muted">Lower runs first when several snippets share a slot.</small>
          </div>
        </div>
      </details>

      <!-- Active -->
      <div class="form-check form-switch mt-3">
        <input
          id="mt-active"
          v-model="form.is_active"
          class="form-check-input"
          type="checkbox"
          role="switch"
        />
        <label class="form-check-label" for="mt-active">
          Active — {{ form.is_active ? 'this code is live on the storefront' : 'saved but not injected' }}
        </label>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" form="marketing-tool-form" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : 'Add code') }}
      </button>
    </template>
  </FormModal>
</template>

<style scoped>
.script-box {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: var(--fs-sm);
}

.invalid-note {
  margin: 4px 0 0;
  font-size: var(--fs-sm);
  color: var(--st-danger);
}

.warn-note {
  margin: 6px 0 0;
  font-size: var(--fs-sm);
  color: var(--st-warning, #b45309);
}

.mt-advanced summary {
  cursor: pointer;
  font-size: var(--fs-sm);
  color: var(--ink-muted, #6b7280);
}
</style>
