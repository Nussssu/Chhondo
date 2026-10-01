<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function __construct(protected ImageUploadService $imageUploadService)
    {
    }

    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'contact'   => 'required|string|max:255',
            'rating'    => 'required|integer|min:1|max:5',
            'review'    => 'required|string|max:500',
            'images'    => 'nullable|array|max:5',
            'images.*'  => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $imagePaths = [];
        foreach ($request->file('images', []) as $image) {
            $path = $this->imageUploadService->uploadImage($image, 'product-reviews');
            if ($path) {
                $imagePaths[] = $path;
            }
        }

        ProductReview::create([
            'product_id' => $product->id,
            'name'       => $data['name'],
            'contact'    => $data['contact'],
            'rating'     => $data['rating'],
            'review'     => $data['review'],
            'images'     => $imagePaths,
            'is_active'  => false,
        ]);

        return redirect()->back()->with('success', 'ধন্যবাদ! আপনার রিভিউ পর্যালোচনার পর প্রকাশ করা হবে।');
    }
}
