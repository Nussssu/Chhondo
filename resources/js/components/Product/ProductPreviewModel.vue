<template>
    <transition name="modal-fade">
        <div
            v-if="isOpen"
            class="fixed inset-0 flex items-center justify-center z-50"
        >
            <!-- Backdrop -->
            <div
                class="preview-backdrop absolute inset-0"
                @click="closeModal"
            ></div>

            <!-- Modal — Figma 107:2227: white, r8, 860x560, p24 -->
            <div class="preview-modal relative bg-white rounded-lg shadow-2xl w-[88vw] max-w-[860px] overflow-hidden">
                <!-- Close Button -->
                <button
                    @click="closeModal"
                    class="preview-close"
                    aria-label="Close preview"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>

                <!-- Always-visible scroll indicator (mobile) -->
                <div v-show="showScrollbar" class="preview-scrollbar" aria-hidden="true">
                    <div
                        class="preview-scrollbar-thumb"
                        :style="{ height: thumbHeight + 'px', transform: `translateY(${thumbTop}px)` }"
                    ></div>
                </div>

                <div
                    ref="scrollArea"
                    @scroll="updateScrollbar"
                    class="preview-scroll flex flex-col md:flex-row md:items-start gap-4 md:gap-6 p-4 md:p-6"
                >
                    <!-- Left: Image Carousel -->
                    <div class="preview-image-area w-full md:w-[339px] shrink-0 flex flex-col items-center">
                        <!-- Image / Video -->
                        <div class="preview-image-container relative rounded-lg overflow-hidden bg-[#f5f0eb] w-full md:w-[339px] h-[360px] md:h-[490px]">
                            <div class="w-full h-full overflow-hidden relative">
                                <!-- Video Slide (leads the gallery, like the details page) -->
                                <div
                                    v-if="productItems[activeIndex]?.type === 'video'"
                                    class="absolute inset-0 bg-black overflow-hidden"
                                >
                                    <!-- Hosted video: iframe scaled to cover the frame -->
                                    <div v-if="productItems[activeIndex].embedUrl" class="preview-embed-cover">
                                        <iframe
                                            :src="productItems[activeIndex].embedUrl"
                                            frameborder="0"
                                            allow="autoplay; encrypted-media"
                                            referrerpolicy="strict-origin-when-cross-origin"
                                            tabindex="-1"
                                            aria-hidden="true"
                                        ></iframe>
                                    </div>

                                    <!-- A host was chosen but the link could not be read. -->
                                    <div
                                        v-else-if="productItems[activeIndex].host === 'Youtube' || productItems[activeIndex].host === 'Gdrive'"
                                        class="absolute inset-0 flex items-center justify-center text-white/70 text-sm px-6 text-center"
                                    >
                                        This video link could not be read.
                                    </div>

                                    <!-- Self-hosted video: plays as part of the gallery -->
                                    <video
                                        v-else
                                        autoplay
                                        muted
                                        loop
                                        playsinline
                                        preload="metadata"
                                        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    >
                                        <source :src="productItems[activeIndex].src" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <!-- Image Slide -->
                                <transition v-else :name="slideDirection">
                                    <img
                                        :key="activeIndex"
                                        :src="currentImage || '/placeholder.svg'"
                                        :alt="product?.product_name"
                                        class="w-full h-full object-cover absolute inset-0"
                                        @error="$event.target.src = '/placeholder.svg'"
                                    />
                                </transition>
                            </div>

                                            <!-- Image Counter — bottom right of image -->
                            <div
                                v-if="productItems.length > 1"
                                class="preview-img-counter"
                            >
                                {{ activeIndex + 1 }} / {{ productItems.length }}
                            </div>

                            <!-- Nav Arrows -->
                            <button
                                v-if="productItems.length > 1"
                                type="button"
                                aria-label="Previous image"
                                @click.stop="prevSlide"
                                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                v-if="productItems.length > 1"
                                type="button"
                                aria-label="Next image"
                                @click.stop="nextSlide"
                                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>

                        <!-- Below image: Dot Indicators — Figma: active 24x8 Gold/300, rest 8x8 Gold/100 -->
                        <div
                            v-if="productItems.length > 1"
                            class="flex items-center gap-2 mt-3"
                        >
                            <button
                                v-for="(item, index) in productItems"
                                :key="index"
                                @click="goToSlide(index)"
                                :class="[
                                    'h-2 rounded-full transition-all duration-300',
                                    index === activeIndex
                                        ? 'bg-[#ddbc6d] w-6'
                                        : 'bg-[#efe0bb] hover:bg-[#ddbc6d] w-2',
                                ]"
                            ></button>
                        </div>
                    </div>

                    <!-- Right: Product Info -->
                    <div
                        v-if="product"
                        class="preview-info w-full md:flex-1 flex flex-col gap-6 md:max-h-[520px] md:overflow-y-auto md:pr-1"
                    >
                        <!-- Name + Price + Description -->
                        <div>
                            <h2 class="preview-product-name">
                                {{ product.product_name }}
                            </h2>
                            <div class="flex items-center gap-3 mt-2 flex-wrap">
                                <span class="preview-price" :class="{ 'price-flash': priceFlash }">
                                    {{ displayPrice }} <span class="preview-price-sign">৳</span>
                                </span>
                                <span
                                    v-if="wasPrice"
                                    class="body-2-r text-gray-400 line-through"
                                >
                                    {{ wasPrice }}<span class="bangla-font">৳</span>
                                </span>
                                <span v-if="isPreOrderProduct" class="preview-stock preview-stock--preorder">
                                    প্রি-অর্ডার
                                </span>
                                <span v-else-if="isSoldOut" class="preview-stock preview-stock--soldout">
                                    স্টকে নেই
                                </span>
                                <span v-else class="preview-stock">
                                    স্টকে আছে
                                </span>
                            </div>

                            <!-- Short Description -->
                            <div
                                v-if="mergedProduct?.short_description"
                                class="preview-description mt-6"
                                v-html="rebrand(firstLineDescription)"
                            ></div>
                        </div>

                        <!-- Quantity — Figma puts it straight under the description.
                             Hidden entirely when nothing can be bought: a
                             quantity to choose implies an order to place. -->
                            <div v-if="!cannotBuy" class="preview-qty-col">
                                <label class="preview-option-label">পরিমাণ:</label>
                                <div class="preview-qty-stepper mt-2">
                                    <button
                                        @click="decrementQuantity"
                                        :disabled="quantity <= 1 || cannotBuy"
                                        class="preview-qty-btn"
                                        aria-label="Decrease quantity"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <path d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <span class="preview-qty-value">
                                        {{ quantity }}
                                    </span>
                                    <button
                                        @click="incrementQuantity"
                                        :disabled="cannotBuy"
                                        class="preview-qty-btn"
                                        aria-label="Increase quantity"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <path d="M12 5v14" />
                                            <path d="M5 12h14" />
                                        </svg>
                                    </button>
                                </div>
                            </div>


                        <!-- Blouse Option (only when product has it) -->
                        <div v-if="hasBlouseOption">
                            <label class="preview-option-label preview-option-label--blouse">ব্লাউজ:</label>
                            <div class="preview-blouse-row mt-6">
                                <label
                                    v-for="opt in blouseChoices"
                                    :key="opt.value"
                                    :class="[
                                        'preview-pill',
                                        blouseChoice === opt.value ? 'preview-pill--active' : '',
                                    ]"
                                >
                                    <input
                                        type="radio"
                                        name="preview_blouse_option"
                                        :value="opt.value"
                                        v-model="blouseChoice"
                                        class="sr-only"
                                    />
                                    <span>{{ opt.label }}</span>
                                    <span v-if="opt.value === 'with' && blouseExtra" class="preview-pill-extra">(+ {{ blouseExtra }}৳)</span>
                                    <!-- Selected check badge -->
                                    <span v-if="blouseChoice === opt.value" class="preview-pill-check">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Dynamic Attributes -->
                        <div
                            v-for="attributeName in sortedAttributeNames"
                            :key="attributeName"
                        >
                            <label class="preview-option-label">{{ attributeName }}:</label>
                            <div class="flex flex-wrap gap-4 mt-2">
                                <button
                                    v-for="option in groupedAttributes[attributeName]"
                                    :key="option.id"
                                    @click="selectAttribute(attributeName, option.attribute_option.id, option.attribute_option.name)"
                                    :class="[
                                        'preview-pill',
                                        selectedAttributes[attributeName] === option.attribute_option.id
                                            ? 'preview-pill--active'
                                            : '',
                                    ]"
                                >
                                    <span>{{ option.attribute_option.name }}</span>
                                    <span
                                        v-if="selectedAttributes[attributeName] === option.attribute_option.id"
                                        class="preview-pill-check"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Pre Order Notice, with whatever the shop wrote about timing -->
                        <div v-if="isPreOrderProduct" class="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-2.5 rounded-lg body-1-r">
                            এই পণ্যটি প্রি-অর্ডারের জন্য উন্মুক্ত। অর্ডার করলে স্টক আসার সাথে সাথে পাঠানো হবে।
                            <span v-if="preOrderTiming" class="block mt-1 font-medium">{{ preOrderTiming }}</span>
                        </div>

                        <!-- Out of stock: not a pre-order, and nothing to buy -->
                        <div v-else-if="isSoldOut" class="pv-soldout-note body-1-r" role="status">
                            এই পণ্যটি বর্তমানে স্টকে নেই।
                        </div>

                        <!-- The product sells, but not in the combination chosen -->
                        <div v-else-if="selectedVariantSoldOut" class="pv-soldout-note body-1-r" role="status">
                            নির্বাচিত অপশনটি বর্তমানে স্টকে নেই। অন্য একটি বেছে নিন।
                        </div>

                        <!-- Quantity + Actions — 50% quantity, 50% stacked buttons -->
                        <div class="preview-buy-row">
                            <!-- Quantity -->
                            <!-- Hidden entirely when nothing can be bought: a
                                 quantity to choose implies an order to place. -->
                            <!-- Add to cart — the other half of the row -->
                            <button
                                @click="addToCart"
                                :disabled="!allAttributesSelected || cannotBuy"
                                :aria-disabled="cannotBuy"
                                :class="[
                                    'preview-add-to-cart',
                                    cannotBuy ? 'is-soldout' : '',
                                    (isPreOrderProduct && !cannotBuy) ? 'is-preorder' : '',
                                    (!allAttributesSelected && !cannotBuy) ? 'opacity-50 cursor-not-allowed' : '',
                                ]"
                            >
                                <template v-if="isSoldOut">স্টকে নেই</template>
                                <template v-else-if="selectedVariantSoldOut">এই অপশনটি স্টকে নেই</template>
                                <template v-else>
                                    <img v-if="!isPreOrderProduct" :src="'/assets/chhondo/cart-light.svg'" alt="" width="24" height="24" />
                                    {{ isPreOrderProduct ? 'প্রি-অর্ডার করুন' : 'কার্টে যুক্ত করুন' }}
                                </template>
                            </button>

                            <!-- View Details — full width on its own row -->
                            <Link
                                :href="`/product/${product.slug}`"
                                class="preview-view-details"
                                @click="closeModal"
                            >
                                বিস্তারিত দেখুন
                            </Link>
                        </div>
                    </div>

                    <div v-else class="w-full md:flex-1 p-8 flex items-center justify-center">
                        <p class="text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { rebrand } from "@/utils/rebrand"
