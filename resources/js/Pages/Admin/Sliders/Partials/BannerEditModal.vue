<script setup>
/**
 * Add a banner, or replace the images on one.
 *
 * A banner carries two images: the wide desktop hero, and an optional square
 * crop shown on phones. They are chosen independently, so replacing one never
 * disturbs the other.
 */
import { computed, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'

const props = defineProps({
  // Omitted when adding a new banner.
  banner: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const isEdit = computed(() => Boolean(props.banner?.id))

const form = useForm({
  _method: isEdit.value ? 'PATCH' : 'POST',
  image_path: null,
  image_path_library_path: '',
  mobile_image_path: null,
  mobile_image_path_library_path: '',
  // Carousel details
  title: props.banner?.title ?? '',
  heading: props.banner?.heading ?? '',
  subtext: props.banner?.subtext ?? '',
  cta_label: props.banner?.cta_label ?? '',
  cta_url: props.banner?.cta_url ?? '',
  show_subtext: props.banner?.show_subtext !== false,
  show_cta: props.banner?.show_cta !== false,
  link_url: props.banner?.link_url ?? '',
  link_new_tab: Boolean(props.banner?.link_new_tab),
  is_active: props.banner ? props.banner.is_active !== false : true,
})

// Which slot the library picker is currently filling: 'desktop' | 'mobile'.
const picking = ref(null)

const preview = ref({ desktop: null, mobile: null })

const SLOTS = {
  desktop: { field: 'image_path_library_path', current: () => props.banner?.image_path },
  mobile:  { field: 'mobile_image_path_library_path', current: () => props.banner?.mobile_image_path },
}

function onLibrarySelected(item) {
  const slot = picking.value
  picking.value = null
  if (!slot) return

  form[SLOTS[slot].field] = item.url
  preview.value[slot] = item.url
}

function clear(slot) {
  form[SLOTS[slot].field] = ''
  preview.value[slot] = null
}

// Nothing to send until an image or a detail has changed.
const dirty = computed(() => Boolean(preview.value.desktop || preview.value.mobile) || form.isDirty)

// A new banner needs its desktop image; an edit may change anything on its own.
const canSubmit = computed(() => (isEdit.value ? dirty.value : Boolean(preview.value.desktop)))

function submit() {
  const url = isEdit.value
    ? route('admin.sliders.banner.update', props.banner.id)
    : route('admin.sliders.banner.store')

  form.post(url, {
    forceFormData: true,
    preserveScroll: true,
    onSuccess: () => emit('close'),
  })
}
</script>

<template>
  <FormModal
    :title="isEdit ? 'Edit banner' : 'Add a banner'"
    size="lg"
    :busy="form.processing"
    :dirty="dirty"
    @close="emit('close')"
  >
    <form id="banner-form" @submit.prevent="submit">
      <div class="row g-4">
        <!-- ── Desktop ─────────────────────────────────────────── -->
        <div class="col-md-6">
          <p class="bn-label">
            Desktop banner
            <span v-if="!isEdit" class="bn-req">required</span>
          </p>
          <p class="bn-hint">Shown on tablets and computers. 1900×560 is ideal; anything at least 1200px wide is cropped to fit.</p>

          <img v-if="preview.desktop" :src="preview.desktop" alt="New desktop banner" class="bn-img bn-img--wide" />
          <img
            v-else-if="SLOTS.desktop.current()"
            :src="SLOTS.desktop.current()"
            alt="Current desktop banner"
            class="bn-img bn-img--wide is-current"
          />
          <div v-else class="bn-empty bn-empty--wide">Nothing chosen yet</div>

          <div class="d-flex gap-2 mt-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" data-autofocus @click="picking = 'desktop'">
              {{ preview.desktop || SLOTS.desktop.current() ? 'Change' : 'Choose from library' }}
            </button>
            <button v-if="preview.desktop" type="button" class="btn btn-fig-secondary btn-fig-sm" @click="clear('desktop')">
              Undo
            </button>
          </div>

          <p v-if="form.errors.image_path" class="invalid-note">{{ form.errors.image_path }}</p>
        </div>

        <!-- ── Mobile ──────────────────────────────────────────── -->
        <div class="col-md-6">
          <p class="bn-label">
            Mobile banner
            <span class="bn-opt">optional</span>
          </p>
          <p class="bn-hint">Shown on phones, cropped to a square. Use a square image such as 1000×1000. Without one, the desktop banner is used.</p>

          <img v-if="preview.mobile" :src="preview.mobile" alt="New mobile banner" class="bn-img bn-img--square" />
          <img
            v-else-if="SLOTS.mobile.current()"
            :src="SLOTS.mobile.current()"
            alt="Current mobile banner"
            class="bn-img bn-img--square is-current"
          />
          <div v-else class="bn-empty bn-empty--square">
            Falls back to the desktop banner
          </div>

          <div class="d-flex gap-2 mt-2">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="picking = 'mobile'">
              {{ preview.mobile || SLOTS.mobile.current() ? 'Change' : 'Choose from library' }}
            </button>
            <button v-if="preview.mobile" type="button" class="btn btn-fig-secondary btn-fig-sm" @click="clear('mobile')">
              Undo
            </button>
          </div>

          <p v-if="form.errors.mobile_image_path" class="invalid-note">{{ form.errors.mobile_image_path }}</p>
        </div>
      </div>

      <!-- ── Carousel details ─────────────────────────────────── -->
      <div class="bn-details">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label" for="bn-heading">Heading</label>
            <textarea id="bn-heading" v-model="form.heading" class="form-control" rows="2" maxlength="1000"></textarea>
            <p class="bn-hint mt-1 mb-0">Use *stars* for gold words and Enter for a new line.</p>
            <p v-if="form.errors.heading" class="invalid-note">{{ form.errors.heading }}</p>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-1"><label class="form-label mb-0" for="bn-subtext">Small line</label><input v-model="form.show_subtext" type="checkbox" class="form-check-input" role="switch" aria-label="Show this banner's small line" /></div>
            <input id="bn-subtext" v-model="form.subtext" class="form-control" maxlength="255" />
            <p v-if="form.errors.subtext" class="invalid-note">{{ form.errors.subtext }}</p>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-between align-items-center mb-1"><label class="form-label mb-0" for="bn-cta-label">Button text</label><input v-model="form.show_cta" type="checkbox" class="form-check-input" role="switch" aria-label="Show this banner's CTA button" /></div>
            <input id="bn-cta-label" v-model="form.cta_label" class="form-control" maxlength="150" />
            <p v-if="form.errors.cta_label" class="invalid-note">{{ form.errors.cta_label }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="bn-cta-url">Button link</label>
            <input id="bn-cta-url" v-model="form.cta_url" class="form-control" maxlength="500" placeholder="/shop or https://…" />
            <p v-if="form.errors.cta_url" class="invalid-note">{{ form.errors.cta_url }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="bn-title">Alt text</label>
            <input id="bn-title" v-model="form.title" type="text" class="form-control" maxlength="150" placeholder="e.g. Puja collection banner" />
            <p class="bn-hint mt-1 mb-0">Describes the image for screen readers and search engines.</p>
            <p v-if="form.errors.title" class="invalid-note">{{ form.errors.title }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="bn-link">Link (optional)</label>
            <input id="bn-link" v-model="form.link_url" type="text" class="form-control" maxlength="500" placeholder="/shop or https://…" />
            <p class="bn-hint mt-1 mb-0">Where a click on this banner goes. Leave empty for no link.</p>
            <p v-if="form.errors.link_url" class="invalid-note">{{ form.errors.link_url }}</p>
          </div>
          <div class="col-md-6">
            <div class="form-check form-switch mb-0">
              <input id="bn-newtab" v-model="form.link_new_tab" class="form-check-input" type="checkbox" role="switch" :disabled="!form.link_url" />
              <label class="form-check-label" for="bn-newtab">Open the link in a new tab</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-check form-switch mb-0">
              <input id="bn-active" v-model="form.is_active" class="form-check-input" type="checkbox" role="switch" />
              <label class="form-check-label" for="bn-active">Active — shown in the homepage carousel</label>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="emit('close')">
        Cancel
      </button>
      <button
        type="submit"
        form="banner-form"
        class="btn btn-fig-primary btn-fig-sm"
        :disabled="form.processing || !canSubmit"
      >
        {{ form.processing ? 'Saving…' : (isEdit ? 'Save banner' : 'Add banner') }}
      </button>
    </template>
  </FormModal>

  <MediaLibraryPickerModal
    v-if="picking"
    kind="image"
    @close="picking = null"
    @select="onLibrarySelected"
  />
</template>

<style scoped>
.bn-label {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin: 0 0 2px;
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--text-muted);
}

.bn-req,
.bn-opt {
  padding: 1px 7px;
  border-radius: var(--r-full);
  font-size: 10px;
  letter-spacing: .02em;
  text-transform: none;
}

.bn-req { background: var(--st-warning-soft); color: var(--st-warning); }
.bn-opt { background: var(--st-neutral-soft); color: var(--st-neutral); }

.bn-hint {
  margin: 0 0 var(--sp-2);
  font-size: var(--fs-xs);
  line-height: 1.45;
  color: var(--text-faint);
  text-transform: none;
  letter-spacing: 0;
}

/* The previews mirror the shapes the storefront actually renders, so what is
   cropped out is visible before saving. */
.bn-img {
  display: block;
  width: 100%;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  object-fit: cover;
  background: var(--surface-sunk);
}

.bn-img--wide   { aspect-ratio: 1900 / 560; }
.bn-img--square { aspect-ratio: 1 / 1; max-width: 220px; }

.bn-img.is-current { opacity: .75; }

.bn-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-3);
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-sm);
  color: var(--text-faint);
  font-size: var(--fs-sm);
  text-align: center;
}

.bn-empty--wide   { aspect-ratio: 1900 / 560; }
.bn-empty--square { aspect-ratio: 1 / 1; max-width: 220px; }

.bn-details {
  margin-top: var(--sp-4, 16px);
  padding-top: var(--sp-4, 16px);
  border-top: 1px solid var(--line);
}

.invalid-note { margin: 6px 0 0; font-size: var(--fs-sm); color: var(--st-danger); }
</style>
