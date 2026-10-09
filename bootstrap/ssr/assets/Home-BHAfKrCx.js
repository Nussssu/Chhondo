import { c as server_renderer_exports, h as __toESM, i as link_default, l as vue_exports, r as head_default, s as router, u as __commonJSMin } from "../ssr.js";
import { p as variantSrcset, t as AppLayout_default } from "./AppLayout-CNqlOJ3L.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-P8L_ue1k.js";
import { i as shown, n as plain, r as rich, t as on } from "./cms-BWXg6J9T.js";
import { t as ProductPreviewModel_default } from "./ProductPreviewModel-BOATU6W9.js";
import { _ as getWindow, d as getSlideTransformEl, g as getDocument, i as SwiperSlide, l as elementParents, r as Swiper, s as elementOffset, t as Navigation, u as elementTransitionEnd } from "./swiper-GI9fQ5zH.js";
import { t as Pagination } from "./pagination-rRNggmt5.js";
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/modules/keyboard.mjs
function Keyboard(_ref) {
	let { swiper, extendParams, on, emit } = _ref;
	const document = getDocument();
	const window = getWindow();
	swiper.keyboard = { enabled: false };
	extendParams({ keyboard: {
		enabled: false,
		onlyInViewport: true,
		pageUpDown: true
	} });
	function handle(event) {
		if (!swiper.enabled) return;
		const { rtlTranslate: rtl } = swiper;
		let e = event;
		if (e.originalEvent) e = e.originalEvent;
		const kc = e.keyCode || e.charCode;
		const pageUpDown = swiper.params.keyboard.pageUpDown;
		const isPageUp = pageUpDown && kc === 33;
		const isPageDown = pageUpDown && kc === 34;
		const isArrowLeft = kc === 37;
		const isArrowRight = kc === 39;
		const isArrowUp = kc === 38;
		const isArrowDown = kc === 40;
		if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) return false;
		if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) return false;
		if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
		if (document.activeElement && (document.activeElement.isContentEditable || document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === "input" || document.activeElement.nodeName.toLowerCase() === "textarea"))) return;
		if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
			let inView = false;
			if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) return;
			const el = swiper.el;
			const swiperWidth = el.clientWidth;
			const swiperHeight = el.clientHeight;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const swiperOffset = elementOffset(el);
			if (rtl) swiperOffset.left -= el.scrollLeft;
			const swiperCoord = [
				[swiperOffset.left, swiperOffset.top],
				[swiperOffset.left + swiperWidth, swiperOffset.top],
				[swiperOffset.left, swiperOffset.top + swiperHeight],
				[swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]
			];
			for (let i = 0; i < swiperCoord.length; i += 1) {
				const point = swiperCoord[i];
				if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
					if (point[0] === 0 && point[1] === 0) continue;
					inView = true;
				}
			}
			if (!inView) return void 0;
		}
		if (swiper.isHorizontal()) {
			if (isPageUp || isPageDown || isArrowLeft || isArrowRight) if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
			if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
		} else {
			if (isPageUp || isPageDown || isArrowUp || isArrowDown) if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			if (isPageDown || isArrowDown) swiper.slideNext();
			if (isPageUp || isArrowUp) swiper.slidePrev();
		}
		emit("keyPress", kc);
	}
	function enable() {
		if (swiper.keyboard.enabled) return;
		document.addEventListener("keydown", handle);
		swiper.keyboard.enabled = true;
	}
	function disable() {
		if (!swiper.keyboard.enabled) return;
		document.removeEventListener("keydown", handle);
		swiper.keyboard.enabled = false;
	}
	on("init", () => {
		if (swiper.params.keyboard.enabled) enable();
	});
	on("destroy", () => {
		if (swiper.keyboard.enabled) disable();
	});
	Object.assign(swiper.keyboard, {
		enable,
		disable
	});
}
//#endregion
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/modules/autoplay.mjs
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
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/shared/effect-init.mjs
function effectInit(params) {
	const { effect, swiper, on, setTranslate, setTransition, overwriteParams, perspective, recreateShadows, getEffectParams } = params;
	on("beforeInit", () => {
		if (swiper.params.effect !== effect) return;
		swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
		if (perspective && perspective()) swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
		const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
		Object.assign(swiper.params, overwriteParamsResult);
		Object.assign(swiper.originalParams, overwriteParamsResult);
	});
	on("setTranslate _virtualUpdated", () => {
		if (swiper.params.effect !== effect) return;
		setTranslate();
	});
	on("setTransition", (_s, duration) => {
		if (swiper.params.effect !== effect) return;
		setTransition(duration);
	});
	on("transitionEnd", () => {
		if (swiper.params.effect !== effect) return;
		if (recreateShadows) {
			if (!getEffectParams || !getEffectParams().slideShadows) return;
			swiper.slides.forEach((slideEl) => {
				slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
			});
			recreateShadows();
		}
	});
	let requireUpdateOnVirtual;
	on("virtualUpdate", () => {
		if (swiper.params.effect !== effect) return;
		if (!swiper.slides.length) requireUpdateOnVirtual = true;
		requestAnimationFrame(() => {
			if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
				setTranslate();
				requireUpdateOnVirtual = false;
			}
		});
	});
}
//#endregion
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/shared/effect-target.mjs
function effectTarget(effectParams, slideEl) {
	const transformEl = getSlideTransformEl(slideEl);
	if (transformEl !== slideEl) {
		transformEl.style.backfaceVisibility = "hidden";
		transformEl.style["-webkit-backface-visibility"] = "hidden";
	}
	return transformEl;
}
//#endregion
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/shared/effect-virtual-transition-end.mjs
function effectVirtualTransitionEnd(_ref) {
	let { swiper, duration, transformElements, allSlides } = _ref;
	const { activeIndex } = swiper;
	const getSlide = (el) => {
		if (!el.parentElement) return swiper.slides.find((slideEl) => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode);
		return el.parentElement;
	};
	if (swiper.params.virtualTranslate && duration !== 0) {
		let eventTriggered = false;
		let transitionEndTarget;
		if (allSlides) transitionEndTarget = transformElements;
		else transitionEndTarget = transformElements.filter((transformEl) => {
			const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
			return swiper.getSlideIndex(el) === activeIndex;
		});
		transitionEndTarget.forEach((el) => {
			elementTransitionEnd(el, () => {
				if (eventTriggered) return;
				if (!swiper || swiper.destroyed) return;
				eventTriggered = true;
				swiper.animating = false;
				const evt = new window.CustomEvent("transitionend", {
					bubbles: true,
					cancelable: true
				});
				swiper.wrapperEl.dispatchEvent(evt);
			});
		});
	}
}
//#endregion
//#region node_modules/.pnpm/swiper@11.2.10/node_modules/swiper/modules/effect-fade.mjs
function EffectFade(_ref) {
	let { swiper, extendParams, on } = _ref;
	extendParams({ fadeEffect: { crossFade: false } });
	const setTranslate = () => {
		const { slides } = swiper;
		const params = swiper.params.fadeEffect;
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = swiper.slides[i];
			let tx = -slideEl.swiperSlideOffset;
			if (!swiper.params.virtualTranslate) tx -= swiper.translate;
			let ty = 0;
			if (!swiper.isHorizontal()) {
				ty = tx;
				tx = 0;
			}
			const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.opacity = slideOpacity;
			targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements,
			allSlides: true
		});
	};
	effectInit({
		effect: "fade",
		swiper,
		on,
		setTranslate,
		setTransition,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			spaceBetween: 0,
			virtualTranslate: !swiper.params.cssMode
		})
	});
}
//#endregion
//#region resources/js/components/HeroSlider.vue
var _sfc_main$2 = {
	__name: "HeroSlider",
	__ssrInlineRender: true,
	props: {
		slideshowEnabled: {
			type: Boolean,
			default: false
		},
		autoplayEnabled: {
			type: Boolean,
			default: true
		},
		slideSeconds: {
			type: [String, Number],
			default: 5
		},
		sliders: {
			type: Array,
			required: true
		},
		desktopImage: {
			type: String,
			default: ""
		},
		mobileImage: {
			type: String,
			default: ""
		},
		overlay: {
			type: Object,
			default: null
		}
	},
	setup(__props) {
		const modules = [
			Navigation,
			Pagination,
			Autoplay,
			EffectFade,
			Keyboard
		];
		const props = __props;
		/**
		* The slides: the hero image first, then the extra images added under it in
		* the admin, in their order. With no extra images there is nothing to rotate
		* and the hero renders as the single image it always was.
		*/
		const slides = (0, vue_exports.computed)(() => {
			if (!props.sliders.length) return [];
			return [...props.desktopImage ? [{
				id: "hero",
				plain: true,
				image_path: props.desktopImage,
				mobile_or_desktop_image: props.mobileImage || props.desktopImage,
				title: "উৎসবের আমেজে বাঙালিয়ানা সাজ"
			}] : [], ...props.sliders];
		});
		const autoplay = (0, vue_exports.computed)(() => props.autoplayEnabled && slides.value.length > 1 ? {
			delay: Math.max(1, Math.min(120, Number(props.slideSeconds) || 5)) * 1e3,
			disableOnInteraction: false,
			pauseOnMouseEnter: true
		} : false);
		const activeSlideIndex = (0, vue_exports.ref)(0);
		const swiperInstance = (0, vue_exports.shallowRef)(null);
		const currentOverlay = (0, vue_exports.computed)(() => {
			const slide = slides.value[activeSlideIndex.value] || slides.value[0];
			if (!slide || slide.plain) return props.overlay;
			return {
				title: slide.heading || "",
				eyebrow: slide.show_subtext !== false ? slide.subtext : null,
				ctaLabel: slide.show_cta !== false ? slide.cta_label : null,
				ctaUrl: slide.cta_url || "/shop"
			};
		});
		function syncAutoplay() {
			const swiper = swiperInstance.value;
			if (!swiper?.autoplay || swiper.destroyed) return;
			swiper.autoplay.stop();
			if (!swiper.params.autoplay || typeof swiper.params.autoplay !== "object") swiper.params.autoplay = {};
			if (autoplay.value) {
				Object.assign(swiper.params.autoplay, autoplay.value, { enabled: true });
				swiper.autoplay.start();
			} else swiper.params.autoplay.enabled = false;
		}
		(0, vue_exports.watch)([
			() => props.autoplayEnabled,
			() => props.slideSeconds,
			() => slides.value.length
		], syncAutoplay);
		const isInternal = (url) => typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
		const linkAttrs = (slide) => slide.link_new_tab ? {
			href: slide.link_url,
			target: "_blank",
			rel: "noopener noreferrer"
		} : { href: slide.link_url };
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
		const desktopSrcset = (slide) => slide.plain || failed.value.has(slide.id) ? void 0 : variantSrcset(slide.image_path);
		const mobileSrcset = (slide) => {
			const url = slide.mobile_or_desktop_image || slide.image_path;
			if (slide.plain || failed.value.has(slide.id)) return url;
			return variantSrcset(url) ?? url;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "swiper-container w-full min-h-auto mx-auto relative" }, _attrs))} data-v-b4e2f47e>`);
			if (__props.desktopImage && slides.value.length < 2) {
				_push(`<div class="hero-slide" data-v-b4e2f47e><picture data-v-b4e2f47e>`);
				if (__props.mobileImage) _push(`<source media="(max-width: 767px)"${(0, server_renderer_exports.ssrRenderAttr)("srcset", __props.mobileImage)} sizes="100vw" data-v-b4e2f47e>`);
				else _push(`<!---->`);
				_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", __props.desktopImage)} alt="উৎসবের আমেজে বাঙালিয়ানা সাজ" class="hero-slide-img" width="1920" height="848" loading="eager" fetchpriority="high" decoding="async" data-v-b4e2f47e></picture></div>`);
			} else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Swiper), {
				modules,
				"slides-per-view": 1,
				"space-between": 30,
				loop: slides.value.length > 1,
				effect: "fade",
				"fade-effect": { crossFade: true },
				speed: 800,
				keyboard: { enabled: true },
				navigation: slides.value.length > 1 ? {
					prevEl: ".hero-nav--prev",
					nextEl: ".hero-nav--next"
				} : false,
				pagination: { clickable: true },
				autoplay: autoplay.value,
				onSwiper: ($event) => {
					swiperInstance.value = $event;
					activeSlideIndex.value = $event.realIndex || 0;
				},
				onSlideChange: ($event) => activeSlideIndex.value = $event.realIndex || 0
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(slides.value, (slide, index) => {
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(SwiperSlide), { key: slide.id }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) (0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(slide.link_url ? isInternal(slide.link_url) && !slide.link_new_tab ? (0, vue_exports.unref)(link_default) : "a" : "div"), (0, vue_exports.mergeProps)({ ref_for: true }, slide.link_url ? linkAttrs(slide) : {}, {
										class: ["hero-slide", { "is-link": slide.link_url }],
										"aria-label": slide.link_url ? slide.title || "Open banner" : void 0
									}), {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push(`<picture data-v-b4e2f47e${_scopeId}><source media="(max-width: 767px)"${(0, server_renderer_exports.ssrRenderAttr)("srcset", mobileSrcset(slide))} sizes="100vw" data-v-b4e2f47e${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", slide.image_path)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", desktopSrcset(slide))} sizes="100vw"${(0, server_renderer_exports.ssrRenderAttr)("alt", slide.title || "Slider")} class="hero-slide-img"${(0, server_renderer_exports.ssrRenderAttr)("width", 1900)}${(0, server_renderer_exports.ssrRenderAttr)("height", 560)}${(0, server_renderer_exports.ssrRenderAttr)("loading", index === 0 ? "eager" : "lazy")}${(0, server_renderer_exports.ssrRenderAttr)("fetchpriority", index === 0 ? "high" : "auto")} decoding="async" data-v-b4e2f47e${_scopeId}></picture>`);
											else return [(0, vue_exports.createVNode)("picture", null, [(0, vue_exports.createVNode)("source", {
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
											])])];
										}),
										_: 2
									}), _parent, _scopeId);
									else return [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(slide.link_url ? isInternal(slide.link_url) && !slide.link_new_tab ? (0, vue_exports.unref)(link_default) : "a" : "div"), (0, vue_exports.mergeProps)({ ref_for: true }, slide.link_url ? linkAttrs(slide) : {}, {
										class: ["hero-slide", { "is-link": slide.link_url }],
										"aria-label": slide.link_url ? slide.title || "Open banner" : void 0
									}), {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("picture", null, [(0, vue_exports.createVNode)("source", {
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
										])])]),
										_: 2
									}, 1040, ["class", "aria-label"]))];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(slides.value, (slide, index) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(SwiperSlide), { key: slide.id }, {
							default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(slide.link_url ? isInternal(slide.link_url) && !slide.link_new_tab ? (0, vue_exports.unref)(link_default) : "a" : "div"), (0, vue_exports.mergeProps)({ ref_for: true }, slide.link_url ? linkAttrs(slide) : {}, {
								class: ["hero-slide", { "is-link": slide.link_url }],
								"aria-label": slide.link_url ? slide.title || "Open banner" : void 0
							}), {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("picture", null, [(0, vue_exports.createVNode)("source", {
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
								])])]),
								_: 2
							}, 1040, ["class", "aria-label"]))]),
							_: 2
						}, 1024);
					}), 128))];
				}),
				_: 1
			}, _parent));
			if (slides.value.length > 1) _push(`<!--[--><button type="button" class="hero-nav hero-nav--prev" aria-label="Previous banner" data-v-b4e2f47e><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-b4e2f47e><path d="M14.5 6.5 9 12l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-b4e2f47e></path></svg></button><button type="button" class="hero-nav hero-nav--next" aria-label="Next banner" data-v-b4e2f47e><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-b4e2f47e><path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-b4e2f47e></path></svg></button><!--]-->`);
			else _push(`<!---->`);
			if (currentOverlay.value && (currentOverlay.value.title || currentOverlay.value.eyebrow || currentOverlay.value.ctaLabel)) {
				_push(`<div class="hero-overlay" data-v-b4e2f47e><div class="hero-fade" aria-hidden="true" data-v-b4e2f47e></div><div class="container hero-copy-row" data-v-b4e2f47e><div class="hero-copy" data-v-b4e2f47e>`);
				if (currentOverlay.value.eyebrow) _push(`<p class="hero-eyebrow" data-v-b4e2f47e>${(0, server_renderer_exports.ssrInterpolate)(currentOverlay.value.eyebrow)}</p>`);
				else _push(`<!---->`);
				if (currentOverlay.value.title) _push(`<h1 class="hero-title" data-v-b4e2f47e>${(0, vue_exports.unref)(rich)(currentOverlay.value.title) ?? ""}</h1>`);
				else _push(`<!---->`);
				_push(`</div>`);
				if (currentOverlay.value.ctaLabel) (0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(isInternal(currentOverlay.value.ctaUrl) ? (0, vue_exports.unref)(link_default) : "a"), {
					href: currentOverlay.value.ctaUrl || "/shop",
					class: "hero-cta"
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span data-v-b4e2f47e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(currentOverlay.value.ctaLabel)}</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-b4e2f47e${_scopeId}><path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-b4e2f47e${_scopeId}></path></svg>`);
						else return [(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(currentOverlay.value.ctaLabel), 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							width: "24",
							height: "24",
							viewBox: "0 0 24 24",
							fill: "none",
							"aria-hidden": "true"
						}, [(0, vue_exports.createVNode)("path", {
							d: "M9.5 6.5 15 12l-5.5 5.5",
							stroke: "currentColor",
							"stroke-width": "1.8",
							"stroke-linecap": "round",
							"stroke-linejoin": "round"
						})]))];
					}),
					_: 1
				}), _parent);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/HeroSlider.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var HeroSlider_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-b4e2f47e"]]);
//#endregion
//#region resources/js/components/Home/CustomerReviews.vue
var _sfc_main$1 = {
	__name: "CustomerReviews",
	__ssrInlineRender: true,
	props: {
		reviews: {
			type: Array,
			default: () => []
		},
		title: {
			type: String,
			default: "ছন্দময়ীদের *গল্প*"
		}
	},
	setup(__props) {
		const props = __props;
		const displayReviews = (0, vue_exports.computed)(() => (props.reviews || []).slice(0, 12));
		const fill = (row) => {
			const filled = [];
			while (filled.length < 6) filled.push(...row);
			return filled;
		};
		const rows = (0, vue_exports.computed)(() => {
			const list = displayReviews.value;
			if (!list.length) return [];
			return [...(list.length > 3 ? [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)] : [list, [...list].reverse()]).map((row, i) => ({
				items: fill(row),
				cls: ["reviews-marquee--desktop", i === 1 && "reviews-marquee--reverse"]
			})), {
				items: fill(list),
				cls: ["reviews-marquee--phone"]
			}];
		});
		const initial = (name) => name ? name.charAt(0).toUpperCase() : "?";
		return (_ctx, _push, _parent, _attrs) => {
			if (displayReviews.value.length > 0) {
				_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "reviews-section" }, _attrs))} data-v-71b7b426><h2 class="reviews-title" data-v-71b7b426>${(0, vue_exports.unref)(rich)(__props.title) ?? ""}</h2><div class="reviews-rows" data-v-71b7b426><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(rows.value, (row, r) => {
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([row.cls, "reviews-marquee"])}" data-v-71b7b426><div class="reviews-track" style="${(0, server_renderer_exports.ssrRenderStyle)({ "--count": row.items.length })}" data-v-71b7b426><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(2, (copy) => {
						_push(`<!--[--><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(row.items, (review, i) => {
							_push(`<article class="review-card"${(0, server_renderer_exports.ssrRenderAttr)("aria-hidden", copy === 2 ? "true" : void 0)} data-v-71b7b426><div class="review-card-head" data-v-71b7b426><span class="review-card-avatar review-card-avatar--initial" aria-hidden="true" data-v-71b7b426>${(0, server_renderer_exports.ssrInterpolate)(initial(review.name))}</span><div class="min-w-0" data-v-71b7b426><p class="review-card-name" data-v-71b7b426>${(0, server_renderer_exports.ssrInterpolate)(review.name)}</p>`);
							if (review.city) _push(`<p class="review-card-city" data-v-71b7b426>${(0, server_renderer_exports.ssrInterpolate)(review.city)}</p>`);
							else _push(`<!---->`);
							_push(`</div></div><div class="review-card-body" data-v-71b7b426><div class="review-card-stars"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `${review.rating || 5} / 5`)} data-v-71b7b426><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(5, (n) => {
								_push(`<svg width="24" height="24" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", n <= (review.rating || 5) ? "#d6af51" : "#efe0bb")} aria-hidden="true" data-v-71b7b426><path d="M12 2.6l2.83 5.95 6.52.82-4.79 4.5 1.22 6.46L12 17.17l-5.78 3.16 1.22-6.46-4.79-4.5 6.52-.82L12 2.6z" data-v-71b7b426></path></svg>`);
							});
							_push(`<!--]--></div><p class="review-card-text" data-v-71b7b426>${(0, server_renderer_exports.ssrInterpolate)(review.review)}</p></div></article>`);
						});
						_push(`<!--]--><!--]-->`);
					});
					_push(`<!--]--></div></div>`);
				});
				_push(`<!--]--></div></section>`);
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
var CustomerReviews_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-71b7b426"]]);
//#endregion
//#region node_modules/.pnpm/dayjs@1.11.21/node_modules/dayjs/dayjs.min.js
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
//#region node_modules/.pnpm/dayjs@1.11.21/node_modules/dayjs/plugin/duration.js
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
//#region resources/js/Pages/Public/Home.vue?vue&type=style&index=0&scoped=1657cc1c&lang.css
var import_dayjs_min = /* @__PURE__ */ __toESM(require_dayjs_min());
var import_duration = /* @__PURE__ */ __toESM(require_duration());
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
		const blocksOfType = (type) => (0, vue_exports.computed)(() => (props.blocks || []).filter((block) => block.type === type));
		const productBlocks = blocksOfType("product_section");
		const ctaBlocks = blocksOfType("cta_banner");
		const videoBlocks = blocksOfType("video_strip");
		const otherBlocks = (0, vue_exports.computed)(() => (props.blocks || []).filter((block) => ![
			"product_section",
			"cta_banner",
			"video_strip"
		].includes(block.type)));
		const visualProducts = (0, vue_exports.computed)(() => {
			const configured = productBlocks.value.flatMap((block) => block.products || []);
			return configured.length ? configured : props.products || [];
		});
		const t = (0, vue_exports.computed)(() => props.texts || {});
		const heroOverlay = (0, vue_exports.computed)(() => ({
			eyebrow: on(t.value.hero_eyebrow_show) ? t.value.hero_eyebrow : null,
			title: t.value.hero_title || "",
			ctaLabel: on(t.value.hero_cta_show) ? t.value.hero_cta_label : null,
			ctaUrl: t.value.hero_cta_url || "/shop"
		}));
		const imageStrip = (0, vue_exports.computed)(() => on(t.value.gallery_show) ? shown(t.value.gallery).filter((row) => row.image).map((row, index) => {
			const product = visualProducts.value[index];
			return {
				id: `gallery-${index}`,
				src: row.image,
				href: row.url || (product?.slug ? `/product/${product.slug}` : "/shop"),
				alt: product?.product_name || "Chhondo saree gallery"
			};
		}) : []);
		const storyDarkImages = (0, vue_exports.computed)(() => on(t.value.story_dark_show) ? [t.value.story_dark_image_1, t.value.story_dark_image_2].filter(Boolean).map((src, i) => ({
			id: `story-dark-${i}`,
			src,
			alt: "Chhondo saree story",
			href: t.value.story_dark_button_url || "/shop"
		})) : []);
		const storyLightImages = (0, vue_exports.computed)(() => on(t.value.story_light_show) ? [t.value.story_light_image_1, t.value.story_light_image_2].filter(Boolean).map((src, i) => ({
			id: `story-light-${i}`,
			src,
			alt: "Chhondo saree tradition",
			href: t.value.story_light_link || "/shop"
		})) : []);
		const editorialCategories = (0, vue_exports.computed)(() => on(t.value.editorial_show) ? shown(t.value.editorial_cards).map((card, index) => {
			const category = (props.categories || [])[index];
			return {
				id: `editorial-${index}`,
				image: card.image,
				name: card.title,
				subtitle: card.subtitle,
				href: card.url || (category?.slug ? `/product-category/${category.slug}` : "/shop")
			};
		}) : []);
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
					if (_push) _push(`<title data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(plain)(t.value.tab_title))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(plain)(t.value.tab_title)), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						if ((0, vue_exports.unref)(on)(t.value.hero_show)) _push((0, server_renderer_exports.ssrRenderComponent)(HeroSlider_default, {
							sliders: __props.sliders,
							"desktop-image": t.value.hero_image_desktop,
							"mobile-image": t.value.hero_image_mobile,
							"slideshow-enabled": (0, vue_exports.unref)(on)(t.value.hero_slideshow_enabled ?? "0"),
							"autoplay-enabled": (0, vue_exports.unref)(on)(t.value.hero_autoplay_enabled ?? "1"),
							"slide-seconds": t.value.hero_slide_seconds || "5",
							overlay: heroOverlay.value
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(productBlocks),
							openPreview
						}, null, _parent, _scopeId));
						if (imageStrip.value.length) {
							_push(`<section class="chhondo-image-strip" aria-label="Chhondo collection" data-v-1657cc1c${_scopeId}><span class="chhondo-watermark chhondo-watermark--right chhondo-watermark--strip" aria-hidden="true" data-v-1657cc1c${_scopeId}></span><div class="chhondo-image-strip__track" data-v-1657cc1c${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(imageStrip.value, (item, index) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: item.id,
									href: item.href,
									class: ["chhondo-image-strip__item", { "is-tall": index % 2 === 1 }]
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.alt)} loading="lazy" decoding="async" data-v-1657cc1c${_scopeId}>`);
										else return [(0, vue_exports.createVNode)("img", {
											src: item.src,
											alt: item.alt,
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(imageStrip.value, (item, index) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: `clone-${item.id}`,
									href: item.href,
									class: ["chhondo-image-strip__item chhondo-image-strip__item--clone", { "is-tall": index % 2 === 1 }],
									"aria-hidden": "true",
									tabindex: "-1"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)} alt="" loading="lazy" decoding="async" data-v-1657cc1c${_scopeId}>`);
										else return [(0, vue_exports.createVNode)("img", {
											src: item.src,
											alt: "",
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, ["src", "onError"])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div></section>`);
						} else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(ctaBlocks),
							openPreview
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(videoBlocks),
							openPreview
						}, null, _parent, _scopeId));
						if (storyDarkImages.value.length) {
							_push(`<section class="chhondo-story chhondo-story--dark" data-v-1657cc1c${_scopeId}><div class="container chhondo-story__grid" data-v-1657cc1c${_scopeId}><div class="chhondo-story__copy" data-v-1657cc1c${_scopeId}><div class="chhondo-story__text" data-v-1657cc1c${_scopeId}><h2 data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.story_dark_title) ?? ""}</h2>`);
							if ((0, vue_exports.unref)(on)(t.value.story_dark_text_show)) _push(`<p data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.story_dark_text) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if ((0, vue_exports.unref)(on)(t.value.story_dark_button_show) && t.value.story_dark_button_label) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								href: t.value.story_dark_button_url || "/shop",
								class: "chhondo-ghost-button"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(t.value.story_dark_button_label)} <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-1657cc1c${_scopeId}><path d="M9 18l6-6-6-6" data-v-1657cc1c${_scopeId}></path></svg>`);
									else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.story_dark_button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
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
							_push(`</div><div class="chhondo-story__media chhondo-story__media--pair" data-v-1657cc1c${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(storyDarkImages.value, (item) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: item.id,
									href: item.href
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.alt)} loading="lazy" decoding="async" data-v-1657cc1c${_scopeId}>`);
										else return [(0, vue_exports.createVNode)("img", {
											src: item.src,
											alt: item.alt,
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div></div></section>`);
						} else _push(`<!---->`);
						if (storyLightImages.value.length) {
							_push(`<section class="chhondo-story chhondo-story--light" data-v-1657cc1c${_scopeId}><span class="chhondo-watermark chhondo-watermark--right" aria-hidden="true" data-v-1657cc1c${_scopeId}></span><div class="container chhondo-story__grid chhondo-story__grid--reverse" data-v-1657cc1c${_scopeId}><div class="chhondo-story__media chhondo-story__media--layered" data-v-1657cc1c${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(storyLightImages.value, (item, i) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: item.id,
									href: item.href,
									class: ["chhondo-story__frame", i === 0 ? "chhondo-story__frame--back" : "chhondo-story__frame--front"]
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", item.src)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.alt)} loading="lazy" decoding="async" data-v-1657cc1c${_scopeId}>`);
										else return [(0, vue_exports.createVNode)("img", {
											src: item.src,
											alt: item.alt,
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div><div class="chhondo-story__copy chhondo-story__copy--light" data-v-1657cc1c${_scopeId}><div class="chhondo-story__text" data-v-1657cc1c${_scopeId}><h2 data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.story_light_title) ?? ""}</h2>`);
							if ((0, vue_exports.unref)(on)(t.value.story_light_text_show)) _push(`<p data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.story_light_text) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div></div></div></section>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(t.value.reviews_show)) _push((0, server_renderer_exports.ssrRenderComponent)(CustomerReviews_default, {
							reviews: __props.reviews,
							title: t.value.reviews_title
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (editorialCategories.value.length) {
							_push(`<section class="chhondo-editorial" data-v-1657cc1c${_scopeId}><span class="chhondo-watermark chhondo-watermark--left" aria-hidden="true" data-v-1657cc1c${_scopeId}></span><div class="container" data-v-1657cc1c${_scopeId}><div class="chhondo-section-heading" data-v-1657cc1c${_scopeId}><h2 data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.editorial_title) ?? ""}</h2>`);
							if ((0, vue_exports.unref)(on)(t.value.editorial_text_show)) _push(`<p data-v-1657cc1c${_scopeId}>${(0, vue_exports.unref)(rich)(t.value.editorial_text, { breaks: "desktop" }) ?? ""}</p>`);
							else _push(`<!---->`);
							_push(`</div><div class="${(0, server_renderer_exports.ssrRenderClass)([`chhondo-editorial__grid--${editorialCategories.value.length}`, "chhondo-editorial__grid"])}" data-v-1657cc1c${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(editorialCategories.value, (category, index) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									key: category.id,
									href: category.href,
									class: ["chhondo-editorial__card", `chhondo-editorial__card--${index + 1}`]
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", category.image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", category.name)} loading="lazy" decoding="async" data-v-1657cc1c${_scopeId}><span class="chhondo-editorial__bar" data-v-1657cc1c${_scopeId}><span class="chhondo-editorial__copy" data-v-1657cc1c${_scopeId}><span class="chhondo-editorial__name" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(category.name)}</span>`);
											if (category.subtitle) _push(`<span class="chhondo-editorial__sub" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(category.subtitle)}</span>`);
											else _push(`<!---->`);
											_push(`</span>`);
											if ((0, vue_exports.unref)(on)(t.value.editorial_explore_show)) _push(`<span class="chhondo-editorial__explore" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.editorial_explore)} <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-1657cc1c${_scopeId}><path d="M9 18l6-6-6-6" data-v-1657cc1c${_scopeId}></path></svg></span>`);
											else _push(`<!---->`);
											_push(`</span>`);
										} else return [(0, vue_exports.createVNode)("img", {
											src: category.image || "/placeholder.svg",
											alt: category.name,
											loading: "lazy",
											decoding: "async",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										]), (0, vue_exports.createVNode)("span", { class: "chhondo-editorial__bar" }, [(0, vue_exports.createVNode)("span", { class: "chhondo-editorial__copy" }, [(0, vue_exports.createVNode)("span", { class: "chhondo-editorial__name" }, (0, vue_exports.toDisplayString)(category.name), 1), category.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											class: "chhondo-editorial__sub"
										}, (0, vue_exports.toDisplayString)(category.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.editorial_explore_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											class: "chhondo-editorial__explore"
										}, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.editorial_explore) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											"stroke-width": "1.8",
											"stroke-linecap": "round",
											"stroke-linejoin": "round",
											"aria-hidden": "true"
										}, [(0, vue_exports.createVNode)("path", { d: "M9 18l6-6-6-6" })]))])) : (0, vue_exports.createCommentVNode)("", true)])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div></div></section>`);
						} else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, {
							blocks: otherBlocks.value,
							openPreview
						}, null, _parent, _scopeId));
						if ((0, vue_exports.unref)(on)(t.value.campaign_show) && activeCampaigns.value.length > 0) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(activeCampaigns.value, (campaign) => {
								_push(`<section class="campaign-section py-14" style="${(0, server_renderer_exports.ssrRenderStyle)(campaign.products && campaign.products.length > 0 ? null : { display: "none" })}" data-v-1657cc1c${_scopeId}><div class="container" data-v-1657cc1c${_scopeId}><div class="campaign-header mb-8" data-v-1657cc1c${_scopeId}><div class="flex flex-wrap items-center justify-between gap-4" data-v-1657cc1c${_scopeId}><div data-v-1657cc1c${_scopeId}><span class="campaign-badge" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</span><h2 class="campaign-title mt-2" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(campaign.name)}</h2></div><div class="flex flex-col items-end gap-2" data-v-1657cc1c${_scopeId}>`);
								if (getCampaignTimeLeft(campaign.id)) _push(`<div class="campaign-countdown" data-v-1657cc1c${_scopeId}><span class="campaign-countdown-label" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</span><span class="campaign-countdown-time" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getCampaignTimeLeft(campaign.id))}</span></div>`);
								else _push(`<!---->`);
								_push(`</div></div><div class="campaign-divider mt-4" data-v-1657cc1c${_scopeId}></div></div><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5" data-v-1657cc1c${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(campaign.products, (product) => {
									_push(`<div class="campaign-card" data-v-1657cc1c${_scopeId}><div class="campaign-card-image-wrap group/img" data-v-1657cc1c${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", product.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.product_name)} class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" loading="lazy" decoding="async" width="400" height="500" data-v-1657cc1c${_scopeId}><div class="campaign-discount-badge" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</div><button class="campaign-quick-preview hidden md:flex" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</button></div><div class="campaign-card-info" data-v-1657cc1c${_scopeId}><h3 class="campaign-card-name" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.product_name)}</h3><div class="campaign-card-price-row" data-v-1657cc1c${_scopeId}><span class="campaign-card-original" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.price)}৳</span><span class="campaign-card-discounted" data-v-1657cc1c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getCampaignDiscountedPrice(product, campaign.discount))}৳ </span></div></div><div class="campaign-card-btn-wrap" data-v-1657cc1c${_scopeId}>`);
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
						(0, vue_exports.unref)(on)(t.value.hero_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(HeroSlider_default, {
							key: 0,
							sliders: __props.sliders,
							"desktop-image": t.value.hero_image_desktop,
							"mobile-image": t.value.hero_image_mobile,
							"slideshow-enabled": (0, vue_exports.unref)(on)(t.value.hero_slideshow_enabled ?? "0"),
							"autoplay-enabled": (0, vue_exports.unref)(on)(t.value.hero_autoplay_enabled ?? "1"),
							"slide-seconds": t.value.hero_slide_seconds || "5",
							overlay: heroOverlay.value
						}, null, 8, [
							"sliders",
							"desktop-image",
							"mobile-image",
							"slideshow-enabled",
							"autoplay-enabled",
							"slide-seconds",
							"overlay"
						])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(productBlocks),
							openPreview
						}, null, 8, ["blocks"]),
						imageStrip.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 1,
							class: "chhondo-image-strip",
							"aria-label": "Chhondo collection"
						}, [(0, vue_exports.createVNode)("span", {
							class: "chhondo-watermark chhondo-watermark--right chhondo-watermark--strip",
							"aria-hidden": "true"
						}), (0, vue_exports.createVNode)("div", { class: "chhondo-image-strip__track" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(imageStrip.value, (item, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: item.id,
								href: item.href,
								class: ["chhondo-image-strip__item", { "is-tall": index % 2 === 1 }]
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: item.src,
									alt: item.alt,
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, [
									"src",
									"alt",
									"onError"
								])]),
								_: 2
							}, 1032, ["href", "class"]);
						}), 128)), ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(imageStrip.value, (item, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: `clone-${item.id}`,
								href: item.href,
								class: ["chhondo-image-strip__item chhondo-image-strip__item--clone", { "is-tall": index % 2 === 1 }],
								"aria-hidden": "true",
								tabindex: "-1"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: item.src,
									alt: "",
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, ["src", "onError"])]),
								_: 2
							}, 1032, ["href", "class"]);
						}), 128))])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(ctaBlocks),
							openPreview
						}, null, 8, ["blocks"]),
						(0, vue_exports.createVNode)(PageBlocks_default, {
							blocks: (0, vue_exports.unref)(videoBlocks),
							openPreview
						}, null, 8, ["blocks"]),
						storyDarkImages.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 2,
							class: "chhondo-story chhondo-story--dark"
						}, [(0, vue_exports.createVNode)("div", { class: "container chhondo-story__grid" }, [(0, vue_exports.createVNode)("div", { class: "chhondo-story__copy" }, [(0, vue_exports.createVNode)("div", { class: "chhondo-story__text" }, [(0, vue_exports.createVNode)("h2", { innerHTML: (0, vue_exports.unref)(rich)(t.value.story_dark_title) }, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.story_dark_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							innerHTML: (0, vue_exports.unref)(rich)(t.value.story_dark_text)
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.story_dark_button_show) && t.value.story_dark_button_label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
							key: 0,
							href: t.value.story_dark_button_url || "/shop",
							class: "chhondo-ghost-button"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.story_dark_button_label) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
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
						}, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "chhondo-story__media chhondo-story__media--pair" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(storyDarkImages.value, (item) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: item.id,
								href: item.href
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: item.src,
									alt: item.alt,
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, [
									"src",
									"alt",
									"onError"
								])]),
								_: 2
							}, 1032, ["href"]);
						}), 128))])])])) : (0, vue_exports.createCommentVNode)("", true),
						storyLightImages.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 3,
							class: "chhondo-story chhondo-story--light"
						}, [(0, vue_exports.createVNode)("span", {
							class: "chhondo-watermark chhondo-watermark--right",
							"aria-hidden": "true"
						}), (0, vue_exports.createVNode)("div", { class: "container chhondo-story__grid chhondo-story__grid--reverse" }, [(0, vue_exports.createVNode)("div", { class: "chhondo-story__media chhondo-story__media--layered" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(storyLightImages.value, (item, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: item.id,
								href: item.href,
								class: ["chhondo-story__frame", i === 0 ? "chhondo-story__frame--back" : "chhondo-story__frame--front"]
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: item.src,
									alt: item.alt,
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, [
									"src",
									"alt",
									"onError"
								])]),
								_: 2
							}, 1032, ["href", "class"]);
						}), 128))]), (0, vue_exports.createVNode)("div", { class: "chhondo-story__copy chhondo-story__copy--light" }, [(0, vue_exports.createVNode)("div", { class: "chhondo-story__text" }, [(0, vue_exports.createVNode)("h2", { innerHTML: (0, vue_exports.unref)(rich)(t.value.story_light_title) }, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.story_light_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							innerHTML: (0, vue_exports.unref)(rich)(t.value.story_light_text)
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)])])])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(on)(t.value.reviews_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(CustomerReviews_default, {
							key: 4,
							reviews: __props.reviews,
							title: t.value.reviews_title
						}, null, 8, ["reviews", "title"])) : (0, vue_exports.createCommentVNode)("", true),
						editorialCategories.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("section", {
							key: 5,
							class: "chhondo-editorial"
						}, [(0, vue_exports.createVNode)("span", {
							class: "chhondo-watermark chhondo-watermark--left",
							"aria-hidden": "true"
						}), (0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("div", { class: "chhondo-section-heading" }, [(0, vue_exports.createVNode)("h2", { innerHTML: (0, vue_exports.unref)(rich)(t.value.editorial_title) }, null, 8, ["innerHTML"]), (0, vue_exports.unref)(on)(t.value.editorial_text_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							innerHTML: (0, vue_exports.unref)(rich)(t.value.editorial_text, { breaks: "desktop" })
						}, null, 8, ["innerHTML"])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: ["chhondo-editorial__grid", `chhondo-editorial__grid--${editorialCategories.value.length}`] }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(editorialCategories.value, (category, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: category.id,
								href: category.href,
								class: ["chhondo-editorial__card", `chhondo-editorial__card--${index + 1}`]
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: category.image || "/placeholder.svg",
									alt: category.name,
									loading: "lazy",
									decoding: "async",
									onError: ($event) => $event.target.src = "/placeholder.svg"
								}, null, 40, [
									"src",
									"alt",
									"onError"
								]), (0, vue_exports.createVNode)("span", { class: "chhondo-editorial__bar" }, [(0, vue_exports.createVNode)("span", { class: "chhondo-editorial__copy" }, [(0, vue_exports.createVNode)("span", { class: "chhondo-editorial__name" }, (0, vue_exports.toDisplayString)(category.name), 1), category.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									class: "chhondo-editorial__sub"
								}, (0, vue_exports.toDisplayString)(category.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.editorial_explore_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									class: "chhondo-editorial__explore"
								}, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(t.value.editorial_explore) + " ", 1), ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									"stroke-width": "1.8",
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"aria-hidden": "true"
								}, [(0, vue_exports.createVNode)("path", { d: "M9 18l6-6-6-6" })]))])) : (0, vue_exports.createCommentVNode)("", true)])]),
								_: 2
							}, 1032, ["href", "class"]);
						}), 128))], 2)])])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)(PageBlocks_default, {
							blocks: otherBlocks.value,
							openPreview
						}, null, 8, ["blocks"]),
						(0, vue_exports.unref)(on)(t.value.campaign_show) && activeCampaigns.value.length > 0 ? ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 6 }, (0, vue_exports.renderList)(activeCampaigns.value, (campaign) => {
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
											src: product.featured_image || "/placeholder.svg",
											alt: product.product_name,
											class: "w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105",
											loading: "lazy",
											decoding: "async",
											width: "400",
											height: "500",
											onError: ($event) => $event.target.src = "/placeholder.svg"
										}, null, 40, [
											"src",
											"alt",
											"onError"
										]),
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
var Home_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-1657cc1c"]]);
//#endregion
export { Home_default as default };

//# sourceMappingURL=Home-BHAfKrCx.js.map