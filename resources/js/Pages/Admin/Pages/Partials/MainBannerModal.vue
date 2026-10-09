<script setup>
/**
 * The hero's main banner, edited in a popup like the other hero banners.
 *
 * It holds the page's own Desktop / Mobile banner fields (hero_image_desktop /
 * hero_image_mobile), so Save hands the chosen images back and the page is
 * saved, as the inline banner fields did. Empty means "the original image".
 */
import { computed, ref } from 'vue'
import FormModal from '@/components/Admin/FormModal.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import { useMediaUploader } from '@/composables/useMediaUploader'
import { toast } from '@/utils/toast'
import { Images, UploadCloud, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  desktop: { type: String, default: '' },
  mobile: { type: String, default: '' },
  saving: { type: Boolean, default: false },
  copy: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'save'])

const images = ref({ desktop: props.desktop || '', mobile: props.mobile || '' })
const copy = ref({ ...props.copy })
const dirty = computed(() => images.value.desktop !== (props.desktop || '') || images.value.mobile !== (props.mobile || '') || JSON.stringify(copy.value) !== JSON.stringify(props.copy))

const SLOTS = [
  { key: 'desktop', label: 'Desktop banner', hint: 'Shown on tablets and computers. Best at 1920 × 848 px.', shape: 'wide' },
  { key: 'mobile', label: 'Mobile banner', hint: 'Shown on phones. Best at 804 × 1024 px (402 × 512 shape).', shape: 'tall' },
]

/* ------------------------------------------------------- library / upload -- */

const picking = ref(null)

function onLibrarySelected(item) {
  if (picking.value) images.value[picking.value] = item.url
  picking.value = null
}

const { upload } = useMediaUploader()
const uploading = ref(null)

async function onUpload(slot, event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  uploading.value = slot
  try {
    const { uploaded } = await upload([file])
    if (uploaded?.[0]?.url) images.value[slot] = uploaded[0].url
    else toast.error('The image could not be uploaded.')
  } finally {
    uploading.value = null
  }
}

function save() {
  emit('save', { ...images.value, copy: { ...copy.value } })
}
</script>

<template>
  <FormModal
    title="Main banner"
    subtitle="The first hero image — the others follow it in order"
    size="lg"
    :busy="saving || Boolean(uploading)"
    :dirty="dirty"
    @close="emit('close')"
  >
    <div class="row g-4">
      <div v-for="slot in SLOTS" :key="slot.key" :class="slot.key === 'desktop' ? 'col-md-7' : 'col-md-5'">
        <p class="mb-label">{{ slot.label }}</p>
        <p class="mb-hint">{{ slot.hint }}</p>

        <img v-if="images[slot.key]" :src="images[slot.key]" :alt="slot.label" class="mb-img" :class="`mb-img--${slot.shape}`" />
        <div v-else class="mb-empty" :class="`mb-img--${slot.shape}`">The original image is used</div>

        <div class="d-flex flex-wrap gap-2 mt-2">
          <label class="btn btn-fig-secondary btn-fig-sm mb-0" :class="{ disabled: uploading === slot.key }">
            <UploadCloud :size="14" class="me-1" />
            {{ uploading === slot.key ? 'Uploading…' : 'Upload' }}
            <input type="file" accept="image/*" hidden @change="onUpload(slot.key, $event)" />
          </label>
          <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="picking = slot.key">
            <Images :size="14" class="me-1" /> From library
          </button>
          <button v-if="images[slot.key]" type="button" class="btn btn-fig-secondary btn-fig-sm" @click="images[slot.key] = ''">
            <RotateCcw :size="14" class="me-1" /> Reset to original
          </button>
        </div>
      </div>
    </div>

    <div class="row g-3 mt-3">
      <div class="col-12">
        <label class="form-label" for="main-banner-heading">Heading</label>
        <textarea id="main-banner-heading" v-model="copy.heading" class="form-control" rows="2" maxlength="1000"></textarea>
        <p class="mb-hint mt-1 mb-0">Use *stars* for gold words and Enter for a new line.</p>
      </div>
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-between mb-1"><label class="form-label mb-0" for="main-banner-subtext">Small line</label><input v-model="copy.show_subtext" class="form-check-input" type="checkbox" role="switch" aria-label="Show main banner small line" /></div>
        <input id="main-banner-subtext" v-model="copy.subtext" class="form-control" maxlength="255" />
      </div>
      <div class="col-md-6">
        <div class="d-flex align-items-center justify-content-between mb-1"><label class="form-label mb-0" for="main-banner-cta-label">Button text</label><input v-model="copy.show_cta" class="form-check-input" type="checkbox" role="switch" aria-label="Show main banner CTA button" /></div>
        <input id="main-banner-cta-label" v-model="copy.cta_label" class="form-control" maxlength="150" />
      </div>
      <div class="col-md-6">
        <label class="form-label" for="main-banner-cta-url">Button link</label>
        <input id="main-banner-cta-url" v-model="copy.cta_url" class="form-control" maxlength="500" placeholder="/shop or https://…" />
      </div>
    </div>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="saving" @click="emit('close')">Cancel</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="saving || Boolean(uploading)" @click="save">
        {{ saving ? 'Saving…' : 'Save banner' }}
      </button>
    </template>
  </FormModal>

  <MediaLibraryPickerModal v-if="picking" kind="image" @close="picking = null" @select="onLibrarySelected" />
</template>

<style scoped>
.mb-label {
  margin: 0 0 2px;
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--text-muted);
}

.mb-hint {
  margin: 0 0 var(--sp-2);
  font-size: var(--fs-xs);
  line-height: 1.45;
  color: var(--text-faint);
}

/* Previews mirror the shapes the storefront renders. */
.mb-img {
  display: block;
  width: 100%;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  object-fit: cover;
  background: var(--surface-sunk);
}

.mb-img--wide { aspect-ratio: 1920 / 848; }
.mb-img--tall { aspect-ratio: 402 / 512; max-width: 220px; }

.mb-empty {
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
</style>
