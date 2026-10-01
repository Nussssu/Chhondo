<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Puja collections were removed: a curated grouping of products is a category,
 * so the shop keeps one concept instead of two. The admin screen, the storefront
 * home section and the public /puja-collection/{slug} page are all gone.
 *
 * The single collection held at drop time, recorded here because the rows do
 * not survive this migration:
 *
 *   পূজা কালেকশন  (slug: পূজা-কালেকশন, active)
 *     #238  27  অদ্বিতা(ডুয়েল টোনের শাড়ি)
 *     #239  28  ইন্দিরা ওয়াটারী গ্রীন ব্লক প্রিন্ট শাড়ি
 *     #240  29  দীপ্তি
 *     #241  30  দীপ্তি
 *     #242  31  নীলকণ্ঠ
 *     #243  32  সুরঞ্জনা(ডুয়েল টোনের শাড়ি)
 *     #244  33  সুরম্য
 *     #245  34  অনন্যা(সুতার কাজের শাড়ি)
 *
 * To restore the grouping, create a category with that name and assign those
 * eight products to it.
 */
return new class extends Migration
{
    public function up(): void
    {
        // The pivot holds the foreign keys, so it goes first.
        Schema::dropIfExists('product_puja_collection');
        Schema::dropIfExists('puja_collections');
    }

    /**
     * Recreates the schema so a rollback leaves a consistent database. The rows
     * themselves are gone — see the product list above.
     */
    public function down(): void
    {
        Schema::create('puja_collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('banner_image')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_puja_collection', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('puja_collection_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
