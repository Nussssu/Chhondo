<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Roles that exist in production. Admin, Agent and Sales Man are the staff roles
     * admitted to the admin panel (see EnsureUserCanAccessAdmin::PANEL_ROLES);
     * Customer is what storefront accounts get.
     */
    private const ROLES = ['Admin', 'Agent', 'Sales Man', User::ROLE_CUSTOMER];

    public function run(): void
    {
        foreach (self::ROLES as $name) {
            Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $adminRole = Role::where('name', 'Admin')->firstOrFail();
        $adminRole->syncPermissions(Permission::all());

        $this->createAdminUser($adminRole);
        $this->createWalkInCustomer();
    }

    /**
     * The first admin account.
     *
     * The password is generated, not hardcoded. This seeder previously created
     * admin@test.com with the password "1234", so every freshly provisioned
     * environment shipped with a known-credential administrator.
     */
    private function createAdminUser(Role $adminRole): void
    {
        $email = (string) env('SEED_ADMIN_EMAIL', 'admin@charukothon.local');

        if (User::where('email', $email)->exists()) {
            $this->command?->info("Admin user {$email} already exists — left untouched.");

            return;
        }

        $password = (string) env('SEED_ADMIN_PASSWORD', Str::password(20));

        $admin = User::create([
            'name' => 'Administrator',
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        $admin->assignRole($adminRole);

        $this->command?->warn("Admin user created: {$email}");
        $this->command?->warn("Password: {$password}");
        $this->command?->warn('Store this now — it is not written to the log and cannot be recovered.');
    }

    /**
     * The placeholder customer POS attaches walk-in sales to.
     * POSController looks this account up by email and by role='user'.
     */
    private function createWalkInCustomer(): void
    {
        if (User::where('email', 'walking@user.com')->exists()) {
            return;
        }

        $walkIn = User::create([
            'name' => 'walking customer',
            'email' => 'walking@user.com',
            'password' => Hash::make(Str::password(20)),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        // Was assignRole('user') — lowercase, which Spatie does not match, so this
        // threw RoleDoesNotExist once the users.role failure was out of the way.
        $walkIn->assignRole(User::ROLE_CUSTOMER);
    }
}
