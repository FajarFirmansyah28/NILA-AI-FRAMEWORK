import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- TAMBAHAN IMPORT BARU ---
import Landing from "../pages/Landing/Landing";
import Register from "../pages/Register/Register";
// ----------------------------

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Prediction from "../pages/Prediction/Prediction";
import Monitoring from "../pages/Monitoring/Monitoring";
import History from "../pages/History/History";
import NotFound from "../pages/NotFound/NotFound";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Layout Routes (TIDAK DISENTUH SAMA SEKALI) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;