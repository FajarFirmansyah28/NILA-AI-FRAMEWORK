import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api"; // <-- Tambahan untuk panggil backend
import {
  FaHome,
  FaFish,
  FaChartLine,
  FaHistory,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Prediction", path: "/prediction", icon: <FaFish /> },
    { name: "Monitoring", path: "/monitoring", icon: <FaChartLine /> },
    { name: "History", path: "/history", icon: <FaHistory /> },
  ];

  const handleLogout = async () => {
    try {
      // Panggil API Logout di Backend agar token dihapus dari database
      await api.post("/logout");
    } catch (error) {
      console.error("Logout server gagal, melanjutkan proses cleanup lokal...", error);
    } finally {
      // Hapus data lokal dan pindah ke halaman utama/login
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token"); // Pastikan juga hapus token jika ada
      navigate("/");
      if (onClose) onClose();
    }
  };

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <span>🐟 NILA AI</span>
          <button
            className="mobile-menu-toggle"
            style={{ display: isMobileOpen ? "block" : "none", color: "#f8fafc", marginLeft: "auto" }}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              onClick={() => onClose && onClose()}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;