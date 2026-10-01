<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Whether SMTP is switched on, and where the shop's own copies go.
 *
 * "Use SMTP" was inferred from whether a host happened to be saved, so clearing
 * the host was the only way off it and a saved-but-unused server could not be
 * kept. `admin_email` is where the new-order notification is sent; it falls back
 * to `contact_email`, which is the address the shop already publishes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('smtp_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('smtp_settings', 'use_smtp')) {
                $table->boolean('use_smtp')->default(false)->after('contact_email');
            }

            if (! Schema::hasColumn('smtp_settings', 'admin_email')) {
                $table->string('admin_email')->nullable()->after('contact_email');
            }
        });

        // A shop that already saved a host was using it, so keep it switched on.
        \Illuminate\Support\Facades\DB::table('smtp_settings')
            ->whereNotNull('smtp_host')
            ->where('smtp_host', '!=', '')
            ->update(['use_smtp' => true]);
    }

    public function down(): void
    {
        Schema::table('smtp_settings', function (Blueprint $table) {
            $table->dropColumn(['use_smtp', 'admin_email']);
        });
    }
};
