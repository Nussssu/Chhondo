<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'regular_user_min',
        'regular_user_max',
        'new_user_min',
        'new_user_max',
        'vip_user_min',
        'vip_user_max',
    ];
}
