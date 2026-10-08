<?php

use App\Http\Controllers\Admin\Pages\PagesController;
use App\Http\Controllers\Admin\Pages\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('product-reviews')->name('product-reviews.')->group(function () {
        Route::patch('/{productReview}/status', [ReviewController::class, 'updateProductReviewStatus'])->name('status');
        Route::patch('/{productReview}/featured', [ReviewController::class, 'updateProductReviewFeatured'])->name('featured');
        Route::patch('/{productReview}/reply', [ReviewController::class, 'updateProductReviewReply'])->name('reply');
    });

    Route::prefix('pages')->name('pages.')->group(function () {
        // Customer reviews CRUD (registered before the /{type} routes so
        // "reviews" is never read as a page type).
        Route::prefix('reviews')->name('reviews.')->group(function () {
            Route::get('/', [ReviewController::class, 'index'])->name('index');
            Route::post('/', [ReviewController::class, 'store'])->name('store');
            Route::patch('/{review}/status', [ReviewController::class, 'updateHomepageReviewStatus'])->name('status');

            // Customer-submitted product reviews (registered before the /{review}
            // catch-all so "product" is not read as a Review id).
            Route::post('/product/{productReview}', [ReviewController::class, 'updateProductReview'])->name('product.update');
            Route::delete('/product/{productReview}', [ReviewController::class, 'destroyProductReview'])->name('product.destroy');

            Route::post('/{review}', [ReviewController::class, 'update'])->name('update');
            Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
        });

        // Feeds the Product-section widget's Sequence modal. Registered ahead
        // of the /{type} routes so "widgets" is never read as a page type.
        Route::get('/widgets/product-section/products', [PagesController::class, 'productSectionProducts'])
            ->name('widgets.product-section');

        // One listing for every storefront page; each page is edited on its own
        // screen, banners included.
        Route::get('/', [PagesController::class, 'index'])->name('index');

        // Pages of the operator's own: created here, then edited through the
        // same /{type} routes the built-in pages use.
        Route::post('/', [PagesController::class, 'store'])->name('store');
        Route::post('/{type}/duplicate', [PagesController::class, 'duplicate'])->name('duplicate');

        Route::get('/{type}/edit', [PagesController::class, 'edit'])->name('edit');
        Route::patch('/{type}/visibility', [PagesController::class, 'updateVisibility'])->name('visibility');
        Route::put('/{type}', [PagesController::class, 'update'])->name('update');
        Route::delete('/{type}', [PagesController::class, 'destroy'])->name('destroy');
    });
});
