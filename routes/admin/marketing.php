<?php

use App\Http\Controllers\Admin\MarketingTool\MarketingToolController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('marketing-tools')->name('marketing-tools.')->group(function () {
        // Create and edit happen in a modal on the index page, so the standalone
        // create/edit screens and their routes are gone.
        Route::get('/', [MarketingToolController::class, 'index'])->name('index');
        Route::post('/', [MarketingToolController::class, 'store'])->name('store');
        Route::patch('/{marketingTool}', [MarketingToolController::class, 'update'])->name('update');
        Route::delete('/{marketingTool}', [MarketingToolController::class, 'destroy'])->name('destroy');
    });
});