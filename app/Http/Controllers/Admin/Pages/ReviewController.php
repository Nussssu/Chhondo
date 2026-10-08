<?php

namespace App\Http\Controllers\Admin\Pages;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Review;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct(protected ImageUploadService $imageUploadService)
    {
    }

    public function index(Request $request)
    {
        $type = $request->input('type', '');
        $summaryRows = collect();
        $rows = collect();

        if ($type !== 'product') {
            $summaryQuery = Review::query();
            $this->applyHomepageReviewDateFilter($summaryQuery, $request);
            $summaryRows = $summaryRows->concat($summaryQuery->get(['rating', 'is_active']));

            $homepageQuery = Review::query();
            $this->applyHomepageReviewFilters($homepageQuery, $request);
            $rows = $rows->concat($homepageQuery->get()->map(fn (Review $review) => [
                'id'            => $review->id,
                'review_type'   => 'homepage',
                'product_name'  => 'Homepage testimonial',
                'product_image' => $review->image,
                'name'          => $review->name,
                'contact'       => $review->city,
                'rating'        => (int) $review->rating,
                'review'        => $review->review,
                'image'         => $review->image,
                'images'        => [],
                'is_active'     => (bool) $review->is_active,
                'is_featured'   => false,
                'admin_reply'   => null,
                'sort_order'    => $review->sort_order,
                'created_at'    => $review->created_at?->toDateTimeString(),
            ]));
        }

        if ($type !== 'homepage') {
            $summaryQuery = ProductReview::query();
            $this->applyProductReviewDateFilter($summaryQuery, $request);
            $summaryRows = $summaryRows->concat($summaryQuery->get(['rating', 'is_active']));

            $productQuery = ProductReview::with('product:id,product_name,slug,featured_image');
            $this->applyProductReviewFilters($productQuery, $request);
            $rows = $rows->concat($productQuery->get()->map(fn (ProductReview $review) => [
                'id'            => $review->id,
                'review_type'   => 'product',
                'product_id'    => $review->product_id,
                'product_name'  => $review->product?->product_name,
                'product_slug'  => $review->product?->slug,
                'product_image' => $review->product?->featured_image,
                'name'          => $review->name,
                'contact'       => $review->contact,
                'rating'        => (int) $review->rating,
                'review'        => $review->review,
                'images'        => $review->images ?? [],
                'is_active'     => (bool) $review->is_active,
                'is_featured'   => (bool) $review->is_featured,
                'admin_reply'   => $review->admin_reply,
                'created_at'    => $review->created_at?->toDateTimeString(),
            ]));
        }

        $rows = $rows->sortByDesc('created_at')->values();
        $perPage = max(10, min(100, (int) $request->input('pagination', 20)));
        $page = max(1, (int) $request->input('page', 1));
        $reviews = new LengthAwarePaginator(
            $rows->forPage($page, $perPage)->values(),
            $rows->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $summary = [
            'total'     => $summaryRows->count(),
            'published' => $summaryRows->where('is_active', true)->count(),
            'pending'   => $summaryRows->where('is_active', false)->count(),
            'average'   => round((float) ($summaryRows->avg('rating') ?? 0), 1),
        ];

        return Inertia::render('Admin/Pages/Reviews', [
            'reviews' => $reviews,
            'summary' => $summary,
        ]);
    }

    public function updateHomepageReviewStatus(Request $request, Review $review)
    {
        $data = $request->validate(['is_active' => 'required|boolean']);
        $review->update(['is_active' => $data['is_active']]);

        return redirect()->back()->with('success', $data['is_active'] ? 'Homepage review published.' : 'Homepage review hidden.');
    }

    public function updateProductReviewStatus(Request $request, ProductReview $productReview)
    {
        $data = $request->validate(['is_active' => 'required|boolean']);
        $productReview->update(['is_active' => $data['is_active']]);

        return redirect()->back()->with('success', $data['is_active'] ? 'Review published.' : 'Review hidden.');
    }

    public function updateProductReviewFeatured(Request $request, ProductReview $productReview)
    {
        $data = $request->validate(['is_featured' => 'required|boolean']);
        $productReview->update(['is_featured' => $data['is_featured']]);

        return redirect()->back()->with('success', $data['is_featured'] ? 'Review featured.' : 'Review unfeatured.');
    }

    public function updateProductReviewReply(Request $request, ProductReview $productReview)
    {
        $data = $request->validate(['admin_reply' => 'nullable|string|max:2000']);
        $productReview->update(['admin_reply' => $data['admin_reply'] ?: null]);

        return redirect()->back()->with('success', 'Review reply saved.');
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

    private function applyProductReviewFilters($query, Request $request): void
    {
        $this->applyProductReviewDateFilter($query, $request);

        $query
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('contact', 'like', "%{$search}%")
                        ->orWhere('review', 'like', "%{$search}%")
                        ->orWhereHas('product', fn ($product) => $product->where('product_name', 'like', "%{$search}%"));
                });
            })
            ->when($request->input('status') === 'published', fn ($query) => $query->where('is_active', true))
            ->when($request->input('status') === 'pending', fn ($query) => $query->where('is_active', false))
            ->when($request->input('status') === 'featured', fn ($query) => $query->where('is_featured', true))
            ->when($request->filled('rating'), fn ($query) => $query->where('rating', (int) $request->input('rating')));
    }

    private function applyProductReviewDateFilter($query, Request $request): void
    {
        $query
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('created_at', '>=', $request->input('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('created_at', '<=', $request->input('date_to')));
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

    private function applyHomepageReviewFilters($query, Request $request): void
    {
        $this->applyHomepageReviewDateFilter($query, $request);

        $query
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('review', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status') === 'published', fn ($query) => $query->where('is_active', true))
            ->when($request->input('status') === 'pending', fn ($query) => $query->where('is_active', false))
            ->when($request->input('status') === 'featured', fn ($query) => $query->whereRaw('1 = 0'))
            ->when($request->filled('rating'), fn ($query) => $query->where('rating', (int) $request->input('rating')));
    }

    private function applyHomepageReviewDateFilter($query, Request $request): void
    {
        $query
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('created_at', '>=', $request->input('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('created_at', '<=', $request->input('date_to')));
    }
}
