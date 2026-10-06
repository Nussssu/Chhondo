<template>
  <div v-if="variant === 'vertical'" class="vertical-stepper">
    <div
      v-for="(step, index) in verticalSteps"
      :key="step.key"
      class="vertical-step"
      :class="{
        'is-done': index <= currentStepIndex,
        'is-current': index === currentStepIndex,
      }"
    >
      <div class="vertical-marker">
        <span class="vertical-circle"><img :src="step.icon" alt="" /></span>
        <span v-if="index < verticalSteps.length - 1" class="vertical-line" />
      </div>
      <div class="vertical-copy">
        <p class="vertical-title">{{ step.label }}</p>
        <p class="vertical-date">{{ index <= currentStepIndex ? stepDate(index) : 'Pending' }}</p>
        <span v-if="index === currentStepIndex" class="current-status">
          <span class="current-status-dot" />Current status
        </span>
      </div>
    </div>
  </div>

  <div v-else class="stepper">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="stepper-step"
      :class="{ 'is-done': index <= currentStepIndex }"
    >
      <span class="stepper-circle">
        <!-- Order Placed -->
        <svg v-if="index === 0" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 12.8333C10.2217 12.8333 12.8333 10.2217 12.8333 7C12.8333 3.77834 10.2217 1.16667 7 1.16667C3.77834 1.16667 1.16667 3.77834 1.16667 7C1.16667 10.2217 3.77834 12.8333 7 12.8333Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 7.58333C7.32217 7.58333 7.58333 7.32217 7.58333 7C7.58333 6.67783 7.32217 6.41667 7 6.41667C6.67783 6.41667 6.41667 6.67783 6.41667 7C6.41667 7.32217 6.67783 7.58333 7 7.58333Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Processing -->
        <svg v-else-if="index === 1" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.41667 12.6758C6.59402 12.7782 6.79521 12.8321 7 12.8321C7.20479 12.8321 7.40598 12.7782 7.58333 12.6758L11.6667 10.3425C11.8438 10.2402 11.991 10.0931 12.0934 9.91599C12.1958 9.73886 12.2498 9.53792 12.25 9.33333V4.66667C12.2498 4.46208 12.1958 4.26114 12.0934 4.08401C11.991 3.90688 11.8438 3.7598 11.6667 3.6575L7.58333 1.32417C7.40598 1.22177 7.20479 1.16786 7 1.16786C6.79521 1.16786 6.59402 1.22177 6.41667 1.32417L2.33333 3.6575C2.15615 3.7598 2.00899 3.90688 1.9066 4.08401C1.80422 4.26114 1.75021 4.46208 1.75 4.66667V9.33333C1.75021 9.53792 1.80422 9.73886 1.9066 9.91599C2.00899 10.0931 2.15615 10.2402 2.33333 10.3425L6.41667 12.6758Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 12.8333V7" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.91917 4.08333L7 7L12.0808 4.08333" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.375 2.49083L9.625 5.495" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Shipped -->
        <svg v-else-if="index === 2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.16667 10.5V3.5C8.16667 3.19058 8.04375 2.89383 7.82496 2.67504C7.60617 2.45625 7.30942 2.33333 7 2.33333H2.33333C2.02391 2.33333 1.72717 2.45625 1.50838 2.67504C1.28958 2.89383 1.16667 3.19058 1.16667 3.5V9.91667C1.16667 10.0714 1.22812 10.2197 1.33752 10.3291C1.44692 10.4385 1.59529 10.5 1.75 10.5H2.91667" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.75 10.5H5.25" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.0833 10.5H12.25C12.4047 10.5 12.5531 10.4385 12.6625 10.3291C12.7719 10.2197 12.8333 10.0714 12.8333 9.91667V7.7875C12.8331 7.65512 12.7878 7.52676 12.705 7.4235L10.675 4.886C10.6204 4.81768 10.5512 4.7625 10.4725 4.72453C10.3937 4.68657 10.3074 4.66679 10.22 4.66667H8.16667" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.91667 11.6667C10.561 11.6667 11.0833 11.1443 11.0833 10.5C11.0833 9.85567 10.561 9.33333 9.91667 9.33333C9.27233 9.33333 8.75 9.85567 8.75 10.5C8.75 11.1443 9.27233 11.6667 9.91667 11.6667Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.08333 11.6667C4.72767 11.6667 5.25 11.1443 5.25 10.5C5.25 9.85567 4.72767 9.33333 4.08333 9.33333C3.439 9.33333 2.91667 9.85567 2.91667 10.5C2.91667 11.1443 3.439 11.6667 4.08333 11.6667Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Out for Delivery -->
        <svg v-else-if="index === 3" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7917 12.25C11.9192 12.25 12.8333 11.3359 12.8333 10.2083C12.8333 9.08075 11.9192 8.16667 10.7917 8.16667C9.66409 8.16667 8.75 9.08075 8.75 10.2083C8.75 11.3359 9.66409 12.25 10.7917 12.25Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.20833 12.25C4.33591 12.25 5.25 11.3359 5.25 10.2083C5.25 9.08075 4.33591 8.16667 3.20833 8.16667C2.08075 8.16667 1.16667 9.08075 1.16667 10.2083C1.16667 11.3359 2.08075 12.25 3.20833 12.25Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.75 3.5C9.07217 3.5 9.33333 3.23883 9.33333 2.91667C9.33333 2.5945 9.07217 2.33333 8.75 2.33333C8.42783 2.33333 8.16667 2.5945 8.16667 2.91667C8.16667 3.23883 8.42783 3.5 8.75 3.5Z" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 10.2083V8.16667L5.25 6.41667L7.58333 4.66667L8.75 6.41667H9.91667" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Delivered -->
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.33333 9.33333L10.5 10.5L12.8333 8.16667" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.25 5.83333V4.66667C12.2498 4.46208 12.1958 4.26114 12.0934 4.08401C11.991 3.90688 11.8438 3.7598 11.6667 3.6575L7.58333 1.32417C7.40598 1.22177 7.20479 1.16786 7 1.16786C6.79521 1.16786 6.59402 1.22177 6.41667 1.32417L2.33333 3.6575C2.15615 3.7598 2.00899 3.90688 1.9066 4.08401C1.80422 4.26114 1.75021 4.46208 1.75 4.66667V9.33333C1.75021 9.53792 1.80422 9.73886 1.9066 9.91599C2.00899 10.0931 2.15615 10.2402 2.33333 10.3425L6.41667 12.6758C6.59402 12.7782 6.79521 12.8321 7 12.8321C7.20479 12.8321 7.40598 12.7782 7.58333 12.6758L8.75 12.0108" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.375 2.49083L9.625 5.495" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.91917 4.08333L7 7L12.0808 4.08333" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 12.8333V7" stroke="currentColor" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="stepper-label">{{ step.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { TRACKER_STEPS } from '@/utils/orderStatus';

