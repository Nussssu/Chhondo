<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Services\Admin\Cart\CartServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartServiceInterface $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Resolve the user identifier: auth user id or session guest_id.
     */
    protected function getUserIdentifier(Request $request): string
    {
        if (auth()->check()) {
            return (string) auth()->id();
        }

        // Accept guest_id from the frontend (stored in localStorage)
        $frontendGuestId = $request->input('guest_id') ?: $request->header('X-Guest-Id');
        if ($frontendGuestId) {
            $request->session()->put('guest_id', $frontendGuestId);
            return $frontendGuestId;
        }

        if (! $request->session()->has('guest_id')) {
            $request->session()->put('guest_id', 'guest_' . time() . '_' . rand(1000, 9999));
        }

        return $request->session()->get('guest_id');
    }

    /**
     * The cart as the storefront shares it (see HandleInertiaRequests), for a
     * request that asked for JSON.
     */
    private function cartPayload(string $identifier): array
    {
        $items = app(\App\Repositories\Admin\Cart\CartRepository::class)
            ->getCartItems($identifier)
            ->values()
            ->toArray();

        return ['cartItems' => $items, 'cartCount' => array_sum(array_column($items, 'quantity'))];
    }

    /**
     * Success: the updated cart as JSON for the storefront's background
     * requests, otherwise back to the page as before.
     */
    private function done(Request $request, string $identifier, ?string $message = null)
    {
        if ($request->wantsJson()) {
            return response()->json(['message' => $message] + $this->cartPayload($identifier));
        }

        return $message ? back()->with('success', $message) : back();
    }

    /** Failure: a 422 with the reason as JSON, otherwise back with the error. */
    private function failed(Request $request, string $message, ?string $field = null)
    {
        if ($request->wantsJson()) {
            return response()->json(['message' => $message, 'errors' => $field ? [$field => [$message]] : []], 422);
        }

        return $field ? back()->withErrors([$field => $message]) : back()->with('error', $message);
    }

    public function addToCart(Request $request)
    {
        $identifier = $this->getUserIdentifier($request);

        // The storefront hides the button, but a disabled attribute is a
        // suggestion — this is what actually stops an out-of-stock product
        // reaching a cart. A pre-order passes: that status exists so orders
        // can be taken for stock that has not arrived.
        if ($error = $this->unavailableReason($request)) {
            return $this->failed($request, $error, 'product_id');
        }

        $data = array_merge($request->all(), [
            'user_id' => $identifier,
        ]);

        try {
            $this->cartService->addToCart($data);
        } catch (\Exception $e) {
            $message = \App\Helpers\SafeError::message($e, 'Could not add that item to your cart.', 'Cart add failed');

            return $request->wantsJson() ? $this->failed($request, $message) : back()->with('error', $message)->withInput();
        }

        return $this->done($request, $identifier, 'Product added to cart.');
    }

    /**
     * Why this product cannot be added, or null when it can.
     *
     * Both levels are checked: the product's own availability, and the chosen
     * combination of options — a product can be in stock overall while the
     * particular size or colour asked for is not.
     */
    private function unavailableReason(Request $request): ?string
    {
        $product = \App\Models\Product::find($request->input('product_id'));

        if (! $product) {
            return 'This product is no longer available.';
        }

        if (! $product->purchasable) {
            return 'This product is currently out of stock.';
        }

        $attributeIds = array_filter((array) $request->input('attribute_values', []));

        if ($attributeIds === [] || ! $product->tracks_stock) {
            return null;
        }

        $unavailable = \App\Models\ProductAttribute::whereIn('id', $attributeIds)
            ->where('product_id', $product->id)
            ->where(fn ($q) => $q->where('status', 'disable')->orWhere('quantity', '<=', 0))
            ->exists();

        return $unavailable ? 'The option you selected is currently out of stock.' : null;
    }

    public function updateQuantity(Request $request)
    {
        $identifier = $this->getUserIdentifier($request);
        $cartId     = $request->input('cart_id');
        $change     = (int) $request->input('quantity', 0);

        $cart = Cart::where('user_identifier', $identifier)->where('id', $cartId)->first();

        if (! $cart) {
            return $this->failed($request, 'Cart item not found.');
        }

        if ($cart->quantity + $change < 1) {
            return $this->failed($request, 'Quantity cannot be less than 1.');
        }

        try {
            $this->cartService->updateCartItem([
                'cart_id'          => $cartId,
                'quantity'         => $change,
                'attribute_values' => $request->input('attribute_values', []),
            ]);
        } catch (\Exception $e) {
            return $this->failed($request, \App\Helpers\SafeError::message($e, 'Could not update your cart.', 'Cart update failed'));
        }

        // No success flash: this fires on every +/- click and the new quantity
        // and line total are already visible on screen. A toast per click is
        // noise. Failures below and above still report themselves.
        return $this->done($request, $identifier);
    }

    public function removeFromCart(Request $request)
    {
        $identifier = $this->getUserIdentifier($request);
        $cartId     = $request->input('cart_id');

        try {
            $this->cartService->deleteCartItem($identifier, $cartId);
        } catch (\Exception $e) {
            return $this->failed($request, \App\Helpers\SafeError::message($e, 'Could not update your cart.', 'Cart update failed'));
        }

        return $this->done($request, $identifier, 'Item removed from cart.');
    }

    public function clearCart(Request $request)
    {
        $identifier = $this->getUserIdentifier($request);

        try {
            $this->cartService->clearCart($identifier);
        } catch (\Exception $e) {
            return $this->failed($request, \App\Helpers\SafeError::message($e, 'Could not update your cart.', 'Cart update failed'));
        }

        return $this->done($request, $identifier, 'Cart cleared.');
    }
}
