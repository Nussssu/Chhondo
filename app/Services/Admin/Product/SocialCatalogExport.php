<?php

namespace App\Services\Admin\Product;

use App\Models\Product;
use Illuminate\Support\Collection;

/**
 * Builds the product feed CSV uploaded to Facebook/Instagram catalogues.
 *
 * The columns and their spelling match the sheet the shop already uploads, so
 * the file can replace it without remapping fields in Commerce Manager.
 *
 * Every link is absolute and built from the URL the admin panel is being used
 * at — an export taken locally points at localhost, one taken on the live site
 * at the store domain.
 */
class SocialCatalogExport
{
    public const COLUMNS = [
        'id', 'title', 'description', 'availability', 'condition',
        'price', 'link', 'image_link', 'brand',
    ];

    public const BRAND = 'Chhondo';

    /**
     * The products to export, in the order their ids were given.
     *
     * @param  int[]  $ids
     */
    public function products(array $ids): Collection
    {
        $products = Product::whereIn('id', $ids)->get()->keyBy('id');

        return collect($ids)->map(fn ($id) => $products->get($id))->filter()->values();
    }

    /** One CSV row per product, keyed by column name. */
    public function row(Product $product): array
    {
        return [
            'id'           => $product->id,
            'title'        => trim((string) $product->product_name),
            'description'  => $this->plainText($product->short_description ?: $product->description),
            'availability' => $this->availability($product),
            'condition'    => 'new',
            'price'        => $this->price($product->discounted_price),
            'link'         => url('/product/' . $this->encodeSegment((string) $product->slug)),
            'image_link'   => $this->absoluteUrl((string) $product->featured_image),
            'brand'        => self::BRAND,
        ];
    }

    /** The whole file: header line, then one line per product. */
    public function csv(Collection $products): string
    {
        $lines = [$this->line(self::COLUMNS)];

        foreach ($products as $product) {
            $lines[] = $this->line($this->row($product));
        }

        return implode("\r\n", $lines) . "\r\n";
    }

    /**
     * The values Meta accepts, read from the same rules the storefront uses so
     * the feed never offers what the product page will not sell.
     */
    private function availability(Product $product): string
    {
        if ($product->is_preorder) {
            return 'preorder';
        }

        return $product->in_stock ? 'in stock' : 'out of stock';
    }

    /** 1600.00 → "1600", 1599.50 → "1599.5", matching the sheet's whole numbers. */
    private function price(float $amount): string
    {
        return rtrim(rtrim(number_format($amount, 2, '.', ''), '0'), '.');
    }

    /**
     * The rich-text body flattened to one line.
     *
     * Block tags become spaces first so words either side of a </div> or <br>
     * do not run together once the tags are stripped.
     */
    private function plainText(?string $html): string
    {
        $text = preg_replace('/<(br|\/?(div|p|li|ul|ol|h[1-6]|tr))\b[^>]*>/i', ' ', (string) $html);
        $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Zero-width characters and BOMs pasted in from other editors.
        $text = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $text);

        return trim(preg_replace('/\s+/u', ' ', $text));
    }

    /** Stored images are site-relative paths; older rows hold a full URL already. */
    private function absoluteUrl(string $path): string
    {
        if ($path === '' || preg_match('#^https?://#i', $path)) {
            return $path;
        }

        $segments = array_map(fn ($segment) => $this->encodeSegment($segment), explode('/', ltrim($path, '/')));

        return url(implode('/', $segments));
    }

    /**
     * Percent-encodes a path segment the way the browser's encodeURIComponent
     * does, which is the form the existing sheet's Bangla links are in.
     */
    private function encodeSegment(string $segment): string
    {
        return strtr(rawurlencode($segment), [
            '%21' => '!', '%2A' => '*', '%27' => "'", '%28' => '(', '%29' => ')',
        ]);
    }

    /** Quotes a field only when it has to be quoted, as the sheet's export does. */
    private function line(array $fields): string
    {
        return implode(',', array_map(function ($value) {
            $value = (string) $value;

            return preg_match('/[",\r\n]/', $value)
                ? '"' . str_replace('"', '""', $value) . '"'
                : $value;
        }, $fields));
    }
}
