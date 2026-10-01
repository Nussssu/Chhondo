import { c as server_renderer_exports, h as __toESM, i as link_default, l as vue_exports, o as usePage, r as head_default, s as router, u as __commonJSMin } from "../ssr.js";
import { f as _sfc_main$5, o as isOutOfStock, p as variantSrcset, r as useWishlistStore, s as isPreOrder, t as _sfc_main$6 } from "./AppLayout-D5uzRHsl.js";
import { n as classesToSelector, r as ChevronLeft, t as Pagination } from "./pagination-D5Uyw8T8.js";
import { t as ChevronRight } from "./chevron-right-DUJalir1.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { l as parseGalleryImages, o as priceFor } from "./videoEmbed-CEkxInuf.js";
import { t as ProductPreviewModel_default } from "./ProductPreviewModel-CDbDRzyi.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
import { a as createElement, f as makeElementsArray, h as getDocument, i as SwiperSlide, m as setInnerHTML, r as Swiper, s as elementIndex, t as Navigation } from "./navigation-4kYiGdSZ.js";
import { t as freeMode } from "./free-mode-BEMsMeya.js";
//#region node_modules/swiper/modules/a11y.mjs
function A11y(_ref) {
	let { swiper, extendParams, on } = _ref;
	extendParams({ a11y: {
		enabled: true,
		notificationClass: "swiper-notification",
		prevSlideMessage: "Previous slide",
		nextSlideMessage: "Next slide",
		firstSlideMessage: "This is the first slide",
		lastSlideMessage: "This is the last slide",
		paginationBulletMessage: "Go to slide {{index}}",
		slideLabelMessage: "{{index}} / {{slidesLength}}",
		containerMessage: null,
		containerRoleDescriptionMessage: null,
		containerRole: null,
		itemRoleDescriptionMessage: null,
		slideRole: "group",
		id: null,
		scrollOnFocus: true
	} });
	swiper.a11y = { clicked: false };
	let liveRegion = null;
	let preventFocusHandler;
	let focusTargetSlideEl;
	let visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	function notify(message) {
		const notification = liveRegion;
		if (notification.length === 0) return;
		setInnerHTML(notification, message);
	}
	function getRandomNumber(size) {
		if (size === void 0) size = 16;
		const randomChar = () => Math.round(16 * Math.random()).toString(16);
		return "x".repeat(size).replace(/x/g, randomChar);
	}
	function makeElFocusable(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("tabIndex", "0");
		});
	}
	function makeElNotFocusable(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("tabIndex", "-1");
		});
	}
	function addElRole(el, role) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("role", role);
		});
	}
	function addElRoleDescription(el, description) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-roledescription", description);
		});
	}
	function addElControls(el, controls) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-controls", controls);
		});
	}
	function addElLabel(el, label) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-label", label);
		});
	}
	function addElId(el, id) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("id", id);
		});
	}
	function addElLive(el, live) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-live", live);
		});
	}
	function disableEl(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-disabled", true);
		});
	}
	function enableEl(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-disabled", false);
		});
	}
	function onEnterOrSpaceKey(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		const params = swiper.params.a11y;
		const targetEl = e.target;
		if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target))) {
			if (!e.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
		}
		if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
			const prevEls = makeElementsArray(swiper.navigation.prevEl);
			if (makeElementsArray(swiper.navigation.nextEl).includes(targetEl)) {
				if (!(swiper.isEnd && !swiper.params.loop)) swiper.slideNext();
				if (swiper.isEnd) notify(params.lastSlideMessage);
				else notify(params.nextSlideMessage);
			}
			if (prevEls.includes(targetEl)) {
				if (!(swiper.isBeginning && !swiper.params.loop)) swiper.slidePrev();
				if (swiper.isBeginning) notify(params.firstSlideMessage);
				else notify(params.prevSlideMessage);
			}
		}
		if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) targetEl.click();
	}
	function updateNavigation() {
		if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
		const { nextEl, prevEl } = swiper.navigation;
		if (prevEl) {
			if (swiper.isBeginning) {
				disableEl(prevEl);
				makeElNotFocusable(prevEl);
			} else {
				enableEl(prevEl);
				makeElFocusable(prevEl);
			}
		}
		if (nextEl) {
			if (swiper.isEnd) {
				disableEl(nextEl);
				makeElNotFocusable(nextEl);
			} else {
				enableEl(nextEl);
				makeElFocusable(nextEl);
			}
		}
	}
	function hasPagination() {
		return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
	}
	function hasClickablePagination() {
		return hasPagination() && swiper.params.pagination.clickable;
	}
	function updatePagination() {
		const params = swiper.params.a11y;
		if (!hasPagination()) return;
		swiper.pagination.bullets.forEach((bulletEl) => {
			if (swiper.params.pagination.clickable) {
				makeElFocusable(bulletEl);
				if (!swiper.params.pagination.renderBullet) {
					addElRole(bulletEl, "button");
					addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
				}
			}
			if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) bulletEl.setAttribute("aria-current", "true");
			else bulletEl.removeAttribute("aria-current");
		});
	}
	const initNavEl = (el, wrapperId, message) => {
		makeElFocusable(el);
		if (el.tagName !== "BUTTON") {
			addElRole(el, "button");
			el.addEventListener("keydown", onEnterOrSpaceKey);
		}
		addElLabel(el, message);
		addElControls(el, wrapperId);
	};
	const handlePointerDown = (e) => {
		if (focusTargetSlideEl && focusTargetSlideEl !== e.target && !focusTargetSlideEl.contains(e.target)) preventFocusHandler = true;
		swiper.a11y.clicked = true;
	};
	const handlePointerUp = () => {
		preventFocusHandler = false;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!swiper.destroyed) swiper.a11y.clicked = false;
			});
		});
	};
	const onVisibilityChange = (e) => {
		visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	};
	const handleFocus = (e) => {
		if (swiper.a11y.clicked || !swiper.params.a11y.scrollOnFocus) return;
		if ((/* @__PURE__ */ new Date()).getTime() - visibilityChangedTimestamp < 100) return;
		const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
		if (!slideEl || !swiper.slides.includes(slideEl)) return;
		focusTargetSlideEl = slideEl;
		const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
		const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
		if (isActive || isVisible) return;
		if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
		if (swiper.isHorizontal()) swiper.el.scrollLeft = 0;
		else swiper.el.scrollTop = 0;
		requestAnimationFrame(() => {
			if (preventFocusHandler) return;
			if (swiper.params.loop) swiper.slideToLoop(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index"))), 0);
			else swiper.slideTo(swiper.getSlideIndexWhenGrid(swiper.slides.indexOf(slideEl)), 0);
			preventFocusHandler = false;
		});
	};
	const initSlides = () => {
		const params = swiper.params.a11y;
		if (params.itemRoleDescriptionMessage) addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
		if (params.slideRole) addElRole(swiper.slides, params.slideRole);
		const slidesLength = swiper.slides.length;
		if (params.slideLabelMessage) swiper.slides.forEach((slideEl, index) => {
			const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
			addElLabel(slideEl, params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength));
		});
	};
	const init = () => {
		const params = swiper.params.a11y;
		swiper.el.append(liveRegion);
		const containerEl = swiper.el;
		if (params.containerRoleDescriptionMessage) addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
		if (params.containerMessage) addElLabel(containerEl, params.containerMessage);
		if (params.containerRole) addElRole(containerEl, params.containerRole);
		const wrapperEl = swiper.wrapperEl;
		const wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`;
		const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite";
		addElId(wrapperEl, wrapperId);
		addElLive(wrapperEl, live);
		initSlides();
		let { nextEl, prevEl } = swiper.navigation ? swiper.navigation : {};
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		if (nextEl) nextEl.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
		if (prevEl) prevEl.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.addEventListener("keydown", onEnterOrSpaceKey);
		});
		getDocument().addEventListener("visibilitychange", onVisibilityChange);
		swiper.el.addEventListener("focus", handleFocus, true);
		swiper.el.addEventListener("focus", handleFocus, true);
		swiper.el.addEventListener("pointerdown", handlePointerDown, true);
		swiper.el.addEventListener("pointerup", handlePointerUp, true);
	};
	function destroy() {
		if (liveRegion) liveRegion.remove();
		let { nextEl, prevEl } = swiper.navigation ? swiper.navigation : {};
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		if (nextEl) nextEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (prevEl) prevEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.removeEventListener("keydown", onEnterOrSpaceKey);
		});
		getDocument().removeEventListener("visibilitychange", onVisibilityChange);
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("focus", handleFocus, true);
			swiper.el.removeEventListener("pointerdown", handlePointerDown, true);
			swiper.el.removeEventListener("pointerup", handlePointerUp, true);
		}
	}
	on("beforeInit", () => {
		liveRegion = createElement("span", swiper.params.a11y.notificationClass);
		liveRegion.setAttribute("aria-live", "assertive");
		liveRegion.setAttribute("aria-atomic", "true");
	});
	on("afterInit", () => {
		if (!swiper.params.a11y.enabled) return;
		init();
	});
	on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
		if (!swiper.params.a11y.enabled) return;
		initSlides();
	});
	on("fromEdge toEdge afterInit lock unlock", () => {
		if (!swiper.params.a11y.enabled) return;
		updateNavigation();
	});
	on("paginationUpdate", () => {
		if (!swiper.params.a11y.enabled) return;
		updatePagination();
	});
	on("destroy", () => {
		if (!swiper.params.a11y.enabled) return;
		destroy();
	});
}
//#endregion
//#region node_modules/swiper/modules/autoplay.mjs
function Autoplay(_ref) {
	let { swiper, extendParams, on, emit, params } = _ref;
	swiper.autoplay = {
		running: false,
		paused: false,
		timeLeft: 0
	};
	extendParams({ autoplay: {
		enabled: false,
		delay: 3e3,
		waitForTransition: true,
		disableOnInteraction: false,
		stopOnLastSlide: false,
		reverseDirection: false,
		pauseOnMouseEnter: false
	} });
	let timeout;
	let raf;
	let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
	let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
	let autoplayTimeLeft;
	let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
	let wasPaused;
	let isTouched;
	let pausedByTouch;
	let touchStartTimeout;
	let slideChanged;
	let pausedByInteraction;
	let pausedByPointerEnter;
	function onTransitionEnd(e) {
		if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
		if (e.target !== swiper.wrapperEl) return;
		swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
		if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) return;
		resume();
	}
	const calcTimeLeft = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) wasPaused = true;
		else if (wasPaused) {
			autoplayDelayCurrent = autoplayTimeLeft;
			wasPaused = false;
		}
		const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.timeLeft = timeLeft;
		emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
		raf = requestAnimationFrame(() => {
			calcTimeLeft();
		});
	};
	const getSlideDelay = () => {
		let activeSlideEl;
		if (swiper.virtual && swiper.params.virtual.enabled) activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
		else activeSlideEl = swiper.slides[swiper.activeIndex];
		if (!activeSlideEl) return void 0;
		return parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
	};
	const run = (delayForce) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		cancelAnimationFrame(raf);
		calcTimeLeft();
		let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
		autoplayDelayTotal = swiper.params.autoplay.delay;
		autoplayDelayCurrent = swiper.params.autoplay.delay;
		const currentSlideDelay = getSlideDelay();
		if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
			delay = currentSlideDelay;
			autoplayDelayTotal = currentSlideDelay;
			autoplayDelayCurrent = currentSlideDelay;
		}
		autoplayTimeLeft = delay;
		const speed = swiper.params.speed;
		const proceed = () => {
			if (!swiper || swiper.destroyed) return;
			if (swiper.params.autoplay.reverseDirection) {
				if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
					swiper.slidePrev(speed, true, true);
					emit("autoplay");
				} else if (!swiper.params.autoplay.stopOnLastSlide) {
					swiper.slideTo(swiper.slides.length - 1, speed, true, true);
					emit("autoplay");
				}
			} else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
				swiper.slideNext(speed, true, true);
				emit("autoplay");
			} else if (!swiper.params.autoplay.stopOnLastSlide) {
				swiper.slideTo(0, speed, true, true);
				emit("autoplay");
			}
			if (swiper.params.cssMode) {
				autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
				requestAnimationFrame(() => {
					run();
				});
			}
		};
		if (delay > 0) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				proceed();
			}, delay);
		} else requestAnimationFrame(() => {
			proceed();
		});
		return delay;
	};
	const start = () => {
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.running = true;
		run();
		emit("autoplayStart");
	};
	const stop = () => {
		swiper.autoplay.running = false;
		clearTimeout(timeout);
		cancelAnimationFrame(raf);
		emit("autoplayStop");
	};
	const pause = (internal, reset) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		clearTimeout(timeout);
		if (!internal) pausedByInteraction = true;
		const proceed = () => {
			emit("autoplayPause");
			if (swiper.params.autoplay.waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
			else resume();
		};
		swiper.autoplay.paused = true;
		if (reset) {
			if (slideChanged) autoplayTimeLeft = swiper.params.autoplay.delay;
			slideChanged = false;
			proceed();
			return;
		}
		autoplayTimeLeft = (autoplayTimeLeft || swiper.params.autoplay.delay) - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
		if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
		proceed();
	};
	const resume = () => {
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		if (pausedByInteraction) {
			pausedByInteraction = false;
			run(autoplayTimeLeft);
		} else run();
		swiper.autoplay.paused = false;
		emit("autoplayResume");
	};
	const onVisibilityChange = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		const document = getDocument();
		if (document.visibilityState === "hidden") {
			pausedByInteraction = true;
			pause(true);
		}
		if (document.visibilityState === "visible") resume();
	};
	const onPointerEnter = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByInteraction = true;
		pausedByPointerEnter = true;
		if (swiper.animating || swiper.autoplay.paused) return;
		pause(true);
	};
	const onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByPointerEnter = false;
		if (swiper.autoplay.paused) resume();
	};
	const attachMouseEvents = () => {
		if (swiper.params.autoplay.pauseOnMouseEnter) {
			swiper.el.addEventListener("pointerenter", onPointerEnter);
			swiper.el.addEventListener("pointerleave", onPointerLeave);
		}
	};
	const detachMouseEvents = () => {
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("pointerenter", onPointerEnter);
			swiper.el.removeEventListener("pointerleave", onPointerLeave);
		}
	};
	const attachDocumentEvents = () => {
		getDocument().addEventListener("visibilitychange", onVisibilityChange);
	};
	const detachDocumentEvents = () => {
		getDocument().removeEventListener("visibilitychange", onVisibilityChange);
	};
	on("init", () => {
		if (swiper.params.autoplay.enabled) {
			attachMouseEvents();
			attachDocumentEvents();
			start();
		}
	});
	on("destroy", () => {
		detachMouseEvents();
		detachDocumentEvents();
		if (swiper.autoplay.running) stop();
	});
	on("_freeModeStaticRelease", () => {
		if (pausedByTouch || pausedByInteraction) resume();
	});
	on("_freeModeNoMomentumRelease", () => {
		if (!swiper.params.autoplay.disableOnInteraction) pause(true, true);
		else stop();
	});
	on("beforeTransitionStart", (_s, speed, internal) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (internal || !swiper.params.autoplay.disableOnInteraction) pause(true, true);
		else stop();
	});
	on("sliderFirstMove", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.params.autoplay.disableOnInteraction) {
			stop();
			return;
		}
		isTouched = true;
		pausedByTouch = false;
		pausedByInteraction = false;
		touchStartTimeout = setTimeout(() => {
			pausedByInteraction = true;
			pausedByTouch = true;
			pause(true);
		}, 200);
	});
	on("touchEnd", () => {
		if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
		clearTimeout(touchStartTimeout);
		clearTimeout(timeout);
		if (swiper.params.autoplay.disableOnInteraction) {
			pausedByTouch = false;
			isTouched = false;
			return;
		}
		if (pausedByTouch && swiper.params.cssMode) resume();
		pausedByTouch = false;
		isTouched = false;
	});
	on("slideChange", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		slideChanged = true;
	});
	Object.assign(swiper.autoplay, {
		start,
		stop,
		pause,
		resume
	});
}
//#endregion
//#region resources/js/components/HeroSlider.vue
var _sfc_main$4 = {
	__name: "HeroSlider",
	__ssrInlineRender: true,
	props: { sliders: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const modules = [
			Navigation,
			Pagination,
			Autoplay
		];
		/**
		* The banner is the largest thing painted, so it sets the LCP. Banners are
		* authored at 1900x560 and were served at that size to every visitor,
		* phones included; the first slide also carried no priority hint, so the
		* browser discovered it late.
		*
		* Written as functions rather than computed values because <picture> needs
		* one srcset per slide per art-direction breakpoint. variantSrcset() returns
		* undefined for anything it cannot build, which correctly leaves the element
		* with its plain src.
		*/
		/**
		* Slides whose variants failed to load, which fall back to the plain src.
		*
		* The banner is the LCP element, so it is the worst thing on the page to
		* break. A srcset candidate that 404s does not fall back on its own — the
		* browser renders a broken image — so a failure here drops the srcset and
		* lets the original through, exactly as ResponsiveImage.vue does for cards.
		*/
		const failed = (0, vue_exports.ref)(/* @__PURE__ */ new Set());
		const onError = (id) => {
			failed.value = new Set(failed.value).add(id);
		};
		const desktopSrcset = (slide) => failed.value.has(slide.id) ? void 0 : variantSrcset(slide.image_path);
		const mobileSrcset = (slide) => {
			const url = slide.mobile_or_desktop_image || slide.image_path;
			if (failed.value.has(slide.id)) return url;
			return variantSrcset(url) ?? url;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "swiper-container w-full min-h-auto mx-auto relative" }, _attrs))} data-v-86598876>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
				modules,
				"slides-per-view": 1,
				"space-between": 30,
				loop: __props.sliders.length > 1,
				pagination: { clickable: true },
				autoplay: {
					delay: 5e3,
					disableOnInteraction: false
				}
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(__props.sliders, (slide, index) => {
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), { key: slide.id }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<div class="hero-slide" data-v-86598876${_scopeId}><picture data-v-86598876${_scopeId}><source media="(max-width: 767px)"${(0, server_renderer_exports.ssrRenderAttr)("srcset", mobileSrcset(slide))} sizes="100vw" data-v-86598876${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", slide.image_path)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", desktopSrcset(slide))} sizes="100vw"${(0, server_renderer_exports.ssrRenderAttr)("alt", slide.title || "Slider")} class="hero-slide-img"${(0, server_renderer_exports.ssrRenderAttr)("width", 1900)}${(0, server_renderer_exports.ssrRenderAttr)("height", 560)}${(0, server_renderer_exports.ssrRenderAttr)("loading", index === 0 ? "eager" : "lazy")}${(0, server_renderer_exports.ssrRenderAttr)("fetchpriority", index === 0 ? "high" : "auto")} decoding="async" data-v-86598876${_scopeId}></picture></div>`);
									else return [(0, vue_exports.createVNode)("div", { class: "hero-slide" }, [(0, vue_exports.createVNode)("picture", null, [(0, vue_exports.createVNode)("source", {
										media: "(max-width: 767px)",
										srcset: mobileSrcset(slide),
										sizes: "100vw"
									}, null, 8, ["srcset"]), (0, vue_exports.createVNode)("img", {
										src: slide.image_path,
										srcset: desktopSrcset(slide),
										sizes: "100vw",
										alt: slide.title || "Slider",
										class: "hero-slide-img",
										width: 1900,
										height: 560,
										loading: index === 0 ? "eager" : "lazy",
										fetchpriority: index === 0 ? "high" : "auto",
										decoding: "async",
										onError: ($event) => onError(slide.id)
									}, null, 40, [
										"src",
										"srcset",
										"alt",
										"loading",
										"fetchpriority",
										"onError"
									])])])];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.sliders, (slide, index) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), { key: slide.id }, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "hero-slide" }, [(0, vue_exports.createVNode)("picture", null, [(0, vue_exports.createVNode)("source", {
								media: "(max-width: 767px)",
								srcset: mobileSrcset(slide),
								sizes: "100vw"
							}, null, 8, ["srcset"]), (0, vue_exports.createVNode)("img", {
								src: slide.image_path,
								srcset: desktopSrcset(slide),
								sizes: "100vw",
								alt: slide.title || "Slider",
								class: "hero-slide-img",
								width: 1900,
								height: 560,
								loading: index === 0 ? "eager" : "lazy",
								fetchpriority: index === 0 ? "high" : "auto",
								decoding: "async",
								onError: ($event) => onError(slide.id)
							}, null, 40, [
								"src",
								"srcset",
								"alt",
								"loading",
								"fetchpriority",
								"onError"
							])])])]),
							_: 2
						}, 1024);
					}), 128))];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/HeroSlider.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var HeroSlider_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-86598876"]]);
