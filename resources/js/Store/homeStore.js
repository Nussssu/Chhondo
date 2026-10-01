import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usePage } from "@inertiajs/vue3";

export const useHomeStore = defineStore("homeStore", () => {
    const page = usePage();

    // All home data comes from Inertia page props
    const products        = computed(() => page.props.products        || []);
    const featureProducts = computed(() => page.props.featureProducts || []);
    const categories      = computed(() => page.props.categories      || []);
    const sliders         = computed(() => page.props.sliders         || []);
    const campaigns       = computed(() => page.props.campaigns       || []);

    // siteinfos is an array wrapping the SiteInfo record (legacy shape used by CheckoutPage)
    const siteinfos = computed(() => {
        const info = page.props.storeInfo;
        return info ? [info] : [];
    });

    const categoryByproducts = ref([]);
    const categoryName       = ref("");
    const isFetched          = ref(true); // Data already available via Inertia
    const isCategoryFetched  = ref(false);

    const logo    = computed(() => page.props.storeInfo?.media?.[0]?.logo    || "");
    const favicon = computed(() => page.props.storeInfo?.media?.[0]?.favicon || "");
    const marketing = computed(() => page.props.storeInfo?.marketing || []);

    // No-ops — kept for backward compatibility
    const fetchData          = () => {};
    const fetchCatByProduct  = () => {};

    return {
        products,
        featureProducts,
        categories,
        sliders,
        campaigns,
        categoryByproducts,
        categoryName,
        fetchData,
        siteinfos,
        fetchCatByProduct,
        isFetched,
        isCategoryFetched,
        logo,
        favicon,
        marketing,
    };
});
