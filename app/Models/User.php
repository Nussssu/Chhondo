<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /** Role given to storefront customers. Carries no admin-panel access. */
    public const ROLE_CUSTOMER = 'Customer';

    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'phone',
        'date_of_birth',
        'ip_address',
        'is_block',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_block'          => 'boolean',
            'date_of_birth'     => 'date',
        ];
    }

    /**
     * Label this account as a storefront customer.
     *
     * Called from every self-service registration path. Uses firstOrCreate so a
     * database that has not yet run the Customer-role migration cannot make
     * registration fail with RoleDoesNotExist.
     */
    public function assignCustomerRole(): void
    {
        if ($this->roles()->exists()) {
            return;
        }

        $role = \Spatie\Permission\Models\Role::firstOrCreate(
            ['name' => self::ROLE_CUSTOMER, 'guard_name' => 'web']
        );

        $this->assignRole($role);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function address()
    {
        return $this->belongsTo(UserAddress::class, 'id', 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_identifier', 'id');
    }

    public function myOrder()
    {
        return $this->hasMany(Order::class, 'author_id');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Send the reset link as one of the shop's own templates, so it carries the
     * same branding and wording as every other email and can be edited under
     * Store settings › Email rather than in code.
     */
    public function sendPasswordResetNotification($token): void
    {
        app(\App\Services\Mail\PasswordResetMailNotifier::class)->send($this, $token);
    }
}
