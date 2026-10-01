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
        @page {
            margin: 0;
            size: A4;
        }

        body {
            font-family: 'Poppins', 'Hind Siliguri', sans-serif;
            font-size: 12px;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
        }

        .invoice-page {
            width: 100%;
            max-width: 210mm;
            height: fit-content;
            min-height: 100vh;
            margin: auto;
            background-color: #fff;
            position: relative;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Header Section */
        .invoice-header-container {
            position: relative;
            height: 120px;
            overflow: hidden;
            border-bottom: 1px solid #1c1c1c;
        }

        .header-ribbon {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 55%;
            min-width: 260px;
            background: linear-gradient(90deg, #1c330d 0%, #356019 100%);
            clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%);
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 40px;
        }

        .header-ribbon-label {
            color: #fff;
            font-family: 'Manrope', 'Poppins', sans-serif;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 3px;
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

        .header-logo img {
            height: 60px;
        }

        /* Invoice Meta */
        .invoice-meta {
            padding: 20px 40px;
        }

        .invoice-meta-row {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .invoice-to {
            width: 50%;
        }

        .invoice-to h5 {
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }

        .invoice-info {
            width: 40%;
            background-color: #f8f9fa;
            border-left: 3px solid #356019;
            padding: 10px 20px;
            border-radius: 5px;
            text-align: right;
        }

        /* Table Styling */
        .invoice-table-container {
            padding: 0 40px;
        }

        table.invoice-details {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
        }

        table.invoice-details th {
            background: #356019;
            color: white;
            padding: 12px 15px;
            text-align: center;
            font-size: 13px;
        }

        table.invoice-details th:first-child {
            text-align: left;
        }

        table.invoice-details td {
            background-color: #fefefe;
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
            color: #333;
            text-align: center;
        }

        table.invoice-details td:first-child {
            text-align: left;
        }

        /* Gray columns */
        table.invoice-details td:nth-child(2),
        table.invoice-details td:last-child {
            background-color: #cdcdce;
        }

        table.invoice-details th:nth-child(2) {
            background-color: #618B46;
        }

        table.invoice-details th:last-child {
            background-color: #234011;
        }

        /* Totals Section */
        .totals-section {
            padding: 0 40px;
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }

        .totals {
            width: 40%;
            text-align: right;
        }

        .totals p {
            margin: 0;
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            font-size: 13px;
        }

        .totals .grand-total {
            font-size: 16px;
            font-weight: bold;
            color: white;
            padding: 10px 15px;
            background: linear-gradient(to right, #234011, #356019);
            border-radius: 5px;
            margin-top: 10px;
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
            color: #333;
            display: inline;
        }

        .terms-conditions p {
            font-size: 11px;
            color: #777;
            margin: 0;
            display: inline;
        }

        /* Footer Container */
        .footer-info {
            position: relative;
            /* margin-top: auto; */
            page-break-inside: avoid;
            /* Prevent breaking across pages */
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        /* Footer ribbon with overlay message */
        .footer_image {
            position: relative;
            height: 100px;
            overflow: hidden;
        }

        .footer-ribbon {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, #356019 0%, #1c330d 100%);
            clip-path: polygon(35% 0, 100% 0, 100% 100%, 20% 100%);
            z-index: 1;
        }

        .footer-message {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 40px;
        }

        .footer-message h6 {
            font-size: 16px;
            font-weight: bold;
            margin: 0;
        }

        /* Footer Info Above Image */
        .footer-info-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 20px 40px 20px;
            font-size: 12px;
            color: #555;
            background-color: #fff;
        }

        /* Info Items (with SVG) */
        .footer-info-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            text-align: left;
        }

        /* Circle Background for SVG Icons */
        .icon-circle {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Signature line */
        .sig {
            margin-bottom: 0;
            border-top: 1px solid black;
            padding-top: 4px;
        }

        /* Ensure footer stays on one page when printing */
        @media print {

            .duplicateArea,
            .print-button {
                display: none;
            }

            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: #f0f2f5 !important;
            }

            .invoice-details th {
                background: #356019 !important;
                color: white !important;
            }

            .invoice-details th:nth-child(2) {
                background-color: #618B46 !important;
            }

            .invoice-details th:last-child {
                background-color: #234011 !important;
            }

            .invoice-details td:nth-child(2),
            .invoice-details td:last-child {
                background-color: #cdcdce !important;
            }

            .invoice-info {
                background-color: #f8f9fa !important;
                border-left: 3px solid #356019 !important;
            }

            .grand-total {
                background: linear-gradient(to right, #234011, #356019) !important;
                color: white !important;
            }

            .header-ribbon {
                background: linear-gradient(90deg, #1c330d 0%, #356019 100%) !important;
            }

            .footer-ribbon {
                background: linear-gradient(90deg, #356019 0%, #1c330d 100%) !important;
            }

            .icon-circle {
                background: #f0f0f0 !important;
            }

            .invoice-page {
                background-color: #ffffff !important;
            }

            .footer-info-content {
                background-color: #ffffff !important;
            }
        }




        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #356019;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-family: 'Manrope', 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
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
                        <img src="{{ asset(getMedia('logo')) }}" alt="Logo">
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
                                <td>{{ $item->product->product_name }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>Tk. {{ $item->price }}</td>
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
