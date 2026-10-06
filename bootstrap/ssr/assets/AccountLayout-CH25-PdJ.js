import { c as server_renderer_exports, i as link_default, l as vue_exports, o as usePage } from "../ssr.js";
import { t as _sfc_main$2, u as useAuthStore } from "./AppLayout-ochFaCc-.js";
import { t as ChevronRight } from "./chevron-right-D3yEXXmI.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region resources/js/components/Account/Sidebar.vue
var _sfc_main$1 = {
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const authStore = useAuthStore();
		const page = usePage();
		const navItems = [
			{
				href: "/account",
				label: "My Profile",
				labelBn: "প্রোফাইল",
				icon: "/assets/images/account/nav-profile.svg"
			},
			{
				href: "/account/orders",
				label: "Order History",
				labelBn: "অর্ডার ইতিহাস",
				icon: "/assets/images/account/nav-order-history.svg"
			},
			{
				href: "/account/wishlist",
				label: "Wishlist",
				labelBn: "পছন্দের তালিকা",
				icon: "/assets/images/account/nav-wishlist.svg"
			},
			{
				href: "/account/track-order",
				label: "Track Order",
				labelBn: "অর্ডার ট্র্যাক",
				icon: "/assets/images/account/nav-track-order.svg"
			}
		];
		const isActive = (href) => page.url === href || href !== "/account" && page.url.startsWith(href);
		const strip = (0, vue_exports.ref)(null);
		const canScrollRight = (0, vue_exports.ref)(false);
		/** Whether anything is still hidden off the right edge of the strip. */
		function updateScrollHints() {
			const el = strip.value;
			if (!el) return;
			canScrollRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
		}
		(0, vue_exports.onMounted)(async () => {
			await (0, vue_exports.nextTick)();
			updateScrollHints();
			window.addEventListener("resize", updateScrollHints);
		});
		(0, vue_exports.onBeforeUnmount)(() => window.removeEventListener("resize", updateScrollHints));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "account-sidenav" }, _attrs))} data-v-8aab36c4><div class="account-sidenav-scroller" data-v-8aab36c4><div class="account-sidenav-items" data-v-8aab36c4><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(navItems, (item) => {
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					key: item.href,
					href: item.href,
					class: ["account-sidenav-item", { "is-active": isActive(item.href) }]
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<span class="account-sidenav-icon" data-v-8aab36c4${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.icon)} alt="" data-v-8aab36c4${_scopeId}></span><span class="account-sidenav-labels" data-v-8aab36c4${_scopeId}><span class="account-sidenav-label" data-v-8aab36c4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.label)}</span><span class="account-sidenav-sublabel" data-v-8aab36c4${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.labelBn)}</span></span>`);
							if (isActive(item.href)) _push(`<span class="account-sidenav-accent" data-v-8aab36c4${_scopeId}></span>`);
							else _push(`<!---->`);
						} else return [
							(0, vue_exports.createVNode)("span", { class: "account-sidenav-icon" }, [(0, vue_exports.createVNode)("img", {
								src: item.icon,
								alt: ""
							}, null, 8, ["src"])]),
							(0, vue_exports.createVNode)("span", { class: "account-sidenav-labels" }, [(0, vue_exports.createVNode)("span", { class: "account-sidenav-label" }, (0, vue_exports.toDisplayString)(item.label), 1), (0, vue_exports.createVNode)("span", { class: "account-sidenav-sublabel" }, (0, vue_exports.toDisplayString)(item.labelBn), 1)]),
							isActive(item.href) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								class: "account-sidenav-accent"
							})) : (0, vue_exports.createCommentVNode)("", true)
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div>`);
			if (canScrollRight.value) {
				_push(`<span class="account-sidenav-hint" aria-hidden="true" data-v-8aab36c4>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronRight), { size: 16 }, null, _parent));
				_push(`</span>`);
			} else _push(`<!---->`);
			_push(`</div><div class="account-sidenav-divider" data-v-8aab36c4>`);
			if ((0, vue_exports.unref)(authStore).isAuthenticated) _push(`<button type="button" class="account-signout-btn" data-v-8aab36c4><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/sign-out.svg")} alt="" class="account-signout-icon" data-v-8aab36c4> সাইন আউট </button>`);
			else _push(`<!---->`);
			_push(`</div></nav>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Account/Sidebar.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Sidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-8aab36c4"]]);
//#endregion
//#region resources/js/Layouts/AccountLayout.vue
var _sfc_main = {
	__name: "AccountLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const authStore = useAuthStore();
		const firstName = (0, vue_exports.computed)(() => authStore.user?.name?.split(" ")[0] || "there");
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, _attrs, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="account-shell" data-v-67b39baf${_scopeId}><div class="account-titlebar" data-v-67b39baf${_scopeId}><div class="account-titlebar-inner" data-v-67b39baf${_scopeId}><div data-v-67b39baf${_scopeId}><p class="account-eyebrow" data-v-67b39baf${_scopeId}>আমার অ্যাকাউন্ট</p><h1 class="account-heading" data-v-67b39baf${_scopeId}>ফিরে আসায় স্বাগতম, ${(0, server_renderer_exports.ssrInterpolate)(firstName.value)} 👋</h1></div><div class="account-titlebar-actions" data-v-67b39baf${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: "/shop",
							class: "account-back-btn"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/back-to-shop.svg")} alt="" class="account-back-icon" data-v-67b39baf${_scopeId}> শপে ফিরে যান `);
								else return [(0, vue_exports.createVNode)("img", {
									src: "/assets/images/account/back-to-shop.svg",
									alt: "",
									class: "account-back-icon"
								}), (0, vue_exports.createTextVNode)(" শপে ফিরে যান ")];
							}),
							_: 1
						}, _parent, _scopeId));
						if ((0, vue_exports.unref)(authStore).isAuthenticated) _push(`<button type="button" class="account-signout-top" data-v-67b39baf${_scopeId}><img${(0, server_renderer_exports.ssrRenderAttr)("src", "/assets/images/account/sign-out.svg")} alt="" class="account-signout-icon" data-v-67b39baf${_scopeId}> সাইন আউট </button>`);
						else _push(`<!---->`);
						_push(`</div></div></div><div class="account-body" data-v-67b39baf${_scopeId}><aside class="account-sidebar" data-v-67b39baf${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(Sidebar_default, null, null, _parent, _scopeId));
						_push(`</aside><main class="account-main" data-v-67b39baf${_scopeId}>`);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						_push(`</main></div></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "account-shell" }, [(0, vue_exports.createVNode)("div", { class: "account-titlebar" }, [(0, vue_exports.createVNode)("div", { class: "account-titlebar-inner" }, [(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "account-eyebrow" }, "আমার অ্যাকাউন্ট"), (0, vue_exports.createVNode)("h1", { class: "account-heading" }, "ফিরে আসায় স্বাগতম, " + (0, vue_exports.toDisplayString)(firstName.value) + " 👋", 1)]), (0, vue_exports.createVNode)("div", { class: "account-titlebar-actions" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(link_default), {
						href: "/shop",
						class: "account-back-btn"
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
							src: "/assets/images/account/back-to-shop.svg",
							alt: "",
							class: "account-back-icon"
						}), (0, vue_exports.createTextVNode)(" শপে ফিরে যান ")]),
						_: 1
					}), (0, vue_exports.unref)(authStore).isAuthenticated ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
						key: 0,
						type: "button",
						class: "account-signout-top",
						onClick: (0, vue_exports.unref)(authStore).logout
					}, [(0, vue_exports.createVNode)("img", {
						src: "/assets/images/account/sign-out.svg",
						alt: "",
						class: "account-signout-icon"
					}), (0, vue_exports.createTextVNode)(" সাইন আউট ")], 8, ["onClick"])) : (0, vue_exports.createCommentVNode)("", true)])])]), (0, vue_exports.createVNode)("div", { class: "account-body" }, [(0, vue_exports.createVNode)("aside", { class: "account-sidebar" }, [(0, vue_exports.createVNode)(Sidebar_default)]), (0, vue_exports.createVNode)("main", { class: "account-main" }, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, void 0, true)])])])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AccountLayout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AccountLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-67b39baf"]]);
//#endregion
export { AccountLayout_default as t };

//# sourceMappingURL=AccountLayout-CH25-PdJ.js.map