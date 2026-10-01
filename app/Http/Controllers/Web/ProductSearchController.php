<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Banglish;
use Illuminate\Http\Request;

/**
 * Header search.
 *
 * The header used to filter `page.props.products`, which only the home, shop
 * and category pages send — so search returned nothing at all on the blog,
 * cart, checkout or a product page, and elsewhere only searched the handful of
 * products that page happened to be showing. It now queries the catalogue.
 */
class ProductSearchController extends Controller
{
    private const LIMIT = 8;

    public function __invoke(Request $request)
    {
        $term = trim((string) $request->query('q', ''));

        // One character matches most of the catalogue and is never a real search.
        if (mb_strlen($term) < 2) {
            return response()->json(['results' => [], 'total' => 0]);
        }

        // Products are named in Bangla, and shoppers type the sound of the name
        // in Latin letters — "saree" for শাড়ি. Both are folded to the same
        // phonetic key so either finds the product.
        $key = Banglish::key($term);

        $query = Product::query()
            ->where('status', 'Published')
            ->where(function ($q) use ($term, $key) {
                $like = '%' . $term . '%';

                $q->where('product_name', 'like', $like)
                    ->orWhere('product_code', 'like', $like)
                    ->orWhereHas('category', fn ($c) => $c->where('name', 'like', $like));

                // A key shorter than two characters matches most of the
                // catalogue and is never a real search — the folding drops
                // vowels, so a short term can reduce to almost nothing.
                if (mb_strlen($key) >= 2) {
                    $q->orWhere('search_key', 'like', '%' . $key . '%');
                }
            });

        $total = (clone $query)->count();

        $results = $query
            ->with('category:id,name,slug')
            ->orderByRaw('CASE WHEN product_name LIKE ? THEN 0 ELSE 1 END', [$term . '%'])
            ->orderBy('product_name')
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (Product $p) => [
                'id'             => $p->id,
                'product_name'   => $p->product_name,
                'slug'           => $p->slug,
                'featured_image' => $p->featured_image,
                'price'          => $p->price,
                'previous_price' => $p->previous_price,
                'category'       => $p->category?->name,
                'in_stock'       => $p->in_stock,
            ]);

        return response()->json([
            'results' => $results,
            'total'   => $total,
        ]);
    }
}
