{{-- The shop's own copy of a new order. --}}
@extends('emails.layout')

@section('content')
    @if (! empty($order))
        @include('emails.partials.order-summary')
    @endif

    @if (! empty($adminUrl))
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
            <tr>
                <td style="border-radius:6px; background-color:{{ $brand['colour'] ?? '#1a2110' }};">
                    <a href="{{ $adminUrl }}"
                       style="display:inline-block; padding:11px 22px; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                        Open in the admin panel
                    </a>
                </td>
            </tr>
        </table>
    @endif
@endsection
