import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "shakib") {
        localStorage.setItem("loggedIn", "true");
        navigate("/");
      } else {
        setError("Invalid username or password. Try admin / shakib");
        setLoading(false);
      }
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.wrapper}>
      {/* Background blurred poster grid */}
      <div style={styles.bgOverlay}></div>

      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🎬</span>
          <h1 style={styles.brandName}>CineVault</h1>
          <p style={styles.brandSub}>Your Ultimate Movie Experience</p>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        {error && (
          <div style={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>👤</span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.hintBox}>
          <span style={styles.hintIcon}>💡</span>
          <span style={styles.hintText}>Demo: <strong>admin</strong> / <strong>shakib</strong></span>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.loginBtn,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span style={styles.loadingDots}>
              <span style={styles.dot}></span>
              Signing In...
            </span>
          ) : (
            "Sign In →"
          )}
        </button>

        <p style={styles.footerText}>
          🎥 Discover, track, and favorite movies you love.
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a1a 50%, #0a0f1a 100%)",
    position: "relative",
    overflow: "hidden",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 20% 50%, rgba(229,9,20,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(100,50,200,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(20, 20, 30, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(229,9,20,0.3)",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(229,9,20,0.1)",
  },
  brand: {
    textAlign: "center",
    marginBottom: "32px",
  },
  brandIcon: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "8px",
  },
  brandName: {
    fontSize: "2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #e50914, #ff6b6b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  },
  brandSub: {
    fontSize: "0.8rem",
    color: "#888",
    marginTop: "4px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#888",
    marginBottom: "28px",
  },
  error: {
    background: "rgba(229, 9, 20, 0.15)",
    border: "1px solid rgba(229, 9, 20, 0.4)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#ff6b6b",
    fontSize: "0.85rem",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#bbb",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "1rem",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    fontFamily: "inherit",
  },
  hintBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255, 193, 7, 0.08)",
    border: "1px solid rgba(255, 193, 7, 0.2)",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "24px",
  },
  hintIcon: {
    fontSize: "0.9rem",
  },
  hintText: {
    fontSize: "0.82rem",
    color: "#aaa",
  },
  loginBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #e50914 0%, #c0392b 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(229, 9, 20, 0.4)",
    marginBottom: "24px",
  },
  loadingDots: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#fff",
    display: "inline-block",
    animation: "pulse 1s infinite",
  },
  footerText: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#555",
  },
};

export default Login;
