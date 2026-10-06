<script setup>
import { onMounted, computed, ref } from "vue"
import { useCartStore } from "@/Store/cartStore"
import { isOutOfStock, isPreOrder } from '@/utils/stock'

const emptyCartIcon = ref("/assets/images/icons/empty-cart.png")

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCartItems()
})

const cartItems = computed(() => cartStore.cartItems)

const updateQuantity = (item, change) => {
  let newQuantity = item.quantity + change
  if (newQuantity < 1) return

  const attributeValues = item.attributes?.length
    ? item.attributes.map((attr) => attr.attribute_option_id)
    : []

  cartStore.updateCartItemQuantity(
    item.id || item.product_id,
    item.id ? change : newQuantity,
    attributeValues,
    !!item.id,
  )
}
</script>

<template>
  <div>
    <!-- Overlay — Figma: 15% black with a 4px blur -->
    <div
      v-if="cartStore.isCartOpen"
      class="cart-overlay fixed inset-0 z-40 transition-opacity"
      @click="cartStore.toggleCart"
    ></div>

    <!-- Cart Panel -->
    <div
      class="cart-panel fixed top-0 right-0 h-full w-full bg-white z-50 transform transition-transform duration-300 flex flex-col"
      :class="{
        'translate-x-0': cartStore.isCartOpen,
        'translate-x-full': !cartStore.isCartOpen,
      }"
    >
      <!-- Header -->
      <div class="cart-header">
        <h2 class="cart-header-title">
          আপনার কার্ট ({{ cartStore.cartCount }})
        </h2>
        <div class="flex items-center gap-5">
          <button
            v-if="cartItems.length > 0"
            @click="cartStore.clearCart()"
            class="cart-clear"
          >
            সব মুছুন
          </button>
          <button
            @click="cartStore.toggleCart"
            class="cart-close"
            aria-label="Close cart"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Items (scrollable) -->
      <div class="cart-body flex-1 overflow-y-auto">
        <!-- Empty State -->
        <div
          v-if="cartItems.length === 0"
          class="flex flex-col items-center justify-center h-full text-center"
        >
          <img
            :src="emptyCartIcon"
            alt="Empty Cart"
            class="w-[160px] mb-4 opacity-70"
          />
          <p class="cart-empty">আপনার কার্ট খালি</p>
        </div>

        <!-- Cart Item List — 24px apart -->
        <div v-else class="flex flex-col gap-6">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <!-- Product Image — 96 × 102, r8 -->
            <div class="cart-thumb">
              <img
                :src="item.product.featured_image"
                :alt="item.product.product_name"
                fetchpriority="low"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0 flex flex-col gap-2">
              <div class="flex items-start justify-between gap-2">
                <h3 class="cart-item-name">
                  {{ item.product.product_name }}
                  <template v-if="item.attributes?.length">
                    (<span
                      v-for="(attribute, i) in item.attributes"
                      :key="attribute.id"
                      >{{ attribute.attribute_option
                      }}<span v-if="i < item.attributes.length - 1"
                        >,
                      </span></span
                    >)
                  </template>
                </h3>
                <!-- Delete Button -->
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="cart-remove"
                  aria-label="Remove item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>

              <!-- Price — Gold/500 -->
              <p class="cart-item-price">
                <span
                  v-if="item.regular_individual_price"
                  class="cart-item-was"
                >{{ item.regular_individual_price }} ৳</span>
                {{ item.individual_price }} <span class="cart-item-sign">৳</span>
              </p>

              <!-- Badges: what was chosen, and whether it can still be
                   bought. A line can go out of stock after it was added,
                   and checkout will refuse it, so it has to say so here. -->
              <div
                v-if="item.blouse_choice || isPreOrder(item.product) || isOutOfStock(item.product)"
                class="cart-badges"
              >
                <span
                  v-if="item.blouse_choice"
                  class="cart-badge"
                  :class="item.blouse_choice === 'with' ? 'cart-badge--with' : 'cart-badge--without'"
                >
                  {{ item.blouse_choice === 'with' ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া' }}
                </span>

                <span v-if="isPreOrder(item.product)" class="cart-badge cart-badge--preorder">
                  প্রি-অর্ডার
                </span>
                <span v-else-if="isOutOfStock(item.product)" class="cart-badge cart-badge--soldout">
                  স্টকে নেই
                </span>
              </div>

              <!-- Quantity Controls — round 32px buttons -->
              <div class="flex items-center gap-2">
                <button
                  @click="updateQuantity(item, -1)"
                  class="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14" /></svg>
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button
                  @click="updateQuantity(item, 1)"
                  class="qty-btn"
                  aria-label="Increase quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer: Total + Checkout -->
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>মোট মূল্য</span>
          <span>৳{{ cartStore.cartTotalPrice }}</span>
        </div>
        <button @click="cartStore.goToCheckout" class="checkout-btn">
          চেকআউট করুন
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-overlay {
  background: rgba(0, 0, 0, 0.15);
  -webkit-backdrop-filter: blur(4.1px);
  backdrop-filter: blur(4.1px);
}

/* Figma drawer: 420 wide, 32px padding, header 48px above the list */
/* Shadow only while open: parked off-screen it would bleed into the page edge. */
.cart-panel.translate-x-0 {
  box-shadow: -8px 0 40px rgba(26, 24, 23, 0.12);
}
@media (min-width: 768px) {
  .cart-panel { width: 420px; }
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 32px 32px 48px;
}

.cart-header-title {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #1a1817;
}

.cart-clear {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #1a1817;
  transition: color .2s ease;
}
.cart-clear:hover { color: #c0392b; }

/* Close — 31px Gold/50 square, Gold/100 hairline */
.cart-close {
  width: 31px;
  height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #efe0bb;
  border-radius: 2px;
  background: #faf5e9;
  color: #1a1817;
  transition: background-color .2s ease;
}
.cart-close:hover { background: #efe0bb; }

.cart-body { padding: 0 32px 24px; }

.cart-empty {
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  color: #6d6560;
}

.cart-item { display: flex; gap: 16px; }

.cart-thumb {
  width: 96px;
  height: 102px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #f3f3f3;
}
.cart-thumb img { width: 100%; height: 100%; object-fit: cover; }

.cart-item-name {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #3c3834;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-remove {
  flex-shrink: 0;
  margin-top: 2px;
  color: #9c9591;
  transition: color .2s ease;
}
.cart-remove:hover { color: #c0392b; }

.cart-item-price {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #cc9b25;
}
.cart-item-sign { font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; font-weight: 400; }
.cart-item-was {
  margin-right: 6px;
  color: #9c9591;
  font-weight: 400;
  font-size: 14px;
  text-decoration: line-through;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1cdca;
  border-radius: 9999px;
  background: white;
  color: #1a1817;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color .2s ease;
}
.qty-btn:hover { background-color: #faf5e9; border-color: #d6af51; }

.qty-value {
  min-width: 20px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #1a1817;
}

/* Footer — Black/200 rule, 28px rhythm */
.cart-footer {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin: 0 32px;
  padding: 28px 0 32px;
  border-top: 1px solid #e4e1e0;
  background: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #3c3834;
}

.checkout-btn {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background-color: #1a2110;
  color: white;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.checkout-btn:hover { background-color: #252f17; }

/* Phone: 20px gutters */
@media (max-width: 767px) {
  .cart-header { padding: 24px 20px 32px; }
  .cart-header-title { font-size: 24px; line-height: 32px; }
  .cart-body { padding: 0 20px 20px; }
  .cart-footer { margin: 0 20px; padding: 20px 0 calc(20px + env(safe-area-inset-bottom, 0px)); gap: 20px; }
  .cart-total { font-size: 24px; line-height: 32px; }
}

/* Every badge on a cart line is the same shape, so a second one never reads
   as a different kind of thing sitting beside the first. */
.cart-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.cart-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  line-height: 1.5;
  white-space: nowrap;
}

.cart-badge--with {
  background-color: #252f17;
}

.cart-badge--without {
  background-color: #faf5e9;
  border: 1px solid #efe0bb;
  color: #705514;
}

/* The same orange the product page and the cards use for pre-order. */
.cart-badge--preorder {
  background-color: #f97316;
}

/* Out of stock reads as a warm red across the storefront. */
.cart-badge--soldout {
  background-color: #fdecec;
  color: #c0392b;
}
</style>
