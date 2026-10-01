import { c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/Pages/Public/About.vue
var _sfc_main = {
	__name: "About",
	__ssrInlineRender: true,
	props: {
		texts: {
			type: Object,
			default: () => ({})
		},
		content: String
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="about-page min-h-screen py-12 md:py-16" data-v-d980873b${_scopeId}><div class="container flex flex-col gap-24" data-v-d980873b${_scopeId}><div class="max-w-4xl mx-auto text-center" data-v-d980873b${_scopeId}><h1 class="headline-1 text-[#3E3C3A]" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</h1><p class="about-description mt-4" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" data-v-d980873b${_scopeId}><div class="rounded-xl overflow-hidden" data-v-d980873b${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", __props.texts.img_goal)} alt="Our goal" class="w-full h-[260px] md:h-[320px] object-cover" data-v-d980873b${_scopeId}></div><div class="md:max-w-[520px]" data-v-d980873b${_scopeId}><h2 class="title-1 text-[#3E3C3A]" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</h2><p class="about-description about-description-left mt-4" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</p></div></div><div data-v-d980873b${_scopeId}><h2 class="title-1 text-[#3E3C3A] text-center" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t6)}</h2><div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-v-d980873b${_scopeId}><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(__props.texts.cards || [], (card, i) => {
							_push(`<div class="about-card" data-v-d980873b${_scopeId}><h3 class="body-2-sb text-[#3E3C3A]" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.title)}</h3><p class="about-description mt-2" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(card.text)}</p></div>`);
						});
						_push(`<!--]--></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" data-v-d980873b${_scopeId}><div class="md:max-w-[520px]" data-v-d980873b${_scopeId}><h2 class="title-1 text-[#3E3C3A]" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t15)}</h2><p class="about-description about-description-left mt-4" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t16)}</p></div><div class="relative rounded-xl overflow-hidden" data-v-d980873b${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", __props.texts.img_craft)} alt="Traditional makeover" class="w-full h-[280px] md:h-[350px] object-cover" data-v-d980873b${_scopeId}></div></div><div data-v-d980873b${_scopeId}><div class="max-w-4xl mx-auto text-center" data-v-d980873b${_scopeId}><h2 class="title-1 text-[#3E3C3A]" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t17)}</h2><p class="about-description mt-3" data-v-d980873b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t18)}</p></div><div class="mt-6 rounded-xl overflow-hidden" data-v-d980873b${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", __props.texts.img_daily)} alt="Daily tradition showcase" class="w-full h-auto object-contain" data-v-d980873b${_scopeId}></div></div></div></section>`);
					} else return [(0, vue_exports.createVNode)("section", { class: "about-page min-h-screen py-12 md:py-16" }, [(0, vue_exports.createVNode)("div", { class: "container flex flex-col gap-24" }, [
						(0, vue_exports.createVNode)("div", { class: "max-w-4xl mx-auto text-center" }, [(0, vue_exports.createVNode)("h1", { class: "headline-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1), (0, vue_exports.createVNode)("p", { class: "about-description mt-4" }, (0, vue_exports.toDisplayString)(__props.texts.t3), 1)]),
						(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" }, [(0, vue_exports.createVNode)("div", { class: "rounded-xl overflow-hidden" }, [(0, vue_exports.createVNode)("img", {
							src: __props.texts.img_goal,
							alt: "Our goal",
							class: "w-full h-[260px] md:h-[320px] object-cover"
						}, null, 8, ["src"])]), (0, vue_exports.createVNode)("div", { class: "md:max-w-[520px]" }, [(0, vue_exports.createVNode)("h2", { class: "title-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1), (0, vue_exports.createVNode)("p", { class: "about-description about-description-left mt-4" }, (0, vue_exports.toDisplayString)(__props.texts.t5), 1)])]),
						(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "title-1 text-[#3E3C3A] text-center" }, (0, vue_exports.toDisplayString)(__props.texts.t6), 1), (0, vue_exports.createVNode)("div", { class: "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.texts.cards || [], (card, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: i,
								class: "about-card"
							}, [(0, vue_exports.createVNode)("h3", { class: "body-2-sb text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(card.title), 1), (0, vue_exports.createVNode)("p", { class: "about-description mt-2" }, (0, vue_exports.toDisplayString)(card.text), 1)]);
						}), 128))])]),
						(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" }, [(0, vue_exports.createVNode)("div", { class: "md:max-w-[520px]" }, [(0, vue_exports.createVNode)("h2", { class: "title-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t15), 1), (0, vue_exports.createVNode)("p", { class: "about-description about-description-left mt-4" }, (0, vue_exports.toDisplayString)(__props.texts.t16), 1)]), (0, vue_exports.createVNode)("div", { class: "relative rounded-xl overflow-hidden" }, [(0, vue_exports.createVNode)("img", {
							src: __props.texts.img_craft,
							alt: "Traditional makeover",
							class: "w-full h-[280px] md:h-[350px] object-cover"
						}, null, 8, ["src"])])]),
						(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("div", { class: "max-w-4xl mx-auto text-center" }, [(0, vue_exports.createVNode)("h2", { class: "title-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.texts.t17), 1), (0, vue_exports.createVNode)("p", { class: "about-description mt-3" }, (0, vue_exports.toDisplayString)(__props.texts.t18), 1)]), (0, vue_exports.createVNode)("div", { class: "mt-6 rounded-xl overflow-hidden" }, [(0, vue_exports.createVNode)("img", {
							src: __props.texts.img_daily,
							alt: "Daily tradition showcase",
							class: "w-full h-auto object-contain"
						}, null, 8, ["src"])])])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/About.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var About_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-d980873b"]]);
//#endregion
export { About_default as default };

//# sourceMappingURL=About-CMzCf24U.js.map