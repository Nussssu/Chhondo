<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { parseGalleryImages } from "@/utils/galleryImages";
import { videoEmbedUrl, videoThumbnailUrl } from "@/utils/videoEmbed";

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['imageFunction']);

const productItems = ref([]);
const thumbsSwiper = ref(null);
const mainSwiper = ref(null);
const activeIndex = ref(0);

const hasLeadingVideo = computed(() => productItems.value[0]?.type === "video");

/** Stored relative to public/; an absolute URL is used untouched. */
const videoSrc = (value) => {
    if (!value) return value;
    return /^(https?:)?\/\//.test(value) ? value : "/" + String(value).replace(/^\/+/, "");
};

// Whether the thumbnail strip can scroll further each way. Drives the small
// arrows that tell shoppers there are more pictures than the four in view.
const thumbsAtStart = ref(true);
const thumbsAtEnd = ref(true);

const updateThumbEdges = (swiper = thumbsSwiper.value) => {
    if (!swiper || swiper.destroyed) return;
    // isLocked: everything already fits, so there is nothing to scroll to.
    thumbsAtStart.value = swiper.isLocked || swiper.isBeginning;
    thumbsAtEnd.value = swiper.isLocked || swiper.isEnd;
};

const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
    nextTick(() => updateThumbEdges(swiper));
};

const scrollThumbs = (direction) => {
    const swiper = thumbsSwiper.value;
    if (!swiper) return;
    direction < 0 ? swiper.slidePrev() : swiper.slideNext();
};

const setMainSwiper = (swiper) => {
    mainSwiper.value = swiper;
};

const handleSlideChange = (swiper) => {
    activeIndex.value = swiper.activeIndex;
};

onMounted(() => {
    emit('imageFunction', findImage);
});

const findImage = (colorIndex) => {
    if (!mainSwiper.value || !thumbsSwiper.value) {
        console.warn('Swipers not yet initialized');
        return;
    }

    // Colour links index into the images. A leading video shifts them all by
    // one, so without this offset every swatch selects the wrong picture.
    const targetIndex = colorIndex + 1 + (hasLeadingVideo.value ? 1 : 0);

    if (targetIndex < productItems.value.length) {
        mainSwiper.value.slideTo(targetIndex);
        thumbsSwiper.value.slideTo(targetIndex);
        activeIndex.value = targetIndex;
    }
};

watch(
    () => props.product,
    (newProduct) => {
        if (!newProduct) return;

        const parsedImages = parseGalleryImages(newProduct.gallery_images);

        const images = [newProduct.featured_image || '/placeholder.svg', ...parsedImages].filter(Boolean).map((img) => ({
            type: "image",
            src: img,
        }));

        // The video leads the gallery when there is one — it is the product's
        // strongest introduction, and it replaces the old separate section.
        if (newProduct.video_link || newProduct.video) {
            images.unshift({
                type: "video",
                src: videoSrc(newProduct.video),
                host: newProduct.video_host,
                // Resolved once here rather than in the template, so a pasted
                // link, a share URL and an embed code all end up identical.
                embedUrl: videoEmbedUrl(newProduct.video_host, newProduct.video_link),
                poster: videoThumbnailUrl(newProduct.video_host, newProduct.video_link),
            });
        }

        productItems.value = images;
        // A different product may bring more or fewer thumbnails.
        nextTick(() => updateThumbEdges());
    },
    { immediate: true }
);

const discountPercentage = computed(() => {
    const { price, previous_price } = props.product;
    if (!previous_price || previous_price <= 0) return 0;
    const discount = ((previous_price - price) / previous_price) * 100;
    return Math.round(discount);
});

</script>

