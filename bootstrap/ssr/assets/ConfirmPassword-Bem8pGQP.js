import { a as useForm, c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { n as EyeOff, t as Eye } from "./eye-lxwiluTM.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-4uoTRlyx.js";
//#region resources/js/Pages/Auth/ConfirmPassword.vue
var _sfc_main = {
	__name: "ConfirmPassword",
	__ssrInlineRender: true,
	setup(__props) {
		const showPassword = (0, vue_exports.ref)(false);
		const form = useForm({ password: "" });
		function submit() {
			form.post("/confirm-password");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-e8c32a89${_scopeId}>Confirm password</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Confirm password")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-form" data-v-e8c32a89${_scopeId}><h1 class="auth-title" data-v-e8c32a89${_scopeId}>Confirm password</h1><p class="auth-subtitle" data-v-e8c32a89${_scopeId}>This is a secure area. Please confirm your password before continuing.</p><form class="auth-fields" data-v-e8c32a89${_scopeId}><div class="auth-field" data-v-e8c32a89${_scopeId}><label for="password" class="auth-label" data-v-e8c32a89${_scopeId}>Password</label><div class="auth-input-wrap" data-v-e8c32a89${_scopeId}><input id="password"${(0, server_renderer_exports.ssrRenderDynamicModel)(showPassword.value ? "text" : "password", (0, vue_exports.unref)(form).password, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showPassword.value ? "text" : "password")} autocomplete="current-password" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": (0, vue_exports.unref)(form).errors.password }, "auth-input"])}" autofocus data-v-e8c32a89${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showPassword.value ? "Hide password" : "Show password")} data-v-e8c32a89${_scopeId}>`);
						if (!showPassword.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if ((0, vue_exports.unref)(form).errors.password) _push(`<p class="auth-error" data-v-e8c32a89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).errors.password)}</p>`);
						else _push(`<!---->`);
						_push(`</div><button type="submit" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(form).processing) ? " disabled" : ""} data-v-e8c32a89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).processing ? "Confirming..." : "Confirm")}</button></form></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "auth-form" }, [
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, "Confirm password"),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, "This is a secure area. Please confirm your password before continuing."),
						(0, vue_exports.createVNode)("form", {
							onSubmit: (0, vue_exports.withModifiers)(submit, ["prevent"]),
							class: "auth-fields"
						}, [(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
							(0, vue_exports.createVNode)("label", {
								for: "password",
								class: "auth-label"
							}, "Password"),
							(0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								id: "password",
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
								type: showPassword.value ? "text" : "password",
								autocomplete: "current-password",
								class: ["auth-input", { "has-error": (0, vue_exports.unref)(form).errors.password }],
								autofocus: ""
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
						]), (0, vue_exports.createVNode)("button", {
							type: "submit",
							class: "auth-submit",
							disabled: (0, vue_exports.unref)(form).processing
						}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).processing ? "Confirming..." : "Confirm"), 9, ["disabled"])], 32)
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ConfirmPassword.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ConfirmPassword_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-e8c32a89"]]);
//#endregion
export { ConfirmPassword_default as default };

//# sourceMappingURL=ConfirmPassword-Bem8pGQP.js.map