<?php

use App\Http\Controllers\Admin\Sliders\SliderController;

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('sliders')->name('sliders.')->group(function () {

        // Banners are managed from the Home page editor (admin.pages.edit).
        Route::post('/banner', [SliderController::class, 'storeBanner'])->name('banner.store');
        // Carousel order, saved as soon as a banner is moved.
        Route::patch('/banner-order', [SliderController::class, 'reorderBanners'])->name('banner.reorder');
        // Replacing a banner image happens in a modal on the banner page.
        Route::patch('/banner/{slider}', [SliderController::class, 'updateBanner'])->name('banner.update');
        Route::delete('/banner/{slider}', [SliderController::class, 'destroyBanner'])->name('banner.destroy');
    });
});
