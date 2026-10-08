<script setup>
import ResponsiveImage from "@/components/ResponsiveImage.vue"
import { Link } from "@inertiajs/vue3";
import { ChevronDownIcon } from "lucide-vue-next";

import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";

const props = defineProps({
  menuItems: Array,
  categories: {
    type: Array,
    default: () => [],
  },
});

// Header options come from Settings › Header & footer.
const settings = computed(() => usePage().props.layout?.header ?? {});
const showCategories = computed(() => settings.value.options_enabled !== false && settings.value.show_categories_menu !== false);

// Rendered in two passes: the categories dropdown, then everything else.
// A categories item is hidden when the header option turns those dropdowns off.
const visibleItems = computed(() =>
  (props.menuItems ?? []).filter((i) => i.type !== "categories" || showCategories.value)
);

/**
 * The categories one dropdown lists.
 *
 * An item with no selection shows every category, which is how the dropdown
 * behaved before it could be narrowed. A selection is shown in the order it
 * was arranged in the admin, not the order the categories happen to load in.
 */
const categoriesFor = (item) => {
  const picked = item.categoryIds ?? [];

  if (!picked.length) return props.categories;

  const byId = new Map(props.categories.map((c) => [Number(c.id), c]));

  return picked.map((id) => byId.get(Number(id))).filter(Boolean);
};
</script>

<template>
  <nav class="bg-transparent">
    <div class="w-full mx-auto">
      <ul class="header-main-menu flex items-center flex-wrap gap-x-7">

        <!-- Menu items, in the order they are arranged in the admin. A
             "categories" item fills its dropdown from the product categories;
             any other item shows the sub items given to it. -->
        <li
          v-for="item in visibleItems"
          :key="item.id"
          class="relative group py-3"
        >
          <Link
            :href="item.url || '/shop'"
            :target="item.target || '_self'"
            class="text-gray-700 text-nowrap hover:text-theme flex items-center body-2-r transition-colors duration-200"
          >
            {{ item.title }}
            <ChevronDownIcon
              v-if="item.submenu?.length || (item.type === 'categories' && categoriesFor(item).length)"
              class="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200"
            />
          </Link>

          <!-- Categories dropdown -->
          <div
            v-if="item.type === 'categories' && categoriesFor(item).length"
            class="absolute top-full left-0 mt-0 min-w-[14rem] saree-dropdown opacity-0 invisible
                   group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50"
          >
            <ul class="py-1.5">
              <li v-for="category in categoriesFor(item)" :key="category.id">
                <Link
                  :href="`/product-category/${category.slug}`"
                  class="saree-dropdown-item"
                >
                  <!-- A 32px icon inside a dropdown. These were loading the
                       full-size category upload eagerly — 478KB across two
                       images, on every page load, for a menu most visitors
                       never open. -->
                  <ResponsiveImage
                    v-if="category.image"
                    :src="category.image"
                    :alt="category.name"
                    :width="32"
                    :height="32"
                    sizes="32px"
                    img-class="saree-dropdown-img"
                  />
                  <span>{{ category.name }}</span>
                </Link>
              </li>
            </ul>
          </div>

          <!-- First level submenu -->
          <div
            v-if="item.submenu?.length"
            class="absolute top-full left-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible
                   group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
          >
            <ul class="py-2">
              <li
                v-for="subItem in item.submenu"
                :key="subItem.id"
                class="relative group/sub"
              >
                <Link
                  :href="subItem.url"
                  class="block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme flex items-center justify-between"
                >
                  {{ subItem.title }}
                  <ChevronDownIcon
                    v-if="subItem.submenu?.length"
                    class="h-4 w-4 ml-1 -rotate-90 group-hover/sub:rotate-0 transition-transform duration-200"
                  />
                </Link>

                <!-- Second level submenu -->
                <div
                  v-if="subItem.submenu?.length"
                  class="absolute left-full top-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-lg opacity-0 invisible
                         group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300"
                >
                  <ul class="py-2">
                    <li
                      v-for="nestedItem in subItem.submenu"
                      :key="nestedItem.id"
                      class="relative group/nested"
                    >
                      <Link
                        :href="nestedItem.url"
                        class="block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme flex items-center justify-between"
                      >
                        {{ nestedItem.title }}
                        <ChevronDownIcon
                          v-if="nestedItem.submenu?.length"
                          class="h-4 w-4 ml-1 -rotate-90 group-hover/nested:rotate-0 transition-transform duration-200"
                        />
                      </Link>

                      <!-- Third level submenu -->
                      <div
                        v-if="nestedItem.submenu?.length"
                        class="absolute left-full top-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-lg opacity-0 invisible
                               group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300"
                      >
                        <ul class="py-2">
                          <li v-for="deepItem in nestedItem.submenu" :key="deepItem.id">
                            <Link
                              :href="deepItem.url"
                              class="block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme"
                            >
                              {{ deepItem.title }}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.header-main-menu > li > a {
  /* Bangla labels set in Li Ador Noirrit (Figma); English ones from the admin in Poppins. */
  font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1a1817;
}
.header-main-menu > li > a:hover { color: #cc9b25; }
.header-main-menu > li > a :deep(svg) { width: 24px; height: 24px; stroke-width: 1.25; margin-left: 6px; }

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

.saree-dropdown {
  background-color: #fff;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.saree-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.saree-dropdown-item:hover {
  background-color: #f7f7f5;
  color: var(--color-theme);
}

.saree-dropdown-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
