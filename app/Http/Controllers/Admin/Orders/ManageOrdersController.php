<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ApiToken;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Coupon;
use App\Models\CouponProduct;
use App\Models\CourierSetting;
use App\Models\Incomplete;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemOption;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\SiteInfo;
use App\Models\User;
use App\Services\Admin\Comment\CommentService;
use App\Services\Admin\CouriarApiSetting\CouriarApiSettingServiceInterface;
use App\Services\Admin\Order\OrderService;
use App\Services\Admin\Order\OrderServiceInterface;
use App\Services\Admin\Pos\POSServiceInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; // Laravel-mPDF facade
use Inertia\Inertia;

//use Symfony\Component\HttpFoundation\StreamedResponse;

use Illuminate\Support\Facades\Validator;

class ManageOrdersController extends Controller
{

    protected $orderService, $commentService, $posService, $orderservices, $courierApiSettingService;

    public function __construct(OrderServiceInterface $orderService, CommentService $commentService, POSServiceInterface $posService, OrderService $orderservices, CouriarApiSettingServiceInterface $courierApiSettingService)
    {
        $this->orderService             = $orderService;
        $this->commentService           = $commentService;
        $this->posService               = $posService;
        $this->orderservices            = $orderservices;
        $this->courierApiSettingService = $courierApiSettingService;
    }
    public function index(Request $request)
    {
        $pagination = $request->pagination ?? 10;
        $comments = Comment::all();
        $courierSettings = CourierSetting::first();

        // Storefront orders only. Counter sales live on the POS orders page and
        // are excluded here so neither list's figures include the other's.
        $ordersQuery = Order::storefront()->with($this->orderTableRelations());
        if ($request->input('status') !== 'incomplete') {
            $ordersQuery->where('order_status', '!=', 'incomplete');
        }

        // Clone for counting before filters
        $orderCountsQuery = clone $ordersQuery;

        $orderCounts = [
            'total'      => $orderCountsQuery->count(),
            'pending'    => (clone $orderCountsQuery)->where('order_status', 'pending')->count(),
            'processed'  => (clone $orderCountsQuery)->where('order_status', 'processed')->count(),
            'shipped'    => (clone $orderCountsQuery)->where('order_status', 'shipped')->count(),
            'delivered'  => (clone $orderCountsQuery)->where('order_status', 'delivered')->count(),
            'cancelled'  => (clone $orderCountsQuery)->where('order_status', 'cancelled')->count(),
            'returned'   => (clone $orderCountsQuery)->where('order_status', 'returned')->count(),
            'on_delivery' => (clone $orderCountsQuery)->where('order_status', 'on delivery')->count(),
            'incomplete' => Order::storefront()->where('order_status', 'incomplete')->count(),
            'new'        => (clone $orderCountsQuery)->whereNull('viewed_at')->count(),
        ];

        $this->applyOrderFilters($ordersQuery, $request);

        // Sales summary (money) cards — computed on the fully-filtered query so
        // the totals always match the visible/filtered order set. Each aggregate
        // uses its own clone so a chained where() can't leak into the next, and
        // they run before paginate() mutates the builder.
        $salesSummary = [
            'total_sale_with_delivery'    => number_format((clone $ordersQuery)->sum('total_price') + (clone $ordersQuery)->sum('delivery_charge'), 2),
            'total_sale_without_delivery' => number_format((clone $ordersQuery)->sum('total_price'), 2),
            'total_orders'                => (clone $ordersQuery)->count(),
            'online_orders'               => (clone $ordersQuery)->where('user_purchase_type', 'online')->count(),
            'offline_orders'              => (clone $ordersQuery)->where('user_purchase_type', 'offline')->count(),
        ];

        $orders = $ordersQuery->orderBy('created_at', 'desc')->paginate($pagination);

        return Inertia::render('Admin/Orders/Index', [
            'orders'           => $orders,
            'salesSummary'     => $salesSummary,
            'comments'         => $comments,
            'courier_settings' => $courierSettings,
            'total_order'      => $orderCounts['total'],
            'pending_order'    => $orderCounts['pending'],
            'processed_order'  => $orderCounts['processed'],
            'shipped_order'    => $orderCounts['shipped'],
            'delivered_order'  => $orderCounts['delivered'],
            'cancelled_order'  => $orderCounts['cancelled'],
            'returned_order'   => $orderCounts['returned'],
            'on_delivery'      => $orderCounts['on_delivery'],
            'incomplete_order' => $orderCounts['incomplete'],
            'new_order'        => $orderCounts['new'],
        ]);
    }



    /**
     * Counter sales only. POS orders are mixed into the main list by default;
     * this is the till's own ledger, with the payment breakdown a shop needs to
     * reconcile a day's takings.
     */
    public function posOrders(Request $request)
    {
        $pagination = $request->pagination ?? 20;

        $ordersQuery = Order::pos()->with($this->orderTableRelations());

        // Same status tallies the storefront list shows, counted over counter
        // sales only so the two pages never share a figure.
        $countsQuery = clone $ordersQuery;
        $orderCounts = [
            'total'       => (clone $countsQuery)->count(),
            'today'       => (clone $countsQuery)->whereDate('created_at', now())->count(),
            'pending'     => (clone $countsQuery)->where('order_status', 'pending')->count(),
            'processed'   => (clone $countsQuery)->where('order_status', 'processed')->count(),
            'shipped'     => (clone $countsQuery)->where('order_status', 'shipped')->count(),
            'delivered'   => (clone $countsQuery)->where('order_status', 'delivered')->count(),
            'cancelled'   => (clone $countsQuery)->where('order_status', 'cancelled')->count(),
            'returned'    => (clone $countsQuery)->where('order_status', 'returned')->count(),
            'on_delivery' => (clone $countsQuery)->where('order_status', 'on delivery')->count(),
            'incomplete'  => (clone $countsQuery)->where('order_status', 'incomplete')->count(),
        ];

        $this->applyOrderFilters($ordersQuery, $request);

        // Each aggregate gets its own clone so a chained where() cannot leak
        // into the next, and they run before paginate() mutates the builder.
        // Drives the payment filter's options — only the kinds actually present.
        $paymentTypes = Order::pos()
            ->whereNotNull('payment_type')
            ->distinct()
            ->pluck('payment_type')
            ->map(fn ($key) => [
                'key'   => $key,
                'label' => config("payments.types.{$key}") ?? $key,
            ])
            ->values();

        $salesSummary = [
            'total_sale_with_delivery'    => number_format((clone $ordersQuery)->sum('total_price') + (clone $ordersQuery)->sum('delivery_charge'), 2),
            'total_sale_without_delivery' => number_format((clone $ordersQuery)->sum('total_price'), 2),
            'total_orders'                => (clone $ordersQuery)->count(),
        ];

        return Inertia::render('Admin/Orders/PosOrders', [
            'orders'           => $ordersQuery->orderBy('created_at', 'desc')->paginate($pagination),
            'comments'         => Comment::all(),
            'courier_settings' => CourierSetting::first(),
            'salesSummary'     => $salesSummary,
            'paymentTypes'     => $paymentTypes,
            'todayPosOrders'   => $orderCounts['today'],
            // Named as the storefront list names them, so the shared table and
            // its partial reloads work identically on both pages.
            'total_order'      => $orderCounts['total'],
            'pending_order'    => $orderCounts['pending'],
            'processed_order'  => $orderCounts['processed'],
            'shipped_order'    => $orderCounts['shipped'],
            'delivered_order'  => $orderCounts['delivered'],
            'cancelled_order'  => $orderCounts['cancelled'],
            'returned_order'   => $orderCounts['returned'],
            'on_delivery'      => $orderCounts['on_delivery'],
            'incomplete_order' => $orderCounts['incomplete'],
        ]);
    }

