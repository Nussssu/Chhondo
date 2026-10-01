<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Purchase extends Model
{
    //
    protected $fillable = [
        'purchase_name',
        'purchase_date',
        'invoice_number',
        'document',
        'comment',
        'supplier_id',
        'purchasing_price',
        'purchasing_paid',
        'purchasing_due',
        'status',
        'product_ids',
        'products_data'
    ];

    protected $casts = [
        'purchase_date'    => 'date',
        'purchasing_price' => 'decimal:2',
        'purchasing_paid'  => 'decimal:2',
        'purchasing_due'   => 'decimal:2',
        'product_ids'      => 'array',
        'products_data'=>'array'
    ];

    protected $table = 'purchases';

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function purchase_group()
    {
        return $this->hasMany(PurchaseGroup::class, 'purchase_id', 'id');
    }

    public function purchaseGroups()
    {
        return $this->hasMany(PurchaseGroup::class, 'purchase_id', 'id');
    }

    public function getProductsAttribute()
    {
        return Product::whereIn('id', $this->product_ids ?? [])->get();
    }

    // public function products(): BelongsToMany
    // {
    //     return $this->belongsToMany(Product::class, 'product_purchases')
    //         ->withPivot(['quantity', 'price', 'purchasing_price', 'attribute_id'])
    //         ->withTimestamps();
    // }

    public function productAttributes(): BelongsToMany
    {
        return $this->belongsToMany(ProductAttribute::class, 'product_attribute_purchases')
            ->withPivot(['quantity', 'price', 'purchasing_price'])
            ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'purchase_id', 'id');
    }
}