<template>
    <div class="flex flex-col gap-6 product-images-area">
        <!-- Main Swiper -->
        <div class="pdp-main-frame relative w-full">
            <swiper
                :modules="[Navigation, Thumbs]"
                :thumbs="{ swiper: thumbsSwiper }"
                :navigation="{
                    nextEl: '.product-button-next',
                    prevEl: '.product-button-prev',
                }"
                @swiper="setMainSwiper"
                @slideChange="handleSlideChange"
                class="product-swiper"
            >
                <swiper-slide v-for="(item, index) in productItems" :key="index">
                    <!-- Image Slide -->
                    <div v-if="item.type === 'image'" class="relative overflow-hidden">
                        <img
                            :src="item.src || '/placeholder.svg'"
                            :alt="`Product image ${index + 1}`"
                            class="w-full h-auto"
                            fetchpriority="high"
                            loading="lazy"
                            decoding="async"
                            @error="$event.target.src = '/placeholder.svg'"
                        />
                    </div>

                    <!-- Video Slide. The frame matches the 2:3 product images
                         so the slider does not resize between slides — a fixed
                         pixel height left an empty band under the video. -->
                    <div v-else class="video-container relative w-full aspect-[2/3] bg-black overflow-hidden">
                        <!-- Hosted video. An iframe cannot object-fit, so the
                             embed is scaled to overflow the frame and centred,
                             which crops it the way object-cover would. -->
                        <div v-if="item.embedUrl" class="embed-cover">
                            <iframe
                                :src="item.embedUrl"
                                frameborder="0"
                                allow="autoplay; encrypted-media"
                                referrerpolicy="strict-origin-when-cross-origin"
                                tabindex="-1"
                                aria-hidden="true"
                            ></iframe>
                        </div>

                        <!-- A host was chosen but the link could not be read. -->
                        <div
                            v-else-if="item.host === 'Youtube' || item.host === 'Gdrive'"
                            class="absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center"
                        >
                            This video link could not be read.
                        </div>

                        <!-- No controls: the video plays as part of the gallery
                             rather than as a player. muted is also what makes
                             autoplay permitted, and playsinline stops iOS
                             taking it fullscreen. -->
                        <video
                            v-else
                            autoplay
                            muted
                            loop
                            playsinline
                            preload="metadata"
                            class="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        >
                            <source :src="item.src" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </swiper-slide>
            </swiper>

            <!-- Navigation Arrows -->
            <button class="product-button-prev nav-arrow nav-arrow--left">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="product-button-next nav-arrow nav-arrow--right">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <!-- Discount Badge -->
            <div v-if="discountPercentage > 0" class="absolute top-4 right-4 z-10">
                <span class="bg-[#252f17] text-white rounded-full py-1 px-3 text-[13px] font-semibold">
                    -{{ discountPercentage }}%
                </span>
            </div>

        </div>

        <!-- Thumbnails (horizontal, below main image) — Figma: 114px, gap 24, active 1.5px Green/400 border -->
        <div v-if="productItems.length > 1" class="thumbs-wrap">
        <swiper
            :modules="[Thumbs, FreeMode, Navigation]"
            :direction="'horizontal'"
            :slides-per-view="4"
            :space-between="12"
            :breakpoints="{ 768: { slidesPerView: 4, spaceBetween: 33 } }"
            :free-mode="true"
            :watch-slides-progress="true"
            @swiper="setThumbsSwiper"
            @progress="updateThumbEdges"
            @resize="updateThumbEdges"
            @transition-end="updateThumbEdges"
            @lock="updateThumbEdges"
            @unlock="updateThumbEdges"
            class="thumbs-swiper w-full"
        >
            <swiper-slide v-for="(item, index) in productItems" :key="index">
                <div :class="[
                    'aspect-square relative cursor-pointer rounded-lg overflow-hidden border-[1.5px] transition-all',
                    {
                        'border-[#ddbc6d]': index === activeIndex,
                        'border-transparent opacity-50 hover:opacity-90': index !== activeIndex,
                    },
                ]">
                    <img
                        v-if="item.type === 'image'"
                        :src="item.src || '/placeholder.svg'"
                        :alt="`Thumbnail ${index + 1}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        fetchpriority="low"
                        decoding="async"
                        @error="$event.target.src = '/placeholder.svg'"
                    />
                    <!-- A frame from the video itself reads far better than a
                         black tile. #t=0.1 makes browsers paint the first frame
                         without downloading the whole file. Hosted videos have
                         no direct source, so they keep the plain tile. -->
                    <div v-else class="relative w-full h-full bg-black">
                        <img
                            v-if="item.poster"
                            :src="item.poster"
                            alt=""
                            class="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <video
                            v-else-if="item.src"
                            :src="`${item.src}#t=0.1`"
                            muted
                            playsinline
                            preload="metadata"
                            tabindex="-1"
                            class="w-full h-full object-cover pointer-events-none"
                        ></video>
                        <span class="absolute inset-0 flex items-center justify-center">
                            <span class="thumb-play">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>

            <!-- Shown only while there are more thumbnails that way. -->
            <button
                v-show="!thumbsAtStart"
                type="button"
                class="thumb-arrow thumb-arrow--left"
                aria-label="আগের ছবিগুলো দেখুন"
                @click="scrollThumbs(-1)"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button
                v-show="!thumbsAtEnd"
                type="button"
                class="thumb-arrow thumb-arrow--right"
                aria-label="আরও ছবি দেখুন"
                @click="scrollThumbs(1)"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.product-swiper {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-swiper img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
}

