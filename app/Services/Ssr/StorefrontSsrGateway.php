<?php

namespace App\Services\Ssr;

use Illuminate\Http\Request;
use Inertia\Ssr\HttpGateway;
use Inertia\Ssr\Response;
use Tighten\Ziggy\Ziggy;

/**
 * Inertia's SSR gateway, with the context the storefront needs to render in
 * Node.
 *
 * The browser gets its route list from @routes, which the SSR server never
 * sees, so the same list is attached to the render request here. It rides in
 * `ssrContext`, which resources/js/ssr.js removes before rendering — it never
 * reaches the page JSON in the HTML, so the page gets no heavier.
 *
 * The admin panel is not server-rendered: its pages are not in the SSR bundle,
 * and the middleware keeps admin URLs away from SSR altogether. The component
 * check below covers an admin page served from any other URL.
 */
class StorefrontSsrGateway extends HttpGateway
{
    public function dispatch(array $page, ?Request $request = null): ?Response
    {
        $request ??= request();

        if (str_starts_with((string) ($page['component'] ?? ''), 'Admin/')) {
            return null;
        }

        // Checked first so the route list is only built when a render will
        // actually be attempted.
        if (! $this->ssrIsEnabled($request)) {
            return null;
        }

        $page['ssrContext'] = [
            'ziggy' => [
                ...(new Ziggy)->jsonSerialize(),
                // What window.location gives Ziggy in the browser, so
                // route().current() answers the same on both sides.
                'location' => [
                    'host'     => $request->getHttpHost(),
                    'pathname' => '/' . ltrim($request->getPathInfo(), '/'),
                    'search'   => ($query = $request->getQueryString()) ? '?' . $query : '',
                ],
            ],
        ];

        return parent::dispatch($page, $request);
    }
}
