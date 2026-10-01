import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import { toast } from '@steveyuowo/vue-hot-toast';

export const useAuthStore = defineStore('auth', () => {
  const page = usePage();

  // User comes from Inertia shared props — no axios needed
  const user = computed(() => page.props.auth?.user || null);
  const isAuthenticated = computed(() => !!user.value);

  // Guest ID is still kept in localStorage for cart continuity before session syncs
  const guestId = ref(null);

  const initGuestId = () => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('guest_id');
      if (storedId) {
        guestId.value = storedId;
      } else {
        const newId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem('guest_id', newId);
        guestId.value = newId;
      }
    }
  };

  const initAuth = () => {
    if (typeof window !== 'undefined') {
      initGuestId();
    }
  };

  const logout = () => {
    router.post('/auth/logout', {}, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
    });
  };

  // Initialise on store creation
  initAuth();

  return {
    user,
    isAuthenticated,
    guestId,
    logout,
    initAuth,
    // Kept for backward compatibility; no-op since user comes from Inertia props
    fetchUserDetails: () => {},
  };
});
