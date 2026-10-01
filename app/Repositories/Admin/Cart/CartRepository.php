<?php
namespace App\Repositories\Admin\Cart;

use App\Models\Cart;
use App\Models\CartAttribute;
use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Support\Facades\DB;

class CartRepository implements CartRepositoryInterface
{

    public function getCartItems($userId)
    {
        if (! $userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        $cartItems = Cart::where('user_identifier', $userId)
            ->with([
                'product.product_campaign.campaign',
                'cartAttributes.attributes',
                'cartAttributes.attributeOption',
                'cartAttributes.productAttribute',
            ])
            ->get();

        $cartData = $cartItems->map(function ($cartItem) {
            $attributesPrice = $cartItem->cartAttributes->sum(function ($cartAttribute) {
                return $cartAttribute->productAttribute->price ?? 0;
            });

            // Use the with-blouse price only when this cart line was added
            // "with" blouse AND the product still has the option enabled.
            // `blouse_price` is the rule, not the column: the sale half of the
            // pair is optional and the regular one stands in for it.
            $useBlousePrice = $cartItem->blouse_choice === 'with'
                && ! empty($cartItem->product->has_blouse_option)
                && $cartItem->product->blouse_price > 0;
            $basePrice           = $useBlousePrice
                ? $cartItem->product->blouse_price
                : (float) $cartItem->product->price;
            $manualDiscount      = (float) $cartItem->discount_value;
            $priceBeforeCampaign = $basePrice + $attributesPrice - $manualDiscount;

            // Apply campaign discount
            $campaign     = $cartItem->product->product_campaign->campaign ?? null;
            $campDiscount = 0;

            if ($campaign && (! isset($campaign->expiry_date) || now()->lte($campaign->expiry_date))) {
                $rawDiscount = $cartItem->product->product_campaign->discount ?? $campaign->discount;

                if ($rawDiscount) {
                    if (is_string($rawDiscount) && str_contains($rawDiscount, '%')) {
                        $percent      = (float) str_replace('%', '', $rawDiscount);
                        $campDiscount = ($priceBeforeCampaign * $percent) / 100;
                    } elseif (is_numeric($rawDiscount)) {
                        $campDiscount = (float) $rawDiscount;
                    }
                }
            }

            // A coupon attached to this product is shown as a price cut on the
            // storefront, so it must be charged without needing a code —
            // otherwise the customer is billed more than the page displayed.
            // The customer gets whichever single discount is larger.
            $couponDiscount = (float) $cartItem->product->discount_amount;

            $finalIndividualPrice = max(0, $priceBeforeCampaign - max($campDiscount, $couponDiscount));
            $finalPrice           = $finalIndividualPrice * $cartItem->quantity;

            $appliedDiscount = max($campDiscount, $couponDiscount);

            // The struck-through price. When a campaign or a product coupon is
            // reducing this line, strike the price it was reduced from —
            // otherwise fall back to previous_price when that is higher.
            $previousPrice = (float) ($cartItem->product->previous_price ?? 0);

            $regularIndividualPrice = match (true) {
                $appliedDiscount > 0    => round($priceBeforeCampaign, 2),
                $previousPrice > $basePrice => round($previousPrice + $attributesPrice, 2),
                default                 => null,
            };

            return [
                'id'                => $cartItem->id,
                'product_id'        => $cartItem->product_id,
                'quantity'          => $cartItem->quantity,
                'campaign_id'       => $cartItem->campaign_id,
                'discount_value'    => $manualDiscount,
                'campaign_discount' => $campDiscount,
                // What this line saves, so the cart and checkout can show it.
                'coupon_discount'   => round($couponDiscount, 2),
                'saving'            => round($appliedDiscount * $cartItem->quantity, 2),
                'blouse_choice'     => $cartItem->blouse_choice,
                'product'           => [
                    'id'               => $cartItem->product->id,
                    'product_name'     => $cartItem->product->product_name,
                    'price'            => $cartItem->product->price,
                    'previous_price'   => $cartItem->product->previous_price,
                    'featured_image'   => $cartItem->product->featured_image,
                    // Availability travels with the line. This array is hand
                    // built, so the model's appended flags do not come along on
                    // their own — and without them the cart could not tell a
                    // pre-order from a sold-out product, or either from a
                    // perfectly ordinary one.
                    'stock_status'     => $cartItem->product->stock_status,
                    'quantity'         => $cartItem->product->quantity,
                    'in_stock'         => $cartItem->product->in_stock,
                    'is_preorder'      => $cartItem->product->is_preorder,
                    'purchasable'      => $cartItem->product->purchasable,
                ],
                'regular_individual_price' => $regularIndividualPrice,
                'attributes'        => $cartItem->cartAttributes->map(function ($cartAttribute) {
                    return [
                        'price'               => $cartAttribute->productAttribute->price ?? null,
                        'attribute_name'      => $cartAttribute->attributes->name ?? null,
                        'attribute_option_id' => $cartAttribute->attributeOption->id ?? null,
                        'attribute_option'    => $cartAttribute->attributeOption->name ?? null,
                        'product_attr_id'     => $cartAttribute->product_attr_id ?? null,
                    ];
                }),
                'individual_price'  => round($finalIndividualPrice, 2),
                'final_price'       => round($finalPrice, 2),
            ];
        });

        return $cartData;
    }

    public function deleteCartItem($userId, $cartItemId)
    {

        return Cart::where('user_identifier', $userId)
            ->where('id', $cartItemId)
            ->delete();
    }

    public function clearCart($userId)
    {
        Cart::where('user_identifier', $userId)->delete();
    }

    public function updateCartItem(array $data)
    {
        try {

            $cartId          = $data['cart_id'];
            $quantity        = $data['quantity'] ?? 0;
            $attributeValues = $data['attribute_values'] ?? [];

            DB::transaction(function () use ($cartId, $quantity, $attributeValues) {
                $cart      = Cart::findOrFail($cartId);
                $productId = $cart->product_id;

                // Check if the product has attributes
                $hasAttributes = ProductAttribute::where('product_id', $productId)->exists();

                if ($hasAttributes) {
                    // Handle products with attributes
                    if (empty($attributeValues)) {

                        $attributeValues = CartAttribute::where('cart_id', $cartId)
                            ->pluck('attribute_options_id')
                            ->toArray();

                        if (empty($attributeValues)) {

                            throw new \Exception("Attribute values are required for updating cart items.");
                        }
                    }

                    $attributeHash = md5(json_encode($attributeValues));

                    $attributesStock = ProductAttribute::where('product_id', $productId)
                        ->whereIn('attribute_option_id', $attributeValues)
                        ->pluck('quantity', 'attribute_option_id');

                    if ($attributesStock->isEmpty()) {

                        throw new \Exception("No stock found for the provided attribute options.");
                    }

                    $currentCartQuantities = Cart::join('cart_attributes', 'carts.id', '=', 'cart_attributes.cart_id')
                        ->where('carts.product_id', $productId)
                        ->where('carts.id', $cartId)
                        ->groupBy('cart_attributes.attribute_options_id')
                        ->selectRaw('cart_attributes.attribute_options_id, SUM(carts.quantity) as total_quantity')
                        ->pluck('total_quantity', 'attribute_options_id');

                    foreach ($attributeValues as $attributeOptionId) {
                        $availableStock   = $attributesStock[$attributeOptionId] ?? 0;
                        $existingQuantity = $currentCartQuantities[$attributeOptionId] ?? 0;
                        $newTotalQuantity = $existingQuantity + $quantity;

                        // Log::info('Stock Check', [
                        //     'attribute_option_id' => $attributeOptionId,
                        //     'available_stock' => $availableStock,
                        //     'existing_quantity' => $existingQuantity,
                        //     'requested_quantity' => $newTotalQuantity,
                        // ]);

                        if ($newTotalQuantity > $availableStock) {
                            // Log::error("Stock check failed", [
                            //     'attribute_option_id' => $attributeOptionId,
                            //     'available_stock' => $availableStock,
                            //     'requested_quantity' => $newTotalQuantity,
                            // ]);
                            throw new \Exception("Not enough stock for attribute option {$attributeOptionId}. Available: {$availableStock}, Requested: {$newTotalQuantity}.");
                        }
                    }

                    $cart->increment('quantity', $quantity);
                    $cart->update(['attribute_hash' => $attributeHash]);
                } else {
                    // Handle products without attributes
                    $productStock = Product::where('id', $productId)->value('quantity');

                    // Validate total quantity
                    $existingCartQuantity = Cart::where('product_id', $productId)->sum('quantity');
                    $newTotalQuantity     = $existingCartQuantity + $quantity;

                    if ($newTotalQuantity > $productStock) {

                        throw new \Exception("Not enough stock for this product. Available: {$productStock}, Requested: {$quantity}.");
                    }

                    // Update cart
                    $cart->increment('quantity', $quantity);
                }
            });
        } catch (\Exception $e) {

            throw $e;
        }
    }

    public function addToCart(array $data)
    {
        DB::beginTransaction();

        try {
            $userId        = $data['user_id'];
            $productId     = $data['product_id'];
            $quantity      = $data['quantity'];
            $attributeIds  = $data['attribute_values'] ?? [];

            // Optional blouse choice. Fold into the hash so "with" and "without"
            // are distinct cart lines for the same product + attribute combo.
            $blouseChoice = $data['blouse_choice']
                ?? ($data['product']['blouse_choice'] ?? null);
            $blouseChoice = in_array($blouseChoice, ['with', 'without'], true) ? $blouseChoice : null;

            $hashSource    = (empty($attributeIds) ? 'default' : serialize($attributeIds))
                . '|blouse:' . ($blouseChoice ?? 'none');
            $attributeHash = md5($hashSource);

            // Update the stock check to account for the new logic with ProductAttribute 'id'
            $stockCheck = $this->checkStockAvailability($productId, $attributeIds, $quantity, $userId);

            if (! $stockCheck['success']) {
                throw new \Exception($stockCheck['message']);
            }

            // If combination exists, we use the attribute_hash to check for cart entries
            $cart = Cart::firstOrNew(
                [
                    'user_identifier' => $userId,
                    'product_id'      => $productId,
                    'attribute_hash'  => $attributeHash,
                ],
                [
                    'quantity' => 0,
                ]
            );

            $cart->quantity += $quantity;
            $cart->blouse_choice = $blouseChoice;
            $cart->save();

            // Add attributes to the cart if they exist
            if (! empty($attributeIds)) {
                $this->addAttributesToCart($cart, $attributeIds);
            }

            DB::commit();
            return $cart;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage());
        }
    }

