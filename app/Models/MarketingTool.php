<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class MarketingTool extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'name',
        'identifier',
        'location',
        'target',
        'target_urls',
        'script',
        'second_script',
        'is_active',
        'priority',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority'  => 'integer',
    ];

    /** Where the snippet is printed. */
    public const LOCATIONS = ['head', 'body_start', 'body_end'];

    /**
     * Which pages a snippet runs on. Each target maps to the URL patterns it
     * covers; 'custom' uses the patterns typed into target_urls instead.
     */
    public const TARGETS = [
        'entire_site'   => ['*'],
        'home'          => ['/'],
        'shop'          => ['shop', 'shop/*'],
        'category'      => ['categories', 'product-category/*'],
        'product'       => ['product/*'],
        'cart'          => ['cart'],
        'checkout'      => ['checkout'],
        'order_success' => ['success/*'],
        'account'       => ['account', 'account/*'],
        'contact'       => ['contact-us'],
        'custom'        => [],
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /** Patterns this row matches against the request path. */
    public function patterns(): array
    {
        if ($this->target === 'custom') {
            return collect(preg_split('/[\r\n,]+/', (string) $this->target_urls))
                ->map(fn ($p) => ltrim(trim($p), '/'))
                ->filter()
                ->map(fn ($p) => $p === '' ? '/' : $p)
                ->values()
                ->all();
        }

        return self::TARGETS[$this->target] ?? ['*'];
    }

    /**
     * Does this snippet belong on the given request path? $path is the
     * Laravel-style path ('/' for the home page, no leading slash otherwise).
     */
    public function matchesPath(string $path): bool
    {
        foreach ($this->patterns() as $pattern) {
            if ($pattern === '*' || Str::is($pattern, $path)) {
                return true;
            }
        }

        return false;
    }
}
