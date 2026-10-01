<?php

namespace App\Services\Mail;

use App\Mail\TemplatedMail;
use App\Models\EmailTemplate;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * The emails that go out around an order.
 *
 * Sending is best-effort, exactly as the order SMS is: by the time any of this
 * runs the customer has placed and possibly paid for an order, so a mail server
 * that is down is logged and swallowed rather than failing the checkout.
 */
class OrderMailNotifier
{
    /** Statuses worth telling a customer about; the rest are internal churn. */
    private const NOTIFIED_STATUSES = ['processed', 'shipped', 'on delivery', 'delivered', 'cancelled', 'returned'];

    public function __construct(
        private MailConfigurator $config,
        private EmailBrand $brand,
        private EmailTemplateRenderer $renderer,
    ) {
    }

    /** The customer's confirmation and the shop's own copy, for a new order. */
    public function sendPlaced(Order $order): void
    {
        $order->loadMissing('items.product', 'items.options');

        $this->send(EmailTemplate::ORDER_PLACED_CUSTOMER, $order->email, [
            'order' => $order,
        ], $this->renderer->orderTokens($order));

        $this->send(EmailTemplate::ORDER_PLACED_ADMIN, $this->brand->adminEmail(), [
            'order'    => $order,
            'adminUrl' => $this->adminUrl($order),
        ], $this->renderer->orderTokens($order));
    }

    /**
     * Tell the customer their order has moved on.
     *
     * Only real transitions are announced: re-saving an order on the status it
     * already had must not send the same email again.
     */
    public function sendStatusChanged(Order $order, ?string $from): void
    {
        $to = $order->order_status;

        if ($from === $to || ! in_array($to, self::NOTIFIED_STATUSES, true)) {
            return;
        }

        $key = in_array($to, ['cancelled', 'returned'], true)
            ? EmailTemplate::ORDER_CANCELLED_CUSTOMER
            : EmailTemplate::ORDER_STATUS_CUSTOMER;

        $this->send($key, $order->email, ['order' => $order], $this->renderer->orderTokens($order));
    }

    /** Acknowledge a contact-form enquiry. */
    public function sendContactReceived(string $email, string $name, string $enquiry): void
    {
        $this->send(EmailTemplate::CONTACT_RECEIVED_CUSTOMER, $email, [
            'enquiry' => $enquiry,
        ], [
            '{name}'    => $name ?: 'there',
            '{message}' => $enquiry,
        ]);
    }

    /**
     * Send one template to one address, or do nothing and say why.
     *
     * The reasons not to send — no address, template switched off, no mail
     * server configured — are all ordinary states, so they are logged at debug
     * and never raised.
     */
    private function send(string $key, ?string $to, array $payload, array $tokens): void
    {
        if (blank($to) || ! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        // Guest and POS customers carry generated addresses, and guest.com and
        // user.com are real domains: mailing them would hand a stranger the
        // order details.
        if (self::isPlaceholder($to)) {
            Log::debug("Email '{$key}' not sent: {$to} is a generated placeholder address.");

            return;
        }

        if (! $this->config->isConfigured()) {
            Log::debug("Email '{$key}' not sent: no mail server is configured.");

            return;
        }

        $template = $this->renderer->render($key, $tokens);

        if ($template === [] || ! $template['is_enabled']) {
            return;
        }

        try {
            $this->config->apply();

            Mail::to($to)->send(new TemplatedMail($template, $this->brand->toArray(), $payload));
        } catch (Throwable $e) {
            // An order must never fail because an email did.
            Log::error("Email '{$key}' to {$to} failed: " . $e->getMessage());
        }
    }

    /** An address the system made up rather than one a customer gave. */
    public static function isPlaceholder(string $email): bool
    {
        $email = strtolower(trim($email));

        return str_ends_with($email, '@guest.com')
            || str_ends_with($email, '.invalid')
            || $email === 'walking@user.com';
    }

    /** A link straight to the order in the admin, when one can be built. */
    private function adminUrl(Order $order): ?string
    {
        try {
            return route('admin.orders.index') . '?search=' . urlencode((string) $order->invoice_number);
        } catch (Throwable) {
            return null;
        }
    }
}
