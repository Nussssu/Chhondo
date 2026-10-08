import { c as server_renderer_exports, i as link_default, l as vue_exports, o as usePage, r as head_default } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AccountLayout_default } from "./AccountLayout-CI_V1QvX.js";
import { i as isExceptionStatus, n as getOrderStatusBadge, r as getOrderStepIndex, t as OrderStepper_default } from "./OrderStepper-B1zCbmcd.js";
//#region resources/js/Pages/Public/Account/OrderList.vue
var _sfc_main = {
	__name: "OrderList",
	__ssrInlineRender: true,
	setup(__props) {
		const page = usePage();
		const orders = (0, vue_exports.ref)(page.props.orders || []);
		(0, vue_exports.watch)(() => page.props.orders, (val) => {
			orders.value = val || [];
		});
		const expandedId = (0, vue_exports.ref)(null);
		const copyNotice = (0, vue_exports.ref)(false);
		let copyNoticeTimer;
		const showCopyNotice = () => {
			copyNotice.value = true;
			window.clearTimeout(copyNoticeTimer);
			copyNoticeTimer = window.setTimeout(() => {
				copyNotice.value = false;
			}, 2200);
		};
		(0, vue_exports.onBeforeUnmount)(() => window.clearTimeout(copyNoticeTimer));
		const toggle = (id) => {
			expandedId.value = expandedId.value === id ? null : id;
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
		const copyId = async (invoice) => {
			const text = String(invoice ?? "");
			const legacyCopy = () => {
				const ta = document.createElement("textarea");
				ta.value = text;
				ta.setAttribute("readonly", "");
				ta.style.position = "fixed";
				ta.style.left = "-9999px";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				ta.setSelectionRange(0, ta.value.length);
				const ok = document.execCommand("copy");
				document.body.removeChild(ta);
				if (!ok) throw new Error("copy failed");
			};
			try {
				if (navigator.clipboard?.writeText) try {
					await navigator.clipboard.writeText(text);
				} catch {
					legacyCopy();
				}
				else legacyCopy();
				showCopyNotice();
			} catch {
				copyNotice.value = false;
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-9ba250c9${_scopeId}>অর্ডার ইতিহাস</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "অর্ডার ইতিহাস")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="orders-page" data-v-9ba250c9${_scopeId}>`);
						if (copyNotice.value) _push(`<div class="copy-toast" role="status" aria-live="polite" data-v-9ba250c9${_scopeId}>Copied</div>`);
						else _push(`<!---->`);
						_push(`<div class="section-header" data-v-9ba250c9${_scopeId}><span class="section-header-icon" data-v-9ba250c9${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/nav-order-history.svg")} alt="" data-v-9ba250c9${_scopeId}></span><div data-v-9ba250c9${_scopeId}><p class="section-header-title" data-v-9ba250c9${_scopeId}>Order History</p><p class="section-header-subtitle" data-v-9ba250c9${_scopeId}>অর্ডার ইতিহাস</p></div></div>`);
						if (orders.value.length === 0) _push(`<p class="orders-empty" data-v-9ba250c9${_scopeId}>আপনি এখনো কোনো অর্ডার করেননি।</p>`);
						else {
							_push(`<div class="orders-list" data-v-9ba250c9${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(orders.value, (order) => {
								_push(`<div class="order-card" data-v-9ba250c9${_scopeId}><button type="button" class="order-card-header" data-v-9ba250c9${_scopeId}><span class="order-thumb" data-v-9ba250c9${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", order.items?.[0]?.product_info?.featured_image || "/placeholder.svg")} alt="" loading="lazy" decoding="async" data-v-9ba250c9${_scopeId}></span><span class="order-main" data-v-9ba250c9${_scopeId}><span class="order-id-row" data-v-9ba250c9${_scopeId}><span class="order-id" data-v-9ba250c9${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(order.invoice_number)}</span><span role="button" tabindex="0" class="order-copy-btn" title="Copy order ID" data-v-9ba250c9${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/copy.svg")} alt="" data-v-9ba250c9${_scopeId}></span></span><span class="order-meta" data-v-9ba250c9${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(order.created_at))} · ${(0, server_renderer_exports.ssrInterpolate)(order.items?.length || 0)} item${(0, server_renderer_exports.ssrInterpolate)((order.items?.length || 0) === 1 ? "" : "s")}</span></span><span class="order-right" data-v-9ba250c9${_scopeId}><span class="order-price" data-v-9ba250c9${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(order.total_price)}</span><span class="order-status-pill" style="${(0, server_renderer_exports.ssrRenderStyle)(badgeStyle(order.order_status))}" data-v-9ba250c9${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(order.order_status)}</span><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/expand-chevron.svg")} alt="" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-open": expandedId.value === order.id }, "order-expand-icon"])}" data-v-9ba250c9${_scopeId}></span></button>`);
								if (expandedId.value === order.id) {
									_push(`<div class="order-card-body" data-v-9ba250c9${_scopeId}>`);
									if (!(0, vue_exports.unref)(isExceptionStatus)(order.order_status)) _push((0, server_renderer_exports.ssrRenderComponent)(OrderStepper_default, { "current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(order.order_status) ?? 0 }, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`<div class="order-items" data-v-9ba250c9${_scopeId}><!--[-->`);
									(0, server_renderer_exports.ssrRenderList)(order.items, (item, idx) => {
										_push(`<div class="order-item-row" data-v-9ba250c9${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product_info?.featured_image || "/placeholder.svg")} alt="" class="order-item-thumb" loading="lazy" decoding="async" data-v-9ba250c9${_scopeId}><div class="order-item-info" data-v-9ba250c9${_scopeId}><p class="order-item-name" data-v-9ba250c9${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.product_info?.product_name)}</p><p class="order-item-qty" data-v-9ba250c9${_scopeId}>Qty: ${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</p></div><p class="order-item-price" data-v-9ba250c9${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(item.price)}</p></div>`);
									});
									_push(`<!--]--></div><div class="order-footer" data-v-9ba250c9${_scopeId}><span class="order-address" data-v-9ba250c9${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/location-pin.svg")} alt="" data-v-9ba250c9${_scopeId}> ${(0, server_renderer_exports.ssrInterpolate)(order.address || "কোনো ঠিকানা নেই")}</span>`);
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
										href: `/account/track-order?invoice=${order.invoice_number}`,
										class: "order-track-btn"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push(`ট্র্যাক করুন`);
											else return [(0, vue_exports.createTextVNode)("ট্র্যাক করুন")];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(`</div></div>`);
								} else _push(`<!---->`);
								_push(`</div>`);
							});
							_push(`<!--]--></div>`);
						}
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "orders-page" }, [
						(0, vue_exports.createVNode)(vue_exports.Transition, { name: "copy-toast" }, {
							default: (0, vue_exports.withCtx)(() => [copyNotice.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "copy-toast",
								role: "status",
								"aria-live": "polite"
							}, "Copied")) : (0, vue_exports.createCommentVNode)("", true)]),
							_: 1
						}),
						(0, vue_exports.createVNode)("div", { class: "section-header" }, [(0, vue_exports.createVNode)("span", { class: "section-header-icon" }, [(0, vue_exports.createVNode)("img", {
							src: "/assets/images/account/nav-order-history.svg",
							alt: ""
						})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "section-header-title" }, "Order History"), (0, vue_exports.createVNode)("p", { class: "section-header-subtitle" }, "অর্ডার ইতিহাস")])]),
						orders.value.length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "orders-empty"
						}, "আপনি এখনো কোনো অর্ডার করেননি।")) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: "orders-list"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(orders.value, (order) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: order.id,
								class: "order-card"
							}, [(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "order-card-header",
								onClick: ($event) => toggle(order.id)
							}, [
								(0, vue_exports.createVNode)("span", { class: "order-thumb" }, [(0, vue_exports.createVNode)("img", {
									src: order.items?.[0]?.product_info?.featured_image || "/placeholder.svg",
									alt: "",
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, ["src", "onError"])]),
								(0, vue_exports.createVNode)("span", { class: "order-main" }, [(0, vue_exports.createVNode)("span", { class: "order-id-row" }, [(0, vue_exports.createVNode)("span", { class: "order-id" }, (0, vue_exports.toDisplayString)(order.invoice_number), 1), (0, vue_exports.createVNode)("span", {
									role: "button",
									tabindex: "0",
									class: "order-copy-btn",
									title: "Copy order ID",
									onClick: (0, vue_exports.withModifiers)(($event) => copyId(order.invoice_number), ["stop"]),
									onKeydown: [(0, vue_exports.withKeys)((0, vue_exports.withModifiers)(($event) => copyId(order.invoice_number), ["stop", "prevent"]), ["enter"]), (0, vue_exports.withKeys)((0, vue_exports.withModifiers)(($event) => copyId(order.invoice_number), ["stop", "prevent"]), ["space"])]
								}, [(0, vue_exports.createVNode)("img", {
									src: "/assets/images/account/copy.svg",
									alt: ""
								})], 40, ["onClick", "onKeydown"])]), (0, vue_exports.createVNode)("span", { class: "order-meta" }, (0, vue_exports.toDisplayString)(formatDate(order.created_at)) + " · " + (0, vue_exports.toDisplayString)(order.items?.length || 0) + " item" + (0, vue_exports.toDisplayString)((order.items?.length || 0) === 1 ? "" : "s"), 1)]),
								(0, vue_exports.createVNode)("span", { class: "order-right" }, [
									(0, vue_exports.createVNode)("span", { class: "order-price" }, "৳" + (0, vue_exports.toDisplayString)(order.total_price), 1),
									(0, vue_exports.createVNode)("span", {
										class: "order-status-pill",
										style: badgeStyle(order.order_status)
									}, (0, vue_exports.toDisplayString)(order.order_status), 5),
									(0, vue_exports.createVNode)("img", {
										src: "/assets/images/account/expand-chevron.svg",
										alt: "",
										class: ["order-expand-icon", { "is-open": expandedId.value === order.id }]
									}, null, 2)
								])
							], 8, ["onClick"]), expandedId.value === order.id ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "order-card-body"
							}, [
								!(0, vue_exports.unref)(isExceptionStatus)(order.order_status) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(OrderStepper_default, {
									key: 0,
									"current-step-index": (0, vue_exports.unref)(getOrderStepIndex)(order.order_status) ?? 0
								}, null, 8, ["current-step-index"])) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("div", { class: "order-items" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(order.items, (item, idx) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: idx,
										class: "order-item-row"
									}, [
										(0, vue_exports.createVNode)("img", {
											src: item.product_info?.featured_image || "/placeholder.svg",
											alt: "",
											class: "order-item-thumb",
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, ["src", "onError"]),
										(0, vue_exports.createVNode)("div", { class: "order-item-info" }, [(0, vue_exports.createVNode)("p", { class: "order-item-name" }, (0, vue_exports.toDisplayString)(item.product_info?.product_name), 1), (0, vue_exports.createVNode)("p", { class: "order-item-qty" }, "Qty: " + (0, vue_exports.toDisplayString)(item.quantity), 1)]),
										(0, vue_exports.createVNode)("p", { class: "order-item-price" }, "৳" + (0, vue_exports.toDisplayString)(item.price), 1)
									]);
								}), 128))]),
								(0, vue_exports.createVNode)("div", { class: "order-footer" }, [(0, vue_exports.createVNode)("span", { class: "order-address" }, [(0, vue_exports.createVNode)("img", {
									src: "/assets/images/account/location-pin.svg",
									alt: ""
								}), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(order.address || "কোনো ঠিকানা নেই"), 1)]), (0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
									href: `/account/track-order?invoice=${order.invoice_number}`,
									class: "order-track-btn"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("ট্র্যাক করুন")]),
									_: 1
								}, 8, ["href"])])
							])) : (0, vue_exports.createCommentVNode)("", true)]);
						}), 128))]))
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Account/OrderList.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var OrderList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-9ba250c9"]]);
//#endregion
export { OrderList_default as default };

//# sourceMappingURL=OrderList-DlBLUBqF.js.map