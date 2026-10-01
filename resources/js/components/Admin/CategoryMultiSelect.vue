<script setup>
/**
 * Files a product under any number of categories.
 *
 * The product forms post as ordinary HTML forms rather than through Inertia,
 * so the selection is mirrored into hidden `category_ids[]` inputs — the order
 * of those inputs is meaningful: the first is the primary category, which is
 * what the product page and the POS name the product by.
 */
import { computed, ref } from 'vue'
import { Check, Search, Star, X } from 'lucide-vue-next'

const props = defineProps({
  // [{ id, name }]
  categories: { type: Array, default: () => [] },
  // Ids already chosen, primary first.
  modelValue: { type: Array, default: () => [] },
  name: { type: String, default: 'category_ids' },
  // Marks the field required in the UI; validation stays server-side.
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const selected = ref(props.modelValue.map(Number).filter(Boolean))

const byId = computed(
  () => new Map(props.categories.map((c) => [Number(c.id), c]))
)

/** The chosen categories in their stored order, so the primary reads first. */
const chosen = computed(() =>
  selected.value.map((id) => byId.value.get(id)).filter(Boolean)
)

const matches = computed(() => {
  const term = search.value.trim().toLowerCase()

  return props.categories.filter(
    (c) => !term || String(c.name ?? '').toLowerCase().includes(term)
  )
})

const isSelected = (id) => selected.value.includes(Number(id))

function commit(ids) {
  selected.value = ids
  emit('update:modelValue', ids)
}

function toggle(id) {
  const value = Number(id)

  commit(
    isSelected(value)
      ? selected.value.filter((i) => i !== value)
      : [...selected.value, value]
  )
}

/**
 * Promote a category to primary.
 *
 * Position is the only thing that marks it, so this is a move to the front
 * rather than a flag — nothing else has to be kept in step.
 */
function makePrimary(id) {
  const value = Number(id)
  commit([value, ...selected.value.filter((i) => i !== value)])
}
</script>

<template>
  <div class="cms">
    <!-- What the server reads. Order carries the primary category. -->
    <input v-for="id in selected" :key="id" type="hidden" :name="`${name}[]`" :value="id" />

    <div v-if="chosen.length" class="cms-chips">
      <span v-for="(item, i) in chosen" :key="item.id" class="cms-chip" :class="{ 'is-primary': i === 0 }">
        <button
          v-if="i !== 0"
          type="button"
          class="cms-chip-star"
          title="Make this the primary category"
          @click="makePrimary(item.id)"
        >
          <Star :size="12" />
        </button>
        <span v-else class="cms-chip-badge" title="Named on the product page and the POS">Primary</span>

        {{ item.name }}

        <button type="button" class="cms-chip-x" :title="`Remove ${item.name}`" @click="toggle(item.id)">
          <X :size="12" />
        </button>
      </span>
    </div>

    <p v-else class="cms-empty">
      No category chosen{{ required ? ' — a product needs at least one' : '' }}.
    </p>

    <div class="cms-search">
      <Search :size="14" class="cms-search-icon" />
      <input v-model="search" type="search" class="form-control" placeholder="Search categories…" />
    </div>

    <div class="cms-list">
      <button
        v-for="item in matches"
        :key="item.id"
        type="button"
        class="cms-option"
        :class="{ 'is-on': isSelected(item.id) }"
        @click="toggle(item.id)"
      >
        <span class="cms-box"><Check v-if="isSelected(item.id)" :size="12" /></span>
        <span class="cms-name">{{ item.name }}</span>
      </button>

      <p v-if="!matches.length" class="cms-none">No category matches “{{ search }}”.</p>
    </div>

    <small class="text-muted d-block mt-2">
      A product can sit in several categories and appears in every one of them.
      The first is the primary category — the one the product page names.
    </small>
  </div>
</template>

<style scoped>
.cms-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.cms-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: 4px 6px 4px 8px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-full);
  background: var(--surface-sunk);
  font-size: var(--fs-sm);
  color: var(--text);
}

.cms-chip.is-primary {
  border-color: var(--bs-primary, #356019);
  background: color-mix(in srgb, var(--bs-primary, #356019) 8%, #fff);
}

.cms-chip-badge {
  padding: 1px 6px;
  border-radius: var(--r-full);
  background: var(--bs-primary, #356019);
  color: #fff;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.cms-chip-star,
.cms-chip-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: var(--r-full);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.cms-chip-star:hover { color: var(--bs-primary, #356019); }
.cms-chip-x:hover { color: var(--st-danger); background: var(--st-danger-soft); }

.cms-empty {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.cms-search { position: relative; }

.cms-search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--text-faint);
  pointer-events: none;
}

.cms-search .form-control { padding-left: 30px; }

.cms-list {
  max-height: 220px;
  margin-top: var(--sp-2);
  overflow-y: auto;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
}

.cms-option {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  font-size: var(--fs-md);
  color: var(--text);
  cursor: pointer;
}

.cms-option:last-child { border-bottom: 0; }
.cms-option:hover { background: var(--surface-sunk); }

.cms-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  background: var(--surface);
  color: #fff;
}

.cms-option.is-on .cms-box {
  border-color: var(--bs-primary, #356019);
  background: var(--bs-primary, #356019);
}

.cms-name { min-width: 0; }

.cms-none {
  margin: 0;
  padding: var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
</style>
