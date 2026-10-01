<?php

use App\Http\Controllers\Admin\ContactMessage\ContactMessageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('contact-messages')->name('contact-messages.')->group(function () {
        Route::get('/', [ContactMessageController::class, 'index'])->name('index');
        Route::get('/unread-count', [ContactMessageController::class, 'unreadCount'])->name('unread-count');
        Route::get('/{id}', [ContactMessageController::class, 'show'])->name('show');
        Route::delete('/{id}', [ContactMessageController::class, 'destroy'])->name('destroy');
    });
});
