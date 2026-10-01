<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Web\AuthWebController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CheckoutWebController;
use App\Http\Controllers\Web\AddressWebController;
use App\Http\Controllers\Web\ProfileWebController;
use App\Http\Controllers\Web\ProductReviewController;
use App\Http\Controllers\Admin\AccessManagement\RollPermissionController;
use App\Http\Controllers\Admin\AccessManagement\RollUserController;
use App\Http\Controllers\Admin\Orders\ManageOrdersController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\SteadFastWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─────────────────────────────────────────────
// Public storefront routes (Inertia/Vue)
// ─────────────────────────────────────────────
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/blocked', [PageController::class, 'blocked'])->name('blocked');
Route::get('/404', [PageController::class, 'notFound'])->name('404');

// ─────────────────────────────────────────────
// Storage fallback — serves /storage/* through PHP when the
// public/storage symlink is unavailable (the production host
// blocks symlink(), so `php artisan storage:link` cannot run there).
// When the symlink exists (e.g. locally) the web server serves the
// file statically and this route never fires.
// ─────────────────────────────────────────────
Route::get('/storage/{path}', function (string $path) {
    $base = realpath(storage_path('app/public'));
    $full = realpath(storage_path('app/public/' . $path));

    abort_if($base === false || $full === false, 404);
    abort_unless(str_starts_with($full, $base . DIRECTORY_SEPARATOR), 404);

    return response()->file($full);
})->where('path', '.*')->name('storage.local');
Route::get('/about-us', [PageController::class, 'about'])->name('about');
Route::get('/contact-us', [PageController::class, 'contactUs'])->name('contact');
Route::post('/contact-us', [PageController::class, 'contactSubmit'])->name('contact.submit');
Route::get('/privacy-policy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms-and-conditions', [PageController::class, 'terms'])->name('terms');
Route::get('/refund-policy', [PageController::class, 'refund'])->name('refund.policy');
Route::get('/shipping-and-delivery', [PageController::class, 'shippingDelivery'])->name('shipping.delivery');

Route::get('/product/{slug}', [PageController::class, 'singleProduct'])->name('product.detail');
Route::post('/product/{product:slug}/reviews', [ProductReviewController::class, 'store'])->name('product.reviews.store');
Route::get('/product-category/{slug}', [PageController::class, 'categoryByProductPage'])->name('categoryByProductPage');

Route::get('/blog', [PageController::class, 'blogIndex'])->name('blog.index');
Route::get('/blog/{slug}', [PageController::class, 'blogShow'])->name('blog.show');

Route::get('/categories', [PageController::class, 'categories'])->name('categories');
Route::get('/shop', [PageController::class, 'shop'])->name('product.shop');
Route::get('/cart', [PageController::class, 'cart'])->name('cart.index');
Route::get('/checkout', [PageController::class, 'checkout'])->name('checkout.index');

// Guest order lookup. These are unauthenticated by design — a customer tracks an order
// with nothing but its invoice number — so they are rate limited: invoice numbers issued
// before Order::generateInvoiceNumber() was hardened are only 4 digits and would
// otherwise let someone walk the entire order book.
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/track-order', [PageController::class, 'trackOrder'])->name('track.order');
    Route::get('/success/{invoiceNumber}', [PageController::class, 'orderSuccess'])->name('order.success');
    Route::get('/order/data/{invoiceNumber}', [PageController::class, 'orderData']);
});

// Auth web POST routes
Route::post('/auth/login', [AuthWebController::class, 'login'])->name('auth.login.post');
Route::post('/auth/register', [AuthWebController::class, 'register'])->name('auth.register.post');
Route::post('/auth/logout', [AuthWebController::class, 'logout'])->name('auth.logout');

// Cart routes
// SSLCommerz sends the customer, and its own server, to these. They are
// unauthenticated and CSRF-exempt because the gateway is the caller.
Route::prefix('payment/sslcommerz')->name('payment.sslcommerz.')->group(function () {
    Route::match(['get', 'post'], '/success', [\App\Http\Controllers\Web\SslCommerzController::class, 'success'])->name('success');
    Route::match(['get', 'post'], '/fail', [\App\Http\Controllers\Web\SslCommerzController::class, 'fail'])->name('fail');
    Route::match(['get', 'post'], '/cancel', [\App\Http\Controllers\Web\SslCommerzController::class, 'cancel'])->name('cancel');
    Route::post('/ipn', [\App\Http\Controllers\Web\SslCommerzController::class, 'ipn'])->name('ipn');
});

// bKash redirects the customer here with paymentID and status; the controller
// confirms with bKash itself before marking anything paid.
Route::get('/payment/bkash/callback', [\App\Http\Controllers\Web\BkashController::class, 'callback'])
    ->middleware('throttle:30,1')
    ->name('payment.bkash.callback');

// Header search — queries the catalogue, so it works on every page.
Route::get('/search/products', \App\Http\Controllers\Web\ProductSearchController::class)->name('search.products');

// The "Recently viewed" row resolves the ids the browser remembers into live
// products. Registered here, above the catch-all /{slug}, like search is.
Route::get('/recently-viewed', \App\Http\Controllers\Web\RecentlyViewedController::class)
    ->name('recently-viewed');

Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'updateQuantity'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

