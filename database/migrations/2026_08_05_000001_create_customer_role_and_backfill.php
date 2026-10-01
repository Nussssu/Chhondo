<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Introduces the `Customer` role and gives it to every existing account that has no
 * role at all.
 *
 * Storefront customers were never assigned a role, so before this ran the only thing
 * distinguishing them from staff was the legacy `users.role` column — which has no
 * migration of its own and therefore cannot be relied on. The admin gate
 * (EnsureUserCanAccessAdmin) keys off Spatie roles instead.
 *
 * The gate denies by default, so access control does not depend on this backfill
 * having run; the role exists so customers are explicitly labelled rather than
 * merely role-less.
 */
return new class extends Migration
{
    private const CUSTOMER_ROLE = 'Customer';

    public function up(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $role = Role::firstOrCreate(
            ['name' => self::CUSTOMER_ROLE, 'guard_name' => 'web'],
            ['group' => 'Customer']
        );

        // Only accounts with no role at all — never touch existing staff.
        $unassigned = DB::table('users')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('model_has_roles')
                    ->whereColumn('model_has_roles.model_id', 'users.id')
                    ->where('model_has_roles.model_type', User::class);
            })
            ->pluck('id');

        foreach ($unassigned->chunk(500) as $chunk) {
            DB::table('model_has_roles')->insertOrIgnore(
                $chunk->map(fn ($id) => [
                    'role_id' => $role->id,
                    'model_type' => User::class,
                    'model_id' => $id,
                ])->all()
            );
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        $role = Role::where('name', self::CUSTOMER_ROLE)->where('guard_name', 'web')->first();

        if ($role === null) {
            return;
        }

        DB::table('model_has_roles')->where('role_id', $role->id)->delete();
        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
