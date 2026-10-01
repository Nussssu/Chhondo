// Product.gallery_images is cast to 'array' on the model, so the API normally
// delivers a real array. Older rows were written double-encoded, which made the
// accessor hand back a JSON string instead. Callers must not assume either shape:
// JSON.parse() on an array stringifies it to "a,b,c" and throws, which silently
// emptied every gallery on the site.
export function parseGalleryImages(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);

    // A double-encoded value decodes to another JSON string; unwrap once more.
    if (typeof parsed === 'string') return parseGalleryImages(parsed);

    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}
