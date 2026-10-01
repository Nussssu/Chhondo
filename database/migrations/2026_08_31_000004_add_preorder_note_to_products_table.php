<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pre-ordering becomes a stock status of its own.
 *
 * It used to be inferred from "out of stock", which meant a product that was
 * genuinely unavailable still offered a pre-order button and a product on
 * pre-order could not be told apart from one that had simply sold out. The
 * status itself needs no schema change — stock_status is a plain string — but
 * a pre-order needs somewhere to say when the item is expected.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'preorder_note')) {
                $table->string('preorder_note', 500)->nullable()->after('stock_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('preorder_note');
        });
    }
};
