<?php

use App\Http\Controllers\Admin\Purchase\PurchaseController;

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('purchase')->name('purchase.')->group(function () {

        Route::get('/', [PurchaseController::class, 'index'])->name('index');
        Route::get('/export', [PurchaseController::class, 'exportCsv'])->name('export');
        Route::post('/', [PurchaseController::class, 'store'])->name('store');
        Route::get('/{purchase}/show', [PurchaseController::class, 'show'])->name('show');
        Route::get('/{purchase}/edit', [PurchaseController::class, 'edit'])->name('edit');
        // Route::post('/{purchase}', [PurchaseController::class, 'update'])->name('update');
        Route::patch('/{id}/status', [PurchaseController::class, 'updateStatus'])->name('status');
        Route::delete('/{id}', [PurchaseController::class, 'destroy'])->name('destroy');

        Route::post('/product/store', [PurchaseController::class, 'productStore'])->name('products.store');
        Route::post('/product/update', [PurchaseController::class, 'productUpdate'])->name('products.update');
        Route::delete('/product/delete', [PurchaseController::class, 'productDelete'])->name('products.delete');

        // purchase update
        Route::put('/update', [PurchaseController::class, 'updatePurchase'])->name('update.purchase');
        // /admin/purchase/pay', 'POST'
        Route::post('/pay', [PurchaseController::class, 'pay'])->name('admin.purchase.pay');
        // admin.suppliers.payment.history
        Route::get('/payment/history', [PurchaseController::class, 'paymentHistory'])->name('payment.history');
    });
});
