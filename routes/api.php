<?php

use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::middleware(['web', 'api.auth'])->group(function () {
    
    // Event History API endpoints
    Route::prefix('events')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('api.events.index');
        Route::get('/stats', [EventController::class, 'stats'])->name('api.events.stats');
        Route::get('/type/{eventType}', [EventController::class, 'byType'])->name('api.events.by-type');
        Route::get('/vehicle/{vehicleReference}', [EventController::class, 'byVehicle'])->name('api.events.by-vehicle');
    });
    
});
