<?php

use App\Http\Controllers\Admin\Api\APIController;
use App\Http\Controllers\Admin\Blog\BlogController;
use App\Http\Controllers\Admin\BlogCategory\BlogCategoryController;
use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\Admin\Profile\ProfileController;
use App\Http\Controllers\Backend\SmsPromotionController;
use Illuminate\Support\Facades\Route;



Route::group(['middleware' => ['auth'], 'prefix' => 'admin'], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('permission:Dashboard');

    //All available user
    Route::get('/user', [ProfileController::class, 'users'])->name('users');
    Route::get('/user/{id}/detail', [ProfileController::class, 'show'])->name('users.show');
    // DELETE, not GET — see the note on admin.orders.delete.
    Route::delete('/user/{id}', [ProfileController::class, 'delete'])->name('users.delete');
    Route::patch('/user/toggle-block/{id}', [ProfileController::class, 'blockUser'])->name('users.toggle-block');
    
    Route::get('/sms/promotions', [SmsPromotionController::class, 'index'])->name('sms.promotion');
    Route::post('/sms/promotions/send', [SmsPromotionController::class, 'send'])->name('sms.promotion.send');

    //Profile Setting
    Route::get('/profile-setting', [ProfileController::class, 'profileSetting'])->name('profileSetting');
    Route::post('/profile-update', [ProfileController::class, 'profileUpdate'])->name('profileUpdate');
    Route::post('/password-update', [ProfileController::class, 'passwordUpdate'])->name('passwordUpdate');

    //Product Manage
    // Route::resource('products', ProductController::class);

    Route::get('products', [ProductController::class, 'index'])
        ->name('products.index')
        ->middleware('permission:AllProduct');

    // A read-only download, so it sits behind the same gate as the list.
    Route::get('products/export-social', [ProductController::class, 'exportSocial'])
        ->name('products.export_social')
        ->middleware('permission:AllProduct');

    // PATCH, not GET: this mutates the product.
    Route::patch('products/new-arrival/{id}', [ProductController::class, 'newArrivalToggle'])
        ->name('products.new_arrival_toggle');

    Route::patch('products/is_home/{id}', [ProductController::class, 'is_home_toggle'])
        ->name('products.is_home_toggle')
        ->middleware('permission:AllProduct');

    Route::get('products/create', [ProductController::class, 'create'])
        ->name('products.create')->middleware('permission:AddProduct');

    Route::post('products', [ProductController::class, 'store'])
        ->name('products.store')->middleware('permission:AddProduct');;


    Route::get('products/{product}/edit', [ProductController::class, 'edit'])
        ->name('products.edit');


    Route::put('products/{product}', [ProductController::class, 'update'])
        ->name('products.update');


    Route::delete('products/{product}', [ProductController::class, 'destroy'])
        ->name('products.destroy')->middleware('permission:DeleteProduct');

    // Copying creates a product, so it sits behind the same gate as adding one.
    Route::post('products/{product}/duplicate', [ProductController::class, 'duplicate'])
        ->name('products.duplicate')->middleware('permission:AddProduct');

    //End


    //ajax toggle status
    Route::patch('/products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggleStatus');
    //Ajax Toggle Feature
    Route::patch('/products/{product}/toggle-feature', [ProductController::class, 'toggleFeature']);

    //Ajax request for grab purchase based data
    Route::get('/get-purchase-data/{product_code}', [ProductController::class, 'getPurchaseData']);

    //filter product
    Route::get('/filter-products', [ProductController::class, 'filter'])->name('filter.products');

    //Bulk delete ajax request

    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);

    //Bulk publish ans Unpublish

    Route::post('/products/bulk-publish', [ProductController::class, 'bulkPublish'])->name('products.bulk.publish');
    Route::post('/products/bulk-unpublish', [ProductController::class, 'bulkUnpublish'])->name('products.bulk.unpublish');


    //Manage Blog
    // Registered before the resource routes so "{blog}/duplicate" is not read
    // as a blog id.
    Route::post('blogs/{blog}/duplicate', [BlogController::class, 'duplicate'])->name('blogs.duplicate');
    Route::resource('blogs', BlogController::class);

    //Manage Blog Category

    // Create/edit happen in a modal on the index page.
    Route::resource('blog-category', BlogCategoryController::class)->except(['create', 'edit', 'show']);

    //blog category toggle status

    Route::post('/blog-category/toggle-status', [BlogCategoryController::class, 'toggleStatus'])->name('blog-category.toggle-status');



    //Manage API
    Route::get('/couriar-api', [APIController::class, 'index'])->name('couriarApi');
    Route::post('/couriar-api', [APIController::class, 'storeOrUpdateCourier'])->name('couriarApi.store');
    Route::post('/couriar-api/steadfast-webhook', [APIController::class, 'updateSteadfastWebhook'])->name('couriarApi.steadfastWebhook');

    //    // Api Token Generate
    //     Route::get('/api-token', [APIController::class, 'apiToken'])->name('apiToken');
    Route::post('/api-token', [APIController::class, 'generateApiToken'])->name('generateApiToken');


    Route::get('/sms-api', [APIController::class, 'smsApi'])->name('smsApi');
    Route::post('/sms-api-store', [APIController::class, 'storeOrUpdateSms'])->name('sms.store');
    Route::post('/get-balance', [APIController::class, 'getBalance'])->name('sms.getBalance');
    Route::post('/sms-test', [APIController::class, 'sendTestSms'])->name('sms.test');

    Route::get('/payment-api', [APIController::class, 'paymentApi'])->name('paymentApi');
    Route::post('/payment-api-store', [APIController::class, 'storeOrUpdatePayment'])->name('payment.store');

    Route::middleware('permission:PaymentApi')->group(function () {
        Route::get('/bkash-api', [APIController::class, 'bkashApi'])->name('bkashApi');
        Route::post('/bkash-api-store', [APIController::class, 'storeOrUpdateBkash'])->name('bkash.store');
        Route::post('/bkash-api-test', [APIController::class, 'testBkash'])->name('bkash.test');
    });


    // analytics dashboard
    Route::get('/analytics', [DashboardController::class, 'analytics'])
        ->name('admin.analytics')
        ->middleware('permission:AnalyticsDashboard');
});
