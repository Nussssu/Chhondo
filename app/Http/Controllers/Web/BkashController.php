<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\BkashService;
use App\Services\Sms\OrderSmsNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Where bKash sends the customer after the wallet page.
 *
 * One endpoint for every outcome: bKash appends paymentID and a status of
 * success, failure or cancel. It is unauthenticated because the customer
 * arrives from bKash, so the status is only a hint — a success is confirmed by
 * executing the payment with bKash, server to server, before anything is paid.
 */
class BkashController extends Controller
{
    public function __construct(
        private BkashService $gateway,
        private OrderSmsNotifier $sms,
    ) {
    }

    public function callback(Request $request)
    {
        $paymentId = (string) $request->query('paymentID');
        $status = strtolower((string) $request->query('status'));
        $order = $paymentId === '' ? null : $this->orderFor($paymentId);

        if ($status === 'success' && $paymentId !== '') {
            $result = $this->gateway->executePayment($paymentId);

            if ($result['ok']) {
                // Trust the invoice bKash reports for the money over our own
                // lookup: the reference is overwritten with the trxID once paid.
                $paidOrder = Order::where('invoice_number', BkashService::invoiceNumber($result['data']))->first();

                if ($paidOrder && $this->settle($paidOrder, $result['data'])) {
                    return redirect()->route('order.success', $paidOrder->invoice_number);
                }

                Log::warning("bKash payment {$paymentId} completed but could not be applied to an order.");

                return redirect()->route('checkout.index')->withErrors([
                    'payment' => 'We could not confirm your bKash payment. If money left your account, contact us with bKash payment ID ' . $paymentId . '.',
                ]);
            }

            Log::warning("bKash did not complete {$paymentId}: {$result['message']}");

            if ($order) {
                $this->gateway->markFailed($order, 'failed');
            }

            return redirect()->route('checkout.index')->withErrors([
                'payment' => 'bKash payment did not go through (' . $result['message'] . '). Your order is saved — you can try again or choose cash on delivery.',
            ]);
        }

        if ($order) {
            // An order already paid is not undone by a stray failure redirect.
            if ($order->payment_status === 'paid') {
                return redirect()->route('order.success', $order->invoice_number);
            }

            $this->gateway->markFailed($order, $status === 'cancel' ? 'cancelled' : 'failed');
        }

        return redirect()->route('checkout.index')->withErrors([
            'payment' => $status === 'cancel'
                ? 'The bKash payment was cancelled. Your order is saved — you can try again or choose cash on delivery.'
                : 'The bKash payment did not go through. Your order is saved — you can try again or choose cash on delivery.',
        ]);
    }

    private function settle(Order $order, array $data): bool
    {
        $wasPaid = $order->payment_status === 'paid';

        if (! $this->gateway->applyPayment($order, $data)) {
            return false;
        }

        // The confirmation is only earned once the money is in, and only once.
        if (! $wasPaid) {
            $this->sms->send($order->refresh());
            app(\App\Services\Mail\OrderMailNotifier::class)->sendPlaced($order);
        }

        return true;
    }

    /** The unpaid order a paymentID was created for. */
    private function orderFor(string $paymentId): ?Order
    {
        return Order::where('payment_method', 'bkash')
            ->where('payment_reference', $paymentId)
            ->first();
    }
}
