<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;


class Order extends Model
{
    /**
     * The phone number in the shape the Bangladeshi couriers expect.
     *
     * Storefront orders now store E.164 (+8801712345678), while older rows and
     * POS orders hold the local form. Steadfast and Pathao both want the local
     * 11-digit number, so it is derived here rather than at each call site.
     */
    public function courierPhone(): string
    {
        $raw = trim((string) $this->phone_number);

        if ($raw === '') {
            return '';
        }

        try {
            $phone = phone($raw, 'BD');

            // A number from outside Bangladesh cannot be expressed locally;
            // pass it through unchanged so it is not silently mangled.
            return $phone->getCountry() === 'BD'
                ? preg_replace('/\D/', '', $phone->formatNational())
                : $phone->formatE164();
        } catch (\Throwable) {
            // Unparseable legacy value — send what we have.
            return $raw;
        }
    }

    /**
     * Characters used in generated invoice numbers.
     * Excludes I, O, 0 and 1 so numbers read back correctly over the phone.
     */
    private const INVOICE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    /**
     * A unique, non-guessable invoice number.
     *
     * The previous generators produced `rand(1000, 9999)` (9,000 possible values,
     * with no uniqueness check) and a 4-character random string. Both were short
     * enough to enumerate, and every guest-facing order lookup keys off this value,
     * so the whole order book could be walked. The 4-digit generator had also
     * already produced real collisions, which made those lookups return the wrong
     * customer's order.
     *
     * Format: INV-<yymmdd>-<6 chars> — about 1.07 billion combinations per day,
     * re-rolled on the (vanishingly unlikely) chance of a collision.
     */
    public static function generateInvoiceNumber(): string
    {
        $length = strlen(self::INVOICE_ALPHABET);

        do {
            $suffix = '';
            for ($i = 0; $i < 6; $i++) {
                $suffix .= self::INVOICE_ALPHABET[random_int(0, $length - 1)];
            }

            $candidate = 'INV-' . now()->format('ymd') . '-' . $suffix;
        } while (static::where('invoice_number', $candidate)->exists());

        return $candidate;
    }

    public const TYPE_POS = 'pos';

    protected $fillable = [
        'user_identifier',
        'author_id',
        'customer_name',
        'address',
        'phone_number',
        'alternative_phone_number',
        'email',
        'note',
        'order_status',
        'viewed_at',
        'order_type',
        'total_price',
        'shipping_price',
        'delivery',
        'delivery_charge',
        'invoice_number',
        'comment_id',
        'consignment_id',
        'tracking_code',
        'couriar_status',
        'couriar_name',
        'city_id',
        'zone_id',
        'area_id',
        'city_name',
        'zone_name',
        'area_name',
        'courier_note',
        'discount',
        'user_purchase_type',
        'payment_type',
        'payment_method',
        'payment_reference',
        'payment_status',
        // Recorded when a gateway confirms a payment. `remaining_balance` is
        // deliberately absent: prepareOrderData supplies it but no such column
        // exists, so mass assignment must keep dropping it.
        'paid_amount',
    ];

    /**
     * Storefront orders only — counter sales are managed on their own page and
     * must never be counted alongside these.
     *
     * order_type is null on older rows, which predate POS and are storefront.
     */
    public function scopeStorefront($query)
    {
        return $query->where(function ($q) {
            $q->where('order_type', '!=', self::TYPE_POS)->orWhereNull('order_type');
        });
    }

    /** Counter sales only. */
    public function scopePos($query)
    {
        return $query->where('order_type', self::TYPE_POS);
    }

    /** Human label for the payment method code stored on the order. */
    public function getPaymentMethodLabelAttribute(): ?string
    {
        return $this->payment_method
            ? (config("payments.methods.{$this->payment_method}.label") ?? $this->payment_method)
            : null;
    }

    /**
     * Whether the customer has already paid in full online (bKash or
     * SSLCommerz). Such an order must never be handed to a courier with cash
     * to collect — the customer would pay twice.
     */
    public function isPrepaid(): bool
    {
        return $this->payment_type === 'online' && $this->payment_status === 'paid';
    }

    /**
     * The cash a courier should collect on delivery. Every courier payload and
     * the Send-to-courier preview read this, so they cannot disagree.
     *
     * total_price is the goods before any discount (the discount has its own
     * column), so what is owed is goods + delivery − discount, less anything
     * already paid, never below zero. An order paid online collects nothing.
     *
     * Built from the stored totals rather than the item rows: some older
     * orders have no item rows at all and would otherwise collect only the
     * delivery charge.
     */
    public function courierCollectAmount(): float
    {
        if ($this->isPrepaid()) {
            return 0.0;
        }

        $owed = (float) $this->total_price
            + (float) $this->delivery_charge
            - (float) $this->discount
            - (float) $this->paid_amount;

        return round(max(0.0, $owed), 2);
    }

