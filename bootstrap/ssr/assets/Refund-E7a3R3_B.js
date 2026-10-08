import { c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-BWP1wqVC.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
import { i as shown, n as plain, t as on } from "./cms-BWXg6J9T.js";
import { t as PolicyLayout_default } from "./PolicyLayout-CLBlUFD_.js";
//#region resources/js/Pages/Public/Refund.vue
var _sfc_main = {
	__name: "Refund",
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
		const t = (0, vue_exports.computed)(() => props.texts || {});
		const sections = (0, vue_exports.computed)(() => on(t.value.sections_show) === false ? [] : shown(t.value.sections).map((row) => ({
			title: row.title,
			lines: String(row.lines || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
		})));
		const contact = (0, vue_exports.computed)(() => ({
			title: t.value.contact_title,
			address: on(t.value.contact_address_show) ? t.value.contact_address : "",
			email: on(t.value.contact_email_show) ? t.value.contact_email : "",
			phone: on(t.value.contact_phone_show) ? t.value.contact_phone : "",
			locationIcon: "/assets/chhondo/refund-location.svg",
			emailIcon: "/assets/chhondo/refund-email.svg",
			phoneIcon: "/assets/chhondo/refund-phone.svg"
		}));
		const otherBlocks = (0, vue_exports.computed)(() => (props.blocks ?? []).filter((block) => !["heading", "text"].includes(block.type)));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(plain)(t.value.tab_title))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(plain)(t.value.tab_title)), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)(PolicyLayout_default, {
							class: "policy--refund",
							title: __props.intro.title || (0, vue_exports.unref)(plain)(t.value.tab_title),
							subtitle: __props.intro.subtitle,
							sections: sections.value,
							"show-contact": (0, vue_exports.unref)(on)(t.value.contact_show),
							"contact-details": contact.value
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: otherBlocks.value }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)(PolicyLayout_default, {
						class: "policy--refund",
						title: __props.intro.title || (0, vue_exports.unref)(plain)(t.value.tab_title),
						subtitle: __props.intro.subtitle,
						sections: sections.value,
						"show-contact": (0, vue_exports.unref)(on)(t.value.contact_show),
						"contact-details": contact.value
					}, null, 8, [
						"title",
						"subtitle",
						"sections",
						"show-contact",
						"contact-details"
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Refund.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=Refund-E7a3R3_B.js.map