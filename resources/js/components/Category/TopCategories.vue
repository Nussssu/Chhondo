<script setup>
import { defineProps } from "vue";
import { Link } from "@inertiajs/vue3";
import { Swiper, SwiperSlide } from "swiper/vue"; // Import Swiper components
import "swiper/css"; // Import Swiper CSS
import "swiper/css/free-mode"; // Optional: Free mode scrolling
import "swiper/css/pagination"; // Optional: Pagination
import { FreeMode, Pagination, Navigation } from "swiper/modules"; // Import Swiper modules
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <section class="md:py-12 py-8 max-w-[95%] m-auto px-5 md:px-10 relative">
        <!-- Section Title -->
        <h2
            class="c-title text-center mb-8 relative body-3-sb uppercase flex items-center justify-center before:content-[''] before:flex-grow before:border-t before:border-black before:mr-4 after:content-[''] after:flex-grow after:border-t after:border-black after:ml-4"
        >
            TOP CATEGORIES
        </h2>
        <button
            class="custom-prev-button absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
        >
            <ChevronLeft class="w-6 h-6 text-gray-600" />
        </button>

        <button
            class="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
        >
            <ChevronRight class="w-6 h-6 text-gray-600" />
        </button>
        <!-- Swiper Container -->
        <Swiper
            :slides-per-view="2"
            :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 4, spaceBetween: 10 },
                1000: { slidesPerView: 5, spaceBetween: 30 },
                1440: { slidesPerView: 7, spaceBetween: 30 },
            }"
            :modules="[Navigation, FreeMode]"
            :navigation="{
                prevEl: '.custom-prev-button',
                nextEl: '.custom-next-button',
            }"
            class="mySwiper justify-center flex"
        >
            <SwiperSlide
                v-for="category in categories"
                :key="category.id"
                class="md:min-h-[200px]"
            >
                <Link
                    :href="'/product-category/' + category.slug"
                    class="group"
                >
                    <div
                        class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[130px] md:h-[170px] xl:h-[200px] category-card"
                    >
                        <img
                            :src="category.image"
                            :alt="category.name"
                            width="200"
                            height="200"
                            class="w-full h-full object-cover transition-transform duration-300"
                            fetchpriority="high"
                            loading="eager"
                        />
                        <!-- Hover Overlay -->
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
                        ></div>

                        <!-- Category Name -->
                        <div
                            class="absolute bottom-[30%] w-full bg-[#FFFDFDAD] px-2 py-1"
                        >
                            <!-- <h3
                class="text-black font-medium text-center md:text-sm text-[11px] w-full"
              >
                {{ category.name }}
              </h3> -->
                            <h3
                                class="text-black font-medium text-center text-[11px] md:text-sm leading-[1.4] w-full min-h-[20px]"
                            >
                                {{ category.name }}
                            </h3>
                        </div>
                    </div>
                </Link>
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<style scoped>
.category-card {
    overflow: hidden;
    filter: brightness(100%) contrast(100%) saturate(100%) blur(0px)
        hue-rotate(0deg);
    border-style: dashed;
    border-width: 2px;
    border-color: var(--color-theme);
    border-radius: 15px;
    box-shadow: 0px 0px 10px 0px var(--color-secondary);
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    display: none;
}
</style>
