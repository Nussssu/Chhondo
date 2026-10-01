<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The heading and the line under it on the home page's reviews section.
 *
 * The section is a designed component with its own slider and cards, so it
 * stays a component rather than becoming a page widget; only its two strings
 * become editable, under Content > Pages > Home.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            if (! Schema::hasColumn('site_infos', 'reviews_title')) {
                $table->string('reviews_title')->nullable();
            }

            if (! Schema::hasColumn('site_infos', 'reviews_subtitle')) {
                $table->string('reviews_subtitle', 500)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->dropColumn(['reviews_title', 'reviews_subtitle']);
        });
    }
};
