<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

/**
 * Whether the Inertia SSR server is up.
 *
 * Inertia tries the SSR server on every full page load. When it is not
 * running, that attempt waited for the connection to fail — about 4.5 seconds
 * a page on Windows — before falling back to client rendering. A 150 ms socket
 * probe, remembered for 30 seconds, decides instead: SSR is used whenever the
 * server answers and skipped quickly when it does not.
 */
class SsrProbe
{
    private const CACHE_KEY = 'inertia_ssr_reachable';

    public static function reachable(): bool
    {
        return Cache::remember(self::CACHE_KEY, 30, function () {
            $url = (string) config('inertia.ssr.url', 'http://127.0.0.1:13714');
            $host = parse_url($url, PHP_URL_HOST) ?: '127.0.0.1';
            $port = parse_url($url, PHP_URL_PORT) ?: 13714;

            $socket = @fsockopen($host, (int) $port, $errno, $errstr, 0.15);
            if ($socket === false) {
                return false;
            }

            fclose($socket);

            return true;
        });
    }
}