    /**
     * Status, date and text filters shared by the all-orders list and the POS
     * orders list, so the two can never drift apart in what they support.
     */
    private function applyOrderFilters($query, Request $request): void
    {
        $query->when($request->filled('status'), function ($q) use ($request) {
                if ($request->status === 'new') {
                    $q->whereNull('viewed_at');
                } else {
                    $q->where('order_status', $request->status);
                }
            })
            ->when($request->filled('product_code'), function ($q) use ($request) {
                $q->whereHas('items.product', fn($q2) => $q2->where('product_code', 'like', "%{$request->product_code}%"));
            })
            ->when($request->filled('invoice'), fn($q) => $q->where('invoice_number', 'like', "%{$request->invoice}%"))
            ->when($request->filled('phone'), fn($q) => $q->where('phone_number', 'like', "%{$request->phone}%"))
            ->when($request->filled('customer_name'), fn($q) => $q->where('customer_name', 'like', "%{$request->customer_name}%"))
            ->when($request->filled('courier_name'), fn($q) => $q->where('couriar_name', 'like', "%{$request->courier_name}%"))
            ->when($request->filled('day'), function ($q) use ($request) {
                $today = now();
                switch ($request->day) {
                    case 1: // Today
                        $q->whereDate('created_at', $today);
                        break;
                    case 2: // Yesterday
                        $q->whereDate('created_at', $today->subDay());
                        break;
                    case 3: // Last 7 days
                        $q->whereBetween('created_at', [$today->subDays(7), now()]);
                        break;
                    case 4: // Last 30 days
                        $q->whereBetween('created_at', [$today->subDays(30), now()]);
                        break;
                    case 5: // This month
                        $q->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
                        break;
                    case 6: // Last month
                        $q->whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year);
                        break;
                }
            })
            ->when($request->filled('payment_type'), fn($q) => $q->where('payment_type', $request->payment_type))
            ->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to));
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('invoice_number', 'like', "%{$search}%");
            });
        }
    }

    public function exportCsv(Request $request)
    {
        // Export what the calling list shows: the POS page passes scope=pos.
        $ordersQuery = $request->input('scope') === 'pos'
            ? Order::pos()->with($this->orderTableRelations())
            : Order::storefront()->with($this->orderTableRelations());

        if ($request->filled('ids')) {
            $ids = array_filter(explode(',', $request->input('ids')));
            $ordersQuery->whereIn('id', $ids);
        } else {
            $statuses = array_filter((array) $request->input('statuses', []));
            if ($statuses) {
                $ordersQuery->whereIn('order_status', $statuses);
            }

            $ordersQuery->when($request->filled('date_from'), fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
                ->when($request->filled('date_to'), fn($q) => $q->whereDate('created_at', '<=', $request->date_to));
        }

        $orders = $ordersQuery->orderBy('created_at', 'desc')->get();

        // Payment columns go last so existing spreadsheets keep their layout.
        $columns = ['Invoice', 'Date', 'Customer Name', 'Phone', 'Address', 'Products', 'Total Price', 'Order Status', 'Courier', 'Consignment ID', 'Note', 'Comment', 'Payment', 'Paid Amount', 'Payment Reference'];

        return response()->streamDownload(function () use ($orders, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $columns);

            foreach ($orders as $order) {
                $products = $order->items->map(function ($item) {
                    return ($item->product_info->product_name ?? 'N/A') . ' x' . $item->quantity;
                })->implode('; ');

                $total = $order->total_price + $order->delivery_charge - $order->discount;

                fputcsv($handle, [
                    $order->invoice_number,
                    optional($order->created_at)->format('Y-m-d H:i'),
                    $order->customer_name,
                    $order->phone_number,
                    $order->address,
                    $products,
                    number_format($total, 2),
                    $order->order_status,
                    $order->couriar_name,
                    $order->consignment_id,
                    $order->note,
                    $order->comment->name ?? '',
                    $order->payment_summary,
                    number_format((float) $order->paid_amount, 2),
                    $order->payment_type === 'online' ? $order->payment_reference : '',
                ]);
            }

            fclose($handle);
        }, 'orders-' . now()->format('Y-m-d-His') . '.csv', ['Content-Type' => 'text/csv']);
    }

    public function markViewed(Request $request)
    {
        $request->validate(['order_id' => 'required|exists:orders,id']);

        Order::where('id', $request->order_id)
            ->whereNull('viewed_at')
            ->update(['viewed_at' => now()]);

        return response()->json(['success' => true]);
    }


    public function bulkAssign(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*' => 'exists:orders,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Get auth user permissions manually
        $user = auth()->user()->load('roles.permissions', 'permissions');

        $directPermissions = $user->permissions->pluck('name');

        $rolePermissions = $user->roles->flatMap(function ($role) {
            return $role->permissions;
        })->pluck('name');

        $permissions = $directPermissions->merge($rolePermissions)->unique();

        // Check if user has FullAssign permission
        $hasFullAssign = $permissions->contains('FullAssign');

        // Start query for orders
        $query = Order::whereIn('id', $request->orders);

        // Restrict if user does NOT have FullAssign
        if (! $hasFullAssign) {
            $query->where(function ($q) {
                $q->where('author_id', auth()->id())
                    ->orWhereNull('author_id');
            });
        }

        $updatedCount = $query->update(['author_id' => $request->user_id]);

        if ($updatedCount === 0) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to assign these orders or no matching orders found.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'updated_count' => $updatedCount,
        ]);
    }



    /**
     * Eager-load relations needed to render the shared OrdersTable Vue component.
     */
    protected function orderTableRelations(): array
    {
        return [
            'user:id', 'user.orders:id,user_identifier,created_at',
            'author', 'comment', 'customer_info',
            'items.product_info', 'items.option.attributeOption.attribute',
        ];
    }

    public function incompelete(Request $request)
    {
        $orders = Order::storefront()->with($this->orderTableRelations())
            ->where('order_status', 'incomplete')->latest()->paginate(10);
        $comments = $this->commentService->all();

        return Inertia::render('Admin/Orders/Incomplete', [
            'orders'   => $orders,
            'comments' => $comments,
        ]);
    }

    public function duplicate(Request $request)
    {
        // Define the specific phone number to check for duplicates
        $targetPhoneNumber = '01745010963';

        $query = Order::with($this->orderTableRelations())
            ->where('phone_number', $targetPhoneNumber)->latest();

        // Only show results when there's more than one order for this number
        $orders = (clone $query)->count() > 1
            ? $query->paginate(10)
            : new \Illuminate\Pagination\LengthAwarePaginator(collect(), 0, 10, 1, ['path' => $request->url()]);

        $comments = $this->commentService->all();

        return Inertia::render('Admin/Orders/Duplicate', [
            'orders'   => $orders,
            'comments' => $comments,
        ]);
    }

    public function yourorder(Request $request)
    {
        // Always the authenticated user. This endpoint used to fall back to a
        // user_id taken from the URL, which let anyone read any customer's order
        // history (name, phone, address, email) without logging in.
        $user_id = Auth::id();

        abort_if($user_id === null, 401, 'Unauthenticated.');

        // A caller may still pass {user_id}; it is only accepted when it matches.
        $requestedUserId = $request->route('user_id') ?? $request->input('user_id');

        abort_if(
            $requestedUserId !== null && (int) $requestedUserId !== (int) $user_id,
            403,
            'You may only view your own orders.'
        );

        // Fetch all orders
        $orders = $this->orderService->getAllOrder();

        // Filter orders by the given user ID
        $filteredOrders = $this->filterOrdersByUserId($orders, $user_id);

        // Check if there are no orders for the user
        if (empty($filteredOrders)) {
            return ApiResponse::success([], 'No orders found for this user.');
        }

        // Fetch comments (if needed)
        $comments = $this->commentService->all();

        // Return the filtered orders with a success message
        return ApiResponse::success($filteredOrders, 'Get Order successfully');
    }

    public function filterOrdersByUserId($orders, $userId)
    {
        // Convert the Eloquent Collection to an array if it's not already an array
        $ordersArray = $orders instanceof \Illuminate\Support\Collection  ? $orders->toArray() : $orders;

        // customer_info is absent on orders whose user record has been removed, so
        // it must be checked before dereferencing.
        return array_values(array_filter($ordersArray, function ($order) use ($userId) {
            return isset($order['customer_info']['id'])
                && (int) $order['customer_info']['id'] === (int) $userId;
        }));
    }

    public function orderComment(Request $request)
    {
        $request->validate([
            'order_id'   => 'required|exists:orders,id',
            'comment_id' => 'required|integer',
        ]);

        // Assuming the service method updates the order comment
        $order = $this->orderService->updateOrderComment($request->order_id, $request->comment_id);

        // Return a JSON response for AJAX success
        return response()->json([
            'success' => true,
            'message' => 'Comment has been updated successfully.',
        ]);
    }
    public function ordercommentadd(Request $request)
    {
        $comment = Comment::create($request->all());
        // Assuming the service method updates the order comment
        $order = $this->orderService->updateOrderComment($request->order_id, $comment->id);

        // Return a JSON response for AJAX success
        return response()->json([
            'success' => true,
            'message' => 'Comment has been updated successfully.',
            'data'    => Comment::all(),
        ]);
    }

    public function ordernote(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'note'     => 'required|string',
        ]);

        // Assuming the service method updates the order note
        $order = $this->orderService->updateOrderNote($request->order_id, $request->note);

        // Return a JSON response for AJAX success
        return response()->json([
            'success' => true,
            'message' => 'Order Note has been updated successfully.',
        ]);
    }

    public function checkout(Request $request)
    {

        try {
            $data         = $request->all();
            $data['user'] = User::find($data['user_id']);
            // Taken by staff: an out-of-stock line is their call to make.
            $data['staff_order'] = true;

            if (! $data['user']) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $order = $this->orderService->checkout($data);
            //  Log::info('Order: ' . json_encode($order));
            // Create a notification for the new order
            Notification::create([
                'user_id'           => $data['user_id'], // The user associated with the order
                'notification_type' => 'Order',
                'related_id'        => $order->id, // The ID of the new order
                'message'           => "A new order #{$order->id} has been placed successfully.",
            ]);

            return response()->json([
                'success' => true,
                'order'   => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => \App\Helpers\SafeError::message($e, 'Order could not be processed.', 'API order failed')], 400);
        }
    }

    public function apiorderfilter(Request $request)
    {
        try {
            // Check if the 'key' parameter is provided
            if (! $request->has('key') || empty($request->key)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Filter key is required.',
                ], 400);
            }

            // Get the filter key from the request
            $filterKey = $request->key;

            // Invoice number only.
            //
            // This used to also match on the customer's phone number, which let
            // anyone enumerate phone numbers and read the matching customers' names
            // and delivery addresses. (That branch was broken anyway: it queried
            // `phone_number` on `users`, which only has `phone`, so it raised a SQL
            // error that this method then returned to the caller.)
            //
            // An invoice number is the same key the storefront's own order tracking
            // uses, so guest tracking is unaffected. Signed-in customers can list
            // their full history through /api/v1/order-get.
            $orders = Order::with([
                'customer_info',
                'customer_address',
                'items.product_info',
                'items.option',
                'items.option.attributeOption',
                'items.option.attributeOption.attribute',
                'comment',
            ])
                ->where('invoice_number', $filterKey)
                ->get();

            // Check if no orders are found
            if ($orders->isEmpty()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No orders found for the given filter.',
                ], 404);
            }

            // Return the filtered data as JSON
            return response()->json([
                'status' => 'success',
                'data'   => $orders,
            ]);
        } catch (\Exception $e) {
            // The exception message is logged, not returned: it previously leaked
            // SQL and schema details to unauthenticated callers.
            Log::error('Order filter failed', ['error' => $e->getMessage()]);

            return response()->json([
                'status'  => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

    public function apicheckout(Request $request)
    {
        $incomplete_id = $request->incomplete_order_id;

        try {
            $data         = $request->all();
            $data['user'] = User::find($data['user_id']);
            // Taken by staff: an out-of-stock line is their call to make.
            $data['staff_order'] = true;
            if ($data['user']) {
                if ($data['user']['is_block']) {
                    return response()->json(['error' => 'User is blocked'], 403);
                }
            } else {
                $data['user'] = $request->user_id;
            }

            $order = $this->orderService->checkout($data);
            $items = $request->items;

            // Fetch detailed product information for each item
            $detailedItems = collect($items)->map(function ($item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    return [
                        'product'           => $product,
                        'quantity'          => $item['quantity'],
                        'individual_price'  => $item['individual_price'],
                        'total'             => $item['total'],
                        'attributeOptionId' => $item['attributeOptionId'],
                        'campaign_discount' => $item['campaign_discount'],
                        'coupon_discount'   => $item['coupon_discount'],
                        'original_price'    => $item['original_price'],
                    ];
                }
                return $item;
            });

            // Add items to the order object
            $order->items = $detailedItems;

            order::where(['id' => $incomplete_id, 'order_status' => 'incomplete'])->delete();
            // Create a notification for the new order only if the order is not incomplete
            if ($order->order_status !== 'incomplete' && is_int($data['user_id'])) {



                Notification::create([
                    'user_id'           => $data['user_id'], // The user associated with the order
                    'notification_type' => 'Order',
                    'related_id'        => $order->id, // The ID of the new order
                    'message'           => "A new order #{$order->id} has been placed successfully.",
                ]);
            }

            if ($order->order_status !== 'incomplete') {
                // Same confirmation the storefront sends, from the same template.
                app(\App\Services\Sms\OrderSmsNotifier::class)->send($order);
                app(\App\Services\Mail\OrderMailNotifier::class)->sendPlaced($order);
            }

            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => \App\Helpers\SafeError::message($e, 'Order could not be processed.', 'API order failed')], 400);
        }
    }

    public function apiincomplete(Request $request)
    {
        // Validate only the phone number
        $validated = $request->validate([
            'userDetails.phone' => 'required|string|max:15',
        ]);

        try {
            // Extract user details
            $userDetails = $request->input('userDetails', []);
            $phoneNumber = $userDetails['phone'];

            // Save address if provided
            $address = $userDetails['address'];

            // Prepare order items
            $orderItems = array_map(function ($item) {
                return [
                    'product_id'     => $item['product_id'] ?? null,
                    'quantity'       => $item['quantity'] ?? 1,
                    'price'          => $item['price'] ?? 0.00,
                    'campaign_id'    => $item['campaign_id'] ?? null,
                    'discount_value' => $item['discount_value'] ?? null,
                ];
            }, $request->input('items', []));

            // Create the incomplete order
            $incompleteOrder = Incomplete::create([
                'user_identifier'          => $userDetails['id'] ?? 0,
                'customer_name'            => $userDetails['name'] ?? 'Unknown',
                'address'                  => $address ? $address : null,
                'phone_number'             => $phoneNumber,
                'email'                    => $userDetails['email'] ?? 'Unknown',
                'alternative_phone_number' => $userDetails['alternativePhone'] ?? null,
                'note'                     => $request->input('note', null),
                'order_status'             => 'incomplete',
                'total_price'              => array_reduce($orderItems, fn($carry, $item) => $carry + ($item['quantity'] * $item['price']), 0),
                'delivery'                 => $request->input('area', 'unknown'),
                'invoice_number'           => 'INV' . time(),
                'comment_id'               => null,
                'order_items'              => $orderItems,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Incomplete order created successfully',
                'data'    => $incompleteOrder,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create incomplete order',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchConsignmentStatus(Request $request)
    {
        $consignmentId = $request->query('consignment_id');

        if (! $consignmentId) {
            return response()->json(['error' => 'Consignment ID is required'], 400);
        }

        $response = $this->courierApiSettingService->getConsignmentStatus($consignmentId);
        // Log::info('Consignment status response:', ['response' => $response]);

        return response()->json($response);
    }

    public function validateCoupon(Request $request)
    {

        $productIds = $request->product_ids;

        if (empty($productIds)) {
            return response()->json(['error' => 'কার্টে কোনো পণ্য নেই।'], 400);
        }

        // The storefront is in Bangla, so the reason is too. The rules are the
        // Coupon model's, shared with checkout and the admin coupon list — this
        // check used to call a coupon expired on its last day, and accepted one
        // whose start date had not come yet.
        $coupon = Coupon::findByTypedCode($request->coupon_code);
        if (! $coupon) {
            return response()->json(['error' => 'এই কোডে কোনো কুপন পাওয়া যায়নি।'], 404);
        }

        $reason = [
            'scheduled' => 'এই কুপনটি এখনও চালু হয়নি।',
            'expired'   => 'এই কুপনের মেয়াদ শেষ হয়ে গেছে।',
            'used_up'   => 'এই কুপনটি সর্বোচ্চ সংখ্যকবার ব্যবহার করা হয়ে গেছে।',
        ][$coupon->status()] ?? null;

        if ($reason) {
            return response()->json(['error' => $reason], 410);
        }

        // Products are a restriction, not a requirement: a coupon with none
        // listed applies to the whole catalogue.
        $restrictions = CouponProduct::where('coupon_id', $coupon->id);

        if ($restrictions->exists() && ! (clone $restrictions)->whereIn('product_id', $productIds)->exists()) {
            return response()->json(['error' => 'এই কুপনটি আপনার কার্টের পণ্যে প্রযোজ্য নয়।'], 400);
        }

        return response()->json(['success' => $coupon], 200);
    }

    public function bulkStatusUpdate(Request $request)
    {

        $request->validate([
            'order_ids'   => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'status'      => 'required|in:pending,processed,shipped,delivered,cancelled,returned,on delivery,pending delivery',
        ]);

        // Fetch the orders to update their status and handle the quantity update
        $orders = Order::with('items')->whereIn('id', $request->order_ids)->get();

        $mail = app(\App\Services\Mail\OrderMailNotifier::class);

        foreach ($orders as $order) {
            $previousStatus = $order->order_status;

            // Update the order status
            $order->update(['order_status' => $request->status]);

            $mail->sendStatusChanged($order, $previousStatus);

            // Handle quantity update for "cancelled" or "returned" status
            if (in_array($request->status, ['cancelled', 'returned'])) {
                foreach ($order->items as $orderItem) {
                    $product = Product::find($orderItem->product_id);
                    if ($product && $product->tracks_stock) {

                        $product->quantity += $orderItem->quantity;
                        $product->save();
                    }
                }
            }
        }

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'order_ids'   => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        // Fetch the orders to delete and ensure cascading deletes for related items
        Order::with('items')->whereIn('id', $request->order_ids)->delete();

        return response()->json(['success' => true, 'message' => 'Orders deleted successfully.']);
    }

    public function edit($id, Request $request)
    {
        $products = Product::with('product_attributes')
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
            ->paginate(28);
        if ($request->ajax()) {
            return response()->json(['products' => $products]);
        }

        $order = Order::where('id', $id)->with('customer_info', 'customer_address', 'items', 'items.product_info', 'items.option', 'items.option.attributeOption', 'items.option.attributeOption.attribute', 'comment')->first();

        $product_attribute_data = OrderItem::with('product_attributes', 'product_attributes.attribute', 'product_attributes.attribute_option')->where('order_id', $id)->get();

        // Fetch courier API settings
        $couriar_settings        = CourierSetting::first();
        $pathao_couriar_settings = ApiToken::first();

        // Check if 'pathao' is enabled
        $pathao_city = [];

        // Call Pathao functions
        $pathao_cities_response = $this->courierApiSettingService->getCityList();
        $pathao_city            = $pathao_cities_response['data']['data'] ?? [];


        // Define the specific phone number to check for duplicates
        $targetPhoneNumber = $order->phone_number;

        // Filter orders to include only those matching the target phone number
        $orders = Order::where('phone_number', $targetPhoneNumber)->whereNot('id', $order->id)->latest()->paginate(12);



        // Fetch comments if needed
        $comments = $this->commentService->all();


        $deliveryCharge               = SiteInfo::first();

        $redux = $this->courierApiSettingService->getArea()['areas'] ?? [];
        $categories = Category::select('id', 'name')->get();
        return Inertia::render('Admin/Orders/Edit', [
            'order'                  => $order,
            'orders'                 => $orders,
            'product_attribute_data' => $product_attribute_data,
            'pathao_city'            => $pathao_city,
            'comments'               => $comments,
            'couriar_settings'       => $couriar_settings,
            'products'               => $products,
            'redux'                  => $redux,
            'pathao_couriar_settings'=> $pathao_couriar_settings,
            'deliveryCharge'         => $deliveryCharge,
            'categories'             => $categories,
            'paymentTypes'           => config('payments.types'),
            'paymentMethods'         => collect(config('payments.methods'))
                ->map(fn ($m, $key) => ['value' => $key] + $m)
                ->values(),
        ]);
    }

    /**
     * Lightweight JSON data for the Edit Order modal (Orders/Index.vue),
     * carrying only the fields that modal actually renders/submits.
     */
    public function editData($id)
    {
        $order = Order::where('id', $id)
            ->with('customer_info', 'customer_address', 'items', 'items.product_info', 'items.option', 'items.option.attributeOption', 'items.option.attributeOption.attribute', 'comment')
            ->firstOrFail();

        return response()->json([
            'order'          => $order,
            'deliveryCharge' => SiteInfo::first(),
            'paymentTypes'   => config('payments.types'),
            'paymentMethods' => collect(config('payments.methods'))
                ->map(fn ($m, $key) => ['value' => $key] + $m)
                ->values(),
        ]);
    }

    /**
     * Lightweight, read-only JSON data for the View Order modal (Orders/Index.vue).
     */
    public function orderDetails($id)
    {
        $order = Order::where('id', $id)
            ->with('customer_info', 'customer_address', 'items.product_info', 'items.option.attributeOption.attribute', 'comment')
            ->firstOrFail();

        return response()->json(['order' => $order]);
    }

    public function cartDataToGive(Request $request, $id)
    {
        $cart = $request->input('cart', []);

        if (empty($cart)) {
            // Initial load -> build cart from DB
            $order = Order::with(['items.product_info'])->findOrFail($id);

            $cart = $order->items()->with('options.productAttribute')->get()->map(function ($item) {

                // Normalize selected attributes
                $selected = $item->options->map(function ($sel) {
                    return [
                        'attrId'               => $sel->productAttribute->attribute_id ?? null,
                        'optionId'             => $sel->attribute_options_id ?? null,
                        'product_attibute_id'  => $sel->product_attribute_id ?? null,
                        'attribute_options_id' => $sel->attribute_options_id ?? null,
                        'quantity'             => (int)($sel->quantity ?? 1),
                    ];
                })->toArray();

                // Determine availableQty
                $availableQty = 9999;
                if (!empty($selected)) {
                    $optionIds = collect($selected)->pluck('optionId')->filter()->toArray();
                    $query = ProductAttribute::where('product_id', $item->product_id);
                    if (!empty($optionIds)) {
                        $query->whereIn('attribute_option_id', $optionIds);
                    }
                    if ($item->combination_id) {
                        $query->where('combination_id', $item->combination_id);
                    }
                    $availableQty = $query->min('quantity') ?? 9999;
                }

                return [
                    "productId"     => $item->product_id,
                    "name"          => $item->product_info->product_name ?? 'N/A',
                    "combinationId" => $item->combination_id,
                    "selected"      => $selected,
                    "price"         => (float) $item->price,
                    "quantity"      => $item->quantity,
                    "availableQty"  => $availableQty,
                    "totalPrice"    => $item->price * $item->quantity,
                ];
            })->toArray();
        }

        $products = Product::whereIn('id', collect($cart)->pluck('productId'))
            ->with('product_attributes.attributeOption.attribute')
            ->get();

        return response()->json([
            'cart' => $cart,
            'products' => $products,
        ]);
    }



    public function show($id)
    {

        // The view no longer lists the customer's other orders, so the extra
        // paginated query and the comment lookup that fed it are gone too.
        $invoice = $this->orderService->getInvoice($id);

        return view('admin.invoice.show', compact('invoice'));
    }

    public function updateStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'status'   => 'required|in:pending,processed,returned,delivered,cancelled,shipped,on delivery,pending delivery,incomplete',
        ]);

        $order     = Order::findOrFail($request->order_id);
        $oldStatus = $order->order_status;
        $newStatus = $request->status;

        $order->order_status = $newStatus;
        $order->save();

        // Handle stock adjustments
        if (in_array($newStatus, ['cancelled', 'returned']) && ! in_array($oldStatus, ['cancelled', 'returned'])) {
            // Order moved TO cancelled/returned → Restock items
            $this->adjustStock($order, +1);
        } elseif (! in_array($newStatus, ['cancelled', 'returned']) && in_array($oldStatus, ['cancelled', 'returned'])) {
            // Order moved FROM cancelled/returned → Deduct items
            $this->adjustStock($order, -1);
        } elseif ($oldStatus === 'incomplete' && ! in_array($newStatus, ['cancelled', 'returned', 'incomplete'])) {
            // Order moved FROM incomplete → Deduct stock (finalize order)
            $this->adjustStock($order, -1);
        } elseif ($newStatus === 'incomplete' && ! in_array($oldStatus, ['cancelled', 'returned', 'incomplete'])) {
            // Order moved TO incomplete → Restock (order not finalized)
            $this->adjustStock($order, +1);
        }

        // Only a real transition sends: sendStatusChanged() drops a no-op change.
        app(\App\Services\Mail\OrderMailNotifier::class)->sendStatusChanged($order, $oldStatus);

        return response()->json(['success' => true, 'message' => 'Order status updated']);
    }

    /**
     * Adjust stock quantity based on factor (+1 to add, -1 to subtract)
     */
    protected function adjustStock(Order $order, int $factor)
    {
        foreach ($order->orderItems as $item) {
            $product = Product::find($item->product_id);
            if (! $product) {
                continue;
            }

            $hasAttributes = $item->orderItemOptions()->exists();

            if ($hasAttributes) {
                // Update each attribute quantity and sold count accordingly
                foreach ($item->orderItemOptions as $attr) {
                    $productAttribute = $attr->productAttribute;

                    $productAttribute->quantity   = max(0, $productAttribute->quantity + ($factor * $item->quantity));
                    $productAttribute->sold_quantity = max(0, $productAttribute->sold_quantity - ($factor * $item->quantity)); // subtract when rolling back, add when placing
                    $productAttribute->save();
                }

                // After attribute quantities updated, update product quantity and sold count
                $totalAttributeQty  = $product->product_attributes()->sum('quantity');
                $totalAttributeSold = $product->product_attributes()->sum('sold_quantity');

                $product->quantity   = max(0, $totalAttributeQty);
                $product->sold_quantity = max(0, $totalAttributeSold);
                $product->save();
            } else {
                // No attributes: only a counted product moves its quantity.
                if ($product->tracks_stock) {
                    $product->quantity = max(0, $product->quantity + ($factor * $item->quantity));
                }
                $product->sold_quantity = max(0, $product->sold_quantity - ($factor * $item->quantity));
                $product->save();
            }
        }
    }

    public function getZones($city_id)
    {
        try {

            $zonesResponse = $this->courierApiSettingService->getZones($city_id);

            $zones = $zonesResponse['data']['data'] ?? [];

            return response()->json([
                'success' => true,
                'zones'   => $zones,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching zones: ' . $e->getMessage(),
            ]);
        }
    }

    public function getAreas(Request $request)
    {
        $zoneId = $request->input('zone_id');

        $areas = $this->courierApiSettingService->getAreas($zoneId);

        return response()->json($areas['data']['data'] ?? []);
    }

    public function orderInfoUpdate(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'email' => 'nullable|email|max:255',
            'delivery_charge_area' => 'nullable|in:inside,outside',
            'payment_type' => ['nullable', Rule::in(array_keys(config('payments.types')))],
            'payment_method' => ['nullable', Rule::in(array_keys(config('payments.methods')))],
            'payment_reference' => 'nullable|string|max:100',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::with('items.options')->findOrFail($request->order_id);

            // --- Step 0: Roll back old stock ---
            foreach ($order->items as $item) {
                if ($item->options->isNotEmpty()) {
                    foreach ($item->options as $opt) {
                        $this->adjustStockLevels(
                            $item->product_id,
                            $opt->attribute_options_id,
                            -$opt->quantity,
                            $opt->combination_id ?? null
                        );
                    }
                } else {
                    // Product without attributes
                    $this->adjustStockLevels($item->product_id, null, -$item->quantity);
                }
            }

            // --- Update order data ---
            $orderData = [
                'customer_name'            => $request->name,
                'address'                  => $request->address,
                'phone_number'             => $request->phone,
                'alternative_phone_number' => $request->alternativephone,
                'order_status'             => $request->order_status,
                'note'                     => $request->note ?? '',
                'courier_note'             => $request->courier_note ?? '',
                'couriar_name'             => $request->courier ?? '',
                'delivery_charge'          => $request->delivery_charge ?? 0,
                // ?? only catches null; an unset area arrives as '' and was
                // being stored as an empty string rather than N/A.
                'delivery'                 => $request->filled('delivery_charge_area')
                    ? $request->delivery_charge_area
                    : 'N/A',
                'total_price'              => $request->subtotal ?? 0,
                'discount'                 => $request->discount ?? 0,
                'payment_type'             => $request->payment_type ?: null,
                // A provider is meaningless unless the payment was online.
                'payment_method'           => $request->payment_type === 'online' ? ($request->payment_method ?: null) : null,
                'payment_reference'        => $request->payment_type === 'online' ? ($request->payment_reference ?: null) : null,
            ];

            // orders.email is NOT NULL, so only touch it when the caller
            // actually supplied one — otherwise a save without it wipes the
            // column and the update fails outright.
            if ($request->has('email')) {
                $orderData['email'] = (string) $request->input('email');
            }

            $order->update($orderData);

            // --- Delete old items ---
            $order->items()->delete();

            // --- Recreate order items and decrease stock ---
            foreach ($request->cart as $cartItem) {
                $orderItem = $order->items()->create([
                    'product_id' => $cartItem['productId'],
                    'price'      => $cartItem['price'],
                    'quantity'   => $cartItem['quantity'],
                ]);

                if (!empty($cartItem['selected'])) {
                    foreach ($cartItem['selected'] as $selected) {
                        $query = ProductAttribute::where('product_id', $cartItem['productId'])
                            ->where('attribute_option_id', $selected['optionId'] ?? null);

                        if (!empty($cartItem['combinationId'])) {
                            $query->where('combination_id', $cartItem['combinationId']);
                        }

                        $productAttribute = $query->first();
                        if (!$productAttribute) continue;

                        OrderItemOption::create([
                            'order_item_id'        => $orderItem->id,
                            'attribute_options_id' => $productAttribute->attribute_option_id,
                            'quantity'             => $cartItem['quantity'],
                            'product_attibute_id'  => $productAttribute->id,
                        ]);

                        // Decrease stock — pass combinationId
                        $this->adjustStockLevels(
                            $cartItem['productId'],
                            $productAttribute->attribute_option_id,
                            $cartItem['quantity'],
                            $cartItem['combinationId'] ?? null
                        );
                    }
                } else {
                    // Product without attributes
                    $this->adjustStockLevels($cartItem['productId'], null, $cartItem['quantity']);
                }
            }

            DB::commit();

            return response()->json([
                'success'  => true,
                'message'  => 'Order updated successfully.',
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
           
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // $attributeOptionId carried a `= null` default while $quantityDifference after it
    // did not, which PHP treats as required anyway and deprecates. All four call sites
    // already pass it positionally, so dropping the default changes nothing at runtime.
    private function adjustStockLevels($productId, $attributeOptionId, $quantityDifference, $combinationId = null)
    {
        if ($attributeOptionId) {
            $query = ProductAttribute::where('product_id', $productId)
                ->where('attribute_option_id', $attributeOptionId);

            if ($combinationId) {
                $query->where('combination_id', $combinationId);
            }

            $productAttribute = $query->firstOrFail();

            if ($quantityDifference > 0) {
                if ($productAttribute->quantity < $quantityDifference) {
                    throw new \Exception("Insufficient stock for attribute option ID: {$attributeOptionId}");
                }
                $productAttribute->decrement('quantity', $quantityDifference);
                $productAttribute->increment('sold_quantity', $quantityDifference);
            } elseif ($quantityDifference < 0) {
                $adjustment = abs($quantityDifference);
                $productAttribute->increment('quantity', $adjustment);
                $productAttribute->decrement('sold_quantity', $adjustment);
            }
        } else {
            // Product without attributes
            $product = Product::findOrFail($productId);
            if ($quantityDifference > 0) {
                if ($product->quantity < $quantityDifference) {
                    throw new \Exception("Insufficient stock for product: {$product->product_name}");
                }
                if ($product->tracks_stock) {
                    $product->decrement('quantity', $quantityDifference);
                }
                $product->increment('sold_quantity', $quantityDifference);
            } elseif ($quantityDifference < 0) {
                $adjustment = abs($quantityDifference);
                if ($product->tracks_stock) {
                    $product->increment('quantity', $adjustment);
                }
                $product->decrement('sold_quantity', $adjustment);
            }

            // Simple products have no product_attributes rows to roll up from —
            // Product.quantity (just adjusted above) is already authoritative.
            return;
        }

        // Attribute-based products: keep the parent Product.quantity in sync as
        // a rolled-up total of its attribute-option quantities.
        $product = Product::findOrFail($productId);

        if ($combinationId) {
            // For combination, sum one row per combination
            $sumQty = ProductAttribute::where('product_id', $productId)
                ->groupBy('combination_id')
                ->selectRaw('SUM(quantity) as total_qty')
                ->get()
                ->sum('total_qty');
        } else {
            $sumQty = ProductAttribute::where('product_id', $productId)
                ->sum('quantity');
        }

        $product->update(['quantity' => $sumQty]);
    }



    // update oders method
    public function update(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validate base request
            $data = $request->validate([
                'order_id'                                 => 'required|exists:orders,id',
                'items'                                    => 'nullable|array',
                'items.*.product_id'                       => 'required_with:items|exists:products,id',
                'items.*.order_item_option_id'             => 'required_with:items|exists:order_items,id',
                'items.*.quantity'                         => 'required_with:items|numeric|min:1',
                'items.*.price'                            => 'required_with:items|numeric|min:0',
                'items.*.attributes'                       => 'nullable|array',
                'items.*.attributes.*.attribute_option_id' => 'required_with:items.*.attributes|exists:product_attributes,attribute_option_id',
                'delivery_charge'                          => 'nullable|numeric|min:0',
                'total_price'                              => 'nullable|numeric|min:0',
                'discount'                                 => 'nullable|numeric|min:0',
                'name'                                     => 'nullable|string',
                'address'                                  => 'nullable|string',
                'phone'                                    => 'nullable|string',
                'alternativephone'                         => 'nullable|string',
                'order_status'                             => 'nullable|string',
                'note'                                     => 'nullable|string',
                'courier_note'                             => 'nullable|string',
                'courier'                                  => 'nullable|string',
                'redex_zone'                               => 'nullable|string',
                'redex_area'                               => 'nullable|string',
                'city'                                     => 'nullable|numeric',
                'zone'                                     => 'nullable|numeric',
                'area'                                     => 'nullable|numeric',
            ]);

            $order = Order::findOrFail($data['order_id']);

            // ==============================
            // 1) Update General Order Info
            // ==============================
            $orderData = [
                'customer_name'            => $request->name ?? $order->customer_name,
                'address'                  => $request->address ?? $order->address,
                'phone_number'             => $request->phone ?? $order->phone_number,
                'alternative_phone_number' => $request->alternativephone ?? $order->alternative_phone_number,
                'order_status'             => $request->order_status ?? $order->order_status,
                'note'                     => $request->note ?? $order->note,
                'courier_note'             => $request->courier_note ?? $order->courier_note,
                'couriar_name'             => $request->courier ?? $order->couriar_name,
                'delivery_charge'          => $request->delivery_charge ?? $order->delivery_charge,
            ];

            // ==============================
            // 2) Courier-specific handling
            // ==============================
            switch ($request->courier) {
                case 'redx':
                    $orderData['area_id']   = $request->redex_zone;
                    $orderData['area_name'] = $request->redex_area ?? '';

                    $orderData['city_id']   = '';
                    $orderData['zone_id']   = '';
                    $orderData['city_name'] = '';
                    $orderData['zone_name'] = '';
                    break;

                case 'pathao':
                    $citiesResponse = $this->courierApiSettingService->getCityList();
                    $cities         = collect($citiesResponse['data']['data']);
                    $city           = $cities->where('city_id', $request->city)->first();

                    if (! $city) {
                        return redirect()->back()->with('error', 'City not found for Pathao courier.');
                    }

                    $zonesResponse = $this->courierApiSettingService->getZones((int) $city['city_id']);
                    $zones         = collect($zonesResponse['data']['data']);
                    $zone          = $zones->where('zone_id', $request->zone)->first();

                    $areasResponse = $this->courierApiSettingService->getAreas((int) $zone['zone_id']);
                    $areas         = collect($areasResponse['data']['data']);
                    $area          = $areas->where('area_id', $request->area)->first();

                    $orderData = array_merge($orderData, [
                        'city_id'   => $city['city_id'],
                        'zone_id'   => $zone['zone_id'],
                        'area_id'   => $area['area_id'],
                        'city_name' => $city['city_name'] ?? '',
                        'zone_name' => $zone['zone_name'] ?? '',
                        'area_name' => $area['area_name'] ?? '',
                    ]);
                    break;

                case 'steadfast':
                    // Add your logic later
                    break;

                default:
                    break;
            }

            // Apply general updates
            $order->update($orderData);

            // ==============================
            // 3) Update Order Totals & Items (if provided)
            // ==============================
            if (!empty($data['items'])) {
                $discount = $request->discount ?? 0;

                // Validate stock before making changes
                foreach ($data['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $orderItem = OrderItem::findOrFail($item['order_item_option_id']);

                    $quantityDifference = $item['quantity'] - $orderItem->quantity;

                    if ($quantityDifference > 0 && $product->quantity < $quantityDifference) {
                        throw new \Exception("Insufficient stock for product: {$product->name}");
                    }

                    if (! empty($item['attributes']) && is_array($item['attributes'])) {
                        foreach ($item['attributes'] as $attribute) {
                            $productAttribute = ProductAttribute::where('product_id', $product->id)
                                ->where('attribute_option_id', $attribute['attribute_option_id'])
                                ->first();

                            if (! $productAttribute) {
                                throw new \Exception("No matching attributes found for product: {$product->name}");
                            }

                            if ($quantityDifference > 0 && $productAttribute->quantity < $quantityDifference) {
                                throw new \Exception("Insufficient attribute stock for product: {$product->name}");
                            }
                        }
                    }
                }

                // Update totals
                $order->update([
                    'delivery_charge' => $data['delivery_charge'] ?? $order->delivery_charge,
                    'total_price' => isset($data['total_price'])
                        ? $data['total_price'] - $order->delivery_charge
                        : $order->total_price,
                    'discount'        => $discount,
                ]);

                // Update each item
                foreach ($data['items'] as $item) {
                    $this->processOrderItem($item);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Order updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to process order: ' . $e->getMessage());
        }
    }


    private function processOrderItem(array $item)
    {
        $orderItem = OrderItem::findOrFail($item['order_item_option_id']);
        $quantityDifference = $item['quantity'] - $orderItem->quantity;

        // Update order item base info
        $orderItem->update([
            'quantity' => $item['quantity'],
            'price'    => $item['price'],
        ]);

        // Delete old options
        $orderItem->options()->delete();

        // Re-create order item options
        $attributes = $item['attributes'] ?? [];

        foreach ($attributes as $attributeId => $att) {
            if (!isset($att['attribute_option_id'])) {
                continue;
            }

            $attributeOptionId = $att['attribute_option_id'];

            // Find related ProductAttribute (links product + option)
            $productAttribute = ProductAttribute::where('product_id', $item['product_id'])
                ->where('attribute_option_id', $attributeOptionId)
                ->first();

            if ($productAttribute) {
                $orderItem->options()->create([
                    'order_item_id'         => $orderItem->id,
                    'attribute_options_id'  => $attributeOptionId,
                    'quantity'              => $item['quantity'],
                    'product_attibute_id'   => $productAttribute->id,
                ]);
            }
        }

        // Update inventory if needed
        if ($quantityDifference !== 0) {
            $this->updateInventory($item, $quantityDifference);
        }
    }

    private function updateInventory(array $item, int $quantityDifference)
    {
        $product = Product::findOrFail($item['product_id']);

        // Update main product inventory
        if ($quantityDifference > 0) {
            if ($product->tracks_stock) {
                $product->decrement('quantity', $quantityDifference);
            }
            $product->increment('sold_quantity', $quantityDifference);
        } else {
            if ($product->tracks_stock) {
                $product->increment('quantity', abs($quantityDifference));
            }
            $product->decrement('sold_quantity', abs($quantityDifference));
        }

        // Only process attributes if they exist
        if (! empty($item['attributes']) && is_array($item['attributes'])) {
            foreach ($item['attributes'] as $attribute) {
                $this->updateAttributeStock($product, $attribute, $quantityDifference, $item);
            }
        } else {

            // Log::error("No attributes found for product: {$product->name}");
            throw new \Exception("No attributes found for product: {$product->name}");
        }
    }

    private function updateAttributeStock(Product $product, array $attribute, int $quantityDifference, array $item)
    {
        $orderItem = OrderItemOption::where('order_item_id', $item['order_item_option_id'])->first();

        $productAttibuteId = $orderItem->product_attibute_id;
        // Log::info("Product Attibute Id: " . $productAttibuteId);
        $productAttribute = ProductAttribute::where('product_id', $product->id)
            ->where('id', $productAttibuteId)
            ->first();
        // Log::info("Product Attribute: " . json_encode($productAttribute));

        if (! $productAttribute) {
            // Log::error("Attribute stock not found", [
            //     'product_id'          => $product->id,
            //     'attribute_option_id' => $attribute['attribute_option_id'],
            // ]);
            throw new \Exception("Attribute stock not found for product: {$product->name}");
        }

        if ($quantityDifference > 0) {
            if ($productAttribute->quantity < $quantityDifference) {
                throw new \Exception("Insufficient stock for attribute of product: {$product->name}");
            }
            $productAttribute->decrement('quantity', $quantityDifference);
            $productAttribute->increment('sold_quantity', $quantityDifference);
        } else {
            $productAttribute->increment('quantity', abs($quantityDifference));
            $productAttribute->decrement('sold_quantity', abs($quantityDifference));
        }
    }

    ///////////////////

    /////////////////////////

    //Issue has started

    public function bulkProcess(Request $request)
    {
        $orderIds = $request->input('orders', []);

        if (empty($orderIds)) {
            return response()->json(['message' => 'No orders selected.'], 400);
        }

        // Fetch and process the orders
        $orders = Order::whereIn('id', $orderIds)->with('customer_info', 'customer_address', 'items', 'items.product_info', 'items.option', 'items.option.attributeOption', 'items.option.attributeOption.attribute', 'comment')->get();

        // Store the selected orders in the session
        session(['bulk_orders' => $orders]);

        return response()->json([
            'message'      => 'Orders selected successfully.',
            'redirect_url' => route('admin.orders.bulkOrderView'),
        ]);
    }

    public function bulkOrderView()
    {

        $orders = session('bulk_orders', []);

        if (empty($orders)) {
            return redirect()->route('admin.orders.index')->with('error', 'No orders selected.');
        }

        session()->forget('bulk_orders');

        $media = getFirstMedia();

        $comments = $this->commentService->all();

        return view('admin.orders.bulk-order.index', compact('orders', 'comments', 'media'));
    }

    public function imageToBase64($path)
    {
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    public function generatePDF(Request $request)
    {
        $orderIds = $request->input('order_ids');

        if (empty($orderIds)) {
            return response()->json(['error' => 'No orders selected'], 400);
        }

        // Convert comma-separated string to array
        $orderIdsArray = explode(',', $orderIds);

        $orders = Order::whereIn('id', $orderIdsArray)
            ->with([
                'customer_info',
                'customer_address',
                'items',
                'items.product_info',
                'items.option',
                'items.option.attributeOption',
                'items.option.attributeOption.attribute',
                'comment',
            ])
            ->get();

        return view('admin.orders.invoice.index', compact('orders'));
    }

    public function bulkCSVProcessSteadfast(Request $request)
    {
        $orderIds = $request->input('orders', []);

        if (empty($orderIds)) {
            return response()->json(['message' => 'No orders selected.'], 400);
        }

        // Fetch and process the orders
        $orders = Order::whereIn('id', $orderIds)->with('customer_info', 'customer_address', 'items', 'items.product_info', 'items.option', 'items.option.attributeOption', 'items.option.attributeOption.attribute', 'comment')->get();

        // Store the selected orders in the session
        session(['bulk_orders' => $orders]);

        return response()->json([
            'message'      => 'Orders selected successfully.',
            'redirect_url' => route('admin.orders.bulkCSVViewSteadfast'),
        ]);
    }

    public function bulkCSVViewSteadfast()
    {

        $orders = session('bulk_orders', []);

        if (empty($orders)) {
            return redirect()->route('admin.orders.index')->with('error', 'No orders selected.');
        }

        session()->forget('bulk_orders');

        $media = getFirstMedia();

        $comments = $this->commentService->all();

        return Inertia::render('Admin/Orders/BulkCsvSteadfast', [
            'orders'   => $orders,
            'comments' => $comments,
            'logoUrl'  => $media && $media->logo ? asset($media->logo) : null,
        ]);
    }

    public function delete($id)
    {

        $order = Order::findOrFail($id);

        $order->delete();

        return redirect()->back()->with('success', 'Data deleted successfully');
    }

    public function orderNow(Request $request)
    {
        $request = $request->all();
        if (isset($request['item']['attributeOptionId'])) {
            $request['item']['attributeOptionId'] = json_decode($request['item']['attributeOptionId'][0], true);
        }

        // Clean the price by removing commas
        if (isset($request['item']['individual_price'])) {
            $request['item']['individual_price'] = str_replace(',', '', $request['item']['individual_price']);
        }

        // return $request;
        // Normalize input
        $order = Order::find($request['order']['id']);
        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }
        $item    = $request['item'];
        $data    = $request['data'];
        $itemId  = $request['item']['product_id'];
        $product = Product::with('productAttributes')->find($itemId);

        try {
            DB::beginTransaction();
            if ($product->productAttributes->isEmpty()) {
                if ($product->quantity >= $item['quantity']) {
                    // Check if the order item already exists
                    $existingOrderItem = OrderItem::where('order_id', $order->id)
                        ->where('product_id', $itemId)
                        ->first();

                    if ($existingOrderItem) {
                        // If item exists, update quantity and total price
                        $existingOrderItem->increment('quantity', $item['quantity']);
                        $existingOrderItem->increment('total', $item['individual_price'] * $item['quantity']);
                    } else {
                        // If item does not exist, create a new order item
                        OrderItem::create([
                            'order_id'   => $order->id,
                            'product_id' => $itemId,
                            'quantity'   => $item['quantity'],
                            'price'      => $item['individual_price'],

                        ]);
                    }

                    // Update product stock
                    Product::where('id', $itemId)->tracksStock()->decrement('quantity', $item['quantity']);
                    Product::where('id', $itemId)->increment('sold_quantity', $item['quantity']);
                } else {
                    return redirect()->back()->with('error', 'Insufficient stock for the product');
                }
            } else {
                $product = $this->orderservices->processOrderItem($order, $item, $data);
            }

            // Call the service method

            DB::commit();

            return redirect()->back()->with('success', 'Order processed successfully');
        } catch (\Exception $e) {
            // Log::error('Order processing failed', [
            //     'error'        => $e->getMessage(),
            //     'trace'        => $e->getTraceAsString(),
            //     'request_data' => $request,
            // ]);
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to process order: ' . $e->getMessage());
        }
        // check product_attributes empty or not

    }

    public function deleteitem(Request $request)
    {
        $id       = $request->input('item_id');
        $quantity = $request->input('quanity');

        if (! $id || ! $quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid item ID or quantity provided.',
            ]);
        }

        try {
            $orderItem        = OrderItem::findOrFail($id);
            $product          = Product::findOrFail($orderItem->product_id);
            $orderItemOptions = OrderItemOption::where('order_item_id', $orderItem->id)->get();

            if ($orderItemOptions->isEmpty()) {

                if ($product->tracks_stock) {
                    $product->quantity += $orderItem->quantity;
                    $product->save();
                }
            } else {
                // Update product quantity and attributes
                foreach ($orderItemOptions as $option) {
                    $this->updateProductQuantityAndAttributes($product, $option, $quantity);
                }
                $product->quantity += $quantity;
                $product->save();
            }

            $orderItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item deleted successfully.',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'success' => false,
                'message' => 'Item or product not found.',
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the item.',
            ]);
        }
    }

    /**
     * Update the product quantity and handle attributes based on options.
     *
     * @param Product $product
     * @param OrderItemOption $option
     */
    private function updateProductQuantityAndAttributes(Product $product, OrderItemOption $option, $quantity)
    {
        // Retrieve a single matching product attribute
        $productAttribute = ProductAttribute::where('product_id', $product->id)
            ->where('attribute_option_id', $option->attribute_options_id)
            ->whereNotNull('combination_id')
            ->first();

        if ($productAttribute) {
            // Update the product attribute quantity
            $productAttribute->quantity += $quantity;
            $productAttribute->save();
        } else {

            throw new \Exception("No product attributes found for Product ID: {$product->id} and Option ID: {$option->attribute_options_id}");
        }
    }

    public function coupon(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'coupon_code'   => 'required|string',
            'product_ids'   => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }
        // Find coupon first
        $coupon = Coupon::where('code', $request->coupon_code)->first();
        // If coupon doesn't exist at all
        if (! $coupon) {
            return response()->json([
                'status'  => false,
                'message' => 'Coupon not found',
            ], 404);
        }
        // Check expiration date
        if ($coupon->expiry_date < Carbon::now()) {
            return response()->json([
                'status'  => false,
                'message' => 'Coupon is expired',
            ], 410);
        }
        // Check usage limit - FIX: Properly compare used_count against usage_limit
        if ($coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'status'  => false,
                'message' => 'Coupon usage limit exceeded',
            ], 403);
        }
        $productIds = $request->product_ids;
        // Find valid products for this coupon
        $validProductIds = CouponProduct::where('coupon_id', $coupon->id)
            ->whereIn('product_id', $productIds)
            ->pluck('product_id')
            ->toArray();
        if (empty($validProductIds)) {
            return response()->json([
                'status'  => false,
                'message' => 'Coupon is not valid for any of the selected products',
            ], 400);
        }
        $invalidProductIds = array_diff($productIds, $validProductIds);
        // Get product details and calculate discount in one go
        $products        = Product::whereIn('id', $validProductIds)->get();
        $discountDetails = $this->calculateDiscount($coupon, $products);

        return response()->json([
            'status'           => true,
            'message'          => empty($invalidProductIds) ?
                'Coupon applied to all products' :
                'Coupon applied to some products only',
            'coupon'           => $coupon,
            'valid_products'   => $validProductIds,
            'invalid_products' => $invalidProductIds,
            'discount_details' => $discountDetails,
        ], 200);
    }
    /**
     * Calculate discount for products based on coupon
     *
     * @param Coupon $coupon
     * @param \Illuminate\Database\Eloquent\Collection $products
     * @return array
     */
    private function calculateDiscount($coupon, $products)
    {
        $totalDiscount      = 0;
        $discountedProducts = [];
        foreach ($products as $product) {
            $productDiscount = $coupon->discount_type === 'fixed'
                ? min($coupon->discount_amount, $product->price)
                : ($product->price * $coupon->discount_amount) / 100;
            $totalDiscount += $productDiscount;
            $discountedProducts[] = [
                'id'             => $product->id,
                'name'           => $product->name,
                'original_price' => $product->price,
                'discount'       => round($productDiscount, 2),
                'final_price'    => round($product->price - $productDiscount, 2),
            ];
        }
        return [
            'discounted_products' => $discountedProducts,
            'total_discount'      => round($totalDiscount, 2),
        ];
    }

    public function fraudAssessment(Order $order)
    {
        return response()->json(app(\App\Services\Admin\Order\OrderRiskAssessment::class)->forOrder($order));
    }

    /** Keep TLS verification enabled, including Windows PHP without a configured CA file. */
    private function fraudCheckHttp(): \Illuminate\Http\Client\PendingRequest
    {
        $request = Http::acceptJson()->connectTimeout(10)->timeout(20);
        $caBundle = config('services.fraud_check.ca_bundle');

        if (! $caBundle && PHP_OS_FAMILY === 'Windows') {
            foreach ([
                ini_get('curl.cainfo'),
                ini_get('openssl.cafile'),
                (getenv('ProgramFiles') ?: 'C:/Program Files') . '/Git/mingw64/etc/ssl/certs/ca-bundle.crt',
                'C:/xampp/apache/bin/curl-ca-bundle.crt',
            ] as $candidate) {
                if ($candidate && is_readable($candidate)) {
                    $caBundle = $candidate;
                    break;
                }
            }
        }

        return $caBundle ? $request->withOptions(['verify' => $caBundle]) : $request;
    }

    public function froudeCheckJson($phone_number)
    {
        $url    = rtrim(env('FRONTEND', config('app.url')), '/');
        $apiUrl = "https://efraudscan.com/api/check-succfull-fraud/{$phone_number}";

        try {
            $response = $this->fraudCheckHttp()->post($apiUrl, [
                'url'    => $url,
                'number' => $phone_number,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (! $data) {
                    return response()->json(['error' => 'Invalid response from fraud check service.'], 502);
                }
                return response()->json($data);
            }

            Log::error('Froude API error response', [
                'status' => $response->status(),
                'body'   => $response->body(),
                'url'    => $url,
            ]);

            return response()->json([
                'error' => 'Fraud check service error (' . $response->status() . '): ' . $response->body(),
            ], $response->status());
        } catch (\Exception $e) {
            Log::error('Froude API Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Connection error: Unable to check fraud status. ' . $e->getMessage()], 500);
        }
    }

    public function froudeCheckData($phone_number)
    {
        $url    = rtrim(env('FRONTEND', config('app.url')), '/');
        $apiUrl = "https://efraudscan.com/api/check-succfull-fraud/{$phone_number}";

        try {
            $response = $this->fraudCheckHttp()->post($apiUrl, [
                'url'    => $url,
                'number' => $phone_number,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (! $data) {
                    return back()->with('error', 'Invalid response from fraud check service.');
                }

                return Inertia::render('Admin/Orders/FraudCheck', [
                    'data' => $data,
                    'phone_number' => $phone_number,
                ]);
            }

            Log::error('Froude API error response', [
                'status' => $response->status(),
                'body'   => $response->body(),
                'url'    => $url,
            ]);

            return back()->with('error', 'Fraud check service error (' . $response->status() . '): ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Froude API Exception: ' . $e->getMessage());

            return back()->with('error', 'Connection error: Unable to check fraud status. ' . $e->getMessage());
        }
    }
}
