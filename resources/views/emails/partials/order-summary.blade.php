{{--
    The order itself: what was bought, what it cost, and where it is going.

    Shared by the customer's confirmation and the shop's own copy so the two can
    never disagree about a total. Amounts come from Order::totals(), which is
    the same arithmetic the invoice uses.
--}}
@php
    $accent = $brand['colour'] ?? '#2c5015';
    $totals = $order->totals();
@endphp

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="border-collapse:collapse; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <tr>
        <td style="padding-bottom:6px; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:#9a938c;">
            Order {{ $order->invoice_number }}
            @if ($order->created_at) &nbsp;·&nbsp; {{ $order->created_at->format('j M Y') }} @endif
        </td>
    </tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="border-collapse:collapse; margin-top:8px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <thead>
        <tr>
            <th align="left" style="padding:8px 0; border-bottom:2px solid #ece5db; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#9a938c; font-weight:600;">Item</th>
            <th align="center" style="padding:8px 0; border-bottom:2px solid #ece5db; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#9a938c; font-weight:600; width:44px;">Qty</th>
            <th align="right" style="padding:8px 0; border-bottom:2px solid #ece5db; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#9a938c; font-weight:600; width:96px;">Amount</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($order->items as $item)
            <tr>
                <td style="padding:12px 8px 12px 0; border-bottom:1px solid #f2ede6; font-size:14px; line-height:20px; color:#3f3b37;">
                    {{ $item->product?->product_name ?? 'Item' }}
                    @if ($item->blouse_choice)
                        <br /><span style="font-size:12px; color:#8b847d;">{{ $item->blouse_choice }}</span>
                    @endif
                    @foreach ($item->options as $option)
                        <br /><span style="font-size:12px; color:#8b847d;">{{ $option->attributeOption?->name ?? '' }}</span>
                    @endforeach
                </td>
                <td align="center" style="padding:12px 0; border-bottom:1px solid #f2ede6; font-size:14px; color:#3f3b37;">
                    {{ $item->quantity }}
                </td>
                <td align="right" style="padding:12px 0 12px 8px; border-bottom:1px solid #f2ede6; font-size:14px; color:#3f3b37; white-space:nowrap;">
                    Tk {{ number_format($item->quantity * (float) $item->price - $item->quantity * (float) $item->discount, 2) }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="border-collapse:collapse; margin-top:14px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <tr>
        <td style="padding:3px 0; font-size:14px; color:#6d6660;">Subtotal</td>
        <td align="right" style="padding:3px 0; font-size:14px; color:#3f3b37;">Tk {{ number_format($totals['subtotal'], 2) }}</td>
    </tr>
    @if ($totals['item_discount'] > 0 || $totals['order_discount'] > 0)
        <tr>
            <td style="padding:3px 0; font-size:14px; color:#6d6660;">Discount</td>
            <td align="right" style="padding:3px 0; font-size:14px; color:#3f3b37;">
                − Tk {{ number_format($totals['item_discount'] + $totals['order_discount'], 2) }}
            </td>
        </tr>
    @endif
    <tr>
        <td style="padding:3px 0; font-size:14px; color:#6d6660;">Delivery</td>
        <td align="right" style="padding:3px 0; font-size:14px; color:#3f3b37;">Tk {{ number_format($totals['shipping'], 2) }}</td>
    </tr>
    <tr>
        <td style="padding:10px 0 0; border-top:2px solid #ece5db; font-size:15px; font-weight:600; color:#2f2c29;">Total</td>
        <td align="right" style="padding:10px 0 0; border-top:2px solid #ece5db; font-size:16px; font-weight:700; color:{{ $accent }};">
            Tk {{ number_format($totals['grand'], 2) }}
        </td>
    </tr>
    @if ($totals['paid'] > 0)
        <tr>
            <td style="padding:3px 0; font-size:13px; color:#6d6660;">Paid</td>
            <td align="right" style="padding:3px 0; font-size:13px; color:#3f3b37;">Tk {{ number_format($totals['paid'], 2) }}</td>
        </tr>
        <tr>
            <td style="padding:3px 0; font-size:13px; color:#6d6660;">Due on delivery</td>
            <td align="right" style="padding:3px 0; font-size:13px; color:#3f3b37;">Tk {{ number_format($totals['due'], 2) }}</td>
        </tr>
    @endif
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="border-collapse:collapse; margin-top:22px; background-color:#faf7f2; border-radius:8px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <tr>
        <td style="padding:16px 18px;">
            <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#9a938c;">Delivering to</p>
            <p style="margin:0; font-size:14px; line-height:21px; color:#3f3b37;">
                <strong>{{ $order->customer_name }}</strong><br />
                {{ $order->shippingAddressLine() }}<br />
                {{ $order->phone_number }}
            </p>
            <p style="margin:12px 0 0; font-size:13px; color:#6d6660;">
                Payment: {{ $order->payment_summary }}
                @if ($order->isPrepaid() && $order->payment_reference)
                    <br />Transaction ID: {{ $order->payment_reference }}
                @endif
                @if ($order->note)
                    <br />Note: {{ $order->note }}
                @endif
            </p>
        </td>
    </tr>
</table>
