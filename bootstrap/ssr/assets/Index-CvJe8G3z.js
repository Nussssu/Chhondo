import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { _ as createLucideIcon, d as useAuthStore, f as p } from "./AppLayout-BTfWMt9n.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AccountLayout_default } from "./AccountLayout-BmSfcuSx.js";
import { t as PhoneField_default } from "./PhoneField-DNwpBQpi.js";
//#region node_modules/.pnpm/lucide-vue-next@0.400.0_vue@3.5.38/node_modules/lucide-vue-next/dist/esm/icons/plus.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = createLucideIcon("PlusIcon", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
//#endregion
//#region resources/js/components/Account/StatCard.vue
var _sfc_main$3 = {
	__name: "StatCard",
	__ssrInlineRender: true,
	props: {
		value: {
			type: [Number, String],
			required: true
		},
		label: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "stat-card" }, _attrs))} data-v-fe91abb6><p class="stat-card-value" data-v-fe91abb6>${(0, server_renderer_exports.ssrInterpolate)(__props.value)}</p><p class="stat-card-label" data-v-fe91abb6>${(0, server_renderer_exports.ssrInterpolate)(__props.label)}</p></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Account/StatCard.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var StatCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-fe91abb6"]]);
//#endregion
//#region resources/js/constants/address.js
/**
* Delivery address options.
*
* `CITIES` deliberately uses the same keys as the checkout's delivery area, so
* a saved address sets the shipping zone without any translation between the
* two screens. Mirrors AddressWebController::CITIES / ::TYPES.
*/
var CITIES = {
	inside: "Inside Dhaka",
	outside: "Outside Dhaka"
};
var TYPES = {
	home: "বাসা",
	office: "অফিস"
};
/** A blank address, ready to be filled in. */
var blankAddress = () => ({
	address: "",
	city: "",
	type: "home",
	is_default: false
});
//#endregion
//#region resources/js/components/Account/AddressSelect.vue
var _sfc_main$2 = {
	__name: "AddressSelect",
	__ssrInlineRender: true,
	props: {
		modelValue: {
			type: String,
			default: ""
		},
		options: {
			type: Object,
			required: true
		},
		placeholder: {
			type: String,
			default: ""
		},
		invalid: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		/**
		* A dropdown for the address form that always opens inside the screen.
		*
		* A native <select> draws its list as a desktop pop-up in a narrow browser
		* window or a device preview, and that list could spill past the screen
		* edge. This one keeps the same look as the other fields, opens within the
		* field's own width, and opens upward when there is no room below.
		*/
		const props = __props;
		const open = (0, vue_exports.ref)(false);
		const upward = (0, vue_exports.ref)(false);
		const root = (0, vue_exports.ref)(null);
		(0, vue_exports.ref)(null);
		const label = (0, vue_exports.computed)(() => props.options[props.modelValue] ?? "");
		function onOutside(e) {
			if (root.value && !root.value.contains(e.target)) close();
		}
		function close() {
			open.value = false;
			document.removeEventListener("pointerdown", onOutside);
		}
		(0, vue_exports.onBeforeUnmount)(() => document.removeEventListener("pointerdown", onOutside));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				ref_key: "root",
				ref: root,
				class: "as-root"
			}, _attrs))} data-v-0d1ac284><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{
				"is-invalid": __props.invalid,
				"is-placeholder": !label.value
			}, "af-input as-trigger"])}" aria-haspopup="listbox"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", open.value)} data-v-0d1ac284><span class="as-value" data-v-0d1ac284>${(0, server_renderer_exports.ssrInterpolate)(label.value || __props.placeholder)}</span><svg class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-open": open.value }, "as-caret"])}" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" data-v-0d1ac284><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-0d1ac284></path></svg></button><ul class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-up": upward.value }, "as-list"])}" role="listbox" style="${(0, server_renderer_exports.ssrRenderStyle)(open.value ? null : { display: "none" })}" data-v-0d1ac284><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.options, (text, value) => {
				_push(`<li role="option" tabindex="-1" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-selected": value === __props.modelValue }, "as-option"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-selected", value === __props.modelValue)} data-v-0d1ac284>${(0, server_renderer_exports.ssrInterpolate)(text)}</li>`);
			});
			_push(`<!--]--></ul></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Account/AddressSelect.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AddressSelect_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-0d1ac284"]]);
//#endregion
//#region resources/js/components/Account/AddressFields.vue
var _sfc_main$1 = {
	__name: "AddressFields",
	__ssrInlineRender: true,
	props: {
		modelValue: {
			type: Object,
			required: true
		},
		errors: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		/**
		* The fields of one delivery address.
		*
		* Address, city and type only — name, email and phone belong to the account
		* and are edited in Personal Information above.
		*
		* `city` holds the checkout's own delivery-area values rather than a free-text
		* city, which is what lets a saved address set the shipping zone directly.
		*/
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "af-grid" }, _attrs))} data-v-7e87a00f><div class="af-field af-field--full" data-v-7e87a00f><label class="af-label" data-v-7e87a00f>বিস্তারিত ঠিকানা</label><textarea rows="2" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-invalid": __props.errors.address }, "af-input"])}" placeholder="বাড়ি, রাস্তা, এলাকা" data-v-7e87a00f>${(0, server_renderer_exports.ssrInterpolate)(__props.modelValue.address)}</textarea>`);
			if (__props.errors.address) _push(`<p class="af-error" data-v-7e87a00f>${(0, server_renderer_exports.ssrInterpolate)(__props.errors.address)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="af-field" data-v-7e87a00f><label class="af-label" data-v-7e87a00f>শহর</label>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(AddressSelect_default, {
				modelValue: __props.modelValue.city,
				"onUpdate:modelValue": ($event) => __props.modelValue.city = $event,
				options: (0, vue_exports.unref)(CITIES),
				placeholder: "নির্বাচন করুন",
				invalid: Boolean(__props.errors.city)
			}, null, _parent));
			if (__props.errors.city) _push(`<p class="af-error" data-v-7e87a00f>${(0, server_renderer_exports.ssrInterpolate)(__props.errors.city)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="af-field" data-v-7e87a00f><label class="af-label" data-v-7e87a00f>ঠিকানার ধরন</label>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(AddressSelect_default, {
				modelValue: __props.modelValue.type,
				"onUpdate:modelValue": ($event) => __props.modelValue.type = $event,
				options: (0, vue_exports.unref)(TYPES),
				invalid: Boolean(__props.errors.type)
			}, null, _parent));
			if (__props.errors.type) _push(`<p class="af-error" data-v-7e87a00f>${(0, server_renderer_exports.ssrInterpolate)(__props.errors.type)}</p>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Account/AddressFields.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AddressFields_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-7e87a00f"]]);
//#endregion
//#region resources/js/Pages/Public/Account/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	setup(__props) {
		const page = usePage();
		const authStore = useAuthStore();
		const addresses = (0, vue_exports.ref)(page.props.addresses || []);
		const stats = (0, vue_exports.ref)(page.props.stats || {});
		(0, vue_exports.watch)(() => page.props.addresses, (next) => {
			addresses.value = next || [];
		});
		const drafts = (0, vue_exports.ref)(addresses.value.length ? [] : [{
			...blankAddress(),
			is_default: true
		}]);
		const editingId = (0, vue_exports.ref)(null);
		const editForm = (0, vue_exports.ref)(blankAddress());
		const errors = (0, vue_exports.ref)({});
		const busy = (0, vue_exports.ref)(false);
		const isPrimary = (addr) => Number(addr.is_default) === 1;
		function addDraft() {
			errors.value = {};
			drafts.value.push({
				...blankAddress(),
				is_default: addresses.value.length === 0
			});
		}
		function startEdit(addr) {
			errors.value = {};
			editingId.value = addr.id;
			editForm.value = {
				address: addr.address || "",
				city: addr.city || "",
				type: addr.type || "home",
				is_default: isPrimary(addr)
			};
		}
		function cancelEdit() {
			editingId.value = null;
			errors.value = {};
		}
		/** Shared Inertia options: keep the page still, surface field errors. */
		const requestOptions = (onDone) => ({
			preserveScroll: true,
			onStart: () => {
				busy.value = true;
				errors.value = {};
			},
			onError: (e) => {
				errors.value = e;
			},
			onSuccess: () => {
				errors.value = {};
				onDone?.();
			},
			onFinish: () => {
				busy.value = false;
			}
		});
		function saveDraft(index) {
			router.post(route("address.store"), drafts.value[index], requestOptions(() => {
				drafts.value.splice(index, 1);
			}));
		}
		function saveEdit(addr) {
			router.put(route("address.update", addr.id), editForm.value, requestOptions(() => {
				editingId.value = null;
			}));
		}
		function makePrimary(addr) {
			if (isPrimary(addr)) return;
			router.post(route("address.primary", addr.id), {}, requestOptions(() => {
				showPrimaryNotice();
			}));
		}
		const primaryNotice = (0, vue_exports.ref)(false);
		let primaryNoticeTimer;
		const showPrimaryNotice = () => {
			primaryNotice.value = true;
			window.clearTimeout(primaryNoticeTimer);
			primaryNoticeTimer = window.setTimeout(() => {
				primaryNotice.value = false;
			}, 2200);
		};
		(0, vue_exports.onBeforeUnmount)(() => window.clearTimeout(primaryNoticeTimer));
		function remove(addr) {
			if (!window.confirm("Remove this address?")) return;
			router.post(route("address.destroy", addr.id), {}, requestOptions());
		}
		const initial = (0, vue_exports.computed)(() => (authStore.user?.name || "?").trim().charAt(0).toUpperCase());
		const avatarInput = (0, vue_exports.ref)(null);
		const uploadingAvatar = (0, vue_exports.ref)(false);
		const avatarPreview = (0, vue_exports.ref)(null);
		const avatar = (0, vue_exports.computed)(() => avatarPreview.value || authStore.user?.image || null);
		function uploadAvatar(event) {
			const file = event.target.files?.[0];
			if (!file) return;
			if (file.size > 4 * 1024 * 1024) {
				p.error("ছবির আকার ৪MB বা তার কম হতে হবে।");
				event.target.value = "";
				return;
			}
			const previous = avatarPreview.value;
			avatarPreview.value = URL.createObjectURL(file);
			uploadingAvatar.value = true;
			router.post(route("account.profile.avatar"), { image: file }, {
				forceFormData: true,
				preserveScroll: true,
				onError: (errors) => {
					avatarPreview.value = previous;
					p.error(errors.image || "ছবি আপলোড করা যায়নি।");
				},
				onFinish: () => {
					uploadingAvatar.value = false;
					event.target.value = "";
				}
			});
		}
		const isEditOpen = (0, vue_exports.ref)(false);
		const saving = (0, vue_exports.ref)(false);
		const form = (0, vue_exports.ref)({
			name: "",
			email: "",
			phone: "",
			date_of_birth: ""
		});
		const phoneValid = (0, vue_exports.ref)(false);
		const phoneError = (0, vue_exports.ref)("");
		const openEdit = () => {
			form.value = {
				name: authStore.user?.name || "",
				email: authStore.user?.email || "",
				phone: authStore.user?.phone || "",
				date_of_birth: authStore.user?.date_of_birth || ""
			};
			phoneError.value = "";
			isEditOpen.value = true;
		};
		const closeEdit = () => {
			isEditOpen.value = false;
		};
		const submitProfile = () => {
			if (form.value.phone && !phoneValid.value) {
				phoneError.value = "Enter a valid phone number.";
				return;
			}
			phoneError.value = "";
			saving.value = true;
			router.put("/account/profile", form.value, {
				preserveScroll: true,
				onSuccess: () => {
					closeEdit();
				},
				onError: (errors) => {
					phoneError.value = errors.phone || "";
					p.error(errors.phone || errors.email || "প্রোফাইল আপডেট করা যায়নি।");
				},
				onFinish: () => {
					saving.value = false;
				}
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-640335b6${_scopeId}>আমার অ্যাকাউন্ট</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "আমার অ্যাকাউন্ট")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AccountLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="profile-page" data-v-640335b6${_scopeId}>`);
						if (primaryNotice.value) _push(`<div class="copy-toast" role="status" aria-live="polite" data-v-640335b6${_scopeId}>প্রাথমিক ঠিকানা আপডেট হয়েছে</div>`);
						else _push(`<!---->`);
						_push(`<div class="stat-row" data-v-640335b6${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(StatCard_default, {
							value: stats.value.totalOrders ?? 0,
							label: "মোট অর্ডার"
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(StatCard_default, {
							value: stats.value.wishlistItems ?? 0,
							label: "উইশলিস্ট আইটেম"
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(StatCard_default, {
							value: stats.value.savedAddresses ?? 0,
							label: "সংরক্ষিত ঠিকানা"
						}, null, _parent, _scopeId));
						_push(`</div><div class="profile-summary-card" data-v-640335b6${_scopeId}><div class="profile-avatar-wrap" data-v-640335b6${_scopeId}><div class="profile-avatar" data-v-640335b6${_scopeId}>`);
						if (avatar.value) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", avatar.value)}${(0, server_renderer_exports.ssrRenderAttr)("alt", (0, vue_exports.unref)(authStore).user?.name)} class="profile-avatar-img" data-v-640335b6${_scopeId}>`);
						else _push(`<!--[-->${(0, server_renderer_exports.ssrInterpolate)(initial.value)}<!--]-->`);
						if (uploadingAvatar.value) _push(`<span class="profile-avatar-busy" data-v-640335b6${_scopeId}>…</span>`);
						else _push(`<!---->`);
						_push(`</div><button type="button" class="profile-avatar-badge" aria-label="Change profile photo"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(uploadingAvatar.value) ? " disabled" : ""} data-v-640335b6${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/avatar-camera-badge.svg")} alt="" data-v-640335b6${_scopeId}></button><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only-file" data-v-640335b6${_scopeId}></div><div class="profile-summary-info" data-v-640335b6${_scopeId}><p class="profile-name" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.name)}</p><p class="profile-email" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.email)}</p></div><button type="button" class="profile-edit-btn" data-v-640335b6${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/edit-pencil.svg")} alt="" data-v-640335b6${_scopeId}> প্রোফাইল এডিট করুন </button></div><div class="profile-details-card" data-v-640335b6${_scopeId}><div class="profile-info-grid" data-v-640335b6${_scopeId}><div class="profile-field" data-v-640335b6${_scopeId}><p class="profile-field-label" data-v-640335b6${_scopeId}>নাম</p><div class="profile-field-value" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.name)}</div></div><div class="profile-field" data-v-640335b6${_scopeId}><p class="profile-field-label" data-v-640335b6${_scopeId}>ই-মেইল অ্যাড্রেস</p><div class="profile-field-value" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.email)}</div></div><div class="profile-field" data-v-640335b6${_scopeId}><p class="profile-field-label" data-v-640335b6${_scopeId}>ফোন নম্বর</p><div class="profile-field-value" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.phone)}</div></div><div class="profile-field" data-v-640335b6${_scopeId}><p class="profile-field-label" data-v-640335b6${_scopeId}>জন্ম তারিখ</p><div class="profile-field-value" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authStore).user?.date_of_birth)}</div></div></div><p class="address-card-title" data-v-640335b6${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/address-pin.svg")} alt="" data-v-640335b6${_scopeId}> ডেলিভারি ঠিকানা </p><div class="address-card" data-v-640335b6${_scopeId}>`);
						if (!addresses.value.length && !drafts.value.length) _push(`<p class="address-empty" data-v-640335b6${_scopeId}> এখনো কোনো ঠিকানা সেভ করা নেই — নিচে যোগ করুন, চেকআউটে এটিই বসে যাবে। </p>`);
						else _push(`<!---->`);
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(addresses.value, (addr) => {
							_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-primary": isPrimary(addr) }, "addr-item"])}" data-v-640335b6${_scopeId}>`);
							if (editingId.value === addr.id) {
								_push(`<!--[-->`);
								_push((0, server_renderer_exports.ssrRenderComponent)(AddressFields_default, {
									modelValue: editForm.value,
									"onUpdate:modelValue": ($event) => editForm.value = $event,
									errors: errors.value
								}, null, _parent, _scopeId));
								_push(`<div class="addr-actions" data-v-640335b6${_scopeId}><button type="button" class="addr-btn addr-btn--save"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(busy.value) ? " disabled" : ""} data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(busy.value ? "সেভ হচ্ছে…" : "সেভ করুন")}</button><button type="button" class="addr-btn" data-v-640335b6${_scopeId}>বাতিল</button></div><!--]-->`);
							} else {
								_push(`<!--[--><div class="addr-head" data-v-640335b6${_scopeId}><span class="addr-type" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(TYPES)[addr.type] || "বাসা")}</span>`);
								if (isPrimary(addr) && addresses.value.length > 1) _push(`<span class="addr-primary-tag" data-v-640335b6${_scopeId}>প্রাইমারি</span>`);
								else _push(`<!---->`);
								_push(`<div class="addr-head-actions" data-v-640335b6${_scopeId}><button type="button" class="addr-link" data-v-640335b6${_scopeId}>এডিট</button><button type="button" class="addr-link addr-link--danger" data-v-640335b6${_scopeId}>মুছুন</button></div></div><p class="addr-line addr-line--strong" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(addr.address)}</p><p class="addr-line addr-line--muted" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(CITIES)[addr.city] || "—")}</p>`);
								if (addresses.value.length > 1) _push(`<label class="addr-primary" data-v-640335b6${_scopeId}><input type="radio" name="primary-address"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isPrimary(addr)) ? " checked" : ""}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(busy.value) ? " disabled" : ""} data-v-640335b6${_scopeId}><span data-v-640335b6${_scopeId}>প্রাইমারি হিসেবে রাখুন — চেকআউটে এটিই বসবে</span></label>`);
								else _push(`<!---->`);
								_push(`<!--]-->`);
							}
							_push(`</div>`);
						});
						_push(`<!--]--><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(drafts.value, (draft, i) => {
							_push(`<div class="addr-item is-draft" data-v-640335b6${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(AddressFields_default, {
								modelValue: drafts.value[i],
								"onUpdate:modelValue": ($event) => drafts.value[i] = $event,
								errors: i === 0 ? errors.value : {}
							}, null, _parent, _scopeId));
							if (addresses.value.length) _push(`<label class="addr-primary" data-v-640335b6${_scopeId}><input${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(draft.is_default) ? (0, server_renderer_exports.ssrLooseContain)(draft.is_default, null) : draft.is_default) ? " checked" : ""} type="checkbox" data-v-640335b6${_scopeId}><span data-v-640335b6${_scopeId}>এটিকে আমার প্রাইমারি ঠিকানা করুন</span></label>`);
							else _push(`<p class="addr-note" data-v-640335b6${_scopeId}>এটিই হবে আপনার প্রাইমারি ঠিকানা।</p>`);
							_push(`<div class="addr-actions" data-v-640335b6${_scopeId}><button type="button" class="addr-btn addr-btn--save"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(busy.value) ? " disabled" : ""} data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(busy.value ? "সেভ হচ্ছে…" : "ঠিকানা সেভ করুন")}</button><button type="button" class="addr-btn" data-v-640335b6${_scopeId}>বাতিল</button></div></div>`);
						});
						_push(`<!--]--><button type="button" class="addr-add" data-v-640335b6${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Plus), { size: 15 }, null, _parent, _scopeId));
						_push(` ${(0, server_renderer_exports.ssrInterpolate)(addresses.value.length ? "আরেকটি ঠিকানা যোগ করুন" : "ঠিকানা যোগ করুন")}</button></div></div></div>`);
						if (isEditOpen.value) {
							_push(`<div class="modal-overlay" data-v-640335b6${_scopeId}><div class="modal-card" data-v-640335b6${_scopeId}><h2 class="modal-title" data-v-640335b6${_scopeId}>প্রোফাইল সম্পাদনা</h2><form data-v-640335b6${_scopeId}><div class="modal-field" data-v-640335b6${_scopeId}><label class="modal-label" data-v-640335b6${_scopeId}>নাম</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.name)} type="text" class="modal-input" placeholder="সম্পূর্ণ নাম" data-v-640335b6${_scopeId}></div><div class="modal-field" data-v-640335b6${_scopeId}><label class="modal-label" data-v-640335b6${_scopeId}>ই-মেইল অ্যাড্রেস</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.email)} type="email" class="modal-input" placeholder="ইমেইল ঠিকানা" data-v-640335b6${_scopeId}></div><div class="modal-field" data-v-640335b6${_scopeId}><label class="modal-label" data-v-640335b6${_scopeId}>ফোন নম্বর</label>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(PhoneField_default, {
								modelValue: form.value.phone,
								"onUpdate:modelValue": ($event) => form.value.phone = $event,
								valid: phoneValid.value,
								"onUpdate:valid": ($event) => phoneValid.value = $event,
								"bangladesh-only": "",
								invalid: Boolean(phoneError.value)
							}, null, _parent, _scopeId));
							if (phoneError.value) _push(`<p class="modal-error" data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(phoneError.value)}</p>`);
							else _push(`<!---->`);
							_push(`</div><div class="modal-field" data-v-640335b6${_scopeId}><label class="modal-label" data-v-640335b6${_scopeId}>জন্ম তারিখ</label><input${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.date_of_birth)} type="date" class="modal-input" data-v-640335b6${_scopeId}></div><div class="modal-actions" data-v-640335b6${_scopeId}><button type="button" class="modal-cancel-btn" data-v-640335b6${_scopeId}>বাতিল</button><button type="submit" class="modal-save-btn"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(saving.value) ? " disabled" : ""} data-v-640335b6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(saving.value ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন")}</button></div></form></div></div>`);
						} else _push(`<!---->`);
					} else return [(0, vue_exports.createVNode)("div", { class: "profile-page" }, [
						(0, vue_exports.createVNode)(vue_exports.Transition, { name: "copy-toast" }, {
							default: (0, vue_exports.withCtx)(() => [primaryNotice.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "copy-toast",
								role: "status",
								"aria-live": "polite"
							}, "প্রাথমিক ঠিকানা আপডেট হয়েছে")) : (0, vue_exports.createCommentVNode)("", true)]),
							_: 1
						}),
						(0, vue_exports.createVNode)("div", { class: "stat-row" }, [
							(0, vue_exports.createVNode)(StatCard_default, {
								value: stats.value.totalOrders ?? 0,
								label: "মোট অর্ডার"
							}, null, 8, ["value"]),
							(0, vue_exports.createVNode)(StatCard_default, {
								value: stats.value.wishlistItems ?? 0,
								label: "উইশলিস্ট আইটেম"
							}, null, 8, ["value"]),
							(0, vue_exports.createVNode)(StatCard_default, {
								value: stats.value.savedAddresses ?? 0,
								label: "সংরক্ষিত ঠিকানা"
							}, null, 8, ["value"])
						]),
						(0, vue_exports.createVNode)("div", { class: "profile-summary-card" }, [
							(0, vue_exports.createVNode)("div", { class: "profile-avatar-wrap" }, [
								(0, vue_exports.createVNode)("div", { class: "profile-avatar" }, [avatar.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("img", {
									key: 0,
									src: avatar.value,
									alt: (0, vue_exports.unref)(authStore).user?.name,
									class: "profile-avatar-img"
								}, null, 8, ["src", "alt"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(initial.value), 1)], 64)), uploadingAvatar.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 2,
									class: "profile-avatar-busy"
								}, "…")) : (0, vue_exports.createCommentVNode)("", true)]),
								(0, vue_exports.createVNode)("button", {
									type: "button",
									class: "profile-avatar-badge",
									"aria-label": "Change profile photo",
									disabled: uploadingAvatar.value,
									onClick: ($event) => avatarInput.value?.click()
								}, [(0, vue_exports.createVNode)("img", {
									src: "/assets/images/account/avatar-camera-badge.svg",
									alt: ""
								})], 8, ["disabled", "onClick"]),
								(0, vue_exports.createVNode)("input", {
									ref_key: "avatarInput",
									ref: avatarInput,
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									class: "sr-only-file",
									onChange: uploadAvatar
								}, null, 544)
							]),
							(0, vue_exports.createVNode)("div", { class: "profile-summary-info" }, [(0, vue_exports.createVNode)("p", { class: "profile-name" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.name), 1), (0, vue_exports.createVNode)("p", { class: "profile-email" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.email), 1)]),
							(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "profile-edit-btn",
								onClick: openEdit
							}, [(0, vue_exports.createVNode)("img", {
								src: "/assets/images/account/edit-pencil.svg",
								alt: ""
							}), (0, vue_exports.createTextVNode)(" প্রোফাইল এডিট করুন ")])
						]),
						(0, vue_exports.createVNode)("div", { class: "profile-details-card" }, [
							(0, vue_exports.createVNode)("div", { class: "profile-info-grid" }, [
								(0, vue_exports.createVNode)("div", { class: "profile-field" }, [(0, vue_exports.createVNode)("p", { class: "profile-field-label" }, "নাম"), (0, vue_exports.createVNode)("div", { class: "profile-field-value" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.name), 1)]),
								(0, vue_exports.createVNode)("div", { class: "profile-field" }, [(0, vue_exports.createVNode)("p", { class: "profile-field-label" }, "ই-মেইল অ্যাড্রেস"), (0, vue_exports.createVNode)("div", { class: "profile-field-value" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.email), 1)]),
								(0, vue_exports.createVNode)("div", { class: "profile-field" }, [(0, vue_exports.createVNode)("p", { class: "profile-field-label" }, "ফোন নম্বর"), (0, vue_exports.createVNode)("div", { class: "profile-field-value" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.phone), 1)]),
								(0, vue_exports.createVNode)("div", { class: "profile-field" }, [(0, vue_exports.createVNode)("p", { class: "profile-field-label" }, "জন্ম তারিখ"), (0, vue_exports.createVNode)("div", { class: "profile-field-value" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authStore).user?.date_of_birth), 1)])
							]),
							(0, vue_exports.createVNode)("p", { class: "address-card-title" }, [(0, vue_exports.createVNode)("img", {
								src: "/assets/images/account/address-pin.svg",
								alt: ""
							}), (0, vue_exports.createTextVNode)(" ডেলিভারি ঠিকানা ")]),
							(0, vue_exports.createVNode)("div", { class: "address-card" }, [
								!addresses.value.length && !drafts.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "address-empty"
								}, " এখনো কোনো ঠিকানা সেভ করা নেই — নিচে যোগ করুন, চেকআউটে এটিই বসে যাবে। ")) : (0, vue_exports.createCommentVNode)("", true),
								((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(addresses.value, (addr) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: addr.id,
										class: ["addr-item", { "is-primary": isPrimary(addr) }]
									}, [editingId.value === addr.id ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [(0, vue_exports.createVNode)(AddressFields_default, {
										modelValue: editForm.value,
										"onUpdate:modelValue": ($event) => editForm.value = $event,
										errors: errors.value
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"errors"
									]), (0, vue_exports.createVNode)("div", { class: "addr-actions" }, [(0, vue_exports.createVNode)("button", {
										type: "button",
										class: "addr-btn addr-btn--save",
										disabled: busy.value,
										onClick: ($event) => saveEdit(addr)
									}, (0, vue_exports.toDisplayString)(busy.value ? "সেভ হচ্ছে…" : "সেভ করুন"), 9, ["disabled", "onClick"]), (0, vue_exports.createVNode)("button", {
										type: "button",
										class: "addr-btn",
										onClick: cancelEdit
									}, "বাতিল")])], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
										(0, vue_exports.createVNode)("div", { class: "addr-head" }, [
											(0, vue_exports.createVNode)("span", { class: "addr-type" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(TYPES)[addr.type] || "বাসা"), 1),
											isPrimary(addr) && addresses.value.length > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												class: "addr-primary-tag"
											}, "প্রাইমারি")) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.createVNode)("div", { class: "addr-head-actions" }, [(0, vue_exports.createVNode)("button", {
												type: "button",
												class: "addr-link",
												onClick: ($event) => startEdit(addr)
											}, "এডিট", 8, ["onClick"]), (0, vue_exports.createVNode)("button", {
												type: "button",
												class: "addr-link addr-link--danger",
												onClick: ($event) => remove(addr)
											}, "মুছুন", 8, ["onClick"])])
										]),
										(0, vue_exports.createVNode)("p", { class: "addr-line addr-line--strong" }, (0, vue_exports.toDisplayString)(addr.address), 1),
										(0, vue_exports.createVNode)("p", { class: "addr-line addr-line--muted" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(CITIES)[addr.city] || "—"), 1),
										addresses.value.length > 1 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("label", {
											key: 0,
											class: "addr-primary"
										}, [(0, vue_exports.createVNode)("input", {
											type: "radio",
											name: "primary-address",
											checked: isPrimary(addr),
											disabled: busy.value,
											onChange: ($event) => makePrimary(addr)
										}, null, 40, [
											"checked",
											"disabled",
											"onChange"
										]), (0, vue_exports.createVNode)("span", null, "প্রাইমারি হিসেবে রাখুন — চেকআউটে এটিই বসবে")])) : (0, vue_exports.createCommentVNode)("", true)
									], 64))], 2);
								}), 128)),
								((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(drafts.value, (draft, i) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: `draft-${i}`,
										class: "addr-item is-draft"
									}, [
										(0, vue_exports.createVNode)(AddressFields_default, {
											modelValue: drafts.value[i],
											"onUpdate:modelValue": ($event) => drafts.value[i] = $event,
											errors: i === 0 ? errors.value : {}
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"errors"
										]),
										addresses.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("label", {
											key: 0,
											class: "addr-primary"
										}, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
											"onUpdate:modelValue": ($event) => draft.is_default = $event,
											type: "checkbox"
										}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelCheckbox, draft.is_default]]), (0, vue_exports.createVNode)("span", null, "এটিকে আমার প্রাইমারি ঠিকানা করুন")])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
											key: 1,
											class: "addr-note"
										}, "এটিই হবে আপনার প্রাইমারি ঠিকানা।")),
										(0, vue_exports.createVNode)("div", { class: "addr-actions" }, [(0, vue_exports.createVNode)("button", {
											type: "button",
											class: "addr-btn addr-btn--save",
											disabled: busy.value,
											onClick: ($event) => saveDraft(i)
										}, (0, vue_exports.toDisplayString)(busy.value ? "সেভ হচ্ছে…" : "ঠিকানা সেভ করুন"), 9, ["disabled", "onClick"]), (0, vue_exports.createVNode)("button", {
											type: "button",
											class: "addr-btn",
											onClick: ($event) => drafts.value.splice(i, 1)
										}, "বাতিল", 8, ["onClick"])])
									]);
								}), 128)),
								(0, vue_exports.createVNode)("button", {
									type: "button",
									class: "addr-add",
									onClick: addDraft
								}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Plus), { size: 15 }), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(addresses.value.length ? "আরেকটি ঠিকানা যোগ করুন" : "ঠিকানা যোগ করুন"), 1)])
							])
						])
					]), isEditOpen.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						class: "modal-overlay",
						onClick: (0, vue_exports.withModifiers)(closeEdit, ["self"])
					}, [(0, vue_exports.createVNode)("div", { class: "modal-card" }, [(0, vue_exports.createVNode)("h2", { class: "modal-title" }, "প্রোফাইল সম্পাদনা"), (0, vue_exports.createVNode)("form", { onSubmit: (0, vue_exports.withModifiers)(submitProfile, ["prevent"]) }, [
						(0, vue_exports.createVNode)("div", { class: "modal-field" }, [(0, vue_exports.createVNode)("label", { class: "modal-label" }, "নাম"), (0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
							"onUpdate:modelValue": ($event) => form.value.name = $event,
							type: "text",
							class: "modal-input",
							placeholder: "সম্পূর্ণ নাম"
						}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.name]])]),
						(0, vue_exports.createVNode)("div", { class: "modal-field" }, [(0, vue_exports.createVNode)("label", { class: "modal-label" }, "ই-মেইল অ্যাড্রেস"), (0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
							"onUpdate:modelValue": ($event) => form.value.email = $event,
							type: "email",
							class: "modal-input",
							placeholder: "ইমেইল ঠিকানা"
						}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.email]])]),
						(0, vue_exports.createVNode)("div", { class: "modal-field" }, [
							(0, vue_exports.createVNode)("label", { class: "modal-label" }, "ফোন নম্বর"),
							(0, vue_exports.createVNode)(PhoneField_default, {
								modelValue: form.value.phone,
								"onUpdate:modelValue": ($event) => form.value.phone = $event,
								valid: phoneValid.value,
								"onUpdate:valid": ($event) => phoneValid.value = $event,
								"bangladesh-only": "",
								invalid: Boolean(phoneError.value)
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"valid",
								"onUpdate:valid",
								"invalid"
							]),
							phoneError.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "modal-error"
							}, (0, vue_exports.toDisplayString)(phoneError.value), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("div", { class: "modal-field" }, [(0, vue_exports.createVNode)("label", { class: "modal-label" }, "জন্ম তারিখ"), (0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
							"onUpdate:modelValue": ($event) => form.value.date_of_birth = $event,
							type: "date",
							class: "modal-input"
						}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.date_of_birth]])]),
						(0, vue_exports.createVNode)("div", { class: "modal-actions" }, [(0, vue_exports.createVNode)("button", {
							type: "button",
							class: "modal-cancel-btn",
							onClick: closeEdit
						}, "বাতিল"), (0, vue_exports.createVNode)("button", {
							type: "submit",
							class: "modal-save-btn",
							disabled: saving.value
						}, (0, vue_exports.toDisplayString)(saving.value ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"), 9, ["disabled"])])
					], 32)])])) : (0, vue_exports.createCommentVNode)("", true)];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Account/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Index_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-640335b6"]]);
//#endregion
export { Index_default as default };

//# sourceMappingURL=Index-CvJe8G3z.js.map