<script setup>
/**
 * Product search that opens inside the navbar.
 *
 * The search icon widens into a field beside the other header icons — the
 * header keeps its height — and suggestions drop down from the field itself.
 * Results come from /search/products, the same endpoint as before.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Link, router } from "@inertiajs/vue3";
import axios from "axios";
import { XIcon } from "lucide-vue-next";

defineProps({
    /** Phone header: 24px icon and a narrower field. */
    compact: { type: Boolean, default: false },
});

const MIN_QUERY = 2;

const root = ref(null);
const input = ref(null);
const isOpen = ref(false);
const query = ref("");
const results = ref([]);
const total = ref(0);
const isLoading = ref(false);
const failed = ref(false);

let timer = null;
// Rising id, so a slow reply for an old query cannot overwrite a newer one.
let token = 0;

async function runSearch(term) {
    const mine = ++token;

    if (term.trim().length < MIN_QUERY) {
        results.value = [];
        total.value = 0;
        isLoading.value = false;
        failed.value = false;
        return;
    }

    isLoading.value = true;
    failed.value = false;

    try {
        const { data } = await axios.get("/search/products", { params: { q: term } });
        if (mine !== token) return;
        results.value = data.results ?? [];
        total.value = data.total ?? 0;
    } catch {
        if (mine !== token) return;
        results.value = [];
        total.value = 0;
        failed.value = true;
    } finally {
        if (mine === token) isLoading.value = false;
    }
}

function onInput() {
    clearTimeout(timer);
    // Waits for a pause in typing rather than firing on every keystroke.
    timer = setTimeout(() => runSearch(query.value), 250);
}

const hasQuery = computed(() => query.value.trim().length >= MIN_QUERY);
const showNoResults = computed(() => hasQuery.value && !isLoading.value && !failed.value && results.value.length === 0);
const more = computed(() => Math.max(0, total.value - results.value.length));
const showPanel = computed(() => isOpen.value && hasQuery.value);

function open() {
    isOpen.value = true;
    nextTick(() => input.value?.focus());
}

function close() {
    isOpen.value = false;
    query.value = "";
    results.value = [];
    total.value = 0;
    failed.value = false;
    clearTimeout(timer);
    token++;
}

/** The icon opens the field; with a query typed it runs the search. */
function onIconClick() {
    if (!isOpen.value) return open();
    if (query.value.trim()) return submit();
    close();
}

function submit() {
    const term = query.value.trim();
    if (!term) return;
    close();
    router.visit(`/shop?name=${encodeURIComponent(term)}`);
}

function onPointerDown(e) {
    if (isOpen.value && root.value && !root.value.contains(e.target)) close();
}

onMounted(() => document.addEventListener("mousedown", onPointerDown));
onBeforeUnmount(() => {
    document.removeEventListener("mousedown", onPointerDown);
    clearTimeout(timer);
});
</script>

<template>
    <div ref="root" class="hs" :class="{ 'is-open': isOpen, 'is-compact': compact }">
        <div class="hs-field">
            <input
                ref="input"
                v-model="query"
                type="search"
                inputmode="search"
                enterkeyhint="search"
                class="hs-input"
                placeholder="শাড়ি খুঁজুন…"
                aria-label="পণ্য খুঁজুন"
                :tabindex="isOpen ? 0 : -1"
                @input="onInput"
                @keydown.enter.prevent="submit"
                @keydown.esc="close"
            />
            <button
                v-if="isOpen && query"
                type="button"
                class="hs-clear"
                aria-label="মুছে ফেলুন"
                @click="query = ''; onInput(); input?.focus()"
            >
                <XIcon :size="14" />
            </button>
        </div>

        <button type="button" class="hs-icon" aria-label="Search products" @click="onIconClick">
            <img :src="'/assets/chhondo/search.svg'" alt="" />
        </button>

        <!-- Suggestions, under the field only -->
        <Transition name="hs-drop">
            <div v-if="showPanel" class="hs-panel" role="listbox">
                <p v-if="isLoading" class="hs-state">খুঁজছি…</p>

                <p v-else-if="failed" class="hs-state">খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>

                <template v-else-if="results.length">
                    <Link
                        v-for="product in results"
                        :key="product.id"
                        :href="`/product/${product.slug}`"
                        class="hs-item"
                        role="option"
                        @click="close"
                    >
                        <img :src="product.featured_image || '/placeholder.svg'" :alt="product.product_name" class="hs-thumb" />
                        <span class="hs-meta">
                            <span class="hs-name">{{ product.product_name }}</span>
                            <span v-if="product.category" class="hs-cat">{{ product.category }}</span>
                            <span class="hs-price">
                                <span class="hs-now">৳{{ product.price }}</span>
                                <span
                                    v-if="product.previous_price && Number(product.previous_price) > Number(product.price)"
                                    class="hs-was"
                                >৳{{ product.previous_price }}</span>
                                <span v-if="!product.in_stock" class="hs-oos">স্টকে নেই</span>
                            </span>
                        </span>
                    </Link>

                    <button v-if="more" type="button" class="hs-more" @click="submit">
                        আরও {{ more }}টি ফলাফল দেখুন
                    </button>
                </template>

                <p v-else-if="showNoResults" class="hs-state">“{{ query }}” এর কোনো ফলাফল নেই</p>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.hs {
    position: relative;
    display: flex;
    align-items: center;
    height: 28px;
}

