<?php

namespace App\Repositories\Admin\Report;

use App\Models\Order;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\SiteInfo;


use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;



class ReportRepository implements ReportRepositoryInterface
{
    public function getAllOrders(Request $request): LengthAwarePaginator
    {
        $query = Order::with(['items.options', 'items.product'])
            ->orderBy('created_at', 'desc');

        $query = $this->applyFilters($query, $request);

        return $query->paginate(10);
    }


    public function getOfficialSaleReport(Request $request): LengthAwarePaginator
    {
        $query = Order::with(['items.options', 'items.product'])
            ->where('order_type', 'pos')
            ->orderBy('created_at', 'desc');

        $query = $this->applyFilters($query, $request);

        return $query->paginate(10);
    }

    public function getPurchaseReport(Request $request): LengthAwarePaginator
    {
        // $query = Product::where('stock_option', 'From Purchase')
        //     ->with(['productAttributes.attribute', 'productAttributes.attributeOption'])
        //     ->orderBy('created_at', 'desc');


        $query =  Purchase::with([
            'supplier',
        ])
            ->orderBy('created_at', 'desc');






        $query = $this->applyFilters($query, $request);

        return $query->paginate(10);
    }





    public function getStockReport()
    {
        // Eager load product attributes with related data
        $products = Product::with([
            'productAttributes' => function ($query) {
                $query->select([
                    'product_id',
                    'combination_id',
                    'attribute_id',
                    'attribute_option_id',
                    'quantity',
                    'sold_quantity'
                ]);
            },
            'productAttributes.attribute',
            'productAttributes.attributeOption',
        ])
            ->select(
                'id',
                'product_name',
                'featured_image',
                'sold_quantity',
                'quantity',
                'product_code',
                'price'
            )->get();

        $formattedProducts = $products->map(function ($product) {
            // Check if any attribute has a non-empty combination_id
            $hasCombination = $product->productAttributes
                ->pluck('combination_id')
                ->filter(function ($combinationId) {
                    return !empty($combinationId);
                })
                ->isNotEmpty();

            if ($hasCombination) {
                // Group attributes by combination_id while keeping the result as a Collection
                $productCombinations = $product->productAttributes
                    ->groupBy('combination_id')
                    ->map(function ($attributes, $combinationId) {
                        return [
                            'combination_id' => $combinationId,
                            'attributes' => $attributes->map(function ($attribute) {
                                return [
                                    'attribute_id'   => $attribute->attribute_id,
                                    'attribute_name' => $attribute->attribute->name ?? null,
                                    'option_id'      => $attribute->attribute_option_id,
                                    'option_name'    => $attribute->attributeOption->name ?? null,
                                    'quantity'       => $attribute->quantity,
                                    'sold_quantity'  => $attribute->sold_quantity,
                                ];
                            })->filter()->values(), // remove empties and re-index
                        ];
                    });

                // Use the collection for any further processing
                $stockDetails = $this->formatStockDetails($productCombinations);
                $totalAttributeQuantity = collect($stockDetails)->sum('initial_stock');
                $remainingQuantity = $totalAttributeQuantity - collect($stockDetails)->sum('sold');

                return [
                    'id'                       => $product->id,
                    'product_name'             => $product->product_name,
                    'featured_image'           => $product->featured_image,
                    'sold_quantity'            => $product->sold_quantity,
                    'total_quantity'           => $product->quantity,
                    'total_attribute_quantity' => $totalAttributeQuantity,
                    'remaining_quantity'       => $remainingQuantity,
                    'product_code'             => $product->product_code,
                    'price'                    => $product->price,
                    'stock_details'            => $stockDetails,
                    'productCombinations'      => $productCombinations->toArray(), // convert to array only at return
                ];
            } else {
                // If no non-empty combination_id exists, create a single combination with an empty key
                $productCombinations = collect([
                    '' => [
                        'combination_id' => '',
                        'attributes' => $product->productAttributes->map(function ($attribute) {
                            return [
                                'attribute_id'   => $attribute->attribute_id,
                                'attribute_name' => $attribute->attribute->name ?? null,
                                'option_id'      => $attribute->attribute_option_id,
                                'option_name'    => $attribute->attributeOption->name ?? null,
                                'quantity'       => $attribute->quantity,
                                'sold_quantity'  => $attribute->sold_quantity,
                            ];
                        })->values()->toArray()
                    ]
                ]);

                return [
                    'id'                  => $product->id,
                    'product_name'        => $product->product_name,
                    'featured_image'      => $product->featured_image,
                    'sold_quantity'       => $product->sold_quantity,
                    'quantity'            => $product->quantity + $product->sold_quantity,
                    'available_quantity'  => $product->quantity,
                    'product_code'        => $product->product_code,
                    'price'               => $product->price,
                    'productCombinations' => $productCombinations->toArray(),
                ];
            }
        });



        $page = request()->get('page', 1);
        $perPage = 5;
        $offset = ($page * $perPage) - $perPage;

        $paginatedItems = array_slice($formattedProducts->toArray(), $offset, $perPage);

        // Create LengthAwarePaginator
        $formattedProducts = new LengthAwarePaginator(
            collect($paginatedItems), // Pass sliced data as a collection
            count($formattedProducts), // Total count of original collection
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        return $formattedProducts;
    }


    public function formatStockDetails($productCombinations)
    {
        // No product combinations
        if ($productCombinations->isEmpty()) {
            return null;
        }

        // Multiple combinations
        $stockDetails = [];

        foreach ($productCombinations as $combination) {
            // Ensure combination has attributes
            if (!empty($combination['attributes'])) {
                $combinationDetails = $this->formatCombinationDetails($combination['attributes']);

                // Only add if combination details are not empty
                if (!empty($combinationDetails)) {
                    $stockDetails[] = $combinationDetails;
                }
            }
        }

        return !empty($stockDetails) ? $stockDetails : null;
    }

    private function formatCombinationDetails($attributes)
    {
        $combinationAttributes = [];
        $initialStock = 0;
        $soldQuantity = 0;

        foreach ($attributes as $attribute) {
            // Add attribute details
            $combinationAttributes[] = [
                'attribute_name' => $attribute['attribute_name'],
                'option_name' => $attribute['option_name']
            ];

            // Track stock and sold quantities
            $initialStock = max($initialStock, $attribute['quantity']);
            $soldQuantity = max($soldQuantity, $attribute['sold_quantity']);
        }

        // If no valid attributes, return empty
        if (empty($combinationAttributes)) {
            return null;
        }

        // Combine attributes into a readable string
        $attributeString = implode(
            ' + ',
            array_map(function ($attr) {
                return "{$attr['attribute_name']}: {$attr['option_name']}";
            }, $combinationAttributes)
        );

        return [
            'combination_details' => $attributeString,
            'initial_stock' => $initialStock + $soldQuantity,
            'sold' => $soldQuantity,
            'in_stock' => $initialStock,
        ];
    }






    protected function applyFilters($query, Request $request)
    {
        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        } elseif ($request->start_date) {
            $query->where('created_at', '>=', $request->start_date);
        } elseif ($request->end_date) {
            $query->where('created_at', '<=', $request->end_date);
        }

        // Filter by predefined date ranges
        if ($request->date_filter) {
            switch ($request->date_filter) {
                case 'today':
                    $query->whereDate('created_at', now()->toDateString());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', now()->subDay()->toDateString());
                    break;
                case 'this_week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'last_week':
                    $query->whereBetween('created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereMonth('created_at', now()->month);
                    break;
                case 'last_month':
                    $query->whereMonth('created_at', now()->subMonth()->month);
                    break;
            }
        }

        return $query;
    }

    public function getOutStockReport(): LengthAwarePaginator
    {
        $quantity_indicator = 0;

        // Paginate products that either have quantity <= 0 or attributes with quantity <= 0
        $products = Product::with(['productAttributes.attribute', 'productAttributes.attributeOption'])
            ->where(function ($query) use ($quantity_indicator) {
                // Products without attributes and out of stock
                $query->whereDoesntHave('productAttributes')
                    ->where('quantity', '<=', $quantity_indicator);

                // Products with attributes that are out of stock
                $query->orWhereHas('productAttributes', function ($q) use ($quantity_indicator) {
                    $q->where('quantity', '<=', $quantity_indicator);
                });
            })
            ->paginate(10);

        // Filter only out-of-stock attributes in the mapping
        $stockOutReports = $products->getCollection()->map(function ($product) {
            $attrData = [];

            $grouped = $product->productAttributes
                ->where('quantity', '<=', 0) // <== Filter out in-stock attributes
                ->groupBy('combination_id');

            foreach ($grouped as $combinationId => $attrs) {
                if ($combinationId) {
                    $firstAttr = $attrs->first();
                    $attrData[] = [
                        'id' => $firstAttr->id,
                        'attribute' => $firstAttr->attribute,
                        'attribute_option' => $firstAttr->attributeOption,
                        'quantity' => $firstAttr->quantity,
                        'sold_quantity' => $firstAttr->sold_quantity,
                        'combination_id' => $combinationId,
                    ];
                } else {
                    foreach ($attrs as $attr) {
                        $attrData[] = [
                            'id' => $attr->id,
                            'attribute' => $attr->attribute,
                            'attribute_option' => $attr->attributeOption,
                            'quantity' => $attr->quantity,
                            'sold_quantity' => $attr->sold_quantity,
                            'combination_id' => null,
                        ];
                    }
                }
            }

            // Only return product if it has out-of-stock attributes OR itself is out-of-stock
            if ($attrData || ! $product->in_stock) {
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'product_code' => $product->product_code,
                    'featured_image' => $product->featured_image,
                    'quantity' => $product->quantity,
                    'sold_quantity' => $product->sold_quantity,
                    'price' => $product->price,
                    'product_attributes' => $attrData,
                ];
            }
        })->filter(); // remove nulls

        return new LengthAwarePaginator(
            $stockOutReports,
            $products->total(),
            $products->perPage(),
            $products->currentPage(),
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }



    public function getUpcommingStockOutReport()
    {
        $siteInfo = SiteInfo::first();
        $quantityIndicator = $siteInfo ? $siteInfo->quantity_indicator : 0;

        $products = Product::with([
            'productAttributes' => function ($query) {
                $query->select(['id', 'product_id', 'combination_id', 'attribute_id', 'attribute_option_id', 'quantity', 'sold_quantity']);
            },
            'productAttributes.attribute',
            'productAttributes.attributeOption',
        ])
            ->whereBetween('quantity', [1, $quantityIndicator]) // Ensure quantity is between 1 and quantityIndicator
            ->select('id', 'product_name', 'sold_quantity', 'quantity', 'stock_status', 'product_code', 'price', 'featured_image')
            ->paginate(10);

        $products->getCollection()->transform(function ($product) {
            // Group product attributes by combination_id
            $product->productCombinations = $product->productAttributes->groupBy('combination_id')->map(function ($attributes, $combinationId) {
                return [
                    'combination_id' => $combinationId,
                    'attributes' => $attributes->map(function ($attribute) {
                        return [
                            'id' => $attribute->id,
                            'attribute_id' => $attribute->attribute_id,
                            'attribute_name' => $attribute->attribute->name ?? null,
                            'option_id' => $attribute->attribute_option_id,
                            'option_name' => $attribute->attributeOption->name ?? null,
                            'quantity' => $attribute->quantity,
                            'sold_quantity' => $attribute->sold_quantity,
                        ];
                    })->filter(),
                ];
            })->filter();

            unset($product->productAttributes);
            return $product;
        });

        return $products;
    }
}
