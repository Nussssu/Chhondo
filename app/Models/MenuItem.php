<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = ['location', 'type', 'category_ids', 'parent_id', 'label', 'url', 'target', 'sort_order', 'is_active'];

    protected $casts = [
        'is_active'    => 'boolean',
        'sort_order'   => 'integer',
        'parent_id'    => 'integer',
        'category_ids' => 'array',
    ];

    public const LOCATIONS = ['header'];

    /**
     * link       — a plain link, with optional sub items
     * categories — a dropdown filled from the product categories
     */
    public const TYPES = ['link', 'categories'];

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * How deep the menu may nest. The storefront dropdown renders a top level
     * plus three levels of flyout, so depth 0-3 is what it can actually show.
     */
    public const MAX_DEPTH = 3;

    /** The menu as the storefront renders it: a tree, nested to MAX_DEPTH. */
    public static function tree(string $location = 'header', bool $activeOnly = true): array
    {
        $items = self::where('location', $location)
            ->when($activeOnly, fn ($q) => $q->where('is_active', true))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return self::branch($items, null, 0);
    }

    /** One level of the tree, with each item's own children resolved under it. */
    private static function branch($items, ?int $parentId, int $depth): array
    {
        if ($depth > self::MAX_DEPTH) {
            return [];
        }

        return $items
            ->filter(fn ($item) => $parentId === null
                ? $item->parent_id === null
                : (int) $item->parent_id === $parentId)
            ->map(fn ($item) => [
                'id'       => $item->id,
                'type'     => $item->type,
                'label'    => $item->label,
                'url'      => $item->url,
                'target'   => $item->target,
                // Empty means "every category", which is how the dropdown
                // behaved before a selection could be made.
                'category_ids' => array_values(array_map('intval', $item->category_ids ?? [])),
                'children' => self::branch($items, $item->id, $depth + 1),
            ])
            ->values()
            ->all();
    }
}
