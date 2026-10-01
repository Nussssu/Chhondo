<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Whether an order has actually been paid.
 *
 * `order_status` tracks fulfilment (pending, processed, delivered…) and cannot
 * also answer "did the money arrive", which an online gateway needs. Existing
 * orders were all cash on delivery, so they start unpaid.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status', 20)
                    ->default('unpaid')
                    ->after('payment_reference')
                    ->index();
            }
        });

        // Everything that already exists was placed as cash on delivery.
        DB::table('orders')->whereNull('payment_type')->update(['payment_type' => 'cod']);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['payment_status']);
            $table->dropColumn('payment_status');
        });
    }
};
