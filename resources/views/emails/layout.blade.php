{{--
    The frame every transactional email is drawn in.

    Written as nested tables with inline styles because that is what mail
    clients render reliably — Outlook has no flexbox and strips <style> blocks
    in some versions. The logo is attached to the message and referenced by
    content id, so it renders with no request back to this server; when the
    template is being previewed in a browser there is no message to attach to,
    and the same image is inlined as a data URI instead.
--}}
@php
    $accent = $brand['colour'] ?? '#1a2110';
    $logoWidth = $brand['logoWidth'] ?? 150;
    $logoHeight = $brand['logoHeight'] ?? null;
    $logoSrc = null;

    if (! empty($brand['logoPath'])) {
        $logoSrc = isset($message)
            ? $message->embed($brand['logoPath'])
            : ($brand['logoDataUri'] ?? null);
    }
@endphp
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $heading ?? ($brand['name'] ?? '') }}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ec; -webkit-text-size-adjust:100%;">
    {{-- Preheader: the line mail clients show beside the subject in the list. --}}
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">
        {{ \Illuminate\Support\Str::limit(strip_tags($intro ?? ''), 120) }}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#f4f1ec; padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
                       style="width:600px; max-width:100%; background-color:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e7e1d8;">

                    <!-- Masthead -->
                    <tr>
                        <td align="center" style="padding:28px 24px 20px; background-color:#ffffff; border-bottom:1px solid #f0ebe3;">
                            @if ($logoSrc)
                                {{-- The file behind $logoSrc is twice $logoWidth so it stays
                                     sharp on high-density screens; the width and height
                                     attributes are what scale it back down, and Outlook
                                     needs both or it draws the file at its native size. --}}
                                <img src="{{ $logoSrc }}" alt="{{ $brand['name'] ?? '' }}"
                                     width="{{ $logoWidth }}" @if ($logoHeight) height="{{ $logoHeight }}" @endif
                                     style="display:block; width:{{ $logoWidth }}px; max-width:60%; height:auto; border:0; margin:0 auto;" />
                            @else
                                <span style="font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:22px; font-weight:700; color:{{ $accent }};">
                                    {{ $brand['name'] ?? '' }}
                                </span>
                            @endif
                        </td>
                    </tr>

                    <!-- Heading -->
                    @if (! empty($heading))
                        <tr>
                            <td style="padding:28px 32px 0;">
                                <h1 style="margin:0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:22px; line-height:30px; font-weight:600; color:#2f2c29;">
                                    {{ $heading }}
                                </h1>
                            </td>
                        </tr>
                    @endif

                    <!-- Intro -->
                    @if (! empty($intro))
                        <tr>
                            <td style="padding:12px 32px 0;">
                                <p style="margin:0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:15px; line-height:24px; color:#5c5751;">
                                    {!! nl2br(e($intro)) !!}
                                </p>
                            </td>
                        </tr>
                    @endif

                    <!-- Body -->
                    <tr>
                        <td style="padding:24px 32px 8px;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Outro -->
                    @if (! empty($outro))
                        <tr>
                            <td style="padding:8px 32px 28px;">
                                <p style="margin:0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:14px; line-height:22px; color:#6d6660;">
                                    {!! nl2br(e($outro)) !!}
                                </p>
                            </td>
                        </tr>
                    @endif

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 32px 26px; background-color:#faf7f2; border-top:1px solid #f0ebe3;">
                            <p style="margin:0 0 6px; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:13px; line-height:20px; color:#7b746d;">
                                <strong style="color:#4a4540;">{{ $brand['name'] ?? '' }}</strong>
                                @if (! empty($brand['address'])) <br />{{ $brand['address'] }} @endif
                            </p>
                            <p style="margin:0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:13px; line-height:20px; color:#7b746d;">
                                @if (! empty($brand['phone'])) {{ $brand['phone'] }} @endif
                                @if (! empty($brand['phone']) && ! empty($brand['email'])) &nbsp;·&nbsp; @endif
                                @if (! empty($brand['email']))
                                    <a href="mailto:{{ $brand['email'] }}" style="color:{{ $accent }}; text-decoration:none;">{{ $brand['email'] }}</a>
                                @endif
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="margin:16px 0 0; font-family:'Segoe UI',Helvetica,Arial,sans-serif; font-size:12px; color:#a49c94;">
                    © {{ $brand['year'] ?? date('Y') }} {{ $brand['name'] ?? '' }}. This is an automated message.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
