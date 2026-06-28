<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\DashboardController; // Tambahkan ini
use App\Http\Controllers\MonitoringController; // Tambahkan ini

// ROUTE PUBLIC
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// ROUTE PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth-related
    Route::post('/logout', [AuthController::class, 'logout']);

    // SPK Smart Aquaculture
    Route::post('/predict-and-save', [PredictionController::class, 'store']);
    Route::get('/prediction-history', [PredictionController::class, 'index']);
    Route::delete('/prediction-history/{id}', [PredictionController::class, 'destroy']); 
    
    // --- TAMBAHAN BARU ---
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
    Route::get('/monitoring-logs', [MonitoringController::class, 'index']);
    
});