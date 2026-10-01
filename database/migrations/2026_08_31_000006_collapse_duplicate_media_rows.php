<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Collapse the media table back to the single row it is meant to hold.
 *
 * MediaRepository::storeMedia() ran updateOrCreate(['id' => 1], …) against a
 * model whose `id` is not fillable. Where the row's id was not 1 the lookup
 * matched nothing and the create dropped the id, so every save in Store
 * settings › Media inserted another row — while the storefront kept reading
 * Media::first() and rendering the oldest one. A shop that changed its logo or
 * favicon saw the change stored and never applied.
 *
 * The code is fixed; this repairs the rows that bug already wrote, keeping the
 * most recent value the shop actually chose for each image.
 */
return new class extends Migration
{
    private const COLUMNS = ['logo', 'favicon', 'loader', 'footer_image'];

    public function up(): void
    {
        if (! Schema::hasTable('media')) {
            return;
        }

        $rows = DB::table('media')->orderBy('id')->get();

        if ($rows->count() < 2) {
            return;
        }

        // Newest first: the last thing the shop chose is what it wants.
        $newestFirst = $rows->reverse();
        $merged = [];

        foreach (self::COLUMNS as $column) {
            if (! Schema::hasColumn('media', $column)) {
                continue;
            }

            foreach ($newestFirst as $row) {
                if (filled($row->{$column} ?? null)) {
                    $merged[$column] = $row->{$column};
                    break;
                }
            }
        }

        $keep = $rows->first();

        if ($merged !== []) {
            DB::table('media')->where('id', $keep->id)->update($merged);
        }

        DB::table('media')->where('id', '!=', $keep->id)->delete();
    }

    public function down(): void
    {
        // Rows merged away cannot be told apart from rows that were never
        // there, and duplicates were never a state worth restoring.
    }
};
