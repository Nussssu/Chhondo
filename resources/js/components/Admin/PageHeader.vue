<script setup>
/**
 * Every admin page starts with one of these, so page titles and
 * the primary action always land in the same place.
 */
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  // [{ label, href }] — the last entry renders as the current page.
  breadcrumbs: { type: Array, default: () => [] },
})
</script>

<template>
  <header class="ph">
    <nav v-if="breadcrumbs.length" class="ph-crumbs" aria-label="Breadcrumb">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <a v-if="crumb.href && i < breadcrumbs.length - 1" :href="crumb.href" class="ph-crumb">{{ crumb.label }}</a>
        <span v-else class="ph-crumb is-current" aria-current="page">{{ crumb.label }}</span>
        <span v-if="i < breadcrumbs.length - 1" class="ph-crumb-sep" aria-hidden="true">/</span>
      </template>
    </nav>

    <div class="ph-row">
      <div class="ph-text">
        <h1 class="ph-title"><slot name="title">{{ title }}</slot></h1>
      </div>
      <div v-if="$slots.actions" class="ph-actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.ph {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-5);
}

.ph-crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.ph-crumb { color: var(--text-muted); text-decoration: none; }
.ph-crumb:hover { color: var(--admin-green-600); text-decoration: underline; }
.ph-crumb.is-current { color: var(--text); font-weight: 500; }
.ph-crumb-sep { color: var(--text-faint); }

.ph-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  flex-wrap: wrap;
}

.ph-text { min-width: 0; }

.ph-title {
  margin: 0;
  font-size: var(--fs-xl);
  line-height: var(--lh-tight);
  font-weight: 600;
  color: var(--text);
}

.ph-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
  flex-wrap: wrap;
}
</style>
