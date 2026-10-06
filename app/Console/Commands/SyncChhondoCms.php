<?php

namespace App\Console\Commands;

use App\Models\LayoutSetting;
use App\Models\MenuItem;
use App\Models\Page;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Brings the CMS records in line with the Chhondo storefront.
 *
 * The storefront reads its wording from Content › Pages and Settings › Header
 * & footer. Records saved before the redesign still held the old wording
 * (English menu, old footer, old page titles), so this sets them to the copy
 * the site shows. Only CMS tables are touched — pages, layout_settings and
 * menu_items — and they are backed up to storage/app/cms-backups first.
 *
 * Page wording that has a field of its own needs nothing here: an unsaved
 * field falls back to its default, which is the Chhondo copy.
 */
class SyncChhondoCms extends Command
{
    protected $signature = 'cms:sync-chhondo
                            {--dry-run : Show what would change without saving}
                            {--rebrand-only : Only replace the old brand name and email in the CMS pages}';

    protected $description = 'Set the CMS page headers, home widgets, menu and footer to the Chhondo storefront copy';

    /** Page header (title, subtitle) per page. */
    private const HEADERS = [
        'shop' => [
            'title'    => 'আমাদের শাড়ির কালেকশন',
            'subtitle' => "আপনার দৈনন্দিন স্বাচ্ছন্দ্যের সাঁজকে আরেকটু আপন করে তুলতেই আমাদের এই\nঐতিহ্যবাহী প্রিমিয়াম সুতির আয়োজন।",
        ],
        'contact' => [
            'title'    => 'যোগাযোগ',
            'subtitle' => 'আপনার যেকোনো জিজ্ঞাসা বা মতামত আমাদের নির্দ্বিধায় জানাতে পারেন!',
        ],
        'refund' => [
            'title'    => 'রিফান্ড ও রিটার্ন পলিসি',
            'subtitle' => "আপনার সন্তুষ্টিই আমাদের সর্বোচ্চ চাওয়া। তবে যেহেতু আমাদের প্রতিটি পণ্য হাতে তৈরি (যেমন- হ্যান্ডপেইন্ট বা ব্লকপ্রিন্ট করা),\nতাই শাড়ি পরিবর্তন ও ফেরতের ক্ষেত্রে নিচের নিয়মগুলো প্রযোজ্য হবে।",
        ],
        'shipping_delivery' => [
            'title'    => 'রিফান্ড ও রিটার্ন পলিসি',
            'subtitle' => "আপনার সন্তুষ্টিই আমাদের সর্বোচ্চ চাওয়া। তবে যেহেতু আমাদের প্রতিটি পণ্য হাতে তৈরি (যেমন- হ্যান্ডপেইন্ট বা ব্লকপ্রিন্ট করা),\nতাই শাড়ি পরিবর্তন ও ফেরতের ক্ষেত্রে নিচের নিয়মগুলো প্রযোজ্য হবে।",
        ],
        'policies' => ['title' => 'প্রাইভেসি পলিসি', 'subtitle' => null],
        'terms'    => ['title' => 'শর্তাবলি', 'subtitle' => null],
        'track_order' => ['title' => 'Track Your Order', 'subtitle' => 'Enter your order ID to see real-time status'],
    ];

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');

        if (! $dry) {
            $this->backup();
        }

        if ($this->option('rebrand-only')) {
            DB::transaction(fn () => $this->rebrandPages($dry));
            $this->info($dry ? 'Dry run — nothing was saved.' : 'Old brand removed from the CMS pages.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($dry) {
            $this->rebrandPages($dry);
            $this->syncHeaders($dry);
            $this->syncHomeWidgets($dry);
            $this->syncMenu($dry);
            // Each step only writes when this is not a dry run.
            $this->syncLayout($dry);
        });

        LayoutSetting::forget();

        $this->info($dry ? 'Dry run — nothing was saved.' : 'CMS synced with the Chhondo storefront.');

