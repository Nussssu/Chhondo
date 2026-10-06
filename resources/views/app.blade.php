<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    {{--
        Fonts, fetched without blocking the first paint.

        Poppins was requested at every weight from 100 to 900. Only 400, 500,
        600, 700 and 800 appear anywhere in the stylesheets or as Tailwind
        weight classes, so four font files were downloaded on every visit and
        never drawn with. The other families are unchanged.

        The stylesheet is requested as `print`, which the browser does not
        treat as render-blocking, then switched to `all` once it arrives. Text
        paints immediately in the fallback face and swaps when the webfont
        lands — which is what `display=swap` already asked for. The difference
        is that the first paint no longer waits on a round trip to
        fonts.googleapis.com. <noscript> keeps the fonts working without JS.
    --}}
    @php
        $fontsHref = 'https://fonts.googleapis.com/css2'
            . '?family=DM+Sans:wght@400;500;600;700'
            . '&family=Hind+Siliguri:wght@300;400;500;600;700'
            . '&family=Manrope:wght@400;500;600;700'
            . '&family=Playfair+Display:wght@700'
            . '&family=Poppins:wght@300;400;500;600;700;800'
            . '&family=Sora:wght@400;500;600;700'
            . '&display=swap';
    @endphp
    <link href="{{ $fontsHref }}" rel="stylesheet" crossorigin media="print"
        onload="this.media='all';this.onload=null" />
    <noscript><link href="{{ $fontsHref }}" rel="stylesheet" crossorigin /></noscript>

    {{--
        One reader of media_favicon, through one helper.

        This used to call Cache::remember() on the same key with a different
        value: the helper caches the raw column ("media/fav.webp") while this
        cached the accessor's ("/media/fav.webp"). Whichever ran first won, and
        when it was the admin panel this emitted the raw value as a relative
        href — so the favicon resolved against the current path and 404'd on
        every page below the root, such as /product/{slug}. asset() makes it
        absolute, which is what admin_root.blade.php has always done.
    --}}
    @php $faviconPath = getMedia('favicon'); @endphp
    <link rel="icon" href="{{ $faviconPath ? asset($faviconPath) : asset('favicon.ico') }}">

    @inertiaHead
    @php
        // The current page's own chunk, so its styles (and those of the
        // layout and components it imports) are in <head> before first paint.
        // Otherwise they arrive only once app.js loads the page — which a
        // server-rendered page is already on screen for, briefly unstyled.
        // Only a page the build actually contains is added: a missing entry
        // would make @vite throw and take the whole page down.
        $viteEntries = ['resources/css/app.css', 'resources/js/app.js'];
        $pageEntry = 'resources/js/Pages/' . ($page['component'] ?? '') . '.vue';
        if (! empty($page['component']) && is_file(base_path($pageEntry))) {
            $manifestPath = public_path('build/manifest.json');
            if (Illuminate\Support\Facades\Vite::isRunningHot()
                || (is_file($manifestPath) && array_key_exists($pageEntry, json_decode(file_get_contents($manifestPath), true) ?: []))) {
                $viteEntries[] = $pageEntry;
            }
        }
    @endphp
    @vite($viteEntries)
    {{-- Storefront routes only; admin.* is excluded. See config/ziggy.php. --}}
    @routes('storefront')

    @php
        $colors = $globalCategories['colors'] ?? [
            'main'          => '#ffb700',
            'secondary'     => '#d89b02',
            'cart_bg'       => '#d89b02',
            'order_now_bg'  => '#d89b02',
            'call_now_bg'   => '#ff0000',
            'whatsapp_bg'   => 'green',
        ];
        $isAdminPage = str_starts_with($page['component'] ?? '', 'Admin/');
    @endphp

    @php
        // Custom code snippets (Marketing tools) for this URL.
        $marketingSlots = app(\App\Services\MarketingTool\MarketingScriptRenderer::class)
            ->slotsFor(request()->path());
    @endphp

    <style>
        :root {
            --color-theme:         {{ $isAdminPage ? $colors['main'] : '#252f17' }};
            --color-secondary:     {{ $isAdminPage ? $colors['secondary'] : '#cc9b25' }};
            --color-cart-bg:       {{ $isAdminPage ? $colors['cart_bg'] : '#1a2110' }};
            --color-order-now-bg:  {{ $isAdminPage ? $colors['order_now_bg'] : '#1a2110' }};
            --color-call-now-bg:   {{ $colors['call_now_bg'] }};
            --color-whatsapp-bg:   {{ $colors['whatsapp_bg'] }};
        }
    </style>

    {!! $marketingSlots['head'] !!}
</head>

<body class="body_area {{ $isAdminPage ? 'admin-area' : 'storefront-area' }}">
    {!! $marketingSlots['body_start'] !!}

    @inertia

    {!! $marketingSlots['body_end'] !!}
</body>

</html>
