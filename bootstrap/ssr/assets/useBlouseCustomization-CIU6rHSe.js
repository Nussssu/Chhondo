import { l as vue_exports, o as usePage } from "../ssr.js";
//#region resources/js/composables/useBlouseCustomization.js
/**
* One product's settings: its own on/off, price and sleeve/size lists
* (Admin › Products › Pricing & stock) over the shared ones — the same rule as
* BlouseCustomization::applyProduct() on the server, which sets the price.
*/
function blouseSettingsFor(shared, product) {
	const own = product?.custom_blouse;
	if (!own || typeof own !== "object") return shared;
	const regular = Number(own.price) || 0;
	const sale = Number(own.sale_price) || 0;
	const listOr = (rows, fallback) => Array.isArray(rows) && rows.length ? rows.map((row) => ({
		id: String(row.id),
		label: String(row.label),
		enabled: true
	})) : fallback;
	return {
		...shared,
		enabled: !!shared.enabled && !!own.enabled,
		options: (shared.options || []).slice(0, 1).map((row) => regular > 0 || sale > 0 ? {
			...row,
			price: sale > 0 ? sale : regular,
			regular_price: sale > 0 && regular > sale ? regular : null
		} : row),
		sleeves: listOr(own.sleeves, shared.sleeves || []),
		sizes: listOr(own.sizes, shared.sizes || [])
	};
}
function useBlouseCustomization(legacyChoice, product = () => null) {
	const page = usePage();
	const settings = (0, vue_exports.computed)(() => blouseSettingsFor(page.props.blouseSettings || {
		enabled: false,
		options: [],
		sleeves: [],
		sizes: []
	}, product()));
	const selection = (0, vue_exports.ref)(null);
	const picker = (0, vue_exports.ref)(null);
	const option = (0, vue_exports.computed)(() => settings.value.enabled && settings.value.options?.find((row) => row.id === selection.value?.option_id && row.enabled !== false));
	const fee = (0, vue_exports.computed)(() => Number(option.value?.price) || 0);
	const snapshot = (0, vue_exports.computed)(() => option.value ? {
		...selection.value,
		label: option.value.label,
		unit_price: fee.value,
		sleeve_label: settings.value.sleeves.find((row) => row.id === selection.value.sleeve_type)?.label || "",
		size_label: settings.value.sizes.find((row) => row.id === selection.value.size)?.label || "",
		sleeve_title: settings.value.sleeve_label,
		size_title: settings.value.size_label,
		requirements_title: settings.value.requirements_label,
		note: settings.value.note
	} : null);
	(0, vue_exports.watch)(selection, (value) => {
		if (value?.option_id) legacyChoice.value = "custom";
		else if (legacyChoice.value === "custom") legacyChoice.value = "without";
	});
	(0, vue_exports.watch)(legacyChoice, (value) => {
		if (value !== "custom") selection.value = null;
	});
	(0, vue_exports.watch)(option, (value) => {
		if (!value && selection.value) selection.value = null;
	});
	return {
		settings,
		selection,
		picker,
		option,
		fee,
		snapshot,
		validate: () => picker.value?.validate() ?? true
	};
}
//#endregion
export { useBlouseCustomization as n, blouseSettingsFor as t };

//# sourceMappingURL=useBlouseCustomization-CIU6rHSe.js.map