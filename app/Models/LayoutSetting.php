<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Header and footer content, stored as one JSON blob per area.
 */
class LayoutSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    public const CACHE_KEY = 'layout_settings';

    /** Defaults mirror what the components used to hardcode. */
    public static function defaults(string $key): array
    {
        return match ($key) {
            'header' => [
                'announcement_enabled' => false,
                'announcement_text'    => '',
                'announcement_url'     => '',
                'show_search'          => true,
                'show_wishlist'        => true,
                'show_account'         => true,
                'show_categories_menu' => true,
                // The "Help & Support" card in the mobile drawer.
                'mobile_links'         => [
                    ['label' => 'Blog', 'url' => '/blog', 'icon' => 'blog'],
                    ['label' => 'Track Order', 'url' => '/track-order', 'icon' => 'track'],
                    ['label' => 'Refund Policy', 'url' => '/refund-policy', 'icon' => 'refund'],
                    ['label' => 'Privacy Policy', 'url' => '/privacy-policy', 'icon' => 'privacy'],
                    ['label' => 'Contact Us', 'url' => '/contact-us', 'icon' => 'contact'],
                ],
            ],
            'footer' => [
                'about_text'  => 'ঐতিহ্যবাহী বাংলাদেশী শাড়ির প্রিমিয়াম কালেকশন। হস্তনির্মিত এবং সাংস্কৃতিক ঐতিহ্যের সমন্বয়ে তৈরি প্রতিটি শাড়ি।',
                'follow_label' => 'Follow Us',
                'show_logo'   => true,
                'columns'     => [
                    [
                        'title' => 'Quick Links',
                        'links' => [
                            ['label' => 'Home', 'url' => '/'],
                            ['label' => 'Our Story', 'url' => '/about-us'],
                            ['label' => 'Get in touch', 'url' => '/contact-us'],
                            ['label' => 'Tracking', 'url' => '/track-order'],
                        ],
                    ],
                    [
                        'title' => 'Policies',
                        'links' => [
                            ['label' => 'Privacy Policy', 'url' => '/privacy-policy'],
                            ['label' => 'Returns & Refund', 'url' => '/refund-policy'],
                            ['label' => 'Terms & Condition', 'url' => '/terms-and-conditions'],
                            ['label' => 'Shipping Delivery', 'url' => '/shipping-and-delivery'],
                        ],
                    ],
                ],
                'contact_title'   => 'Contact Us',
                'show_contact'    => true,
                'show_badges'     => true,
                'badges'          => [
                    ['title' => 'নিরাপদ পেমেন্ট', 'text' => 'আপনার পেমেন্ট সম্পূর্ণ নিরাপদ ও সুরক্ষিত।', 'icon' => 'security'],
                    ['title' => 'কাস্টমার সাপোর্ট', 'text' => 'যেকোনো প্রয়োজনে আমাদের টিম আপনার পাশে আছে।', 'icon' => 'support'],
                    ['title' => 'দেশব্যাপী ডেলিভারি', 'text' => 'আমরা আমাদের অর্ডারকৃত পণ্য সারাদেশে দ্রুততার সাথে ডেলিভারি দিয়ে থাকি', 'icon' => 'delivery'],
                ],
                'copyright'  => '',
            ],
            default => [],
        };
    }

    /** Stored values merged over the defaults, so a new key is never missing. */
    public static function get(string $key): array
    {
        $all = Cache::rememberForever(self::CACHE_KEY, fn () => self::pluck('value', 'key')->all());

        $stored = $all[$key] ?? [];
        $stored = is_string($stored) ? (json_decode($stored, true) ?: []) : ($stored ?: []);

        return array_replace(self::defaults($key), $stored);
    }

    public static function put(string $key, array $value): void
    {
        self::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
