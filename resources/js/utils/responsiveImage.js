/**
 * Builds the srcset for an uploaded image from its URL alone.
 *
 * ResponsiveImageService writes a copy of every image at each of WIDTHS,
 * named by convention — /uploads/abc.webp gains /uploads/abc-480.webp — so no
 * request is needed to discover which widths exist. The service never skips a
 * width (one wider than the source is a byte-for-byte copy), so every
 * candidate produced here is a real file.
 *
 * Deliberately pure: no `window`, no `location`. An origin check cannot run
 * while server-rendering, which would make the server emit no srcset where
 * the browser emits one — disabling the optimisation on server-rendered
 * markup and leaving hydration to disagree about every image.
 */

/** Must match ResponsiveImageService::WIDTHS. */
export const WIDTHS = [320, 480, 768, 1024]

/** Must match ResponsiveImageService::MAX_WIDTH — every original is capped here. */
export const ORIGINAL_WIDTH = 1400

/**
 * Whether variants can be derived from this URL.
 *
 * A data URI or an SVG has nothing to gain. Everything else is assumed to be
 * one of our own images, because it always is: every stored image URL is
 * built from APP_URL by url()/asset(), and no CDN or external image host is
 * configured. Being permissive is safe — ResponsiveImage.vue drops the srcset
 * if a candidate fails to load.
 */
export function canUseVariants(src) {
    if (!src || typeof src !== 'string' || src.startsWith('data:')) return false

    // Ignore any query or hash when looking at the extension.
    return /\.(webp|jpe?g|png)$/i.test(src.split(/[?#]/)[0])
}

/** "/a/b.webp" + 480 => "/a/b-480.webp", keeping any query string. */
export function variantUrl(src, width) {
    const [path, suffix = ''] = src.split(/(?=[?#])/)
    const dot = path.lastIndexOf('.')

    if (dot === -1) return src

    return `${path.slice(0, dot)}-${width}${path.slice(dot)}${suffix}`
}

/**
 * The full srcset, or undefined when this image has no variants — in which
 * case the caller must leave both srcset and sizes off entirely.
 */
export function variantSrcset(src, widths = WIDTHS) {
    if (!canUseVariants(src)) return undefined

    const candidates = widths
        .filter((width) => width < ORIGINAL_WIDTH)
        .map((width) => `${variantUrl(src, width)} ${width}w`)

    // The original stays in as the largest candidate, so a wide or retina
    // display can still reach full quality.
    candidates.push(`${src} ${ORIGINAL_WIDTH}w`)

    return candidates.join(', ')
}
