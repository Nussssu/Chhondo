import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, t as useHead } from "../ssr.js";
import { _ as _sfc_main$9, c as isVariantOutOfStock, i as useHomeStore, l as preOrderNote, o as isOutOfStock, r as useWishlistStore, s as isPreOrder, t as _sfc_main$10 } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { a as discountFor, c as wasPriceFor, i as blousePriceFor, l as parseGalleryImages, n as videoThumbnailUrl, o as priceFor, r as CollectionCard_default, s as priceForAmount, t as videoEmbedUrl } from "./videoEmbed-CEkxInuf.js";
import { t as ProductPreviewModel_default } from "./ProductPreviewModel-CDbDRzyi.js";
import { d as isObject, h as getDocument, i as SwiperSlide, o as elementChildren, r as Swiper, t as Navigation } from "./navigation-4kYiGdSZ.js";
import { t as freeMode } from "./free-mode-BEMsMeya.js";
//#region node_modules/swiper/modules/thumbs.mjs
function Thumb(_ref) {
	let { swiper, extendParams, on } = _ref;
	extendParams({ thumbs: {
		swiper: null,
		multipleActiveThumbs: true,
		autoScrollOffset: 0,
		slideThumbActiveClass: "swiper-slide-thumb-active",
		thumbsContainerClass: "swiper-thumbs"
	} });
	let initialized = false;
	let swiperCreated = false;
	swiper.thumbs = { swiper: null };
	function onThumbClick() {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const clickedIndex = thumbsSwiper.clickedIndex;
		const clickedSlide = thumbsSwiper.clickedSlide;
		if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
		if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
		let slideToIndex;
		if (thumbsSwiper.params.loop) slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
		else slideToIndex = clickedIndex;
		if (swiper.params.loop) swiper.slideToLoop(slideToIndex);
		else swiper.slideTo(slideToIndex);
	}
	function init() {
		const { thumbs: thumbsParams } = swiper.params;
		if (initialized) return false;
		initialized = true;
		const SwiperClass = swiper.constructor;
		if (thumbsParams.swiper instanceof SwiperClass) {
			if (thumbsParams.swiper.destroyed) {
				initialized = false;
				return false;
			}
			swiper.thumbs.swiper = thumbsParams.swiper;
			Object.assign(swiper.thumbs.swiper.originalParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			Object.assign(swiper.thumbs.swiper.params, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			swiper.thumbs.swiper.update();
		} else if (isObject(thumbsParams.swiper)) {
			const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
			Object.assign(thumbsSwiperParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
			swiperCreated = true;
		}
		swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
		swiper.thumbs.swiper.on("tap", onThumbClick);
		return true;
	}
	function update(initial) {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
		let thumbsToActivate = 1;
		const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
		if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = swiper.params.slidesPerView;
		if (!swiper.params.thumbs.multipleActiveThumbs) thumbsToActivate = 1;
		thumbsToActivate = Math.floor(thumbsToActivate);
		thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
		if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) for (let i = 0; i < thumbsToActivate; i += 1) elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach((slideEl) => {
			slideEl.classList.add(thumbActiveClass);
		});
		else for (let i = 0; i < thumbsToActivate; i += 1) if (thumbsSwiper.slides[swiper.realIndex + i]) thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
		const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
		const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
		if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
			const currentThumbsIndex = thumbsSwiper.activeIndex;
			let newThumbsIndex;
			let direction;
			if (thumbsSwiper.params.loop) {
				const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
				newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
				direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
			} else {
				newThumbsIndex = swiper.realIndex;
				direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
			}
			if (useOffset) newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
			if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
				if (thumbsSwiper.params.centeredSlides) {
					if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
					else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
				} else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1);
				thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
			}
		}
	}
	on("beforeInit", () => {
		const { thumbs } = swiper.params;
		if (!thumbs || !thumbs.swiper) return;
		if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
			const document = getDocument();
			const getThumbsElementAndInit = () => {
				const thumbsElement = typeof thumbs.swiper === "string" ? document.querySelector(thumbs.swiper) : thumbs.swiper;
				if (thumbsElement && thumbsElement.swiper) {
					thumbs.swiper = thumbsElement.swiper;
					init();
					update(true);
				} else if (thumbsElement) {
					const eventName = `${swiper.params.eventsPrefix}init`;
					const onThumbsSwiper = (e) => {
						thumbs.swiper = e.detail[0];
						thumbsElement.removeEventListener(eventName, onThumbsSwiper);
						init();
						update(true);
						thumbs.swiper.update();
						swiper.update();
					};
					thumbsElement.addEventListener(eventName, onThumbsSwiper);
				}
				return thumbsElement;
			};
			const watchForThumbsToAppear = () => {
				if (swiper.destroyed) return;
				if (!getThumbsElementAndInit()) requestAnimationFrame(watchForThumbsToAppear);
			};
			requestAnimationFrame(watchForThumbsToAppear);
		} else {
			init();
			update(true);
		}
	});
	on("slideChange update resize observerUpdate", () => {
		update();
	});
	on("setTransition", (_s, duration) => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		thumbsSwiper.setTransition(duration);
	});
	on("beforeDestroy", () => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		if (swiperCreated) thumbsSwiper.destroy();
	});
	Object.assign(swiper.thumbs, {
		init,
		update
	});
}
//#endregion
//#region resources/js/components/Product/ProductImages.vue
var _sfc_main$8 = {
	__name: "ProductImages",
	__ssrInlineRender: true,
	props: { product: {
		type: Object,
		required: true
	} },
	emits: ["imageFunction"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const productItems = (0, vue_exports.ref)([]);
		const thumbsSwiper = (0, vue_exports.ref)(null);
		const mainSwiper = (0, vue_exports.ref)(null);
		const activeIndex = (0, vue_exports.ref)(0);
		const hasLeadingVideo = (0, vue_exports.computed)(() => productItems.value[0]?.type === "video");
		/** Stored relative to public/; an absolute URL is used untouched. */
		const videoSrc = (value) => {
			if (!value) return value;
			return /^(https?:)?\/\//.test(value) ? value : "/" + String(value).replace(/^\/+/, "");
		};
		const thumbsAtStart = (0, vue_exports.ref)(true);
		const thumbsAtEnd = (0, vue_exports.ref)(true);
		const updateThumbEdges = (swiper = thumbsSwiper.value) => {
			if (!swiper || swiper.destroyed) return;
			thumbsAtStart.value = swiper.isLocked || swiper.isBeginning;
			thumbsAtEnd.value = swiper.isLocked || swiper.isEnd;
		};
		const setThumbsSwiper = (swiper) => {
			thumbsSwiper.value = swiper;
			(0, vue_exports.nextTick)(() => updateThumbEdges(swiper));
		};
		const setMainSwiper = (swiper) => {
			mainSwiper.value = swiper;
		};
		const handleSlideChange = (swiper) => {
			activeIndex.value = swiper.activeIndex;
		};
		(0, vue_exports.onMounted)(() => {
			emit("imageFunction", findImage);
		});
		const findImage = (colorIndex) => {
			if (!mainSwiper.value || !thumbsSwiper.value) {
				console.warn("Swipers not yet initialized");
				return;
			}
			const targetIndex = colorIndex + 1 + (hasLeadingVideo.value ? 1 : 0);
			if (targetIndex < productItems.value.length) {
				mainSwiper.value.slideTo(targetIndex);
				thumbsSwiper.value.slideTo(targetIndex);
				activeIndex.value = targetIndex;
			}
		};
		(0, vue_exports.watch)(() => props.product, (newProduct) => {
			if (!newProduct) return;
			const parsedImages = parseGalleryImages(newProduct.gallery_images);
			const images = [newProduct.featured_image, ...parsedImages].filter(Boolean).map((img) => ({
				type: "image",
				src: img
			}));
			if (newProduct.video_link || newProduct.video) images.unshift({
				type: "video",
				src: videoSrc(newProduct.video),
				host: newProduct.video_host,
				embedUrl: videoEmbedUrl(newProduct.video_host, newProduct.video_link),
				poster: videoThumbnailUrl(newProduct.video_host, newProduct.video_link)
			});
			productItems.value = images;
			(0, vue_exports.nextTick)(() => updateThumbEdges());
		}, { immediate: true });
		const discountPercentage = (0, vue_exports.computed)(() => {
			const { price, previous_price } = props.product;
			if (!previous_price || previous_price <= 0) return 0;
			const discount = (previous_price - price) / previous_price * 100;
			return Math.round(discount);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "flex flex-col gap-6 product-images-area" }, _attrs))} data-v-6e875d9f><div class="relative rounded-lg overflow-hidden w-full bg-[#f5f0eb]" data-v-6e875d9f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
				modules: [(0, vue_exports.unref)(Navigation), (0, vue_exports.unref)(Thumb)],
				thumbs: { swiper: thumbsSwiper.value },
				navigation: {
					nextEl: ".product-button-next",
					prevEl: ".product-button-prev"
				},
				onSwiper: setMainSwiper,
				onSlideChange: handleSlideChange,
				class: "product-swiper"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(productItems.value, (item, index) => {
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), { key: index }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) {
										if (item.type === "image") _push(`<div class="relative overflow-hidden" data-v-6e875d9f${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)}${(0, server_renderer_exports.ssrRenderAttr)("alt", `Product image ${index + 1}`)} class="w-full h-auto" fetchpriority="high" loading="lazy" data-v-6e875d9f${_scopeId}></div>`);
										else {
											_push(`<div class="video-container relative w-full aspect-[2/3] bg-black overflow-hidden" data-v-6e875d9f${_scopeId}>`);
											if (item.embedUrl) _push(`<div class="embed-cover" data-v-6e875d9f${_scopeId}><iframe${(0, server_renderer_exports.ssrRenderAttr)("src", item.embedUrl)} frameborder="0" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" tabindex="-1" aria-hidden="true" data-v-6e875d9f${_scopeId}></iframe></div>`);
											else if (item.host === "Youtube" || item.host === "Gdrive") _push(`<div class="absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center" data-v-6e875d9f${_scopeId}> This video link could not be read. </div>`);
											else _push(`<video autoplay muted loop playsinline preload="metadata" class="absolute inset-0 w-full h-full object-cover pointer-events-none" data-v-6e875d9f${_scopeId}><source${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)} type="video/mp4" data-v-6e875d9f${_scopeId}> Your browser does not support the video tag. </video>`);
											_push(`</div>`);
										}
									} else return [item.type === "image" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "relative overflow-hidden"
									}, [(0, vue_exports.createVNode)("img", {
										src: item.src,
										alt: `Product image ${index + 1}`,
										class: "w-full h-auto",
										fetchpriority: "high",
										loading: "lazy"
									}, null, 8, ["src", "alt"])])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										class: "video-container relative w-full aspect-[2/3] bg-black overflow-hidden"
									}, [item.embedUrl ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "embed-cover"
									}, [(0, vue_exports.createVNode)("iframe", {
										src: item.embedUrl,
										frameborder: "0",
										allow: "autoplay; encrypted-media",
										referrerpolicy: "strict-origin-when-cross-origin",
										tabindex: "-1",
										"aria-hidden": "true"
									}, null, 8, ["src"])])) : item.host === "Youtube" || item.host === "Gdrive" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										class: "absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center"
									}, " This video link could not be read. ")) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("video", {
										key: 2,
										autoplay: "",
										muted: "",
										loop: "",
										playsinline: "",
										preload: "metadata",
										class: "absolute inset-0 w-full h-full object-cover pointer-events-none"
									}, [(0, vue_exports.createVNode)("source", {
										src: item.src,
										type: "video/mp4"
									}, null, 8, ["src"]), (0, vue_exports.createTextVNode)(" Your browser does not support the video tag. ")]))]))];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(productItems.value, (item, index) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), { key: index }, {
							default: (0, vue_exports.withCtx)(() => [item.type === "image" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "relative overflow-hidden"
							}, [(0, vue_exports.createVNode)("img", {
								src: item.src,
								alt: `Product image ${index + 1}`,
								class: "w-full h-auto",
								fetchpriority: "high",
								loading: "lazy"
							}, null, 8, ["src", "alt"])])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "video-container relative w-full aspect-[2/3] bg-black overflow-hidden"
							}, [item.embedUrl ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "embed-cover"
							}, [(0, vue_exports.createVNode)("iframe", {
								src: item.embedUrl,
								frameborder: "0",
								allow: "autoplay; encrypted-media",
								referrerpolicy: "strict-origin-when-cross-origin",
								tabindex: "-1",
								"aria-hidden": "true"
							}, null, 8, ["src"])])) : item.host === "Youtube" || item.host === "Gdrive" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center"
							}, " This video link could not be read. ")) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("video", {
								key: 2,
								autoplay: "",
								muted: "",
								loop: "",
								playsinline: "",
								preload: "metadata",
								class: "absolute inset-0 w-full h-full object-cover pointer-events-none"
							}, [(0, vue_exports.createVNode)("source", {
								src: item.src,
								type: "video/mp4"
							}, null, 8, ["src"]), (0, vue_exports.createTextVNode)(" Your browser does not support the video tag. ")]))]))]),
							_: 2
						}, 1024);
					}), 128))];
				}),
				_: 1
			}, _parent));
			_push(`<button class="product-button-prev nav-arrow nav-arrow--left" data-v-6e875d9f><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-6e875d9f><polyline points="15 18 9 12 15 6" data-v-6e875d9f></polyline></svg></button><button class="product-button-next nav-arrow nav-arrow--right" data-v-6e875d9f><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-6e875d9f><polyline points="9 18 15 12 9 6" data-v-6e875d9f></polyline></svg></button>`);
			if (discountPercentage.value > 0) _push(`<div class="absolute top-4 right-4 z-10" data-v-6e875d9f><span class="bg-[#356019] text-white rounded-full py-1 px-3 text-[13px] font-semibold" data-v-6e875d9f> -${(0, server_renderer_exports.ssrInterpolate)(discountPercentage.value)}% </span></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (productItems.value.length > 1) {
				_push(`<div class="thumbs-wrap" data-v-6e875d9f>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
					modules: [
						(0, vue_exports.unref)(Thumb),
						(0, vue_exports.unref)(freeMode),
						(0, vue_exports.unref)(Navigation)
					],
					direction: "horizontal",
					"slides-per-view": 4,
					"space-between": 12,
					breakpoints: { 768: {
						slidesPerView: 4,
						spaceBetween: 24
					} },
					"free-mode": true,
					"watch-slides-progress": true,
					onSwiper: setThumbsSwiper,
					onProgress: updateThumbEdges,
					onResize: updateThumbEdges,
					onTransitionEnd: updateThumbEdges,
					onLock: updateThumbEdges,
					onUnlock: updateThumbEdges,
					class: "thumbs-swiper w-full"
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(productItems.value, (item, index) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), { key: index }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)(["aspect-square relative cursor-pointer rounded-lg overflow-hidden border-[1.5px] transition-all", {
												"border-[#618B46]": index === activeIndex.value,
												"border-transparent hover:opacity-90": index !== activeIndex.value
											}])}" data-v-6e875d9f${_scopeId}>`);
											if (item.type === "image") _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)}${(0, server_renderer_exports.ssrRenderAttr)("alt", `Thumbnail ${index + 1}`)} class="w-full h-full object-cover" loading="lazy" fetchpriority="low" data-v-6e875d9f${_scopeId}>`);
											else {
												_push(`<div class="relative w-full h-full bg-black" data-v-6e875d9f${_scopeId}>`);
												if (item.poster) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.poster)} alt="" class="w-full h-full object-cover" loading="lazy" data-v-6e875d9f${_scopeId}>`);
												else if (item.src) _push(`<video${(0, server_renderer_exports.ssrRenderAttr)("src", `${item.src}#t=0.1`)} muted playsinline preload="metadata" tabindex="-1" class="w-full h-full object-cover pointer-events-none" data-v-6e875d9f${_scopeId}></video>`);
												else _push(`<!---->`);
												_push(`<span class="absolute inset-0 flex items-center justify-center" data-v-6e875d9f${_scopeId}><span class="thumb-play" data-v-6e875d9f${_scopeId}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-v-6e875d9f${_scopeId}><path d="M8 5v14l11-7z" data-v-6e875d9f${_scopeId}></path></svg></span></span></div>`);
											}
											_push(`</div>`);
										} else return [(0, vue_exports.createVNode)("div", { class: ["aspect-square relative cursor-pointer rounded-lg overflow-hidden border-[1.5px] transition-all", {
											"border-[#618B46]": index === activeIndex.value,
											"border-transparent hover:opacity-90": index !== activeIndex.value
										}] }, [item.type === "image" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
											key: 0,
											src: item.src,
											alt: `Thumbnail ${index + 1}`,
											class: "w-full h-full object-cover",
											loading: "lazy",
											fetchpriority: "low"
										}, null, 8, ["src", "alt"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 1,
											class: "relative w-full h-full bg-black"
										}, [item.poster ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
											key: 0,
											src: item.poster,
											alt: "",
											class: "w-full h-full object-cover",
											loading: "lazy"
										}, null, 8, ["src"])) : item.src ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("video", {
											key: 1,
											src: `${item.src}#t=0.1`,
											muted: "",
											playsinline: "",
											preload: "metadata",
											tabindex: "-1",
											class: "w-full h-full object-cover pointer-events-none"
										}, null, 8, ["src"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("span", { class: "absolute inset-0 flex items-center justify-center" }, [(0, vue_exports.createVNode)("span", { class: "thumb-play" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
											width: "12",
											height: "12",
											viewBox: "0 0 24 24",
											fill: "currentColor",
											"aria-hidden": "true"
										}, [(0, vue_exports.createVNode)("path", { d: "M8 5v14l11-7z" })]))])])]))], 2)];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(productItems.value, (item, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), { key: index }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["aspect-square relative cursor-pointer rounded-lg overflow-hidden border-[1.5px] transition-all", {
									"border-[#618B46]": index === activeIndex.value,
									"border-transparent hover:opacity-90": index !== activeIndex.value
								}] }, [item.type === "image" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
									key: 0,
									src: item.src,
									alt: `Thumbnail ${index + 1}`,
									class: "w-full h-full object-cover",
									loading: "lazy",
									fetchpriority: "low"
								}, null, 8, ["src", "alt"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 1,
									class: "relative w-full h-full bg-black"
								}, [item.poster ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
									key: 0,
									src: item.poster,
									alt: "",
									class: "w-full h-full object-cover",
									loading: "lazy"
								}, null, 8, ["src"])) : item.src ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("video", {
									key: 1,
									src: `${item.src}#t=0.1`,
									muted: "",
									playsinline: "",
									preload: "metadata",
									tabindex: "-1",
									class: "w-full h-full object-cover pointer-events-none"
								}, null, 8, ["src"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("span", { class: "absolute inset-0 flex items-center justify-center" }, [(0, vue_exports.createVNode)("span", { class: "thumb-play" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									"aria-hidden": "true"
								}, [(0, vue_exports.createVNode)("path", { d: "M8 5v14l11-7z" })]))])])]))], 2)]),
								_: 2
							}, 1024);
						}), 128))];
					}),
					_: 1
				}, _parent));
				_push(`<button type="button" class="thumb-arrow thumb-arrow--left" aria-label="আগের ছবিগুলো দেখুন" style="${(0, server_renderer_exports.ssrRenderStyle)(!thumbsAtStart.value ? null : { display: "none" })}" data-v-6e875d9f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-6e875d9f><polyline points="15 18 9 12 15 6" data-v-6e875d9f></polyline></svg></button><button type="button" class="thumb-arrow thumb-arrow--right" aria-label="আরও ছবি দেখুন" style="${(0, server_renderer_exports.ssrRenderStyle)(!thumbsAtEnd.value ? null : { display: "none" })}" data-v-6e875d9f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-6e875d9f><polyline points="9 18 15 12 9 6" data-v-6e875d9f></polyline></svg></button></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductImages.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var ProductImages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$8, [["__scopeId", "data-v-6e875d9f"]]);
//#endregion
//#region resources/js/components/Product/WriteReviewModal.vue
var MAX_REVIEW_LENGTH = 500;
var MAX_IMAGES = 5;
var _sfc_main$7 = {
	__name: "WriteReviewModal",
	__ssrInlineRender: true,
	props: {
		isOpen: Boolean,
		product: {
			type: Object,
			default: null
		}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const rating = (0, vue_exports.ref)(0);
		const hoverRating = (0, vue_exports.ref)(0);
		const name = (0, vue_exports.ref)("");
		const contact = (0, vue_exports.ref)("");
		const reviewText = (0, vue_exports.ref)("");
		const images = (0, vue_exports.ref)([]);
		const imagePreviews = (0, vue_exports.ref)([]);
		const submitting = (0, vue_exports.ref)(false);
		const errors = (0, vue_exports.ref)({});
		const reviewLength = (0, vue_exports.computed)(() => reviewText.value.length);
		const resetForm = () => {
			rating.value = 0;
			hoverRating.value = 0;
			name.value = "";
			contact.value = "";
			reviewText.value = "";
			images.value = [];
			imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
			imagePreviews.value = [];
			errors.value = {};
		};
		(0, vue_exports.watch)(() => props.isOpen, (open) => {
			if (typeof document !== "undefined") document.body.style.overflow = open ? "hidden" : "";
			if (!open) resetForm();
		});
		(0, vue_exports.ref)(null);
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.isOpen) {
				_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "review-modal-overlay" }, _attrs))} data-v-a26b079b><div class="review-modal" data-v-a26b079b><div class="review-modal-header" data-v-a26b079b><div data-v-a26b079b><h2 class="review-modal-title" data-v-a26b079b>Write a Review</h2>`);
				if (__props.product) _push(`<p class="review-modal-subtitle" data-v-a26b079b> for <span class="review-modal-product-name" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(__props.product.product_name)}</span></p>`);
				else _push(`<!---->`);
				_push(`</div><button type="button" class="review-modal-close" aria-label="Close" data-v-a26b079b><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-v-a26b079b><path d="M18 6L6 18" data-v-a26b079b></path><path d="M6 6l12 12" data-v-a26b079b></path></svg></button></div><div class="review-modal-body" data-v-a26b079b><form class="flex flex-col gap-4" data-v-a26b079b><div data-v-a26b079b><label class="review-label" data-v-a26b079b>Overall Rating <span class="review-required" data-v-a26b079b>*</span></label><div class="flex gap-2 mt-2" data-v-a26b079b><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(5, (n) => {
					_push(`<button type="button" class="review-star-btn"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${n} star`)} data-v-a26b079b><svg width="36" height="36" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= (hoverRating.value || rating.value) ? "#b47f54" : "none")} stroke="#b47f54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-a26b079b><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-a26b079b></polygon></svg></button>`);
				});
				_push(`<!--]--></div>`);
				if (errors.value.rating) _push(`<p class="review-error" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(errors.value.rating)}</p>`);
				else _push(`<!---->`);
				_push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-a26b079b><div data-v-a26b079b><label class="review-label" data-v-a26b079b>Your Name <span class="review-required" data-v-a26b079b>*</span></label><input${(0, server_renderer_exports.ssrRenderAttr)("value", name.value)} type="text" class="review-field mt-1.5" placeholder="" data-v-a26b079b>`);
				if (errors.value.name) _push(`<p class="review-error" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(errors.value.name)}</p>`);
				else _push(`<!---->`);
				_push(`</div><div data-v-a26b079b><label class="review-label" data-v-a26b079b>Email Address or Phone number <span class="review-required" data-v-a26b079b>*</span></label><input${(0, server_renderer_exports.ssrRenderAttr)("value", contact.value)} type="text" class="review-field mt-1.5" placeholder="" data-v-a26b079b><p class="review-hint" data-v-a26b079b>Not shown publicly</p>`);
				if (errors.value.contact) _push(`<p class="review-error" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(errors.value.contact)}</p>`);
				else _push(`<!---->`);
				_push(`</div></div><div data-v-a26b079b><div class="flex items-center justify-between" data-v-a26b079b><label class="review-label" data-v-a26b079b>Your Review <span class="review-required" data-v-a26b079b>*</span></label><span class="review-counter" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(reviewLength.value)} / ${(0, server_renderer_exports.ssrInterpolate)(MAX_REVIEW_LENGTH)}</span></div><textarea${(0, server_renderer_exports.ssrRenderAttr)("maxlength", MAX_REVIEW_LENGTH)} rows="4" class="review-field review-textarea mt-1.5" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(reviewText.value)}</textarea>`);
				if (errors.value.review) _push(`<p class="review-error" data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(errors.value.review)}</p>`);
				else _push(`<!---->`);
				_push(`</div><div data-v-a26b079b><label class="review-label" data-v-a26b079b>Add Photo</label><input type="file" accept="image/jpeg,image/png,image/jpg" multiple class="hidden" data-v-a26b079b><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-disabled": images.value.length >= MAX_IMAGES }, "review-upload-box mt-1.5"])}"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(images.value.length >= MAX_IMAGES) ? " disabled" : ""} data-v-a26b079b><span class="review-upload-icon" data-v-a26b079b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E711D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-a26b079b><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-a26b079b></path><polyline points="17 8 12 3 7 8" data-v-a26b079b></polyline><line x1="12" y1="3" x2="12" y2="15" data-v-a26b079b></line></svg></span><span class="text-left" data-v-a26b079b><span class="review-upload-title" data-v-a26b079b>Upload photos (Max 5 images)</span><span class="review-upload-subtitle" data-v-a26b079b>JPG or PNG, up to 5 MB</span></span></button>`);
				if (imagePreviews.value.length > 0) {
					_push(`<div class="flex flex-wrap gap-2 mt-3" data-v-a26b079b><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(imagePreviews.value, (src, i) => {
						_push(`<div class="review-thumb" data-v-a26b079b><img${(0, server_renderer_exports.ssrRenderAttr)("src", src)} alt="" data-v-a26b079b><button type="button" class="review-thumb-remove" aria-label="Remove image" data-v-a26b079b><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-a26b079b><path d="M18 6L6 18" data-v-a26b079b></path><path d="M6 6l12 12" data-v-a26b079b></path></svg></button></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`</div></form></div><div class="review-modal-footer" data-v-a26b079b><button type="button" class="review-submit-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(submitting.value) ? " disabled" : ""} data-v-a26b079b>${(0, server_renderer_exports.ssrInterpolate)(submitting.value ? "Submitting..." : "Submit Review")}</button><p class="review-footer-note" data-v-a26b079b> By submitting you agree to our <span class="review-footer-link" data-v-a26b079b>review guidelines</span>.<br data-v-a26b079b> Your email or mobile number will never be shared. </p></div></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/WriteReviewModal.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var WriteReviewModal_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-a26b079b"]]);
