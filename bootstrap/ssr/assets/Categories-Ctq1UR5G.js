import { c as server_renderer_exports, i as link_default, l as vue_exports, o as usePage, r as head_default } from "../ssr.js";
import { i as useHomeStore, t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region resources/js/Pages/Public/Categories.vue
var _sfc_main = {
	__name: "Categories",
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
		const homeStore = useHomeStore();
		const globalCategories = (0, vue_exports.computed)(() => usePage().props.globalCategories);
		const categories = (0, vue_exports.computed)(() => {
			if (globalCategories.value?.categories?.length > 0) return globalCategories.value.categories;
			return homeStore.categories || [];
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-37c479b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="categories-page" data-v-37c479b0${_scopeId}><div class="container px-4" data-v-37c479b0${_scopeId}><div class="py-8 text-center" data-v-37c479b0${_scopeId}><h1 class="categories-title" data-v-37c479b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title || "ক্যাটাগরি সমূহ")}</h1><p class="body-1-r text-gray-500 mt-2" data-v-37c479b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.subtitle || "আপনার পছন্দের ক্যাটাগরি বেছে নিন")}</p></div><div class="category-grid pb-10" data-v-37c479b0${_scopeId}><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(categories.value, (category) => {
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								key: category.id,
								href: `/product-category/${category.slug}`,
								class: "category-card"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<div class="category-image-wrap" data-v-37c479b0${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", category.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", category.name)} class="category-image" loading="lazy" data-v-37c479b0${_scopeId}></div><p class="category-name" data-v-37c479b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(category.name)}</p>`);
									else return [(0, vue_exports.createVNode)("div", { class: "category-image-wrap" }, [(0, vue_exports.createVNode)("img", {
										src: category.image,
										alt: category.name,
										class: "category-image",
										loading: "lazy"
									}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("p", { class: "category-name" }, (0, vue_exports.toDisplayString)(category.name), 1)];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]--></div>`);
						if (categories.value.length === 0) _push(`<div class="text-center py-20" data-v-37c479b0${_scopeId}><p class="body-2-r text-gray-400" data-v-37c479b0${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</p></div>`);
						else _push(`<!---->`);
						_push(`</div></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", { class: "categories-page" }, [(0, vue_exports.createVNode)("div", { class: "container px-4" }, [
						(0, vue_exports.createVNode)("div", { class: "py-8 text-center" }, [(0, vue_exports.createVNode)("h1", { class: "categories-title" }, (0, vue_exports.toDisplayString)(__props.intro?.title || "ক্যাটাগরি সমূহ"), 1), (0, vue_exports.createVNode)("p", { class: "body-1-r text-gray-500 mt-2" }, (0, vue_exports.toDisplayString)(__props.intro?.subtitle || "আপনার পছন্দের ক্যাটাগরি বেছে নিন"), 1)]),
						(0, vue_exports.createVNode)("div", { class: "category-grid pb-10" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(categories.value, (category) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: category.id,
								href: `/product-category/${category.slug}`,
								class: "category-card"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "category-image-wrap" }, [(0, vue_exports.createVNode)("img", {
									src: category.image,
									alt: category.name,
									class: "category-image",
									loading: "lazy"
								}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("p", { class: "category-name" }, (0, vue_exports.toDisplayString)(category.name), 1)]),
								_: 2
							}, 1032, ["href"]);
						}), 128))]),
						categories.value.length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "text-center py-20"
						}, [(0, vue_exports.createVNode)("p", { class: "body-2-r text-gray-400" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1)])) : (0, vue_exports.createCommentVNode)("", true)
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Categories.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Categories_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-37c479b0"]]);
//#endregion
export { Categories_default as default };

//# sourceMappingURL=Categories-Ctq1UR5G.js.map