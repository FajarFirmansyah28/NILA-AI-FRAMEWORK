<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Support\Facades\Auth;

class MonitoringController extends Controller
{
    public function index()
    {
        // Mengambil 10 data sensor air terbaru milik user
        $logs = Prediction::where('user_id', Auth::id())
                          ->orderBy('created_at', 'desc')
                          ->limit(10)
                          ->get();

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }
}