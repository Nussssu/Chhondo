<?php

namespace App\Repositories\Admin\Pos;

use App\Models\AttributeOption;
use App\Models\Category;
use App\Models\Product;
use Carbon\Carbon;


class POSRepository implements POSRepositoryInterface
{
    // stock_status is required: without it the in_stock accessor falls back to
    // the quantity column and the storefront disagrees with the admin setting.
    protected $selectedColumns = ['id', 'product_name', 'slug', 'featured_image', 'price', 'previous_price', 'product_code', 'quantity', 'stock_status', 'feature','category_id','gallery_images','is_home'];

    public function getAllProductsWithDetails(array $filters = [])
    {
        $query = Product::select($this->selectedColumns)->orderBy('product_name', 'asc')->with(
            'product_attributes.attribute',
            'product_attributes.attribute_option',
            'product_campaign.campaign',
            'category'
        );


        if (!empty($filters['category'])) {
            $query->inCategory($filters['category']);
        }

        // Hide what cannot be sold. A product marked In stock is always
        // sellable regardless of its quantity column, so filtering on quantity
        // alone would hide it from the till entirely.
        $query->where(function ($q) {
            $q->where('stock_status', \App\Models\Product::STOCK_IN)
                ->orWhere(function ($inner) {
                    $inner->where('stock_status', '!=', \App\Models\Product::STOCK_OUT)
                        ->where('quantity', '>', 0);
                });
        });

        return $query->get();
    }

    public function apigetAllProductsWithDetails()
    {
        $products = Product::select($this->selectedColumns)->orderBy('product_name', 'asc')->with([
            'product_attributes.attribute',
            'product_attributes.attribute_option',
            'product_attributes_combaine',
            'product_campaign',
            'product_campaign.campaign',
            'category'
        ])->where('status','Published')->get(); // Fetch all products with relationships.

        $products->each(function ($product) {
            $product->product_attributes = $product->product_attributes_combaine->map(function ($combine) {
                // Extract option IDs from combination_string
                $optionIds = explode('_', $combine->combination_string);

                // Fetch options and their related attributes
                $options = AttributeOption::whereIn('id', $optionIds)->with('attribute')->get();

                // Separate attributes and attribute options into distinct arrays
                $attributes = $options->map(function ($option) {
                    return [
                        'id' => $option->attribute->id,
                        'name' => $option->attribute->name,
                    ];
                })->unique(); // Avoid duplicates in the attributes array.

                $attributeOptions = $options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'name' => $option->name,
                        'attribute_id' => $option->attribute->id,
                    ];
                });

                // Return the full transformed structure for each `combine`
                return [
                    'id' => $combine->id,
                    'product_id' => $combine->product_id,
                    'combination_string' => $combine->combination_string,
                    'price' => $combine->price,
                    'quantity' => $combine->quantity,
                    'created_at' => $combine->created_at,
                    'updated_at' => $combine->updated_at,
                    'attributes' => $attributes,
                    'attribute_options' => $attributeOptions,
                ];
            });
        });

        return $products; // Return the modified products as JSON.
    }

    public function getAllCategories()
    {
        return Category::where('status', 'active')->get();
    }
}
