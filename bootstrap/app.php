<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            // Last, so the session is started and the signed-in user is known.
            \App\Http\Middleware\BlockStorefrontDuringMaintenance::class,
        ]);

        // Ahead of `auth`, so a signed-out visitor to /account sees the
        // maintenance page rather than being bounced to a login screen.
        $middleware->prependToPriorityList(
            before: \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class,
            prepend: \App\Http\Middleware\BlockStorefrontDuringMaintenance::class,
        );

        // The wishlist endpoints authenticate with the ordinary session cookie,
        // so the API stack needs the cookie middleware as well as the session.
        //
        // With StartSession alone, the encrypted cookie was never decrypted:
        // its ciphertext was used as the session id, matched nothing, and a new
        // empty session was created. Every wishlist click therefore answered
        // 401 — which the axios interceptor turns into a redirect to /login —
        // and wrote back an unencrypted cookie that broke the real session.
        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
        ]);
        $middleware->api(append: [
            \App\Http\Middleware\BlockStorefrontDuringMaintenance::class,
        ]);

        $middleware->alias([
            'role'               => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission'         => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'admin'              => \App\Http\Middleware\EnsureUserCanAccessAdmin::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/staedfast-webhook',
            // Posted by SSLCommerz, which has no session and no CSRF token.
            // Safe because each endpoint re-confirms with the gateway rather
            // than trusting what was posted.
            'payment/sslcommerz/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => $e->getMessage()], 401);
            }
        });

        // Serve the storefront 404 page for unmatched routes and abort(404), but leave
        // API and admin responses to their defaults.
        //
        // This used to `redirect()->route('404')`, which answered every missing page
        // with a 302 to a URL that then returned 200. Crawlers and API clients never
        // saw a 404, so dead product links looked live to search engines. The page is
        // now rendered in place with the correct status.
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->is('admin/*') || $request->is('admin') || $request->is('404')) {
                return null;
            }

            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            return Inertia::render('Public/Error/NotFound', ['texts' => \App\Models\Page::textsFor('not_found')])
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