const props = defineProps({
  currentStepIndex: { type: Number, required: true },
  variant: { type: String, default: 'horizontal' },
  placedAt: { type: String, default: '' },
  updatedAt: { type: String, default: '' },
});

const steps = TRACKER_STEPS;
const icons = [
  '/assets/images/account/track-step-placed.svg',
  '/assets/images/account/track-step-processing.svg',
  '/assets/images/account/track-step-shipped.svg',
  '/assets/images/account/track-step-transit.svg',
  '/assets/images/account/track-step-delivered.svg',
];
const verticalSteps = TRACKER_STEPS.map((step, index) => ({ ...step, icon: icons[index] }));

const formatStepDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const datePart = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
  const timePart = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return `${datePart} · ${timePart}`;
};

const stepDate = (index) => formatStepDate(index === 0 ? props.placedAt : (props.updatedAt || props.placedAt));
</script>

<style scoped>
.vertical-stepper {
  display: flex;
  flex-direction: column;
}

.vertical-step {
  display: flex;
  gap: 16px;
  min-height: 76px;
}

.vertical-step.is-current {
  min-height: 96px;
}

.vertical-step:last-child {
  min-height: 40px;
}

.vertical-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  flex: 0 0 40px;
}

.vertical-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #efe0bb;
  flex: 0 0 40px;
}

.vertical-circle img {
  display: block;
}

.vertical-step.is-done .vertical-circle {
  background: #252f17;
}

.vertical-line {
  width: 2px;
  min-height: 36px;
  background: #cc9b25;
  flex: 1 1 auto;
}

.vertical-step.is-done:not(.is-current) .vertical-line {
  background: #596548;
}

.vertical-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 4px;
}

.vertical-title,
.vertical-date {
  margin: 0;
}

.vertical-title {
  font: 600 12px/20px "Li Ador Noirrit", sans-serif;
  color: #705514;
}

.vertical-step.is-done .vertical-title {
  color: #1a1817;
}

.vertical-date {
  font: 400 12px/20px "Poppins", sans-serif;
  color: #cc9b25;
}

.current-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 24px;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: #4c5441;
  font: 500 10px/20px "Poppins", sans-serif;
  color: #fff;
}

.current-status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
}

.stepper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.stepper-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

/* Connector line: spans from this column's own center back to the
   previous column's center, so it always lines up with both circles
   regardless of the row's actual width. */
.stepper-step:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 16px;
  right: 50%;
  width: 100%;
  height: 2px;
  background: #e8d4b0;
  z-index: 0;
}

.stepper-step.is-done:not(:first-child)::before {
  background: #2d4a2d;
}

.stepper-circle {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #efe5d0;
  border: 2px solid #e8d4b0;
  color: #7a5c3e;
}

.stepper-step.is-done .stepper-circle {
  background: #2d4a2d;
  border-color: #2d4a2d;
  color: #fff;
}

.stepper-label {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  color: #7a5c3e;
  text-align: center;
  max-width: 72px;
}

.stepper-step.is-done .stepper-label {
  font-weight: 600;
  color: #2d4a2d;
}
</style>
