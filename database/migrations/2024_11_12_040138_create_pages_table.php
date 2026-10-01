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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            // 'about' is edited into the original definition rather than altered in a
            // later migration: the live database already allows it, and changing an
            // enum after the fact requires a full table rebuild on sqlite, which the
            // test suite runs on. PageController::about() reads type='about' and the
            // admin panel POSTs to /admin/pages/about, so omitting it made the About
            // page unsaveable on any rebuilt schema.
            $table->enum('type', ['policies', 'about', 'terms', 'refund', 'sales_support', 'shipping_delivery'])->unique();
            $table->text('content');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
