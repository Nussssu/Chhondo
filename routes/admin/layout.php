<?php

use App\Http\Controllers\Admin\Layout\LayoutController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('layout')->name('layout.')->group(function () {
        Route::get('/header', [LayoutController::class, 'header'])->name('header');
        Route::put('/header', [LayoutController::class, 'updateHeader'])->name('header.update');

        Route::get('/footer', [LayoutController::class, 'footer'])->name('footer');
        Route::put('/footer', [LayoutController::class, 'updateFooter'])->name('footer.update');
    });
});
