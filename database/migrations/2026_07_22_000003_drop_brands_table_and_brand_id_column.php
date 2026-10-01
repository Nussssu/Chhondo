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
        if (Schema::hasColumn('products', 'brand_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('brand_id');
            });
        }

        Schema::dropIfExists('brands');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company');
            $table->string('photo')->nullable();

            $table->timestamps();
        });

        if (! Schema::hasColumn('products', 'brand_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('brand_id')->nullable();
            });
        }
    }
};
