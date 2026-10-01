<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A banner cropped for a wide desktop hero reads badly on a phone, so each
 * banner can carry a second, square image used only on small screens. It is
 * optional — without one the desktop image is shown on both.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sidebar_sliders', function (Blueprint $table) {
            if (! Schema::hasColumn('sidebar_sliders', 'mobile_image_path')) {
                $table->string('mobile_image_path')->nullable()->after('image_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sidebar_sliders', function (Blueprint $table) {
            $table->dropColumn('mobile_image_path');
        });
    }
};
