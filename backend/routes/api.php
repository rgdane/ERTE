<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\ResidentHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('residents', ResidentController::class);
Route::apiResource('houses', HouseController::class);

Route::apiResource('resident-histories', ResidentHistoryController::class);
Route::get('residents/{resident_id}/histories', [ResidentHistoryController::class, 'indexByResident']);
Route::get('houses/{house_id}/histories', [ResidentHistoryController::class, 'indexByHouse']);

Route::apiResource('payments', PaymentController::class);
Route::apiResource('expenses', ExpenseController::class);

Route::get('payment-summary/{year}', [ReportController::class, 'getPaymentsByYear']);
Route::get('payment-summary/{year}/{month}', [ReportController::class, 'getPaymentsDetail']);
Route::get('expense-summary/{year}', [ReportController::class, 'getExpensesByYear']);
Route::get('expense-summary/{year}/{month}', [ReportController::class, 'getExpensesDetail']);
Route::get('years', [ReportController::class, 'getYear']);


