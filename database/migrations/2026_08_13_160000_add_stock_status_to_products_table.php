<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Products could only express availability through a quantity, so staff typed
 * nonsense figures (49999991, 39999873) to mean "always available". This adds
 * the WooCommerce-style choice: In stock / Out of stock / track a quantity.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // instock | outofstock | manage
            $table->string('stock_status', 20)->default('manage')->after('quantity')->index();
        });

        // A quantity nobody could plausibly hold was a stand-in for "in stock".
        DB::table('products')->where('quantity', '>=', 1000)->update(['stock_status' => 'instock']);
        DB::table('products')->where('quantity', '<=', 0)->update(['stock_status' => 'outofstock']);

        // Stock replenished from purchase records is genuinely counted, so it
        // keeps tracking its quantity whatever that quantity happens to be.
        DB::table('products')->where('stock_option', 'From Purchase')->update(['stock_status' => 'manage']);
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['stock_status']);
            $table->dropColumn('stock_status');
        });
    }
};
