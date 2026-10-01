import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/components/Auth/AuthShowcaseLayout.vue
var _sfc_main = {
	__name: "AuthShowcaseLayout",
	__ssrInlineRender: true,
	props: { reviews: {
		type: Array,
		default: () => []
	} },
	setup(__props) {
		const props = __props;
		const fallbackReviews = [{
			name: "Nusrat Jahan",
			city: "Chittagong",
			rating: 5,
			review: "Finally a brand that celebrates our heritage without compromise. The Chondrika for Eid drew compliments all evening.",
			image: "/assets/images/slider/Web-Slider_01.webp"
		}, {
			name: "Sabrina Islam",
			city: "Sylhet",
			rating: 5,
			review: "Authentic handwoven quality you can feel immediately. My mother was moved to tears — this is what we grew up with.",
			image: "/assets/images/slider/Web-Slider_02.jpg"
		}];
		const reviews = (0, vue_exports.computed)(() => props.reviews && props.reviews.length ? props.reviews : fallbackReviews);
		const columns = (0, vue_exports.computed)(() => {
			const base = reviews.value;
			const colA = base;
			const colB = base.length > 1 ? [...base].slice().reverse() : base;
			return [{
				dir: "up",
				items: [...colA, ...colA]
			}, {
				dir: "down",
				items: [...colB, ...colB]
			}];
		});
		const initial = (name) => name ? name.charAt(0).toUpperCase() : "?";
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, _attrs, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-page" data-v-c078feb4${_scopeId}><aside class="auth-showcase" data-v-c078feb4${_scopeId}><div class="marquee" data-v-c078feb4${_scopeId}><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(columns.value, (col, ci) => {
							_push(`<div class="marquee-col" data-v-c078feb4${_scopeId}><div class="${(0, server_renderer_exports.ssrRenderClass)([col.dir === "up" ? "marquee-up" : "marquee-down", "marquee-track"])}" data-v-c078feb4${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(col.items, (r, i) => {
								_push(`<article class="review-slide" data-v-c078feb4${_scopeId}>`);
								if (r.image) _push(`<div class="review-image" data-v-c078feb4${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", r.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", r.name)} loading="lazy" data-v-c078feb4${_scopeId}></div>`);
								else _push(`<!---->`);
								_push(`<div class="review-body" data-v-c078feb4${_scopeId}><div class="review-stars" data-v-c078feb4${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(5, (s) => {
									_push(`<svg width="14" height="14" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", s <= (r.rating || 5) ? "#e5a83b" : "#e5e7eb")} stroke="none" data-v-c078feb4${_scopeId}><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" data-v-c078feb4${_scopeId}></path></svg>`);
								});
								_push(`<!--]--></div><p class="review-text" data-v-c078feb4${_scopeId}>&quot;${(0, server_renderer_exports.ssrInterpolate)(r.review)}&quot;</p><div class="review-author" data-v-c078feb4${_scopeId}><span class="review-avatar" data-v-c078feb4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(initial(r.name))}</span><div data-v-c078feb4${_scopeId}><p class="review-name" data-v-c078feb4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(r.name)}</p><p class="review-city" data-v-c078feb4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(r.city)}</p></div></div></div></article>`);
							});
							_push(`<!--]--></div></div>`);
						});
						_push(`<!--]--></div></aside><section class="auth-form-panel" data-v-c078feb4${_scopeId}><div class="auth-form-inner" data-v-c078feb4${_scopeId}>`);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						_push(`</div></section></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "auth-page" }, [(0, vue_exports.createVNode)("aside", { class: "auth-showcase" }, [(0, vue_exports.createVNode)("div", { class: "marquee" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(columns.value, (col, ci) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: ci,
							class: "marquee-col"
						}, [(0, vue_exports.createVNode)("div", { class: ["marquee-track", col.dir === "up" ? "marquee-up" : "marquee-down"] }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(col.items, (r, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("article", {
								key: ci + "-" + i,
								class: "review-slide"
							}, [r.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "review-image"
							}, [(0, vue_exports.createVNode)("img", {
								src: r.image,
								alt: r.name,
								loading: "lazy"
							}, null, 8, ["src", "alt"])])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("div", { class: "review-body" }, [
								(0, vue_exports.createVNode)("div", { class: "review-stars" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(5, (s) => {
									return (0, vue_exports.createVNode)("svg", {
										key: s,
										width: "14",
										height: "14",
										viewBox: "0 0 24 24",
										fill: s <= (r.rating || 5) ? "#e5a83b" : "#e5e7eb",
										stroke: "none"
									}, [(0, vue_exports.createVNode)("path", { d: "M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" })], 8, ["fill"]);
								}), 64))]),
								(0, vue_exports.createVNode)("p", { class: "review-text" }, "\"" + (0, vue_exports.toDisplayString)(r.review) + "\"", 1),
								(0, vue_exports.createVNode)("div", { class: "review-author" }, [(0, vue_exports.createVNode)("span", { class: "review-avatar" }, (0, vue_exports.toDisplayString)(initial(r.name)), 1), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "review-name" }, (0, vue_exports.toDisplayString)(r.name), 1), (0, vue_exports.createVNode)("p", { class: "review-city" }, (0, vue_exports.toDisplayString)(r.city), 1)])])
							])]);
						}), 128))], 2)]);
					}), 128))])]), (0, vue_exports.createVNode)("section", { class: "auth-form-panel" }, [(0, vue_exports.createVNode)("div", { class: "auth-form-inner" }, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, void 0, true)])])])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Auth/AuthShowcaseLayout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AuthShowcaseLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-c078feb4"]]);
//#endregion
export { AuthShowcaseLayout_default as t };

//# sourceMappingURL=AuthShowcaseLayout-B1dodl2Y.js.map