<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

/**
 * Repairs orders that share an invoice number, then makes it impossible to happen again.
 *
 * The old generator was `rand(1000, 9999)` with no uniqueness check. Every guest-facing
 * order lookup resolves an order with `where('invoice_number', ...)->first()`, so two
 * orders sharing a number means one customer is shown the other's order — name, phone,
 * address and items.
 *
 * Policy: within each colliding group the **oldest** order keeps the number, since that
 * is the one most likely already printed on an invoice or sent in an email. Newer
 * duplicates are reassigned a fresh number, and their previous value is preserved in
 * `legacy_invoice_number` so the change is traceable and old references can still be
 * looked up by support.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'legacy_invoice_number')) {
                $table->string('legacy_invoice_number')->nullable()->after('invoice_number');
            }
        });

        $reassigned = $this->reassignDuplicates();

        // Only safe once the duplicates are gone.
        if (! $this->hasUniqueIndex()) {
            Schema::table('orders', function (Blueprint $table) {
                $table->unique('invoice_number', 'orders_invoice_number_unique');
            });
        }

        if ($reassigned !== []) {
            Log::warning('Repaired duplicate invoice numbers', ['mapping' => $reassigned]);
        }
    }

    public function down(): void
    {
        if ($this->hasUniqueIndex()) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropUnique('orders_invoice_number_unique');
            });
        }

        // Put the original numbers back, restoring the collisions.
        foreach (DB::table('orders')->whereNotNull('legacy_invoice_number')->get() as $order) {
            DB::table('orders')->where('id', $order->id)->update([
                'invoice_number' => $order->legacy_invoice_number,
                'legacy_invoice_number' => null,
            ]);
        }

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'legacy_invoice_number')) {
                $table->dropColumn('legacy_invoice_number');
            }
        });
    }

    /** @return array<string, list<string>> old number => new numbers issued */
    private function reassignDuplicates(): array
    {
        $duplicates = DB::table('orders')
            ->select('invoice_number')
            ->whereNotNull('invoice_number')
            ->where('invoice_number', '!=', '')
            ->groupBy('invoice_number')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('invoice_number');

        $mapping = [];

        foreach ($duplicates as $number) {
            // Oldest first: it keeps the number, everything after it is reassigned.
            $orders = DB::table('orders')
                ->where('invoice_number', $number)
                ->orderBy('id')
                ->pluck('id')
                ->slice(1);

            foreach ($orders as $id) {
                $fresh = Order::generateInvoiceNumber();

                DB::table('orders')->where('id', $id)->update([
                    'invoice_number' => $fresh,
                    'legacy_invoice_number' => $number,
                ]);

                $mapping[$number][] = "order {$id} → {$fresh}";
            }
        }

        return $mapping;
    }

    private function hasUniqueIndex(): bool
    {
        foreach (Schema::getIndexes('orders') as $index) {
            if (($index['unique'] ?? false) && ($index['columns'] ?? []) === ['invoice_number']) {
                return true;
            }
        }

        return false;
    }
};
