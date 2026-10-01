<?php

namespace App\Services\Payment;

use App\Models\BusinessSetting;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * bKash Tokenized Checkout.
 *
 * Three calls to bKash: grant a token, create a payment (which hands back the
 * bKash page to send the customer to), and execute it once the customer has
 * entered their wallet number, OTP and PIN. bKash then redirects the browser to
 * our callback with a status, but that status is not trusted: an order is only
 * marked paid when execute — or, failing that, the status query — reports the
 * transaction Completed for this invoice and this amount.
 */
class BkashService
{
    public const SETTING_KEY = 'bkash';
    public const SETTING_TYPE = 'payment_config';

    private const SANDBOX_HOST = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout';
    private const LIVE_HOST = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout';

    /**
     * The credentials bKash publishes for its sandbox, offered in the admin so
     * the integration can be tried before a merchant account exists.
     */
    public const SANDBOX_CREDENTIALS = [
        'username'   => 'sandboxTokenizedUser02',
        'password'   => 'sandboxTokenizedUser02@12345',
        'app_key'    => '4f6o0cjiki2rfm34kfdadl1eqq',
        'app_secret' => '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
    ];

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

        foreach (['username', 'password', 'app_key', 'app_secret'] as $key) {
            if (blank($c[$key] ?? null)) {
                return false;
            }
        }

