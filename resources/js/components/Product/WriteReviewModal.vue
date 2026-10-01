<script setup>
import { ref, computed, watch } from "vue"
import { router } from "@inertiajs/vue3"
import { toast } from "@steveyuowo/vue-hot-toast"

const props = defineProps({
  isOpen: Boolean,
  product: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(["close"])

const MAX_REVIEW_LENGTH = 500
const MAX_IMAGES = 5

const rating = ref(0)
const hoverRating = ref(0)
const name = ref("")
const contact = ref("")
const reviewText = ref("")
const images = ref([]) // File[]
const imagePreviews = ref([]) // object URLs
const submitting = ref(false)
const errors = ref({})

const reviewLength = computed(() => reviewText.value.length)

const resetForm = () => {
  rating.value = 0
  hoverRating.value = 0
  name.value = ""
  contact.value = ""
  reviewText.value = ""
  images.value = []
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url))
  imagePreviews.value = []
  errors.value = {}
}

const closeModal = () => {
  emit("close")
}

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = open ? "hidden" : ""
    }
    if (!open) resetForm()
  }
)

const setRating = (value) => {
  rating.value = value
}

const fileInput = ref(null)

const openFilePicker = () => {
  fileInput.value?.click()
}

const handleFiles = (event) => {
  const files = Array.from(event.target.files || [])
  const remaining = MAX_IMAGES - images.value.length
  const accepted = files.slice(0, remaining)

  accepted.forEach((file) => {
    images.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  })

  event.target.value = ""
}

const removeImage = (index) => {
  URL.revokeObjectURL(imagePreviews.value[index])
  images.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

const validate = () => {
  const e = {}
  if (rating.value < 1) e.rating = "একটি রেটিং দিন"
  if (!name.value.trim()) e.name = "আপনার নাম দিন"
  if (!contact.value.trim()) e.contact = "ইমেইল অথবা ফোন নম্বর দিন"
  if (!reviewText.value.trim()) e.review = "রিভিউ লিখুন"
  errors.value = e
  return Object.keys(e).length === 0
}

const submitReview = () => {
  if (!props.product?.slug || submitting.value) return
  if (!validate()) return

  submitting.value = true

  const formData = new FormData()
  formData.append("name", name.value.trim())
  formData.append("contact", contact.value.trim())
  formData.append("rating", rating.value)
  formData.append("review", reviewText.value.trim())
  images.value.forEach((file) => formData.append("images[]", file))

  router.post(`/product/${props.product.slug}/reviews`, formData, {
    forceFormData: true,
    preserveScroll: true,
    onSuccess: () => {
      closeModal()
    },
    onError: (serverErrors) => {
      errors.value = { ...errors.value, ...serverErrors }
      toast.error("দুঃখিত, রিভিউ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।")
    },
    onFinish: () => {
      submitting.value = false
    },
  })
}
</script>

<template>
  <transition name="review-modal-fade">
    <div v-if="isOpen" class="review-modal-overlay" @click.self="closeModal">
      <div class="review-modal">
        <!-- Header -->
        <div class="review-modal-header">
          <div>
            <h2 class="review-modal-title">Write a Review</h2>
            <p v-if="product" class="review-modal-subtitle">
              for <span class="review-modal-product-name">{{ product.product_name }}</span>
            </p>
          </div>
          <button type="button" class="review-modal-close" @click="closeModal" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="review-modal-body">
          <form class="flex flex-col gap-4" @submit.prevent="submitReview">
            <!-- Overall Rating -->
            <div>
              <label class="review-label">Overall Rating <span class="review-required">*</span></label>
              <div class="flex gap-2 mt-2">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  class="review-star-btn"
                  @click="setRating(n)"
                  @mouseenter="hoverRating = n"
                  @mouseleave="hoverRating = 0"
                  :aria-label="`${n} star`"
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    :fill="n <= (hoverRating || rating) ? '#b47f54' : 'none'"
                    stroke="#b47f54"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.rating" class="review-error">{{ errors.rating }}</p>
            </div>

            <!-- Name + Contact -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="review-label">Your Name <span class="review-required">*</span></label>
                <input v-model="name" type="text" class="review-field mt-1.5" placeholder="" />
                <p v-if="errors.name" class="review-error">{{ errors.name }}</p>
              </div>
              <div>
                <label class="review-label">Email Address or Phone number <span class="review-required">*</span></label>
                <input v-model="contact" type="text" class="review-field mt-1.5" placeholder="" />
                <p class="review-hint">Not shown publicly</p>
                <p v-if="errors.contact" class="review-error">{{ errors.contact }}</p>
              </div>
            </div>

            <!-- Review text -->
            <div>
              <div class="flex items-center justify-between">
                <label class="review-label">Your Review <span class="review-required">*</span></label>
                <span class="review-counter">{{ reviewLength }} / {{ MAX_REVIEW_LENGTH }}</span>
              </div>
              <textarea
                v-model="reviewText"
                :maxlength="MAX_REVIEW_LENGTH"
                rows="4"
                class="review-field review-textarea mt-1.5"
              ></textarea>
              <p v-if="errors.review" class="review-error">{{ errors.review }}</p>
            </div>

            <!-- Photo upload -->
            <div>
              <label class="review-label">Add Photo</label>
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                class="hidden"
                @change="handleFiles"
              />
              <button
                type="button"
                class="review-upload-box mt-1.5"
                :class="{ 'is-disabled': images.length >= MAX_IMAGES }"
                :disabled="images.length >= MAX_IMAGES"
                @click="openFilePicker"
              >
                <span class="review-upload-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E711D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </span>
                <span class="text-left">
                  <span class="review-upload-title">Upload photos (Max 5 images)</span>
                  <span class="review-upload-subtitle">JPG or PNG, up to 5 MB</span>
                </span>
              </button>

              <div v-if="imagePreviews.length > 0" class="flex flex-wrap gap-2 mt-3">
                <div v-for="(src, i) in imagePreviews" :key="i" class="review-thumb">
                  <img :src="src" alt="" />
                  <button type="button" class="review-thumb-remove" @click="removeImage(i)" aria-label="Remove image">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="review-modal-footer">
          <button type="button" class="review-submit-btn" :disabled="submitting" @click="submitReview">
            {{ submitting ? 'Submitting...' : 'Submit Review' }}
          </button>
          <p class="review-footer-note">
            By submitting you agree to our <span class="review-footer-link">review guidelines</span>.<br />
            Your email or mobile number will never be shared.
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Overlay */
.review-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(28, 16, 6, 0.55);
}

