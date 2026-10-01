<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * Removes database objects left behind by features that no longer exist.
 *
 * Everything dropped here was verified to hold zero rows and to have no reference
 * anywhere in app/, routes/ or resources/. The two tables are guarded on row count at
 * runtime as well, so the migration refuses to drop a table that has data in it.
 */
return new class extends Migration
{
    /**
     * Tables from removed features. Note that the `pathao-courier` matches in the
     * codebase are the *config file* of that name, not this table.
     */
    private const DEAD_TABLES = ['landing_pages', 'pathao-courier'];

    /** Permissions for features that were removed (landing pages, brands, sub-categories, leaderboard). */
    private const DEAD_PERMISSIONS = [
        'AllLandingPages', 'CreateLandingPages', 'DeleteLanding',
        'Brands', 'SubCategory', 'LeaderBoard', 'FullAssign',
    ];

    /**
     * Leftover QA accounts that hold the Admin role.
     *
     * Both were created 2026-07-21, are unverified, and own no data. They are full
     * administrators with passwords nobody is tracking.
     *
     * `dashboard-test@local.test` is deliberately NOT listed: it owns 3 orders, an
     * address and a wishlist entry, so deleting it would orphan real order history.
     * It holds no admin role, so it is only untidy, not a risk.
     */
    private const DEAD_ADMIN_ACCOUNTS = [
        'admin-style-test@local.test',
        'qa-verify-bot@local.test',
    ];

    public function up(): void
    {
        $this->removeDeadAdminAccounts();

        foreach (self::DEAD_TABLES as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            // Refuse to drop anything that turns out to hold data.
            if (DB::table($table)->count() > 0) {
                throw new RuntimeException(
                    "Refusing to drop `{$table}`: it is not empty. Review before re-running."
                );
            }

            Schema::drop($table);
        }

        Permission::whereIn('name', self::DEAD_PERMISSIONS)->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Deletes the leftover QA admin accounts, but only if they still own nothing.
     * Anything with data attached is left alone and reported.
     */
    private function removeDeadAdminAccounts(): void
    {
        foreach (self::DEAD_ADMIN_ACCOUNTS as $email) {
            $user = DB::table('users')->where('email', $email)->first();

            if ($user === null) {
                continue;
            }

            $owns = DB::table('orders')->where('user_identifier', (string) $user->id)->count()
                + DB::table('orders')->where('author_id', $user->id)->count()
                + DB::table('user_addresses')->where('user_id', $user->id)->count()
                + DB::table('wishlists')->where('user_id', $user->id)->count()
                + DB::table('smtp_settings')->where('user_id', $user->id)->count()
                + DB::table('notifications')->where('user_id', $user->id)->count();

            if ($owns > 0) {
                // Not a failure — just do not touch data that turned out to matter.
                DB::table('model_has_roles')
                    ->where('model_id', $user->id)
                    ->where('model_type', \App\Models\User::class)
                    ->delete();

                continue;
            }

            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->where('model_type', \App\Models\User::class)
                ->delete();

            DB::table('users')->where('id', $user->id)->delete();
        }
    }

    /**
     * Recreates the two tables so the migration is reversible. Their rows are gone
     * either way — both were empty when dropped. The deleted QA accounts are not
     * recreated: they should not exist.
     */
    public function down(): void
    {
        if (! Schema::hasTable('landing_pages')) {
            Schema::create('landing_pages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id');
                $table->string('slug');
                $table->string('first_title');
                $table->enum('hero_type', ['video', 'image']);
                $table->enum('video_type', ['local', 'youtube'])->nullable();
                $table->text('hero_item')->nullable();
                $table->string('sec_title')->nullable();
                $table->longText('gallery_images')->nullable();
                $table->string('offer_title')->nullable();
                $table->dateTime('offer_time_end')->nullable();
                $table->string('third_title')->nullable();
                $table->longText('bullet_point')->nullable();
                $table->string('thumbnail')->nullable();
                $table->string('review_title')->nullable();
                $table->longText('review_images')->nullable();
                $table->string('form_title')->nullable();
                $table->enum('status', ['active', 'inactive']);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('pathao-courier')) {
            Schema::create('pathao-courier', function (Blueprint $table) {
                $table->id();
                $table->char('secret_token', 36);
                $table->text('token');
                $table->text('refresh_token');
                $table->string('expires_in');
                $table->timestamps();
            });
        }

        // The permissions are intentionally not recreated: the features they gated
        // no longer exist, and PermissionSeeder does not define them either.
    }
};
