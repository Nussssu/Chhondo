<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionalSms extends Model
{
    protected $fillable=['numbers','campaign_title','sms','status','category'];

    protected $casts=[
        'numbers'=>'array'
    ];
}
