<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Shop-wide free delivery, on its own terms.
 *
 * Free shipping existed only as a per-product flag, which cannot express the
 * two things a shop actually wants to say: "delivery is free right now" and
 * "delivery is free once you spend enough". Both live here, beside the delivery
 * rates they waive.
 *
 * Off by default, so nothing about existing orders changes until it is turned on.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            if (! Schema::hasColumn('site_infos', 'free_shipping_enabled')) {
                $table->boolean('free_shipping_enabled')
                    ->default(false)
                    ->after('shipping_charge_outside_dhaka');
            }

            if (! Schema::hasColumn('site_infos', 'free_shipping_mode')) {
                // 'all' — every order ships free.
                // 'minimum' — free once the order reaches free_shipping_min_amount.
                $table->string('free_shipping_mode', 20)
                    ->default('all')
                    ->after('free_shipping_enabled');
            }

            if (! Schema::hasColumn('site_infos', 'free_shipping_min_amount')) {
                $table->decimal('free_shipping_min_amount', 10, 2)
                    ->nullable()
                    ->after('free_shipping_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            foreach (['free_shipping_enabled', 'free_shipping_mode', 'free_shipping_min_amount'] as $column) {
                if (Schema::hasColumn('site_infos', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