import {
    defineProps,
    defineEmits,
    watch,
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
} from "vue";
import { Link } from "@inertiajs/vue3";
import { toast } from "@steveyuowo/vue-hot-toast";
import { router } from "@inertiajs/vue3";
import { useAuthStore } from "@/Store/authStore";
import { useCartStore } from "@/Store/cartStore";
import { parseGalleryImages } from "@/utils/galleryImages";
import { isOutOfStock, isPreOrder, isVariantOutOfStock, preOrderNote } from '@/utils/stock'
import { priceFor, priceForAmount, wasPriceFor, blousePriceFor } from '@/utils/productPrice'
import { videoEmbedUrl, videoThumbnailUrl } from "@/utils/videoEmbed";

const props = defineProps({
    isOpen: Boolean,
    product: Object,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const quantity = ref(1);
const basePrice = ref(0);
const activeIndex = ref(0);
const slideDirection = ref("slide-left");
const fullProduct = ref(null);
const isLoadingDetails = ref(false);

// Product details are passed via props — no axios fetch needed
const fetchFullProduct = async (_slug) => {
    // No-op: full product data comes from the parent component via props
};

// Merged product: full data if fetched, otherwise the passed prop
const mergedProduct = computed(() => {
    if (fullProduct.value && fullProduct.value.id === props.product?.id) {
        return { ...props.product, ...fullProduct.value };
    }
    return props.product;
});

// Media carousel — the video leads the gallery when there is one, matching
// the product details page where it is the product's strongest introduction.
const productItems = computed(() => {
    if (!props.product) return [];

    const images = [
        props.product.featured_image || '/placeholder.svg',
        ...parseGalleryImages(props.product.gallery_images),
    ].filter(Boolean).map((img) => ({
        type: "image",
        src: img,
    }));

    if (props.product.video_link || props.product.video) {
        images.unshift({
            type: "video",
            src: /^(https?:)?\/\//.test(props.product.video)
                ? props.product.video
                : "/" + String(props.product.video || "").replace(/^\/+/, ""),
            host: props.product.video_host,
            embedUrl: videoEmbedUrl(props.product.video_host, props.product.video_link),
            poster: videoThumbnailUrl(props.product.video_host, props.product.video_link),
        });
    }

    return images;
});

const currentImage = computed(() => {
    const item = productItems.value[activeIndex.value];
    return item?.type === "image" ? item.src : "";
});

const hasLeadingVideo = computed(() => productItems.value[0]?.type === "video");

const goToSlide = (index) => {
    slideDirection.value = index > activeIndex.value ? "slide-left" : "slide-right";
    activeIndex.value = index;
};

/*
 * The arrows step through productItems — every slide, the video included.
 *
 * They used to wrap on productImages.length, which counts the images only, so
 * the bound disagreed with what was on screen: a product with one image and a
 * video showed both arrows and neither did anything ((0 + 1) % 1 === 0), and a
 * video with no images divided by zero and blanked the frame. The counter, the
 * dots and the arrows now all measure the same list.
 */
const nextSlide = () => {
    const count = productItems.value.length;
    if (count < 2) return;

    slideDirection.value = "slide-left";
    activeIndex.value = (activeIndex.value + 1) % count;
};

const prevSlide = () => {
    const count = productItems.value.length;
    if (count < 2) return;

    slideDirection.value = "slide-right";
    activeIndex.value = (activeIndex.value - 1 + count) % count;
};

// Three distinct states: a pre-order sells, a sold-out product does not.
const isPreOrderProduct = computed(() => isPreOrder(mergedProduct.value ?? props.product));
const isSoldOut = computed(() => isOutOfStock(mergedProduct.value ?? props.product));
const preOrderTiming = computed(() => preOrderNote(mergedProduct.value ?? props.product));

// Blouse option — read from mergedProduct (so it survives the lazy fetch).
const hasBlouseOption = computed(() => {
    const p = mergedProduct.value;
    return !!p?.has_blouse_option && blousePriceFor(p) > 0;
});
const blouseChoice = ref("without");
const blouseChoices = [
    { value: "without", label: "ব্লাউজ পিস ছাড়া" },
    { value: "with", label: "ব্লাউজ পিস সহ" },
];

// Extra cost of the with-blouse option, shown as "+ N৳" on the pill.
const blouseExtra = computed(() => {
    const p = mergedProduct.value;
    const withPrice = blousePriceFor(p);
    const base = parseFloat(p?.price);
    if (withPrice > 0 && !isNaN(base) && withPrice > base) {
        return Math.round(withPrice - base);
    }
    return null;
});

const currentBaseProductPrice = computed(() => {
    if (hasBlouseOption.value && blouseChoice.value === "with") {
        return blousePriceFor(mergedProduct.value);
    }
    return parseFloat(props.product?.price) || 0;
});

// Extract first meaningful line from HTML description
const firstLineDescription = computed(() => {
    const desc = mergedProduct.value?.short_description;
    if (!desc) return '';
    // Create a temporary element to parse HTML and get text
    const tmp = document.createElement('div');
    tmp.innerHTML = desc;
    const text = tmp.textContent || tmp.innerText || '';
    // Get first sentence or first ~80 chars
    const firstLine = text.trim().split(/[।\n]/)[0]?.trim();
    if (!firstLine) return '';
    const truncated = firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
    return `<p>${truncated}</p>`;
});

const selectedAttributes = ref({});
const selectedCombination = ref(null);

const groupedAttributes = computed(() => {
    if (!props.product || !props.product.product_attributes) {
        return {};
    }

    const grouped = {};
    props.product.product_attributes.forEach((attr) => {
        if (!attr.attribute || !attr.attribute.name) {
            return;
        }

        if (!grouped[attr.attribute.name]) {
            grouped[attr.attribute.name] = [];
        }

        const optionExists = grouped[attr.attribute.name].some(
            (existingOption) =>
                existingOption.attribute_option.id === attr.attribute_option.id
        );
        if (!optionExists) {
            grouped[attr.attribute.name].push(attr);
        }
    });

    return grouped;
});

const sortedAttributeNames = computed(() => {
    return Object.keys(groupedAttributes.value).sort((a, b) => {
        const aOrder =
            props.product.product_attributes.find(
                (attr) => attr.attribute.name === a
            )?.attribute.order || 0;
        const bOrder =
            props.product.product_attributes.find(
                (attr) => attr.attribute.name === b
            )?.attribute.order || 0;
        return aOrder - bOrder;
    });
});

const allAttributesSelected = computed(() => {
    return sortedAttributeNames.value.every(
        (attr) => selectedAttributes.value[attr]
    );
});

const selectAttribute = (attributeName, optionId, optionName) => {
    selectedAttributes.value = {
        ...selectedAttributes.value,
        [attributeName]: optionId,
    };
    updateSelectedCombination();
};

const updateSelectedCombination = () => {
    const sortedAttributes = sortedAttributeNames.value
        .filter((attributeName) => selectedAttributes.value[attributeName])
        .map((attributeName) => {
            const optionId = selectedAttributes.value[attributeName];
            const attribute = groupedAttributes.value[attributeName].find(
                (attr) => attr.attribute_option.id === optionId
            );
            return {
                attributeId: attribute.attribute_id,
                optionId: optionId,
                optionName: attribute.attribute_option.name,
            };
        });

    const selectedCombinationString = JSON.stringify(sortedAttributes);

    // product_attributes_combaine is not eager-loaded on every page (e.g. home)
    selectedCombination.value = (props.product.product_attributes_combaine || []).find(
        (combo) => combo.combination_string === selectedCombinationString
    );

    if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === selectedCombination.value.id
        );

        if (combinationAttributes.length > 0) {
            updateBasePrice(
                combinationAttributes[0].price || currentBaseProductPrice.value
            );
        }
    } else {
        updateBasePrice(currentBaseProductPrice.value);
    }
};

