import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-CNqlOJ3L.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-P8L_ue1k.js";
//#region resources/js/components/Auth/AuthShowcaseLayout.vue
var _sfc_main = {
	__name: "AuthShowcaseLayout",
	__ssrInlineRender: true,
	props: {
		reviews: {
			type: Array,
			default: () => []
		},
		hideFooter: {
			type: Boolean,
			default: false
		},
		photos: {
			type: Array,
			default: () => []
		},
		showPhotos: {
			type: Boolean,
			default: true
		},
		blocks: {
			type: Array,
			default: () => []
		}
	},
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
		const FIGMA_PHOTOS = [
			"/assets/chhondo/auth/auth-1.jpg",
			"/assets/chhondo/auth/auth-2.jpg",
			"/assets/chhondo/auth/auth-3.jpg",
			"/assets/chhondo/auth/auth-4.jpg"
		];
		const reviews = (0, vue_exports.computed)(() => props.reviews && props.reviews.length ? props.reviews : fallbackReviews);
		const columns = (0, vue_exports.computed)(() => {
			const list = reviews.value;
			const card = (i) => ({
				type: "card",
				review: list[i % list.length]
			});
			if (props.showPhotos === false) return [{
				dir: "up",
				items: [
					card(0),
					card(1),
					card(0),
					card(1)
				]
			}, {
				dir: "down",
				items: [
					card(1),
					card(0),
					card(1),
					card(0)
				]
			}];
			const photo = (n) => ({
				type: "photo",
				src: props.photos[n] || FIGMA_PHOTOS[n]
			});
			const colA = [
				card(0),
				photo(0),
				photo(1)
			];
			const colB = [
				photo(2),
				card(1),
				photo(3)
			];
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
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, (0, vue_exports.mergeProps)({ "hide-footer": __props.hideFooter }, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "auth-page--fit": __props.hideFooter }, "auth-page container"])}" data-v-8e2f4b3a${_scopeId}><aside class="auth-showcase" data-v-8e2f4b3a${_scopeId}><div class="marquee" data-v-8e2f4b3a${_scopeId}><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(columns.value, (col, ci) => {
							_push(`<div class="marquee-col" data-v-8e2f4b3a${_scopeId}><div class="${(0, server_renderer_exports.ssrRenderClass)([col.dir === "up" ? "marquee-up" : "marquee-down", "marquee-track"])}" data-v-8e2f4b3a${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(col.items, (item, i) => {
								_push(`<!--[-->`);
								if (item.type === "photo") _push(`<div class="review-image" data-v-8e2f4b3a${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)} alt="" loading="eager" data-v-8e2f4b3a${_scopeId}></div>`);
								else {
									_push(`<article class="review-slide" data-v-8e2f4b3a${_scopeId}><div class="review-author" data-v-8e2f4b3a${_scopeId}><span class="review-avatar" data-v-8e2f4b3a${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(initial(item.review.name))}</span><div data-v-8e2f4b3a${_scopeId}><p class="review-name" data-v-8e2f4b3a${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.review.name)}</p><p class="review-city" data-v-8e2f4b3a${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.review.city)}</p></div></div><div class="review-stars" data-v-8e2f4b3a${_scopeId}><!--[-->`);
									(0, server_renderer_exports.ssrRenderList)(5, (s) => {
										_push(`<svg width="14" height="14" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", s <= (item.review.rating || 5) ? "#d6af51" : "#efe0bb")} stroke="none" data-v-8e2f4b3a${_scopeId}><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" data-v-8e2f4b3a${_scopeId}></path></svg>`);
									});
									_push(`<!--]--></div><p class="review-text" data-v-8e2f4b3a${_scopeId}>&quot;${(0, server_renderer_exports.ssrInterpolate)(item.review.review)}&quot;</p></article>`);
								}
								_push(`<!--]-->`);
							});
							_push(`<!--]--></div></div>`);
						});
						_push(`<!--]--></div></aside><section class="auth-form-panel" data-v-8e2f4b3a${_scopeId}><div class="auth-form-inner" data-v-8e2f4b3a${_scopeId}>`);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						_push(`</div></section></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("div", { class: ["auth-page container", { "auth-page--fit": __props.hideFooter }] }, [(0, vue_exports.createVNode)("aside", { class: "auth-showcase" }, [(0, vue_exports.createVNode)("div", { class: "marquee" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(columns.value, (col, ci) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: ci,
							class: "marquee-col"
						}, [(0, vue_exports.createVNode)("div", { class: ["marquee-track", col.dir === "up" ? "marquee-up" : "marquee-down"] }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(col.items, (item, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: ci + "-" + i }, [item.type === "photo" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "review-image"
							}, [(0, vue_exports.createVNode)("img", {
								src: item.src,
								alt: "",
								loading: "eager"
							}, null, 8, ["src"])])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("article", {
								key: 1,
								class: "review-slide"
							}, [
								(0, vue_exports.createVNode)("div", { class: "review-author" }, [(0, vue_exports.createVNode)("span", { class: "review-avatar" }, (0, vue_exports.toDisplayString)(initial(item.review.name)), 1), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "review-name" }, (0, vue_exports.toDisplayString)(item.review.name), 1), (0, vue_exports.createVNode)("p", { class: "review-city" }, (0, vue_exports.toDisplayString)(item.review.city), 1)])]),
								(0, vue_exports.createVNode)("div", { class: "review-stars" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(5, (s) => {
									return (0, vue_exports.createVNode)("svg", {
										key: s,
										width: "14",
										height: "14",
										viewBox: "0 0 24 24",
										fill: s <= (item.review.rating || 5) ? "#d6af51" : "#efe0bb",
										stroke: "none"
									}, [(0, vue_exports.createVNode)("path", { d: "M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" })], 8, ["fill"]);
								}), 64))]),
								(0, vue_exports.createVNode)("p", { class: "review-text" }, "\"" + (0, vue_exports.toDisplayString)(item.review.review) + "\"", 1)
							]))], 64);
						}), 128))], 2)]);
					}), 128))])]), (0, vue_exports.createVNode)("section", { class: "auth-form-panel" }, [(0, vue_exports.createVNode)("div", { class: "auth-form-inner" }, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, void 0, true)])])], 2), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
var AuthShowcaseLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-8e2f4b3a"]]);
//#endregion
export { AuthShowcaseLayout_default as t };

//# sourceMappingURL=AuthShowcaseLayout-4uoTRlyx.js.map