        return true;
    }

    /** Whether customers may choose bKash at checkout. */
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
     * An id_token for the saved credentials.
     *
     * bKash issues tokens valid for an hour and asks merchants not to grant one
     * per request, so it is cached — keyed on the credentials, so saving new
     * ones in the admin never reuses a token issued for the old.
     *
     * @return array{ok: bool, token: ?string, message: string}
     */
    public function token(bool $fresh = false): array
    {
        if (! $this->isConfigured()) {
            return ['ok' => false, 'token' => null, 'message' => 'bKash is not configured.'];
        }

        $c = $this->config();
        $cacheKey = 'bkash_token_' . md5($this->host() . '|' . $c['username'] . '|' . $c['app_key'] . '|' . $c['app_secret'] . '|' . $c['password']);

        if (! $fresh && ($cached = Cache::get($cacheKey))) {
            return ['ok' => true, 'token' => $cached, 'message' => 'Token reused.'];
        }

        try {
            $response = Http::acceptJson()
                ->timeout(30)
                ->withHeaders(['username' => $c['username'], 'password' => $c['password']])
                ->post($this->host() . '/token/grant', [
                    'app_key'    => $c['app_key'],
                    'app_secret' => $c['app_secret'],
                ]);
        } catch (Throwable $e) {
            Log::error('bKash token request failed: ' . $e->getMessage());

            return ['ok' => false, 'token' => null, 'message' => 'Could not reach bKash.'];
        }

        $body = $response->json();

        if (! is_array($body) || blank($body['id_token'] ?? null)) {
            $reason = is_array($body)
                ? ($body['statusMessage'] ?? $body['msg'] ?? $body['message'] ?? 'unknown')
                : 'unexpected reply';
            Log::error('bKash refused the token grant: ' . $reason);

            return ['ok' => false, 'token' => null, 'message' => 'bKash refused the credentials: ' . $reason];
        }

        // A little short of bKash's own expiry so a token never dies mid-checkout.
        $ttl = max(60, (int) ($body['expires_in'] ?? 3600) - 300);
        Cache::put($cacheKey, $body['id_token'], $ttl);

        return ['ok' => true, 'token' => $body['id_token'], 'message' => 'Connected to bKash.'];
    }

    /**
     * Create a payment and return the bKash page to send the customer to.
     *
     * The paymentID is kept on the order as its reference, so a cancel or
     * failure callback can be tied back to the order it belongs to.
     *
     * @return array{ok: bool, url: ?string, message: string}
     */
    public function createPayment(Order $order): array
    {
        if (! $this->isEnabled()) {
            return ['ok' => false, 'url' => null, 'message' => 'bKash payment is switched off.'];
        }

        $amount = $this->orderTotal($order);

        if ($amount <= 0) {
            return ['ok' => false, 'url' => null, 'message' => 'This order has nothing to pay.'];
        }

        $body = $this->call('/create', [
            'mode'                  => '0011',
            'payerReference'        => (string) ($order->phone_number ?: $order->invoice_number),
            'callbackURL'           => route('payment.bkash.callback'),
            'amount'                => number_format($amount, 2, '.', ''),
            'currency'              => 'BDT',
            'intent'                => 'sale',
            // Already unique, and what staff search by.
            'merchantInvoiceNumber' => (string) $order->invoice_number,
        ]);

        if (! $body['ok']) {
            return ['ok' => false, 'url' => null, 'message' => $body['message']];
        }

        $data = $body['data'];

        if (blank($data['bkashURL'] ?? null) || blank($data['paymentID'] ?? null)) {
            $reason = $data['statusMessage'] ?? 'unknown';
            Log::error("bKash refused the payment for {$order->invoice_number}: {$reason}");

            return ['ok' => false, 'url' => null, 'message' => 'bKash refused the request: ' . $reason];
        }

        $order->forceFill([
            'payment_type'      => 'online',
            'payment_method'    => 'bkash',
            'payment_reference' => $data['paymentID'],
        ])->save();

        return ['ok' => true, 'url' => $data['bkashURL'], 'message' => 'Payment created.'];
    }

    /**
     * Settle a payment the customer has authorised on the bKash page.
     *
     * Execute is what actually takes the money. If it does not come back
     * Completed — a timeout, or a repeat callback for a payment executed
     * already — the status query is asked instead, so a paid order is never
     * left looking unpaid.
     *
     * @return array{ok: bool, data: array, message: string}
     */
    public function executePayment(string $paymentId): array
    {
        $execute = $this->call('/execute', ['paymentID' => $paymentId]);

        if ($execute['ok'] && $this->isCompleted($execute['data'])) {
            return ['ok' => true, 'data' => $execute['data'], 'message' => 'Payment completed.'];
        }

        $query = $this->queryPayment($paymentId);

        if ($query['ok']) {
            return $query;
        }

        $reason = $execute['data']['statusMessage'] ?? $execute['message'];

        return ['ok' => false, 'data' => $execute['data'] ?: $query['data'], 'message' => (string) $reason];
    }

    /** @return array{ok: bool, data: array, message: string} */
    public function queryPayment(string $paymentId): array
    {
        $query = $this->call('/payment/status', ['paymentID' => $paymentId]);

        if ($query['ok'] && $this->isCompleted($query['data'])) {
            return ['ok' => true, 'data' => $query['data'], 'message' => 'Payment completed.'];
        }

        $status = $query['data']['transactionStatus'] ?? ($query['data']['statusMessage'] ?? $query['message']);

        return ['ok' => false, 'data' => $query['data'], 'message' => 'bKash reported ' . $status . '.'];
    }

    /**
     * Apply a completed payment to its order, after checking that the money
     * belongs to it — the right invoice, currency and amount.
     */
    public function applyPayment(Order $order, array $data): bool
    {
        if (self::invoiceNumber($data) !== (string) $order->invoice_number) {
            Log::warning("bKash invoice number does not match order {$order->invoice_number}.");

            return false;
        }

        if (strtoupper((string) ($data['currency'] ?? 'BDT')) !== 'BDT') {
            Log::warning("bKash paid in an unexpected currency for {$order->invoice_number}.");

            return false;
        }

        $paid = (float) ($data['amount'] ?? 0);
        $expected = $this->orderTotal($order);

        if (abs($paid - $expected) > self::AMOUNT_TOLERANCE) {
            Log::warning("bKash amount {$paid} does not match order {$order->invoice_number} total {$expected}.");

            return false;
        }

        // A refreshed callback must not double-apply.
        if ($order->payment_status === 'paid') {
            return true;
        }

        $order->forceFill([
            'payment_status'    => 'paid',
            'payment_type'      => 'online',
            'payment_method'    => 'bkash',
            // The trxID is what the customer sees in their bKash app, so it is
            // the reference staff will be quoted.
            'payment_reference' => $data['trxID'] ?? ($data['paymentID'] ?? null),
            'paid_amount'       => $paid,
        ])->save();

        return true;
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
        return app(SslCommerzService::class)->orderTotal($order);
    }

    /**
     * The invoice a bKash reply is for. Execute calls it merchantInvoiceNumber;
     * the status query, against the live sandbox, calls it merchantInvoice.
     */
    public static function invoiceNumber(array $data): string
    {
        return (string) ($data['merchantInvoiceNumber'] ?? $data['merchantInvoice'] ?? '');
    }

    private function isCompleted(array $data): bool
    {
        return ($data['transactionStatus'] ?? '') === 'Completed';
    }

    /**
     * An authorised call to the checkout API.
     *
     * @return array{ok: bool, data: array, message: string}
     */
    private function call(string $path, array $payload): array
    {
        $token = $this->token();

        if (! $token['ok']) {
            return ['ok' => false, 'data' => [], 'message' => $token['message']];
        }

        try {
            $response = Http::acceptJson()
                ->timeout(30)
                ->withHeaders([
                    'Authorization' => $token['token'],
                    'X-App-Key'     => $this->config()['app_key'],
                ])
                ->post($this->host() . $path, $payload);
        } catch (Throwable $e) {
            Log::error("bKash {$path} request failed: " . $e->getMessage());

            return ['ok' => false, 'data' => [], 'message' => 'Could not reach bKash.'];
        }

        $data = $response->json();

        if (! is_array($data)) {
            Log::error("bKash {$path} returned an unreadable reply: " . $response->body());

            return ['ok' => false, 'data' => [], 'message' => 'bKash sent an unexpected reply.'];
        }

        return ['ok' => true, 'data' => $data, 'message' => (string) ($data['statusMessage'] ?? '')];
    }
}
