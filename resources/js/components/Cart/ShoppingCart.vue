<script setup>
import { ref, computed,onMounted } from 'vue'
import { XIcon } from 'lucide-vue-next'
import EmptyCart from './EmptyCart.vue'
import { useCartStore } from "@/Store/cartStore";
// A line can go out of stock after it was added, and checkout will refuse it,
// so the cart has to say which one.
import { isOutOfStock } from "@/utils/stock";

const cartStore = useCartStore();

// Cart items data
const cartItems = computed(() => cartStore.cartItems);

const directOrderProduct = ref(null);

onMounted(() => {
    if (typeof window !== "undefined") {
        const storedProductData = localStorage.getItem(
            "directOrderProductData"
        );
        if (storedProductData) {
            directOrderProduct.value = JSON.parse(storedProductData);
        }
    }
});

// // Updated computed properties
// const subtotal = computed(() => {
//     if (cartStore.is_direct_order) {
//         return directOrderProductSubtotal.value;
//     } else {
//         return cartItems.value.reduce((total, item) => {
//             return total + parseFloat(item.individual_price) * item.quantity;
//         }, 0);
//     }
// });

// const directOrderProductSubtotal = computed(() => {
//     if (!directOrderProduct.value) return 0;

//     let basePrice = parseFloat(directOrderProduct.value.price || 0);
//     const additionalPrices = directOrderProduct.value.selectedAttributes.reduce(
//         (total, attr) => total + parseFloat(attr.attribute_option_price || 0),
//         0
//     );
//     return (basePrice + additionalPrices) * directOrderProduct.value.quantity;
// });

// const total = computed(
//     () =>
//         subtotal.value + form.value.delivery_charge - (form.value.discount || 0)
// );

// Computed values
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.individual_price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value
})

// Methods
const formatPrice = (price) => {
  return `${price}`
}

const updateQuantity = (item, change) => {
    let newQuantity = item.quantity + change;

    // Ensure quantity doesn't go below 1
    if (newQuantity < 1) {
        return;
    }

    // Extract attribute option IDs if attributes exist
    const attributeValues = item.attributes?.length
        ? item.attributes.map((attr) => attr.attribute_option_id)
        : [];

    // Update cart only if quantity is valid
    if (newQuantity > 0) {
        cartStore.updateCartItemQuantity(
            item.id || item.product_id,
            item.id ? change : newQuantity,
            attributeValues,
            !!item.id
        );
    }

    if (!item.id) {
        directOrderProduct.value = JSON.parse(
            localStorage.getItem("directOrderProductData")
        );
    }
};



</script>



