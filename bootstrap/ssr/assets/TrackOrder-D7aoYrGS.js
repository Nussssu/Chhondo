import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AccountLayout_default } from "./AccountLayout-iiBSX4dz.js";
import { i as isExceptionStatus, n as getOrderStatusBadge, r as getOrderStepIndex, t as OrderStepper_default } from "./OrderStepper-BtEO-cjo.js";
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
		(0, vue_exports.watch)(() => page.props.orderData, (val) => {
			orderData.value = val;
			errorMessage.value = !val && invoiceNumber.value ? "Order not found." : "";
		});
		const trackOrder = () => {
			if (!invoiceNumber.value) {
				errorMessage.value = "Please enter a valid order ID.";
				return;
			}
			loading.value = true;
			errorMessage.value = "";
			router.get("/account/track-order", { invoice: invoiceNumber.value }, {
				preserveState: true,
				preserveScroll: true,
				onFinish: () => {
					loading.value = false;
				}
			});
		};
		const formatDate = (dateString) => {
			return new Date(dateString).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric"
			});
		};
		const badgeStyle = (status) => {
			const { bg, text } = getOrderStatusBadge(status);
			return {
				backgroundColor: bg,
				color: text
			};
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-ef9882ef${_scopeId}>Track Order</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Track Order")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="track-page" data-v-ef9882ef${_scopeId}><div class="section-header" data-v-ef9882ef${_scopeId}><span class="section-header-icon" data-v-ef9882ef${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/nav-track-order.svg")} alt="" data-v-ef9882ef${_scopeId}></span><div data-v-ef9882ef${_scopeId}><p class="section-header-title" data-v-ef9882ef${_scopeId}>Track Order</p><p class="section-header-subtitle" data-v-ef9882ef${_scopeId}>অর্ডার ট্র্যাক</p></div></div><div class="track-card" data-v-ef9882ef${_scopeId}><p class="track-card-title" data-v-ef9882ef${_scopeId}>Track Your Order</p><p class="track-card-subtitle" data-v-ef9882ef${_scopeId}>Enter your order ID to see real-time status</p><div class="track-search-row" data-v-ef9882ef${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", invoiceNumber.value)} type="text" placeholder="e.g. CHK-2025-0481" class="track-search-input" data-v-ef9882ef${_scopeId}><button type="button" class="track-search-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(loading.value) ? " disabled" : ""} data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(loading.value ? "Searching..." : "Track")}</button></div>`);
						if (errorMessage.value) _push(`<p class="track-error" data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errorMessage.value)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if (orderData.value) {
							_push(`<div class="track-results" data-v-ef9882ef${_scopeId}><div class="track-card" data-v-ef9882ef${_scopeId}><div class="track-summary-header" data-v-ef9882ef${_scopeId}><div data-v-ef9882ef${_scopeId}><p class="track-summary-label" data-v-ef9882ef${_scopeId}>ORDER ID</p><p class="track-summary-value" data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.invoice_number)}</p><p class="track-summary-meta" data-v-ef9882ef${_scopeId}>Placed on ${(0, server_renderer_exports.ssrInterpolate)(formatDate(orderData.value.created_at))}</p></div><span class="order-status-pill" style="${(0, server_renderer_exports.ssrRenderStyle)(badgeStyle(orderData.value.order_status))}" data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.order_status)}</span></div><p class="track-summary-address" data-v-ef9882ef${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/location-pin.svg")} alt="" data-v-ef9882ef${_scopeId}> ${(0, server_renderer_exports.ssrInterpolate)(orderData.value.address || "No address on file")}</p></div>`);
							if (!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status)) {
								_push(`<div class="track-card" data-v-ef9882ef${_scopeId}><p class="track-card-title" data-v-ef9882ef${_scopeId}>Shipment Progress</p>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(OrderStepper_default, { "current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(orderData.value.order_status) ?? 0 }, null, _parent, _scopeId));
								_push(`</div>`);
							} else _push(`<!---->`);
							_push(`<div class="track-card" data-v-ef9882ef${_scopeId}><p class="track-card-title" data-v-ef9882ef${_scopeId}>Items in this Order</p><div class="order-items" data-v-ef9882ef${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(orderData.value.items, (item, idx) => {
								_push(`<div class="order-item-row" data-v-ef9882ef${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product?.featured_image || "/placeholder.svg")} alt="" class="order-item-thumb" data-v-ef9882ef${_scopeId}><div class="order-item-info" data-v-ef9882ef${_scopeId}><p class="order-item-name" data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product?.product_name)}</p><p class="order-item-qty" data-v-ef9882ef${_scopeId}>Qty: ${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</p></div><p class="order-item-price" data-v-ef9882ef${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(item.price)}</p></div>`);
							});
							_push(`<!--]--></div><div class="track-total-row" data-v-ef9882ef${_scopeId}><span data-v-ef9882ef${_scopeId}>Total</span><span data-v-ef9882ef${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(orderData.value.total_price)}</span></div>`);
							if (orderData.value.payment_summary) _push(`<div class="track-payment-row" data-v-ef9882ef${_scopeId}><span data-v-ef9882ef${_scopeId}>Payment</span><span data-v-ef9882ef${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(orderData.value.payment_summary)}</span></div>`);
							else _push(`<!---->`);
							_push(`</div></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "track-page" }, [
						(0, vue_exports.createVNode)("div", { class: "section-header" }, [(0, vue_exports.createVNode)("span", { class: "section-header-icon" }, [(0, vue_exports.createVNode)("img", {
							src: "/assets/images/account/nav-track-order.svg",
							alt: ""
						})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "section-header-title" }, "Track Order"), (0, vue_exports.createVNode)("p", { class: "section-header-subtitle" }, "অর্ডার ট্র্যাক")])]),
						(0, vue_exports.createVNode)("div", { class: "track-card" }, [
							(0, vue_exports.createVNode)("p", { class: "track-card-title" }, "Track Your Order"),
							(0, vue_exports.createVNode)("p", { class: "track-card-subtitle" }, "Enter your order ID to see real-time status"),
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
							}, (0, vue_exports.toDisplayString)(loading.value ? "Searching..." : "Track"), 9, ["disabled"])]),
							errorMessage.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "track-error"
							}, (0, vue_exports.toDisplayString)(errorMessage.value), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						orderData.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "track-results"
						}, [
							(0, vue_exports.createVNode)("div", { class: "track-card" }, [(0, vue_exports.createVNode)("div", { class: "track-summary-header" }, [(0, vue_exports.createVNode)("div", null, [
								(0, vue_exports.createVNode)("p", { class: "track-summary-label" }, "ORDER ID"),
								(0, vue_exports.createVNode)("p", { class: "track-summary-value" }, (0, vue_exports.toDisplayString)(orderData.value.invoice_number), 1),
								(0, vue_exports.createVNode)("p", { class: "track-summary-meta" }, "Placed on " + (0, vue_exports.toDisplayString)(formatDate(orderData.value.created_at)), 1)
							]), (0, vue_exports.createVNode)("span", {
								class: "order-status-pill",
								style: badgeStyle(orderData.value.order_status)
							}, (0, vue_exports.toDisplayString)(orderData.value.order_status), 5)]), (0, vue_exports.createVNode)("p", { class: "track-summary-address" }, [(0, vue_exports.createVNode)("img", {
								src: "/assets/images/account/location-pin.svg",
								alt: ""
							}), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(orderData.value.address || "No address on file"), 1)])]),
							!(0, vue_exports.unref)(isExceptionStatus)(orderData.value.order_status) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "track-card"
							}, [(0, vue_exports.createVNode)("p", { class: "track-card-title" }, "Shipment Progress"), (0, vue_exports.createVNode)(OrderStepper_default, { "current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(orderData.value.order_status) ?? 0 }, null, 8, ["current-step-index"])])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("div", { class: "track-card" }, [
								(0, vue_exports.createVNode)("p", { class: "track-card-title" }, "Items in this Order"),
								(0, vue_exports.createVNode)("div", { class: "order-items" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(orderData.value.items, (item, idx) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: idx,
										class: "order-item-row"
									}, [
										(0, vue_exports.createVNode)("img", {
											src: item.product?.featured_image || "/placeholder.svg",
											alt: "",
											class: "order-item-thumb"
										}, null, 8, ["src"]),
										(0, vue_exports.createVNode)("div", { class: "order-item-info" }, [(0, vue_exports.createVNode)("p", { class: "order-item-name" }, (0, vue_exports.toDisplayString)(item.product?.product_name), 1), (0, vue_exports.createVNode)("p", { class: "order-item-qty" }, "Qty: " + (0, vue_exports.toDisplayString)(item.quantity), 1)]),
										(0, vue_exports.createVNode)("p", { class: "order-item-price" }, "৳" + (0, vue_exports.toDisplayString)(item.price), 1)
									]);
								}), 128))]),
								(0, vue_exports.createVNode)("div", { class: "track-total-row" }, [(0, vue_exports.createVNode)("span", null, "Total"), (0, vue_exports.createVNode)("span", null, "৳" + (0, vue_exports.toDisplayString)(orderData.value.total_price), 1)]),
								orderData.value.payment_summary ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 0,
									class: "track-payment-row"
								}, [(0, vue_exports.createVNode)("span", null, "Payment"), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(orderData.value.payment_summary), 1)])) : (0, vue_exports.createCommentVNode)("", true)
							])
						])) : (0, vue_exports.createCommentVNode)("", true)
					])];
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
var TrackOrder_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-ef9882ef"]]);
//#endregion
export { TrackOrder_default as default };

//# sourceMappingURL=TrackOrder-D7aoYrGS.js.map