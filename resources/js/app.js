import '../css/app.css'
import { createApp, createSSRApp, h } from 'vue'
import { createPinia } from 'pinia'
import { createInertiaApp } from '@inertiajs/vue3'
import { ZiggyVue } from '../../vendor/tightenco/ziggy'
import { createHead } from '@vueuse/head'
import { router } from '@inertiajs/vue3'
import { setupMarketingScripts } from '@/utils/marketingScripts'
import { resolvePage, title } from '@/inertiaPages'

createInertiaApp({
    title,
    resolve: resolvePage,
    setup({ el, App, props, plugin }) {
        // When the server rendered this page (resources/js/ssr.js), take over
        // its markup instead of drawing the page again. Without an SSR server
        // the element arrives empty and the app renders from scratch.
        const create = el.hasAttribute('data-server-rendered') ? createSSRApp : createApp
        const app = create({ render: () => h(App, props) })
        const pinia = createPinia()
        const head = createHead()

        app.use(plugin)
        app.use(pinia)
        app.use(head)
        app.use(ZiggyVue)

        app.mount(el)

        // Marketing tool snippets for pages reached via in-app navigation.
        setupMarketingScripts(router)
    },
    progress: {
        color: 'var(--color-theme)',
        showSpinner: true,
    },
})
