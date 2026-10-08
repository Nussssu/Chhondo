<?php
namespace App\Services\Admin\Order;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Admin\Order\OrderRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService implements OrderServiceInterface
{
    protected $orderRepository;

    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function checkout(array $data)
    {

        DB::beginTransaction();
        try {
            // STEP 1: Validate Items
            // Staff take orders over the phone for stock that has already gone,
            // so the availability guard is for the storefront only. Nothing a
            // customer can send sets this.
            $items = $this->validateItems($data['items'], enforceAvailability: empty($data['staff_order']));

            // STEP 2: Handle User Name
            $data["user_name"] = $data["user_name"] ?? '';

            // STEP 3: Fetch/Create User
            $user = $this->getUser($data['user_id'], $data["user_name"]);

            if (! ($user instanceof \App\Models\User)) {
                throw new \Exception('Invalid user object returned');
            }

            // STEP 4: Price Calculations
            $totalPrice     = $this->calculateTotalPrice($items);
            $deliveryCharge = $this->getDeliveryCharge($data);
            $paidAmount     = $data['paid_amount'] ?? 0;
            // $orderType      = $data['order_type'] ?? 'pos';
            $discount    = $data['discount'] ?? 0;
            $posDiscount = $data['discounts'] ?? 0;
            $data['user_purchase_type']=$deliveryCharge==0?'offline':'online';

            $totalOrderAmount = $totalPrice + $deliveryCharge - $discount - $posDiscount;
            $remainingBalance = $totalOrderAmount - $paidAmount;

            // STEP 5: Prepare and Create Order
            $invoiceNumber = $this->generateInvoiceNumber();
            $orderData     = $this->prepareOrderData(
                $data,
                $user,
                $totalPrice,
                $deliveryCharge,
                $invoiceNumber,
                $remainingBalance,
                $paidAmount,
                $posDiscount
            );

            $order = $this->orderRepository->createOrder($orderData);

            // STEP 6: Process Order Items
            foreach ($items as $item) {
                $this->processOrderItem($order, $item, $data);
            }

            // STEP 7: Handle Coupons
            if (! empty($data['coupon_id']) && ! empty($data['code'])) {
                $coupon = Coupon::where('id', $data['coupon_id'])
                    ->where('code', $data['code'])
                    ->first();
                // A blank usage_limit means unlimited, which whereColumn
                // never matched, so such a coupon's uses went uncounted.
                if ($coupon && (is_null($coupon->usage_limit) || $coupon->used_count < $coupon->usage_limit)) {
                    $coupon->increment('used_count');
                }
            }

            DB::commit();

            // STEP 8: Clear Cart — unless the order never came from it.
            if (empty($data['keep_cart'])) {
                Cart::where('user_identifier', $data['user_id'])->delete();
            }

            return $order;

        } catch (\Throwable $e) {
            DB::rollBack();

            // Log full error with stack trace for debugging

            throw new \Exception("Checkout failed: " . $e->getMessage());
        }
    }

    private function validateItems($items, bool $enforceAvailability = true)
    {
        $items = is_string($items) ? json_decode($items, true) : $items;

        if (! is_array($items) || empty($items)) {
            throw new \Exception('Invalid items data. Expected a non-empty array.');
        }

        foreach ($items as &$item) {
            if (
                ! isset($item['total'], $item['product_id'], $item['quantity'], $item['individual_price']) ||
                ! is_numeric($item['total']) ||
                ! is_numeric($item['quantity']) ||
                $item['quantity'] <= 0
            ) {
                throw new \Exception('Each item must have valid total, product_id, and quantity.');
            }

            $item['total']            = (float) $item['total'];
            $item['individual_price'] = (float) $item['individual_price'];
            $item['quantity']         = (int) $item['quantity'];
        }

        unset($item);

        if ($enforceAvailability) {
            $this->assertPurchasable($items);
        }

        return $items;
    }

    /**
     * Refuse an order for anything that is not for sale.
     *
     * Pre-orders pass: that status exists precisely so orders can be taken for
     * stock that has not arrived. Out of stock does not — the button is hidden
     * on the storefront, but the cart survives a product selling out after it
     * was added, so the last word has to be here.
     */
    private function assertPurchasable(array $items): void
    {
        $products = Product::whereIn('id', collect($items)->pluck('product_id')->filter()->unique())
            ->get()
            ->keyBy('id');

        foreach ($items as $item) {
            $product = $products->get($item['product_id']);

            if (! $product) {
                throw new \Exception('One of the products in your cart is no longer available.');
            }

            if (! $product->purchasable) {
                throw new \Exception("\"{$product->product_name}\" is out of stock. Please remove it to continue.");
            }
        }
    }

