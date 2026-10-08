<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Page;
use App\Models\Product;
use App\Models\SidebarSlider;
use App\Models\SiteInfo;
use App\Models\UserAddress;
use Inertia\Inertia;
use Propaganistas\LaravelPhone\Rules\Phone as PhoneRule;

class PageController extends Controller
{
    public function home()
    {
        // hideInternalFields() drops what a card cannot draw before Inertia
        // inlines these into the page HTML — see Product::LISTING_HIDDEN.
        $products = Product::where('status', 'Published')
            ->where('is_home', 1)
            ->with(['category', 'campaigns'])
            ->latest()
            ->take(20)
            ->get()
            ->each(fn (Product $product) => $product->hideInternalFields(listing: true));

        $featureProducts = Product::where('status', 'Published')
            ->where('feature', 1)
            ->with(['category', 'campaigns'])
            ->take(10)
            ->get()
            ->each(fn (Product $product) => $product->hideInternalFields(listing: true));

        $categories = Category::where('status', 'Active')
            ->get();

        // The home carousel: switched-on banners, in the admin's order.
        $sliders = SidebarSlider::where('is_active', true)->ordered()->get();

        $campaigns = Campaign::with('products')->get();

        $reviews = $this->authReviews();

        return Inertia::render('Public/Home', array_merge(
            compact('products', 'featureProducts', 'categories', 'sliders', 'campaigns', 'reviews'),
            ['blocks' => $this->pageBlocks('home'), 'intro' => $this->pageIntro('home'), 'texts' => $this->pageTexts('home')]
        ));
    }

    public function singleProduct($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'Published')
            ->with(['category', 'categories:id,name,slug', 'productAttributes.attributeOptions', 'campaigns'])
            ->first();

        if (! $product) {
            return Inertia::render('Public/Error/NotFound', ['texts' => $this->pageTexts('not_found')]);
        }

        // Related by any shared category, not only the primary one: a product
        // filed in both "Saree" and "Eid Collection" is related to both shelves.
        $relatedProducts = Product::inCategories($product->categoryIds())
            ->where('id', '!=', $product->id)
            ->where('status', 'Published')
            ->with(['campaigns'])
            ->take(8)
            ->get();

