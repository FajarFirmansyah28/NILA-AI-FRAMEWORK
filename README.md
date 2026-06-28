# 🐟 NILA AI

<p align="center">
  <h3 align="center">Smart Fisheries Decision Support System</h3>
  <p align="center">
    Web-based application for water quality monitoring and tilapia feed prediction using Machine Learning.
  </p>
</p>

---

# 📖 About The Project

NILA AI merupakan aplikasi berbasis web yang dikembangkan sebagai implementasi hasil penelitian **Data Mining** ke dalam mata kuliah **Framework**. Aplikasi ini bertujuan membantu proses monitoring kualitas air serta memberikan rekomendasi pemberian pakan ikan nila berdasarkan kondisi lingkungan budidaya.

Model Machine Learning yang digunakan adalah **K-Nearest Neighbors (K-NN)** yang telah dilatih sebelumnya dan diintegrasikan ke dalam aplikasi menggunakan **Python**. Seluruh proses prediksi dijalankan melalui backend Laravel sehingga pengguna dapat memperoleh hasil rekomendasi secara cepat melalui antarmuka web.

---

# ✨ Features

- 🔐 User Authentication (Login & Register)
- 📊 Dashboard Overview
- 🤖 AI Feed Prediction
- 🌊 Water Quality Monitoring
- 📜 Prediction History
- 📈 Data Visualization
- 💾 Automatic Prediction Logging
- 📱 Responsive User Interface

---

# 🛠 Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

## Backend

- Laravel
- Laravel Sanctum
- REST API
- PHP

## Machine Learning

- Python
- Scikit-Learn
- K-Nearest Neighbors (K-NN)
- Joblib
- NumPy
- Pandas

## Database

- MySQL

---

# 🏗 System Architecture

The application consists of four main components:

```
React Frontend
        │
        ▼
Laravel Backend
        │
        ▼
Python Prediction Module
(predict.py)
        │
        ▼
K-NN Model (.joblib)
        │
        ▼
MySQL Database
```

---

# 📂 Project Structure

```
NILA-AI-FRAMEWORK
│
├── nila-fe
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
├── nila-be
│   ├── app
│   ├── database
│   ├── routes
│   ├── Scripts
│   │   ├── predict.py
│   │   ├── train.py
│   │   ├── knn_model_revisi_final.joblib
│   │   └── scaler_revisi_final.joblib
│   ├── artisan
│   └── ...
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/FajarFirmansyah28/NILA-AI-FRAMEWORK.git
```

---

## Frontend Installation

```bash
cd nila-fe

npm install

npm run dev
```

Frontend akan berjalan pada

```
http://localhost:5173
```

---

## Backend Installation

```bash
cd nila-be

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

Backend akan berjalan pada

```
http://127.0.0.1:8000
```

---

# 🤖 Machine Learning Module

Aplikasi menggunakan model **K-Nearest Neighbors (K-NN)** yang telah dilatih sebelumnya.

Model disimpan dalam format:

```
knn_model_revisi_final.joblib
```

dan menggunakan

```
scaler_revisi_final.joblib
```

Saat pengguna menjalankan prediksi, Laravel akan mengeksekusi script:

```
Scripts/predict.py
```

Script tersebut akan:

- membaca input pengguna
- melakukan preprocessing
- menjalankan model K-NN
- menghasilkan rekomendasi pakan
- mengembalikan hasil ke Laravel

---

# 🗄 Database

Database menggunakan **MySQL** dengan tiga tabel utama:

- users
- monitoring_logs
- predictions

---

# 🚀 Workflow

```
User
 │
 ▼
React Frontend
 │
 ▼
Laravel Backend
 │
 ▼
predict.py
 │
 ▼
K-NN Model
 │
 ▼
Prediction Result
 │
 ▼
Laravel
 │
 ▼
MySQL
 │
 ▼
React
```

---


# 📚 Academic Information

This project was developed as the Final Project for the **Web Framework** course.

The Machine Learning model implemented in this application is the result of a previous **Data Mining** project and has been integrated into a modern web application using React and Laravel.

---

# 👨‍💻 Authors

- Mochammad Fajar Firmansyah
- Elia Gustanail Bukit
- Kadek Dimas Agung Wisnu
- Vendra Gumelar Okinda
- Mahmud Dwi Ismaryanto


---

# 📄 License

Academic Project

Universitas Pendidikan Ganesha

2026

---