// Flash highlight when the price changes from a blouse toggle.
const priceFlash = ref(false);
let priceFlashTimer = null;
let suppressBlouseFlash = false;

watch(blouseChoice, () => {
    updateSelectedCombination();

    // Skip the flash when we reset blouseChoice programmatically on
    // product change — the user didn't trigger it.
    if (suppressBlouseFlash) {
        suppressBlouseFlash = false;
        return;
    }

    priceFlash.value = false;
    if (priceFlashTimer) clearTimeout(priceFlashTimer);
    requestAnimationFrame(() => {
        priceFlash.value = true;
        priceFlashTimer = setTimeout(() => {
            priceFlash.value = false;
        }, 700);
    });
});

const getSelectedAttributeIds = () => {
    if (selectedCombination.value) {
        return props.product.product_attributes
            .filter(
                (attr) => attr.combination_id === selectedCombination.value.id
            )
            .map((attr) => attr.id);
    } else {
        return Object.entries(selectedAttributes.value)
            .map(([attributeName, optionId]) => {
                const attribute = props.product.product_attributes.find(
                    (attr) =>
                        attr.attribute.name === attributeName &&
                        attr.attribute_option.id === optionId
                );
                return attribute ? attribute.id : null;
            })
            .filter((id) => id !== null);
    }
};

