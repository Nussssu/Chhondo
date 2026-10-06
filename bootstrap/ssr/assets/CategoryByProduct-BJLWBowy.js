import { c as server_renderer_exports, l as vue_exports, o as usePage, r as head_default, s as router } from "../ssr.js";
import { t as _sfc_main$1 } from "./AppLayout-ochFaCc-.js";
import { t as ProductArchive_default } from "./ProductArchive-E61qKOqS.js";
//#region resources/js/Pages/Public/Product/CategoryByProduct.vue
var _sfc_main = {
	__name: "CategoryByProduct",
	__ssrInlineRender: true,
	props: {
		slug: {
			type: String,
			required: true
		},
		basePath: {
			type: String,
			default: "/product-category"
		}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const products = (0, vue_exports.computed)(() => page.props.products || []);
		const categoryName = (0, vue_exports.computed)(() => page.props.categoryName || "");
		const currentPage = (0, vue_exports.computed)(() => page.props.currentPage || 1);
		const lastPage = (0, vue_exports.computed)(() => page.props.lastPage || 1);
		const total = (0, vue_exports.computed)(() => page.props.total || 0);
		const categories = (0, vue_exports.computed)(() => page.props.filterCategories || []);
		const attributes = (0, vue_exports.computed)(() => page.props.filterAttributes || []);
		const initialFilters = (0, vue_exports.computed)(() => page.props.filters || {});
		const isLoading = (0, vue_exports.ref)(false);
		const texts = (0, vue_exports.computed)(() => page.props.texts || {});
		const title = (0, vue_exports.computed)(() => {
			const custom = page.props.categoryTitle;
			if (custom) return custom;
			return (texts.value.category_title || "{category}").replace("{category}", categoryName.value);
		});
		const description = (0, vue_exports.computed)(() => page.props.categorySubtitle || page.props.intro?.subtitle || "");
		const breadcrumbs = (0, vue_exports.computed)(() => [{
			label: texts.value.breadcrumb,
			href: "/shop"
		}, {
			label: categoryName.value,
			href: null
		}]);
		const currentFilters = (0, vue_exports.ref)({ ...initialFilters.value });
		const buildParams = (extra = {}) => {
			const f = currentFilters.value;
			const params = {
				per_page: 12,
				min_price: f.min_price,
				max_price: f.max_price,
				...extra
			};
			if (f.sort) params.sort = f.sort;
			if (f.attributes && Object.keys(f.attributes).length) params.attributes = f.attributes;
			return params;
		};
		const navigate = (extra) => {
			isLoading.value = true;
			router.get(`${props.basePath}/${props.slug}`, buildParams(extra), {
				preserveState: true,
				preserveScroll: false,
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
			navigate({ page: pageNum });
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<title${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(categoryName.value)}</title>`);
					else return [(0, vue_exports.createVNode)("title", null, (0, vue_exports.toDisplayString)(categoryName.value), 1)];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(ProductArchive_default, {
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
						"active-category-slug": __props.slug,
						"initial-filters": initialFilters.value,
						onFilterChange,
						onPageChange
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(ProductArchive_default, {
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
						"active-category-slug": __props.slug,
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
						"active-category-slug",
						"initial-filters"
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Product/CategoryByProduct.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=CategoryByProduct-BJLWBowy.js.map