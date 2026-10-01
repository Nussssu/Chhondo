<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * The storefront's contact details get one home.
 *
 * Support hours only existed inside the unrouted "sales support" page, and the
 * map had nowhere to be configured at all, so both are added here — next to the
 * phone, email and address the footer already reads from.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            if (! Schema::hasColumn('site_infos', 'support_hours')) {
                $table->string('support_hours')->nullable()->after('store_email');
            }

            if (! Schema::hasColumn('site_infos', 'map_embed_url')) {
                $table->string('map_embed_url', 500)->nullable()->after('support_hours');
            }
        });

        // `store_phone_number` and `phone_number` held the same number edited on
        // two different screens; `phone_number` is what the footer reads, so it
        // becomes the canonical one and the other stops being offered.
        DB::table('site_infos')
            ->whereNull('phone_number')
            ->orWhere('phone_number', '')
            ->update(['phone_number' => DB::raw('store_phone_number')]);
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->dropColumn(['support_hours', 'map_embed_url']);
        });
    }
};
