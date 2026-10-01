<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A menu item can be a plain link or a dropdown that fills itself from the
 * product categories — the "Saree" dropdown the header used to hardcode.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('type')->default('link')->after('location');
        });

        // The categories dropdown was rendered before the menu; keep that order.
        DB::table('menu_items')->where('location', 'header')->increment('sort_order');

        DB::table('menu_items')->insert([
            'location'   => 'header',
            'type'       => 'categories',
            'parent_id'  => null,
            'label'      => 'Saree',
            'url'        => '/shop',
            'target'     => '_self',
            'sort_order' => 0,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
