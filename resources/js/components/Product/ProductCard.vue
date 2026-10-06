<script setup>
import { router } from "@inertiajs/vue3";
import { defineProps, ref, watch, onMounted, computed } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useWishlistStore } from "@/Store/wishlistStore";
import { parseGalleryImages } from "@/utils/galleryImages";
import { isOutOfStock, isPreOrder } from '@/utils/stock'
import { priceFor } from '@/utils/productPrice'

dayjs.extend(duration);

const wishlistStore = useWishlistStore();

const props = defineProps({
    product: { type: Object, required: true },
    openPreview: Function,
    campaign: { type: Boolean, default: false },
    expiryDate: String,
});

const product = ref(props.product);
const displayPrice = ref(props.product?.price || 0);
const productImages = ref([]);
const countdown = ref(""); // Countdown timer

// Price comes from the shared rule so a card, the product page and the cart
// can never show three different numbers.
watch(
    () => props.product,
    (newProduct) => {
        if (!newProduct) return;
        productImages.value = parseGalleryImages(newProduct.gallery_images);
        displayPrice.value = priceFor(newProduct);

        const campaign = newProduct.product_campaign?.campaign ?? newProduct.campaign ?? null;
        if (campaign?.expiry_date) updateCountdown(campaign.expiry_date);
    },
    { immediate: true }
);

// Function to calculate and update countdown
const updateCountdown = (endDate = props.expiryDate) => {
    if (!endDate) {
        countdown.value = "";
        return;
    }

    const expiryTime = dayjs(endDate, "YYYY-MM-DD");
    const now = dayjs();
    const diff = expiryTime.diff(now);

    if (diff <= 0) {
        countdown.value = "Expired";
        return;
    }

    const durationObj = dayjs.duration(diff);
    countdown.value = `${durationObj.days()}d ${durationObj.hours()}h ${durationObj.minutes()}m ${durationObj.seconds()}s`;
};

// Start countdown updates
onMounted(() => {
    updateCountdown();
    setInterval(() => updateCountdown(), 1000);
});

// Three distinct states, not two: a pre-order sells, a sold-out product does not.
const isPreOrderProduct = computed(() => isPreOrder(props.product));
const isSoldOut = computed(() => isOutOfStock(props.product));

const discountPercentage = computed(() => {
    const { price, previous_price } = props.product;
    if (!previous_price || previous_price <= 0) return 0;
    const discount = ((previous_price - price) / previous_price) * 100;
    return Math.round(discount);
});

const handlePreviewClick = () => {
    if (typeof props.openPreview === "function") {
        props.openPreview(product.value);
    }
};

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.product));

const toggleWishlist = () => {
    wishlistStore.toggle(props.product);
};
</script>

