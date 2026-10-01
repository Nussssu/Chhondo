<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteInfo extends Model
{
    protected $fillable = [
        'app_name',
        'phone_number',
        'whatsapp_number',
        'address',
        'store_gateway_image',
        'store_email',
        'support_hours',
        'map_embed_url',
        'facebook_url',
        'tiktok_url',
        'youtube_url',
        'instagram_url',
        'x_url',
        'shipping_charge_inside_dhaka',
        'shipping_charge_outside_dhaka',
        'free_shipping_enabled',
        'free_shipping_mode',
        'free_shipping_min_amount',
        'quantity_indicator',
        'checkout_page_text',
        'mainColor',
        'secondColor',
        'steadfast_webhook',
        'cart_bg',
        'order_now_bg',
        'call_now_bg',
        'whatsapp_bg',
        'footer_text',
        'reviews_title',
        'reviews_subtitle',
        'group_link',
        'maintenance_mode',
    ];

    protected $casts = [
        'steadfast_webhook' => 'boolean',
        'free_shipping_enabled' => 'boolean',
        'free_shipping_min_amount' => 'decimal:2',
        'maintenance_mode' => 'boolean',
    ];

    /** Cache key for the maintenance flag, read on every storefront request. */
    public const MAINTENANCE_CACHE_KEY = 'site_info_maintenance_mode';

    /**
     * Text columns that are NOT NULL (with no default) in the MySQL schema, yet
     * optional in the admin forms. A cleared box reaches the model as null —
     * Laravel converts empty strings — and MySQL refused the save with a 500.
     * They are stored as an empty string instead; every place that shows them
     * already treats an empty value as "not set".
     */
    private const REQUIRED_TEXT_COLUMNS = ['app_name', 'phone_number', 'whatsapp_number', 'footer_text'];

    /** Delivery is free on every order. */
    public const FREE_SHIPPING_ALL = 'all';

    /** Delivery is free once an order reaches free_shipping_min_amount. */
    public const FREE_SHIPPING_MINIMUM = 'minimum';

    public const FREE_SHIPPING_MODES = [self::FREE_SHIPPING_ALL, self::FREE_SHIPPING_MINIMUM];

    /**
     * Whether an order of this size ships free under the shop-wide rule.
     *
     * The rule lives here rather than at the checkout so the storefront quote
     * and the amount actually charged are the same decision — the two used to
     * be worked out separately, and disagreed.
     *
     * The per-product free-shipping flag is a separate reason an order may ship
     * free; this answers only for the shop-wide setting.
     *
     * @param  float  $subtotal  The order's goods total, before any coupon.
     */
    public function shipsFree(float $subtotal): bool
    {
        if (! $this->free_shipping_enabled) {
            return false;
        }

        if ($this->free_shipping_mode === self::FREE_SHIPPING_MINIMUM) {
            $minimum = (float) $this->free_shipping_min_amount;

            // A minimum of nothing is not a threshold anyone crossed; without a
            // figure the setting waives no fee rather than waiving every fee.
            return $minimum > 0 && $subtotal >= $minimum;
        }

        return true;
    }

    /**
     * Whether the storefront is closed for maintenance.
     *
     * Checked on every request, so it is cached; the `updated` hook below drops
     * the cache whenever the column changes. A missing row or column (before
     * the migration has run) reads as "open".
     */
    public static function maintenanceModeOn(): bool
    {
        $cached = Cache::get(self::MAINTENANCE_CACHE_KEY);

        if ($cached !== null) {
            return (bool) $cached;
        }

        try {
            $on = (bool) static::query()->value('maintenance_mode');
        } catch (\Throwable $e) {
            // Not cached, so the flag is picked up as soon as the column exists.
            return false;
        }

        Cache::forever(self::MAINTENANCE_CACHE_KEY, $on);

        return $on;
    }

    /**
     * The contact details, from the one row that owns them.
     *
     * Every storefront surface that shows a phone number, an email, an address
     * or opening hours reads this, so the values cannot drift between pages the
     * way the hardcoded copies used to.
     */
    public function contact(): array
    {
        return [
            'phone'     => $this->phone_number,
            'whatsapp'  => $this->whatsapp_number,
            'email'     => $this->store_email,
            'address'   => $this->address,
            'hours'     => $this->support_hours,
            'map'       => $this->mapEmbedUrl(),
            'facebook'  => $this->facebook_url,
            'instagram' => $this->instagram_url,
            'tiktok'    => $this->tiktok_url,
            'youtube'   => $this->youtube_url,
            'x'         => $this->x_url,
        ];
    }

    /**
     * The map to embed. A pasted embed URL wins; otherwise the address is looked
     * up directly, which needs no API key.
     */
    public function mapEmbedUrl(): ?string
    {
        if (filled($this->map_embed_url)) {
            return $this->map_embed_url;
        }

        return filled($this->address)
            ? 'https://www.google.com/maps?q=' . urlencode($this->address) . '&output=embed'
            : null;
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($siteInfo) {
            foreach (self::REQUIRED_TEXT_COLUMNS as $column) {
                $attributes = $siteInfo->getAttributes();

                // A first save may not mention these at all — e.g. switching on
                // maintenance mode before the store details were ever filled in.
                $missingOnCreate = ! $siteInfo->exists && ! array_key_exists($column, $attributes);

                if ($missingOnCreate || (array_key_exists($column, $attributes) && $attributes[$column] === null)) {
                    $siteInfo->setAttribute($column, '');
                }
            }
        });

        static::updated(function ($siteInfo) {
            foreach ($siteInfo->getDirty() as $column => $value) {
                Cache::forget("site_info_{$column}");
            }
        });
    }
}
