<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The small line above a page's heading.
 *
 * The blog page shows one ("চারুকথন ব্লগ") which was written into the Vue
 * component, so it could not be changed from the admin like the heading and
 * the line under it can.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (! Schema::hasColumn('pages', 'label')) {
                $table->string('label')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('label');
        });
    }
};
