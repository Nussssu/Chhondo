<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pages the operator creates, alongside the fixed storefront pages.
 *
 * A custom page is an ordinary `pages` row with `is_custom` set and a `slug`,
 * which is the address it answers on (/{slug}). It reuses the same widget
 * editor and renderer as the fixed pages, so nothing else has to know the
 * difference; `type` stays the primary key the editor routes on, and for a
 * custom page it is a generated "custom-…" value that never changes, so
 * renaming the slug cannot break the admin URLs.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (! Schema::hasColumn('pages', 'slug')) {
                $table->string('slug')->nullable()->unique()->after('type');
            }

            if (! Schema::hasColumn('pages', 'is_custom')) {
                $table->boolean('is_custom')->default(false)->after('slug');
            }

            if (! Schema::hasColumn('pages', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('subtitle');
            }

            if (! Schema::hasColumn('pages', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropUnique('pages_slug_unique');
            $table->dropColumn(['slug', 'is_custom', 'meta_title', 'meta_description']);
        });
    }
};
