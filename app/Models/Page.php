<?php

namespace App\Models;

use App\Support\Slug;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'type', 'slug', 'is_custom', 'label', 'title', 'subtitle',
        'meta_title', 'meta_description', 'texts', 'content', 'blocks', 'is_published',
    ];

    protected $casts = [
        'blocks'       => 'array',
        'texts'        => 'array',
        'is_published' => 'boolean',
        'is_custom'    => 'boolean',
    ];

    /**
     * `type` prefix for a page the operator created.
     *
     * Custom pages share this table and this editor with the fixed storefront
     * pages; the prefix is what tells them apart without a lookup, and it is
     * generated once so the admin URL survives a slug rename.
     */
    public const CUSTOM_PREFIX = 'custom-';

    /** Whether a page key belongs to a page the operator created. */
    public static function isCustomType(string $type): bool
    {
        return str_starts_with($type, self::CUSTOM_PREFIX);
    }

    /** Pages the operator created, newest first. */
    public function scopeCustom($query)
    {
        return $query->where('is_custom', true);
    }

    /** A `type` no other page is using. */
    public static function newCustomType(): string
    {
        do {
            $type = self::CUSTOM_PREFIX . bin2hex(random_bytes(6));
        } while (self::where('type', $type)->exists());

        return $type;
    }

    /** A slug no other page is using, suffixing -2, -3, … on collision. */
    public static function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        return Slug::unique($value, 'pages', ignoreId: $ignoreId, fallback: 'page');
    }

    /**
     * This row described the way a PAGES entry is, so the listing and the
     * editor can treat a custom page exactly like a fixed one.
     */
    public function customMeta(): array
    {
        return [
            'label'       => $this->title ?: 'Untitled page',
            'url'         => $this->slug ? '/' . $this->slug : null,
            'banners'     => false,
            'editable'    => true,
            'permission'  => null,
            'note'        => 'A page you created. Its address is the slug set in the editor.',
            'site_fields' => [],
        ];
    }

    /**
     * The wording for one page: what the admin has saved, with the wording the
     * component ships with filling every gap. A page always gets a complete
     * set, so the storefront never has to repeat the defaults.
     */
    public static function textsFor(string $type): array
    {
        $defined = self::PAGE_TEXTS[$type] ?? [];

        if ($defined === []) {
            return [];
        }

        $saved = self::where('type', $type)->value('texts');
        $saved = is_array($saved) ? $saved : [];

        $out = [];

        foreach ($defined as $key => $meta) {
            $value = $saved[$key] ?? null;

            // A saved list stands even when every row was deleted; each row
            // gains any field added since it was saved (a switch starts on).
            if (($meta['type'] ?? 'text') === 'repeater' && is_array($value)) {
                $blank = collect($meta['fields'] ?? [])
                    ->map(fn ($sub) => ($sub['type'] ?? 'text') === 'toggle' ? '1' : '')
                    ->all();
                $out[$key] = array_map(fn ($row) => is_array($row) ? $row + $blank : $blank, array_values($value));
                continue;
            }

            $cleared = in_array($key, $saved['_cleared_fields'] ?? [], true);
            $out[$key] = $cleared ? '' : (filled($value) ? $value : $meta['default']);
        }

        return $out;
    }

    /**
     * Pages whose storefront component actually renders the title and subtitle
     * edited in "Page header".
     *
     * The others lay out their own heading and ignore both fields, so the card
     * is hidden for them rather than offering an edit that does nothing.
     */
    public const HEADER_PAGES = [
        'blog', 'categories', 'contact', 'policies',
        'refund', 'shipping_delivery', 'shop', 'terms', 'track_order',
    ];

    /** Whether the "Page header" card applies to this page. */
    public static function rendersHeader(string $type): bool
    {
        return in_array($type, self::HEADER_PAGES, true);
    }

    /**
     * Pages that show a small label above the heading. Only the blog does, so
     * the field is not offered where it would do nothing.
     */
    public const LABEL_PAGES = ['blog'];

    public static function rendersLabel(string $type): bool
    {
        return in_array($type, self::LABEL_PAGES, true);
    }

    const TYPES = [
        'POLICIES' => 'policies',
        'TERMS' => 'terms',
        'REFUND' => 'refund',
        'SALES_SUPPORT' => 'sales_support',
        'SHIPPING_DELIVERY' => 'shipping_delivery',
        'ABOUT' => 'about',
    ];

    /**
     * How a page's fields are grouped in the editor, top to bottom in the same
     * order the page renders them. Grouping is presentation only — the frontend
     * bindings are unchanged by it.
     */
    public const PAGE_SECTIONS = [
        'home' => [
            'page' => 'পেজ',
            'hero' => 'উৎসবের আমেজে বাঙালিয়ানা সাজ',
            // "widgets:" entries list the page's widgets at the point they render.
            'widgets:product_section' => 'শারদীয় কালেকশন — পণ্য সেকশন',
            'gallery' => 'ছবির সারি',
            'widgets:cta_banner' => 'শারদ স্নিগ্ধতায় উদ্‌যাপিত — ব্যানার',
            'widgets:video_strip' => 'ভিডিও স্ট্রিপ',
            'story_dark' => 'আপনার সাজে মিশে থাক ছন্দ',
            'story_light' => 'ঐতিহ্য, যা বয়ে চলে আপনারই সঙ্গে',
            'reviews' => 'ছন্দময়ীদের গল্প',
            'editorial' => 'খুঁজে নিন আপনার নিজস্ব \'ছন্দ\'',
            'widgets:other' => 'অন্যান্য উইজেট',
            'campaign' => 'বিশেষ অফার — ক্যাম্পেইন (কাউন্টডাউন অফার)',
        ],
        'about' => [
            'page' => 'পেজ',
            'hero' => 'ঐতিহ্যের ক্যানভাসে তারুণ্যের গল্প',
            'band' => 'নিত্যদিনের পথচলায় স্নিগ্ধতার ছন্দ',
            'craft' => 'প্রতিটি শাড়িতে বোনা কারিগরের পরম মমতা',
            'values' => '\'ছন্দ\' যে তিন দর্শনে বিশ্বাসী',
            'quote' => 'প্রতিষ্ঠাতার কথা',
        ],
        'contact' => [
            'page' => 'পেজ',
            'form' => 'ডেলিভারির ঠিকানা',
        ],
        'refund' => [
            'page' => 'পেজ',
            'sections' => 'নীতিমালা',
            'contact' => 'যোগাযোগ',
        ],
        'shipping_delivery' => [
            'page' => 'পেজ',
            'sections' => 'নীতিমালা',
            'contact' => 'যোগাযোগ',
        ],
        'auth' => [
            'login' => 'লগ ইন',
            'register' => 'অ্যাকাউন্ট খুলুন',
            'collage' => 'ছবির কোলাজ',
        ],
        'blog' => [
            'page' => 'পেজ',
            'listing' => 'সব লেখা',
        ],
        'checkout' => [
            'page' => 'পেজ',
            'breadcrumb' => 'ব্রেডক্রাম্ব',
        ],
        'track_order' => [
            'page' => 'পেজ',
            'search' => 'অর্ডার খুঁজুন',
            'result' => 'অর্ডারের বিস্তারিত',
        ],
        'shop' => [
            'page' => 'পেজ',
        ],
        'cart' => [
            'page' => 'পেজ',
        ],
        'categories' => [
            'page' => 'পেজ',
        ],
        'policies' => [
            'page' => 'পেজ',
        ],
        'terms' => [
            'page' => 'পেজ',
        ],
        'not_found' => [
            'page' => 'পেজ',
        ],
        'order_success' => [
            'page' => 'পেজ',
        ],
    ];

    /**
     * Wording each page shows outside its body copy.
     *
     * Every default here is the exact string the component shipped with, so a
     * page reads identically until someone changes it. Grouped by page so the
     * editor can show them where they belong.
     */
    public const PAGE_TEXTS = [
        'home' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'হোম',
            ],
            'hero_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show the hero',
                'default' => '1',
            ],
            'hero_eyebrow_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show the small line',
                'default' => '1',
            ],
            'hero_eyebrow' => [
                'section' => 'hero',
                'label' => 'Small line above the heading',
                'default' => '(বিশেষ আয়োজন)',
            ],
            'hero_title' => [
                'section' => 'hero',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'উৎসবের আমেজে
বাঙালিয়ানা সাজ',
            ],
            'hero_cta_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show the button',
                'default' => '1',
            ],
            'hero_cta_label' => [
                'section' => 'hero',
                'label' => 'Button text',
                'default' => 'স্নিগ্ধতায় সাজুন',
            ],
            'hero_cta_url' => [
                'section' => 'hero',
                'label' => 'Button link',
                'default' => '/shop',
            ],
            'hero_image_desktop' => [
                'section' => 'hero',
                'type' => 'banner',
                'variant' => 'desktop',
                'label' => 'Desktop Banner',
                'help' => 'Shown on computers and tablets. Best at 1920 × 848 px.',
                'default' => '/assets/chhondo/hero-home-desktop.webp',
            ],
            'hero_image_mobile' => [
                'section' => 'hero',
                'type' => 'banner',
                'variant' => 'mobile',
                'label' => 'Mobile Banner',
                'help' => 'Shown on phones. Best at 804 × 1024 px (402 × 512 shape).',
                'default' => '/assets/chhondo/hero-home-mobile.webp',
            ],
            'hero_slideshow_enabled' => [
                'section' => 'hero', 'type' => 'toggle', 'label' => 'Use banner slideshow', 'default' => '0',
            ],
            'hero_autoplay_enabled' => [
                'section' => 'hero', 'type' => 'toggle', 'label' => 'Automatically change banners', 'default' => '1',
            ],
            'hero_slide_seconds' => [
                'section' => 'hero', 'type' => 'number', 'label' => 'Banner change interval (seconds)', 'default' => '5', 'min' => 1, 'max' => 120,
            ],
            'gallery_show' => [
                'section' => 'gallery',
                'type' => 'toggle',
                'label' => 'Show the photo strip',
                'default' => '1',
            ],
            'gallery' => [
                'section' => 'gallery',
                'type' => 'repeater',
                'label' => 'Photos',
                'help' => 'Add, remove, reorder or hide photos. Leave the link empty to open the matching product from the first product section.',
                'fields' => [
                    'image' => [
                        'label' => 'Photo',
                        'type' => 'image',
                    ],
                    'url' => [
                        'label' => 'Link (optional)',
                        'type' => 'text',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'image' => '/assets/chhondo/home/gallery-1.webp',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/gallery-2.webp',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/gallery-3.webp',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/gallery-4.webp',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/gallery-1.webp',
                        'url' => '',
                        'show' => '1',
                    ],
                ],
            ],
            'story_dark_show' => [
                'section' => 'story_dark',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'story_dark_title' => [
                'section' => 'story_dark',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'আপনার সাজে মিশে
*থাক ছন্দ*',
            ],
            'story_dark_text_show' => [
                'section' => 'story_dark',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'story_dark_text' => [
                'section' => 'story_dark',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'ঐতিহ্যের সঙ্গে আধুনিকতার অপূর্ব মেলবন্ধন আর আপনার জীবনের প্রতিটি সুন্দর মুহূর্তের ছন্দের সঙ্গে মানিয়ে নিতেই আমাদের এই স্নিগ্ধ আয়োজন।',
            ],
            'story_dark_button_show' => [
                'section' => 'story_dark',
                'type' => 'toggle',
                'label' => 'Show the button',
                'default' => '1',
            ],
            'story_dark_button_label' => [
                'section' => 'story_dark',
                'label' => 'Button text',
                'default' => 'স্বাচ্ছন্দ্য বেছে নিন',
            ],
            'story_dark_button_url' => [
                'section' => 'story_dark',
                'label' => 'Button link',
                'default' => '/shop',
            ],
            'story_dark_image_1' => [
                'section' => 'story_dark',
                'type' => 'image',
                'label' => 'Photo 1',
                'default' => '/assets/chhondo/home/story-dark-1.webp',
            ],
            'story_dark_image_2' => [
                'section' => 'story_dark',
                'type' => 'image',
                'label' => 'Photo 2',
                'default' => '/assets/chhondo/home/story-dark-2.webp',
            ],
            'story_light_show' => [
                'section' => 'story_light',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'story_light_title' => [
                'section' => 'story_light',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'ঐতিহ্য, যা বয়ে
চলে *আপনারই সঙ্গে*',
            ],
            'story_light_text_show' => [
                'section' => 'story_light',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'story_light_text' => [
                'section' => 'story_light',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'বাংলার চিরায়ত ঐতিহ্যকে আধুনিকতায় রূপ দিয়েছে \'ছন্দ\'। নিপুণ কারুকাজ, স্নিগ্ধ সুতো আর ব্লক প্রিন্টের নান্দনিকতায় সাজানো প্রতিটি শাড়ি আপনার সাজে যোগ করে আভিজাত্য।',
            ],
            'story_light_link' => [
                'section' => 'story_light',
                'label' => 'Photo link',
                'default' => '/shop',
            ],
            'story_light_image_1' => [
                'section' => 'story_light',
                'type' => 'image',
                'label' => 'Photo — back',
                'default' => '/assets/chhondo/home/story-light-1.webp',
            ],
            'story_light_image_2' => [
                'section' => 'story_light',
                'type' => 'image',
                'label' => 'Photo — front',
                'default' => '/assets/chhondo/home/story-light-2.webp',
            ],
            'reviews_show' => [
                'section' => 'reviews',
                'type' => 'toggle',
                'label' => 'Show customer reviews',
                'default' => '1',
            ],
            'reviews_title' => [
                'section' => 'reviews',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. The reviews themselves are managed under Content › Reviews.',
                'default' => 'ছন্দময়ীদের *গল্প*',
            ],
            'editorial_show' => [
                'section' => 'editorial',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'editorial_title' => [
                'section' => 'editorial',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'খুঁজে নিন আপনার *নিজস্ব \'ছন্দ\'*',
            ],
            'editorial_text_show' => [
                'section' => 'editorial',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'editorial_text' => [
                'section' => 'editorial',
                'type' => 'textarea',
                'label' => 'Text',
                'help' => 'A new line breaks the text on wide screens only.',
                'default' => 'প্রতিদিনের স্নিগ্ধতা থেকে শুরু করে উৎসবের আনন্দ, আপনার প্রতিটি মুহূর্ত আর অনুভূতির সঙ্গে মানানসই
শাড়ির সমাহার ঘুরে দেখুন।',
            ],
            'editorial_explore_show' => [
                'section' => 'editorial',
                'type' => 'toggle',
                'label' => 'Show the link text on tiles',
                'default' => '1',
            ],
            'editorial_explore' => [
                'section' => 'editorial',
                'label' => 'Link text on each tile',
                'default' => 'এক্সপ্লোর করুন',
            ],
            'editorial_cards' => [
                'section' => 'editorial',
                'type' => 'repeater',
                'label' => 'Tiles',
                'help' => 'The first tile is the tall one. Leave the link empty to open the category in the same position.',
                'fields' => [
                    'image' => [
                        'label' => 'Photo',
                        'type' => 'image',
                    ],
                    'title' => [
                        'label' => 'Title',
                        'type' => 'text',
                    ],
                    'subtitle' => [
                        'label' => 'Subtitle',
                        'type' => 'text',
                    ],
                    'url' => [
                        'label' => 'Link (optional)',
                        'type' => 'text',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'image' => '/assets/chhondo/home/editorial-1.webp',
                        'title' => 'নতুন কালেকশন',
                        'subtitle' => 'নতুন মৌসুমের ট্রেন্ডি কালেকশন',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/editorial-2.webp',
                        'title' => 'শাড়ির সমাহার',
                        'subtitle' => 'ঐতিহ্যের নান্দনিক ছোঁয়া',
                        'url' => '',
                        'show' => '1',
                    ],
                    [
                        'image' => '/assets/chhondo/home/editorial-3.webp',
                        'title' => 'রোজকার আভিজাত্য',
                        'subtitle' => 'প্রতিদিনের ব্যবহারে আরামদায়ক শাড়ি',
                        'url' => '',
                        'show' => '1',
                    ],
                ],
            ],
            'campaign_show' => [
                'section' => 'campaign',
                'type' => 'toggle',
                'label' => 'Show campaign sections (Marketing › Campaigns, with a countdown) — not the product-section widgets',
                'default' => '1',
            ],
            't2' => [
                'section' => 'campaign',
                'label' => 'Badge above the campaign name',
                'default' => 'বিশেষ অফার',
            ],
            't3' => [
                'section' => 'campaign',
                'label' => 'Countdown label',
                'default' => 'শেষ হবে:',
            ],
            't4' => [
                'section' => 'campaign',
                'label' => 'Sale badge on product photos',
                'default' => 'SALE',
            ],
            't5' => [
                'section' => 'campaign',
                'label' => 'Quick preview button',
                'default' => 'Quick Preview',
            ],
            't6' => [
                'section' => 'campaign',
                'label' => 'Order button',
                'default' => 'অর্ডার করুন',
            ],
        ],
        'shop' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'শপ',
            ],
            'breadcrumb' => [
                'section' => 'page',
                'label' => 'Breadcrumb',
                'default' => 'শপ',
            ],
            'category_title' => [
                'section' => 'page',
                'label' => 'Heading when a category is chosen',
                'help' => '{category} is replaced by the category name. A category\'s own title (Categories › Edit) wins over this.',
                'default' => 'আমাদের সব {category}',
            ],
        ],
        'contact' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'যোগাযোগ',
            ],
            'card_title' => [
                'section' => 'form',
                'label' => 'Form heading',
                'default' => 'ডেলিভারির ঠিকানা',
            ],
            'form_show' => [
                'section' => 'form',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'email_label' => [
                'section' => 'form',
                'label' => 'Email — label',
                'default' => 'ইমেইল',
            ],
            'email_placeholder' => [
                'section' => 'form',
                'label' => 'Email — placeholder',
                'default' => 'example@email.com',
            ],
            'email_hint_show' => [
                'section' => 'form',
                'type' => 'toggle',
                'label' => 'Show the note under the email field',
                'default' => '1',
            ],
            'email_hint' => [
                'section' => 'form',
                'label' => 'Email — note under the field',
                'default' => 'Please provide your email address to receive your cash memo.',
            ],
            'phone_label' => [
                'section' => 'form',
                'label' => 'Phone — label',
                'default' => 'ফোন নম্বর',
            ],
            'phone_placeholder' => [
                'section' => 'form',
                'label' => 'Phone — placeholder',
                'default' => '01XXXXXXXXX',
            ],
            'name_label' => [
                'section' => 'form',
                'label' => 'Name — label',
                'default' => 'নাম',
            ],
            'name_placeholder' => [
                'section' => 'form',
                'label' => 'Name — placeholder',
                'default' => 'সম্পূর্ণ নাম',
            ],
            'message_label' => [
                'section' => 'form',
                'label' => 'Message — label',
                'default' => 'বার্তা',
            ],
            'message_placeholder' => [
                'section' => 'form',
                'label' => 'Message — placeholder',
                'default' => 'আপনার বার্তাটি লিখুন',
            ],
            'submit_label' => [
                'section' => 'form',
                'label' => 'Button',
                'default' => 'জমা দিন',
            ],
            'sending_label' => [
                'section' => 'form',
                'label' => 'Button while sending',
                'default' => 'পাঠানো হচ্ছে…',
            ],
        ],
        'checkout' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'চেকআউট',
            ],
            'breadcrumb_show' => [
                'section' => 'breadcrumb',
                'type' => 'toggle',
                'label' => 'Show the breadcrumb',
                'default' => '1',
            ],
            'crumbs' => [
                'section' => 'breadcrumb',
                'type' => 'repeater',
                'label' => 'Breadcrumb links',
                'help' => 'Shown in order before the last item.',
                'fields' => [
                    'label' => [
                        'label' => 'Text',
                        'type' => 'text',
                    ],
                    'url' => [
                        'label' => 'Link',
                        'type' => 'text',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'label' => 'শপ',
                        'url' => '/shop',
                        'show' => '1',
                    ],
                    [
                        'label' => 'শাড়ি',
                        'url' => '/shop',
                        'show' => '1',
                    ],
                ],
            ],
            'crumb_current' => [
                'section' => 'breadcrumb',
                'label' => 'Last item',
                'default' => 'সুতির শাড়ি',
            ],
        ],
        'categories' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'ক্যাটাগরি',
            ],
            't2' => [
                'section' => 'page',
                'label' => 'Message when there are no categories',
                'default' => 'No categories available',
            ],
        ],
        'cart' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'কার্ট',
            ],
        ],
        'track_order' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'অর্ডার ট্র্যাক',
            ],
            'search_placeholder' => [
                'section' => 'search',
                'label' => 'Search box placeholder',
                'default' => 'e.g. CHK-2025-0481',
            ],
            'search_show' => [
                'section' => 'search',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'search_button' => [
                'section' => 'search',
                'label' => 'Button',
                'default' => 'Track',
            ],
            'search_loading' => [
                'section' => 'search',
                'label' => 'Button while searching',
                'default' => 'Searching...',
            ],
            'search_empty' => [
                'section' => 'search',
                'label' => 'Message when the box is empty',
                'default' => 'Please enter a valid invoice number.',
            ],
            'search_not_found' => [
                'section' => 'search',
                'label' => 'Message when no order matches',
                'default' => 'Order not found.',
            ],
            't13' => [
                'section' => 'result',
                'label' => 'Invoice prefix',
                'default' => 'Invoice #',
            ],
            'result_show' => [
                'section' => 'result',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            't14' => [
                'section' => 'result',
                'label' => 'Item count word',
                'default' => 'item',
            ],
            't2' => [
                'section' => 'result',
                'label' => 'Order card heading',
                'default' => 'Order Details',
            ],
            't3' => [
                'section' => 'result',
                'label' => 'Customer label',
                'default' => 'Customer',
            ],
            't4' => [
                'section' => 'result',
                'label' => 'Total label',
                'default' => 'Total Amount',
            ],
            't5' => [
                'section' => 'result',
                'label' => 'Items heading',
                'default' => 'Order Items',
            ],
            't6' => [
                'section' => 'result',
                'label' => 'Column — product',
                'default' => 'Product',
            ],
            't7' => [
                'section' => 'result',
                'label' => 'Column — quantity',
                'default' => 'Qty',
            ],
            't8' => [
                'section' => 'result',
                'label' => 'Column — price',
                'default' => 'Price',
            ],
            't9' => [
                'section' => 'result',
                'label' => 'Column — total',
                'default' => 'Total',
            ],
            't10' => [
                'section' => 'result',
                'label' => 'Quantity label (phone)',
                'default' => 'Qty:',
            ],
            't11' => [
                'section' => 'result',
                'label' => 'Price label (phone)',
                'default' => 'Price:',
            ],
            't12' => [
                'section' => 'result',
                'label' => 'Grand total label',
                'default' => 'Grand Total',
            ],
        ],
        'order_success' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'অর্ডার সফল হয়েছে',
            ],
            'title' => [
                'section' => 'page',
                'label' => 'Heading',
                'default' => 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!',
            ],
            'text_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'text' => [
                'section' => 'page',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'আপনাকে অসংখ্য ধন্যবাদ! আপনার অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে এবং খুব শিগগিরই আপনার ঠিকানায় পৌঁছে দেওয়া হবে। ঢাকার ভেতরে ১-২ দিন এবং ঢাকার বাইরে ২-৩ দিনের মধ্যে ডেলিভারি পেয়ে যাবেন। অনুগ্রহ করে ডেলিভারিম্যানের সামনেই প্রোডাক্ট চেক করে নেওয়ার অনুরোধ রইল।',
            ],
            'invoice_label' => [
                'section' => 'page',
                'label' => 'Invoice label',
                'default' => 'ইনভয়েস নম্বর #:',
            ],
            'customer_label' => [
                'section' => 'page',
                'label' => 'Customer label',
                'default' => 'কাস্টমার:',
            ],
            'total_label' => [
                'section' => 'page',
                'label' => 'Total label',
                'default' => 'মোট মূল্য:',
            ],
            'status_label' => [
                'section' => 'page',
                'label' => 'Status label',
                'default' => 'স্ট্যাটাস:',
            ],
            'button_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show the button',
                'default' => '1',
            ],
            'button_label' => [
                'section' => 'page',
                'label' => 'Button text',
                'default' => 'হোম পেজে যান',
            ],
            'button_url' => [
                'section' => 'page',
                'label' => 'Button link',
                'default' => '/',
            ],
        ],
        'blog' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'ব্লগ',
            ],
            'meta_description' => [
                'section' => 'page',
                'type' => 'textarea',
                'label' => 'Search engine description',
                'default' => 'শাড়ির যত্ন, স্টাইল গাইড আর তাঁতের গল্প — ছন্দের ব্লগ।',
            ],
            't5' => [
                'section' => 'listing',
                'label' => 'Reading time word',
                'default' => 'মিনিট পড়া',
            ],
            'listing_show' => [
                'section' => 'listing',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            't2' => [
                'section' => 'listing',
                'label' => '“All posts” filter',
                'default' => 'সব লেখা',
            ],
            't3' => [
                'section' => 'listing',
                'label' => 'Message when there are no posts',
                'default' => 'এই মুহূর্তে কোনো লেখা নেই। খুব শিগগিরই নতুন লেখা আসছে।',
            ],
            't4' => [
                'section' => 'listing',
                'label' => 'Read-more link',
                'default' => 'পড়ুন →',
            ],
        ],
        'about' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'আমাদের গল্প',
            ],
            'hero_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'hero_title' => [
                'section' => 'hero',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'ঐতিহ্যের ক্যানভাসে
