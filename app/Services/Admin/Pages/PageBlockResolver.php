<?php

namespace App\Services\Admin\Pages;

use App\Models\Category;
use App\Models\Product;

/**
 * Prepares a page's widgets for the storefront.
 *
 * Static widgets pass through as written. Product widgets are filled in here,
 * so a section can be pointed at a category or at "new arrivals" and stay
 * current without anyone re-saving the page.
 */
class PageBlockResolver
{
    public const SOURCES = ['new_arrival', 'home', 'category', 'featured', 'latest'];

    /** Most products one section may show. */
    public const MAX_LIMIT = 24;

    /** How many candidates the Sequence modal offers to order, and the longest sequence it may save. */
    public const MAX_CANDIDATES = 96;

    public function resolve(?array $blocks): array
    {
        if (empty($blocks)) {
            return [];
        }

        return collect($blocks)
            // A widget switched off in the editor stays saved but is not shown.
            ->reject(fn ($block) => ! empty($block['hidden']))
            ->map(fn ($block) => $this->resolveBlock($block))
            ->filter()
            ->values()
            ->all();
    }

    private function resolveBlock(array $block): ?array
    {
        $type = $block['type'] ?? null;

        if (! in_array($type, PageBlockRenderer::TYPES, true)) {
            return null;
        }

        if ($type === 'product_section') {
            $block['products'] = $this->products($block);

            // An empty section is a gap on the page, not a section.
            if ($block['products'] === []) {
                return null;
            }
        }

        return $block;
    }

    /**
     * The products a section shows, in the order the storefront renders them.
     *
     * Trimmed to what a card draws before it is serialised. These blocks are
     * inlined into the page HTML by Inertia, and the long `description` body
     * alone was adding several kilobytes per product to every page that
     * carries a product section — for markup no card on that page can render.
     */
    private function products(array $block): array
    {
        return $this->sectionProducts($block)
            ->each(fn (Product $product) => $product->hideInternalFields(listing: true))
            ->toArray();
    }

    /**
     * The products a section resolves to, in render order.
     *
     * Public because the Sequence modal in the page editor asks the same
     * question the storefront does — an ordering built against a different
     * candidate list than the one that renders would be no ordering at all.
     *
     * @param  bool  $all  Return every candidate rather than the section's limit,
     *                     which is what the modal needs so a product further down
     *                     the list can be promoted into view.
     */
    public function sectionProducts(array $block, bool $all = false): \Illuminate\Support\Collection
    {
        $limit = max(1, min(self::MAX_LIMIT, (int) ($block['limit'] ?? 4)));
        $order = $this->manualOrder($block);

        $take = $all ? self::MAX_CANDIDATES : $limit;

        // With a sequence in play the natural top-N is not enough: a product the
        // operator promoted may sit well below it. Those are fetched by id and
        // merged in, so promoting one does not depend on how new it is.
        $products = $this->sourceQuery($block)->take($take)->get();

        if ($order !== []) {
            $promoted = $this->sourceQuery($block)
                ->whereIn('id', $order)
                ->whereNotIn('id', $products->pluck('id')->all())
                ->get();

            $products = $products->concat($promoted);
        }

        return $this->applyManualOrder($products, $order)->take($take)->values();
    }

    /** The base query for a section's source, before ordering or limiting. */
    private function sourceQuery(array $block)
    {
        $source = in_array($block['source'] ?? '', self::SOURCES, true) ? $block['source'] : 'new_arrival';

        $query = Product::query()
            ->where('status', 'Published')
            ->with(['category:id,name,slug', 'campaigns']);

        match ($source) {
            'new_arrival' => $query->where('is_new_arrival', true)->latest('id'),
            'home'        => $query->where('is_home', 1)->latest('id'),
            'featured'    => $query->where('feature', 1)->latest('id'),
            // A product filed under several categories belongs in every one of
            // their sections, so this matches membership, not the primary column.
            'category'    => $query
                ->when($block['category_id'] ?? null, fn ($q, $id) => $q->inCategory($id))
                ->latest('id'),
            default       => $query->latest('id'),
        };

        return $query;
    }

    /**
     * The manual sequence saved on a section, as a clean list of ids.
     *
     * @return array<int, int>
     */
    public function manualOrder(array $block): array
    {
        return collect($block['product_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->take(self::MAX_CANDIDATES)
            ->values()
            ->all();
    }

    /**
     * Put the resolved products into the operator's saved order.
     *
     * A sequence goes stale on its own — products get deleted, unpublished, or
     * moved out of the category it was built against. Ids that no longer
     * resolve are simply not found, and anything the sequence never mentioned
     * (a product added since) keeps its natural place after the ordered ones,
     * so a stale sequence degrades into a partial one instead of emptying the
     * section or leaving gaps in the grid.
     *
     * @param  array<int, int>  $order
     */
    private function applyManualOrder(\Illuminate\Support\Collection $products, array $order): \Illuminate\Support\Collection
    {
        if ($order === []) {
            return $products;
        }

        $position = array_flip($order);
        $end      = count($order);
        // Where the query already put each product, so anything the sequence
        // does not mention keeps its natural order rather than being re-sorted.
        $natural  = $products->pluck('id')->flip();

        return $products
            ->sortBy(
                fn ($product) => $position[$product->id] ?? $end + ($natural[$product->id] ?? 0),
                SORT_NUMERIC
            )
            ->values();
    }

    /** Categories offered to the product widget in the admin. */
    public function categoryOptions()
    {
        return Category::where('status', 'Active')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
