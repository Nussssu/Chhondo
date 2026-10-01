<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts the admin panel to staff.
 *
 * Deny by default: a user reaches /admin only by holding one of the roles listed in
 * PANEL_ROLES. Customers — and any account with no role at all — are turned away.
 * This is only the outer door; the per-route `permission:` middleware still decides
 * what each staff member may do once inside.
 *
 * Runs after `auth`, so an unauthenticated visitor is redirected to log in before
 * this middleware is ever reached.
 */
class EnsureUserCanAccessAdmin
{
    /**
     * Roles allowed into the admin panel.
     *
     * Add a role here to grant it access to the panel; its `permission:` grants then
     * control which pages it can actually open.
     */
    public const PANEL_ROLES = ['Admin', 'Agent', 'Sales Man'];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && $user->hasAnyRole(self::PANEL_ROLES)) {
            return $next($request);
        }

        // API clients and XHR callers get a status code they can act on rather than
        // a redirect to an HTML page.
        if ($request->expectsJson() || $request->isJson()) {
            abort(Response::HTTP_FORBIDDEN, 'This area is restricted to staff accounts.');
        }

        // A signed-in customer who lands on an admin URL is sent to their own
        // dashboard instead of being shown a dead end.
        return redirect()
            ->route('account')
            ->with('error', 'You do not have access to the admin panel.');
    }
}
