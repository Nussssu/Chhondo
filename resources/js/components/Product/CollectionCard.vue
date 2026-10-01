<script setup>
import { router } from "@inertiajs/vue3"
import { computed, ref } from "vue"
import { useCartStore } from "@/Store/cartStore"
import { useWishlistStore } from "@/Store/wishlistStore"
import { parseGalleryImages } from "@/utils/galleryImages"
import ResponsiveImage from "@/components/ResponsiveImage.vue"
import { isOutOfStock, isPreOrder } from '@/utils/stock'
import { priceFor, wasPriceFor } from '@/utils/productPrice'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  openPreview: {
    type: Function,
    default: null,
  },
  /**
   * Set on the few cards that start above the fold so their image is fetched
   * eagerly at high priority. One of them is usually the largest element
   * painted, and lazy-loading it delays the moment the page looks ready.
   */
  priority: {
    type: Boolean,
    default: false,
  },
})

const getProductCampaign = (product) =>
  product?.campaign || product?.product_campaign?.campaign || null

// Prices come from the shared rule, which accounts for a product coupon as
// well as a campaign and always matches what the cart will charge.
const getRegularPrice = (product) => wasPriceFor(product)
const getCampaignDiscountedPrice = (product) => priceFor(product)

// First gallery image, shown on hover
const galleryImage = computed(() => {
  return parseGalleryImages(props.product.gallery_images)[0] ?? null
})

/**
 * The hover image is only ever seen on a pointer device, so it is not put in
 * the DOM until the pointer arrives. Rendering it up front made every listing
 * fetch two images per product, and on a phone — where nothing hovers — the
 * whole second set was downloaded and never shown.
 */
const hoverLoaded = ref(false)

const addingToCart = ref(false)

const soldOut = computed(() => isOutOfStock(props.product))
const preOrder = computed(() => isPreOrder(props.product))

const addToCart = () => {
  // The button is disabled; this covers a re-enabled one and a stale card.
  if (addingToCart.value || soldOut.value) return
  addingToCart.value = true

  cartStore.addToCart({
    product_id:       props.product.id,
    quantity:         1,
    attribute_values: [],
  }, props.product)

  setTimeout(() => { addingToCart.value = false }, 1500)
}
</script>

<template>
  <div class="collection-card" @click="router.visit(`/product/${product.slug}`)">
    <!-- Product Image -->
    <div
      class="collection-image-wrapper group/img"
      @mouseenter="hoverLoaded = true"
      @focusin="hoverLoaded = true"
    >
      <ResponsiveImage
        :src="product.featured_image"
        :alt="product.product_name"
        :width="3"
        :height="4"
        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        img-class="w-full h-full object-cover"
      />
      <!-- Hover gallery image, mounted on first hover -->
      <ResponsiveImage
        v-if="hoverLoaded && galleryImage"
        :src="galleryImage"
        :alt="product.product_name"
        :width="3"
        :height="4"
        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        loading="eager"
        img-class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"
      />
      <!-- Wishlist Heart -->
      <button
        type="button"
        @click.stop="wishlistStore.toggle(product)"
        :aria-pressed="wishlistStore.isWishlisted(product)"
        :aria-label="wishlistStore.isWishlisted(product) ? 'Remove from wishlist' : 'Add to wishlist'"
        class="wishlist-btn"
        :class="{ 'is-active': wishlistStore.isWishlisted(product) }"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" :fill="wishlistStore.isWishlisted(product) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <!-- Quick Preview - Desktop bottom bar -->
      <button
        v-if="openPreview"
        @click.stop="openPreview(product)"
        class="quick-preview-btn hidden md:flex"
      >
        Quick Preview
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- Quick Preview - Mobile eye icon -->
      <button
        v-if="openPreview"
        @click.stop="openPreview(product)"
        class="mobile-eye-btn md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666016 8.00008C0.666016 8.00008 3.33268 2.66675 7.99935 2.66675C12.666 2.66675 15.3327 8.00008 15.3327 8.00008C15.3327 8.00008 12.666 13.3334 7.99935 13.3334C3.33268 13.3334 0.666016 8.00008 0.666016 8.00008Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Availability badge: pre-order and sold out are separate states -->
      <div
        v-if="isPreOrder(product)"
        class="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10"
      >
        Pre Order
      </div>
      <div
        v-else-if="isOutOfStock(product)"
        class="absolute top-3 left-3 soldout-badge text-xs font-bold px-2.5 py-1 rounded-lg z-10"
      >
        Out of Stock
      </div>
    </div>

    <!-- Product Info -->
    <div class="collection-info">
      <h3 class="collection-product-name">
        {{ product.product_name }}
      </h3>
      <p class="collection-price">
        <span
          v-if="getRegularPrice(product)"
          class="line-through text-gray-400 mr-1 text-sm"
        >{{ getRegularPrice(product) }}৳</span>
        {{ getCampaignDiscountedPrice(product) }} <span class="bangla-font">৳</span>
      </p>
    </div>

    <!-- Add to Cart Button -->
    <div class="collection-btn-wrap">
      <button
        @click.stop="addToCart"
        :disabled="addingToCart || soldOut"
        :aria-disabled="soldOut"
        class="collection-buy-btn"
        :class="{ 'is-soldout': soldOut, 'is-preorder': preOrder }"
      >
        <template v-if="soldOut">Out of Stock</template>
        <template v-else>
          {{ addingToCart ? 'Adding...' : (preOrder ? 'Pre-Order' : 'Add to cart') }}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Card container — Figma: Warm/200 bg, Warm/300 border, r16, p20, gap 20 */
