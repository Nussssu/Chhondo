<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Which categories a "categories dropdown" menu item lists.
 *
 * The dropdown used to show every category in the shop with no way to narrow
 * it. Null or an empty list keeps that behaviour, so existing menus are
 * unchanged until someone picks a selection.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            if (! Schema::hasColumn('menu_items', 'category_ids')) {
                $table->json('category_ids')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('category_ids');
        });
    }
};
