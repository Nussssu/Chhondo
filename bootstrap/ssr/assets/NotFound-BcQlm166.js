import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/Pages/Public/Error/NotFound.vue
var _sfc_main = {
	__name: "NotFound",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-9e119150${_scopeId}>Page not found</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Page not found")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="notfound" data-v-9e119150${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/errors/404-graphic.png")} alt="" aria-hidden="true" class="notfound-bg" data-v-9e119150${_scopeId}><div class="notfound-content" data-v-9e119150${_scopeId}><h1 class="notfound-title" data-v-9e119150${_scopeId}>Page not found</h1><p class="notfound-text" data-v-9e119150${_scopeId}> চারুকথন আমাদের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই </p>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/",
							class: "notfound-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Continue shopping <img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/errors/chevron-right.svg")} alt="" class="notfound-btn-icon" data-v-9e119150${_scopeId}>`);
								else return [(0, vue_exports.createTextVNode)(" Continue shopping "), (0, vue_exports.createVNode)("img", {
									src: "/assets/images/errors/chevron-right.svg",
									alt: "",
									class: "notfound-btn-icon"
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "notfound" }, [(0, vue_exports.createVNode)("img", {
						src: "/assets/images/errors/404-graphic.png",
						alt: "",
						"aria-hidden": "true",
						class: "notfound-bg"
					}), (0, vue_exports.createVNode)("div", { class: "notfound-content" }, [
						(0, vue_exports.createVNode)("h1", { class: "notfound-title" }, "Page not found"),
						(0, vue_exports.createVNode)("p", { class: "notfound-text" }, " চারুকথন আমাদের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই "),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
							href: "/",
							class: "notfound-btn"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)(" Continue shopping "), (0, vue_exports.createVNode)("img", {
								src: "/assets/images/errors/chevron-right.svg",
								alt: "",
								class: "notfound-btn-icon"
							})]),
							_: 1
						})
					])])];
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
var NotFound_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-9e119150"]]);
//#endregion
export { NotFound_default as default };

//# sourceMappingURL=NotFound-BcQlm166.js.map