.review-modal {
  width: 640px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background-color: #fffaf4;
  border-radius: 24px;
  box-shadow: 0 -8px 60px 0 rgba(28, 16, 6, 0.18);
}

/* Header */
.review-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 17px;
  border-bottom: 1px solid rgba(44, 26, 14, 0.12);
}

.review-modal-title {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  color: #2c1a0e;
}

@media (min-width: 640px) {
  .review-modal-title {
    font-size: 24px;
  }
}

.review-modal-subtitle {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  color: #7a5c3e;
  margin-top: 2px;
}

.review-modal-product-name {
  color: #2d4a2d;
}

.review-modal-close {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #efe5d0;
  border: 1px solid rgba(44, 26, 14, 0.12);
  border-radius: 9999px;
  color: #2c1a0e;
  cursor: pointer;
  margin-top: 4px;
  transition: background-color 0.2s ease;
}

.review-modal-close:hover {
  background-color: #e5d9bf;
}

/* Body */
.review-modal-body {
  background-color: #fff;
  padding: 24px;
}

.review-label {
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #1a1817;
}

.review-required {
  color: #b47f54;
}

.review-hint {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #7a5c3e;
  margin-top: 6px;
}

.review-counter {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #7a5c3e;
}

.review-error {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #dc2626;
  margin-top: 4px;
}

.review-star-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 0;
  transition: transform 0.15s ease;
}

.review-star-btn:hover {
  transform: scale(1.08);
}

/* Fields */
.review-field {
  display: block;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background-color: #fffaf4;
  border: 1px solid #fff0df;
  border-radius: 8px;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 15px;
  color: #1a1817;
  transition: border-color 0.2s ease;
}

.review-field:focus {
  outline: none;
  border-color: #3e711d;
}

.review-textarea {
  height: auto;
  min-height: 102px;
  padding: 14px 16px;
  resize: vertical;
}

/* Upload box */
.review-upload-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  background-color: #fffaf4;
  border: 2px dashed #f7e2cb;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.review-upload-box:hover:not(.is-disabled) {
  border-color: #e9c39c;
  background-color: #fff6ea;
}

.review-upload-box.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.review-upload-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf1e8;
  border-radius: 10px;
}

.review-upload-title {
  display: block;
  font-family: "Poppins", "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #1a1817;
}

.review-upload-subtitle {
  display: block;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #7a5c3e;
}

/* Thumbnails */
.review-thumb {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f7e2cb;
}

.review-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-thumb-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

/* Footer */
.review-modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 25px 24px 24px;
  background-color: #fffaf4;
  border-top: 1px solid rgba(44, 26, 14, 0.12);
}

.review-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  padding: 0 24px;
  background-color: #356019;
  color: #fff;
  font-family: "Manrope", "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

@media (min-width: 640px) {
  .review-submit-btn {
    font-size: 20px;
  }
}

.review-submit-btn:hover:not(:disabled) {
  background-color: #2a4d14;
}

.review-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.review-footer-note {
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #643c17;
  text-align: center;
}

@media (min-width: 640px) {
  .review-footer-note {
    font-size: 14px;
  }
}

.review-footer-link {
  color: #3e711d;
}

/* Transition */
.review-modal-fade-enter-active {
  transition: opacity 0.25s ease;
}
.review-modal-fade-enter-active .review-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.review-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.review-modal-fade-leave-active .review-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.review-modal-fade-enter-from {
  opacity: 0;
}
.review-modal-fade-enter-from .review-modal {
  transform: scale(0.96);
  opacity: 0;
}
.review-modal-fade-leave-to {
  opacity: 0;
}
.review-modal-fade-leave-to .review-modal {
  transform: scale(0.96);
  opacity: 0;
}
</style>
