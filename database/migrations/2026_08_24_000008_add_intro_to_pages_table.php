<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Every storefront page opens with a title and a line under it. Both were
 * written into the Vue components; now they live with the page.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('title')->nullable()->after('type');
            $table->text('subtitle')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle']);
        });
    }
};
