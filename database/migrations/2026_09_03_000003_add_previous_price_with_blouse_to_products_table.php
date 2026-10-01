<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The struck-through price for the with-blouse option.
 *
 * A saree already carries a pair: `previous_price` is what it used to cost and
 * `price` is what it costs now, and the product page strikes the first through.
 * The with-blouse option had only `price_with_blouse`, so choosing it showed a
 * new price beside a "was" figure belonging to the without-blouse variant.
 * This is the other half of that pair.
 *
 * Nullable: a with-blouse option that is not on sale simply has no "was".
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'previous_price_with_blouse')) {
            Schema::table('products', function (Blueprint $table) {
                $table->decimal('previous_price_with_blouse', 10, 2)
                    ->nullable()
                    ->after('price_with_blouse');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'previous_price_with_blouse')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('previous_price_with_blouse');
            });
        }
    }
};
