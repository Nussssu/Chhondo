<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('media_library_items', function (Blueprint $table) {
            $table->string('kind', 20)->default('image')->after('path')->index();
        });

        // Existing rows predate video/document support, but a few were imported
        // from disk by media:import-existing and may not be images.
        DB::table('media_library_items')
            ->where('mime_type', 'like', 'video/%')
            ->update(['kind' => 'video']);

        DB::table('media_library_items')
            ->where('mime_type', 'like', 'application/%')
            ->update(['kind' => 'document']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_library_items', function (Blueprint $table) {
            $table->dropIndex(['kind']);
            $table->dropColumn('kind');
        });
    }
};
