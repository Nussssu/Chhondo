import { c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region resources/js/Pages/Public/Privacy.vue
var _sfc_main = {
	__name: "Privacy",
	__ssrInlineRender: true,
	props: {
		texts: {
			type: Object,
			default: () => ({})
		},
		intro: {
			type: Object,
			default: () => ({})
		},
		blocks: {
			type: Array,
			default: () => []
		},
		content: String
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-eb5cf9c6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="privacy-page py-12 md:py-16" data-v-eb5cf9c6${_scopeId}><div class="container max-w-4xl mx-auto px-4" data-v-eb5cf9c6${_scopeId}><div class="text-center max-w-3xl mx-auto" data-v-eb5cf9c6${_scopeId}><h1 class="headline-1 text-[#3E3C3A]" data-v-eb5cf9c6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title || "Privacy Policy")}</h1>`);
						if (__props.intro?.subtitle) _push(`<p class="body-1-r text-[#6E6C69] mt-4 leading-relaxed" data-v-eb5cf9c6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro.subtitle)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="mt-10 md:mt-12 privacy-content body-1-r text-[#666460] leading-relaxed" data-v-eb5cf9c6${_scopeId}>${__props.content ?? ""}</div></div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", { class: "privacy-page py-12 md:py-16" }, [(0, vue_exports.createVNode)("div", { class: "container max-w-4xl mx-auto px-4" }, [(0, vue_exports.createVNode)("div", { class: "text-center max-w-3xl mx-auto" }, [(0, vue_exports.createVNode)("h1", { class: "headline-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.intro?.title || "Privacy Policy"), 1), __props.intro?.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
						key: 0,
						class: "body-1-r text-[#6E6C69] mt-4 leading-relaxed"
					}, (0, vue_exports.toDisplayString)(__props.intro.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", {
						class: "mt-10 md:mt-12 privacy-content body-1-r text-[#666460] leading-relaxed",
						innerHTML: __props.content
					}, null, 8, ["innerHTML"])])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Privacy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Privacy_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-eb5cf9c6"]]);
//#endregion
export { Privacy_default as default };

//# sourceMappingURL=Privacy-D6t6_uqV.js.map