<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        /* General styles */
        body {
            font-size: 12px;
            line-height: 1.4;
        }

        .order-status {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
        }

        .status-returned {
            background-color: #ffecec;
            color: #dc3545;
        }

        .status-completed {
            background-color: #e8f5e9;
            color: #28a745;
        }

        .status-pending {
            background-color: #fff3e0;
            color: #fd7e14;
        }

        .product-details {
            font-size: 0.9em;
            color: #333;
        }

        .product-options {
            font-size: 0.85em;
            color: #555;
            margin-top: 2px;
        }

        .attribute-tag {
            display: inline-block;
            padding: 1px 4px;
            background-color: #f8f9fa;
            border-radius: 2px;
            margin: 1px;
            border: 1px solid #dee2e6;
        }

        /* Print-specific styles */
        @media print {
            .no-print {
                display: none !important;
            }

            body {
                width: 100%;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 100% !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            .card {
                border: none !important;
                box-shadow: none !important;
            }

            .card-header {
                background-color: transparent !important;
                padding: 10px 15px !important;
            }

            .table {
                font-size: 11px !important;
                width: 100% !important;
                margin-bottom: 0 !important;
                page-break-inside: auto !important;
            }

            .table th {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
            }

            td {
                page-break-inside: avoid !important;
            }

            thead {
                display: table-header-group;
            }

            tfoot {
                display: table-footer-group;
            }

            .table td,
            .table th {
                padding: 4px 8px !important;
            }

            .product-details {
                page-break-inside: avoid !important;
            }

            hr {
                margin: 4px 0 !important;
                border-color: #ddd !important;
            }

            @page {
                margin: 0.5cm;
                size: auto;
            }
        }

        /* Responsive table adjustments */
        .table-responsive {
            overflow-x: visible !important;
        }

        /* Column width controls */
        .table th:nth-child(1) {
            width: 8%;
        }

        /* Order ID */
        .table th:nth-child(2) {
            width: 20%;
        }

        /* Customer Details */
        .table th:nth-child(3) {
            width: 20%;
        }

        /* Product Information */
        .table th:nth-child(4) {
            width: 12%;
        }

        /* Amount */
        .table th:nth-child(5) {
            width: 20%;
        }

        /* Status */
        .table th:nth-child(6) {
            width: 10%;
        }

        /* Invoice No */

        .bkp-images {
            width: 70px;
            height: 70px;
            overflow: hidden;
            border-radius: 4px;
        }

        @media print {
            .no-print {
                display: none !important;
            }
        }

        .bkp-images img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        small{
            font-size:12px;
            color:black;
        }
    </style>
</head>

<body>
    <div class="container mt-3">
        <div class="card">
            <div class="card-header">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        @if ($media && $media->logo)
                            <img src="{{ asset($media->logo) }}" width="60" height="60" alt="Logo" />
                        @else
                            <h5 class="mb-0">{{ config('app.name', 'E-commerce') }}</h5>
                        @endif
                    </div>
                    <div class="text-center">
                        <h6>Order Information</h6>
                        <p class="mb-0 small">Date: {{ now()->format('Y-m-d') }}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-fig-tertiary btn-fig-sm print no-print">Print</button>
                        <button class="btn btn-fig-tertiary btn-fig-sm pdf no-print">PDF</button>
                        <button class="btn btn-fig-tertiary btn-fig-sm jpg no-print">JPG</button>
                    </div>
                </div>
            </div>
            <div class="card-body p-2">
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Details</th>
                                <th>Image</th>
                                <th>Product Information</th>
                                <th>Amount</th>
                                <th>CN NO</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($orders as $order)
                                <tr>
                                    <td>#{{ $order->id }}</td>
                                    <td>
                                        <strong>{{ $order->customer_name }}</strong><br>
                                        <small>Phone: {{ $order->phone_number }}</small><br>
                                        <small>Address: {{ $order->address ?? 'N/A' }}</small>
                                    </td>
                                    <td>
                                        @foreach ($order->items as $item)
                                            <div class="product-details bkp-images">
                                                <img src="{{ $item->product_info->featured_image }}" alt="Product Image"
                                                    class="product-image">
                                            </div>
                                            @if (!$loop->last)
                                                <hr class="my-1">
                                            @endif
                                        @endforeach
                                    </td>
                                    <td>
                                        @foreach ($order->items as $item)
                                            <div class="product-details">
                                                <strong>{{ $item->product_info->product_name }}</strong>
                                                <!-- @if ($item->product_info->product_code)
<small class="text-muted">({{ $item->product_info->product_code }})</small>
@endif -->
                                                <div class="product-options">
                                                    <small>Qty: {{ $item->quantity }} ×
                                                        {{ number_format($item->price, 2) }} TK</small>
                                                    @foreach ($item['option'] as $option)
                                                        <br><small>{{ $option['attributeOption']['attribute']['name'] }}:
                                                            {{ $option['attributeOption']['name'] }}</small>
                                                    @endforeach
                                                </div>
                                            </div>
                                            @if (!$loop->last)
                                                <hr class="my-1">
                                            @endif
                                        @endforeach
                                    </td>
                                    <td>
                                        {{ number_format($order->total_price + ($order->delivery_charge ?? 0), 2) }} TK
                                        @if ($order->delivery_charge > 0)
                                            <br><small></small>
                                        @endif
                                    </td>

                                    <td>{{ $order->consignment_id }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                @if ($orders->count() > 0)
                <div class="text-end mt-3">
                    <h6>Total Orders Value:
                        {{ number_format($orders->sum('total_price') + $orders->sum('delivery_charge'), 2) }} TK
                    </h6>
                </div>
            @endif
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        document.querySelector('.print').addEventListener('click', function() {
            window.print();
        });



        // Make jsPDF available globally
        window.jsPDF = window.jspdf.jsPDF;

        // PDF generation
        document.querySelector('.pdf').addEventListener('click', function() {
            const element = document.querySelector(".card");
            if (!element) {
                console.error("Error: Element not found!");
                return;
            }

            const images = element.getElementsByTagName('img');
            let loadedImages = 0;
            const totalImages = images.length;

            const generatePDF = () => {
                html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    onclone: (clonedDoc) => {
                        clonedDoc.querySelectorAll('.no-print').forEach(el => {
                            el.style.display = 'none';
                        });
                    }
                }).then(canvas => {
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgWidth = pageWidth - 20;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    let position = 10;
                    let remainingHeight = imgHeight;

                    pdf.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight);

                    while (remainingHeight > pdf.internal.pageSize.getHeight() - 20) {
                        pdf.addPage();
                        position = -(remainingHeight - (pdf.internal.pageSize.getHeight() - 20));
                        remainingHeight -= pdf.internal.pageSize.getHeight() - 20;
                        pdf.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight);
                    }

                    pdf.save('order-document.pdf');
                });
            };

            if (totalImages === 0) {
                generatePDF();
            } else {
                Array.from(images).forEach(img => {
                    if (img.complete) {
                        if (++loadedImages === totalImages) generatePDF();
                    } else {
                        img.addEventListener('load', () => {
                            if (++loadedImages === totalImages) generatePDF();
                        });
                        img.addEventListener('error', () => {
                            if (++loadedImages === totalImages) generatePDF();
                        });
                    }
                });
            }
        });

        // JPG generation
        document.querySelector('.jpg').addEventListener('click', function() {
            const element = document.querySelector(".card");
            if (!element) {
                console.error("Error: Element not found!");
                return;
            }

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    clonedDoc.querySelectorAll('.no-print').forEach(el => {
                        el.style.display = 'none';
                    });
                }
            }).then(canvas => {
                // Create a download link for the image
                const link = document.createElement('a');
                link.download = 'order-document.jpg';
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
            });
        });
    </script>
</body>

</html>
