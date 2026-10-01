<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function blog_category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id', 'id');
    }

    /** Posts visible on the storefront. */
    public function scopePublished($query)
    {
        return $query->where('status', 'Published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }

    /** Tags come back from Tagify as JSON; older rows are comma separated. */
    public function tagList(): array
    {
        $raw = trim((string) $this->tags);

        if ($raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        if (is_array($decoded)) {
            return collect($decoded)
                ->map(fn ($t) => is_array($t) ? ($t['value'] ?? '') : (string) $t)
                ->filter()
                ->values()
                ->all();
        }

        return collect(explode(',', $raw))->map(fn ($t) => trim($t))->filter()->values()->all();
    }

    /** Plain-text opening of the post, for cards and meta descriptions. */
    public function excerpt(int $length = 160): string
    {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) $this->description)));

        return Str::limit($text, $length);
    }

    /** A unique slug for $title, ignoring $ignoreId (the row being updated). */
    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        // Str::slug() strips Bangla entirely, and the storefront already uses
        // Bangla slugs elsewhere (/product-category/পূজা-কালেকশন), so keep any
        // unicode letters instead of falling back to an empty slug.
        $base = Str::slug($title);

        if ($base === '') {
            $base = trim(preg_replace('/[^\p{L}\p{N}]+/u', '-', mb_strtolower($title)), '-');
        }

        if ($base === '') {
            $base = 'post';
        }

        $slug = $base;
        $i    = 2;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}