const displayPrice = computed(() => {
    return formatPrice(basePrice.value);
});

const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "0";
    // Whole prices render without decimals ("1750"), like the design
    return Number.isInteger(numPrice) ? String(numPrice) : numPrice.toFixed(2);
};

// The shared rule covers a campaign and a product coupon, and matches what
// the cart will charge.
/** True while the customer has the with-blouse option selected. */
const withBlouse = computed(() => hasBlouseOption.value && blouseChoice.value === "with");

// Follows the blouse choice, so the struck-through figure belongs to the same
// variant as the price beside it.
const wasPrice = computed(() => {
    const was = wasPriceFor(mergedProduct.value ?? props.product, withBlouse.value);
    return was ? Math.round(was) : null;
});

/**
 * Set the displayed price from the amount the current selection resolves to.
 *
 * The argument used to be ignored, so the modal showed the plain
 * without-blouse price however the options were set.
 */
const updateBasePrice = (amount = null) => {
    const product = mergedProduct.value ?? props.product;

    basePrice.value = amount === null
        ? priceFor(product, withBlouse.value)
        : priceForAmount(product, amount);
}

watch(
    () => props.isOpen,
    (open) => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = open ? "hidden" : "";
        }
    },
);

watch(
    () => props.product,
    (newProduct) => {
        if (newProduct && newProduct.price !== undefined) {
            updateBasePrice(newProduct.price);
            activeIndex.value = 0;
            quantity.value = 1;
            selectedAttributes.value = {};
            selectedCombination.value = null;
            if (blouseChoice.value !== "without") {
                suppressBlouseFlash = true;
                blouseChoice.value = "without";
            }
            // Fetch full details if short_description is missing
            if (!newProduct.short_description && newProduct.slug) {
                fetchFullProduct(newProduct.slug);
            } else {
                fullProduct.value = null;
            }
        }
    },
    { immediate: true }
);

