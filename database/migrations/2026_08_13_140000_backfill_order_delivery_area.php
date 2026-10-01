<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * POS checkout hardcoded delivery = 'N/A', discarding the area the operator
 * chose at the till, so the order edit screen showed a blank area for every
 * counter sale. The charge that was applied survives, and it identifies the
 * area: the shop has exactly two, inside and outside Dhaka.
 *
 * Only rows whose area is missing or unrecognised are touched — anything
 * already recording 'inside' or 'outside' is left alone.
 */
return new class extends Migration
{
    public function up(): void
    {
        $siteInfo = DB::table('site_infos')->first();

        $inside = (float) ($siteInfo->shipping_charge_inside_dhaka ?? 0);

        if ($inside <= 0) {
            // Without a rate to compare against, guessing would corrupt data.
            return;
        }

        $repairable = fn ($query) => $query
            ->where(function ($q) {
                $q->whereNull('delivery')->orWhereNotIn('delivery', ['inside', 'outside']);
            })
            ->where('delivery_charge', '>', 0);

        // Charged the inside rate — an inside-Dhaka delivery.
        $insideUpdated = $repairable(DB::table('orders'))
            ->where('delivery_charge', $inside)
            ->update(['delivery' => 'inside']);

        // Any other non-zero charge is an outside-Dhaka delivery. The rate has
        // changed over time (120 then 130), so match on "not the inside rate"
        // rather than on one specific figure.
        $outsideUpdated = $repairable(DB::table('orders'))
            ->where('delivery_charge', '!=', $inside)
            ->update(['delivery' => 'outside']);

        // Orders with no delivery charge were collected at the counter and
        // genuinely have no area; they keep whatever they had.
        echo "  Delivery area backfilled: {$insideUpdated} inside, {$outsideUpdated} outside." . PHP_EOL;
    }

    public function down(): void
    {
        // The original values carried no information (they were all 'N/A'),
        // so there is nothing meaningful to restore.
    }
};
