import { c as server_renderer_exports, l as vue_exports, r as head_default, s as router } from "../ssr.js";
import { d as p, t as AppLayout_default } from "./AppLayout-CNqlOJ3L.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as PageBlocks_default } from "./PageBlocks-P8L_ue1k.js";
import { n as plain, t as on } from "./cms-BWXg6J9T.js";
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
		const props = __props;
		const t = (0, vue_exports.computed)(() => props.texts || {});
		const form = (0, vue_exports.ref)({
			name: "",
			email: "",
			phone: "",
			message: ""
		});
		const errors = (0, vue_exports.ref)({});
		const isSubmitting = (0, vue_exports.ref)(false);
		const validateForm = () => {
			errors.value = {};
			if (!form.value.name.trim()) errors.value.name = "নাম লিখুন";
			if (!form.value.email.trim()) errors.value.email = "ইমেইল লিখুন";
			else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = "সঠিক ইমেইল দিন";
			if (!form.value.phone.trim()) errors.value.phone = "ফোন নম্বর লিখুন";
			else if (!/^\+?[0-9]{8,15}$/.test(form.value.phone.replace(/[\s()-]/g, ""))) errors.value.phone = "সঠিক ফোন নম্বর দিন";
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
					if (_push) _push(`<title data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(plain)(t.value.tab_title))}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(plain)(t.value.tab_title)), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="contact-page" data-v-275b75eb${_scopeId}><div class="container" data-v-275b75eb${_scopeId}><div class="contact-head" data-v-275b75eb${_scopeId}><h1 class="contact-title" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro.title || (0, vue_exports.unref)(plain)(t.value.tab_title))}</h1>`);
						if (__props.intro.subtitle) _push(`<p class="contact-sub" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.intro.subtitle)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if ((0, vue_exports.unref)(on)(t.value.form_show)) {
							_push(`<div class="contact-card" data-v-275b75eb${_scopeId}><h2 class="contact-card-title" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.card_title)}</h2><form class="contact-form" data-v-275b75eb${_scopeId}><div class="contact-row" data-v-275b75eb${_scopeId}><div data-v-275b75eb${_scopeId}><label for="email" class="contact-label" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.email_label)}</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.email)} type="email"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", t.value.email_placeholder)} class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.email }, "contact-input"])}" data-v-275b75eb${_scopeId}>`);
							if (errors.value.email) _push(`<p class="mt-1 text-sm text-red-500" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.email)}</p>`);
							else if ((0, vue_exports.unref)(on)(t.value.email_hint_show) && t.value.email_hint) _push(`<p class="contact-hint" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.email_hint)}</p>`);
							else _push(`<!---->`);
							_push(`</div><div data-v-275b75eb${_scopeId}><label for="phone" class="contact-label" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.phone_label)}</label><input id="phone"${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.phone)} type="tel" inputmode="tel"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", t.value.phone_placeholder)} class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.phone }, "contact-input contact-input--latin"])}" data-v-275b75eb${_scopeId}>`);
							if (errors.value.phone) _push(`<p class="mt-1 text-sm text-red-500" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.phone)}</p>`);
							else _push(`<!---->`);
							_push(`</div></div><div data-v-275b75eb${_scopeId}><label for="name" class="contact-label" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.name_label)}</label><input id="name"${(0, server_renderer_exports.ssrRenderAttr)("value", form.value.name)} type="text"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", t.value.name_placeholder)} class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.name }, "contact-input"])}" data-v-275b75eb${_scopeId}>`);
							if (errors.value.name) _push(`<p class="mt-1 text-sm text-red-500" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.name)}</p>`);
							else _push(`<!---->`);
							_push(`</div><div data-v-275b75eb${_scopeId}><label for="message" class="contact-label" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(t.value.message_label)}</label><textarea id="message" rows="5"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", t.value.message_placeholder)} class="${(0, server_renderer_exports.ssrRenderClass)([{ "border-red-500": errors.value.message }, "contact-input contact-textarea resize-none"])}" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(form.value.message)}</textarea>`);
							if (errors.value.message) _push(`<p class="mt-1 text-sm text-red-500" data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.message)}</p>`);
							else _push(`<!---->`);
							_push(`</div><button type="submit" class="contact-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isSubmitting.value) ? " disabled" : ""} data-v-275b75eb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(isSubmitting.value ? t.value.sending_label : t.value.submit_label)}</button></form></div>`);
						} else _push(`<!---->`);
						_push(`</div></section>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)("section", { class: "contact-page" }, [(0, vue_exports.createVNode)("div", { class: "container" }, [(0, vue_exports.createVNode)("div", { class: "contact-head" }, [(0, vue_exports.createVNode)("h1", { class: "contact-title" }, (0, vue_exports.toDisplayString)(__props.intro.title || (0, vue_exports.unref)(plain)(t.value.tab_title)), 1), __props.intro.subtitle ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
						key: 0,
						class: "contact-sub"
					}, (0, vue_exports.toDisplayString)(__props.intro.subtitle), 1)) : (0, vue_exports.createCommentVNode)("", true)]), (0, vue_exports.unref)(on)(t.value.form_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						class: "contact-card"
					}, [(0, vue_exports.createVNode)("h2", { class: "contact-card-title" }, (0, vue_exports.toDisplayString)(t.value.card_title), 1), (0, vue_exports.createVNode)("form", {
						onSubmit: (0, vue_exports.withModifiers)(submitForm, ["prevent"]),
						class: "contact-form"
					}, [
						(0, vue_exports.createVNode)("div", { class: "contact-row" }, [(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "email",
								class: "contact-label"
							}, (0, vue_exports.toDisplayString)(t.value.email_label), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "email",
								"onUpdate:modelValue": ($event) => form.value.email = $event,
								type: "email",
								placeholder: t.value.email_placeholder,
								class: ["contact-input", { "border-red-500": errors.value.email }]
							}, null, 10, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, form.value.email]]),
							errors.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.email), 1)) : (0, vue_exports.unref)(on)(t.value.email_hint_show) && t.value.email_hint ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 1,
								class: "contact-hint"
							}, (0, vue_exports.toDisplayString)(t.value.email_hint), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]), (0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "phone",
								class: "contact-label"
							}, (0, vue_exports.toDisplayString)(t.value.phone_label), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "phone",
								"onUpdate:modelValue": ($event) => form.value.phone = $event,
								type: "tel",
								inputmode: "tel",
								placeholder: t.value.phone_placeholder,
								class: ["contact-input contact-input--latin", { "border-red-500": errors.value.phone }]
							}, null, 10, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, form.value.phone]]),
							errors.value.phone ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.phone), 1)) : (0, vue_exports.createCommentVNode)("", true)
						])]),
						(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "name",
								class: "contact-label"
							}, (0, vue_exports.toDisplayString)(t.value.name_label), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "name",
								"onUpdate:modelValue": ($event) => form.value.name = $event,
								type: "text",
								placeholder: t.value.name_placeholder,
								class: ["contact-input", { "border-red-500": errors.value.name }]
							}, null, 10, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, form.value.name]]),
							errors.value.name ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.name), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("label", {
								for: "message",
								class: "contact-label"
							}, (0, vue_exports.toDisplayString)(t.value.message_label), 1),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("textarea", {
								id: "message",
								"onUpdate:modelValue": ($event) => form.value.message = $event,
								rows: "5",
								placeholder: t.value.message_placeholder,
								class: ["contact-input contact-textarea resize-none", { "border-red-500": errors.value.message }]
							}, null, 10, ["onUpdate:modelValue", "placeholder"]), [[vue_exports.vModelText, form.value.message]]),
							errors.value.message ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "mt-1 text-sm text-red-500"
							}, (0, vue_exports.toDisplayString)(errors.value.message), 1)) : (0, vue_exports.createCommentVNode)("", true)
						]),
						(0, vue_exports.createVNode)("button", {
							type: "submit",
							class: "contact-submit",
							disabled: isSubmitting.value
						}, (0, vue_exports.toDisplayString)(isSubmitting.value ? t.value.sending_label : t.value.submit_label), 9, ["disabled"])
					], 32)])) : (0, vue_exports.createCommentVNode)("", true)])]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
var ContactUs_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-275b75eb"]]);
//#endregion
export { ContactUs_default as default };

//# sourceMappingURL=ContactUs-Bg0nWVPD.js.map