/* ===== Always-visible scroll indicator (mobile) =====
   Native scrollbars fade out when idle on iOS/macOS, so the modal draws
   its own persistent track + thumb from the scroll area's metrics. */
const scrollArea = ref(null);
const showScrollbar = ref(false);
const thumbHeight = ref(0);
const thumbTop = ref(0);

const updateScrollbar = () => {
    const el = scrollArea.value;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    // Only meaningful while the area actually scrolls (mobile layout)
    if (scrollHeight - clientHeight < 8) {
        showScrollbar.value = false;
        return;
    }

    const trackHeight = clientHeight - 16; // track inset, see .preview-scrollbar
    const height = Math.max(36, (clientHeight / scrollHeight) * trackHeight);
    const maxTop = trackHeight - height;
    const progress = scrollTop / (scrollHeight - clientHeight);

    showScrollbar.value = true;
    thumbHeight.value = height;
    thumbTop.value = Math.round(maxTop * progress);
};

watch(
    () => props.isOpen,
    (open) => {
        if (!open) {
            showScrollbar.value = false;
            return;
        }
        nextTick(() => {
            if (scrollArea.value) scrollArea.value.scrollTop = 0;
            updateScrollbar();
        });
    }
);

// Recheck once images/content settle and whenever the viewport changes
watch([() => props.product, () => activeIndex.value], () => {
    nextTick(updateScrollbar);
});

onMounted(() => {
    if (props.product?.price !== undefined) {
        updateBasePrice(props.product.price);
    }
    if (typeof window !== "undefined") {
        window.addEventListener("resize", updateScrollbar);
    }
    nextTick(updateScrollbar);
});

onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateScrollbar);
    }
});

