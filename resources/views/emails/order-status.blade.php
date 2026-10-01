{{-- Customer's status update: shipped, delivered, cancelled and the rest. --}}
@extends('emails.layout')

@section('content')
    {{-- $order is absent only when previewing a shop that has no orders yet. --}}
    @if (! empty($order))
        @php $totals = $order->totals(); @endphp

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-collapse:collapse; background-color:#faf7f2; border-radius:8px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
            <tr>
                <td style="padding:18px 20px;">
                    <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#9a938c;">Order</p>
                    <p style="margin:0 0 14px; font-size:16px; font-weight:600; color:#2f2c29;">{{ $order->invoice_number }}</p>

                    <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#9a938c;">Total</p>
                    <p style="margin:0; font-size:15px; color:#3f3b37;">Tk {{ number_format($totals['grand'], 2) }}</p>

                    @if ($order->tracking_code)
                        <p style="margin:14px 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#9a938c;">Tracking</p>
                        <p style="margin:0; font-size:15px; color:#3f3b37;">
                            {{ $order->tracking_code }}
                            @if ($order->couriar_name)
                                <span style="color:#8b847d;">({{ $order->couriar_name }})</span>
                            @endif
                        </p>
                    @endif
                </td>
            </tr>
        </table>
    @endif
@endsection
