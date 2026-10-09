<?php

namespace App\Http\Controllers\Admin\Pages;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SidebarSlider;
use App\Models\SiteInfo;
use App\Services\Admin\Pages\PageBlockRenderer;
use App\Services\Admin\Pages\PageBlockResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PagesController extends Controller
{
    public function __construct(
        private PageBlockRenderer $renderer,
        private PageBlockResolver $resolver,
    ) {
    }

    /** Every storefront page in one table. */
    public function index()
    {
        $records = Page::all()->keyBy('type');
        $site    = SiteInfo::first();

        $pages = collect(Page::PAGES)->map(function ($meta, $type) use ($records, $site) {
            $record = $records->get($type);
            $fields = $meta['site_fields'] ?? [];

            return [
                'field_count'  => count($fields),
                'fields_set'   => collect($fields)->filter(fn ($f, $key) => filled($site?->{$key}))->count(),
                'type'         => $type,
                'label'        => $meta['label'],
                'url'          => $meta['url'],
                'note'         => $meta['note'],
                'editable'     => $meta['editable'],
                // Some pages carry wording only and render no widgets.
                'widgets'      => $meta['widgets'] ?? true,
                'banners'      => $meta['banners'],
                'permission'   => $meta['permission'],
                'title'        => $record?->title,
                'has_content'  => $meta['editable'] ? (filled($record?->content) || filled($record?->title) || is_array($record?->blocks) && $record->blocks !== []) : null,
                'block_count'  => is_array($record?->blocks) ? count($record->blocks) : null,
                'banner_count' => $meta['banners'] ? SidebarSlider::count() : null,
                'is_published' => $record ? (bool) $record->is_published : true,
                'updated_at'   => optional($record?->updated_at)->toIso8601String(),
                'is_custom'    => false,
            ];
        })->values();

        // The operator's own pages sit under the fixed ones, newest last, so
        // the built-in list keeps the order people have learned.
        $custom = Page::custom()->orderBy('id')->get()->map(function (Page $page) {
            $meta = $page->customMeta();

            return [
                'field_count'  => 0,
                'fields_set'   => 0,
                'type'         => $page->type,
                'label'        => $meta['label'],
                'url'          => $meta['url'],
                'note'         => $meta['note'],
                'editable'     => true,
                'banners'      => false,
                'permission'   => null,
                'title'        => $page->title,
                'has_content'  => filled($page->content) || filled($page->title) || (is_array($page->blocks) && $page->blocks !== []),
                'block_count'  => is_array($page->blocks) ? count($page->blocks) : null,
                'banner_count' => null,
                'is_published' => (bool) $page->is_published,
                'updated_at'   => optional($page->updated_at)->toIso8601String(),
                'is_custom'    => true,
            ];
        });

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages->concat($custom)->values(),
        ]);
    }

    public function updateVisibility(Request $request, string $type)
    {
        $meta = Page::meta($type);
        abort_if(! $meta || ! $meta['editable'], 404);
        $data = $request->validate(['is_published' => 'required|boolean']);
        Page::updateOrCreate(['type' => $type], ['is_published' => $data['is_published']]);

        return redirect()->back()->with('success', 'Page visibility updated.');
    }

    /**
     * Create a page of the operator's own.
     *
     * It starts empty and opens straight in the editor: the widgets, slug and
     * everything else are set there, the same as for a built-in page.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug'  => 'nullable|string|max:255',
        ]);

        $page = Page::create([
            'type'         => Page::newCustomType(),
            'is_custom'    => true,
            'title'        => $data['title'],
            // The slug field is optional on the add dialog; the title is what
            // it would have been generated from anyway.
            'slug'         => Page::uniqueSlug(($data['slug'] ?? '') ?: $data['title']),
            'blocks'       => [],
            'content'      => '',
            'is_published' => true,
        ]);

        return redirect()
            ->route('admin.pages.edit', $page->type)
            ->with('success', 'Page created — add its content below.');
    }

    /**
     * Copy a page into a new one of the operator's own.
     *
     * Built-in pages can be copied too: the copy is a normal custom page with
     * its own address, which is the quickest way to start a new page from a
     * layout that already works.
     */
    public function duplicate(string $type)
    {
        $source = Page::where('type', $type)->first();
        $meta   = Page::meta($type);

        abort_if(! $meta, 404);

        $label = $source?->title ?: $meta['label'];

        $copy = Page::create([
            'type'             => Page::newCustomType(),
            'is_custom'        => true,
            'title'            => $label . ' (copy)',
            'slug'             => Page::uniqueSlug($label . ' copy'),
            'label'            => $source?->label,
            'subtitle'         => $source?->subtitle,
            'meta_title'       => $source?->meta_title,
            'meta_description' => $source?->meta_description,
            // A widget id only has to be unique within its own page, so the
            // blocks copy across as they are.
            'blocks'           => is_array($source?->blocks) ? $source->blocks : [],
            'content'          => $source?->content ?? '',
            // A copy starts hidden: it is not finished, and its slug is a
            // placeholder until the operator sets one.
            'is_published'     => false,
        ]);

        return redirect()
            ->route('admin.pages.edit', $copy->type)
            ->with('success', 'Page duplicated — set its address and publish when ready.');
    }

    /** The editor for one page: its widgets, settings and banners. */
    public function edit(string $type)
    {
        $meta = Page::meta($type);
        abort_if(! $meta, 404);

        $page = Page::firstOrNew(['type' => $type]);
        $site = SiteInfo::first();

        // Pages written before the widget editor arrive as one HTML block, so
        // the existing copy stays editable instead of being lost.
        $blocks = is_array($page->blocks) && $page->blocks !== []
            ? $page->blocks
            : $this->renderer->blocksFromContent($page->content);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => [
                'type'         => $type,
                'label'        => $meta['label'],
                // The line above the heading on the storefront, where the page
                // shows one. Distinct from $meta['label'], which names the page
                // in the admin listing.
                'page_label'   => $page->label,
                'has_label'    => Page::rendersLabel($type),
                // A page the operator created owns its address and its own
                // search-engine wording; a built-in page's URL is a route.
                'is_custom'    => (bool) $page->is_custom,
                'slug'         => $page->slug,
                'meta_title'   => $page->meta_title,
                'meta_description' => $page->meta_description,
                // Section headings, buttons and empty states this page shows.
                'texts'        => Page::textsFor($type),
                // Grouped into the sections the page renders, top to bottom.
                'text_sections' => $this->textSections($type),
                'title'        => $page->title,
                'subtitle'     => $page->subtitle,
                'url'          => $meta['url'],
                'note'         => $meta['note'],
                'editable'     => $meta['editable'],
                // Some pages carry wording only and render no widgets.
                'widgets'      => $meta['widgets'] ?? true,
                'banners'      => $meta['banners'],
                'is_published' => $page->exists ? (bool) $page->is_published : true,
                // Not every storefront page renders the title and subtitle.
                'has_header'   => Page::rendersHeader($type),
                'blocks'       => $blocks,
                'updated_at'   => optional($page->updated_at)->toIso8601String(),
                // Settings that belong to this page, previously spread across
                // the Settings screens.
                'fields'       => collect($meta['site_fields'])
                    ->map(fn ($field, $key) => $field + [
                        'key'   => $key,
                        'value' => $site?->{$key},
                    ])
                    ->values()
                    ->all(),
            ],
            'banners' => $meta['banners']
                ? SidebarSlider::ordered()->get(['id', 'image_path', 'mobile_image_path', 'sort_order', 'title', 'link_url', 'link_new_tab', 'is_active', 'heading', 'subtext', 'cta_label', 'cta_url', 'show_subtext', 'show_cta'])
                : [],
            // Options for the product-section widget.
            'categories' => $this->resolver->categoryOptions(),
        ]);
    }

    /**
     * The products a Product-section widget currently resolves to.
     *
     * Answers the Sequence modal in the page editor. It asks the resolver the
     * same question the storefront asks, so what the operator drags is exactly
     * what will render — and it returns the full candidate list rather than the
     * widget's limit, so a product below the fold can be promoted into it.
     */
    public function productSectionProducts(Request $request)
    {
        $data = $request->validate([
            'source'        => ['nullable', Rule::in(PageBlockResolver::SOURCES)],
            'category_id'   => 'nullable|integer|exists:categories,id',
            'limit'         => 'nullable|integer|min:1|max:' . PageBlockResolver::MAX_LIMIT,
            'product_ids'   => 'nullable|array|max:' . PageBlockResolver::MAX_CANDIDATES,
            'product_ids.*' => 'integer',
        ]);

        $limit = (int) ($data['limit'] ?? 4);

        $products = $this->resolver->sectionProducts($data, all: true)->map(fn ($product) => [
            'id'    => $product->id,
            'name'  => $product->product_name,
            'image' => $product->featured_image,
            'price' => $product->price,
        ]);

        return response()->json([
            'products' => $products->values(),
            // What the storefront will actually show, so the modal can mark the
            // cut-off rather than leaving the limit to be remembered.
            'limit'    => $limit,
        ]);
    }

    /**
     * Keep only what this page defines, in the shape its field expects.
     *
     * A repeater stores a list of rows with a fixed set of keys; a plain field
     * stores a string. Anything else is dropped rather than persisted, so a
     * stale or malformed value cannot reach the storefront.
     */
    private function cleanTexts(string $type, array $texts): array
    {
        $defined = Page::PAGE_TEXTS[$type] ?? [];
        $out = [];
        $cleared = [];

        foreach ($defined as $key => $field) {
            if (! array_key_exists($key, $texts)) {
                continue;
            }

            $value = $texts[$key];

            if (($field['type'] ?? '') === 'number') {
                $number = filter_var($value, FILTER_VALIDATE_INT);
                $out[$key] = (string) max($field['min'] ?? 1, min($field['max'] ?? 120, $number === false ? (int) $field['default'] : $number));
                continue;
            }

            if (($field['type'] ?? 'text') === 'toggle') {
                // Stored as '1' / '0' so it travels like any other text value.
                $out[$key] = in_array($value, ['0', 0, false, 'false'], true) ? '0' : '1';
                continue;
            }

            if (($field['type'] ?? 'text') !== 'repeater') {
                $out[$key] = is_string($value) ? $value : '';
                if ($out[$key] === '' && filled($field['default'] ?? null)) {
                    $cleared[] = $key;
                }
                continue;
            }

            if (! is_array($value)) {
                continue;
            }

            $subKeys = array_keys($field['fields'] ?? []);

            $rows = collect($value)
                ->filter(fn ($row) => is_array($row))
                ->map(fn ($row) => collect($row)->only($subKeys)
                    ->map(fn ($v) => is_string($v) ? $v : '')
                    ->all())
                // A row with nothing in it is a leftover, not content.
                ->reject(fn ($row) => collect($row)->filter(fn ($v) => trim($v) !== '')->isEmpty())
                ->values()
                ->all();

            $out[$key] = $rows;
        }

        if ($cleared !== []) {
            $out['_cleared_fields'] = $cleared;
        }

        return $out;
    }

    /**
     * A page's editable wording, grouped into collapsible sections.
     *
     * Order follows PAGE_SECTIONS, which mirrors the order the storefront
     * renders them, so the editor reads the same way as the page.
     */
    private function textSections(string $type): array
    {
        $fields = Page::PAGE_TEXTS[$type] ?? [];

        if ($fields === []) {
            return [];
        }

        $titles = Page::PAGE_SECTIONS[$type] ?? [];
        $grouped = [];

        foreach ($fields as $key => $field) {
            $section = $field['section'] ?? 'page';

            $grouped[$section][] = [
                'key'    => $key,
                'label'  => $field['label'],
                'type'   => $field['type'] ?? 'text',
                'help'   => $field['help'] ?? null,
                'fields' => $field['fields'] ?? null,
                'variant' => $field['variant'] ?? null,
                // A small on/off shown beside another field's label.
                'pair'    => $field['pair'] ?? null,
            ];
        }

        // Named sections first, in their declared order; anything else after.
        $ordered = [];

        foreach ($titles as $key => $title) {
            // A widget slot: the editor lists the widgets that render here.
            if (str_starts_with($key, 'widgets:')) {
                $ordered[] = ['key' => $key, 'title' => $title, 'fields' => [], 'widget_types' => [substr($key, 8)]];
                continue;
            }

            if (isset($grouped[$key])) {
                $ordered[] = ['key' => $key, 'title' => $title, 'fields' => $grouped[$key]];
                unset($grouped[$key]);
            }
        }

        foreach ($grouped as $key => $fieldSet) {
            $ordered[] = [
                'key'    => $key,
                'title'  => $key === 'page' ? 'Page text' : ucfirst(str_replace('_', ' ', $key)),
                'fields' => $fieldSet,
            ];
        }

        return $ordered;
    }

    /** Save the widgets and the page's own settings. */
    public function update(Request $request, string $type)
    {
        $meta = Page::meta($type);
        abort_if(! $meta, 404);

        // validate() returns only the keys it has rules for, so every widget
        // field needs one here or it is silently dropped on save.
        $rules = [
            'blocks'              => 'array',
            'blocks.*.id'         => 'nullable|string|max:64',
            'blocks.*.type'       => ['required', Rule::in(PageBlockRenderer::TYPES)],
            // Switched off in the editor: kept, but not shown on the site.
            'blocks.*.hidden'     => 'nullable|boolean',
            'blocks.*.title'      => 'nullable|string|max:255',
            'blocks.*.text'       => 'nullable|string',
            'blocks.*.level'      => 'nullable|integer|min:1|max:3',
            'blocks.*.html'       => 'nullable|string',
            'blocks.*.code'       => 'nullable|string',
            'blocks.*.url'        => 'nullable|string',
            'blocks.*.alt'        => 'nullable|string',
            'blocks.*.caption'    => 'nullable|string',
            'blocks.*.position'   => 'nullable|in:left,right',
            // video
            'blocks.*.video_url'  => 'nullable|string|max:500',
            // gallery
            'blocks.*.items'                => 'nullable|array|max:24',
            'blocks.*.items.*.url'          => 'nullable|string|max:500',
            'blocks.*.items.*.alt'          => 'nullable|string|max:255',
            'blocks.*.items.*.poster'       => 'nullable|string|max:500',
            // feature cards
            'blocks.*.items.*.title'        => 'nullable|string|max:120',
            'blocks.*.items.*.text'         => 'nullable|string|max:500',
            // product section
            'blocks.*.source'      => ['nullable', Rule::in(PageBlockResolver::SOURCES)],
            'blocks.*.category_id' => 'nullable|integer|exists:categories,id',
            'blocks.*.limit'       => 'nullable|integer|min:1|max:' . PageBlockResolver::MAX_LIMIT,
            // The manual sequence set in the widget's Sequence modal. Ids are
            // not checked against the products table: one may be deleted after
            // the sequence is saved, and the resolver already ignores whatever
            // no longer resolves.
            'blocks.*.product_ids'   => 'nullable|array|max:' . PageBlockResolver::MAX_CANDIDATES,
            'blocks.*.product_ids.*' => 'integer',
            'blocks.*.subtitle'    => 'nullable|string|max:500',
            'blocks.*.cta_label'   => 'nullable|string|max:100',
            'blocks.*.button_label' => 'nullable|string|max:100',
            'blocks.*.button_url'   => 'nullable|string|max:255',
            'blocks.*.cta_url'     => 'nullable|string|max:255',
            'blocks.*.columns'     => 'nullable|integer|min:2|max:6',
            'label'                => 'nullable|string|max:120',
            'texts'                => 'nullable|array',
            // A field is either a single string or a repeater's list of rows.
            'texts.*'              => 'nullable',
            'texts.*.*'            => 'nullable|array',
            'texts.*.*.*'          => 'nullable|string|max:5000',
            'title'                => 'nullable|string|max:255',
            'subtitle'             => 'nullable|string|max:1000',
            'is_published'         => 'boolean',
        ];

        $page = Page::firstOrNew(['type' => $type]);

        if ($page->is_custom) {
            // The address is the page: without a slug it answers nowhere, and
            // it must not collide with another page's.
            $rules['title'] = 'required|string|max:255';
            $rules['slug']  = [
                'required', 'string', 'max:255',
                Rule::unique('pages', 'slug')->ignore($page->id),
            ];
        }

        // Every page has its own search title and description.
        $rules['meta_title']       = 'nullable|string|max:255';
        $rules['meta_description'] = 'nullable|string|max:500';

        foreach ($meta['site_fields'] as $key => $field) {
            $rules['fields.' . $key] = match ($field['type']) {
                'email' => 'nullable|email',
                'url'   => 'nullable|url',
                default => 'nullable|string|max:2000',
            };
        }

        $data = $request->validate($rules);

        try {
            if ($meta['editable']) {
                $blocks = $data['blocks'] ?? [];

                $attributes = [
                    'label'        => $data['label'] ?? null,
                    // Only keys this page defines are stored, so a stale
                    // field cannot linger after a page changes.
                    'texts'        => $this->cleanTexts($type, $data['texts'] ?? []),
                    'title'        => $data['title'] ?? null,
                    'subtitle'     => $data['subtitle'] ?? null,
                    'blocks'       => $blocks,
                    'content'      => $this->renderer->render($blocks),
                    'is_published' => $request->boolean('is_published', true),
                    'meta_title'       => $data['meta_title'] ?? null,
                    'meta_description' => $data['meta_description'] ?? null,
                ];

                if ($page->is_custom) {
                    // Normalised rather than taken as typed, so a pasted title
                    // or a stray slash cannot produce an address that 404s.
                    $attributes['slug'] = Page::uniqueSlug($data['slug'], $page->id);
                }

                Page::updateOrCreate(['type' => $type], $attributes);
            }

            // Only this page's own fields are written, so the untouched site
            // settings (payment toggles, colours, shipping) are left alone.
            if ($meta['site_fields'] !== [] && isset($data['fields'])) {
                $fields = collect($data['fields'])
                    ->only(array_keys($meta['site_fields']))
                    ->all();

                if ($fields !== []) {
                    // The shop's row is whatever row exists — not necessarily
                    // id 1 — so write to that one rather than creating a second.
                    $site = SiteInfo::first() ?? new SiteInfo();
                    $site->fill($fields)->save();
                }
            }

            return redirect()->back()->with('success', 'Page updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating page: ' . $e->getMessage());

            return redirect()->back()->with('error', 'An error occurred while updating the page. Please try again.');
        }
    }

    /**
     * Clears a page: the storefront route stays, its copy is emptied.
     *
     * A page the operator created has no route of its own to keep, so the same
     * action removes it outright and its address stops answering.
     */
    public function destroy(string $type)
    {
        $meta = Page::meta($type);
        abort_if(! $meta || ! $meta['editable'], 404);

        $custom = Page::isCustomType($type);

        Page::where('type', $type)->delete();

        return redirect()->route('admin.pages.index')->with(
            'success',
            $custom ? 'Page deleted.' : 'Page content cleared.'
        );
    }
}
