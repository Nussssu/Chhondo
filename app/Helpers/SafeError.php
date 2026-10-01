<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Turns an exception into something safe to hand back to a caller.
 *
 * Several endpoints returned `$e->getMessage()` directly in their response. On a
 * database error that message contains the failing SQL, table and column names; on a
 * third-party failure it can contain request URLs and credentials. Public endpoints
 * were doing this to unauthenticated callers.
 *
 * The real message is still available where it belongs — the log — and is only
 * returned to the caller when APP_DEBUG is on, so local debugging is unaffected.
 */
class SafeError
{
    public static function message(
        Throwable $e,
        string $fallback = 'An unexpected error occurred. Please try again later.',
        string $context = ''
    ): string {
        Log::error($context !== '' ? $context : 'Handled exception', [
            'exception' => $e::class,
            'message' => $e->getMessage(),
            'file' => $e->getFile() . ':' . $e->getLine(),
        ]);

        return config('app.debug') ? $e->getMessage() : $fallback;
    }
}
