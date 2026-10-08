<template>
  <Teleport to="body">
    <div class="hr-backdrop" @click.self="close">
      <div class="hr-modal" role="dialog" aria-modal="true" aria-labelledby="homepage-review-title">
        <div class="hr-head">
          <div>
            <h6 id="homepage-review-title">{{ review ? 'Edit Homepage Review' : 'Add Homepage Review' }}</h6>
            <p>Customer testimonial shown on the storefront homepage</p>
          </div>
          <button type="button" class="hr-close" aria-label="Close" @click="close"><X :size="18" /></button>
        </div>

        <form @submit.prevent="submit">
          <div class="hr-body">
            <div class="hr-grid">
              <label>Name <span>*</span><input v-model="form.name" :class="{ 'is-invalid': form.errors.name }" /></label>
              <label>City<input v-model="form.city" /></label>
            </div>

            <div class="hr-field">
              <span class="hr-label">Rating</span>
              <div class="hr-stars">
                <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': n <= (hoverRating || form.rating) }" @click="form.rating = n" @mouseenter="hoverRating = n" @mouseleave="hoverRating = 0">
                  <Star :size="23" />
                </button>
                <small>{{ form.rating }} / 5</small>
              </div>
            </div>

            <label class="hr-field">Review <span>*</span><textarea v-model="form.review" rows="5" :class="{ 'is-invalid': form.errors.review }"></textarea></label>

            <div class="hr-photo-row">
              <div class="hr-photo">
                <img v-if="photo" :src="photo" alt="Review photo" />
                <span v-else>{{ (form.name || '?').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="showPicker = true">{{ photo ? 'Change photo' : 'Choose photo' }}</button>
                <small>Optional customer image</small>
              </div>
            </div>

            <div class="hr-grid hr-grid-bottom">
              <label>Sort order<input v-model.number="form.sort_order" type="number" min="0" /></label>
              <label class="hr-toggle">
                <input v-model="form.is_active" type="checkbox" />
                <span></span>
                {{ form.is_active ? 'Published' : 'Hidden' }}
              </label>
            </div>
          </div>

          <div class="hr-foot">
            <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="close">Cancel</button>
            <button type="submit" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
              <Check :size="15" /> {{ review ? 'Save changes' : 'Add review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <MediaLibraryPickerModal v-if="showPicker" @close="showPicker = false" @select="selectImage" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Check, Star, X } from 'lucide-vue-next'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'

const props = defineProps({ review: { type: Object, default: null } })
const emit = defineEmits(['close'])
const showPicker = ref(false)
const hoverRating = ref(0)

const form = useForm({
  name: props.review?.name ?? '',
  city: props.review?.city ?? '',
  rating: props.review?.rating ?? 5,
  review: props.review?.review ?? '',
  sort_order: props.review?.sort_order ?? 0,
  is_active: props.review ? !!props.review.is_active : true,
  image: null,
  image_library_path: null,
})

const photo = computed(() => form.image_library_path || props.review?.image || null)

onMounted(() => { document.body.style.overflow = 'hidden' })
onBeforeUnmount(() => { document.body.style.overflow = '' })

function selectImage(item) {
  form.image_library_path = item.url
  form.image = null
  showPicker.value = false
}

function close() {
  if (!form.processing) emit('close')
}

function submit() {
  const options = { forceFormData: true, preserveScroll: true, onSuccess: close }
  if (props.review) form.post(route('admin.pages.reviews.update', props.review.id), options)
  else form.post(route('admin.pages.reviews.store'), options)
}
</script>

<style scoped>
.hr-backdrop { position: fixed; inset: 0; z-index: 1060; display: grid; place-items: center; padding: 20px; background: rgba(15, 23, 42, .48); }
.hr-modal { width: min(600px, 100%); max-height: 94vh; overflow-y: auto; border-radius: var(--r-lg); background: var(--surface); box-shadow: 0 24px 64px rgba(15, 23, 42, .24); }
.hr-head, .hr-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; }
.hr-head { border-bottom: 1px solid var(--line); }
.hr-head h6 { margin: 0 0 2px; color: var(--text); font-size: 16px; }
.hr-head p { margin: 0; color: var(--text-muted); font-size: 12px; }
.hr-close { width: 30px; height: 30px; display: grid; place-items: center; border: 0; border-radius: var(--r-sm); background: none; color: var(--text-muted); }
.hr-close:hover { background: var(--surface-sunk); color: var(--text); }
.hr-body { display: grid; gap: 16px; padding: 18px; }
.hr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.hr-body label, .hr-label { display: grid; gap: 5px; color: var(--text); font-size: 12px; font-weight: 700; }
.hr-body label > span { color: var(--st-danger); }
.hr-body input:not([type='checkbox']), .hr-body textarea { width: 100%; padding: 9px 11px; border: 1px solid var(--line-strong); border-radius: var(--r-sm); background: var(--surface); color: var(--text); font: inherit; font-size: 13px; }
.hr-body input:focus, .hr-body textarea:focus { outline: 0; border-color: var(--admin-green-600); box-shadow: 0 0 0 3px rgba(37, 47, 23, .12); }
.hr-field { display: grid; gap: 6px; }
.hr-stars { display: flex; align-items: center; gap: 3px; }
.hr-stars button { display: grid; place-items: center; padding: 0; border: 0; background: none; color: #d6d3cd; }
.hr-stars button.is-on { color: #e9a30c; }
.hr-stars button.is-on svg { fill: currentColor; }
.hr-stars small { margin-left: 6px; color: var(--text-muted); }
.hr-photo-row { display: flex; align-items: center; gap: 12px; }
.hr-photo { width: 54px; height: 54px; display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: var(--accent-soft, #e6efdd); color: var(--admin-green-700); font-weight: 700; }
.hr-photo img { width: 100%; height: 100%; object-fit: cover; }
.hr-photo-row > div:last-child { display: grid; justify-items: start; gap: 4px; }
.hr-photo-row small { color: var(--text-muted); font-size: 10px; }
.hr-grid-bottom { align-items: end; }
.hr-toggle { display: flex !important; grid-template-columns: auto auto 1fr; align-items: center; gap: 8px !important; height: 38px; cursor: pointer; }
.hr-toggle input { display: none; }
.hr-toggle span { position: relative; width: 40px; height: 22px; border-radius: 999px; background: #cbd5c4; }
.hr-toggle span::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .15s; }
.hr-toggle input:checked + span { background: var(--admin-green-600); }
.hr-toggle input:checked + span::after { transform: translateX(18px); }
.hr-foot { justify-content: flex-end; border-top: 1px solid var(--line); background: var(--surface-alt); }
.hr-foot .btn { display: inline-flex; align-items: center; gap: 5px; }
@media (max-width: 575px) { .hr-grid { grid-template-columns: 1fr; } }
</style>
