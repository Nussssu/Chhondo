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
  // Figma words this per page: "কার্টে অ্যাড করুন" on the home page,
  // "কার্টে রাখুন" on the shop and product pages.
  buttonLabel: {
    type: String,
    default: "কার্টে অ্যাড করুন",
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
        :src="product.featured_image || '/placeholder.svg'"
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
        <!-- Figma "Favourtite" glyph -->
        <svg class="wishlist-icon" viewBox="0 0 20 20" :fill="wishlistStore.isWishlisted(product) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 5.02C8.36 2.9 4.58 2.45 2.83 4.94c-1.26 1.79-.8 4.1.51 5.6l4.59 4.44a2.86 2.86 0 0 0 2.15.95 2.84 2.84 0 0 0 2.12-.96l4.48-4.43c1.36-1.52 1.79-3.85.49-5.63C15.4 2.43 11.66 2.9 10 5.02Z" />
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
        প্রি-অর্ডার
      </div>
      <div
        v-else-if="isOutOfStock(product)"
        class="absolute top-3 left-3 soldout-badge text-xs font-bold px-2.5 py-1 rounded-lg z-10"
      >স্টকে নেই</div>
    </div>

    <!-- Product Info -->
    <div class="collection-info">
      <h3 class="collection-product-name">
        {{ product.product_name }}
      </h3>
      <p class="collection-price">
        <span
          v-if="getRegularPrice(product)"
          class="collection-was-price"
        >{{ getRegularPrice(product) }}৳</span>
        {{ getCampaignDiscountedPrice(product) }}৳
      </p>
    </div>

    <!-- Add to Cart Button -->
    <div>
      <button
        @click.stop="addToCart"
        :disabled="addingToCart || soldOut"
        :aria-disabled="soldOut"
        class="collection-buy-btn"
        :class="{ 'is-soldout': soldOut, 'is-preorder': preOrder }"
      >
        <template v-if="soldOut">স্টকে নেই</template>
        <template v-else>
          <img :src="'/assets/chhondo/cart-light.svg'" alt="" width="24" height="24" />
          {{ addingToCart ? 'যোগ হচ্ছে...' : (preOrder ? 'প্রি-অর্ডার' : buttonLabel) }}
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Figma "Component 12": white, r16, p20, 16px between the image block and
   the button; soft two-layer shadow that deepens on hover. */
.collection-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
  transition: box-shadow 0.3s ease, transform .3s ease;
}

.collection-card:hover {
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .28);
  transform: translateY(-3px);
}

/* Image — 285 × 322, r8 */
.collection-image-wrapper {
  position: relative;
  aspect-ratio: 285 / 322;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f3f3f3;
}

.collection-image-wrapper img {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.collection-card:hover .collection-image-wrapper img {
  transform: scale(1.05);
}

/* Quick Preview — 36px bar, Black/900 at 80%, r8, slides up on hover */
.quick-preview-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 8px;
  background: rgba(26, 24, 23, 0.8);
  color: #fff;
  font: 400 14px/20px "Poppins", sans-serif;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease, opacity 0.3s ease, background-color .2s ease;
  z-index: 5;
}

.quick-preview-btn:hover {
  background: rgba(26, 24, 23, 0.92);
}

.collection-card:hover .quick-preview-btn,
.quick-preview-btn:focus-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Wishlist — 36px white circle, 12px in from the image corner */
.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1817;
  background: #fff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 6;
  transition: transform 0.2s ease, color 0.2s ease;
}

.wishlist-icon { width: 20px; height: 20px; display: block; }

.wishlist-btn:hover {
  transform: scale(1.08);
}

.wishlist-btn.is-active {
  color: #60141d;
}

.wishlist-btn.is-active svg {
  animation: wishlist-pop 0.28s ease;
}

@keyframes wishlist-pop {
  0%   { transform: scale(0.7); }
  50%  { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* Mobile eye icon — phones have no hover, so quick preview is a tap target */
.mobile-eye-btn {
  display: none;
}

/* Info — name Poppins 20/28 Black/700, price Poppins SB 16/24, both 8px in */
.collection-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.collection-product-name {
  padding-left: 8px;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #3c3834;
  text-decoration: underline transparent;
  transition: text-decoration-color 0.3s ease;
}

.collection-card:hover .collection-product-name {
  text-decoration-color: #4d4944;
}

.collection-price {
  padding-inline: 8px;
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
}

.collection-was-price {
  margin-right: 6px;
  color: #9c9591;
  font-weight: 400;
  font-size: 14px;
  text-decoration: line-through;
}

/* Add to cart — Green/700, h44, r8, cart icon + Li Ador SB 16/24 */
.collection-buy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background-color: #1a2110;
  color: white;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.collection-buy-btn:hover:not(:disabled) {
  background-color: #252f17;
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

/* Figma phone card: p12, r9, image r4, 24px heart, 12px type, 47px button. */
@media (max-width: 767px) {
  .collection-card { padding: 12px; gap: 9px; border-radius: 9px; }
  .collection-card:hover { transform: none; }
  .collection-image-wrapper { aspect-ratio: 152 / 172; border-radius: 4px; }
  .wishlist-btn { top: 8px; right: 8px; width: 24px; height: 24px; }
  .wishlist-icon { width: 16px; height: 16px; }
  .mobile-eye-btn {
    position: absolute;
    top: 8px;
    right: 38px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 24, 23, 0.6);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 5;
  }
  .mobile-eye-btn svg { width: 14px; height: 14px; }
  .collection-info { gap: 3px; }
  .collection-product-name { padding-left: 0; font-size: 12px; line-height: 15px; }
  .collection-price { padding-inline: 0; font-size: 12px; line-height: 20px; }
  .collection-was-price { font-size: 11px; }
  .collection-buy-btn { height: 47px; padding: 0 10px; font-size: 12px; line-height: 20px; }
  .collection-buy-btn img { width: 20px; height: 20px; }
}
</style>
