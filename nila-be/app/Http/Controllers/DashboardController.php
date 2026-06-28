<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // 1. Total Prediksi
        $totalPredictions = Prediction::where('user_id', $userId)->count();

        // 2. Rata-rata pH (Contoh statistik kesehatan air)
        $avgPh = Prediction::where('user_id', $userId)->avg('ph');

        // 3. Prediksi terakhir (Untuk status kesehatan)
        $latest = Prediction::where('user_id', $userId)->latest()->first();

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_predictions' => $totalPredictions,
                'avg_ph' => round($avgPh, 2),
                'last_status' => $latest ? $latest->prediction_result : 'No Data',
            ]
        ]);
    }
}