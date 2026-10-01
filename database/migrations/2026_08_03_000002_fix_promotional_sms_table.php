<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Align the promotional_sms table with what the controller / UI / job
     * actually use: a campaign title, a target category label, a broader set
     * of statuses, and a nullable numbers column (rows start with no numbers).
     */
    public function up(): void
    {
        Schema::table('promotional_sms', function (Blueprint $table) {
            if (! Schema::hasColumn('promotional_sms', 'campaign_title')) {
                $table->string('campaign_title')->nullable()->after('id');
            }
            if (! Schema::hasColumn('promotional_sms', 'category')) {
                $table->string('category')->nullable()->after('campaign_title');
            }
        });

        // Relax the status enum to a plain string so 'no_numbers' and 'failed'
        // (used by the job) are valid alongside 'pending' / 'sent'. Also allow
        // numbers to be null since a row is created before recipients resolve.
        Schema::table('promotional_sms', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
            $table->json('numbers')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('promotional_sms', function (Blueprint $table) {
            if (Schema::hasColumn('promotional_sms', 'category')) {
                $table->dropColumn('category');
            }
            if (Schema::hasColumn('promotional_sms', 'campaign_title')) {
                $table->dropColumn('campaign_title');
            }
        });
    }
};
