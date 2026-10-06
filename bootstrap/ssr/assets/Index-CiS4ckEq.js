import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default, s as router } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-ochFaCc-.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as rebrand } from "./rebrand-BSHbrJDv.js";
import { t as PageBlocks_default } from "./PageBlocks-BNL11rU6.js";
//#region resources/js/Pages/Public/Blog/Index.vue
var _sfc_main = {
	__name: "Index",
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
		intro: {
			type: Object,
			default: () => ({})
		},
		posts: {
			type: Object,
			default: () => ({
				data: [],
				links: []
			})
		},
		categories: {
			type: Array,
			default: () => []
		},
		activeCategory: {
			type: String,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const items = (0, vue_exports.computed)(() => props.posts?.data ?? []);
		const featured = (0, vue_exports.computed)(() => items.value[0] ?? null);
		const rest = (0, vue_exports.computed)(() => items.value.slice(1));
		const onFirstPage = (0, vue_exports.computed)(() => (props.posts?.current_page ?? 1) === 1);
		const gridPosts = (0, vue_exports.computed)(() => onFirstPage.value ? rest.value : items.value);
		function formatDate(iso) {
			if (!iso) return "";
			return new Date(iso).toLocaleDateString("bn-BD", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		function filterBy(slug) {
			router.get("/blog", slug ? { category: slug } : {}, {
				preserveScroll: true,
				preserveState: true
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.tab_title)}</title><meta name="description"${(0, server_renderer_exports.ssrRenderAttr)("content", __props.texts.meta_description)} data-v-8cfac2e3${_scopeId}>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.tab_title), 1), (0, vue_exports.createVNode)("meta", {
						name: "description",
						content: __props.texts.meta_description
					}, null, 8, ["content"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="blog-page" data-v-8cfac2e3${_scopeId}><div class="container" data-v-8cfac2e3${_scopeId}><header class="blog-hero" data-v-8cfac2e3${_scopeId}>`);
						if (__props.intro?.label !== "") _push(`<span class="blog-eyebrow" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.label || "ছন্দ ব্লগ")}</span>`);
						else _push(`<!---->`);
						_push(`<h1 class="blog-hero-title" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title || "গল্প, যত্ন আর ঐতিহ্যের কথা")}</h1><p class="blog-hero-sub" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.subtitle || "শাড়ির যত্ন নেওয়ার সহজ উপায়, উৎসবের সাজ আর আমাদের তাঁতিদের হাতের গল্প — সবই এক জায়গায়।")}</p></header>`);
						if (__props.categories.length) {
							_push(`<nav class="blog-filters" data-v-8cfac2e3${_scopeId}><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": !__props.activeCategory }, "blog-chip"])}" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</button><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(__props.categories, (cat) => {
								_push(`<button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": __props.activeCategory === cat.slug }, "blog-chip"])}" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(cat.name)}</button>`);
							});
							_push(`<!--]--></nav>`);
						} else _push(`<!---->`);
						if (!items.value.length) _push(`<p class="blog-empty" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</p>`);
						else _push(`<!---->`);
						if (featured.value && onFirstPage.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: `/blog/${featured.value.slug}`,
							class: "blog-featured"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="blog-featured-media" data-v-8cfac2e3${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", featured.value.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", featured.value.title)} loading="lazy" data-v-8cfac2e3${_scopeId}></div><div class="blog-featured-body" data-v-8cfac2e3${_scopeId}>`);
									if (featured.value.category) _push(`<span class="blog-tag" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(featured.value.category.name)}</span>`);
									else _push(`<!---->`);
									_push(`<h2 class="blog-featured-title" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(featured.value.title)}</h2><p class="blog-featured-excerpt" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(featured.value.excerpt)}</p><div class="blog-meta" data-v-8cfac2e3${_scopeId}><span data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(featured.value.published_at))}</span><span class="blog-meta-dot" data-v-8cfac2e3${_scopeId}></span><span data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(featured.value.reading_time)} ${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</span></div><span class="blog-readmore" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</span></div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "blog-featured-media" }, [(0, vue_exports.createVNode)("img", {
									src: featured.value.image,
									alt: featured.value.title,
									loading: "lazy"
								}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-featured-body" }, [
									featured.value.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 0,
										class: "blog-tag"
									}, (0, vue_exports.toDisplayString)(featured.value.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
									(0, vue_exports.createVNode)("h2", { class: "blog-featured-title" }, (0, vue_exports.toDisplayString)(featured.value.title), 1),
									(0, vue_exports.createVNode)("p", { class: "blog-featured-excerpt" }, (0, vue_exports.toDisplayString)(featured.value.excerpt), 1),
									(0, vue_exports.createVNode)("div", { class: "blog-meta" }, [
										(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(featured.value.published_at)), 1),
										(0, vue_exports.createVNode)("span", { class: "blog-meta-dot" }),
										(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(featured.value.reading_time) + " " + (0, vue_exports.toDisplayString)(__props.texts.t5), 1)
									]),
									(0, vue_exports.createVNode)("span", { class: "blog-readmore" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1)
								])];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (gridPosts.value.length) {
							_push(`<div class="blog-grid" data-v-8cfac2e3${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(gridPosts.value, (post) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: post.id,
									href: `/blog/${post.slug}`,
									class: "blog-card"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<div class="blog-card-media" data-v-8cfac2e3${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", post.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", post.title)} loading="lazy" data-v-8cfac2e3${_scopeId}>`);
											if (post.category) _push(`<span class="blog-tag blog-tag--float" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(post.category.name)}</span>`);
											else _push(`<!---->`);
											_push(`</div><div class="blog-card-body" data-v-8cfac2e3${_scopeId}><h3 class="blog-card-title" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(post.title))}</h3><p class="blog-card-excerpt" data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(post.excerpt))}</p><div class="blog-meta" data-v-8cfac2e3${_scopeId}><span data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(post.published_at))}</span><span class="blog-meta-dot" data-v-8cfac2e3${_scopeId}></span><span data-v-8cfac2e3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(post.reading_time)} ${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</span></div></div>`);
										} else return [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
											src: post.image,
											alt: post.title,
											loading: "lazy"
										}, null, 8, ["src", "alt"]), post.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											class: "blog-tag blog-tag--float"
										}, (0, vue_exports.toDisplayString)(post.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
											(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(post.title)), 1),
											(0, vue_exports.createVNode)("p", { class: "blog-card-excerpt" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(post.excerpt)), 1),
											(0, vue_exports.createVNode)("div", { class: "blog-meta" }, [
												(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(post.published_at)), 1),
												(0, vue_exports.createVNode)("span", { class: "blog-meta-dot" }),
												(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(post.reading_time) + " " + (0, vue_exports.toDisplayString)(__props.texts.t5), 1)
											])
										])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
						if (__props.posts.last_page > 1) {
							_push(`<nav class="blog-pagination" data-v-8cfac2e3${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(__props.posts.links, (link) => {
								_push(`<!--[-->`);
								if (link.url) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									href: link.url,
									class: ["blog-page-btn", { "is-active": link.active }],
									"preserve-scroll": ""
								}, null, _parent, _scopeId));
								else _push(`<span class="blog-page-btn is-disabled" data-v-8cfac2e3${_scopeId}>${link.label ?? ""}</span>`);
								_push(`<!--]-->`);
							});
							_push(`<!--]--></nav>`);
						} else _push(`<!---->`);
						_push(`</div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", { class: "blog-page" }, [(0, vue_exports.createVNode)("div", { class: "container" }, [
						(0, vue_exports.createVNode)("header", { class: "blog-hero" }, [
							__props.intro?.label !== "" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								class: "blog-eyebrow"
							}, (0, vue_exports.toDisplayString)(__props.intro?.label || "ছন্দ ব্লগ"), 1)) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("h1", { class: "blog-hero-title" }, (0, vue_exports.toDisplayString)(__props.intro?.title || "গল্প, যত্ন আর ঐতিহ্যের কথা"), 1),
							(0, vue_exports.createVNode)("p", { class: "blog-hero-sub" }, (0, vue_exports.toDisplayString)(__props.intro?.subtitle || "শাড়ির যত্ন নেওয়ার সহজ উপায়, উৎসবের সাজ আর আমাদের তাঁতিদের হাতের গল্প — সবই এক জায়গায়।"), 1)
						]),
						__props.categories.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("nav", {
							key: 0,
							class: "blog-filters"
						}, [(0, vue_exports.createVNode)("button", {
							type: "button",
							class: ["blog-chip", { "is-active": !__props.activeCategory }],
							onClick: ($event) => filterBy(null)
						}, (0, vue_exports.toDisplayString)(__props.texts.t2), 11, ["onClick"]), ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.categories, (cat) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
								key: cat.id,
								type: "button",
								class: ["blog-chip", { "is-active": __props.activeCategory === cat.slug }],
								onClick: ($event) => filterBy(cat.slug)
							}, (0, vue_exports.toDisplayString)(cat.name), 11, ["onClick"]);
						}), 128))])) : (0, vue_exports.createCommentVNode)("", true),
						!items.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 1,
							class: "blog-empty"
						}, (0, vue_exports.toDisplayString)(__props.texts.t3), 1)) : (0, vue_exports.createCommentVNode)("", true),
						featured.value && onFirstPage.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
							key: 2,
							href: `/blog/${featured.value.slug}`,
							class: "blog-featured"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "blog-featured-media" }, [(0, vue_exports.createVNode)("img", {
								src: featured.value.image,
								alt: featured.value.title,
								loading: "lazy"
							}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-featured-body" }, [
								featured.value.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									class: "blog-tag"
								}, (0, vue_exports.toDisplayString)(featured.value.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("h2", { class: "blog-featured-title" }, (0, vue_exports.toDisplayString)(featured.value.title), 1),
								(0, vue_exports.createVNode)("p", { class: "blog-featured-excerpt" }, (0, vue_exports.toDisplayString)(featured.value.excerpt), 1),
								(0, vue_exports.createVNode)("div", { class: "blog-meta" }, [
									(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(featured.value.published_at)), 1),
									(0, vue_exports.createVNode)("span", { class: "blog-meta-dot" }),
									(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(featured.value.reading_time) + " " + (0, vue_exports.toDisplayString)(__props.texts.t5), 1)
								]),
								(0, vue_exports.createVNode)("span", { class: "blog-readmore" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1)
							])]),
							_: 1
						}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true),
						gridPosts.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 3,
							class: "blog-grid"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(gridPosts.value, (post) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: post.id,
								href: `/blog/${post.slug}`,
								class: "blog-card"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
									src: post.image,
									alt: post.title,
									loading: "lazy"
								}, null, 8, ["src", "alt"]), post.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									class: "blog-tag blog-tag--float"
								}, (0, vue_exports.toDisplayString)(post.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
									(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(post.title)), 1),
									(0, vue_exports.createVNode)("p", { class: "blog-card-excerpt" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(post.excerpt)), 1),
									(0, vue_exports.createVNode)("div", { class: "blog-meta" }, [
										(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(post.published_at)), 1),
										(0, vue_exports.createVNode)("span", { class: "blog-meta-dot" }),
										(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(post.reading_time) + " " + (0, vue_exports.toDisplayString)(__props.texts.t5), 1)
									])
								])]),
								_: 2
							}, 1032, ["href"]);
						}), 128))])) : (0, vue_exports.createCommentVNode)("", true),
						__props.posts.last_page > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("nav", {
							key: 4,
							class: "blog-pagination"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.posts.links, (link) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: link.label }, [link.url ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: 0,
								href: link.url,
								class: ["blog-page-btn", { "is-active": link.active }],
								"preserve-scroll": "",
								innerHTML: link.label
							}, null, 8, [
								"href",
								"class",
								"innerHTML"
							])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 1,
								class: "blog-page-btn is-disabled",
								innerHTML: link.label
							}, null, 8, ["innerHTML"]))], 64);
						}), 128))])) : (0, vue_exports.createCommentVNode)("", true)
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Blog/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Index_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-8cfac2e3"]]);
//#endregion
export { Index_default as default };

//# sourceMappingURL=Index-CiS4ckEq.js.map