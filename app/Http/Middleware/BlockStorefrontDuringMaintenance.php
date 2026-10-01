<?php

namespace App\Http\Middleware;

use App\Models\SiteInfo;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Closes the storefront while maintenance mode is switched on under
 * Store settings › General.
 *
 * Every visitor gets the maintenance page instead of the page they asked for.
 * Only these still get through:
 *
 *  - signed-in staff (the PANEL_ROLES), so the admin panel keeps working and
 *    they can check the storefront before reopening it;
 *  - the screens a staff member needs to sign in in the first place;
 *  - payment gateway and courier callbacks, which report money already taken
 *    or parcels already moving — refusing them would lose that record;
 *  - uploaded files under /storage.
 *
 * This is separate from `php artisan down`: that stops the whole application,
 * admin panel included, and cannot be switched from the panel.
 */
class BlockStorefrontDuringMaintenance
{
    /** Paths that stay open, as Request::is() patterns. */
    private const ALWAYS_OPEN = [
        // Admin login screen and the panel itself (the panel is still guarded
        // by `auth` + `admin`; this only stops maintenance mode hiding it).
        'admin',
        'admin/*',
        // Password reset for staff. (POST /login is handled in handle().)
        'logout',
        'forgot-password',
        'reset-password',
        'reset-password/*',
        // Gateway and courier server-to-server calls.
        'payment/sslcommerz/*',
        'payment/bkash/callback',
        'staedfast-webhook',
        'storage/*',
    ];

    /** How long, in seconds, clients and crawlers are told to wait. */
    private const RETRY_AFTER = 600;

    public function handle(Request $request, Closure $next): Response
    {
        if (! SiteInfo::maintenanceModeOn() || $this->allowed($request)) {
            return $next($request);
        }

        // The storefront login page is closed, but it is also where Laravel sends
        // a signed-out visitor to any admin URL — send them to the admin sign-in.
        if ($request->is('login') && $request->isMethod('GET')) {
            return $request->header('X-Inertia')
                ? Inertia::location(route('admin.login'))
                : redirect()->route('admin.login');
        }

        // An Inertia visit expects a page object, not HTML; ask the browser to
        // reload the address in full so it receives the maintenance page.
        if ($request->header('X-Inertia')) {
            return Inertia::location($request->fullUrl());
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(
                ['message' => 'The store is under maintenance. Please try again shortly.'],
                Response::HTTP_SERVICE_UNAVAILABLE,
                ['Retry-After' => self::RETRY_AFTER]
            );
        }

        return response()
            ->view('maintenance', [], Response::HTTP_SERVICE_UNAVAILABLE)
            ->header('Retry-After', self::RETRY_AFTER);
    }

    private function allowed(Request $request): bool
    {
        if ($request->is(...self::ALWAYS_OPEN)) {
            return true;
        }

        // The admin login form posts to /login.
        if ($request->is('login') && $request->isMethod('POST')) {
            return true;
        }

        $user = $request->user();

        return $user !== null && $user->hasAnyRole(EnsureUserCanAccessAdmin::PANEL_ROLES);
    }
}
