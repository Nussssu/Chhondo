<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * How much money actually arrived for an order.
 *
 * OrderService has always computed this and handed it to Order::create(), but
 * there was no column and no fillable entry, so it was silently dropped. An
 * online gateway needs it for reconciliation, so the column now exists.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'paid_amount')) {
                $table->decimal('paid_amount', 12, 2)->default(0)->after('payment_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('paid_amount');
        });
    }
};
