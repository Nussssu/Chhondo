import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { f as p } from "./AppLayout-BTfWMt9n.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AccountLayout_default } from "./AccountLayout-BmSfcuSx.js";
import { a as isExceptionStatus, i as getOrderStepIndex, n as getOrderStatusBadge, r as getOrderStatusLabel } from "./orderStatus-BU0BYTyW.js";
import { t as OrderStepper_default } from "./OrderStepper-HeHyMB8d.js";
//#region resources/js/Pages/Public/Account/TrackOrder.vue
var _sfc_main = {
	__name: "TrackOrder",
	__ssrInlineRender: true,
	props: {
		orderData: {
			type: Object,
			default: null
		},
		invoice: {
			type: String,
			default: ""
		},
		texts: {
			type: Object,
			default: () => ({})
		}
	},
	setup(__props) {
		const props = __props;
		const tx = (key, fallback) => props.texts?.[key] || fallback;
		const shown = (key) => String(props.texts?.[`${key}_show`] ?? "1") !== "0";
		const msg = (key, fallback) => shown(key) ? tx(key, fallback) : "";
		const page = usePage();
		const invoiceNumber = (0, vue_exports.ref)(props.invoice || "");
		const orderData = (0, vue_exports.ref)(props.orderData || null);
		const loading = (0, vue_exports.ref)(false);
		const errorMessage = (0, vue_exports.ref)(props.invoice && !props.orderData ? msg("acc_search_not_found", "অর্ডার পাওয়া যায়নি।") : "");
		(0, vue_exports.watch)(() => page.props.orderData, (value) => {
			orderData.value = value;
			errorMessage.value = !value && invoiceNumber.value ? msg("acc_search_not_found", "অর্ডার পাওয়া যায়নি।") : "";
		});
		const trackOrder = () => {
			const invoice = invoiceNumber.value.trim();
			if (!invoice) {
				errorMessage.value = msg("acc_search_empty", "সঠিক অর্ডার আইডি লিখুন।");
				return;
			}
			invoiceNumber.value = invoice;
			loading.value = true;
			errorMessage.value = "";
			router.get("/account/track-order", { invoice }, {
				preserveState: true,
				preserveScroll: true,
				onSuccess: (visit) => {
					const found = visit.props.orderData;
					orderData.value = found || null;
					errorMessage.value = found ? "" : msg("acc_search_not_found", "অর্ডার পাওয়া যায়নি।");
				},
				onFinish: () => {
					loading.value = false;
				}
			});
		};
		const formatDate = (dateString) => dateString ? new Intl.DateTimeFormat("bn-BD", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}).format(new Date(dateString)) : "—";
		const formatMoney = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value) || 0);
		const badgeStyle = (status) => {
			const { bg, text } = getOrderStatusBadge(status);
			return {
				backgroundColor: bg,
				color: text
			};
		};
		const statusLabel = getOrderStatusLabel;
		const onCopy = () => p.success("কপি হয়েছে!");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_tab_title", "অর্ডার ট্র্যাক করুন"))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(tx("acc_tab_title", "অর্ডার ট্র্যাক করুন")), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="track-page" data-v-3da9e721${_scopeId}><div class="section-header" data-v-3da9e721${_scopeId}><span class="section-header-icon" data-v-3da9e721${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-heading.svg")} alt="" data-v-3da9e721${_scopeId}></span><div data-v-3da9e721${_scopeId}>`);
						if (shown("acc_title")) _push(`<p class="section-header-title" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_title", "অর্ডার ট্র্যাক করুন"))}</p>`);
						else _push(`<!---->`);
						if (shown("acc_subtitle")) _push(`<p class="section-header-subtitle" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_subtitle", "অর্ডার ট্র্যাক"))}</p>`);
						else _push(`<!---->`);
						_push(`</div></div><section class="track-card track-search-card" data-v-3da9e721${_scopeId}><div class="track-card-heading" data-v-3da9e721${_scopeId}>`);
						if (shown("acc_search_heading")) _push(`<h2 data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_search_heading", "আপনার অর্ডার ট্র্যাক করুন"))}</h2>`);
						else _push(`<!---->`);
						if (shown("acc_search_text")) _push(`<p data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_search_text", "সর্বশেষ অবস্থা দেখতে অর্ডার আইডি লিখুন"))}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="track-search-row" data-v-3da9e721${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", invoiceNumber.value)} type="text"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", msg("acc_search_placeholder", "যেমন: CHK-2025-0481"))} class="track-search-input" data-v-3da9e721${_scopeId}><button type="button" class="track-search-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(loading.value) ? " disabled" : ""} data-v-3da9e721${_scopeId}>`);
						if (!loading.value) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-button.svg")} alt="" data-v-3da9e721${_scopeId}>`);
						else _push(`<span class="track-spinner" aria-hidden="true" data-v-3da9e721${_scopeId}></span>`);
						_push(` ${(0, server_renderer_exports.ssrInterpolate)(loading.value ? msg("acc_search_loading", "খোঁজা হচ্ছে...") : msg("acc_search_button", "ট্র্যাক করুন"))}</button></div>`);
						if (errorMessage.value) _push(`<p class="track-error" role="alert" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errorMessage.value)}</p>`);
						else _push(`<!---->`);
						_push(`</section>`);
						if (orderData.value) {
							_push(`<div class="track-results" data-v-3da9e721${_scopeId}><section class="track-card track-summary-card" data-v-3da9e721${_scopeId}><div class="track-summary-header" data-v-3da9e721${_scopeId}><div class="track-summary-copy" data-v-3da9e721${_scopeId}>`);
							if (shown("acc_order_id_label")) _push(`<p class="track-summary-label" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_order_id_label", "অর্ডার আইডি"))}</p>`);
							else _push(`<!---->`);
							_push(`<p class="track-summary-value" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.invoice_number)}</p>`);
							if (shown("acc_placed_on")) _push(`<p class="track-summary-meta" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_placed_on", "অর্ডারের তারিখ"))} ${(0, server_renderer_exports.ssrInterpolate)(formatDate(orderData.value.created_at))}</p>`);
							else _push(`<!---->`);
							_push(`</div><span class="order-status-pill" style="${(0, server_renderer_exports.ssrRenderStyle)(badgeStyle(orderData.value.order_status))}" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(statusLabel)(orderData.value.order_status))}</span></div>`);
							if (orderData.value.address || shown("acc_no_address")) _push(`<p class="track-summary-address" data-v-3da9e721${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-location.svg")} alt="" data-v-3da9e721${_scopeId}><span data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.address || tx("acc_no_address", "কোনো ঠিকানা নেই"))}</span></p>`);
							else _push(`<!---->`);
							_push(`</section>`);
							if (!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status)) {
								_push(`<section class="track-card track-progress-card" data-v-3da9e721${_scopeId}>`);
								if (shown("acc_progress_title")) _push(`<h2 class="track-section-title" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_progress_title", "ডেলিভারির অগ্রগতি"))}</h2>`);
								else _push(`<!---->`);
								_push((0, server_renderer_exports.ssrRenderComponent)(OrderStepper_default, {
									variant: "vertical",
									"current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(orderData.value.order_status) ?? 0,
									"placed-at": orderData.value.created_at,
									"updated-at": orderData.value.updated_at
								}, null, _parent, _scopeId));
								_push(`</section>`);
							} else _push(`<!---->`);
							_push(`<section class="track-card track-items-card" data-v-3da9e721${_scopeId}><div class="order-items" data-v-3da9e721${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(orderData.value.items || [], (item, idx) => {
								_push(`<div class="order-item-row" data-v-3da9e721${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product?.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product?.product_name || "")} class="order-item-thumb" loading="lazy" decoding="async" data-v-3da9e721${_scopeId}><div class="order-item-info" data-v-3da9e721${_scopeId}><p class="order-item-name" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product?.product_name || "পণ্য")}</p>`);
								if (shown("acc_qty_label")) _push(`<p class="order-item-qty" data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_qty_label", "পরিমাণ:"))} ${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</p>`);
								else _push(`<!---->`);
								_push(`</div><p class="order-item-price" data-v-3da9e721${_scopeId}><span data-v-3da9e721${_scopeId}>৳</span>${(0, server_renderer_exports.ssrInterpolate)(formatMoney(item.price))}</p></div>`);
							});
							_push(`<!--]--></div>`);
							if (shown("acc_total_label")) _push(`<div class="track-total-row" data-v-3da9e721${_scopeId}><span data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_total_label", "মোট"))}</span><span class="track-total-price" data-v-3da9e721${_scopeId}><span data-v-3da9e721${_scopeId}>৳</span>${(0, server_renderer_exports.ssrInterpolate)(formatMoney(orderData.value.total_price))}</span></div>`);
							else _push(`<!---->`);
							if (orderData.value.payment_summary && shown("acc_payment_label")) _push(`<div class="track-payment-row" data-v-3da9e721${_scopeId}><span data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tx("acc_payment_label", "পেমেন্ট"))}</span><span data-v-3da9e721${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.payment_summary)}</span></div>`);
							else _push(`<!---->`);
							_push(`</section></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", {
						class: "track-page",
						onCopy
					}, [
						(0, vue_exports.createVNode)("div", { class: "section-header" }, [(0, vue_exports.createVNode)("span", { class: "section-header-icon" }, [(0, vue_exports.createVNode)("img", {
							src: "/assets/images/account/track-heading.svg",
							alt: ""
						})]), (0, vue_exports.createVNode)("div", null, [shown("acc_title") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "section-header-title"
						}, (0, vue_exports.toDisplayString)(tx("acc_title", "অর্ডার ট্র্যাক করুন")), 1)) : (0, vue_exports.createCommentVNode)("", true), shown("acc_subtitle") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 1,
							class: "section-header-subtitle"
						}, (0, vue_exports.toDisplayString)(tx("acc_subtitle", "অর্ডার ট্র্যাক")), 1)) : (0, vue_exports.createCommentVNode)("", true)])]),
						(0, vue_exports.createVNode)("section", { class: "track-card track-search-card" }, [
							(0, vue_exports.createVNode)("div", { class: "track-card-heading" }, [shown("acc_search_heading") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("h2", { key: 0 }, (0, vue_exports.toDisplayString)(tx("acc_search_heading", "আপনার অর্ডার ট্র্যাক করুন")), 1)) : (0, vue_exports.createCommentVNode)("", true), shown("acc_search_text") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", { key: 1 }, (0, vue_exports.toDisplayString)(tx("acc_search_text", "সর্বশেষ অবস্থা দেখতে অর্ডার আইডি লিখুন")), 1)) : (0, vue_exports.createCommentVNode)("", true)]),
							(0, vue_exports.createVNode)("div", { class: "track-search-row" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								"onUpdate:modelValue": ($event) => invoiceNumber.value = $event,
								type: "text",
								placeholder: msg("acc_search_placeholder", "যেমন: CHK-2025-0481"),
								class: "track-search-input",
								onKeyup: (0, vue_exports.withKeys)(trackOrder, ["enter"])
							}, null, 40, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, invoiceNumber.value]]), (0, vue_exports.createVNode)("button", {
								type: "button",
								class: "track-search-btn",
								disabled: loading.value,
								onClick: trackOrder
							}, [!loading.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
								key: 0,
								src: "/assets/images/account/track-button.svg",
								alt: ""
							})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 1,
								class: "track-spinner",
								"aria-hidden": "true"
							})), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(loading.value ? msg("acc_search_loading", "খোঁজা হচ্ছে...") : msg("acc_search_button", "ট্র্যাক করুন")), 1)], 8, ["disabled"])]),
							errorMessage.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "track-error",
								role: "alert"
							}, (0, vue_exports.toDisplayString)(errorMessage.value), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						orderData.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "track-results"
						}, [
							(0, vue_exports.createVNode)("section", { class: "track-card track-summary-card" }, [(0, vue_exports.createVNode)("div", { class: "track-summary-header" }, [(0, vue_exports.createVNode)("div", { class: "track-summary-copy" }, [
								shown("acc_order_id_label") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "track-summary-label"
								}, (0, vue_exports.toDisplayString)(tx("acc_order_id_label", "অর্ডার আইডি")), 1)) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("p", { class: "track-summary-value" }, (0, vue_exports.toDisplayString)(orderData.value.invoice_number), 1),
								shown("acc_placed_on") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 1,
									class: "track-summary-meta"
								}, (0, vue_exports.toDisplayString)(tx("acc_placed_on", "অর্ডারের তারিখ")) + " " + (0, vue_exports.toDisplayString)(formatDate(orderData.value.created_at)), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]), (0, vue_exports.createVNode)("span", {
								class: "order-status-pill",
								style: badgeStyle(orderData.value.order_status)
							}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(statusLabel)(orderData.value.order_status)), 5)]), orderData.value.address || shown("acc_no_address") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "track-summary-address"
							}, [(0, vue_exports.createVNode)("img", {
								src: "/assets/images/account/track-location.svg",
								alt: ""
							}), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(orderData.value.address || tx("acc_no_address", "কোনো ঠিকানা নেই")), 1)])) : (0, vue_exports.createCommentVNode)("", true)]),
							!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
								key: 0,
								class: "track-card track-progress-card"
							}, [shown("acc_progress_title") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("h2", {
								key: 0,
								class: "track-section-title"
							}, (0, vue_exports.toDisplayString)(tx("acc_progress_title", "ডেলিভারির অগ্রগতি")), 1)) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)(OrderStepper_default, {
								variant: "vertical",
								"current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(orderData.value.order_status) ?? 0,
								"placed-at": orderData.value.created_at,
								"updated-at": orderData.value.updated_at
							}, null, 8, [
								"current-step-index",
								"placed-at",
								"updated-at"
							])])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("section", { class: "track-card track-items-card" }, [
								(0, vue_exports.createVNode)("div", { class: "order-items" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(orderData.value.items || [], (item, idx) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: item.id ?? idx,
										class: "order-item-row"
									}, [
										(0, vue_exports.createVNode)("img", {
											src: item.product?.featured_image || "/placeholder.svg",
											alt: item.product?.product_name || "",
											class: "order-item-thumb",
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										]),
										(0, vue_exports.createVNode)("div", { class: "order-item-info" }, [(0, vue_exports.createVNode)("p", { class: "order-item-name" }, (0, vue_exports.toDisplayString)(item.product?.product_name || "পণ্য"), 1), shown("acc_qty_label") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
											key: 0,
											class: "order-item-qty"
										}, (0, vue_exports.toDisplayString)(tx("acc_qty_label", "পরিমাণ:")) + " " + (0, vue_exports.toDisplayString)(item.quantity), 1)) : (0, vue_exports.createCommentVNode)("", true)]),
										(0, vue_exports.createVNode)("p", { class: "order-item-price" }, [(0, vue_exports.createVNode)("span", null, "৳"), (0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatMoney(item.price)), 1)])
									]);
								}), 128))]),
								shown("acc_total_label") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 0,
									class: "track-total-row"
								}, [(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(tx("acc_total_label", "মোট")), 1), (0, vue_exports.createVNode)("span", { class: "track-total-price" }, [(0, vue_exports.createVNode)("span", null, "৳"), (0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatMoney(orderData.value.total_price)), 1)])])) : (0, vue_exports.createCommentVNode)("", true),
								orderData.value.payment_summary && shown("acc_payment_label") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 1,
									class: "track-payment-row"
								}, [(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(tx("acc_payment_label", "পেমেন্ট")), 1), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(orderData.value.payment_summary), 1)])) : (0, vue_exports.createCommentVNode)("", true)
							])
						])) : (0, vue_exports.createCommentVNode)("", true)
					], 32)];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Account/TrackOrder.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TrackOrder_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-3da9e721"]]);
//#endregion
export { TrackOrder_default as default };

//# sourceMappingURL=TrackOrder-DHKmhDnb.js.map