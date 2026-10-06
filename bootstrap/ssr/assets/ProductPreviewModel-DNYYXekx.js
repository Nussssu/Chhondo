import { c as server_renderer_exports, i as link_default, l as vue_exports } from "../ssr.js";
import { c as isVariantOutOfStock, l as preOrderNote, o as isOutOfStock, s as isPreOrder } from "./AppLayout-ochFaCc-.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as rebrand } from "./rebrand-BSHbrJDv.js";
import { c as wasPriceFor, i as blousePriceFor, l as parseGalleryImages, n as videoThumbnailUrl, o as priceFor, s as priceForAmount, t as videoEmbedUrl } from "./videoEmbed-FtXyQomC.js";
//#region resources/js/components/Product/ProductPreviewModel.vue
var _sfc_main = {
	__name: "ProductPreviewModel",
	__ssrInlineRender: true,
	props: {
		isOpen: Boolean,
		product: Object
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const closeModal = () => {
			emit("close");
		};
		const quantity = (0, vue_exports.ref)(1);
		const basePrice = (0, vue_exports.ref)(0);
		const activeIndex = (0, vue_exports.ref)(0);
		(0, vue_exports.ref)("slide-left");
		const fullProduct = (0, vue_exports.ref)(null);
		(0, vue_exports.ref)(false);
		const fetchFullProduct = async (_slug) => {};
		const mergedProduct = (0, vue_exports.computed)(() => {
			if (fullProduct.value && fullProduct.value.id === props.product?.id) return {
				...props.product,
				...fullProduct.value
			};
			return props.product;
		});
		const productItems = (0, vue_exports.computed)(() => {
			if (!props.product) return [];
			const images = [props.product.featured_image || "/placeholder.svg", ...parseGalleryImages(props.product.gallery_images)].filter(Boolean).map((img) => ({
				type: "image",
				src: img
			}));
			if (props.product.video_link || props.product.video) images.unshift({
				type: "video",
				src: /^(https?:)?\/\//.test(props.product.video) ? props.product.video : "/" + String(props.product.video || "").replace(/^\/+/, ""),
				host: props.product.video_host,
				embedUrl: videoEmbedUrl(props.product.video_host, props.product.video_link),
				poster: videoThumbnailUrl(props.product.video_host, props.product.video_link)
			});
			return images;
		});
		const currentImage = (0, vue_exports.computed)(() => {
			const item = productItems.value[activeIndex.value];
			return item?.type === "image" ? item.src : "";
		});
		(0, vue_exports.computed)(() => productItems.value[0]?.type === "video");
		const isPreOrderProduct = (0, vue_exports.computed)(() => isPreOrder(mergedProduct.value ?? props.product));
		const isSoldOut = (0, vue_exports.computed)(() => isOutOfStock(mergedProduct.value ?? props.product));
		const preOrderTiming = (0, vue_exports.computed)(() => preOrderNote(mergedProduct.value ?? props.product));
		const hasBlouseOption = (0, vue_exports.computed)(() => {
			const p = mergedProduct.value;
			return !!p?.has_blouse_option && blousePriceFor(p) > 0;
		});
		const blouseChoice = (0, vue_exports.ref)("without");
		const blouseChoices = [{
			value: "without",
			label: "ব্লাউজ পিস ছাড়া"
		}, {
			value: "with",
			label: "ব্লাউজ পিস সহ"
		}];
		const blouseExtra = (0, vue_exports.computed)(() => {
			const p = mergedProduct.value;
			const withPrice = blousePriceFor(p);
			const base = parseFloat(p?.price);
			if (withPrice > 0 && !isNaN(base) && withPrice > base) return Math.round(withPrice - base);
			return null;
		});
		const currentBaseProductPrice = (0, vue_exports.computed)(() => {
			if (hasBlouseOption.value && blouseChoice.value === "with") return blousePriceFor(mergedProduct.value);
			return parseFloat(props.product?.price) || 0;
		});
		const firstLineDescription = (0, vue_exports.computed)(() => {
			const desc = mergedProduct.value?.short_description;
			if (!desc) return "";
			const tmp = document.createElement("div");
			tmp.innerHTML = desc;
			const firstLine = (tmp.textContent || tmp.innerText || "").trim().split(/[।\n]/)[0]?.trim();
			if (!firstLine) return "";
			return `<p>${firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine}</p>`;
		});
		const selectedAttributes = (0, vue_exports.ref)({});
		const selectedCombination = (0, vue_exports.ref)(null);
		const groupedAttributes = (0, vue_exports.computed)(() => {
			if (!props.product || !props.product.product_attributes) return {};
			const grouped = {};
			props.product.product_attributes.forEach((attr) => {
				if (!attr.attribute || !attr.attribute.name) return;
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
		const updateSelectedCombination = () => {
			const sortedAttributes = sortedAttributeNames.value.filter((attributeName) => selectedAttributes.value[attributeName]).map((attributeName) => {
				const optionId = selectedAttributes.value[attributeName];
				const attribute = groupedAttributes.value[attributeName].find((attr) => attr.attribute_option.id === optionId);
				return {
					attributeId: attribute.attribute_id,
					optionId,
					optionName: attribute.attribute_option.name
				};
			});
			const selectedCombinationString = JSON.stringify(sortedAttributes);
			selectedCombination.value = (props.product.product_attributes_combaine || []).find((combo) => combo.combination_string === selectedCombinationString);
			if (selectedCombination.value) {
				const combinationAttributes = props.product.product_attributes.filter((attr) => attr.combination_id === selectedCombination.value.id);
				if (combinationAttributes.length > 0) updateBasePrice(combinationAttributes[0].price || currentBaseProductPrice.value);
			} else updateBasePrice(currentBaseProductPrice.value);
		};
		const priceFlash = (0, vue_exports.ref)(false);
		let priceFlashTimer = null;
		let suppressBlouseFlash = false;
		(0, vue_exports.watch)(blouseChoice, () => {
			updateSelectedCombination();
			if (suppressBlouseFlash) {
				suppressBlouseFlash = false;
				return;
			}
			priceFlash.value = false;
			if (priceFlashTimer) clearTimeout(priceFlashTimer);
			requestAnimationFrame(() => {
				priceFlash.value = true;
				priceFlashTimer = setTimeout(() => {
					priceFlash.value = false;
				}, 700);
			});
		});
		const getSelectedAttributeIds = () => {
			if (selectedCombination.value) return props.product.product_attributes.filter((attr) => attr.combination_id === selectedCombination.value.id).map((attr) => attr.id);
			else return Object.entries(selectedAttributes.value).map(([attributeName, optionId]) => {
				const attribute = props.product.product_attributes.find((attr) => attr.attribute.name === attributeName && attr.attribute_option.id === optionId);
				return attribute ? attribute.id : null;
			}).filter((id) => id !== null);
		};
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
			const was = wasPriceFor(mergedProduct.value ?? props.product, withBlouse.value);
			return was ? Math.round(was) : null;
		});
		/**
		* Set the displayed price from the amount the current selection resolves to.
		*
		* The argument used to be ignored, so the modal showed the plain
		* without-blouse price however the options were set.
		*/
		const updateBasePrice = (amount = null) => {
			const product = mergedProduct.value ?? props.product;
			basePrice.value = amount === null ? priceFor(product, withBlouse.value) : priceForAmount(product, amount);
		};
		(0, vue_exports.watch)(() => props.isOpen, (open) => {
			if (typeof document !== "undefined") document.body.style.overflow = open ? "hidden" : "";
		});
		(0, vue_exports.watch)(() => props.product, (newProduct) => {
			if (newProduct && newProduct.price !== void 0) {
				updateBasePrice(newProduct.price);
				activeIndex.value = 0;
				quantity.value = 1;
				selectedAttributes.value = {};
				selectedCombination.value = null;
				if (blouseChoice.value !== "without") {
					suppressBlouseFlash = true;
					blouseChoice.value = "without";
				}
				if (!newProduct.short_description && newProduct.slug) fetchFullProduct(newProduct.slug);
				else fullProduct.value = null;
			}
		}, { immediate: true });
		const scrollArea = (0, vue_exports.ref)(null);
		const showScrollbar = (0, vue_exports.ref)(false);
		const thumbHeight = (0, vue_exports.ref)(0);
		const thumbTop = (0, vue_exports.ref)(0);
		const updateScrollbar = () => {
			const el = scrollArea.value;
			if (!el) return;
			const { scrollTop, scrollHeight, clientHeight } = el;
			if (scrollHeight - clientHeight < 8) {
				showScrollbar.value = false;
				return;
			}
			const trackHeight = clientHeight - 16;
			const height = Math.max(36, clientHeight / scrollHeight * trackHeight);
			const maxTop = trackHeight - height;
			const progress = scrollTop / (scrollHeight - clientHeight);
			showScrollbar.value = true;
			thumbHeight.value = height;
			thumbTop.value = Math.round(maxTop * progress);
		};
		(0, vue_exports.watch)(() => props.isOpen, (open) => {
			if (!open) {
				showScrollbar.value = false;
				return;
			}
			(0, vue_exports.nextTick)(() => {
				if (scrollArea.value) scrollArea.value.scrollTop = 0;
				updateScrollbar();
			});
		});
		(0, vue_exports.watch)([() => props.product, () => activeIndex.value], () => {
			(0, vue_exports.nextTick)(updateScrollbar);
		});
		(0, vue_exports.onMounted)(() => {
			if (props.product?.price !== void 0) updateBasePrice(props.product.price);
			if (typeof window !== "undefined") window.addEventListener("resize", updateScrollbar);
			(0, vue_exports.nextTick)(updateScrollbar);
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			if (typeof window !== "undefined") window.removeEventListener("resize", updateScrollbar);
		});
		/**
		* Whether the size/colour currently chosen has run out.
		*
		* A product can be in stock overall while one variant is not, so the buttons
		* follow the selection rather than just the product.
		*/
		const selectedVariantSoldOut = (0, vue_exports.computed)(() => {
			if (!allAttributesSelected.value) return false;
			const product = mergedProduct.value ?? props.product;
			const ids = getSelectedAttributeIds();
			return isVariantOutOfStock(product, (product?.product_attributes ?? []).filter((attr) => ids.includes(attr.id)));
		});
		/** The single question the buy buttons ask. */
		const cannotBuy = (0, vue_exports.computed)(() => isSoldOut.value || selectedVariantSoldOut.value);
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.isOpen) {
				_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "fixed inset-0 flex items-center justify-center z-50" }, _attrs))} data-v-d0eaf3d6><div class="preview-backdrop absolute inset-0" data-v-d0eaf3d6></div><div class="preview-modal relative bg-white rounded-lg shadow-2xl w-[88vw] max-w-[860px] overflow-hidden" data-v-d0eaf3d6><button class="preview-close" aria-label="Close preview" data-v-d0eaf3d6><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-d0eaf3d6><path d="M18 6L6 18" data-v-d0eaf3d6></path><path d="M6 6l12 12" data-v-d0eaf3d6></path></svg></button><div class="preview-scrollbar" aria-hidden="true" style="${(0, server_renderer_exports.ssrRenderStyle)(showScrollbar.value ? null : { display: "none" })}" data-v-d0eaf3d6><div class="preview-scrollbar-thumb" style="${(0, server_renderer_exports.ssrRenderStyle)({
					height: thumbHeight.value + "px",
					transform: `translateY(${thumbTop.value}px)`
				})}" data-v-d0eaf3d6></div></div><div class="preview-scroll flex flex-col md:flex-row md:items-start gap-4 md:gap-6 p-4 md:p-6" data-v-d0eaf3d6><div class="preview-image-area w-full md:w-[339px] shrink-0 flex flex-col items-center" data-v-d0eaf3d6><div class="preview-image-container relative rounded-lg overflow-hidden bg-[#f5f0eb] w-full md:w-[339px] h-[360px] md:h-[490px]" data-v-d0eaf3d6><div class="w-full h-full overflow-hidden relative" data-v-d0eaf3d6>`);
				if (productItems.value[activeIndex.value]?.type === "video") {
					_push(`<div class="absolute inset-0 bg-black overflow-hidden" data-v-d0eaf3d6>`);
					if (productItems.value[activeIndex.value].embedUrl) _push(`<div class="preview-embed-cover" data-v-d0eaf3d6><iframe${(0, server_renderer_exports.ssrRenderAttr)("src", productItems.value[activeIndex.value].embedUrl)} frameborder="0" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" tabindex="-1" aria-hidden="true" data-v-d0eaf3d6></iframe></div>`);
					else if (productItems.value[activeIndex.value].host === "Youtube" || productItems.value[activeIndex.value].host === "Gdrive") _push(`<div class="absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center" data-v-d0eaf3d6> This video link could not be read. </div>`);
					else _push(`<video autoplay muted loop playsinline preload="metadata" class="absolute inset-0 w-full h-full object-cover pointer-events-none" data-v-d0eaf3d6><source${(0, server_renderer_exports.ssrRenderAttr)("src", productItems.value[activeIndex.value].src)} type="video/mp4" data-v-d0eaf3d6> Your browser does not support the video tag. </video>`);
					_push(`</div>`);
				} else _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", currentImage.value || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", __props.product?.product_name)} class="w-full h-full object-cover absolute inset-0" data-v-d0eaf3d6>`);
				_push(`</div>`);
				if (productItems.value.length > 1) _push(`<div class="preview-img-counter" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(activeIndex.value + 1)} / ${(0, server_renderer_exports.ssrInterpolate)(productItems.value.length)}</div>`);
				else _push(`<!---->`);
				if (productItems.value.length > 1) _push(`<button type="button" aria-label="Previous image" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors" data-v-d0eaf3d6><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-d0eaf3d6><path d="M15 18l-6-6 6-6" data-v-d0eaf3d6></path></svg></button>`);
				else _push(`<!---->`);
				if (productItems.value.length > 1) _push(`<button type="button" aria-label="Next image" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors" data-v-d0eaf3d6><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-d0eaf3d6><path d="M9 18l6-6-6-6" data-v-d0eaf3d6></path></svg></button>`);
				else _push(`<!---->`);
				_push(`</div>`);
				if (productItems.value.length > 1) {
					_push(`<div class="flex items-center gap-2 mt-3" data-v-d0eaf3d6><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(productItems.value, (item, index) => {
						_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)(["h-2 rounded-full transition-all duration-300", index === activeIndex.value ? "bg-[#ddbc6d] w-6" : "bg-[#efe0bb] hover:bg-[#ddbc6d] w-2"])}" data-v-d0eaf3d6></button>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
				if (__props.product) {
					_push(`<div class="preview-info w-full md:flex-1 flex flex-col gap-6 md:max-h-[520px] md:overflow-y-auto md:pr-1" data-v-d0eaf3d6><div data-v-d0eaf3d6><h2 class="preview-product-name" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(__props.product.product_name)}</h2><div class="flex items-center gap-3 mt-2 flex-wrap" data-v-d0eaf3d6><span class="${(0, server_renderer_exports.ssrRenderClass)([{ "price-flash": priceFlash.value }, "preview-price"])}" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(displayPrice.value)} <span class="preview-price-sign" data-v-d0eaf3d6>৳</span></span>`);
					if (wasPrice.value) _push(`<span class="body-2-r text-gray-400 line-through" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(wasPrice.value)}<span class="bangla-font" data-v-d0eaf3d6>৳</span></span>`);
					else _push(`<!---->`);
					if (isPreOrderProduct.value) _push(`<span class="preview-stock preview-stock--preorder" data-v-d0eaf3d6> প্রি-অর্ডার </span>`);
					else if (isSoldOut.value) _push(`<span class="preview-stock preview-stock--soldout" data-v-d0eaf3d6> স্টকে নেই </span>`);
					else _push(`<span class="preview-stock" data-v-d0eaf3d6> স্টকে আছে </span>`);
					_push(`</div>`);
					if (mergedProduct.value?.short_description) _push(`<div class="preview-description mt-6" data-v-d0eaf3d6>${(0, vue_exports.unref)(rebrand)(firstLineDescription.value) ?? ""}</div>`);
					else _push(`<!---->`);
					_push(`</div>`);
					if (!cannotBuy.value) _push(`<div class="preview-qty-col" data-v-d0eaf3d6><label class="preview-option-label" data-v-d0eaf3d6>পরিমাণ:</label><div class="preview-qty-stepper mt-2" data-v-d0eaf3d6><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(quantity.value <= 1 || cannotBuy.value) ? " disabled" : ""} class="preview-qty-btn" aria-label="Decrease quantity" data-v-d0eaf3d6><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-d0eaf3d6><path d="M5 12h14" data-v-d0eaf3d6></path></svg></button><span class="preview-qty-value" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(quantity.value)}</span><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(cannotBuy.value) ? " disabled" : ""} class="preview-qty-btn" aria-label="Increase quantity" data-v-d0eaf3d6><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-d0eaf3d6><path d="M12 5v14" data-v-d0eaf3d6></path><path d="M5 12h14" data-v-d0eaf3d6></path></svg></button></div></div>`);
					else _push(`<!---->`);
					if (hasBlouseOption.value) {
						_push(`<div data-v-d0eaf3d6><label class="preview-option-label preview-option-label--blouse" data-v-d0eaf3d6>ব্লাউজ:</label><div class="preview-blouse-row mt-6" data-v-d0eaf3d6><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(blouseChoices, (opt) => {
							_push(`<label class="${(0, server_renderer_exports.ssrRenderClass)(["preview-pill", blouseChoice.value === opt.value ? "preview-pill--active" : ""])}" data-v-d0eaf3d6><input type="radio" name="preview_blouse_option"${(0, server_renderer_exports.ssrRenderAttr)("value", opt.value)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(blouseChoice.value, opt.value)) ? " checked" : ""} class="sr-only" data-v-d0eaf3d6><span data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(opt.label)}</span>`);
							if (opt.value === "with" && blouseExtra.value) _push(`<span class="preview-pill-extra" data-v-d0eaf3d6>(+ ${(0, server_renderer_exports.ssrInterpolate)(blouseExtra.value)}৳)</span>`);
							else _push(`<!---->`);
							if (blouseChoice.value === opt.value) _push(`<span class="preview-pill-check" data-v-d0eaf3d6><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-d0eaf3d6><polyline points="20 6 9 17 4 12" data-v-d0eaf3d6></polyline></svg></span>`);
							else _push(`<!---->`);
							_push(`</label>`);
						});
						_push(`<!--]--></div></div>`);
					} else _push(`<!---->`);
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(sortedAttributeNames.value, (attributeName) => {
						_push(`<div data-v-d0eaf3d6><label class="preview-option-label" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(attributeName)}:</label><div class="flex flex-wrap gap-4 mt-2" data-v-d0eaf3d6><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(groupedAttributes.value[attributeName], (option) => {
							_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)(["preview-pill", selectedAttributes.value[attributeName] === option.attribute_option.id ? "preview-pill--active" : ""])}" data-v-d0eaf3d6><span data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(option.attribute_option.name)}</span>`);
							if (selectedAttributes.value[attributeName] === option.attribute_option.id) _push(`<span class="preview-pill-check" data-v-d0eaf3d6><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-d0eaf3d6><polyline points="20 6 9 17 4 12" data-v-d0eaf3d6></polyline></svg></span>`);
							else _push(`<!---->`);
							_push(`</button>`);
						});
						_push(`<!--]--></div></div>`);
					});
					_push(`<!--]-->`);
					if (isPreOrderProduct.value) {
						_push(`<div class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-2.5 rounded-lg body-1-r" data-v-d0eaf3d6> এই পণ্যটি প্রি-অর্ডারের জন্য উন্মুক্ত। অর্ডার করলে স্টক আসার সাথে সাথে পাঠানো হবে। `);
						if (preOrderTiming.value) _push(`<span class="block mt-1 font-medium" data-v-d0eaf3d6>${(0, server_renderer_exports.ssrInterpolate)(preOrderTiming.value)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else if (isSoldOut.value) _push(`<div class="pv-soldout-note body-1-r" role="status" data-v-d0eaf3d6> এই পণ্যটি বর্তমানে স্টকে নেই। </div>`);
					else if (selectedVariantSoldOut.value) _push(`<div class="pv-soldout-note body-1-r" role="status" data-v-d0eaf3d6> নির্বাচিত অপশনটি বর্তমানে স্টকে নেই। অন্য একটি বেছে নিন। </div>`);
					else _push(`<!---->`);
					_push(`<div class="preview-buy-row" data-v-d0eaf3d6><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(!allAttributesSelected.value || cannotBuy.value) ? " disabled" : ""}${(0, server_renderer_exports.ssrRenderAttr)("aria-disabled", cannotBuy.value)} class="${(0, server_renderer_exports.ssrRenderClass)([
						"preview-add-to-cart",
						cannotBuy.value ? "is-soldout" : "",
						isPreOrderProduct.value && !cannotBuy.value ? "is-preorder" : "",
						!allAttributesSelected.value && !cannotBuy.value ? "opacity-50 cursor-not-allowed" : ""
					])}" data-v-d0eaf3d6>`);
					if (isSoldOut.value) _push(`<!--[-->স্টকে নেই<!--]-->`);
					else if (selectedVariantSoldOut.value) _push(`<!--[-->এই অপশনটি স্টকে নেই<!--]-->`);
					else {
						_push(`<!--[-->`);
						if (!isPreOrderProduct.value) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/cart-light.svg")} alt="" width="24" height="24" data-v-d0eaf3d6>`);
						else _push(`<!---->`);
						_push(` ${(0, server_renderer_exports.ssrInterpolate)(isPreOrderProduct.value ? "প্রি-অর্ডার করুন" : "কার্টে যুক্ত করুন")}<!--]-->`);
					}
					_push(`</button>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
						href: `/product/${__props.product.slug}`,
						class: "preview-view-details",
						onClick: closeModal
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(` বিস্তারিত দেখুন `);
							else return [(0, vue_exports.createTextVNode)(" বিস্তারিত দেখুন ")];
						}),
						_: 1
					}, _parent));
					_push(`</div></div>`);
				} else _push(`<div class="w-full md:flex-1 p-8 flex items-center justify-center" data-v-d0eaf3d6><p class="text-gray-400" data-v-d0eaf3d6>Loading...</p></div>`);
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductPreviewModel.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ProductPreviewModel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-d0eaf3d6"]]);
//#endregion
export { ProductPreviewModel_default as t };

//# sourceMappingURL=ProductPreviewModel-DNYYXekx.js.map