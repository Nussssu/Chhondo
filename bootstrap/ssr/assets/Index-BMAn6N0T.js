import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { a as useCartStore, m as X, o as isOutOfStock, t as _sfc_main$3 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region resources/js/components/Cart/EmptyCart.vue
var _sfc_main$2 = {
	__name: "EmptyCart",
	__ssrInlineRender: true,
	setup(__props) {
		const emptyCartIcon = (0, vue_exports.ref)("/assets/images/icons/empty-cart.png");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "flex items-center justify-center p-4" }, _attrs))}><div class="max-w-2xl mx-auto text-center"><div class="mb-6 w-[300px] mx-auto"><img${(0, server_renderer_exports.ssrRenderAttr)("src", emptyCartIcon.value)} alt="Empty cart" class="mx-auto"></div><h1 class="headline-3 mb-6"> Your cart is currently empty. </h1><p class="body-2-r text-gray-600 mb-8 max-w-lg mx-auto"> Before proceed to checkout you must add some products to your shopping cart. You will find a lot of interesting products on our &quot;Shop&quot; page. </p>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
				href: "/shop",
				class: "btn__primary inline-block"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(` RETURN TO SHOP `);
					else return [(0, vue_exports.createTextVNode)(" RETURN TO SHOP ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Cart/EmptyCart.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Cart/ShoppingCart.vue
var _sfc_main$1 = {
	__name: "ShoppingCart",
	__ssrInlineRender: true,
	setup(__props) {
		const cartStore = useCartStore();
		const cartItems = (0, vue_exports.computed)(() => cartStore.cartItems);
		const directOrderProduct = (0, vue_exports.ref)(null);
		(0, vue_exports.onMounted)(() => {
			if (typeof window !== "undefined") {
				const storedProductData = localStorage.getItem("directOrderProductData");
				if (storedProductData) directOrderProduct.value = JSON.parse(storedProductData);
			}
		});
		const subtotal = (0, vue_exports.computed)(() => {
			return cartItems.value.reduce((total, item) => total + item.individual_price * item.quantity, 0);
		});
		const total = (0, vue_exports.computed)(() => {
			return subtotal.value;
		});
		const formatPrice = (price) => {
			return `${price}`;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "container py-12" }, _attrs))} data-v-b05f7823>`);
			if (cartItems.value.length > 0) {
				_push(`<div class="flex flex-col lg:flex-row gap-8" data-v-b05f7823><div class="lg:w-2/3" data-v-b05f7823><table class="hidden md:table w-full" data-v-b05f7823><thead class="border-b" data-v-b05f7823><tr data-v-b05f7823><th class="text-left py-4" data-v-b05f7823>PRODUCT</th><th class="text-left py-4" data-v-b05f7823>PRICE</th><th class="text-left py-4" data-v-b05f7823>QUANTITY</th><th class="text-right py-4" data-v-b05f7823>SUBTOTAL</th></tr></thead><tbody data-v-b05f7823><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(cartItems.value, (item) => {
					_push(`<tr class="border-b" data-v-b05f7823><td class="py-4" data-v-b05f7823><div class="flex items-center gap-4" data-v-b05f7823><button class="text-gray-400 hover:text-gray-600" data-v-b05f7823>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(X), { class: "h-4 w-4" }, null, _parent));
					_push(`</button><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product.product_name)} class="w-20 h-20 object-cover" data-v-b05f7823><div class="flex flex-col gap-1" data-v-b05f7823><span data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</span>`);
					if ((0, vue_exports.unref)(isOutOfStock)(item.product)) _push(`<span class="soldout-badge self-start" data-v-b05f7823>Out of Stock</span>`);
					else _push(`<!---->`);
					if (item.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([item.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge"])}" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(item.blouse_choice === "with" ? "With Blouse" : "Without Blouse")}</span>`);
					else _push(`<!---->`);
					_push(`</div></div></td><td class="py-4" data-v-b05f7823>`);
					if (item.regular_individual_price) _push(`<span class="text-gray-400 line-through mr-2" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.regular_individual_price))}<span class="bangla-font" data-v-b05f7823>৳</span></span>`);
					else _push(`<!---->`);
					_push(`<span class="${(0, server_renderer_exports.ssrRenderClass)({ "text-theme font-semibold": item.regular_individual_price })}" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.individual_price))}<span class="bangla-font" data-v-b05f7823>৳</span></span></td><td class="py-4" data-v-b05f7823><div class="flex items-center border rounded max-w-[120px]" data-v-b05f7823><button class="px-3 py-1 border-r hover:bg-gray-100"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(item.quantity <= 1) ? " disabled" : ""} data-v-b05f7823>-</button><input type="number"${(0, server_renderer_exports.ssrRenderAttr)("value", item.quantity)} class="w-12 text-center border-none focus:ring-0" min="1" data-v-b05f7823><button class="px-3 py-1 border-l hover:bg-gray-100" data-v-b05f7823>+</button></div></td><td class="py-4 text-right text-theme" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.individual_price * item.quantity))}<span class="bangla-font" data-v-b05f7823>৳</span></td></tr>`);
				});
				_push(`<!--]--></tbody></table><div class="md:hidden" data-v-b05f7823><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(cartItems.value, (item) => {
					_push(`<div class="flex gap-4 p-4 border-b" data-v-b05f7823><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product.product_name)} class="w-24 h-24 object-cover rounded" data-v-b05f7823><div class="flex-1" data-v-b05f7823><div class="flex items-start justify-between" data-v-b05f7823><div class="flex flex-col gap-1" data-v-b05f7823><h3 class="font-medium text-gray-900" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</h3>`);
					if ((0, vue_exports.unref)(isOutOfStock)(item.product)) _push(`<span class="soldout-badge self-start" data-v-b05f7823>Out of Stock</span>`);
					else _push(`<!---->`);
					if (item.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([item.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge self-start"])}" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(item.blouse_choice === "with" ? "With Blouse" : "Without Blouse")}</span>`);
					else _push(`<!---->`);
					_push(`</div><button class="text-gray-400 hover:text-gray-600" data-v-b05f7823>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(X), { class: "h-4 w-4" }, null, _parent));
					_push(`</button></div><div class="mt-1 space-y-2" data-v-b05f7823><div class="flex items-center justify-between" data-v-b05f7823><span class="text-gray-500" data-v-b05f7823>Price</span><span class="font-medium" data-v-b05f7823>`);
					if (item.regular_individual_price) _push(`<span class="text-gray-400 line-through mr-2 font-normal" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.regular_individual_price))}<span class="bangla-font" data-v-b05f7823>৳</span></span>`);
					else _push(`<!---->`);
					_push(`<span class="${(0, server_renderer_exports.ssrRenderClass)({ "text-theme": item.regular_individual_price })}" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.individual_price))}<span class="bangla-font" data-v-b05f7823>৳</span></span></span></div><div class="flex items-center justify-between" data-v-b05f7823><span class="text-gray-500" data-v-b05f7823>Quantity</span><div class="flex items-center border rounded" data-v-b05f7823><button class="px-3 py-1 border-r hover:bg-gray-50"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(item.quantity <= 1) ? " disabled" : ""} data-v-b05f7823>-</button><input type="number"${(0, server_renderer_exports.ssrRenderAttr)("value", item.quantity)} class="w-12 text-center border-none focus:ring-0 p-0" min="1" data-v-b05f7823><button class="px-3 py-1 border-l hover:bg-gray-50" data-v-b05f7823>+</button></div></div><div class="flex items-center justify-between pt-2 border-t" data-v-b05f7823><span class="text-gray-500" data-v-b05f7823>Subtotal</span><span class="font-medium text-theme" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(item.individual_price * item.quantity))}<span class="bangla-font" data-v-b05f7823>৳</span></span></div></div></div></div>`);
				});
				_push(`<!--]--></div></div><div class="lg:w-1/3" data-v-b05f7823><div class="border rounded p-6" data-v-b05f7823><h2 class="title-2 mb-6" data-v-b05f7823>CART TOTALS</h2><div class="flex justify-between py-4 border-b" data-v-b05f7823><span data-v-b05f7823>Subtotal</span><span data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(subtotal.value))}<span class="bangla-font" data-v-b05f7823>৳</span></span></div><div class="flex justify-between py-4 font-bold" data-v-b05f7823><span data-v-b05f7823>Total</span><span class="text-theme" data-v-b05f7823>${(0, server_renderer_exports.ssrInterpolate)(formatPrice(total.value))}<span class="bangla-font" data-v-b05f7823>৳</span></span></div><button class="w-full block text-center btn__primary" data-v-b05f7823> PROCEED TO CHECKOUT </button></div></div></div>`);
			} else _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Cart/ShoppingCart.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ShoppingCart_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-b05f7823"]]);
//#endregion
//#region resources/js/Pages/Public/Cart/Index.vue
var _sfc_main = {
	__name: "Index",
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
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="cartPage"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(ShoppingCart_default, null, null, _parent, _scopeId));
						_push(`</div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", { class: "cartPage" }, [(0, vue_exports.createVNode)(ShoppingCart_default)]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Cart/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=Index-BMAn6N0T.js.map