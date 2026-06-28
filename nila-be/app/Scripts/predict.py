import warnings
warnings.filterwarnings("ignore")

import sys
import json
import numpy as np
import os

# Coba import joblib untuk model eksternal
JOBLIB_AVAILABLE = False
try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    pass

def prediksi_manajemen_pakan(temperature, ph, do, weight):
    # -------------------------------------------------------------------------
    # LAYER 1: OVERRIDE SAFETY RULES (ATURAN KESELAMATAN BIOLOGIS AIR)
    # -------------------------------------------------------------------------
    if do < 4.0 or ph < 6.0 or ph > 9.0 or temperature < 24.0 or temperature > 32.0:
        multiplier_pakan = 0.50
        status_teks = "LOW FEED (Kurangi Pakan Hingga 50%)"
        metode_pengambilan_keputusan = "🚨 OVERRIDE SYSTEM: Lapisan Pengaman Biologis Aktif (Kondisi Air Kritis!)"
        
        alasan = []
        if do < 4.0: 
            alasan.append(f"Oksigen Terlarut Terlalu Rendah ({do} mg/L)")
        if ph < 6.0 or ph > 9.0: 
            alasan.append(f"pH Air Ekstrem ({ph})")
        if temperature < 24.0 or temperature > 32.0: 
            alasan.append(f"Suhu Kolam Berbahaya ({temperature}°C)")
        catatan_analis = " | ".join(alasan)

        return {
            "status": "sukses",
            "hasil_prediksi": status_teks,
            "multiplier_rate": f"{multiplier_pakan * 100}%",
            "metode_keputusan": metode_pengambilan_keputusan,
            "catatan_analis": catatan_analis,
            "input_data": {
                "temperature": temperature,
                "ph": ph,
                "do": do,
                "weight": weight
            }
        }

    # -------------------------------------------------------------------------
    # LAYER 2: MACHINE LEARNING UTAMA (K-NN SUPERVISED - JOBLIB)
    # -------------------------------------------------------------------------
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'knn_model_revisi_final.joblib')
    scaler_path = os.path.join(script_dir, 'scaler_revisi_final.joblib')

    if JOBLIB_AVAILABLE and os.path.exists(model_path) and os.path.exists(scaler_path):
        try:
            knn_model = joblib.load(model_path)
            scaler_knn = joblib.load(scaler_path)

            # Urutan fitur sinkron dengan model training: [pH, Weight, DO, Temperature]
            input_data = np.array([[ph, weight, do, temperature]])
            input_scaled = scaler_knn.transform(input_data)

            pred_class = int(knn_model.predict(input_scaled)[0])
            
            metode_pengambilan_keputusan = "🤖 K-NN ENGINE: Keputusan Berdasarkan Kedekatan Jarak Pola Data (K=13)"
            catatan_analis = "Kondisi parameter air kolam stabil dalam batas toleransi biologis harian."

            if pred_class == 2:
                status_teks = "HIGH FEED (Berikan Pakan Optimal 100%)"
                multiplier_pakan = 1.00
            elif pred_class == 1:
                status_teks = "MEDIUM FEED (Berikan Pakan Standar 80%)"
                multiplier_pakan = 0.80
            else:
                status_teks = "LOW FEED (Kurangi Pakan Hingga 50%)"
                multiplier_pakan = 0.50

            return {
                "status": "sukses",
                "hasil_prediksi": status_teks,
                "multiplier_rate": f"{multiplier_pakan * 100}%",
                "metode_keputusan": metode_pengambilan_keputusan,
                "catatan_analis": catatan_analis,
                "input_data": {
                    "temperature": temperature,
                    "ph": ph,
                    "do": do,
                    "weight": weight
                }
            }
        except Exception:
            pass

    # -------------------------------------------------------------------------
    # LAYER 3: FALLBACK K-NN (ALGORITMA K-NN MANUAL PURE PYTHON - K=13)
    # -------------------------------------------------------------------------
    training_data = [
        [7.91, 269.15, 6.82, 27.30, 2],  # High
        [7.35, 278.08, 6.47, 26.52, 1],  # Medium
        [7.97, 286.24, 7.85, 28.33, 2],  # High
        [7.50, 150.00, 5.80, 26.00, 1],  # Medium
        [7.10, 100.00, 5.20, 25.00, 0],  # Low
        [8.20, 350.00, 7.20, 29.50, 2],  # High
        [7.60, 220.00, 6.10, 27.50, 1],  # Medium
        [6.80, 120.00, 4.90, 24.80, 0],  # Low
        [6.50, 180.00, 5.50, 25.80, 1],  # Medium
        [8.10, 310.00, 6.95, 28.10, 2],  # High
        [5.80, 140.00, 3.80, 23.50, 0],  # Low
        [7.40, 200.00, 6.30, 26.90, 1],  # Medium
        [7.85, 295.00, 7.10, 27.80, 2],  # High
        [6.20, 115.00, 4.50, 24.50, 0],  # Low
        [7.65, 245.00, 6.60, 27.10, 1],  # Medium
        [8.05, 330.00, 7.40, 28.90, 2],  # High
    ]

    def hitung_jarak(p1, p2):
        return (
            (p1[0] - p2[0])**2 + 
            ((p1[1] - p2[1]) / 100.0)**2 + 
            (p1[2] - p2[2])**2 + 
            (p1[3] - p2[3])**2
        )**0.5

    input_point = [ph, weight, do, temperature]
    
    jarak_list = []
    for item in training_data:
        d = hitung_jarak(input_point, item[:4])
        jarak_list.append((d, item[4]))
    
    jarak_list.sort(key=lambda x: x[0])
    
    tetangga = jarak_list[:13]
    pred_classes = [t[1] for t in tetangga]
    
    pred_class = max(set(pred_classes), key=pred_classes.count)

    metode_pengambilan_keputusan = "🤖 FALLBACK K-NN ENGINE: Keputusan Berdasarkan Perhitungan Jarak Manual (K=13)"
    catatan_analis = "Menggunakan database latih internal karena library joblib tidak tersedia pada perangkat lokal server."

    if pred_class == 2:
        status_teks = "HIGH FEED (Berikan Pakan Optimal 100%)"
        multiplier_pakan = 1.00
    elif pred_class == 1:
        status_teks = "MEDIUM FEED (Berikan Pakan Standar 80%)"
        multiplier_pakan = 0.80
    else:
        status_teks = "LOW FEED (Kurangi Pakan Hingga 50%)"
        multiplier_pakan = 0.50

    return {
        "status": "sukses",
        "hasil_prediksi": status_teks,
        "multiplier_rate": f"{multiplier_pakan * 100}%",
        "metode_keputusan": metode_pengambilan_keputusan,
        "catatan_analis": catatan_analis,
        "input_data": {
            "temperature": temperature,
            "ph": ph,
            "do": do,
            "weight": weight
        }
    }

def main():
    if len(sys.argv) < 5:
        if len(sys.argv) == 2:
            try:
                parts = sys.argv[1].split(',')
                temperature = float(parts[0].strip())
                ph = float(parts[1].strip())
                do = float(parts[2].strip())
                weight = float(parts[3].strip())
            except Exception:
                print(json.dumps({"error": "Format input_data string tidak valid"}))
                return
        else:
            print(json.dumps({"error": "Argumen kurang (butuh Suhu, pH, DO, Berat)"}))
            return
    else:
        try:
            temperature = float(sys.argv[1])
            ph = float(sys.argv[2])
            do = float(sys.argv[3])
            weight = float(sys.argv[4])
        except ValueError:
            print(json.dumps({"error": "Argumen input harus berupa angka"}))
            return

    hasil = prediksi_manajemen_pakan(temperature, ph, do, weight)
    print(json.dumps(hasil))

if __name__ == "__main__":
    main()