<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'expiry_date',
        'discount',
        'code',
    ];

    protected $casts=[
        'start_date'=>'datetime',
        'expiry_date'=>'datetime',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_campaign', 'campaign_id', 'product_id');
    }

    public function productCampaigns()
    {
        return $this->hasMany(ProductCampaign::class, 'campaign_id', 'id');
    }
    // In Campaign.php
    public function product()
    {
        return $this->belongsToMany(Product::class, 'product_campaign');
    }
}
