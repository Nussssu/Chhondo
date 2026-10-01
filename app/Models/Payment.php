<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'purchase_id',
        'payment_amount',
        'payment_method',
        'payment_date',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}
