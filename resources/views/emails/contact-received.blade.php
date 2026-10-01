{{-- Acknowledgement for someone who used the contact form. --}}
@extends('emails.layout')

@section('content')
    @if (! empty($enquiry))
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-collapse:collapse; background-color:#faf7f2; border-radius:8px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
            <tr>
                <td style="padding:18px 20px;">
                    <p style="margin:0 0 8px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#9a938c;">Your message</p>
                    <p style="margin:0; font-size:14px; line-height:22px; color:#3f3b37;">{!! nl2br(e($enquiry)) !!}</p>
                </td>
            </tr>
        </table>
    @endif
@endsection
