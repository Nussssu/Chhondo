<script setup>
/**
 * An <img> that offers the browser the narrower copies of an image.
 *
 * Images are stored at up to 1400px wide and every card was handed that file
 * however small it paints — the home page was shipping 4MB for a grid of
 * thumbnails, where a phone needs about 30KB each.
 *
 * ResponsiveImageService writes a copy at each width in `widths`, named by
 * convention (/uploads/abc.webp -> /uploads/abc-480.webp), so the srcset is
 * built from the base URL with no extra request. Two things cover the case
 * where a variant is missing anyway — an image added before the backfill ran,
 * or a host serving /uploads straight off disk: routes/images.php writes it on
 * first request, and a candidate that still fails drops the srcset entirely,
 * leaving the original. An unoptimised image is an acceptable outcome; a
 * broken one is not, and a failed srcset candidate does NOT fall back to
 * `src` on its own — the browser just renders a broken image.
 */
import { computed, ref, watch } from "vue"
import { WIDTHS, variantSrcset } from "@/utils/responsiveImage"

const props = defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  /**
   * CSS `sizes`, e.g. "(max-width: 767px) 50vw, 350px" — how wide the image
   * will paint at each breakpoint, not the file's width. Required rather than
   * defaulted, because a plausible-looking wrong value silently makes the
   * browser pick the wrong file on every viewport.
   */
  sizes: { type: String, required: true },
  /**
   * The aspect ratio to reserve, as a width/height pair. Without them the
   * page reflows as each image lands, which is what drives the layout-shift
   * score. They describe the shape of the box, not which file is chosen, so a
   * ratio (3 / 4) works as well as real pixel dimensions.
   */
  width: { type: [Number, String], required: true },
  height: { type: [Number, String], required: true },
  loading: { type: String, default: "lazy" },
  fetchpriority: { type: String, default: "auto" },
  decoding: { type: String, default: "async" },
  imgClass: { type: String, default: "" },
  /** Must match ResponsiveImageService::WIDTHS. */
  widths: { type: Array, default: () => WIDTHS },
})

/** Set once a chosen candidate has failed, which drops the srcset. */
const variantsFailed = ref(false)

// A different image in the same slot deserves a fresh attempt.
watch(() => props.src, () => { variantsFailed.value = false })

const srcset = computed(() =>
  variantsFailed.value ? undefined : variantSrcset(props.src, props.widths)
)
</script>

<template>
  <img
    :src="src"
    :srcset="srcset"
    :sizes="srcset ? sizes : undefined"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
    :class="imgClass"
    @error="variantsFailed = true"
  />
</template>