const incrementQuantity = () => {
    quantity.value++;
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const getStorage = () => {
    if (typeof window !== "undefined") {
        return {
            getItem: (key) => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: (key) => localStorage.removeItem(key),
        };
    }
    return {
        getItem: () => null,
        setItem: () => null,
        removeItem: () => null,
    };
};

/**
 * Whether the size/colour currently chosen has run out.
 *
 * A product can be in stock overall while one variant is not, so the buttons
 * follow the selection rather than just the product.
 */
const selectedVariantSoldOut = computed(() => {
    if (!allAttributesSelected.value) return false;

    const product = mergedProduct.value ?? props.product;
    const ids = getSelectedAttributeIds();
    const rows = (product?.product_attributes ?? []).filter((attr) => ids.includes(attr.id));

    return isVariantOutOfStock(product, rows);
});

/** The single question the buy buttons ask. */
const cannotBuy = computed(() => isSoldOut.value || selectedVariantSoldOut.value);

/**
 * Refuse to act on something that cannot be bought, and say why.
 *
 * Returns true when the caller should stop, so neither buy path can be driven
 * from the console or by a button re-enabled in DevTools.
 */
const guardUnavailable = () => {
    if (isSoldOut.value) {
        toast.error("এই পণ্যটি বর্তমানে স্টকে নেই।");
        return true;
    }

    if (selectedVariantSoldOut.value) {
        toast.error("নির্বাচিত অপশনটি বর্তমানে স্টকে নেই।");
        return true;
    }

    return false;
};

const addToCart = () => {
    const cartStore = useCartStore();

    if (guardUnavailable()) return;

    if (allAttributesSelected.value) {
        const selectedAttributeIds = getSelectedAttributeIds();

        cartStore.addToCart({
            product_id:    props.product.id,
            quantity:      quantity.value,
            blouse_choice: hasBlouseOption.value ? blouseChoice.value : null,
            attribute_values: selectedAttributeIds,
        }, mergedProduct.value ?? props.product);

        cartStore.cartOrder();
        closeModal();
    }
};

const buyNow = () => {
    const cartStore = useCartStore();

    if (guardUnavailable()) return;

    if (allAttributesSelected.value) {
        const selectedAttributeIds = getSelectedAttributeIds();
        const productData = {
            product_id: props.product.id,
            product_name: props.product.product_name,
            price: props.product.price,
            featured_image: props.product.featured_image,
            quantity: quantity.value,
            is_pre_order: isPreOrderProduct.value,
            // What the server prices the line from; see CheckoutWebController.
            attribute_values: selectedAttributeIds,
            selectedAttributes: selectedAttributeIds.map((id) => {
                const attr = props.product.product_attributes.find(
                    (a) => a.id === id
                );
                return {
                    attribute_id: attr.attribute_id,
                    attribute_option_id: attr.attribute_option_id,
                    attribute_name: attr.attribute.name,
                    attribute_option: attr.attribute_option.name,
                    attribute_option_price: attr.price,
                };
            }),
        };

        cartStore.directOrder();

        if (typeof window !== "undefined") {
            localStorage.setItem(
                "directOrderProductData",
                JSON.stringify(productData)
            );
        }

        closeModal();

        setTimeout(() => {
            router.get("/checkout");
        }, 100);
    } else {
        toast.error("প্রয়োজনীয় সব অপশন নির্বাচন করুন।");
    }
};
</script>

<style scoped>
/* Modal entrance animation */
.modal-fade-enter-active {
    transition: opacity 0.3s ease;
}
.modal-fade-enter-active .preview-modal {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}
.modal-fade-leave-active .preview-modal {
    transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-fade-enter-from {
    opacity: 0;
}
.modal-fade-enter-from .preview-modal {
    transform: scale(0.95);
    opacity: 0;
}
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-leave-to .preview-modal {
    transform: scale(0.95);
    opacity: 0;
}

/* Image slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease;
}
.slide-left-enter-from {
    transform: translateX(100%);
}
.slide-left-leave-to {
    transform: translateX(-100%);
}
.slide-right-enter-from {
    transform: translateX(-100%);
}
.slide-right-leave-to {
    transform: translateX(100%);
}

/* Close button — Figma: #FFFAF4 bg, #FFF0DF border, r2, 15px cross */
.preview-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 31px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fffaf4;
    border: 1px solid #fff0df;
    border-radius: 2px;
    color: #1a1817;
    cursor: pointer;
    z-index: 20;
    transition: background-color 0.2s ease;
}

.preview-close:hover {
    background-color: #fff0df;
}

/* Image counter — Figma: rgba(26,24,23,0.64), px16 py8, r8, Poppins 16 */
.preview-img-counter {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background-color: rgba(26, 24, 23, 0.64);
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    line-height: 22px;
    padding: 6px 12px;
    border-radius: 8px;
    z-index: 10;
}

/* Video embed — an iframe cannot object-fit, so the embed is scaled to
   overflow the frame and centred, cropping it the way object-cover would.
   Same technique as the details page gallery. */
.preview-embed-cover {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.preview-embed-cover iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    /* A 2:3 frame is taller than the 16:9 video needs; min-width guarantees
       the embed always covers the full height. */
    height: 100%;
    min-width: 177.78vh;
    transform: translate(-50%, -50%);
    border: 0;
    pointer-events: none;
}

@media (min-width: 768px) {
    .preview-img-counter {
        font-size: 16px;
        line-height: 24px;
        padding: 8px 16px;
    }
}

/* Product name — bangla/Heading/Headline 3-40-SB-52, Black/700 */
.preview-product-name {
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 52px;
    color: #3C3834;
}

/* Price — Figma: 28/32 Medium, Warm/700 */
.preview-price {
    font-family: "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 32px;
    color: #9A663F;
}

/* Stock — Figma: Poppins Medium 20/28, Success green */
.preview-stock {
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: #24A148;
}

/* Out of stock reads as a warm red across the storefront — light ground,
   solid red text. Same pair on the cards, the cart drawer and the PDP. */
.preview-stock--soldout {
    background: #fdecec;
    color: #c0392b;
}

.pv-soldout-note {
    background: #fdecec;
    border: 1px solid #f3c9c9;
    color: #c0392b;
    padding: 10px 16px;
    border-radius: 8px;
}

.preview-add-to-cart.is-soldout {
    background: #fdecec;
    border: 1px solid #f3c9c9;
    color: #c0392b;
    opacity: 1;
    cursor: not-allowed;
    /* The quantity column beside it is gone, so it takes the whole row rather
       than leaving a hole where the stepper was. */
    grid-column: 1 / -1;
}

.preview-stock--preorder {
    color: #f97316;
}

/* Description — Figma: Hind Siliguri 16/24, Black/600 */
.preview-description {
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #4D4944;
}

/* Option labels (পরিমাণ:, ব্লাউজ:, attributes) — 16/24 Black/900, on their own line */
.preview-option-label {
    display: block;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #1a1817;
}

/* Price flash on blouse toggle */
.preview-price {
    display: inline-block;
    padding: 2px 6px;
    margin-left: -6px;
    border-radius: 6px;
    transition: background-color 0.25s ease, transform 0.25s ease;
    transform-origin: left center;
}

.price-flash {
    animation: preview-price-flash 0.7s ease-out;
}

@keyframes preview-price-flash {
    0% {
        background-color: rgba(53, 96, 25, 0);
        transform: scale(1);
    }
    25% {
        background-color: rgba(53, 96, 25, 0.18);
        transform: scale(1.08);
    }
    60% {
        background-color: rgba(53, 96, 25, 0.10);
        transform: scale(1.02);
    }
    100% {
        background-color: rgba(53, 96, 25, 0);
        transform: scale(1);
    }
}

/* Quantity + Add to cart on one row, View Details full width below */
.preview-buy-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
    align-items: end;
}

