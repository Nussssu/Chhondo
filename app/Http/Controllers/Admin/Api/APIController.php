<?php
namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Http\Requests\Admin\CouriarApiSetting\CourierApiSettingRequest;
use App\Models\ApiToken;
use App\Models\BusinessSetting;
use App\Models\CourierSetting;
use App\Models\Order;
use App\Models\SiteInfo;
use App\Services\Admin\CouriarApiSetting\CouriarApiSettingServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\Courier\SteadfastCourier;

class APIController extends Controller
{
    protected $courierApiSettingService;
    protected $businessSetting;

    public function __construct(CouriarApiSettingServiceInterface $courierApiSettingService, BusinessSetting $businessSetting)
    {
        $this->courierApiSettingService = $courierApiSettingService;
        $this->businessSetting          = $businessSetting;
    }

    public function index()
    {
        $courierSetting = $this->courierApiSettingService->get();
        $patho          = ApiToken::first();

        return Inertia::render('Admin/Api/CourierApi', [
            'courierSetting' => $courierSetting,
            'patho'          => $patho,
            'steadfastWebhook' => [
                'enabled'  => (bool) optional(SiteInfo::first())->steadfast_webhook,
                'url'      => url('/staedfast-webhook'),
                'tokenSet' => filled(config('services.steadfast.webhook_token')),
            ],
        ]);
    }

    /**
     * Accept or ignore Steadfast's delivery status updates. Saved on its own —
     * it used to be a checkbox in Store settings › General, where a ticked box
     * failed validation ("on" is not a boolean) and an unticked one was never
     * sent, so it could be neither switched on nor off.
     */
    public function updateSteadfastWebhook(Request $request)
    {
        $enabled = (bool) $request->validate(['enabled' => 'required|boolean'])['enabled'];

        SiteInfo::updateOrCreate(['id' => 1], ['steadfast_webhook' => $enabled]);

        return redirect()->back()->with('success', $enabled
            ? 'Steadfast delivery updates are on.'
            : 'Steadfast delivery updates are off.');
    }