    private function getUser($userId, $userName)
    {
        // Handle case where $userId is a User model directly
        if ($userId instanceof \App\Models\User) {
            return $userId;
        }

        // Handle case where $userId is actually an array (from request merging)
        if (is_array($userId)) {
            if (isset($userId['id'])) {
                $userId = $userId['id']; // Extract the actual ID
            } else {
                $userId = null;
            }
        }

        // Try finding the user by ID
        $user = $userId ? User::find($userId) : null;

        if (! $user) {
            $email = ($userId ?: uniqid('guest_')) . '@guest.com';

            $user = User::where('email', $email)->first();

            if (! $user) {
                // Create new guest user
                $user = User::create([
                    'name'     => $userName ?: 'Guest User',
                    'email'    => $email,
                    'password' => bcrypt(Str::random(10)),
                ]);
            }
        }

        return $user;
    }

    private function calculateTotalPrice($items)
    {
        return array_reduce($items, function ($total, $item) {
            return $total + $item['total'];
        }, 0);
    }

    private function getDeliveryCharge($data)
    {
        return isset($data['delivery_charge']) && is_numeric($data['delivery_charge'])
        ? $data['delivery_charge']
        : 0;
    }

    private function prepareOrderData($data, $user, $totalPrice, $deliveryCharge, $invoiceNumber, $remainingBalance, $paidAmount, $posDiscount)
    {
        $invoiceNumber = $this->generateInvoiceNumber();

        $phoneNumber = $data['phone_number'];
        $address     = $data['address'];

        return [
            'user_identifier'   => $user->id,
            'customer_name'     => empty($data['user_name']) ? $user->name : $data['user_name'],
            'address'           => $address,
            'phone_number'      => $phoneNumber,
            // What the customer typed at checkout, when they typed one.
            'email'             => ! empty($data['email']) ? $data['email'] : $user->email,
            'order_status'      => $data['order_status'] ?? 'pending',
            // The goods before any discount, which is how the admin order edit,
            // the order table, the CSV export, the payment gateways and the
            // courier amount all read it; the discount is kept in its own
            // column. Subtracting it here too made every one of those take a
            // coupon off twice — including the amount charged through bKash.
            'total_price'       => $totalPrice,
            'shipping_price'    => $data['shipping_price'] ?? 0,
            // Both were hardcoded. `delivery` threw away the area the customer chose
            // at checkout, leaving courier booking and shipping reports unable to tell
            // inside-Dhaka from outside-Dhaka; `order_type` recorded every storefront
            // order as an in-store POS sale. Callers that pass neither keep the old
            // values, so the admin order-create paths are unaffected.
            'delivery'          => $data['delivery_area'] ?? $data['delivery'] ?? 'N/A',
            'delivery_charge'   => $deliveryCharge,
            'order_type'        => $data['order_type'] ?? 'pos',
            'note'              => $data['note'] ?? null,
            'invoice_number'    => $invoiceNumber,
            'remaining_balance' => $remainingBalance ?? null,
            'paid_amount'       => $paidAmount ?? 0,
            'discount'          => isset($data['discount']) && $data['discount'] > 0 ? $data['discount'] : $posDiscount,
            'user_purchase_type'=>$data['user_purchase_type'],
            // Cash on delivery unless the caller says otherwise; nothing is
            // paid until a gateway confirms it.
            'payment_type'      => $data['payment_type'] ?? 'cod',
            'payment_status'    => $data['payment_status'] ?? 'unpaid',
        ];
    }

    public function processOrderItem($order, $item, $data)
    {
        // Log::info('Processing order item', ['product_id' => $item['product_id'], 'order_id' => $order->id]);

        try {
            // Get attribute options
            $attrs = $item['attributes'] ?? [];
            if ($attrs instanceof \Illuminate\Support\Collection) {
                $attrs = $attrs->toArray();
            }
            $attributeOptionIds = ! empty($attrs)
            ? array_column($attrs, 'attribute_option_id')
            : [];

            // Create order item
            $blouseChoice = $item['blouse_choice'] ?? null;
            $blouseChoice = in_array($blouseChoice, ['with', 'without'], true) ? $blouseChoice : null;

            $orderItem = $this->orderRepository->createOrderItem($order->id, [
                'product_id'    => $item['product_id'],
                'quantity'      => $item['quantity'],
                'price'         => $item['individual_price'],
                'discount'      => $item['coupon_discount'] ?? 0,
                'discount_type' => 'fixed',
                'blouse_choice' => $blouseChoice,
            ]);

            // Process attributes if exists
            if (! empty($attributeOptionIds)) {
                $this->processAttributes(
                    $orderItem,
                    $attributeOptionIds,
                    $item['quantity'],
                    $item['quantity'] * count($attributeOptionIds),
                    $order->order_status !== 'incomplete'
                );
            } else {
                // Handle simple product
                if ($order->order_status !== 'incomplete') {
                    // Only counted products move their quantity; sold_quantity
                    // is a sales figure and applies either way.
                    Product::where('id', $item['product_id'])
                        ->tracksStock()
                        ->decrement('quantity', $item['quantity']);
                    Product::where('id', $item['product_id'])
                        ->increment('sold_quantity', $item['quantity']);
                }
            }

            return $orderItem;

        } catch (\Exception $e) {
            // Log::error('Order item processing failed', [
            //     'error'      => $e->getMessage(),
            //     'product_id' => $item['product_id'] ?? null,
            //     'order_id'   => $order->id ?? null,
            // ]);
            throw $e;
        }
    }

