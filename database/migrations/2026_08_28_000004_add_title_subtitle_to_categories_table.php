<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The heading and the line under it on a category page.
 *
 * Both were built in the Vue component: the heading from a fixed
 * "আমাদের সব {name}" template, and the description as one hardcoded sentence
 * shown identically on every category. Editing them belongs in the admin.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'title')) {
                $table->string('title')->nullable()->after('name');
            }

            if (! Schema::hasColumn('categories', 'subtitle')) {
                $table->text('subtitle')->nullable()->after('title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle']);
        });
    }
};
