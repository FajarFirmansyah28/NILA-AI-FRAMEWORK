import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, 'cleaned_dataset.csv')

    # Cek jika dataset csv ada di folder yang sama
    if not os.path.exists(dataset_path):
        # Cek jika dataset ada di root nila-be
        root_path = os.path.abspath(os.path.join(script_dir, '..', '..'))
        dataset_path = os.path.join(root_path, 'cleaned_dataset.csv')
        
    if not os.path.exists(dataset_path):
        print(f"[ERROR] Dataset tidak ditemukan di {dataset_path}. Harap pindahkan file cleaned_dataset.csv ke folder tersebut.")
        return

    print(f"[1/4] Membaca dataset dari {dataset_path}...")
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip()

    # Rename kolom sensor agar konsisten
    df = df.rename(columns={
        'Temperature (°C)': 'Temperature',
        'Turbidity (NTU)': 'Turbidity (NTU)'
    })
    df = df.dropna()
    print(f"[SUKSES] Total data dibaca: {df.shape[0]} baris.")

    # Pembentukan label pakan ilmiah berdasarkan rules
    print("[2/4] Melakukan labeling data menggunakan aturan pengaman biologis...")
    def penentuan_label_pakan_ilmiah(row):
        temp = row['Temperature']
        ph = row['pH']
        do = row['Dissolved Oxygen (mg/L)']
        intervensi = row['Corrective Interventions']

        if intervensi > 2 or do < 4.0 or ph < 6.0 or ph > 9.0 or temp < 24 or temp > 32:
            return 0  # Low Feed
        elif 1 <= intervensi <= 2:
            return 1  # Medium Feed
        else:
            return 2  # High Feed

    df['Label_Pakan'] = df.apply(penentuan_label_pakan_ilmiah, axis=1)

    # Menentukan fitur terpilih
    selected_features = ['pH', 'Average Fish Weight (g)', 'Dissolved Oxygen (mg/L)', 'Temperature']
    X = df[selected_features]
    y = df['Label_Pakan']

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("[3/4] Melatih model K-NN (K=13)...")
    # Standarisasi skala data
    scaler_knn = StandardScaler()
    X_train_scaled = scaler_knn.fit_transform(X_train)

    # Training model KNN
    knn_model = KNeighborsClassifier(n_neighbors=13, weights='distance')
    knn_model.fit(X_train_scaled, y_train)
    print("[SUKSES] Pelatihan model selesai.")

    # Menyimpan file model .joblib
    print("[4/4] Menyimpan model dan scaler ke file .joblib...")
    model_output_path = os.path.join(script_dir, 'knn_model_revisi_final.joblib')
    scaler_output_path = os.path.join(script_dir, 'scaler_revisi_final.joblib')
    
    joblib.dump(knn_model, model_output_path)
    joblib.dump(scaler_knn, scaler_output_path)
    
    print("\n==============================================")
    print("[BERHASIL] File model dan scaler siap digunakan:")
    print(f"1. Model: {model_output_path}")
    print(f"2. Scaler: {scaler_output_path}")
    print("==============================================")

if __name__ == "__main__":
    main()
