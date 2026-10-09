import { a as useForm, c as server_renderer_exports, i as link_default, l as vue_exports, r as head_default } from "../ssr.js";
import { n as EyeOff, t as Eye } from "./eye-lxwiluTM.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { t as AuthShowcaseLayout_default } from "./AuthShowcaseLayout-4uoTRlyx.js";
import { t as on } from "./cms-BWXg6J9T.js";
//#region resources/js/Pages/Public/Auth/Login.vue
var _sfc_main = {
	__name: "Login",
	__ssrInlineRender: true,
	props: {
		blocks: {
			type: Array,
			default: () => []
		},
		reviews: {
			type: Array,
			default: () => []
		},
		texts: {
			type: Object,
			default: () => ({})
		},
		status: {
			type: String,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const photos = (0, vue_exports.computed)(() => [
			1,
			2,
			3,
			4
		].map((n) => props.texts[`collage_photo_${n}`]));
		const showPassword = (0, vue_exports.ref)(false);
		const form = useForm({
			email: "",
			password: "",
			remember: false
		});
		const errors = (0, vue_exports.computed)(() => form.errors);
		const handleSubmit = () => {
			form.post("/auth/login");
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_tab_title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(__props.texts.login_tab_title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AuthShowcaseLayout_default, {
				reviews: __props.reviews,
				photos: photos.value,
				blocks: __props.blocks,
				"show-photos": (0, vue_exports.unref)(on)(__props.texts.collage_show),
				"hide-footer": ""
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) if ((0, vue_exports.unref)(on)(__props.texts.login_show)) {
						_push(`<div class="auth-form" data-v-93161d89${_scopeId}><h1 class="auth-title" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_title)}</h1><p class="auth-subtitle" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_subtitle)}</p>`);
						if (__props.status) _push(`<div class="auth-status" role="status" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.status)}</div>`);
						else _push(`<!---->`);
						_push(`<form class="auth-fields" data-v-93161d89${_scopeId}><div class="auth-field" data-v-93161d89${_scopeId}><label for="email" class="auth-label" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_email_label)}</label><input id="email"${(0, server_renderer_exports.ssrRenderAttr)("value", (0, vue_exports.unref)(form).email)} type="email" autocomplete="email" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": errors.value.email }, "auth-input"])}" data-v-93161d89${_scopeId}>`);
						if (errors.value.email) _push(`<p class="auth-error" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.email)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-field" data-v-93161d89${_scopeId}><label for="password" class="auth-label" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_password_label)}</label><div class="auth-input-wrap" data-v-93161d89${_scopeId}><input id="password"${(0, server_renderer_exports.ssrRenderDynamicModel)(showPassword.value ? "text" : "password", (0, vue_exports.unref)(form).password, null)}${(0, server_renderer_exports.ssrRenderAttr)("type", showPassword.value ? "text" : "password")} autocomplete="current-password" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-error": errors.value.password }, "auth-input"])}" data-v-93161d89${_scopeId}><button type="button" class="auth-eye"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", showPassword.value ? "Hide password" : "Show password")} data-v-93161d89${_scopeId}>`);
						if (!showPassword.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Eye), { class: "h-5 w-5" }, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(EyeOff), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if (errors.value.password) _push(`<p class="auth-error" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(errors.value.password)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div class="auth-row" data-v-93161d89${_scopeId}>`);
						if ((0, vue_exports.unref)(on)(__props.texts.login_remember_show)) _push(`<label class="auth-remember" data-v-93161d89${_scopeId}><input type="checkbox"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray((0, vue_exports.unref)(form).remember) ? (0, server_renderer_exports.ssrLooseContain)((0, vue_exports.unref)(form).remember, null) : (0, vue_exports.unref)(form).remember) ? " checked" : ""} class="auth-checkbox" data-v-93161d89${_scopeId}><span data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_remember)}</span></label>`);
						else _push(`<!---->`);
						if ((0, vue_exports.unref)(on)(__props.texts.login_forgot_show)) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/forgot-password",
							class: "auth-forgot"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_forgot)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.login_forgot), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div><button type="submit" class="auth-submit"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(form).processing) ? " disabled" : ""} data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(form).processing ? __props.texts.login_loading : __props.texts.login_button)}</button>`);
						if ((0, vue_exports.unref)(on)(__props.texts.login_switch_show)) {
							_push(`<p class="auth-switch" data-v-93161d89${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_switch_text)} `);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								href: "/register",
								class: "auth-link"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.texts.login_switch_link)}`);
									else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.login_switch_link), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</p>`);
						} else _push(`<!---->`);
						_push(`</form></div>`);
					} else _push(`<!---->`);
					else return [(0, vue_exports.unref)(on)(__props.texts.login_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						class: "auth-form"
					}, [
						(0, vue_exports.createVNode)("h1", { class: "auth-title" }, (0, vue_exports.toDisplayString)(__props.texts.login_title), 1),
						(0, vue_exports.createVNode)("p", { class: "auth-subtitle" }, (0, vue_exports.toDisplayString)(__props.texts.login_subtitle), 1),
						__props.status ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "auth-status",
							role: "status"
						}, (0, vue_exports.toDisplayString)(__props.status), 1)) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)("form", {
							onSubmit: (0, vue_exports.withModifiers)(handleSubmit, ["prevent"]),
							class: "auth-fields"
						}, [
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "email",
									class: "auth-label"
								}, (0, vue_exports.toDisplayString)(__props.texts.login_email_label), 1),
								(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "email",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).email = $event,
									type: "email",
									autocomplete: "email",
									class: ["auth-input", { "has-error": errors.value.email }]
								}, null, 10, ["onUpdate:modelValue"]), [[vue_exports.vModelText, (0, vue_exports.unref)(form).email]]),
								errors.value.email ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
									key: 0,
									class: "auth-error"
								}, (0, vue_exports.toDisplayString)(errors.value.email), 1)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-field" }, [
								(0, vue_exports.createVNode)("label", {
									for: "password",
									class: "auth-label"
								}, (0, vue_exports.toDisplayString)(__props.texts.login_password_label), 1),
								(0, vue_exports.createVNode)("div", { class: "auth-input-wrap" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
									id: "password",
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
									type: showPassword.value ? "text" : "password",
									autocomplete: "current-password",
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
							]),
							(0, vue_exports.createVNode)("div", { class: "auth-row" }, [(0, vue_exports.unref)(on)(__props.texts.login_remember_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("label", {
								key: 0,
								class: "auth-remember"
							}, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								type: "checkbox",
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).remember = $event,
								class: "auth-checkbox"
							}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelCheckbox, (0, vue_exports.unref)(form).remember]]), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.texts.login_remember), 1)])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(on)(__props.texts.login_forgot_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: 1,
								href: "/forgot-password",
								class: "auth-forgot"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.login_forgot), 1)]),
								_: 1
							})) : (0, vue_exports.createCommentVNode)("", true)]),
							(0, vue_exports.createVNode)("button", {
								type: "submit",
								class: "auth-submit",
								disabled: (0, vue_exports.unref)(form).processing
							}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(form).processing ? __props.texts.login_loading : __props.texts.login_button), 9, ["disabled"]),
							(0, vue_exports.unref)(on)(__props.texts.login_switch_show) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
								key: 0,
								class: "auth-switch"
							}, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.login_switch_text) + " ", 1), (0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
								href: "/register",
								class: "auth-link"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.texts.login_switch_link), 1)]),
								_: 1
							})])) : (0, vue_exports.createCommentVNode)("", true)
						], 32)
					])) : (0, vue_exports.createCommentVNode)("", true)];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Auth/Login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-93161d89"]]);
//#endregion
export { Login_default as default };

//# sourceMappingURL=Login-BpRkxoVG.js.map