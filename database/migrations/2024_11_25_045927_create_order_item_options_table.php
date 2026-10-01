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
        Schema::create('order_item_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained()->onDelete('cascade');

            // Ensure the column exists before referencing it
            $table->unsignedBigInteger('attribute_options_id');
            $table->foreign('attribute_options_id')->references('id')->on('attribute_options')->onDelete('cascade');

            // Ensure the column exists before referencing it
            $table->unsignedBigInteger('product_attibute_id');
            $table->foreign('product_attibute_id')->references('id')->on('product_attributes')->onDelete('cascade');

            $table->integer('quantity');
            $table->unique(['order_item_id', 'attribute_options_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_options');
    }
};