*তারুণ্যের গল্প*',
            ],
            'hero_text_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'hero_text' => [
                'section' => 'hero',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'ছন্দ এই প্রজন্মের স্বাধীনচেতা নারীদের আত্মপ্রকাশের মাধ্যম। চিরায়ত ব্লক প্রিন্ট আর আরামদায়ক সুতোর বুননে আমরা তৈরি করি এমন সব শাড়ি, যা প্রতিদিনের জীবনে নিয়ে আসে স্নিগ্ধতা আর আভিজাত্য। ক্যাম্পাসের আড্ডা হোক বা অফিসের ব্যস্ততা, আমাদের লক্ষ্য হলো শাড়িকে আপনার প্রাত্যহিক স্বাচ্ছন্দ্যের অংশ করে তোলা। ঐতিহ্যের সঙ্গে আধুনিকতার এই মেলবন্ধনেই বোনা হচ্ছে আমাদের প্রতিটি নকশা।',
            ],
            'hero_image_1' => [
                'section' => 'hero',
                'type' => 'image',
                'label' => 'Photo — top left',
                'default' => '/assets/chhondo/about/hero-1.jpg',
            ],
            'hero_image_2' => [
                'section' => 'hero',
                'type' => 'image',
                'label' => 'Photo — top right',
                'default' => '/assets/chhondo/about/hero-4.jpg',
            ],
            'hero_image_3' => [
                'section' => 'hero',
                'type' => 'image',
                'label' => 'Photo — bottom left',
                'default' => '/assets/chhondo/about/hero-2.jpg',
            ],
            'hero_image_4' => [
                'section' => 'hero',
                'type' => 'image',
                'label' => 'Photo — bottom right',
                'default' => '/assets/chhondo/about/hero-3.jpg',
            ],
            'stats_show' => [
                'section' => 'hero',
                'type' => 'toggle',
                'label' => 'Show the figures',
                'default' => '1',
            ],
            'stats' => [
                'section' => 'hero',
                'type' => 'repeater',
                'label' => 'Figures',
                'help' => 'A new line in the label breaks it in two.',
                'fields' => [
                    'value' => [
                        'label' => 'Figure',
                        'type' => 'text',
                    ],
                    'label' => [
                        'label' => 'Label',
                        'type' => 'textarea',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'value' => '১০০%',
                        'label' => 'দেশীয়
বুনন',
                        'show' => '1',
                    ],
                    [
                        'value' => '২০+',
                        'label' => 'এক্সক্লুসিভ
ডিজাইন',
                        'show' => '1',
                    ],
                    [
                        'value' => '৮,০০০+',
                        'label' => 'Happy
Customers',
                        'show' => '1',
                    ],
                ],
            ],
            'band_show' => [
                'section' => 'band',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'band_title' => [
                'section' => 'band',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'নিত্যদিনের পথচলায়
*স্নিগ্ধতার ছন্দ*',
            ],
            'band_text_show' => [
                'section' => 'band',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'band_text' => [
                'section' => 'band',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'প্রতিদিনের সাজে শাড়িতেই খুঁজে নিন স্বস্তির আনন্দ। \'ছন্দ\'-এর প্রতিটি শাড়িতে আছে তারুণ্যের উচ্ছ্বাস। আপনার প্রতিদিনের মুহূর্তকে আরও আত্মবিশ্বাসী ও প্রাণবন্ত করে তুলতেই আমাদের এই বিশেষ আয়োজন।',
            ],
            'band_button_show' => [
                'section' => 'band',
                'type' => 'toggle',
                'label' => 'Show the button',
                'default' => '1',
            ],
            'band_button_label' => [
                'section' => 'band',
                'label' => 'Button text',
                'default' => 'কালেকশন দেখুন',
            ],
            'band_button_url' => [
                'section' => 'band',
                'label' => 'Button link',
                'default' => '/shop',
            ],
            'band_image_1' => [
                'section' => 'band',
                'type' => 'image',
                'label' => 'Photo — short',
                'default' => '/assets/chhondo/about/everyday-1.jpg',
            ],
            'band_image_2' => [
                'section' => 'band',
                'type' => 'image',
                'label' => 'Photo — tall',
                'default' => '/assets/chhondo/about/everyday-2.jpg',
            ],
            'craft_show' => [
                'section' => 'craft',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'craft_title' => [
                'section' => 'craft',
                'type' => 'textarea',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => 'প্রতিটি শাড়িতে বোনা
কারিগরের *পরম মমতা*',
            ],
            'craft_text_show' => [
                'section' => 'craft',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'craft_text' => [
                'section' => 'craft',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => '\'ছন্দ\'-এর প্রতিটি শাড়ি তৈরি হয় কারিগরদের দীর্ঘ সময়ের ধৈর্য আর নিপুণ হাতের ছোঁয়ায়। বংশপরম্পরায় পাওয়া কারুশিল্পীদের হাতের দক্ষতায় ফুটে ওঠে প্রতিটি শাড়ির নকশা। আমরা সরাসরি সেইসব কারিগরদের পরিবার থেকে শাড়ি সংগ্রহ করি, যেন তাদের প্রথম বিক্রির আগেই সম্পূর্ণ ও ন্যায্য পারিশ্রমিক নিশ্চিত হয়।',
            ],
            'craft_image_1' => [
                'section' => 'craft',
                'type' => 'image',
                'label' => 'Photo — small',
                'default' => '/assets/chhondo/about/artisan-1.jpg',
            ],
            'craft_image_2' => [
                'section' => 'craft',
                'type' => 'image',
                'label' => 'Photo — large',
                'default' => '/assets/chhondo/about/artisan-2.jpg',
            ],
            'values_show' => [
                'section' => 'values',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'values_title' => [
                'section' => 'values',
                'label' => 'Heading',
                'help' => 'Wrap words in *stars* to colour them gold. Press Enter for a new line.',
                'default' => '\'ছন্দ\' যে তিন *দর্শনে বিশ্বাসী*',
            ],
            'values' => [
                'section' => 'values',
                'type' => 'repeater',
                'label' => 'Cards',
                'fields' => [
                    'eyebrow' => [
                        'label' => 'Small label',
                        'type' => 'text',
                    ],
                    'image' => [
                        'label' => 'Numeral image',
                        'type' => 'image',
                    ],
                    'title' => [
                        'label' => 'Title',
                        'type' => 'text',
                    ],
                    'text' => [
                        'label' => 'Text',
                        'type' => 'textarea',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'eyebrow' => 'মূল্যবোধ ০১',
                        'image' => '/assets/chhondo/about/value-1.svg',
                        'title' => 'সময় নিয়ে, সযত্নে',
                        'text' => 'শাড়ি তৈরিতে আমাদের কোনো তাড়াহুড়ো নেই। প্রতিটি শাড়ি বোনা হয় কারিগরের নিজস্ব ছন্দে, পরম যত্নে। শাড়ির এই স্বল্পতা কোনো ব্যবসায়িক কৌশল নয়, এটাই তাঁতের স্বাভাবিক সৌন্দর্য।',
                        'show' => '1',
                    ],
                    [
                        'eyebrow' => 'মূল্যবোধ ০২',
                        'image' => '/assets/chhondo/about/value-2.svg',
                        'title' => 'মুনাফার আগে ন্যায্যতা',
                        'text' => 'কারিগরের নিপুণ কাজই আমাদের সম্পদ, আর তাঁদের হাসি আমাদের দায়িত্ব। তাই শাড়ি বিক্রির পর নয়, বরং কাজ শুরুর আগেই আমরা তাঁদের পারিশ্রমিক সসম্মানে বুঝিয়ে দিই।',
                        'show' => '1',
                    ],
                    [
                        'eyebrow' => 'মূল্যবোধ ০৩',
                        'image' => '/assets/chhondo/about/value-3.svg',
                        'title' => 'ট্রেন্ড নয়, এক টুকরো স্মৃতি',
                        'text' => 'ফ্যাশনের নিত্যনতুন ট্রেন্ডের চেয়ে আমরা গুরুত্ব দিই শাড়ির সৌন্দর্যের ওপর। আমাদের শাড়িগুলো আপনার প্রতিদিনের ছোট ছোট আনন্দ আর বিশেষ মুহূর্তগুলোর সুন্দর স্মৃতি হয়ে ওঠার জন্যই তৈরি।',
                        'show' => '1',
                    ],
                ],
            ],
            'quote_show' => [
                'section' => 'quote',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'quote_text' => [
                'section' => 'quote',
                'type' => 'textarea',
                'label' => 'Quote',
                'help' => 'A new line breaks the quote on wide screens only.',
                'default' => 'আমরা ফ্যাশনের পেছনে ছুটি না। আমরা একটি তাঁতকে সচল রাখি,
একটি পরিবারকে জীবিকার পথ দেখাই, আর প্রতিটি শাড়ি, প্রতিটি গল্প,প্রতিটি নারীর মাধ্যমে একটি ঐতিহ্যকে বাঁচিয়ে রাখি।”',
            ],
            'quote_by_show' => [
                'section' => 'quote',
                'type' => 'toggle',
                'label' => 'Show the name and role',
                'default' => '1',
            ],
            'quote_name' => [
                'section' => 'quote',
                'label' => 'Name',
                'default' => 'অনন্যা সেন',
            ],
            'quote_role' => [
                'section' => 'quote',
                'label' => 'Role',
                'default' => 'প্রতিষ্ঠাতা, ছন্দ',
            ],
        ],
        'policies' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'প্রাইভেসি পলিসি',
            ],
        ],
        'terms' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'শর্তাবলি',
            ],
        ],
        'refund' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'রিফান্ড ও রিটার্ন পলিসি',
            ],
            'sections' => [
                'section' => 'sections',
                'type' => 'repeater',
                'label' => 'Sections',
                'help' => 'Add, remove, reorder or hide sections. In “Points”, each line becomes one bullet.',
                'fields' => [
                    'title' => [
                        'label' => 'Heading',
                        'type' => 'text',
                    ],
                    'lines' => [
                        'label' => 'Points',
                        'type' => 'textarea',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'title' => '১. পণ্য পরিবর্তন বা ফেরত/ রিটার্ন পলিসি:',
                        'lines' => 'শুধুমাত্র ভুল পণ্য বা ত্রুটিপূর্ণ শাড়ি ডেলিভারি পেলে তা পরিবর্তনের সুযোগ রয়েছে।
এক্ষেত্রে পার্সেল হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের ইনবক্স বা হেল্পলাইনে জানাতে হবে।
ফেরত দেওয়ার সময় শাড়িটি অবশ্যই অব্যবহৃত, পরিষ্কার, এবং আসল প্যাকেজিংয়ে থাকতে হবে।
ব্যবহার করা হয়েছে বা ধোয়া হয়েছে এমন শাড়ি পরিবর্তন বা ফেরতযোগ্য নয়।',
                        'show' => '1',
                    ],
                    [
                        'title' => '২. পরিবর্তনের প্রক্রিয়া:',
                        'lines' => 'ত্রুটিপূর্ণ শাড়িটি আমাদের কাছে আসার পর তা যাচাই করে নতুন একটি পণ্য পাঠিয়ে দেওয়া হবে।
একই ডিজাইনের শাড়ি যদি স্টকে না থাকে, তবে আপনার পছন্দ অনুযায়ী সমমূল্যের অন্য কোনো শাড়ি বিকল্প হিসেবে দেওয়া হতে পারে।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৩. মূল্য ফেরত নীতি / রিফান্ড পলিসি:',
                        'lines' => 'সাধারণত আমরা কোনো রিফান্ড বা মূল্য ফেরত অফার করি না।
তবে অর্ডার কনফার্ম হওয়ার পর যদি কোনো অনাকাঙ্ক্ষিত কারণে তা ডেলিভারি দেওয়া সম্ভব না হয়, কেবল তখনই মূল্য ফেরত দেওয়া হবে।
রিফান্ডের সম্পূর্ণ প্রক্রিয়াটি সম্পন্ন হতে ৭-১০ কর্মদিবস পর্যন্ত সময় লাগতে পারে।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৪. ডেলিভারির সময় ক্ষতি:',
                        'lines' => 'কুরিয়ারের মাধ্যমে পাঠানোর সময় শাড়ি বা পার্সেল ক্ষতিগ্রস্ত হলে, ডেলিভারি বুঝে নেওয়ার সময়ই তা কুরিয়ার প্রতিনিধিকে জানাতে হবে।
পরিবহন বা কুরিয়ারের কারণে হওয়া কোনো ক্ষতির জন্য ব্র্যান্ড সরাসরি দায়বদ্ধ থাকবে না।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৫. নীতিমালার পরিবর্তন:',
                        'lines' => 'যেকোনো সময় এই নীতিমালা আপডেট বা পরিবর্তনের অধিকার আমাদের রয়েছে।
ওয়েবসাইটে প্রকাশের সঙ্গে সঙ্গেই যেকোনো নতুন নিয়ম কার্যকর বলে গণ্য হবে।',
                        'show' => '1',
                    ],
                ],
            ],
            'sections_show' => [
                'section' => 'sections',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'contact_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the contact block',
                'default' => '1',
            ],
            'contact_title' => [
                'section' => 'contact',
                'label' => 'Heading',
                'default' => 'যোগাযোগ:',
            ],
            'contact_address_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the address',
                'default' => '1',
            ],
            'contact_address' => [
                'section' => 'contact',
                'label' => 'Address',
                'default' => 'দ্বীন মোহাম্মদ কলোনি, ঢাকা, বাংলাদেশ',
            ],
            'contact_email_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the email',
                'default' => '1',
            ],
            'contact_email' => [
                'section' => 'contact',
                'label' => 'Email',
                'default' => 'limu.sir@gmail.com',
            ],
            'contact_phone_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the phone',
                'default' => '1',
            ],
            'contact_phone' => [
                'section' => 'contact',
                'label' => 'Phone',
                'default' => '01335-358032',
            ],
        ],
        'shipping_delivery' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'tab_title' => [
                'section' => 'page',
                'label' => 'Browser tab title',
                'default' => 'রিফান্ড ও রিটার্ন পলিসি',
            ],
            'sections' => [
                'section' => 'sections',
                'type' => 'repeater',
                'label' => 'Sections',
                'help' => 'Add, remove, reorder or hide sections. In “Points”, each line becomes one bullet.',
                'fields' => [
                    'title' => [
                        'label' => 'Heading',
                        'type' => 'text',
                    ],
                    'lines' => [
                        'label' => 'Points',
                        'type' => 'textarea',
                    ],
                    'show' => [
                        'label' => 'Show',
                        'type' => 'toggle',
                    ],
                ],
                'default' => [
                    [
                        'title' => '১. পণ্য পরিবর্তন বা ফেরত/ রিটার্ন পলিসি:',
                        'lines' => 'শুধুমাত্র ভুল পণ্য বা ত্রুটিপূর্ণ শাড়ি ডেলিভারি পেলে তা পরিবর্তনের সুযোগ রয়েছে।
এক্ষেত্রে পার্সেল হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের ইনবক্স বা হেল্পলাইনে জানাতে হবে।
ফেরত দেওয়ার সময় শাড়িটি অবশ্যই অব্যবহৃত, পরিষ্কার, এবং আসল প্যাকেজিংয়ে থাকতে হবে।
ব্যবহার করা হয়েছে বা ধোয়া হয়েছে এমন শাড়ি পরিবর্তন বা ফেরতযোগ্য নয়।',
                        'show' => '1',
                    ],
                    [
                        'title' => '২. পরিবর্তনের প্রক্রিয়া:',
                        'lines' => 'ত্রুটিপূর্ণ শাড়িটি আমাদের কাছে আসার পর তা যাচাই করে নতুন একটি পণ্য পাঠিয়ে দেওয়া হবে।
একই ডিজাইনের শাড়ি যদি স্টকে না থাকে, তবে আপনার পছন্দ অনুযায়ী সমমূল্যের অন্য কোনো শাড়ি বিকল্প হিসেবে দেওয়া হতে পারে।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৩. মূল্য ফেরত নীতি / রিফান্ড পলিসি:',
                        'lines' => 'সাধারণত আমরা কোনো রিফান্ড বা মূল্য ফেরত অফার করি না।
তবে অর্ডার কনফার্ম হওয়ার পর যদি কোনো অনাকাঙ্ক্ষিত কারণে তা ডেলিভারি দেওয়া সম্ভব না হয়, কেবল তখনই মূল্য ফেরত দেওয়া হবে।
রিফান্ডের সম্পূর্ণ প্রক্রিয়াটি সম্পন্ন হতে ৭-১০ কর্মদিবস পর্যন্ত সময় লাগতে পারে।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৪. ডেলিভারির সময় ক্ষতি:',
                        'lines' => 'কুরিয়ারের মাধ্যমে পাঠানোর সময় শাড়ি বা পার্সেল ক্ষতিগ্রস্ত হলে, ডেলিভারি বুঝে নেওয়ার সময়ই তা কুরিয়ার প্রতিনিধিকে জানাতে হবে।
পরিবহন বা কুরিয়ারের কারণে হওয়া কোনো ক্ষতির জন্য ব্র্যান্ড সরাসরি দায়বদ্ধ থাকবে না।',
                        'show' => '1',
                    ],
                    [
                        'title' => '৫. নীতিমালার পরিবর্তন:',
                        'lines' => 'যেকোনো সময় এই নীতিমালা আপডেট বা পরিবর্তনের অধিকার আমাদের রয়েছে।
ওয়েবসাইটে প্রকাশের সঙ্গে সঙ্গেই যেকোনো নতুন নিয়ম কার্যকর বলে গণ্য হবে।',
                        'show' => '1',
                    ],
                ],
            ],
            'sections_show' => [
                'section' => 'sections',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'contact_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the contact block',
                'default' => '1',
            ],
            'contact_title' => [
                'section' => 'contact',
                'label' => 'Heading',
                'default' => 'যোগাযোগ:',
            ],
            'contact_address_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the address',
                'default' => '1',
            ],
            'contact_address' => [
                'section' => 'contact',
                'label' => 'Address',
                'default' => 'দ্বীন মোহাম্মদ কলোনি, ঢাকা, বাংলাদেশ',
            ],
            'contact_email_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the email',
                'default' => '1',
            ],
            'contact_email' => [
                'section' => 'contact',
                'label' => 'Email',
                'default' => 'limu.sir@gmail.com',
            ],
            'contact_phone_show' => [
                'section' => 'contact',
                'type' => 'toggle',
                'label' => 'Show the phone',
                'default' => '1',
            ],
            'contact_phone' => [
                'section' => 'contact',
                'label' => 'Phone',
                'default' => '01335-358032',
            ],
        ],
        'auth' => [
            'login_show' => [
                'section' => 'login',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'login_tab_title' => [
                'section' => 'login',
                'label' => 'Browser tab title',
                'default' => 'লগ ইন',
            ],
            'login_title' => [
                'section' => 'login',
                'label' => 'Heading',
                'default' => 'ফিরে আসায় স্বাগতম',
            ],
            'login_subtitle' => [
                'section' => 'login',
                'label' => 'Line under the heading',
                'default' => 'কেনাকাটা চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন',
            ],
            'login_email_label' => [
                'section' => 'login',
                'label' => 'Email — label',
                'default' => 'ই-মেইল',
            ],
            'login_password_label' => [
                'section' => 'login',
                'label' => 'Password — label',
                'default' => 'পাসওয়ার্ড',
            ],
            'login_remember_show' => [
                'section' => 'login',
                'type' => 'toggle',
                'label' => 'Show “remember me”',
                'default' => '1',
            ],
            'login_remember' => [
                'section' => 'login',
                'label' => 'Remember me',
                'default' => 'মনে রাখুন',
            ],
            'login_forgot_show' => [
                'section' => 'login',
                'type' => 'toggle',
                'label' => 'Show the forgot-password link',
                'default' => '1',
            ],
            'login_forgot' => [
                'section' => 'login',
                'label' => 'Forgot password link',
                'default' => 'পাসওয়ার্ড ভুলে গেছেন?',
            ],
            'login_button' => [
                'section' => 'login',
                'label' => 'Button',
                'default' => 'লগ ইন করুন',
            ],
            'login_loading' => [
                'section' => 'login',
                'label' => 'Button while signing in',
                'default' => 'লগ ইন হচ্ছে...',
            ],
            'login_switch_show' => [
                'section' => 'login',
                'type' => 'toggle',
                'label' => 'Show the sign-up line',
                'default' => '1',
            ],
            'login_switch_text' => [
                'section' => 'login',
                'label' => 'Line under the button',
                'default' => 'কোনো অ্যাকাউন্ট নেই?',
            ],
            'login_switch_link' => [
                'section' => 'login',
                'label' => 'Link to sign up',
                'default' => 'নতুন অ্যাকাউন্ট তৈরি করুন',
            ],
            'register_show' => [
                'section' => 'register',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'register_tab_title' => [
                'section' => 'register',
                'label' => 'Browser tab title',
                'default' => 'অ্যাকাউন্ট খুলুন',
            ],
            'register_title' => [
                'section' => 'register',
                'label' => 'Heading',
                'default' => 'যুক্ত হোন আমাদের পরিবারে',
            ],
            'register_subtitle' => [
                'section' => 'register',
                'label' => 'Line under the heading',
                'default' => 'পছন্দের শাড়িগুলো সংগ্রহে রাখতে অ্যাকাউন্ট খুলুন।',
            ],
            'register_name_label' => [
                'section' => 'register',
                'label' => 'Name — label',
                'default' => 'সম্পূর্ণ নাম',
            ],
            'register_email_label' => [
                'section' => 'register',
                'label' => 'Email — label',
                'default' => 'ই-মেইল',
            ],
            'register_phone_label' => [
                'section' => 'register',
                'label' => 'Mobile — label',
                'default' => 'মোবাইল নম্বর',
            ],
            'register_password_label' => [
                'section' => 'register',
                'label' => 'Password — label',
                'default' => 'পাসওয়ার্ড',
            ],
            'register_confirm_label' => [
                'section' => 'register',
                'label' => 'Confirm password — label',
                'default' => 'পাসওয়ার্ডটি পুনরায় দিন',
            ],
            'register_button' => [
                'section' => 'register',
                'label' => 'Button',
                'default' => 'অ্যাকাউন্ট খুলুন',
            ],
            'register_loading' => [
                'section' => 'register',
                'label' => 'Button while creating the account',
                'default' => 'অ্যাকাউন্ট খোলা হচ্ছে...',
            ],
            'register_switch_show' => [
                'section' => 'register',
                'type' => 'toggle',
                'label' => 'Show the log-in line',
                'default' => '1',
            ],
            'register_switch_text' => [
                'section' => 'register',
                'label' => 'Line under the button',
                'default' => 'আগে থেকেই অ্যাকাউন্ট আছে?',
            ],
            'register_switch_link' => [
                'section' => 'register',
                'label' => 'Link to log in',
                'default' => 'লগ ইন করুন',
            ],
            'collage_show' => [
                'section' => 'collage',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'collage_photo_1' => [
                'section' => 'collage',
                'type' => 'image',
                'label' => 'Photo 1 — left column, top',
                'default' => '/assets/chhondo/auth/auth-1.jpg',
            ],
            'collage_photo_2' => [
                'section' => 'collage',
                'type' => 'image',
                'label' => 'Photo 2 — left column, bottom',
                'default' => '/assets/chhondo/auth/auth-2.jpg',
            ],
            'collage_photo_3' => [
                'section' => 'collage',
                'type' => 'image',
                'label' => 'Photo 3 — right column, top',
                'default' => '/assets/chhondo/auth/auth-3.jpg',
            ],
            'collage_photo_4' => [
                'section' => 'collage',
                'type' => 'image',
                'label' => 'Photo 4 — right column, bottom',
                'default' => '/assets/chhondo/auth/auth-4.jpg',
            ],
        ],
        'not_found' => [
            'page_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show this section',
                'default' => '1',
            ],
            'title' => [
                'section' => 'page',
                'label' => 'Heading (also the browser tab title)',
                'default' => 'পেইজটি খুঁজে পাওয়া যায়নি',
            ],
            'text_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show the text',
                'default' => '1',
            ],
            'text' => [
                'section' => 'page',
                'type' => 'textarea',
                'label' => 'Text',
                'default' => 'দুঃখিত, আপনার কাঙ্ক্ষিত পেজটি খুঁজে পাওয়া যায়নি। আমাদের শাড়ির দারুণ সব কালেকশন দেখতে হোম পেজে ঘুরে আসতে পারেন।',
            ],
            'button_show' => [
                'section' => 'page',
                'type' => 'toggle',
                'label' => 'Show the button',
                'default' => '1',
            ],
            'button_label' => [
                'section' => 'page',
                'label' => 'Button text',
                'default' => 'কেনাকাটা চালিয়ে যান',
            ],
            'button_url' => [
                'section' => 'page',
                'label' => 'Button link',
                'default' => '/',
            ],
        ],
    ];


    /**
     * Every storefront page the admin can edit, in the order the listing shows
     * them.
     *
     *  url         where it lives on the storefront (null = no direct URL)
     *  banners     the page owns the hero banner images
     *  editable    its body text is built from widgets on this record
     *  site_fields settings that belong to this page and live on site_infos —
     *              they used to be scattered across Settings screens
     *  permission  which admin permission gates it
     */
    public const PAGES = [
        'home' => [
            'label'      => 'হোম',
            'url'        => '/',
            // The hero's Desktop / Mobile banners are fields of the page; the
            // banner carousel (ordered, linkable, on/off) is managed here too and
            // replaces them on the site while its slideshow switch is on.
            'banners'    => true,
            'editable'   => true,
            'permission' => 'Slider',
            'note'       => 'Hero banners, the headline, and any sections you add below the built-in ones.',
            'site_fields' => [],
        ],
        'shop' => [
            'label'      => 'শপ',
            'url'        => '/shop',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The product listing page.',
            'site_fields' => [],
        ],
        'contact' => [
            'label'      => 'যোগাযোগ',
            'url'        => '/contact-us',
            'banners'    => false,
            'editable'   => true,
            'widgets'    => true,
            'permission' => 'Contact',
            'note'       => 'Contact details and the copy above the enquiry form.',
            // These are the same columns the footer reads, so a change here shows
            // everywhere the details appear. `store_phone_number` used to be
            // edited here and read nowhere, which let the two numbers drift.
            'site_fields' => [],
        ],
        'checkout' => [
            'label'      => 'চেকআউট',
            'url'        => '/checkout',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The note shown to customers while they place an order.',
            'site_fields' => [],
        ],
        'categories' => [
            'label'      => 'ক্যাটাগরি',
            'url'        => '/categories',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The category grid customers browse.',
            'site_fields' => [],
        ],
        'cart' => [
            'label'      => 'কার্ট',
            'url'        => '/cart',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => null,
            'site_fields' => [],
        ],
        'track_order' => [
            'label'      => 'অর্ডার ট্র্যাক',
            'url'        => '/track-order',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => null,
            'site_fields' => [],
        ],
        'order_success' => [
            'label'      => 'অর্ডার সফল হয়েছে',
            'url'        => null,
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'Shown after an order is placed.',
            'site_fields' => [],
        ],
        'blog' => [
            'label'      => 'ব্লগ',
            'url'        => '/blog',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'Blogs',
            'note'       => 'The blog listing — posts themselves live under Content › Blog posts.',
            'site_fields' => [],
        ],
        'about' => [
            'label'      => 'আমাদের গল্প',
            'url'        => '/about-us',
            'banners'    => false,
            'editable'   => true,
            'widgets'    => true,
            'permission' => null,
            'note'       => 'Your company story.',
            'site_fields' => [],
        ],
        'policies' => [
            'label'      => 'প্রাইভেসি পলিসি',
            'url'        => '/privacy-policy',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'Policy',
            'note'       => null,
            'site_fields' => [],
        ],
        'terms' => [
            'label'      => 'শর্তাবলি',
            'url'        => '/terms-and-conditions',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'TermCondition',
            'note'       => null,
            'site_fields' => [],
        ],
        'refund' => [
            'label'      => 'রিফান্ড ও রিটার্ন পলিসি',
            'url'        => '/refund-policy',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'RefundPolicy',
            'note'       => null,
            'site_fields' => [],
        ],
        'shipping_delivery' => [
            'label'      => 'ডেলিভারি তথ্য',
            'url'        => '/shipping-and-delivery',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'ShippingDelivery',
            'note'       => null,
            'site_fields' => [],
        ],
        'auth' => [
            'label'      => 'লগ ইন ও অ্যাকাউন্ট খুলুন',
            'url'        => '/login',
            'banners'    => false,
            'editable'   => true,
            // Saved widgets render after the shared authentication layout.
            'widgets'    => true,
            'permission' => null,
            'note'       => 'Both account pages: headings, field labels, buttons and the four collage photos.',
            'site_fields' => [],
        ],
        'not_found' => [
            'label'      => 'পেইজটি খুঁজে পাওয়া যায়নি',
            'url'        => null,
            'banners'    => false,
            'editable'   => true,
            'widgets'    => true,
            'permission' => null,
            'note'       => 'Shown when an address does not exist.',
            'site_fields' => [],
        ],
    ];

    public static function meta(string $type): ?array
    {
        // A custom page carries its own meta on the row, so it is resolved by
        // the caller that already has the record rather than looked up here.
        if (self::isCustomType($type)) {
            return self::where('type', $type)->first()?->customMeta();
        }

        $meta = self::PAGES[$type] ?? null;

        if ($meta === null) {
            return null;
        }

        return $meta + ['site_fields' => []];
    }
}