        return self::SUCCESS;
    }

    private function backup(): void
    {
        $dir = storage_path('app/cms-backups');
        if (! is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $file = $dir . '/' . now()->format('Y-m-d_His') . '.json';
        file_put_contents($file, json_encode([
            'pages'           => DB::table('pages')->get(),
            'layout_settings' => DB::table('layout_settings')->get(),
            'menu_items'      => DB::table('menu_items')->get(),
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        $this->line("Backed up to {$file}");
    }

    /**
     * The old brand out of every CMS page: the name (চারুকথন / Charukothon)
     * becomes ছন্দ / Chhondo and the old address becomes the storefront's.
     * Links that still work as they are (the Facebook page) are left alone —
     * Brand::rebrand never rewrites a URL or an address.
     */
    private function rebrandPages(bool $dry): void
    {
        $fix = function ($value) use (&$fix) {
            if (is_array($value)) {
                return array_map($fix, $value);
            }
            if (! is_string($value)) {
                return $value;
            }

            $value = str_replace(
                ['http://charukothon.bd.0@gmail.com', 'https://charukothon.bd.0@gmail.com', 'charukothon.bd.0@gmail.com'],
                ['mailto:limu.sir@gmail.com', 'mailto:limu.sir@gmail.com', 'limu.sir@gmail.com'],
                $value
            );

            return \App\Support\Brand::rebrand($value);
        };

        foreach (Page::all() as $page) {
            $changed = [];

            foreach (['title', 'subtitle', 'label', 'meta_title', 'meta_description', 'content', 'texts', 'blocks'] as $column) {
                $before = $page->{$column};
                $after = $fix($before);

                if ($after !== $before) {
                    $page->{$column} = $after;
                    $changed[] = $column;
                }
            }

            if ($changed) {
                $this->line(sprintf('  rebrand %-18s %s', $page->type, implode(', ', $changed)));
                if (! $dry) {
                    $page->save();
                }
            }
        }
    }

    private function syncHeaders(bool $dry): void
    {
        foreach (self::HEADERS as $type => $header) {
            $page = Page::firstOrNew(['type' => $type]);
            $this->line(sprintf('  page %-18s title: %s → %s', $type, $page->title ?: '—', $header['title']));

            if (! $dry) {
                $page->fill($header);
                if (! $page->exists) {
                    $page->is_published = true;
                }
                $page->save();
            }
        }
    }

    /**
     * The first product section is "শারদীয় কালেকশন" and the banner carries the
     * campaign line; the products and links chosen for them stay as they are.
     */
    private function syncHomeWidgets(bool $dry): void
    {
        $page = Page::where('type', 'home')->first();
        if (! $page || ! is_array($page->blocks)) {
            return;
        }

        $blocks = $page->blocks;
        $firstSection = true;

        foreach ($blocks as $i => $block) {
            if (($block['type'] ?? null) === 'product_section' && $firstSection) {
                $firstSection = false;
                $blocks[$i]['title'] = 'শারদীয় কালেকশন';
                $blocks[$i]['subtitle'] = 'নিখুঁত কারুকার্যে সাজিয়ে তুলুন নিজেকে, যেখানে শাড়ির আভিজাত্যের';
                $blocks[$i]['cta_label'] = 'আরো দেখুন';
                $this->line('  home widget: first product section → শারদীয় কালেকশন');
            }

            if (($block['type'] ?? null) === 'cta_banner') {
                $blocks[$i]['title'] = "শারদ স্নিগ্ধতায় উদ্‌যাপিত\nহোক উৎসবের আনন্দ";
                $blocks[$i]['text'] = null;
                $blocks[$i]['button_label'] = 'এখনই কিনুন';
                $this->line('  home widget: banner → শারদ স্নিগ্ধতায় উদ্‌যাপিত…');
            }
        }

        if (! $dry) {
            $page->blocks = $blocks;
            $page->save();
        }
    }

    /** The four header items, matched by what they point at. */
    private function syncMenu(bool $dry): void
    {
        $puja = DB::table('categories')->where('name', 'like', '%পূজা%')->value('slug');

        $plan = [
            ['match' => fn ($m) => $m->type === 'categories', 'set' => ['label' => 'শাড়ি', 'url' => '/shop', 'category_ids' => null, 'sort_order' => 0]],
            // Matched on its old link or the one it was given, so a second run finds it.
            ['match' => fn ($m) => $m->url === '/blog' || $m->label === 'শারদীয় কালেকশন' || ($puja && $m->url === '/product-category/' . $puja), 'set' => ['label' => 'শারদীয় কালেকশন', 'url' => $puja ? '/product-category/' . $puja : '/shop', 'sort_order' => 1]],
            ['match' => fn ($m) => $m->url === '/about-us', 'set' => ['label' => 'আমাদের গল্প', 'sort_order' => 2]],
            ['match' => fn ($m) => $m->url === '/contact-us', 'set' => ['label' => 'যোগাযোগ করুন', 'sort_order' => 3]],
        ];

        $items = MenuItem::where('location', 'header')->whereNull('parent_id')->get();

        foreach ($plan as $step) {
            $item = $items->first($step['match']);

            if (! $item) {
                $item = new MenuItem(['location' => 'header', 'type' => 'link', 'target' => '_self', 'is_active' => true, 'url' => $step['set']['url'] ?? '/']);
            }

            $this->line(sprintf('  menu  %s → %s', $item->label ?: '(new)', $step['set']['label']));

            if (! $dry) {
                $item->fill($step['set'] + ['is_active' => true])->save();
            }
        }
    }

    private function syncLayout(bool $dry): void
    {
        $defaults = LayoutSetting::defaults('footer');
        $footer = LayoutSetting::get('footer');

        foreach (['about_text', 'columns', 'contact_title', 'contact_address', 'contact_email', 'contact_phone', 'show_badges', 'copyright', 'legal_links'] as $key) {
            $footer[$key] = $defaults[$key];
        }
        $footer['show_logo'] = true;
        $footer['show_contact'] = true;
        $this->line('  footer → Chhondo about text, links, contact, copyright');

        $header = LayoutSetting::get('header');
        $header['mobile_links'] = LayoutSetting::defaults('header')['mobile_links'];
        $this->line('  header drawer links → Bangla labels');

        if (! $dry) {
            LayoutSetting::put('footer', $footer);
            LayoutSetting::put('header', $header);
        }
    }
}
