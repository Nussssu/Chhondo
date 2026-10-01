<?php

use App\Http\Controllers\Admin\Api\APIController;
use App\Http\Controllers\Admin\Orders\ManageOrdersController;
use Illuminate\Support\Facades\Route;

// NOTE: the public /staedfast-webhook route used to live here. It moved to web.php
// because everything in this file is now loaded behind the `admin` middleware, and
// the courier calls that endpoint unauthenticated.

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::prefix('orders')->name('orders.')->group(function () {

        Route::get('/', [ManageOrdersController::class, 'index'])->name('index');
        // Registered before /{order} routes so "pos" is not read as an order id.
        Route::get('/pos', [ManageOrdersController::class, 'posOrders'])->name('pos');
        Route::post('/cart-push/{id}', [ManageOrdersController::class, 'cartDataToGive'])->name('carPush');


        // Route::get('/checkout', [ManageOrdersController::class, 'checkout'])->name('checkout');

        Route::post('/checkout', [ManageOrdersController::class, 'checkout'])->name('checkout');

        // view invoice
        Route::get('/{order}/invoice', [ManageOrdersController::class, 'show'])->name('show');

        Route::post('/comment', [ManageOrdersController::class, 'orderComment'])->name('orderComment');
        Route::post('/ordernote', [ManageOrdersController::class, 'ordernote'])->name('ordernote');
        Route::post('/order/comment/add', [ManageOrdersController::class, 'ordercommentadd'])->name('ordercommentadd');

        // Add this route for the AJAX request
        Route::post('updatestatus', [ManageOrdersController::class, 'updateStatus'])->name('updateStatus');
        Route::post('/mark-viewed', [ManageOrdersController::class, 'markViewed'])->name('markViewed');


        // DELETE, not GET: a destructive action over GET has no CSRF protection and
        // can be fired by a link prefetch or a crawler.
        Route::delete('/delete/{id}', [ManageOrdersController::class, 'delete'])->name('delete')->middleware('permission:DeleteOrder');


        Route::post('/bulk-order', [ManageOrdersController::class, 'bulkProcess'])->name('bulkOrder');
        Route::get('/bulk-order-view', [ManageOrdersController::class, 'bulkOrderView'])->name('bulkOrderView');

        //bulk invoice
        Route::get('/generate-pdf', [ManageOrdersController::class, 'generatePDF'])->name('generate.pdf');

        Route::get('/consignment-status', [ManageOrdersController::class, 'fetchConsignmentStatus'])->name('consignment_status');

        //bulk csv steadfast

        Route::post('/bulk-csv-steadfast', [ManageOrdersController::class, 'bulkCSVProcessSteadfast'])->name('bulkCSVProcessSteadfast');
        Route::get('/bulk-csv-view-steadfast', [ManageOrdersController::class, 'bulkCSVViewSteadfast'])->name('bulkCSVViewSteadfast');



        //bulk status update
        Route::post('/bulk-status-update', [ManageOrdersController::class, 'bulkStatusUpdate'])->name('bulkStatusUpdate');

        //csv export
        Route::get('/export', [ManageOrdersController::class, 'exportCsv'])->name('export');

        //bulk delete

        Route::post('/bulk-delete', [ManageOrdersController::class, 'bulkDelete'])->name('bulkDelete')->middleware('permission:DeleteOrder');
        Route::post('/bulk-assign', [ManageOrdersController::class, 'bulkAssign'])->name('bulkAssign');

        //order edit

        Route::get('/edit/{id}', [ManageOrdersController::class, 'edit'])->name('edit');
        Route::get('/{id}/edit-data', [ManageOrdersController::class, 'editData'])->name('editData');
        Route::get('/{id}/details', [ManageOrdersController::class, 'orderDetails'])->name('details');
        Route::get('/get-zones/{city_id}', [ManageOrdersController::class, 'getZones'])->name('getZones');
        Route::get('/get-areas', [ManageOrdersController::class, 'getAreas'])->name('getAreas');
        Route::post('/order-info-update', [ManageOrdersController::class, 'orderInfoUpdate'])->name('orderInfoUpdate');

        //update

        Route::post('/update', [ManageOrdersController::class,  'update'])->name('update');
        //item Delete

        Route::delete('/delete-item', [ManageOrdersController::class,  'deleteitem'])->name('deleteitem');

        //Manage Steadfast Couriar
        // POST, not GET: this creates a real consignment and charges a real
        // COD amount, so a prefetch or a Back button must never dispatch it.
        Route::post('/send-steadfast/{id}', [APIController::class, 'sendSteadfast'])->name('steadfast');
        Route::post('/bulkSteadfast', [ApiController::class, 'bulkSendSteadfast'])->name('bulkSteadfast');

        //Manage REDX Couriar
        Route::get('/send-redx/{id}', [APIController::class, 'sendRedx'])->name('redx');
        // get area
        Route::get('/get-area', [APIController::class, 'getArea'])->name('getArea');
        // get city
        Route::get('/get-city', [APIController::class, 'getCity'])->name('getCity');


        //Bulk send redx
        Route::post('/bulkredx', [APIController::class, 'sendBulkRedx'])->name('sendBulkRedx');

        //Send Pathao
        Route::get('/send-pathao/{id}', [APIController::class, 'sendPathao'])->name('pathao');

        //Bulk send pathao
        Route::post('/send-to-pathao', [APIController::class, 'sendBulkPathao'])->name('sendBulkPathao');

        // order now button
        Route::post('/order-now', [ManageOrdersController::class, 'orderNow'])->name('orderNow');


        
                // check froudecheke
        Route::get('/froude-check/{phone_number}', [ManageOrdersController::class, 'froudeCheckData'])->name('froudeCheck');
        Route::get('/froude-check-json/{phone_number}', [ManageOrdersController::class, 'froudeCheckJson'])->name('froudeCheckJson');
    });
});
