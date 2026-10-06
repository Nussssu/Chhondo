/**
 * Reading content managed in Content › Pages.
 *
 * Wording reaches a page as plain strings, so two light conventions let an
 * editor shape a heading without HTML:
 *   - *words in stars* are drawn in the gold accent colour
 *   - a new line in the field is a line break
 * Everything else is escaped, so a field can never inject markup.
 */
import { rebrand } from "@/utils/rebrand"

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

/**
 * A field as HTML: *gold* words and line breaks.
 *
 * `breaks: "desktop"` keeps line breaks for wide screens only, where the
 * design sets them; on a phone the text wraps on its own.
 */
export function rich(value, { breaks = "always" } = {}) {
    // A desktop-only break keeps a space, so the words do not run together on a
    // phone, where the break is hidden.
    const br = breaks === "desktop" ? ' <br class="hidden md:inline" />' : "<br />"

    return escapeHtml(rebrand(value))
        .replace(/\*([^*]+)\*/g, '<span class="cms-accent">$1</span>')
        .replace(/\r?\n/g, br)
}

/** The same text without the markers, for <title>, alt text and the like. */
export function plain(value) {
    return rebrand(value).replace(/\*([^*]+)\*/g, "$1").replace(/\s*\r?\n\s*/g, " ").trim()
}

/** Whether an on/off field is on. Missing counts as on. */
export const on = (value) => value !== "0" && value !== 0 && value !== false

/** A repeater's rows that are switched on (rows without a switch always are). */
export const shown = (rows, key = "show") =>
    (Array.isArray(rows) ? rows : []).filter((row) => row && on(row[key]))
