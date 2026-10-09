import { c as server_renderer_exports, l as vue_exports, o as usePage } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as rebrand } from "./rebrand-BSHbrJDv.js";
//#region resources/js/components/Page/PolicyLayout.vue
/**
* Figma "Refund and Returns Policy" layout, shared by every policy page:
* a two-tone title, a line under it, numbered sections with bullet lists,
* and the store's contact details.
*
* A page passes either `sections` (the Figma copy) or the body written in
* Content › Pages (`blocks`, or the older baked `content`).
*/
var _sfc_main = {
	__name: "PolicyLayout",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String,
			default: ""
		},
		sections: {
			type: Array,
			default: null
		},
		blocks: {
			type: Array,
			default: () => []
		},
		content: {
			type: String,
			default: ""
		},
		showContact: {
			type: Boolean,
			default: false
		},
		contactDetails: {
			type: Object,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const contact = (0, vue_exports.computed)(() => usePage().props.contact ?? {});
		const visibleContact = (0, vue_exports.computed)(() => props.contactDetails ?? contact.value);
		const titleParts = (0, vue_exports.computed)(() => {
			const words = props.title.trim().split(/\s+/);
			return {
				lead: words.slice(0, -1).join(" "),
				accent: words.at(-1)
			};
		});
		const blockSections = (0, vue_exports.computed)(() => {
			const out = [];
			for (const block of props.blocks ?? []) if (block.type === "heading") out.push({
				title: block.text,
				html: ""
			});
			else if (block.type === "text" && block.html) {
				if (!out.length) out.push({
					title: "",
					html: ""
				});
				out[out.length - 1].html += rebrand(block.html);
			}
			return out;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "policy-page" }, _attrs))} data-v-209d4344><div class="policy-inner" data-v-209d4344><header class="policy-head" data-v-209d4344><h1 class="policy-title" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(titleParts.value.lead ? `${titleParts.value.lead} ` : "")}<span class="policy-accent" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(titleParts.value.accent)}</span></h1>`);
			if (__props.subtitle) _push(`<p class="policy-sub" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(__props.subtitle)}</p>`);
			else _push(`<!---->`);
			_push(`</header><div class="policy-body" data-v-209d4344>`);
			if (__props.sections) {
				_push(`<!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.sections, (section, i) => {
					_push(`<div class="policy-section" data-v-209d4344>`);
					if (section.title) _push(`<h2 class="policy-section-title" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(section.title)}</h2>`);
					else _push(`<!---->`);
					_push(`<ul class="policy-list" data-v-209d4344><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(section.lines, (line, n) => {
						_push(`<li data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(line)}</li>`);
					});
					_push(`<!--]--></ul></div>`);
				});
				_push(`<!--]-->`);
			} else if (blockSections.value.length) {
				_push(`<!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(blockSections.value, (section, i) => {
					_push(`<div class="policy-section" data-v-209d4344>`);
					if (section.title) _push(`<h2 class="policy-section-title" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(section.title))}</h2>`);
					else _push(`<!---->`);
					_push(`<div class="policy-prose" data-v-209d4344>${section.html ?? ""}</div></div>`);
				});
				_push(`<!--]-->`);
			} else if (__props.content) _push(`<div class="policy-prose" data-v-209d4344>${(0, vue_exports.unref)(rebrand)(__props.content) ?? ""}</div>`);
			else _push(`<!---->`);
			if (__props.showContact && (visibleContact.value.address || visibleContact.value.email || visibleContact.value.phone)) {
				_push(`<div class="policy-section" data-v-209d4344><h2 class="policy-section-title" data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(visibleContact.value.title || "যোগাযোগ:")}</h2><div class="policy-contact" data-v-209d4344>`);
				if (visibleContact.value.address) _push(`<p class="policy-contact-row policy-contact-row--bangla" data-v-209d4344><img${(0, server_renderer_exports.ssrRenderAttr)("src", visibleContact.value.locationIcon || "/assets/chhondo/location.svg")} alt="" class="${(0, server_renderer_exports.ssrRenderClass)(["policy-contact-icon", { "policy-contact-icon--exact": visibleContact.value.locationIcon }])}" data-v-209d4344><span data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(visibleContact.value.address)}</span></p>`);
				else _push(`<!---->`);
				if (visibleContact.value.email) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", `mailto:${visibleContact.value.email}`)} class="policy-contact-row policy-contact-row--latin" data-v-209d4344><img${(0, server_renderer_exports.ssrRenderAttr)("src", visibleContact.value.emailIcon || "/assets/chhondo/email.svg")} alt="" class="${(0, server_renderer_exports.ssrRenderClass)(["policy-contact-icon", { "policy-contact-icon--exact": visibleContact.value.emailIcon }])}" data-v-209d4344><span data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(visibleContact.value.email)}</span></a>`);
				else _push(`<!---->`);
				if (visibleContact.value.phone) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", `tel:${String(visibleContact.value.phone).replace(/[^\d+]/g, "")}`)} class="policy-contact-row policy-contact-row--latin" data-v-209d4344><img${(0, server_renderer_exports.ssrRenderAttr)("src", visibleContact.value.phoneIcon || "/assets/chhondo/phone.svg")} alt="" class="${(0, server_renderer_exports.ssrRenderClass)(["policy-contact-icon", { "policy-contact-icon--exact": visibleContact.value.phoneIcon }])}" data-v-209d4344><span data-v-209d4344>${(0, server_renderer_exports.ssrInterpolate)(visibleContact.value.phone)}</span></a>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Page/PolicyLayout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PolicyLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-209d4344"]]);
//#endregion
export { PolicyLayout_default as t };

//# sourceMappingURL=PolicyLayout-DEdlQjDM.js.map