/* ===== NAV ARROWS — Figma: 56px solid green circles ===== */
.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #356019;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .nav-arrow {
        width: 56px;
        height: 56px;
    }
}

.nav-arrow:hover {
    background-color: #2a4d14;
}

.nav-arrow--left {
    left: 12px;
}

.nav-arrow--right {
    right: 12px;
}

.nav-arrow.swiper-button-disabled,
/* The gallery opens on its first image, where Swiper disables "previous"; show
   it that way on the server-rendered page too, before Swiper starts. */
.product-swiper:not(.swiper-initialized) ~ .nav-arrow--left {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ===== THUMBS ===== */
.thumbs-swiper {
    padding: 4px 0;
}

.thumbs-wrap {
    position: relative;
}

/* Small arrows over the ends of the thumbnail strip, so it reads as
   scrollable when some pictures are out of view. */
.thumb-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.95);
    color: #356019;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    transition: background-color 0.2s ease, color 0.2s ease;
}

.thumb-arrow:hover {
    background-color: #356019;
    color: #fff;
}

.thumb-arrow:focus-visible {
    outline: 2px solid #356019;
    outline-offset: 2px;
}

.thumb-arrow--left {
    left: 6px;
}

.thumb-arrow--right {
    right: 6px;
}

/* An iframe ignores object-fit, so the embed is sized to overflow the 2:3
   frame and centred: height fills the frame, aspect-ratio gives it the width a
   16:9 video needs, and min-width guarantees it is never narrower. */
.embed-cover {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.embed-cover iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: auto;
    min-width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;

    /* YouTube reveals its title and share overlay on hover, and Drive draws its
       own control bar — neither can be turned off by a parameter. Blocking
       pointer events means the embed never sees the hover or click, so it plays
       as a silent loop and swipe gestures reach the slider instead. */
    pointer-events: none;
}

/* Play badge over the video thumbnail — legible on any frame. */
.thumb-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    padding-left: 2px;
}

.thumbs-swiper .swiper-slide {
    cursor: pointer;
}

/* ===== Figma gallery: 555 × 712 r8 image, 56px arrows straddling its edges ===== */
.pdp-main-frame { overflow: visible; }
.pdp-main-frame .product-swiper { border-radius: 8px; overflow: hidden; background: #f3f3f3; }
.product-swiper :deep(.swiper-slide) > div:first-child:not(.video-container) { aspect-ratio: 555 / 712; }
.product-swiper img { height: 100%; object-fit: cover; }

.nav-arrow {
    width: 56px;
    height: 56px;
    border-radius: 88px;
    box-shadow: none;
    transition: background-color .2s ease, color .2s ease, opacity .2s ease;
}
.nav-arrow--left { left: -28px; background-color: #252f17; color: #fff; }
.nav-arrow--left:hover { background-color: #1a2110; }
.nav-arrow--right { right: -28px; background-color: #fff; color: #1a1817; border: .9px solid #e4e1e0; }
.nav-arrow--right:hover { background-color: #faf5e9; }

@media (max-width: 767px) {
    .nav-arrow { width: 40px; height: 40px; }
    .nav-arrow svg { width: 24px; height: 24px; }
    .nav-arrow--left { left: 8px; }
    .nav-arrow--right { right: 8px; }
}
</style>
