import { c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-CNqlOJ3L.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-P8L_ue1k.js";
import { t as rebrand } from "./rebrand-BSHbrJDv.js";
//#region resources/js/Pages/Public/CustomPage.vue
var _sfc_main = {
	__name: "CustomPage",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			default: ""
		},
		subtitle: {
			type: String,
			default: ""
		},
		label: {
			type: String,
			default: ""
		},
		metaTitle: {
			type: String,
			default: ""
		},
		metaDescription: {
			type: String,
			default: ""
		},
		blocks: {
			type: Array,
			default: () => []
		},
		content: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		/**
		* A page the shop created in Content › Pages.
		*
		* It has no wording of its own to fall back on — every word on it was written
		* in the editor — so the header only draws when a title was set, and the body
		* is whatever widgets the page holds.
		*/
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<title data-v-5172ba79${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.metaTitle || __props.title)}</title>`);
						if (__props.metaDescription) _push(`<meta name="description"${(0, server_renderer_exports.ssrRenderAttr)("content", __props.metaDescription)} data-v-5172ba79${_scopeId}>`);
						else _push(`<!---->`);
					} else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.metaTitle || __props.title), 1), __props.metaDescription ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("meta", {
						key: 0,
						name: "description",
						content: __props.metaDescription
					}, null, 8, ["content"])) : (0, vue_exports.createCommentVNode)("", true)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.title || __props.subtitle) {
							_push(`<section class="cp-header py-12 md:py-16" data-v-5172ba79${_scopeId}><div class="container max-w-4xl mx-auto px-4 text-center" data-v-5172ba79${_scopeId}>`);
							if (__props.label) _push(`<span class="cp-label" data-v-5172ba79${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.label)}</span>`);
							else _push(`<!---->`);
							if (__props.title) _push(`<h1 class="headline-1 text-[#3E3C3A]" data-v-5172ba79${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.title)}</h1>`);
							else _push(`<!---->`);
							if (__props.subtitle) _push(`<p class="body-1-r text-[#6E6C69] mt-4 leading-relaxed" data-v-5172ba79${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.subtitle)}</p>`);
							else _push(`<!---->`);
							_push(`</div></section>`);
						} else _push(`<!---->`);
						if (__props.content) _push(`<section class="cp-body" data-v-5172ba79${_scopeId}><div class="container max-w-4xl mx-auto px-4" data-v-5172ba79${_scopeId}><div class="cp-content body-1-r text-[#666460] leading-relaxed" data-v-5172ba79${_scopeId}>${(0, vue_exports.unref)(rebrand)(__props.content) ?? ""}</div></div></section>`);
						else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [
						__props.title || __props.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 0,
							class: "cp-header py-12 md:py-16"
						}, [(0, vue_exports.createVNode)("div", { class: "container max-w-4xl mx-auto px-4 text-center" }, [
							__props.label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								class: "cp-label"
							}, (0, vue_exports.toDisplayString)(__props.label), 1)) : (0, vue_exports.createCommentVNode)("", true),
							__props.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("h1", {
								key: 1,
								class: "headline-1 text-[#3E3C3A]"
							}, (0, vue_exports.toDisplayString)(__props.title), 1)) : (0, vue_exports.createCommentVNode)("", true),
							__props.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 2,
								class: "body-1-r text-[#6E6C69] mt-4 leading-relaxed"
							}, (0, vue_exports.toDisplayString)(__props.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)
						])])) : (0, vue_exports.createCommentVNode)("", true),
						__props.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 1,
							class: "cp-body"
						}, [(0, vue_exports.createVNode)("div", { class: "container max-w-4xl mx-auto px-4" }, [(0, vue_exports.createVNode)("div", {
							class: "cp-content body-1-r text-[#666460] leading-relaxed",
							innerHTML: (0, vue_exports.unref)(rebrand)(__props.content)
						}, null, 8, ["innerHTML"])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])
					];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/CustomPage.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CustomPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-5172ba79"]]);
//#endregion
export { CustomPage_default as default };

//# sourceMappingURL=CustomPage-69O3gb_n.js.map