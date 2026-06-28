<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineLearningController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/predict-local', [MachineLearningController::class, 'predictLocal']);

