<?php

use App\Http\Controllers\Api\Profile\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
|
| This file used to expose ~35 endpoints from an era when the storefront was a
| separate SPA. That frontend was merged into this application as Inertia pages,
| and the only thing still calling /api/v1 is resources/js/Store/wishlistStore.js
| through resources/js/services/axiosInstance.js — the three routes below.
|
| The rest were removed rather than maintained: they were a large public,
| untested surface that duplicated the web routes, and several were actively
| unsafe (an unauthenticated order-history endpoint keyed on a user id from the
| URL, an unauthenticated write to any user record, order lookup by phone
| number, and a JWT login that could never work because no secret was set).
| Deleting them supersedes the hardening those endpoints had received.
|
| Everything the storefront needs now lives in routes/web.php.
|
*/

Route::prefix('v1')->middleware('auth:web')->group(function () {
    Route::get('/wishlist-count', [ProfileController::class, 'wishlistCount']);
    Route::post('add/to/wishlist/{id}', [ProfileController::class, 'addWishlist']);
    Route::post('remove/from/wishlist/{id}', [ProfileController::class, 'removeWishlist']);
});
