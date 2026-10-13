<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['carts', 'order_items'] as $name) {
            Schema::table($name, fn (Blueprint $table) => $table->json('blouse_customization')->nullable()->after('blouse_choice'));
        }
    }

    public function down(): void
    {
        foreach (['carts', 'order_items'] as $name) {
            Schema::table($name, fn (Blueprint $table) => $table->dropColumn('blouse_customization'));
        }
    }
};
