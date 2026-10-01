<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Every product is available; nothing is counted down.
 *
 * The catalogue was tracking quantity on all but one product, which is not how
 * this shop works — sarees are made to order rather than held as counted stock,
 * and the old way of saying "always available" was to type a large quantity
 * (rows still carry values like 9995). `instock` says it properly: the quantity
 * column stops meaning anything and nothing sells itself out.
 *
 * Quantities are left alone. They mean nothing under this status, and erasing
 * them would throw away numbers someone may still want to read.
 *
 * One-way on purpose: the statuses being replaced are not recorded anywhere, so
 * there is nothing for down() to put back.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')
            ->where(function ($query) {
                $query->where('stock_status', '!=', Product::STOCK_IN)
                    ->orWhereNull('stock_status');
            })
            ->update(['stock_status' => Product::STOCK_IN]);
    }

    public function down(): void
    {
        // Irreversible: see the note above.
    }
};
