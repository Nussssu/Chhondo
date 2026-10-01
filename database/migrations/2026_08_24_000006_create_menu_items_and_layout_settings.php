<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Header menus and footer content become editable instead of living in the Vue
 * components. `menu_items` is a nestable menu (WordPress style); layout_settings
 * holds everything else the header and footer show.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('location')->default('header');   // header | mobile
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('label');
            $table->string('url');
            $table->string('target')->default('_self');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['location', 'parent_id', 'sort_order']);
        });

        Schema::create('layout_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();   // header | footer
            $table->longText('value')->nullable();
            $table->timestamps();
        });

        // Seed the header menu with what the component had hardcoded.
        $now = now();
        foreach ([
            ['Puja Collection', '/product-category/পূজা-কালেকশন'],
            ['Blog', '/blog'],
            ['Our Story', '/about-us'],
            ['Contact Us', '/contact-us'],
        ] as $i => [$label, $url]) {
            DB::table('menu_items')->insert([
                'location'   => 'header',
                'parent_id'  => null,
                'label'      => $label,
                'url'        => $url,
                'target'     => '_self',
                'sort_order' => $i,
                'is_active'  => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('layout_settings');
    }
};