//#endregion
//#region resources/js/components/Product/ImageLightbox.vue
var _sfc_main$6 = {
	__name: "ImageLightbox",
	__ssrInlineRender: true,
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		images: {
			type: Array,
			default: () => []
		},
		startIndex: {
			type: Number,
			default: 0
		},
		alt: {
			type: String,
			default: "Customer photo"
		}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const current = (0, vue_exports.ref)(0);
		const total = (0, vue_exports.computed)(() => props.images.length);
		const currentImage = (0, vue_exports.computed)(() => props.images[current.value] || null);
		const close = () => emit("close");
		const next = () => {
			if (total.value < 2) return;
			current.value = (current.value + 1) % total.value;
		};
		const prev = () => {
			if (total.value < 2) return;
			current.value = (current.value - 1 + total.value) % total.value;
		};
		const onKeydown = (event) => {
			if (event.key === "Escape") close();
			else if (event.key === "ArrowRight") next();
			else if (event.key === "ArrowLeft") prev();
		};
		const touchStartX = (0, vue_exports.ref)(0);
		const onTouchStart = (event) => {
			touchStartX.value = event.changedTouches[0].clientX;
		};
		const onTouchEnd = (event) => {
			const delta = event.changedTouches[0].clientX - touchStartX.value;
			if (Math.abs(delta) < 45) return;
			delta < 0 ? next() : prev();
		};
		const teardown = () => {
			if (typeof document === "undefined") return;
			document.body.style.overflow = "";
			document.removeEventListener("keydown", onKeydown);
		};
		(0, vue_exports.watch)(() => props.isOpen, (open) => {
			if (typeof document === "undefined") return;
			if (open) {
				current.value = Math.min(Math.max(props.startIndex, 0), Math.max(total.value - 1, 0));
				document.body.style.overflow = "hidden";
				document.addEventListener("keydown", onKeydown);
			} else teardown();
		});
		(0, vue_exports.onBeforeUnmount)(teardown);
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$9, _attrs, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderTeleport)(_push, (_push) => {
						if (__props.isOpen && currentImage.value) {
							_push(`<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" data-v-214bbdce${_scopeId}><button type="button" class="lightbox-close" aria-label="Close" data-v-214bbdce${_scopeId}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-214bbdce${_scopeId}><line x1="18" y1="6" x2="6" y2="18" data-v-214bbdce${_scopeId}></line><line x1="6" y1="6" x2="18" y2="18" data-v-214bbdce${_scopeId}></line></svg></button>`);
							if (total.value > 1) _push(`<button type="button" class="lightbox-nav lightbox-nav--prev" aria-label="Previous image" data-v-214bbdce${_scopeId}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-214bbdce${_scopeId}><polyline points="15 18 9 12 15 6" data-v-214bbdce${_scopeId}></polyline></svg></button>`);
							else _push(`<!---->`);
							_push(`<figure class="lightbox-stage" data-v-214bbdce${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", currentImage.value)}${(0, server_renderer_exports.ssrRenderAttr)("alt", __props.alt)} class="lightbox-image" data-v-214bbdce${_scopeId}></figure>`);
							if (total.value > 1) _push(`<button type="button" class="lightbox-nav lightbox-nav--next" aria-label="Next image" data-v-214bbdce${_scopeId}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-214bbdce${_scopeId}><polyline points="9 18 15 12 9 6" data-v-214bbdce${_scopeId}></polyline></svg></button>`);
							else _push(`<!---->`);
							if (total.value > 1) {
								_push(`<div class="lightbox-footer" data-v-214bbdce${_scopeId}><div class="lightbox-thumbs" data-v-214bbdce${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(__props.images, (img, i) => {
									_push(`<button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": i === current.value }, "lightbox-thumb"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `View image ${i + 1}`)} data-v-214bbdce${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", img)}${(0, server_renderer_exports.ssrRenderAttr)("alt", `${__props.alt} ${i + 1}`)} loading="lazy" data-v-214bbdce${_scopeId}></button>`);
								});
								_push(`<!--]--></div><p class="lightbox-counter" data-v-214bbdce${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(current.value + 1)} / ${(0, server_renderer_exports.ssrInterpolate)(total.value)}</p></div>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
					}, "body", false, _parent);
					else return [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Teleport, { to: "body" }, [(0, vue_exports.createVNode)(vue_exports.Transition, { name: "lightbox-fade" }, {
						default: (0, vue_exports.withCtx)(() => [__props.isOpen && currentImage.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "lightbox",
							role: "dialog",
							"aria-modal": "true",
							"aria-label": "Image viewer",
							onClick: (0, vue_exports.withModifiers)(close, ["self"]),
							onTouchstartPassive: onTouchStart,
							onTouchendPassive: onTouchEnd
						}, [
							(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "lightbox-close",
								"aria-label": "Close",
								onClick: close
							}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round"
							}, [(0, vue_exports.createVNode)("line", {
								x1: "18",
								y1: "6",
								x2: "6",
								y2: "18"
							}), (0, vue_exports.createVNode)("line", {
								x1: "6",
								y1: "6",
								x2: "18",
								y2: "18"
							})]))]),
							total.value > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
								key: 0,
								type: "button",
								class: "lightbox-nav lightbox-nav--prev",
								"aria-label": "Previous image",
								onClick: (0, vue_exports.withModifiers)(prev, ["stop"])
							}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"stroke-linejoin": "round"
							}, [(0, vue_exports.createVNode)("polyline", { points: "15 18 9 12 15 6" })]))])) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.createVNode)("figure", {
								class: "lightbox-stage",
								onClick: (0, vue_exports.withModifiers)(close, ["self"])
							}, [(0, vue_exports.createVNode)("img", {
								src: currentImage.value,
								alt: __props.alt,
								class: "lightbox-image"
							}, null, 8, ["src", "alt"])]),
							total.value > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
								key: 1,
								type: "button",
								class: "lightbox-nav lightbox-nav--next",
								"aria-label": "Next image",
								onClick: (0, vue_exports.withModifiers)(next, ["stop"])
							}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"stroke-linejoin": "round"
							}, [(0, vue_exports.createVNode)("polyline", { points: "9 18 15 12 9 6" })]))])) : (0, vue_exports.createCommentVNode)("", true),
							total.value > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								class: "lightbox-footer",
								onClick: (0, vue_exports.withModifiers)(() => {}, ["stop"])
							}, [(0, vue_exports.createVNode)("div", { class: "lightbox-thumbs" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.images, (img, i) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
									key: i,
									type: "button",
									class: ["lightbox-thumb", { "is-active": i === current.value }],
									"aria-label": `View image ${i + 1}`,
									onClick: ($event) => current.value = i
								}, [(0, vue_exports.createVNode)("img", {
									src: img,
									alt: `${__props.alt} ${i + 1}`,
									loading: "lazy"
								}, null, 8, ["src", "alt"])], 10, ["aria-label", "onClick"]);
							}), 128))]), (0, vue_exports.createVNode)("p", { class: "lightbox-counter" }, (0, vue_exports.toDisplayString)(current.value + 1) + " / " + (0, vue_exports.toDisplayString)(total.value), 1)], 8, ["onClick"])) : (0, vue_exports.createCommentVNode)("", true)
						], 32)) : (0, vue_exports.createCommentVNode)("", true)]),
						_: 1
					})]))];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ImageLightbox.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var ImageLightbox_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$6, [["__scopeId", "data-v-214bbdce"]]);
