<?php
namespace App\Http\Controllers\Admin\Product;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeCombination;
use App\Models\PurchaseGroup;
use App\Repositories\Admin\Product\ProductRepositoryInterface;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Product\SocialCatalogExport;
use App\Traits\FileUploadTrait;
use function Pest\Laravel\json;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use FileUploadTrait;

    protected $productService;
    protected $productRepository;

    public function __construct(ProductService $productService, ProductRepositoryInterface $productRepository)
    {
        $this->productService    = $productService;
        $this->productRepository = $productRepository;
    }

    public function index(Request $request)
{
    $data = $this->productService->index();

    // Filter by category_id if provided. A product may be filed under several
    // categories, so this matches membership rather than the primary column.
    $products = $data['products'];
    if ($request->has('category_id') && $request->category_id != '') {
        $categoryId = (int) $request->category_id;
        $products   = $products->filter(fn ($product) => in_array($categoryId, $product->categoryIds(), true));
    }

    return Inertia::render('Admin/Products/Index', [
        'product'          => $products->values(),
        'category'         => $data['categories'],
        'selectedCategory' => $request->category_id ?? '',
        'frontendUrl'      => env('FRONTEND', ''),
    ]);
}

    /**
     * Download the chosen products as a Facebook/Instagram catalogue CSV.
     *
     * Ids arrive comma-separated in the query so the browser can fetch the
     * file with a plain link and keep the admin page open.
     */
    public function exportSocial(Request $request, SocialCatalogExport $export)
    {
        $ids = collect(explode(',', (string) $request->query('ids')))
            ->map(fn ($id) => (int) trim($id))
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values()
            ->all();

        abort_if($ids === [], 422, 'Choose at least one product to export.');

        $csv      = $export->csv($export->products($ids));
        $filename = 'charukothon-catalog-' . now()->format('Y-m-d') . '.csv';

        return response($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function is_home_toggle($id)
    {
        $product          = Product::findOrFail($id);
        $product->is_home = $product->is_home ? false : true;
        $product->save();
        return redirect()->back()->with('success', 'Updated successfully');
    }
    /** Toggle whether a product is shown in "New arrivals" page widgets. */
    public function newArrivalToggle($id)
    {
        $product                 = Product::findOrFail($id);
        $product->is_new_arrival = ! $product->is_new_arrival;
        $product->save();

        return redirect()->back()->with('success', 'Updated successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $data = $this->productService->getProductCreationData();

        return Inertia::render('Admin/Products/Create', [
            'attributes'       => $data['attributes'],
            'attributeOptions' => $data['attributeOptions'],
            'categories'       => $data['categories'],
        ]);
    }

    /**
     * Store a newly created resource in storage.ProductRequest
     */

    public function store(ProductRequest $request)
    {
        //    return $request->all();
        $this->productService->storeProduct($request);

        return redirect()->route('products.index')->with('success', 'New product created successfully');
    }

    public function edit(string $id)
    {
        // Load product with relations
        $product = Product::with(['product_attributes', 'categories:id,name'])->findOrFail($id);

        // ----------- Tags -----------
        $tagValues = collect(json_decode($product->product_tag, true) ?? [])
            ->map(fn($tagJson) => json_decode($tagJson, true))
            ->filter(fn($tags) => is_array($tags))
            ->flatMap(fn($tags) => collect($tags)->pluck('value'))
            ->filter()
            ->values()
            ->toArray();

        // ----------- Specification -----------
        $specifications = json_decode($product->specification, true) ?? [];

        // ----------- Attributes (for dropdowns) -----------
        $attributes        = Attribute::with('attribute_option')->get();
        $productAttributes = $product->product_attributes->pluck('attribute_option_id')->toArray();

        // ----------- Single Attributes -----------
        $singleAttributes = ProductAttribute::where('product_id', $product->id)
            ->whereNull('combination_id')
            ->get();

        // ----------- Product Combinations -----------
        $productCombinations = ProductAttributeCombination::where('product_id', $product->id)
            ->get()
            ->map(function ($combination) use ($product) {
                $combinationData = json_decode($combination->combination_string, true);

                if (! is_array($combinationData)) {
                    $combination->price      = "0.00";
                    $combination->quantity   = 0;
                    $combination->attributes = collect();
                    return $combination;
                }

                $relatedAttributes = ProductAttribute::where('product_id', $product->id)
                    ->where('combination_id', $combination->id)
                    ->get();

                $matchingAttribute = $relatedAttributes->first(function ($attribute) use ($combinationData) {
                    foreach ($combinationData as $data) {
                        if (
                            $data['attributeId'] != $attribute->attribute_id ||
                            $data['optionId'] != $attribute->attribute_option_id
                        ) {
                            return false;
                        }
                    }
                    return true;
                });

                $combination->price = $matchingAttribute
                    ? number_format((float) $matchingAttribute->price, 2)
                    : "0.00";

                $combination->quantity = $matchingAttribute
                    ? (int) $matchingAttribute->quantity
                    : 0;

                $combination->attributes = $relatedAttributes;

                return $combination;
            });

        // ----------- Categories -----------
        $categories = Category::where('status', 'Active')->orderBy('name')->get();

        // dd($productCombinations->toArray());
        // ----------- Build savedProductAttributes for JS -----------
        $savedProductAttributes = [
            'mode'          => $productCombinations->isNotEmpty() ? 'combination' : 'single',
            'selected'      => $attributes->mapWithKeys(function ($attr) use ($productAttributes) {
                $selectedOptions = $attr->attribute_option
                    ->whereIn('id', $productAttributes)
                    ->map(fn($opt) => [
                        'id'       => $opt->id,
                        'name'     => $opt->name,
                        'attrId'   => $attr->id,
                        'attrName' => $attr->name,
                    ])->values();
                return $selectedOptions->isNotEmpty() ? [$attr->id => $selectedOptions] : [];
            })->toArray(),
            'singleOptions' => $singleAttributes->map(fn($sa) => [
                'optionId' => $sa->attribute_option_id,
                'price'    => $sa->price,
                'qty'      => $sa->quantity,
            ])->toArray(),
            'combinations'  => $productCombinations->map(function ($combo) {
                $comboAttrs = json_decode($combo->combination_string, true) ?? [];
                $ids        = collect($comboAttrs)->pluck('optionId')->implode('_');

                return [
                    'ids'   => $ids,
                    'price' => $combo->attributes->first()->price,
                    'qty'   => $combo->attributes->first()->quantity,
                ];
            })->toArray()
        ];

        // dd($savedProductAttributes);
        // ----------- Return View -----------
        return Inertia::render('Admin/Products/Edit', [
            'product'               => $product,
            'tagValues'             => $tagValues,
            'specifications'        => $specifications,
            'attributes'            => $attributes,
            'productAttributes'     => $productAttributes,
            'singleAttributes'      => $singleAttributes,
            'productCombinations'   => $productCombinations,
            'categories'            => $categories,
            // Primary first, so the form can show which one names the product.
            'selectedCategoryIds'   => $product->categoryIds(),
            'savedProductAttributes'=> $savedProductAttributes,
        ]);
    }

    /**
     * Update the specified resource in storage.ProductRequest
     */
    public function update(Request $request, Product $product)
    {
        // NOTE: this method otherwise saves $request->all() unvalidated. The
        // video link is checked here because an unreadable one shows as a blank
        // frame on the product page rather than failing visibly; the stock
        // status because an unrecognised value there silently makes a product
        // unbuyable — every availability rule falls through to the quantity.
        $request->validate([
            'video_link' => ['nullable', 'string', 'max:255', ProductRequest::videoLinkRule($request->input('video_host'))],
            'stock_status' => ['nullable', \Illuminate\Validation\Rule::in(Product::STOCK_STATUSES)],
            'preorder_note' => ['nullable', 'string', 'max:500'],
            // A product with no category disappears from every archive, and an
            // id that does not exist would leave a dangling pivot row. The
            // single `category_id` is still accepted for callers that predate
            // the multi-select — the POS and imports both still post it.
            'category_ids'   => ['required_without:category_id', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'category_id'    => ['required_without:category_ids', 'integer', 'exists:categories,id'],
            // One of the two must survive: `price` is NOT NULL, and clearing
            // the sale box promotes the price beside it (resolvePricePair).
            'price'          => ['required_without:previous_price', 'nullable', 'numeric', 'min:0'],
            'previous_price' => [
                'required_without:price', 'nullable', 'numeric', 'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    // Only compared when a sale price was actually given.
                    if ($value && $request->filled('price') && $value <= (float) $request->input('price')) {
                        $fail('The sale price must be lower than the price.');
                    }
                },
            ],
            'price_with_blouse' => ['nullable', 'numeric', 'min:0'],
            // A "was" price that is not higher than the sale price shows a
            // saving of zero or less. Written as a closure rather than
            // `gt:price_with_blouse` because that field may be absent, which
            // the gt rule reads as a literal rather than as an empty value.
            'previous_price_with_blouse' => [
                'nullable', 'numeric', 'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    $sale = (float) $request->input('price_with_blouse');

                    if ($value && $sale > 0 && $value <= $sale) {
                        $fail('The sale price with blouse must be lower than the price with blouse.');
                    }
                },
            ],
        ], [
            'category_ids.required_without' => 'Choose at least one category.',
            'category_id.required_without'  => 'Choose at least one category.',
            'price.required_without'          => 'Enter a price.',
            'previous_price.required_without' => 'Enter a price.',
        ]);

        $validatedData = $request->all();
        // dd($validatedData);

        // First chosen category is the primary one; the pivot is written below,
        // after the row itself is saved.
        $categoryIds = Product::categoryIdsFrom($validatedData);

        // The form's "Price" box is `previous_price` and the optional "Sale
        // Price" beside it is `price`; storage wants the charged figure in
        // `price`. Clearing the sale box therefore promotes the other one.
        [$price, $previousPrice] = Product::resolvePricePair(
            $validatedData['previous_price'] ?? null,
            $validatedData['price'] ?? null
        );

        [$blousePrice, $previousBlousePrice] = Product::resolvePricePair(
            $validatedData['previous_price_with_blouse'] ?? null,
            $validatedData['price_with_blouse'] ?? null
        );

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $exitingImage                    = $product->featured_image;
            $validatedData['featured_image'] = $this->updateFile($request->file('featured_image'), $exitingImage, 'products');
        } elseif ($request->filled('featured_image_library_path')) {
            $validatedData['featured_image'] = $request->input('featured_image_library_path');
        }

         $existingImages = $request->input('existing_gallery_images', []);


        if (is_string($existingImages)) {
            $decoded = json_decode($existingImages, true);

            // A malformed payload must never silently wipe the saved gallery:
            // keep whatever the product already has instead of falling back to [].
            if (! is_array($decoded)) {
                $current = $product->getRawOriginal('gallery_images');
                $current = is_string($current) ? json_decode($current, true) : $current;
                $decoded = is_array($current) ? $current : [];
            }

            $existingImages = $decoded;
        }


        $existingImages = is_array($existingImages) ? $existingImages : [];


        $newGalleryImages = [];


        if ($request->hasFile('gallery_images')) {

            $savedGalleryImages = $this->updateProductGallery($request, $product);
            if (!empty($savedGalleryImages)) {

                $newGalleryImages = $savedGalleryImages;
            }
        }


        if (isset($newGalleryImages) && is_string($newGalleryImages)) {
            $newGalleryImages = json_decode($newGalleryImages, true);
        }


        $newGalleryImages = is_array($newGalleryImages) ? $newGalleryImages : [];


        $finalGalleryImages = array_merge($existingImages, $newGalleryImages);

        $newVideo = $this->resolveVideoPath(
            $request->file('video'),
            $request->input('video_library_path')
        );

        if ($newVideo) {
            // The old file may be a library asset other products point at.
            app(\App\Services\ImageUploadService::class)->deleteFileUnlessInLibrary($product->video);
            $validatedData['video'] = $newVideo;
        } else {
            // Keep the existing video path if nothing new was supplied
            $validatedData['video'] = $product->video;
        }

        // Ensure JSON fields are encoded properly
        $jsonFields = ['product_tag', 'specification', 'attributes'];
        foreach ($jsonFields as $jsonField) {
            if (isset($validatedData[$jsonField]) && is_array($validatedData[$jsonField])) {
                $validatedData[$jsonField] = json_encode($validatedData[$jsonField]);
            }
        }

        // Update product data
        $product->update([
            'product_name'      => $validatedData['product_name'],
            // The slug is never recomputed from the name: regenerating it on every
            // edit silently moved live product URLs. It changes only when the
            // operator edits the field themselves, and a product that somehow has
            // none gets one assigned.
            'slug'              => $this->resolveSlug($product, $validatedData),
            'product_code'      => $validatedData['product_code'],
            'short_description' => $validatedData['short_description'] ?? '',
            'bullet_points'     => $validatedData['bullet_points'] ?? '',
            'description'       => $validatedData['description'],
            'product_tag'       => $validatedData['product_tag'],
            'specification'     => $validatedData['specification'] ?? null,
            'stock_option'      => $validatedData['stock_option'] ?? 'Manual',
            // An edit that says nothing about stock leaves it as it was, rather
            // than resetting the product to a hardcoded default.
            'stock_status'      => $validatedData['stock_status'] ?? $product->stock_status ?? Product::STOCK_IN,
            'preorder_note'     => $validatedData['preorder_note'] ?? null,
            'quantity'          => $validatedData['quantity'] ?? 0,
            'price'             => $price,
            'previous_price'    => $previousPrice,
            'has_blouse_option' => ! empty($validatedData['has_blouse_option']),
            'price_with_blouse' => ! empty($validatedData['has_blouse_option']) ? $blousePrice : null,
            'previous_price_with_blouse' => ! empty($validatedData['has_blouse_option']) ? $previousBlousePrice : null,
            'category_id'       => $categoryIds[0] ?? $product->category_id,
            'meta_title'        => $validatedData['meta_title'],
            'meta_description'  => $validatedData['meta_description'],
            'featured_image'    => $validatedData['featured_image'] ?? $product->featured_image,
            // Pass the plain array: the model's 'array' cast encodes it. Encoding here
            // too stored a JSON string *inside* a JSON string, which the accessor then
            // decoded to a string instead of a list, emptying the gallery on the site.
            'gallery_images'    => $finalGalleryImages,
            'color_links'=> $validatedData['color_links'] ?? [],
            'video_title' => $validatedData['video_title']??'',
            'video_section_title' => $validatedData['video_section_title']??'',
            'video_link' => $validatedData['video_link']??'',
            'sec_video_title' => $validatedData['sec_video_title']??'',
            'video_host' => $validatedData['video_host']??'',
            'video' => $validatedData['video']??'',
        ]);

        $product->syncCategories($categoryIds);

        if (! empty($validatedData['single']) || ! empty($validatedData['combo'])) {
            $this->productRepository->handleProductAttributes($product->id, $validatedData);
        }

        return redirect()->back()->with('success', 'Product updated successfully');
    }

    /**
     * Copy a product into a new draft.
     *
     * Everything the operator would otherwise retype is carried over — pricing,
     * media, description, SEO, and the attribute rows with their combinations.
     * What must not be shared is regenerated: the product code and the slug are
     * unique keys, and the copy starts unpublished so a half-finished product
     * never appears on the storefront. Sales history (orders, reviews, coupons,
     * campaigns, stock sold) belongs to the original and is not copied.
     */
    public function duplicate(Product $product)
    {
        $copy = null;

        DB::transaction(function () use ($product, &$copy) {
            $copy = $product->replicate([
                'created_at', 'updated_at',
            ]);

            $copy->product_name  = $product->product_name . ' (copy)';
            $copy->product_code  = $this->uniqueProductCode($product->product_code);
            $copy->slug          = \App\Support\Slug::unique(
                $product->product_name . '-' . $copy->product_code,
                'products',
                fallback: 'product'
            );
            $copy->status        = 'Unpublished';
            // Flags that place a product on the storefront are opt-in on a copy.
            $copy->is_home       = false;
            $copy->is_new_arrival = false;
            $copy->save();

            // Combinations are copied first: the attribute rows point at them,
            // and the copy's rows must point at the copy's combinations.
            $combinationMap = [];

            foreach ($product->product_attributes_combaine as $combination) {
                $newCombination = $combination->replicate(['created_at', 'updated_at']);
                $newCombination->product_id = $copy->id;
                $newCombination->save();

                $combinationMap[$combination->id] = $newCombination->id;
            }

            foreach ($product->product_attributes as $attribute) {
                $newAttribute = $attribute->replicate(['created_at', 'updated_at']);
                $newAttribute->product_id = $copy->id;
                $newAttribute->combination_id = $combinationMap[$attribute->combination_id] ?? null;
                // Units sold belong to the original product's history.
                $newAttribute->sold_quantity = 0;
                $newAttribute->save();
            }

            // replicate() copies columns, not pivots — without this the copy
            // keeps only its primary category.
            $copy->categories()->sync($product->categories()->pluck('categories.id')->all());
        });

        return redirect()
            ->route('products.edit', $copy->id)
            ->with('success', 'Product duplicated — it is unpublished until you publish it.');
    }

    /** A product code no other product is using, based on the one copied. */
    private function uniqueProductCode(?string $code): string
    {
        $base = trim((string) $code) !== '' ? trim((string) $code) : 'PRD';
        $candidate = $base . '-copy';
        $suffix = 2;

        while (Product::where('product_code', $candidate)->exists()) {
            $candidate = $base . '-copy-' . $suffix++;
        }

        return $candidate;
    }

    /**
     * The slug to save for an existing product.
     *
     * Whatever is typed is put through the same normaliser the site generates
     * with, so a pasted title or a stray slash cannot produce an address that
     * fails to resolve, and a collision gets a -2 suffix rather than an error.
     */
    private function resolveSlug(Product $product, array $data): string
    {
        $typed = trim((string) ($data['slug'] ?? ''));

        if ($typed !== '' && $typed !== $product->slug) {
            return \App\Support\Slug::unique(
                $typed,
                'products',
                ignoreId: $product->id,
                fallback: 'product'
            );
        }

        return $product->slug ?: \App\Support\Slug::unique(
            $data['product_name'] . '-' . ($data['product_code'] ?? ''),
            'products',
            ignoreId: $product->id,
            fallback: 'product'
        );
    }

    public function destroy(string $id)
    {
        // Find the product by its ID
        $product = Product::find($id);

        if (! $product) {
            return redirect()->back()->with('error', 'Product not found');
        }

        // The image files are left in place, as bulk delete leaves them. They are
        // not the product's own: a duplicated product points at the original's
        // files, and a media-library pick points at the library's copy, so
        // unlinking them broke those products and emptied library items.
        // (Deleting them also crashed: gallery_images is cast to an array, and
        // the helper json_decode()d it, so the product itself never went.)

        // Delete the product from the database
        $product->delete();

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Product item deleted');
    }

    public function toggleStatus(Product $product)
    {
        // Toggle the status
        $product->status = $product->status === 'Published' ? 'Unpublished' : 'Published';
        $product->save();

        // Return a JSON response
        return response()->json([
            'status'  => $product->status,
            'message' => 'Product status updated successfully!',
        ]);
    }

    public function toggleFeature(Product $product)
    {
        // Toggle the status
        $product->feature = $product->feature === 'New Arrival' ? 'None' : 'New Arrival';
        $product->save();

        // Return a JSON response
        return response()->json([
            'feature' => $product->feature,
            'message' => 'Product status updated successfully!',
        ]);
    }

    public function getPurchaseData($product_code)
    {
        // Fetch data from the purchase_groups table
        $purchaseGroup = PurchaseGroup::where('product_code', $product_code)->first();

        if ($purchaseGroup) {
            return response()->json([
                'status' => 'success',
                'data'   => $purchaseGroup,
            ]);
        }

        return response()->json([
            'status'  => 'error',
            'message' => 'Product code not found.',
        ], 404);
    }

    public function filter(Request $request)
    {

        $filters = $request->only([
            'category_id',
            'status',
            'product_name',
            'product_code',
        ]);

        // Get the filtered products from the service
        $product = $this->productService->filterProducts($filters);

        // Get categories
        $category = $this->productService->getCategories();

        // Return view with filtered data
        return Inertia::render('Admin/Products/Index', [
            'product'          => $product->values(),
            'category'         => $category,
            'selectedCategory' => $request->category_id ?? '',
            'frontendUrl'      => env('FRONTEND', ''),
        ]);
    }

    public function bulkDelete(Request $request)
    {

        $productIds = $request->input('ids');

        if (empty($productIds)) {
            return response()->json(['message' => 'No products selected'], 400);
        }

        // Call service method to delete products
        $this->productService->bulkDelete($productIds);

        return response()->json(['message' => 'Products deleted successfully']);
    }

    public function bulkPublish(Request $request)
    {
        // Validate that `ids` is provided and is an array
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        // Update the status of selected products
        $this->productService->bulkPublish($request->ids);

        // Return success response using ApiResponse
        return ApiResponse::success([], 'Selected products have been published successfully.');
    }

    public function bulkUnpublish(Request $request)
    {
        // Validate that `ids` is provided and is an array
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        // Update the status of selected products
        $this->productService->bulkUnpublish($request->ids);

        // Return success response using ApiResponse
        return ApiResponse::success([], 'Selected products have been Unpublished successfully.');
    }
}
