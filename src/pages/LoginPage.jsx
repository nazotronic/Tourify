import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Логін
        await login(email, password);
        navigate("/");
      } else {
        // Реєстрація
        if (password !== confirmPassword) {
          setError("Паролі не співпадають");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Пароль має містити мінімум 6 символів");
          setLoading(false);
          return;
        }
        await register(email, password, fullName);
        navigate("/");
      }
    } catch (err) {
      let errorMessage = "Помилка авторизації";
      if (err.message) {
        errorMessage = err.message;
      }
      console.error("Помилка авторизації:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      }}
    >
      <div className="glass" style={{ width: "100%", maxWidth: 420, padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Tourify
          </div>
          <div className="section-subtitle">
            {isLogin ? "Увійдіть у свій акаунт" : "Створіть новий акаунт"}
          </div>
        </div>

        {error && (
          <div
            className="card-muted"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 12,
              marginBottom: "1rem",
              border: "1px solid rgba(239,68,68,0.5)",
              background: "rgba(239,68,68,0.1)",
              color: "#fecaca"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Повне ім'я
              </label>
              <input
                type="text"
                className="input"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Введіть ваше ім'я"
              />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
              Email
            </label>
            <input
              type="email"
              className="input"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Введіть email"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
              Пароль
            </label>
            <input
              type="password"
              className="input"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введіть пароль"
            />
          </div>
          {!isLogin && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Підтвердіть пароль
              </label>
              <input
                type="password"
                className="input"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Повторіть пароль"
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: 12, textAlign: "center" }}
            disabled={loading}
          >
            {loading ? "Завантаження..." : isLogin ? "Увійти" : "Зареєструватися"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", textAlign: "center" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setEmail("");
              setPassword("");
              setFullName("");
              setConfirmPassword("");
            }}
          >
            {isLogin ? "Немає акаунту? Зареєструватися" : "Вже є акаунт? Увійти"}
          </button>
        </div>
      </div>
    </div>
  );
}
