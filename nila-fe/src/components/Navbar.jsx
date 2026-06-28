import { useLocation } from "react-router-dom";
import { FaBars, FaBell } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  // --- MENGAMBIL NAMA DARI LOCAL STORAGE ---
  // Jika karena suatu hal namanya kosong, kita kasih default nama lengkapmu
  const userName = localStorage.getItem("userName") || "Mochammad Fajar";

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/prediction":
        return "AI Prediction";
      case "/monitoring":
        return "Real-time Monitoring";
      case "/history":
        return "Prediction History";
      default:
        return "Nila AI Admin";
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <button className="mobile-menu-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <span className="navbar-title">{getPageTitle()}</span>
      </div>

      <div className="navbar-actions">
        <button className="nav-icon-btn" title="Notifications">
          <FaBell />
          <span className="nav-badge"></span>
        </button>

        <div className="nav-profile">
          <div style={{ textAlign: "right" }} className="mobile-hide">
            {/* Menampilkan nama dinamis di sini */}
            <p style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "13.5px" }}>
              {userName}
            </p>
            {/* Subtitle disesuaikan untuk kebutuhan sidang/demo */}
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-2px" }}>
              Sistem Informasi Undiksha
            </p>
          </div>
          <svg className="nav-avatar" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="var(--primary-light)" />
            <path d="M50,45 A15,15 0 1,0 50,15 A15,15 0 1,0 50,45 Z M50,55 C30,55 18,70 18,85 L82,85 C82,70 70,55 50,55 Z" fill="var(--primary)" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Navbar;