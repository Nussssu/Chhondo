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
})

const emit = defineEmits(['close', 'save'])

const images = ref({ desktop: props.desktop || '', mobile: props.mobile || '' })
const dirty = computed(() => images.value.desktop !== (props.desktop || '') || images.value.mobile !== (props.mobile || ''))

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
  emit('save', { ...images.value })
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
