<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

/**
 * The "Recently viewed" row on a product page.
 *
 * The browser remembers which products were looked at; the server says what
 * they are now. That split is the point of this endpoint.
 *
 * The history used to be stored as whole product objects copied into
 * localStorage, and those copies were never checked again. A snapshot went
 * stale the moment anything about the product changed, and nothing ever
 * evicted one:
 *
 *   - a product deleted from admin kept rendering, with a broken image, for
 *     as long as the visitor's browser kept the entry;
 *   - price changes, coupons and campaigns never reached the row, so it could
 *     show a higher price than the cart would charge;
 *   - the copy carried `quantity` but no `stock_status`, so products that do
 *     not count stock (quantity sits at 0) came back marked "Out of Stock".
 *
 * Storing ids and resolving them here fixes all three at once, and an
 * unpublished or deleted product simply stops coming back.
 */
class RecentlyViewedController extends Controller
{
    /** Matches MAX_STORED in RecentlyViewed.vue. */
    private const LIMIT = 8;

    public function __invoke(Request $request)
    {
        $ids = collect(explode(',', (string) $request->query('ids', '')))
            ->map(fn ($id) => (int) trim($id))
            ->filter()
            ->unique()
            ->take(self::LIMIT)
            ->values();

        if ($ids->isEmpty()) {
            return response()->json(['products' => []]);
        }

        $products = Product::query()
            ->whereIn('id', $ids)
            ->where('status', 'Published')
            // Campaign pricing. product_campaign() is the hasOne that
            // productPrice.js reads (it carries the discount and already
            // eager-loads its campaign); eager-loaded here so the map below
            // is not a query per card. The belongsToMany `campaign` is
            // deliberately not sent — it serialises to [] when empty, which
            // is truthy in JS and reads as "there is a campaign".
            ->with(['product_campaign'])
            ->get()
            // The order that matters is the order they were viewed in, which
            // only the caller knows; whereIn returns them in whatever order
            // the database likes.
            ->sortBy(fn (Product $p) => $ids->search($p->id))
            ->values()
            ->map(fn (Product $p) => [
                'id'             => $p->id,
                'slug'           => $p->slug,
                'product_name'   => $p->product_name,
                'featured_image' => $p->featured_image,
                'gallery_images' => $p->gallery_images,

                // Everything productPrice.js reads. `price` on its own loses
                // every reduction and shows more than the cart will charge.
                'price'              => $p->price,
                'previous_price'     => $p->previous_price,
                'discount_amount'    => $p->discount_amount,
                'has_discount'       => $p->has_discount,
                'discounted_price'   => $p->discounted_price,
                'product_campaign'   => $p->product_campaign,

                // Everything stock.js reads. `quantity` alone is not enough —
                // it only means anything while stock_status is 'manage'.
                'quantity'       => $p->quantity,
                'stock_status'   => $p->stock_status,
                'in_stock'       => $p->in_stock,
                'is_preorder'    => $p->is_preorder,
                'purchasable'    => $p->purchasable,
            ]);

        return response()->json(['products' => $products]);
    }
}
