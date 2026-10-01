<?php

namespace App\Http\Controllers\Api\Profile;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Profile\StoreUserAddressRequest;
use App\Models\Product;
use App\Models\UserAddress;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function createAddress(StoreUserAddressRequest $request)
    {

        try {

            $validated = $request->validated();

            $user_id = Auth::user()->id;

            $validated['user_id'] = $user_id;

            // Save the address
            $address = UserAddress::create($validated);

            return ApiResponse::success([
                'success' => true,
                'address' => $address,
            ], 'Address saved successfully.');
        } catch (\Exception $e) {



            return ApiResponse::error('An error occurred', 500);
        }
    }


    public function updateAddress(StoreUserAddressRequest $request)
    {
        try {

            $validated = $request->data;

            $id = $request->id;

            // Find the address by ID
            $address = UserAddress::find($id);

            // Update the address
            $address->update($validated);

            return ApiResponse::success([
                'success' => true,
                'address' => $address,
            ], 'Address updated successfully.');
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred', 500);
        }
    }

    public function addWishlist($id)
    {
        try {
            // Check authentication
            if (!auth()->check()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'You must be logged in to add to wishlist.'
                ], 401);
            }

            // Find product
            $product = Product::find($id);
            if (!$product) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Product not found.'
                ], 404);
            }

            $wishlist = Wishlist::firstOrCreate([
                'user_id'    => auth()->id(),
                'product_id' => $product->id,
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Product added to wishlist.',
                'data'    => $wishlist
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function removeWishlist($id)
    {
        try {
            // Check authentication
            if (!auth()->check()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'You must be logged in to add to wishlist.'
                ], 401);
            }
            Wishlist::where('user_id',auth()->user()->id)->where('product_id',$id)->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Product removed to wishlist.',
                'data'    => ''
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function wishlistCount()
    {
        $count = 0;
        try {
            // Check authentication
            if (!auth()->check()) {
                return response()->json([
                    'status'=>'not',
                    'data' => $count
                ]);
            }

            $count=Auth::user()->wishlists->count();
            
            return response()->json([
                'data'    => $count
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function getAddress()
    {
        try {

            $user_id = Auth::user()->id;

            $address = UserAddress::where('user_id', $user_id)->get();

            return ApiResponse::success([
                'success' => true,
                'address' => $address,
            ]);
        } catch (\Exception $error) {
            return ApiResponse::error('An error occurred', 500);
        }
    }

    public function deleteAddress(Request $request)
    {

        try {

            $user_id = Auth::user()->id;

            UserAddress::where('id', $request->id)->delete();
            $address = UserAddress::where('user_id', $user_id)->get();
            return ApiResponse::success([
                'success' => true,
                'address' => $address,
            ]);
        } catch (\Exception $error) {
            return ApiResponse::error('An error occurred', 500);
        }
    }
}
