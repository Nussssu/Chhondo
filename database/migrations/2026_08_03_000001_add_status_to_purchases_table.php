<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('purchases', 'status')) {
            Schema::table('purchases', function (Blueprint $table) {
                $table->string('status')->default('active')->after('purchasing_due');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('purchases', 'status')) {
            Schema::table('purchases', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
