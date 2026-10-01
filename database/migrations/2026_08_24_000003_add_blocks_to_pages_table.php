<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pages are edited as a list of widgets (blocks) instead of one HTML blob.
 * `content` stays: the blocks are rendered into it on save, so the storefront
 * keeps reading exactly what it always has.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->longText('blocks')->nullable()->after('content');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('blocks');
        });
    }
};
