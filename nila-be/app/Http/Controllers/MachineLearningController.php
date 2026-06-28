<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MachineLearningController extends Controller
{
    /**
     * Memproses prediksi rekomendasi pakan harian ikan nila
     * menggunakan integrasi model Machine Learning local (Python).
     */
    public function predictLocal(Request $request)
    {
        $temperature = null;
        $ph = null;
        $do = null;
        $weight = null;

        // 1. Validasi Input: Cek jika data dikirim sebagai 4 parameter sensor terpisah (Metode Baru)
        if ($request->has(['temperature', 'ph', 'do', 'weight'])) {
            $request->validate([
                'temperature' => 'required|numeric',
                'ph'          => 'required|numeric',
                'do'          => 'required|numeric',
                'weight'      => 'required|numeric',
            ]);
            
            $temperature = floatval($request->input('temperature'));
            $ph          = floatval($request->input('ph'));
            $do          = floatval($request->input('do'));
            $weight      = floatval($request->input('weight'));
        } else {
            // 2. Cadangan: Jika dikirim berupa satu string koma lewat input_data (Metode Lama)
            $request->validate([
                'input_data' => 'required|string',
            ]);
            
            $inputText = $request->input('input_data');
            $parts = explode(',', $inputText); // Pecah teks berdasarkan koma

            if (count($parts) >= 4) {
                $temperature = floatval(trim($parts[0]));
                $ph          = floatval(trim($parts[1]));
                $do          = floatval(trim($parts[2]));
                $weight      = floatval(trim($parts[3]));
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Format tidak valid. Masukkan 4 angka dipisahkan koma (Suhu, pH, DO, Berat) atau kirim 4 parameter sensor terpisah.'
                ], 400);
            }
        }

        // Path menuju script eksekusi Python di dalam project Laravel
        $scriptPath = base_path('app/Scripts/predict.py');

        // 3. Keamanan: Bungkus setiap variabel dengan escapeshellarg agar aman dari Command Injection
        $argTemp   = escapeshellarg($temperature);
        $argPh     = escapeshellarg($ph);
        $argDo     = escapeshellarg($do);
        $argWeight = escapeshellarg($weight);

        // 4. Eksekusi: Jalankan script Python dengan mengirimkan 4 argumen berturut-turut.
        // Menggunakan 'python' agar kompatibel baik di Windows, Mac, maupun Linux (Server).
        $command = "py $scriptPath $argTemp $argPh $argDo $argWeight 2>&1";
        $output = shell_exec($command);
        
        // 5. Response: Decode hasil print JSON murni dari script Python
        $result = json_decode($output, true);

        if ($result === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada sistem eksekusi script Python.',
                'detail_message' => $output
            ], 500);
        }

        return response()->json($result);
    }
}