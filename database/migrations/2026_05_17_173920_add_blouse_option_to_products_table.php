<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('has_blouse_option')->default(false)->after('previous_price');
            $table->decimal('price_with_blouse', 10, 2)->nullable()->after('has_blouse_option');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['has_blouse_option', 'price_with_blouse']);
        });
    }
};
