<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A switch that closes the storefront while staff keep working in the admin
 * panel. Off by default, so deploying this changes nothing until it is turned on.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            if (! Schema::hasColumn('site_infos', 'maintenance_mode')) {
                $table->boolean('maintenance_mode')->default(false);
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_infos', function (Blueprint $table) {
            if (Schema::hasColumn('site_infos', 'maintenance_mode')) {
                $table->dropColumn('maintenance_mode');
            }
        });
    }
};
