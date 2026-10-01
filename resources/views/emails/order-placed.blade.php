{{-- Customer's order confirmation. --}}
@extends('emails.layout')

@section('content')
    {{-- $order is absent only when previewing a shop that has no orders yet. --}}
    @if (! empty($order))
        @include('emails.partials.order-summary')
    @endif
@endsection
