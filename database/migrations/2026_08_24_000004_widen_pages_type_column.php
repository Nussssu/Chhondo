<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `type` was an enum of the six original static pages. The Pages screen now
 * covers every storefront page — home, shop, contact, checkout, footer — so the
 * column becomes a plain unique string.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // The unique index already exists and is untouched by the type change.
            $table->string('type')->change();
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->enum('type', ['policies', 'about', 'terms', 'refund', 'sales_support', 'shipping_delivery'])
                ->change();
        });
    }
};
