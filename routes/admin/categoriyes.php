<?php

use App\Http\Controllers\Admin\Categoryies\CategoriyesController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoriyesController::class, 'index'])->name('index');
        Route::post('/', [CategoriyesController::class, 'store'])->name('store');

        // Every fixed path is registered before POST /{category}, which would
        // otherwise swallow it and look the word up as a category id. That is
        // what had been happening to update-status.
        Route::post('/serial/update', [CategoriyesController::class, 'serialUpdate'])->name('serialUpdate');
        Route::post('/update-status', [CategoriyesController::class, 'updateStatus'])->name('updateStatus');
        Route::post('/update-filter-visibility', [CategoriyesController::class, 'updateFilterVisibility'])->name('updateFilterVisibility');

        Route::post('/{category}', [CategoriyesController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoriyesController::class, 'destroy'])->name('destroy');
    });
});