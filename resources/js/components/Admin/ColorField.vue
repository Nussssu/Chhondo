<script setup>
import { computed, ref } from 'vue'

/**
 * Colour input for the settings forms.
 *
 * The surrounding form is a plain HTML POST, not an Inertia form, so the value
 * has to reach the server as a real named field. The swatch itself is the
 * native <input type="color"> carrying `name` — restyled, never replaced — so
 * the OS picker and the form submission both keep working. The hex box and the
 * presets are conveniences layered on top; neither is submitted.
 */
const props = defineProps({
  label: { type: String, required: true },
  name: { type: String, required: true },
  modelValue: { type: String, default: '' },
  fallback: { type: String, default: '#356019' },
  presets: {
    type: Array,
    default: () => ['#356019', '#80532E', '#d89b02', '#ff004c', '#0052bd', '#00c220', '#000000', '#ffffff'],
  },
})

const id = `color-${props.name}`

// An empty column means "never set" — show the fallback rather than black,
// which is what an empty type=color would otherwise render.
const color = ref(normalise(props.modelValue) || props.fallback)
const hexDraft = ref(color.value)

function normalise(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const withHash = raw.startsWith('#') ? raw : `#${raw}`
  // Expand shorthand (#abc) so the native input accepts it.
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(withHash)
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase()
  return /^#[0-9a-f]{6}$/i.test(withHash) ? withHash.toLowerCase() : ''
}

function pick(value) {
  color.value = value
  hexDraft.value = value
}

/** Typing is free-form; only a valid hex is committed to the swatch. */
function onHexInput() {
  const valid = normalise(hexDraft.value)
  if (valid) color.value = valid
}

/** Leaving the box discards anything that never became a colour. */
function onHexBlur() {
  hexDraft.value = color.value
}

const isActive = (preset) => preset.toLowerCase() === color.value.toLowerCase()

// White-on-white needs a visible edge.
const swatchNeedsRing = computed(() => ['#ffffff', '#fffffe'].includes(color.value.toLowerCase()))
</script>

<template>
  <div class="cf">
    <label :for="id" class="form-label">{{ label }}</label>

    <div class="cf-row">
      <span class="cf-swatch" :class="{ 'cf-swatch--ring': swatchNeedsRing }" :style="{ background: color }">
        <input
          :id="id"
          :name="name"
          v-model="color"
          type="color"
          class="cf-native"
          @input="hexDraft = color"
        />
      </span>

      <input
        v-model="hexDraft"
        type="text"
        class="form-control cf-hex"
        spellcheck="false"
        autocomplete="off"
        maxlength="7"
        aria-label="Hex colour value"
        @input="onHexInput"
        @blur="onHexBlur"
      />
    </div>

    <div class="cf-presets">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        class="cf-preset"
        :class="{ 'cf-preset--on': isActive(preset) }"
        :style="{ background: preset }"
        :title="preset"
        :aria-label="preset"
        @click="pick(preset)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.cf-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* The swatch is the picker: the native input sits on top, invisible but
   clickable, so the browser's own colour UI still opens. */
.cf-swatch {
  position: relative;
  flex: 0 0 auto;
  width: 42px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.cf-swatch:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}

.cf-swatch--ring {
  border-color: rgba(0, 0, 0, 0.32);
}

.cf-swatch:focus-within {
  outline: 2px solid var(--color-theme, #356019);
  outline-offset: 2px;
}

.cf-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;
}

.cf-hex {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  text-transform: lowercase;
  max-width: 130px;
}

.cf-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.cf-preset {
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform 0.12s ease;
}

.cf-preset:hover {
  transform: scale(1.15);
}

.cf-preset--on {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-theme, #356019);
}
</style>
