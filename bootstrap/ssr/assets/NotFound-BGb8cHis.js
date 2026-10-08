import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-BWP1wqVC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
import { t as on } from "./cms-BWXg6J9T.js";
//#region resources/js/Pages/Public/Error/NotFound.vue
var _sfc_main = {
	__name: "NotFound",
	__ssrInlineRender: true,
	props: {
		blocks: {
			type: Array,
			default: () => []
		},
		texts: {
			type: Object,
			default: () => ({})
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-20d51afa${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="notfound" data-v-20d51afa${_scopeId}><div class="notfound-stage" data-v-20d51afa${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/404-backdrop.svg")} alt="" aria-hidden="true" class="notfound-bg" data-v-20d51afa${_scopeId}><div class="notfound-content" data-v-20d51afa${_scopeId}><h1 class="notfound-title" data-v-20d51afa${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.title)}</h1>`);
						if ((0, vue_exports.unref)(on)(__props.texts.text_show)) _push(`<p class="notfound-text" data-v-20d51afa${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.text)}</p>`);
						else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(__props.texts.button_show)) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: __props.texts.button_url || "/",
							class: "notfound-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.button_label)} <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-20d51afa${_scopeId}><path d="M9 18l6-6-6-6" data-v-20d51afa${_scopeId}></path></svg>`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									"stroke-width": "1.8",
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"aria-hidden": "true"
								}, [(0, vue_exports.createVNode)("path", { d: "M9 18l6-6-6-6" })]))];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div></div></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", { class: "notfound" }, [(0, vue_exports.createVNode)("div", { class: "notfound-stage" }, [(0, vue_exports.createVNode)("img", {
						src: "/assets/chhondo/404-backdrop.svg",
						alt: "",
						"aria-hidden": "true",
						class: "notfound-bg"
					}), (0, vue_exports.createVNode)("div", { class: "notfound-content" }, [
						(0, vue_exports.createVNode)("h1", { class: "notfound-title" }, (0, vue_exports.toDisplayString)(__props.texts.title), 1),
						(0, vue_exports.unref)(on)(__props.texts.text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "notfound-text"
						}, (0, vue_exports.toDisplayString)(__props.texts.text), 1)) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(__props.texts.button_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
							key: 1,
							href: __props.texts.button_url || "/",
							class: "notfound-btn"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "1.8",
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"aria-hidden": "true"
							}, [(0, vue_exports.createVNode)("path", { d: "M9 18l6-6-6-6" })]))]),
							_: 1
						}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true)
					])])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Error/NotFound.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var NotFound_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-20d51afa"]]);
//#endregion
export { NotFound_default as default };

//# sourceMappingURL=NotFound-BGb8cHis.js.map