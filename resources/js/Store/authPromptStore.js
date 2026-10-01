import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Controls the global "please log in" popup shown when a guest tries to
 * perform an action that requires an account (e.g. saving to the wishlist).
 */
export const useAuthPromptStore = defineStore("authPrompt", () => {
  const isOpen = ref(false);
  const message = ref("Please log in to continue.");

  const open = (msg = "Please log in to continue.") => {
    message.value = msg;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, message, open, close };
});
