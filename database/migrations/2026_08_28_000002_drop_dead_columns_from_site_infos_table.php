<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Settings the admin collected and nothing ever read.
 *
 *  store_phone_number     duplicate of phone_number, which is what the footer
 *                         reads; editing it changed nothing
 *  home_page_title        offered on the Home page editor, read nowhere
 *  product_page_title     offered on the Shop page editor, read nowhere
 *  attention_notice       no reference anywhere in the codebase
 *  enable_facebook_login  written on save, never read — there is no social
 *  enable_google_login    login implemented (no Socialite, no routes)
 */
return new class extends Migration
{
    private const DEAD = [
        'store_phone_number',
        'home_page_title',
        'product_page_title',
        'attention_notice',
        'enable_facebook_login',
        'enable_google_login',
    ];

    public function up(): void
    {
        $drop = array_values(array_filter(
            self::DEAD,
            fn ($column) => Schema::hasColumn('site_infos', $column)
        ));

        if ($drop === []) {
            return;
        }

        Schema::table('site_infos', function (Blueprint $table) use ($drop) {
            $table->dropColumn($drop);
        });
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->string('store_phone_number')->nullable();
            $table->string('home_page_title')->nullable();
            $table->string('product_page_title')->nullable();
            $table->string('attention_notice')->nullable();
            $table->boolean('enable_facebook_login')->default(false);
            $table->boolean('enable_google_login')->default(false);
        });
    }
};
