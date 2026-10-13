<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Per-product Custom Blouse settings; null follows Products › Blouse options. */
    public function up(): void
    {
        Schema::table('products', fn (Blueprint $table) => $table->json('custom_blouse')->nullable()->after('previous_price_with_blouse'));
    }

    public function down(): void
    {
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn('custom_blouse'));
    }
};
