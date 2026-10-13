<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ siteInfo('app_name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Manrope:wght@500;600;700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap" rel="stylesheet" crossorigin />
    <style>
        /* Invoice — clean card layout: a dark green top band, cream panels and
           a light table. Markup and content are unchanged; only the look. */
        :root {
            --inv-green: #1f2a12;
            --inv-green-2: #2c5015;
            --inv-gold: #b8913a;
            --inv-cream: #faf6ee;
            --inv-line: #e7e0d2;
            --inv-text: #2b2a28;
            --inv-muted: #6f6a62;
        }

        @page {
            margin: 0;
            size: A4;
        }

        body {
            font-family: 'Poppins', 'Hind Siliguri', sans-serif;
            font-size: 12px;
            color: var(--inv-text);
            background-color: #ece8df;
            margin: 0;
            padding: 24px 0;
        }

        .invoice-page {
            width: 100%;
            max-width: 210mm;
            height: fit-content;
            min-height: 100vh;
            margin: 0 auto 24px;
            background-color: #fff;
            position: relative;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(31, 42, 18, 0.12);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .invoice-page p {
            margin-bottom: 4px;
        }

        /* Header: logo on the left, INVOICE on the right, a gold rule below */
        .invoice-header-container {
            position: relative;
            height: 116px;
            background: var(--inv-green);
            border-bottom: 4px solid var(--inv-gold);
        }

        .header-ribbon {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 40px;
        }

        .header-ribbon-label {
            color: #fff;
            font-family: 'Manrope', 'Poppins', sans-serif;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: 8px;
            text-transform: uppercase;
        }

        .header-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 40px;
        }

        .header-logo {
            display: inline-flex;
            padding: 10px 14px;
            background: #fff;
            border-radius: 8px;
        }

        .header-logo img {
            height: 60px;
        }

        /* The Chhondo logo: mark over word */
        .chhondo-invoice-logo {
            display: inline-grid;
            justify-items: center;
            gap: 4px;
        }

        .header-logo img.chhondo-invoice-mark { width: 54px; height: 47px; }
        .header-logo img.chhondo-invoice-word { width: 66px; height: 8px; }

        /* Bill-to and invoice details as two panels */
        .invoice-meta {
            padding: 26px 40px 4px;
        }

        .invoice-meta-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }

        .invoice-to {
            flex: 1 1 55%;
            padding: 14px 18px;
            border: 1px solid var(--inv-line);
            border-radius: 8px;
        }

        .invoice-to h5 {
            margin: 0 0 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--inv-gold);
        }

        .invoice-to p {
            color: var(--inv-text);
        }

        .invoice-info {
            flex: 1 1 45%;
            padding: 14px 18px;
            background-color: var(--inv-cream);
            border: 1px solid var(--inv-line);
            border-radius: 8px;
        }

        .invoice-info p {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 3px 0;
            margin: 0;
            border-bottom: 1px dashed var(--inv-line);
        }

        .invoice-info p:last-child {
            border-bottom: 0;
        }

        .invoice-info strong {
            font-weight: 600;
            color: var(--inv-muted);
        }

        .invoice-info span {
            font-weight: 600;
            text-align: right;
        }

        /* Items table: light header, ruled rows, no filled columns */
        .invoice-table-container {
            padding: 0 40px;
        }

        table.invoice-details {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 22px;
            border: 1px solid var(--inv-line);
            border-radius: 8px;
            overflow: hidden;
        }

        table.invoice-details th {
            background: var(--inv-cream);
            color: var(--inv-green-2);
            padding: 11px 15px;
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-bottom: 2px solid var(--inv-gold);
        }

        table.invoice-details th:first-child {
            text-align: left;
        }

        table.invoice-details td {
            background-color: #fff;
            padding: 12px 15px;
            border-bottom: 1px solid var(--inv-line);
            color: var(--inv-text);
            text-align: center;
            vertical-align: middle;
        }

        table.invoice-details tbody tr:last-child td {
            border-bottom: 0;
        }

        table.invoice-details tbody tr:nth-child(even) td {
            background-color: #fdfbf7;
        }

        table.invoice-details td:first-child {
            text-align: left;
            font-weight: 500;
        }

        table.invoice-details td:last-child {
            font-weight: 600;
            color: var(--inv-green-2);
        }

        /* Totals: a bordered summary with the grand total as a green band */
        .totals-section {
            padding: 0 40px;
            margin-top: 24px;
            display: flex;
            justify-content: flex-end;
        }

        .totals {
            width: 42%;
            padding: 10px 16px;
            border: 1px solid var(--inv-line);
            border-radius: 8px;
            background: #fff;
            text-align: right;
        }

        .totals p {
            margin: 0;
            padding: 7px 0;
            display: flex;
            justify-content: space-between;
            font-size: 12.5px;
            color: var(--inv-muted);
            border-bottom: 1px dashed var(--inv-line);
        }

        .totals p span:last-child {
            color: var(--inv-text);
            font-weight: 600;
        }

        .totals .grand-total {
            font-size: 15px;
            font-weight: 700;
            color: #fff;
            padding: 10px 14px;
            margin: 10px -6px 4px;
            background: var(--inv-green);
            border: 0;
            border-left: 4px solid var(--inv-gold);
            border-radius: 6px;
        }

        .totals .grand-total span:last-child {
            color: #fff;
            font-weight: 700;
        }

        /* Terms Section - inline heading */
        .terms-conditions {
            padding: 0 40px;
            margin-top: 10px;
            width: 50%;
            flex-direction: column;
            display: flex;
            gap: 8px;
        }

        .terms-conditions h6 {
            font-size: 13px;
            font-weight: bold;
            color: var(--inv-text);
            display: inline;
        }

        .terms-conditions p {
            font-size: 11px;
            color: var(--inv-muted);
            margin: 0;
            display: inline;
        }

        /* Footer: contact row, then a full-width green band with the message */
        /* Sections sit together; only the footer is pushed to the bottom. */
        .footer-info {
            margin-top: auto;
            padding-top: 32px;
            position: relative;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        .footer_image {
            position: relative;
            height: 64px;
            overflow: hidden;
            background: var(--inv-green);
            border-top: 4px solid var(--inv-gold);
        }

        .footer-ribbon {
            display: none;
        }

        .footer-message {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 40px;
        }

        .footer-message h6 {
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 1px;
            color: #fff;
            margin: 0;
        }

        .footer-info-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 12px;
            margin: 0 40px;
            padding: 18px 0;
            font-size: 11.5px;
            color: var(--inv-muted);
            background-color: #fff;
            border-top: 1px solid var(--inv-line);
        }

        .footer-info-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            text-align: left;
        }

        .icon-circle {
            flex: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--inv-cream);
            border: 1px solid var(--inv-line);
            color: var(--inv-green-2);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Signature line */
        .sig {
            margin-bottom: 0;
            border-top: 1px solid var(--inv-text);
            padding-top: 4px;
        }

        @media print {

            .duplicateArea,
            .print-button {
                display: none;
            }

            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: #fff !important;
                padding: 0 !important;
            }

            .invoice-page {
                margin: 0 auto !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                break-after: page;
            }

            .invoice-page:last-of-type {
                break-after: auto;
            }

            .invoice-header-container,
            .footer_image,
            .totals .grand-total {
                background: var(--inv-green) !important;
                color: #fff !important;
            }

            table.invoice-details th,
            .invoice-info,
            .icon-circle {
                background: var(--inv-cream) !important;
            }

            .footer-info-content {
                background-color: #ffffff !important;
            }
        }

        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--inv-green);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 9px 18px;
            font-family: 'Manrope', 'Poppins', sans-serif;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(31, 42, 18, 0.25);
            cursor: pointer;
            z-index: 1000;
        }

        .print-button:hover {
            background-color: var(--inv-green-2);
        }
    </style>
