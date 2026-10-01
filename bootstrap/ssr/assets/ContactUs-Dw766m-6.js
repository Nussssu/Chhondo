import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { d as p, g as createLucideIcon, t as _sfc_main$1 } from "./AppLayout-D5uzRHsl.js";
import { n as MapPin, r as Mail, t as Phone } from "./phone-CmV-m_EM.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PhoneField_default } from "./PhoneField-CMb3f90k.js";
import { t as PageBlocks_default } from "./PageBlocks-D2c141xH.js";
//#region node_modules/lucide-vue-next/dist/esm/icons/clock.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock = createLucideIcon("ClockIcon", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["polyline", {
	points: "12 6 12 12 16 14",
	key: "68esgv"
}]]);
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/icons/message-circle.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageCircle = createLucideIcon("MessageCircleIcon", [["path", {
	d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
	key: "vv11sd"
}]]);
//#endregion
//#region resources/js/Pages/Public/ContactUs.vue
var _sfc_main = {
	__name: "ContactUs",
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
		},
		content: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const page = usePage();
		const contact = (0, vue_exports.computed)(() => page.props.contact ?? {});
		const socials = (0, vue_exports.computed)(() => [
			{
				key: "facebook",
				label: "Facebook",
				url: contact.value.facebook
			},
			{
				key: "instagram",
				label: "Instagram",
				url: contact.value.instagram
			},
			{
				key: "tiktok",
				label: "TikTok",
				url: contact.value.tiktok
			},
			{
				key: "youtube",
				label: "YouTube",
				url: contact.value.youtube
			},
			{
				key: "x",
				label: "X",
				url: contact.value.x
			}
		].filter((s) => s.url));
		/** A phone number is only dialable once the spaces and dashes come out. */
		const telHref = (value) => `tel:${String(value ?? "").replace(/[^\d+]/g, "")}`;
		const whatsappHref = (0, vue_exports.computed)(() => {
			const digits = String(contact.value.whatsapp ?? "").replace(/\D/g, "");
			return digits ? `https://wa.me/${digits}` : null;
		});
		const form = (0, vue_exports.ref)({
			name: "",
			email: "",
			phone: "",
			message: ""
		});
		const errors = (0, vue_exports.ref)({});
		const isSubmitting = (0, vue_exports.ref)(false);
		const phoneValid = (0, vue_exports.ref)(false);
		const validateForm = () => {
			errors.value = {};
			if (!form.value.name.trim()) errors.value.name = "নাম লিখুন";
			if (!form.value.email.trim()) errors.value.email = "ইমেইল লিখুন";
			else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = "সঠিক ইমেইল দিন";
			if (!form.value.phone.trim()) errors.value.phone = "ফোন নম্বর লিখুন";
			else if (!phoneValid.value) errors.value.phone = "সঠিক ফোন নম্বর দিন";
			if (!form.value.message.trim()) errors.value.message = "বার্তা লিখুন";
			return Object.keys(errors.value).length === 0;
		};
		const submitForm = async () => {
			if (!validateForm()) {
				p.error("সব তথ্য পূরণ করুন");
				return;
			}
			isSubmitting.value = true;
			router.post("/contact-us", form.value, {
				onSuccess: () => {
					form.value = {
						name: "",
						email: "",
						phone: "",
						message: ""
					};
				},
				onError: (errors) => {
					p.error(Object.values(errors)[0] || "বার্তা পাঠাতে ব্যর্থ হয়েছে");
				},
				onFinish: () => {
					isSubmitting.value = false;
				}
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t1)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.t1), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="contact-page py-12 md:py-16" data-v-4d2a0c01${_scopeId}><div class="container max-w-6xl mx-auto px-4" data-v-4d2a0c01${_scopeId}><div class="text-center mb-9 md:mb-10" data-v-4d2a0c01${_scopeId}><h1 class="headline-1 text-[#3E3C3A]" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro?.title || "যোগাযোগ করুন")}</h1>`);
						if (__props.intro?.subtitle) _push(`<p class="body-1-r text-[#6E6C69] mt-3 leading-relaxed" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro.subtitle)}</p>`);
						else _push(`<!---->`);
						if (__props.content) _push(`<div class="contact-intro mt-4" data-v-4d2a0c01${_scopeId}>${__props.content ?? ""}</div>`);
						else _push(`<p class="body-2-r text-[#696560] mt-4" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t2)}</p>`);
						_push(`</div><div class="contact-grid" data-v-4d2a0c01${_scopeId}><aside class="contact-aside" data-v-4d2a0c01${_scopeId}><div class="contact-card rounded-2xl p-6 md:p-7" data-v-4d2a0c01${_scopeId}><h2 class="body-3-sb text-[#3E3C3A] mb-5" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t3)}</h2><ul class="contact-list" data-v-4d2a0c01${_scopeId}>`);
						if (contact.value.phone) {
							_push(`<li data-v-4d2a0c01${_scopeId}><span class="contact-ico" data-v-4d2a0c01${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Phone), { class: "w-[17px] h-[17px]" }, null, _parent, _scopeId));
							_push(`</span><div data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t4)}</span><a${(0, server_renderer_exports.ssrRenderAttr)("href", telHref(contact.value.phone))} class="contact-value contact-link" dir="ltr" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.phone)}</a></div></li>`);
						} else _push(`<!---->`);
						if (whatsappHref.value) {
							_push(`<li data-v-4d2a0c01${_scopeId}><span class="contact-ico" data-v-4d2a0c01${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(MessageCircle), { class: "w-[17px] h-[17px]" }, null, _parent, _scopeId));
							_push(`</span><div data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t5)}</span><a${(0, server_renderer_exports.ssrRenderAttr)("href", whatsappHref.value)} target="_blank" rel="noopener" class="contact-value contact-link" dir="ltr" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.whatsapp)}</a></div></li>`);
						} else _push(`<!---->`);
						if (contact.value.email) {
							_push(`<li data-v-4d2a0c01${_scopeId}><span class="contact-ico" data-v-4d2a0c01${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Mail), { class: "w-[17px] h-[17px]" }, null, _parent, _scopeId));
							_push(`</span><div data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t6)}</span><a${(0, server_renderer_exports.ssrRenderAttr)("href", `mailto:${contact.value.email}`)} class="contact-value contact-link" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.email)}</a></div></li>`);
						} else _push(`<!---->`);
						if (contact.value.address) {
							_push(`<li data-v-4d2a0c01${_scopeId}><span class="contact-ico" data-v-4d2a0c01${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(MapPin), { class: "w-[17px] h-[17px]" }, null, _parent, _scopeId));
							_push(`</span><div data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t7)}</span><span class="contact-value" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.address)}</span></div></li>`);
						} else _push(`<!---->`);
						if (contact.value.hours) {
							_push(`<li data-v-4d2a0c01${_scopeId}><span class="contact-ico" data-v-4d2a0c01${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Clock), { class: "w-[17px] h-[17px]" }, null, _parent, _scopeId));
							_push(`</span><div data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t8)}</span><span class="contact-value" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(contact.value.hours)}</span></div></li>`);
						} else _push(`<!---->`);
						_push(`</ul>`);
						if (socials.value.length) {
							_push(`<div class="contact-socials" data-v-4d2a0c01${_scopeId}><span class="contact-term" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t9)}</span><div class="mt-2 flex flex-wrap gap-2" data-v-4d2a0c01${_scopeId}><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(socials.value, (s) => {
								_push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", s.url)} target="_blank" rel="noopener" class="contact-social" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(s.label)}</a>`);
							});
							_push(`<!--]--></div></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (contact.value.map) _push(`<div class="contact-map rounded-2xl" data-v-4d2a0c01${_scopeId}><iframe${(0, server_renderer_exports.ssrRenderAttr)("src", contact.value.map)} title="Store location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen data-v-4d2a0c01${_scopeId}></iframe></div>`);
						else _push(`<!---->`);
						_push(`</aside><div class="contact-card rounded-2xl p-6 md:p-8" data-v-4d2a0c01${_scopeId}><h2 class="body-3-sb text-[#3E3C3A] mb-5" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t10)}</h2><form class="space-y-5" data-v-4d2a0c01${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-4d2a0c01${_scopeId}><div data-v-4d2a0c01${_scopeId}><label for="email" class="block body-1-sb text-[#403E3B] mb-2" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t11)}</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.email)} type="email" placeholder="example@email.com" class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.email }, "contact-input"])}" data-v-4d2a0c01${_scopeId}>`);
						if (errors.value.email) _push(`<p class="mt-1 text-sm text-red-500" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.email)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div data-v-4d2a0c01${_scopeId}><label for="phone" class="block body-1-sb text-[#403E3B] mb-2" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t12)}</label>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PhoneField_default, {
							id: "phone",
							modelValue: form.value.phone,
							"onUpdate:modelValue": ($event) => form.value.phone = $event,
							valid: phoneValid.value,
							"onUpdate:valid": ($event) => phoneValid.value = $event,
							invalid: !!errors.value.phone
						}, null, _parent, _scopeId));
						if (errors.value.phone) _push(`<p class="mt-1 text-sm text-red-500" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.phone)}</p>`);
						else _push(`<!---->`);
						_push(`</div></div><div data-v-4d2a0c01${_scopeId}><label for="name" class="block body-1-sb text-[#403E3B] mb-2" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t13)}</label><input id="name"${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.name)} type="text" placeholder="আপনার সম্পূর্ণ নাম" class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.name }, "contact-input"])}" data-v-4d2a0c01${_scopeId}>`);
						if (errors.value.name) _push(`<p class="mt-1 text-sm text-red-500" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.name)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div data-v-4d2a0c01${_scopeId}><label for="message" class="block body-1-sb text-[#403E3B] mb-2" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t14)}</label><textarea id="message" rows="6" placeholder="আপনার বার্তা এখানে লিখুন" class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.message }, "contact-input resize-none"])}" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(form.value.message)}</textarea>`);
						if (errors.value.message) _push(`<p class="mt-1 text-sm text-red-500" data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.message)}</p>`);
						else _push(`<!---->`);
						_push(`</div><button type="submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isSubmitting.value) ? " disabled" : ""} class="w-full bg-[#1D6E13] hover:bg-[#16580f] text-white body-2-sb py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-4d2a0c01${_scopeId}>`);
						if (!isSubmitting.value) _push(`<span data-v-4d2a0c01${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t15)}</span>`);
						else _push(`<span class="flex items-center justify-center gap-2" data-v-4d2a0c01${_scopeId}><svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" data-v-4d2a0c01${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" data-v-4d2a0c01${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-4d2a0c01${_scopeId}></path></svg>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.t16)}</span>`);
						_push(`</button></form></div></div></div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", { class: "contact-page py-12 md:py-16" }, [(0, vue_exports.createVNode)("div", { class: "container max-w-6xl mx-auto px-4" }, [(0, vue_exports.createVNode)("div", { class: "text-center mb-9 md:mb-10" }, [
						(0, vue_exports.createVNode)("h1", { class: "headline-1 text-[#3E3C3A]" }, (0, vue_exports.toDisplayString)(__props.intro?.title || "যোগাযোগ করুন"), 1),
						__props.intro?.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "body-1-r text-[#6E6C69] mt-3 leading-relaxed"
						}, (0, vue_exports.toDisplayString)(__props.intro.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true),
						__props.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: "contact-intro mt-4",
							innerHTML: __props.content
						}, null, 8, ["innerHTML"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 2,
							class: "body-2-r text-[#696560] mt-4"
						}, (0, vue_exports.toDisplayString)(__props.texts.t2), 1))
					]), (0, vue_exports.createVNode)("div", { class: "contact-grid" }, [(0, vue_exports.createVNode)("aside", { class: "contact-aside" }, [(0, vue_exports.createVNode)("div", { class: "contact-card rounded-2xl p-6 md:p-7" }, [
						(0, vue_exports.createVNode)("h2", { class: "body-3-sb text-[#3E3C3A] mb-5" }, (0, vue_exports.toDisplayString)(__props.texts.t3), 1),
						(0, vue_exports.createVNode)("ul", { class: "contact-list" }, [
							contact.value.phone ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: 0 }, [(0, vue_exports.createVNode)("span", { class: "contact-ico" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Phone), { class: "w-[17px] h-[17px]" })]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t4), 1), (0, vue_exports.createVNode)("a", {
								href: telHref(contact.value.phone),
								class: "contact-value contact-link",
								dir: "ltr"
							}, (0, vue_exports.toDisplayString)(contact.value.phone), 9, ["href"])])])) : (0, vue_exports.createCommentVNode)("", true),
							whatsappHref.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: 1 }, [(0, vue_exports.createVNode)("span", { class: "contact-ico" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(MessageCircle), { class: "w-[17px] h-[17px]" })]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t5), 1), (0, vue_exports.createVNode)("a", {
								href: whatsappHref.value,
								target: "_blank",
								rel: "noopener",
								class: "contact-value contact-link",
								dir: "ltr"
							}, (0, vue_exports.toDisplayString)(contact.value.whatsapp), 9, ["href"])])])) : (0, vue_exports.createCommentVNode)("", true),
							contact.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: 2 }, [(0, vue_exports.createVNode)("span", { class: "contact-ico" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Mail), { class: "w-[17px] h-[17px]" })]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t6), 1), (0, vue_exports.createVNode)("a", {
								href: `mailto:${contact.value.email}`,
								class: "contact-value contact-link"
							}, (0, vue_exports.toDisplayString)(contact.value.email), 9, ["href"])])])) : (0, vue_exports.createCommentVNode)("", true),
							contact.value.address ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: 3 }, [(0, vue_exports.createVNode)("span", { class: "contact-ico" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(MapPin), { class: "w-[17px] h-[17px]" })]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t7), 1), (0, vue_exports.createVNode)("span", { class: "contact-value" }, (0, vue_exports.toDisplayString)(contact.value.address), 1)])])) : (0, vue_exports.createCommentVNode)("", true),
							contact.value.hours ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("li", { key: 4 }, [(0, vue_exports.createVNode)("span", { class: "contact-ico" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(Clock), { class: "w-[17px] h-[17px]" })]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t8), 1), (0, vue_exports.createVNode)("span", { class: "contact-value" }, (0, vue_exports.toDisplayString)(contact.value.hours), 1)])])) : (0, vue_exports.createCommentVNode)("", true)
						]),
						socials.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "contact-socials"
						}, [(0, vue_exports.createVNode)("span", { class: "contact-term" }, (0, vue_exports.toDisplayString)(__props.texts.t9), 1), (0, vue_exports.createVNode)("div", { class: "mt-2 flex flex-wrap gap-2" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(socials.value, (s) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("a", {
								key: s.key,
								href: s.url,
								target: "_blank",
								rel: "noopener",
								class: "contact-social"
							}, (0, vue_exports.toDisplayString)(s.label), 9, ["href"]);
						}), 128))])])) : (0, vue_exports.createCommentVNode)("", true)
					]), contact.value.map ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						class: "contact-map rounded-2xl"
					}, [(0, vue_exports.createVNode)("iframe", {
						src: contact.value.map,
						title: "Store location",
						loading: "lazy",
						referrerpolicy: "no-referrer-when-downgrade",
						allowfullscreen: ""
					}, null, 8, ["src"])])) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.createVNode)("div", { class: "contact-card rounded-2xl p-6 md:p-8" }, [(0, vue_exports.createVNode)("h2", { class: "body-3-sb text-[#3E3C3A] mb-5" }, (0, vue_exports.toDisplayString)(__props.texts.t10), 1), (0, vue_exports.createVNode)("form", {
						onSubmit: (0, vue_exports.withModifiers)(submitForm, ["prevent"]),
						class: "space-y-5"
					}, [
						(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "email",
								class: "block body-1-sb text-[#403E3B] mb-2"
							}, (0, vue_exports.toDisplayString)(__props.texts.t11), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "email",
								"onUpdate:modelValue": ($event) => form.value.email = $event,
								type: "email",
								placeholder: "example@email.com",
								class: ["contact-input", { "border-red-500": errors.value.email }]
							}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.email]]),
							errors.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.email), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]), (0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "phone",
								class: "block body-1-sb text-[#403E3B] mb-2"
							}, (0, vue_exports.toDisplayString)(__props.texts.t12), 1),
							(0, vue_exports.createVNode)(PhoneField_default, {
								id: "phone",
								modelValue: form.value.phone,
								"onUpdate:modelValue": ($event) => form.value.phone = $event,
								valid: phoneValid.value,
								"onUpdate:valid": ($event) => phoneValid.value = $event,
								invalid: !!errors.value.phone
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"valid",
								"onUpdate:valid",
								"invalid"
							]),
							errors.value.phone ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.phone), 1)) : (0, vue_exports.createCommentVNode)("", true)
						])]),
						(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "name",
								class: "block body-1-sb text-[#403E3B] mb-2"
							}, (0, vue_exports.toDisplayString)(__props.texts.t13), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "name",
								"onUpdate:modelValue": ($event) => form.value.name = $event,
								type: "text",
								placeholder: "আপনার সম্পূর্ণ নাম",
								class: ["contact-input", { "border-red-500": errors.value.name }]
							}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.name]]),
							errors.value.name ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.name), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "message",
								class: "block body-1-sb text-[#403E3B] mb-2"
							}, (0, vue_exports.toDisplayString)(__props.texts.t14), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("textarea", {
								id: "message",
								"onUpdate:modelValue": ($event) => form.value.message = $event,
								rows: "6",
								placeholder: "আপনার বার্তা এখানে লিখুন",
								class: ["contact-input resize-none", { "border-red-500": errors.value.message }]
							}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, form.value.message]]),
							errors.value.message ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.message), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("button", {
							type: "submit",
							disabled: isSubmitting.value,
							class: "w-full bg-[#1D6E13] hover:bg-[#16580f] text-white body-2-sb py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						}, [!isSubmitting.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 0 }, (0, vue_exports.toDisplayString)(__props.texts.t15), 1)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 1,
							class: "flex items-center justify-center gap-2"
						}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
							class: "animate-spin h-5 w-5",
							viewBox: "0 0 24 24"
						}, [(0, vue_exports.createVNode)("circle", {
							class: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							"stroke-width": "4",
							fill: "none"
						}), (0, vue_exports.createVNode)("path", {
							class: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						})])), (0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.t16), 1)]))], 8, ["disabled"])
					], 32)])])])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/ContactUs.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ContactUs_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-4d2a0c01"]]);
//#endregion
export { ContactUs_default as default };

//# sourceMappingURL=ContactUs-Dw766m-6.js.map