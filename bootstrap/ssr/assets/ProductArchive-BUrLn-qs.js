import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { g as createLucideIcon, h as ChevronDown, m as X } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { r as CollectionCard_default } from "./videoEmbed-CEkxInuf.js";
import { t as ProductPreviewModel_default } from "./ProductPreviewModel-CDbDRzyi.js";
//#region node_modules/lucide-vue-next/dist/esm/icons/sliders-horizontal.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SlidersHorizontal = createLucideIcon("SlidersHorizontalIcon", [
	["line", {
		x1: "21",
		x2: "14",
		y1: "4",
		y2: "4",
		key: "obuewd"
	}],
	["line", {
		x1: "10",
		x2: "3",
		y1: "4",
		y2: "4",
		key: "1q6298"
	}],
	["line", {
		x1: "21",
		x2: "12",
		y1: "12",
		y2: "12",
		key: "1iu8h1"
	}],
	["line", {
		x1: "8",
		x2: "3",
		y1: "12",
		y2: "12",
		key: "ntss68"
	}],
	["line", {
		x1: "21",
		x2: "16",
		y1: "20",
		y2: "20",
		key: "14d8ph"
	}],
	["line", {
		x1: "12",
		x2: "3",
		y1: "20",
		y2: "20",
		key: "m0wm8r"
	}],
	["line", {
		x1: "14",
		x2: "14",
		y1: "2",
		y2: "6",
		key: "14e1ph"
	}],
	["line", {
		x1: "8",
		x2: "8",
		y1: "10",
		y2: "14",
		key: "1i6ji0"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "18",
		y2: "22",
		key: "1lctlv"
	}]
]);
//#endregion
//#region resources/js/components/Product/ProductArchive.vue
/**
* Shared product-archive layout used by every shop archive page
* (the /shop page and /product-category/{slug} pages) so they share
* one design: content header, breadcrumb + sort row, a sidebar with
* price / category / attribute filters, and a grid of product cards.
*
* This component is presentational: it owns the filter UI state and
* emits intent. The parent page performs the actual Inertia navigation
* (the URL differs between shop and category archives).
*/
var MIN_PRICE = 0;
var MAX_PRICE = 5e3;
var _sfc_main = {
	__name: "ProductArchive",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			default: ""
		},
		description: {
			type: String,
			default: ""
		},
		breadcrumbs: {
			type: Array,
			default: () => []
		},
		products: {
			type: Array,
			default: () => []
		},
		loading: {
			type: Boolean,
			default: false
		},
		currentPage: {
			type: Number,
			default: 1
		},
		lastPage: {
			type: Number,
			default: 1
		},
		total: {
			type: Number,
			default: 0
		},
		categories: {
			type: Array,
			default: () => []
		},
		attributes: {
			type: Array,
			default: () => []
		},
		activeCategorySlug: {
			type: String,
			default: null
		},
		initialFilters: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["filter-change", "page-change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const filters = (0, vue_exports.reactive)({
			min_price: Number(props.initialFilters.min_price ?? MIN_PRICE),
			max_price: Number(props.initialFilters.max_price ?? MAX_PRICE),
			sort: props.initialFilters.sort || "",
			attributes: { ...props.initialFilters.attributes || {} }
		});
		filters.min_price;
		const priceTrackStyle = (0, vue_exports.computed)(() => ({
			left: `${(filters.min_price - MIN_PRICE) / 5e3 * 100}%`,
			right: `${100 - (filters.max_price - MIN_PRICE) / 5e3 * 100}%`
		}));
		const isAttributeChecked = (name, value) => Array.isArray(filters.attributes[name]) && filters.attributes[name].includes(value);
		const sortOpen = (0, vue_exports.ref)(false);
		const sortOptions = [
			{
				value: "",
				label: "Newest"
			},
			{
				value: "low_to_high",
				label: "Price: (Low to High)"
			},
			{
				value: "high_to_low",
				label: "Price: (High to Low)"
			}
		];
		const currentSortLabel = (0, vue_exports.computed)(() => sortOptions.find((o) => o.value === filters.sort)?.label || "Newest");
		const sortRef = (0, vue_exports.ref)(null);
		const handleClickOutside = (e) => {
			if (sortRef.value && !sortRef.value.contains(e.target)) sortOpen.value = false;
		};
		const showSidebar = (0, vue_exports.ref)(false);
		(0, vue_exports.onMounted)(() => document.addEventListener("click", handleClickOutside));
		(0, vue_exports.onBeforeUnmount)(() => document.removeEventListener("click", handleClickOutside));
		const visiblePages = (0, vue_exports.computed)(() => {
			const total = props.lastPage;
			const current = props.currentPage;
			if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
			const pages = [1];
			const start = Math.max(2, current - 1);
			const end = Math.min(total - 1, current + 1);
			if (start > 2) pages.push("...");
			for (let i = start; i <= end; i++) pages.push(i);
			if (end < total - 1) pages.push("...");
			pages.push(total);
			return pages;
		});
		const isModalOpen = (0, vue_exports.ref)(false);
		const selectedProduct = (0, vue_exports.ref)(null);
		const openPreview = (product) => {
			selectedProduct.value = product;
			isModalOpen.value = true;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "archive" }, _attrs))} data-v-82558a8f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(ProductPreviewModel_default, {
				isOpen: isModalOpen.value,
				product: selectedProduct.value,
				onClose: ($event) => isModalOpen.value = false
			}, null, _parent));
			_push(`<div class="archive-header" data-v-82558a8f><div class="container text-center" data-v-82558a8f><h1 class="archive-title mb-4" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(__props.title)}</h1>`);
			if (__props.description) _push(`<p class="archive-description" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(__props.description)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="archive-body" data-v-82558a8f><div class="container" data-v-82558a8f><div class="py-8" data-v-82558a8f><div class="archive-toolbar flex items-center justify-between gap-4 flex-wrap" data-v-82558a8f><nav class="flex items-center gap-2 md:gap-3 flex-wrap" aria-label="Breadcrumb" data-v-82558a8f><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.breadcrumbs, (crumb, i) => {
				_push(`<!--[-->`);
				if (crumb.href && i < __props.breadcrumbs.length - 1) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", crumb.href)} class="breadcrumb-link" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(crumb.label)}</a>`);
				else _push(`<span class="breadcrumb-current" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(crumb.label)}</span>`);
				if (i < __props.breadcrumbs.length - 1) _push(`<svg class="breadcrumb-sep" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-82558a8f><polyline points="9 18 15 12 9 6" data-v-82558a8f></polyline></svg>`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--></nav><div class="flex items-center gap-4" data-v-82558a8f><button class="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-800" data-v-82558a8f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SlidersHorizontal), { class: "w-5 h-5" }, null, _parent));
			_push(`<span class="body-1-sb" data-v-82558a8f>Filters</span></button><div class="relative" data-v-82558a8f><button class="sort-trigger" data-v-82558a8f><span class="sort-trigger-label" data-v-82558a8f>Sort By:</span><span class="sort-trigger-value" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(currentSortLabel.value)}</span>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronDown), { class: ["w-4 h-4 text-gray-500 transition-transform shrink-0", { "rotate-180": sortOpen.value }] }, null, _parent));
			_push(`</button>`);
			if (sortOpen.value) {
				_push(`<div class="sort-dropdown" data-v-82558a8f><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(sortOptions, (opt) => {
					_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "sort-option--active": filters.sort === opt.value }, "sort-option body-1-r"])}" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(opt.label)}</button>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div></div></div><div class="flex flex-col lg:flex-row gap-6 lg:gap-5" data-v-82558a8f>`);
			if (showSidebar.value) _push(`<div class="fixed inset-0 bg-black/50 z-40 lg:hidden" data-v-82558a8f></div>`);
			else _push(`<!---->`);
			_push(`<aside class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-open": showSidebar.value }, "filter-sidebar"])}" data-v-82558a8f><div class="filter-sticky" data-v-82558a8f><div class="flex items-center justify-between lg:hidden mb-6" data-v-82558a8f><h2 class="text-lg font-semibold text-gray-800" data-v-82558a8f>Filters</h2><button class="text-gray-500 hover:text-gray-800" data-v-82558a8f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(X), { class: "w-5 h-5" }, null, _parent));
			_push(`</button></div><div class="filter-item" data-v-82558a8f><h3 class="filter-heading" data-v-82558a8f>FILTER BY PRICE</h3><div class="price-box" data-v-82558a8f><div class="relative w-full pt-1" data-v-82558a8f><div class="absolute w-full h-[3px] bg-gray-200 rounded" data-v-82558a8f></div><div class="absolute h-[3px] bg-[#1a1a1a] rounded" style="${(0, server_renderer_exports.ssrRenderStyle)(priceTrackStyle.value)}" data-v-82558a8f></div><input type="range"${(0, server_renderer_exports.ssrRenderAttr)("value", filters.min_price)}${(0, server_renderer_exports.ssrRenderAttr)("min", MIN_PRICE)}${(0, server_renderer_exports.ssrRenderAttr)("max", MAX_PRICE)} class="price-range" data-v-82558a8f><input type="range"${(0, server_renderer_exports.ssrRenderAttr)("value", filters.max_price)}${(0, server_renderer_exports.ssrRenderAttr)("min", MIN_PRICE)}${(0, server_renderer_exports.ssrRenderAttr)("max", MAX_PRICE)} class="price-range" data-v-82558a8f></div><div class="price-caption" data-v-82558a8f> Price: ${(0, server_renderer_exports.ssrInterpolate)(filters.min_price)}৳ — ${(0, server_renderer_exports.ssrInterpolate)(filters.max_price)}৳ </div></div></div><div class="filter-item" data-v-82558a8f><h3 class="filter-heading" data-v-82558a8f>PRODUCT CATEGORIES</h3><div class="category-box" data-v-82558a8f><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.categories, (category) => {
				_push(`<button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": __props.activeCategorySlug === category.slug }, "category-row"])}" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(category.name)}</button>`);
			});
			_push(`<!--]--></div></div><div class="filter-item !border-b-0 !pb-0" data-v-82558a8f><h3 class="filter-heading" data-v-82558a8f>PRODUCT ATTRIBUTES</h3>`);
			if (__props.attributes.length === 0) _push(`<div class="body-1-r text-gray-400" data-v-82558a8f>No attributes available.</div>`);
			else {
				_push(`<div data-v-82558a8f><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.attributes, (attribute, index) => {
					_push(`<div class="mb-4" data-v-82558a8f><h4 class="body-1-sb text-gray-700 mb-2" data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(attribute.name)}</h4><ul data-v-82558a8f><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(attribute.values, (value, i) => {
						_push(`<li class="py-0.5" data-v-82558a8f><label class="cursor-pointer body-1-r text-gray-500 hover:text-gray-700 flex items-center gap-2" data-v-82558a8f><input class="shop-checkbox" type="checkbox"${(0, server_renderer_exports.ssrRenderAttr)("value", value)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isAttributeChecked(attribute.name, value)) ? " checked" : ""} data-v-82558a8f> ${(0, server_renderer_exports.ssrInterpolate)(value)}</label></li>`);
					});
					_push(`<!--]--></ul></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></div></aside><main class="flex-1 min-w-0" data-v-82558a8f>`);
			if (__props.loading && __props.products.length === 0) {
				_push(`<div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" data-v-82558a8f><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(6, (n) => {
					_push(`<div class="skeleton-card" data-v-82558a8f><div class="skeleton-image animate-pulse" data-v-82558a8f></div><div class="skeleton-info" data-v-82558a8f><div class="skeleton-line w-3/4 animate-pulse" data-v-82558a8f></div><div class="skeleton-line w-1/2 animate-pulse mt-2" data-v-82558a8f></div></div><div class="skeleton-btn animate-pulse" data-v-82558a8f></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (__props.products.length > 0) {
				_push(`<div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" data-v-82558a8f><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.products, (product) => {
					_push((0, server_renderer_exports.ssrRenderComponent)(CollectionCard_default, {
						key: product.id,
						product,
						openPreview
					}, null, _parent));
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="text-center py-16" data-v-82558a8f><h3 class="text-2xl font-semibold text-gray-500" data-v-82558a8f>No products found</h3><p class="text-gray-400 mt-2" data-v-82558a8f>Try adjusting your filters.</p></div>`);
			if (!__props.loading && __props.lastPage > 1) {
				_push(`<nav class="pagination-wrap" aria-label="Pagination" data-v-82558a8f><button class="pagination-arrow"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.currentPage === 1) ? " disabled" : ""} aria-label="Previous page" data-v-82558a8f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-v-82558a8f><polyline points="15 18 9 12 15 6" data-v-82558a8f></polyline></svg></button><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(visiblePages.value, (p, idx) => {
					_push(`<!--[-->`);
					if (p === "...") _push(`<span class="pagination-ellipsis" data-v-82558a8f>…</span>`);
					else _push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": p === __props.currentPage }, "pagination-page"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-current", p === __props.currentPage ? "page" : void 0)} data-v-82558a8f>${(0, server_renderer_exports.ssrInterpolate)(p)}</button>`);
					_push(`<!--]-->`);
				});
				_push(`<!--]--><button class="pagination-arrow"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.currentPage === __props.lastPage) ? " disabled" : ""} aria-label="Next page" data-v-82558a8f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-v-82558a8f><polyline points="9 18 15 12 9 6" data-v-82558a8f></polyline></svg></button></nav>`);
			} else _push(`<!---->`);
			if (!__props.loading && __props.total > 0) _push(`<p class="pagination-info" data-v-82558a8f> Showing page ${(0, server_renderer_exports.ssrInterpolate)(__props.currentPage)} of ${(0, server_renderer_exports.ssrInterpolate)(__props.lastPage)} · ${(0, server_renderer_exports.ssrInterpolate)(__props.total)} products </p>`);
			else _push(`<!---->`);
			_push(`</main></div></div></div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductArchive.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ProductArchive_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-82558a8f"]]);
//#endregion
export { ProductArchive_default as t };

//# sourceMappingURL=ProductArchive-BUrLn-qs.js.map