<template>
  <div class="container py-12">
    <!-- Cart Table -->
    <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-2/3">

        <table class="hidden md:table w-full">
          <!-- Desktop Table View -->
          <thead class="border-b">
            <tr>
              <th class="text-left py-4">পণ্য</th>
              <th class="text-left py-4">মূল্য</th>
              <th class="text-left py-4">পরিমাণ</th>
              <th class="text-right py-4">সাবটোটাল</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id" class="border-b">
              <td class="py-4">
                <div class="flex items-center gap-4">
                  <button @click="cartStore.removeItem(item.id)" class="text-gray-400 hover:text-gray-600">
                    <XIcon class="h-4 w-4" />
                  </button>
                  <img :src="item.product.featured_image || '/placeholder.svg'" :alt="item.product.product_name" class="w-20 h-20 object-cover" loading="lazy" decoding="async" width="80" height="80" @error="$event.target.src = '/placeholder.svg'" />
                  <div class="flex flex-col gap-1">
                    <span>{{ item.product.product_name }}</span>
                    <span
                      v-if="isOutOfStock(item.product)"
                      class="soldout-badge self-start"
                      >স্টকে নেই</span
                    >
                    <span
                      v-if="item.blouse_choice"
                      class="blouse-badge"
                      :class="item.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                    >
                      {{ item.blouse_choice === 'with' ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া' }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <span
                  v-if="item.regular_individual_price"
                  class="text-gray-400 line-through mr-2"
                >{{ formatPrice(item.regular_individual_price) }}<span class="bangla-font">৳</span></span>
                <span :class="{ 'text-theme font-semibold': item.regular_individual_price }">{{ formatPrice(item.individual_price) }}<span class="bangla-font">৳</span></span>
              </td>
              <td class="py-4">
                <div class="flex items-center border rounded max-w-[120px]">
                  <button @click="updateQuantity(item,- 1)"
                    class="px-3 py-1 border-r hover:bg-gray-100" :disabled="item.quantity <= 1">-</button>
                  <input type="number" v-model="item.quantity" class="w-12 text-center border-none focus:ring-0"
                    min="1" />
                  <button @click="updateQuantity(item, 1)"
                    class="px-3 py-1 border-l hover:bg-gray-100">+</button>
                </div>
              </td>
              <td class="py-4 text-right text-theme">
                {{ formatPrice(item.individual_price * item.quantity) }}<span class="bangla-font">৳</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="md:hidden">
          <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-4 border-b">
            <img :src="item.product.featured_image || '/placeholder.svg'" :alt="item.product.product_name" class="w-24 h-24 object-cover rounded" loading="lazy" decoding="async" width="96" height="96" @error="$event.target.src = '/placeholder.svg'" />
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div class="flex flex-col gap-1">
                  <h3 class="font-medium text-gray-900">{{ item.product.product_name }}</h3>
                  <span
                    v-if="isOutOfStock(item.product)"
                    class="soldout-badge self-start"
                    >স্টকে নেই</span
                  >
                  <span
                    v-if="item.blouse_choice"
                    class="blouse-badge self-start"
                    :class="item.blouse_choice === 'with' ? 'blouse-badge--with' : 'blouse-badge--without'"
                  >
                    {{ item.blouse_choice === 'with' ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া' }}
                  </span>
                </div>
                <button @click="cartStore.removeItem(item.id)" class="text-gray-400 hover:text-gray-600">
                  <XIcon class="h-4 w-4" />
                </button>
              </div>

              <div class="mt-1 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">মূল্য</span>
                  <span class="font-medium">
                    <span
                      v-if="item.regular_individual_price"
                      class="text-gray-400 line-through mr-2 font-normal"
                    >{{ formatPrice(item.regular_individual_price) }}<span class="bangla-font">৳</span></span>
                    <span :class="{ 'text-theme': item.regular_individual_price }">{{ formatPrice(item.individual_price) }}<span class="bangla-font">৳</span></span>
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-gray-500">পরিমাণ</span>
                  <div class="flex items-center border rounded">
                    <button @click="updateQuantity(item, -1)"
                      class="px-3 py-1 border-r hover:bg-gray-50" :disabled="item.quantity <= 1">-</button>
                    <input type="number" v-model="item.quantity" class="w-12 text-center border-none focus:ring-0 p-0"
                      min="1" />
                    <button @click="updateQuantity(item, 1)"
                      class="px-3 py-1 border-l hover:bg-gray-50">+</button>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t">
                  <span class="text-gray-500">সাবটোটাল</span>
                  <span class="font-medium text-theme">
                    {{ formatPrice(item.individual_price * item.quantity) }}<span class="bangla-font">৳</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <!-- Cart Totals -->
      <div class="lg:w-1/3">
        <div class="border rounded p-6">
          <h2 class="title-2 mb-6">কার্টের মোট</h2>

          <div class="flex justify-between py-4 border-b">
            <span>সাবটোটাল</span>
            <span>{{ formatPrice(subtotal) }}<span class="bangla-font">৳</span></span>
          </div>

          <div class="flex justify-between py-4 font-bold">
            <span>মোট মূল্য</span>
            <span class="text-theme">{{ formatPrice(total) }}<span class="bangla-font">৳</span></span>
          </div>

          <button @click="cartStore.goToCheckout"  class="w-full block text-center btn__primary">
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
    <EmptyCart v-else />
  </div>
</template>

<style scoped>
/* Out of stock reads as a warm red across the storefront — light ground,
   solid red text. Same pair on the cards, the cart drawer and the PDP. */
.soldout-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #fdecec;
  color: #c0392b;
  font-size: 11px;
  font-weight: 700;
}

.blouse-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
  width: fit-content;
}

.blouse-badge--with {
  background-color: #356019;
}

.blouse-badge--without {
  background-color: #8c7256;
}
</style>