        return Inertia::render('Public/Product/Show', [
            // The product page is the one surface that renders `description`,
            // so only the internal columns come off it.
            'product'          => $product->hideInternalFields(),
            'related_products' => $relatedProducts
                ->each(fn (Product $related) => $related->hideInternalFields(listing: true)),
            // The Call and WhatsApp buttons on the product page. They read the
            // store's numbers (Settings › Manage site); this was an empty array,
            // so both buttons linked to "undefined". wa.me wants digits only.
            'otherInfo'        => ($site = SiteInfo::first()) ? [
                'phone_number'    => $site->phone_number,
                'whatsapp_number' => preg_replace('/\D+/', '', (string) $site->whatsapp_number),
            ] : [],
            'reviews'          => $this->productReviews($product),
        ]);
    }

    /**
     * Approved reviews customers submitted for this product. Pending ones
     * (is_active = false) stay hidden until an admin activates them.
     */
    private function productReviews(Product $product): array
    {
        return \App\Models\ProductReview::where('product_id', $product->id)
            ->where('is_active', true)
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'name'   => $r->name,
                'city'   => null,
                'rating' => (int) $r->rating,
                'review' => $r->review,
                'images' => array_values($r->images ?? []),
                'image'  => null,
            ])
            ->all();
    }

    public function categoryByProductPage(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)->first();

        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(1, min($perPage, 60));
        $page    = (int) $request->query('page', 1);

        if ($category) {
            $query = Product::with([
                'category',
                'product_campaign.campaign',
                'product_attributes.attribute',
                'product_attributes.attribute_option',
                'product_attributes_combaine',
            ])
                ->where('status', 'Published')
                ->inCategory($category->id);

            $this->applyArchiveFilters($query, $request);

            $paginator = $query->paginate($perPage, ['*'], 'page', $page);

            $products     = collect($paginator->items())
                ->each(fn (Product $product) => $product->hideInternalFields(listing: true))
                ->all();
            $categoryName = $category->name;
            $lastPage     = $paginator->lastPage();
            $total        = $paginator->total();
            $currentPage  = $paginator->currentPage();
        } else {
            $products     = [];
            $categoryName = '';
            $lastPage     = 1;
            $total        = 0;
            $currentPage  = 1;
        }

        return Inertia::render('Public/Product/CategoryByProduct', array_merge([
            'slug'              => $slug,
            'products'          => $products,
            'categoryName'      => $categoryName,
            // Edited per category in the admin; blank means the storefront
            // falls back to its own generated wording.
            'categoryTitle'     => $category?->title,
            'categorySubtitle'  => $category?->subtitle,
            // The shop's wording (breadcrumb, heading pattern, subtitle) is
            // shared by every category page.
            'texts'             => $this->pageTexts('shop'),
            'intro'             => $this->pageIntro('shop'),
            'activeCategoryId'  => $category?->id,
            'lastPage'          => $lastPage,
            'total'             => $total,
            'currentPage'       => $currentPage,
            'filters'           => $request->only(['min_price', 'max_price', 'sort', 'attributes']),
        ], $this->archiveFilterData($category?->id)));
    }

    public function shop(Request $request)
    {
        // Build the filtered products server-side so Shop.vue can use Inertia props
        $query = Product::with(['category', 'product_campaign.campaign', 'product_attributes.attribute', 'product_attributes.attribute_option', 'product_attributes_combaine'])
            ->where('status', 'Published');

        if ($request->filled('category_id')) {
            $query->inCategory($request->category_id);
        }
        if ($request->filled('name')) {
            // Matches the header search: the typed name may be Bangla or the
            // Banglish spelling of it, and both fold to the same key.
            $key = \App\Support\Banglish::key((string) $request->name);

            $query->where(function ($q) use ($request, $key) {
                $q->where('product_name', 'LIKE', '%' . $request->name . '%');

                if (mb_strlen($key) >= 2) {
                    $q->orWhere('search_key', 'LIKE', '%' . $key . '%');
                }
            });
        }

        $this->applyArchiveFilters($query, $request);

        $perPage   = (int) $request->get('per_page', 12);
        $page      = (int) $request->get('page', 1);
        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Public/Product/Shop', array_merge([
            'products'    => collect($paginator->items())
                ->each(fn (Product $product) => $product->hideInternalFields(listing: true))
                ->all(),
            'currentPage' => $paginator->currentPage(),
            'lastPage'    => $paginator->lastPage(),
            'total'       => $paginator->total(),
            'filters'     => $request->only(['category_id', 'name', 'min_price', 'max_price', 'sort', 'attributes']),
            'blocks'      => $this->pageBlocks('shop'),
            'intro'       => $this->pageIntro('shop'),
            'texts'       => $this->pageTexts('shop'),
        ], $this->archiveFilterData($request->input('category_id'))));
    }

    /**
     * Apply the shared archive filters (price range, attribute options, sort)
     * onto a product query. Used by both the shop and category archives so
     * every archive page filters identically.
     */
    private function applyArchiveFilters($query, Request $request): void
    {
        if ($request->filled('min_price') && $request->filled('max_price')) {
            $query->whereBetween('price', [$request->min_price, $request->max_price]);
        } elseif ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        } elseif ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Attribute filter: { "Color": ["Red","Blue"], "Size": ["M"] }
        // AND across attribute groups, OR within a group.
        $attributes = $request->input('attributes', []);
        if (is_array($attributes)) {
            foreach ($attributes as $optionNames) {
                $optionNames = array_filter((array) $optionNames);
                if (empty($optionNames)) {
                    continue;
                }
                $query->whereHas('product_attributes.attribute_option', function ($q) use ($optionNames) {
                    $q->whereIn('name', $optionNames);
                });
            }
        }

        if ($request->filled('sort')) {
            if ($request->sort === 'low_to_high') {
                $query->orderBy('price', 'asc');
            } elseif ($request->sort === 'high_to_low') {
                $query->orderBy('price', 'desc');
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }
    }

    /**
     * Sidebar filter data shared by every archive page: the full active
     * category list and the attributes (with options) available among
     * published products, optionally scoped to a single category.
     */
    private function archiveFilterData($categoryId = null): array
    {
        // Ordered by `serial`, the sequence set by dragging the rows in the
        // category admin, so the filter reads in the order the shop intends.
        // A category may be live and still be kept out of this list.
        $categories = Category::where('status', 'Active')
            ->inFilter()
            ->orderBy('serial')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $attributes = Attribute::with('attribute_option')
            ->whereHas('productAttributes.product', function ($q) use ($categoryId) {
                $q->where('status', 'Published');
                if ($categoryId) {
                    $q->inCategory($categoryId);
                }
            })
            ->get()
            ->map(fn ($attr) => [
                'name'   => $attr->name,
                'values' => $attr->attribute_option->pluck('name')->unique()->values(),
            ])
            ->filter(fn ($attr) => $attr['values']->isNotEmpty())
            ->values();

        return [
            'filterCategories' => $categories,
            'filterAttributes' => $attributes,
        ];
    }

    public function categories()
    {
        return Inertia::render('Public/Categories', [
            'blocks' => $this->pageBlocks('categories'),
            'intro'  => $this->pageIntro('categories'),
            'texts'   => $this->pageTexts('categories'),
        ]);
    }

    /**
     * Blog index. Posts are paginated; a ?category= slug narrows the list.
     */
    public function blogIndex(Request $request)
    {
        $categories = \App\Models\BlogCategory::where('status', 'Enable')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $activeCategory = $request->query('category');

        $posts = \App\Models\Blog::published()
            ->with('blog_category:id,name,slug')
            ->when($activeCategory, function ($q) use ($activeCategory) {
                $q->whereHas('blog_category', fn ($c) => $c->where('slug', $activeCategory));
            })
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(9)
            ->withQueryString()
            ->through(fn ($post) => $this->blogCardPayload($post));

        return Inertia::render('Public/Blog/Index', [
            'posts'          => $posts,
            'categories'     => $categories,
            'activeCategory' => $activeCategory,
            'blocks'         => $this->pageBlocks('blog'),
            'intro'          => $this->pageIntro('blog'),
            'texts'   => $this->pageTexts('blog'),
        ]);
    }

    /**
     * A single post, plus a few more from the same category to read next.
     */
    public function blogShow(string $slug)
    {
        $post = \App\Models\Blog::published()
            ->with('blog_category:id,name,slug')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = \App\Models\Blog::published()
            ->with('blog_category:id,name,slug')
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->orderByDesc('published_at')
            ->take(6)
            ->get()
            ->map(fn ($p) => $this->blogCardPayload($p));

        // Fill the rail with the newest posts when the category is thin.
        if ($related->count() < 6) {
            $related = $related->concat(
                \App\Models\Blog::published()
                    ->with('blog_category:id,name,slug')
                    ->where('id', '!=', $post->id)
                    ->whereNotIn('id', $related->pluck('id'))
                    ->orderByDesc('published_at')
                    ->take(6 - $related->count())
                    ->get()
                    ->map(fn ($p) => $this->blogCardPayload($p))
            )->values();
        }

        return Inertia::render('Public/Blog/Show', [
            'post' => [
                'id'           => $post->id,
                'title'        => $post->title,
                'slug'         => $post->slug,
                'image'        => $post->image,
                'description'  => $post->description,
                'excerpt'      => $post->excerpt(),
                'tags'         => $post->tagList(),
                'category'     => $post->blog_category?->only(['id', 'name', 'slug']),
                'published_at' => optional($post->published_at ?? $post->created_at)->toIso8601String(),
                'meta_title'   => $post->meta_title,
                'meta_description' => $post->meta_description,
                'reading_time' => $this->readingTime($post->description),
            ],
            'related' => $related,
        ]);
    }

    /**
     * Widgets a page shows on the storefront, resolved for this request —
     * product sections carry the products they are pointed at.
     */
    /** The title and the line under it, as edited in Content › Pages. */
    private function pageIntro(string $type): array
    {
        $page = Page::where('type', $type)->first();

        return [
            'label'    => $page?->label,
            'title'    => $page?->title,
            'subtitle' => $page?->subtitle,
        ];
    }

    /**
     * The body copy for a page, honouring its visibility toggle.
     *
     * Only the contact page used to check `is_published`; everywhere else the
     * content was passed straight through, so switching a page to "Content
     * hidden" in the admin did nothing on the storefront.
     */
    /** The wording a page shows outside its body copy. */
    private function pageTexts(string $type): array
    {
        return Page::textsFor($type);
    }

    private function pageContent(string $type): string
    {
        $page = Page::where('type', $type)->first();

        if (! $page || ! $page->is_published) {
            return '';
        }

        // `content` is the baked HTML of a page's static widgets, and
        // PageBlocks renders those same widgets from `blocks`. A page holding
        // both would show everything twice, so once a page has widgets they
        // are the single source and the baked copy is not sent.
        if (is_array($page->blocks) && $page->blocks !== []) {
            return '';
        }

        return (string) $page->content;
    }

    private function pageBlocks(string $type): array
    {
        $page = Page::where('type', $type)->first();

        if (! $page || ! $page->is_published) {
            return [];
        }

        return app(\App\Services\Admin\Pages\PageBlockResolver::class)->resolve($page->blocks);
    }

    /** The shape the blog cards render from. */
    private function blogCardPayload($post): array
    {
        return [
            'id'           => $post->id,
            'title'        => $post->title,
            'slug'         => $post->slug,
            'image'        => $post->image,
            'excerpt'      => $post->excerpt(140),
            'category'     => $post->blog_category?->only(['id', 'name', 'slug']),
            'published_at' => optional($post->published_at ?? $post->created_at)->toIso8601String(),
            'reading_time' => $this->readingTime($post->description),
        ];
    }

    /** Minutes to read, at a deliberately gentle 180 words per minute. */
    private function readingTime(?string $html): int
    {
        $words = str_word_count(strip_tags((string) $html));

        // Bangla has no spaces-per-word parity with English; fall back to length.
        if ($words < 20) {
            $words = (int) ceil(mb_strlen(strip_tags((string) $html)) / 6);
        }

        return max(1, (int) ceil($words / 180));
    }

    public function cart()
    {
        return Inertia::render('Public/Cart/Index', [
            'blocks' => $this->pageBlocks('cart'),
            'intro'  => $this->pageIntro('cart'),
            'texts'   => $this->pageTexts('cart'),
        ]);
    }

    /**
     * What checkout can fill in for a signed-in customer.
     *
     * Null for guests, so the form behaves exactly as it always has for them.
     */
    private function checkoutPrefill(): ?array
    {
        $user = auth()->user();

        if (! $user) {
            return null;
        }

        $address = UserAddress::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->first();

        return [
            'name'    => $user->name,
            'email'   => $user->email,
            'phone'   => $user->phone,
            'address' => $address?->address,
            // Already 'inside' or 'outside', the same values checkout uses.
            'delivery_area' => $address?->city,
        ];
    }

    public function checkout()
    {
        return Inertia::render('Public/Checkout/Index', [
            'blocks' => $this->pageBlocks('checkout'),
            'intro'  => $this->pageIntro('checkout'),
            'texts'   => $this->pageTexts('checkout'),
            // Whether the online option is offered beside cash on delivery.
            'onlinePaymentAvailable' => app(\App\Services\Payment\SslCommerzService::class)->isEnabled(),
            'bkashPaymentAvailable'  => app(\App\Services\Payment\BkashService::class)->isEnabled(),
            // Prefill for a signed-in customer: their details, and the address
            // they marked primary on the profile page.
            'checkoutPrefill' => $this->checkoutPrefill(),
        ]);
    }

    public function trackOrder(Request $request)
    {
        return Inertia::render('Public/TrackOrder', [
            'orderData' => $this->resolveTrackedOrder($request),
            'invoice'   => $request->input('invoice', ''),
            'blocks'    => $this->pageBlocks('track_order'),
            'intro'     => $this->pageIntro('track_order'),
            'texts'   => $this->pageTexts('track_order'),
        ]);
    }

    public function accountTrackOrder(Request $request)
    {
        return Inertia::render('Public/Account/TrackOrder', [
            'orderData' => $this->resolveTrackedOrder($request),
            'invoice'   => $request->input('invoice', ''),
        ]);
    }

    private function resolveTrackedOrder(Request $request): ?Order
    {
        if (! $request->filled('invoice')) {
            return null;
        }

        // payment_summary rides along so the tracking pages word the payment
        // exactly as the invoice and email do.
        return Order::where('invoice_number', $request->invoice)
            ->with('items.product')
            ->first()
            ?->append('payment_summary');
    }

    public function orderSuccess($invoiceNumber)
    {
        // Loaded as `items`, not `orderItems`: both name the same table, but the
        // relation's name is what the payload is keyed by, and the success page
        // reads order.items. Under the old name the page saw no line items at
        // all — the confirmation could not list them and the GA4 purchase event
        // went out with an empty basket.
        $order = Order::where('invoice_number', $invoiceNumber)
            ->with(['items.product', 'items.options.attributeOption'])
            ->first();

        if (! $order) {
            abort(404, 'Order not found');
        }

        $siteInfo        = SiteInfo::first();
        // Was reading `checkout_message`, which is not a column — the message
        // written in the admin never reached the page.
        $checkoutMessage = $siteInfo->checkout_page_text ?? '';

        return Inertia::render('Public/Success', [
            'order'           => $order,
            // Priced once, on the server, by the same method the invoice and
            // the confirmation email use. The page used to add total_price and
            // delivery_charge together in the template, which knew nothing
            // about discounts and printed raw float arithmetic.
            'totals'          => $order->totals(),
            // Same wording as the invoice and the confirmation email.
            'paymentSummary'  => $order->payment_summary,
            'checkoutMessage' => $checkoutMessage,
            'blocks'          => $this->pageBlocks('order_success'),
            'intro'           => $this->pageIntro('order_success'),
            'texts'   => $this->pageTexts('order_success'),
        ]);
    }

    public function orderData($invoiceNumber)
    {
        $order = Order::where('invoice_number', $invoiceNumber)
            ->with('orderItems.product')
            ->first();

        if (! $order) {
            return response()->json(['success' => false]);
        }

        return response()->json([
            'success' => true,
            'data'    => ['order' => $order, 'checkoutMessage' => ''],
        ]);
    }

    public function register()
    {
        return Inertia::render('Public/Auth/Registration', [
            'blocks'  => $this->pageBlocks('auth'),
            'reviews' => $this->authReviews(),
            'texts'   => $this->pageTexts('auth'),
        ]);
    }

    public function login()
    {
        return Inertia::render('Public/Auth/Login', [
            'blocks'  => $this->pageBlocks('auth'),
            'reviews' => $this->authReviews(),
            'texts'   => $this->pageTexts('auth'),
            // Set by registration, and by anything else that hands the visitor
            // back to this page with something to say.
            'status'  => session('status'),
        ]);
    }

    /**
     * Customer reviews shown in the sliding panel on the auth pages.
     */
    private function authReviews(): array
    {
        return \App\Models\Review::where('is_active', true)
            ->orderBy('sort_order')
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'name'   => $r->name,
                'city'   => $r->city,
                'rating' => (int) $r->rating,
                'review' => $r->review,
                'image'  => $r->image
                    ? (str_starts_with($r->image, 'http') ? $r->image : '/' . ltrim($r->image, '/'))
                    : null,
            ])
            ->all();
    }

    public function account()
    {
        $user      = auth()->user();
        $addresses = UserAddress::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();
        $orders    = Order::where('user_identifier', $user->id)
            ->with('orderItems.product')
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'totalOrders'   => Order::where('user_identifier', $user->id)->count(),
            'wishlistItems' => \App\Models\Wishlist::where('user_id', $user->id)->count(),
            'savedAddresses' => $addresses->count(),
        ];

        return Inertia::render('Public/Account/Index', compact('addresses', 'orders', 'stats'));
    }

    public function userOrders()
    {
        $user   = auth()->user();
        $orders = Order::where('user_identifier', $user->id)
            ->with('items.product_info')
            ->latest()
            ->get();

        return Inertia::render('Public/Account/OrderList', compact('orders'));
    }

    public function userWishlist()
    {
        $user = auth()->user();

        $wishlist = \App\Models\Wishlist::with('product')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                $product = $item->product;

                return [
                    'id'      => $item->id,
                    'product' => $product ? [
                        'id'             => $product->id,
                        'product_name'   => $product->product_name,
                        'slug'           => $product->slug,
                        'price'          => $product->price,
                        'previous_price' => $product->previous_price,
                        'quantity'       => $product->quantity,
                        'featured_image' => $product->featured_image
                            ? (str_starts_with($product->featured_image, 'http')
                                ? $product->featured_image
                                : '/' . ltrim($product->featured_image, '/'))
                            : null,
                    ] : null,
                ];
            })
            ->filter(fn ($item) => $item['product'] !== null)
            ->values();

        return Inertia::render('Public/Account/Wishlist', compact('wishlist'));
    }

    public function about()
    {
        $page    = Page::where('type', 'about')->first();

        return Inertia::render('Public/About', [
            'content' => $this->pageContent('about'),
            'blocks'  => $this->pageBlocks('about'),
            'intro'   => $this->pageIntro('about'),
            'texts'   => $this->pageTexts('about'),
        ]);
    }

    public function privacy()
    {
        $page    = Page::where('type', 'policies')->first();

        return Inertia::render('Public/Privacy', [
            'content' => $this->pageContent('policies'),
            'blocks'  => $this->pageBlocks('policies'),
            'intro'   => $this->pageIntro('policies'),
            'texts'   => $this->pageTexts('policies'),
        ]);
    }

    public function refund()
    {
        $page    = Page::where('type', 'refund')->first();

        return Inertia::render('Public/Refund', [
            'content' => $this->pageContent('refund'),
            'blocks'  => $this->pageBlocks('refund'),
            'intro'   => $this->pageIntro('refund'),
            'texts'   => $this->pageTexts('refund'),
        ]);
    }

    public function shippingDelivery()
    {
        $page    = Page::where('type', 'shipping_delivery')->first();

        return Inertia::render('Public/shippingDelivery', [
            'content' => $this->pageContent('shipping_delivery'),
            'blocks'  => $this->pageBlocks('shipping_delivery'),
            'intro'   => $this->pageIntro('shipping_delivery'),
            'texts'   => $this->pageTexts('shipping_delivery'),
        ]);
    }

    public function terms()
    {
        $page    = Page::where('type', 'terms')->first();

        return Inertia::render('Public/Terms', [
            'content' => $this->pageContent('terms'),
            'blocks'  => $this->pageBlocks('terms'),
            'intro'   => $this->pageIntro('terms'),
            'texts'   => $this->pageTexts('terms'),
        ]);
    }

    /**
     * A page the operator created, served at its own slug.
     *
     * The route this reaches is registered last, so it only ever answers for
     * addresses no built-in route claimed; an unpublished or unknown slug is a
     * 404 rather than a blank page.
     */
    public function customPage(string $slug)
    {
        $page = Page::custom()->where('slug', $slug)->first();

        abort_if(! $page || ! $page->is_published, 404);

        return Inertia::render('Public/CustomPage', [
            'title'    => $page->title,
            'subtitle' => $page->subtitle,
            'label'    => $page->label,
            'metaTitle'       => $page->meta_title ?: $page->title,
            'metaDescription' => $page->meta_description,
            'content'  => $this->pageContent($page->type),
            'blocks'   => $this->pageBlocks($page->type),
        ]);
    }

    public function contactUs()
    {
        $page = Page::where('type', 'contact')->first();

        return Inertia::render('Public/ContactUs', [
            'content' => $this->pageContent('contact'),
            'blocks'  => $this->pageBlocks('contact'),
            'intro'   => $this->pageIntro('contact'),
            'texts'   => $this->pageTexts('contact'),
        ]);
    }

    public function contactSubmit(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            // Checked against the real numbering plan (libphonenumber), so a
            // string of eleven digits is no longer "a phone number".
            'phone'   => ['required', 'string', 'max:20', (new PhoneRule)->country(['BD'])->international()->mobile()],
            'message' => 'required|string|max:2000',
        ]);

        ContactMessage::create($validated);

        // Best-effort acknowledgement; the message is already saved, so a mail
        // problem must not tell the sender their message failed.
        app(\App\Services\Mail\OrderMailNotifier::class)->sendContactReceived(
            $validated['email'],
            $validated['name'],
            $validated['message'],
        );

        return back()->with('success', 'বার্তা সফলভাবে পাঠানো হয়েছে!');
    }

    public function blocked()
    {
        return Inertia::render('Public/Blocked');
    }

    public function notFound()
    {
        return Inertia::render('Public/Error/NotFound', [
            'texts' => $this->pageTexts('not_found'),
            'blocks' => $this->pageBlocks('not_found'),
        ])->toResponse(request())->setStatusCode(404);
    }
}
