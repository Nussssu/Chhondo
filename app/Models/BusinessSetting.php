<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessSetting extends Model
{
    protected $casts = [
        'values'=>'array',
        'is_active'=>'integer',
    ];

    protected $fillable = ['key_name', 'values', 'settings_type', 'is_active'];
}
