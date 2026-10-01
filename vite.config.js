import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import inertia from '@inertiajs/vite';
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/admin.js'],
            // Built by `vite build --ssr` into bootstrap/ssr/ssr.js.
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        // Serves the SSR entry through the dev server, so `npm run dev` renders
        // on the server too without a separate Node process.
        inertia({ ssr: 'resources/js/ssr.js' }),
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    // The production SSR build bundles every dependency into
    // bootstrap/ssr/ssr.js, so the SSR server runs from that one file and the
    // host needs no node_modules. Not in dev, where Vite loads packages from
    // node_modules itself and would otherwise run CommonJS ones as ES modules.
    ssr: isSsrBuild ? { noExternal: true } : {},
    server: {
        host: '127.0.0.1',
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
}));
