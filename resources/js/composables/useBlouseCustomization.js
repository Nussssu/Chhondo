import { computed, ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'

/**
 * One product's settings: its own on/off, price and sleeve/size lists
 * (Admin › Products › Pricing & stock) over the shared ones — the same rule as
 * BlouseCustomization::applyProduct() on the server, which sets the price.
 */
export function blouseSettingsFor(shared, product) {
  const own = product?.custom_blouse
  if (!own || typeof own !== 'object') return shared
  const regular = Number(own.price) || 0
  const sale = Number(own.sale_price) || 0
  const listOr = (rows, fallback) => (Array.isArray(rows) && rows.length ? rows.map(row => ({ id: String(row.id), label: String(row.label), enabled: true })) : fallback)
  return {
    ...shared,
    enabled: !!shared.enabled && !!own.enabled,
    options: (shared.options || []).slice(0, 1).map(row => (regular > 0 || sale > 0
      ? { ...row, price: sale > 0 ? sale : regular, regular_price: sale > 0 && regular > sale ? regular : null }
      : row)),
    sleeves: listOr(own.sleeves, shared.sleeves || []),
    sizes: listOr(own.sizes, shared.sizes || []),
  }
}

export function useBlouseCustomization(legacyChoice, product = () => null) {
  const page = usePage()
  const settings = computed(() => blouseSettingsFor(page.props.blouseSettings || { enabled: false, options: [], sleeves: [], sizes: [] }, product()))
  const selection = ref(null)
  const picker = ref(null)
  const option = computed(() => settings.value.enabled && settings.value.options?.find(row => row.id === selection.value?.option_id && row.enabled !== false))
  const fee = computed(() => Number(option.value?.price) || 0)
  const snapshot = computed(() => option.value ? {
    ...selection.value, label: option.value.label, unit_price: fee.value,
    sleeve_label: settings.value.sleeves.find(row => row.id === selection.value.sleeve_type)?.label || '',
    size_label: settings.value.sizes.find(row => row.id === selection.value.size)?.label || '',
    sleeve_title: settings.value.sleeve_label, size_title: settings.value.size_label, requirements_title: settings.value.requirements_label,
    note: settings.value.note,
  } : null)
  watch(selection, value => {
    if (value?.option_id) legacyChoice.value = 'custom'
    else if (legacyChoice.value === 'custom') legacyChoice.value = 'without'
  })
  watch(legacyChoice, value => { if (value !== 'custom') selection.value = null })
  watch(option, value => { if (!value && selection.value) selection.value = null })
  return { settings, selection, picker, option, fee, snapshot, validate: () => picker.value?.validate() ?? true }
}
