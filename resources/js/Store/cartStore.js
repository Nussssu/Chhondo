import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/Store/authStore";
import { toast } from "@steveyuowo/vue-hot-toast";
import { usePage, router } from "@inertiajs/vue3";
import { isOutOfStock, isPreOrder } from '@/utils/stock'

export const useCartStore = defineStore("cartStore", () => {
  const page      = usePage();
  const authStore = useAuthStore();
  const isCartOpen      = ref(false);
  const is_direct_order = ref(false);

  if (typeof window !== "undefined") {
    is_direct_order.value = localStorage.getItem("is_direct_order") === "true";
  }

  // Cart items and count come from Inertia shared props
  const cartItems = computed(() => page.props.cartItems || []);
  const cartCount = computed(() => page.props.cartCount || 0);

  // Ensure guest_id exists in localStorage and return it
  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  };

  // Always include guest_id so the server can match the cart records
  const withGuestId = (data = {}) => ({
    ...data,
    guest_id: authStore.user ? undefined : getGuestId(),
  });

  const setOrderType = (direct) => {
    is_direct_order.value = direct;
    if (typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", direct.toString());
    }
  };

  const toggleCart = () => { isCartOpen.value = !isCartOpen.value; };

  const goToCheckout = () => {
    // A cart outlives the stock it was filled from. Checkout refuses these too,
    // but naming the item here is the difference between "fix this line" and a
    // rejection on the last page of the flow.
    if (unavailableItems.value.length > 0) {
      const names = unavailableItems.value
        .map((item) => item.product?.product_name)
        .filter(Boolean)
        .join(", ");

      toast.error(
        names
          ? `${names} is currently out of stock. Please remove it to continue.`
          : "An item in your cart is currently out of stock."
      );
      return;
    }

    setOrderType(false);
    isCartOpen.value = false;
    router.get("/checkout");
  };

  const cartOrder  = () => setOrderType(false);
  const directOrder = () => setOrderType(true);

  const cartTotalPrice = computed(() =>
    cartItems.value
      .reduce((t, item) => t + (item?.individual_price || 0) * item.quantity, 0)
      .toFixed(2)
  );

  // Only a real pre-order makes the order a pre-order. A line that has since
  // gone out of stock is a problem for checkout, not a pre-order.
  const hasPreOrderItems = computed(() =>
    cartItems.value.some((item) => item.product && isPreOrder(item.product))
  );

  /** Lines that can no longer be bought, so checkout can say which. */
  const unavailableItems = computed(() =>
    cartItems.value.filter((item) => item.product && isOutOfStock(item.product))
  );

  const subtotal = computed(() =>
    cartItems.value.reduce((t, item) => t + (item?.individual_price || 0) * item.quantity, 0)
  );

  const total = computed(() => subtotal.value);

  const user_id = computed(() => authStore.user?.id ?? getGuestId());

  const incomplete_order_id = ref(0);

  /**
   * Add a line to the cart, refusing anything that is not for sale.
   *
   * The guard lives here rather than in each card and button: there are five
   * places that add to a cart, and one of them forgetting is a customer
   * ordering something the shop cannot ship. The server refuses it too — this
   * is what makes the refusal immediate and legible.
   *
   * @param cartData  what to add
   * @param product   the product being added, when the caller has it
   * @returns whether the request was sent
   */
  const addToCart = (cartData, product = null) => {
    if (product && isOutOfStock(product)) {
      toast.error("This product is currently out of stock.");
      return false;
    }

    router.post("/cart/add", withGuestId(cartData), {
      preserveScroll: true,
      onSuccess: () => {
        if (typeof window !== "undefined" && window.innerWidth > 768) {
          isCartOpen.value = true;
        }
        cartOrder();
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0] || "Failed to add to cart.");
      },
    });

    return true;
  };

  const removeItem = (cartId) => {
    router.post("/cart/remove", withGuestId({ cart_id: cartId }), {
      preserveScroll: true,
      onError: () => toast.error("Failed to remove item"),
    });
  };

  const clearCart = () => {
    router.post("/cart/clear", withGuestId(), {
      preserveScroll: true,
      onError: () => toast.error("Failed to clear cart"),
    });
  };

  const fetchCartItems = () => {};

  // For a real cart row (isRealCartItem), `quantityArg` is a delta (+1/-1)
  // applied server-side. For a direct-order pseudo item (no DB row yet),
  // `quantityArg` is the absolute new quantity written to localStorage.
  const updateCartItemQuantity = (cartId, quantityArg, attributeValues = [], isRealCartItem = true) => {
    if (isRealCartItem) {
      router.post("/cart/update", withGuestId({
        cart_id: cartId,
        quantity: quantityArg,
        attribute_values: attributeValues,
      }), {
        preserveScroll: true,
        preserveState: true,
        onError: (errors) => {
          toast.error(Object.values(errors)[0] || "Failed to update quantity.");
        },
      });
      return;
    }

    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("directOrderProductData"));
      if (data && data.product_id === cartId) {
        data.quantity = quantityArg;
        localStorage.setItem("directOrderProductData", JSON.stringify(data));
      }
    }
  };

  watch(() => page.url, () => { isCartOpen.value = false; });

  return {
    cartItems, cartCount, cartTotalPrice, hasPreOrderItems, unavailableItems,
    subtotal, total, user_id, incomplete_order_id,
    isCartOpen, is_direct_order,
    toggleCart, goToCheckout, setOrderType, cartOrder, directOrder,
    addToCart, removeItem, clearCart, fetchCartItems, updateCartItemQuantity,
    getGuestId, withGuestId,
  };
});
