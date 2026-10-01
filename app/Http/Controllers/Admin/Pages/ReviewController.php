<?php

namespace App\Http\Controllers\Admin\Pages;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Review;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct(protected ImageUploadService $imageUploadService)
    {
    }

    public function index()
    {
        $reviews = Review::orderBy('sort_order')->latest()->get();

        // Reviews submitted by customers from the product detail page. Pending
        // ones (is_active = false) are listed first so they are easy to action.
        $productReviews = ProductReview::with('product:id,product_name,slug,featured_image')
            ->orderBy('is_active')
            ->latest()
            ->get()
            ->map(fn (ProductReview $r) => [
                'id'           => $r->id,
                'product_id'   => $r->product_id,
                'product_name' => $r->product?->product_name,
                'product_slug' => $r->product?->slug,
                'name'         => $r->name,
                'contact'      => $r->contact,
                'rating'       => (int) $r->rating,
                'review'       => $r->review,
                'images'       => $r->images ?? [],
                'is_active'    => (bool) $r->is_active,
                'created_at'   => $r->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Pages/Reviews', [
            'reviews'        => $reviews,
            'productReviews' => $productReviews,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageUploadService->uploadImage($request->file('image'), 'reviews');
        } elseif ($request->filled('image_library_path')) {
            $data['image'] = $request->input('image_library_path');
        }
        unset($data['image_library_path']);

        $data['rating']    = $data['rating'] ?? 5;
        $data['is_active'] = $request->boolean('is_active', true);

        Review::create($data);

        return redirect()->back()->with('success', 'Review added successfully.');
    }

    public function update(Request $request, Review $review)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $this->imageUploadService->deleteFileUnlessInLibrary($review->image);
            $data['image'] = $this->imageUploadService->uploadImage($request->file('image'), 'reviews');
        } elseif ($request->filled('image_library_path')) {
            $this->imageUploadService->deleteFileUnlessInLibrary($review->image);
            $data['image'] = $request->input('image_library_path');
        } else {
            unset($data['image']);
        }
        unset($data['image_library_path']);

        $data['rating']    = $data['rating'] ?? $review->rating;
        $data['is_active'] = $request->boolean('is_active', true);

        $review->update($data);

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $this->imageUploadService->deleteFileUnlessInLibrary($review->image);

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }

    /**
     * Update a customer-submitted product review — this is where a pending
     * review gets approved (is_active = true) and published on the product page.
     */
    public function updateProductReview(Request $request, ProductReview $productReview)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'contact'         => 'required|string|max:255',
            'rating'          => 'required|integer|min:1|max:5',
            'review'          => 'required|string|max:1000',
            'is_active'       => 'boolean',
            'removed_images'  => 'nullable|array',
            'removed_images.*' => 'string',
        ]);

        // Drop any images the admin unchecked in the modal.
        $images = $productReview->images ?? [];
        foreach ($request->input('removed_images', []) as $removed) {
            if (in_array($removed, $images, true)) {
                $this->imageUploadService->deleteFileUnlessInLibrary($removed);
                $images = array_values(array_diff($images, [$removed]));
            }
        }

        $productReview->update([
            'name'      => $data['name'],
            'contact'   => $data['contact'],
            'rating'    => $data['rating'],
            'review'    => $data['review'],
            'images'    => $images,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->back()->with('success', 'Product review updated successfully.');
    }

    public function destroyProductReview(ProductReview $productReview)
    {
        foreach ($productReview->images ?? [] as $image) {
            $this->imageUploadService->deleteFileUnlessInLibrary($image);
        }

        $productReview->delete();

        return redirect()->back()->with('success', 'Product review deleted successfully.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name'       => 'required|string|max:255',
            'city'       => 'nullable|string|max:255',
            'rating'     => 'nullable|integer|min:1|max:5',
            'review'     => 'required|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active'  => 'boolean',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_library_path' => 'nullable|string',
        ]);
    }
}
