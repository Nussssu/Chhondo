<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Product extends Model
{
    //
    protected $guarded = [];

    /** Availability and pricing are rules, not columns — see the accessors. */
    protected $appends = [
        'in_stock', 'is_preorder', 'purchasable',
        'has_discount', 'discount_amount', 'discounted_price',
        'blouse_price',
    ];

    /**
     * Always loaded so a discounted price appears on every surface without each
     * controller having to remember. It is also what keeps this off the N+1
     * path: the accessors read the loaded relation and never query per product.
     */
    protected $with = ['activeCoupons'];

    public const STOCK_IN = 'instock';
    public const STOCK_OUT = 'outofstock';
    public const STOCK_MANAGE = 'manage';

    /**
     * Orders are taken for stock that has not arrived yet.
     *
     * Distinct from STOCK_OUT, which the pre-order flow used to be inferred
     * from: that conflated "we will get this for you" with "you cannot have
     * this", so a genuinely unavailable product still offered a pre-order
     * button. Nothing is in stock under either status; only this one sells.
     */
    public const STOCK_PREORDER = 'preorder';

    /** Every stock status a product may be saved with. */
    public const STOCK_STATUSES = [self::STOCK_IN, self::STOCK_OUT, self::STOCK_MANAGE, self::STOCK_PREORDER];

    /** Statuses whose quantity column means nothing. */
    public const UNCOUNTED_STATUSES = [self::STOCK_IN, self::STOCK_OUT, self::STOCK_PREORDER];

    /**
     * Columns no storefront page renders, on any surface.
     *
     * Inertia serialises whole models into the HTML, so every column reaches
     * the browser as page source whether a component reads it or not. These
     * were all going out: `purchasing_price` is what the shop paid, which
     * together with `price` publishes the margin on every product to anyone
     * who opens View Source.
     *
     * Admin reads several of them, so this is applied per storefront payload
     * rather than as a model-wide $hidden.
     */
    public const INTERNAL_FIELDS = [
        'purchasing_price', 'purchase_id', 'sold_quantity',
        'search_key', 'stock_option', 'product_tag', 'note',
    ];

    /**
     * Additionally dropped from listings — a grid of cards, not one product.
     *
     * `description` is the product page's long HTML body and averages ~7.7KB
     * per product. Thirty-eight product objects on the home page carried
     * 294KB of it into the HTML, and nothing on that page can display it:
     * only ProductDetail.vue reads `description`, and the product page sends
     * its own product in full. The quick-preview modal reads
     * `short_description`, which is why that one stays.
     */
    public const LISTING_HIDDEN = ['description'];

    /**
     * Strip what the storefront never shows before handing a product to Inertia.
     *
     * @param bool $listing true for a card in a grid, false for the product page
     */
    public function hideInternalFields(bool $listing = false): static
    {
        return $this->makeHidden(array_merge(
            self::INTERNAL_FIELDS,
            $listing ? self::LISTING_HIDDEN : []
        ));
    }

    protected $casts = [
        'gallery_images' => 'array',
        'bullet_points' => 'array',
        'is_home'=>'boolean',
        'is_free_shipping'=>'boolean',
        'color_links'=>'array',
        'has_blouse_option' => 'boolean',
        'price_with_blouse' => 'decimal:2',
        'previous_price_with_blouse' => 'decimal:2',
    ];

    /**
     * Whether this product can be bought right now.
     *
     * Every surface — storefront cards, product page, POS — must agree, so the
     * rule lives here rather than being re-derived as `quantity > 0` in each.
     * Older rows have no stock_status and fall back to the quantity check.
     */
    /**
     * Coupons attached to this product that are usable today.
     *
     * A coupon linked to specific products acts as a price cut on those
     * products, so the storefront can show the reduced price directly.
     */
    public function activeCoupons()
    {
        return $this->belongsToMany(Coupon::class, 'coupon_product')
            ->where('expiry_date', '>=', now()->toDateString())
            ->whereColumn('used_count', '<', 'usage_limit');
    }

    /**
     * The best discount available on this product, in currency.
     *
     * Where several coupons apply, the customer gets the largest — stacking
     * them would be a surprise for both the shop and the shopper.
     */
    public function getDiscountAmountAttribute(): float
    {
        $price = (float) $this->price;

        if ($price <= 0 || ! $this->relationLoaded('activeCoupons')) {
            return 0.0;
        }

        $best = $this->activeCoupons->reduce(function ($carry, Coupon $coupon) use ($price) {
            $amount = $coupon->discount_type === 'percentage'
                ? $price * (float) $coupon->discount_amount / 100
                : (float) $coupon->discount_amount;

            return max($carry, $amount);
        }, 0.0);

        return round(min($best, $price), 2);
    }

    public function getDiscountedPriceAttribute(): float
    {
        return round(max(0, (float) $this->price - $this->discount_amount), 2);
    }

    public function getHasDiscountAttribute(): bool
    {
        return $this->discount_amount > 0;
    }

    /**
     * What the with-blouse option costs.
     *
     * The option carries a pair like the product itself: `price_with_blouse` is
     * the sale price and `previous_price_with_blouse` the one struck through.
     * The sale half is optional, so a blouse option priced only at its regular
     * price still sells — at that price, with nothing struck through. Every
     * surface asks this rather than reading a column, so the cart cannot charge
     * one figure while the product page shows another.
     */
    public function getBlousePriceAttribute(): float
    {
        $sale = (float) $this->price_with_blouse;

        if ($sale > 0) {
            return $sale;
        }

        return max(0, (float) $this->previous_price_with_blouse);
    }

    public function getInStockAttribute(): bool
    {
        return match ($this->stock_status) {
            self::STOCK_IN => true,
            // A pre-order has nothing on the shelf; it is sellable, not stocked.
            self::STOCK_OUT, self::STOCK_PREORDER => false,
            default => (int) $this->quantity > 0,
        };
    }

    /** Whether this product is taking pre-orders. */
    public function getIsPreorderAttribute(): bool
    {
        return $this->stock_status === self::STOCK_PREORDER;
    }

    /**
     * Whether an order may be placed for this product.
     *
     * This — not `in_stock` — is what the cart, the product page and checkout
     * validation ask: a pre-order is not in stock but is very much for sale,
     * and an out-of-stock product is neither.
     */
    public function getPurchasableAttribute(): bool
    {
        return $this->is_preorder || $this->in_stock;
    }

    /** Products a customer may order right now. */
    public function scopePurchasable($query)
    {
        return $query->where(function ($q) {
            $q->whereIn('stock_status', [self::STOCK_IN, self::STOCK_PREORDER])
                ->orWhere(function ($counted) {
                    $counted->where('stock_status', self::STOCK_MANAGE)->where('quantity', '>', 0);
                })
                // Rows written before stock_status existed are judged on quantity.
                ->orWhere(function ($legacy) {
                    $legacy->whereNull('stock_status')->where('quantity', '>', 0);
                });
        });
    }

    /**
     * Limit an update to products whose quantity is actually counted.
     *
     * Written as a scope so query-builder updates (which fire no model events)
     * simply match nothing for uncounted products, rather than needing a guard
     * at every call site.
     */
    public function scopeTracksStock($query)
    {
        return $query->whereNotIn('stock_status', self::UNCOUNTED_STATUSES);
    }

    /** True when the quantity field is meaningful for this product. */
    public function getTracksStockAttribute(): bool
    {
        return ! in_array($this->stock_status, self::UNCOUNTED_STATUSES, true);
    }

    public function getFeaturedImageAttribute($value)
    {
        return $this->toAbsoluteUrl($value);
    }

    public function getGalleryImagesAttribute($value)
    {
        $arr = is_string($value) ? json_decode($value, true) : $value;
        if (! is_array($arr)) {
            return $arr;
        }
        return array_map(fn ($v) => $this->toAbsoluteUrl($v), $arr);
    }

    private function toAbsoluteUrl($value)
    {
        if (! $value) {
            return null;
        }
        if (preg_match('#^https?://#i', $value)) {
            return '/' . ltrim(parse_url($value, PHP_URL_PATH), '/');
        }
        return '/' . ltrim($value, '/');
    }

    protected static function boot()
    {
        parent::boot();

        // The Banglish search key is derived from the name, so it is kept here
        // rather than at any one call site — the admin form, the POS and an
        // import all write products, and a product whose key went stale would
        // quietly stop being findable.
        static::saving(function (self $product) {
            if ($product->isDirty('product_name')) {
                $product->search_key = \App\Support\Banglish::indexKey((string) $product->product_name);
            }
        });

        // Invalidate cache when a product is created, updated, or deleted
        static::created(function () {
            Cache::forget('stock_report_page_1');
        });

        static::updated(function () {
            Cache::forget('stock_report_page_1'); // Invalidate cache for page 1
        });

        static::deleted(function () {
            Cache::forget('stock_report_page_1'); // Invalidate cache for page 1
        });

        // Also invalidate cache for any product attribute changes
        static::updated(function () {
            Cache::forget('stock_report_page_1');
        });
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'coupon_product');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'product_campaign', 'product_id', 'campaign_id');
    }

    public function product_campaign()
    {
        return $this->hasOne(ProductCampaign::class, 'product_id', 'id')->with('campaign');
    }

    public function product_attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'id');
    }
    public function product_attributes_combaine()
    {
        return $this->hasMany(ProductAttributeCombination::class, 'product_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    /**
     * Every category this product is filed under.
     *
     * `category` above is the primary one — the category the product page and
     * the POS name it by. This is the full membership, and it is what the shop
     * and category archives resolve against.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    /**
     * Normalise a submitted price pair into the shape it is stored in.
     *
     * The form asks the way a shop thinks: a price, and an optional sale price
     * under it. Storage is the other way round — `price` is always what the
     * customer is charged and `previous_price` exists only to be struck
     * through. So clearing the sale price has to promote the price beside it
     * rather than blank the column, which is NOT NULL and would take the
     * product down with it.
     *
     * @param  mixed  $regular  The "Price" box: the normal price.
     * @param  mixed  $sale     The "Sale Price" box, which may be empty.
     * @return array{0: float|null, 1: float|null}  [charged, struck through]
     */
    public static function resolvePricePair(mixed $regular, mixed $sale): array
    {
        $regular = is_numeric($regular) ? (float) $regular : null;
        $sale    = is_numeric($sale) ? (float) $sale : null;

        // Not on sale: the normal price is charged and nothing is struck.
        if ($sale === null) {
            return [$regular, null];
        }

        // A "was" that is not higher is not a saving, so it is not shown.
        if ($regular === null || $regular <= $sale) {
            return [$sale, null];
        }

        return [$sale, $regular];
    }

    /**
     * The categories a submitted product form is asking for, primary first.
     *
     * Read from the request data rather than each caller picking it apart, so
     * the create and update paths agree — and so a form that still posts only
     * `category_id` (the POS, an import) keeps working.
     *
     * @param  array<string, mixed>  $data
     * @return array<int, int>
     */
    public static function categoryIdsFrom(array $data): array
    {
        $ids = collect($data['category_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter();

        if ($ids->isEmpty() && ! empty($data['category_id'])) {
            $ids = collect([(int) $data['category_id']]);
        }

        return $ids->unique()->values()->all();
    }

    /**
     * File this product under the given categories, first one primary.
     *
     * Kept on the model because the create and update paths both write it, and
     * a product whose pivot and `category_id` disagree shows up in one archive
     * but is named by another.
     *
     * @param  array<int, mixed>  $categoryIds
     */
    public function syncCategories(array $categoryIds): void
    {
        $ids = collect($categoryIds)
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();

        // Nothing chosen means nothing to change: silently clearing a product's
        // categories would hide it from the storefront with no visible cause.
        if ($ids->isEmpty()) {
            return;
        }

        $this->categories()->sync($ids->all());

        if ((int) $this->category_id !== $ids->first()) {
            $this->forceFill(['category_id' => $ids->first()])->save();
        }
    }

    /**
     * Products filed under a category.
     *
     * `category_id` is checked alongside the pivot because it is written by
     * paths that predate the pivot — the legacy backup migrator and direct SQL
     * fixes — and a product missing its pivot row should still appear in the
     * category it names.
     */
    public function scopeInCategory($query, $categoryId)
    {
        return $this->scopeInCategories($query, [$categoryId]);
    }

    /** Products filed under any of the given categories. */
    public function scopeInCategories($query, array $categoryIds)
    {
        $ids = collect($categoryIds)->map(fn ($id) => (int) $id)->filter()->unique()->values()->all();

        if ($ids === []) {
            return $query;
        }

        return $query->where(function ($q) use ($ids) {
            $q->whereIn('category_id', $ids)
                ->orWhereHas('categories', fn ($c) => $c->whereIn('categories.id', $ids));
        });
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'id');
    }

    public function productCampaign()
    {
        return $this->hasOne(ProductCampaign::class, 'product_id', 'id'); // Change to 'productCampaign' here
    }

    public function options()
    {
        // return $this->hasMany(AttributeOption::class, 'attribute_id', 'attribute_id');
        return $this->hasMany(AttributeOption::class, 'attribute_id', 'id');
    }

    public function attributess()
    {
        return $this->hasMany(Attribute::class, 'product_id');
    }

    public function productCampaigns()
    {
        return $this->hasOne(ProductCampaign::class); // Correct relationship for product campaign
    }

    public function attributeOptions()
    {
        return $this->hasMany(AttributeOption::class);
    }

    public function productAttributes()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'id');
    }

    // In Product.php
    public function campaign()
    {
        return $this->belongsToMany(Campaign::class, 'product_campaign');
    }

    public function productOptions()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'id');
    }

    public function combinations()
    {
        return $this->hasMany(ProductAttributeCombination::class);
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function relatedProducts()
    {
        return $this->hasMany(Product::class, 'category_id', 'category_id')
            ->where('id', '!=', $this->id)->latest()
            ->limit(10);
    }

    /**
     * The categories this product is filed under, primary first.
     *
     * The order matters: the form writes the list back with the first entry as
     * the primary category, so a round trip through the edit screen must not
     * quietly re-elect a different one.
     *
     * @return array<int, int>
     */
    public function categoryIds(): array
    {
        $ids = $this->relationLoaded('categories')
            ? $this->categories->pluck('id')->all()
            : $this->categories()->pluck('categories.id')->all();

        $ids = array_map('intval', $ids);

        if ($this->category_id) {
            array_unshift($ids, (int) $this->category_id);
        }

        // array_unique keeps the first occurrence, which is the primary.
        return array_values(array_unique($ids));
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
