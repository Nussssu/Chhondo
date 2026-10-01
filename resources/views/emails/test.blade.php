{{-- Proves the saved mail server works, and shows how the branding renders. --}}
@extends('emails.layout')

@section('content')
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border-collapse:collapse; background-color:#faf7f2; border-radius:8px; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <tr>
            <td style="padding:18px 20px; font-size:14px; line-height:22px; color:#3f3b37;">
                If you are reading this, the mail server saved in Store settings › Email is working
                and your logo is being attached to the message rather than linked from the site.
            </td>
        </tr>
    </table>
@endsection
