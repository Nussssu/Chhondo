<?php

use App\Support\Banglish;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A phonetic key beside every product name, so Banglish finds Bangla products.
 *
 * Names are stored in Bangla — "শাড়ি" — but shoppers type the sound of the word
 * on a Latin keyboard, spelled however they please. App\Support\Banglish folds
 * both to the same key; this is where the product's half of that is kept.
 *
 * Deliberately not indexed: every search is LIKE '%…%', which no B-tree index
 * can serve, so an index would cost writes and buy nothing.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'search_key')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('search_key', 512)->nullable()->after('product_name');
            });
        }

        // Backfill what is already in the catalogue; without this, search only
        // finds products saved after the deploy.
        DB::table('products')
            ->select('id', 'product_name')
            ->orderBy('id')
            ->chunk(200, function ($products) {
                foreach ($products as $product) {
                    DB::table('products')
                        ->where('id', $product->id)
                        ->update(['search_key' => Banglish::indexKey((string) $product->product_name)]);
                }
            });
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'search_key')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('search_key');
            });
        }
    }
};