//#endregion
//#region node_modules/dayjs/dayjs.min.js
var require_dayjs_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
	})(exports, (function() {
		"use strict";
		var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(t) {
				var e = [
					"th",
					"st",
					"nd",
					"rd"
				], n = t % 100;
				return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
			}
		}, m = function(t, e, n) {
			var r = String(t);
			return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
		}, v = {
			s: m,
			z: function(t) {
				var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
				return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
			},
			m: function t(e, n) {
				if (e.date() < n.date()) return -t(n, e);
				var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
				return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
			},
			a: function(t) {
				return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
			},
			p: function(t) {
				return {
					M: c,
					y: h,
					w: o,
					d: a,
					D: d,
					h: u,
					m: s,
					s: i,
					ms: r,
					Q: f
				}[t] || String(t || "").toLowerCase().replace(/s$/, "");
			},
			u: function(t) {
				return void 0 === t;
			}
		}, g = "en", D = {};
		D[g] = M;
		var p = "$isDayjsObject", S = function(t) {
			return t instanceof _ || !(!t || !t[p]);
		}, w = function t(e, n, r) {
			var i;
			if (!e) return g;
			if ("string" == typeof e) {
				var s = e.toLowerCase();
				D[s] && (i = s), n && (D[s] = n, i = s);
				var u = e.split("-");
				if (!i && u.length > 1) return t(u[0]);
			} else {
				var a = e.name;
				D[a] = e, i = a;
			}
			return !r && i && (g = i), i || !r && g;
		}, O = function(t, e) {
			if (S(t)) return t.clone();
			var n = "object" == typeof e ? e : {};
			return n.date = t, n.args = arguments, new _(n);
		}, b = v;
		b.l = w, b.i = S, b.w = function(t, e) {
			return O(t, {
				locale: e.$L,
				utc: e.$u,
				x: e.$x,
				$offset: e.$offset
			});
		};
		var _ = function() {
			function M(t) {
				this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
			}
			var m = M.prototype;
			return m.parse = function(t) {
				this.$d = function(t) {
					var e = t.date, n = t.utc;
					if (null === e) return /* @__PURE__ */ new Date(NaN);
					if (b.u(e)) return /* @__PURE__ */ new Date();
					if (e instanceof Date) return new Date(e);
					if ("string" == typeof e && !/Z$/i.test(e)) {
						var r = e.match($);
						if (r) {
							var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
						}
					}
					return new Date(e);
				}(t), this.init();
			}, m.init = function() {
				var t = this.$d;
				this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
			}, m.$utils = function() {
				return b;
			}, m.isValid = function() {
				return !(this.$d.toString() === l);
			}, m.isSame = function(t, e) {
				var n = O(t);
				return this.startOf(e) <= n && n <= this.endOf(e);
			}, m.isAfter = function(t, e) {
				return O(t) < this.startOf(e);
			}, m.isBefore = function(t, e) {
				return this.endOf(e) < O(t);
			}, m.$g = function(t, e, n) {
				return b.u(t) ? this[e] : this.set(n, t);
			}, m.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, m.valueOf = function() {
				return this.$d.getTime();
			}, m.startOf = function(t, e) {
				var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
					var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
					return r ? i : i.endOf(a);
				}, $ = function(t, e) {
					return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(e)), n);
				}, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (f) {
					case h: return r ? l(1, 0) : l(31, 11);
					case c: return r ? l(1, M) : l(0, M + 1);
					case o:
						var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
						return l(r ? m - D : m + (6 - D), M);
					case a:
					case d: return $(v + "Hours", 0);
					case u: return $(v + "Minutes", 1);
					case s: return $(v + "Seconds", 2);
					case i: return $(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, m.endOf = function(t) {
				return this.startOf(t, !1);
			}, m.$set = function(t, e) {
				var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
				if (o === c || o === h) {
					var y = this.clone().set(d, 1);
					y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
				} else l && this.$d[l]($);
				return this.init(), this;
			}, m.set = function(t, e) {
				return this.clone().$set(t, e);
			}, m.get = function(t) {
				return this[b.p(t)]();
			}, m.add = function(r, f) {
				var d, l = this;
				r = Number(r);
				var $ = b.p(f), y = function(t) {
					var e = O(l);
					return b.w(e.date(e.date() + Math.round(t * r)), l);
				};
				if ($ === c) return this.set(c, this.$M + r);
				if ($ === h) return this.set(h, this.$y + r);
				if ($ === a) return y(1);
				if ($ === o) return y(7);
				var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
				return b.w(m, this);
			}, m.subtract = function(t, e) {
				return this.add(-1 * t, e);
			}, m.format = function(t) {
				var e = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || l;
				var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
					return t && (t[n] || t(e, r)) || i[n].slice(0, s);
				}, d = function(t) {
					return b.s(s % 12 || 12, t, "0");
				}, $ = f || function(t, e, n) {
					var r = t < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(y, (function(t, r) {
					return r || function(t) {
						switch (t) {
							case "YY": return String(e.$y).slice(-2);
							case "YYYY": return b.s(e.$y, 4, "0");
							case "M": return a + 1;
							case "MM": return b.s(a + 1, 2, "0");
							case "MMM": return h(n.monthsShort, a, c, 3);
							case "MMMM": return h(c, a);
							case "D": return e.$D;
							case "DD": return b.s(e.$D, 2, "0");
							case "d": return String(e.$W);
							case "dd": return h(n.weekdaysMin, e.$W, o, 2);
							case "ddd": return h(n.weekdaysShort, e.$W, o, 3);
							case "dddd": return o[e.$W];
							case "H": return String(s);
							case "HH": return b.s(s, 2, "0");
							case "h": return d(1);
							case "hh": return d(2);
							case "a": return $(s, u, !0);
							case "A": return $(s, u, !1);
							case "m": return String(u);
							case "mm": return b.s(u, 2, "0");
							case "s": return String(e.$s);
							case "ss": return b.s(e.$s, 2, "0");
							case "SSS": return b.s(e.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(t) || i.replace(":", "");
				}));
			}, m.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, m.diff = function(r, d, l) {
				var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
					return b.m(y, m);
				};
				switch (M) {
					case h:
						$ = D() / 12;
						break;
					case c:
						$ = D();
						break;
					case f:
						$ = D() / 3;
						break;
					case o:
						$ = (g - v) / 6048e5;
						break;
					case a:
						$ = (g - v) / 864e5;
						break;
					case u:
						$ = g / n;
						break;
					case s:
						$ = g / e;
						break;
					case i:
						$ = g / t;
						break;
					default: $ = g;
				}
				return l ? $ : b.a($);
			}, m.daysInMonth = function() {
				return this.endOf(c).$D;
			}, m.$locale = function() {
				return D[this.$L];
			}, m.locale = function(t, e) {
				if (!t) return this.$L;
				var n = this.clone(), r = w(t, e, !0);
				return r && (n.$L = r), n;
			}, m.clone = function() {
				return b.w(this.$d, this);
			}, m.toDate = function() {
				return new Date(this.valueOf());
			}, m.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, m.toISOString = function() {
				return this.$d.toISOString();
			}, m.toString = function() {
				return this.$d.toUTCString();
			}, M;
		}(), Y = _.prototype;
		return O.prototype = Y, [
			["$ms", r],
			["$s", i],
			["$m", s],
			["$H", u],
			["$W", a],
			["$M", c],
			["$y", h],
			["$D", d]
		].forEach((function(t) {
			Y[t[1]] = function(e) {
				return this.$g(e, t[0], t[1]);
			};
		})), O.extend = function(t, e) {
			return t.$i || (t(e, _, O), t.$i = !0), O;
		}, O.locale = w, O.isDayjs = S, O.unix = function(t) {
			return O(1e3 * t);
		}, O.en = D[g], O.Ls = D, O.p = {}, O;
	}));
}));
//#endregion
//#region node_modules/dayjs/plugin/duration.js
var require_duration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, s) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_duration = s();
	})(exports, (function() {
		"use strict";
		var t, s, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = 31536e6, u = 2628e6, d = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, a = /\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g, h = {
			years: o,
			months: u,
			days: r,
			hours: e,
			minutes: i,
			seconds: n,
			milliseconds: 1,
			weeks: 6048e5
		}, c = function(t) {
			return t instanceof g;
		}, f = function(t, s, n) {
			return new g(t, n, s.$l);
		}, m = function(t) {
			return s.p(t) + "s";
		}, l = function(t) {
			return t < 0;
		}, $ = function(t) {
			return l(t) ? Math.ceil(t) : Math.floor(t);
		}, y = function(t) {
			return Math.abs(t);
		}, v = function(t, s) {
			return t ? l(t) ? {
				negative: !0,
				format: "" + y(t) + s
			} : {
				negative: !1,
				format: "" + t + s
			} : {
				negative: !1,
				format: ""
			};
		}, g = function() {
			function l(t, s, n) {
				var i = this;
				if (this.$d = {}, this.$l = n, void 0 === t && (this.$ms = 0, this.parseFromMilliseconds()), s) return f(t * h[m(s)], this);
				if ("number" == typeof t) return this.$ms = t, this.parseFromMilliseconds(), this;
				if ("object" == typeof t) return Object.keys(t).forEach((function(s) {
					i.$d[m(s)] = t[s];
				})), this.calMilliseconds(), this;
				if ("string" == typeof t) {
					var e = t.match(d);
					if (e) {
						var r = e.slice(2).map((function(t) {
							return null != t ? Number(t) : 0;
						}));
						return this.$d.years = r[0], this.$d.months = r[1], this.$d.weeks = r[2], this.$d.days = r[3], this.$d.hours = r[4], this.$d.minutes = r[5], this.$d.seconds = r[6], this.calMilliseconds(), this;
					}
				}
				return this;
			}
			var y = l.prototype;
			return y.calMilliseconds = function() {
				var t = this;
				this.$ms = Object.keys(this.$d).reduce((function(s, n) {
					return s + (t.$d[n] || 0) * h[n];
				}), 0);
			}, y.parseFromMilliseconds = function() {
				var t = this.$ms;
				this.$d.years = $(t / o), t %= o, this.$d.months = $(t / u), t %= u, this.$d.days = $(t / r), t %= r, this.$d.hours = $(t / e), t %= e, this.$d.minutes = $(t / i), t %= i, this.$d.seconds = $(t / n), t %= n, this.$d.milliseconds = t;
			}, y.toISOString = function() {
				var t = v(this.$d.years, "Y"), s = v(this.$d.months, "M"), n = +this.$d.days || 0;
				this.$d.weeks && (n += 7 * this.$d.weeks);
				var i = v(n, "D"), e = v(this.$d.hours, "H"), r = v(this.$d.minutes, "M"), o = this.$d.seconds || 0;
				this.$d.milliseconds && (o += this.$d.milliseconds / 1e3, o = Math.round(1e3 * o) / 1e3);
				var u = v(o, "S"), d = t.negative || s.negative || i.negative || e.negative || r.negative || u.negative, a = e.format || r.format || u.format ? "T" : "", h = (d ? "-" : "") + "P" + t.format + s.format + i.format + a + e.format + r.format + u.format;
				return "P" === h || "-P" === h ? "P0D" : h;
			}, y.toJSON = function() {
				return this.toISOString();
			}, y.format = function(t) {
				var n = t || "YYYY-MM-DDTHH:mm:ss", i = {
					Y: this.$d.years,
					YY: s.s(this.$d.years, 2, "0"),
					YYYY: s.s(this.$d.years, 4, "0"),
					M: this.$d.months,
					MM: s.s(this.$d.months, 2, "0"),
					D: this.$d.days,
					DD: s.s(this.$d.days, 2, "0"),
					H: this.$d.hours,
					HH: s.s(this.$d.hours, 2, "0"),
					m: this.$d.minutes,
					mm: s.s(this.$d.minutes, 2, "0"),
					s: this.$d.seconds,
					ss: s.s(this.$d.seconds, 2, "0"),
					SSS: s.s(this.$d.milliseconds, 3, "0")
				};
				return n.replace(a, (function(t, s) {
					return s || String(i[t]);
				}));
			}, y.as = function(t) {
				return this.$ms / h[m(t)];
			}, y.get = function(t) {
				var s = this.$ms, n = m(t);
				return "milliseconds" === n ? s %= 1e3 : s = "weeks" === n ? $(s / h[n]) : this.$d[n], s || 0;
			}, y.add = function(t, s, n) {
				var i;
				return i = s ? t * h[m(s)] : c(t) ? t.$ms : f(t, this).$ms, f(this.$ms + i * (n ? -1 : 1), this);
			}, y.subtract = function(t, s) {
				return this.add(t, s, !0);
			}, y.locale = function(t) {
				var s = this.clone();
				return s.$l = t, s;
			}, y.clone = function() {
				return f(this.$ms, this);
			}, y.humanize = function(s) {
				return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s);
			}, y.valueOf = function() {
				return this.asMilliseconds();
			}, y.milliseconds = function() {
				return this.get("milliseconds");
			}, y.asMilliseconds = function() {
				return this.as("milliseconds");
			}, y.seconds = function() {
				return this.get("seconds");
			}, y.asSeconds = function() {
				return this.as("seconds");
			}, y.minutes = function() {
				return this.get("minutes");
			}, y.asMinutes = function() {
				return this.as("minutes");
			}, y.hours = function() {
				return this.get("hours");
			}, y.asHours = function() {
				return this.as("hours");
			}, y.days = function() {
				return this.get("days");
			}, y.asDays = function() {
				return this.as("days");
			}, y.weeks = function() {
				return this.get("weeks");
			}, y.asWeeks = function() {
				return this.as("weeks");
			}, y.months = function() {
				return this.get("months");
			}, y.asMonths = function() {
				return this.as("months");
			}, y.years = function() {
				return this.get("years");
			}, y.asYears = function() {
				return this.as("years");
			}, l;
		}(), p = function(t, s, n) {
			return t.add(s.years() * n, "y").add(s.months() * n, "M").add(s.days() * n, "d").add(s.hours() * n, "h").add(s.minutes() * n, "m").add(s.seconds() * n, "s").add(s.milliseconds() * n, "ms");
		};
		return function(n, i, e) {
			t = e, s = e().$utils(), e.duration = function(t, s) {
				return f(t, { $l: e.locale() }, s);
			}, e.isDuration = c;
			var r = i.prototype.add, o = i.prototype.subtract;
			i.prototype.add = function(t, s) {
				return c(t) ? p(this, t, 1) : r.bind(this)(t, s);
			}, i.prototype.subtract = function(t, s) {
				return c(t) ? p(this, t, -1) : o.bind(this)(t, s);
			};
		};
	}));
}));
//#endregion
//#region resources/js/components/Product/ProductCard.vue?vue&type=style&index=0&scoped=83c52ad5&lang.css
var import_dayjs_min = /* @__PURE__ */ __toESM(require_dayjs_min());
var import_duration = /* @__PURE__ */ __toESM(require_duration());
//#endregion
//#region resources/js/components/Product/ProductCard.vue
var _sfc_main$3 = {
	__name: "ProductCard",
	__ssrInlineRender: true,
	props: {
		product: {
			type: Object,
			required: true
		},
		openPreview: Function,
		campaign: {
			type: Boolean,
			default: false
		},
		expiryDate: String
	},
	setup(__props) {
		import_dayjs_min.default.extend(import_duration.default);
		const wishlistStore = useWishlistStore();
		const props = __props;
		const product = (0, vue_exports.ref)(props.product);
		const displayPrice = (0, vue_exports.ref)(props.product?.price || 0);
		const productImages = (0, vue_exports.ref)([]);
		const countdown = (0, vue_exports.ref)("");
		(0, vue_exports.watch)(() => props.product, (newProduct) => {
			if (!newProduct) return;
			productImages.value = parseGalleryImages(newProduct.gallery_images);
			displayPrice.value = priceFor(newProduct);
			const campaign = newProduct.product_campaign?.campaign ?? newProduct.campaign ?? null;
			if (campaign?.expiry_date) updateCountdown(campaign.expiry_date);
		}, { immediate: true });
		const updateCountdown = (endDate = props.expiryDate) => {
			if (!endDate) {
				countdown.value = "";
				return;
			}
			const expiryTime = (0, import_dayjs_min.default)(endDate, "YYYY-MM-DD");
			const now = (0, import_dayjs_min.default)();
			const diff = expiryTime.diff(now);
			if (diff <= 0) {
				countdown.value = "Expired";
				return;
			}
			const durationObj = import_dayjs_min.default.duration(diff);
			countdown.value = `${durationObj.days()}d ${durationObj.hours()}h ${durationObj.minutes()}m ${durationObj.seconds()}s`;
		};
		(0, vue_exports.onMounted)(() => {
			updateCountdown();
			setInterval(() => updateCountdown(), 1e3);
		});
		const isPreOrderProduct = (0, vue_exports.computed)(() => isPreOrder(props.product));
		const isSoldOut = (0, vue_exports.computed)(() => isOutOfStock(props.product));
		(0, vue_exports.computed)(() => {
			const { price, previous_price } = props.product;
			if (!previous_price || previous_price <= 0) return 0;
			const discount = (previous_price - price) / previous_price * 100;
			return Math.round(discount);
		});
		const isWishlisted = (0, vue_exports.computed)(() => wishlistStore.isWishlisted(props.product));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "product-item bg-[#eff2ff] border border-[var(--color-theme)] overflow-hidden shadow-md relative group cursor-pointer" }, _attrs))} data-v-83c52ad5><div class="product-image relative h-[200px] md:h-[350px] overflow-hidden" data-v-83c52ad5><img${(0, server_renderer_exports.ssrRenderAttr)("src", product.value?.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.value.product_name)} class="w-full h-full object-cover duration-300 transition-opacity group-hover:opacity-0" loading="lazy" fetchpriority="high" data-v-83c52ad5>`);
			if (productImages.value && productImages.value[0]) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", productImages.value[0])}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.value.product_name)} class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fetchpriority="high" loading="eager" data-v-83c52ad5>`);
			else _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", product.value.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.value.product_name)} class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fetchpriority="high" loading="eager" data-v-83c52ad5>`);
			_push(`<button type="button"${(0, server_renderer_exports.ssrRenderAttr)("aria-pressed", isWishlisted.value)}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", isWishlisted.value ? "Remove from wishlist" : "Add to wishlist")} class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": isWishlisted.value }, "wishlist-btn"])}" data-v-83c52ad5><svg width="20" height="20" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", isWishlisted.value ? "currentColor" : "none")} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-83c52ad5><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-83c52ad5></path></svg></button>`);
			if (isPreOrderProduct.value) _push(`<div class="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded z-10" data-v-83c52ad5> Pre Order </div>`);
			else if (isSoldOut.value) _push(`<div class="absolute top-2 left-2 soldout-badge text-xs font-bold px-2 py-1 rounded z-10" data-v-83c52ad5> Out of Stock </div>`);
			else _push(`<!---->`);
			_push(`</div><button class="mobile-eye-btn md:hidden" data-v-83c52ad5><svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-83c52ad5><path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-83c52ad5></path><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-83c52ad5></path></svg></button><div class="p-1 text-center relative mb-[40px]" data-v-83c52ad5><div class="absolute bottom-full left-0 right-0 hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-v-83c52ad5><button class="quick-preview bg-[var(--color-theme)] text-white p-2 shadow-md body-1-sb w-full" data-v-83c52ad5> Quick Preview </button></div>`);
			if (__props.campaign) _push(`<div class="absolute bottom-full left-0 right-0 gap-2 opacity-100 group-hover:opacity-0 group-hover:hidden transition-opacity duration-300 bg-yellow-500 text-white p-2 body-1-sb" data-v-83c52ad5><span data-v-83c52ad5>${(0, server_renderer_exports.ssrInterpolate)(countdown.value)}</span></div>`);
			else _push(`<!---->`);
			_push(`<h3 class="product-title body-1-sb text-gray-700" data-v-83c52ad5>${(0, server_renderer_exports.ssrInterpolate)(product.value.product_name)}</h3><div class="body-2-sb text-[var(--color-theme)]" data-v-83c52ad5>`);
			if (product.value.previous_price) _push(`<span class="body-1-r text-gray-500 line-through mr-2" data-v-83c52ad5>${(0, server_renderer_exports.ssrInterpolate)(product.value.previous_price)}৳ </span>`);
			else _push(`<!---->`);
			_push(`<span data-v-83c52ad5>${(0, server_renderer_exports.ssrInterpolate)(displayPrice.value)}৳</span></div></div>`);
			if (isSoldOut.value) _push(`<div class="absolute bottom-0 w-full text-center py-2 body-1-sb soldout-bar cursor-not-allowed" aria-disabled="true" data-v-83c52ad5> স্টকে নেই </div>`);
			else _push(`<div class="${(0, server_renderer_exports.ssrRenderClass)(["absolute bottom-0 w-full text-center text-white py-2 body-1-sb csd", isPreOrderProduct.value ? "card-preorder-btn" : "card-order-btn"])}" data-v-83c52ad5>${(0, server_renderer_exports.ssrInterpolate)(isPreOrderProduct.value ? "প্রি-অর্ডার করুন" : "অর্ডার করুন")}</div>`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductCard.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Category/TopCategories.vue
var _sfc_main$2 = {
	__name: "TopCategories",
	__ssrInlineRender: true,
	props: { categories: {
		type: Array,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "md:py-12 py-8 max-w-[95%] m-auto px-5 md:px-10 relative" }, _attrs))} data-v-061b5b89><h2 class="c-title text-center mb-8 relative body-3-sb uppercase flex items-center justify-center before:content-[&#39;&#39;] before:flex-grow before:border-t before:border-black before:mr-4 after:content-[&#39;&#39;] after:flex-grow after:border-t after:border-black after:ml-4" data-v-061b5b89> TOP CATEGORIES </h2><button class="custom-prev-button absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" aria-label="Previous slide" data-v-061b5b89>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronLeft), { class: "w-6 h-6 text-gray-600" }, null, _parent));
			_push(`</button><button class="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" aria-label="Next slide" data-v-061b5b89>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronRight), { class: "w-6 h-6 text-gray-600" }, null, _parent));
			_push(`</button>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
				"slides-per-view": 2,
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 10
					},
					768: {
						slidesPerView: 4,
						spaceBetween: 10
					},
					1e3: {
						slidesPerView: 5,
						spaceBetween: 30
					},
					1440: {
						slidesPerView: 7,
						spaceBetween: 30
					}
				},
				modules: [(0, vue_exports.unref)(Navigation), (0, vue_exports.unref)(freeMode)],
				navigation: {
					prevEl: ".custom-prev-button",
					nextEl: ".custom-next-button"
				},
				class: "mySwiper justify-center flex"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(__props.categories, (category) => {
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), {
								key: category.id,
								class: "md:min-h-[200px]"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
										href: "/product-category/" + category.slug,
										class: "group"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push(`<div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[130px] md:h-[170px] xl:h-[200px] category-card" data-v-061b5b89${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", category.image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", category.name)} width="200" height="200" class="w-full h-full object-cover transition-transform duration-300" fetchpriority="high" loading="eager" data-v-061b5b89${_scopeId}><div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" data-v-061b5b89${_scopeId}></div><div class="absolute bottom-[30%] w-full bg-[#FFFDFDAD] px-2 py-1" data-v-061b5b89${_scopeId}><h3 class="text-black font-medium text-center text-[11px] md:text-sm leading-[1.4] w-full min-h-[20px]" data-v-061b5b89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(category.name)}</h3></div></div>`);
											else return [(0, vue_exports.createVNode)("div", { class: "relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[130px] md:h-[170px] xl:h-[200px] category-card" }, [
												(0, vue_exports.createVNode)("img", {
													src: category.image,
													alt: category.name,
													width: "200",
													height: "200",
													class: "w-full h-full object-cover transition-transform duration-300",
													fetchpriority: "high",
													loading: "eager"
												}, null, 8, ["src", "alt"]),
												(0, vue_exports.createVNode)("div", { class: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" }),
												(0, vue_exports.createVNode)("div", { class: "absolute bottom-[30%] w-full bg-[#FFFDFDAD] px-2 py-1" }, [(0, vue_exports.createVNode)("h3", { class: "text-black font-medium text-center text-[11px] md:text-sm leading-[1.4] w-full min-h-[20px]" }, (0, vue_exports.toDisplayString)(category.name), 1)])
											])];
										}),
										_: 2
									}, _parent, _scopeId));
									else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
										href: "/product-category/" + category.slug,
										class: "group"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[130px] md:h-[170px] xl:h-[200px] category-card" }, [
											(0, vue_exports.createVNode)("img", {
												src: category.image,
												alt: category.name,
												width: "200",
												height: "200",
												class: "w-full h-full object-cover transition-transform duration-300",
												fetchpriority: "high",
												loading: "eager"
											}, null, 8, ["src", "alt"]),
											(0, vue_exports.createVNode)("div", { class: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" }),
											(0, vue_exports.createVNode)("div", { class: "absolute bottom-[30%] w-full bg-[#FFFDFDAD] px-2 py-1" }, [(0, vue_exports.createVNode)("h3", { class: "text-black font-medium text-center text-[11px] md:text-sm leading-[1.4] w-full min-h-[20px]" }, (0, vue_exports.toDisplayString)(category.name), 1)])
										])]),
										_: 2
									}, 1032, ["href"])];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(__props.categories, (category) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), {
							key: category.id,
							class: "md:min-h-[200px]"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
								href: "/product-category/" + category.slug,
								class: "group"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[130px] md:h-[170px] xl:h-[200px] category-card" }, [
									(0, vue_exports.createVNode)("img", {
										src: category.image,
										alt: category.name,
										width: "200",
										height: "200",
										class: "w-full h-full object-cover transition-transform duration-300",
										fetchpriority: "high",
										loading: "eager"
									}, null, 8, ["src", "alt"]),
									(0, vue_exports.createVNode)("div", { class: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" }),
									(0, vue_exports.createVNode)("div", { class: "absolute bottom-[30%] w-full bg-[#FFFDFDAD] px-2 py-1" }, [(0, vue_exports.createVNode)("h3", { class: "text-black font-medium text-center text-[11px] md:text-sm leading-[1.4] w-full min-h-[20px]" }, (0, vue_exports.toDisplayString)(category.name), 1)])
								])]),
								_: 2
							}, 1032, ["href"])]),
							_: 2
						}, 1024);
					}), 128))];
				}),
				_: 1
			}, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Category/TopCategories.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Home/CustomerReviews.vue