    public function checkStockAvailability($productId, array $attributeIds, $requestedQuantity, $userId)
    {
        try {
            // Validate inputs
            if (! $this->validateStockInputs($productId, $attributeIds, $requestedQuantity)) {
                return $this->createStockResponse(false, 'Invalid input parameters');
            }

            // Only a "manage" product has a quantity to run short of. In stock
            // and pre-order are not counted — their quantity is usually 0 — so
            // checking it would turn every such product away from the cart.
            $product = Product::find($productId);

            if ($product && ! $product->tracks_stock) {
                return $product->purchasable
                    ? $this->createStockResponse(true, 'Stock available')
                    : $this->createStockResponse(false, 'This product is currently out of stock.');
            }

            // Get current cart quantity
            $currentCartQuantity    = $this->getCurrentCartQuantity($productId, $attributeIds, $userId);
            $totalRequestedQuantity = $requestedQuantity + $currentCartQuantity;

            // Fetch product attributes
            $productAttributes = $this->getProductAttributes($productId);

            // Log stock check initiation
            // Log::info('Stock check initiated', [
            //     'product_id' => $productId,
            //     'requested_attributes' => $attributeIds,
            //     'total_quantity_needed' => $totalRequestedQuantity
            // ]);

            // If the product has no attributes, directly check stock for the product
            if ($productAttributes->isEmpty()) {
                $productStock = $this->getProductStock($productId);

                if ($productStock >= $totalRequestedQuantity) {
                    return $this->createStockResponse(true, 'Stock available');
                } else {
                    return $this->createStockResponse(false, 'Insufficient stock for this product');
                }
            }

            // Group attributes by combination status
            $attributeGroups = $this->groupProductAttributes($productAttributes);

            // Check stock based on attribute grouping
            if ($attributeGroups['hasCombinations']) {
                return $this->checkCombinationStock(
                    $attributeGroups['combinations'],
                    $attributeIds,
                    $totalRequestedQuantity
                );
            } else {
                return $this->checkSingleAttributeStock(
                    $attributeGroups['singles'],
                    $attributeIds,
                    $totalRequestedQuantity
                );
            }
        } catch (\Exception $e) {
            // Log::error('Stock check failed', [
            //     'error' => $e->getMessage(),
            //     'product_id' => $productId
            // ]);
            return $this->createStockResponse(false, $e->getMessage());
        }
    }

