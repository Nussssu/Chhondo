import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { r as useWishlistStore } from "./AppLayout-BWP1wqVC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { r as CollectionCard_default } from "./videoEmbed-Dtao6_e5.js";
import { t as AccountLayout_default } from "./AccountLayout-CI_V1QvX.js";
import { t as ProductPreviewModel_default } from "./ProductPreviewModel-CXkwDQW1.js";
//#region resources/js/Pages/Public/Account/Wishlist.vue
var _sfc_main = {
	__name: "Wishlist",
	__ssrInlineRender: true,
	props: { wishlist: {
		type: Array,
		default: () => []
	} },
	setup(__props) {
		const props = __props;
		const wishlistStore = useWishlistStore();
		const items = (0, vue_exports.computed)(() => props.wishlist.filter((item) => wishlistStore.isWishlisted(item.product)));
		const isModalOpen = (0, vue_exports.ref)(false);
		const selectedProduct = (0, vue_exports.ref)(null);
		const openPreview = (product) => {
			selectedProduct.value = product;
			isModalOpen.value = true;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-755642c6${_scopeId}>পছন্দের তালিকা</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "পছন্দের তালিকা")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)(ProductPreviewModel_default, {
							isOpen: isModalOpen.value,
							product: selectedProduct.value,
							onClose: ($event) => isModalOpen.value = false
						}, null, _parent, _scopeId));
						_push(`<div class="wishlist-page" data-v-755642c6${_scopeId}><div class="section-header" data-v-755642c6${_scopeId}><span class="section-header-icon" data-v-755642c6${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/nav-wishlist.svg")} alt="" data-v-755642c6${_scopeId}></span><div data-v-755642c6${_scopeId}><p class="section-header-title" data-v-755642c6${_scopeId}>Wishlist</p><p class="section-header-subtitle" data-v-755642c6${_scopeId}>পছন্দের তালিকা</p></div></div>`);
						if (items.value.length === 0) {
							_push(`<div class="wishlist-empty" data-v-755642c6${_scopeId}><div class="wishlist-empty-icon" data-v-755642c6${_scopeId}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-755642c6${_scopeId}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-755642c6${_scopeId}></path></svg></div><p class="wishlist-empty-text" data-v-755642c6${_scopeId}>আপনার পছন্দের তালিকা খালি।</p>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								href: "/shop",
								class: "wishlist-shop-btn"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`কেনাকাটা চালিয়ে যান`);
									else return [(0, vue_exports.createTextVNode)("কেনাকাটা চালিয়ে যান")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else {
							_push(`<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5" data-v-755642c6${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(items.value, (item) => {
								_push((0, server_renderer_exports.ssrRenderComponent)(CollectionCard_default, {
									key: item.id,
									product: item.product,
									"button-label": "Add to cart",
									openPreview
								}, null, _parent, _scopeId));
							});
							_push(`<!--]--></div>`);
						}
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)(ProductPreviewModel_default, {
						isOpen: isModalOpen.value,
						product: selectedProduct.value,
						onClose: ($event) => isModalOpen.value = false
					}, null, 8, [
						"isOpen",
						"product",
						"onClose"
					]), (0, vue_exports.createVNode)("div", { class: "wishlist-page" }, [(0, vue_exports.createVNode)("div", { class: "section-header" }, [(0, vue_exports.createVNode)("span", { class: "section-header-icon" }, [(0, vue_exports.createVNode)("img", {
						src: "/assets/images/account/nav-wishlist.svg",
						alt: ""
					})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "section-header-title" }, "Wishlist"), (0, vue_exports.createVNode)("p", { class: "section-header-subtitle" }, "পছন্দের তালিকা")])]), items.value.length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						class: "wishlist-empty"
					}, [
						(0, vue_exports.createVNode)("div", { class: "wishlist-empty-icon" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							width: "34",
							height: "34",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.6",
							"stroke-linecap": "round",
							"stroke-linejoin": "round"
						}, [(0, vue_exports.createVNode)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })]))]),
						(0, vue_exports.createVNode)("p", { class: "wishlist-empty-text" }, "আপনার পছন্দের তালিকা খালি।"),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
							href: "/shop",
							class: "wishlist-shop-btn"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("কেনাকাটা চালিয়ে যান")]),
							_: 1
						})
					])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 1,
						class: "grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
					}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(items.value, (item) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(CollectionCard_default, {
							key: item.id,
							product: item.product,
							"button-label": "Add to cart",
							openPreview
						}, null, 8, ["product"]);
					}), 128))]))])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Account/Wishlist.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Wishlist_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-755642c6"]]);
//#endregion
export { Wishlist_default as default };

//# sourceMappingURL=Wishlist-DeZdyGAW.js.map