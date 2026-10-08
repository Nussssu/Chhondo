<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Per-profile show/hide switches for Settings › Social links, so each
     * profile can be added to or removed from the storefront footer without
     * deleting its URL. Everything starts on, as it has always shown.
     */
    public function up(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->boolean('facebook_active')->default(true)->after('facebook_url');
            $table->boolean('tiktok_active')->default(true)->after('tiktok_url');
            $table->boolean('youtube_active')->default(true)->after('youtube_url');
            $table->boolean('instagram_active')->default(true)->after('instagram_url');
            $table->boolean('x_active')->default(true)->after('x_url');
        });
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->dropColumn(['facebook_active', 'tiktok_active', 'youtube_active', 'instagram_active', 'x_active']);
        });
    }
};
