<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * One transactional email's wording.
 *
 * The catalogue below is the source of truth for which emails exist, who they
 * go to and what they say out of the box; the table only holds the shop's
 * edits. A template the shop has never touched therefore still sends, with the
 * default wording, rather than going out blank.
 */
class EmailTemplate extends Model
{
    protected $fillable = ['key', 'subject', 'heading', 'intro', 'outro', 'is_enabled'];

    protected $casts = ['is_enabled' => 'boolean'];

    public const ORDER_PLACED_CUSTOMER = 'order_placed_customer';
    public const ORDER_PLACED_ADMIN    = 'order_placed_admin';
    public const ORDER_STATUS_CUSTOMER = 'order_status_customer';
    public const ORDER_CANCELLED_CUSTOMER = 'order_cancelled_customer';
    public const CONTACT_RECEIVED_CUSTOMER = 'contact_received_customer';
    public const PASSWORD_RESET_CUSTOMER = 'password_reset_customer';

    /**
     * Every email the shop sends.
     *
     * `placeholders` is what the admin screen offers beside each field; every
     * one of them is filled by App\Services\Mail\EmailTemplateRenderer, so a
     * token listed here always resolves.
     */
    public const CATALOGUE = [
        self::ORDER_PLACED_CUSTOMER => [
            'label'       => 'Order confirmation',
            'audience'    => 'customer',
            'description' => 'Sent to the customer as soon as their order is placed. Includes the full order summary.',
            'view'        => 'emails.order-placed',
            'subject'     => 'Your order {invoice} is confirmed',
            'heading'     => 'Thank you for your order!',
            'intro'       => "Hi {name}, we have received your order and are getting it ready. Here is what you ordered — keep this email for your records.",
            'outro'       => 'We will contact you on {phone} before delivery. If anything looks wrong, reply to this email or call us on {store_phone}.',
            'placeholders' => ['{name}', '{invoice}', '{total}', '{items}', '{phone}', '{address}', '{payment_method}', '{store}', '{store_phone}', '{store_email}'],
        ],
        self::ORDER_PLACED_ADMIN => [
            'label'       => 'New order alert',
            'audience'    => 'admin',
            'description' => 'Sent to the shop when an order comes in, so it can be picked and packed without watching the dashboard.',
            'view'        => 'emails.order-admin',
            'subject'     => 'New order {invoice} — {total}',
            'heading'     => 'A new order has come in',
            'intro'       => '{name} placed order {invoice} for {total}. The details are below; open the admin panel to process it.',
            'outro'       => 'Customer phone: {phone}',
            'placeholders' => ['{name}', '{invoice}', '{total}', '{items}', '{phone}', '{address}', '{payment_method}', '{store}'],
        ],
        self::ORDER_STATUS_CUSTOMER => [
            'label'       => 'Order status update',
            'audience'    => 'customer',
            'description' => 'Sent to the customer when their order moves to processed, shipped, on delivery or delivered.',
            'view'        => 'emails.order-status',
            'subject'     => 'Your order {invoice} is now {status}',
            'heading'     => 'Your order is {status}',
            'intro'       => 'Hi {name}, your order {invoice} is now {status}. We will keep you posted as it moves along.',
            'outro'       => 'Any questions? Reply to this email or call us on {store_phone}.',
            'placeholders' => ['{name}', '{invoice}', '{status}', '{total}', '{tracking}', '{courier}', '{store}', '{store_phone}', '{store_email}'],
        ],
        self::ORDER_CANCELLED_CUSTOMER => [
            'label'       => 'Order cancelled',
            'audience'    => 'customer',
            'description' => 'Sent to the customer when an order is cancelled or returned, so a cancellation is never silent.',
            'view'        => 'emails.order-status',
            'subject'     => 'Your order {invoice} has been {status}',
            'heading'     => 'Your order has been {status}',
            'intro'       => 'Hi {name}, your order {invoice} has been {status}. If this is not what you expected, please get in touch and we will put it right.',
            'outro'       => 'Call us on {store_phone} or reply to this email and we will look into it.',
            'placeholders' => ['{name}', '{invoice}', '{status}', '{total}', '{store}', '{store_phone}', '{store_email}'],
        ],
        self::PASSWORD_RESET_CUSTOMER => [
            'label'       => 'Password reset',
            'audience'    => 'customer',
            'description' => 'Sent when someone asks to reset their password from the login page.',
            'view'        => 'emails.password-reset',
            'subject'     => 'Reset your {store} password',
            'heading'     => 'Reset your password',
            'intro'       => 'Hi {name}, we received a request to reset the password on your {store} account. Choose a new one using the button below.',
            'outro'       => "This link expires in {expires} minutes and can only be used once. If you did not ask for a new password, ignore this email — your account is unchanged.",
            'placeholders' => ['{name}', '{expires}', '{store}', '{store_phone}', '{store_email}'],
            // Account recovery, not marketing: switching it off would lock
            // customers out of their own accounts with no way back in, so the
            // admin screen shows it as always on and offers no toggle.
            'always_on'   => true,
        ],
        self::CONTACT_RECEIVED_CUSTOMER => [
            'label'       => 'Enquiry received',
            'audience'    => 'customer',
            'description' => 'Sent to anyone who submits the contact form, so their message is visibly received.',
            'view'        => 'emails.contact-received',
            'subject'     => 'We have your message — {store}',
            'heading'     => 'Thanks for getting in touch',
            'intro'       => 'Hi {name}, we have your message and someone will reply within one working day.',
            'outro'       => 'If it is urgent, call us on {store_phone}.',
            'placeholders' => ['{name}', '{message}', '{store}', '{store_phone}', '{store_email}'],
        ],
    ];

    /** The catalogue entry for a key, or null if no such email exists. */
    public static function definition(string $key): ?array
    {
        return self::CATALOGUE[$key] ?? null;
    }

    /**
     * The wording in force for a template: the shop's edits where it has made
     * any, the catalogue defaults everywhere else.
     */
    public static function resolve(string $key): array
    {
        $definition = self::definition($key);

        if ($definition === null) {
            return [];
        }

        $saved = self::where('key', $key)->first();

        // Some emails cannot be switched off; see 'always_on' in the catalogue.
        $alwaysOn = (bool) ($definition['always_on'] ?? false);

        return [
            'key'        => $key,
            'label'      => $definition['label'],
            'audience'   => $definition['audience'],
            'description' => $definition['description'],
            'view'       => $definition['view'],
            'placeholders' => $definition['placeholders'],
            'subject'    => filled($saved?->subject) ? $saved->subject : $definition['subject'],
            'heading'    => filled($saved?->heading) ? $saved->heading : $definition['heading'],
            'intro'      => filled($saved?->intro) ? $saved->intro : $definition['intro'],
            'outro'      => $saved && $saved->exists ? (string) $saved->outro : $definition['outro'],
            'always_on'  => $alwaysOn,
            'is_enabled' => $alwaysOn ? true : ($saved ? (bool) $saved->is_enabled : true),
        ];
    }

    /** Every template's current wording, in catalogue order. */
    public static function all_resolved(): array
    {
        return collect(array_keys(self::CATALOGUE))
            ->map(fn (string $key) => self::resolve($key))
            ->all();
    }
}
