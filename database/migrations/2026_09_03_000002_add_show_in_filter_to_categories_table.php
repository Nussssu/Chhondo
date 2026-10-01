<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Whether a category is offered in the storefront's archive filter.
 *
 * A category can be worth having — a staging shelf, a seasonal one that is out
 * of season, a parent that only exists to group its children — without being
 * worth a line in the shopper's filter list. Deactivating it was the only way
 * to take it out of that list before, which also removed its page.
 *
 * Defaults to true so every existing category keeps appearing exactly as it did.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('categories', 'show_in_filter')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->boolean('show_in_filter')->default(true)->after('status');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('categories', 'show_in_filter')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropColumn('show_in_filter');
            });
        }
    }
};
