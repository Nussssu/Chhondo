import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default } from "../ssr.js";
import { a as useCartStore, n as useStoreInfo, t as _sfc_main$2, u as useAuthStore } from "./AppLayout-D5uzRHsl.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PhoneField_default } from "./PhoneField-CMb3f90k.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region resources/js/components/Checkout/CheckoutForm.vue
var bkashLogo = "/assets/images/payment/bkash-pay.png";
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
		const phoneValid = (0, vue_exports.ref)(false);
		const form = (0, vue_exports.ref)({
			email: "",
			name: "",
			mobile: "",
			address: "",
			note: "",
			order_status: "pending",
			order_type: "checkout",
			delivery: "cod",
			delivery_area: "",
			payment_type: "cod",
			delivery_charge: 0,
			discount: 0,
			create_account: true,
			password: ""
		});
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
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "py-8 md:py-12" }, _attrs))} data-v-c53773de><div class="container max-w-6xl mx-auto" data-v-c53773de><div class="grid grid-cols-1 lg:grid-cols-12 gap-8" data-v-c53773de><div class="lg:col-span-8" data-v-c53773de><div class="checkout-card" data-v-c53773de><h2 class="checkout-card-title" data-v-c53773de>ডেলিভারি ঠিকানা</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-5" data-v-c53773de><div data-v-c53773de><label class="checkout-label" data-v-c53773de>ইমেইল</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.email)} type="email" placeholder="example@email.com" class="checkout-input" data-v-c53773de>`);
			if (fieldErrors.value.email) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.email)}</p>`);
			else _push(`<p class="checkout-hint" data-v-c53773de> আপনার ক্যাশ মেমো পেতে অনুগ্রহ করে ইমেইল দিন। </p>`);
			_push(`</div><div data-v-c53773de><label class="checkout-label" data-v-c53773de>ফোন নম্বর <span class="text-red-500" data-v-c53773de>*</span></label>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(PhoneField_default, {
				modelValue: form.value.mobile,
				"onUpdate:modelValue": ($event) => form.value.mobile = $event,
				valid: phoneValid.value,
				"onUpdate:valid": ($event) => phoneValid.value = $event,
				invalid: !!fieldErrors.value.mobile
			}, null, _parent));
			if (fieldErrors.value.mobile) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.mobile)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
			if (!isLoggedIn.value) {
				_push(`<div class="mt-5" data-v-c53773de><label class="flex items-center gap-2 cursor-pointer select-none" data-v-c53773de><input type="checkbox"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(form.value.create_account) ? (0, server_renderer_exports.ssrLooseContain)(form.value.create_account, null) : form.value.create_account) ? " checked" : ""} class="h-4 w-4" data-v-c53773de><span class="checkout-label mb-0" data-v-c53773de>অ্যাকাউন্ট তৈরি করুন</span></label><p class="checkout-hint" data-v-c53773de>আপনার ইমেইলই হবে ইউজারনেম। পরবর্তীতে দ্রুত চেকআউটের জন্য একটি পাসওয়ার্ড দিন। টিক না দিলে অতিথি হিসেবে অর্ডার সম্পন্ন হবে, কোনো অ্যাকাউন্ট তৈরি হবে না।</p>`);
				if (form.value.create_account) {
					_push(`<div class="mt-3" data-v-c53773de><label class="checkout-label" data-v-c53773de>পাসওয়ার্ড <span class="text-red-500" data-v-c53773de>*</span></label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.password)} type="password" placeholder="কমপক্ষে ৮ অক্ষর" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input", fieldErrors.value.password ? "border-red-500" : ""])}" data-v-c53773de>`);
					if (fieldErrors.value.password) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.password)}</p>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`<div class="mt-5" data-v-c53773de><label class="checkout-label" data-v-c53773de>আপনার নাম <span class="text-red-500" data-v-c53773de>*</span></label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.name)} type="text" placeholder="আপনার সম্পূর্ণ নাম" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input", fieldErrors.value.name ? "border-red-500" : ""])}" data-v-c53773de>`);
			if (fieldErrors.value.name) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.name)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="mt-5" data-v-c53773de><label class="checkout-label" data-v-c53773de>সম্পূর্ণ ঠিকানা <span class="text-red-500" data-v-c53773de>*</span></label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.address)} type="text" placeholder="বাসা/ফ্ল্যাটি নাম্বর, রোড নাম্বর, এলাকা, শহর" class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input", fieldErrors.value.address ? "border-red-500" : ""])}" data-v-c53773de>`);
			if (fieldErrors.value.address) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.address)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="checkout-card" data-v-c53773de><h2 class="checkout-card-title" data-v-c53773de>ডেলিভারি পদ্ধতি</h2><div class="flex items-start gap-4 bg-[#FFF8F0] border border-[#f0e6d8] rounded-xl p-5" data-v-c53773de><div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" data-v-c53773de><svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" data-v-c53773de><path d="M3.85645 21.2945L4.53368 18.5855H11.9832L11.306 21.2945H3.85645ZM12.6605 30.3355C11.5318 30.3355 10.5723 29.9405 9.78223 29.1504C8.99213 28.3603 8.59707 27.4008 8.59707 26.2721H5.21091L5.88814 23.3262H12.8975L14.1165 18.3824H16.9609L18.654 11.61H9.27431L9.47748 10.7973C9.61292 10.1653 9.92355 9.65192 10.4093 9.25732C10.8952 8.86272 11.4649 8.66497 12.1187 8.66406H27.5596L26.3067 14.0819H30.2685L34.3319 19.4998L32.9775 26.2721H30.2685C30.2685 27.4008 29.8735 28.3603 29.0834 29.1504C28.2933 29.9405 27.3338 30.3355 26.2051 30.3355C25.0764 30.3355 24.117 29.9405 23.3269 29.1504C22.5368 28.3603 22.1417 27.4008 22.1417 26.2721H16.7239C16.7239 27.4008 16.3288 28.3603 15.5387 29.1504C14.7486 29.9405 13.7892 30.3355 12.6605 30.3355ZM6.56538 16.3507L7.24261 13.6417H16.0466L15.3694 16.3507H6.56538ZM12.6605 27.6266C13.0442 27.6266 13.3661 27.4966 13.6262 27.2365C13.8863 26.9764 14.0158 26.655 14.0149 26.2721C14.014 25.8893 13.884 25.5678 13.6249 25.3077C13.3657 25.0477 13.0442 24.9177 12.6605 24.9177C12.2767 24.9177 11.9552 25.0477 11.6961 25.3077C11.4369 25.5678 11.3069 25.8893 11.306 26.2721C11.3051 26.655 11.4351 26.9769 11.6961 27.2378C11.9571 27.4988 12.2785 27.6284 12.6605 27.6266ZM26.2051 27.6266C26.5889 27.6266 26.9108 27.4966 27.1709 27.2365C27.4309 26.9764 27.5605 26.655 27.5596 26.2721C27.5587 25.8893 27.4287 25.5678 27.1695 25.3077C26.9104 25.0477 26.5889 24.9177 26.2051 24.9177C25.8214 24.9177 25.4999 25.0477 25.2407 25.3077C24.9816 25.5678 24.8516 25.8893 24.8507 26.2721C24.8498 26.655 24.9798 26.9769 25.2407 27.2378C25.5017 27.4988 25.8232 27.6284 26.2051 27.6266ZM24.7491 20.8543H31.2844L31.4198 20.1432L28.9141 16.7909H25.6972L24.7491 20.8543Z" fill="#D4A276" data-v-c53773de></path></svg></div><div data-v-c53773de><p class="body-1-sb text-gray-800" data-v-c53773de> ঢাকার ভেতরে ডেলিভারি: ২-৩ দিন </p><p class="body-1-r text-gray-500" data-v-c53773de> ঢাকার বাইরে ডেলিভারি: ৩-৪ দিন </p></div></div><div class="mt-5" data-v-c53773de><label class="checkout-label" data-v-c53773de>আপনার এরিয়া সিলেক্ট করুন <span class="text-red-500" data-v-c53773de>*</span></label><select class="${(0, server_renderer_exports.ssrRenderClass)(["checkout-input", fieldErrors.value.delivery_area ? "border-red-500" : ""])}" data-v-c53773de><option value="" selected disabled data-v-c53773de> আপনার এরিয়া সিলেক্ট করুন </option><option value="inside" data-v-c53773de${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(form.value.delivery_area) ? (0, server_renderer_exports.ssrLooseContain)(form.value.delivery_area, "inside") : (0, server_renderer_exports.ssrLooseEqual)(form.value.delivery_area, "inside")) ? " selected" : ""}>ঢাকার ভেতরে</option><option value="outside" data-v-c53773de${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(form.value.delivery_area) ? (0, server_renderer_exports.ssrLooseContain)(form.value.delivery_area, "outside") : (0, server_renderer_exports.ssrLooseEqual)(form.value.delivery_area, "outside")) ? " selected" : ""}>ঢাকার বাহিরে</option></select>`);
			if (fieldErrors.value.delivery_area) _push(`<p class="text-red-500 text-xs mt-1" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(fieldErrors.value.delivery_area)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="checkout-card" data-v-c53773de><h2 class="checkout-card-title" data-v-c53773de>ডেলিভারি নোট (অপশনাল)</h2><textarea rows="3" placeholder="বিশেষ কোনো ডেলিভারি নির্দেশনা থাকলে এখানে লিখুন..." class="checkout-input resize-none" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(form.value.note)}</textarea></div><div class="checkout-card" data-v-c53773de><h2 class="checkout-card-title" data-v-c53773de>পেমেন্ট মেথড</h2><div class="space-y-3" data-v-c53773de><label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "cod" }, "payment-option"])}" data-v-c53773de><input type="radio" name="payment" value="cod"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "cod")) ? " checked" : ""} class="sr-only" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "cod" }, "payment-radio"])}" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "cod",
				"scale-0": form.value.payment_type !== "cod"
			}, "payment-radio-dot"])}" data-v-c53773de></div></div><div class="flex items-center gap-3" data-v-c53773de><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600" data-v-c53773de><rect x="1" y="4" width="22" height="16" rx="2" ry="2" data-v-c53773de></rect><line x1="1" y1="10" x2="23" y2="10" data-v-c53773de></line></svg><div data-v-c53773de><span class="body-1-sb text-gray-700" data-v-c53773de>ক্যাশ অন ডেলিভারি</span><span class="payment-note" data-v-c53773de>পণ্য হাতে পেয়ে টাকা দিন</span></div></div></label>`);
			if (onlinePaymentAvailable.value) _push(`<label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "online" }, "payment-option"])}" data-v-c53773de><input type="radio" name="payment" value="online"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "online")) ? " checked" : ""} class="sr-only" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "online" }, "payment-radio"])}" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "online",
				"scale-0": form.value.payment_type !== "online"
			}, "payment-radio-dot"])}" data-v-c53773de></div></div><div class="flex items-center gap-3" data-v-c53773de><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600" data-v-c53773de><rect x="2" y="5" width="20" height="14" rx="2" data-v-c53773de></rect><path d="M2 10h20" data-v-c53773de></path><path d="M6 15h4" data-v-c53773de></path></svg><div data-v-c53773de><span class="body-1-sb text-gray-700" data-v-c53773de>অনলাইনে পেমেন্ট করুন</span><span class="payment-note" data-v-c53773de>কার্ড, বিকাশ, নগদ বা ব্যাংক</span></div></div></label>`);
			else _push(`<!---->`);
			if (bkashPaymentAvailable.value) _push(`<label class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-option--active": form.value.payment_type === "bkash" }, "payment-option"])}" data-v-c53773de><input type="radio" name="payment" value="bkash"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(form.value.payment_type, "bkash")) ? " checked" : ""} class="sr-only" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "payment-radio--active": form.value.payment_type === "bkash" }, "payment-radio"])}" data-v-c53773de><div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"scale-100": form.value.payment_type === "bkash",
				"scale-0": form.value.payment_type !== "bkash"
			}, "payment-radio-dot"])}" data-v-c53773de></div></div><div class="flex items-center gap-3" data-v-c53773de><img${(0, server_renderer_exports.ssrRenderAttr)("src", bkashLogo)} alt="bKash" class="payment-logo" width="52" height="20" data-v-c53773de><div data-v-c53773de><span class="body-1-sb text-gray-700" data-v-c53773de>বিকাশ</span><span class="payment-note" data-v-c53773de>বিকাশ অ্যাকাউন্ট থেকে পেমেন্ট করুন</span></div></div></label>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (form.value.payment_type === "online") _push(`<p class="payment-hint" data-v-c53773de> অর্ডার নিশ্চিত করলে আপনি নিরাপদ পেমেন্ট পেজে যাবেন। </p>`);
			else _push(`<!---->`);
			if (form.value.payment_type === "bkash") _push(`<p class="payment-hint" data-v-c53773de> অর্ডার নিশ্চিত করলে আপনি বিকাশ পেমেন্ট পেজে যাবেন। </p>`);
			else _push(`<!---->`);
			if (paymentError.value) _push(`<p class="payment-error" role="alert" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(paymentError.value)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="lg:col-span-4" data-v-c53773de><div class="lg:sticky lg:top-25" data-v-c53773de><div class="checkout-card" data-v-c53773de><h2 class="checkout-card-title" data-v-c53773de>অর্ডার সামারি</h2>`);
			if (isPreOrder.value) _push(`<div class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded-xl body-1-r mb-5" data-v-c53773de><span class="font-bold" data-v-c53773de>প্রি-অর্ডার:</span> আপনার অর্ডারে এক বা একাধিক পণ্য বর্তমানে স্টকে নেই। </div>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(cartStore).is_direct_order && directOrderProduct.value) {
				_push(`<div class="order-item" data-v-c53773de><div class="flex gap-4" data-v-c53773de><div class="w-[70px] h-[85px] rounded-xl overflow-hidden bg-gray-100 shrink-0" data-v-c53773de><img${(0, server_renderer_exports.ssrRenderAttr)("src", directOrderProduct.value?.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", directOrderProduct.value?.product_name)} class="w-full h-full object-cover" fetchpriority="low" data-v-c53773de></div><div class="flex-1 min-w-0" data-v-c53773de><div class="flex items-start justify-between gap-2" data-v-c53773de><h3 class="body-1-sb text-gray-800 truncate" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.product_name)}</h3><button class="text-gray-400 hover:text-red-500 transition-colors shrink-0" data-v-c53773de><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c53773de><polyline points="3 6 5 6 21 6" data-v-c53773de></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-c53773de></path></svg></button></div><p class="body-1-r text-[#356019] mt-0.5" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.price)} <span class="bangla-font" data-v-c53773de>৳</span></p>`);
				if (directOrderProduct.value?.has_blouse_option && directOrderProduct.value?.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([directOrderProduct.value.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge"])}" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value.blouse_choice === "with" ? "With Blouse" : "Without Blouse")}</span>`);
				else _push(`<!---->`);
				_push(`<div class="flex items-center gap-0 mt-2" data-v-c53773de><button class="qty-btn rounded-l-lg" data-v-c53773de> — </button><span class="qty-value" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(directOrderProduct.value?.quantity)}</span><button class="qty-btn rounded-r-lg" data-v-c53773de> + </button></div></div></div></div>`);
			} else _push(`<!---->`);
			if (!(0, vue_exports.unref)(cartStore).is_direct_order) {
				_push(`<!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(cartItems.value, (item) => {
					_push(`<div class="order-item" data-v-c53773de><div class="flex gap-4" data-v-c53773de><div class="w-[70px] h-[85px] rounded-xl overflow-hidden bg-gray-100 shrink-0" data-v-c53773de><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product.product_name)} class="w-full h-full object-cover" fetchpriority="low" data-v-c53773de></div><div class="flex-1 min-w-0" data-v-c53773de><div class="flex items-start justify-between gap-2" data-v-c53773de><h3 class="body-1-sb text-gray-800 truncate" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)}</h3><button class="text-gray-400 hover:text-red-500 transition-colors shrink-0" data-v-c53773de><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c53773de><polyline points="3 6 5 6 21 6" data-v-c53773de></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-c53773de></path></svg></button></div><p class="body-1-r mt-0.5" data-v-c53773de>`);
					if (item.regular_individual_price) _push(`<span class="text-gray-400 line-through mr-1.5" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(item.regular_individual_price)} <span class="bangla-font" data-v-c53773de>৳</span></span>`);
					else _push(`<!---->`);
					_push(`<span class="text-[#356019]" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(item.individual_price)} <span class="bangla-font" data-v-c53773de>৳</span></span></p>`);
					if (item.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([item.blouse_choice === "with" ? "blouse-badge--with" : "blouse-badge--without", "blouse-badge"])}" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(item.blouse_choice === "with" ? "With Blouse" : "Without Blouse")}</span>`);
					else _push(`<!---->`);
					_push(`<div class="flex items-center gap-0 mt-2" data-v-c53773de><button class="qty-btn rounded-l-lg" data-v-c53773de> — </button><span class="qty-value" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</span><button class="qty-btn rounded-r-lg" data-v-c53773de> + </button></div></div></div></div>`);
				});
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`<div class="mt-6" data-v-c53773de><label class="checkout-label" data-v-c53773de>কুপন কোড</label>`);
			if (appliedCoupon.value) _push(`<div class="coupon-applied" data-v-c53773de><span class="coupon-applied-code" data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(appliedCoupon.value.code)}</span><span class="coupon-applied-note" data-v-c53773de>প্রয়োগ করা হয়েছে</span><button type="button" class="coupon-remove" data-v-c53773de>বাতিল</button></div>`);
			else _push(`<div class="flex gap-2" data-v-c53773de><input${(0, server_renderer_exports.ssrRenderAttr)("value", couponCode.value)} type="text" placeholder="কুপন কোড লিখুন" class="checkout-input flex-1"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(applyingCoupon.value) ? " disabled" : ""} data-v-c53773de><button type="button" class="coupon-submit-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(applyingCoupon.value) ? " disabled" : ""} data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(applyingCoupon.value ? "..." : "Submit")}</button></div>`);
			_push(`</div><div class="mt-6 space-y-3 pt-5 border-t border-[#f0e6d8]" data-v-c53773de><div class="flex justify-between body-1-r text-gray-600" data-v-c53773de><span data-v-c53773de>সাবটোটাল</span><span data-v-c53773de>৳${(0, server_renderer_exports.ssrInterpolate)(subtotal.value)}</span></div>`);
			if (productSaving.value > 0) _push(`<div class="flex justify-between body-1-r text-green-600" data-v-c53773de><span data-v-c53773de>পণ্যে ছাড়</span><span data-v-c53773de>-৳${(0, server_renderer_exports.ssrInterpolate)(productSaving.value)}</span></div>`);
			else _push(`<!---->`);
			if (form.value.discount > 0) _push(`<div class="flex justify-between body-1-r text-green-600" data-v-c53773de><span data-v-c53773de>ডিসকাউন্ট</span><span data-v-c53773de>-৳${(0, server_renderer_exports.ssrInterpolate)(form.value.discount)}</span></div>`);
			else _push(`<!---->`);
			_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([deliveryIsFree.value ? "text-green-600" : "text-gray-600", "flex justify-between body-1-r"])}" data-v-c53773de><span data-v-c53773de>ডেলিভারি চার্জ</span>`);
			if (deliveryIsFree.value) _push(`<span class="font-semibold" data-v-c53773de>Delivery Free</span>`);
			else _push(`<span data-v-c53773de>৳${(0, server_renderer_exports.ssrInterpolate)(form.value.delivery_charge)}</span>`);
			_push(`</div></div><div class="flex justify-between items-center mt-5 pt-5 border-t border-[#f0e6d8]" data-v-c53773de><span class="title-2 text-gray-900" data-v-c53773de>মোট মূল্য</span><span class="title-2 text-gray-900" data-v-c53773de>৳${(0, server_renderer_exports.ssrInterpolate)(total.value)}</span></div><button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isPlacingOrder.value) ? " disabled" : ""} class="${(0, server_renderer_exports.ssrRenderClass)([
				"checkout-order-btn mt-6",
				isPreOrder.value ? "bg-orange-500 hover:bg-orange-600" : "",
				isPlacingOrder.value ? "opacity-70 cursor-not-allowed" : ""
			])}" data-v-c53773de>`);
			if (isPlacingOrder.value) _push(`<span class="flex items-center justify-center gap-2" data-v-c53773de><svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-c53773de><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-c53773de></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-c53773de></path></svg> অর্ডার প্রক্রিয়াধীন... </span>`);
			else _push(`<span data-v-c53773de>${(0, server_renderer_exports.ssrInterpolate)(isPreOrder.value ? "প্রি-অর্ডার নিশ্চিত করুন" : "অর্ডার নিশ্চিত করুন")}</span>`);
			_push(`</button></div></div></div></div></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Checkout/CheckoutForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CheckoutForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-c53773de"]]);
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
					if (_push) _push(`<title data-v-92d19db3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="bg-[#FFFAF4] py-4" data-v-92d19db3${_scopeId}><div class="container max-w-6xl mx-auto" data-v-92d19db3${_scopeId}><nav class="flex items-center gap-2 text-sm text-gray-400" data-v-92d19db3${_scopeId}><a href="/" class="hover:text-gray-600 transition-colors" data-v-92d19db3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</a><span data-v-92d19db3${_scopeId}>&gt;</span><span class="text-gray-800 font-medium" data-v-92d19db3${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</span></nav></div></div><div class="checkout-page-wrap" data-v-92d19db3${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(CheckoutForm_default, null, null, _parent, _scopeId));
						_push(`</div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("div", { class: "bg-[#FFFAF4] py-4" }, [(0, vue_exports.createVNode)("div", { class: "container max-w-6xl mx-auto" }, [(0, vue_exports.createVNode)("nav", { class: "flex items-center gap-2 text-sm text-gray-400" }, [
							(0, vue_exports.createVNode)("a", {
								href: "/",
								class: "hover:text-gray-600 transition-colors"
							}, (0, vue_exports.toDisplayString)(__props.texts.t2), 1),
							(0, vue_exports.createVNode)("span", null, ">"),
							(0, vue_exports.createVNode)("span", { class: "text-gray-800 font-medium" }, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)
						])])]),
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
var Index_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-92d19db3"]]);
//#endregion
export { Index_default as default };

//# sourceMappingURL=Index-BnImt_cS.js.map