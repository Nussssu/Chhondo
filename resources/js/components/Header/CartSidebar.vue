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
    <!-- Overlay -->
    <div
      v-if="cartStore.isCartOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="cartStore.toggleCart"
    ></div>

    <!-- Cart Panel -->
    <div
      class="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col"
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
        <div class="flex items-center gap-4">
          <button
            v-if="cartItems.length > 0"
            @click="cartStore.clearCart()"
            class="body-1-r text-gray-500 hover:text-red-500 transition-colors underline"
          >
            সব মুছুন
          </button>
          <button
            @click="cartStore.toggleCart"
            class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Items (scrollable) -->
      <div class="flex-1 overflow-y-auto px-4 py-2">
        <!-- Empty State -->
        <div
          v-if="cartItems.length === 0"
          class="flex flex-col items-center justify-center h-full text-center text-gray-500"
        >
          <img
            :src="emptyCartIcon"
            alt="Empty Cart"
            class="w-[160px] mb-4 opacity-70"
          />
          <p class="body-2-r">আপনার কার্ট খালি</p>
        </div>

        <!-- Cart Item List -->
        <div v-else class="space-y-0">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="flex gap-3">
              <!-- Product Image -->
              <div
                class="w-[72px] h-[90px] rounded-xl overflow-hidden bg-gray-100 shrink-0"
              >
                <img
                  :src="item.product.featured_image"
                  :alt="item.product.product_name"
                  class="w-full h-full object-cover"
                  fetchpriority="low"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="body-1-sb text-gray-800 line-clamp-2 leading-snug">
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
                    class="text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                    </svg>
                  </button>
                </div>

                <!-- Price -->
                <p class="body-1-r mt-1">
                  <span
                    v-if="item.regular_individual_price"
                    class="text-gray-400 line-through mr-1.5"
                  >{{ item.regular_individual_price }} <span class="bangla-font">৳</span></span>
                  <span class="text-[#356019]">{{ item.individual_price }} <span class="bangla-font">৳</span></span>
                </p>

                <!-- Badges: what was chosen, and whether it can still be
                     bought. They share one flex row so the space between them
                     is a real gap rather than collapsed inline whitespace, and
                     one shape class so they sit on the same baseline. A line
                     can go out of stock after it was added, and checkout will
                     refuse it, so it has to say so here. -->
                <div class="cart-badges">
                  <span
                    v-if="item.blouse_choice"
                    class="cart-badge"
                    :class="item.blouse_choice === 'with' ? 'cart-badge--with' : 'cart-badge--without'"
                  >
                    {{ item.blouse_choice === 'with' ? 'With Blouse' : 'Without Blouse' }}
                  </span>

                  <span v-if="isPreOrder(item.product)" class="cart-badge cart-badge--preorder">
                    Pre Order
                  </span>
                  <span v-else-if="isOutOfStock(item.product)" class="cart-badge cart-badge--soldout">
                    Out of Stock
                  </span>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-0 mt-2">
                  <button
                    @click="updateQuantity(item, -1)"
                    class="qty-btn rounded-l-lg"
                  >
                    —
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item, 1)"
                    class="qty-btn rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer: Total + Checkout -->
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="flex justify-between items-center mb-4">
          <span class="body-2-sb text-gray-900">মোট মূল্য</span>
          <span class="body-2-sb text-gray-900"
            >৳{{ cartStore.cartTotalPrice }}</span
          >
        </div>
        <button @click="cartStore.goToCheckout" class="checkout-btn">
          চেকআউট করুন
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0e6d8;
}

.cart-header-title {
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.cart-item {
  padding: 14px 0;
  border-bottom: 1px solid #f0e6d8;
}

.cart-item:last-child {
  border-bottom: none;
}

.qty-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.qty-btn:hover {
  background-color: #f3f4f6;
}

.qty-value {
  width: 34px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1.5px solid #d1d5db;
  border-bottom: 1.5px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: white;
}

.cart-footer {
  padding: 16px;
  border-top: 1px solid #f0e6d8;
  background: white;
}

.checkout-btn {
  width: 100%;
  padding: 14px 24px;
  background-color: #356019;
  color: white;
  font-family: "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkout-btn:hover {
  background-color: #2a4d14;
}

/* Mobile: larger product name, price, and quantity controls */
@media (max-width: 767px) {
  .cart-item h3 {
    font-size: 18px;
    line-height: 1.4;
  }

  .cart-item p {
    font-size: 18px;
  }

  .qty-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .qty-value {
    width: 40px;
    height: 36px;
    font-size: 16px;
  }
}

/* Every badge on a cart line is the same shape, so a second one never reads
   as a different kind of thing sitting beside the first. */
.cart-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.cart-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
  white-space: nowrap;
}

.cart-badge--with {
  background-color: #356019;
}

.cart-badge--without {
  background-color: #8c7256;
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