    public function storeOrUpdateCourier(CourierApiSettingRequest $request)
    {

        try {
            Cache::forget('courier_settings');
            Cache::forget('courier_settings_missing_logged');

            $this->courierApiSettingService->storeOrUpdate($request->validated());
            return redirect()->back()->with('success', 'Courier API setting updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    public function smsApi()
    {
        $sms = app(\App\Services\Sms\ReveSmsService::class);
        $config = $sms->config();

        return Inertia::render('Admin/Api/SmsApi', [
            'config' => [
                // The secret is never sent back to the browser; the field shows
                // whether one is saved and only overwrites it when refilled.
                'api_key'       => $config['api_key'] ?? '',
                'has_secret'    => filled($config['secret_key'] ?? null),
                'sender_id'     => $config['sender_id'] ?? '',
                'client_id'     => $config['client_id'] ?? '',
                'base_url'      => $config['base_url'] ?? \App\Services\Sms\ReveSmsService::DEFAULT_BASE_URL,
                'order_message' => $config['order_message'] ?? \App\Services\Sms\OrderSmsNotifier::DEFAULT_TEMPLATE,
                'is_active'     => (bool) ($config['is_active'] ?? false),
            ],
            'defaultBaseUrl'  => \App\Services\Sms\ReveSmsService::DEFAULT_BASE_URL,
            'defaultTemplate' => \App\Services\Sms\OrderSmsNotifier::DEFAULT_TEMPLATE,
            'placeholders'    => \App\Services\Sms\OrderSmsNotifier::PLACEHOLDERS,
        ]);
    }

    public function storeOrUpdateSms(Request $request)
    {
        $data = $request->validate([
            'api_key'       => 'required|string|max:191',
            // Blank on an edit means "keep the saved one".
            'secret_key'    => 'nullable|string|max:191',
            'sender_id'     => 'required|string|max:64',
            'client_id'     => 'nullable|string|max:64',
            'base_url'      => 'required|url|max:255',
            'order_message' => 'required|string|max:1000',
            'is_active'     => 'boolean',
        ], [
            'api_key.required'       => 'The API key is required.',
            'sender_id.required'     => 'The sender ID is required.',
            'base_url.url'           => 'The API URL must be a full URL, e.g. https://smpp.revesms.com:7790',
            'order_message.required' => 'Write the message customers get when they order.',
        ]);

        $existing = app(\App\Services\Sms\ReveSmsService::class)->config();

        $values = [
            'api_key'       => $data['api_key'],
            'secret_key'    => filled($data['secret_key'] ?? null)
                ? $data['secret_key']
                : ($existing['secret_key'] ?? ''),
            'sender_id'     => $data['sender_id'],
            'client_id'     => $data['client_id'] ?? '',
            'base_url'      => rtrim($data['base_url'], '/'),
            'order_message' => $data['order_message'],
        ];

        \App\Models\BusinessSetting::updateOrCreate(
            [
                'key_name'      => \App\Services\Sms\ReveSmsService::SETTING_KEY,
                'settings_type' => \App\Services\Sms\ReveSmsService::SETTING_TYPE,
            ],
            [
                'values'    => $values,
                'is_active' => $request->boolean('is_active') ? 1 : 0,
            ]
        );

        return redirect()->back()->with('success', 'SMS settings saved.');
    }

    /** Remaining credit on the REVE account. */
    public function getBalance()
    {
        return response()->json(app(\App\Services\Sms\ReveSmsService::class)->balance());
    }

    /** Send one message to a number the operator types, to prove the setup works. */
    public function sendTestSms(Request $request)
    {
        $data = $request->validate([
            'phone'   => 'required|string|max:20',
            'message' => 'nullable|string|max:500',
        ]);

        $result = app(\App\Services\Sms\ReveSmsService::class)->send(
            $data['phone'],
            ($data['message'] ?? null) ?: 'Test message from ' . config('app.name') . '.'
        );

        return response()->json($result);
    }

    /* ------------------------------------------------- payment gateway -- */

    public function paymentApi()
    {
        $gateway = app(\App\Services\Payment\SslCommerzService::class);
        $config  = $gateway->config();

        return Inertia::render('Admin/Api/PaymentApi', [
            'config' => [
                'store_id'     => $config['store_id'] ?? '',
                // The password is never sent to the browser.
                'has_password' => filled($config['store_password'] ?? null),
                'sandbox'      => (bool) ($config['sandbox'] ?? true),
                'is_active'    => (bool) ($config['is_active'] ?? false),
            ],
            'callbacks' => [
                'success' => route('payment.sslcommerz.success'),
                'fail'    => route('payment.sslcommerz.fail'),
                'cancel'  => route('payment.sslcommerz.cancel'),
                'ipn'     => route('payment.sslcommerz.ipn'),
            ],
        ]);
    }

    public function storeOrUpdatePayment(Request $request)
    {
        $data = $request->validate([
            'store_id'       => 'required|string|max:191',
            // Blank on an edit means "keep the saved one".
            'store_password' => 'nullable|string|max:191',
            'sandbox'        => 'boolean',
            'is_active'      => 'boolean',
        ], [
            'store_id.required' => 'The store ID is required.',
        ]);

        $existing = app(\App\Services\Payment\SslCommerzService::class)->config();

        $password = filled($data['store_password'] ?? null)
            ? $data['store_password']
            : ($existing['store_password'] ?? '');

        if (blank($password)) {
            return back()->withErrors(['store_password' => 'The store password is required.']);
        }

        \App\Models\BusinessSetting::updateOrCreate(
            [
                'key_name'      => \App\Services\Payment\SslCommerzService::SETTING_KEY,
                'settings_type' => \App\Services\Payment\SslCommerzService::SETTING_TYPE,
            ],
            [
                'values' => [
                    'store_id'       => $data['store_id'],
                    'store_password' => $password,
                    'sandbox'        => $request->boolean('sandbox'),
                ],
                'is_active' => $request->boolean('is_active') ? 1 : 0,
            ]
        );

        return redirect()->back()->with('success', 'Payment gateway settings saved.');
    }

    /* ----------------------------------------------------------- bKash -- */

    public function bkashApi()
    {
        $config = app(\App\Services\Payment\BkashService::class)->config();

        return Inertia::render('Admin/Api/BkashApi', [
            'config' => [
                'username'   => $config['username'] ?? '',
                'app_key'    => $config['app_key'] ?? '',
                // The secrets are never sent to the browser.
                'has_password'   => filled($config['password'] ?? null),
                'has_app_secret' => filled($config['app_secret'] ?? null),
                'sandbox'    => (bool) ($config['sandbox'] ?? true),
                'is_active'  => (bool) ($config['is_active'] ?? false),
            ],
            'sandboxCredentials' => \App\Services\Payment\BkashService::SANDBOX_CREDENTIALS,
            'callbackUrl'        => route('payment.bkash.callback'),
        ]);
    }

    public function storeOrUpdateBkash(Request $request)
    {
        $data = $request->validate([
            'username'   => 'required|string|max:191',
            'app_key'    => 'required|string|max:191',
            // Blank on an edit means "keep the saved one".
            'password'   => 'nullable|string|max:191',
            'app_secret' => 'nullable|string|max:191',
            'sandbox'    => 'boolean',
            'is_active'  => 'boolean',
        ], [
            'username.required' => 'The bKash username is required.',
            'app_key.required'  => 'The app key is required.',
        ]);

        $existing = app(\App\Services\Payment\BkashService::class)->config();

        $values = [
            'username' => trim($data['username']),
            'app_key'  => trim($data['app_key']),
            'sandbox'  => $request->boolean('sandbox'),
        ];

        $missing = [];

        foreach (['password' => 'The bKash password is required.', 'app_secret' => 'The app secret is required.'] as $field => $message) {
            $values[$field] = filled($data[$field] ?? null) ? trim($data[$field]) : ($existing[$field] ?? '');

            if (blank($values[$field])) {
                $missing[$field] = $message;
            }
        }

        if ($missing) {
            return back()->withErrors($missing);
        }

        \App\Models\BusinessSetting::updateOrCreate(
            [
                'key_name'      => \App\Services\Payment\BkashService::SETTING_KEY,
                'settings_type' => \App\Services\Payment\BkashService::SETTING_TYPE,
            ],
            [
                'values'    => $values,
                'is_active' => $request->boolean('is_active') ? 1 : 0,
            ]
        );

        return redirect()->back()->with('success', 'bKash settings saved.');
    }

    /** Ask bKash for a token with the saved credentials, to prove they work. */
    public function testBkash()
    {
        $gateway = app(\App\Services\Payment\BkashService::class);
        $result = $gateway->token(fresh: true);

        return response()->json([
            'ok'      => $result['ok'],
            'message' => $result['ok']
                ? 'Connected to bKash ' . ($gateway->isSandbox() ? 'sandbox' : 'live') . '.'
                : $result['message'],
        ]);
    }

    public function apiToken()
    {
        $patho = ApiToken::first();
        return Inertia::render('Admin/Api/Index', [
            'patho' => $patho,
        ]);
    }

    /**
     * Generate an API Token from the Pathao Hermes API.
     */
    public function generateApiToken(Request $request)
    {

        // return $request;
        $this->courierApiSettingService->generateApiToken($request);

        return redirect()->back()->with('success', 'API Token generated successfully.');
    }

    public function sendSteadfast(Request $request, $id)
    {
        try {
            $order = Order::find($id);

            if (! $order) {
                return $this->courierResponse($request, false, 'Order not found.', 404);
            }

            $settings = CourierSetting::first();
            if (! $settings || $settings->steadfast !== 'yes') {
                return $this->courierResponse($request, false, 'Steadfast is not enabled under Integrations.', 422);
            }

            // Sending twice creates a second consignment at the courier, and
            // the customer is charged COD twice. Re-sending must be deliberate.
            if ($order->consignment_id && ! $request->boolean('force')) {
                return $this->courierResponse(
                    $request,
                    false,
                    'This order was already sent to Steadfast (consignment ' . $order->consignment_id . ').',
                    409
                );
            }

            // The courier rejects an order it cannot deliver; catching it here
            // gives the operator a useful message instead of an API error.
            foreach (['phone_number' => 'a phone number', 'address' => 'a delivery address'] as $field => $label) {
                if (blank($order->{$field})) {
                    return $this->courierResponse($request, false, "This order needs {$label} before it can be sent.", 422);
                }
            }

            // The courier SDK is a separate composer package. If it is missing,
            // say so plainly instead of surfacing a class-not-found error.
            if (! class_exists(SteadfastCourier::class)) {
                return $this->courierResponse(
                    $request,
                    false,
                    'The Steadfast courier package is not installed on this server, so orders cannot be dispatched. Ask your developer to reinstall it.',
                    503
                );
            }

            $orderData = $this->courierApiSettingService->prepareOrderData($order);
            $data = $this->courierApiSettingService->sendOrderToCourier($orderData);

            if (is_array($data) && isset($data['status']) && $data['status'] === 'error') {
                return $this->courierResponse($request, false, $data['message'], 422);
            }

            return $this->courierResponse(
                $request,
                true,
                'Order sent to Steadfast successfully.',
                200,
                $order->fresh()->only(['consignment_id', 'tracking_code', 'couriar_status', 'couriar_name'])
            );
        } catch (\Throwable $e) {
            Log::error('[Steadfast Single] ' . $e->getMessage());

            return $this->courierResponse($request, false, 'An unexpected error occurred while sending the order to Steadfast.', 500);
        }
    }

    /**
     * The send action is called from the order table over AJAX and from older
     * form posts, so it answers in whichever form the caller expects.
     */
    private function courierResponse(Request $request, bool $ok, string $message, int $status = 200, array $extra = [])
    {
        if ($request->expectsJson()) {
            return response()->json(['success' => $ok, 'message' => $message] + $extra, $ok ? 200 : $status);
        }

        return redirect()->back()->with($ok ? 'success' : 'error', $message);
    }

    public function bulkSendSteadfast(Request $request)
    {
        $orderIds = $request->input('ids');

        if (empty($orderIds)) {
            return response()->json(['success' => false, 'message' => 'No orders selected.']);
        }

        // Fetch courier API credentials
        $courierSetting = CourierSetting::first();
        if (empty($courierSetting->api_key) || empty($courierSetting->secret_key)) {
            return response()->json(['success' => false, 'message' => 'Please configure your Steadfast API credentials first.']);
        }

        // Fetch orders and prepare payload
        $orders = Order::whereIn('id', $orderIds)->take(500)->get();
        if ($orders->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No valid orders found.']);
        }

        $data = [];
        foreach ($orders as $order) {
            $data[] = [
                'invoice'           => $order->invoice_number ?? $order->id,
                'recipient_name'    => $order->customer_name ?? 'N/A',
                'recipient_address' => $order->address ?? 'N/A',
                'recipient_phone'   => $order->courierPhone(),
                'cod_amount'        => $order->courierCollectAmount(),
                'note'              => $order->courierNote($order->note ?? 'Handle with care'),
            ];
        }
        $data=json_encode($data);
        Log::info('[Steadfast Bulk] Sending payload: ' . $data);
        try {
            // Make bulk API call
            $response = Http::withHeaders([
                'Api-Key'      => $courierSetting->api_key,
                'Secret-Key'   => $courierSetting->secret_key,
                'Content-Type' => 'application/json',
            ])->post(rtrim((string) config('steadfast-courier.base_url'), '/') . '/create_order/bulk-order', [
                'data' => $data,
            ]);

            $responseBody = $response->json();
            Log::info('[Steadfast Bulk] Raw response: ' . json_encode($responseBody));
            // Ensure valid structure
            $consignments = $responseBody['data'] ?? [];

            if (is_array($consignments) && count($consignments)) {
                foreach ($consignments as $consignment) {
                    // Skip invalid responses
                    if (! isset($consignment['invoice'])) {
                        continue;
                    }

                    // Skip rows Steadfast rejected (e.g. duplicate invoice) so we don't wipe a good consignment_id
                    if (empty($consignment['consignment_id'])) {
                        continue;
                    }

                    $order = Order::where('invoice_number', $consignment['invoice'])->first();
                    Log::info('[Steadfast Bulk] Lookup invoice=' . $consignment['invoice'] . ' found order=' . ($order ? $order->id : 'NULL'));
                    if ($order) {
                        $courierStatus = $consignment['status'] ?? 'pending';

                        // Fetch delivery status in a nested try/catch so a failure here
                        // doesn't abort the order update below
                        try {
                            $deliveryStatusResponse = SteadfastCourier::checkDeliveryStatusByConsignmentId($consignment['consignment_id']);
                            if (isset($deliveryStatusResponse['delivery_status'])) {
                                $courierStatus = $deliveryStatusResponse['delivery_status'];
                            }
                        } catch (\Throwable $e) {
                            Log::warning('[Steadfast Bulk] Delivery status check failed for consignment ' . $consignment['consignment_id'] . ': ' . $e->getMessage());
                        }

                        $order->update([
                            'consignment_id' => $consignment['consignment_id'] ?? null,
                            'tracking_code'  => $consignment['tracking_link']
                                ?? (! empty($consignment['tracking_code'])
                                    ? 'https://steadfast.com.bd/t/' . $consignment['tracking_code']
                                    : null),
                            'couriar_status' => $courierStatus,
                            'couriar_name'   => 'steadfast',
                        ]);
                    }
                }

                return response()->json([
                    'success' => true,
                    'data'    => $consignments,
                    'message' => 'Orders sent and updated successfully.',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid or empty response from Steadfast API.',
                'data'    => $responseBody,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while sending orders.',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    public function getArea()
    {
        $areas = $this->courierApiSettingService->getArea();

        // Return the unique areas
        return response()->json($areas);
    }

    public function getCity(Request $request)
    {
        return $this->courierApiSettingService->getCity($request);
    }

    public function sendRedx($id)
    {
        try {
            // Fetch the order from the database
            $order = Order::findOrFail($id);

            $data = $this->playload($order);

            // Fetch the token from CourierSetting
            $response = $this->headers($data);

            // Check the response
            if ($response->successful()) {
                // Update the order with the consignment ID
                $order->update([
                    'consignment_id' => $response->json()['tracking_id'],
                ]);
                return back()->with('success', 'Parcel sent to RedX successfully.');
            } else {

                return back()->with('error', 'An error occurred while sending the parcel to RedX: ' . $response->json()['message']);
            }
        } catch (\Exception $e) {

            return back()->with('error', 'An error occurred while sending the parcel to RedX: ' . $e->getMessage());
        }
    }

    private function playload($order)
    {
        $data = [
            "customer_name"          => $order->customer_name,
            "customer_phone"         => $order->courierPhone(),
            "delivery_area"          => $order->area_name,
            "delivery_area_id"       => $order->area_id,
            "customer_address"       => $order->address,
            // "merchant_invoice_id" => $order->invoice_number,
            // Was the goods alone, so the delivery charge was never collected.
            "cash_collection_amount" => $order->courierCollectAmount(),
            "parcel_weight"          => 500, // Adjust as needed
            "instruction"            => $order->courier_note ?? "",
            "value"                  => $order->total_price,
            "is_closed_box"          => false,

        ];

        foreach ($data as $key => $value) {
            if (is_null($value)) {
                throw new \Exception("Missing required field: {$key}");
            }
        }

        return $data;
    }

    private function headers($data)
    {

        $corir = CourierSetting::first();
        $token = $corir->redx_access_token;

        if (! $corir || ! $corir->redx_access_token) {
            throw new \Exception('RedX access token is missing in CourierSetting.');
        }

        // Send the request to the RedX API
        $response = Http::withHeaders([
            'API-ACCESS-TOKEN' => 'Bearer ' . $token,
            'Content-Type'     => 'application/json',
        ])->post('https://openapi.redx.com.bd/v1.0.0-beta/parcel', $data);

        return $response;
    }

    public function sendBulkRedx(Request $request)
    {
        Log::info('Bulk RedX request: ' . json_encode($request->all()));

        $orderIds = $request->input('ids');

        if (empty($orderIds)) {
            return response()->json(['success' => false, 'message' => 'No orders selected.']);
        }

        $results = []; // Collect results for each order

        foreach ($orderIds as $id) {
            try {

                $order     = Order::findOrFail($id);
                $data      = $this->playload($order);
                $response  = $this->headers($data);
                $results[] = ['order_id' => $id, 'status' => 'success'];
                // oder update consignment_id
                $order->update([
                    'consignment_id' => $response->json()['tracking_id'] ?? null,

                ]);
            } catch (\Exception $e) {
                Log::error("Error sending order {$id} to RedX: " . $e->getMessage());
                $results[] = ['order_id' => $id, 'status' => 'error', 'message' => $e->getMessage()];
            }
        }

        return response()->json(['success' => true, 'message' => 'Orders processed.', 'results' => $results]);
    }

    public function sendPathao($id)
    {

        try {
            $order = Order::where('id', $id)->with('items')->first();

            $item_quantity = $order->items->sum('quantity');

            // Pass the order data as an array to the courier service
            $response = $this->courierApiSettingService->sendOrderToPathaoCourier($order, $item_quantity);

            if (is_string($response)) {
                $response = json_decode($response);
            } elseif (is_array($response)) {
                $response = json_decode(json_encode($response));
            }

            // Check if the response is successful and properly formatted
            if (isset($response->code) && $response->code == 200) {
                if (isset($response->data->consignment_id)) {
                    $consignmentId = $response->data->consignment_id;

                    // Update the order with the consignment ID and order status
                    $order->update([
                        'consignment_id' => $consignmentId,
                        'order_status'   => 'Pending',
                    ]);

                    // Return a success message
                    return redirect()->back()->with('success', 'Order sent to Pathao successfully.');
                } else {
                    return redirect()->back()->with('error', 'Consignment ID is missing in the response.');
                }
            } else {
                return redirect()->back()->with('error', 'Failed to send the order to Pathao: ' . ($response->message ?? 'Unknown error.'));
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    public function sendBulkPathao(Request $request)
    {
        // check request addres alt list 11 chater  and 11 chater 2
        $request->validate([
            'orders' => 'required|array|min:1',

        ]);

        try {
            $orders = Order::whereIn('id', $request->orders)->with('items')->get();

            if ($orders->isEmpty()) {
                return response()->json(['error' => 'No orders found'], 404);
            }

            $acesstoken = ApiToken::first();

            if (! $acesstoken || ! $acesstoken->access_token) {
                throw new \Exception('Access token not found in the database');
            }

            $bulkOrders = $orders->map(function ($order) use ($acesstoken) {
                return [
                    'store_id'            => $acesstoken->StoreId,
                    'merchant_order_id'   => $order->id,
                    'recipient_name'      => $order->customer_name,
                    'recipient_phone'     => $order->courierPhone(),
                    'recipient_address'   => $order->address,
                    'recipient_city'      => $order->city_id,
                    'recipient_zone'      => $order->zone_id,
                    'recipient_area'      => $order->area_id ?? null,
                    'delivery_type'       => 48,
                    'item_type'           => 2,
                    'special_instruction' => $order->courier_note ?? 'Handle with care',
                    'item_quantity'       => $order->items->sum('quantity'),
                    'item_weight'         => '0.5',
                    // Was goods + shipping_price, which is 0 on most orders —
                    // the delivery charge lives in delivery_charge.
                    'amount_to_collect'   => $order->courierCollectAmount(),
                    'item_description'    => 'Various items',
                ];
            })->toArray();

            $response = $this->courierApiSettingService->sendBulkOrders($bulkOrders, $acesstoken->access_token);
            // Log::info($response);
            return back()->with('success', 'Orders sent to Pathao successfully.');
        } catch (\Exception $e) {
            Log::error('Error sending bulk orders to Pathao: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while sending orders to Pathao.');
        }
    }

}
