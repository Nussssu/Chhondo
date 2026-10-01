<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Turns marketing_tools into an Elementor-style custom code store: every row is
 * a titled snippet with a target (which pages) and a location (head, body start,
 * body end).
 *
 * Existing rows are preserved. Each keeps its `script` as a head snippet targeted
 * at the whole site, and any `second_script` (the GTM <noscript>) is split out
 * into its own body-start row so nothing that was live stops being live.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_tools', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->string('location')->default('head')->after('identifier');
            $table->string('target')->default('entire_site')->after('location');
            $table->text('target_urls')->nullable()->after('target');
            $table->boolean('is_active')->default(true)->after('second_script');
            $table->unsignedInteger('priority')->default(10)->after('is_active');
        });

        // Backfill the new columns from what is already there.
        DB::table('marketing_tools')->update([
            'location'  => 'head',
            'target'    => 'entire_site',
            'is_active' => 1,
            'priority'  => 10,
        ]);

        DB::table('marketing_tools')->whereNull('title')->update([
            'title' => DB::raw('name'),
        ]);

        // Promote every second_script (GTM noscript) to its own body-start row.
        $withSecond = DB::table('marketing_tools')
            ->whereNotNull('second_script')
            ->where('second_script', '!=', '')
            ->get();

        foreach ($withSecond as $tool) {
            DB::table('marketing_tools')->insert([
                'title'         => trim(($tool->title ?: $tool->name) . ' (body)'),
                'name'          => $tool->name,
                'identifier'    => $tool->identifier,
                'location'      => 'body_start',
                'target'        => 'entire_site',
                'target_urls'   => null,
                'script'        => $tool->second_script,
                'second_script' => null,
                'is_active'     => 1,
                'priority'      => 10,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }

        // The originals keep their head script; second_script is now redundant
        // but the column stays so the old data is never destroyed.
    }

    public function down(): void
    {
        Schema::table('marketing_tools', function (Blueprint $table) {
            $table->dropColumn(['title', 'location', 'target', 'target_urls', 'is_active', 'priority']);
        });
    }
};
