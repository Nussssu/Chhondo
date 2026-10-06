<?php

namespace App\Providers;

use App\Repositories\Admin\Account\AccountTypeRepository;
use App\Repositories\Admin\Account\AccountTypeRepositoryInterface;
use App\Repositories\Admin\Campaign\CampaignRepository;
use App\Repositories\Admin\Campaign\CampaignRepositoryInterface;
use App\Repositories\Admin\Cart\CartRepository;
use App\Repositories\Admin\Cart\CartRepositoryInterface;
use App\Repositories\Admin\Comment\CommentRepository;
use App\Repositories\Admin\Comment\CommentRepositoryInterface;
use App\Repositories\Admin\Coupon\CouponRepository;
use App\Repositories\Admin\Coupon\CouponRepositoryInterface;
use App\Repositories\Admin\CouriarApiSetting\CouriarApiSettingRepository;
use App\Repositories\Admin\CouriarApiSetting\CourierApiSettingRepository;
use App\Repositories\Admin\CouriarApiSetting\CourierApiSettingRepositoryInterface;
use App\Repositories\Admin\Manage_site\SiteRepository;
use App\Repositories\Admin\Manage_site\SiteRepositoryInterface;
use App\Repositories\Admin\MarketingTool\MarketingToolRepository;
use App\Repositories\Admin\MarketingTool\MarketingToolRepositoryInterface;
use App\Repositories\Admin\Media\MediaRepository;
use App\Repositories\Admin\Order\OrderRepository;
use App\Repositories\Admin\Order\OrderRepositoryInterface;
use App\Repositories\Admin\Pages\PageRepository;
use App\Repositories\Admin\Pages\PageRepositoryInterface;
use App\Repositories\Admin\Pos\POSRepository;
use App\Repositories\Admin\Pos\POSRepositoryInterface;
use App\Repositories\Admin\Report\ReportRepository;
use App\Repositories\Admin\Report\ReportRepositoryInterface;

use App\Repositories\Admin\SidebarSlider\SidebarSliderRepository;
use App\Repositories\Admin\SidebarSlider\SidebarSliderRepositoryInterface;
use App\Repositories\Admin\Smtp\SmtpSettingRepository;
use App\Repositories\Admin\Smtp\SmtpSettingRepositoryInterface;

use App\Services\Admin\Campaign\CampaignService;
use App\Services\Admin\Campaign\CampaignServiceInterface;
use App\Services\Admin\Cart\CartService;
use App\Services\Admin\Cart\CartServiceInterface;
use App\Services\Admin\Comment\CommentService;
use App\Services\Admin\Coupon\CouponService;
use App\Services\Admin\Coupon\CouponServiceInterface;
use App\Services\Admin\CouriarApiSetting\CouriarApiSettingService;
use App\Services\Admin\CouriarApiSetting\CouriarApiSettingServiceInterface;
use App\Services\Admin\Manage_site\SiteService;
use App\Services\Admin\Manage_site\SiteServiceInterface;
use App\Services\Admin\MarketingTool\MarketingToolService;
use App\Services\Admin\Media\MediaService;
use App\Services\Admin\Order\OrderService;
use App\Services\Admin\Order\OrderServiceInterface;
use App\Services\Admin\OrderStatistics\OrderStatisticsService;
use App\Services\Admin\Pages\PageService;
use App\Services\Admin\Pages\PageServiceInterface;
use App\Services\Admin\Pos\POSService;
use App\Services\Admin\Pos\POSServiceInterface;
use App\Services\Admin\Report\ReportService;
use App\Services\Admin\Report\ReportServiceInterface;
use App\Services\Admin\SidebarSlider\SidebarSliderService;
use App\Services\Admin\SidebarSlider\SidebarSliderServiceInterface;
use App\Services\Admin\Smtp\SmtpSettingService;
use App\Services\Admin\Smtp\SmtpSettingServiceInterface;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\SiteInfo;

