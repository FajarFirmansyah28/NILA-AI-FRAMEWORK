<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PredictionController extends Controller
{
    // MENYIMPAN DATA PREDIKSI KE DATABASE
public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'User tidak terdeteksi oleh Auth'], 401);
        }

        $request->validate([
            'temperature' => 'required|numeric',
            'ph' => 'required|numeric',
            'dissolved_oxygen' => 'required|numeric',
            'fish_weight' => 'required|numeric',
        ]);

        $argTemp = escapeshellarg($request->temperature);
        $argPh = escapeshellarg($request->ph);
        $argDo = escapeshellarg($request->dissolved_oxygen);
        $argWeight = escapeshellarg($request->fish_weight);

        // Path ke script
        $scriptPath = base_path('app/Scripts/predict.py');
        
        // PENTING: Gunakan path ke python di dalam .venv agar library terbaca
        // Sesuaikan path ini dengan lokasi .venv kamu
        $pythonPath = base_path('.venv/Scripts/python.exe'); 
        
        // Command untuk menjalankan python
        $command = "$pythonPath $scriptPath $argTemp $argPh $argDo $argWeight 2>&1";
        
        $output = shell_exec($command);
        $result = json_decode($output, true);

        // --- DEBUGGING: TANGKAP ERROR JIKA GAGAL ---
        if (json_last_error() !== JSON_ERROR_NONE || !$result || isset($result['error'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendapatkan hasil prediksi dari model Python.',
                'raw_output' => $output, // INI AKAN MENUNJUKKAN ERROR ASLINYA
                'command_used' => $command
            ], 500);
        }
        // -------------------------------------------

        $prediction = Prediction::create([
            'user_id' => Auth::id(), 
            'temperature' => $request->temperature,
            'ph' => $request->ph,
            'dissolved_oxygen' => $request->dissolved_oxygen,
            'fish_weight' => $request->fish_weight,
            'prediction_result' => $result['hasil_prediksi'],
            'multiplier_rate' => $result['multiplier_rate'],
            'decision_method' => $result['metode_keputusan'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data prediksi berhasil diproses!',
            'data' => $prediction
        ], 201);
    }

    // MENGAMBIL RIWAYAT PREDIKSI UNTUK GRAFIK DASHBOARD FAJAR
    public function index()
    {
        $history = Prediction::where('user_id', Auth::id())
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json([
            'status' => 'success',
            'data' => $history
        ]);
    }

    public function destroy($id)
    {
        // Mencari prediksi berdasarkan ID dan pastikan milik user yang sedang login
        $prediction = Prediction::where('id', $id)
                                ->where('user_id', Auth::id())
                                ->first();

        if ($prediction) {
            $prediction->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Riwayat analisis berhasil dihapus!'
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Data tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya.'
        ], 404);
    }
}