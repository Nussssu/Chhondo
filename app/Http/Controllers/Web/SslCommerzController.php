<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\SslCommerzService;
use App\Services\Sms\OrderSmsNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Where SSLCommerz sends the customer, and the server, after a payment.
 *
 * Four endpoints: the three browser redirects (success, fail, cancel) and the
 * IPN, which SSLCommerz calls server to server. All of them are unauthenticated
 * and CSRF-exempt because they are requested by the gateway, so none of them
 * trust their own payload — every one re-confirms with the validation API.
 */
class SslCommerzController extends Controller
{
    public function __construct(
        private SslCommerzService $gateway,
        private OrderSmsNotifier $sms,
    ) {
    }

    /** The customer is back and the gateway says it went through. */
    public function success(Request $request)
    {
        $order = $this->orderFor($request);

        if (! $order) {
            return redirect()->route('cart.index')
                ->withErrors(['payment' => 'We could not find that order.']);
        }

        if (! $this->confirm($order, $request)) {
            return redirect()->route('checkout.index')
                ->withErrors(['payment' => 'We could not confirm your payment. If money left your account, contact us with invoice ' . $order->invoice_number . '.']);
        }

        return redirect()->route('order.success', $order->invoice_number);
    }

    public function fail(Request $request)
    {
        $order = $this->orderFor($request);

        if ($order) {
            // Confirm first: a "failed" redirect can be forged, and the real
            // state may well be paid.
            if ($this->confirm($order, $request)) {
                return redirect()->route('order.success', $order->invoice_number);
            }

            $this->gateway->markFailed($order, 'failed');
        }

        return redirect()->route('checkout.index')
            ->withErrors(['payment' => 'The payment did not go through. Your order is saved — you can try again or choose cash on delivery.']);
    }

    public function cancel(Request $request)
    {
        $order = $this->orderFor($request);

        if ($order && $order->payment_status !== 'paid') {
            $this->gateway->markFailed($order, 'cancelled');
        }

        return redirect()->route('checkout.index')
            ->withErrors(['payment' => 'The payment was cancelled. Your order is saved — you can try again or choose cash on delivery.']);
    }

    /**
     * Server-to-server notification. This is the reliable one: it arrives even
     * if the customer closes the tab before being redirected back.
     */
    public function ipn(Request $request)
    {
        $order = $this->orderFor($request);

        if (! $order) {
            return response()->json(['ok' => false], 404);
        }

        $confirmed = $this->confirm($order, $request);

        if (! $confirmed && $order->payment_status !== 'paid') {
            $status = strtoupper((string) $request->input('status'));
            $this->gateway->markFailed($order, $status === 'CANCELLED' ? 'cancelled' : 'failed');
        }

        return response()->json(['ok' => $confirmed]);
    }

    /**
     * Confirm with SSLCommerz and record the payment.
     *
     * Returns true only when the gateway itself vouches for the transaction and
     * it matches this order.
     */
    private function confirm(Order $order, Request $request): bool
    {
        // A repeat visit to the return URL for an order already settled.
        if ($order->payment_status === 'paid') {
            return true;
        }

        $valId = (string) $request->input('val_id');

        if ($valId === '') {
            Log::warning("SSLCommerz callback for {$order->invoice_number} carried no val_id.");

            return false;
        }

        $result = $this->gateway->validateTransaction($valId);

        if (! $result['ok']) {
            Log::warning("SSLCommerz did not validate {$order->invoice_number}: {$result['message']}");

            return false;
        }

        if (! $this->gateway->applyPayment($order, $result['data'])) {
            return false;
        }

        // The confirmation text is only earned once the money is in.
        $this->sms->send($order->refresh());
        app(\App\Services\Mail\OrderMailNotifier::class)->sendPlaced($order);

        return true;
    }

    /** The order a callback refers to, found by the transaction id we set. */
    private function orderFor(Request $request): ?Order
    {
        $tranId = (string) $request->input('tran_id');

        return $tranId === '' ? null : Order::where('invoice_number', $tranId)->first();
    }
}
