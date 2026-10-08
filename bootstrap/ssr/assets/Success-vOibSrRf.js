import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-BWP1wqVC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
import { t as on } from "./cms-BWXg6J9T.js";
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
		/** Taka, grouped, and without the float noise of adding prices in the template. */
		const money = (value) => "৳" + Number(value || 0).toLocaleString("en-BD", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		});
		/** The chosen options for a line, e.g. "Red, M". */
		const variantOf = (item) => (item.options ?? []).map((option) => option.attribute_option?.name).filter(Boolean).join(", ");
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
		const STATUS_BN = {
			pending: "পেন্ডিং",
			processed: "প্রসেসিং",
			shipped: "শিপড",
			"on delivery": "ডেলিভারিতে",
			"pending delivery": "ডেলিভারির অপেক্ষায়",
			delivered: "ডেলিভারড",
			returned: "রিটার্নড",
			cancelled: "বাতিল",
			"pre order": "প্রি-অর্ডার",
			incomplete: "অসম্পূর্ণ"
		};
		const statusLabel = (status) => STATUS_BN[(status || "").toLowerCase()] || status;
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
					if (_push) _push(`<title data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.tab_title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.tab_title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="success-page" role="dialog" aria-modal="true" aria-labelledby="order-success-title" data-v-db8858b0${_scopeId}><div class="success-card" data-v-db8858b0${_scopeId}><div class="success-content" data-v-db8858b0${_scopeId}><div class="success-head" data-v-db8858b0${_scopeId}><h1 id="order-success-title" class="success-title" data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.title)}</h1>`);
						if ((0, vue_exports.unref)(on)(__props.texts.text_show)) _push(`<p class="success-desc" data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.text)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="success-box" data-v-db8858b0${_scopeId}><p class="success-line success-line--invoice" data-v-db8858b0${_scopeId}><span data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.invoice_label)}</span> <strong data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.invoice_number)}</strong></p><p class="success-line" data-v-db8858b0${_scopeId}><span data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.customer_label)}</span> <strong data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.order.customer_name || "—")}</strong></p><p class="success-line" data-v-db8858b0${_scopeId}><span data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.total_label)}</span> <strong data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(money(__props.totals.grand))}</strong></p><p class="success-line success-line--status" data-v-db8858b0${_scopeId}><span data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.status_label)}</span><span class="${(0, server_renderer_exports.ssrRenderClass)([getStatusClass(__props.order.order_status), "status-label"])}" data-v-db8858b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(statusLabel(__props.order.order_status))}</span></p></div></div>`);
						if ((0, vue_exports.unref)(on)(__props.texts.button_show)) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: __props.texts.button_url || "/",
							class: "home-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.button_label)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.button_label), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", {
						class: "success-page",
						role: "dialog",
						"aria-modal": "true",
						"aria-labelledby": "order-success-title"
					}, [(0, vue_exports.createVNode)("div", { class: "success-card" }, [(0, vue_exports.createVNode)("div", { class: "success-content" }, [(0, vue_exports.createVNode)("div", { class: "success-head" }, [(0, vue_exports.createVNode)("h1", {
						id: "order-success-title",
						class: "success-title"
					}, (0, vue_exports.toDisplayString)(__props.texts.title), 1), (0, vue_exports.unref)(on)(__props.texts.text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
						key: 0,
						class: "success-desc"
					}, (0, vue_exports.toDisplayString)(__props.texts.text), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "success-box" }, [
						(0, vue_exports.createVNode)("p", { class: "success-line success-line--invoice" }, [
							(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.texts.invoice_label), 1),
							(0, vue_exports.createTextVNode)(),
							(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(__props.order.invoice_number), 1)
						]),
						(0, vue_exports.createVNode)("p", { class: "success-line" }, [
							(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.texts.customer_label), 1),
							(0, vue_exports.createTextVNode)(),
							(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(__props.order.customer_name || "—"), 1)
						]),
						(0, vue_exports.createVNode)("p", { class: "success-line" }, [
							(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.texts.total_label), 1),
							(0, vue_exports.createTextVNode)(),
							(0, vue_exports.createVNode)("strong", null, (0, vue_exports.toDisplayString)(money(__props.totals.grand)), 1)
						]),
						(0, vue_exports.createVNode)("p", { class: "success-line success-line--status" }, [(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.texts.status_label), 1), (0, vue_exports.createVNode)("span", { class: [getStatusClass(__props.order.order_status), "status-label"] }, (0, vue_exports.toDisplayString)(statusLabel(__props.order.order_status)), 3)])
					])]), (0, vue_exports.unref)(on)(__props.texts.button_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
						key: 0,
						href: __props.texts.button_url || "/",
						class: "home-btn"
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.button_label), 1)]),
						_: 1
					}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true)])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
var Success_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-db8858b0"]]);
//#endregion
export { Success_default as default };

//# sourceMappingURL=Success-vOibSrRf.js.map