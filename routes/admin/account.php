<?php

// add-account-type


use App\Http\Controllers\Admin\Account\AccountController;

use Illuminate\Support\Facades\Route;


Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('account')->name('account.')->group(function () {
      //add-account-type
        Route::get('/', [AccountController::class, 'index'])->name('add-account-type');

        Route::post('/', [AccountController::class, 'store'])->name('store');

        // Account types are created/edited in a modal on the index page.

        Route::patch('/{accountType}', [AccountController::class, 'update'])->name('update');

        Route::delete('/{accountType}', [AccountController::class, 'destroy'])->name('destroy');

        //dashboard

        // Unified Account screen (overview cards + tabbed tables). Keeps the
        // 'dashboard' route name so existing links/permissions continue to work.
        Route::get('/dashboard', [AccountController::class, 'manage'])->name('dashboard');
        Route::get('/legacy-dashboard', [AccountController::class, 'dashboard'])->name('legacy-dashboard');

        // accountPurpose
        Route::get('/accountPurpose', [AccountController::class, 'accountPurpose'])->name('accountPurpose');


        // add-purpose
        Route::post('/accountPurpose', [AccountController::class, 'storePurpose'])->name('storePurpose');


        // Purposes are created/edited in a modal on the accountPurpose page.

        Route::patch('/accountPurpose/{purpose}', [AccountController::class, 'updatePurpose'])->name('updatePurpose');

        Route::delete('/accountPurpose/{purpose}', [AccountController::class, 'destroyPurpose'])->name('destroyPurpose');

        // income
        Route::get('/income', [AccountController::class, 'income'])->name('income');
        // credit
        Route::get('/credit', [AccountController::class, 'credit'])->name('add-credit');
        // store-debit
        Route::post('/debit', [AccountController::class, 'storeDebit'])->name('store-debit');

        // debit
        Route::get('/debit', [AccountController::class, 'debit'])->name('add-debit');
        // store-credit

        // Balance Transfer
        Route::get('/balance-transfer', [AccountController::class, 'balanceTransfer'])->name('balance-transfer');

        // form for balance transfer
        Route::get('/balance-transfer-form', [AccountController::class, 'balanceTransferForm'])->name('balance-transfer-form');
        // store-balance-transfer
        Route::post('/balance-transfer', [AccountController::class, 'storeBalanceTransfer'])->name('store-balance-transfer');


        // account report
        Route::get('/account-report', [AccountController::class, 'accountReport'])->name('account-report');
        // expense
        Route::get('/expense', [AccountController::class, 'expense'])->name('expense');

    });
});
