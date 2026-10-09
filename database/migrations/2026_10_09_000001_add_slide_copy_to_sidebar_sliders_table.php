<?php

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sidebar_sliders', function (Blueprint $table) {
            $table->text('heading')->nullable();
            $table->string('subtext', 255)->nullable();
            $table->string('cta_label', 150)->nullable();
            $table->string('cta_url', 500)->nullable();
            $table->boolean('show_subtext')->default(true);
            $table->boolean('show_cta')->default(true);
        });

        // Existing slides already showed this shared copy. Preserve it once,
        // then let each banner be edited independently.
        $texts = Page::textsFor('home');
        DB::table('sidebar_sliders')->update([
            'heading' => $texts['hero_title'] ?? '',
            'subtext' => $texts['hero_eyebrow'] ?? '',
            'cta_label' => $texts['hero_cta_label'] ?? '',
            'cta_url' => $texts['hero_cta_url'] ?? '/shop',
            'show_subtext' => ! in_array($texts['hero_eyebrow_show'] ?? '1', ['0', 0, false], true),
            'show_cta' => ! in_array($texts['hero_cta_show'] ?? '1', ['0', 0, false], true),
        ]);
    }

    public function down(): void
    {
        Schema::table('sidebar_sliders', fn (Blueprint $table) => $table->dropColumn(['heading', 'subtext', 'cta_label', 'cta_url', 'show_subtext', 'show_cta']));
    }
};
