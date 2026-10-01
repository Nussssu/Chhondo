<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Use real product photos for the default review images.
        $productImages = \App\Models\Product::whereNotNull('featured_image')
            ->latest()
            ->take(2)
            ->pluck('featured_image')
            ->map(fn ($img) => str_starts_with($img, 'http') ? $img : '/' . ltrim($img, '/'))
            ->values();

        $reviews = [
            [
                'name'       => 'Nusrat Jahan',
                'city'       => 'Chittagong',
                'rating'     => 5,
                'review'     => 'Finally a brand that celebrates our heritage without compromise. The Chondrika for Eid drew compliments all evening.',
                'image'      => $productImages[0] ?? null,
                'is_active'  => true,
                'sort_order' => 1,
            ],
            [
                'name'       => 'Sabrina Islam',
                'city'       => 'Sylhet',
                'rating'     => 5,
                'review'     => 'Authentic handwoven quality you can feel immediately. My mother was moved to tears — this is what we grew up with.',
                'image'      => $productImages[1] ?? null,
                'is_active'  => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($reviews as $review) {
            Review::firstOrCreate(
                ['name' => $review['name'], 'review' => $review['review']],
                $review
            );
        }
    }
}
