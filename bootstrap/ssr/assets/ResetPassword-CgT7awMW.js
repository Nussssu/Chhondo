import { a as useForm, c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { n as EyeOff, t as Eye } from "./eye-C7dRVfdU.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-B1dodl2Y.js";
//#region resources/js/Pages/Auth/ResetPassword.vue
var _sfc_main = {
	__name: "ResetPassword",
	__ssrInlineRender: true,
	props: {
		email: {
			type: String,
			default: ""
		},
		token: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const showPassword = (0, vue_exports.ref)(false);
		const showConfirm = (0, vue_exports.ref)(false);
		const form = useForm({
			token: props.token,
			email: props.email,
			password: "",
			password_confirmation: ""
		});
		function submit() {
			form.post("/reset-password");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-9011a9d6${_scopeId}>Reset password</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Reset password")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-form" data-v-9011a9d6${_scopeId}><h1 class="auth-title" data-v-9011a9d6${_scopeId}>Reset password</h1><p class="auth-subtitle" data-v-9011a9d6${_scopeId}>Choose a new password for your account</p><form class="auth-fields" data-v-9011a9d6${_scopeId}><div class="auth-field" data-v-9011a9d6${_scopeId}><label for="email" class="auth-label" data-v-9011a9d6${_scopeId}>Email Address</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", (0, vue_exports.unref)(form).email)} type="email" autocomplete="username" placeholder="you@example.com" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": (0, vue_exports.unref)(form).errors.email }, "auth-input"])}" autofocus data-v-9011a9d6${_scopeId}>`);
						if ((0, vue_exports.unref)(form).errors.email) _push(`<p class="auth-error" data-v-9011a9d6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).errors.email)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-9011a9d6${_scopeId}><label for="password" class="auth-label" data-v-9011a9d6${_scopeId}>New Password</label><div class="auth-input-wrap" data-v-9011a9d6${_scopeId}><input id="password"${(0, server_renderer_exports.ssrRenderDynamicModel)(showPassword.value ? "text" : "password", (0, vue_exports.unref)(form).password, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showPassword.value ? "text" : "password")} autocomplete="new-password" placeholder="At least 8 characters" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": (0, vue_exports.unref)(form).errors.password }, "auth-input"])}" data-v-9011a9d6${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showPassword.value ? "Hide password" : "Show password")} data-v-9011a9d6${_scopeId}>`);
						if (!showPassword.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if ((0, vue_exports.unref)(form).errors.password) _push(`<p class="auth-error" data-v-9011a9d6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).errors.password)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-9011a9d6${_scopeId}><label for="password_confirmation" class="auth-label" data-v-9011a9d6${_scopeId}>Confirm Password</label><div class="auth-input-wrap" data-v-9011a9d6${_scopeId}><input id="password_confirmation"${(0, server_renderer_exports.ssrRenderDynamicModel)(showConfirm.value ? "text" : "password", (0, vue_exports.unref)(form).password_confirmation, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showConfirm.value ? "text" : "password")} autocomplete="new-password" placeholder="Re-enter your new password" class="auth-input" data-v-9011a9d6${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showConfirm.value ? "Hide password" : "Show password")} data-v-9011a9d6${_scopeId}>`);
						if (!showConfirm.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if ((0, vue_exports.unref)(form).errors.password_confirmation) _push(`<p class="auth-error" data-v-9011a9d6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).errors.password_confirmation)}</p>`);
						else _push(`<!---->`);
						_push(`</div><button type="submit" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(form).processing) ? " disabled" : ""} data-v-9011a9d6${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).processing ? "Resetting..." : "Reset Password")}</button></form></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "auth-form" }, [
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, "Reset password"),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, "Choose a new password for your account"),
						(0, vue_exports.createVNode)("form", {
							onSubmit: (0, vue_exports.withModifiers)(submit, ["prevent"]),
							class: "auth-fields"
						}, [
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "email",
									class: "auth-label"
								}, "Email Address"),
								(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "email",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).email = $event,
									type: "email",
									autocomplete: "username",
									placeholder: "you@example.com",
									class: ["auth-input", { "has-error": (0, vue_exports.unref)(form).errors.email }],
									autofocus: ""
								}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, (0, vue_exports.unref)(form).email]]),
								(0, vue_exports.unref)(form).errors.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).errors.email), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "password",
									class: "auth-label"
								}, "New Password"),
								(0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "password",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
									type: showPassword.value ? "text" : "password",
									autocomplete: "new-password",
									placeholder: "At least 8 characters",
									class: ["auth-input", { "has-error": (0, vue_exports.unref)(form).errors.password }]
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
								(0, vue_exports.unref)(form).errors.password ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).errors.password), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "password_confirmation",
									class: "auth-label"
								}, "Confirm Password"),
								(0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "password_confirmation",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password_confirmation = $event,
									type: showConfirm.value ? "text" : "password",
									autocomplete: "new-password",
									placeholder: "Re-enter your new password",
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
								}))], 8, ["onClick", "aria-label"])]),
								(0, vue_exports.unref)(form).errors.password_confirmation ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).errors.password_confirmation), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("button", {
								type: "submit",
								class: "auth-submit",
								disabled: (0, vue_exports.unref)(form).processing
							}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).processing ? "Resetting..." : "Reset Password"), 9, ["disabled"])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ResetPassword.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ResetPassword_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-9011a9d6"]]);
//#endregion
export { ResetPassword_default as default };

//# sourceMappingURL=ResetPassword-CgT7awMW.js.map