<?php

namespace App\Http\Controllers\Admin\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Profile\UpdatePasswordRequest;
use App\Http\Requests\Admin\Profile\UpdateRequest;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\ImageUploadService;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{

    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

    public function profileSetting()
    {
        $user_id = Auth::user()->id;
        $user_info = User::where('id', $user_id)->with('addresses')->first();


        return Inertia::render('Admin/Profile/Index', ['userInfo' => $user_info]);
    }

    public function profileUpdate(UpdateRequest $request)
    {

        $user = Auth::user();

        $validatedData = $request->validated();

        // A new upload, or an image picked from the media library.
        $imagePath = $request->hasFile('image')
            ? $this->imageUploadService->uploadImage($request->file('image'), 'users')
            : $request->input('image_library_path');

        if ($imagePath) {
            $this->imageUploadService->deleteFileUnlessInLibrary($user->image);

            $validatedData['image'] = $imagePath;
        }

        unset($validatedData['image_library_path']);



        $user->update($validatedData);


        $user_address = UserAddress::firstOrCreate(
            ['user_id' => $user->id],
            ['phone' => $validatedData['phone'], 'address' => $validatedData['address'], 'city' => $validatedData['city']]
        );

        $user_address->update([
            'phone' => $validatedData['phone'],
            'address' => $validatedData['address'],
            'city' => $validatedData['city'],
        ]);


        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    public function passwordUpdate(UpdatePasswordRequest $request)
    {

        $user = Auth::user();
        $user->password = Hash::make($request->new_password);
        $user->save();

        return back()->with('success', 'Password updated successfully.');
    }


    public function users(Request $request)
    {
        // Start query — include order counts and roles so the table's "Total
        // order" column and the Block/Delete gating both have their data.
        // Exclude guest-checkout accounts ({guest_id}@guest.com): when a shopper
        // completes a guest checkout without opting to create an account, the
        // order is stored but the backing guest record must NOT surface in the
        // customer info table.
        $userQuery = User::with(['address', 'roles'])
            ->withCount('orders')
            // Lifetime spend and last order, for the table — the same orders
            // the customer detail view totals.
            ->withSum('orders as lifetime_spend', 'total_price')
            ->withMax('orders as last_order_at', 'created_at')
            ->where('email', 'not like', '%@guest.com');

        // Status: active or blocked.
        if (in_array($request->status, ['active', 'blocked'], true)) {
            $userQuery->where('is_block', $request->status === 'blocked');
        }

        // Joined between two dates (either end optional).
        if ($request->filled('from')) {
            $userQuery->whereDate('created_at', '>=', $request->date('from'));
        }
        if ($request->filled('to')) {
            $userQuery->whereDate('created_at', '<=', $request->date('to'));
        }

        // Sorting, by a known column only; newest customers first by default.
        $sortable = [
            'name'           => 'name',
            'created_at'     => 'created_at',
            'orders_count'   => 'orders_count',
            'lifetime_spend' => 'lifetime_spend',
            'last_order_at'  => 'last_order_at',
        ];
        $sortKey = $sortable[$request->input('sort')] ?? 'created_at';
        $sortDir = $request->input('dir') === 'asc' ? 'asc' : 'desc';
        $userQuery->orderBy($sortKey, $sortDir)->orderBy('id', 'desc');

        // Apply search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;

            $userQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('addresses', function ($query) use ($search) {
                        $query->where('phone', 'like', "%{$search}%");
                    });
            });
        }


        // Paginate the results
        $users = $userQuery->when($request->user_id, function ($query, $userId) {
            $query->where('id', $userId);
        })->paginate(in_array((int) $request->per_page, [10, 20, 50, 100], true) ? (int) $request->per_page : 20)->withQueryString();

        // Expose role names as a simple string array so the table can gate the
        // Block/Delete actions (e.g. hide them for Admins).
        $users->getCollection()->transform(function ($user) {
            $user->role_names = $user->getRoleNames();
            return $user;
        });


        // Counts for the status filter, across every registered customer.
        $base = User::where('email', 'not like', '%@guest.com');
        $counts = [
            'all'     => (clone $base)->count(),
            'active'  => (clone $base)->where('is_block', false)->count(),
            'blocked' => (clone $base)->where('is_block', true)->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'counts'  => $counts,
            'filters' => $request->only(['search', 'status', 'from', 'to', 'sort', 'dir', 'per_page']),
        ]);
    }



    /**
     * Return a single customer's full profile plus the products they have
     * purchased, for the "view" popup on the customer list. Products are sent
     * as a flat list; the modal paginates them 10 per page client-side.
     */
    public function show($id)
    {
        $user = User::with(['addresses', 'wishlists.product'])->withCount(['orders', 'wishlists'])->findOrFail($id);

        $orders = Order::where('user_identifier', $id)
            ->with('items.product')
            ->latest()
            ->get();

        // Products purchased (flat list; the modal paginates 10 per page).
        $products = [];
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $products[] = [
                    'product_name' => $item->product->product_name ?? 'N/A',
                    'image'        => $item->product->featured_image ?? null,
                    'price'        => (float) $item->price,
                    'quantity'     => (int) $item->quantity,
                    'invoice'      => $order->invoice_number,
                    'order_status' => $order->order_status,
                    'date'         => optional($order->created_at)->format('d M Y'),
                ];
            }
        }

        // Order history summary.
        $orderHistory = $orders->map(fn ($order) => [
            'invoice'      => $order->invoice_number,
            'date'         => optional($order->created_at)->format('d M Y'),
            'status'       => $order->order_status,
            'total_price'  => (float) $order->total_price,
            'items_count'  => $order->items->count(),
        ])->values();

        // Wishlist items.
        $wishlist = $user->wishlists->map(fn ($w) => [
            'product_name'   => $w->product->product_name ?? 'N/A',
            'price'          => $w->product->price ?? null,
            'previous_price' => $w->product->previous_price ?? null,
            'image'          => $w->product->featured_image ?? null,
        ])->values();

        // Addresses.
        $addresses = $user->addresses->map(fn ($a) => [
            'name'       => $a->name,
            'address'    => $a->address,
            'city'       => $a->city,
            'phone'      => $a->phone,
            'type'       => $a->type,
            'is_default' => (bool) $a->is_default,
        ])->values();

        return response()->json([
            'customer' => [
                'id'               => $user->id,
                'name'             => $user->name,
                'email'            => $user->email,
                'phone'            => $user->phone,
                'image'            => $user->image
                    ? (preg_match('#^(https?:)?//#', $user->image) ? $user->image : '/' . ltrim($user->image, '/'))
                    : null,
                'ip_address'       => $user->ip_address,
                'is_block'         => (bool) $user->is_block,
                'date_of_birth'    => optional($user->date_of_birth)->format('d M Y'),
                'joined'           => optional($user->created_at)->format('d M Y'),
                'orders_count'     => $user->orders_count,
                'delivered_orders' => $orders->where('order_status', 'delivered')->count(),
                'canceled_orders'  => $orders->where('order_status', 'cancelled')->count(),
                'total_spent'      => (float) $orders->sum('total_price'),
                'wishlist_count'   => $user->wishlists_count,
                'address_count'    => $user->addresses->count(),
            ],
            'addresses' => $addresses,
            'orders'    => $orderHistory,
            'wishlist'  => $wishlist,
            'products'  => $products,
        ]);
    }

    /** Edit a customer's name, email and phone. */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->getRoleNames()->contains('Admin')) {
            return redirect()->back()->with('error', 'Admin accounts are edited under Profile settings.');
        }

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
        ]);

        $user->fill($data)->save();

        return redirect()->back()->with('success', 'Customer updated.');
    }

    /**
     * Email the customer a link to choose a new password — the same link the
     * storefront's "forgot password" sends, so no password is ever handled
     * by hand.
     */
    public function sendPasswordReset($id)
    {
        $user = User::findOrFail($id);

        if ($user->getRoleNames()->contains('Admin')) {
            return redirect()->back()->with('error', 'Admin passwords are changed under Profile settings.');
        }

        try {
            $status = \Illuminate\Support\Facades\Password::sendResetLink(['email' => $user->email]);
        } catch (\Throwable $e) {
            report($e);

            return redirect()->back()->with('error', 'The reset email could not be sent. Check the mail settings.');
        }

        return $status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT
            ? redirect()->back()->with('success', "Password reset link sent to {$user->email}.")
            : redirect()->back()->with('error', __($status));
    }

    public function blockUser($id)
    {
        $user = User::findOrFail($id);

        // Get the user's role names
        $roles = $user->getRoleNames(); // Collection of role names

        // Check if user is "owner" or "admin"
        if ($roles->contains('Admin')) {
            return redirect()->back()->with('error', 'You cannot block an Admin user.');
        }

        // Toggle block status
        $user->is_block = !$user->is_block;
        $user->save();

        return redirect()->back()->with('success', 'User status updated successfully!');
    }

    public function delete($id)
    {
        $user = User::findOrFail($id);

        // Get the user's role names
        $roles = $user->getRoleNames();

        // Check if user is "owner" or "admin"
        if ($roles->contains('Admin')) {
            return redirect()->back()->with('error', 'You cannot delete an Admin user.');
        }

        // Toggle block status
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully!');
    }


}
