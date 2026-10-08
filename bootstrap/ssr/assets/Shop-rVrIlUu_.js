import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { t as AppLayout_default } from "./AppLayout-BWP1wqVC.js";
import { t as ProductArchive_default } from "./ProductArchive-Bou6I8y9.js";
import { t as PageBlocks_default } from "./PageBlocks-Dph-EDgn.js";
//#region resources/js/Pages/Public/Product/Shop.vue
var _sfc_main = {
	__name: "Shop",
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
		}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const products = (0, vue_exports.computed)(() => page.props.products || []);
		const currentPage = (0, vue_exports.computed)(() => page.props.currentPage || 1);
		const lastPage = (0, vue_exports.computed)(() => page.props.lastPage || 1);
		const total = (0, vue_exports.computed)(() => page.props.total || 0);
		const categories = (0, vue_exports.computed)(() => page.props.filterCategories || []);
		const attributes = (0, vue_exports.computed)(() => page.props.filterAttributes || []);
		const initialFilters = (0, vue_exports.computed)(() => page.props.filters || {});
		const isLoading = (0, vue_exports.ref)(false);
		const activeCategoryName = (0, vue_exports.computed)(() => {
			const id = page.props.filters?.category_id;
			if (!id) return null;
			return categories.value.find((c) => String(c.id) === String(id))?.name || null;
		});
		const shopTexts = (0, vue_exports.computed)(() => props.texts || {});
		const title = (0, vue_exports.computed)(() => {
			if (activeCategoryName.value) return (shopTexts.value.category_title || "{category}").replace("{category}", activeCategoryName.value);
			return props.intro?.title || "";
		});
		const description = (0, vue_exports.computed)(() => props.intro?.subtitle || "");
		const breadcrumbs = (0, vue_exports.computed)(() => {
			const crumbs = [{
				label: shopTexts.value.breadcrumb,
				href: "/shop"
			}];
			if (activeCategoryName.value) crumbs.push({
				label: activeCategoryName.value,
				href: null
			});
			return crumbs;
		});
		const currentFilters = (0, vue_exports.ref)({ ...initialFilters.value });
		const buildParams = (extra = {}) => {
			const f = currentFilters.value;
			const params = {
				per_page: 12,
				min_price: f.min_price,
				max_price: f.max_price,
				...extra
			};
			if (page.props.filters?.category_id) params.category_id = page.props.filters.category_id;
			if (f.sort) params.sort = f.sort;
			if (f.attributes && Object.keys(f.attributes).length) params.attributes = f.attributes;
			return params;
		};
		const navigate = (extra, preserveScroll = false) => {
			isLoading.value = true;
			router.get("/shop", buildParams(extra), {
				preserveState: true,
				preserveScroll,
				onFinish: () => {
					isLoading.value = false;
				}
			});
		};
		const onFilterChange = (filters) => {
			currentFilters.value = { ...filters };
			navigate({ page: 1 });
		};
		const onPageChange = (pageNum) => {
			navigate({ page: pageNum }, true);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(shopTexts.value.tab_title)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(shopTexts.value.tab_title), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(AppLayout_default, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)(ProductArchive_default, {
							title: title.value,
							description: description.value,
							breadcrumbs: breadcrumbs.value,
							products: products.value,
							loading: isLoading.value,
							"current-page": currentPage.value,
							"last-page": lastPage.value,
							total: total.value,
							categories: categories.value,
							attributes: attributes.value,
							"active-category-slug": null,
							"initial-filters": initialFilters.value,
							onFilterChange,
							onPageChange
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(PageBlocks_default, { blocks: __props.blocks }, null, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)(ProductArchive_default, {
						title: title.value,
						description: description.value,
						breadcrumbs: breadcrumbs.value,
						products: products.value,
						loading: isLoading.value,
						"current-page": currentPage.value,
						"last-page": lastPage.value,
						total: total.value,
						categories: categories.value,
						attributes: attributes.value,
						"active-category-slug": null,
						"initial-filters": initialFilters.value,
						onFilterChange,
						onPageChange
					}, null, 8, [
						"title",
						"description",
						"breadcrumbs",
						"products",
						"loading",
						"current-page",
						"last-page",
						"total",
						"categories",
						"attributes",
						"initial-filters"
					]), (0, vue_exports.createVNode)(PageBlocks_default, { blocks: __props.blocks }, null, 8, ["blocks"])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Product/Shop.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=Shop-rVrIlUu_.js.map