{{-- Password reset link. The button and the plain URL carry the same link, because
     some clients strip styled anchors and a reset that cannot be clicked is a
     support call. --}}
@extends('emails.layout')

@section('content')
    @php $accent = $brand['colour'] ?? '#2c5015'; @endphp

    @if (! empty($resetUrl))
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-collapse:collapse;">
            <tr>
                <td align="center" style="padding:4px 0 20px;">
                    <a href="{{ $resetUrl }}"
                       style="display:inline-block; padding:14px 32px; background-color:{{ $accent }}; color:#ffffff;
                              font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:15px; font-weight:600;
                              line-height:20px; text-decoration:none; border-radius:8px;">
                        Reset my password
                    </a>
                </td>
            </tr>
            <tr>
                <td style="padding:0 0 4px;">
                    <p style="margin:0 0 6px; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:12px;
                              line-height:18px; color:#9a938c;">
                        If the button does not work, paste this address into your browser:
                    </p>
                    <p style="margin:0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:12px;
                              line-height:18px; word-break:break-all;">
                        <a href="{{ $resetUrl }}" style="color:{{ $accent }}; text-decoration:underline;">{{ $resetUrl }}</a>
                    </p>
                </td>
            </tr>
        </table>
    @endif
@endsection
