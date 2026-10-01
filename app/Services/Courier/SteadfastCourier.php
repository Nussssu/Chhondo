<?php

namespace App\Services\Courier;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Steadfast Courier API client.
 *
 * Replaces steadfast-courier/steadfast-courier-laravel-package, which caps at
 * illuminate/contracts ^12 and so cannot be installed alongside Laravel 13.
 * The app kept calling its facade after the upgrade removed it, which is why
 * every dispatch failed with a class-not-found error.
 *
 * The wire format is unchanged, so existing consignment handling still applies.
 *
 * Credentials are the ones saved under Integrations › Courier (the
 * courier_settings table). They used to be read only from
 * config('steadfast-courier.*'), which CourierConfigService was meant to fill
 * but which nothing ever called — so every single send and status check was
 * refused for missing credentials while the bulk send, which reads the table
 * itself, went through. Config still wins when it is set, e.g. in tests.
 */
class SteadfastCourier
{
    /**
     * Create a delivery order.
     *
     * @param array $orderData invoice, recipient_name, recipient_phone,
     *                         recipient_address, cod_amount, note
     * @return array|null decoded response, or null when the call did not complete
     */
    public static function placeOrder(array $orderData): ?array
    {
        return self::request('post', 'create_order', [
            'invoice'           => $orderData['invoice'] ?? null,
            'recipient_name'    => $orderData['recipient_name'] ?? null,
            'recipient_phone'   => $orderData['recipient_phone'] ?? null,
            'recipient_address' => $orderData['recipient_address'] ?? null,
            'cod_amount'        => $orderData['cod_amount'] ?? 0,
            'note'              => $orderData['note'] ?? null,
        ]);
    }

    /** Current delivery status for a consignment. */
    public static function checkDeliveryStatusByConsignmentId($consignmentId): ?array
    {
        return self::request('get', 'status_by_cid/' . $consignmentId);
    }

    /** Current delivery status by the invoice number we sent. */
    public static function checkDeliveryStatusByInvoice($invoice): ?array
    {
        return self::request('get', 'status_by_invoice/' . $invoice);
    }

    /** Remaining balance on the Steadfast account. */
    public static function getBalance(): ?array
    {
        return self::request('get', 'get_balance');
    }

    /** @return array{0: ?string, 1: ?string} api key and secret key */
    private static function credentials(): array
    {
        $apiKey = config('steadfast-courier.api_key');
        $secretKey = config('steadfast-courier.secret_key');

        if (filled($apiKey) && filled($secretKey)) {
            return [$apiKey, $secretKey];
        }

        $settings = \App\Models\CourierSetting::first();

        return [$settings?->api_key, $settings?->secret_key];
    }

    private static function request(string $method, string $path, array $payload = []): ?array
    {
        [$apiKey, $secretKey] = self::credentials();
        $baseUrl = rtrim((string) config('steadfast-courier.base_url'), '/');

        if (! $baseUrl || ! $apiKey || ! $secretKey) {
            Log::warning('[Steadfast] Missing API credentials; refusing to call the courier.');

            return null;
        }

        try {
            $request = Http::withHeaders([
                'Api-Key'      => $apiKey,
                'Secret-Key'   => $secretKey,
                'Content-Type' => config('steadfast-courier.content_type', 'application/json'),
                'Accept'       => 'application/json',
            ])->timeout(30);

            $response = $method === 'get'
                ? $request->get("{$baseUrl}/{$path}")
                : $request->post("{$baseUrl}/{$path}", $payload);

            $decoded = $response->json();

            if (! is_array($decoded)) {
                Log::error("[Steadfast] Non-JSON response from {$path}: " . $response->body());

                return null;
            }

            // The API reports failure in the body with a 200, so surface the
            // transport status when the body does not carry one itself.
            if (! array_key_exists('status', $decoded)) {
                $decoded['status'] = $response->status();
            }

            return $decoded;
        } catch (\Throwable $e) {
            Log::error("[Steadfast] {$path} failed: " . $e->getMessage());

            return null;
        }
    }
}
