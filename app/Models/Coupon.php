<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;



    protected $fillable = [
        'code',
        'discount_type',
        'discount_amount',
        'valid_from',
        'expiry_date',
        'usage_limit',
        'used_count'
    ];


    protected $casts = [
        'valid_from' => 'date',
        'expiry_date' => 'date',
        'discount_amount' => 'decimal:2',
        'used_count' => 'integer',
        'usage_limit' => 'integer',
    ];


    public function products()
    {
        return $this->belongsToMany(Product::class, 'coupon_product');
    }

    /**
     * Where the coupon stands today — the one rule the storefront check, the
     * order itself and the admin list all read, so they can never disagree.
     * Both dates are whole days: a coupon runs from the start of valid_from
     * to the end of expiry_date.
     */
    public function status(): string
    {
        $today = now()->toDateString();

        if ($this->valid_from && $this->valid_from->toDateString() > $today) {
            return 'scheduled';
        }
        if ($this->expiry_date && $this->expiry_date->toDateString() < $today) {
            return 'expired';
        }
        // A blank usage_limit means unlimited.
        if (! is_null($this->usage_limit) && $this->used_count >= $this->usage_limit) {
            return 'used_up';
        }

        return 'active';
    }

    public function isUsable(): bool
    {
        return $this->status() === 'active';
    }

    /** Find a coupon by what a shopper typed: surrounding spaces ignored. */
    public static function findByTypedCode(?string $code): ?self
    {
        $code = trim((string) $code);

        return $code === '' ? null : static::where('code', $code)->first();
    }
}
