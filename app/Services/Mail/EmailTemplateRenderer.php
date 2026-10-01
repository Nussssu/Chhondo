<?php

namespace App\Services\Mail;

use App\Models\EmailTemplate;
use App\Models\Order;

/**
 * Fills a template's placeholders with real values.
 *
 * Every token a template offers in the admin is produced here, so a field the
 * operator was invited to use can never come out as a literal "{invoice}".
 * Values are substituted as plain text and escaped by the view, so nothing an
 * order carries can inject markup into an email.
 */
class EmailTemplateRenderer
{
    public function __construct(private EmailBrand $brand)
    {
    }

    /** A template's wording with $tokens applied to subject, heading and body. */
    public function render(string $key, array $tokens): array
    {
        $template = EmailTemplate::resolve($key);

        if ($template === []) {
            return [];
        }

        $tokens += $this->storeTokens();

        foreach (['subject', 'heading', 'intro', 'outro'] as $field) {
            $template[$field] = strtr((string) $template[$field], $tokens);
        }

        return $template;
    }

    /** Tokens every template can use, whatever it is about. */
    public function storeTokens(): array
    {
        return [
            '{store}'       => $this->brand->name(),
            '{store_phone}' => $this->brand->phone() ?: '',
            '{store_email}' => $this->brand->email() ?: '',
        ];
    }

    /** Tokens for an email about one order. */
    public function orderTokens(Order $order): array
    {
        $totals = $order->totals();

        return [
            '{name}'           => $order->customer_name ?: 'there',
            '{invoice}'        => (string) $order->invoice_number,
            '{total}'          => 'Tk ' . number_format($totals['grand'], 2),
            '{items}'          => (string) $order->items()->sum('quantity'),
            '{phone}'          => (string) $order->phone_number,
            '{address}'        => $order->shippingAddressLine(),
            '{payment_method}' => $order->payment_method_label ?: 'Cash on delivery',
            '{status}'         => $this->statusLabel($order->order_status),
            '{tracking}'       => (string) ($order->tracking_code ?: '—'),
            '{courier}'        => (string) ($order->couriar_name ?: '—'),
        ] + $this->storeTokens();
    }

    /** How an order status reads in a sentence written to a customer. */
    public function statusLabel(?string $status): string
    {
        return match ($status) {
            'pending'          => 'received',
            'processed'        => 'being prepared',
            'shipped'          => 'shipped',
            'on delivery'      => 'out for delivery',
            'pending delivery' => 'awaiting delivery',
            'delivered'        => 'delivered',
            'cancelled'        => 'cancelled',
            'returned'         => 'returned',
            default            => (string) $status,
        };
    }
}
