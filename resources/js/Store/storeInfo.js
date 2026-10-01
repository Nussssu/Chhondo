import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

export const useStoreInfo = defineStore('storeInfo', () => {
  const page = usePage();

  // storeInfo comes from HandleInertiaRequests shared props
  const storeInfo = computed(() => page.props.storeInfo || null);

  // Kept for backward compatibility; no-op since data comes from Inertia props
  const fetchStoreData = () => {};

  return {
    storeInfo,
    fetchStoreData,
  };
});