<template>
    <div
        class="product-item bg-[#eff2ff] border border-[var(--color-theme)] overflow-hidden shadow-md relative group cursor-pointer"
        @click="router.visit(`/product/${product.slug}`)"
    >
        <div
            class="product-image relative h-[200px] md:h-[350px] overflow-hidden"
        >
                <!-- Featured Image (Thumbnail) -->
                <img
                    :src="product?.featured_image || '/placeholder.svg'"
                    :alt="product.product_name"
                    class="w-full h-full object-cover duration-300 transition-opacity group-hover:opacity-0"
                    loading="lazy"
                    fetchpriority="high"
                    decoding="async"
                    width="400"
                    height="500"
                    @error="$event.target.src = '/placeholder.svg'"
                />

                <!-- Gallery Image (Appears on Hover) -->
                <img
                    v-if="productImages && productImages[0]"
                    :src="productImages[0]"
                    :alt="product.product_name"
                    class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    width="400"
                    height="500"
                    @error="$event.target.src = '/placeholder.svg'"
                />

                <!-- Fallback Hover Image: Featured Image if no gallery image -->
                <img
                    v-else
                    :src="product.featured_image || '/placeholder.svg'"
                    :alt="product.product_name"
                    class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    width="400"
                    height="500"
                    @error="$event.target.src = '/placeholder.svg'"
                />

            <!-- Wishlist Heart -->
            <button
                type="button"
                @click.stop="toggleWishlist"
                :aria-pressed="isWishlisted"
                :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
                class="wishlist-btn"
                :class="{ 'is-active': isWishlisted }"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    :fill="isWishlisted ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>

            <!-- Availability badge: pre-order and sold out are separate states -->
            <div
                v-if="isPreOrderProduct"
                class="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded z-10"
            >
                Pre Order
            </div>
            <div
                v-else-if="isSoldOut"
                class="absolute top-2 left-2 soldout-badge text-xs font-bold px-2 py-1 rounded z-10"
            >
                Out of Stock
            </div>
        </div>

        <!-- Mobile eye icon - always visible -->
        <button
            @click.stop="handlePreviewClick"
            class="mobile-eye-btn md:hidden"
        >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div class="p-1 text-center relative mb-[40px]">
            <div
                class="absolute bottom-full left-0 right-0 hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <button
                    @click.stop="handlePreviewClick"
                    class="quick-preview bg-[var(--color-theme)] text-white p-2 shadow-md body-1-sb w-full"
                >
                    Quick Preview
                </button>
            </div>

            <!-- Campaign Countdown -->
            <div
                v-if="campaign"
                class="absolute bottom-full left-0 right-0 gap-2 opacity-100 group-hover:opacity-0 group-hover:hidden transition-opacity duration-300 bg-yellow-500 text-white p-2 body-1-sb"
            >
                <span>{{ countdown }}</span>
            </div>

            <h3 class="product-title body-1-sb text-gray-700">
                {{ product.product_name }}
            </h3>

            <div class="body-2-sb text-[var(--color-theme)]">
                <span
                    v-if="product.previous_price"
                    class="body-1-r text-gray-500 line-through mr-2"
                >
                    {{ product.previous_price }}৳
                </span>
                <span>{{ displayPrice }}৳</span>
            </div>
        </div>

        <!-- Sold out has nothing to click: the action is replaced, not styled. -->
        <div
            v-if="isSoldOut"
            class="absolute bottom-0 w-full text-center py-2 body-1-sb soldout-bar cursor-not-allowed"
            aria-disabled="true"
        >
            স্টকে নেই
        </div>
        <div
            v-else
            :class="[
                'absolute bottom-0 w-full text-center text-white py-2 body-1-sb csd',
                isPreOrderProduct ? 'card-preorder-btn' : 'card-order-btn'
            ]"
        >
            {{ isPreOrderProduct ? 'প্রি-অর্ডার করুন' : 'অর্ডার করুন' }}
        </div>
    </div>
</template>

<style scoped>
/* Out of stock reads as a warm red across the storefront — light ground,
   solid red text — so it is never mistaken for a disabled-but-loading
   control. Same pair in CollectionCard, FilterProduct, the cart drawer and
   the product page. */
.soldout-badge {
  background-color: #fdecec;
  color: #c0392b;
}

.soldout-bar {
  background-color: #fdecec;
  color: #c0392b;
  border-top: 1px solid #f3c9c9;
}

/* Pre-order carries the same orange as the product page's pre-order button,
   so the card and the page it leads to do not disagree about what this is. */
.card-preorder-btn {
  background-color: #f97316;
}

.card-preorder-btn:hover {
  background-color: #ea580c;
}

/* "Order now" colour comes from Store settings (General). */
.card-order-btn {
  background-color: var(--color-order-now-bg, #356019);
  transition: filter 0.2s ease;
}

.card-order-btn:hover {
  filter: brightness(0.9);
}

.product-item {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
    border-color: #E9C39C !important;
    box-shadow: 0 4px 16px rgba(139, 105, 20, 0.1);
}

.product-title {
    text-decoration: underline transparent;
    transition: text-decoration-color 0.3s ease;
}

.product-item:hover .product-title {
    text-decoration-color: currentColor;
}

.countdown {
    background: #ff9800;
    color: white;
    padding: 10px 10px;
    border-radius: 5px;
    font-weight: bold;
}

/* Wishlist heart */
.wishlist-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    z-index: 20;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.wishlist-btn:hover {
    background: rgba(0, 0, 0, 0.55);
    transform: scale(1.08);
}

.wishlist-btn.is-active svg {
    animation: wishlist-pop 0.28s ease;
}

@keyframes wishlist-pop {
    0%   { transform: scale(0.7); }
    50%  { transform: scale(1.25); }
    100% { transform: scale(1); }
}

/* Mobile eye icon */
.mobile-eye-btn {
    display: none;
}

@media (max-width: 767px) {
    .mobile-eye-btn {
        position: absolute;
        top: 8px;
        right: 52px; /* sit just left of the wishlist heart */
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
    }
}
</style>
