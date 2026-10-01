<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('products', 'subcategory_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropForeign(['subcategory_id']);
                $table->dropColumn('subcategory_id');
            });
        }

        Schema::dropIfExists('sub_categories');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->enum('status', ['Active', 'Deactive'])->default('active');
            $table->timestamps();
        });

        if (! Schema::hasColumn('products', 'subcategory_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->unsignedBigInteger('subcategory_id')->nullable();
            });

            Schema::table('products', function (Blueprint $table) {
                $table->foreign('subcategory_id')->references('id')->on('sub_categories')->onDelete('cascade');
            });
        }
    }
};
