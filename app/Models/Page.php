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
            $out[$key] = filled($value) ? $value : $meta['default'];
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
        'about' => [
            'hero'  => 'Hero',
            'goal'  => 'Our goal',
            'why'   => 'Why choose us',
            'craft' => 'Craftsman',
            'daily' => 'Daily tradition',
        ],
        'home' => [
            'reviews'  => 'Customer reviews',
            'campaign' => 'Campaign sections',
        ],
        'blog' => [
            'listing' => 'Post listing',
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
            'reviews_heading' => ['section' => 'reviews', 'label' => 'Reviews heading', 'default' => 'আমাদের গ্রাহকরা যা বলেন'],
            'reviews_subheading' => ['section' => 'reviews', 'type' => 'textarea', 'label' => 'Reviews subheading', 'default' => 'আমাদের গ্রাহকদের ভালোবাসা এবং আস্থাই আমাদের চলার পথের অনুপ্রেরণা।'],
            't1' => ['section' => 'page', 'label' => 'Browser tab title', 'default' => 'Home'],
            't2' => ['section' => 'campaign', 'label' => 'বিশেষ অফার', 'default' => 'বিশেষ অফার'],
            't3' => ['section' => 'campaign', 'label' => 'শেষ হবে:', 'default' => 'শেষ হবে:'],
            't4' => ['section' => 'campaign', 'label' => 'SALE', 'default' => 'SALE'],
            't5' => ['section' => 'campaign', 'label' => 'Quick Preview', 'default' => 'Quick Preview'],
            't6' => ['section' => 'campaign', 'label' => 'অর্ডার করুন', 'default' => 'অর্ডার করুন'],
        ],
        'shop' => [
            't1' => ['section' => 'page', 'label' => 'Shop', 'default' => 'Shop'],
        ],
        'contact' => [
            't1' => ['section' => 'page', 'label' => 'যোগাযোগ করুন - চারুকথন', 'default' => 'যোগাযোগ করুন - চারুকথন'],
            't2' => ['section' => 'page', 'label' => 'কোনো প্রশ্ন বা মতামত থাকলে আমাদের জানান!', 'default' => 'কোনো প্রশ্ন বা মতামত থাকলে আমাদের জানান!'],
            't3' => ['section' => 'page', 'label' => 'যোগাযোগের তথ্য', 'default' => 'যোগাযোগের তথ্য'],
            't4' => ['section' => 'page', 'label' => 'ফোন', 'default' => 'ফোন'],
            't5' => ['section' => 'page', 'label' => 'হোয়াটসঅ্যাপ', 'default' => 'হোয়াটসঅ্যাপ'],
            't6' => ['section' => 'page', 'label' => 'ইমেইল', 'default' => 'ইমেইল'],
            't7' => ['section' => 'page', 'label' => 'ঠিকানা', 'default' => 'ঠিকানা'],
            't8' => ['section' => 'page', 'label' => 'সাপোর্ট সময়', 'default' => 'সাপোর্ট সময়'],
            't9' => ['section' => 'page', 'label' => 'আমাদের ফলো করুন', 'default' => 'আমাদের ফলো করুন'],
            't10' => ['section' => 'page', 'label' => 'আমাদের বার্তা পাঠান', 'default' => 'আমাদের বার্তা পাঠান'],
            't11' => ['section' => 'page', 'label' => 'ইমেইল*', 'default' => 'ইমেইল*'],
            't12' => ['section' => 'page', 'label' => 'ফোন নম্বর*', 'default' => 'ফোন নম্বর*'],
            't13' => ['section' => 'page', 'label' => 'আপনার নাম*', 'default' => 'আপনার নাম*'],
            't14' => ['section' => 'page', 'label' => 'বার্তা *', 'default' => 'বার্তা *'],
            't15' => ['section' => 'page', 'label' => 'বার্তা পাঠান', 'default' => 'বার্তা পাঠান'],
            't16' => ['section' => 'page', 'label' => 'পাঠানো হচ্ছে...', 'default' => 'পাঠানো হচ্ছে...'],
        ],
        'checkout' => [
            't1' => ['section' => 'page', 'label' => 'Checkout', 'default' => 'Checkout'],
            't2' => ['section' => 'page', 'label' => 'Home', 'default' => 'Home'],
        ],
        'categories' => [
            't1' => ['section' => 'page', 'label' => 'Categories', 'default' => 'Categories'],
            't2' => ['section' => 'page', 'label' => 'No categories available', 'default' => 'No categories available'],
        ],
        'cart' => [
            't1' => ['section' => 'page', 'label' => 'Cart', 'default' => 'Cart'],
        ],
        'track_order' => [
            't13' => ['section' => 'page', 'label' => 'Invoice # (prefix)', 'default' => 'Invoice #'],
            't14' => ['section' => 'page', 'label' => 'item (singular)', 'default' => 'item'],
            't1' => ['section' => 'page', 'label' => 'Track Order', 'default' => 'Track Order'],
            't2' => ['section' => 'page', 'label' => 'Order Details', 'default' => 'Order Details'],
            't3' => ['section' => 'page', 'label' => 'Customer', 'default' => 'Customer'],
            't4' => ['section' => 'page', 'label' => 'Total Amount', 'default' => 'Total Amount'],
            't5' => ['section' => 'page', 'label' => 'Order Items', 'default' => 'Order Items'],
            't6' => ['section' => 'page', 'label' => 'Product', 'default' => 'Product'],
            't7' => ['section' => 'page', 'label' => 'Qty', 'default' => 'Qty'],
            't8' => ['section' => 'page', 'label' => 'Price', 'default' => 'Price'],
            't9' => ['section' => 'page', 'label' => 'Total', 'default' => 'Total'],
            't10' => ['section' => 'page', 'label' => 'Qty:', 'default' => 'Qty:'],
            't11' => ['section' => 'page', 'label' => 'Price:', 'default' => 'Price:'],
            't12' => ['section' => 'page', 'label' => 'Grand Total', 'default' => 'Grand Total'],
        ],
        'order_success' => [
            't1' => ['section' => 'page', 'label' => 'Order Successful', 'default' => 'Order Successful'],
            't2' => ['section' => 'page', 'label' => 'Order Placed Successfully!', 'default' => 'Order Placed Successfully!'],
            't3' => ['section' => 'page', 'label' => 'Invoice #:', 'default' => 'Invoice #:'],
            't4' => ['section' => 'page', 'label' => 'Customer:', 'default' => 'Customer:'],
            't5' => ['section' => 'page', 'label' => 'Total Amount:', 'default' => 'Total Amount:'],
            't6' => ['section' => 'page', 'label' => 'Status:', 'default' => 'Status:'],
            't7' => ['section' => 'page', 'label' => 'Go to home page', 'default' => 'Go to home page'],
        ],
        'blog' => [
            't5' => ['section' => 'listing', 'label' => 'মিনিট পড়া', 'default' => 'মিনিট পড়া'],
            't1' => ['section' => 'listing', 'label' => 'ব্লগ', 'default' => 'ব্লগ'],
            't2' => ['section' => 'listing', 'label' => 'সব লেখা', 'default' => 'সব লেখা'],
            't3' => ['section' => 'listing', 'label' => 'এই মুহূর্তে কোনো লেখা নেই। খুব শিগগিরই নতুন লেখা আসছে।', 'default' => 'এই মুহূর্তে কোনো লেখা নেই। খুব শিগগিরই নতুন লেখা আসছে।'],
            't4' => ['section' => 'listing', 'label' => 'পড়ুন →', 'default' => 'পড়ুন →'],
        ],
        'about' => [
            'img_goal' => ['section' => 'goal', 'type' => 'image', 'label' => 'Goal image', 'default' => '/assets/images/icons/imgOurGoal.jpg'],
            'img_craft' => ['section' => 'craft', 'type' => 'image', 'label' => 'Craftsman image', 'default' => '/assets/images/icons/imgCraftsman.jpg'],
            'img_daily' => ['section' => 'daily', 'type' => 'image', 'label' => 'Daily tradition image', 'default' => '/assets/images/icons/imgTraditionalMakeover.jpg'],
            't1' => ['section' => 'hero', 'label' => 'About us', 'default' => 'About us'],
            't2' => ['section' => 'hero', 'label' => 'আমাদের পথচলা', 'default' => 'আমাদের পথচলা'],
            't3' => ['section' => 'hero', 'label' => 'বাংলার ঐতিহ্যের সাথে আধুনিকতার এক নান্দনিক মেলবন্ধন তৈরির...', 'type' => 'textarea', 'default' => 'বাংলার ঐতিহ্যের সাথে আধুনিকতার এক নান্দনিক মেলবন্ধন তৈরির স্বপ্ন নিয়ে \'চারুকথন\'-এর যাত্রা শুরু। আমরা বিশ্বাস করি, একটি শাড়ি কেবল পোশাক নয়, বরং একজন নারীর ব্যক্তিত্ব, আভিজাত্য ও বাঙ্গালী সংস্কৃতির প্রতিফলন। বিশেষ করে আমাদের দেশীয় সুতি শাড়ির যে চিরচেনা আরাম আর স্নিগ্ধতা, তাকেই নতুনভাবে তুলে ধরতে কাজ করে যাচ্ছে চারুকথন'],
            't4' => ['section' => 'goal', 'label' => 'আমাদের লক্ষ্য', 'default' => 'আমাদের লক্ষ্য'],
            't5' => ['section' => 'goal', 'label' => 'আমাদের প্রধান লক্ষ্য হলো বাংলার হারিয়ে যাওয়া কারুশিল্প ও ...', 'type' => 'textarea', 'default' => 'আমাদের প্রধান লক্ষ্য হলো বাংলার হারিয়ে যাওয়া কারুশিল্প ও সুতি বস্ত্রের ঐতিহ্যকে পুনরুজ্জীবিত করা। তৃণমূল পর্যায়ের দক্ষ তাঁতিদের নিপুণ হাতে তৈরি প্রতিটি শাড়ি সরাসরি আপনার কাছে পৌঁছে দেওয়াই চারুকথনের অঙ্গীকার। আমরা চাই, প্রতিটি নারী যেন সাশ্রয়ী মূল্যে আভিজাত্য এবং সর্বোচ্চ গুণমানসম্পন্ন দেশি শাড়ির স্নিগ্ধতা অনুভব করেন।'],
            't6' => ['section' => 'why', 'label' => 'কেন চারুকথন আপনার জন্য?', 'default' => 'কেন চারুকথন আপনার জন্য?'],
            'cards' => [
                'section' => 'why',
                'type' => 'repeater',
                'label' => 'Feature cards',
                'help' => 'Add, remove or reorder. The page lays them out four across.',
                'fields' => [
                    'title' => ['label' => 'Title', 'type' => 'text'],
                    'text'  => ['label' => 'Text', 'type' => 'textarea'],
                ],
                'default' => [
                ['title' => 'খাঁটি দেশি সুতি', 'text' => 'আমরা বাছাইকৃত প্রিমিয়াম কোয়ালিটির সুতি সুতা ব্যবহার নিশ্চিত করি, যা গরমেও দেয় অতুলনীয় আরাম'],
                ['title' => 'কারিগরী শিল্প', 'text' => 'প্রতিটি শাড়িতে থাকে বাংলার দক্ষ কারিগরদের হাতের ছোঁয়া ও শৈল্পিক কারুকাজ।'],
                ['title' => 'নিজস্ব ডিজাইন', 'text' => 'চারুকথনের প্রতিটি ডিজাইন অনন্য এবং সমসাময়িক ট্রেন্ডের সাথে মানানসই।'],
                ['title' => 'স্থায়িত্ব ও আভিজাত্য', 'text' => 'আমরা রঙের গুণমান এবং টেকসই বুননের ওপর বিশেষ গুরুত্ব দিই।'],
                ],
            ],
            't15' => ['section' => 'craft', 'label' => 'কারিগরের নিপুণ ছোঁয়ায়', 'default' => 'কারিগরের নিপুণ ছোঁয়ায়'],
            't16' => ['section' => 'craft', 'label' => 'চারুকথনের প্রতিটি শাড়ির পেছনে জড়িয়ে থাকে শত শত তাঁতি ও কা...', 'type' => 'textarea', 'default' => 'চারুকথনের প্রতিটি শাড়ির পেছনে জড়িয়ে থাকে শত শত তাঁতি ও কারিগরের পরিশ্রম আর ভালোবাসা। গ্রামীণ জনপদে ছড়িয়ে থাকা এই প্রতিভাবান শিল্পীদের জীবনমান উন্নয়ন এবং তাঁদের শিল্পকে বিশ্বমঞ্চে তুলে ধরতে আমরা প্রতিশ্রুতিবদ্ধ। আপনি যখন চারুকথন থেকে একটি শাড়ি কেনেন, তখন আপনি একটি প্রাচীন শিল্প ও তার পেছনের শিল্পীকেও সমর্থন করেন।'],
            't17' => ['section' => 'daily', 'label' => 'ঐতিহ্যের রঙে সাজুন প্রতিদিন', 'default' => 'ঐতিহ্যের রঙে সাজুন প্রতিদিন'],
            't18' => ['section' => 'daily', 'label' => 'দেশি সাজ ও আভিজাত্যের নিজেকে খুঁজে পান নান্দনিকতার ঐশ্বর্...', 'type' => 'textarea', 'default' => 'দেশি সাজ ও আভিজাত্যের নিজেকে খুঁজে পান নান্দনিকতার ঐশ্বর্যে। আমরা কেবল শাড়ি বিক্রি করি না বরং বলি বাঙালিয়ানার গল্প।'],
        ],
        'policies' => [
            't1' => ['section' => 'page', 'label' => 'Privacy Policy', 'default' => 'Privacy Policy'],
        ],
        'terms' => [
            't1' => ['section' => 'page', 'label' => 'Terms & Conditions', 'default' => 'Terms & Conditions'],
        ],
        'refund' => [
            't1' => ['section' => 'page', 'label' => 'Refund and Returns Policy', 'default' => 'Refund and Returns Policy'],
            't2' => ['section' => 'page', 'label' => '1. রিটার্ন পলিসি', 'default' => '1. রিটার্ন পলিসি'],
            't3' => ['section' => 'page', 'label' => 'ভুলভাবে ত্রুটিপূর্ণ বা ভুল পণ্য পাঠানো হলে রিটার্ন করা যাবে।', 'default' => 'ভুলভাবে ত্রুটিপূর্ণ বা ভুল পণ্য পাঠানো হলে রিটার্ন করা যাবে।'],
            't4' => ['section' => 'page', 'label' => 'পণ্য রিসিভের ২৪ ঘণ্টার মধ্যে আমাদেরকে রিফান্ড বা রিটার্নে...', 'type' => 'textarea', 'default' => 'পণ্য রিসিভের ২৪ ঘণ্টার মধ্যে আমাদেরকে রিফান্ড বা রিটার্নের অনুরোধ জানাতে হবে। রিটার্নের আগে অবশ্যই হোয়াটসঅ্যাপ, ফেসবুক/ইমেইল বা ফোনে যোগাযোগ করতে হবে। নষ্ট/ব্যবহৃত পণ্য ফেরত গ্রহণযোগ্য নয়।'],
            't5' => ['section' => 'page', 'label' => '2. রিফান্ড প্রক্রিয়া', 'default' => '2. রিফান্ড প্রক্রিয়া'],
            't6' => ['section' => 'page', 'label' => 'ত্রুটিপূর্ণ পণ্য রিটার্ন পাওয়ার পর যাচাই করে মূল্য পরিশো...', 'type' => 'textarea', 'default' => 'ত্রুটিপূর্ণ পণ্য রিটার্ন পাওয়ার পর যাচাই করে মূল্য পরিশোধ করা হবে এবং রিফান্ড ক্রেতার ব্যাংক বা নগদ অ্যাকাউন্টে পাঠানো হবে।'],
            't7' => ['section' => 'page', 'label' => 'রিফান্ড ৩-৭ কার্যদিবসের মধ্যে সম্পন্ন হতে পারে।', 'default' => 'রিফান্ড ৩-৭ কার্যদিবসের মধ্যে সম্পন্ন হতে পারে।'],
            't8' => ['section' => 'page', 'label' => '3. বিক্রয় নীতিমালা', 'default' => '3. বিক্রয় নীতিমালা'],
            't9' => ['section' => 'page', 'label' => 'আমরা সাধারণত বিক্রিত পণ্য ফেরত নেই না, শুধুমাত্র পণ্যের স...', 'type' => 'textarea', 'default' => 'আমরা সাধারণত বিক্রিত পণ্য ফেরত নেই না, শুধুমাত্র পণ্যের সমস্যা থাকলে বা ভুল পণ্য ডেলিভারি হলে রিটার্ন প্রযোজ্য।'],
            't10' => ['section' => 'page', 'label' => 'রিফান্ড কেবল যাচাই শেষে ৩-৭ কার্যদিবসের মধ্যে প্রদান করা ...', 'default' => 'রিফান্ড কেবল যাচাই শেষে ৩-৭ কার্যদিবসের মধ্যে প্রদান করা হবে।'],
            't11' => ['section' => 'page', 'label' => '4. ডেলিভারি ফি', 'default' => '4. ডেলিভারি ফি'],
            't12' => ['section' => 'page', 'label' => 'কুরিয়ার সার্ভিসের মাধ্যমে পণ্য ডেলিভারি করা হবে। কুরিয়া...', 'type' => 'textarea', 'default' => 'কুরিয়ার সার্ভিসের মাধ্যমে পণ্য ডেলিভারি করা হবে। কুরিয়ার বা পার্সেলের সময় ক্রেতাকে সঠিক ঠিকানা নিশ্চিত করতে হবে। ভুল তথ্যের কারণে পণ্য ডেলিভারি ব্যর্থ হলে কর্তৃপক্ষ দায়ী নয়।'],
            't13' => ['section' => 'page', 'label' => '5. পরিবর্তন', 'default' => '5. পরিবর্তন'],
            't14' => ['section' => 'page', 'label' => 'চারুকথন যেকোনো সময় এই নীতিমালা পরিবর্তন বা হালনাগাদ করতে...', 'type' => 'textarea', 'default' => 'চারুকথন যেকোনো সময় এই নীতিমালা পরিবর্তন বা হালনাগাদ করতে পারে। নতুন নীতি কার্যকর হওয়ার পর তাৎক্ষণিক ভাবে প্রযোজ্য হবে।'],
            't15' => ['section' => 'page', 'label' => 'যোগাযোগ', 'default' => 'যোগাযোগ'],
        ],
        'shipping_delivery' => [
            't1' => ['section' => 'page', 'label' => 'Shipping And Delivery', 'default' => 'Shipping And Delivery'],
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
            'label'      => 'Home',
            'url'        => '/',
            'banners'    => true,
            'editable'   => true,
            'permission' => 'Slider',
            'note'       => 'Hero banners, the headline, and any sections you add below the built-in ones.',
            'site_fields' => [],
        ],
        'shop' => [
            'label'      => 'Shop',
            'url'        => '/shop',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The product listing page.',
            'site_fields' => [],
        ],
        'contact' => [
            'label'      => 'Contact us',
            'url'        => '/contact-us',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'Contact',
            'note'       => 'Contact details and the copy above the enquiry form.',
            // These are the same columns the footer reads, so a change here shows
            // everywhere the details appear. `store_phone_number` used to be
            // edited here and read nowhere, which let the two numbers drift.
            'site_fields' => [
                'phone_number'        => ['label' => 'Phone number', 'type' => 'text'],
                'whatsapp_number'     => ['label' => 'WhatsApp number', 'type' => 'text'],
                'store_email'         => ['label' => 'Email', 'type' => 'email'],
                'address'             => ['label' => 'Store address', 'type' => 'text'],
                'support_hours'       => ['label' => 'Support hours', 'type' => 'text'],
                'map_embed_url'       => ['label' => 'Google Maps embed URL (optional — the address is mapped automatically)', 'type' => 'url'],
                'store_gateway_image' => ['label' => 'Store image', 'type' => 'image'],
            ],
        ],
        'checkout' => [
            'label'      => 'Checkout',
            'url'        => '/checkout',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The note shown to customers while they place an order.',
            'site_fields' => [
                'checkout_page_text' => ['label' => 'Checkout note', 'type' => 'textarea'],
            ],
        ],
        'categories' => [
            'label'      => 'Categories',
            'url'        => '/categories',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'The category grid customers browse.',
            'site_fields' => [],
        ],
        'cart' => [
            'label'      => 'Cart',
            'url'        => '/cart',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => null,
            'site_fields' => [],
        ],
        'track_order' => [
            'label'      => 'Track order',
            'url'        => '/track-order',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => null,
            'site_fields' => [],
        ],
        'order_success' => [
            'label'      => 'Order success',
            'url'        => null,
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'Shown after an order is placed.',
            'site_fields' => [],
        ],
        'blog' => [
            'label'      => 'Blog',
            'url'        => '/blog',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'Blogs',
            'note'       => 'The blog listing — posts themselves live under Content › Blog posts.',
            'site_fields' => [],
        ],
        'about' => [
            'label'      => 'About us',
            'url'        => '/about-us',
            'banners'    => false,
            'editable'   => true,
            'permission' => null,
            'note'       => 'Your company story.',
            'site_fields' => [],
        ],
        'policies' => [
            'label'      => 'Privacy policy',
            'url'        => '/privacy-policy',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'Policy',
            'note'       => null,
            'site_fields' => [],
        ],
        'terms' => [
            'label'      => 'Terms & conditions',
            'url'        => '/terms-and-conditions',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'TermCondition',
            'note'       => null,
            'site_fields' => [],
        ],
        'refund' => [
            'label'      => 'Refund policy',
            'url'        => '/refund-policy',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'RefundPolicy',
            'note'       => null,
            'site_fields' => [],
        ],
        'shipping_delivery' => [
            'label'      => 'Shipping & delivery',
            'url'        => '/shipping-and-delivery',
            'banners'    => false,
            'editable'   => true,
            'permission' => 'ShippingDelivery',
            'note'       => null,
            'site_fields' => [],
        ],
        'sales_support' => [
            'label'      => 'Sales support',
            'url'        => null,
            'banners'    => false,
            'editable'   => true,
            'permission' => 'SaleSupport',
            'note'       => 'Support copy reused across the storefront.',
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
