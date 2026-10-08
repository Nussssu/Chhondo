import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-BWP1wqVC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
import { i as shown, n as plain, r as rich, t as on } from "./cms-BWXg6J9T.js";
//#region resources/js/Pages/Public/About.vue
var _sfc_main = {
	__name: "About",
	__ssrInlineRender: true,
	props: {
		texts: {
			type: Object,
			default: () => ({})
		},
		content: String,
		blocks: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const props = __props;
		const t = (0, vue_exports.computed)(() => props.texts || {});
		const heroImages = (0, vue_exports.computed)(() => [
			{
				src: t.value.hero_image_1,
				cls: "ab-mosaic-img--1"
			},
			{
				src: t.value.hero_image_2,
				cls: "ab-mosaic-img--4"
			},
			{
				src: t.value.hero_image_3,
				cls: "ab-mosaic-img--2"
			},
			{
				src: t.value.hero_image_4,
				cls: "ab-mosaic-img--3"
			}
		].filter((image) => image.src));
		const stats = (0, vue_exports.computed)(() => shown(t.value.stats));
		const values = (0, vue_exports.computed)(() => shown(t.value.values));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(plain)(t.value.tab_title))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(plain)(t.value.tab_title)), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						if ((0, vue_exports.unref)(on)(t.value.hero_show)) {
							_push(`<section class="ab-hero" data-v-d910110e${_scopeId}><div class="container ab-hero-grid" data-v-d910110e${_scopeId}><div class="ab-mosaic" aria-hidden="true" data-v-d910110e${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(heroImages.value, (image) => {
								_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", image.src)} alt="" class="${(0, server_renderer_exports.ssrRenderClass)([image.cls, "ab-mosaic-img"])}" data-v-d910110e${_scopeId}>`);
							});
							_push(`<!--]--></div><div class="ab-hero-copy" data-v-d910110e${_scopeId}><div class="ab-text" data-v-d910110e${_scopeId}><h1 class="ab-title" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.hero_title) ?? ""}</h1>`);
							if ((0, vue_exports.unref)(on)(t.value.hero_text_show)) _push(`<p class="ab-lead" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.hero_text) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if ((0, vue_exports.unref)(on)(t.value.stats_show) && stats.value.length) {
								_push(`<dl class="ab-stats" data-v-d910110e${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(stats.value, (stat, i) => {
									_push(`<div class="ab-stat" data-v-d910110e${_scopeId}><dt class="ab-stat-value" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(stat.value)}</dt><dd class="ab-stat-label" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(stat.label) ?? ""}</dd></div>`);
								});
								_push(`<!--]--></dl>`);
							} else _push(`<!---->`);
							_push(`</div></div></section>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(t.value.band_show)) {
							_push(`<section class="ab-band" data-v-d910110e${_scopeId}><div class="container ab-band-grid" data-v-d910110e${_scopeId}><div class="ab-band-copy" data-v-d910110e${_scopeId}><div class="ab-text" data-v-d910110e${_scopeId}><h2 class="ab-title ab-title--light" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.band_title) ?? ""}</h2>`);
							if ((0, vue_exports.unref)(on)(t.value.band_text_show)) _push(`<p class="ab-body ab-body--light" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.band_text) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if ((0, vue_exports.unref)(on)(t.value.band_button_show) && t.value.band_button_label) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								href: t.value.band_button_url || "/shop",
								class: "ab-ghost-btn"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(t.value.band_button_label)} <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-d910110e${_scopeId}><path d="M9 18l6-6-6-6" data-v-d910110e${_scopeId}></path></svg>`);
									else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.band_button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
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
							_push(`</div><div class="ab-band-media" aria-hidden="true" data-v-d910110e${_scopeId}>`);
							if (t.value.band_image_1) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", t.value.band_image_1)} alt="" loading="lazy" class="ab-band-img ab-band-img--short" data-v-d910110e${_scopeId}>`);
							else _push(`<!---->`);
							if (t.value.band_image_2) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", t.value.band_image_2)} alt="" loading="lazy" class="ab-band-img ab-band-img--tall" data-v-d910110e${_scopeId}>`);
							else _push(`<!---->`);
							_push(`</div></div></section>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(t.value.craft_show)) {
							_push(`<section class="ab-craft" data-v-d910110e${_scopeId}><span class="ab-watermark" aria-hidden="true" data-v-d910110e${_scopeId}></span><div class="container ab-craft-grid" data-v-d910110e${_scopeId}><div class="ab-craft-media" aria-hidden="true" data-v-d910110e${_scopeId}>`);
							if (t.value.craft_image_1) _push(`<span class="ab-frame ab-frame--small" data-v-d910110e${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", t.value.craft_image_1)} alt="" loading="lazy" data-v-d910110e${_scopeId}></span>`);
							else _push(`<!---->`);
							if (t.value.craft_image_2) _push(`<span class="ab-frame ab-frame--large" data-v-d910110e${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", t.value.craft_image_2)} alt="" loading="lazy" data-v-d910110e${_scopeId}></span>`);
							else _push(`<!---->`);
							_push(`</div><div class="ab-text ab-craft-copy" data-v-d910110e${_scopeId}><h2 class="ab-title" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.craft_title) ?? ""}</h2>`);
							if ((0, vue_exports.unref)(on)(t.value.craft_text_show)) _push(`<p class="ab-body" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.craft_text) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div></div></section>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(t.value.values_show)) {
							_push(`<section class="ab-values" data-v-d910110e${_scopeId}><div class="container" data-v-d910110e${_scopeId}><h2 class="ab-title ab-title--center" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.values_title) ?? ""}</h2><div class="ab-values-grid" data-v-d910110e${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(values.value, (item, i) => {
								_push(`<article class="ab-value" data-v-d910110e${_scopeId}>`);
								if (item.image) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.image)} alt="" class="ab-value-numeral" aria-hidden="true" loading="lazy" data-v-d910110e${_scopeId}>`);
								else _push(`<!---->`);
								_push(`<p class="ab-value-eyebrow" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.eyebrow)}</p><h3 class="ab-value-title" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.title)}</h3><p class="ab-value-text" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.text)}</p></article>`);
							});
							_push(`<!--]--></div></div></section>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(t.value.quote_show)) {
							_push(`<section class="ab-quote" data-v-d910110e${_scopeId}><div class="container" data-v-d910110e${_scopeId}><blockquote class="ab-quote-text" data-v-d910110e${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.quote_text, { breaks: "desktop" }) ?? ""}</blockquote>`);
							if ((0, vue_exports.unref)(on)(t.value.quote_by_show)) _push(`<div class="ab-quote-by" data-v-d910110e${_scopeId}><span class="ab-quote-avatar" aria-hidden="true" data-v-d910110e${_scopeId}><span data-v-d910110e${_scopeId}></span></span><div data-v-d910110e${_scopeId}><p class="ab-quote-name" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.quote_name)}</p><p class="ab-quote-role" data-v-d910110e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.quote_role)}</p></div></div>`);
							else _push(`<!---->`);
							_push(`</div></section>`);
						} else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [
						(0, vue_exports.unref)(on)(t.value.hero_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 0,
							class: "ab-hero"
						}, [(0, vue_exports.createVNode)("div", { class: "container ab-hero-grid" }, [(0, vue_exports.createVNode)("div", {
							class: "ab-mosaic",
							"aria-hidden": "true"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(heroImages.value, (image) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
								key: image.cls,
								src: image.src,
								alt: "",
								class: ["ab-mosaic-img", image.cls]
							}, null, 10, ["src"]);
						}), 128))]), (0, vue_exports.createVNode)("div", { class: "ab-hero-copy" }, [(0, vue_exports.createVNode)("div", { class: "ab-text" }, [(0, vue_exports.createVNode)("h1", {
							class: "ab-title",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.hero_title)
						}, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.hero_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "ab-lead",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.hero_text)
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.stats_show) && stats.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("dl", {
							key: 0,
							class: "ab-stats"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(stats.value, (stat, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: i,
								class: "ab-stat"
							}, [(0, vue_exports.createVNode)("dt", { class: "ab-stat-value" }, (0, vue_exports.toDisplayString)(stat.value), 1), (0, vue_exports.createVNode)("dd", {
								class: "ab-stat-label",
								innerHTML: (0, vue_exports.unref)(rich)(stat.label)
							}, null, 8, ["innerHTML"])]);
						}), 128))])) : (0, vue_exports.createCommentVNode)("", true)])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(t.value.band_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 1,
							class: "ab-band"
						}, [(0, vue_exports.createVNode)("div", { class: "container ab-band-grid" }, [(0, vue_exports.createVNode)("div", { class: "ab-band-copy" }, [(0, vue_exports.createVNode)("div", { class: "ab-text" }, [(0, vue_exports.createVNode)("h2", {
							class: "ab-title ab-title--light",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.band_title)
						}, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.band_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "ab-body ab-body--light",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.band_text)
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.band_button_show) && t.value.band_button_label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
							key: 0,
							href: t.value.band_button_url || "/shop",
							class: "ab-ghost-btn"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.band_button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
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
						}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", {
							class: "ab-band-media",
							"aria-hidden": "true"
						}, [t.value.band_image_1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
							key: 0,
							src: t.value.band_image_1,
							alt: "",
							loading: "lazy",
							class: "ab-band-img ab-band-img--short"
						}, null, 8, ["src"])) : (0, vue_exports.createCommentVNode)("", true), t.value.band_image_2 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
							key: 1,
							src: t.value.band_image_2,
							alt: "",
							loading: "lazy",
							class: "ab-band-img ab-band-img--tall"
						}, null, 8, ["src"])) : (0, vue_exports.createCommentVNode)("", true)])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(t.value.craft_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 2,
							class: "ab-craft"
						}, [(0, vue_exports.createVNode)("span", {
							class: "ab-watermark",
							"aria-hidden": "true"
						}), (0, vue_exports.createVNode)("div", { class: "container ab-craft-grid" }, [(0, vue_exports.createVNode)("div", {
							class: "ab-craft-media",
							"aria-hidden": "true"
						}, [t.value.craft_image_1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 0,
							class: "ab-frame ab-frame--small"
						}, [(0, vue_exports.createVNode)("img", {
							src: t.value.craft_image_1,
							alt: "",
							loading: "lazy"
						}, null, 8, ["src"])])) : (0, vue_exports.createCommentVNode)("", true), t.value.craft_image_2 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 1,
							class: "ab-frame ab-frame--large"
						}, [(0, vue_exports.createVNode)("img", {
							src: t.value.craft_image_2,
							alt: "",
							loading: "lazy"
						}, null, 8, ["src"])])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "ab-text ab-craft-copy" }, [(0, vue_exports.createVNode)("h2", {
							class: "ab-title",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.craft_title)
						}, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.craft_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "ab-body",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.craft_text)
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(t.value.values_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 3,
							class: "ab-values"
						}, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("h2", {
							class: "ab-title ab-title--center",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.values_title)
						}, null, 8, ["innerHTML"]), (0, vue_exports.createVNode)("div", { class: "ab-values-grid" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(values.value, (item, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("article", {
								key: i,
								class: "ab-value"
							}, [
								item.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
									key: 0,
									src: item.image,
									alt: "",
									class: "ab-value-numeral",
									"aria-hidden": "true",
									loading: "lazy"
								}, null, 8, ["src"])) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("p", { class: "ab-value-eyebrow" }, (0, vue_exports.toDisplayString)(item.eyebrow), 1),
								(0, vue_exports.createVNode)("h3", { class: "ab-value-title" }, (0, vue_exports.toDisplayString)(item.title), 1),
								(0, vue_exports.createVNode)("p", { class: "ab-value-text" }, (0, vue_exports.toDisplayString)(item.text), 1)
							]);
						}), 128))])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(t.value.quote_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 4,
							class: "ab-quote"
						}, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("blockquote", {
							class: "ab-quote-text",
							innerHTML: (0, vue_exports.unref)(rich)(t.value.quote_text, { breaks: "desktop" })
						}, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.quote_by_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "ab-quote-by"
						}, [(0, vue_exports.createVNode)("span", {
							class: "ab-quote-avatar",
							"aria-hidden": "true"
						}, [(0, vue_exports.createVNode)("span")]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "ab-quote-name" }, (0, vue_exports.toDisplayString)(t.value.quote_name), 1), (0, vue_exports.createVNode)("p", { class: "ab-quote-role" }, (0, vue_exports.toDisplayString)(t.value.quote_role), 1)])])) : (0, vue_exports.createCommentVNode)("", true)])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])
					];
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
var About_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-d910110e"]]);
//#endregion
export { About_default as default };

//# sourceMappingURL=About-CBap33tl.js.map