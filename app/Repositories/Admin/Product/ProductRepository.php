<?php

namespace App\Repositories\Admin\Product;

use App\Models\Attribute;
use App\Models\AttributeOption;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeCombination;
use App\Traits\FileUploadTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProductRepository implements ProductRepositoryInterface
{
    use FileUploadTrait;
    private $processedAttributeOptions = [];
    private $processedCombinations     = [];
    public function index()
    {
        // Retrieve products with their related category
        $products = Product::latest()
            // `categories` is loaded alongside the primary one so the listing can
            // filter and label by full membership without a query per product.
            ->with(['category', 'categories:id,name'])
            ->get();

        // Retrieve categories
        $categories = Category::orderBy('name', 'asc')->get();

        // Return the data in a structured format
        return [
            'products'   => $products,
            'categories' => $categories,
        ];
    }

    public function getProductCreationData()
    {
        $attributeOptions = AttributeOption::with('product')->get();
        $attributes       = Attribute::with('attributeOptions')->get();

        $categories = Category::orderBy('name')->where('status', 'Active')->get();

        return [
            'attributes'       => $attributes,
            'attributeOptions' => $attributeOptions,
            'categories'       => $categories,
        ];
    }

    // In ProductRepository

    public function createProduct(array $data)
    {
        if (isset($data['featured_image']) && $data['featured_image'] instanceof \Illuminate\Http\UploadedFile) {
            $data['featured_image'] = $this->uploadFile($data['featured_image'], 'featured_image', null, 'products');
        } elseif (! empty($data['featured_image_library_path'])) {
            $data['featured_image'] = $data['featured_image_library_path'];
        } else {
            $data['featured_image'] = null;
        }

        // Handle gallery images: newly uploaded files + images chosen from the media library
        $galleryUploaded = [];
        if (isset($data['gallery_images']) && is_array($data['gallery_images'])) {
            $filesOnly = array_filter($data['gallery_images'], fn ($f) => $f instanceof \Illuminate\Http\UploadedFile);
            if ($filesOnly) {
                $galleryUploaded = $this->uploadMultipleFiles($filesOnly, 'products')['savedImages'];
            }
        }
        $galleryExisting = array_filter($data['gallery_images_existing'] ?? []);
        $data['gallery_images'] = array_values(array_merge($galleryUploaded, $galleryExisting));

        $data['video'] = $this->resolveVideoPath(
            $data['video'] ?? null,
            $data['video_library_path'] ?? null
        ) ?? '';

        // The first chosen category is the primary one; the rest are recorded
        // on the pivot below, once the product has an id to join on.
        $categoryIds = Product::categoryIdsFrom($data);

        // The form's "Price" box is `previous_price` and the optional "Sale
        // Price" beside it is `price`; storage wants the charged figure in
        // `price`. Leaving the sale box empty therefore promotes the other one.
        [$price, $previousPrice] = Product::resolvePricePair(
            $data['previous_price'] ?? null,
            $data['price'] ?? null
        );

        [$blousePrice, $previousBlousePrice] = Product::resolvePricePair(
            $data['previous_price_with_blouse'] ?? null,
            $data['price_with_blouse'] ?? null
        );

        $product = Product::create([
            'product_name'        => $data['product_name'],
            // A permalink typed on the form wins, as it does on edit; otherwise
            // it is built from the name and code.
            'slug'                => \App\Support\Slug::unique(
                trim((string) ($data['slug'] ?? '')) !== ''
                    ? $data['slug']
                    : $data['product_name'] . '-' . ($data['product_code'] ?? $data['purchase_product_code'] ?? ''),
                'products',
                fallback: 'product'
            ),
            'product_code'        => $data['product_code'] ?? $data['purchase_product_code'] ?? null,
            'short_description'   => $data['short_description'] ?? '',
            'bullet_points'   => $data['bullet_points'] ?? '',
            'description'         => $data['description'] ?? null,
            'product_tag'         => json_encode($data['product_tag'] ?? []),
            'specification'       => json_encode($data['specification'] ?? []),
            'stock_option'        => $data['stock_option'] ?? 'Manual',
            // Available unless said otherwise: this shop does not count stock,
            // so a product arriving without a status should not sell itself out.
            'stock_status'        => $data['stock_status'] ?? Product::STOCK_IN,
            'preorder_note'       => $data['preorder_note'] ?? null,
            'quantity'            => $data['quantity'] ?? 0,
            'price'               => $price,
            'previous_price'      => $previousPrice,
            'has_blouse_option'   => ! empty($data['has_blouse_option']),
            'price_with_blouse'   => ! empty($data['has_blouse_option']) ? $blousePrice : null,
            'previous_price_with_blouse' => ! empty($data['has_blouse_option']) ? $previousBlousePrice : null,
            'category_id'         => $categoryIds[0] ?? null,
            'meta_title'          => $data['meta_title'] ?? null,
            'video_title'         => $data['video_title']??'',
            'video_section_title' => $data['video_section_title']??'',
            'video_link'          => $data['video_link']??'',
            'sec_video_title'     => $data['sec_video_title']??'',
            'video_host'          => $data['video_host']??'',
            'video'               => $data['video']??'',
            'color_links'         => $data['color_links'] ?? [],
            'meta_description'    => $data['meta_description'] ?? null,
            'featured_image'      => $data['featured_image'] ? asset($data['featured_image']) : null,
            // A plain array: the model's `array` cast encodes it. Encoding here
            // as well stored a JSON string inside JSON (see galleryImages.js).
            'gallery_images'      => $data['gallery_images'] ?? [],
        ]);

        $product->syncCategories($categoryIds);

        return $product;
    }

    // new code
    public function handleProductAttributes(int $productId, array $data): void
    {
        // dd($productId,$data);
        // Clear old data
        ProductAttribute::where('product_id', $productId)->delete();
        ProductAttributeCombination::where('product_id', $productId)->delete();

        // ---- Handle singles ----
        $singles = $data['single'] ?? [];
        foreach ($singles as $row) {
            // Only insert if row has optionId AND the checkbox was checked
            if (empty($row['optionId']) || empty($row['checked'] ?? 1)) continue;

            ProductAttribute::create([
                'product_id'          => $productId,
                'attribute_id'        => (int)($row['attributeId'] ?? 0),
                'attribute_option_id' => (int)($row['optionId'] ?? 0),
                'quantity'            => (int)($row['qty'] ?? 0),
                'price'               => (float)($row['price'] ?? 0),
                'sold_quantity'       => (int)($row['sold_quantity'] ?? 0),
                'combination_id'      => null,
            ]);
        }

        // ---- Handle combinations ----
        $combos = $data['combo'] ?? [];
        foreach ($combos as $row) {
            // Only insert if checkbox was checked
            if (empty($row['ids']) || empty($row['checked'] ?? 1)) continue;

            $optionIds = explode('_', $row['ids']);
            $attributes = [];
            foreach ($optionIds as $oid) {
                $opt = AttributeOption::find((int)$oid);
                if (!$opt) continue;
                $attributes[] = [
                    'attributeId' => $opt->attribute_id,
                    'optionId' => $opt->id,
                ];
            }

            if (empty($attributes)) continue;

            $combination = ProductAttributeCombination::create([
                'product_id' => $productId,
                'combination_string' => json_encode($attributes),
            ]);

            foreach ($attributes as $attr) {
                ProductAttribute::create([
                    'combination_id'      => $combination->id,
                    'product_id'          => $productId,
                    'attribute_id'        => $attr['attributeId'],
                    'attribute_option_id' => $attr['optionId'],
                    'quantity'            => (int)($row['qty'] ?? 0),
                    'price'               => (float)($row['price'] ?? 0),
                    'sold_quantity'       => (int)($row['sold_quantity'] ?? 0),
                ]);
            }
        }

        // ---- Update product quantity ----
        $this->updateProductQuantity($productId);
    }


    private function createSingleAttributes(int $productId, array $singles): void
    {
        foreach ($singles as $single) {
            ProductAttribute::create([
                'product_id'          => $productId,
                'attribute_id'        => (int)$single['attributeId'],
                'attribute_option_id' => (int)$single['optionId'],
                'quantity'            => (int)($single['quantity'] ?? 0),
                'price'               => (float)($single['price'] ?? 0),
                'sold_quantity'       => (int)($single['sold_quantity'] ?? 0),
                'combination_id'      => null,
            ]);
        }
    }

    public function createProductCombinations(int $productId, array $combinations): void
    {
        foreach ($combinations as $combo) {
            // Persist the combination head (save normalized attributes as JSON)
            $combination = ProductAttributeCombination::create([
                'product_id'         => $productId,
                'combination_string' => json_encode($combo['attributes']),
            ]);

            // Persist each attribute row for the combination
            foreach ($combo['attributes'] as $attr) {
                ProductAttribute::create([
                    'combination_id'      => $combination->id,
                    'product_id'          => $productId,
                    'attribute_id'        => (int)$attr['attributeId'],
                    'attribute_option_id' => (int)$attr['optionId'],
                    'quantity'            => (int)($combo['quantity'] ?? 0),
                    'price'               => (float)($combo['price'] ?? 0),
                    'sold_quantity'       => (int)($combo['sold_quantity'] ?? 0),
                ]);
            }
        }
    }

    // mamun

    private function updateProductQuantity($productId)
    {
        $product = Product::find($productId);

        if (! $product) {
            logger()->error("Product not found with ID: {$productId}");
            return;
        }

        $productAttributes = ProductAttribute::where('product_id', $productId)->get();

        if ($productAttributes->isNotEmpty()) {
            $totalQuantity = $productAttributes->sum('quantity');
            logger()->info("Updating Product Quantity for ID: {$productId}, Total: {$totalQuantity}");
            $product->quantity = $totalQuantity;
            $product->save();
        } else {
            logger()->warning("No Product Attributes found for Product ID: {$productId}");
        }
    }

    private function getAttributeOptionKey(int $attributeId, int $optionId): string
    {
        return $attributeId . '_' . $optionId;
    }

    private function getOptionNameById($optionId)
    {
        $option = AttributeOption::find($optionId);

        if (! $option) {
            // Log::warning("Attribute option not found for ID: {$optionId}");
            return 'Unknown';
        }

        return $option->name;
    }

    public function filterProducts(array $filters)
    {
        $query = Product::query();

        // Apply filters based on the passed filters array
        if (isset($filters['category_id'])) {
            $query->inCategory($filters['category_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['product_name'])) {
            $query->where('product_name', 'like', '%' . $filters['product_name'] . '%');
        }

        if (isset($filters['product_code'])) {
            $query->where('product_code', $filters['product_code']);
        }

        // Eager load category relationships
        $products = $query->with(['category', 'categories:id,name'])->get();

        return $products;
    }

    public function getCategories()
    {
        return Category::orderBy('name', 'asc')->get();
    }

    public function bulkDelete(array $productIds)
    {
        Product::whereIn('id', $productIds)->delete();
    }

    public function bulkPublish(array $productIds)
    {
        Product::whereIn('id', $productIds)->update(['status' => 'Published']);
    }

    public function bulkUnpublish(array $productIds)
    {
        Product::whereIn('id', $productIds)->update(['status' => 'Unpublished']);
    }
}