use App\Repositories\Admin\Product\ProductRepository;
use App\Repositories\Admin\Product\ProductRepositoryInterface;
use App\Repositories\Admin\Purchase\PurchaseRepository;
use App\Repositories\Admin\Purchase\PurchaseRepositoryInterface;
use App\Repositories\Admin\Role\RoleRepository;
use App\Repositories\Admin\UserRole\UserRepository;
use App\Services\Admin\Account\AccountTypeService;
use App\Services\Admin\Account\AccountTypeServiceInterface;
use App\Services\Admin\Analytics\AnalyticsService;
use App\Services\Admin\CourierConfigService\CourierConfigService;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Purchase\PurchaseService;
use App\Services\Admin\Purchase\PurchaseServiceInterface;
use App\Services\Admin\Role\RolePermissionService;
use App\Services\Admin\UserRole\UserService;
use App\Services\AvatarService;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Server-side rendering for the storefront; see StorefrontSsrGateway.
        // A singleton, as Inertia's own gateway is: the middleware registers the
        // SSR-excluded paths on the instance the response later renders with.
        $this->app->singleton(\App\Services\Ssr\StorefrontSsrGateway::class);
        $this->app->bind(\Inertia\Ssr\Gateway::class, \App\Services\Ssr\StorefrontSsrGateway::class);

        //  PageRepositoryInterface to the PageRepository
        $this->app->bind(PageRepositoryInterface::class, PageRepository::class);
        // PageServiceInterface to the PageService
        $this->app->bind(PageServiceInterface::class, PageService::class);


        // SiteRepositoryInterface to the SiteRepository
        $this->app->bind(SiteRepositoryInterface::class, SiteRepository::class);
        // SiteServiceInterface to the SiteService
        $this->app->bind(SiteServiceInterface::class, SiteService::class);


        // SmtpSettingRepositoryInterface to the SmtpSettingRepository
        $this->app->bind(SmtpSettingRepositoryInterface::class, SmtpSettingRepository::class);
        // SmtpSettingServiceInterface to the SmtpSettingService
        $this->app->bind(SmtpSettingServiceInterface::class, SmtpSettingService::class);

        // SidebarSliderRepositoryInterface to the SidebarSliderRepository
        $this->app->bind(SidebarSliderRepositoryInterface::class, SidebarSliderRepository::class);
        // SidebarSliderServiceInterface to the SidebarSliderService
        $this->app->bind(SidebarSliderServiceInterface::class, SidebarSliderService::class);

        // CampaignRepositoryInterface to the CampaignRepository
        $this->app->bind(CampaignRepositoryInterface::class, CampaignRepository::class);
        //     // CampaignServiceInterface to the CampaignService
        $this->app->bind(CampaignServiceInterface::class, CampaignService::class);

        // CouponRepositoryInterface to the CouponRepository
        $this->app->bind(CouponRepositoryInterface::class, CouponRepository::class);
        //     // CouponServiceInterface to the CouponService
        $this->app->bind(CouponServiceInterface::class, CouponService::class);

        // MediaRepository
        $this->app->bind(MediaRepository::class);
        // MediaService
        $this->app->bind(MediaService::class);



        // CouriarApiSettingRepositoryInterface to the CouriarApiSettingRepository
        $this->app->bind(CourierApiSettingRepositoryInterface::class, CouriarApiSettingRepository::class);
        // CouriarApiSettingServiceInterface to the CouriarApiSettingService
        $this->app->bind(CouriarApiSettingServiceInterface::class, CouriarApiSettingService::class);


        // CommentRepositoryInterface to the CommentRepository
        $this->app->bind(CommentRepositoryInterface::class, CommentRepository::class);
        // CommentServiceInterface to the CommentService
        $this->app->bind(CommentService::class);

        // MarketingToolRepositoryInterface to the MarketingToolRepository
        $this->app->bind(MarketingToolRepositoryInterface::class, MarketingToolRepository::class);

        // MarketingToolService
        $this->app->bind(MarketingToolService::class);

        // POSRepositoryInterface to the POSRepository
        $this->app->bind(POSRepositoryInterface::class, POSRepository::class);
        // POSServiceInterface to the POSService
        $this->app->bind(POSServiceInterface::class, POSService::class);

        // CartServiceInterface to the CartService
        $this->app->bind(CartServiceInterface::class, CartService::class);

        // CartRepositoryInterface to the CartRepository
        $this->app->bind(CartRepositoryInterface::class, CartRepository::class);


        // OrderRepositoryInterface to the OrderRepository
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        // OrderServiceInterface to the OrderService
        $this->app->bind(OrderServiceInterface::class, OrderService::class);

        // ReportRepositoryInterface to the ReportRepository
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        //  // ReportServiceInterface to the ReportService
        $this->app->bind(ReportServiceInterface::class, ReportService::class);

        // OrderStatisticsService

        $this->app->bind(OrderStatisticsService::class);

        //  ProductRepositoryInterface
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ProductService::class);

          //PurchaseRepository
          $this->app->bind(PurchaseRepositoryInterface::class, PurchaseRepository::class);
          $this->app->bind(PurchaseServiceInterface::class, PurchaseService::class);

          // AccountTypeRepositoryInterface
            $this->app->bind(AccountTypeRepositoryInterface::class, AccountTypeRepository::class);
            $this->app->bind(AccountTypeServiceInterface::class, AccountTypeService::class);

            // AnalyticsService
            $this->app->bind(AnalyticsService::class);

        // avater
        $this->app->singleton(AvatarService::class, function ($app) {
            return new AvatarService();

            // UserService
            $this->app->bind(UserRepository::class);
            $this->app->bind(UserService::class);

            // RolePermissionService'
            $this->app->bind(RolePermissionService::class);
            $this->app->bind(RoleRepository::class);


        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrapFive();

        // Server-side rendering only when the SSR server is actually up; an
        // unreachable one used to hold every page for seconds (see SsrProbe).
        $this->app->resolving(\Inertia\Ssr\HttpGateway::class, function ($gateway) {
            $gateway->disable(fn () => ! \App\Support\SsrProbe::reachable());
        });

        // Register the avatar directive
        Blade::directive('avatar', function ($expression) {
            // Extract the parameters from the expression
            [$image, $name] = explode(',', $expression);

            // Return avatar based on logic from AvatarService
            return "<?php echo app('App\Services\AvatarService')->getAvatar(trim($image), trim($name)); ?>";
        });





        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        try {
            $siteInfo       = SiteInfo::first();
            $colorsData     = [
                'main'          => $siteInfo->mainColor   ?? '#ffb700',
                'secondary'     => $siteInfo->secondColor ?? '#d89b02',
                'cart_bg'       => $siteInfo->cart_bg          ?? '#d89b02',
                'order_now_bg'  => $siteInfo->order_now_bg     ?? '#d89b02',
                'call_now_bg'   => $siteInfo->call_now_bg      ?? '#ff0000',
                'whatsapp_bg'   => $siteInfo->whatsapp_bg      ?? 'green',
            ];
            // Shared with the storefront only — the header dropdown and the
            // /categories page both read this. An unpublished category has no
            // business appearing in either, and the drag-order set in the admin
            // is what decides the sequence.
            $categoriesData = Category::where('status', 'Active')
                ->orderBy('serial')
                ->orderBy('name')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            $colorsData     = ['main' => '#ffb700', 'secondary' => '#d89b02', 'cart_bg' => '#d89b02', 'order_now_bg' => '#d89b02', 'call_now_bg' => '#ff0000', 'whatsapp_bg' => 'green'];
            $categoriesData = [];
        }

        $globalData = ['categories' => $categoriesData, 'colors' => $colorsData];

        Inertia::share('globalCategories', $globalData);
        View::share('globalCategories', $globalData);
    }
}
