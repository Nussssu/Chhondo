<?php

use App\Http\Controllers\Admin\Manage\ManageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('manage')->name('manage.')->group(function () {
        Route::get('/', [ManageController::class, 'index'])->name('index');
        Route::match(['post', 'put'], '/store-or-update', [ManageController::class, 'storeOrUpdateSite'])->name('storeOrUpdate');
        // Closes the storefront to visitors; staff still get through.
        Route::post('/maintenance-mode', [ManageController::class, 'updateMaintenanceMode'])->name('maintenanceMode');
        // Delivery rates and the free-shipping rule, together on one screen.
        Route::get('/delivery', [ManageController::class, 'delivery'])->name('delivery');

        // smtp setting
        Route::get('/smtp-setting', [ManageController::class, 'smtpSetting'])->name('smtpSetting');
        Route::match(['post', 'put'], '/store-or-update-smtp', [ManageController::class, 'storeOrUpdateSmtp'])->name('storeOrUpdateSmtp');

        // Email templates — the wording of each transactional email, plus a
        // test send so the settings can be proved without a real order.
        Route::post('/email-templates/{key}', [ManageController::class, 'updateEmailTemplate'])->name('emailTemplate.update');
        Route::delete('/email-templates/{key}', [ManageController::class, 'resetEmailTemplate'])->name('emailTemplate.reset');
        Route::get('/email-templates/{key}/preview', [ManageController::class, 'previewEmailTemplate'])->name('emailTemplate.preview');
        Route::post('/send-test-email', [ManageController::class, 'sendTestEmail'])->name('sendTestEmail');

        Route::get('/social-media-links', [ManageController::class, 'socialMediaLinks'])->name('social.media.links');

    });
});
;