</head>
@use('App\Models\SiteInfo')
@php
    $siteData = SiteInfo::first();
@endphp


<body>
    @foreach ($orders as $invoice)
        <div class="invoice-page">
            <!-- Header -->
            <div class="invoice-header-container">
                <div class="header-ribbon">
                    <span class="header-ribbon-label">Invoice</span>
                </div>
                <div class="header-content">
                    <div class="header-logo">
                        <span class="chhondo-invoice-logo" role="img" aria-label="Chhondo">
                        <img src="{{ asset('assets/chhondo/logo-mark-dark.svg') }}" alt="" class="chhondo-invoice-mark">
                        <img src="{{ asset('assets/chhondo/logo-word-dark.svg') }}" alt="" class="chhondo-invoice-word">
                    </span>
                    </div>
                </div>
            </div>

            <!-- Meta -->
            <div class="invoice-meta">
                <div class="invoice-meta-row">
                    <div class="invoice-to">
                        <h5>Invoice To:</h5>
                        <p>Name: <strong>{{ $invoice->customer_name }}</strong></p>
                        <p>Phone number: {{ $invoice->phone_number ?? 'N/A' }}</p>
                        <p>Address: {{ $invoice->address ?? 'N/A' }}</p>
                    </div>
                    <div class="invoice-info">
                        <p><strong>INVOICE NO:</strong> <span>{{ $invoice->invoice_number }}</span></p>
                        <p><strong>Invoice Date:</strong> <span>{{ $invoice->created_at->format('d M, Y') }}</span></p>
                        <p><strong>Order Type:</strong> <span>COD</span></p>
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="invoice-table-container">
                <table class="invoice-details">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($invoice->items as $item)
                            <tr>
                                <td>{{ $item->product->product_name }}@include('partials.blouse-customization', ['customization' => $item->blouse_customization, 'labelOnly' => true])</td>
                                <td>{{ $item->quantity }}</td>
                                <td @if (!empty($item->blouse_customization)) style="vertical-align:top" @endif>
                                    {{-- Custom blouse: the saree's price level with its name, the blouse's level with its label; Total adds the two. --}}
                                    @if (!empty($item->blouse_customization))
                                        <div>Tk. {{ number_format((float) $item->price - (float) ($item->blouse_customization['unit_price'] ?? 0), 2, '.', '') }}</div>
                                        <div style="margin-top:5px;">Tk. {{ number_format((float) ($item->blouse_customization['unit_price'] ?? 0), 2, '.', '') }}</div>
                                    @else
                                        Tk. {{ $item->price }}
                                    @endif
                                </td>
                                <td>Tk. {{ $item->quantity * $item->price - $item->discount * $item->quantity }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Totals -->
            <div class="totals-section">
                <div class="totals">
                    <p><span>Sub Total:</span> <span>Tk.
                            {{ $invoice->items->sum(fn($i) => $i->quantity * $i->price) }}</span></p>
                    <p><span>Discount:</span> <span>Tk.
                            {{ number_format($invoice->discount ?? ($invoice->pos_discount ?? 0), 2) }}</span></p>

                    <p><span>Shipping:</span> <span>Tk. {{ $invoice->delivery_charge }}</span></p>
                    <p class="grand-total"><span>Grand Total:</span> <span>Tk.
                            {{ $invoice->items->sum(fn($i) => $i->quantity * $i->price - $i->discount * $i->quantity) +
                                $invoice->delivery_charge -
                                $invoice->discount -
                                $invoice->paid_amount }}
                        </span></p>
                </div>
            </div>

            <!-- Terms -->


            <div class="footer-info">
                <div class="footer-info-content">
                    <div class="footer-info-item">
                        <div class="icon-circle">
                            <!-- Phone SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M3.654 1.328a.678.678 0 0 1 .741-.041l2.547 1.266a.678.678 0 0 1 .291.91l-1.013 2.027a.678.678 0 0 0 .145.77l2.457 2.457a.678.678 0 0 0 .77.145l2.027-1.013a.678.678 0 0 1 .91.291l1.266 2.547a.678.678 0 0 1-.041.741l-1.157 1.543c-.382.51-.994.77-1.65.63a17.534 17.534 0 0 1-7.05-3.905A17.534 17.534 0 0 1 2.038 4.94c-.14-.656.12-1.268.63-1.65l1.543-1.157z" />
                            </svg>
                        </div>
                        <span>{{ $siteData->phone_number }}</span>
                    </div>

                    <div class="footer-info-item">
                        <div class="icon-circle">
                            <!-- Email SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.217l-8 4.8-8-4.8V4zm0 1.383v6.617A2 2 0 0 0 2 14h12a2 2 0 0 0 2-2V5.383l-7.555 4.533a.5.5 0 0 1-.89 0L0 5.383z" />
                            </svg>
                        </div>
                        <span>{{ $siteData->store_email }}</span>
                    </div>

                    <div class="footer-info-item">
                        <div class="icon-circle">
                            <!-- Address SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 3.038 5.5 10.5 5.5 10.5s5.5-7.462 5.5-10.5A5.53 5.53 0 0 0 8 0zm0 7.5A2 2 0 1 1 8 3a2 2 0 0 1 0 4.5z" />
                            </svg>
                        </div>
                        <span>{{ $siteData->address }}</span>
                    </div>

                    <div class="footer-info-item">
                        <div class="icon-circle">
                            <!-- Signature SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.207 3.94l-2.146-2.147L13.356.5a.5.5 0 0 1 .707 0l1.439 1.44zM12.146 2.854 3 12H1v-2l9.146-9.146 2.146 2.146z" />
                            </svg>
                        </div>
                        <p class="sig">Authority Signature</p>
                    </div>
                </div>

                <div class="footer_image">
                    <div class="footer-ribbon"></div>
                    <div class="footer-message">
                        <h6>Thanks for your business!</h6>
                    </div>
                </div>
            </div>



        </div>
    @endforeach




    <button class="print-button" onclick="window.print()">Print</button>

</body>

</html>
