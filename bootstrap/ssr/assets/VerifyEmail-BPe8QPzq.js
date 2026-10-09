import { a as useForm, c as server_renderer_exports, l as vue_exports, r as head_default } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-4uoTRlyx.js";
//#region resources/js/Pages/Auth/VerifyEmail.vue
var _sfc_main = {
	__name: "VerifyEmail",
	__ssrInlineRender: true,
	props: { status: {
		type: String,
		default: null
	} },
	setup(__props) {
		const resendForm = useForm({});
		const logoutForm = useForm({});
		function resend() {
			resendForm.post("/email/verification-notification");
		}
		function logout() {
			logoutForm.post("/logout");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-c8a7c75a${_scopeId}>Verify email</title>`);
					else return [(0, vue_exports.createVNode)("title", null, "Verify email")];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="auth-form" data-v-c8a7c75a${_scopeId}><h1 class="auth-title" data-v-c8a7c75a${_scopeId}>Verify your email</h1><p class="auth-subtitle" data-v-c8a7c75a${_scopeId}> Thanks for signing up! Before getting started, could you verify your email address by clicking the link we just emailed to you? If you didn&#39;t receive it, we&#39;ll gladly send another. </p>`);
						if (__props.status === "verification-link-sent") _push(`<div class="auth-status" data-v-c8a7c75a${_scopeId}> A new verification link has been sent to the email address you provided. </div>`);
						else _push(`<!---->`);
						_push(`<div class="auth-actions" data-v-c8a7c75a${_scopeId}><button type="button" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(resendForm).processing) ? " disabled" : ""} data-v-c8a7c75a${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(resendForm).processing ? "Sending..." : "Resend Verification Email")}</button><button type="button" class="auth-link-btn" data-v-c8a7c75a${_scopeId}>Log Out</button></div></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "auth-form" }, [
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, "Verify your email"),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, " Thanks for signing up! Before getting started, could you verify your email address by clicking the link we just emailed to you? If you didn't receive it, we'll gladly send another. "),
						__props.status === "verification-link-sent" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "auth-status"
						}, " A new verification link has been sent to the email address you provided. ")) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)("div", { class: "auth-actions" }, [(0, vue_exports.createVNode)("button", {
							type: "button",
							class: "auth-submit",
							disabled: (0, vue_exports.unref)(resendForm).processing,
							onClick: resend
						}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(resendForm).processing ? "Sending..." : "Resend Verification Email"), 9, ["disabled"]), (0, vue_exports.createVNode)("button", {
							type: "button",
							class: "auth-link-btn",
							onClick: logout
						}, "Log Out")])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/VerifyEmail.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var VerifyEmail_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-c8a7c75a"]]);
//#endregion
export { VerifyEmail_default as default };

//# sourceMappingURL=VerifyEmail-BPe8QPzq.js.map