//#endregion
//#region resources/js/components/Product/ProductReviews.vue
var VISIBLE_COUNT = 3;
var _sfc_main$5 = {
	__name: "ProductReviews",
	__ssrInlineRender: true,
	props: {
		reviews: {
			type: Array,
			default: () => []
		},
		product: {
			type: Object,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const expanded = (0, vue_exports.ref)(false);
		const isReviewModalOpen = (0, vue_exports.ref)(false);
		const visibleReviews = (0, vue_exports.computed)(() => expanded.value ? props.reviews : props.reviews.slice(0, VISIBLE_COUNT));
		const averageRating = (0, vue_exports.computed)(() => {
			if (!props.reviews.length) return 0;
			const sum = props.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
			return Math.round(sum / props.reviews.length * 10) / 10;
		});
		const initial = (name) => name ? name.charAt(0).toUpperCase() : "C";
		const lightboxImages = (0, vue_exports.ref)([]);
		const lightboxIndex = (0, vue_exports.ref)(0);
		const isLightboxOpen = (0, vue_exports.ref)(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "reviews-section" }, _attrs))} data-v-7023276e><div class="container" data-v-7023276e><div class="max-w-[1080px] mx-auto" data-v-7023276e><div class="flex items-end justify-between gap-4 flex-wrap mb-8 md:mb-10" data-v-7023276e><div data-v-7023276e><h2 class="reviews-heading" data-v-7023276e>Customer Reviews</h2>`);
			if (__props.reviews.length > 0) {
				_push(`<div class="flex items-center gap-2 mt-2" aria-label="Average rating" data-v-7023276e><div class="flex gap-1" data-v-7023276e><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(5, (n) => {
					_push(`<svg width="24" height="24" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= Math.round(averageRating.value) ? "#b47f54" : "none")} stroke="#b47f54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-7023276e><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-7023276e></polygon></svg>`);
				});
				_push(`<!--]--></div><span class="reviews-avg" data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(averageRating.value.toFixed(1))}</span><span class="reviews-count" data-v-7023276e>(${(0, server_renderer_exports.ssrInterpolate)(__props.reviews.length)} reviews)</span></div>`);
			} else _push(`<!---->`);
			_push(`</div><button type="button" class="reviews-write-btn" data-v-7023276e> Write a review </button></div>`);
			if (__props.reviews.length === 0) _push(`<p class="reviews-empty" data-v-7023276e> এই পণ্যের জন্য এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন! </p>`);
			else {
				_push(`<div class="flex flex-col gap-4" data-v-7023276e><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(visibleReviews.value, (review, i) => {
					_push(`<article class="review-row" data-v-7023276e><div class="flex items-start justify-between gap-4" data-v-7023276e><div class="flex items-center gap-3.5" data-v-7023276e>`);
					if (review.image) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", review.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", review.name)} class="review-row-avatar" loading="lazy" data-v-7023276e>`);
					else _push(`<span class="review-row-avatar review-row-avatar--initial" data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(initial(review.name))}</span>`);
					_push(`<div data-v-7023276e><p class="review-row-name" data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(review.name)}</p>`);
					if (review.city) _push(`<p class="review-row-city" data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(review.city)}</p>`);
					else _push(`<!---->`);
					_push(`</div></div><div class="flex items-center gap-2 shrink-0" data-v-7023276e><div class="flex gap-1" data-v-7023276e><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(5, (n) => {
						_push(`<svg width="20" height="20" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= (review.rating || 5) ? "#b47f54" : "none")} stroke="#b47f54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-7023276e><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-7023276e></polygon></svg>`);
					});
					_push(`<!--]--></div><span class="review-row-rating" data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(review.rating || 5)}</span></div></div><p class="review-row-text" data-v-7023276e>“${(0, server_renderer_exports.ssrInterpolate)(review.review)}”</p>`);
					if (review.images && review.images.length) {
						_push(`<div class="review-row-photos" data-v-7023276e><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(review.images, (img, n) => {
							_push(`<button type="button" class="review-row-photo"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `View photo ${n + 1} from ${review.name}'s review`)} data-v-7023276e><img${(0, server_renderer_exports.ssrRenderAttr)("src", img)} alt="Customer photo" loading="lazy" data-v-7023276e></button>`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					_push(`</article>`);
				});
				_push(`<!--]--></div>`);
			}
			if (__props.reviews.length > VISIBLE_COUNT) _push(`<div class="text-center mt-6" data-v-7023276e><button type="button" class="reviews-see-more"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", expanded.value)} data-v-7023276e><span data-v-7023276e>${(0, server_renderer_exports.ssrInterpolate)(expanded.value ? "See less" : "See more")}</span><svg class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-expanded": expanded.value }, "reviews-see-more-icon"])}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-7023276e><polyline points="6 9 12 15 18 9" data-v-7023276e></polyline></svg></button></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(WriteReviewModal_default, {
				isOpen: isReviewModalOpen.value,
				product: __props.product,
				onClose: ($event) => isReviewModalOpen.value = false
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(ImageLightbox_default, {
				isOpen: isLightboxOpen.value,
				images: lightboxImages.value,
				startIndex: lightboxIndex.value,
				onClose: ($event) => isLightboxOpen.value = false
			}, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductReviews.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ProductReviews_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-7023276e"]]);
//#endregion
//#region resources/js/components/Product/RecentlyViewed.vue
var STORAGE_KEY = "recently_viewed_products";
var MAX_STORED = 8;
var MAX_SHOWN = 4;
var _sfc_main$4 = {
	__name: "RecentlyViewed",
	__ssrInlineRender: true,
	props: {
		product: {
			type: Object,
			required: true
		},
		openPreview: {
			type: Function,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const recentProducts = (0, vue_exports.ref)([]);
		/**
		* The stored ids, tolerating the old format.
		*
		* This used to hold whole product objects copied out of the page. Browsers
		* still carry those, so an entry that is an object is read for its id and the
		* rest of it discarded — the next write replaces the list with plain ids.
		*/
		function readStoredIds() {
			let stored = [];
			try {
				stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
			} catch (e) {
				stored = [];
			}
			if (!Array.isArray(stored)) return [];
			return stored.map((entry) => entry && typeof entry === "object" ? entry.id : entry).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
		}
		(0, vue_exports.onMounted)(async () => {
			if (typeof window === "undefined" || !props.product?.id) return;
			const stored = readStoredIds();
			const updated = [props.product.id, ...stored.filter((id) => id !== props.product.id)].slice(0, MAX_STORED);
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			} catch (e) {}
			const toShow = updated.filter((id) => id !== props.product.id).slice(0, MAX_SHOWN);
			if (toShow.length === 0) return;
			try {
				const response = await fetch(`/recently-viewed?ids=${toShow.join(",")}`, { headers: { Accept: "application/json" } });
				if (!response.ok) return;
				const data = await response.json();
				recentProducts.value = Array.isArray(data?.products) ? data.products : [];
			} catch (e) {
				recentProducts.value = [];
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (recentProducts.value.length > 0) {
				_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "bg-[#FFFAF4] py-12 md:py-16" }, _attrs))} data-v-a8f980e4><div class="container" data-v-a8f980e4><h2 class="recently-viewed-title text-center mb-8 md:mb-12" data-v-a8f980e4>Recently viewed</h2><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1300px] mx-auto" data-v-a8f980e4><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(recentProducts.value, (p) => {
					_push((0, server_renderer_exports.ssrRenderComponent)(CollectionCard_default, {
						key: p.id,
						product: p,
						openPreview: __props.openPreview
					}, null, _parent));
				});
				_push(`<!--]--></div></div></section>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/RecentlyViewed.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var RecentlyViewed_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-a8f980e4"]]);
//#endregion
//#region resources/js/components/Product/RelatedProducts.vue
var _sfc_main$3 = {
	__name: "RelatedProducts",
	__ssrInlineRender: true,
	props: {
		related_products: {
			type: Object,
			required: true,
			default: () => []
		},
		openPreview: {
			type: Function,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const hasProducts = (0, vue_exports.computed)(() => props.related_products && props.related_products.length > 0);
		const displayProducts = (0, vue_exports.computed)(() => {
			if (!props.related_products) return [];
			return props.related_products.slice(0, 4);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (hasProducts.value) {
				_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "bg-[#FFFAF4] py-12 md:py-16" }, _attrs))} data-v-5db005e3><div class="container" data-v-5db005e3><div class="text-center mb-8 md:mb-12" data-v-5db005e3><h2 class="related-title" data-v-5db005e3>আপনার পছন্দ হতে পারে</h2><p class="related-subtitle" data-v-5db005e3> প্রিমিয়াম কোয়ালিটির শাড়ি, হস্তনির্মিত নকশা এবং ঐতিহ্যবাহী কারুশিল্পের এক অনন্য সংগ্রহ। </p></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1300px] mx-auto" data-v-5db005e3><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(displayProducts.value, (product) => {
					_push((0, server_renderer_exports.ssrRenderComponent)(CollectionCard_default, {
						key: product.id,
						product,
						openPreview: __props.openPreview
					}, null, _parent));
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/RelatedProducts.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var RelatedProducts_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-5db005e3"]]);
//#endregion
//#region resources/js/components/Product/ProductDetail.vue
var _sfc_main$2 = {
	__name: "ProductDetail",
	__ssrInlineRender: true,
	props: {
		product: {
			type: Object,
			default: () => ({})
		},
		related_products: {
			type: Object,
			default: () => ({})
		},
		otherInfo: {
			type: Object,
			default: () => ({})
		},
		openPreview: {
			type: Function,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const wishlistStore = useWishlistStore();
		const homeStore = useHomeStore();
		const openIndex = (0, vue_exports.ref)(0);
		const accordionItems = (0, vue_exports.computed)(() => [
			{
				title: "শাড়ির যত্ন গাইড",
				html: props.product?.description || ""
			},
			{
				title: "রিফান্ড ও রিটার্ন পলিসি",
				content: `অর্ডার করার আগে প্রোডাক্ট সম্পর্কিত সকল তথ্য জেনে অর্ডার করুন।

ডিভাইস বা আলোর তারতম্যের কারণে কাপড় বা ব্লক প্রিন্ট এর রং ছবিতে এবং বাস্তবে হালকা পার্থক্য মনে হতে পারে। রং নিয়ে কোন কনফিউশন থাকলে কেনার আগে আমাদের ফেইসবুক পেইজে নক করতে পারেন। আমরা সর্বোচ্চ চেষ্টা করি গ্রাহককে ছবি দিয়ে সহায়তা করতে।

প্রডাক্টটি অবশ্যই ডেলিভারি ম্যান এর সামনে চেক করতে হবে। রিটার্ন করতে চাইলে সাথে সাথে ডেলিভারি ম্যান কে ফেরত দিতে পারবেন। রিটার্ন করতে চাইলে ডেলিভারি চার্জ আপনাকে দিতে হবে। চারুকথন সেই খরচ বহন করবে না।

শুধু মাত্র শাড়িতে কোন ছেঁড়াফাটা থাকলে ফিরিয়ে দিতে পারবেন। সেই ক্ষেত্রে যাবতীয় খরচ চারুকথন বহন করবে।

ডেলিভারি ম্যান চলে আসার পর আর কোন রকম রিটার্ন বা কমপ্লেইন নেয়া হবে না।`
			},
			{
				title: "ডেলিভারি চার্জ",
				html: `<ul class="delivery-charge-list">
      <li>ঢাকার মধ্যে ডেলিভারি চার্জ <span class="taka-highlight">৳${homeStore.siteinfos?.[0]?.shipping_charge_inside_dhaka || 70}</span></li>
      <li>ঢাকার বাইরে সারাদেশে ডেলিভারি চার্জ <span class="taka-highlight">৳${homeStore.siteinfos?.[0]?.shipping_charge_outside_dhaka || 130}</span></li>
    </ul>`
			},
			{
				title: "ডেলিভারি সময়সীমা",
				content: "ঢাকার মধ্যে মাত্র ২-৩ দিন এবং সারাদেশে ৩-৪ দিনের মধ্যে পেয়ে যাবেন।"
			}
		]);
		(0, vue_exports.onMounted)(() => {
			homeStore.fetchData();
		});
		(0, vue_exports.onMounted)(() => {
			if (props.product?.id) {
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({ ecommerce: null });
				window.dataLayer.push({
					event: "view_item",
					ecommerce: {
						currency: "BDT",
						value: props.product.price || 0,
						items: [{
							item_name: props.product.product_name || "",
							item_id: props.product.id,
							price: props.product.price || 0,
							item_category: props.product.category?.name || "",
							quantity: 1
						}]
					}
				});
			}
		});
		const attributeSelectionAlert = (0, vue_exports.ref)(false);
		const quantity = (0, vue_exports.ref)(1);
		const basePrice = (0, vue_exports.ref)(0);
		const hasBlouseOption = (0, vue_exports.computed)(() => !!props.product?.has_blouse_option && blousePriceFor(props.product) > 0);
		const blouseChoice = (0, vue_exports.ref)("without");
		const blouseChoices = [{
			value: "without",
			label: "Without blouse"
		}, {
			value: "with",
			label: "With blouse"
		}];
		const blouseExtra = (0, vue_exports.computed)(() => {
			const withPrice = blousePriceFor(props.product);
			const base = parseFloat(props.product?.price);
			if (withPrice > 0 && !isNaN(base) && withPrice > base) return Math.round(withPrice - base);
			return null;
		});
		const pageReviews = (0, vue_exports.computed)(() => usePage().props.reviews || []);
		const averageRating = (0, vue_exports.computed)(() => {
			const reviews = pageReviews.value;
			if (!reviews.length) return 0;
			const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
			return Math.round(sum / reviews.length * 10) / 10;
		});
		const currentBaseProductPrice = (0, vue_exports.computed)(() => {
			if (hasBlouseOption.value && blouseChoice.value === "with") return blousePriceFor(props.product);
			return parseFloat(props.product?.price) || 0;
		});
		const isPreOrderProduct = (0, vue_exports.computed)(() => isPreOrder(props.product));
		const isSoldOut = (0, vue_exports.computed)(() => isOutOfStock(props.product));
		const preOrderTiming = (0, vue_exports.computed)(() => preOrderNote(props.product));
		const selectedAttributes = (0, vue_exports.ref)({});
		const selectedCombination = (0, vue_exports.ref)(null);
		const groupedAttributes = (0, vue_exports.computed)(() => {
			if (!props.product || !props.product.product_attributes) return {};
			const grouped = {};
			props.product.product_attributes.forEach((attr) => {
				if (!attr.attribute || !attr.attribute.name) {
					console.warn("Invalid attribute structure:", attr);
					return;
				}
				if (!grouped[attr.attribute.name]) grouped[attr.attribute.name] = [];
				if (!grouped[attr.attribute.name].some((existingOption) => existingOption.attribute_option.id === attr.attribute_option.id)) grouped[attr.attribute.name].push(attr);
			});
			return grouped;
		});
		const sortedAttributeNames = (0, vue_exports.computed)(() => {
			return Object.keys(groupedAttributes.value).sort((a, b) => {
				return (props.product.product_attributes.find((attr) => attr.attribute.name === a)?.attribute.order || 0) - (props.product.product_attributes.find((attr) => attr.attribute.name === b)?.attribute.order || 0);
			});
		});
		const allAttributesSelected = (0, vue_exports.computed)(() => {
			return sortedAttributeNames.value.every((attr) => selectedAttributes.value[attr]);
		});
		const imageFunction = (0, vue_exports.ref)(null);
		const handleImageFunction = (fn) => {
			imageFunction.value = fn;
		};
		const getSelectedAttributeIds = () => {
			if (selectedCombination.value) return props.product.product_attributes.filter((attr) => attr.combination_id === selectedCombination.value.id).map((attr) => attr.id);
			else return Object.entries(selectedAttributes.value).map(([attributeName, optionId]) => {
				const attribute = props.product.product_attributes.find((attr) => attr.attribute.name === attributeName && attr.attribute_option.id === optionId);
				return attribute ? attribute.id : null;
			}).filter((id) => id !== null);
		};
		/**
		* Whether the size/colour currently chosen has run out.
		*
		* A product can be in stock overall while one variant is not — the quantity is
		* held per option row — so the buttons follow the selection, not just the
		* product. Only meaningful once every option has been picked.
		*/
		const selectedVariantSoldOut = (0, vue_exports.computed)(() => {
			if (!allAttributesSelected.value) return false;
			const ids = getSelectedAttributeIds();
			const rows = (props.product?.product_attributes ?? []).filter((attr) => ids.includes(attr.id));
			return isVariantOutOfStock(props.product, rows);
		});
		/** The single question both buy buttons ask. */
		const cannotBuy = (0, vue_exports.computed)(() => isSoldOut.value || selectedVariantSoldOut.value);
		const displayPrice = (0, vue_exports.computed)(() => {
			return formatPrice(basePrice.value);
		});
		const formatPrice = (price) => {
			const numPrice = parseFloat(price);
			if (isNaN(numPrice)) return "0";
			return Number.isInteger(numPrice) ? String(numPrice) : numPrice.toFixed(2);
		};
		/** True while the customer has the with-blouse option selected. */
		const withBlouse = (0, vue_exports.computed)(() => hasBlouseOption.value && blouseChoice.value === "with");
		const wasPrice = (0, vue_exports.computed)(() => {
			const was = wasPriceFor(props.product, withBlouse.value);
			return was ? Math.round(was) : null;
		});
		const savingAmount = (0, vue_exports.computed)(() => Math.round(discountFor(props.product)));
		/**
		* Set the displayed price from the amount the current selection resolves to.
		*
		* Every call site passes that amount — the with/without-blouse price plus any
		* attribute option prices. The argument used to be ignored here, so the page
		* showed the plain without-blouse price no matter what was chosen.
		*/
		const updateBasePrice = (amount = null) => {
			basePrice.value = amount === null ? priceFor(props.product, withBlouse.value) : priceForAmount(props.product, amount);
		};
		(0, vue_exports.watch)(() => props.product.price, (newPrice) => {
			if (newPrice !== void 0) updateBasePrice(currentBaseProductPrice.value);
		});
		const priceFlash = (0, vue_exports.ref)(false);
		let priceFlashTimer = null;
		(0, vue_exports.watch)(blouseChoice, () => {
			const optionPrice = Object.entries(selectedAttributes.value).map(([attributeName, optionId]) => {
				const matchingAttribute = props.product.product_attributes?.find((attr) => attr.attribute.name === attributeName && attr.attribute_option.id === optionId);
				return matchingAttribute ? parseFloat(matchingAttribute.price) || 0 : 0;
			}).reduce((sum, p) => sum + p, 0);
			updateBasePrice(currentBaseProductPrice.value + optionPrice);
			priceFlash.value = false;
			if (priceFlashTimer) clearTimeout(priceFlashTimer);
			requestAnimationFrame(() => {
				priceFlash.value = true;
				priceFlashTimer = setTimeout(() => {
					priceFlash.value = false;
				}, 700);
			});
		});
		if (props.product && props.product.price) updateBasePrice(currentBaseProductPrice.value);
		(0, vue_exports.onMounted)(() => {
			if (props.product && props.product.price) updateBasePrice(currentBaseProductPrice.value);
		});
		useHead({ meta: [
			{
				property: "og:title",
				content: props.product.product_name || "Default Title"
			},
			{
				property: "og:description",
				content: props.product.short_description || "Default Description"
			},
			{
				property: "og:url",
				content: typeof window !== "undefined" ? window.location.href : new URL(usePage().url, route("home")).href
			},
			{
				property: "og:image",
				content: props.product.featured_image || "https://example.org/default.jpg"
			},
			{
				property: "product:availability",
				content: props.product.availability || "in stock"
			},
			{
				property: "product:condition",
				content: props.product.feature || "new"
			},
			{
				property: "product:price:amount",
				content: props.product.price || "0.00"
			},
			{
				property: "product:price:currency",
				content: "BDT"
			}
		] });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="container py-6 md:py-8" data-v-fd71c0e8><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-[1300px] mx-auto" data-v-fd71c0e8><div class="lg:col-span-5 lg:sticky lg:top-6" data-v-fd71c0e8>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(ProductImages_default, {
				product: __props.product,
				onImageFunction: handleImageFunction
			}, null, _parent));
			_push(`</div>`);
			if (__props.product) {
				_push(`<section id="product-section" class="lg:col-span-7 space-y-6" data-v-fd71c0e8><div class="space-y-3" data-v-fd71c0e8><div class="space-y-2" data-v-fd71c0e8><h1 class="product-title" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(__props.product.product_name)}</h1>`);
				if (pageReviews.value.length > 0) {
					_push(`<div class="flex items-center gap-2" aria-label="Rating" data-v-fd71c0e8><div class="flex gap-0.5" data-v-fd71c0e8><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(5, (n) => {
						_push(`<svg width="14" height="14" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= Math.round(averageRating.value) ? "#b47f54" : "none")} stroke="#b47f54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-fd71c0e8></polygon></svg>`);
					});
					_push(`<!--]--></div><span class="pdp-rating-text" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(averageRating.value.toFixed(1))}</span><span class="pdp-rating-text" data-v-fd71c0e8>(${(0, server_renderer_exports.ssrInterpolate)(pageReviews.value.length)} reviews)</span></div>`);
				} else _push(`<!---->`);
				_push(`</div><div class="flex items-center gap-3 flex-wrap" data-v-fd71c0e8><span class="${(0, server_renderer_exports.ssrRenderClass)([{ "price-flash": priceFlash.value }, "product-price"])}" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(displayPrice.value)} <span class="bangla-font" data-v-fd71c0e8>৳</span></span>`);
				if (wasPrice.value) _push(`<span class="body-2-r text-gray-400 line-through" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(wasPrice.value)}৳ </span>`);
				else _push(`<!---->`);
				if (savingAmount.value > 0) _push(`<span class="pdp-saving" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(savingAmount.value)}৳ ছাড় </span>`);
				else _push(`<!---->`);
				if (isPreOrderProduct.value) _push(`<span class="pdp-stock pdp-stock--preorder" data-v-fd71c0e8>Pre Order</span>`);
				else if (isSoldOut.value) _push(`<span class="pdp-stock pdp-stock--soldout" data-v-fd71c0e8>Out of Stock</span>`);
				else _push(`<span class="pdp-stock" data-v-fd71c0e8>In stock</span>`);
				_push(`</div></div><div class="pdp-description" data-v-fd71c0e8>${__props.product.short_description ?? ""}</div>`);
				if (hasBlouseOption.value) {
					_push(`<div class="space-y-2" data-v-fd71c0e8><label class="pdp-option-label" data-v-fd71c0e8>ব্লাউজ:</label><div class="pdp-blouse-row" data-v-fd71c0e8><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(blouseChoices, (opt) => {
						_push(`<label class="${(0, server_renderer_exports.ssrRenderClass)(["pdp-pill", blouseChoice.value === opt.value ? "pdp-pill--active" : ""])}" data-v-fd71c0e8><input type="radio" name="blouse_option"${(0, server_renderer_exports.ssrRenderAttr)("value", opt.value)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(blouseChoice.value, opt.value)) ? " checked" : ""} class="sr-only" data-v-fd71c0e8><span data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(opt.label)}</span>`);
						if (opt.value === "with" && blouseExtra.value) _push(`<span class="whitespace-nowrap" data-v-fd71c0e8>+ ${(0, server_renderer_exports.ssrInterpolate)(blouseExtra.value)}৳</span>`);
						else _push(`<!---->`);
						if (blouseChoice.value === opt.value) _push(`<span class="pdp-pill-check" data-v-fd71c0e8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><polyline points="20 6 9 17 4 12" data-v-fd71c0e8></polyline></svg></span>`);
						else _push(`<!---->`);
						_push(`</label>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				_push(`<!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(sortedAttributeNames.value, (attributeName) => {
					_push(`<div class="space-y-2" data-v-fd71c0e8><label class="pdp-option-label" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(attributeName)}:</label><div class="flex flex-wrap gap-4" data-v-fd71c0e8><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(groupedAttributes.value[attributeName], (option) => {
						_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)(["pdp-pill", selectedAttributes.value[attributeName] === option.attribute_option.id ? "pdp-pill--active" : ""])}" data-v-fd71c0e8><span data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(option.attribute_option.name)}</span>`);
						if (selectedAttributes.value[attributeName] === option.attribute_option.id) _push(`<span class="pdp-pill-check" data-v-fd71c0e8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><polyline points="20 6 9 17 4 12" data-v-fd71c0e8></polyline></svg></span>`);
						else _push(`<!---->`);
						_push(`</button>`);
					});
					_push(`<!--]--></div></div>`);
				});
				_push(`<!--]-->`);
				if (attributeSelectionAlert.value) _push(`<span class="text-orange-500 body-1-r" data-v-fd71c0e8> যেকোনো একটি সিলেক্ট করুন </span>`);
				else _push(`<!---->`);
				_push(`<div class="space-y-2" data-v-fd71c0e8>`);
				if (!cannotBuy.value) _push(`<label class="pdp-option-label" data-v-fd71c0e8>পরিমাণ:</label>`);
				else _push(`<!---->`);
				_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-soldout": cannotBuy.value }, "pdp-qty-row"])}" data-v-fd71c0e8>`);
				if (cannotBuy.value) _push(`<div class="pdp-soldout-row" role="status" data-v-fd71c0e8><span class="pdp-soldout-text" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(isSoldOut.value ? "এই পণ্যটি বর্তমানে স্টকে নেই।" : "নির্বাচিত অপশনটি স্টকে নেই। অন্য একটি বেছে নিন।")}</span><button type="button" class="pdp-soldout-btn" disabled aria-disabled="true" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(isSoldOut.value ? "স্টকে নেই" : "অপশন নেই")}</button></div>`);
				else _push(`<div class="pdp-qty-stepper" data-v-fd71c0e8><button class="pdp-qty-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(quantity.value <= 1) ? " disabled" : ""} aria-label="Decrease quantity" data-v-fd71c0e8><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-fd71c0e8><path d="M5 12h14" data-v-fd71c0e8></path></svg></button><span class="pdp-qty-value" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(quantity.value)}</span><button class="pdp-qty-btn" aria-label="Increase quantity" data-v-fd71c0e8><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-fd71c0e8><path d="M12 5v14" data-v-fd71c0e8></path><path d="M5 12h14" data-v-fd71c0e8></path></svg></button></div>`);
				_push(`<button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) }, "pdp-wishlist-btn"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-pressed", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product))}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) ? "Remove from wishlist" : "Add to wishlist")}${(0, server_renderer_exports.ssrRenderAttr)("title", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) ? "Saved to wishlist" : "Save to wishlist")} data-v-fd71c0e8><svg width="22" height="22" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) ? "currentColor" : "none")} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-fd71c0e8></path></svg></button></div></div>`);
				if (isPreOrderProduct.value) {
					_push(`<div class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r" data-v-fd71c0e8> এই পণ্যটি প্রি-অর্ডারের জন্য উন্মুক্ত। অর্ডার করলে স্টক আসার সাথে সাথে পাঠানো হবে। `);
					if (preOrderTiming.value) _push(`<span class="block mt-1 font-medium" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(preOrderTiming.value)}</span>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (!cannotBuy.value) _push(`<div class="flex gap-4 pt-2" data-v-fd71c0e8><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)(["pdp-btn flex-1", isPreOrderProduct.value ? "pdp-btn--preorder" : "pdp-btn--primary"])}" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(isPreOrderProduct.value ? "প্রি-অর্ডার কার্টে যোগ করুন" : "Add to cart")}</button><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)(["pdp-btn flex-1", isPreOrderProduct.value ? "pdp-btn--preorder-outline" : "pdp-btn--outline-green"])}" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(isPreOrderProduct.value ? "প্রি-অর্ডার করুন" : "Buy now")}</button></div>`);
				else _push(`<!---->`);
				_push(`<div class="pdp-contact-row" data-v-fd71c0e8><a${(0, server_renderer_exports.ssrRenderAttr)("href", `tel:${__props.otherInfo.phone_number}`)} class="pdp-btn pdp-btn--ghost pdp-btn--call" data-v-fd71c0e8><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-v-fd71c0e8></path></svg> Call now </a><a${(0, server_renderer_exports.ssrRenderAttr)("href", `https://wa.me/${__props.otherInfo.whatsapp_number}`)} target="_blank" class="pdp-btn pdp-btn--ghost pdp-btn--whatsapp" data-v-fd71c0e8><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" data-v-fd71c0e8><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-fd71c0e8></path></svg> WhatsApp </a><button type="button" class="pdp-btn pdp-btn--ghost" data-v-fd71c0e8><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><circle cx="18" cy="5" r="3" data-v-fd71c0e8></circle><circle cx="6" cy="12" r="3" data-v-fd71c0e8></circle><circle cx="18" cy="19" r="3" data-v-fd71c0e8></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" data-v-fd71c0e8></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" data-v-fd71c0e8></line></svg> Share </button></div><div class="pd-accordion" data-v-fd71c0e8><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(accordionItems.value, (item, index) => {
					_push(`<div class="pd-accordion-item" data-v-fd71c0e8><button class="pd-accordion-header" data-v-fd71c0e8><span data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(item.title)}</span><svg class="${(0, server_renderer_exports.ssrRenderClass)(["pd-accordion-chevron", { "rotate-180": openIndex.value === index }])}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-fd71c0e8><path d="M6 9l6 6 6-6" data-v-fd71c0e8></path></svg></button>`);
					if (openIndex.value === index) {
						_push(`<div class="pd-accordion-body" data-v-fd71c0e8>`);
						if (item.html) _push(`<div class="product-description" data-v-fd71c0e8>${item.html ?? ""}</div>`);
						else _push(`<p class="pd-accordion-text" data-v-fd71c0e8>${(0, server_renderer_exports.ssrInterpolate)(item.content)}</p>`);
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div></section>`);
			} else _push(`<div class="p-4 text-center" data-v-fd71c0e8>Loading product details...</div>`);
			_push(`</div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(ProductReviews_default, {
				reviews: pageReviews.value,
				product: __props.product
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(RecentlyViewed_default, {
				product: __props.product,
				openPreview: __props.openPreview
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(RelatedProducts_default, {
				related_products: __props.related_products,
				openPreview: __props.openPreview
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductDetail.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ProductDetail_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-fd71c0e8"]]);
//#endregion
//#region resources/js/components/Error/NotFound.vue
var _sfc_main$1 = {};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Error/NotFound.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region resources/js/Pages/Public/Product/Show.vue
var _sfc_main = {
	__name: "Show",
	__ssrInlineRender: true,
	props: {
		product: {
			type: Object,
			required: true
		},
		related_products: {
			type: Object,
			required: true
		},
		otherInfo: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		const isModalOpen = (0, vue_exports.ref)(false);
		const selectedProduct = (0, vue_exports.ref)(null);
		const openPreview = (product) => {
			selectedProduct.value = product;
			isModalOpen.value = true;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-4aa9d662${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.product?.meta_title ?? __props.product?.product_name)}</title><meta name="description"${(0, server_renderer_exports.ssrRenderAttr)("content", __props.product.meta_description ?? __props.product.product_name)} data-v-4aa9d662${_scopeId}>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.product?.meta_title ?? __props.product?.product_name), 1), (0, vue_exports.createVNode)("meta", {
						name: "description",
						content: __props.product.meta_description ?? __props.product.product_name
					}, null, 8, ["content"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$10, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="bg-[#FFFAF4] pt-8 pb-2 md:pt-12 md:pb-4" data-v-4aa9d662${_scopeId}><div class="container" data-v-4aa9d662${_scopeId}><nav class="pdp-breadcrumb" aria-label="Breadcrumb" data-v-4aa9d662${_scopeId}><a href="/" class="pdp-breadcrumb-link" data-v-4aa9d662${_scopeId}>Home</a><svg class="pdp-breadcrumb-sep" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-4aa9d662${_scopeId}><polyline points="9 18 15 12 9 6" data-v-4aa9d662${_scopeId}></polyline></svg>`);
						if (__props.product?.category) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", `/product-category/${__props.product.category.slug}`)} class="pdp-breadcrumb-link" data-v-4aa9d662${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.product.category.name)}</a>`);
						else _push(`<!---->`);
						if (__props.product?.category) _push(`<svg class="pdp-breadcrumb-sep" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-4aa9d662${_scopeId}><polyline points="9 18 15 12 9 6" data-v-4aa9d662${_scopeId}></polyline></svg>`);
						else _push(`<!---->`);
						_push(`<span class="pdp-breadcrumb-current" data-v-4aa9d662${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.product?.product_name)}</span></nav></div></div><div class="product-detail-page" data-v-4aa9d662${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(ProductDetail_default, {
							product: __props.product,
							related_products: __props.related_products,
							otherInfo: __props.otherInfo,
							openPreview
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "bg-[#FFFAF4] pt-8 pb-2 md:pt-12 md:pb-4" }, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("nav", {
						class: "pdp-breadcrumb",
						"aria-label": "Breadcrumb"
					}, [
						(0, vue_exports.createVNode)("a", {
							href: "/",
							class: "pdp-breadcrumb-link"
						}, "Home"),
						((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							class: "pdp-breadcrumb-sep",
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"stroke-linejoin": "round"
						}, [(0, vue_exports.createVNode)("polyline", { points: "9 18 15 12 9 6" })])),
						__props.product?.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("a", {
							key: 0,
							href: `/product-category/${__props.product.category.slug}`,
							class: "pdp-breadcrumb-link"
						}, (0, vue_exports.toDisplayString)(__props.product.category.name), 9, ["href"])) : (0, vue_exports.createCommentVNode)("", true),
						__props.product?.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							key: 1,
							class: "pdp-breadcrumb-sep",
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"stroke-linejoin": "round"
						}, [(0, vue_exports.createVNode)("polyline", { points: "9 18 15 12 9 6" })])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)("span", { class: "pdp-breadcrumb-current" }, (0, vue_exports.toDisplayString)(__props.product?.product_name), 1)
					])])]), (0, vue_exports.createVNode)("div", { class: "product-detail-page" }, [(0, vue_exports.createVNode)(ProductDetail_default, {
						product: __props.product,
						related_products: __props.related_products,
						otherInfo: __props.otherInfo,
						openPreview
					}, null, 8, [
						"product",
						"related_products",
						"otherInfo"
					])])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(ProductPreviewModel_default, {
				isOpen: isModalOpen.value,
				product: selectedProduct.value,
				onClose: ($event) => isModalOpen.value = false
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Product/Show.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Show_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-4aa9d662"]]);
//#endregion
export { Show_default as default };

//# sourceMappingURL=Show-CvXOWFE1.js.map