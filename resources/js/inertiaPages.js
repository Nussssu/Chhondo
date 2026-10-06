/**
 * What the storefront's browser entry (app.js) and server-render entry
 * (ssr.js) must agree on. Both import it from here: a page the server renders
 * differently from the browser fails to hydrate.
 */
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

// The storefront brand. APP_NAME is shared with the admin and backend (mail,
// SMS), which keep their own name, so the customer-facing title is fixed here.
const appName = 'Chhondo'

export const title = (title) => title ? `${title} - ${appName}` : appName

// Pages are fetched on demand rather than compiled into one bundle, and the
// admin panel is left out entirely: it renders through admin_root.blade.php
// and its own entry, so nothing on the storefront can resolve to it.
export const resolvePage = (name) => resolvePageComponent(
    `./Pages/${name}.vue`,
    import.meta.glob(['./Pages/**/*.vue', '!./Pages/Admin/**']),
)
