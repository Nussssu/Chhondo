<?php

use App\Http\Controllers\Admin\MediaLibrary\MediaLibraryController;

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('media-library')->name('media-library.')->group(function () {
        Route::get('/', [MediaLibraryController::class, 'index'])->name('index');
        Route::get('/picker', [MediaLibraryController::class, 'picker'])->name('picker');
        Route::post('/upload', [MediaLibraryController::class, 'upload'])->name('upload');
        Route::post('/bulk-delete', [MediaLibraryController::class, 'bulkDestroy'])->name('bulk-delete');
        Route::get('/{id}/usage', [MediaLibraryController::class, 'usage'])->name('usage');
        Route::patch('/{id}', [MediaLibraryController::class, 'update'])->name('update');
        Route::delete('/{id}', [MediaLibraryController::class, 'destroy'])->name('destroy');
    });
});