    private function validateStockInputs($productId, $attributeIds, $quantity)
    {
        return is_numeric($productId)
        && $productId > 0
        && is_array($attributeIds)
        && is_numeric($quantity)
        && $quantity > 0;
    }

    private function getCurrentCartQuantity($productId, $attributeIds, $userId)
    {
        // Must match the hash addToCart() stores. The blouse choice splits one
        // combination into separate lines that draw on the same stock, so all
        // of them count.
        $base   = empty($attributeIds) ? 'default' : serialize($attributeIds);
        $hashes = array_map(fn ($choice) => md5($base . '|blouse:' . $choice), ['none', 'with', 'without']);

        return Cart::where('user_identifier', $userId)
            ->where('product_id', $productId)
            ->whereIn('attribute_hash', $hashes)
            ->sum('quantity');
    }

    private function getProductAttributes($productId)
    {
        return ProductAttribute::with(['product', 'attributeOption'])
            ->where('product_id', $productId)
            ->where('status', 'enable')
            ->get();
    }

    private function groupProductAttributes($attributes)
    {
        $combinations = $attributes->whereNotNull('combination_id')
            ->groupBy('combination_id');

        return [
            'hasCombinations' => $combinations->isNotEmpty(),
            'combinations'    => $combinations,
            'singles'         => $attributes->whereNull('combination_id'),
        ];
    }

