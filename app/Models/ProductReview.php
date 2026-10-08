<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'contact',
        'rating',
        'review',
        'images',
        'is_active',
        'is_featured',
        'admin_reply',
    ];

    protected $casts = [
        'images'    => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating'    => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
