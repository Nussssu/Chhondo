<?php

namespace App\Services\Payment;

use App\Models\BusinessSetting;
use App\Models\Order;
use App\Models\SiteInfo;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * SSLCommerz — the hosted checkout gateway.
 *
 * The customer is sent to SSLCommerz's own page, pays there, and is redirected
 * back. The redirect carries a status, but that status is not trusted: the
 * order is only marked paid after the transaction is confirmed straight from
 * SSLCommerz's validation API and the amount is checked against the order.
 */
class SslCommerzService
{
    public const SETTING_KEY = 'sslcommerz';
    public const SETTING_TYPE = 'payment_config';

    private const SANDBOX_HOST = 'https://sandbox.sslcommerz.com';
    private const LIVE_HOST = 'https://securepay.sslcommerz.com';

    /** How far the paid amount may differ from the order total, for rounding. */
    private const AMOUNT_TOLERANCE = 1.0;

    public function config(): array
    {
        $row = BusinessSetting::where('settings_type', self::SETTING_TYPE)
            ->where('key_name', self::SETTING_KEY)
            ->first();

        if (! $row) {
            return [];
        }

        $values = is_array($row->values) ? $row->values : (array) json_decode((string) $row->values, true);

        return $values + ['is_active' => (int) $row->is_active === 1];
    }

    public function isConfigured(): bool
    {
        $c = $this->config();

        return filled($c['store_id'] ?? null) && filled($c['store_password'] ?? null);
    }

    /** Whether customers may choose to pay online. */
    public function isEnabled(): bool
    {
        return $this->isConfigured() && ($this->config()['is_active'] ?? false);
    }

    public function isSandbox(): bool
    {
        return (bool) ($this->config()['sandbox'] ?? true);
    }

    private function host(): string
    {
        return $this->isSandbox() ? self::SANDBOX_HOST : self::LIVE_HOST;
    }

    /**
     * Open a payment session and return the URL to send the customer to.
     *
     * @return array{ok: bool, url: ?string, message: string}
     */
    public function createSession(Order $order): array
    {
        if (! $this->isEnabled()) {
            return ['ok' => false, 'url' => null, 'message' => 'Online payment is switched off.'];
        }

        $c = $this->config();
        $amount = $this->orderTotal($order);

        if ($amount <= 0) {
            return ['ok' => false, 'url' => null, 'message' => 'This order has nothing to pay.'];
        }

        $payload = [
            'store_id'    => $c['store_id'],
            'store_passwd' => $c['store_password'],
            'total_amount' => number_format($amount, 2, '.', ''),
            'currency'    => 'BDT',
            // The invoice number is already unique and is what staff search by,
            // so it doubles as the gateway's transaction id.
            'tran_id'     => $order->invoice_number,

            'success_url' => route('payment.sslcommerz.success'),
            'fail_url'    => route('payment.sslcommerz.fail'),
            'cancel_url'  => route('payment.sslcommerz.cancel'),
            'ipn_url'     => route('payment.sslcommerz.ipn'),

            'cus_name'    => $order->customer_name ?: 'Customer',
            'cus_email'   => $order->email ?: 'customer@example.com',
            'cus_phone'   => $order->phone_number,
            'cus_add1'    => $order->address ?: 'N/A',
            'cus_city'    => 'Dhaka',
            'cus_country' => 'Bangladesh',

            // SSLCommerz rejects the request outright if the shipping block is
            // missing whenever shipping_method is not "NO".
            'shipping_method' => 'NO',
            'product_name'    => 'Order ' . $order->invoice_number,
            'product_category' => 'Clothing',
            'product_profile' => 'physical-goods',
        ];

        try {
            $response = Http::asForm()
                ->timeout(30)
                ->post($this->host() . '/gwprocess/v4/api.php', $payload);
        } catch (Throwable $e) {
            Log::error('SSLCommerz session request failed: ' . $e->getMessage());

            return ['ok' => false, 'url' => null, 'message' => 'Could not reach the payment gateway.'];
        }

        $body = $response->json();

        if (! is_array($body)) {
            Log::error('SSLCommerz returned an unreadable reply: ' . $response->body());

            return ['ok' => false, 'url' => null, 'message' => 'The payment gateway sent an unexpected reply.'];
        }

        if (($body['status'] ?? '') !== 'SUCCESS' || blank($body['GatewayPageURL'] ?? null)) {
            $reason = $body['failedreason'] ?? ($body['status'] ?? 'unknown');
            Log::error("SSLCommerz refused the session for {$order->invoice_number}: {$reason}");

            return ['ok' => false, 'url' => null, 'message' => 'The payment gateway refused the request: ' . $reason];
        }

        return ['ok' => true, 'url' => $body['GatewayPageURL'], 'message' => 'Session created.'];
    }

