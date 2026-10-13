{{-- labelOnly (invoices): the blouse with its sleeve and size, then the
     requirement text; no price beside it and no internal note. --}}
@if (!empty($customization) && !empty($labelOnly))
    <div style="margin-top:5px;font-size:12px;line-height:1.5;overflow-wrap:anywhere;">
        <strong>{{ $customization['label'] ?? 'Custom Blouse' }}</strong><br>
        {{ $customization['sleeve_title'] ?? 'Sleeve Type' }}: {{ $customization['sleeve_label'] ?? '' }} · {{ $customization['size_title'] ?? 'Size' }}: {{ $customization['size_label'] ?? '' }}
        @if (!empty($customization['requirements']))<div style="white-space:pre-line;">Requirements: {{ $customization['requirements'] }}</div>@endif
    </div>
@elseif (!empty($customization))
    <div style="margin-top:5px;font-size:12px;line-height:1.5;overflow-wrap:anywhere;">
        <strong>{{ $customization['label'] ?? 'Custom Blouse' }} (+৳{{ number_format((float) ($customization['unit_price'] ?? 0), 2) }})</strong><br>
        {{ $customization['sleeve_title'] ?? 'Sleeve Type' }}: {{ $customization['sleeve_label'] ?? '' }} · {{ $customization['size_title'] ?? 'Size' }}: {{ $customization['size_label'] ?? '' }}
        @if (!empty($customization['requirements']))<div style="white-space:pre-line;">{{ $customization['requirements_title'] ?? 'Requirements' }}: {{ $customization['requirements'] }}</div>@endif
        @if (!empty($customization['note']) && empty($hideNote))<div>{{ $customization['note'] }}</div>@endif
    </div>
@endif
