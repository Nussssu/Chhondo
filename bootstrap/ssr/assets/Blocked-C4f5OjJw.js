import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/Pages/Public/Blocked.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}><div class="container mx-auto py-12 text-center"><h1 class="title-1 mb-4">প্রবেশ সীমিত</h1><p class="body-2-r mb-6"> Your account has been blocked due to suspicious activity or policy violations. Please contact support for further assistance. </p></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Blocked.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Blocked_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { Blocked_default as default };

//# sourceMappingURL=Blocked-C4f5OjJw.js.map