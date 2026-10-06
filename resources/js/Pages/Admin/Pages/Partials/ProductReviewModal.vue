<template>
  <Teleport to="body">
    <div v-if="open" class="pr-modal-backdrop" @click.self="close">
      <div class="pr-modal" role="dialog" aria-modal="true" aria-labelledby="pr-modal-title">

        <div class="pr-modal-head">
          <div>
            <h6 id="pr-modal-title" class="mb-1 fw-bold">Edit Product Review</h6>
            <p class="mb-0 pr-modal-sub" v-if="review?.product_name">{{ review.product_name }}</p>
          </div>
          <button type="button" class="pr-modal-close" aria-label="Close" @click="close">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="submit">
          <div class="pr-modal-body">

            <!-- Status: the pending -> active switch -->
            <div class="pr-status" :class="form.is_active ? 'is-active' : 'is-pending'">
              <div>
                <div class="pr-status-title">
                  {{ form.is_active ? 'Active' : 'Pending' }}
                </div>
                <div class="pr-status-hint">
                  {{ form.is_active
                    ? 'This review is published on the product page.'
                    : 'Not visible to customers until you activate it.' }}
                </div>
              </div>
              <label class="rv-switch mb-0">
                <input type="checkbox" v-model="form.is_active" />
                <span class="rv-switch-track"></span>
              </label>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="rv-label">Name <span class="rv-req">*</span></label>
                <input v-model="form.name" class="form-control rv-input" :class="{ 'is-invalid': form.errors.name }" />
                <div class="invalid-feedback">{{ form.errors.name }}</div>
              </div>
              <div class="col-md-6">
                <label class="rv-label">Contact <span class="rv-req">*</span></label>
                <input v-model="form.contact" class="form-control rv-input" :class="{ 'is-invalid': form.errors.contact }" />
                <div class="invalid-feedback">{{ form.errors.contact }}</div>
              </div>
            </div>

            <div class="mt-3">
              <label class="rv-label">Rating</label>
              <div class="rv-star-input">
                <button
                  v-for="n in 5" :key="n" type="button"
                  class="rv-star-btn"
                  :class="{ 'is-on': n <= (hoverRating || form.rating) }"
                  @click="form.rating = n"
                  @mouseenter="hoverRating = n"
                  @mouseleave="hoverRating = 0"
                  :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24"><polygon points="12,2 15,9 22,9.3 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.3 9,9" /></svg>
                </button>
                <span class="rv-star-caption">{{ form.rating }} / 5</span>
              </div>
            </div>

            <div class="mt-3">
              <label class="rv-label">Review <span class="rv-req">*</span></label>
              <textarea v-model="form.review" rows="5" class="form-control rv-input" :class="{ 'is-invalid': form.errors.review }"></textarea>
              <div class="invalid-feedback">{{ form.errors.review }}</div>
            </div>

            <div v-if="images.length" class="mt-3">
              <label class="rv-label">Photos submitted by the customer</label>
              <div class="pr-images">
                <div
                  v-for="img in images" :key="img"
                  class="pr-image" :class="{ 'is-removed': form.removed_images.includes(img) }"
                >
                  <img :src="img" alt="review photo" />
                  <button type="button" class="pr-image-x" :title="form.removed_images.includes(img) ? 'Keep this photo' : 'Remove this photo'" @click="toggleImage(img)">
                    <component :is="form.removed_images.includes(img) ? Undo2 : X" :size="13" />
                  </button>
                </div>
              </div>
              <small class="rv-hint">Removed photos are deleted permanently when you save.</small>
            </div>

          </div>

          <div class="pr-modal-foot">
            <button type="button" class="btn rv-btn-ghost" @click="close">Cancel</button>
            <button type="submit" class="btn rv-btn-primary" :disabled="form.processing">
              <Check :size="16" />
              {{ form.is_active ? 'Save & Activate' : 'Save' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { X, Check, Undo2 } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  review: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const hoverRating = ref(0)

const form = useForm({
  name: '',
  contact: '',
  rating: 5,
  review: '',
  is_active: false,
  removed_images: [],
})

const images = computed(() => props.review?.images || [])

// Re-seed the form every time a different review is opened.
watch(() => [props.open, props.review?.id], () => {
  if (!props.open || !props.review) return
  form.defaults({
    name: props.review.name ?? '',
    contact: props.review.contact ?? '',
    rating: props.review.rating ?? 5,
    review: props.review.review ?? '',
    is_active: !!props.review.is_active,
    removed_images: [],
  })
  form.reset()
  form.clearErrors()
  hoverRating.value = 0
}, { immediate: true })

// Keep the page behind the modal from scrolling.
watch(() => props.open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
onBeforeUnmount(() => { document.body.style.overflow = '' })

const toggleImage = (img) => {
  const i = form.removed_images.indexOf(img)
  if (i === -1) form.removed_images.push(img)
  else form.removed_images.splice(i, 1)
}

const close = () => {
  if (form.processing) return
  emit('close')
}

const submit = () => {
  form.post(route('admin.pages.reviews.product.update', props.review.id), {
    preserveScroll: true,
    onSuccess: () => emit('close'),
  })
}
</script>

<style scoped>
.pr-modal-backdrop {
  position: fixed; inset: 0; z-index: 1060;
  background: rgba(44, 26, 14, .55);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.pr-modal {
  --rv-cream: #FAF5E9;
  --rv-cream-2: #EFE0BB;
  --rv-border: #EFE0BB;
  --rv-green: #252f17;
  --rv-green-dark: #1A2110;
  --rv-ink: #2C1A0E;
  --rv-body: #4B4033;
  --rv-muted: #7A5C3E;
  --rv-star: #F5A623;

  background: #fff; border-radius: 18px; width: 100%; max-width: 620px;
  max-height: 92vh; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 18px 48px rgba(44, 26, 14, .28);
}
.pr-modal-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 16px 20px; background: var(--rv-cream-2); border-bottom: 1px solid var(--rv-border); color: var(--rv-ink);
}
.pr-modal-sub { font-size: .78rem; color: var(--rv-muted); }
.pr-modal-close {
  border: 1px solid var(--rv-border); background: #fff; color: var(--rv-body);
  width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
}
.pr-modal-close:hover { background: var(--rv-cream); }
.pr-modal-body { padding: 20px; overflow-y: auto; }
.pr-modal-foot {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 14px 20px; border-top: 1px solid var(--rv-border); background: var(--rv-cream);
}

/* Status banner */
.pr-status {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  border-radius: 12px; padding: 12px 14px; margin-bottom: 18px; border: 1px solid transparent;
}
.pr-status.is-pending { background: #FFF6E5; border-color: #F3D9A6; }
.pr-status.is-active { background: #E9F4E4; border-color: #C2DFB4; }
.pr-status-title { font-weight: 700; font-size: .9rem; color: var(--rv-ink); }
.pr-status-hint { font-size: .75rem; color: var(--rv-muted); }

/* Shared form styling (mirrors the Reviews page) */
.rv-label { font-size: .8rem; font-weight: 600; color: var(--rv-body); margin-bottom: 5px; display: block; }
.rv-req { color: #C0392B; }
.rv-input { border: 1px solid var(--rv-border); border-radius: 10px; background: var(--rv-cream); font-size: .88rem; }
.rv-input:focus { border-color: var(--rv-green); box-shadow: 0 0 0 3px rgba(37, 47, 23, .12); background: #fff; }
.rv-hint { color: var(--rv-muted); font-size: .72rem; display: block; margin-top: 6px; }

.rv-star-input { display: flex; align-items: center; gap: 4px; }
.rv-star-btn { border: 0; background: transparent; padding: 0; cursor: pointer; line-height: 0; }
.rv-star-btn svg { fill: #E4D4C2; transition: fill .12s ease, transform .12s ease; }
.rv-star-btn.is-on svg { fill: var(--rv-star); }
.rv-star-btn:hover svg { transform: scale(1.12); }
.rv-star-caption { margin-left: 8px; font-size: .8rem; color: var(--rv-muted); font-weight: 600; }

.rv-switch { display: flex; align-items: center; cursor: pointer; }
.rv-switch input { display: none; }
.rv-switch-track { width: 44px; height: 24px; border-radius: 999px; background: #D9C7B2; position: relative; transition: background .2s; }
.rv-switch-track::after {
  content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
  background: #fff; border-radius: 50%; transition: transform .2s;
}
.rv-switch input:checked + .rv-switch-track { background: var(--rv-green); }
.rv-switch input:checked + .rv-switch-track::after { transform: translateX(20px); }

.rv-btn-primary {
  background: var(--rv-green); color: #fff; border: 0; border-radius: 10px; font-weight: 600; font-size: .88rem;
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px;
}
.rv-btn-primary:hover { background: var(--rv-green-dark); color: #fff; }
.rv-btn-ghost {
  background: #fff; color: var(--rv-body); border: 1px solid var(--rv-border); border-radius: 10px; font-weight: 600; font-size: .88rem; padding: 8px 16px;
}
.rv-btn-ghost:hover { background: var(--rv-cream); }

/* Image chips */
.pr-images { display: flex; flex-wrap: wrap; gap: 10px; }
.pr-image { position: relative; width: 84px; height: 84px; border-radius: 10px; overflow: hidden; border: 1px solid var(--rv-border); }
.pr-image img { width: 100%; height: 100%; object-fit: cover; }
.pr-image.is-removed img { opacity: .35; filter: grayscale(1); }
.pr-image-x {
  position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 6px;
  border: 0; background: rgba(44, 26, 14, .72); color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;
}
.pr-image-x:hover { background: #C0392B; }

@media (max-width: 575px) {
  .pr-modal { max-height: 96vh; border-radius: 14px; }
}
</style>
