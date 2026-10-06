import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/Store/authStore";
import { toast } from "@steveyuowo/vue-hot-toast";
import { usePage, router } from "@inertiajs/vue3";
import axios from "axios";
import { isOutOfStock, isPreOrder } from '@/utils/stock'

export const useCartStore = defineStore("cartStore", () => {
  const page      = usePage();
  const authStore = useAuthStore();
  const isCartOpen      = ref(false);
  const is_direct_order = ref(false);

  if (typeof window !== "undefined") {
    is_direct_order.value = localStorage.getItem("is_direct_order") === "true";
  }

  /*
   * The cart lives here, seeded from the shared props on every page load.
   * Changes are made through background JSON requests (the cart routes answer
   * JSON when asked), so a click updates the cart without re-fetching the
   * whole page. Quantity and remove update on screen at once and are rolled
   * back if the server refuses.
   */
  const items = ref(page.props.cartItems || []);
  watch(() => page.props.cartItems, (next) => { items.value = next || []; });

  const cartItems = computed(() => items.value);
  const cartCount = computed(() => items.value.reduce((n, item) => n + (Number(item.quantity) || 0), 0));

  /** POST a cart route for JSON and take the cart it sends back. */
  const send = async (url, data) => {
    const { data: res } = await axios.post(url, withGuestId(data), { headers: { Accept: "application/json" } });
    if (Array.isArray(res?.cartItems)) items.value = res.cartItems;
    return res;
  };

  /** The server's reason, or a fallback. */
  const reason = (error, fallback) => {
    const errors = error?.response?.data?.errors;
    const first = errors && Object.values(errors)[0];
    return (Array.isArray(first) ? first[0] : first) || error?.response?.data?.message || fallback;
  };

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
      toast.error("এই পণ্যটি বর্তমানে স্টকে নেই।");
      return false;
    }

    send("/cart/add", cartData)
      .then(() => {
        if (typeof window !== "undefined" && window.innerWidth > 768) {
          isCartOpen.value = true;
        }
        cartOrder();
      })
      .catch((error) => toast.error(reason(error, "কার্টে যোগ করা যায়নি।")));

    return true;
  };

  const removeItem = (cartId) => {
    const before = items.value;
    // Gone from the list at once; back if the server refuses.
    items.value = before.filter((item) => item.id !== cartId);
    send("/cart/remove", { cart_id: cartId }).catch(() => {
      items.value = before;
      toast.error("পণ্যটি মুছে ফেলা যায়নি");
    });
  };

  const clearCart = () => {
    const before = items.value;
    items.value = [];
    send("/cart/clear").catch(() => {
      items.value = before;
      toast.error("কার্ট খালি করা যায়নি");
    });
  };

  const fetchCartItems = () => {};

  // For a real cart row (isRealCartItem), `quantityArg` is a delta (+1/-1)
  // applied server-side. For a direct-order pseudo item (no DB row yet),
  // `quantityArg` is the absolute new quantity written to localStorage.
  const updateCartItemQuantity = (cartId, quantityArg, attributeValues = [], isRealCartItem = true) => {
    if (isRealCartItem) {
      const line = items.value.find((item) => item.id === cartId);
      if (!line) return;

      const next = (Number(line.quantity) || 0) + quantityArg;
      if (next < 1) return;

      // The new quantity shows at once; rapid clicks are sent as one change.
      line.quantity = next;
      items.value = [...items.value];

      const pending = (queued[cartId] ||= { delta: 0, timer: null, attributeValues });
      pending.delta += quantityArg;
      pending.attributeValues = attributeValues;
      clearTimeout(pending.timer);
      pending.timer = setTimeout(() => flushQuantity(cartId), 250);
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

  // Quantity changes waiting to be sent, per cart line.
  const queued = {};

  const flushQuantity = (cartId) => {
    const pending = queued[cartId];
    delete queued[cartId];
    if (!pending || !pending.delta) return;

    send("/cart/update", {
      cart_id: cartId,
      quantity: pending.delta,
      attribute_values: pending.attributeValues,
    }).catch((error) => {
      toast.error(reason(error, "পরিমাণ আপডেট করা যায়নি।"));
      // Put back what the server holds.
      router.reload({ only: ["cartItems", "cartCount"] });
    });
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
