import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { g as createLucideIcon, t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region node_modules/lucide-vue-next/dist/esm/icons/check.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("CheckIcon", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
//#endregion
//#region resources/js/Pages/Public/Success.vue
var _sfc_main = {
	__name: "Success",
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
		order: Object,
		totals: {
			type: Object,
			default: () => ({})
		},
		paymentSummary: {
			type: String,
			default: ""
		},
		checkoutMessage: String
	},
	setup(__props) {
		const props = __props;
		const items = (0, vue_exports.computed)(() => props.order?.items ?? []);
		const discount = (0, vue_exports.computed)(() => Number(props.totals.item_discount || 0) + Number(props.totals.order_discount || 0));
		/** Taka, grouped, and without the float noise of adding prices in the template. */
		const money = (value) => "৳" + Number(value || 0).toLocaleString("en-BD", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		});
		/** The chosen options for a line, e.g. "Red, M". */
		const variantOf = (item) => (item.options ?? []).map((option) => option.attribute_option?.name).filter(Boolean).join(", ");
		/**
		* The labels are written in the admin with their punctuation ("Invoice #:"),
		* which suited the old run-on layout. Here they head their own column, so the
		* trailing colon is dropped rather than making shop owners re-edit them.
		*/
		const stripLabel = (label) => String(label ?? "").replace(/\s*[:：]\s*$/, "");
		const pushPurchaseEvent = () => {
			if (typeof window === "undefined") return;
			try {
				if (!window.dataLayer) window.dataLayer = [];
				if (!props.order || !props.order.id) {
					console.error("[ERROR] Order is missing or invalid. Event not pushed.");
					return;
				}
				window.dataLayer.push({ ecommerce: null });
				window.dataLayer.push({
					event: "purchase",
					ecommerce: {
						transaction_id: props.order.invoice_number || props.order.id,
						value: props.order.total_price,
						shipping: props.order.delivery_charge || 0,
						currency: "BDT",
						items: props.order.items?.map((item) => ({
							item_name: item.product?.product_name || "Unknown Product",
							item_id: item.product_id || "N/A",
							price: item.price || 0,
							quantity: item.quantity || 0,
							item_category: item.product?.category?.name || "",
							item_variant: variantOf(item)
						})) || []
					}
				});
			} catch (err) {
				console.error("[ERROR] Failed to push purchase event:", err);
			}
		};
		(0, vue_exports.watch)(() => props.order, (newOrder) => {
			if (newOrder && newOrder.id) pushPurchaseEvent();
		}, { immediate: true });
		const getStatusClass = (status) => {
			switch (status?.toLowerCase()) {
				case "pending": return "status-pending";
				case "processed": return "status-processed";
				case "shipped": return "status-shipped";
				case "returned": return "status-returned";
				case "delivered": return "status-delivered";
				case "cancelled": return "status-cancelled";
				case "on delivery": return "status-on-delivery";
				case "pending delivery": return "status-pending-delivery";
				case "pre order": return "status-pre-order";
				case "incomplete": return "status-incomplete";
				default: return "status-default";
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="success-page" data-v-99a363a2${_scopeId}><div class="success-card" data-v-99a363a2${_scopeId}><div class="success-head" data-v-99a363a2${_scopeId}><span class="success-tick" aria-hidden="true" data-v-99a363a2${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Check), {
							size: 26,
							"stroke-width": 3
						}, null, _parent, _scopeId));
						_push(`</span><h1 class="success-title" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</h1>`);
						if (__props.checkoutMessage) _push(`<p class="success-desc" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.checkoutMessage)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="order-strip" data-v-99a363a2${_scopeId}><div class="order-strip-item" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(stripLabel(__props.texts.t3))}</span><span class="order-invoice" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.invoice_number)}</span></div><div class="order-strip-item is-end" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(stripLabel(__props.texts.t6))}</span><span class="${(0, server_renderer_exports.ssrRenderClass)([getStatusClass(__props.order.order_status), "status-label capitalize"])}" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.order_status)}</span></div></div>`);
						if (items.value.length) {
							_push(`<ul class="order-items" data-v-99a363a2${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(items.value, (item) => {
								_push(`<li class="order-item" data-v-99a363a2${_scopeId}>`);
								if (item.product?.featured_image) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product?.product_name || "")} class="order-item-img" width="56" height="56" loading="lazy" data-v-99a363a2${_scopeId}>`);
								else _push(`<!---->`);
								_push(`<div class="order-item-body" data-v-99a363a2${_scopeId}><p class="order-item-name" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product?.product_name || "—")}</p>`);
								if (variantOf(item)) _push(`<p class="order-item-variant" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(variantOf(item))}</p>`);
								else _push(`<!---->`);
								_push(`<p class="order-item-qty" data-v-99a363a2${_scopeId}>× ${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</p></div><p class="order-item-price" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(item.quantity * Number(item.price)))}</p></li>`);
							});
							_push(`<!--]--></ul>`);
						} else _push(`<!---->`);
						_push(`<dl class="order-sums" data-v-99a363a2${_scopeId}>`);
						if (__props.totals.subtotal) _push(`<div class="order-sum" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>Subtotal</dt><dd data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.subtotal))}</dd></div>`);
						else _push(`<!---->`);
						if (discount.value > 0) _push(`<div class="order-sum is-discount" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>Discount</dt><dd data-v-99a363a2${_scopeId}>− ${(0, server_renderer_exports.ssrInterpolate)(money(discount.value))}</dd></div>`);
						else _push(`<!---->`);
						if (__props.totals.shipping) _push(`<div class="order-sum" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>Delivery</dt><dd data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.shipping))}</dd></div>`);
						else _push(`<!---->`);
						_push(`<div class="order-sum is-total" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(stripLabel(__props.texts.t5))}</dt><dd data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.grand))}</dd></div>`);
						if (Number(__props.totals.paid) > 0) _push(`<!--[--><div class="order-sum" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>Paid</dt><dd data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.paid))}</dd></div><div class="order-sum" data-v-99a363a2${_scopeId}><dt data-v-99a363a2${_scopeId}>Due on delivery</dt><dd data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.due))}</dd></div><!--]-->`);
						else _push(`<!---->`);
						_push(`</dl><div class="order-meta" data-v-99a363a2${_scopeId}><div class="order-meta-row" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(stripLabel(__props.texts.t4))}</span><span class="order-meta-value" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.customer_name || "—")}</span></div>`);
						if (__props.order.phone_number) _push(`<div class="order-meta-row" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>Phone</span><span class="order-meta-value" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.phone_number)}</span></div>`);
						else _push(`<!---->`);
						if (__props.order.address) _push(`<div class="order-meta-row" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>Delivery to</span><span class="order-meta-value" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.address)}</span></div>`);
						else _push(`<!---->`);
						if (__props.paymentSummary) _push(`<div class="order-meta-row" data-v-99a363a2${_scopeId}><span class="order-label" data-v-99a363a2${_scopeId}>Payment</span><span class="order-meta-value" data-v-99a363a2${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.paymentSummary)}</span></div>`);
						else _push(`<!---->`);
						_push(`</div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/",
							class: "home-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t7)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t7), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", { class: "success-page" }, [(0, vue_exports.createVNode)("div", { class: "success-card" }, [
						(0, vue_exports.createVNode)("div", { class: "success-head" }, [
							(0, vue_exports.createVNode)("span", {
								class: "success-tick",
								"aria-hidden": "true"
							}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Check), {
								size: 26,
								"stroke-width": 3
							})]),
							(0, vue_exports.createVNode)("h1", { class: "success-title" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1),
							__props.checkoutMessage ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "success-desc"
							}, (0, vue_exports.toDisplayString)(__props.checkoutMessage), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("div", { class: "order-strip" }, [(0, vue_exports.createVNode)("div", { class: "order-strip-item" }, [(0, vue_exports.createVNode)("span", { class: "order-label" }, (0, vue_exports.toDisplayString)(stripLabel(__props.texts.t3)), 1), (0, vue_exports.createVNode)("span", { class: "order-invoice" }, (0, vue_exports.toDisplayString)(__props.order.invoice_number), 1)]), (0, vue_exports.createVNode)("div", { class: "order-strip-item is-end" }, [(0, vue_exports.createVNode)("span", { class: "order-label" }, (0, vue_exports.toDisplayString)(stripLabel(__props.texts.t6)), 1), (0, vue_exports.createVNode)("span", { class: [getStatusClass(__props.order.order_status), "status-label capitalize"] }, (0, vue_exports.toDisplayString)(__props.order.order_status), 3)])]),
						items.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("ul", {
							key: 0,
							class: "order-items"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(items.value, (item) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", {
								key: item.id,
								class: "order-item"
							}, [
								item.product?.featured_image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
									key: 0,
									src: item.product.featured_image,
									alt: item.product?.product_name || "",
									class: "order-item-img",
									width: "56",
									height: "56",
									loading: "lazy"
								}, null, 8, ["src", "alt"])) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("div", { class: "order-item-body" }, [
									(0, vue_exports.createVNode)("p", { class: "order-item-name" }, (0, vue_exports.toDisplayString)(item.product?.product_name || "—"), 1),
									variantOf(item) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
										key: 0,
										class: "order-item-variant"
									}, (0, vue_exports.toDisplayString)(variantOf(item)), 1)) : (0, vue_exports.createCommentVNode)("", true),
									(0, vue_exports.createVNode)("p", { class: "order-item-qty" }, "× " + (0, vue_exports.toDisplayString)(item.quantity), 1)
								]),
								(0, vue_exports.createVNode)("p", { class: "order-item-price" }, (0, vue_exports.toDisplayString)(money(item.quantity * Number(item.price))), 1)
							]);
						}), 128))])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)("dl", { class: "order-sums" }, [
							__props.totals.subtotal ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "order-sum"
							}, [(0, vue_exports.createVNode)("dt", null, "Subtotal"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(money(__props.totals.subtotal)), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							discount.value > 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "order-sum is-discount"
							}, [(0, vue_exports.createVNode)("dt", null, "Discount"), (0, vue_exports.createVNode)("dd", null, "− " + (0, vue_exports.toDisplayString)(money(discount.value)), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							__props.totals.shipping ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								class: "order-sum"
							}, [(0, vue_exports.createVNode)("dt", null, "Delivery"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(money(__props.totals.shipping)), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("div", { class: "order-sum is-total" }, [(0, vue_exports.createVNode)("dt", null, (0, vue_exports.toDisplayString)(stripLabel(__props.texts.t5)), 1), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(money(__props.totals.grand)), 1)]),
							Number(__props.totals.paid) > 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 3 }, [(0, vue_exports.createVNode)("div", { class: "order-sum" }, [(0, vue_exports.createVNode)("dt", null, "Paid"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(money(__props.totals.paid)), 1)]), (0, vue_exports.createVNode)("div", { class: "order-sum" }, [(0, vue_exports.createVNode)("dt", null, "Due on delivery"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(money(__props.totals.due)), 1)])], 64)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("div", { class: "order-meta" }, [
							(0, vue_exports.createVNode)("div", { class: "order-meta-row" }, [(0, vue_exports.createVNode)("span", { class: "order-label" }, (0, vue_exports.toDisplayString)(stripLabel(__props.texts.t4)), 1), (0, vue_exports.createVNode)("span", { class: "order-meta-value" }, (0, vue_exports.toDisplayString)(__props.order.customer_name || "—"), 1)]),
							__props.order.phone_number ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "order-meta-row"
							}, [(0, vue_exports.createVNode)("span", { class: "order-label" }, "Phone"), (0, vue_exports.createVNode)("span", { class: "order-meta-value" }, (0, vue_exports.toDisplayString)(__props.order.phone_number), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							__props.order.address ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "order-meta-row"
							}, [(0, vue_exports.createVNode)("span", { class: "order-label" }, "Delivery to"), (0, vue_exports.createVNode)("span", { class: "order-meta-value" }, (0, vue_exports.toDisplayString)(__props.order.address), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							__props.paymentSummary ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								class: "order-meta-row"
							}, [(0, vue_exports.createVNode)("span", { class: "order-label" }, "Payment"), (0, vue_exports.createVNode)("span", { class: "order-meta-value" }, (0, vue_exports.toDisplayString)(__props.paymentSummary), 1)])) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
							href: "/",
							class: "home-btn"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t7), 1)]),
							_: 1
						})
					])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Success.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Success_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-99a363a2"]]);
//#endregion
export { Success_default as default };

//# sourceMappingURL=Success-C9TrDtOC.js.map