    /**
     * Confirm a transaction with SSLCommerz directly.
     *
     * This is the only thing that may mark an order paid. The browser is
     * redirected back with a status field, but anyone can forge that request —
     * only the validation API, queried server to server, is authoritative.
     *
     * @return array{ok: bool, data: array, message: string}
     */
    public function validateTransaction(string $valId): array
    {
        if (! $this->isConfigured()) {
            return ['ok' => false, 'data' => [], 'message' => 'The gateway is not configured.'];
        }

        $c = $this->config();

        try {
            $response = Http::timeout(30)->get($this->host() . '/validator/api/validationserverAPI.php', [
                'val_id'      => $valId,
                'store_id'    => $c['store_id'],
                'store_passwd' => $c['store_password'],
                'format'      => 'json',
            ]);
        } catch (Throwable $e) {
            Log::error('SSLCommerz validation request failed: ' . $e->getMessage());

            return ['ok' => false, 'data' => [], 'message' => 'Could not reach the payment gateway.'];
        }

        $data = $response->json();

        if (! is_array($data)) {
            return ['ok' => false, 'data' => [], 'message' => 'The gateway sent an unexpected reply.'];
        }

        // VALID is a live payment; VALIDATED is one already validated once.
        $status = strtoupper((string) ($data['status'] ?? ''));
        $ok = in_array($status, ['VALID', 'VALIDATED'], true);

        return [
            'ok'      => $ok,
            'data'    => $data,
            'message' => $ok ? 'Payment confirmed.' : 'The gateway reported status ' . ($status ?: 'unknown') . '.',
        ];
    }

    /**
     * Apply a confirmed payment to its order.
     *
     * Checks that the money actually belongs to this order — the right invoice,
     * the right currency, the right amount — before recording it.
     */
    public function applyPayment(Order $order, array $data): bool
    {
        if ((string) ($data['tran_id'] ?? '') !== (string) $order->invoice_number) {
            Log::warning("SSLCommerz transaction id does not match order {$order->invoice_number}.");

            return false;
        }

        if (strtoupper((string) ($data['currency'] ?? 'BDT')) !== 'BDT') {
            Log::warning("SSLCommerz paid in an unexpected currency for {$order->invoice_number}.");

            return false;
        }

        $paid = (float) ($data['amount'] ?? 0);
        $expected = $this->orderTotal($order);

        if (abs($paid - $expected) > self::AMOUNT_TOLERANCE) {
            Log::warning("SSLCommerz amount {$paid} does not match order {$order->invoice_number} total {$expected}.");

            return false;
        }

        // Already recorded — a customer refreshing the return page, or the IPN
        // arriving after the redirect, must not double-apply.
        if ($order->payment_status === 'paid') {
            return true;
        }

        $order->forceFill([
            'payment_status' => 'paid',
            // 'online' is one of config('payments.types'); anything else fails
            // the admin's own validation and makes it blank the method and
            // reference fields when an order is edited.
            'payment_type'      => 'online',
            'payment_method'    => $this->methodFor($data['card_type'] ?? null),
            'payment_reference' => $data['bank_tran_id'] ?? ($data['val_id'] ?? null),
            'paid_amount'       => $paid,
        ])->save();

        return true;
    }

    /**
     * SSLCommerz's card_type mapped onto the shop's own payment methods.
     *
     * It reports things like "VISA-Dutch Bangla" or "BKASH-BKash"; the admin
     * dropdown only knows the keys in config('payments.methods'), so anything
     * unrecognised falls back to a card.
     */
    private function methodFor(?string $cardType): string
    {
        $type = strtolower((string) $cardType);

        foreach (['bkash', 'nagad', 'rocket', 'upay', 'mcash', 'surecash'] as $wallet) {
            if (str_contains($type, $wallet)) {
                return $wallet;
            }
        }

        if (str_contains($type, 'bank') || str_contains($type, 'internet')) {
            return 'bank';
        }

        return 'card';
    }

    public function markFailed(Order $order, string $status): void
    {
        if ($order->payment_status === 'paid') {
            return;
        }

        $order->forceFill(['payment_status' => $status])->save();
    }

    /** What the customer owes: goods, plus delivery, less any discount. */
    public function orderTotal(Order $order): float
    {
        return round(
            (float) $order->total_price
            + (float) $order->delivery_charge
            - (float) $order->discount,
            2
        );
    }

    /** The label shown to customers beside the online payment option. */
    public function storeName(): string
    {
        return SiteInfo::first()?->app_name ?: config('app.name');
    }
}
