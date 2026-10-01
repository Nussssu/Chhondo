<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

/**
 * Slug generation that keeps non-Latin characters.
 *
 * `Str::slug()` transliterates to ASCII, which drops Bangla entirely: a product named
 * "শাড়ি" with code TS-001 produced the slug "ts-001", so the name contributed nothing
 * to the URL. Categories and puja collections already worked around this with their own
 * private uniqueSlug() copies; this consolidates them.
 *
 * It also removes characters that would break a URL. The previous workarounds only
 * replaced whitespace, so a name like "Saree 50% / Best" yielded a slug containing a
 * literal "/" and stopped resolving.
 */
class Slug
{
    /**
     * A URL-safe slug that preserves Unicode letters and digits.
     */
    public static function make(string $value, string $fallback = 'item'): string
    {
        $value = mb_strtolower(trim($value), 'UTF-8');

        // Anything that is not a Unicode letter, digit or combining mark becomes the
        // separator. This keeps Bangla, Arabic and the like while dropping /, %, ?, #
        // and friends.
        //
        // \p{M} matters: Bangla writes its vowels as combining marks, so without it
        // "শাড়ি" collapses to "শ-ড" — letters kept, vowel signs stripped.
        $slug = preg_replace('/[^\p{L}\p{N}\p{M}]+/u', '-', $value) ?? '';
        $slug = trim($slug, '-');

        return $slug !== '' ? $slug : $fallback;
    }

    /**
     * A slug that is unique within a table, suffixing -2, -3, … on collision.
     *
     * @param  string|null  $ignoreId  row to exclude, so updating a record does not
     *                                 collide with its own existing slug
     */
    public static function unique(
        string $value,
        string $table,
        string $column = 'slug',
        int|string|null $ignoreId = null,
        string $fallback = 'item'
    ): string {
        $base = self::make($value, $fallback);
        $slug = $base;
        $suffix = 2;

        while (
            DB::table($table)
                ->where($column, $slug)
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }
}
