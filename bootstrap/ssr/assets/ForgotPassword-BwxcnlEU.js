import { a as useForm, c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-B1dodl2Y.js";
//#region resources/js/Pages/Auth/ForgotPassword.vue
var _sfc_main = {
	__name: "ForgotPassword",
	__ssrInlineRender: true,
	props: { status: {
		type: String,
		default: null
	} },
	setup(__props) {
		const form = useForm({ email: "" });
		function submit() {
			form.post("/forgot-password");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-b4273db4${_scopeId}>Forgot password</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Forgot password")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-form" data-v-b4273db4${_scopeId}><h1 class="auth-title" data-v-b4273db4${_scopeId}>Forgot your password?</h1><p class="auth-subtitle" data-v-b4273db4${_scopeId}>No problem. Enter your email and we&#39;ll send you a link to reset it.</p>`);
						if (__props.status) _push(`<div class="auth-status" data-v-b4273db4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.status)}</div>`);
						else _push(`<!---->`);
						_push(`<form class="auth-fields" data-v-b4273db4${_scopeId}><div class="auth-field" data-v-b4273db4${_scopeId}><label for="email" class="auth-label" data-v-b4273db4${_scopeId}>Email Address</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", (0, vue_exports.unref)(form).email)} type="email" autocomplete="email" placeholder="you@example.com" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": (0, vue_exports.unref)(form).errors.email }, "auth-input"])}" autofocus data-v-b4273db4${_scopeId}>`);
						if ((0, vue_exports.unref)(form).errors.email) _push(`<p class="auth-error" data-v-b4273db4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).errors.email)}</p>`);
						else _push(`<!---->`);
						_push(`</div><button type="submit" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(form).processing) ? " disabled" : ""} data-v-b4273db4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).processing ? "Sending..." : "Email Password Reset Link")}</button><p class="auth-switch" data-v-b4273db4${_scopeId}> Remembered your password? `);
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
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, "Forgot your password?"),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, "No problem. Enter your email and we'll send you a link to reset it."),
						__props.status ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "auth-status"
						}, (0, vue_exports.toDisplayString)(__props.status), 1)) : (0, vue_exports.createCommentVNode)("", true),
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
									autocomplete: "email",
									placeholder: "you@example.com",
									class: ["auth-input", { "has-error": (0, vue_exports.unref)(form).errors.email }],
									autofocus: ""
								}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, (0, vue_exports.unref)(form).email]]),
								(0, vue_exports.unref)(form).errors.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).errors.email), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("button", {
								type: "submit",
								class: "auth-submit",
								disabled: (0, vue_exports.unref)(form).processing
							}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).processing ? "Sending..." : "Email Password Reset Link"), 9, ["disabled"]),
							(0, vue_exports.createVNode)("p", { class: "auth-switch" }, [(0, vue_exports.createTextVNode)(" Remembered your password? "), (0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ForgotPassword.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ForgotPassword_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-b4273db4"]]);
//#endregion
export { ForgotPassword_default as default };

//# sourceMappingURL=ForgotPassword-BwxcnlEU.js.map