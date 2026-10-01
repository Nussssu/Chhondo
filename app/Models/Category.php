<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    
    //
    protected $guarded = [];

    protected $casts = [
        'show_in_filter' => 'boolean',
    ];

    /**
     * Categories the storefront offers in its archive filter.
     *
     * Separate from being Active: a category can have a live page and still be
     * deliberately left out of the shopper's filter list.
     */
    public function scopeInFilter($query)
    {
        return $query->where('show_in_filter', true);
    }


    /**
     * Every product filed under this category.
     *
     * A product belongs to several categories, so membership is the pivot
     * rather than the `products.category_id` column this used to read. That
     * column survives as the product's primary category — see
     * Product::syncCategories().
     */
    function products(){
        return $this->belongsToMany(Product::class, 'category_product');
    }

    /** Products whose primary category is this one. */
    public function primaryProducts()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('serial');
    }

    /** Top-level categories only. */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * This category and everything beneath it.
     *
     * Used to stop a category being moved under its own descendant, which would
     * detach that whole branch from the tree.
     *
     * @return array<int, int>
     */
    public function descendantIds(): array
    {
        $ids = [$this->id];

        foreach ($this->children as $child) {
            $ids = array_merge($ids, $child->descendantIds());
        }

        return $ids;
    }

    public function getImageAttribute($value)
    {
        if (! $value) {
            return null;
        }
        if (preg_match('#^https?://#i', $value)) {
            $value = parse_url($value, PHP_URL_PATH) ?? $value;
        }
        return '/' . ltrim($value, '/');
    }

    
}
