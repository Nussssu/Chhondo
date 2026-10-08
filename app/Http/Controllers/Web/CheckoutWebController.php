<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Propaganistas\LaravelPhone\Rules\Phone as PhoneRule;
use App\Services\Admin\Cart\CartServiceInterface;
use App\Services\Admin\Order\OrderServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CheckoutWebController extends Controller
{
    protected $cartService;
    protected $orderService;

    public function __construct(CartServiceInterface $cartService, OrderServiceInterface $orderService)
    {
        $this->cartService  = $cartService;
        $this->orderService = $orderService;
    }

    /**
     * Resolve the user identifier: auth user id or session guest_id.
     */
    protected function getUserIdentifier(Request $request): string
    {
        if (auth()->check()) {
            return (string) auth()->id();
        }

        // Accept guest_id from frontend (localStorage) to match the cart records
        $frontendGuestId = $request->input('guest_id') ?: $request->header('X-Guest-Id');
        if ($frontendGuestId) {
            $request->session()->put('guest_id', $frontendGuestId);
            return $frontendGuestId;
        }

        return $request->session()->get('guest_id', 'guest_' . time());
    }

    public function submit(Request $request)
    {
        $request->validate([
            'user_name'     => 'required|string|max:255',
            'phone_number'  => ['required', 'string', 'max:20', (new PhoneRule)->country(['BD'])->international()->mobile()],
            'address'       => 'required|string|max:1000',
            'delivery_area' => 'required|string',
            // 'cod', 'online' (SSLCommerz) or 'bkash'. Anything else, or an
            // absent value, is cash.
            'payment_type'  => 'nullable|in:cod,online,bkash',
        ]);

        // Optional: create a customer account during checkout. The email is the
        // username; the password comes from the checkout form. Only for guests.
        if (! auth()->check() && $request->boolean('create_account')) {
            $request->validate([
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            $user = \App\Models\User::create([
                'name'     => $request->input('user_name'),
                'email'    => $request->input('email'),
                'phone'    => $request->input('phone_number'),
                'password' => \Illuminate\Support\Facades\Hash::make($request->input('password')),
            ]);

            $user->assignCustomerRole();

            // Move the guest's cart to the new account so it isn't lost when the
            // identifier switches from guest_id to the real user id below.
            $guestId = $request->input('guest_id');
            if ($guestId) {
                \App\Models\Cart::where('user_identifier', $guestId)
                    ->update(['user_identifier' => $user->id]);
            }

            \Illuminate\Support\Facades\Auth::login($user);
        }

        $identifier = $this->getUserIdentifier($request);

        Log::info('[Checkout] identifier=' . $identifier . ' guest_id_in=' . $request->input('guest_id'));

        // "Buy now" orders one product without touching the cart. Its line is
        // put on a throwaway cart and read back, so it is priced and stock
        // checked exactly as a cart line is, then removed again.
        $directItem = $request->input('direct_item');
        $isDirect = is_array($directItem) && ! empty($directItem['product_id']);

        if ($isDirect) {
            $scratch = 'direct_' . \Illuminate\Support\Str::uuid();

            try {
                $this->cartService->addToCart([
                    'user_id'          => $scratch,
                    'product_id'       => (int) $directItem['product_id'],
                    'quantity'         => max(1, (int) ($directItem['quantity'] ?? 1)),
                    'attribute_values' => array_values(array_filter((array) ($directItem['attribute_values'] ?? []), 'is_numeric')),
                    'blouse_choice'    => $directItem['blouse_choice'] ?? null,
                ]);

                $cartItems = $this->cartService->getCartItems($scratch);
            } catch (\Throwable $e) {
                Log::warning('[Checkout] direct item rejected: ' . $e->getMessage());

                return back()->withErrors(['cart' => 'এই পণ্যটি এখন অর্ডার করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।']);
            } finally {
                \App\Models\Cart::where('user_identifier', $scratch)->delete();
            }
        } else {
            // Load cart items from DB
            $cartItems = $this->cartService->getCartItems($identifier);
        }

        Log::info('[Checkout] cartItems count=' . (is_countable($cartItems) ? count($cartItems) : 'n/a'));

        if (empty($cartItems) || (is_object($cartItems) && $cartItems->isEmpty())) {
            Log::warning('[Checkout] cart empty for identifier=' . $identifier);
            return back()->withErrors(['cart' => 'আপনার কার্ট খালি। পণ্য যোগ করুন।']);
        }

        // Build items array expected by OrderService::checkout
        $items = collect($cartItems)->map(function ($item) {
            return [
                'product_id'        => $item['product_id'],
                'quantity'          => $item['quantity'],
                'individual_price'  => $item['individual_price'],
                'total'             => $item['individual_price'] * $item['quantity'],
                'attributes'        => collect($item['attributes'] ?? [])->toArray(),
                'attributeOptionId' => '',
                'campaign_discount' => $item['campaign_discount'] ?? 0,
                'coupon_discount'   => 0,
                'original_price'    => $item['individual_price'],
                'blouse_choice'     => $item['blouse_choice'] ?? null,
            ];
        })->values()->toArray();

        // A cart outlives the stock it was filled from, so what is still for
        // sale is checked here rather than trusted from the browser. Pre-orders
        // pass: that status exists so orders can be taken for stock yet to
        // arrive. OrderService repeats the check, but its exception is
        // sanitised before it reaches a customer — this one names the product.
        $unavailable = \App\Models\Product::whereIn('id', collect($items)->pluck('product_id')->unique())
            ->get()
            ->reject(fn ($product) => $product->purchasable)
            ->pluck('product_name');

        if ($unavailable->isNotEmpty()) {
            return back()->withErrors([
                'cart' => $unavailable->implode(', ') . ' — এই পণ্যটি বর্তমানে স্টকে নেই। অনুগ্রহ করে কার্ট থেকে সরিয়ে আবার চেষ্টা করুন।',
            ]);
        }

        $deliveryArea = (string) $request->input('delivery_area');

        // The goods total decides both the coupon and, when the shop offers free
        // delivery above a threshold, the delivery charge — so it is worked out
        // before either.
        $subtotal = collect($items)->sum(fn ($item) => $item['total']);

        // Money is resolved server-side. The delivery charge used to be read straight
        // from the request body, so a client could post delivery_charge=0 and skip the
        // fee; the rates live in site_infos, which is where the storefront reads them
        // from too.
        //
        // Free shipping is applied here as well. It was only ever honoured in the
        // browser, so an order that should have shipped free was still billed the
        // full fee once the server recomputed it.
        $deliveryCharge = $this->shipsFree($subtotal)
            ? 0.0
            : $this->deliveryChargeFor($deliveryArea);

        // The coupon used to be dropped entirely — coupon_id was hardcoded null and
        // discount 0 — so a customer who applied a valid code was still billed the full
        // amount, and used_count never advanced, making usage_limit unenforceable.
        [$coupon, $discount] = $this->resolveCoupon(
            $request->input('coupon_code'),
            collect($items)->pluck('product_id')->all(),
            $subtotal
        );

        $data = [
            'items'          => $items,
            'user_id'        => $identifier,
            'user_name'      => $request->input('user_name'),
            'phone_number'   => $request->input('phone_number'),
            // The form asks for an email "to receive the cash memo". It was
            // dropped, so the order took the account's address — for a guest a
            // generated @guest.com one — and the confirmation never arrived.
            'email'          => filter_var(trim((string) $request->input('email')), FILTER_VALIDATE_EMAIL) ?: null,
            'address'        => $request->input('address'),
            'delivery_area'  => $deliveryArea,
            'delivery'       => $deliveryArea,
            'note'           => $request->input('note', ''),
            'order_status'   => 'pending',
            'order_type'     => 'checkout',
            'delivery_charge'=> $deliveryCharge,
            'shipping_price' => $deliveryCharge,
            'coupon_id'      => $coupon?->id,
            'code'           => $coupon?->code,
            'discount'       => $discount,
            'discounts'      => 0,
            'paid_amount'    => 0,
            // A Buy now order leaves whatever is in the cart where it is.
            'keep_cart'      => $isDirect,
        ];

        $gateway = app(\App\Services\Payment\SslCommerzService::class);
        $bkash = app(\App\Services\Payment\BkashService::class);

        // Online payment is only honoured while the gateway is actually on, so
        // a stale form cannot leave an order waiting on a disabled gateway.
        $payOnline = $request->input('payment_type') === 'online' && $gateway->isEnabled();
        $payBkash = $request->input('payment_type') === 'bkash' && $bkash->isEnabled();

        // Both are keys in config('payments.types'), which the admin validates
        // against; bKash is an online payment whose method is recorded as bkash.
        $data['payment_type'] = ($payOnline || $payBkash) ? 'online' : 'cod';
        $data['payment_status'] = 'unpaid';

        try {
            Log::info('[Checkout] calling orderService->checkout with ' . count($items) . ' items');
            $order = $this->orderService->checkout($data);
            Log::info('[Checkout] order created invoice=' . $order->invoice_number);
        } catch (\Exception $e) {
            Log::error('[Checkout] order failed: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
            return back()->withErrors(['cart' => 'অর্ডার ব্যর্থ হয়েছে: ' . \App\Helpers\SafeError::message($e, 'অনুগ্রহ করে আবার চেষ্টা করুন।', 'Checkout failed')]);
        }

        if ($payBkash) {
            $payment = $bkash->createPayment($order);

            if ($payment['ok']) {
                return Inertia::location($payment['url']);
            }

            Log::error("[Checkout] bKash payment failed for {$order->invoice_number}: {$payment['message']}");

            return redirect()->route('checkout.index')->withErrors([
                'payment' => 'We could not open the bKash payment page. Your order ' . $order->invoice_number
                    . ' is saved — try again, or choose cash on delivery.',
            ]);
        }

        if ($payOnline) {
            $session = $gateway->createSession($order);

            if ($session['ok']) {
                // Leaving Laravel entirely, so an Inertia visit will not do.
                return Inertia::location($session['url']);
            }

            // The order exists and is unpaid; say so rather than losing it.
            Log::error("[Checkout] gateway session failed for {$order->invoice_number}: {$session['message']}");

            return redirect()->route('checkout.index')->withErrors([
                'payment' => 'We could not open the payment page. Your order ' . $order->invoice_number
                    . ' is saved — try again, or choose cash on delivery.',
            ]);
        }

        // Cash on delivery is confirmed the moment it is placed. An online
        // order waits for the money before its confirmation goes out.
        app(\App\Services\Sms\OrderSmsNotifier::class)->send($order);
        app(\App\Services\Mail\OrderMailNotifier::class)->sendPlaced($order);

        return redirect()->route('order.success', $order->invoice_number);
    }

    /**
     * Whether this order ships free: decided only by the shop-wide setting
     * (Settings › Delivery) — free outright, or free once the order is big
     * enough.
     *
     * Per-product free shipping was removed. Its admin toggle went first, but
     * the flag already stored on products kept waiving the fee, so a product
     * switched on before the removal shipped free below the minimum with no
     * way left to turn it off. products.is_free_shipping is no longer read.
     *
     * The threshold is measured against the goods total before any coupon: it is
     * what the customer put in the basket, which is what the storefront quotes.
     */
    private function shipsFree(float $subtotal): bool
    {
        return (bool) \App\Models\SiteInfo::first()?->shipsFree($subtotal);
    }

    /**
     * The shipping fee for a delivery area, read from site_infos.
     *
     * Mirrors what components/Checkout/CheckoutForm.vue shows the customer, so the
     * amount charged matches the amount quoted.
     */
    private function deliveryChargeFor(string $area): float
    {
        $siteInfo = \App\Models\SiteInfo::first();

        return match ($area) {
            'inside' => (float) ($siteInfo->shipping_charge_inside_dhaka ?? 0),
            'outside' => (float) ($siteInfo->shipping_charge_outside_dhaka ?? 0),
            default => 0.0,
        };
    }

    /**
     * Validate a coupon code and work out its discount.
     *
     * Applies the same rules as ManageOrdersController::validateCoupon(), which is what
     * the storefront calls to preview the discount, and the same arithmetic as
     * CheckoutForm.vue: a percentage comes off the subtotal, a fixed amount comes off
     * as-is. The result is capped at the subtotal so an order can never go negative.
     *
     * @param  list<int>  $productIds
     * @return array{0: ?\App\Models\Coupon, 1: float}
     */
    private function resolveCoupon(?string $code, array $productIds, float $subtotal): array
    {
        if (blank($code) || $productIds === []) {
            return [null, 0.0];
        }

        // Same rule as the storefront check: within its dates and uses.
        $coupon = \App\Models\Coupon::findByTypedCode($code);

        if ($coupon === null || ! $coupon->isUsable()) {
            return [null, 0.0];
        }

        // A coupon restricted to particular products must cover one in the
        // cart. A coupon with no products listed is unrestricted and applies to
        // everything — treating "no restriction" as "covers nothing" made every
        // such coupon silently unusable.
        $restrictions = \App\Models\CouponProduct::where('coupon_id', $coupon->id);

        if ($restrictions->exists() && ! (clone $restrictions)->whereIn('product_id', $productIds)->exists()) {
            return [null, 0.0];
        }

        $discount = $coupon->discount_type === 'percentage'
            ? $subtotal * (float) $coupon->discount_amount / 100
            : (float) $coupon->discount_amount;

        return [$coupon, round(min($discount, $subtotal), 2)];
    }
}
