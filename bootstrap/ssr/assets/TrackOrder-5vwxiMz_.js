import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { d as p, t as _sfc_main$1 } from "./AppLayout-ochFaCc-.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-BNL11rU6.js";
//#region resources/js/Pages/Public/TrackOrder.vue
var _sfc_main = {
	__name: "TrackOrder",
	__ssrInlineRender: true,
	props: {
		texts: {
			type: Object,
			default: () => ({})
		},
		blocks: {
			type: Array,
			default: () => []
		},
		intro: {
			type: Object,
			default: () => ({})
		},
		orderData: {
			type: Object,
			default: null
		},
		invoice: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const invoiceNumber = (0, vue_exports.ref)(props.invoice || "");
		const orderData = (0, vue_exports.ref)(props.orderData || null);
		const loading = (0, vue_exports.ref)(false);
		const errorMessage = (0, vue_exports.ref)("");
		(0, vue_exports.watch)(() => page.props.orderData, (val) => {
			orderData.value = val;
			if (!val && invoiceNumber.value) errorMessage.value = props.texts.search_not_found;
			else errorMessage.value = "";
		});
		const trackOrder = () => {
			if (!invoiceNumber.value) {
				errorMessage.value = props.texts.search_empty;
				return;
			}
			loading.value = true;
			errorMessage.value = "";
			router.get("/track-order", { invoice: invoiceNumber.value }, {
				preserveState: true,
				preserveScroll: true,
				onFinish: () => {
					loading.value = false;
				}
			});
		};
		const onCopy = () => p.success("কপি হয়েছে!");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.tab_title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.tab_title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="track-page min-h-screen py-10 md:py-16" data-v-0b9cba10${_scopeId}><div class="container max-w-3xl mx-auto px-4" data-v-0b9cba10${_scopeId}><div class="text-center mb-8" data-v-0b9cba10${_scopeId}><h1 class="track-title" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title)}</h1>`);
						if (__props.intro?.subtitle) _push(`<p class="track-sub" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro.subtitle)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="track-card p-5 md:p-6 mb-6" data-v-0b9cba10${_scopeId}><div class="flex flex-col sm:flex-row gap-3" data-v-0b9cba10${_scopeId}><div class="relative flex-grow" data-v-0b9cba10${_scopeId}><span class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400" data-v-0b9cba10${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-0b9cba10${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" data-v-0b9cba10${_scopeId}></path></svg></span><input type="text"${(0, server_renderer_exports.ssrRenderAttr)("value", invoiceNumber.value)}${(0, server_renderer_exports.ssrRenderAttr)("placeholder", __props.texts.search_placeholder)} class="track-input w-full pl-12 pr-4 focus:outline-none text-sm" data-v-0b9cba10${_scopeId}></div><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(loading.value) ? " disabled" : ""} class="track-btn flex items-center justify-center gap-2 px-6 text-white text-nowrap transition-all" data-v-0b9cba10${_scopeId}>`);
						if (!loading.value) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-0b9cba10${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" data-v-0b9cba10${_scopeId}></path></svg>`);
						else _push(`<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-0b9cba10${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-0b9cba10${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" data-v-0b9cba10${_scopeId}></path></svg>`);
						_push(` ${(0, server_renderer_exports.ssrInterpolate)(loading.value ? __props.texts.search_loading : __props.texts.search_button)}</button></div>`);
						if (errorMessage.value) _push(`<div class="mt-4 flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm" data-v-0b9cba10${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-0b9cba10${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-0b9cba10${_scopeId}></path></svg> ${(0, server_renderer_exports.ssrInterpolate)(errorMessage.value)}</div>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if (orderData.value) {
							_push(`<div class="flex flex-col gap-5" data-v-0b9cba10${_scopeId}><div class="track-card p-5 md:p-7 rounded-2xl" data-v-0b9cba10${_scopeId}><div class="flex items-start justify-between flex-wrap gap-3 pb-5 mb-5 border-b border-[#f2e3cf]" data-v-0b9cba10${_scopeId}><div data-v-0b9cba10${_scopeId}><h2 class="body-2-sb text-[#3E3C3A]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</h2><p class="text-xs text-[#9ca3af] mt-0.5 tracking-wide" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t13)}${(0, server_renderer_exports.ssrInterpolate)(orderData.value.invoice_number)}</p></div><span class="${(0, server_renderer_exports.ssrRenderClass)(["status-badge", "badge-" + orderData.value.order_status?.toLowerCase().replace(/\s+/g, "_")])}" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.order_status)}</span></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-v-0b9cba10${_scopeId}><div class="info-row" data-v-0b9cba10${_scopeId}><div class="info-icon" data-v-0b9cba10${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-0b9cba10${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-0b9cba10${_scopeId}></path></svg></div><div data-v-0b9cba10${_scopeId}><p class="info-label" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</p><p class="info-value" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.customer_name ?? "N/A")}</p></div></div><div class="info-row" data-v-0b9cba10${_scopeId}><div class="info-icon" data-v-0b9cba10${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-0b9cba10${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" data-v-0b9cba10${_scopeId}></path></svg></div><div data-v-0b9cba10${_scopeId}><p class="info-label" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</p><p class="info-value font-semibold text-theme" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)(orderData.value.total_price)}</p></div></div></div></div>`);
							if (orderData.value.items.length > 0) {
								_push(`<div class="track-card rounded-2xl overflow-hidden" data-v-0b9cba10${_scopeId}><div class="px-5 md:px-7 py-4 border-b border-[#f2e3cf]" data-v-0b9cba10${_scopeId}><h3 class="body-2-sb text-[#3E3C3A]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</h3></div><div class="hidden md:block overflow-x-auto" data-v-0b9cba10${_scopeId}><table class="w-full" data-v-0b9cba10${_scopeId}><thead data-v-0b9cba10${_scopeId}><tr class="bg-[#FEF8F0]" data-v-0b9cba10${_scopeId}><th class="px-7 py-3 text-left text-xs font-semibold text-[#6d6560] uppercase tracking-wider" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t6)}</th><th class="px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t7)}</th><th class="px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t8)}</th><th class="px-7 py-3 text-right text-xs font-semibold text-[#6d6560] uppercase tracking-wider" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t9)}</th></tr></thead><tbody class="divide-y divide-[#f2e3cf]" data-v-0b9cba10${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(orderData.value.items, (item, index) => {
									_push(`<tr class="hover:bg-[#fffdf9] transition-colors" data-v-0b9cba10${_scopeId}><td class="px-7 py-4" data-v-0b9cba10${_scopeId}><div class="flex items-center gap-3" data-v-0b9cba10${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image || "/placeholder.svg")} alt="Product Image" class="w-14 h-14 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0" loading="lazy" decoding="async" width="56" height="56" data-v-0b9cba10${_scopeId}><span class="text-sm font-medium text-[#3E3C3A]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</span></div></td><td class="px-4 py-4 text-center text-sm text-[#6d6560]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</td><td class="px-4 py-4 text-center text-sm text-[#6d6560]" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)(item.price)}</td><td class="px-7 py-4 text-right text-sm font-semibold text-theme" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)((item.price * item.quantity).toFixed(2))}</td></tr>`);
								});
								_push(`<!--]--></tbody></table></div><div class="md:hidden divide-y divide-[#f2e3cf]" data-v-0b9cba10${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(orderData.value.items, (item, index) => {
									_push(`<div class="flex gap-3.5 p-4" data-v-0b9cba10${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image || "/placeholder.svg")} alt="Product Image" class="w-16 h-16 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0" loading="lazy" decoding="async" width="64" height="64" data-v-0b9cba10${_scopeId}><div class="flex-grow min-w-0" data-v-0b9cba10${_scopeId}><p class="text-sm font-medium text-[#3E3C3A] leading-snug" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</p><div class="flex flex-wrap gap-x-4 mt-1.5" data-v-0b9cba10${_scopeId}><span class="text-xs text-[#9ca3af]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t10)}<span class="text-[#3E3C3A] font-medium" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</span></span><span class="text-xs text-[#9ca3af]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t11)}<span class="text-[#3E3C3A] font-medium" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)(item.price)}</span></span></div><p class="mt-1.5 text-sm font-semibold text-theme" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)((item.price * item.quantity).toFixed(2))}</p></div></div>`);
								});
								_push(`<!--]--></div><div class="px-5 md:px-7 py-4 bg-[#FEF8F0] border-t border-[#f2e3cf] flex items-center justify-between" data-v-0b9cba10${_scopeId}><p class="text-sm text-[#6d6560]" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.items.length)} ${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t14)}${(0, server_renderer_exports.ssrInterpolate)(orderData.value.items.length !== 1 ? "s" : "")}</p><div class="text-right" data-v-0b9cba10${_scopeId}><p class="text-xs text-[#9ca3af] uppercase tracking-wider font-medium" data-v-0b9cba10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t12)}</p><p class="text-xl font-bold text-theme" data-v-0b9cba10${_scopeId}>৳ ${(0, server_renderer_exports.ssrInterpolate)(orderData.value.total_price)}</p>`);
								if (orderData.value.payment_summary) _push(`<p class="mt-0.5 text-xs text-[#6d6560]" data-v-0b9cba10${_scopeId}>Payment: ${(0, server_renderer_exports.ssrInterpolate)(orderData.value.payment_summary)}</p>`);
								else _push(`<!---->`);
								_push(`</div></div></div>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", {
						class: "track-page min-h-screen py-10 md:py-16",
						onCopy
					}, [(0, vue_exports.createVNode)("div", { class: "container max-w-3xl mx-auto px-4" }, [
						(0, vue_exports.createVNode)("div", { class: "text-center mb-8" }, [(0, vue_exports.createVNode)("h1", { class: "track-title" }, (0, vue_exports.toDisplayString)(__props.intro?.title), 1), __props.intro?.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "track-sub"
						}, (0, vue_exports.toDisplayString)(__props.intro.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.createVNode)("div", { class: "track-card p-5 md:p-6 mb-6" }, [(0, vue_exports.createVNode)("div", { class: "flex flex-col sm:flex-row gap-3" }, [(0, vue_exports.createVNode)("div", { class: "relative flex-grow" }, [(0, vue_exports.createVNode)("span", { class: "absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [(0, vue_exports.createVNode)("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						})]))]), (0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
							type: "text",
							"onUpdate:modelValue": ($event) => invoiceNumber.value = $event,
							onKeyup: (0, vue_exports.withKeys)(trackOrder, ["enter"]),
							placeholder: __props.texts.search_placeholder,
							class: "track-input w-full pl-12 pr-4 focus:outline-none text-sm"
						}, null, 40, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, invoiceNumber.value]])]), (0, vue_exports.createVNode)("button", {
							onClick: trackOrder,
							disabled: loading.value,
							class: "track-btn flex items-center justify-center gap-2 px-6 text-white text-nowrap transition-all"
						}, [!loading.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							key: 0,
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [(0, vue_exports.createVNode)("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
						})])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							key: 1,
							class: "animate-spin h-4 w-4",
							xmlns: "http://www.w3.org/2000/svg",
							fill: "none",
							viewBox: "0 0 24 24"
						}, [(0, vue_exports.createVNode)("circle", {
							class: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							"stroke-width": "4"
						}), (0, vue_exports.createVNode)("path", {
							class: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8v8H4z"
						})])), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(loading.value ? __props.texts.search_loading : __props.texts.search_button), 1)], 8, ["disabled"])]), errorMessage.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "mt-4 flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm"
						}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 flex-shrink-0",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [(0, vue_exports.createVNode)("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						})])), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(errorMessage.value), 1)])) : (0, vue_exports.createCommentVNode)("", true)]),
						orderData.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "flex flex-col gap-5"
						}, [(0, vue_exports.createVNode)("div", { class: "track-card p-5 md:p-7 rounded-2xl" }, [(0, vue_exports.createVNode)("div", { class: "flex items-start justify-between flex-wrap gap-3 pb-5 mb-5 border-b border-[#f2e3cf]" }, [(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-2-sb text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1), (0, vue_exports.createVNode)("p", { class: "text-xs text-[#9ca3af] mt-0.5 tracking-wide" }, (0, vue_exports.toDisplayString)(__props.texts.t13) + (0, vue_exports.toDisplayString)(orderData.value.invoice_number), 1)]), (0, vue_exports.createVNode)("span", { class: ["status-badge", "badge-" + orderData.value.order_status?.toLowerCase().replace(/\s+/g, "_")] }, (0, vue_exports.toDisplayString)(orderData.value.order_status), 3)]), (0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)("div", { class: "info-row" }, [(0, vue_exports.createVNode)("div", { class: "info-icon" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [(0, vue_exports.createVNode)("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						})]))]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "info-label" }, (0, vue_exports.toDisplayString)(__props.texts.t3), 1), (0, vue_exports.createVNode)("p", { class: "info-value" }, (0, vue_exports.toDisplayString)(orderData.value.customer_name ?? "N/A"), 1)])]), (0, vue_exports.createVNode)("div", { class: "info-row" }, [(0, vue_exports.createVNode)("div", { class: "info-icon" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [(0, vue_exports.createVNode)("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
						})]))]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "info-label" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1), (0, vue_exports.createVNode)("p", { class: "info-value font-semibold text-theme" }, "৳ " + (0, vue_exports.toDisplayString)(orderData.value.total_price), 1)])])])]), orderData.value.items.length > 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "track-card rounded-2xl overflow-hidden"
						}, [
							(0, vue_exports.createVNode)("div", { class: "px-5 md:px-7 py-4 border-b border-[#f2e3cf]" }, [(0, vue_exports.createVNode)("h3", { class: "body-2-sb text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t5), 1)]),
							(0, vue_exports.createVNode)("div", { class: "hidden md:block overflow-x-auto" }, [(0, vue_exports.createVNode)("table", { class: "w-full" }, [(0, vue_exports.createVNode)("thead", null, [(0, vue_exports.createVNode)("tr", { class: "bg-[#FEF8F0]" }, [
								(0, vue_exports.createVNode)("th", { class: "px-7 py-3 text-left text-xs font-semibold text-[#6d6560] uppercase tracking-wider" }, (0, vue_exports.toDisplayString)(__props.texts.t6), 1),
								(0, vue_exports.createVNode)("th", { class: "px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider" }, (0, vue_exports.toDisplayString)(__props.texts.t7), 1),
								(0, vue_exports.createVNode)("th", { class: "px-4 py-3 text-center text-xs font-semibold text-[#6d6560] uppercase tracking-wider" }, (0, vue_exports.toDisplayString)(__props.texts.t8), 1),
								(0, vue_exports.createVNode)("th", { class: "px-7 py-3 text-right text-xs font-semibold text-[#6d6560] uppercase tracking-wider" }, (0, vue_exports.toDisplayString)(__props.texts.t9), 1)
							])]), (0, vue_exports.createVNode)("tbody", { class: "divide-y divide-[#f2e3cf]" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(orderData.value.items, (item, index) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("tr", {
									key: index,
									class: "hover:bg-[#fffdf9] transition-colors"
								}, [
									(0, vue_exports.createVNode)("td", { class: "px-7 py-4" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("img", {
										src: item.product.featured_image || "/placeholder.svg",
										alt: "Product Image",
										class: "w-14 h-14 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0",
										loading: "lazy",
										decoding: "async",
										width: "56",
										height: "56",
										onError: ($event) => $event.target.src = "/placeholder.svg"
									}, null, 40, ["src", "onError"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-medium text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(item.product.product_name), 1)])]),
									(0, vue_exports.createVNode)("td", { class: "px-4 py-4 text-center text-sm text-[#6d6560]" }, (0, vue_exports.toDisplayString)(item.quantity), 1),
									(0, vue_exports.createVNode)("td", { class: "px-4 py-4 text-center text-sm text-[#6d6560]" }, "৳ " + (0, vue_exports.toDisplayString)(item.price), 1),
									(0, vue_exports.createVNode)("td", { class: "px-7 py-4 text-right text-sm font-semibold text-theme" }, "৳ " + (0, vue_exports.toDisplayString)((item.price * item.quantity).toFixed(2)), 1)
								]);
							}), 128))])])]),
							(0, vue_exports.createVNode)("div", { class: "md:hidden divide-y divide-[#f2e3cf]" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(orderData.value.items, (item, index) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: index,
									class: "flex gap-3.5 p-4"
								}, [(0, vue_exports.createVNode)("img", {
									src: item.product.featured_image || "/placeholder.svg",
									alt: "Product Image",
									class: "w-16 h-16 object-cover rounded-xl border border-[#f2e3cf] flex-shrink-0",
									loading: "lazy",
									decoding: "async",
									width: "64",
									height: "64",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, ["src", "onError"]), (0, vue_exports.createVNode)("div", { class: "flex-grow min-w-0" }, [
									(0, vue_exports.createVNode)("p", { class: "text-sm font-medium text-[#3E3C3A] leading-snug" }, (0, vue_exports.toDisplayString)(item.product.product_name), 1),
									(0, vue_exports.createVNode)("div", { class: "flex flex-wrap gap-x-4 mt-1.5" }, [(0, vue_exports.createVNode)("span", { class: "text-xs text-[#9ca3af]" }, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t10), 1), (0, vue_exports.createVNode)("span", { class: "text-[#3E3C3A] font-medium" }, (0, vue_exports.toDisplayString)(item.quantity), 1)]), (0, vue_exports.createVNode)("span", { class: "text-xs text-[#9ca3af]" }, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t11), 1), (0, vue_exports.createVNode)("span", { class: "text-[#3E3C3A] font-medium" }, "৳ " + (0, vue_exports.toDisplayString)(item.price), 1)])]),
									(0, vue_exports.createVNode)("p", { class: "mt-1.5 text-sm font-semibold text-theme" }, "৳ " + (0, vue_exports.toDisplayString)((item.price * item.quantity).toFixed(2)), 1)
								])]);
							}), 128))]),
							(0, vue_exports.createVNode)("div", { class: "px-5 md:px-7 py-4 bg-[#FEF8F0] border-t border-[#f2e3cf] flex items-center justify-between" }, [(0, vue_exports.createVNode)("p", { class: "text-sm text-[#6d6560]" }, (0, vue_exports.toDisplayString)(orderData.value.items.length) + " " + (0, vue_exports.toDisplayString)(__props.texts.t14) + (0, vue_exports.toDisplayString)(orderData.value.items.length !== 1 ? "s" : ""), 1), (0, vue_exports.createVNode)("div", { class: "text-right" }, [
								(0, vue_exports.createVNode)("p", { class: "text-xs text-[#9ca3af] uppercase tracking-wider font-medium" }, (0, vue_exports.toDisplayString)(__props.texts.t12), 1),
								(0, vue_exports.createVNode)("p", { class: "text-xl font-bold text-theme" }, "৳ " + (0, vue_exports.toDisplayString)(orderData.value.total_price), 1),
								orderData.value.payment_summary ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "mt-0.5 text-xs text-[#6d6560]"
								}, "Payment: " + (0, vue_exports.toDisplayString)(orderData.value.payment_summary), 1)) : (0, vue_exports.createCommentVNode)("", true)
							])])
						])) : (0, vue_exports.createCommentVNode)("", true)])) : (0, vue_exports.createCommentVNode)("", true)
					])], 32), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/TrackOrder.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TrackOrder_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-0b9cba10"]]);
//#endregion
export { TrackOrder_default as default };

//# sourceMappingURL=TrackOrder-5vwxiMz_.js.map