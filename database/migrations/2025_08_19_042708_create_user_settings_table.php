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
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('regular_user_min')->default(0);
            $table->integer('regular_user_max')->default(0);
            $table->integer('new_user_min')->default(0);
            $table->integer('new_user_max')->default(0);
            $table->integer('vip_user_min')->default(0);
            $table->integer('vip_user_max')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
