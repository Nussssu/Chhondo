<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\Mail\OrderMailNotifier;
use App\Services\Sms\OrderSmsNotifier;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/** Deliver the existing confirmations without holding the checkout response. */
class SendOrderConfirmation implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;
    public int $timeout = 80;

    public function __construct(public int $orderId)
    {
        // The local default is sync; this dedicated queue must be asynchronous.
        $this->onConnection('database')->onQueue('order-confirmations')->afterCommit();
    }

    public function handle(OrderSmsNotifier $sms, OrderMailNotifier $mail): void
    {
        $order = Order::find($this->orderId);
        if (! $order) {
            return;
        }
        app('request')->attributes->remove('_shared_storefront_globals');
        $sms->send($order);
        // Queue workers are long-lived; use the currently saved SMTP settings
        // for each confirmation, as a fresh checkout request did previously.
        app(\App\Services\Mail\MailConfigurator::class)->apply(force: true);
        $mail->sendPlaced($order);
    }
}
