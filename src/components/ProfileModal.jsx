import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";

export function ProfileModal({ isOpen, onClose }) {
  const { user, changePassword, logout } = useAuth();
  const { state, updateProfile } = useBooking();
  const [activeTab, setActiveTab] = useState("profile"); // profile | password
  const [form, setForm] = useState(state.profile || {
    fullName: "",
    email: "",
    phone: "",
    preferences: {
      type: [],
      difficulty: [],
      budgetFrom: 0,
      budgetTo: 5000
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && state.profile) {
      setForm(state.profile);
    }
  }, [isOpen, state.profile]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const togglePref = (group, value) => {
    const current = form.preferences[group] || [];
    const exists = current.includes(value);
    const next = exists ? current.filter(v => v !== value) : [...current, value];
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [group]: next }
    }));
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Оновлюємо через контекст (це збереже в backend API)
      await updateProfile(form);

      setSuccess("Профіль успішно оновлено");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Помилка оновлення профілю:", err);
      setError("Помилка при оновленні профілю: " + (err.message || "невідома помилка"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Пароль має містити мінімум 6 символів");
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordForm.newPassword);
      setSuccess("Пароль успішно змінено");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      let errorMessage = "Помилка при зміні паролю";
      if (err.code === "auth/weak-password") {
        errorMessage = "Пароль занадто слабкий";
      } else if (err.code === "auth/requires-recent-login") {
        errorMessage = "Потрібно вийти та увійти знову для зміни паролю";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1.5rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div className="section-title">Профіль</div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "0.3rem 0.7rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", borderBottom: "1px solid rgba(148,163,184,0.3)" }}>
          <button
            type="button"
            className={activeTab === "profile" ? "chip active" : "chip"}
            onClick={() => {
              setActiveTab("profile");
              setError("");
              setSuccess("");
            }}
          >
            Дані профілю
          </button>
          <button
            type="button"
            className={activeTab === "password" ? "chip active" : "chip"}
            onClick={() => {
              setActiveTab("password");
              setError("");
              setSuccess("");
            }}
          >
            Зміна паролю
          </button>
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

        {success && (
          <div
            className="card-muted"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 12,
              marginBottom: "1rem",
              border: "1px solid rgba(34,197,94,0.5)",
              background: "rgba(34,197,94,0.1)",
              color: "#bbf7d0"
            }}
          >
            {success}
          </div>
        )}

        {activeTab === "profile" ? (
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Повне ім'я
              </label>
              <input
                type="text"
                className="input"
                value={form.fullName || ""}
                onChange={e => handleChange("fullName", e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={form.email || ""}
                onChange={e => handleChange("email", e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Телефон
              </label>
              <input
                type="tel"
                className="input"
                value={form.phone || ""}
                onChange={e => handleChange("phone", e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>
                Типи відпочинку (швидкі фільтри)
              </div>
              <div className="chip-group">
                <button
                  type="button"
                  className={"chip" + (form.preferences?.type?.includes("sea") ? " active" : "")}
                  onClick={() => togglePref("type", "sea")}
                >
                  Море
                </button>
                <button
                  type="button"
                  className={"chip" + (form.preferences?.type?.includes("mountain") ? " active" : "")}
                  onClick={() => togglePref("type", "mountain")}
                >
                  Гори
                </button>
                <button
                  type="button"
                  className={"chip" + (form.preferences?.type?.includes("city") ? " active" : "")}
                  onClick={() => togglePref("type", "city")}
                >
                  Міста
                </button>
                <button
                  type="button"
                  className={"chip" + (form.preferences?.type?.includes("adventure") ? " active" : "")}
                  onClick={() => togglePref("type", "adventure")}
                >
                  Пригоди
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>
                Рівень активності (швидкі фільтри)
              </div>
              <div className="chip-group">
                <button
                  type="button"
                  className={"chip" + (form.preferences?.difficulty?.includes("relax") ? " active" : "")}
                  onClick={() => togglePref("difficulty", "relax")}
                >
                  Релакс
                </button>
                <button
                  type="button"
                  className={"chip" + (form.preferences?.difficulty?.includes("medium") ? " active" : "")}
                  onClick={() => togglePref("difficulty", "medium")}
                >
                  Помірно
                </button>
                <button
                  type="button"
                  className={"chip" + (form.preferences?.difficulty?.includes("active") ? " active" : "")}
                  onClick={() => togglePref("difficulty", "active")}
                >
                  Активно
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Збереження..." : "Зберегти профіль"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Новий пароль
              </label>
              <input
                type="password"
                className="input"
                required
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Мінімум 6 символів"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Підтвердіть новий пароль
              </label>
              <input
                type="password"
                className="input"
                required
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Повторіть пароль"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Зміна паролю..." : "Змінити пароль"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center", color: "#fca5a5", borderColor: "rgba(239,68,68,0.3)" }}
            onClick={async () => {
              if (confirm("Ви впевнені, що хочете вийти?")) {
                await logout();
                window.location.href = "/login";
              }
            }}
          >
            Вийти з акаунту
          </button>
        </div>
      </div>
    </div>
  );
}

