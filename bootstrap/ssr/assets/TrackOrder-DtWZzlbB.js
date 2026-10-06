import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { d as p } from "./AppLayout-ochFaCc-.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AccountLayout_default } from "./AccountLayout-CH25-PdJ.js";
import { i as isExceptionStatus, n as getOrderStatusBadge, r as getOrderStepIndex, t as OrderStepper_default } from "./OrderStepper-B1zCbmcd.js";
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
		}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const invoiceNumber = (0, vue_exports.ref)(props.invoice || "");
		const orderData = (0, vue_exports.ref)(props.orderData || null);
		const loading = (0, vue_exports.ref)(false);
		const errorMessage = (0, vue_exports.ref)("");
		(0, vue_exports.watch)(() => page.props.orderData, (value) => {
			orderData.value = value;
			errorMessage.value = !value && invoiceNumber.value ? "Order not found." : "";
		});
		const trackOrder = () => {
			const invoice = invoiceNumber.value.trim();
			if (!invoice) {
				errorMessage.value = "Please enter a valid order ID.";
				return;
			}
			invoiceNumber.value = invoice;
			loading.value = true;
			errorMessage.value = "";
			router.get("/account/track-order", { invoice }, {
				preserveState: true,
				preserveScroll: true,
				onFinish: () => {
					loading.value = false;
				}
			});
		};
		const formatDate = (dateString) => dateString ? new Intl.DateTimeFormat("en-GB", {
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
		const statusLabel = (status) => String(status || "Pending").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
		const onCopy = () => p.success("কপি হয়েছে!");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-00ae760f${_scopeId}>Track Order</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Track Order")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="track-page" data-v-00ae760f${_scopeId}><div class="section-header" data-v-00ae760f${_scopeId}><span class="section-header-icon" data-v-00ae760f${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-heading.svg")} alt="" data-v-00ae760f${_scopeId}></span><div data-v-00ae760f${_scopeId}><p class="section-header-title" data-v-00ae760f${_scopeId}>Track Order</p><p class="section-header-subtitle" data-v-00ae760f${_scopeId}>অর্ডার ট্র্যাক</p></div></div><section class="track-card track-search-card" data-v-00ae760f${_scopeId}><div class="track-card-heading" data-v-00ae760f${_scopeId}><h2 data-v-00ae760f${_scopeId}>Track Your Order</h2><p data-v-00ae760f${_scopeId}>Enter your order ID to see real-time status</p></div><div class="track-search-row" data-v-00ae760f${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", invoiceNumber.value)} type="text" placeholder="e.g. CHK-2025-0481" class="track-search-input" data-v-00ae760f${_scopeId}><button type="button" class="track-search-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(loading.value) ? " disabled" : ""} data-v-00ae760f${_scopeId}>`);
						if (!loading.value) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-button.svg")} alt="" data-v-00ae760f${_scopeId}>`);
						else _push(`<span class="track-spinner" aria-hidden="true" data-v-00ae760f${_scopeId}></span>`);
						_push(` ${(0, server_renderer_exports.ssrInterpolate)(loading.value ? "Searching..." : "Track")}</button></div>`);
						if (errorMessage.value) _push(`<p class="track-error" role="alert" data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errorMessage.value)}</p>`);
						else _push(`<!---->`);
						_push(`</section>`);
						if (orderData.value) {
							_push(`<div class="track-results" data-v-00ae760f${_scopeId}><section class="track-card track-summary-card" data-v-00ae760f${_scopeId}><div class="track-summary-header" data-v-00ae760f${_scopeId}><div class="track-summary-copy" data-v-00ae760f${_scopeId}><p class="track-summary-label" data-v-00ae760f${_scopeId}>ORDER ID</p><p class="track-summary-value" data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.invoice_number)}</p><p class="track-summary-meta" data-v-00ae760f${_scopeId}>Placed on ${(0, server_renderer_exports.ssrInterpolate)(formatDate(orderData.value.created_at))}</p></div><span class="order-status-pill" style="${(0, server_renderer_exports.ssrRenderStyle)(badgeStyle(orderData.value.order_status))}" data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(statusLabel(orderData.value.order_status))}</span></div><p class="track-summary-address" data-v-00ae760f${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/track-location.svg")} alt="" data-v-00ae760f${_scopeId}><span data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.address || "কোনো ঠিকানা নেই")}</span></p></section>`);
							if (!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status)) {
								_push(`<section class="track-card track-progress-card" data-v-00ae760f${_scopeId}><h2 class="track-section-title" data-v-00ae760f${_scopeId}>Shipment Progress</h2>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(OrderStepper_default, {
									variant: "vertical",
									"current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(orderData.value.order_status) ?? 0,
									"placed-at": orderData.value.created_at,
									"updated-at": orderData.value.updated_at
								}, null, _parent, _scopeId));
								_push(`</section>`);
							} else _push(`<!---->`);
							_push(`<section class="track-card track-items-card" data-v-00ae760f${_scopeId}><div class="order-items" data-v-00ae760f${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(orderData.value.items || [], (item, idx) => {
								_push(`<div class="order-item-row" data-v-00ae760f${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product?.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product?.product_name || "")} class="order-item-thumb" loading="lazy" decoding="async" data-v-00ae760f${_scopeId}><div class="order-item-info" data-v-00ae760f${_scopeId}><p class="order-item-name" data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product?.product_name || "পণ্য")}</p><p class="order-item-qty" data-v-00ae760f${_scopeId}>Qty: ${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</p></div><p class="order-item-price" data-v-00ae760f${_scopeId}><span data-v-00ae760f${_scopeId}>৳</span>${(0, server_renderer_exports.ssrInterpolate)(formatMoney(item.price))}</p></div>`);
							});
							_push(`<!--]--></div><div class="track-total-row" data-v-00ae760f${_scopeId}><span data-v-00ae760f${_scopeId}>Total</span><span class="track-total-price" data-v-00ae760f${_scopeId}><span data-v-00ae760f${_scopeId}>৳</span>${(0, server_renderer_exports.ssrInterpolate)(formatMoney(orderData.value.total_price))}</span></div>`);
							if (orderData.value.payment_summary) _push(`<div class="track-payment-row" data-v-00ae760f${_scopeId}><span data-v-00ae760f${_scopeId}>পেমেন্ট</span><span data-v-00ae760f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.payment_summary)}</span></div>`);
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
						})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "section-header-title" }, "Track Order"), (0, vue_exports.createVNode)("p", { class: "section-header-subtitle" }, "অর্ডার ট্র্যাক")])]),
						(0, vue_exports.createVNode)("section", { class: "track-card track-search-card" }, [
							(0, vue_exports.createVNode)("div", { class: "track-card-heading" }, [(0, vue_exports.createVNode)("h2", null, "Track Your Order"), (0, vue_exports.createVNode)("p", null, "Enter your order ID to see real-time status")]),
							(0, vue_exports.createVNode)("div", { class: "track-search-row" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								"onUpdate:modelValue": ($event) => invoiceNumber.value = $event,
								type: "text",
								placeholder: "e.g. CHK-2025-0481",
								class: "track-search-input",
								onKeyup: (0, vue_exports.withKeys)(trackOrder, ["enter"])
							}, null, 40, ["onUpdate:modelValue"]), [[vue_exports.vModelText, invoiceNumber.value]]), (0, vue_exports.createVNode)("button", {
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
							})), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(loading.value ? "Searching..." : "Track"), 1)], 8, ["disabled"])]),
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
								(0, vue_exports.createVNode)("p", { class: "track-summary-label" }, "ORDER ID"),
								(0, vue_exports.createVNode)("p", { class: "track-summary-value" }, (0, vue_exports.toDisplayString)(orderData.value.invoice_number), 1),
								(0, vue_exports.createVNode)("p", { class: "track-summary-meta" }, "Placed on " + (0, vue_exports.toDisplayString)(formatDate(orderData.value.created_at)), 1)
							]), (0, vue_exports.createVNode)("span", {
								class: "order-status-pill",
								style: badgeStyle(orderData.value.order_status)
							}, (0, vue_exports.toDisplayString)(statusLabel(orderData.value.order_status)), 5)]), (0, vue_exports.createVNode)("p", { class: "track-summary-address" }, [(0, vue_exports.createVNode)("img", {
								src: "/assets/images/account/track-location.svg",
								alt: ""
							}), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(orderData.value.address || "কোনো ঠিকানা নেই"), 1)])]),
							!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
								key: 0,
								class: "track-card track-progress-card"
							}, [(0, vue_exports.createVNode)("h2", { class: "track-section-title" }, "Shipment Progress"), (0, vue_exports.createVNode)(OrderStepper_default, {
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
										(0, vue_exports.createVNode)("div", { class: "order-item-info" }, [(0, vue_exports.createVNode)("p", { class: "order-item-name" }, (0, vue_exports.toDisplayString)(item.product?.product_name || "পণ্য"), 1), (0, vue_exports.createVNode)("p", { class: "order-item-qty" }, "Qty: " + (0, vue_exports.toDisplayString)(item.quantity), 1)]),
										(0, vue_exports.createVNode)("p", { class: "order-item-price" }, [(0, vue_exports.createVNode)("span", null, "৳"), (0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatMoney(item.price)), 1)])
									]);
								}), 128))]),
								(0, vue_exports.createVNode)("div", { class: "track-total-row" }, [(0, vue_exports.createVNode)("span", null, "Total"), (0, vue_exports.createVNode)("span", { class: "track-total-price" }, [(0, vue_exports.createVNode)("span", null, "৳"), (0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatMoney(orderData.value.total_price)), 1)])]),
								orderData.value.payment_summary ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 0,
									class: "track-payment-row"
								}, [(0, vue_exports.createVNode)("span", null, "পেমেন্ট"), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(orderData.value.payment_summary), 1)])) : (0, vue_exports.createCommentVNode)("", true)
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
var TrackOrder_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-00ae760f"]]);
//#endregion
export { TrackOrder_default as default };

//# sourceMappingURL=TrackOrder-DtWZzlbB.js.map