var CONTAINER_PADDING = 16;
var _sfc_main$1 = {
	__name: "CustomerReviews",
	__ssrInlineRender: true,
	props: { reviews: {
		type: Array,
		default: () => []
	} },
	setup(__props) {
		const props = __props;
		const displayReviews = (0, vue_exports.computed)(() => (props.reviews || []).slice(0, 12));
		const initial = (name) => name ? name.charAt(0).toUpperCase() : "C";
		const texts = (0, vue_exports.computed)(() => usePage().props.texts ?? {});
		const heading = (0, vue_exports.computed)(() => texts.value.reviews_heading || "আমাদের গ্রাহকরা যা বলেন");
		const subheading = (0, vue_exports.computed)(() => texts.value.reviews_subheading || "আমাদের গ্রাহকদের ভালোবাসা এবং আস্থাই আমাদের চলার পথের অনুপ্রেরণা।");
		const modules = [
			Navigation,
			Pagination,
			A11y
		];
		const uid = (0, vue_exports.useId)().replace(/[^\w-]/g, "");
		const prevId = `reviews-prev-${uid}`;
		const nextId = `reviews-next-${uid}`;
		const dotsId = `reviews-dots-${uid}`;
		const breakpoints = {
			0: {
				slidesPerView: 1.1,
				spaceBetween: 12,
				slidesOffsetBefore: CONTAINER_PADDING,
				slidesOffsetAfter: CONTAINER_PADDING
			},
			480: {
				slidesPerView: 1.6,
				spaceBetween: 14,
				slidesOffsetBefore: CONTAINER_PADDING,
				slidesOffsetAfter: CONTAINER_PADDING
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
				slidesOffsetBefore: 0,
				slidesOffsetAfter: 0
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 24,
				slidesOffsetBefore: 0,
				slidesOffsetAfter: 0
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			if (displayReviews.value.length > 0) {
				_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "bg-[#FFFAF4] py-16" }, _attrs))} data-v-c93b3a10><div class="container" data-v-c93b3a10><div class="text-center mb-10" data-v-c93b3a10><h2 class="reviews-title text-gray-900 mb-4" data-v-c93b3a10>${(0, server_renderer_exports.ssrInterpolate)(heading.value)}</h2><p class="body-2-r text-gray-500 max-w-2xl mx-auto leading-relaxed" data-v-c93b3a10>${(0, server_renderer_exports.ssrInterpolate)(subheading.value)}</p></div><div class="reviews-slider" data-v-c93b3a10>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
					modules,
					breakpoints,
					"space-between": 12,
					"slides-per-view": 1.1,
					"watch-overflow": true,
					pagination: {
						clickable: true,
						el: `#${dotsId}`
					},
					navigation: {
						prevEl: `#${prevId}`,
						nextEl: `#${nextId}`
					},
					a11y: {
						prevSlideMessage: "Previous review",
						nextSlideMessage: "Next review"
					}
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(displayReviews.value, (review, i) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), { key: i }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<article class="review-row" data-v-c93b3a10${_scopeId}><div class="flex items-start justify-between gap-4" data-v-c93b3a10${_scopeId}><div class="flex items-center gap-3.5 min-w-0" data-v-c93b3a10${_scopeId}>`);
											if (review.image) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
												src: review.image,
												alt: review.name,
												width: 44,
												height: 44,
												sizes: "44px",
												"img-class": "review-row-avatar"
											}, null, _parent, _scopeId));
											else _push(`<span class="review-row-avatar review-row-avatar--initial" data-v-c93b3a10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(initial(review.name))}</span>`);
											_push(`<div class="min-w-0" data-v-c93b3a10${_scopeId}><p class="review-row-name" data-v-c93b3a10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(review.name)}</p>`);
											if (review.city) _push(`<p class="review-row-city" data-v-c93b3a10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(review.city)}</p>`);
											else _push(`<!---->`);
											_push(`</div></div><div class="flex items-center gap-2 shrink-0" data-v-c93b3a10${_scopeId}><div class="flex gap-1" data-v-c93b3a10${_scopeId}><!--[-->`);
											(0, server_renderer_exports.ssrRenderList)(5, (n) => {
												_push(`<svg width="16" height="16" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= (review.rating || 5) ? "#b47f54" : "none")} stroke="#b47f54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c93b3a10${_scopeId}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-c93b3a10${_scopeId}></polygon></svg>`);
											});
											_push(`<!--]--></div><span class="review-row-rating" data-v-c93b3a10${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(review.rating || 5)}</span></div></div><p class="review-row-text" data-v-c93b3a10${_scopeId}>“${(0, server_renderer_exports.ssrInterpolate)(review.review)}”</p></article>`);
										} else return [(0, vue_exports.createVNode)("article", { class: "review-row" }, [(0, vue_exports.createVNode)("div", { class: "flex items-start justify-between gap-4" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3.5 min-w-0" }, [review.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
											key: 0,
											src: review.image,
											alt: review.name,
											width: 44,
											height: 44,
											sizes: "44px",
											"img-class": "review-row-avatar"
										}, null, 8, ["src", "alt"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 1,
											class: "review-row-avatar review-row-avatar--initial"
										}, (0, vue_exports.toDisplayString)(initial(review.name)), 1)), (0, vue_exports.createVNode)("div", { class: "min-w-0" }, [(0, vue_exports.createVNode)("p", { class: "review-row-name" }, (0, vue_exports.toDisplayString)(review.name), 1), review.city ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
											key: 0,
											class: "review-row-city"
										}, (0, vue_exports.toDisplayString)(review.city), 1)) : (0, vue_exports.createCommentVNode)("", true)])]), (0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 shrink-0" }, [(0, vue_exports.createVNode)("div", { class: "flex gap-1" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(5, (n) => {
											return (0, vue_exports.createVNode)("svg", {
												key: n,
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: n <= (review.rating || 5) ? "#b47f54" : "none",
												stroke: "#b47f54",
												"stroke-width": "1.5",
												"stroke-linecap": "round",
												"stroke-linejoin": "round"
											}, [(0, vue_exports.createVNode)("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })], 8, ["fill"]);
										}), 64))]), (0, vue_exports.createVNode)("span", { class: "review-row-rating" }, (0, vue_exports.toDisplayString)(review.rating || 5), 1)])]), (0, vue_exports.createVNode)("p", { class: "review-row-text" }, "“" + (0, vue_exports.toDisplayString)(review.review) + "”", 1)])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(displayReviews.value, (review, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), { key: i }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("article", { class: "review-row" }, [(0, vue_exports.createVNode)("div", { class: "flex items-start justify-between gap-4" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3.5 min-w-0" }, [review.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
									key: 0,
									src: review.image,
									alt: review.name,
									width: 44,
									height: 44,
									sizes: "44px",
									"img-class": "review-row-avatar"
								}, null, 8, ["src", "alt"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 1,
									class: "review-row-avatar review-row-avatar--initial"
								}, (0, vue_exports.toDisplayString)(initial(review.name)), 1)), (0, vue_exports.createVNode)("div", { class: "min-w-0" }, [(0, vue_exports.createVNode)("p", { class: "review-row-name" }, (0, vue_exports.toDisplayString)(review.name), 1), review.city ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "review-row-city"
								}, (0, vue_exports.toDisplayString)(review.city), 1)) : (0, vue_exports.createCommentVNode)("", true)])]), (0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 shrink-0" }, [(0, vue_exports.createVNode)("div", { class: "flex gap-1" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(5, (n) => {
									return (0, vue_exports.createVNode)("svg", {
										key: n,
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: n <= (review.rating || 5) ? "#b47f54" : "none",
										stroke: "#b47f54",
										"stroke-width": "1.5",
										"stroke-linecap": "round",
										"stroke-linejoin": "round"
									}, [(0, vue_exports.createVNode)("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })], 8, ["fill"]);
								}), 64))]), (0, vue_exports.createVNode)("span", { class: "review-row-rating" }, (0, vue_exports.toDisplayString)(review.rating || 5), 1)])]), (0, vue_exports.createVNode)("p", { class: "review-row-text" }, "“" + (0, vue_exports.toDisplayString)(review.review) + "”", 1)])]),
								_: 2
							}, 1024);
						}), 128))];
					}),
					_: 1
				}, _parent));
				_push(`<button${(0, server_renderer_exports.ssrRenderAttr)("id", prevId)} type="button" class="reviews-arrow reviews-arrow--prev" aria-label="Previous review" data-v-c93b3a10>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronLeft), { size: 20 }, null, _parent));
				_push(`</button><button${(0, server_renderer_exports.ssrRenderAttr)("id", nextId)} type="button" class="reviews-arrow reviews-arrow--next" aria-label="Next review" data-v-c93b3a10>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronRight), { size: 20 }, null, _parent));
				_push(`</button></div><div${(0, server_renderer_exports.ssrRenderAttr)("id", dotsId)} class="reviews-dots" data-v-c93b3a10></div></div></section>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Home/CustomerReviews.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CustomerReviews_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-c93b3a10"]]);
//#endregion
//#region resources/js/Pages/Public/Home.vue
var _sfc_main = {
	__name: "Home",
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
		products: Array,
		categories: Array,
		sliders: Array,
		featureProducts: Array,
		campaigns: Array,
		reviews: {
			type: Array,
			default: () => []
		},
		tiktokImages: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		import_dayjs_min.default.extend(import_duration.default);
		const props = __props;
		const activeCampaigns = (0, vue_exports.computed)(() => (props.campaigns || []).filter((c) => {
			if (!c.expiry_date) return true;
			return (0, import_dayjs_min.default)(c.expiry_date).isAfter((0, import_dayjs_min.default)());
		}));
		const countdownTick = (0, vue_exports.ref)(0);
		let countdownTimer = null;
		(0, vue_exports.onMounted)(() => {
			countdownTimer = setInterval(() => countdownTick.value++, 1e3);
		});
		(0, vue_exports.onUnmounted)(() => clearInterval(countdownTimer));
		const campaignTimeLeftMap = (0, vue_exports.computed)(() => {
			countdownTick.value;
			const now = (0, import_dayjs_min.default)();
			const map = {};
			for (const c of activeCampaigns.value) {
				if (!c.expiry_date) {
					map[c.id] = null;
					continue;
				}
				const diff = (0, import_dayjs_min.default)(c.expiry_date).diff(now);
				if (diff <= 0) {
					map[c.id] = "শেষ হয়েছে";
					continue;
				}
				const d = import_dayjs_min.default.duration(diff);
				const days = Math.floor(d.asDays());
				if (days > 0) map[c.id] = `${days}d ${d.hours()}h ${d.minutes()}m`;
				else map[c.id] = `${String(d.hours()).padStart(2, "0")}:${String(d.minutes()).padStart(2, "0")}:${String(d.seconds()).padStart(2, "0")}`;
			}
			return map;
		});
		function getCampaignTimeLeft(campaignId) {
			return campaignTimeLeftMap.value[campaignId];
		}
		function getCampaignDiscountedPrice(product, discount) {
			let price = parseFloat(product.price);
			if (!discount) return price;
			if (typeof discount === "string" && discount.includes("%")) price -= price * parseFloat(discount) / 100;
			else if (!isNaN(parseFloat(discount))) price -= parseFloat(discount);
			return Math.max(0, price);
		}
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
					if (_push) _push(`<title data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$6, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)(HeroSlider_default, { sliders: __props.sliders }, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, {
							blocks: __props.blocks,
							openPreview
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(CustomerReviews_default, { reviews: __props.reviews }, null, _parent, _scopeId));
						if (activeCampaigns.value.length > 0) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(activeCampaigns.value, (campaign) => {
								_push(`<section class="campaign-section py-14" style="${(0, server_renderer_exports.ssrRenderStyle)(campaign.products && campaign.products.length > 0 ? null : { display: "none" })}" data-v-1d492f4e${_scopeId}><div class="container" data-v-1d492f4e${_scopeId}><div class="campaign-header mb-8" data-v-1d492f4e${_scopeId}><div class="flex flex-wrap items-center justify-between gap-4" data-v-1d492f4e${_scopeId}><div data-v-1d492f4e${_scopeId}><span class="campaign-badge" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</span><h2 class="campaign-title mt-2" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(campaign.name)}</h2></div><div class="flex flex-col items-end gap-2" data-v-1d492f4e${_scopeId}>`);
								if (getCampaignTimeLeft(campaign.id)) _push(`<div class="campaign-countdown" data-v-1d492f4e${_scopeId}><span class="campaign-countdown-label" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</span><span class="campaign-countdown-time" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getCampaignTimeLeft(campaign.id))}</span></div>`);
								else _push(`<!---->`);
								_push(`</div></div><div class="campaign-divider mt-4" data-v-1d492f4e${_scopeId}></div></div><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5" data-v-1d492f4e${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(campaign.products, (product) => {
									_push(`<div class="campaign-card" data-v-1d492f4e${_scopeId}><div class="campaign-card-image-wrap group/img" data-v-1d492f4e${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.product_name)} class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" loading="lazy" data-v-1d492f4e${_scopeId}><div class="campaign-discount-badge" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</div><button class="campaign-quick-preview hidden md:flex" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</button></div><div class="campaign-card-info" data-v-1d492f4e${_scopeId}><h3 class="campaign-card-name" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.product_name)}</h3><div class="campaign-card-price-row" data-v-1d492f4e${_scopeId}><span class="campaign-card-original" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.price)}৳</span><span class="campaign-card-discounted" data-v-1d492f4e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getCampaignDiscountedPrice(product, campaign.discount))}৳ </span></div></div><div class="campaign-card-btn-wrap" data-v-1d492f4e${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
										href: `/product/${product.slug}`,
										onClick: () => {},
										class: "campaign-order-btn"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t6)}`);
											else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t6), 1)];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(`</div></div>`);
								});
								_push(`<!--]--></div></div></section>`);
							});
							_push(`<!--]-->`);
						} else _push(`<!---->`);
					} else return [
						(0, vue_exports.createVNode)(HeroSlider_default, { sliders: __props.sliders }, null, 8, ["sliders"]),
						(0, vue_exports.createVNode)(PageBlocks_default, {
							blocks: __props.blocks,
							openPreview
						}, null, 8, ["blocks"]),
						(0, vue_exports.createVNode)(CustomerReviews_default, { reviews: __props.reviews }, null, 8, ["reviews"]),
						activeCampaigns.value.length > 0 ? ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, (0, vue_exports.renderList)(activeCampaigns.value, (campaign) => {
							return (0, vue_exports.withDirectives)(((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
								key: campaign.id,
								class: "campaign-section py-14"
							}, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("div", { class: "campaign-header mb-8" }, [(0, vue_exports.createVNode)("div", { class: "flex flex-wrap items-center justify-between gap-4" }, [(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "campaign-badge" }, (0, vue_exports.toDisplayString)(__props.texts.t2), 1), (0, vue_exports.createVNode)("h2", { class: "campaign-title mt-2" }, (0, vue_exports.toDisplayString)(campaign.name), 1)]), (0, vue_exports.createVNode)("div", { class: "flex flex-col items-end gap-2" }, [getCampaignTimeLeft(campaign.id) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "campaign-countdown"
							}, [(0, vue_exports.createVNode)("span", { class: "campaign-countdown-label" }, (0, vue_exports.toDisplayString)(__props.texts.t3), 1), (0, vue_exports.createVNode)("span", { class: "campaign-countdown-time" }, (0, vue_exports.toDisplayString)(getCampaignTimeLeft(campaign.id)), 1)])) : (0, vue_exports.createCommentVNode)("", true)])]), (0, vue_exports.createVNode)("div", { class: "campaign-divider mt-4" })]), (0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(campaign.products, (product) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: product.id,
									class: "campaign-card",
									onClick: ($event) => (0, vue_exports.unref)(router).visit(`/product/${product.slug}`)
								}, [
									(0, vue_exports.createVNode)("div", { class: "campaign-card-image-wrap group/img" }, [
										(0, vue_exports.createVNode)("img", {
											src: product.featured_image,
											alt: product.product_name,
											class: "w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105",
											loading: "lazy"
										}, null, 8, ["src", "alt"]),
										(0, vue_exports.createVNode)("div", { class: "campaign-discount-badge" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1),
										(0, vue_exports.createVNode)("button", {
											onClick: (0, vue_exports.withModifiers)(($event) => openPreview(product), ["stop"]),
											class: "campaign-quick-preview hidden md:flex"
										}, (0, vue_exports.toDisplayString)(__props.texts.t5), 9, ["onClick"])
									]),
									(0, vue_exports.createVNode)("div", { class: "campaign-card-info" }, [(0, vue_exports.createVNode)("h3", { class: "campaign-card-name" }, (0, vue_exports.toDisplayString)(product.product_name), 1), (0, vue_exports.createVNode)("div", { class: "campaign-card-price-row" }, [(0, vue_exports.createVNode)("span", { class: "campaign-card-original" }, (0, vue_exports.toDisplayString)(product.price) + "৳", 1), (0, vue_exports.createVNode)("span", { class: "campaign-card-discounted" }, (0, vue_exports.toDisplayString)(getCampaignDiscountedPrice(product, campaign.discount)) + "৳ ", 1)])]),
									(0, vue_exports.createVNode)("div", { class: "campaign-card-btn-wrap" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
										href: `/product/${product.slug}`,
										onClick: (0, vue_exports.withModifiers)(() => {}, ["stop"]),
										class: "campaign-order-btn"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t6), 1)]),
										_: 1
									}, 8, ["href", "onClick"])])
								], 8, ["onClick"]);
							}), 128))])])])), [[vue_exports.vShow, campaign.products && campaign.products.length > 0]]);
						}), 128)) : (0, vue_exports.createCommentVNode)("", true)
					];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Home_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-1d492f4e"]]);
//#endregion
export { Home_default as default };

//# sourceMappingURL=Home-DOekCPuO.js.map