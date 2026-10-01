<?php

use App\Http\Controllers\Admin\Coupon\CouponController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('coupons')->name('coupons.')->group(function () {
        Route::get('/', [CouponController::class, 'index'])->name('index');
        // The Add/Edit coupon pages are now inline modals on the index page.
        // Redirect old create/show/edit links so stale bookmarks don't 405.
        Route::get('/create', fn () => redirect()->route('admin.coupons.index'))->name('create');
        Route::post('/', [CouponController::class, 'store'])->name('store');
        Route::patch('/{coupon}', [CouponController::class, 'update'])->name('update');
        Route::delete('/{coupon}', [CouponController::class, 'destroy'])->name('destroy');
        // add product to coupon
        Route::get('/{coupon}/add-product', [CouponController::class, 'addProduct'])->name('add.product');
        Route::post('add-product', [CouponController::class, 'storeProduct'])->name('store.product');


        Route::delete('/{coupon}/delete-coupon-product', [CouponController::class, 'deleteCouponWithProduct'])->name('delete.coupon.product');

        // unique code check
        Route::post('/check-unique-code', [CouponController::class, 'checkUniqueCode'])->name('check.unique.code');

        // Redirect stale edit/show GET links to the index (edit is now a modal).
        // Registered last so they don't shadow the specific GET routes above.
        Route::get('/{coupon}/edit', fn () => redirect()->route('admin.coupons.index'))->name('edit');
        Route::get('/{coupon}', fn () => redirect()->route('admin.coupons.index'))->name('show');
    });
});