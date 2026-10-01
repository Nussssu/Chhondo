/**
 * Turn whatever an admin pasted into something the storefront can render.
 *
 * The video field used to be dumped straight into the page with v-html, so a
 * plain YouTube link showed nothing at all and only a full <iframe> embed code
 * worked — and that carried its own width/height, so it never fitted the
 * gallery frame. Every accepted form now resolves to a plain embed URL that the
 * gallery sizes itself.
 */

/** Pull the src out of a pasted <iframe …> so embed codes still work. */
function iframeSrc(input) {
  const match = String(input).match(/<iframe[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

/**
 * Accepts: watch?v=, youtu.be/, /embed/, /shorts/, an iframe embed code, or a
 * bare 11-character id.
 */
export function youtubeId(input) {
  if (!input) return null

  const value = iframeSrc(input) ?? String(input).trim()

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match) return match[1]
  }

  // A bare id, which is what this field held before links were accepted.
  return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : null
}

/** Accepts: /file/d/{id}/…, open?id=, an iframe embed code, or a bare id. */
export function driveId(input) {
  if (!input) return null

  const value = iframeSrc(input) ?? String(input).trim()

  const patterns = [
    /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([A-Za-z0-9_-]+)/,
    /[?&]id=([A-Za-z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match) return match[1]
  }

  // Drive ids have no fixed length, so only treat a bare value as an id when it
  // is clearly not a URL.
  return /^[A-Za-z0-9_-]{10,}$/.test(value) ? value : null
}

/**
 * The URL to put in an iframe.
 *
 * @param {string} host  'Youtube' | 'Gdrive'
 * @param {string} link  whatever the admin pasted
 * @param {{autoplay?: boolean}} options
 */
export function videoEmbedUrl(host, link, { autoplay = true } = {}) {
  if (host === 'Youtube') {
    const id = youtubeId(link)
    if (!id) return null

    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      // Plays as part of the gallery, not as a player.
      controls: '0',
      disablekb: '1',
      iv_load_policy: '3',
    })

    if (autoplay) {
      // Autoplay is only permitted muted, and looping a single video needs the
      // playlist parameter set to that same video.
      params.set('autoplay', '1')
      params.set('mute', '1')
      params.set('loop', '1')
      params.set('playlist', id)
    }

    return `https://www.youtube.com/embed/${id}?${params.toString()}`
  }

  if (host === 'Gdrive') {
    const id = driveId(link)
    return id ? `https://drive.google.com/file/d/${id}/preview` : null
  }

  return null
}

/** A still to show in the gallery's thumbnail strip. */
export function videoThumbnailUrl(host, link) {
  if (host === 'Youtube') {
    const id = youtubeId(link)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
  }

  if (host === 'Gdrive') {
    const id = driveId(link)
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w320` : null
  }

  return null
}
