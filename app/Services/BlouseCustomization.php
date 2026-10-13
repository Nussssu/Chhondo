<?php

namespace App\Services;

use App\Models\LayoutSetting;
use Illuminate\Validation\ValidationException;

/** CMS configuration and authoritative, server-priced blouse selections. */
class BlouseCustomization
{
    public const SETTINGS_KEY = 'blouse_customization';

    public static function defaults(): array
    {
        return [
            'enabled' => true,
            'label' => 'Blouse options',
            'legacy_without_label' => 'ব্লাউজ ছাড়া',
            'legacy_without_enabled' => true,
            'legacy_with_label' => 'ব্লাউজ সহ',
            'legacy_with_enabled' => true,
            'sleeve_label' => 'হাতা',
            'size_label' => 'সাইজ',
            'requirements_label' => 'আপনার চাহিদা (ঐচ্ছিক)',
            'requirements_placeholder' => 'যেমন: গলার ডিজাইন, মাপ বা অন্য কোনো নির্দেশনা লিখুন',
            'submit_label' => 'Confirm blouse details',
            'note' => 'আপনার সম্পূর্ণ চাহিদা জানাতে আমাদের কাস্টমার সাপোর্ট টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।',
            'options' => [['id' => 'custom-blouse', 'label' => 'কাস্টম ব্লাউজ', 'price' => 550, 'enabled' => true]],
            'sleeves' => [
                ['id' => 'half', 'label' => 'হাফ হাতা', 'enabled' => true],
                ['id' => 'full', 'label' => 'ফুল হাতা', 'enabled' => true],
            ],
            // Shown in Bangla digits; the id stays the plain number.
            'sizes' => array_map(fn ($size) => ['id' => (string) $size, 'label' => self::banglaDigits((string) $size), 'enabled' => true], range(32, 48, 2)),
        ];
    }

    public static function banglaDigits(string $text): string
    {
        return strtr($text, ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯']);
    }

    public function settings(): array
    {
        return array_replace(self::defaults(), LayoutSetting::get(self::SETTINGS_KEY));
    }

    /**
     * Settings for one product: its own on/off, price and sleeve/size lists
     * (Admin › Products › Pricing & stock) over the shared ones. A product that
     * was never given its own (`custom_blouse` null) follows the shared ones.
     */
    public function settingsFor($product = null): array
    {
        $settings = $this->settings();
        if (is_numeric($product)) {
            $product = \App\Models\Product::find($product);
        }
        $own = $product?->custom_blouse;
        if (! is_array($own)) {
            return $settings;
        }

        return self::applyProduct($settings, $own);
    }

    public static function applyProduct(array $settings, array $own): array
    {
        $settings['enabled'] = ! empty($settings['enabled']) && ! empty($own['enabled']);
        $regular = (float) ($own['price'] ?? 0);
        $sale = (float) ($own['sale_price'] ?? 0);
        $settings['options'] = array_map(function ($row) use ($regular, $sale) {
            if ($regular > 0 || $sale > 0) {
                $row['price'] = $sale > 0 ? $sale : $regular;
                $row['regular_price'] = $sale > 0 && $regular > $sale ? $regular : null;
            }
            return $row;
        }, array_slice($settings['options'] ?? [], 0, 1));
        foreach (['sleeves', 'sizes'] as $group) {
            if (! empty($own[$group]) && is_array($own[$group])) {
                $settings[$group] = array_map(fn ($row) => ['id' => (string) $row['id'], 'label' => (string) $row['label'], 'enabled' => true], $own[$group]);
            }
        }

        return $settings;
    }

    /** The admin form's JSON, cleaned for storage; null keeps the shared settings. */
    public static function sanitizeProductInput($raw): ?array
    {
        $data = is_string($raw) ? json_decode($raw, true) : $raw;
        if (! is_array($data)) {
            return null;
        }
        $tags = function ($rows): array {
            $out = [];
            foreach (is_array($rows) ? $rows : [] as $row) {
                $label = trim(mb_substr((string) (is_array($row) ? ($row['label'] ?? '') : $row), 0, 60));
                $id = trim(mb_substr((string) (is_array($row) ? ($row['id'] ?? $label) : $label), 0, 80));
                if ($label !== '' && $id !== '' && ! isset($out[mb_strtolower($id)])) {
                    $out[mb_strtolower($id)] = ['id' => $id, 'label' => $label];
                }
            }
            return array_values(array_slice($out, 0, 40));
        };
        $money = fn ($value) => is_numeric($value) && (float) $value > 0 ? round((float) $value, 2) : null;
        $price = $money($data['price'] ?? null);
        $sale = $money($data['sale_price'] ?? null);
        // A sale price that is not below the price is no sale at all.
        if ($price && $sale && $sale >= $price) {
            $sale = null;
        }

        return [
            'enabled' => filter_var($data['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'price' => $price,
            'sale_price' => $sale,
            'sleeves' => $tags($data['sleeves'] ?? []),
            'sizes' => $tags($data['sizes'] ?? []),
        ];
    }

    public function resolve(?array $selection, $product = null): ?array
    {
        if (empty($selection['option_id'])) {
            return null;
        }
        $settings = $this->settingsFor($product);
        if (! $settings['enabled']) {
            throw ValidationException::withMessages(['blouse_customization' => 'Blouse customization is currently unavailable.']);
        }
        $find = function (string $group, string $id, string $label) use ($settings): array {
            $row = collect($settings[$group])->first(fn ($row) => (string) $row['id'] === $id && ($row['enabled'] ?? true));
            if (! $row) {
                $key = ['options' => 'option_id', 'sleeves' => 'sleeve_type', 'sizes' => 'size'][$group];
                throw ValidationException::withMessages(["blouse_customization.{$key}" => "Please select an available {$label}."]);
            }
            return $row;
        };
        $option = $find('options', (string) $selection['option_id'], 'option');
        $sleeve = $find('sleeves', (string) ($selection['sleeve_type'] ?? ''), 'sleeve type');
        $size = $find('sizes', (string) ($selection['size'] ?? ''), 'size');
        $requirements = trim((string) ($selection['requirements'] ?? ''));
        if (mb_strlen($requirements) > 2000) {
            throw ValidationException::withMessages(['blouse_customization.requirements' => 'Requirements must be 2000 characters or less.']);
        }

        // Client-provided prices, labels and notes are deliberately ignored.
        return [
            'option_id' => (string) $option['id'], 'label' => $option['label'],
            'unit_price' => round((float) $option['price'], 2),
            'sleeve_type' => (string) $sleeve['id'], 'sleeve_label' => $sleeve['label'],
            'size' => (string) $size['id'], 'size_label' => $size['label'],
            'sleeve_title' => $settings['sleeve_label'], 'size_title' => $settings['size_label'],
            'requirements_title' => $settings['requirements_label'],
            'requirements' => $requirements, 'note' => $settings['note'],
        ];
    }

    public function identity(array $selection): string
    {
        return hash('sha256', json_encode(array_intersect_key($selection, array_flip(['option_id', 'sleeve_type', 'size', 'requirements']))));
    }

    public static function describe(?array $selection): string
    {
        if (! $selection) return '';
        return implode(' · ', array_filter([
            ($selection['label'] ?? 'Custom Blouse').' (+৳'.number_format((float) ($selection['unit_price'] ?? 0), 2).')',
            ($selection['sleeve_title'] ?? 'Sleeve Type').': '.($selection['sleeve_label'] ?? ''),
            ($selection['size_title'] ?? 'Size').': '.($selection['size_label'] ?? ''),
            $selection['requirements'] ?? '', $selection['note'] ?? '',
        ]));
    }
}
