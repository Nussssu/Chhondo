<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Orders had no record of how they were paid. The POS needs it at the till,
     * and it is the only way to reconcile a day's takings afterwards.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // cod | cash | online
            $table->string('payment_type', 20)->nullable()->after('order_type')->index();
            // Only meaningful when payment_type is "online": bkash, nagad, …
            $table->string('payment_method', 40)->nullable()->after('payment_type');
            // Wallet transaction id, cheque number, last four digits — whatever
            // the operator needs to match this order to a payment later.
            $table->string('payment_reference', 100)->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['payment_type']);
            $table->dropColumn(['payment_type', 'payment_method', 'payment_reference']);
        });
    }
};
