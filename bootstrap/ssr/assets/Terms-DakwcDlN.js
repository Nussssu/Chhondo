import { c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-ochFaCc-.js";
import { n as plain } from "./cms-BWXg6J9T.js";
import { t as PageBlocks_default } from "./PageBlocks-BNL11rU6.js";
import { t as PolicyLayout_default } from "./PolicyLayout-CLBlUFD_.js";
//#region resources/js/Pages/Public/Terms.vue
var _sfc_main = {
	__name: "Terms",
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
		content: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const otherBlocks = (0, vue_exports.computed)(() => (props.blocks ?? []).filter((block) => !["heading", "text"].includes(block.type)));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(plain)(__props.texts.tab_title))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(plain)(__props.texts.tab_title)), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)(PolicyLayout_default, {
							title: __props.intro.title || (0, vue_exports.unref)(plain)(__props.texts.tab_title),
							subtitle: __props.intro.subtitle,
							blocks: __props.blocks,
							content: __props.content
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: otherBlocks.value }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)(PolicyLayout_default, {
						title: __props.intro.title || (0, vue_exports.unref)(plain)(__props.texts.tab_title),
						subtitle: __props.intro.subtitle,
						blocks: __props.blocks,
						content: __props.content
					}, null, 8, [
						"title",
						"subtitle",
						"blocks",
						"content"
					]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: otherBlocks.value }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Terms.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=Terms-DakwcDlN.js.map