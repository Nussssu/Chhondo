<?php

namespace App\Http\Controllers\Admin\Pos;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItemOption;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\SiteInfo;
use App\Models\User;
use App\Services\Admin\Manage_site\SiteServiceInterface;
use App\Services\Admin\Pos\POSServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;


class POSController extends Controller
{
    protected $posService;
    protected $siteService;

    public function __construct(POSServiceInterface $posService, SiteServiceInterface $siteService)
    {
        $this->posService = $posService;
        $this->siteService = $siteService;
    }

    public function index(Request $request)
    {
        try {
            $categories = Category::select('id', 'name')->get();

            $products = Product::with('product_attributes')
                // stock_status must be selected or the in_stock accessor falls
                // back to the quantity column and the till disagrees with admin.
                ->select('id', 'product_name', 'quantity', 'stock_status', 'price', 'featured_image', 'product_code')
                ->when($request->category, fn($q) => $q->inCategory($request->category))
                // Grouped: without the closure the orWhere escapes the category
                // filter and returns matches from every category.
                ->when($request->search, function ($q) use ($request) {
                    $term = '%' . $request->search . '%';
                    $q->where(function ($inner) use ($term) {
                        $inner->where('product_name', 'like', $term)
                            ->orWhere('product_code', 'like', $term);
                    });
                })
                ->orderBy('product_name', 'asc')
                // A till needs a screenful of products to tap, not four.
                ->paginate(28);

            if ($request->ajax()) {
                return response()->json(['products' => $products]);
            }

            $deliveryCharges = $this->siteService->getDeliveryCharge();
            $user = User::with('address')->where('email', 'walking@user.com')->where('role', 'user')->first();

            return Inertia::render('Admin/Pos/Index', [
                'products'        => $products,
                'deliveryCharges' => $deliveryCharges,
                'categories'      => $categories,
                'user'            => $user ? [
                    'id'      => $user->id,
                    'name'    => $user->name,
                    'phone'   => $user->phone,
                    'address' => $user->address->address ?? '',
                ] : null,
                'paymentTypes'    => config('payments.types'),
                'paymentMethods'  => collect(config('payments.methods'))
                    ->map(fn ($m, $key) => ['value' => $key] + $m)
                    ->values(),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function searchUser(Request $request)
    {
        $q = $request->q;

        $users = User::with('addresses')
            ->where('name', 'like', "%{$q}%")
            ->orWhereHas('addresses', function ($q2) use ($q) {
                $q2->where('phone', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%");
            })
            ->limit(20)
            ->get(['id', 'name', 'phone']); // only phone exists in users table

        $response = $users->map(function ($u) {
            // phone: user.phone has priority
            $phone = $u->phone ?? null;
            $addr  = $u->addresses->first(fn($a) => !empty($a->phone) || !empty($a->address));

            if (!$phone && $addr) $phone = $addr->phone;
            $address = $addr->address ?? '';

            return [
                'id'      => $u->id,
                'name'    => $u->name,
                'phone'   => $phone ?? '',
                'address' => $address ?? '',
            ];
        });

        return response()->json($response);
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'phone' => 'required|string',
            'address' => 'required|string',
            'cart' => 'required|array|min:1',
            'sub_total' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'delivery_charge' => 'nullable|numeric',
            'total' => 'required|numeric',
            'payment_type' => ['required', Rule::in(array_keys(config('payments.types')))],
            // Only an online payment names a provider.
            'payment_method' => [
                'nullable',
                'required_if:payment_type,online',
                Rule::in(array_keys(config('payments.methods'))),
            ],
            'payment_reference' => 'nullable|string|max:100',
            'delivery_area' => 'nullable|in:inside,outside',
        ]);

        DB::beginTransaction();
        try {
            // user_id is nullable, so a walk-in sale omits the key entirely.
            $userId = $data['user_id'] ?? null;
            $user = $userId ? User::findOrFail($userId) : null;

            // Create order
            $order = Order::create([
                'invoice_number' => $this->invoiceNumber(),
                'user_identifier' => $userId,
                'customer_name' => $user->name ?? 'Walking Customer',
                'email' => $user->email ?? null,
                'phone_number' => $data['phone'],
                'address' => $data['address'],
                'total_price' => $data['sub_total'],
                'discount' => $data['discount'] ?? 0,
                'delivery_charge' => $data['delivery_charge'] ?? 0,
                'shipping_price' => 0,
                'order_type' => 'pos',
                // Every POS sale is over the counter; without this the Orders
                // page counts it as neither online nor offline.
                'user_purchase_type' => 'offline',
                'payment_type' => $data['payment_type'],
                'payment_method' => $data['payment_type'] === 'online' ? ($data['payment_method'] ?? null) : null,
                'payment_reference' => $data['payment_reference'] ?? null,
                // The operator picks an area at the till; hardcoding N/A here
                // threw it away, so the order edit screen had nothing to show.
                'delivery' => $data['delivery_area'] ?? 'N/A',
            ]);

            // Save order items and decrement stock
            foreach ($data['cart'] as $cartItem) {
                $orderItem = $order->items()->create([
                    'product_id' => $cartItem['productId'],
                    'price' => $cartItem['price'],
                    'quantity' => $cartItem['quantity'],
                ]);

                if (!empty($cartItem['selected'])) {
                    foreach ($cartItem['selected'] as $selected) {
                        // Find the correct product attribute row (consider combination)
                        $query = ProductAttribute::where('product_id', $cartItem['productId'])
                            ->where('attribute_option_id', $selected['optionId']);

                        if (!empty($cartItem['combinationId'])) {
                            $query->where('combination_id', $cartItem['combinationId']);
                        }

                        $productAttribute = $query->first();

                        // Save order item option
                        OrderItemOption::create([
                            'order_item_id' => $orderItem->id,
                            'attribute_options_id' => $selected['optionId'],
                            'quantity' => $cartItem['quantity'],
                            'product_attibute_id' => $productAttribute?->id,
                        ]);

                        // Decrement stock for this attribute
                        if ($productAttribute) {
                            $this->adjustStockLevels(
                                $cartItem['productId'],
                                $productAttribute->attribute_option_id,
                                $cartItem['quantity'],
                                $productAttribute->combination_id
                            );
                        }
                    }
                } else {
                    // Product without attributes
                    $this->adjustStockLevels($cartItem['productId'], null, $cartItem['quantity']);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'message' => 'POS order created successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function adjustStockLevels($productId, $attributeOptionId = null, $quantity = 0, $combinationId = null)
    {
        $query = ProductAttribute::where('product_id', $productId);

        if ($attributeOptionId) {
            $query->where('attribute_option_id', $attributeOptionId);
        }

        if ($combinationId) {
            $query->where('combination_id', $combinationId);
        }

        $productAttributes = $query->get();

        if ($productAttributes->isEmpty() && $quantity > 0) {
            // For product without attributes
            $product = Product::findOrFail($productId);

            // A product marked In stock is not counted, so it has no quantity
            // to run short of and none to decrement.
            if ($product->tracks_stock) {
                if ($product->quantity < $quantity) {
                    throw new \Exception("Insufficient stock for product ID: {$productId}");
                }
                $product->decrement('quantity', $quantity);
            }

            $product->increment('sold_quantity', $quantity);
        }

        foreach ($productAttributes as $attr) {
            if ($quantity > 0) {
                if ($attr->quantity < $quantity) {
                    throw new \Exception("Insufficient stock for attribute option ID: {$attr->attribute_option_id}");
                }
                $attr->decrement('quantity', $quantity);
                $attr->increment('sold_quantity', $quantity);
            } elseif ($quantity < 0) {
                $adjustment = abs($quantity);
                $attr->increment('quantity', $adjustment);
                $attr->decrement('sold_quantity', $adjustment);
            }
        }

        // Roll the variant quantities up to the product. Only meaningful when
        // the product actually has variants — running it for a simple product
        // overwrote its stock with the sum of nothing, zeroing it on every sale.
        if ($productAttributes->isNotEmpty()) {
            $product = Product::findOrFail($productId);
            $product->quantity = ProductAttribute::where('product_id', $productId)->sum('quantity');
            $product->save();
        }
    }

    public function createUser(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:20|unique:users,phone',
            'address' => 'nullable|string|max:500',
        ]);

        // Create user
        $user = User::create([
            'name'  => $data['name'],
            'phone' => $data['phone'],
            'email' => $this->emailAddress($data['name']),
            'password' => Hash::make('123456'),
        ]);

        // Save address if provided
        if (!empty($data['address'])) {
            $user->addresses()->create([
                'phone'   => $data['phone'],
                'address' => $data['address'],
                'phone' => $data['phone'],
                'name' => $data['name'],
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'User created successfully',
            'user'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'phone'   => $user->phone,
                'address' => $data['address'] ?? '',
            ]
        ]);
    }

    private function invoiceNumber()
    {
        // Was a 4-character random string with unbounded recursion on collision.
        return Order::generateInvoiceNumber();
    }

    private function emailAddress($name)
    {
        // .invalid is reserved and can never be a real mailbox. This used
        // "@{name}.com", a real-looking domain order emails would then go to.
        $email = strtoupper(Str::random(4)) . '@' . (Str::slug($name) ?: 'customer') . '.pos.invalid';

        if (User::where('email', $email)->exists()) {
            return $this->invoiceNumber();
        }

        return $email;
    }

    public function apiinformations()
    {

        try {
            $data = SiteInfo::get();
            return ApiResponse::success(
                ['success' => true, 'data' => $data],
                'site data pass sucess'
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
