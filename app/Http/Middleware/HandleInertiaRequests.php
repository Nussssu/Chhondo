<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\SiteInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * The admin panel renders in the browser only. Its pages are not part of
     * the SSR bundle, and nothing there needs to be indexed or previewed.
     */
    protected $withoutSsr = ['admin', 'admin/*'];

    public function rootView(Request $request): string
    {
        if ($request->is('admin/*') || $request->is('admin')) {
            return 'admin_root';
        }
        return 'app';
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Resolve the admin software version. On deploy, CI writes the git tag +
     * timestamp into version.txt. Locally there is no CI, so fall back to the
     * file's last-modified time so it still reflects when it last changed.
     */
    protected function resolveAdminVersion(): string
    {
        $path = base_path('version.txt');
        $content = is_file($path) ? trim((string) @file_get_contents($path)) : '';

        if ($content !== '' && strtolower($content) !== 'dev') {
            return $content;
        }

        if (is_file($path)) {
            return 'dev · ' . date('Y-m-d H:i', filemtime($path));
        }

        return 'unknown';
    }

    public function share(Request $request): array
    {
        // Resolve identifier: logged-in user id or session guest_id
        if ($request->user()) {
            $identifier = (string) $request->user()->id;
        } else {
            $identifier = $request->session()->get('guest_id');
        }

        // Load cart from DB if we have an identifier.
        //
        // This used to build its own cart payload with its own pricing, which
        // knew nothing about campaign or coupon discounts — so the header cart
        // quoted a different price than checkout charged. Both now come from
        // the one place that prices a cart line.
        $cartItems = [];
        if ($identifier) {
            try {
                $cartItems = app(\App\Repositories\Admin\Cart\CartRepository::class)
                    ->getCartItems($identifier)
                    ->values()
                    ->toArray();
            } catch (\Exception $e) {
                $cartItems = [];
            }
        }

        // Wishlist product IDs for the authenticated user (used to render heart state)
        $wishlistIds = [];
        if ($request->user()) {
            try {
                $wishlistIds = \App\Models\Wishlist::where('user_id', $request->user()->id)
                    ->pluck('product_id')
                    ->map(fn ($id) => (int) $id)
                    ->all();
            } catch (\Exception $e) {
                $wishlistIds = [];
            }
        }

        // Load site info
        $storeInfo = null;
        $contactInfo = [];
        try {
            // Use collection first() to avoid calling a static first() that may require arguments
            $siteInfo = SiteInfo::all()->first();
            if ($siteInfo) {
                $mediaRow  = DB::table('media')->first();
                $mediaArr  = $mediaRow ? (array) $mediaRow : [];
                // Normalize to a root-relative path so a stale domain baked into
                // an old upload (e.g. from a different environment) can't leave
                // the browser trying to resolve a host that doesn't exist here.
                foreach (['logo', 'favicon', 'loader', 'footer_image'] as $col) {
                    if (!empty($mediaArr[$col])) {
                        if (preg_match('#^https?://#i', $mediaArr[$col])) {
                            $mediaArr[$col] = parse_url($mediaArr[$col], PHP_URL_PATH) ?? $mediaArr[$col];
                        }
                        $mediaArr[$col] = '/' . ltrim($mediaArr[$col], '/');
                    }
                }
                $storeInfo = array_merge($siteInfo->toArray(), [
                    'media' => $mediaRow ? [$mediaArr] : [],
                ]);

                // One normalised contact block for every storefront surface that
                // shows a phone number, an email, an address or opening hours.
                $contactInfo = $siteInfo->contact();
            }
        } catch (\Exception $e) {
            // DB may not be available during migrations
        }

        // Admin-specific shared data
        $adminData = [];
        if ($request->is('admin/*') || $request->is('admin')) {
            $user = $request->user();
            $isSuperAdmin = $user && $user->hasRole('Super Admin');
            $allPermissions = [
                'Dashboard','OrderManagement','PosManagement','AddProduct','AllProduct',
                'AddCoupon','CouponList','UserInformation',
                'AddSupplier','SupplierList','AddPurchase','PurchaseList',
                'AddCategory','AddCampaign','ListCampaign',
                'RoleUser','RolePermission','AccountManagement','AccountList',
                'AccountType','ReportBalance','FundTransfer','AccountPurpose',
                'AnalyticsDashboard','BlogCategory','Blogs',
                'StockOut',
                'CouriarApi','PaymentApi','SmsApi','OrderReport',
                'Policy','TermCondition','RefundPolicy','SaleSupport','ShippingDelivery',
                'MediaManage','BasicInformation','Slider','Contact','SocialMedia',
                'Comment','MarketingTool','DeleteProduct',
            ];
            $permissions = [];
            foreach ($allPermissions as $p) {
                $permissions[$p] = $isSuperAdmin || ($user && $user->hasPermissionTo($p));
            }
            // Orders awaiting action, for the sidebar badge. Every order —
            // storefront checkout and admin POS alike — is created as
            // "pending" and leaves that status once someone processes it, so
            // this is both the new-order count and the outstanding work queue.
            //
            // It deliberately does not use viewed_at: that clears the moment an
            // operator opens an order, which would empty the badge while the
            // work itself is still undone.
            // Counted separately: each badge must match the page it sits on, so
            // the Orders badge never includes counter sales and vice versa.
            $pendingOrderCount = 0;
            $pendingPosOrderCount = 0;
            try {
                $pendingOrderCount = \App\Models\Order::storefront()->where('order_status', 'pending')->count();
                $pendingPosOrderCount = \App\Models\Order::pos()->where('order_status', 'pending')->count();
            } catch (\Exception $e) {
                $pendingOrderCount = 0;
                $pendingPosOrderCount = 0;
            }

            // Contact messages nobody has opened yet — drives the "Messages" badge.
            $unreadMessageCount = 0;
            try {
                $unreadMessageCount = \App\Models\ContactMessage::where('is_read', false)->count();
            } catch (\Exception $e) {
                $unreadMessageCount = 0;
            }

            // Product reviews awaiting approval — drives the "Review" sidebar badge.
            $pendingReviewCount = 0;
            try {
                $pendingReviewCount = \App\Models\ProductReview::where('is_active', false)->count();
            } catch (\Exception $e) {
                $pendingReviewCount = 0;
            }

            $adminData = [
                'adminPermissions' => $permissions,
                'adminIsSuperAdmin' => $isSuperAdmin,
                'adminVersion' => $this->resolveAdminVersion(),
                'adminLogo' => $storeInfo ? ($storeInfo['media'][0]['logo'] ?? '/assets/images/logo/logo.png') : '/assets/images/logo/logo.png',
                'adminPendingOrderCount' => $pendingOrderCount,
                'adminPendingPosOrderCount' => $pendingPosOrderCount,
                'adminUnreadMessageCount' => $unreadMessageCount,
                'adminPendingReviewCount' => $pendingReviewCount,
            ];
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'            => $request->user()->id,
                    'name'          => $request->user()->name,
                    'email'         => $request->user()->email,
                    'phone'         => $request->user()->phone,
                    // Root-relative, so an absolute URL saved against another
                    // environment cannot point the browser at a dead host.
                    'image'         => $request->user()->image
                        ? '/' . ltrim(parse_url($request->user()->image, PHP_URL_PATH) ?: $request->user()->image, '/')
                        : null,
                    'date_of_birth' => optional($request->user()->date_of_birth)->format('Y-m-d'),
                ] : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'storeInfo' => $storeInfo,
            // The single source for contact details. Storefront only.
            'contact' => ($request->is('admin') || $request->is('admin/*')) ? [] : $contactInfo,
            'cartItems' => $cartItems,
            'cartCount' => array_sum(array_column($cartItems, 'quantity')),
            'wishlistIds' => $wishlistIds,
            // Header menu and footer content, both editable under Settings.
            'layout' => ($request->is('admin') || $request->is('admin/*')) ? null : [
                // A section switched to Hidden (Header & footer) arrives empty.
                'menu'   => (\App\Models\LayoutSetting::get('header')['menu_enabled'] ?? true) === false
                    ? []
                    : \App\Models\MenuItem::tree('header'),
                'header' => \App\Models\LayoutSetting::forStorefront('header'),
                'footer' => \App\Models\LayoutSetting::forStorefront('footer'),
            ],
            // Custom code snippets, so SPA navigation can inject the ones the
            // initial server render did not cover. Storefront only.
            'marketingScripts' => ($request->is('admin') || $request->is('admin/*'))
                ? []
                : app(\App\Services\MarketingTool\MarketingScriptRenderer::class)->payloadFor($request->path()),
        ] + $adminData);
    }
}
