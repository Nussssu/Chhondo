import { c as server_renderer_exports, l as vue_exports, n as require_pinia_prod, o as usePage, r as head_default } from "../ssr.js";
import { a as useCartStore, t as AppLayout_default, u as useAuthStore } from "./AppLayout-BWP1wqVC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
import { i as shown, t as on } from "./cms-BWXg6J9T.js";
var useStoreInfo = (0, require_pinia_prod().defineStore)("storeInfo", () => {
	const page = usePage();
	const storeInfo = (0, vue_exports.computed)(() => page.props.storeInfo || null);
	const fetchStoreData = () => {};
	return {
		storeInfo,
		fetchStoreData
	};
});
//#endregion
//#region resources/js/components/Checkout/CheckoutForm.vue
var _sfc_main$1 = {
	__name: "CheckoutForm",
	__ssrInlineRender: true,
	setup(__props) {
		const storeInfo = useStoreInfo();
		(0, vue_exports.onMounted)(() => {
			storeInfo.fetchStoreData();
		});
		const siteInfo = (0, vue_exports.computed)(() => storeInfo.storeInfo);
		const appliedCoupon = (0, vue_exports.ref)(null);
		(0, vue_exports.watch)(() => siteInfo.value, (newValue) => {
			if (newValue) updateDeliveryCharge();
		});
		const cartStore = useCartStore();
		const authStore = useAuthStore();
		const cartItems = (0, vue_exports.computed)(() => cartStore.cartItems);
		const directOrderProduct = (0, vue_exports.ref)(null);
		(0, vue_exports.onMounted)(() => {
			if (typeof window !== "undefined") {
				const storedProductData = localStorage.getItem("directOrderProductData");
				if (storedProductData) directOrderProduct.value = JSON.parse(storedProductData);
			}
		});
		const isPreOrder = (0, vue_exports.computed)(() => {
			if (cartStore.is_direct_order) return directOrderProduct.value?.is_pre_order === true;
			return cartStore.hasPreOrderItems;
		});
		const subtotal = (0, vue_exports.computed)(() => {
			if (cartStore.is_direct_order) return directOrderProductSubtotal.value;
			else return cartItems.value.reduce((total, item) => {
				return total + parseFloat(item.individual_price) * item.quantity;
			}, 0);
		});
		const directOrderProductSubtotal = (0, vue_exports.computed)(() => {
			if (!directOrderProduct.value) return 0;
			return (parseFloat(directOrderProduct.value.price || 0) + directOrderProduct.value.selectedAttributes.reduce((total, attr) => total + parseFloat(attr.attribute_option_price || 0), 0)) * directOrderProduct.value.quantity;
		});
		const total = (0, vue_exports.computed)(() => subtotal.value + form.value.delivery_charge - (form.value.discount || 0));
		const formatPrice = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value) || 0);
		const onlinePaymentAvailable = (0, vue_exports.computed)(() => Boolean(usePage().props.onlinePaymentAvailable));
		const bkashPaymentAvailable = (0, vue_exports.computed)(() => Boolean(usePage().props.bkashPaymentAvailable));
		const paymentError = (0, vue_exports.computed)(() => usePage().props.errors?.payment || "");
		const isPlacingOrder = (0, vue_exports.ref)(false);
		const fieldErrors = (0, vue_exports.ref)({
			name: "",
			mobile: "",
			address: "",
			delivery_area: ""
		});
		const form = (0, vue_exports.ref)({
			email: "",
			name: "",
			mobile: "",
			address: "",
			note: "",
			order_status: "pending",
			order_type: "checkout",
			delivery: "cod",
			delivery_area: "inside",
			payment_type: "",
			delivery_charge: 0,
			discount: 0,
			create_account: false,
			password: ""
		});
		const phoneValid = (0, vue_exports.computed)(() => /^(?:\+?88)?01[3-9]\d{8}$/.test(form.value.mobile.replace(/[\s()-]/g, "")));
		const isLoggedIn = (0, vue_exports.computed)(() => !!authStore.user);
		/**
		* Whether the shop is giving this order free delivery.
		*
		* Mirrors SiteInfo::shipsFree(), which is what the server actually charges —
		* the quote and the charge have to be the same decision.
		*/
		const siteShipsFree = (0, vue_exports.computed)(() => {
			const info = siteInfo.value;
			if (!info || !info.free_shipping_enabled) return false;
			if (info.free_shipping_mode === "minimum") {
				const minimum = Number(info.free_shipping_min_amount) || 0;
				return minimum > 0 && subtotal.value >= minimum;
			}
			return true;
		});
		/**
		* Whether the delivery fee has actually been waived.
		*
		* Not the same as the charge being zero: before an area is picked it is zero
		* too, and calling that free would promise something the order cannot keep.
		*/
		const deliveryIsFree = (0, vue_exports.computed)(() => Boolean(form.value.delivery_area) && siteShipsFree.value);
		const updateDeliveryCharge = () => {
			if (siteShipsFree.value) form.value.delivery_charge = 0;
			else if (form.value.delivery_area === "inside") form.value.delivery_charge = parseFloat(siteInfo.value?.shipping_charge_inside_dhaka || 0);
			else if (form.value.delivery_area === "outside") form.value.delivery_charge = parseFloat(siteInfo.value?.shipping_charge_outside_dhaka || 0);
			else form.value.delivery_charge = 0;
			if (form.value.delivery_area && typeof window !== "undefined") {
				const shippingTier = form.value.delivery_area === "inside" ? "Inside Dhaka" : "Outside Dhaka";
				const items = buildCheckoutItems();
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({ ecommerce: null });
				window.dataLayer.push({
					event: "add_shipping_info",
					ecommerce: {
						currency: "BDT",
						value: subtotal.value,
						shipping_tier: shippingTier,
						items
					}
				});
			}
		};
		(0, vue_exports.watch)(siteShipsFree, () => updateDeliveryCharge());
		const prefill = (0, vue_exports.computed)(() => usePage().props.checkoutPrefill || null);
		function applyPrefill(data) {
			if (!data) return;
			if (!form.value.name) form.value.name = data.name || "";
			if (!form.value.email) form.value.email = data.email || "";
			if (!form.value.mobile && data.phone) form.value.mobile = data.phone;
			if (!form.value.address) form.value.address = data.address || "";
			if (!form.value.delivery_area && data.delivery_area) {
				form.value.delivery_area = data.delivery_area;
				updateDeliveryCharge();
			}
		}
		(0, vue_exports.watch)(prefill, applyPrefill, { immediate: true });
		(0, vue_exports.watch)(() => authStore.user, (newUser) => {
			if (newUser && !form.value.name) form.value.name = newUser.name;
		}, { immediate: true });
		(0, vue_exports.ref)(false);
		const couponCode = (0, vue_exports.ref)("");
		const couponFeedback = (0, vue_exports.ref)("");
		const couponFeedbackType = (0, vue_exports.ref)("error");
		(0, vue_exports.watch)(couponCode, () => {
			couponFeedback.value = "";
		});
		(0, vue_exports.watch)(() => usePage().props.errors?.coupon_code, (message) => {
			if (message) {
				couponFeedback.value = message;
				couponFeedbackType.value = "error";
			}
		});
		(0, vue_exports.computed)(() => {
			if (cartStore.is_direct_order) return [directOrderProduct.value.product_id];
			return cartItems.value.map((item) => item.product.id);
		});
		/** Savings already applied to the line prices, across the whole cart. */
		const productSaving = (0, vue_exports.computed)(() => {
			if (cartStore.is_direct_order) return 0;
			return Math.round(cartItems.value.reduce((total, item) => total + (Number(item.saving) || 0), 0));
		});
		const applyingCoupon = (0, vue_exports.ref)(false);
		const couponDiscount = () => {
			const coupon = appliedCoupon.value;
			if (!coupon) return 0;
			const amount = Number(coupon.discount_amount) || 0;
			const discount = coupon.discount_type === "percentage" ? subtotal.value * amount / 100 : amount;
			return Math.round(Math.min(discount, subtotal.value) * 100) / 100;
		};
		(0, vue_exports.watch)(subtotal, () => {
			if (appliedCoupon.value) form.value.discount = couponDiscount();
		});
		const validateFormBasic = () => {
			fieldErrors.value = {
				name: "",
				mobile: "",
				address: "",
				delivery_area: "",
				email: "",
				password: ""
			};
			let valid = true;
			if (!form.value.name) {
				fieldErrors.value.name = "নাম দিন";
				valid = false;
			}
			if (!form.value.mobile || !phoneValid.value) {
				fieldErrors.value.mobile = "সঠিক মোবাইল নম্বর দিন";
				valid = false;
			}
			if (!form.value.address) {
				fieldErrors.value.address = "ঠিকানা দিন";
				valid = false;
			}
			if (!isLoggedIn.value && form.value.create_account) {
				if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
					fieldErrors.value.email = "একটি সঠিক ইমেইল দিন";
					valid = false;
				}
				if (!form.value.password || form.value.password.length < 8) {
					fieldErrors.value.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
					valid = false;
				}
			}
			return valid;
		};
		(0, vue_exports.watch)(() => [form.value.mobile, phoneValid.value], ([, valid]) => {
			if (valid) createIncompleteOrder();
		});
		const createIncompleteOrder = async () => {
			if (!validateFormBasic()) return;
			if (cartStore.is_direct_order && typeof window !== "undefined") {
				const directOrderData = JSON.parse(localStorage.getItem("directOrderProductData"));
				if (directOrderData) {
					const individualPrice = parseFloat(directOrderData.price) || 0;
					const quantity = directOrderData.quantity || 1;
					directOrderData.product_id, individualPrice * quantity, directOrderData.selectedAttributes, directOrderData.has_blouse_option && directOrderData.blouse_choice;
				}
			} else {
				if (!cartStore.cartItems || cartStore.cartItems.length === 0) return;
				cartStore.cartItems.map((item) => {
					const individualPrice = parseFloat(item.individual_price);
					const quantity = item.quantity || 1;
					return {
						product_id: item.product_id || item.id,
						quantity,
						individual_price: individualPrice,
						total: individualPrice * quantity || 0,
						attributes: item.attributes || [],
						attributeOptionId: item.attributeOptionId || "",
						campaign_discount: item.campaign_discount || 0,
						coupon_discount: item.coupon_discount || 0,
						original_price: parseFloat(item.original_price || item.price || 0),
						blouse_choice: item.blouse_choice || null
					};
				});
			}
			let user_id = cartStore.user_id;
			if (typeof window !== "undefined") user_id = user_id || localStorage.getItem("guest_id");
			form.value.name, form.value.address, form.value.mobile, form.value.note, form.value.delivery, form.value.delivery_charge, cartStore.subtotal, form.value.discount, parseFloat(cartStore.total), cartStore.is_direct_order;
		};
		const buildCheckoutItems = () => {
			if (cartStore.is_direct_order && directOrderProduct.value) return [{
				item_name: directOrderProduct.value.product_name || "",
				item_id: directOrderProduct.value.product_id,
				price: directOrderProduct.value.price || 0,
				quantity: directOrderProduct.value.quantity,
				item_variant: directOrderProduct.value.selectedAttributes?.map((attr) => attr.attribute_option).join(", ") || ""
			}];
			return cartItems.value.map((item) => ({
				item_name: item.product.product_name || "",
				item_id: item.product.id,
				price: item.individual_price || 0,
				quantity: item.quantity,
				item_variant: item.attributes ? item.attributes.map((attr) => attr.attribute_option).join(", ") : ""
			}));
		};
		const pushBeginCheckoutEvent = () => {
			const items = buildCheckoutItems();
			const totalValue = items.reduce((sum, item) => {
				return sum + item.price * item.quantity;
			}, 0);
			if (typeof window !== "undefined") {
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({ ecommerce: null });
				window.dataLayer.push({
					event: "begin_checkout",
					ecommerce: {
						currency: "BDT",
						value: totalValue,
						items
					}
				});
			}
		};
		(0, vue_exports.onMounted)(() => {
			if (!window.checkoutEventFired) {
				pushBeginCheckoutEvent();
				window.checkoutEventFired = true;
			}
		});
		(0, vue_exports.onUnmounted)(() => {
			window.checkoutEventFired = false;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "checkout-shell" }, _attrs))} data-v-d9f33fc2><div class="container" data-v-d9f33fc2><div class="checkout-grid" data-v-d9f33fc2><div class="checkout-form-col" data-v-d9f33fc2><div class="checkout-card" data-v-d9f33fc2><h2 class="checkout-card-title" data-v-d9f33fc2>ডেলিভারির ঠিকানা</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-d9f33fc2><div data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>ই-মেইল</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.email)} type="email" placeholder="example@email.com" class="checkout-input checkout-placeholder--poppins" data-v-d9f33fc2>`);
			if (fieldErrors.value.email) _push(`<p class="text-red-500 text-xs mt-1" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.email)}</p>`);
			else _push(`<p class="checkout-hint" data-v-d9f33fc2> ক্যাশ মেমো পেতে আপনার ই-মেইল অ্যাড্রেসটি দিন। </p>`);
			_push(`</div><div data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>ফোন নম্বর</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.mobile)} type="tel" inputmode="tel" placeholder="01XXXXXXXXX" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input checkout-placeholder--poppins", fieldErrors.value.mobile ? "border-red-500" : ""])}" data-v-d9f33fc2>`);
			if (fieldErrors.value.mobile) _push(`<p class="text-red-500 text-xs mt-1" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.mobile)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="mt-5" data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>সম্পূর্ণ নাম</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.name)} type="text" placeholder="সম্পূর্ণ নাম" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input checkout-placeholder--poppins", fieldErrors.value.name ? "border-red-500" : ""])}" data-v-d9f33fc2>`);
			if (fieldErrors.value.name) _push(`<p class="text-red-500 text-xs mt-1" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.name)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="mt-5" data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>বিস্তারিত ঠিকানা</label><textarea rows="4" placeholder="বাড়ি/ফ্ল্যাট নম্বর, রাস্তা, এলাকা, শহর" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input checkout-textarea checkout-placeholder--bangla resize-none", fieldErrors.value.address ? "border-red-500" : ""])}" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(form.value.address)}</textarea>`);
			if (fieldErrors.value.address) _push(`<p class="text-red-500 text-xs mt-1" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.address)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="checkout-card" data-v-d9f33fc2><h2 class="checkout-card-title" data-v-d9f33fc2>ডেলিভারির ধরন</h2><div class="checkout-delivery-box" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/delivery-truck.svg")} alt="" class="checkout-delivery-icon" data-v-d9f33fc2><div data-v-d9f33fc2><p class="checkout-delivery-line" data-v-d9f33fc2> ঢাকার ভেতরে ডেলিভারি: ১-২ দিন </p><p class="checkout-delivery-line" data-v-d9f33fc2> ঢাকার বাইরে ডেলিভারি: ২-৩ দিন </p></div></div><div class="mt-5" data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>ডেলিভারি ইন্সট্রাকশন যোগ করুন</label><textarea rows="4" placeholder="পার্সেল রিসিভ করার ক্ষেত্রে কোনো বিশেষ নির্দেশনা থাকলে এখানে লিখুন..." class="checkout-input checkout-textarea checkout-placeholder--bangla resize-none" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(form.value.note)}</textarea></div></div><div class="checkout-card" data-v-d9f33fc2><h2 class="checkout-card-title checkout-card-title--payment" data-v-d9f33fc2>পেমেন্টের মাধ্যম</h2><div class="payment-options" data-v-d9f33fc2><label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "cod" }, "payment-option"])}" data-v-d9f33fc2><input type="radio" name="payment" value="cod"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "cod")) ? " checked" : ""} class="sr-only" data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "cod" }, "payment-radio"])}" data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "cod",
				"scale-0": form.value.payment_type !== "cod"
			}, "payment-radio-dot"])}" data-v-d9f33fc2></div></div><div class="payment-option-content" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/cash.svg")} alt="" class="payment-icon payment-icon--cash" data-v-d9f33fc2><span class="payment-name" data-v-d9f33fc2>ক্যাশ অন ডেলিভারি</span></div></label><label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "online" }, "payment-option"])}" data-v-d9f33fc2><input type="radio" name="payment" value="online"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "online")) ? " checked" : ""} class="sr-only"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(!onlinePaymentAvailable.value) ? " disabled" : ""} data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "online" }, "payment-radio"])}" data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "online",
				"scale-0": form.value.payment_type !== "online"
			}, "payment-radio-dot"])}" data-v-d9f33fc2></div></div><div class="payment-option-content" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/credit-card.svg")} alt="" class="payment-icon" data-v-d9f33fc2><span class="payment-name" data-v-d9f33fc2>ডেবিট / ক্রেডিট কার্ড</span></div></label><label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "bkash" }, "payment-option"])}" data-v-d9f33fc2><input type="radio" name="payment" value="bkash"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "bkash")) ? " checked" : ""} class="sr-only"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(!bkashPaymentAvailable.value) ? " disabled" : ""} data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "bkash" }, "payment-radio"])}" data-v-d9f33fc2><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "bkash",
				"scale-0": form.value.payment_type !== "bkash"
			}, "payment-radio-dot"])}" data-v-d9f33fc2></div></div><div class="payment-option-content" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/bkash.svg")} alt="" class="payment-icon payment-icon--bkash" data-v-d9f33fc2><span class="payment-name" data-v-d9f33fc2>বিকাশ</span></div></label></div>`);
			if (paymentError.value) _push(`<p class="payment-error" role="alert" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(paymentError.value)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="checkout-summary-col" data-v-d9f33fc2><div class="lg:sticky lg:top-25" data-v-d9f33fc2><div class="checkout-card checkout-card--summary" data-v-d9f33fc2><div class="checkout-summary-head" data-v-d9f33fc2><h2 class="checkout-card-title" data-v-d9f33fc2>আপনার কার্ট (${(0, server_renderer_exports.ssrInterpolate)(String((0, vue_exports.unref)(cartStore).is_direct_order ? directOrderProduct.value?.quantity || 0 : (0, vue_exports.unref)(cartStore).cartCount).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]))})</h2><button type="button" class="checkout-clear" data-v-d9f33fc2><span data-v-d9f33fc2>সব মুছুন</span><span class="checkout-clear-icon" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/clear.svg")} alt="" data-v-d9f33fc2></span></button></div>`);
			if (isPreOrder.value) _push(`<div class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r mb-5" data-v-d9f33fc2><span class="font-bold" data-v-d9f33fc2>প্রি-অর্ডার:</span> আপনার অর্ডারে এক বা একাধিক পণ্য বর্তমানে স্টকে নেই। </div>`);
			else _push(`<!---->`);
			_push(`<div class="checkout-order-list" data-v-d9f33fc2>`);
			if ((0, vue_exports.unref)(cartStore).is_direct_order && directOrderProduct.value) {
				_push(`<div class="order-item" data-v-d9f33fc2><div class="flex gap-4" data-v-d9f33fc2><div class="order-item-thumb" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", directOrderProduct.value?.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", directOrderProduct.value?.product_name)} class="w-full h-full object-cover" fetchpriority="low" loading="lazy" decoding="async" width="80" height="80" data-v-d9f33fc2></div><div class="flex-1 min-w-0" data-v-d9f33fc2><div class="flex items-start justify-between gap-2" data-v-d9f33fc2><h3 class="order-item-name" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.product_name)}</h3><button type="button" class="order-remove" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/trash.svg")} alt="" data-v-d9f33fc2></button></div><p class="order-item-price" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.price)} <span class="bangla-font" data-v-d9f33fc2>৳</span></p>`);
				if (directOrderProduct.value?.has_blouse_option && directOrderProduct.value?.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([directOrderProduct.value.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge"])}" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value.blouse_choice === "with" ? "ব্লাউজ পিস সহ" : "ব্লাউজ পিস ছাড়া")}</span>`);
				else _push(`<!---->`);
				_push(`<div class="checkout-qty" data-v-d9f33fc2><button class="qty-btn rounded-l-lg" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/minus.svg")} alt="" data-v-d9f33fc2></button><span class="qty-value" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.quantity)}</span><button class="qty-btn rounded-r-lg" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/plus.svg")} alt="" data-v-d9f33fc2></button></div></div></div></div>`);
			} else _push(`<!---->`);
			if (!(0, vue_exports.unref)(cartStore).is_direct_order) {
				_push(`<!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(cartItems.value, (item) => {
					_push(`<div class="order-item" data-v-d9f33fc2><div class="flex gap-4" data-v-d9f33fc2><div class="order-item-thumb" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product.product_name)} class="w-full h-full object-cover" fetchpriority="low" loading="lazy" decoding="async" width="80" height="80" data-v-d9f33fc2></div><div class="flex-1 min-w-0" data-v-d9f33fc2><div class="flex items-start justify-between gap-2" data-v-d9f33fc2><h3 class="order-item-name" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</h3><button type="button" class="order-remove" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/trash.svg")} alt="" data-v-d9f33fc2></button></div><p class="order-item-price" data-v-d9f33fc2>`);
					if (item.regular_individual_price) _push(`<span class="order-item-was" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(item.regular_individual_price)} <span class="bangla-font" data-v-d9f33fc2>৳</span></span>`);
					else _push(`<!---->`);
					_push(`<span data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(item.individual_price)} <span class="bangla-font" data-v-d9f33fc2>৳</span></span></p>`);
					if (item.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([item.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge"])}" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(item.blouse_choice === "with" ? "ব্লাউজ পিস সহ" : "ব্লাউজ পিস ছাড়া")}</span>`);
					else _push(`<!---->`);
					_push(`<div class="checkout-qty" data-v-d9f33fc2><button class="qty-btn rounded-l-lg" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/minus.svg")} alt="" data-v-d9f33fc2></button><span class="qty-value" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</span><button class="qty-btn rounded-r-lg" data-v-d9f33fc2><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/checkout/plus.svg")} alt="" data-v-d9f33fc2></button></div></div></div></div>`);
				});
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`</div><div class="checkout-coupon-section" data-v-d9f33fc2><label class="checkout-label" data-v-d9f33fc2>কুপন কোড</label>`);
			if (appliedCoupon.value) _push(`<div class="coupon-applied" data-v-d9f33fc2><span class="coupon-applied-code" data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(appliedCoupon.value.code)}</span><button type="button" class="coupon-remove" data-v-d9f33fc2>বাতিল</button></div>`);
			else _push(`<div class="checkout-coupon-row" data-v-d9f33fc2><input${(0, server_renderer_exports.ssrRenderAttr)("value", couponCode.value)} type="text" placeholder="কুপন কোড লিখুন" class="checkout-input checkout-coupon-input checkout-placeholder--bangla"${(0, server_renderer_exports.ssrRenderAttr)("aria-invalid", couponFeedback.value && couponFeedbackType.value === "error" ? "true" : void 0)} aria-describedby="checkout-coupon-feedback"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(applyingCoupon.value) ? " disabled" : ""} data-v-d9f33fc2><button type="button" class="coupon-submit-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(applyingCoupon.value) ? " disabled" : ""} data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(applyingCoupon.value ? "..." : "সাবমিট")}</button></div>`);
			if (couponFeedback.value) _push(`<p id="checkout-coupon-feedback" class="${(0, server_renderer_exports.ssrRenderClass)([`is-${couponFeedbackType.value}`, "coupon-feedback"])}"${(0, server_renderer_exports.ssrRenderAttr)("role", couponFeedbackType.value === "error" ? "alert" : "status")} data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(couponFeedback.value)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="checkout-totals" data-v-d9f33fc2><div class="checkout-total-row" data-v-d9f33fc2><span data-v-d9f33fc2>সাবটোটাল</span><span data-v-d9f33fc2>৳${(0, server_renderer_exports.ssrInterpolate)(formatPrice(subtotal.value))}</span></div>`);
			if (productSaving.value > 0) _push(`<div class="checkout-total-row text-green-600" data-v-d9f33fc2><span data-v-d9f33fc2>পণ্যে ছাড়</span><span data-v-d9f33fc2>-৳${(0, server_renderer_exports.ssrInterpolate)(formatPrice(productSaving.value))}</span></div>`);
			else _push(`<!---->`);
			if (form.value.discount > 0) _push(`<div class="checkout-total-row text-green-600" data-v-d9f33fc2><span data-v-d9f33fc2>ডিসকাউন্ট</span><span data-v-d9f33fc2>-৳${(0, server_renderer_exports.ssrInterpolate)(formatPrice(form.value.discount))}</span></div>`);
			else _push(`<!---->`);
			_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([deliveryIsFree.value ? "text-green-600" : "text-gray-600", "checkout-total-row"])}" data-v-d9f33fc2><span data-v-d9f33fc2>ডেলিভারি চার্জ</span>`);
			if (deliveryIsFree.value) _push(`<span class="font-semibold" data-v-d9f33fc2>ফ্রি ডেলিভারি</span>`);
			else _push(`<span data-v-d9f33fc2>৳${(0, server_renderer_exports.ssrInterpolate)(formatPrice(form.value.delivery_charge))}</span>`);
			_push(`</div></div><div class="checkout-final" data-v-d9f33fc2><div class="checkout-final-row" data-v-d9f33fc2><span class="checkout-total-label" data-v-d9f33fc2>মোট মূল্য</span><span class="checkout-total-label" data-v-d9f33fc2>৳${(0, server_renderer_exports.ssrInterpolate)(formatPrice(total.value))}</span></div><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isPlacingOrder.value) ? " disabled" : ""} class="${(0, server_renderer_exports.ssrRenderClass)([
				"checkout-order-btn",
				isPreOrder.value ? "bg-orange-500 hover:bg-orange-600" : "",
				isPlacingOrder.value ? "opacity-70 cursor-not-allowed" : ""
			])}" data-v-d9f33fc2>`);
			if (isPlacingOrder.value) _push(`<span class="flex items-center justify-center gap-2" data-v-d9f33fc2><svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-d9f33fc2><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-d9f33fc2></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-d9f33fc2></path></svg> অর্ডার প্রক্রিয়াধীন... </span>`);
			else _push(`<span data-v-d9f33fc2>${(0, server_renderer_exports.ssrInterpolate)(isPreOrder.value ? "প্রি-অর্ডার নিশ্চিত করুন" : "চেকআউট করুন")}</span>`);
			_push(`</button></div></div></div></div></div></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Checkout/CheckoutForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CheckoutForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-d9f33fc2"]]);
//#endregion
//#region resources/js/Pages/Public/Checkout/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	props: {
		texts: {
			type: Object,
			default: () => ({})
		},
		intro: {
			type: Object,
			default: () => ({})
		},
		blocks: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-e2781e0c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.tab_title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.tab_title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="checkout-breadcrumb-wrap" data-v-e2781e0c${_scopeId}><div class="container" data-v-e2781e0c${_scopeId}>`);
						if ((0, vue_exports.unref)(on)(__props.texts.breadcrumb_show)) {
							_push(`<nav class="checkout-breadcrumb" aria-label="Breadcrumb" data-v-e2781e0c${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(shown)(__props.texts.crumbs), (crumb, i) => {
								_push(`<!--[--><a${(0, server_renderer_exports.ssrRenderAttr)("href", crumb.url || "/shop")} class="checkout-breadcrumb-link" data-v-e2781e0c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(crumb.label)}</a><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/chhondo/chevron.svg")} alt="" data-v-e2781e0c${_scopeId}><!--]-->`);
							});
							_push(`<!--]--><span class="checkout-breadcrumb-current" data-v-e2781e0c${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.crumb_current)}</span></nav>`);
						} else _push(`<!---->`);
						_push(`</div></div><div class="checkout-page-wrap" data-v-e2781e0c${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(CheckoutForm_default, null, null, _parent, _scopeId));
						_push(`</div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("div", { class: "checkout-breadcrumb-wrap" }, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.unref)(on)(__props.texts.breadcrumb_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("nav", {
							key: 0,
							class: "checkout-breadcrumb",
							"aria-label": "Breadcrumb"
						}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(shown)(__props.texts.crumbs), (crumb, i) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: i }, [(0, vue_exports.createVNode)("a", {
								href: crumb.url || "/shop",
								class: "checkout-breadcrumb-link"
							}, (0, vue_exports.toDisplayString)(crumb.label), 9, ["href"]), (0, vue_exports.createVNode)("img", {
								src: "/assets/chhondo/chevron.svg",
								alt: ""
							})], 64);
						}), 128)), (0, vue_exports.createVNode)("span", { class: "checkout-breadcrumb-current" }, (0, vue_exports.toDisplayString)(__props.texts.crumb_current), 1)])) : (0, vue_exports.createCommentVNode)("", true)])]),
						(0, vue_exports.createVNode)("div", { class: "checkout-page-wrap" }, [(0, vue_exports.createVNode)(CheckoutForm_default)]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Checkout/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Index_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-e2781e0c"]]);
//#endregion
export { Index_default as default };

//# sourceMappingURL=Index-DBHmgH8W.js.map