    private function checkCombinationStock($combinations, $requestedAttributeIds, $totalQuantity)
    {
        foreach ($combinations as $combinationId => $attributes) {
            // Pluck the 'id' of the ProductAttribute model's attributes (not attribute_option_id)
            $combinationOptionIds = $attributes->pluck('id')->toArray();

            // Check if all requested attribute IDs are present in this combination's attribute 'id's
            if (empty(array_diff($requestedAttributeIds, $combinationOptionIds))) {
                // Check if all attributes have sufficient quantity
                $sufficientStock = $attributes->every(
                    fn($attr) => $attr->quantity >= $totalQuantity
                );

                if ($sufficientStock) {
                    return $this->createStockResponse(true, 'Stock available', [
                        'combination_id'     => $combinationId,
                        'available_quantity' => $attributes->min('quantity'),
                    ]);
                }
            }
        }

        return $this->createStockResponse(false, 'Insufficient stock for requested combination');
    }

    private function checkSingleAttributeStock($singleAttributes, $requestedAttributeIds, $totalQuantity)
    {
        if ($singleAttributes->isEmpty()) {
            return $this->createStockResponse(false, 'No single attributes found');
        }

        $matchingAttributes = $singleAttributes->whereIn('id', $requestedAttributeIds);

        if (count($requestedAttributeIds) !== $matchingAttributes->count()) {
            return $this->createStockResponse(false, 'Not all requested attributes are available');
        }

        $sufficientStock = $matchingAttributes->every(
            fn($attr) => $attr->quantity >= $totalQuantity
        );

        if ($sufficientStock) {
            return $this->createStockResponse(true, 'Stock available', [
                'available_quantity' => $matchingAttributes->min('quantity'),
            ]);
        }

        return $this->createStockResponse(false, 'Insufficient stock for requested attributes');
    }

    private function createStockResponse($success, $message, $data = [])
    {
        return array_merge([
            'success' => $success,
            'message' => $message,
        ], $data);
    }

