import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { usePage, router } from "@inertiajs/vue3";
import { toast } from "@steveyuowo/vue-hot-toast";
import axiosInstance from "@/services/axiosInstance";
import { useAuthStore } from "@/Store/authStore";
import { useAuthPromptStore } from "@/Store/authPromptStore";

const GUEST_KEY = "guest_wishlist";        // localStorage: array of product ids
const NUDGE_KEY = "wishlist_nudge_shown";  // sessionStorage: one nudge per session

export const useWishlistStore = defineStore("wishlist", () => {
  const page = usePage();
  const authStore = useAuthStore();
  const authPrompt = useAuthPromptStore();

  const ids = ref(new Set());
  const pending = ref(new Set());

  const resolveId = (product) =>
    Number(product && typeof product === "object" ? product.id : product);

  // ---- Guest (localStorage) helpers ---------------------------------------
  const readGuestIds = () => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(Number) : [];
    } catch (e) {
      return [];
    }
  };

  const writeGuestIds = (set) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify([...set]));
    } catch (e) {
      /* ignore quota / privacy-mode errors */
    }
  };

  const clearGuestIds = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch (e) {
      /* ignore */
    }
  };

  // Seed `ids` from the right source: server props when logged in, else local.
  const syncFromSource = () => {
    if (authStore.isAuthenticated) {
      ids.value = new Set((page.props.wishlistIds || []).map(Number));
    } else {
      ids.value = new Set(readGuestIds());
    }
  };

  syncFromSource();
  watch(() => page.props.wishlistIds, syncFromSource);
  watch(() => authStore.isAuthenticated, () => {
    syncFromSource();
    if (authStore.isAuthenticated) mergeGuestWishlist();
  });

  const count = computed(() => ids.value.size);
  const isWishlisted = (product) => ids.value.has(resolveId(product));
  const isPending = (product) => pending.value.has(resolveId(product));

  // Show the login nudge at most once per browser session.
  const maybeNudge = () => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(NUDGE_KEY)) return;
        sessionStorage.setItem(NUDGE_KEY, "1");
      } catch (e) {
        /* if sessionStorage is unavailable, just show it */
      }
    }
    authPrompt.open("Log in to save your wishlist permanently and access it on any device.");
  };

  const toggle = async (product) => {
    const productId = resolveId(product);
    if (!productId) return;

    // ---- Guest: keep a local wishlist, fill hearts, nudge once -------------
    if (!authStore.isAuthenticated) {
      const next = new Set(ids.value);
      const wasIn = next.has(productId);
      wasIn ? next.delete(productId) : next.add(productId);
      ids.value = next;
      writeGuestIds(next);

      if (!wasIn) maybeNudge();
      return;
    }

    // ---- Authenticated: optimistic update against the API ------------------
    if (pending.value.has(productId)) return;
    pending.value = new Set(pending.value).add(productId);

    const wasWishlisted = ids.value.has(productId);
    const next = new Set(ids.value);
    wasWishlisted ? next.delete(productId) : next.add(productId);
    ids.value = next;

    try {
      if (wasWishlisted) {
        await axiosInstance.post(`/remove/from/wishlist/${productId}`);
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post(`/add/to/wishlist/${productId}`);
        toast.success("Added to wishlist");
      }
    } catch (e) {
      // Revert optimistic change on failure.
      const revert = new Set(ids.value);
      wasWishlisted ? revert.add(productId) : revert.delete(productId);
      ids.value = revert;

      if (e?.response?.status !== 401) {
        toast.error("Could not update wishlist. Please try again.");
      }
    } finally {
      const done = new Set(pending.value);
      done.delete(productId);
      pending.value = done;
    }
  };

  // Merge any locally-saved guest wishlist into the account after login.
  const mergeGuestWishlist = async () => {
    if (!authStore.isAuthenticated) return;

    const guestIds = readGuestIds();
    if (!guestIds.length) return;

    // Clear immediately so a double-trigger can't merge twice.
    clearGuestIds();

    // Optimistically show the merged items while the requests run.
    ids.value = new Set([...ids.value, ...guestIds]);

    // Server-side firstOrCreate makes each add idempotent.
    await Promise.allSettled(
      guestIds.map((id) => axiosInstance.post(`/add/to/wishlist/${id}`))
    );

    // Pull the authoritative list back into the shared prop.
    router.reload({ only: ["wishlistIds"] });
  };

  // If we loaded straight into an authenticated page (e.g. right after the
  // login redirect), merge any pending guest items now.
  if (authStore.isAuthenticated) {
    mergeGuestWishlist();
  }

  return { ids, count, isWishlisted, isPending, toggle, mergeGuestWishlist };
});
