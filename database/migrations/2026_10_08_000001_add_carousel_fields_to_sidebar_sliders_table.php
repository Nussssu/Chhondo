<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Home banner carousel: each banner gets a display order, an optional link
 * (and whether it opens in a new tab), alt text, and an on/off switch.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sidebar_sliders', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('mobile_image_path');
            $table->string('title', 150)->nullable()->after('sort_order');
            $table->string('link_url', 500)->nullable()->after('title');
            $table->boolean('link_new_tab')->default(false)->after('link_url');
            $table->boolean('is_active')->default(true)->after('link_new_tab');
        });

        // Keep today's order (newest first) as the starting sequence.
        $ids = DB::table('sidebar_sliders')->orderByDesc('id')->pluck('id');
        foreach ($ids as $i => $id) {
            DB::table('sidebar_sliders')->where('id', $id)->update(['sort_order' => $i + 1]);
        }
    }

    public function down(): void
    {
        Schema::table('sidebar_sliders', function (Blueprint $table) {
            $table->dropColumn(['sort_order', 'title', 'link_url', 'link_new_tab', 'is_active']);
        });
    }
};
