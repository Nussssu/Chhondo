<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Every account with a saved address should have a primary one.
 *
 * The flag only started being set when addresses moved onto the profile page,
 * so rows saved before that have none — including accounts holding a single
 * address, which can only be the primary one. Checkout reads the primary
 * address, and the profile marks it, so both were showing nothing.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Accounts that have addresses but none flagged.
        $userIds = DB::table('user_addresses')
            ->select('user_id')
            ->groupBy('user_id')
            ->havingRaw('SUM(is_default) = 0')
            ->pluck('user_id');

        foreach ($userIds as $userId) {
            // The oldest is the one they have used longest; for the common case
            // of a single address it is the only candidate anyway.
            $oldest = DB::table('user_addresses')
                ->where('user_id', $userId)
                ->orderBy('id')
                ->value('id');

            if ($oldest) {
                DB::table('user_addresses')->where('id', $oldest)->update(['is_default' => 1]);
            }
        }
    }

    public function down(): void
    {
        // Which rows were flagged here is not recorded, and clearing them all
        // would strip flags that were set deliberately. Nothing to undo.
    }
};
