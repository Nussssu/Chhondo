<script setup>
/**
 * Phone input with a country flag picker and real validation.
 *
 * Wraps intl-tel-input, which carries Google's libphonenumber rules, so a
 * number is checked against the selected country's actual numbering plan
 * rather than a length check. The bound value is always E.164
 * (+8801712345678) once the number is valid, which is the one format every
 * integration can be derived from.
 */
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import intlTelInput from "intl-tel-input"
import "intl-tel-input/styles"

const props = defineProps({
  modelValue: { type: String, default: "" },
  id: { type: String, default: "phone" },
  placeholder: { type: String, default: "01XXXXXXXXX" },
  invalid: { type: Boolean, default: false },
  // Only global (unscoped) classes reach the input — a parent's `scoped`
  // class cannot, because the input carries this component's scope id, not
  // the parent's. Forms style it with :deep(.iti__tel-input) instead.
  inputClass: { type: String, default: "" },
  // Most customers are local, so Bangladesh is preselected and listed first.
  defaultCountry: { type: String, default: "bd" },
})

const emit = defineEmits(["update:modelValue", "update:valid", "blur"])

const el = ref(null)
let iti = null
// Guards the watcher from reacting to the value we just emitted ourselves.
let syncing = false

/** Push the current state out: E.164 while valid, raw text while not. */
function sync() {
  if (!iti) return

  const valid = iti.isValidNumber() ?? false
  const value = valid ? iti.getNumber() : el.value.value

  syncing = true
  emit("update:valid", valid)
  emit("update:modelValue", value)
  // Cleared on the next tick so the watcher sees the settled value.
  Promise.resolve().then(() => { syncing = false })
}

onMounted(() => {
  iti = intlTelInput(el.value, {
    initialCountry: props.defaultCountry,
    countryOrder: [props.defaultCountry],
    // Keeps the dial code out of the text box, so a local number is typed the
    // way people actually write it.
    nationalMode: true,
    // Blocks characters that cannot appear in a number for the chosen country.
    strictMode: true,
    autoPlaceholder: "aggressive",
    placeholderNumberType: "MOBILE",
    // libphonenumber's rule tables are ~265KB — larger than the rest of this
    // page put together — and nothing needs them until someone starts typing.
    // Importing "intl-tel-input/intlTelInputWithUtils" baked them into the
    // main bundle, so every visitor to Checkout, Contact, Register and
    // Account paid for them up front. Vite gives this its own chunk, fetched
    // in the background once the field is on screen.
    loadUtils: () => import("intl-tel-input/utils"),
  })

  if (props.modelValue) iti.setNumber(props.modelValue)

  // Until the utils chunk lands, isValidNumber() cannot answer, so sync()
  // reports the field invalid and emits the raw text. Re-running it once the
  // rules are in hand settles the value for anyone who finished typing before
  // the download did — without this a fast typist on a slow connection could
  // submit "01712345678" where E.164 was expected.
  iti.promise.then(sync).catch(() => {})

  el.value.addEventListener("input", sync)
  el.value.addEventListener("countrychange", sync)
  el.value.addEventListener("blur", () => { sync(); emit("blur") })
})

onBeforeUnmount(() => {
  iti?.destroy()
  iti = null
})

// A form reset elsewhere has to clear the box too.
watch(
  () => props.modelValue,
  (value) => {
    if (syncing || !iti) return
    if (value !== iti.getNumber()) iti.setNumber(value || "")
  }
)
</script>

<template>
  <div class="phone-field" :class="{ 'is-invalid': invalid }">
    <input
      :id="id"
      ref="el"
      type="tel"
      autocomplete="tel"
      :placeholder="placeholder"
      class="iti__tel-input"
      :class="inputClass"
    />
    <!-- iti__tel-input is the library's own class, which it would add on
         init; forms style the field through it. Present from the start, the
         server-rendered field is styled before the library has loaded. -->
  </div>
</template>

<style scoped>
/* Structure only. The visual treatment — border, radius, background, focus —
   is supplied by the form the field sits in, so it matches its siblings
   exactly instead of being approximated here. */
.phone-field :deep(.iti) {
  display: block;
  width: 100%;
}

/* The library measures this input's padding-left at init and rewrites it
   inline to clear the flag button, so nothing here may set it. */
.phone-field :deep(.iti__tel-input) {
  width: 100%;
  font: inherit;
}

.phone-field :deep(.iti__country-container) {
  /* Sits over the input; keep it clear of a focus ring drawn on the input. */
  z-index: 2;
}

.phone-field :deep(.iti__dropdown-content) {
  font-family: inherit;
  text-align: left;
}
</style>