    private function processAttributes($orderItem, $attributeOptionIds, $quantity, $totalRequestQuantity, $change)
    {
        // Log::info('Processing attributes', [
        //     'order_item_id'   => $orderItem->id,
        //     'attribute_count' => count($attributeOptionIds),
        // ]);

        try {
            $product    = Product::findOrFail($orderItem->product_id);
            $attributes = $product->productAttributes->whereIn('attribute_option_id', $attributeOptionIds);

            // Track processed options to prevent duplicates
            $processedOptions = [];

            foreach ($attributes as $attribute) {
                // Skip if we already processed this option
                if (in_array($attribute->attribute_option_id, $processedOptions)) {
                    // Log::debug('Skipping duplicate attribute option', [
                    //     'option_id' => $attribute->attribute_option_id,
                    // ]);
                    continue;
                }
                // Log::info('Got attribute :', $attribute->toArray());
                // Validate stock
                if ($attribute->quantity < $quantity) {
                    throw new \Exception("Insufficient stock for option: {$attribute->attribute_option_id}");
                }

                // Create order item option
                $this->orderRepository->createOrderItemOption($orderItem->id, [
                    'product_attibute_id'  => $attribute->id,
                    'attribute_options_id' => $attribute->attribute_option_id,
                    'quantity'             => $quantity,
                ]);

                // Update stock if needed
                if ($change) {
                    // Execute changes
                    $attribute->decrement('quantity', $quantity);
                    $attribute->increment('sold_quantity', $quantity);

                }

                // Mark this option as processed
                $processedOptions[] = $attribute->attribute_option_id;
            }

            // Update product stock
            if ($change) {
                if ($product->tracks_stock) {
                    $product->decrement('quantity', $totalRequestQuantity);
                }
                $product->increment('sold_quantity', $totalRequestQuantity);
            }

        } catch (\Exception $e) {
            // Log::error('Attribute processing failed', [
            //     'error'         => $e->getMessage(),
            //     'order_item_id' => $orderItem->id,
            // ]);
            throw $e;
        }
    }
    private function generateInvoiceNumber()
    {
        return Order::generateInvoiceNumber();
    }

    public function getInvoice($id)
    {
        return $this->orderRepository->getInvoice($id);
    }

    public function updateOrder(array $data, $orderId)
    {
        return "hjh";
    }

    public function getAllOrder()
    {
        $orders = $this->orderRepository->getAllOrdersWithDetails();

        return $orders;
    }
    public function getIncompeleteOrder()
    {
        $orders = $this->orderRepository->getincompeleteOrdersWithDetails();

        return $orders;
    }

    public function getAllOrders()
    {
        return $this->orderRepository->getAll();
    }

    public function getOrderCounts()
    {
        return [
            'total'       => $this->orderRepository->countAll(),
            'pending'     => $this->orderRepository->countByStatus('pending'),
            'processed'   => $this->orderRepository->countByStatus('processed'),
            'shipped'     => $this->orderRepository->countByStatus('shipped'),
            'delivered'   => $this->orderRepository->countByStatus('delivered'),
            'cancelled'   => $this->orderRepository->countByStatus('cancelled'),
            'returned'    => $this->orderRepository->countByStatus('returned'),
            'on_delivery' => $this->orderRepository->countByStatus('on delivery'),
        ];
    }

    public function updateOrderComment($orderId, $commentId)
    {
        return $this->orderRepository->updateComment($orderId, $commentId);
    }
    public function updateOrdernote($orderId, $orderNote)
    {
        return $this->orderRepository->updateOrderNote($orderId, $orderNote);
    }

    public function getFilteredOrders(array $filters): Collection
    {
        return $this->orderRepository->filterOrders($filters);
    }

    public function getOrderStatistics(): array
    {
        return $this->orderRepository->getOrderCounts();
    }

}
