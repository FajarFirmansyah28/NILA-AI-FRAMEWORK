import { Link } from "react-router-dom";
import { FaExclamationCircle, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          color: "var(--danger)",
          fontSize: "24px",
          marginBottom: "12px",
        }}
      >
        <FaExclamationCircle />
        <h2 className="notfound-title" style={{ margin: 0 }}>
          Page Not Found
        </h2>
      </div>
      <p className="notfound-desc">
        The page you are trying to access does not exist, has been removed, or has
        moved. Please check the URL or navigate back.
      </p>
      <Link
        to={isLoggedIn ? "/dashboard" : "/"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--primary)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "var(--radius-sm)",
          fontWeight: 600,
          textDecoration: "none",
          transition: "var(--transition)",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
      >
        <FaArrowLeft />
        Back to {isLoggedIn ? "Dashboard" : "Login"}
      </Link>
    </div>
  );
};

export default NotFound;
