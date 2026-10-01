<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Saved delivery addresses, managed inline on the profile page.
 *
 * `city` holds the same two values the checkout uses for its delivery area, so
 * a saved address can set the shipping zone directly rather than being matched
 * up by name.
 */
class AddressWebController extends Controller
{
    /** Matches the delivery areas in CheckoutForm and deliveryChargeFor(). */
    public const CITIES = ['inside' => 'Inside Dhaka', 'outside' => 'Outside Dhaka'];

    public const TYPES = ['home' => 'Home', 'office' => 'Office'];

    private function rules(): array
    {
        return [
            // Name and phone are not asked for here: they belong to the
            // account and are edited in Personal Information on the same page.
            'address'    => 'required|string|max:500',
            'city'       => ['required', Rule::in(array_keys(self::CITIES))],
            'type'       => ['required', Rule::in(array_keys(self::TYPES))],
            'is_default' => 'nullable|boolean',
        ];
    }

    private function messages(): array
    {
        return [
            'address.required' => 'Add the street address.',
            'city.required'    => 'Choose Inside or Outside Dhaka.',
            'type.required'    => 'Choose Home or Office.',
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(), $this->messages());
        $data['user_id'] = Auth::id();

        // The first address saved is the primary one; there is nothing else it
        // could be, and checkout needs one to prefill from.
        $isFirst = ! UserAddress::where('user_id', Auth::id())->exists();
        $wantsDefault = $request->boolean('is_default') || $isFirst;

        DB::transaction(function () use ($data, $wantsDefault) {
            $data['is_default'] = $wantsDefault;
            $address = UserAddress::create($data);

            if ($wantsDefault) {
                $this->makeOnlyDefault($address);
            }
        });

        return back()->with('success', 'Address saved.');
    }

    public function update(Request $request, $id)
    {
        // Ownership is settled before the payload is looked at: probing someone
        // else's address id must answer 404 whatever was posted, never a
        // validation response that confirms the route reached a real record.
        $address = $this->ownedOrFail($id);

        $data = $request->validate($this->rules(), $this->messages());

        DB::transaction(function () use ($address, $data, $request) {
            // An address cannot un-primary itself — something has to be primary,
            // so the flag is only ever turned on here.
            $data['is_default'] = $request->boolean('is_default') || $address->is_default;

            $address->update($data);

            if ($data['is_default']) {
                $this->makeOnlyDefault($address);
            }
        });

        return back()->with('success', 'Address updated.');
    }

    /** Promote one address to primary. */
    public function setDefault($id)
    {
        $address = $this->ownedOrFail($id);

        DB::transaction(fn () => $this->makeOnlyDefault($address));

        return back()->with('success', 'Primary address updated.');
    }

    public function destroy(Request $request, $id)
    {
        $address = $this->ownedOrFail($id);

        DB::transaction(function () use ($address) {
            $wasDefault = (bool) $address->is_default;
            $address->delete();

            // Deleting the primary must not leave the account without one.
            if ($wasDefault) {
                $next = UserAddress::where('user_id', Auth::id())->oldest('id')->first();
                $next?->update(['is_default' => true]);
            }
        });

        return back()->with('success', 'Address removed.');
    }

    private function ownedOrFail($id): UserAddress
    {
        return UserAddress::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
    }

    /** Exactly one address per account carries the flag. */
    private function makeOnlyDefault(UserAddress $address): void
    {
        UserAddress::where('user_id', $address->user_id)
            ->where('id', '!=', $address->id)
            ->update(['is_default' => false]);

        if (! $address->is_default) {
            $address->update(['is_default' => true]);
        }
    }
}
