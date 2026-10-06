<?php

namespace App\Http\Controllers\Admin\Layout;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\LayoutSetting;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\SiteInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Header and footer. The menu is managed here the way WordPress manages one —
 * a flat list of items whose indent sets the hierarchy, nesting as deep as the
 * storefront dropdown can render — and everything the footer shows is edited
 * here rather than being written into the Vue component.
 */
class LayoutController extends Controller
{
    /** Links an operator can drop into a menu without typing a URL. */
    private function linkSuggestions(): array
    {
        $pages = collect(Page::PAGES)
            ->filter(fn ($meta) => filled($meta['url']))
            ->map(fn ($meta) => ['label' => $meta['label'], 'url' => $meta['url']])
            ->values();

        $extra = collect([
            ['label' => 'Blog', 'url' => '/blog'],
            ['label' => 'Categories', 'url' => '/categories'],
            ['label' => 'Track order', 'url' => '/track-order'],
            ['label' => 'My account', 'url' => '/account'],
        ]);

        $categories = Category::where('status', 'Active')
            ->orderBy('name')
            ->get(['name', 'slug'])
            ->map(fn ($c) => ['label' => $c->name, 'url' => '/product-category/' . $c->slug]);

        return [
            'pages'      => $pages->concat($extra)->values()->all(),
            'categories' => $categories->values()->all(),
        ];
    }

