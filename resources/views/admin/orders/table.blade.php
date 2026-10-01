<div class="orders-table-wrapper">
    <table class="table table-striped table-hover orders-table-compact" id="orderTab">
        <thead>
            <tr>
                <th>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="selectAll">
                        Date
                    </div>
                </th>
                <th>Customer Info</th>
                <th>Product Info</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th class="text-center">Order Note</th>
                <th>Courier Status</th>
                <th class="text-center">Comment</th>
                <th class="text-center">Actions</th>
            </tr>
        </thead>
        <tbody id="ordersBody">
            @foreach ($orders as $order)
            <tr data-order-id="{{ $order->id }}">
                {{-- Date Cell (largely unchanged) --}}
                <td>
                    @php
                    $isRecent = $order->created_at->greaterThan(now()->subDay());
                    $orderNumber = '';
                    $userOrders = $order->user
                    ? $order->user->orders->sortBy('created_at')->pluck('id')->values()
                    : collect();

                    if ($userOrders->isNotEmpty()) {
                    $orderNumber = ordinal($userOrders->search($order->id) + 1);
                    }
                    @endphp
                    <div class="form-check form-check-success">
                        <input class="form-check-input order-checkbox" type="checkbox" value="{{ $order->id }}">
                        <label class="form-check-label fw-bold">
                            <span class="text-primary">{{ $isRecent ? $order->created_at->diffForHumans() :
                                $order->created_at->format('d-m-Y') }}</span>
                        </label>
                        <br>
                        @if ($orderNumber)
                        <small class="badge status-badge-order-number">{{ $orderNumber }} order</small><br>
                        @endif
                        <span class="badge status-badge-invoice">Invoice: {{ $order->invoice_number }}</span>
                        @if ($order->author)
                        <span class="mt-2 d-flex gap-2 align-items-center"><i class="bi-person-check"></i>
                            {{ $order->author->name }}</span>
                        @endif
                    </div>
                </td>

                {{-- NEW: Customer Info with Icons --}}
                <td class="customer-info-cell">
                    <div class="text-dark text-decoration-none">
                        <div class="d-flex align-items-center gap-2 text-dark text-decoration-none">
                            <a href="{{ route('users', ['user_id' => $order->user_identifier]) }}">
                                @if ($order->customer_info && $order->customer_info->image)
                                <img src="{{ asset($order->customer_info->image) }}" width="30" height="30"
                                    style="border-radius: 100%" alt="{{ $order->customer_name }}" />
                                @else
                                <img src="https://ui-avatars.com/api/?name={{ urlencode($order->customer_name ?? 'Unknown') }}&size=25&background=random"
                                    width="30" height="30" style="border-radius: 100%"
                                    alt="{{ $order->customer_name ?? 'Customer Avatar' }}" />
                                @endif
                            </a>


                            <div>
                                <div class="customer-info-item fw-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                        class="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path fill-rule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                    </svg>
                                    {{ Str::limit($order->customer_name, 15, '...') }}
                                </div>
                                <a href="tel:{{ $order->phone_number }}" class="customer-info-item ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                        class="bi bi-telephone-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.28 1.465l-2.135 2.136a11.942 11.942 0 0 0 6.014 6.015l2.136-2.136a1.453 1.453 0 0 1 1.466.28l2.296 2.296c.423.329.974.445 1.465.28a1.745 1.745 0 0 1 .163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                    </svg>
                                    {{ $order->phone_number }}
                                </a>
                                <div class="customer-info-item ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                        class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                    </svg>
                                    <p>
                                        {{ $order->address }}
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </td>

                {{-- Product Info Cell (Unchanged) --}}
                <td class="product-info-cell">
                    <div class="product-grid">
                        @php $totalItems = count($order['items']); @endphp

                        @foreach ($order['items'] as $index => $item)
                        <div class="product-item {{ $index > 0 ? 'extra-product d-none' : '' }}">
                            <div>
                                <img src="{{ asset($item['product_info']['featured_image']) }}" width="50"
                                    height="50" />
                            </div>
                            <div>
                                <span title="{{ $item['product_info']['product_name'] }}" style="cursor: pointer;">
                                    {{ Str::limit($item['product_info']['product_name'], 11, '...') }}
                                </span><br>
                                <span>Code: {{ $item['product_info']['product_code'] }}</span><br>
                                <span>Quantity: {{ $item['quantity'] }}</span><br>
                                @if (!empty($item['option']))
                                @foreach ($item['option'] as $option)
                                <span>
                                    {{ $option['attributeOption']['attribute']['name'] ?? 'N/A' }}:
                                    {{ $option['attributeOption']['name'] ?? 'N/A' }}
                                </span><br>
                                @endforeach
                                @endif
                                @if (!empty($item['blouse_choice']))
                                <span class="badge"
                                    style="background-color: {{ $item['blouse_choice'] === 'with' ? '#356019' : '#8c7256' }};
                                           color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                                    {{ $item['blouse_choice'] === 'with' ? 'With Blouse' : 'Without Blouse' }}
                                </span>
                                @endif
                            </div>
                        </div>
                        @endforeach
                    </div>

                    @if ($totalItems > 1)
                    <button class="btn btn-fig-link btn-fig-sm p-0 toggle-products">Show more</button>
                    @endif
                </td>


                {{-- Total Price Cell (Unchanged) --}}
                <td>{{ ($order->total_price + $order->delivery_charge ?? 0) - $order->discount??0 }}</td>

                {{-- NEW: Order Status as Bootstrap Dropdown --}}
                <td>
                    @php
                    $statusColors = [
                    'pending' => [
                    'btn' => 'status-btn-pending',
                    'item' => 'status-item-pending',
                    ],
                    'processed' => [
                    'btn' => 'status-btn-processed',
                    'item' => 'status-item-processed',
                    ],
                    'on delivery' => [
                    'btn' => 'status-btn-ondelivery',
                    'item' => 'status-item-ondelivery',
                    ],
                    'shipped' => [
                    'btn' => 'status-btn-shipped',
                    'item' => 'status-item-shipped',
                    ],
                    'delivered' => [
                    'btn' => 'status-btn-delivered',
                    'item' => 'status-item-delivered',
                    ],
                    'cancelled' => [
                    'btn' => 'status-btn-cancelled',
                    'item' => 'status-item-cancelled',
                    ],
                    'returned' => [
                    'btn' => 'status-btn-returned',
                    'item' => 'status-item-returned',
                    ],
                    'incomplete' => [
                    'btn' => 'status-btn-incomplete',
                    'item' => 'status-item-incomplete',
                    ],
                    ];

                    $statusClass = $statusColors[$order->order_status]['btn'] ?? 'bg-light text-dark';
                    @endphp

                    <div class="dropdown status-dropdown">
                        <button class="btn btn-fig-tertiary btn-fig-sm dropdown-toggle {{ $statusClass }}" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            {{ ucfirst($order->order_status) }}
                        </button>
                        <ul class="dropdown-menu">
                            @foreach (['pending', 'processed', 'on delivery', 'delivered', 'shipped', 'cancelled',
                            'returned', 'incomplete'] as $status)
                            @php
                            $itemClass = $statusColors[$status]['item'] ?? 'bg-light text-dark';
                            @endphp
                            <li>
                                <a class="dropdown-item {{ $itemClass }} order-status" href="#"
                                    data-order-id="{{ $order->id }}" data-status="{{ $status }}"
                                    data-btn-class="{{ $statusColors[$status]['btn'] ?? 'bg-light text-dark' }}">
                                    {{ ucfirst($status == 'shipped' ? 'Partial delivery' : $status) }}
                                </a>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                </td>



                {{-- NEW: Order Note with Icon Button --}}
                <td class="text-center">
                    <div class="d-flex flex-column align-items-center gap-1">
                        <span class="badge status-badge-note order-note" data-order-id="{{ $order->id }}">{{
                            Str::limit($order->note, 10, '...') ?? 'N/A' }}</span>
                        <button class="btn btn-fig-tertiary btn-fig-sm edit-note-btn" data-order-id="{{ $order->id }}"
                            data-bs-toggle="modal" data-bs-target="#orderNoteModal" title="Edit Note">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-pencil" viewBox="0 0 16 16">
                                <path
                                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </button>
                    </div>
                </td>

                {{-- Courier Status Cell (Unchanged) --}}
                <td>
                    <div class="d-flex flex-column gap-2 align-items-center">

                        @if ($order->couriar_name)
                        <a href="{{ $order->tracking_code }}" target="_blank" class="badge status-badge-track">Track
                            order</a>
                        <a href="#" class="ms-1 courier-tracking badge status-badge-consignment"
                            data-consignment-id="{{ $order->consignment_id }}" data-bs-toggle="modal"
                            data-bs-target="#consignmentModal">{{ $order->consignment_id }}</a>

                        <span class="badge status-badge-courier">{{ ucfirst($order->couriar_name) }}</span>
                        @else
                        <span class="badge status-badge-na">N/A</span>
                        @endif
                    </div>
                </td>

                {{-- NEW: Comment with Icon Button --}}
                <td class="text-center" data-order-id="{{ $order->id }}">
                    <div class="d-flex flex-column align-items-center gap-1">
                        <span class="order-comment">{{ $order->comment?->name ?? 'N/A' }}</span>
                        <button class="btn btn-fig-tertiary btn-fig-sm edit-comment-btn" data-order-id="{{ $order->id }}"
                            data-bs-toggle="modal" data-bs-target="#commentModal" title="Edit Comment">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-pencil" viewBox="0 0 16 16">
                                <path
                                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </button>
                    </div>
                </td>



                {{-- NEW: Actions with Rounded Buttons and Vertical Layout --}}
                <td class="text-center action-cell">

                    <div class="d-flex align-items-center gap-1">
                        <button type="button" class="fraud-check-btn btn btn-fig-black btn-fig-sm rounded-circle"
                            data-phone="{{ $order->phone_number }}" title="Fraud Check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-shield-check" viewBox="0 0 16 16">
                                <path
                                    d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.06.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.95-.325-1.99-.676-2.837-.855A1.117 1.117 0 0 0 8 1.511a1.117 1.117 0 0 0-2.662.079zM14 1.77a.5.5 0 0 1 .5.5v11.5a.5.5 0 0 1-1 0V2.27a.5.5 0 0 1 .5-.5z" />


                            </svg>
                        </button>
                        <a href="{{ route('admin.orders.show', $order->id) }}" target="_blank" rel="noopener"
                            class="btn btn-fig-black btn-fig-sm rounded-circle" title="View Invoice">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                <path
                                    d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                        </a>
                        <button type="button" class="view-order-btn btn btn-fig-black btn-fig-sm rounded-circle"
                            data-order-id="{{ $order->id }}" title="View Order">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-card-text" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </button>
                    </div>

                    <div class="d-flex align-items-center gap-1 mt-1">
                        <button type="button" class="edit-order-btn btn btn-fig-tertiary btn-fig-sm rounded-circle"
                            data-order-id="{{ $order->id }}" title="Edit Order">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd"
                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11A1.5 1.5 0 0 0 15 13.5V5h-1v8.5A.5.5 0 0 1 13.5 14h-11A.5.5 0 0 1 2 13.5V2.5A.5.5 0 0 1 2.5 2H9v-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                        </button>
                        <a href="{{ route('admin.orders.delete', $order->id) }}"
                            class="btn btn-fig-danger btn-fig-sm delete-order-btn rounded-circle" title="Delete Order">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" fill="currentColor"
                                class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path
                                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5zM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528zM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5z" />
                            </svg>
                        </a>
                    </div>

                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
<div class="mt-3">
    {{ $orders->withQueryString()->links() }}
</div>