<script setup>
import ClientOnly from "@/components/ClientOnly.vue"
import { computed, onBeforeUnmount, ref, watch } from "vue"

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array,
    default: () => [],
  },
  startIndex: {
    type: Number,
    default: 0,
  },
  alt: {
    type: String,
    default: "Customer photo",
  },
})

const emit = defineEmits(["close"])

const current = ref(0)

const total = computed(() => props.images.length)
const currentImage = computed(() => props.images[current.value] || null)

const close = () => emit("close")

const next = () => {
  if (total.value < 2) return
  current.value = (current.value + 1) % total.value
}

const prev = () => {
  if (total.value < 2) return
  current.value = (current.value - 1 + total.value) % total.value
}

const onKeydown = (event) => {
  if (event.key === "Escape") close()
  else if (event.key === "ArrowRight") next()
  else if (event.key === "ArrowLeft") prev()
}

// Swipe support on touch devices
const touchStartX = ref(0)

const onTouchStart = (event) => {
  touchStartX.value = event.changedTouches[0].clientX
}

const onTouchEnd = (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(delta) < 45) return
  delta < 0 ? next() : prev()
}

const teardown = () => {
  if (typeof document === "undefined") return
  document.body.style.overflow = ""
  document.removeEventListener("keydown", onKeydown)
}

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document === "undefined") return

    if (open) {
      current.value = Math.min(Math.max(props.startIndex, 0), Math.max(total.value - 1, 0))
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", onKeydown)
    } else {
      teardown()
    }
  }
)

onBeforeUnmount(teardown)
</script>

<template>
  <ClientOnly><Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen && currentImage"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        @click.self="close"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <button type="button" class="lightbox-close" aria-label="Close" @click="close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
          v-if="total > 1"
          type="button"
          class="lightbox-nav lightbox-nav--prev"
          aria-label="Previous image"
          @click.stop="prev"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <figure class="lightbox-stage" @click.self="close">
          <img :src="currentImage" :alt="alt" class="lightbox-image" />
        </figure>

        <button
          v-if="total > 1"
          type="button"
          class="lightbox-nav lightbox-nav--next"
          aria-label="Next image"
          @click.stop="next"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div v-if="total > 1" class="lightbox-footer" @click.stop>
          <div class="lightbox-thumbs">
            <button
              v-for="(img, i) in images"
              :key="i"
              type="button"
              class="lightbox-thumb"
              :class="{ 'is-active': i === current }"
              :aria-label="`View image ${i + 1}`"
              @click="current = i"
            >
              <img :src="img" :alt="`${alt} ${i + 1}`" loading="lazy" />
            </button>
          </div>
          <p class="lightbox-counter">{{ current + 1 }} / {{ total }}</p>
        </div>
      </div>
    </Transition>
  </Teleport></ClientOnly>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 16px 24px;
  background: rgba(24, 13, 5, 0.9);
  backdrop-filter: blur(2px);
}

.lightbox-stage {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.lightbox-close,
.lightbox-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lightbox-close:hover,
.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.24);
}

.lightbox-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
}

.lightbox-nav {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.lightbox-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lightbox-thumbs {
  display: flex;
  gap: 8px;
  max-width: min(100%, 560px);
  overflow-x: auto;
  padding: 4px;
}

.lightbox-thumb {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: none;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.lightbox-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-thumb.is-active,
.lightbox-thumb:hover {
  opacity: 1;
  border-color: #e9c39c;
}

.lightbox-counter {
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 640px) {
  .lightbox {
    padding: 56px 8px 16px;
  }

  .lightbox-nav {
    width: 36px;
    height: 36px;
  }
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
