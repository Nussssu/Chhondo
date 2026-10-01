import { c as server_renderer_exports, i as link_default, l as vue_exports } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { r as CollectionCard_default, t as videoEmbedUrl } from "./videoEmbed-CEkxInuf.js";
//#region resources/js/components/Page/PageBlocks.vue
var _sfc_main = {
	__name: "PageBlocks",
	__ssrInlineRender: true,
	props: {
		blocks: {
			type: Array,
			default: () => []
		},
		openPreview: {
			type: Function,
			default: null
		}
	},
	setup(__props) {
		/**
		* Renders the widgets built in the admin (Content › Pages).
		*
		* Static widgets — headings, copy, images, galleries, video, raw HTML — render
		* as written. Product sections arrive with their products already resolved by
		* the server, so a section pointed at "new arrivals" or a category stays
		* current without the page being re-saved.
		*/
		const props = __props;
		const items = (0, vue_exports.computed)(() => props.blocks ?? []);
		function embed(url) {
			if (!url) return null;
			const host = /drive\.google\.com/i.test(url) ? "Gdrive" : "Youtube";
			return videoEmbedUrl(host, url, { autoplay: false });
		}
		function isFileVideo(url) {
			return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "");
		}
		/** Keeps the line breaks an operator typed into a heading. */
		function lineBreaks(value) {
			return String(value ?? "").replace(/[&<>"]/g, (c) => ({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				"\"": "&quot;"
			})[c]).replace(/\n/g, "<br />");
		}
		/** The strip always fills four columns, repeating if fewer were added. */
		function stripItems(block) {
			const items = (block.items ?? []).filter((i) => i.url);
			if (!items.length) return [];
			const out = [];
			for (let i = 0; i < 4; i++) out.push(items[i % items.length]);
			return out;
		}
		function gridClass(block) {
			return {
				2: "sm:grid-cols-2",
				3: "sm:grid-cols-3",
				4: "sm:grid-cols-2 md:grid-cols-4",
				5: "sm:grid-cols-3 md:grid-cols-5",
				6: "sm:grid-cols-3 md:grid-cols-6"
			}[Number(block.columns) || 4] ?? "sm:grid-cols-2 md:grid-cols-4";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(items.value, (block, index) => {
				_push(`<!--[-->`);
				if (block.type === "heading") {
					_push(`<section class="pb-block pb-block--prose pb-block--heading" data-v-11b972b9><div class="container" data-v-11b972b9>`);
					(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(`h${block.level || 2}`), { class: ["pb-heading", `pb-heading--h${block.level || 2}`] }, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(block.text)}`);
							else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(block.text), 1)];
						}),
						_: 2
					}), _parent);
					_push(`</div></section>`);
				} else if (block.type === "text") _push(`<section class="pb-block pb-block--prose" data-v-11b972b9><div class="container" data-v-11b972b9><div class="pb-prose" data-v-11b972b9>${block.html ?? ""}</div></div></section>`);
				else if (block.type === "image") {
					_push(`<figure class="pb-block pb-figure" data-v-11b972b9><div class="container" data-v-11b972b9><img${(0, server_renderer_exports.ssrRenderAttr)("src", block.url)}${(0, server_renderer_exports.ssrRenderAttr)("alt", block.alt || "")} loading="lazy" data-v-11b972b9>`);
					if (block.caption) _push(`<figcaption data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.caption)}</figcaption>`);
					else _push(`<!---->`);
					_push(`</div></figure>`);
				} else if (block.type === "image_text") {
					_push(`<section class="pb-block" data-v-11b972b9><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "pb-split--right": block.position === "right" }, "container pb-split"])}" data-v-11b972b9>`);
					if (block.url) _push(`<div class="pb-split-media" data-v-11b972b9><img${(0, server_renderer_exports.ssrRenderAttr)("src", block.url)}${(0, server_renderer_exports.ssrRenderAttr)("alt", block.alt || "")} loading="lazy" data-v-11b972b9></div>`);
					else _push(`<!---->`);
					_push(`<div class="pb-prose" data-v-11b972b9>${block.html ?? ""}</div></div></section>`);
				} else if (block.type === "video") {
					_push(`<section class="pb-block" data-v-11b972b9><div class="container" data-v-11b972b9>`);
					if (block.title) _push(`<h2 class="pb-section-title" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.title)}</h2>`);
					else _push(`<!---->`);
					_push(`<div class="pb-video" data-v-11b972b9>`);
					if (isFileVideo(block.video_url)) _push(`<video${(0, server_renderer_exports.ssrRenderAttr)("src", block.video_url)} controls playsinline data-v-11b972b9></video>`);
					else if (embed(block.video_url)) _push(`<iframe${(0, server_renderer_exports.ssrRenderAttr)("src", embed(block.video_url))} title="Video" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-11b972b9></iframe>`);
					else _push(`<!---->`);
					_push(`</div>`);
					if (block.caption) _push(`<p class="pb-caption" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.caption)}</p>`);
					else _push(`<!---->`);
					_push(`</div></section>`);
				} else if (block.type === "video_strip") {
					_push(`<section class="pb-video-strip" data-v-11b972b9>`);
					if (block.title) _push(`<h2 class="pb-section-title pb-strip-title" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.title)}</h2>`);
					else _push(`<!---->`);
					_push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-0" data-v-11b972b9><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(stripItems(block), (item, i) => {
						_push(`<div class="pb-strip-item" data-v-11b972b9>`);
						if (isFileVideo(item.url)) _push(`<video${(0, server_renderer_exports.ssrRenderAttr)("src", item.url)}${(0, server_renderer_exports.ssrRenderAttr)("poster", item.poster || void 0)} class="w-full h-full object-cover" autoplay muted loop playsinline preload="metadata" data-v-11b972b9></video>`);
						else if (embed(item.url)) _push(`<iframe${(0, server_renderer_exports.ssrRenderAttr)("src", embed(item.url))} class="w-full h-full" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen data-v-11b972b9></iframe>`);
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div></section>`);
				} else if (block.type === "gallery") {
					_push(`<section class="pb-block" data-v-11b972b9><div class="container" data-v-11b972b9>`);
					if (block.title) _push(`<h2 class="pb-section-title" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.title)}</h2>`);
					else _push(`<!---->`);
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([gridClass(block), "pb-gallery"])}" data-v-11b972b9><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(block.items || [], (item, i) => {
						_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.url)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.alt || "")} loading="lazy" data-v-11b972b9>`);
					});
					_push(`<!--]--></div></div></section>`);
				} else if (block.type === "cta_banner") {
					_push(`<section class="pb-block pb-cta-band" data-v-11b972b9><div class="container text-center" data-v-11b972b9>`);
					if (block.title) _push(`<h2 class="pb-cta-title" data-v-11b972b9>${lineBreaks(block.title) ?? ""}</h2>`);
					else _push(`<!---->`);
					if (block.text) _push(`<p class="pb-section-sub" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.text)}</p>`);
					else _push(`<!---->`);
					if (block.button_label) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
						href: block.button_url || "/shop",
						class: "pb-cta-band-btn"
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(block.button_label)} <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-11b972b9${_scopeId}><path d="M9 18l6-6-6-6" data-v-11b972b9${_scopeId}></path></svg>`);
							else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(block.button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "18",
								height: "18",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"stroke-linejoin": "round"
							}, [(0, vue_exports.createVNode)("path", { d: "M9 18l6-6-6-6" })]))];
						}),
						_: 2
					}, _parent));
					else _push(`<!---->`);
					_push(`</div></section>`);
				} else if (block.type === "feature_cards") {
					_push(`<section class="pb-block pb-cards" data-v-11b972b9><div class="container" data-v-11b972b9>`);
					if (block.title) _push(`<h2 class="pb-section-title text-center" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.title)}</h2>`);
					else _push(`<!---->`);
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-title": block.title }, "pb-cards-grid"])}" data-v-11b972b9><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(block.items || [], (card, i) => {
						_push(`<div class="pb-card" data-v-11b972b9>`);
						if (card.title) _push(`<h3 class="pb-card-title" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(card.title)}</h3>`);
						else _push(`<!---->`);
						if (card.text) _push(`<p class="pb-card-text" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(card.text)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div></div></section>`);
				} else if (block.type === "product_section") {
					_push(`<section class="pb-block pb-products" data-v-11b972b9><div class="container" data-v-11b972b9>`);
					if (block.title || block.subtitle) {
						_push(`<div class="pb-products-head" data-v-11b972b9>`);
						if (block.title) _push(`<h2 class="pb-section-title" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.title)}</h2>`);
						else _push(`<!---->`);
						if (block.subtitle) _push(`<p class="pb-section-sub" data-v-11b972b9>${(0, server_renderer_exports.ssrInterpolate)(block.subtitle)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([gridClass(block), "grid grid-cols-2 gap-4 md:gap-6"])}" data-v-11b972b9><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(block.products || [], (product) => {
						_push((0, server_renderer_exports.ssrRenderComponent)(CollectionCard_default, {
							key: product.id,
							product,
							openPreview: __props.openPreview
						}, null, _parent));
					});
					_push(`<!--]--></div>`);
					if (block.cta_label && block.cta_url) {
						_push(`<div class="pb-cta" data-v-11b972b9>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: block.cta_url,
							class: "pb-cta-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(block.cta_label)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(block.cta_label), 1)];
							}),
							_: 2
						}, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div></section>`);
				} else if (block.type === "html") _push(`<section class="pb-block" data-v-11b972b9><div class="container" data-v-11b972b9><div class="pb-prose" data-v-11b972b9>${block.code ?? ""}</div></div></section>`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			});
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Page/PageBlocks.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PageBlocks_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-11b972b9"]]);
//#endregion
export { PageBlocks_default as t };

//# sourceMappingURL=PageBlocks-D2c141xH.js.map