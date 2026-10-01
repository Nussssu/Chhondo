/**
 * Name → URL key, matching App\Support\Slug::make() on the server.
 *
 * `Str::slug()`-style ASCII folding drops Bangla entirely, and the storefront
 * already serves Bangla URLs (/product-category/পূজা-কালেকশন), so Unicode
 * letters, digits and combining marks are kept and everything else becomes the
 * separator. \p{M} matters: Bangla writes its vowels as combining marks, so
 * without it "শাড়ি" collapses to "শ-ড".
 */
export function slugify(value, fallback = '') {
  const slug = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || fallback
}

export default slugify
