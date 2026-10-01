<?php
namespace App\Http\Controllers\Admin\Purchase;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Http\Requests\Admin\Purchase\PurchaseRequest;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\Purchase;
use App\Models\PurchaseGroup;
use App\Models\Supplier;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Purchase\PurchaseService;
use App\Services\Admin\Purchase\PurchaseServiceInterface;
use App\Traits\FileUploadTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseController extends Controller
{

    use FileUploadTrait;
    protected $productService;
    protected $purchaseService;

    public function __construct(ProductService $productService, PurchaseServiceInterface $purchaseService)
    {
        $this->productService  = $productService;
        $this->purchaseService = $purchaseService;
    }

    /**
     * Map the incoming request params to the keys applyFilters() expects.
     * Shared by index() and exportCsv() so both honour the same filters.
     */
    private function normalizePurchaseFilters(Request $request): void
    {
        if ($request->filled('supplier_id') && ! $request->filled('supplier_filter')) {
            $request->merge(['supplier_filter' => $request->supplier_id]);
        }

        if ($request->filled('date_range')) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) === 2) {
                $request->merge([
                    'start_date' => trim($dates[0]),
                    'end_date'   => trim($dates[1]),
                ]);
            }
        }

        // search by purchase name / invoice number
        if ($request->filled('purchase_name') && ! $request->filled('search')) {
            $request->merge(['search' => $request->purchase_name]);
        }
    }

    public function index(Request $request)
    {
        $this->normalizePurchaseFilters($request);

        // Order by latest
        $purchase = Purchase::orderBy('created_at', 'desc')->with('supplier');

        $suppliers = Supplier::orderBy('created_at', 'asc')->get();

        $purchases = $this->applyFilters($purchase, $request)->paginate(10, ['*'], 'page', $request->page ?? 1);

        // Aggregate totals across the whole filtered set (not just the current page)
        $totalsQuery = $this->applyFilters(Purchase::query(), $request);
        $totals = [
            'count'  => (clone $totalsQuery)->count(),
            'amount' => (float) (clone $totalsQuery)->sum('purchasing_price'),
            'paid'   => (float) (clone $totalsQuery)->sum('purchasing_paid'),
            'due'    => (float) (clone $totalsQuery)->sum('purchasing_due'),
        ];

        // Data for the inline "Add Purchase" modal (previously the separate create page)
        $attributes = [];
        try {
            $creationData = json_decode(json_encode($this->productService->getProductCreationData()), true);
            $attributes = $creationData['attributes'] ?? [];
        } catch (\Exception $e) {
            $attributes = [];
        }

        // Products eligible for purchase
        $products = Product::where('stock_option', 'From Purchase')
            ->orderBy('id', 'desc')
            ->select('id', 'product_name', 'product_code', 'price')
            ->get();

        return Inertia::render('Admin/Purchase/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'attributes' => $attributes,
            'products' => $products,
            'totals' => $totals,
            'currentFilters' => $request->only(['supplier_id', 'search', 'date_range', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Stream the filtered purchases as a CSV (Excel) download.
     */
    public function exportCsv(Request $request)
    {
        $this->normalizePurchaseFilters($request);

        $purchases = $this->applyFilters(Purchase::with('supplier'), $request)
            ->orderBy('created_at', 'desc')
            ->get();

        $columns = ['Purchase Name', 'Invoice', 'Supplier', 'Company', 'Total', 'Paid', 'Due', 'Date'];

        return response()->streamDownload(function () use ($purchases, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $columns);

            foreach ($purchases as $purchase) {
                fputcsv($handle, [
                    $purchase->purchase_name,
                    $purchase->invoice_number,
                    $purchase->supplier->supplier_name ?? '',
                    $purchase->supplier->company_name ?? '',
                    number_format((float) $purchase->purchasing_price, 2),
                    number_format((float) $purchase->purchasing_paid, 2),
                    number_format((float) $purchase->purchasing_due, 2),
                    optional($purchase->created_at)->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 'purchases-' . now()->format('Y-m-d-His') . '.csv', ['Content-Type' => 'text/csv']);
    }

    public function store(PurchaseRequest $request)
    {
        // Log the request data
        // Log::info($request->all());
        // // dd($request->all());
        // return;
        $validatedData = $request->validated();

        // Handle file upload if any
        if ($request->hasFile('document')) {
            $validatedData['document'] = $this->uploadFile($request->file('document'), 'document');
        }

        // Ensure products is a JSON string
        if (is_array($validatedData['products'])) {
            $validatedData['products'] = json_encode($validatedData['products']);
        }

        // A purchase records what was bought from a supplier. The items are
        // typed by hand and are not storefront products, so nothing is looked
        // up in — or written back to — the catalogue.
        $productsArray = json_decode($validatedData['products'], true) ?: [];

        $validatedData['product_ids'] = [];
        $productsData = [];

        foreach ($productsArray as $item) {
            $productsData[] = [
                'product_name'     => trim($item['productName'] ?? ''),
                'product_code'     => trim($item['productCode'] ?? ''),
                'quantity'         => $item['quantity'] ?? 0,
                'price'            => $item['price'] ?? 0,
                'purchasing_price' => $item['purchasing_price'] ?? 0,
            ];
        }

        $validatedData['products_data'] = $productsData;
        $result                         = $this->purchaseService->createPurchase($validatedData);

        // Log::info('Purchase created : ' . json_encode($result));

        return response()->json([
            'message'     => 'Purchase created successfully.',
            'purchase_id' => $result['purchase_id'],
        ], 201);
    }

    public function edit(Request $request, $id)
    {
        $purchase = Purchase::findOrFail($id);

        $purchases = Product::with('product_attributes.attribute_option')->where('purchase_id', $id)
            ->orderBy('id', 'desc')
            ->get();

        $suppliers = Supplier::orderBy('supplier_name')->get();

        // The edit UI is now an inline modal on the index page; it fetches the
        // purchase's products/combinations as JSON.
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'purchase'  => $purchase,
                'purchases' => $purchases,
                'suppliers' => $suppliers,
            ]);
        }

        return Inertia::render('Admin/Purchase/Edit', [
            'suppliers' => $suppliers,
            'purchase' => $purchase,
            'purchases' => $purchases,
        ]);
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

        // Filter by supplier
        if ($request->supplier_filter) {
            $query->where('supplier_id', $request->supplier_filter);
        }

        //  Filter by purchase name / invoice number
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('purchase_name', 'like', '%' . $request->search . '%')
                    ->orWhere('invoice_number', 'like', '%' . $request->search . '%');
            });
        }

        return $query;
    }

    public function show(Request $request, $id)
    {
        // Get purchase with relationships
        $purchase = Purchase::with(['payments', 'supplier'])->findOrFail($id);

        $products = Product::with('product_attributes.attribute_option')
            ->whereIn('id', $purchase->product_ids ?? [])
            ->orderBy('id', 'desc')
            ->get();

        $suppliers = Supplier::orderBy('supplier_name')->get();

        // Format payment history data for single purchase
        $paymentHistory = $this->formatSinglePurchasePaymentHistory($purchase);

        // The view UI is now an inline modal on the index page.
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'purchase'       => $purchase,
                'products'       => $products,
                'paymentHistory' => $paymentHistory,
            ]);
        }

        return Inertia::render('Admin/Purchase/View', [
            'purchase' => $purchase,
            'products' => $products,
            'suppliers' => $suppliers,
            'paymentHistory' => $paymentHistory,
        ]);
    }

