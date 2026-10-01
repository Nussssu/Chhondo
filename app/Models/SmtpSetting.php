<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SmtpSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'email_from', 'email_from_name', 'contact_email', 'admin_email',
        'use_smtp', 'smtp_host', 'smtp_port', 'smtp_encryption', 'smtp_username', 'smtp_password',
    ];

    protected $casts = ['use_smtp' => 'boolean'];

    /** Never send the mail server password to the browser or an API response. */
    protected $hidden = ['smtp_password'];
}