.preview-buy-row > .preview-view-details {
    grid-column: 1 / -1;
}

@media (min-width: 768px) {
    .preview-buy-row {
        gap: 12px 16px;
    }
}

.preview-qty-col {
    min-width: 0;
    display: flex;
    flex-direction: column;
}

/* Quantity stepper — Figma: one bordered box, #D1CDCA, r8, px18 */
.preview-qty-stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    height: 48px;
    padding: 8px 12px;
    border: 1px solid #D1CDCA;
    border-radius: 8px;
    background: white;
}

@media (min-width: 768px) {
    .preview-qty-stepper {
        height: 56px;
        padding: 8px 18px;
    }
}

.preview-qty-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #1a1817;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.preview-qty-btn:hover:not(:disabled) {
    background-color: #f5f0eb;
}

.preview-qty-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.preview-qty-value {
    min-width: 20px;
    text-align: center;
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #1a1817;
}

/* Option pills (blouse + attributes) — Figma: h40, r8, px24,
   Hind Siliguri SB 16 Green/700; selected: 2px Green/500 border + check badge */
.preview-pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 18px;
    border: 1px solid #D1CDCA;
    border-radius: 8px;
    background: white;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
    color: #2C5015;
    cursor: pointer;
    transition: border-color 0.2s ease;
    user-select: none;
    white-space: nowrap;
}

@media (min-width: 768px) {
    .preview-pill {
        padding: 0 24px;
        font-size: 16px;
    }
}

.preview-pill:hover {
    border-color: #3E711D;
}

/* ===== BLOUSE OPTION ROW — both pills forced onto ONE row on mobile ===== */
.preview-blouse-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.preview-blouse-row .preview-pill {
    width: 100%;
    height: 36px;
    padding: 0 8px;
    gap: 6px;
    font-size: 13px;
    line-height: 18px;
}

@media (min-width: 768px) {
    .preview-blouse-row {
        display: flex;
        gap: 16px;
    }

    .preview-blouse-row .preview-pill {
        width: auto;
        height: 40px;
        padding: 0 24px;
        font-size: 16px;
        line-height: 24px;
    }
}

.preview-pill--active {
    border: 2px solid #3E711D;
}

/* Check badge on the selected pill's top-right corner */
.preview-pill-check {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3E711D;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 9999px;
}

