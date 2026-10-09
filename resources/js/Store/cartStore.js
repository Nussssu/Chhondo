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
  const queued = {};
  const inFlight = {};
  let confirmedItems = items.value.map(item => ({ ...item }));
  let requests = Promise.resolve();
  let quantityFailed = false;
  const reconcileCart = (next = confirmedItems) => {
    confirmedItems = next.map(item => ({ ...item }));
    items.value = next.map(item => {
      const delta = (queued[item.id]?.delta || 0) + (inFlight[item.id]?.delta || 0);
      const quantity = Number(item.quantity) + delta;
      return { ...item, quantity, final_price: Number(item.individual_price) * quantity };
    });
  };
  watch(() => page.props.cartItems, (next) => { reconcileCart(next || []); });

  const cartItems = computed(() => items.value);
  const cartCount = computed(() => items.value.reduce((n, item) => n + (Number(item.quantity) || 0), 0));

  /** POST a cart route for JSON and take the cart it sends back. */
  const send = (url, data, acknowledged = () => {}) => {
    const operation = requests.catch(() => {}).then(async () => {
      const { data: res } = await axios.post(url, withGuestId(data), { headers: { Accept: "application/json" } });
      acknowledged();
      if (Array.isArray(res?.cartItems)) reconcileCart(res.cartItems);
      return res;
    });
    requests = operation;
    return operation;
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

  const goToCheckout = async () => {
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

    if (!await flushCartUpdates()) return;
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
        if (typeof window !== "undefined") {
          isCartOpen.value = true;
        }
        cartOrder();
      })
      .catch((error) => toast.error(reason(error, "কার্টে যোগ করা যায়নি।")));

    return true;
  };

  const removeItem = (cartId) => {
    clearTimeout(queued[cartId]?.timer);
    delete queued[cartId];
    const before = items.value;
    // Gone from the list at once; back if the server refuses.
    items.value = before.filter((item) => item.id !== cartId);
    send("/cart/remove", { cart_id: cartId }).catch(() => {
      items.value = before;
      toast.error("পণ্যটি মুছে ফেলা যায়নি");
    });
  };

  const clearCart = () => {
    for (const cartId of Object.keys(queued)) {
      clearTimeout(queued[cartId].timer);
      delete queued[cartId];
    }
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
      line.final_price = Number(line.individual_price) * next;
      items.value = [...items.value];
      quantityFailed = false;

      const pending = (queued[cartId] ||= { delta: 0, timer: null, attributeValues });
      pending.delta += quantityArg;
      pending.attributeValues = attributeValues;
      clearTimeout(pending.timer);
      pending.timer = setTimeout(() => flushQuantity(cartId), 150);
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

  const flushQuantity = (cartId) => {
    if (inFlight[cartId]) return inFlight[cartId].promise;
    const pending = queued[cartId];
    clearTimeout(pending?.timer);
    delete queued[cartId];
    if (!pending || !pending.delta) return Promise.resolve();

    const flight = { delta: pending.delta, promise: null };
    inFlight[cartId] = flight;
    flight.promise = send("/cart/update", {
      cart_id: cartId,
      quantity: pending.delta,
      attribute_values: pending.attributeValues,
    }, () => { delete inFlight[cartId]; }).catch((error) => {
      delete inFlight[cartId];
      clearTimeout(queued[cartId]?.timer);
      delete queued[cartId];
      quantityFailed = true;
      reconcileCart();
      toast.error(reason(error, "পরিমাণ আপডেট করা যায়নি।"));
    }).finally(() => {
      if (queued[cartId]) flushQuantity(cartId);
    });
    return flight.promise;
  };

  // Checkout reads persisted cart quantities; flush pending clicks first.
  const flushCartUpdates = async () => {
    do {
      const updates = Object.keys(queued).map(cartId => flushQuantity(cartId));
      updates.push(...Object.values(inFlight).map(flight => flight.promise));
      await Promise.all(updates);
    } while (Object.keys(queued).length || Object.keys(inFlight).length);
    const failed = quantityFailed;
    quantityFailed = false;
    return !failed;
  };

  watch(() => page.url, () => { isCartOpen.value = false; });

  return {
    cartItems, cartCount, cartTotalPrice, hasPreOrderItems, unavailableItems,
    subtotal, total, user_id, incomplete_order_id,
    isCartOpen, is_direct_order,
    toggleCart, goToCheckout, setOrderType, cartOrder, directOrder,
    addToCart, removeItem, clearCart, fetchCartItems, updateCartItemQuantity, flushCartUpdates,
    getGuestId, withGuestId,
  };
});
