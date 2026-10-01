import { a as useForm, c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { n as EyeOff, t as Eye } from "./eye-C7dRVfdU.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-B1dodl2Y.js";
import { t as PhoneField_default } from "./PhoneField-CMb3f90k.js";
//#region resources/js/Pages/Public/Auth/Registration.vue
var _sfc_main = {
	__name: "Registration",
	__ssrInlineRender: true,
	props: { reviews: {
		type: Array,
		default: () => []
	} },
	setup(__props) {
		const showPassword = (0, vue_exports.ref)(false);
		const showConfirm = (0, vue_exports.ref)(false);
		const phoneValid = (0, vue_exports.ref)(false);
		const form = useForm({
			name: "",
			email: "",
			phone: "",
			password: "",
			password_confirmation: ""
		});
		const errors = (0, vue_exports.computed)(() => form.errors);
		const handleSubmit = () => {
			if (!form.phone.trim()) {
				form.setError("phone", "Enter your phone number");
				return;
			}
			if (!phoneValid.value) {
				form.setError("phone", "Enter a valid phone number");
				return;
			}
			form.clearErrors("phone");
			form.post("/auth/register");
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-084af284${_scopeId}>Create account</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Create account")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, { reviews: __props.reviews }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-form" data-v-084af284${_scopeId}><h1 class="auth-title" data-v-084af284${_scopeId}>Create account</h1><p class="auth-subtitle" data-v-084af284${_scopeId}>Create an account to continue shopping</p><form class="auth-fields" data-v-084af284${_scopeId}><div class="auth-field" data-v-084af284${_scopeId}><label for="name" class="auth-label" data-v-084af284${_scopeId}>Full Name</label><input id="name"${(0, server_renderer_exports.ssrRenderAttr)("value", (0, vue_exports.unref)(form).name)} type="text" autocomplete="name" placeholder="Your full name" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": errors.value.name }, "auth-input"])}" data-v-084af284${_scopeId}>`);
						if (errors.value.name) _push(`<p class="auth-error" data-v-084af284${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.name)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-084af284${_scopeId}><label for="email" class="auth-label" data-v-084af284${_scopeId}>Email Address</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", (0, vue_exports.unref)(form).email)} type="email" autocomplete="email" placeholder="you@example.com" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": errors.value.email }, "auth-input"])}" data-v-084af284${_scopeId}>`);
						if (errors.value.email) _push(`<p class="auth-error" data-v-084af284${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.email)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-084af284${_scopeId}><label for="phone" class="auth-label" data-v-084af284${_scopeId}>Phone number</label>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(PhoneField_default, {
							id: "phone",
							modelValue: (0, vue_exports.unref)(form).phone,
							"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).phone = $event,
							valid: phoneValid.value,
							"onUpdate:valid": ($event) => phoneValid.value = $event,
							invalid: !!errors.value.phone
						}, null, _parent, _scopeId));
						if (errors.value.phone) _push(`<p class="auth-error" data-v-084af284${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.phone)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-grid" data-v-084af284${_scopeId}><div class="auth-field" data-v-084af284${_scopeId}><label for="password" class="auth-label" data-v-084af284${_scopeId}>Password</label><div class="auth-input-wrap" data-v-084af284${_scopeId}><input id="password"${(0, server_renderer_exports.ssrRenderDynamicModel)(showPassword.value ? "text" : "password", (0, vue_exports.unref)(form).password, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showPassword.value ? "text" : "password")} autocomplete="new-password" placeholder="At least 8 characters" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": errors.value.password }, "auth-input"])}" data-v-084af284${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showPassword.value ? "Hide password" : "Show password")} data-v-084af284${_scopeId}>`);
						if (!showPassword.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if (errors.value.password) _push(`<p class="auth-error" data-v-084af284${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.password)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-084af284${_scopeId}><label for="password_confirmation" class="auth-label" data-v-084af284${_scopeId}>Confirm Password</label><div class="auth-input-wrap" data-v-084af284${_scopeId}><input id="password_confirmation"${(0, server_renderer_exports.ssrRenderDynamicModel)(showConfirm.value ? "text" : "password", (0, vue_exports.unref)(form).password_confirmation, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showConfirm.value ? "text" : "password")} autocomplete="new-password" placeholder="Re-enter your password" class="auth-input" data-v-084af284${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showConfirm.value ? "Hide password" : "Show password")} data-v-084af284${_scopeId}>`);
						if (!showConfirm.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div></div></div><button type="submit" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(form).processing) ? " disabled" : ""} data-v-084af284${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).processing ? "Creating account..." : "Create account")}</button><p class="auth-switch" data-v-084af284${_scopeId}> Already have an account? `);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/login",
							class: "auth-link"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Log in`);
								else return [(0, vue_exports.createTextVNode)("Log in")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</p></form></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "auth-form" }, [
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, "Create account"),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, "Create an account to continue shopping"),
						(0, vue_exports.createVNode)("form", {
							onSubmit: (0, vue_exports.withModifiers)(handleSubmit, ["prevent"]),
							class: "auth-fields"
						}, [
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "name",
									class: "auth-label"
								}, "Full Name"),
								(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "name",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).name = $event,
									type: "text",
									autocomplete: "name",
									placeholder: "Your full name",
									class: ["auth-input", { "has-error": errors.value.name }]
								}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, (0, vue_exports.unref)(form).name]]),
								errors.value.name ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)(errors.value.name), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "email",
									class: "auth-label"
								}, "Email Address"),
								(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "email",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).email = $event,
									type: "email",
									autocomplete: "email",
									placeholder: "you@example.com",
									class: ["auth-input", { "has-error": errors.value.email }]
								}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, (0, vue_exports.unref)(form).email]]),
								errors.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)(errors.value.email), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "phone",
									class: "auth-label"
								}, "Phone number"),
								(0, vue_exports.createVNode)(PhoneField_default, {
									id: "phone",
									modelValue: (0, vue_exports.unref)(form).phone,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).phone = $event,
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
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)(errors.value.phone), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-grid" }, [(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "password",
									class: "auth-label"
								}, "Password"),
								(0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "password",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
									type: showPassword.value ? "text" : "password",
									autocomplete: "new-password",
									placeholder: "At least 8 characters",
									class: ["auth-input", { "has-error": errors.value.password }]
								}, null, 10, ["onUpdate:modelValue", "type"]), [[vue_exports.vModelDynamic, (0, vue_exports.unref)(form).password]]), (0, vue_exports.createVNode)("button", {
									type: "button",
									class: "auth-eye",
									onClick: ($event) => showPassword.value = !showPassword.value,
									"aria-label": showPassword.value ? "Hide password" : "Show password"
								}, [!showPassword.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Eye), {
									key: 0,
									class: "h-5 w-5"
								})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(EyeOff), {
									key: 1,
									class: "h-5 w-5"
								}))], 8, ["onClick", "aria-label"])]),
								errors.value.password ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)(errors.value.password), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]), (0, vue_exports.createVNode)("div", { class: "auth-field" }, [(0, vue_exports.createVNode)("label", {
								for: "password_confirmation",
								class: "auth-label"
							}, "Confirm Password"), (0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "password_confirmation",
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password_confirmation = $event,
								type: showConfirm.value ? "text" : "password",
								autocomplete: "new-password",
								placeholder: "Re-enter your password",
								class: "auth-input"
							}, null, 8, ["onUpdate:modelValue", "type"]), [[vue_exports.vModelDynamic, (0, vue_exports.unref)(form).password_confirmation]]), (0, vue_exports.createVNode)("button", {
								type: "button",
								class: "auth-eye",
								onClick: ($event) => showConfirm.value = !showConfirm.value,
								"aria-label": showConfirm.value ? "Hide password" : "Show password"
							}, [!showConfirm.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Eye), {
								key: 0,
								class: "h-5 w-5"
							})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(EyeOff), {
								key: 1,
								class: "h-5 w-5"
							}))], 8, ["onClick", "aria-label"])])])]),
							(0, vue_exports.createVNode)("button", {
								type: "submit",
								class: "auth-submit",
								disabled: (0, vue_exports.unref)(form).processing
							}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).processing ? "Creating account..." : "Create account"), 9, ["disabled"]),
							(0, vue_exports.createVNode)("p", { class: "auth-switch" }, [(0, vue_exports.createTextVNode)(" Already have an account? "), (0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
								href: "/login",
								class: "auth-link"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)("Log in")]),
								_: 1
							})])
						], 32)
					])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Auth/Registration.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Registration_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-084af284"]]);
//#endregion
export { Registration_default as default };

//# sourceMappingURL=Registration-CBF5S4Lt.js.map