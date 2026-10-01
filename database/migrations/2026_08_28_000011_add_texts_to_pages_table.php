<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The wording a page shows outside its body copy.
 *
 * Section headings, button labels, empty states and the like were written into
 * the Vue components, so they could not be changed from the admin. They live
 * here as a key/value map rather than a column each: the set differs per page
 * and grows whenever a page does.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (! Schema::hasColumn('pages', 'texts')) {
                $table->json('texts')->nullable()->after('subtitle');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('texts');
        });
    }
};
