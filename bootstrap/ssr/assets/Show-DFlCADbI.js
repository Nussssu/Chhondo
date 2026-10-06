import { c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { g as createLucideIcon, t as _sfc_main$1 } from "./AppLayout-ochFaCc-.js";
import { t as ChevronRight } from "./chevron-right-D3yEXXmI.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as rebrand } from "./rebrand-BSHbrJDv.js";
import { i as SwiperSlide, r as Swiper, t as Navigation } from "./swiper-SG8tqDXz.js";
import { t as Pagination } from "./pagination-wRlRCk5-.js";
/* empty css                    */
//#region node_modules/.pnpm/lucide-vue-next@0.400.0_vue@3.5.38/node_modules/lucide-vue-next/dist/esm/icons/chevron-left.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronLeft = createLucideIcon("ChevronLeftIcon", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
//#endregion
//#region resources/js/Pages/Public/Blog/Show.vue
var _sfc_main = {
	__name: "Show",
	__ssrInlineRender: true,
	props: {
		post: {
			type: Object,
			required: true
		},
		related: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const props = __props;
		/**
		* The header is sticky from 1280px up, so a sidebar stuck to the viewport top
		* slides underneath it. Offset the sticky position by the header's real height
		* (it changes with the top bar and between breakpoints) instead of guessing.
		*/
		const asideTop = (0, vue_exports.ref)("24px");
		let observer = null;
		function updateAsideTop() {
			if (typeof window === "undefined") return;
			const header = document.querySelector(".header-sticky");
			asideTop.value = window.innerWidth >= 1280 && header ? `${Math.round(header.getBoundingClientRect().height) + 16}px` : "24px";
		}
		(0, vue_exports.onMounted)(() => {
			updateAsideTop();
			window.addEventListener("resize", updateAsideTop);
			const header = document.querySelector(".header-sticky");
			if (header && typeof ResizeObserver !== "undefined") {
				observer = new ResizeObserver(updateAsideTop);
				observer.observe(header);
			}
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			window.removeEventListener("resize", updateAsideTop);
			observer?.disconnect();
			observer = null;
		});
		function formatDate(iso) {
			if (!iso) return "";
			return new Date(iso).toLocaleDateString("bn-BD", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		function share() {
			const url = window.location.href;
			if (navigator.share) {
				navigator.share({
					title: props.post.title,
					url
				}).catch(() => {});
				return;
			}
			navigator.clipboard?.writeText(url);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(__props.post.meta_title || __props.post.title))}</title><meta name="description"${(0, server_renderer_exports.ssrRenderAttr)("content", (0, vue_exports.unref)(rebrand)(__props.post.meta_description || __props.post.excerpt))} data-v-e53c0ac8${_scopeId}>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(__props.post.meta_title || __props.post.title)), 1), (0, vue_exports.createVNode)("meta", {
						name: "description",
						content: (0, vue_exports.unref)(rebrand)(__props.post.meta_description || __props.post.excerpt)
					}, null, 8, ["content"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<article class="post-page" data-v-e53c0ac8${_scopeId}><div class="container" data-v-e53c0ac8${_scopeId}><nav class="post-crumbs" data-v-e53c0ac8${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), { href: "/" }, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`হোম`);
								else return [(0, vue_exports.createTextVNode)("হোম")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span data-v-e53c0ac8${_scopeId}>/</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), { href: "/blog" }, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`ব্লগ`);
								else return [(0, vue_exports.createTextVNode)("ব্লগ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span data-v-e53c0ac8${_scopeId}>/</span><span class="post-crumb-current" data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(__props.post.title))}</span></nav><div class="post-hero" data-v-e53c0ac8${_scopeId}><header class="post-header" data-v-e53c0ac8${_scopeId}>`);
						if (__props.post.category) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: `/blog?category=${__props.post.category.slug}`,
							class: "blog-tag"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.post.category.name)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.post.category.name), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`<h1 class="post-title" data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rebrand)(__props.post.title))}</h1><div class="post-meta" data-v-e53c0ac8${_scopeId}><span data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(__props.post.published_at))}</span><span class="post-meta-dot" data-v-e53c0ac8${_scopeId}></span><span data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.post.reading_time)} মিনিট পড়া</span><button type="button" class="post-share" data-v-e53c0ac8${_scopeId}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e53c0ac8${_scopeId}><circle cx="18" cy="5" r="3" data-v-e53c0ac8${_scopeId}></circle><circle cx="6" cy="12" r="3" data-v-e53c0ac8${_scopeId}></circle><circle cx="18" cy="19" r="3" data-v-e53c0ac8${_scopeId}></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" data-v-e53c0ac8${_scopeId}></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" data-v-e53c0ac8${_scopeId}></line></svg> শেয়ার </button></div></header>`);
						if (__props.post.image) _push(`<figure class="post-cover" data-v-e53c0ac8${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", __props.post.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", __props.post.title)} data-v-e53c0ac8${_scopeId}></figure>`);
						else _push(`<!---->`);
						_push(`</div><div class="post-layout" data-v-e53c0ac8${_scopeId}><div class="post-main" data-v-e53c0ac8${_scopeId}><div class="post-body" data-v-e53c0ac8${_scopeId}>${(0, vue_exports.unref)(rebrand)(__props.post.description) ?? ""}</div>`);
						if (__props.post.tags?.length) {
							_push(`<div class="post-tags" data-v-e53c0ac8${_scopeId}><span class="post-tags-label" data-v-e53c0ac8${_scopeId}>ট্যাগ</span><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(__props.post.tags, (tag) => {
								_push(`<span class="post-tag" data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tag)}</span>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
						_push(`<div class="post-back" data-v-e53c0ac8${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/blog",
							class: "post-back-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`← সব লেখা দেখুন`);
								else return [(0, vue_exports.createTextVNode)("← সব লেখা দেখুন")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><aside class="post-aside" style="${(0, server_renderer_exports.ssrRenderStyle)({ "--aside-top": asideTop.value })}" data-v-e53c0ac8${_scopeId}><div class="post-aside-card" data-v-e53c0ac8${_scopeId}><h2 class="post-aside-title" data-v-e53c0ac8${_scopeId}>এই লেখাটি</h2><dl class="post-aside-list" data-v-e53c0ac8${_scopeId}>`);
						if (__props.post.category) {
							_push(`<div data-v-e53c0ac8${_scopeId}><dt data-v-e53c0ac8${_scopeId}>বিভাগ</dt><dd data-v-e53c0ac8${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), { href: `/blog?category=${__props.post.category.slug}` }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.post.category.name)}`);
									else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.post.category.name), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</dd></div>`);
						} else _push(`<!---->`);
						_push(`<div data-v-e53c0ac8${_scopeId}><dt data-v-e53c0ac8${_scopeId}>প্রকাশ</dt><dd data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(__props.post.published_at))}</dd></div><div data-v-e53c0ac8${_scopeId}><dt data-v-e53c0ac8${_scopeId}>পড়তে সময়</dt><dd data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.post.reading_time)} মিনিট</dd></div></dl><button type="button" class="post-aside-share" data-v-e53c0ac8${_scopeId}> লেখাটি শেয়ার করুন </button></div>`);
						if (__props.related.length) {
							_push(`<div class="post-aside-card" data-v-e53c0ac8${_scopeId}><h2 class="post-aside-title" data-v-e53c0ac8${_scopeId}>পরের লেখা</h2><ul class="post-aside-links" data-v-e53c0ac8${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(__props.related, (item) => {
								_push(`<li data-v-e53c0ac8${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), { href: `/blog/${item.slug}` }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.title)} loading="lazy" data-v-e53c0ac8${_scopeId}><span data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.title)}</span>`);
										else return [(0, vue_exports.createVNode)("img", {
											src: item.image,
											alt: item.title,
											loading: "lazy"
										}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.title), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</li>`);
							});
							_push(`<!--]--></ul></div>`);
						} else _push(`<!---->`);
						_push(`</aside></div></div>`);
						if (__props.related.length) {
							_push(`<section class="post-related" data-v-e53c0ac8${_scopeId}><div class="container" data-v-e53c0ac8${_scopeId}><header class="post-related-head" data-v-e53c0ac8${_scopeId}><h2 class="post-related-title" data-v-e53c0ac8${_scopeId}>আরও পড়ুন</h2><div class="post-related-nav" data-v-e53c0ac8${_scopeId}><button type="button" class="rel-arrow rel-prev" aria-label="আগের লেখা" data-v-e53c0ac8${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronLeft), { size: 18 }, null, _parent, _scopeId));
							_push(`</button><button type="button" class="rel-arrow rel-next" aria-label="পরের লেখা" data-v-e53c0ac8${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronRight), { size: 18 }, null, _parent, _scopeId));
							_push(`</button></div></header>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
								modules: [(0, vue_exports.unref)(Navigation), (0, vue_exports.unref)(Pagination)],
								"space-between": 16,
								"slides-per-view": 1.15,
								breakpoints: {
									480: {
										slidesPerView: 1.6,
										spaceBetween: 16
									},
									640: {
										slidesPerView: 2.2,
										spaceBetween: 18
									},
									1024: {
										slidesPerView: 3,
										spaceBetween: 24
									}
								},
								navigation: {
									prevEl: ".rel-prev",
									nextEl: ".rel-next"
								},
								pagination: {
									el: ".rel-dots",
									clickable: true
								},
								class: "post-related-swiper"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<!--[-->`);
										(0, server_renderer_exports.ssrRenderList)(__props.related, (item) => {
											_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), {
												key: item.id,
												class: "post-related-slide"
											}, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
														href: `/blog/${item.slug}`,
														class: "blog-card"
													}, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) {
																_push(`<div class="blog-card-media" data-v-e53c0ac8${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.title)} loading="lazy" data-v-e53c0ac8${_scopeId}></div><div class="blog-card-body" data-v-e53c0ac8${_scopeId}>`);
																if (item.category) _push(`<span class="blog-tag" data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.category.name)}</span>`);
																else _push(`<!---->`);
																_push(`<h3 class="blog-card-title" data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.title)}</h3><div class="post-meta" data-v-e53c0ac8${_scopeId}><span data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(item.published_at))}</span><span class="post-meta-dot" data-v-e53c0ac8${_scopeId}></span><span data-v-e53c0ac8${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.reading_time)} মিনিট পড়া</span></div></div>`);
															} else return [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
																src: item.image,
																alt: item.title,
																loading: "lazy"
															}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
																item.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
																	key: 0,
																	class: "blog-tag"
																}, (0, vue_exports.toDisplayString)(item.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
																(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)(item.title), 1),
																(0, vue_exports.createVNode)("div", { class: "post-meta" }, [
																	(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(item.published_at)), 1),
																	(0, vue_exports.createVNode)("span", { class: "post-meta-dot" }),
																	(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.reading_time) + " মিনিট পড়া", 1)
																])
															])];
														}),
														_: 2
													}, _parent, _scopeId));
													else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
														href: `/blog/${item.slug}`,
														class: "blog-card"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
															src: item.image,
															alt: item.title,
															loading: "lazy"
														}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
															item.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
																key: 0,
																class: "blog-tag"
															}, (0, vue_exports.toDisplayString)(item.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
															(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)(item.title), 1),
															(0, vue_exports.createVNode)("div", { class: "post-meta" }, [
																(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(item.published_at)), 1),
																(0, vue_exports.createVNode)("span", { class: "post-meta-dot" }),
																(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.reading_time) + " মিনিট পড়া", 1)
															])
														])]),
														_: 2
													}, 1032, ["href"])];
												}),
												_: 2
											}, _parent, _scopeId));
										});
										_push(`<!--]-->`);
									} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.related, (item) => {
										return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), {
											key: item.id,
											class: "post-related-slide"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
												href: `/blog/${item.slug}`,
												class: "blog-card"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
													src: item.image,
													alt: item.title,
													loading: "lazy"
												}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
													item.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
														key: 0,
														class: "blog-tag"
													}, (0, vue_exports.toDisplayString)(item.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)(item.title), 1),
													(0, vue_exports.createVNode)("div", { class: "post-meta" }, [
														(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(item.published_at)), 1),
														(0, vue_exports.createVNode)("span", { class: "post-meta-dot" }),
														(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.reading_time) + " মিনিট পড়া", 1)
													])
												])]),
												_: 2
											}, 1032, ["href"])]),
											_: 2
										}, 1024);
									}), 128))];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`<div class="rel-dots" data-v-e53c0ac8${_scopeId}></div></div></section>`);
						} else _push(`<!---->`);
						_push(`</article>`);
					} else return [(0, vue_exports.createVNode)("article", { class: "post-page" }, [(0, vue_exports.createVNode)("div", { class: "container" }, [
						(0, vue_exports.createVNode)("nav", { class: "post-crumbs" }, [
							(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), { href: "/" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("হোম")]),
								_: 1
							}),
							(0, vue_exports.createVNode)("span", null, "/"),
							(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), { href: "/blog" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("ব্লগ")]),
								_: 1
							}),
							(0, vue_exports.createVNode)("span", null, "/"),
							(0, vue_exports.createVNode)("span", { class: "post-crumb-current" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(__props.post.title)), 1)
						]),
						(0, vue_exports.createVNode)("div", { class: "post-hero" }, [(0, vue_exports.createVNode)("header", { class: "post-header" }, [
							__props.post.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: 0,
								href: `/blog?category=${__props.post.category.slug}`,
								class: "blog-tag"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.post.category.name), 1)]),
								_: 1
							}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("h1", { class: "post-title" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(rebrand)(__props.post.title)), 1),
							(0, vue_exports.createVNode)("div", { class: "post-meta" }, [
								(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(__props.post.published_at)), 1),
								(0, vue_exports.createVNode)("span", { class: "post-meta-dot" }),
								(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.post.reading_time) + " মিনিট পড়া", 1),
								(0, vue_exports.createVNode)("button", {
									type: "button",
									class: "post-share",
									onClick: share
								}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
									width: "15",
									height: "15",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									"stroke-width": "2",
									"stroke-linecap": "round",
									"stroke-linejoin": "round"
								}, [
									(0, vue_exports.createVNode)("circle", {
										cx: "18",
										cy: "5",
										r: "3"
									}),
									(0, vue_exports.createVNode)("circle", {
										cx: "6",
										cy: "12",
										r: "3"
									}),
									(0, vue_exports.createVNode)("circle", {
										cx: "18",
										cy: "19",
										r: "3"
									}),
									(0, vue_exports.createVNode)("line", {
										x1: "8.59",
										y1: "13.51",
										x2: "15.42",
										y2: "17.49"
									}),
									(0, vue_exports.createVNode)("line", {
										x1: "15.41",
										y1: "6.51",
										x2: "8.59",
										y2: "10.49"
									})
								])), (0, vue_exports.createTextVNode)(" শেয়ার ")])
							])
						]), __props.post.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("figure", {
							key: 0,
							class: "post-cover"
						}, [(0, vue_exports.createVNode)("img", {
							src: __props.post.image,
							alt: __props.post.title
						}, null, 8, ["src", "alt"])])) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.createVNode)("div", { class: "post-layout" }, [(0, vue_exports.createVNode)("div", { class: "post-main" }, [
							(0, vue_exports.createVNode)("div", {
								class: "post-body",
								innerHTML: (0, vue_exports.unref)(rebrand)(__props.post.description)
							}, null, 8, ["innerHTML"]),
							__props.post.tags?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "post-tags"
							}, [(0, vue_exports.createVNode)("span", { class: "post-tags-label" }, "ট্যাগ"), ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.post.tags, (tag) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: tag,
									class: "post-tag"
								}, (0, vue_exports.toDisplayString)(tag), 1);
							}), 128))])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("div", { class: "post-back" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
								href: "/blog",
								class: "post-back-btn"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("← সব লেখা দেখুন")]),
								_: 1
							})])
						]), (0, vue_exports.createVNode)("aside", {
							class: "post-aside",
							style: { "--aside-top": asideTop.value }
						}, [(0, vue_exports.createVNode)("div", { class: "post-aside-card" }, [
							(0, vue_exports.createVNode)("h2", { class: "post-aside-title" }, "এই লেখাটি"),
							(0, vue_exports.createVNode)("dl", { class: "post-aside-list" }, [
								__props.post.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", { key: 0 }, [(0, vue_exports.createVNode)("dt", null, "বিভাগ"), (0, vue_exports.createVNode)("dd", null, [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), { href: `/blog?category=${__props.post.category.slug}` }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.post.category.name), 1)]),
									_: 1
								}, 8, ["href"])])])) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("dt", null, "প্রকাশ"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(formatDate(__props.post.published_at)), 1)]),
								(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("dt", null, "পড়তে সময়"), (0, vue_exports.createVNode)("dd", null, (0, vue_exports.toDisplayString)(__props.post.reading_time) + " মিনিট", 1)])
							]),
							(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "post-aside-share",
								onClick: share
							}, " লেখাটি শেয়ার করুন ")
						]), __props.related.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "post-aside-card"
						}, [(0, vue_exports.createVNode)("h2", { class: "post-aside-title" }, "পরের লেখা"), (0, vue_exports.createVNode)("ul", { class: "post-aside-links" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.related, (item) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: item.id }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), { href: `/blog/${item.slug}` }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: item.image,
									alt: item.title,
									loading: "lazy"
								}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.title), 1)]),
								_: 2
							}, 1032, ["href"])]);
						}), 128))])])) : (0, vue_exports.createCommentVNode)("", true)], 4)])
					]), __props.related.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
						key: 0,
						class: "post-related"
					}, [(0, vue_exports.createVNode)("div", { class: "container" }, [
						(0, vue_exports.createVNode)("header", { class: "post-related-head" }, [(0, vue_exports.createVNode)("h2", { class: "post-related-title" }, "আরও পড়ুন"), (0, vue_exports.createVNode)("div", { class: "post-related-nav" }, [(0, vue_exports.createVNode)("button", {
							type: "button",
							class: "rel-arrow rel-prev",
							"aria-label": "আগের লেখা"
						}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(ChevronLeft), { size: 18 })]), (0, vue_exports.createVNode)("button", {
							type: "button",
							class: "rel-arrow rel-next",
							"aria-label": "পরের লেখা"
						}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(ChevronRight), { size: 18 })])])]),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(Swiper), {
							modules: [(0, vue_exports.unref)(Navigation), (0, vue_exports.unref)(Pagination)],
							"space-between": 16,
							"slides-per-view": 1.15,
							breakpoints: {
								480: {
									slidesPerView: 1.6,
									spaceBetween: 16
								},
								640: {
									slidesPerView: 2.2,
									spaceBetween: 18
								},
								1024: {
									slidesPerView: 3,
									spaceBetween: 24
								}
							},
							navigation: {
								prevEl: ".rel-prev",
								nextEl: ".rel-next"
							},
							pagination: {
								el: ".rel-dots",
								clickable: true
							},
							class: "post-related-swiper"
						}, {
							default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.related, (item) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), {
									key: item.id,
									class: "post-related-slide"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
										href: `/blog/${item.slug}`,
										class: "blog-card"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "blog-card-media" }, [(0, vue_exports.createVNode)("img", {
											src: item.image,
											alt: item.title,
											loading: "lazy"
										}, null, 8, ["src", "alt"])]), (0, vue_exports.createVNode)("div", { class: "blog-card-body" }, [
											item.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												class: "blog-tag"
											}, (0, vue_exports.toDisplayString)(item.category.name), 1)) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.createVNode)("h3", { class: "blog-card-title" }, (0, vue_exports.toDisplayString)(item.title), 1),
											(0, vue_exports.createVNode)("div", { class: "post-meta" }, [
												(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(formatDate(item.published_at)), 1),
												(0, vue_exports.createVNode)("span", { class: "post-meta-dot" }),
												(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(item.reading_time) + " মিনিট পড়া", 1)
											])
										])]),
										_: 2
									}, 1032, ["href"])]),
									_: 2
								}, 1024);
							}), 128))]),
							_: 1
						}, 8, ["modules"]),
						(0, vue_exports.createVNode)("div", { class: "rel-dots" })
					])])) : (0, vue_exports.createCommentVNode)("", true)])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Blog/Show.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Show_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-e53c0ac8"]]);
//#endregion
export { Show_default as default };

//# sourceMappingURL=Show-DFlCADbI.js.map