<?php

namespace App\Services\Sms;

use App\Models\Order;
use App\Models\SiteInfo;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * The "your order is confirmed" SMS.
 *
 * Sending is deliberately best-effort: an order is already placed and paid for
 * by the time this runs, so a gateway problem is logged and swallowed rather
 * than failing the checkout the customer just completed.
 */
class OrderSmsNotifier
{
    /**
     * The message used until someone writes their own in the admin.
     *
     * Kept under 160 GSM-7 characters is not possible in Bangla — Unicode SMS
     * are 70 characters a part — so this is written to stay short while still
     * carrying the invoice number and the amount.
     */
    public const DEFAULT_TEMPLATE = 'প্রিয় {name}, আপনার অর্ডার #{invoice} নিশ্চিত হয়েছে। মোট {total} টাকা। শীঘ্রই আমরা যোগাযোগ করব। ধন্যবাদ — {store}';

    /** Placeholders an operator can use, shown beside the field in the admin. */
    public const PLACEHOLDERS = ['{name}', '{invoice}', '{total}', '{items}', '{store}', '{phone}'];

    public function __construct(private ReveSmsService $sms)
    {
    }

    /** Send the confirmation for one order. Returns the gateway result. */
    public function send(Order $order): array
    {
        if (! $this->sms->isEnabled()) {
            return ['ok' => false, 'status' => null, 'message' => 'SMS is switched off.', 'message_id' => null];
        }

        try {
            $result = $this->sms->send(
                (string) $order->phone_number,
                $this->compose($order)
            );

            if (! $result['ok']) {
                Log::warning("Order SMS not sent for #{$order->invoice_number}: {$result['message']}");
            }

            return $result;
        } catch (Throwable $e) {
            // An order must never fail because a text message did.
            Log::error('Order SMS failed: ' . $e->getMessage());

            return ['ok' => false, 'status' => null, 'message' => 'SMS failed.', 'message_id' => null];
        }
    }

    /** Fill the saved template with this order's details. */
    public function compose(Order $order): string
    {
        $template = $this->sms->config()['order_message'] ?? '';

        if (blank($template)) {
            $template = self::DEFAULT_TEMPLATE;
        }

        $total = (float) $order->total_price
            + (float) $order->delivery_charge
            - (float) $order->discount;

        return strtr($template, [
            '{name}'    => $order->customer_name ?: 'গ্রাহক',
            '{invoice}' => $order->invoice_number,
            '{total}'   => number_format($total, 0),
            '{items}'   => (string) $order->orderItems()->count(),
            '{store}'   => SiteInfo::first()?->app_name ?: 'charukothon',
            '{phone}'   => (string) $order->phone_number,
        ]);
    }
}
