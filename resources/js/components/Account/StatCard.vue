<template>
  <div class="stat-card">
    <p class="stat-card-value">{{ value }}</p>
    <p class="stat-card-label">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [Number, String], required: true },
  label: { type: String, required: true },
});
</script>

<style scoped>
.stat-card {
  flex: 1;
  min-width: 0;
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-card-value {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  color: #2d4a2d;
  text-align: center;
  width: 100%;
}

.stat-card-label {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #7a5c3e;
  text-align: center;
  width: 100%;
}

/* Three across on a phone, so the type has to come down with them. */
@media (max-width: 640px) {
  .stat-card {
    padding: 12px 6px;
    border-radius: 12px;
  }

  .stat-card-value {
    font-size: 20px;
    line-height: 26px;
  }

  .stat-card-label {
    font-size: 11px;
    line-height: 15px;
  }
}
</style>