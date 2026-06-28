import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If already logged in, skip login page
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      
      // Menyesuaikan dengan format response dari AuthController Laravel kamu
      if (result && (result.success || result.status === 'success' || result.access_token)) {
        localStorage.setItem("isLoggedIn", "true"); 
        
        // --- TAMBAHAN BARU: Simpan Token dan Nama User ---
        if (result.access_token) {
          localStorage.setItem("token", result.access_token);
        }
        if (result.user && result.user.name) {
          localStorage.setItem("userName", result.user.name);
        } else if (result.data?.user?.name) {
          localStorage.setItem("userName", result.data.user.name);
        }
        // -------------------------------------------------

        navigate("/dashboard");
      } else {
        setError("Login gagal. Periksa kembali email dan password Anda.");
      }
    } catch {
      setError("Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-logo">
            🐟 <span>NILA AI</span>
          </h2>
          <p className="login-subtitle">
            Smart Fish Monitoring & Prediction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-body">
          {error && (
            <div
              style={{
                backgroundColor: "var(--danger-light)",
                color: "var(--danger)",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                marginBottom: "16px",
                fontSize: "13px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="member@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            name="password"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              <input type="checkbox" style={{ accentColor: "var(--primary)" }} />
              Remember me
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("Demo mode: Any password works!");
              }}
              style={{
                fontSize: "13px",
                color: "var(--primary)",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;