/**
 * Format payment history data for a single purchase
 */
    private function formatSinglePurchasePaymentHistory($purchase)
    {
        // Group payments by date
        $paymentsByDate = collect($purchase->payments)
            ->groupBy('payment_date')
            ->map(function ($payments) {
                return $payments->map(function ($payment) {
                    return [
                        'id'             => $payment->id,
                        'payment_amount' => $payment->payment_amount,
                        'payment_method' => $payment->payment_method,
                        'created_at'     => $payment->created_at,
                        'updated_at'     => $payment->updated_at,
                    ];
                });
            });

        // Calculate payment totals
        $totalPaid = collect($purchase->payments)->sum('payment_amount');
        $price     = (float) $purchase->purchasing_price;

        // Determine payment status
        $paymentStatus = match (true) {
            $totalPaid >= $price => 'fully_paid',
            $totalPaid > 0 => 'partially_paid',
            default => 'unpaid',
        };

        return [
            'purchase_info'    => [
                'id'               => $purchase->id,
                'purchase_name'    => $purchase->purchase_name,
                'invoice_number'   => $purchase->invoice_number,
                'purchasing_price' => $price,
                'total_paid'       => $purchase->purchasing_paid,
                'due_amount'       => $purchase->purchasing_due,
                'payment_status'   => $paymentStatus,
                'count_payments'   => $purchase->payments->count(),
            ],
            'supplier_info'    => [
                'supplier_id'     => $purchase->supplier->id,
                'supplier_name'   => $purchase->supplier->supplier_name,
                'company_name'    => $purchase->supplier->company_name,
                'company_phone'   => $purchase->supplier->company_phone,
                'company_address' => $purchase->supplier->company_address,
            ],
            'payments_by_date' => $paymentsByDate,
            'all_payments'     => $purchase->payments->map(function ($payment) {
                return [
                    'id'             => $payment->id,
                    'payment_amount' => $payment->payment_amount,
                    'payment_method' => $payment->payment_method,
                    'payment_date'   => $payment->payment_date,
                    'created_at'     => $payment->created_at,
                    'updated_at'     => $payment->updated_at,
                ];
            }),
        ];
    }

    public function updatePurchase(Request $request)
    {
        // Log::info($request->all());

        $purchaseId = $request->purchase_id;
        $purchase   = Purchase::findOrFail($purchaseId);

        $totalPriceAdjustment = 0; // Track only the difference

        // Handle products without attributes (base products)
        if ($request->has('base') && ! empty($request->base)) {
            foreach ($request->base as $productId => $productData) {
                $product = Product::findOrFail($productId);

                // Calculate old total for this product
                $oldTotal = $product->purchasing_price * $product->quantity;

                // Get new values
                $newPurchasingPrice = $productData['purchasing_price'] ?? $product->purchasing_price;
                $newQuantity        = $productData['quantity'];

                // Calculate new total for this product
                $newTotal = $newPurchasingPrice * $newQuantity;

                // Calculate the difference (adjustment needed)
                $adjustment = $newTotal - $oldTotal;
                $totalPriceAdjustment += $adjustment;

                // Update the product
                $product->update([
                    'quantity'         => $newQuantity,
                    'price'            => $productData['price'],
                    'purchasing_price' => $newPurchasingPrice,
                    'status'           => $productData['status'] ?? $product->status,
                ]);
            }
        }

        // Handle products with attributes (combinations)
        if ($request->has('combinations') && ! empty($request->combinations)) {
            foreach ($request->combinations as $productId => $combinations) {
                foreach ($combinations as $combinationKey => $combinationData) {
                    if (isset($combinationData['attribute_ids']) && is_array($combinationData['attribute_ids'])) {

                        $newQuantity        = $combinationData['quantity'];
                        $newPurchasingPrice = $combinationData['purchasing_price'] ?? 0;

                        // Check if this is a single attribute or multiple attributes
                        if (count($combinationData['attribute_ids']) == 1) {
                            // Single attribute - calculate adjustment for each individual attribute
                            $attributeId      = $combinationData['attribute_ids'][0];
                            $productAttribute = ProductAttribute::find($attributeId);

                            if ($productAttribute) {
                                // Calculate old total for this single attribute
                                $oldTotal = $productAttribute->purchasing_price * $productAttribute->quantity;

                                // Calculate new total for this single attribute
                                $newTotal = $newPurchasingPrice * $newQuantity;

                                // Calculate the difference (adjustment needed)
                                $adjustment = $newTotal - $oldTotal;
                                $totalPriceAdjustment += $adjustment;

                                // Log::info("Single Attribute {$attributeId}: Old total: {$oldTotal}, New total: {$newTotal}, Adjustment: {$adjustment}");

                                // Update the attribute
                                $productAttribute->update([
                                    'quantity'         => $newQuantity,
                                    'price'            => $combinationData['price'] ?? $productAttribute->price,
                                    'purchasing_price' => $newPurchasingPrice,
                                    'status'           => $combinationData['status'] ?? $productAttribute->status,
                                ]);
                            }
                        } else {
                            // Multiple attributes - calculate adjustment only once per combination
                            $firstAttribute = ProductAttribute::whereIn('id', $combinationData['attribute_ids'])
                                ->where('product_id', $productId)
                                ->first();

                            if ($firstAttribute) {
                                // Calculate old total for this combination (using first attribute as reference)
                                $oldTotal = $firstAttribute->purchasing_price * $firstAttribute->quantity;

                                // Calculate new total for this combination
                                $newTotal = $newPurchasingPrice * $newQuantity;

                                // Calculate the difference (adjustment needed) - only once per combination
                                $adjustment = $newTotal - $oldTotal;
                                $totalPriceAdjustment += $adjustment;

                                // Log::info("Multiple Attributes Combination: Old total: {$oldTotal}, New total: {$newTotal}, Adjustment: {$adjustment}");
                            }

                            // Update all attributes in this combination
                            foreach ($combinationData['attribute_ids'] as $attributeId) {
                                $productAttribute = ProductAttribute::find($attributeId);

                                if ($productAttribute) {
                                    $productAttribute->update([
                                        'quantity'         => $newQuantity,
                                        'price'            => $combinationData['price'] ?? $productAttribute->price,
                                        'purchasing_price' => $newPurchasingPrice,
                                        'status'           => $combinationData['status'] ?? $productAttribute->status,
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Update purchase totals with only the adjustment
        $newPurchasingPrice = $purchase->purchasing_price + $totalPriceAdjustment;
        $newPurchasingDue   = $purchase->purchasing_due + $totalPriceAdjustment;

        $purchase->update([
            'purchasing_price' => max(0, $newPurchasingPrice),
            'purchasing_due'   => max(0, $newPurchasingDue),
        ]);

        $adjustmentMessage = $totalPriceAdjustment >= 0 ?
        'increased by ' . number_format($totalPriceAdjustment, 2) :
        'decreased by ' . number_format(abs($totalPriceAdjustment), 2);

        $message = "Purchase updated successfully. Total purchasing price {$adjustmentMessage}. New total: " . number_format($newPurchasingPrice, 2);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }

    /**
     * Toggle a purchase between cancelled and active.
     */
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:active,cancelled',
        ]);

        $purchase = Purchase::findOrFail($id);
        $purchase->update(['status' => $data['status']]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'status' => $purchase->status]);
        }

        return back()->with('success', 'Purchase status updated');
    }

    public function destroy($id)
    {
        Purchase::findOrFail($id)->delete();

        // DB::transaction(function () use ($id) {
        //     // Update products associated with the purchase to remove the purchase_id
        //     $product = Product::where('purchase_id', $id);
        //     // delete() product
        //     $product->delete();

        //     // Delete the purchase record
        // });
        return response()->json(['Deleted'], 200);
        // return redirect()->route('admin.purchase.index')->with('success', 'Purchase item deleted');
    }

    public function productStore(Request $request)
    {
        // Log::info($request->all());
        return $request->all();
        // $purchase_id = $request->purchase_id;
        // foreach ($request->name as $index => $name) {
        //     PurchaseGroup::create([
        //         'purchase_id' => $purchase_id,
        //         'name' => $name,
        //         'product_code' => $request->product_code[$index],
        //         'quantity' => $request->quantity[$index],
        //         'price' => $request->price[$index],
        //         'total' => $request->total[$index],
        //     ]);
        // }

        return response()->json(['message' => 'Products added successfully']);
    }

    public function productUpdate(Request $request)
    {
        PurchaseGroup::query()->delete();

        $purchase_id = $request->purchase_id;

        foreach ($request->name as $index => $name) {
            $productData = [
                'name'         => $name,
                'product_code' => $request->product_code[$index],
                'quantity'     => $request->quantity[$index],
                'price'        => $request->price[$index],
                'total'        => $request->total[$index],
            ];

            // Check if there's an ID in the request to determine if it's an update or create action
            if (isset($request->id[$index])) {
                // Update existing product if ID is provided
                $product = PurchaseGroup::where('id', $request->id[$index])
                    ->where('purchase_id', $purchase_id)
                    ->first();

                if ($product) {
                    $product->update($productData);
                }
            } else {
                // Create a new product if no ID is provided
                PurchaseGroup::create(array_merge($productData, ['purchase_id' => $purchase_id]));
            }
        }

        return response()->json(['message' => 'Products updated successfully']);
    }

    public function productDelete(Request $request)
    {
        try {
            // Find the product by ID
            $data = PurchaseGroup::findOrFail($request->product_id);

            // Delete the product
            $data->delete();

            // Return success message
            return response()->json([
                'message' => 'Data deleted successfully.',
            ]);
        } catch (\Exception $e) {
            // Handle any errors, such as database errors or product not found
            return response()->json([
                'message' => 'There was an error deleting the product.',
            ], 500); // 500 is the status code for server errors
        }
    }

    public function formatProductData(array $rawProduct): array
    {
        // Split variant string into individual attributes
        $variantParts = explode(' - ', $rawProduct['variant']);

        // Create structured attributes array
        $attributes   = [];
        $attributeIds = explode(',', $rawProduct['attributeIds']);
        $optionIds    = explode(',', $rawProduct['optionIds']);
        $quantity     = explode(',', $rawProduct['quantity']);
        $price        = explode(',', $rawProduct['price']);

        foreach ($variantParts as $index => $part) {
            [$name, $value] = explode(': ', $part);
            $attributes[]   = [
                'name'         => $name,
                'value'        => $value,
                'attribute_id' => $attributeIds[$index] ?? null,
                'option_id'    => $optionIds[$index] ?? null,
                'price'        => $rawProduct['price'],
                'quantity'     => $rawProduct['quantity'],
            ];
        }

        // Return structured format
        return [
            'product_id'        => (int) $rawProduct['productId'],
            'attributes'        => $attributes,
            'raw_variant'       => $rawProduct['variant'],   // Keep original for reference
            'formatted_variant' => json_encode($attributes), // Store as JSON
        ];
    }

    public function formatPurchaseProducts(string $productsJson): array
    {
        $products = json_decode($productsJson, true);
        return array_map([$this, 'formatProductData'], $products);
    }

    public function pay(Request $request)
    {
        // Log::info('Payment request received');
        // Log::info('Request all: ', $request->all());

        $validatedData = $request->validate([
            'purchase_id'    => 'required|exists:purchases,id',
            'payment_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:255',

        ]);

        // Log::info('Validated data: ', $validatedData);
        try {
            $purchase = Purchase::findOrFail($validatedData['purchase_id']);
            DB::transaction(function () use ($validatedData, $purchase) {
                $purchase->update([
                    'purchasing_due'  => $purchase->purchasing_due - $validatedData['payment_amount'],
                    'purchasing_paid' => $purchase->purchasing_paid + $validatedData['payment_amount'],
                ]);
                Payment::create([
                    'purchase_id'    => $validatedData['purchase_id'],
                    'payment_amount' => $validatedData['payment_amount'],
                    'payment_method' => $validatedData['payment_method'],
                    'payment_date'   => Carbon::now()->toDateTimeString(),
                ]);
            });

            return response()->json([
                'message' => 'Payment recorded successfully.',
                'success' => true,
            ], 201);
        } catch (\Exception $e) {
            // Log::error('Error creating payment: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error recording payment. Please try again.'], 500);
        }
    }

    /**
     * What is owed to each supplier, and what has been paid.
     *
     * Suppliers are paginated rather than purchases: grouping a page of
     * purchases by supplier split a supplier across pages and made their totals
     * the sum of one page rather than of everything they are owed.
     */
    public function paymentHistory(Request $request)
    {
        $filtered = $this->paymentHistoryQuery($request);

        // Totals cover the whole filtered set, not the visible page.
        $purchased = (float) (clone $filtered)->sum('purchasing_price');
        $paid = (float) (clone $filtered)->sum('purchasing_paid');

        $summary = [
            'purchased'   => $purchased,
            'paid'        => $paid,
            'outstanding' => max(0, $purchased - $paid),
            'purchases'   => (clone $filtered)->count(),
            'suppliers'   => (clone $filtered)->distinct()->count('supplier_id'),
            'overdue'     => (clone $filtered)->whereRaw('purchasing_paid < purchasing_price')->count(),
        ];

        $supplierIds = (clone $filtered)->distinct()->pluck('supplier_id')->filter();

        $suppliers = Supplier::whereIn('id', $supplierIds)
            ->orderBy('supplier_name')
            ->paginate(10)
            ->withQueryString();

        // One query for every purchase on this page of suppliers.
        $bySupplier = (clone $filtered)
            ->with('payments')
            ->whereIn('supplier_id', $suppliers->pluck('id'))
            ->latest()
            ->get()
            ->groupBy('supplier_id');

        $suppliers->getCollection()->transform(function (Supplier $supplier) use ($bySupplier) {
            $purchases = collect($bySupplier->get($supplier->id, collect()));

            $supplierPurchased = (float) $purchases->sum('purchasing_price');
            $supplierPaid = (float) $purchases->sum('purchasing_paid');

            return [
                'id'            => $supplier->id,
                'supplier_name' => $supplier->supplier_name,
                'company_name'  => $supplier->company_name,
                'company_phone' => $supplier->company_phone,
                'purchased'     => $supplierPurchased,
                'paid'          => $supplierPaid,
                'outstanding'   => max(0, $supplierPurchased - $supplierPaid),
                'purchases'     => $purchases->map(fn (Purchase $purchase) => $this->paymentHistoryRow($purchase))->values(),
            ];
        });

        return Inertia::render('Admin/Purchase/PaymentHistory', [
            'suppliers'      => $suppliers,
            'summary'        => $summary,
            'currentFilters' => $request->only(['supplier_name', 'start_date', 'end_date', 'payment_status']),
        ]);
    }

    /** The filters shared by the page and its export. */
    private function paymentHistoryQuery(Request $request)
    {
        return Purchase::query()
            ->when($request->filled('supplier_name'), function ($q) use ($request) {
                $q->whereHas('supplier', fn ($s) => $s->where('supplier_name', 'like', '%' . $request->supplier_name . '%'));
            })
            ->when($request->filled('start_date'), fn ($q) => $q->whereDate('purchase_date', '>=', $request->start_date))
            ->when($request->filled('end_date'), fn ($q) => $q->whereDate('purchase_date', '<=', $request->end_date))
            ->when($request->filled('payment_status'), function ($q) use ($request) {
                match ($request->payment_status) {
                    'fully_paid'     => $q->whereRaw('purchasing_paid >= purchasing_price'),
                    'partially_paid' => $q->where('purchasing_paid', '>', 0)->whereRaw('purchasing_paid < purchasing_price'),
                    'unpaid'         => $q->where('purchasing_paid', '<=', 0),
                    default          => $q,
                };
            });
    }

    /** @return array<string, mixed> */
    private function paymentHistoryRow(Purchase $purchase): array
    {
        $price = (float) $purchase->purchasing_price;
        $paid = (float) $purchase->purchasing_paid;

        return [
            'id'               => $purchase->id,
            'purchase_name'    => $purchase->purchase_name,
            'invoice_number'   => $purchase->invoice_number,
            'purchase_date'    => optional($purchase->purchase_date)->format('Y-m-d') ?? $purchase->purchase_date,
            'purchasing_price' => $price,
            'total_paid'       => $paid,
            // Derived rather than read from purchasing_due, which can drift out
            // of step with the two figures it is supposed to sit between.
            'due_amount'       => max(0, $price - $paid),
            'payment_status'   => match (true) {
                $paid >= $price && $price > 0 => 'fully_paid',
                $paid > 0                     => 'partially_paid',
                default                       => 'unpaid',
            },
            'payments'         => $purchase->payments
                ->sortByDesc('payment_date')
                ->map(fn ($payment) => [
                    'id'             => $payment->id,
                    'payment_date'   => $payment->payment_date,
                    'payment_amount' => (float) $payment->payment_amount,
                    'payment_method' => $payment->payment_method,
                ])->values(),
        ];
    }
}
