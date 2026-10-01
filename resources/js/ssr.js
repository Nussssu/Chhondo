/**
 * Server-side rendering for the storefront.
 *
 * Laravel posts each first page load here (StorefrontSsrGateway) and puts the
 * returned HTML inside #app, so the page arrives already drawn; app.js then
 * hydrates it. Nothing here is required for the site to work: when this server
 * is down or a render fails, Laravel serves the page exactly as it did before
 * SSR and the browser renders it.
 *
 * Development: `npm run dev` serves this through Vite (@inertiajs/vite).
 * Production:  `npm run build`, then `php artisan inertia:start-ssr`.
 */
import { AsyncLocalStorage } from 'node:async_hooks'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { createPinia } from 'pinia'
import { createHead, renderHeadToString } from '@vueuse/head'
import { route as ziggyRoute, ZiggyVue } from '../../vendor/tightenco/ziggy'
import { resolvePage, title } from './inertiaPages'

/** The request being rendered: its route list (see the gateway). */
const requestContext = new AsyncLocalStorage()

// In the browser @routes defines a global route(), which components call from
// <script setup> without importing it. This server renders many requests at
// once, so the global reads the config of the request it is called from rather
// than a shared variable that another request could overwrite mid-render.
globalThis.route = (name, params, absolute, config) =>
    ziggyRoute(name, params, absolute, config ?? requestContext.getStore()?.ziggy)

async function render(page) {
    // ssrContext is for this server only; the page JSON embedded in the HTML
    // must be exactly what Laravel would have sent without SSR.
    const { ssrContext = {}, ...inertiaPage } = page

    return requestContext.run(ssrContext, async () => {
        let head = null

        const result = await createInertiaApp({
            page: inertiaPage,
            // <Teleport> content is not server-rendered: see ClientOnly.vue.
            render: renderToString,
            title,
            resolve: resolvePage,
            setup({ App, props, plugin }) {
                head = createHead()

                return createSSRApp({ render: () => h(App, props) })
                    .use(plugin)
                    .use(createPinia())
                    .use(head)
                    .use(ZiggyVue, ssrContext.ziggy)
            },
        })

        // Tags set with useHead() (Inertia's <Head> is already in result.head).
        if (head) {
            const { headTags } = await renderHeadToString(head)
            if (headTags) {
                result.head.push(headTags)
            }
        }

        return result
    })
}

if (import.meta.env.PROD) {
    createServer(render)
}

export default render
