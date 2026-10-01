import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { n as MapPin, r as Mail, t as Phone } from "./phone-CmV-m_EM.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region resources/js/Pages/Public/Refund.vue
var _sfc_main = {
	__name: "Refund",
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
		content: {
			type: String,
			default: ""
		},
		intro: {
			type: Object,
			default: () => ({})
		}
	},
	setup(__props) {
		const page = usePage();
		const contact = (0, vue_exports.computed)(() => page.props.contact ?? {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="refund-page py-12 md:py-16" data-v-4270aacd${_scopeId}><div class="container max-w-4xl mx-auto px-4" data-v-4270aacd${_scopeId}><div class="text-center max-w-3xl mx-auto" data-v-4270aacd${_scopeId}><h1 class="headline-1 text-[#3E3C3A]" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title || "Refund and Returns Policy")}</h1><p class="body-1-r text-[#6E6C69] mt-4 md:mt-5 leading-relaxed" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.subtitle || "চারুকথন বাংলাদেশের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই নিচের রিটার্ন ও রিফান্ড নীতিমালা প্রযোজ্য।")}</p></div>`);
						if (__props.content) _push(`<div class="mt-10 md:mt-12 refund-content body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}>${__props.content ?? ""}</div>`);
						else _push(`<div class="mt-10 md:mt-12 space-y-8 text-[#4A4846]" data-v-4270aacd${_scopeId}><div data-v-4270aacd${_scopeId}><h2 class="body-3-sb" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</h2><div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</p><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</p></div></div><div data-v-4270aacd${_scopeId}><h2 class="body-3-sb" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</h2><div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t6)}</p><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t7)}</p></div></div><div data-v-4270aacd${_scopeId}><h2 class="body-3-sb" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t8)}</h2><div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t9)}</p><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t10)}</p></div></div><div data-v-4270aacd${_scopeId}><h2 class="body-3-sb" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t11)}</h2><div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t12)}</p></div></div><div data-v-4270aacd${_scopeId}><h2 class="body-3-sb" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t13)}</h2><div class="mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" data-v-4270aacd${_scopeId}><p data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t14)}</p></div></div></div>`);
						if (contact.value.phone || contact.value.email || contact.value.address) {
							_push(`<div class="mt-10 md:mt-12" data-v-4270aacd${_scopeId}><h3 class="body-3-sb text-[#3E3C3A]" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t15)}</h3><div class="mt-4 space-y-3 body-1-r text-[#5F5D59]" data-v-4270aacd${_scopeId}>`);
							if (contact.value.phone) {
								_push(`<p class="flex items-center gap-2" data-v-4270aacd${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Phone), { class: "w-[15px] h-[15px] shrink-0" }, null, _parent, _scopeId));
								_push(`<span dir="ltr" data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.phone)}</span></p>`);
							} else _push(`<!---->`);
							if (contact.value.email) {
								_push(`<p class="flex items-center gap-2" data-v-4270aacd${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Mail), { class: "w-[15px] h-[15px] shrink-0" }, null, _parent, _scopeId));
								_push(`<span data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.email)}</span></p>`);
							} else _push(`<!---->`);
							if (contact.value.address) {
								_push(`<p class="flex items-center gap-2" data-v-4270aacd${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(MapPin), { class: "w-[15px] h-[15px] shrink-0" }, null, _parent, _scopeId));
								_push(`<span data-v-4270aacd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.address)}</span></p>`);
							} else _push(`<!---->`);
							_push(`</div></div>`);
						} else _push(`<!---->`);
						_push(`</div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", { class: "refund-page py-12 md:py-16" }, [(0, vue_exports.createVNode)("div", { class: "container max-w-4xl mx-auto px-4" }, [
						(0, vue_exports.createVNode)("div", { class: "text-center max-w-3xl mx-auto" }, [(0, vue_exports.createVNode)("h1", { class: "headline-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.intro?.title || "Refund and Returns Policy"), 1), (0, vue_exports.createVNode)("p", { class: "body-1-r text-[#6E6C69] mt-4 md:mt-5 leading-relaxed" }, (0, vue_exports.toDisplayString)(__props.intro?.subtitle || "চারুকথন বাংলাদেশের ক্রেতাদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। তবে যেহেতু আমাদের পণ্যগুলো হাতে তৈরি (hand-painted, block printed ইত্যাদি), তাই নিচের রিটার্ন ও রিফান্ড নীতিমালা প্রযোজ্য।"), 1)]),
						__props.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "mt-10 md:mt-12 refund-content body-1-r text-[#666460] leading-relaxed",
							innerHTML: __props.content
						}, null, 8, ["innerHTML"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: "mt-10 md:mt-12 space-y-8 text-[#4A4846]"
						}, [
							(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1), (0, vue_exports.createVNode)("div", { class: "mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" }, [(0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t3), 1), (0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t4), 1)])]),
							(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb" }, (0, vue_exports.toDisplayString)(__props.texts.t5), 1), (0, vue_exports.createVNode)("div", { class: "mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" }, [(0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t6), 1), (0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t7), 1)])]),
							(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb" }, (0, vue_exports.toDisplayString)(__props.texts.t8), 1), (0, vue_exports.createVNode)("div", { class: "mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" }, [(0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t9), 1), (0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t10), 1)])]),
							(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb" }, (0, vue_exports.toDisplayString)(__props.texts.t11), 1), (0, vue_exports.createVNode)("div", { class: "mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" }, [(0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t12), 1)])]),
							(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb" }, (0, vue_exports.toDisplayString)(__props.texts.t13), 1), (0, vue_exports.createVNode)("div", { class: "mt-3 space-y-2 body-1-r text-[#666460] leading-relaxed" }, [(0, vue_exports.createVNode)("p", null, (0, vue_exports.toDisplayString)(__props.texts.t14), 1)])])
						])),
						contact.value.phone || contact.value.email || contact.value.address ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 2,
							class: "mt-10 md:mt-12"
						}, [(0, vue_exports.createVNode)("h3", { class: "body-3-sb text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t15), 1), (0, vue_exports.createVNode)("div", { class: "mt-4 space-y-3 body-1-r text-[#5F5D59]" }, [
							contact.value.phone ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "flex items-center gap-2"
							}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Phone), { class: "w-[15px] h-[15px] shrink-0" }), (0, vue_exports.createVNode)("span", { dir: "ltr" }, (0, vue_exports.toDisplayString)(contact.value.phone), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							contact.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 1,
								class: "flex items-center gap-2"
							}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Mail), { class: "w-[15px] h-[15px] shrink-0" }), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(contact.value.email), 1)])) : (0, vue_exports.createCommentVNode)("", true),
							contact.value.address ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 2,
								class: "flex items-center gap-2"
							}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(MapPin), { class: "w-[15px] h-[15px] shrink-0" }), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(contact.value.address), 1)])) : (0, vue_exports.createCommentVNode)("", true)
						])])) : (0, vue_exports.createCommentVNode)("", true)
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Refund.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Refund_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-4270aacd"]]);
//#endregion
export { Refund_default as default };

//# sourceMappingURL=Refund--Wuy3f_T.js.map