.collection-card {
  background-color: #fff0df;
  border: 1px solid #f7e2cb;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.collection-card:hover {
  border-color: #E9C39C;
  box-shadow: 0 4px 16px rgba(139, 105, 20, 0.1);
}

@media (min-width: 768px) {
  .collection-card {
    padding: 20px;
  }
}

/* Image wrapper */
.collection-image-wrapper {
  position: relative;
  aspect-ratio: 377 / 468;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0ece6;
}

.collection-image-wrapper img {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.collection-card:hover .collection-image-wrapper img {
  transform: scale(1.05);
}

/* Quick Preview button — full width bar at bottom */
.quick-preview-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  color: white;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 5;
}

.quick-preview-btn:hover {
  background: rgba(0, 0, 0, 0.75);
}

.collection-image-wrapper:hover .quick-preview-btn {
  opacity: 1;
  transform: translateY(0);
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
  z-index: 6;
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
    z-index: 5;
  }
}

/* Product info — Figma: gap 20 above, name 24/32 SB Black/600, price 20/28 Warm/700, gap 4 */
.collection-info {
  padding: 14px 0 0;
  flex-grow: 1;
}

.collection-product-name {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  color: #4d4944;
  text-decoration: underline transparent;
  transition: text-decoration-color 0.3s ease;
}

.collection-card:hover .collection-product-name {
  text-decoration-color: #4d4944;
}

@media (min-width: 768px) {
  .collection-info {
    padding-top: 20px;
  }

  .collection-product-name {
    font-size: 24px;
    line-height: 32px;
  }
}

.collection-price {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #9a663f;
  margin-top: 4px;
}

@media (min-width: 768px) {
  .collection-price {
    font-size: 20px;
    line-height: 28px;
  }
}

/* Add to cart button — Figma: Green/600, h48, r8, px20, Manrope SB 16 + chevron */
.collection-btn-wrap {
  margin-top: 14px;
}

.collection-buy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 20px;
  background-color: #356019;
  color: white;
  font-family: "Manrope", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

@media (min-width: 768px) {
  .collection-btn-wrap {
    margin-top: 20px;
  }

  .collection-buy-btn {
    height: 48px;
    font-size: 16px;
  }
}

.collection-buy-btn:hover:not(:disabled) {
  background-color: #2a4d14;
}

.collection-buy-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Sold out is a state, not a busy button, so it reads as a warm red rather
   than dimmed green — the same pair used everywhere else on the storefront. */
.soldout-badge {
  background-color: #fdecec;
  color: #c0392b;
}

/* Pre-order carries the same orange as the product page's pre-order button,
   so the card and the page it leads to do not disagree about what this is. */
.collection-buy-btn.is-preorder {
  background-color: #f97316;
  color: #fff;
}

.collection-buy-btn.is-preorder:hover:not(:disabled) {
  background-color: #ea580c;
}

.collection-buy-btn.is-soldout {
  background-color: #fdecec;
  color: #c0392b;
  border: 1px solid #f3c9c9;
  opacity: 1;
  cursor: not-allowed;
}
</style>