// Checkout
Route::post('/checkout/submit', [CheckoutWebController::class, 'submit'])->name('checkout.submit');
Route::post('/checkout/check-coupon', [ManageOrdersController::class, 'validateCoupon'])->name('checkout.coupon');

// Auth pages (Inertia renders)
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/login', [PageController::class, 'login'])->name('login');

// Protected account routes (session auth)
Route::middleware(['auth'])->group(function () {
    Route::get('/account', [PageController::class, 'account'])->name('account');
    Route::get('/account/orders', [PageController::class, 'userOrders'])->name('account.orders');
    Route::get('/account/wishlist', [PageController::class, 'userWishlist'])->name('account.wishlist');
    Route::get('/account/track-order', [PageController::class, 'accountTrackOrder'])->name('account.track-order');

    // Profile
    Route::put('/account/profile', [ProfileWebController::class, 'update'])->name('account.profile.update');
    Route::post('/account/profile/avatar', [ProfileWebController::class, 'updateAvatar'])->name('account.profile.avatar');

    // Address CRUD
    Route::post('/account/addresses', [AddressWebController::class, 'store'])->name('address.store');
    Route::put('/account/addresses/{id}', [AddressWebController::class, 'update'])->name('address.update');
    Route::post('/account/addresses/{id}/delete', [AddressWebController::class, 'destroy'])->name('address.destroy');
    Route::post('/account/addresses/{id}/primary', [AddressWebController::class, 'setDefault'])->name('address.primary');
});

// ─────────────────────────────────────────────
// Public courier webhook (unauthenticated — the courier calls this)
// CSRF is excluded for this path in bootstrap/app.php.
// ─────────────────────────────────────────────
Route::post('/staedfast-webhook', [SteadFastWebhookController::class, 'handleSteadFastWebhook']);

// ─────────────────────────────────────────────
// Admin routes (session auth)
//
// Every admin route lives inside the `admin` middleware group below, which admits
// only the staff roles listed in EnsureUserCanAccessAdmin::PANEL_ROLES. Customers
// and role-less accounts are redirected to their own dashboard.
//
// Anything added outside this group is NOT protected — put new admin routes in one
// of the required files, or inside the group.
// ─────────────────────────────────────────────

// The admin login screen itself must stay reachable by guests.
Route::get('/admin', function () {
    if (auth()->check() && ! auth()->user()->hasAnyRole(\App\Http\Middleware\EnsureUserCanAccessAdmin::PANEL_ROLES)) {
        return redirect()->route('account');
    }

    return Inertia::render('Admin/Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
})->name('admin.login');

// `auth` is listed first so an unauthenticated visitor is sent to the login screen
// rather than bounced through the customer dashboard by the `admin` gate.
Route::middleware(['auth', 'admin'])->group(function () {
    // Access management
    Route::group(['middleware' => ['auth', 'verified'], 'prefix' => 'admin'], function () {
        // Create/edit for both happen in a modal on their index page.
        Route::resource('role-user', RollUserController::class)->except(['create', 'edit', 'show']);
        Route::post('role-user/create-role', [RollUserController::class, 'createRole'])->name('role-user.create-role');
        Route::resource('role-permission', RollPermissionController::class)->except(['create', 'edit', 'show']);
    });

    // POS
    require __DIR__ . '/admin/pos.php';

    // Incomplete / duplicate orders
    Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
        Route::prefix('incompelete')->name('incompelete.')->group(function () {
            Route::get('/', [ManageOrdersController::class, 'incompelete'])->name('index');
        });
        Route::prefix('duplicate')->name('duplicate.')->group(function () {
            Route::get('/', [ManageOrdersController::class, 'duplicate'])->name('index');
        });
    });

    // Modular admin route files
    require __DIR__ . '/admin/dashboard.php';
    require __DIR__ . '/admin/orders.php';
    require __DIR__ . '/admin/coupons.php';
    require __DIR__ . '/admin/categoriyes.php';
    require __DIR__ . '/admin/suppliers.php';
    require __DIR__ . '/admin/sliders.php';
    require __DIR__ . '/admin/purchase.php';
    require __DIR__ . '/admin/media.php';
    require __DIR__ . '/admin/media-library.php';
    require __DIR__ . '/admin/pages.php';
    require __DIR__ . '/admin/manage.php';
    require __DIR__ . '/admin/contact-messages.php';
    require __DIR__ . '/admin/marketing.php';
    require __DIR__ . '/admin/layout.php';
    require __DIR__ . '/admin/account.php';

    // Notifications — these surface admin stock-out alerts and are not scoped to the
    // requesting user, so they belong behind the staff gate.
    Route::middleware(['auth'])->group(function () {
        Route::get('/notifications/unread', [NotificationController::class, 'fetchUnread']);
        Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::post('/notifications/destroylastten', [NotificationController::class, 'destroylastten'])->name('destroylastten');
    });
});

// Auth routes (login, register, password reset — for both admin and storefront)
require __DIR__ . '/auth.php';

// ─────────────────────────────────────────────
// Pages the operator created in Content › Pages, served at their own slug.
//
// Registered last, and deliberately so: it matches any single-segment address,
// so every built-in route above must get first refusal. The slug is restricted
// to what App\Support\Slug produces (no dots, no slashes) to keep it away from
// asset and file requests.
// ─────────────────────────────────────────────
Route::get('/{slug}', [PageController::class, 'customPage'])
    ->where('slug', '[^/.]+')
    ->name('pages.custom');