/* Add to cart button — Figma: Green/600, h48, r8, Manrope SB 16 */
.preview-add-to-cart {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    padding: 0 20px;
    background-color: #356019;
    color: white;
    font-family: "Manrope", "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

/* ===== ACTION BUTTONS ===== */
.preview-buy-row .preview-add-to-cart,
.preview-buy-row .preview-view-details {
    padding: 0 10px;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
}

@media (min-width: 768px) {
    .preview-buy-row .preview-add-to-cart,
    .preview-buy-row .preview-view-details {
        height: 56px;
        padding: 0 16px;
        font-size: 16px;
        line-height: 24px;
    }
}

.preview-add-to-cart:hover:not(:disabled) {
    background-color: #2a4d14;
}

/* Pre-order carries the same orange as the product page's pre-order button and
   the cards, so the three places a customer can start one all agree. */
.preview-add-to-cart.is-preorder {
    background-color: #f97316;
}

.preview-add-to-cart.is-preorder:hover:not(:disabled) {
    background-color: #ea580c;
}

/* View Details button — Figma: 1px Green/700 border, h48, r8 */
.preview-view-details {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    padding: 0 20px;
    text-align: center;
    border: 1px solid #2C5015;
    color: #2C5015;
    font-family: "Manrope", "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.preview-view-details:hover {
    background-color: #2C5015;
    color: white;
}

/* Mobile modal sizing — visible background on all sides.
   The modal shell stays put (so the close button never scrolls away)
   and only the inner content area scrolls. */
@media (max-width: 767px) {
    .preview-modal {
        width: 88vw !important;
        max-height: 85vh !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .preview-scroll {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        /* room for the always-visible scrollbar + the close button */
        padding-right: 14px;
    }

    .preview-close {
        top: 12px;
        right: 14px;
    }
}

/* Custom always-visible scroll indicator — mobile only */
.preview-scrollbar {
    display: none;
}

@media (max-width: 767px) {
    .preview-scrollbar {
        display: block;
        position: absolute;
        top: 8px;
        right: 4px;
        bottom: 8px;
        width: 6px;
        background: #ece5de;
        border-radius: 3px;
        z-index: 15;
        pointer-events: none;
    }

    .preview-scrollbar-thumb {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: #8d867f;
        border-radius: 3px;
        transition: transform 0.08s linear;
    }

    /* The drawn indicator replaces the native (fading) one */
    .preview-scroll {
        scrollbar-width: none;
    }

    .preview-scroll::-webkit-scrollbar {
        display: none;
    }
}

/* Always-visible scrollbar so it is obvious there is more to scroll */
.preview-scroll,
.preview-info {
    scrollbar-width: thin;
    scrollbar-color: #b9b2ab #f0eae4;
}

.preview-scroll::-webkit-scrollbar,
.preview-info::-webkit-scrollbar {
    width: 6px;
    -webkit-appearance: none;
}

.preview-scroll::-webkit-scrollbar-track,
.preview-info::-webkit-scrollbar-track {
    background: #f0eae4;
    border-radius: 3px;
}

.preview-scroll::-webkit-scrollbar-thumb,
.preview-info::-webkit-scrollbar-thumb {
    background: #b9b2ab;
    border-radius: 3px;
}

.preview-scroll::-webkit-scrollbar-thumb:hover,
.preview-info::-webkit-scrollbar-thumb:hover {
    background: #8d867f;
}

@media (max-width: 767px) {

    .preview-product-name {
        font-size: 24px !important;
        line-height: 32px !important;
    }

    .preview-price {
        font-size: 20px !important;
        line-height: 28px !important;
    }

    .preview-stock {
        font-size: 15px !important;
        line-height: 22px !important;
    }
}

/* Desktop: fixed modal height per Figma (860x560) */
@media (min-width: 768px) {
    .preview-modal {
        height: 560px;
    }
}

/* ===== Figma "Quick Preview" (💫 Final design) ===== */
.preview-backdrop {
    background: rgba(0, 0, 0, 0.36);
    -webkit-backdrop-filter: blur(4.1px);
    backdrop-filter: blur(4.1px);
}

.preview-modal { border-radius: 8px; max-width: 862px; }

/* Close — 31px Gold/50 square with a Gold/100 hairline */
.preview-close {
    top: 16px;
    right: 16px;
    width: 31px;
    height: 31px;
    padding: 8px;
    border: 1px solid #efe0bb;
    border-radius: 2px;
    background: #faf5e9;
    color: #1a1817;
    box-shadow: none;
}
.preview-close:hover { background: #efe0bb; }

.preview-image-container { border-radius: 8px; }

/* Name — Hind Siliguri SB 40/52 */
.preview-product-name {
    padding-right: 36px;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 52px;
    color: #1a1817;
}

/* Price — Gold/500 Poppins 500 24/32, ৳ in Hind 28 */
.preview-price {
    font-family: "Poppins", sans-serif;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    color: #cc9b25;
}
.preview-price-sign { font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; font-size: 28px; }

/* Stock — plain green text, no chip */
.preview-stock {
    padding: 0;
    border: 0;
    background: none;
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: #24a148;
}
.preview-stock--soldout { background: none; color: #c0392b; }
.preview-stock--preorder { background: none; color: #ea580c; }

.preview-description,
.preview-description :deep(*) {
    font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #3c3834;
}

.preview-option-label {
    font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #3c3834;
}
.preview-option-label--blouse { font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; color: #1a1817; }

/* Quantity — 172 × 56, Black/300 border, r8, 32px between parts */
.preview-qty-col { align-self: flex-start; }
.preview-qty-stepper {
    width: 172px;
    height: 56px;
    padding: 8px 16px;
    gap: 32px;
    border: 1px solid #d1cdca;
    border-radius: 8px;
    background: #fff;
}
.preview-qty-btn { width: 32px; height: 32px; color: #1a1817; background: transparent; }
.preview-qty-btn:hover:not(:disabled) { background: #faf5e9; }
.preview-qty-value { font-family: "Poppins", sans-serif; font-size: 20px; font-weight: 600; line-height: 28px; color: #1a1817; }

/* Blouse pills — 40px tall, r8; chosen one gets a 2px green ring + check */
.preview-blouse-row { display: flex; flex-wrap: wrap; gap: 16px; }
.preview-pill {
    position: relative;
    min-width: 191px;
    height: 40px;
    padding: 0 24px;
    border: 1px solid #d1cdca;
    border-radius: 8px;
    background: #fff;
    font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #2c5015;
}
.preview-pill--active { border: 2px solid #3e711d; background: #fff; color: #2c5015; }
.preview-pill-extra { font-family: "Poppins", sans-serif; white-space: nowrap; }
.preview-pill-check {
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: #3e711d;
    color: #fff;
}
.preview-pill-check svg { width: 12px; height: 12px; }

/* Actions stacked full width — 48px, 12px apart */
.preview-buy-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.preview-buy-row .preview-add-to-cart,
.preview-buy-row .preview-view-details {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
}
.preview-buy-row .preview-add-to-cart { background-color: #1a2110; color: #fff; }
.preview-add-to-cart:hover:not(:disabled) { background-color: #252f17; }
.preview-buy-row .preview-view-details { border: 1px solid #1a2110; background: #fff; color: #1a2110; }
.preview-buy-row .preview-view-details:hover { background: #1a2110; color: #fff; }

@media (min-width: 768px) {
    .preview-buy-row .preview-add-to-cart,
    .preview-buy-row .preview-view-details { height: 48px; }
}

@media (max-width: 767px) {
    .preview-product-name { font-size: 26px; line-height: 34px; }
    .preview-pill { min-width: 0; flex: 1 1 auto; padding: 0 14px; font-size: 14px; }
}
</style>
