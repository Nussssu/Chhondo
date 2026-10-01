import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { a as useCartStore, f as _sfc_main$1, o as isOutOfStock, r as useWishlistStore, s as isPreOrder } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/utils/galleryImages.js
function parseGalleryImages(value) {
	if (!value) return [];
	if (Array.isArray(value)) return value.filter(Boolean);
	if (typeof value !== "string") return [];
	try {
		const parsed = JSON.parse(value);
		if (typeof parsed === "string") return parseGalleryImages(parsed);
		return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
	} catch {
		return [];
	}
}
//#endregion
//#region resources/js/utils/productPrice.js
/**
* The price a customer actually pays for a product.
*
* Mirrors the server: Product::getDiscountedPriceAttribute() applies the best
* coupon attached to that product, and the cart charges the same figure. A
* campaign discount is applied on top of the same base, and the customer gets
* whichever single reduction is larger — never both.
*
* Everything reads this so a price shown on a card, a product page and the cart
* cannot disagree.
*/
function campaignDiscountFor(product) {
	const data = product?.product_campaign ?? (product?.pivot ? {
		...product.pivot,
		campaign: product.campaign ?? null
	} : null);
	if (!data) return 0;
	const raw = data.discount ?? data.campaign?.discount ?? null;
	if (!raw) return 0;
	const base = Number(product?.price) || 0;
	if (typeof raw === "string" && raw.includes("%")) return base * parseFloat(raw.replace("%", "")) / 100;
	return Number.isNaN(Number(raw)) ? 0 : Number(raw);
}
/** Discount in currency, from whichever source gives the most off. */
function discountFor(product) {
	const coupon = Number(product?.discount_amount) || 0;
	const campaign = campaignDiscountFor(product);
	const base = Number(product?.price) || 0;
	return Math.min(Math.max(coupon, campaign), base);
}
/**
* The list price pair for the blouse choice in play.
*
* A saree with the blouse option carries two pairs, not one price and a spare:
* without-blouse is (previous_price, price) and with-blouse is
* (previous_price_with_blouse, price_with_blouse). Reading them through here is
* what keeps the figure shown and the figure struck through describing the same
* variant.
*/
function listPricesFor(product, withBlouse = false) {
	if (withBlouse) {
		const sale = Number(product?.price_with_blouse) || 0;
		const regular = Number(product?.previous_price_with_blouse) || 0;
		return sale > 0 ? {
			price: sale,
			previous: regular
		} : {
			price: regular,
			previous: 0
		};
	}
	return {
		price: Number(product?.price) || 0,
		previous: Number(product?.previous_price) || 0
	};
}
/**
* What the with-blouse option costs, or 0 when it carries no price at all.
*
* Mirrors Product::getBlousePriceAttribute(), which is what the cart charges.
*/
function blousePriceFor(product) {
	return listPricesFor(product, true).price;
}
/**
* What the customer pays for a given base amount.
*
* `amount` is whatever the current selection resolves to — the with- or
* without-blouse price, plus any attribute option prices on top. The coupon or
* campaign reduction comes off that, so the figure on screen is the one the
* cart will charge.
*/
function priceForAmount(product, amount) {
	const base = Number(amount) || 0;
	return Math.max(0, Math.round((base - discountFor(product)) * 100) / 100);
}
/** What the customer pays for the product as listed. */
function priceFor(product, withBlouse = false) {
	return priceForAmount(product, listPricesFor(product, withBlouse).price);
}
/** The struck-through price, or null when there is nothing to strike. */
function wasPriceFor(product, withBlouse = false) {
	const { price: base, previous } = listPricesFor(product, withBlouse);
	if (discountFor(product) > 0) return base || null;
	return previous > base ? previous : null;
}
//#endregion
//#region resources/js/components/Product/CollectionCard.vue
var _sfc_main = {
	__name: "CollectionCard",
	__ssrInlineRender: true,
	props: {
		product: {
			type: Object,
			required: true
		},
		openPreview: {
			type: Function,
			default: null
		},
		/**
		* Set on the few cards that start above the fold so their image is fetched
		* eagerly at high priority. One of them is usually the largest element
		* painted, and lazy-loading it delays the moment the page looks ready.
		*/
		priority: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		useCartStore();
		const wishlistStore = useWishlistStore();
		const props = __props;
		const getRegularPrice = (product) => wasPriceFor(product);
		const getCampaignDiscountedPrice = (product) => priceFor(product);
		const galleryImage = (0, vue_exports.computed)(() => {
			return parseGalleryImages(props.product.gallery_images)[0] ?? null;
		});
		/**
		* The hover image is only ever seen on a pointer device, so it is not put in
		* the DOM until the pointer arrives. Rendering it up front made every listing
		* fetch two images per product, and on a phone — where nothing hovers — the
		* whole second set was downloaded and never shown.
		*/
		const hoverLoaded = (0, vue_exports.ref)(false);
		const addingToCart = (0, vue_exports.ref)(false);
		const soldOut = (0, vue_exports.computed)(() => isOutOfStock(props.product));
		const preOrder = (0, vue_exports.computed)(() => isPreOrder(props.product));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "collection-card" }, _attrs))} data-v-12a46898><div class="collection-image-wrapper group/img" data-v-12a46898>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
				src: __props.product.featured_image,
				alt: __props.product.product_name,
				width: 3,
				height: 4,
				sizes: "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
				loading: __props.priority ? "eager" : "lazy",
				fetchpriority: __props.priority ? "high" : "auto",
				"img-class": "w-full h-full object-cover"
			}, null, _parent));
			if (hoverLoaded.value && galleryImage.value) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
				src: galleryImage.value,
				alt: __props.product.product_name,
				width: 3,
				height: 4,
				sizes: "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
				loading: "eager",
				"img-class": "w-full h-full object-cover absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<button type="button"${(0, server_renderer_exports.ssrRenderAttr)("aria-pressed", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product))}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) ? "Remove from wishlist" : "Add to wishlist")} class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-active": (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) }, "wishlist-btn"])}" data-v-12a46898><svg width="20" height="20" viewBox="0 0 24 24"${(0, server_renderer_exports.ssrRenderAttr)("fill", (0, vue_exports.unref)(wishlistStore).isWishlisted(__props.product) ? "currentColor" : "none")} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-12a46898></path></svg></button>`);
			if (__props.openPreview) _push(`<button class="quick-preview-btn hidden md:flex" data-v-12a46898> Quick Preview <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-12a46898><path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898></path><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898></path></svg></button>`);
			else _push(`<!---->`);
			if (__props.openPreview) _push(`<button class="mobile-eye-btn md:hidden" data-v-12a46898><svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-12a46898><path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898></path><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898></path></svg></button>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(isPreOrder)(__props.product)) _push(`<div class="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10" data-v-12a46898> Pre Order </div>`);
			else if ((0, vue_exports.unref)(isOutOfStock)(__props.product)) _push(`<div class="absolute top-3 left-3 soldout-badge text-xs font-bold px-2.5 py-1 rounded-lg z-10" data-v-12a46898> Out of Stock </div>`);
			else _push(`<!---->`);
			_push(`</div><div class="collection-info" data-v-12a46898><h3 class="collection-product-name" data-v-12a46898>${(0, server_renderer_exports.ssrInterpolate)(__props.product.product_name)}</h3><p class="collection-price" data-v-12a46898>`);
			if (getRegularPrice(__props.product)) _push(`<span class="line-through text-gray-400 mr-1 text-sm" data-v-12a46898>${(0, server_renderer_exports.ssrInterpolate)(getRegularPrice(__props.product))}৳</span>`);
			else _push(`<!---->`);
			_push(` ${(0, server_renderer_exports.ssrInterpolate)(getCampaignDiscountedPrice(__props.product))} <span class="bangla-font" data-v-12a46898>৳</span></p></div><div class="collection-btn-wrap" data-v-12a46898><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(addingToCart.value || soldOut.value) ? " disabled" : ""}${(0, server_renderer_exports.ssrRenderAttr)("aria-disabled", soldOut.value)} class="${(0, server_renderer_exports.ssrRenderClass)([{
				"is-soldout": soldOut.value,
				"is-preorder": preOrder.value
			}, "collection-buy-btn"])}" data-v-12a46898>`);
			if (soldOut.value) _push(`<!--[-->Out of Stock<!--]-->`);
			else _push(`<!--[-->${(0, server_renderer_exports.ssrInterpolate)(addingToCart.value ? "Adding..." : preOrder.value ? "Pre-Order" : "Add to cart")} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-12a46898><polyline points="9 18 15 12 9 6" data-v-12a46898></polyline></svg><!--]-->`);
			_push(`</button></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/CollectionCard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CollectionCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-12a46898"]]);
//#endregion
//#region resources/js/utils/videoEmbed.js
/**
* Turn whatever an admin pasted into something the storefront can render.
*
* The video field used to be dumped straight into the page with v-html, so a
* plain YouTube link showed nothing at all and only a full <iframe> embed code
* worked — and that carried its own width/height, so it never fitted the
* gallery frame. Every accepted form now resolves to a plain embed URL that the
* gallery sizes itself.
*/
/** Pull the src out of a pasted <iframe …> so embed codes still work. */
function iframeSrc(input) {
	const match = String(input).match(/<iframe[^>]+src=["']([^"']+)["']/i);
	return match ? match[1] : null;
}
/**
* Accepts: watch?v=, youtu.be/, /embed/, /shorts/, an iframe embed code, or a
* bare 11-character id.
*/
function youtubeId(input) {
	if (!input) return null;
	const value = iframeSrc(input) ?? String(input).trim();
	for (const pattern of [
		/(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
		/(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
		/(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
		/(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
		/(?:youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/
	]) {
		const match = value.match(pattern);
		if (match) return match[1];
	}
	return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : null;
}
/** Accepts: /file/d/{id}/…, open?id=, an iframe embed code, or a bare id. */
function driveId(input) {
	if (!input) return null;
	const value = iframeSrc(input) ?? String(input).trim();
	for (const pattern of [
		/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/,
		/drive\.google\.com\/open\?id=([A-Za-z0-9_-]+)/,
		/[?&]id=([A-Za-z0-9_-]+)/
	]) {
		const match = value.match(pattern);
		if (match) return match[1];
	}
	return /^[A-Za-z0-9_-]{10,}$/.test(value) ? value : null;
}
/**
* The URL to put in an iframe.
*
* @param {string} host  'Youtube' | 'Gdrive'
* @param {string} link  whatever the admin pasted
* @param {{autoplay?: boolean}} options
*/
function videoEmbedUrl(host, link, { autoplay = true } = {}) {
	if (host === "Youtube") {
		const id = youtubeId(link);
		if (!id) return null;
		const params = new URLSearchParams({
			rel: "0",
			modestbranding: "1",
			playsinline: "1",
			controls: "0",
			disablekb: "1",
			iv_load_policy: "3"
		});
		if (autoplay) {
			params.set("autoplay", "1");
			params.set("mute", "1");
			params.set("loop", "1");
			params.set("playlist", id);
		}
		return `https://www.youtube.com/embed/${id}?${params.toString()}`;
	}
	if (host === "Gdrive") {
		const id = driveId(link);
		return id ? `https://drive.google.com/file/d/${id}/preview` : null;
	}
	return null;
}
/** A still to show in the gallery's thumbnail strip. */
function videoThumbnailUrl(host, link) {
	if (host === "Youtube") {
		const id = youtubeId(link);
		return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
	}
	if (host === "Gdrive") {
		const id = driveId(link);
		return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w320` : null;
	}
	return null;
}
//#endregion
export { discountFor as a, wasPriceFor as c, blousePriceFor as i, parseGalleryImages as l, videoThumbnailUrl as n, priceFor as o, CollectionCard_default as r, priceForAmount as s, videoEmbedUrl as t };

//# sourceMappingURL=videoEmbed-CEkxInuf.js.map