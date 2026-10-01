<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A product may be filed under several categories.
 *
 * `products.category_id` stays as the primary category — breadcrumbs, related
 * products and the POS all read it, and a saree that also belongs in "Eid
 * Collection" is still primarily a saree. This table carries the full
 * membership, which is what every archive and filter query resolves against.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('category_product')) {
            Schema::create('category_product', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->foreignId('category_id')->constrained()->onDelete('cascade');
                $table->timestamps();

                // A product is either in a category or it is not; a second row
                // would double it in every count and archive listing.
                $table->unique(['product_id', 'category_id']);
            });
        }

        // Without the backfill every existing product drops out of its own
        // category the moment the archives start reading the pivot.
        $existing = DB::table('category_product')->pluck('category_id', 'product_id');

        DB::table('products')
            ->select('id', 'category_id')
            ->whereNotNull('category_id')
            ->orderBy('id')
            ->chunk(500, function ($products) use ($existing) {
                $rows = [];

                foreach ($products as $product) {
                    if (isset($existing[$product->id])) {
                        continue;
                    }

                    $rows[] = [
                        'product_id'  => $product->id,
                        'category_id' => $product->category_id,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ];
                }

                if ($rows !== []) {
                    // Categories deleted without their products being re-filed
                    // would fail the foreign key, so orphans are skipped.
                    $categoryIds = DB::table('categories')
                        ->whereIn('id', array_column($rows, 'category_id'))
                        ->pluck('id')
                        ->all();

                    $rows = array_values(array_filter(
                        $rows,
                        fn ($row) => in_array($row['category_id'], $categoryIds)
                    ));

                    if ($rows !== []) {
                        DB::table('category_product')->insert($rows);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_product');
    }
};