/* The field sits left of the icon and widens from nothing. */
.hs-field {
    position: relative;
    display: flex;
    align-items: center;
    width: 0;
    height: 40px;
    margin-right: 0;
    overflow: hidden;
    opacity: 0;
    transition: width .3s ease, margin-right .3s ease, opacity .2s ease;
}
.hs.is-open .hs-field {
    width: 280px;
    margin-right: 12px;
    opacity: 1;
}
.hs.is-compact.is-open .hs-field { width: min(44vw, 180px); margin-right: 10px; }

/* Figma field: Black/50 fill, Black/200 hairline, r8 */
.hs-input {
    width: 100%;
    height: 40px;
    padding: 0 34px 0 14px;
    border: 1px solid #e4e1e0;
    border-radius: 8px;
    background: #f3f3f3;
    font-family: "Li Ador Noirrit", "Poppins", sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #1a1817;
    outline: none;
    transition: border-color .2s ease, background-color .2s ease;
}
.hs-input::placeholder { color: #9c9591; }
.hs-input:focus { border-color: #d6af51; background: #fff; }
.hs-input::-webkit-search-cancel-button { display: none; }

.hs-clear {
    position: absolute;
    right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 999px;
    background: #e4e1e0;
    color: #6d6560;
    cursor: pointer;
}

.hs-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: opacity .2s ease;
}
.hs-icon:hover { opacity: .68; }
.hs-icon img { width: 28px; height: 28px; display: block; }
.hs.is-compact .hs-icon,
.hs.is-compact .hs-icon img { width: 24px; height: 24px; }

/* Suggestions drop down from the field. */
.hs-panel {
    position: absolute;
    top: calc(100% + 22px);
    right: 40px;
    z-index: 60;
    width: 360px;
    max-height: min(60vh, 440px);
    overflow-y: auto;
    padding: 8px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 4px 16px -4px rgba(0, 0, 0, .12), 0 2px 6px -2px rgba(0, 0, 0, .03);
}
.hs.is-compact .hs-panel {
    position: fixed;
    top: 84px;
    right: 16px;
    left: 16px;
    width: auto;
}

.hs-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 8px;
    transition: background-color .15s ease;
}
.hs-item:hover { background: #faf5e9; }
.hs-thumb {
    width: 48px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 8px;
    object-fit: cover;
    background: #f3f3f3;
}
.hs-meta { display: flex; flex-direction: column; min-width: 0; }
.hs-name {
    overflow: hidden;
    font: 600 14px/20px "Li Ador Noirrit", "Poppins", sans-serif;
    color: #1a1817;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.hs-cat { font: 400 12px/16px "Li Ador Noirrit", "Poppins", sans-serif; color: #6d6560; }
.hs-price { display: flex; align-items: baseline; gap: 6px; margin-top: 2px; }
.hs-now { font: 600 14px/20px "Poppins", sans-serif; color: #cc9b25; }
.hs-was { font: 400 12px/16px "Poppins", sans-serif; color: #9c9591; text-decoration: line-through; }
.hs-oos { font: 400 12px/16px "Li Ador Noirrit", sans-serif; color: #b91c1c; }

.hs-more {
    width: 100%;
    margin-top: 4px;
    padding: 10px;
    border: 0;
    border-top: 1px solid #f3f3f3;
    background: transparent;
    font: 600 14px/20px "Li Ador Noirrit", "Poppins", sans-serif;
    color: #1a2110;
    cursor: pointer;
}
.hs-more:hover { color: #cc9b25; }

.hs-state {
    margin: 0;
    padding: 16px 8px;
    text-align: center;
    font: 400 14px/20px "Li Ador Noirrit", "Poppins", sans-serif;
    color: #6d6560;
}

.hs-drop-enter-active,
.hs-drop-leave-active { transition: opacity .2s ease, transform .2s ease; }
.hs-drop-enter-from,
.hs-drop-leave-to { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
    .hs-field,
    .hs-drop-enter-active,
    .hs-drop-leave-active { transition: none; }
}
</style>