    public function getProductStock($productId)
    {
        try {
            // Fetch the product from the database
            $product = Product::find($productId);

            if (! $product) {
                throw new \Exception('Product not found');
            }

                                       // Return the available stock
            return $product->quantity; // Assuming the `stock` column exists in the Product model
        } catch (\Exception $e) {
            // Log::error('Failed to fetch product stock', [
            //     'error' => $e->getMessage(),
            //     'product_id' => $productId
            // ]);
            throw new \Exception('Unable to retrieve product stock');
        }
    }

    // Helper function to get the shared attributes (e.g., size, XL) from the selected attribute IDs
    private function getSharedAttributes($attributeIds)
    {

        return $attributeIds;
    }

    // Helper function to get cart quantities for combinations of selected attributes (e.g., XL, Red)
    private function getCartQuantitiesForSharedAttributes($productId, $sharedAttributes, $userId)
    {
        // Get all combinations in the cart that include the shared attribute (e.g., size XL)
        return Cart::join('cart_attributes', 'carts.id', '=', 'cart_attributes.cart_id')
            ->where('carts.product_id', $productId)
            ->where('carts.user_identifier', $userId)
            ->whereIn('cart_attributes.attribute_options_id', $sharedAttributes)
            ->groupBy('cart_attributes.attribute_options_id')
            ->selectRaw('SUM(carts.quantity) as total_quantity, cart_attributes.attribute_options_id')
            ->pluck('total_quantity', 'cart_attributes.attribute_options_id');
    }

    // Helper function to get the cart quantity for a specific product and attribute combination
    private function getCartQuantityForSingleAttribute($productId, $attributeId, $userId)
    {
        return Cart::join('cart_attributes', 'carts.id', '=', 'cart_attributes.cart_id')
            ->where('carts.product_id', $productId)
            ->where('carts.user_identifier', $userId)
            ->where('cart_attributes.attribute_options_id', $attributeId)
            ->sum('carts.quantity');
    }

    private function addAttributesToCart($cart, array $attributeIds)
    {
        // Filter and ensure valid attribute IDs
        $validAttributeIds = array_filter($attributeIds, function ($id) {
            return ! is_null($id) && $id !== '';
        });

        if (empty($validAttributeIds)) {
            throw new \Exception('No valid attributes provided.');
        }

        // Prepare attributes data for bulk insertion
        $attributesData = collect($validAttributeIds)->map(function ($productAttributeId) use ($cart) {
            // Find the corresponding ProductAttribute using the provided product_attribute_id
            $productAttribute = ProductAttribute::find($productAttributeId);

            if (! $productAttribute) {
                throw new \Exception("Product attribute with ID {$productAttributeId} not found.");
            }

            // Get the related attribute_option_id from ProductAttribute (assuming the relationship is set correctly)
            $attributeOptionId = $productAttribute->attribute_option_id;
            $product_attr_id   = $productAttribute->id;

            if (! $attributeOptionId) {
                throw new \Exception("No attribute option associated with Product Attribute ID {$productAttributeId}");
            }

            return [
                'cart_id'              => $cart->id,
                'attribute_options_id' => $attributeOptionId, // Store the attribute_option_id
                'product_attr_id'      => $product_attr_id,   // Store the attribute_option_id
            ];
        })->toArray();

        // Insert or update attributes in CartAttribute table
        CartAttribute::upsert($attributesData, ['cart_id', 'attribute_options_id', 'product_attr_id']);
    }

    // private function addAttributesToCart($cart, array $attributeIds)
    // {
    //     // Filter and ensure valid attribute IDs
    //     $validAttributeIds = array_filter($attributeIds, function ($id) {
    //         return !is_null($id) && $id !== '';
    //     });

    //     if (empty($validAttributeIds)) {

    //         throw new \Exception('No valid attributes provided.');

    //     }

    //     // Prepare attributes data for bulk insertion
    //     $attributesData = collect($validAttributeIds)->map(function ($attributeId) use ($cart) {
    //         return [
    //             'cart_id' => $cart->id,
    //             'attribute_options_id' => $attributeId,
    //         ];
    //     })->toArray();

    //     // Insert or update attributes
    //     CartAttribute::upsert($attributesData, ['cart_id', 'attribute_options_id']);

    // }

}