    public function header()
    {
        return Inertia::render('Admin/Layout/Header', [
            'menu'        => MenuItem::where('location', 'header')
                ->orderBy('sort_order')->orderBy('id')
                ->get(['id', 'type', 'category_ids', 'parent_id', 'label', 'url', 'target', 'sort_order', 'is_active']),
            'maxDepth'    => MenuItem::MAX_DEPTH,
            'settings'    => LayoutSetting::get('header'),
            'suggestions' => $this->linkSuggestions(),
            // For the picker on a "categories dropdown" menu item.
            'categoryOptions' => Category::where('status', 'Active')
                ->orderBy('serial')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function updateHeader(Request $request)
    {
        $data = $request->validate([
            'settings.announcement_enabled' => 'boolean',
            'settings.announcement_text'    => 'nullable|string|max:255',
            'settings.announcement_url'     => 'nullable|string|max:255',
            'settings.show_search'          => 'boolean',
            'settings.show_wishlist'        => 'boolean',
            'settings.show_account'         => 'boolean',
            'settings.show_categories_menu' => 'boolean',
            'settings.mobile_links'         => 'array|max:10',
            'settings.mobile_links.*.label' => 'required|string|max:80',
            'settings.mobile_links.*.url'   => 'required|string|max:255',
            'settings.mobile_links.*.icon'  => 'nullable|string|max:20',

            // The menu nests to an arbitrary depth, which `menu.*.children.*`
            // rules cannot express, so the tree is checked in one closure.
            'menu' => ['array', fn ($attr, $value, $fail) => $this->validateMenu($value, $fail)],
        ]);

        LayoutSetting::put('header', $data['settings'] ?? []);
        $this->syncMenu($data['menu'] ?? []);

        return redirect()->back()->with('success', 'Header updated successfully.');
    }

    /** Every item in the submitted tree must be a well-formed link. */
    private function validateMenu(mixed $items, callable $fail, int $depth = 0, string $path = 'menu'): void
    {
        if (! is_array($items)) {
            return;
        }

        if ($depth > MenuItem::MAX_DEPTH) {
            $fail("The menu only nests {$this->depthWords()} deep.");

            return;
        }

        foreach ($items as $i => $item) {
            $at = "{$path}.{$i}";

            if (! is_array($item)) {
                $fail("{$at} is not a menu item.");
                continue;
            }

            if (! filled($item['label'] ?? null) || mb_strlen((string) $item['label']) > 120) {
                $fail("Every menu item needs a label of 120 characters or fewer.");
            }

            if (! filled($item['url'] ?? null) || mb_strlen((string) $item['url']) > 255) {
                $fail("Every menu item needs a link of 255 characters or fewer.");
            }

            if (filled($item['target'] ?? null) && ! in_array($item['target'], ['_self', '_blank'], true)) {
                $fail("{$at} has an unknown link target.");
            }

            // Only a top-level item can be the categories dropdown; the storefront
            // has nowhere to render one inside a flyout.
            if (($item['type'] ?? 'link') === 'categories' && $depth > 0) {
                $fail('A categories dropdown can only sit at the top level of the menu.');
            }

            if (array_key_exists('category_ids', $item) && ! is_array($item['category_ids'] ?? [])) {
                $fail("{$at} has an invalid category selection.");
            }

            $this->validateMenu($item['children'] ?? [], $fail, $depth + 1, "{$at}.children");
        }
    }

    private function depthWords(): string
    {
        return MenuItem::MAX_DEPTH . ' level' . (MenuItem::MAX_DEPTH === 1 ? '' : 's');
    }

    /** Rewrites the menu to match what the builder sent, keeping ids stable. */
    private function syncMenu(array $items): void
    {
        $kept = [];
        $this->saveBranch($items, null, 0, $kept);

        MenuItem::where('location', 'header')->whereNotIn('id', $kept ?: [0])->delete();
    }

    /** Persists one level and recurses, collecting the ids that survive the save. */
    private function saveBranch(array $items, ?int $parentId, int $depth, array &$kept): void
    {
        if ($depth > MenuItem::MAX_DEPTH) {
            return;
        }

        $order = 0;

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $saved  = $this->saveItem($item, $parentId, $order++, $depth);
            $kept[] = $saved->id;

            $this->saveBranch($item['children'] ?? [], $saved->id, $depth + 1, $kept);
        }
    }

    private function saveItem(array $data, ?int $parentId, int $order, int $depth): MenuItem
    {
        $type = $depth === 0 ? ($data['type'] ?? 'link') : 'link';

        $attributes = [
            'location'   => 'header',
            'type'       => $type,
            // Only meaningful on a categories dropdown; cleared otherwise so a
            // stale selection cannot linger on an item switched back to a link.
            'category_ids' => $type === 'categories'
                ? $this->cleanCategoryIds($data['category_ids'] ?? [])
                : null,
            'parent_id'  => $parentId,
            'label'      => $data['label'],
            'url'        => $data['url'],
            'target'     => $data['target'] ?? '_self',
            'sort_order' => $order,
            'is_active'  => $data['is_active'] ?? true,
        ];

        $existing = isset($data['id']) ? MenuItem::find($data['id']) : null;

        if ($existing) {
            $existing->update($attributes);

            return $existing;
        }

        return MenuItem::create($attributes);
    }

    /** Keep only ids that still exist, in the order the operator arranged them. */
    private function cleanCategoryIds(mixed $ids): ?array
    {
        if (! is_array($ids) || $ids === []) {
            return null;
        }

        $ids = array_values(array_unique(array_map('intval', array_filter($ids, 'is_numeric'))));

        if ($ids === []) {
            return null;
        }

        $existing = Category::whereIn('id', $ids)->pluck('id')->all();

        $kept = array_values(array_filter($ids, fn ($id) => in_array($id, $existing, true)));

        return $kept === [] ? null : $kept;
    }

    public function footer()
    {
        return Inertia::render('Admin/Layout/Footer', [
            'settings'    => LayoutSetting::get('footer'),
            // The footer also shows these, so they are edited in the same place.
            'site'        => SiteInfo::first()?->only([
                'footer_text', 'store_email', 'phone_number', 'address',
                'facebook_url', 'instagram_url', 'tiktok_url', 'youtube_url', 'x_url',
            ]) ?? [],
            'suggestions' => $this->linkSuggestions(),
        ]);
    }

    public function updateFooter(Request $request)
    {
        $data = $request->validate([
            'settings.about_text'    => 'nullable|string|max:2000',
            'settings.follow_label'  => 'nullable|string|max:60',
            'settings.show_logo'     => 'boolean',
            'settings.contact_title' => 'nullable|string|max:60',
            'settings.show_contact'  => 'boolean',
            'settings.show_badges'   => 'boolean',
            'settings.copyright'     => 'nullable|string|max:255',
            // The footer's own contact block (the store settings stay as they are).
            'settings.contact_address' => 'nullable|string|max:255',
            'settings.contact_email'   => 'nullable|string|max:255',
            'settings.contact_phone'   => 'nullable|string|max:60',
            'settings.linkedin_url'    => 'nullable|url|max:255',

            'settings.legal_links'         => 'array|max:4',
            'settings.legal_links.*.label' => 'required|string|max:80',
            'settings.legal_links.*.url'   => 'required|string|max:255',

            'settings.columns'                 => 'array|max:4',
            'settings.columns.*.title'         => 'nullable|string|max:60',
            'settings.columns.*.links'         => 'array|max:12',
            'settings.columns.*.links.*.label' => 'required|string|max:80',
            'settings.columns.*.links.*.url'   => 'required|string|max:255',

            'settings.badges'         => 'array|max:6',
            'settings.badges.*.title' => 'required|string|max:80',
            'settings.badges.*.text'  => 'nullable|string|max:255',
            'settings.badges.*.icon'  => 'nullable|in:security,support,delivery',

            'site.footer_text'        => 'nullable|string|max:500',
            'site.store_email'        => 'nullable|email',
            'site.phone_number'       => 'nullable|string|max:60',
            'site.address'            => 'nullable|string|max:255',
            'site.facebook_url'       => 'nullable|url',
            'site.instagram_url'      => 'nullable|url',
            'site.tiktok_url'         => 'nullable|url',
            'site.youtube_url'        => 'nullable|url',
            'site.x_url'              => 'nullable|url',
        ]);

        LayoutSetting::put('footer', $data['settings'] ?? []);

        if (! empty($data['site'])) {
            $site = SiteInfo::first() ?? new SiteInfo();
            $site->fill($data['site'])->save();
        }

        return redirect()->back()->with('success', 'Footer updated successfully.');
    }
}
