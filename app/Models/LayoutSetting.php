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
                'menu_enabled'         => true,
                'mobile_links_enabled' => true,
                'announcement_text'    => '',
                'announcement_url'     => '',
                'show_search'          => true,
                'show_wishlist'        => true,
                'show_account'         => true,
                'show_categories_menu' => true,
                // The "Help & Support" card in the mobile drawer.
                'mobile_links'         => [
                    ['label' => 'ব্লগ', 'url' => '/blog', 'icon' => 'blog'],
                    ['label' => 'অর্ডার ট্র্যাকিং', 'url' => '/track-order', 'icon' => 'track'],
                    ['label' => 'রিটার্ন ও রিফান্ড', 'url' => '/refund-policy', 'icon' => 'refund'],
                    ['label' => 'প্রাইভেসি পলিসি', 'url' => '/privacy-policy', 'icon' => 'privacy'],
                    ['label' => 'যোগাযোগ', 'url' => '/contact-us', 'icon' => 'contact'],
                ],
            ],
            // The Chhondo footer, word for word.
            'footer' => [
                'about_text'  => "রুচিশীল বুনন আর আরামদায়ক অনুভূতির ছোঁয়ায় 'ছন্দ' হয়ে উঠুক আপনার প্রতিদিনের সাবলীল সাজের সঙ্গী।",
                'follow_label' => 'Follow Us',
                'show_logo'   => true,
                'about_enabled'   => true,
                'columns_enabled' => true,
                'columns'     => [
                    [
                        'title' => '',
                        'links' => [
                            ['label' => 'আমাদের সম্পর্কে', 'url' => '/about-us'],
                            ['label' => 'শপ', 'url' => '/shop'],
                            ['label' => 'পছন্দের তালিকা', 'url' => '/account/wishlist'],
                            ['label' => 'আমাদের গল্প', 'url' => '/about-us'],
                            ['label' => 'যোগাযোগ', 'url' => '/contact-us'],
                        ],
                    ],
                    [
                        'title' => '',
                        'links' => [
                            ['label' => 'রিটার্ন ও রিফান্ড', 'url' => '/refund-policy'],
                            ['label' => 'ডেলিভারি তথ্য', 'url' => '/shipping-and-delivery'],
                            ['label' => 'অর্ডার ট্র্যাকিং', 'url' => '/track-order'],
                        ],
                    ],
                ],
                'contact_title'   => '',
                'show_contact'    => true,
                // The footer's own contact details, separate from the store's.
                'contact_address' => 'দ্বীন মোহাম্মদ কলোনি, ঢাকা, বাংলাদেশ',
                'contact_email'   => 'limu.sir@gmail.com',
                'contact_phone'   => '01335-358032',
                'show_badges'     => false,
                'badges'          => [],
                // {year} becomes the current year, in Bangla digits.
                'copyright'   => '{year} ছন্দ। সর্বস্বত্ব সংরক্ষিত।',
                'legal_links' => [
                    ['label' => 'প্রাইভেসি পলিসি', 'url' => '/privacy-policy'],
                    ['label' => 'শর্তাবলি', 'url' => '/terms-and-conditions'],
                ],
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

    /**
     * What the storefront receives: the settings with any section switched to
     * Hidden in the admin taken out, so the storefront shows nothing for it on
     * desktop or mobile without needing to know about the switch.
     */
    public static function forStorefront(string $key): array
    {
        $settings = self::get($key);

        if ($key === 'header' && ($settings['mobile_links_enabled'] ?? true) === false) {
            $settings['mobile_links'] = [];
        }

        if ($key === 'footer') {
            if (($settings['about_enabled'] ?? true) === false) {
                $settings['about_text'] = '';
                $settings['show_logo'] = false;
            }
            if (($settings['columns_enabled'] ?? true) === false) {
                $settings['columns'] = [];
            }
        }

        return $settings;
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
