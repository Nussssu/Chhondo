<?php

namespace App\Services\MarketingTool;

use App\Models\MarketingTool;
use Illuminate\Support\Facades\Cache;

/**
 * Renders the custom code snippets stored in marketing_tools into the three
 * slots of the storefront layout: <head>, right after <body>, and right before
 * </body>. Admin pages are never injected.
 */
class MarketingScriptRenderer
{
    public const CACHE_KEY = 'marketing_tools.active';

    /**
     * Active snippets, cached until a tool is saved or deleted.
     *
     * Plain rows go into the cache — serialized Eloquent models come back from
     * the file store as __PHP_Incomplete_Class — and are re-hydrated here so the
     * targeting helpers on the model are still available.
     */
    public function active()
    {
        $rows = Cache::rememberForever(self::CACHE_KEY, function () {
            return MarketingTool::active()
                ->orderBy('priority')
                ->orderBy('id')
                ->get([
                    'id', 'title', 'name', 'location', 'target',
                    'target_urls', 'script', 'priority',
                ])
                ->map(fn ($tool) => $tool->getAttributes())
                ->all();
        });

        return MarketingTool::hydrate(is_array($rows) ? $rows : []);
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * The snippets that belong on $path, keyed by location.
     *
     * @return array{head: string, body_start: string, body_end: string}
     */
    public function slotsFor(string $path): array
    {
        $slots = ['head' => '', 'body_start' => '', 'body_end' => ''];

        foreach ($this->active() as $tool) {
            $code = trim((string) $tool->script);

            if ($code === '' || ! $tool->matchesPath($path)) {
                continue;
            }

            $location = in_array($tool->location, MarketingTool::LOCATIONS, true)
                ? $tool->location
                : 'head';

            $slots[$location] .= "\n<!-- marketing-tool:{$tool->id} -->\n"
                . "<span data-mt-id=\"{$tool->id}\" style=\"display:none\"></span>\n"
                . $code . "\n";
        }

        return $slots;
    }

    /**
     * Snippets shared with the SPA so client-side navigation can inject the
     * ones the initial server render did not cover.
     */
    public function payloadFor(string $path): array
    {
        return $this->active()
            ->filter(fn ($t) => trim((string) $t->script) !== '')
            ->map(fn ($t) => [
                'id'        => $t->id,
                'title'     => $t->title ?: $t->name,
                'location'  => in_array($t->location, MarketingTool::LOCATIONS, true) ? $t->location : 'head',
                'patterns'  => $t->patterns(),
                'script'    => $t->script,
                'rendered'  => $t->matchesPath($path),
            ])
            ->values()
            ->all();
    }
}
