import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bersihkan token & status login jika ditolak server
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    
    // Pastikan menangkap respons yang benar dari Laravel
    if (response.data.status === "success" || response.data.access_token) {
      const token = response.data.access_token || response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true"); // SIMPAN STATUS LOGIN
      return { success: true, user: response.data.user };
    }
    throw new Error("Login failed");
  },
  
  logout: async () => {
    try { 
      await apiClient.post('/logout'); 
    } finally { 
      localStorage.removeItem("token"); 
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/"; 
    }
  }
};

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard-stats');
    return response.data;
  },
};

export const monitoringService = {
  getLogs: async () => {
    const response = await apiClient.get('/monitoring-logs');
    return response.data;
  },
};

export const predictionService = {
  predictSize: async (data) => {
    const response = await apiClient.post("/predict-and-save", {
      temperature: parseFloat(data.temp),
      ph: parseFloat(data.ph),
      dissolved_oxygen: parseFloat(data.doVal), 
      fish_weight: parseFloat(data.weight),
    });
    return response.data;
  },
};

export const historyService = {
  getHistory: async () => {
    const response = await apiClient.get('/prediction-history');
    return {
      data: (response.data.data || []).map(item => ({
        id: item.id,
        date: item.created_at,
        prediction: item.prediction_result,
        inputs: { 
          temp: item.temperature, 
          ph: item.ph, 
          doVal: item.dissolved_oxygen,
          weight: item.fish_weight
        },
        confidence: item.multiplier_rate,
        status: item.prediction_result?.includes("LOW") ? "Warning" : "Healthy"
      }))
    };
  },
  // INI FUNGSI HAPUS YANG BARU DITAMBAHKAN
  deleteHistory: async (id) => {
    const response = await apiClient.delete(`/prediction-history/${id}`);
    return response.data;
  }
};

export const api = apiClient;
export default apiClient;