    /**
     * The delivery note for the courier, telling the rider a prepaid parcel
     * is paid. Steadfast has no "prepaid" flag — only cod_amount (sent as 0)
     * and this free-text note — so the note is what the rider actually sees.
     */
    public function courierNote(?string $note): string
    {
        $note = trim((string) $note);

        if (! $this->isPrepaid()) {
            return $note;
        }

        $paid = 'PAID via ' . ($this->payment_method_label ?: 'online payment')
            . ($this->payment_reference ? " (Trx: {$this->payment_reference})" : '')
            . ' - do not collect cash';

        return $note === '' ? $paid : "{$paid} | {$note}";
    }

    public function getCourierCollectAmountAttribute(): float
    {
        return $this->courierCollectAmount();
    }

    /**
     * How the order is paid, in one phrase: "bKash — Paid", "Cash on delivery".
     *
     * The single wording used by the invoice, emails, the CSV export and the
     * customer's order pages, so they cannot describe one order differently.
     * An online order carries its state because one abandoned at the gateway
     * otherwise reads exactly like a paid one.
     */
    public function getPaymentSummaryAttribute(): string
    {
        if ($this->payment_type === 'cash') {
            return 'Cash';
        }

        if ($this->payment_type !== 'online') {
            return 'Cash on delivery';
        }

        $status = match ($this->payment_status) {
            'paid'      => 'Paid',
            'failed'    => 'Failed',
            'cancelled' => 'Cancelled',
            default     => 'Unpaid',
        };

        return ($this->payment_method_label ?: 'Online payment') . ' — ' . $status;
    }

    /** Human label for the payment type code stored on the order. */
    public function getPaymentTypeLabelAttribute(): ?string
    {
        return $this->payment_type
            ? (config("payments.types.{$this->payment_type}") ?? $this->payment_type)
            : null;
    }

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    // The Send-to-courier preview shows the server's own figure rather than
    // re-deriving it in the browser. Pure arithmetic on the row — no queries.
    protected $appends = ['courier_collect_amount'];


    protected static function boot()
    {
        parent::boot();

        static::created(function () {
            Cache::forget('all_orders_with_details');
        });

        static::updated(function () {
            Cache::forget('all_orders_with_details');
        });

        static::deleted(function () {
            Cache::forget('all_orders_with_details');
        });
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_identifier', 'id');
    }


    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }


    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer_info()
    {
        return $this->belongsTo(User::class, 'user_identifier', 'id');
    }

    public function customer_address()
    {
        return $this->belongsTo(UserAddress::class, 'user_identifier', 'user_id');
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id', 'id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * The money on this order, worked out once.
     *
     * The invoice, the confirmation SMS and the emails all showed the customer
     * a total, and each re-derived it; a line-level discount is stored per
     * unit, which is easy to miss and was the source of the difference.
     *
     * @return array{subtotal: float, item_discount: float, order_discount: float, shipping: float, grand: float, paid: float, due: float}
     */
    public function totals(): array
    {
        $items = $this->relationLoaded('items') ? $this->items : $this->items()->get();

        $subtotal     = (float) $items->sum(fn ($i) => $i->quantity * (float) $i->price);
        $itemDiscount = (float) $items->sum(fn ($i) => $i->quantity * (float) $i->discount);
        $orderDiscount = (float) $this->discount;
        $shipping     = (float) $this->delivery_charge;
        $paid         = (float) $this->paid_amount;

        $grand = $subtotal - $itemDiscount - $orderDiscount + $shipping;

        return [
            'subtotal'       => round($subtotal, 2),
            'item_discount'  => round($itemDiscount, 2),
            'order_discount' => round($orderDiscount, 2),
            'shipping'       => round($shipping, 2),
            'grand'          => round($grand, 2),
            'paid'           => round($paid, 2),
            'due'            => round(max(0, $grand - $paid), 2),
        ];
    }

    /** The delivery address as one line, for an email or an SMS. */
    public function shippingAddressLine(): string
    {
        return collect([$this->address, $this->area_name, $this->zone_name, $this->city_name])
            ->map(fn ($part) => trim((string) $part))
            ->filter()
            ->unique()
            ->implode(', ');
    }
}
