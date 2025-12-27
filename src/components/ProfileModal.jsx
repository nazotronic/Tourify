import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";

import { TYPE_LABELS, DIFFICULTY_LABELS, PRESETS } from "../utils/constants";

export function ProfileModal({ isOpen, onClose }) {
  const { user, changePassword, logout } = useAuth();
  const { state, updateProfile, tours } = useBooking(); // Get tours for tags
  const [activeTab, setActiveTab] = useState("profile");
  const [showFilters, setShowFilters] = useState(false); // Toggle for filters

  // Compute unique tags from tours
  const uniqueTags = React.useMemo(() => {
    return [...new Set(tours?.flatMap(t => t.tags || []) || [])].sort();
  }, [tours]);

  const [form, setForm] = useState(state.profile || {
    fullName: "",
    email: "",
    phone: "",
    preferences: {
      type: [],
      difficulty: [],
      tags: [],
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
      setForm({
        ...state.profile,
        preferences: {
          type: [],
          difficulty: [],
          tags: [],
          budgetFrom: 0,
          budgetTo: 5000,
          ...state.profile.preferences
        }
      });
    }
  }, [isOpen, state.profile]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePrefChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const togglePref = (group, value) => {
    const current = form.preferences[group] || [];
    const exists = current.includes(value);
    const next = exists ? current.filter(v => v !== value) : [...current, value];
    handlePrefChange(group, next);
  };

  const applyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        type: preset.type,
        difficulty: preset.difficulty,
        tags: [] // Clear tags on preset
      }
    }));
  };

  // ... handleProfileSubmit ... (unchanged logic, just ensuring it saves form)
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(form);
      setSuccess("Профіль успішно оновлено");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error("Помилка оновлення профілю:", err);
      setError("Помилка при оновленні профілю: " + (err.message || "невідома помилка"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await changePassword(passwordForm.newPassword);
      setSuccess("Пароль успішно змінено");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Помилка зміни паролю:", err);
      setError("Помилка при зміні паролю: " + (err.message || "невідома помилка"));
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
        className="glass hide-scrollbar"
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

        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
          <div
            className="glass"
            style={{
              padding: "0.4rem 0.4rem",
              display: "inline-flex",
              gap: 6,
              background: "rgba(15,23,42,0.6)",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.2)"
            }}
          >
            <button
              type="button"
              className={activeTab === "profile" ? "chip active" : "chip"}
              onClick={() => { setActiveTab("profile"); setError(""); setSuccess(""); }}
              style={{
                borderRadius: 999,
                fontSize: "0.9rem",
                padding: "0.4rem 1.2rem",
                margin: 0,
                border: activeTab === "profile" ? "none" : "1px solid transparent"
              }}
            >
              Дані профілю
            </button>
            <button
              type="button"
              className={activeTab === "password" ? "chip active" : "chip"}
              onClick={() => { setActiveTab("password"); setError(""); setSuccess(""); }}
              style={{
                borderRadius: 999,
                fontSize: "0.9rem",
                padding: "0.4rem 1.2rem",
                margin: 0,
                border: activeTab === "password" ? "none" : "1px solid transparent"
              }}
            >
              Зміна паролю
            </button>
          </div>
        </div>

        {error && (
          <div className="card-muted" style={{ padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1rem", border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)", color: "#fecaca" }}>
            {error}
          </div>
        )}
        {success && (
          <div className="card-muted" style={{ padding: "0.75rem 1rem", borderRadius: 12, marginBottom: "1rem", border: "1px solid rgba(34,197,94,0.5)", background: "rgba(34,197,94,0.1)", color: "#bbf7d0" }}>
            {success}
          </div>
        )}

        {activeTab === "profile" ? (
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>Повне ім'я</label>
              <input type="text" className="input" value={form.fullName || ""} onChange={e => handleChange("fullName", e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>Email</label>
              <input type="email" className="input" value={form.email || ""} onChange={e => handleChange("email", e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>Телефон</label>
              <input type="tel" className="input" value={form.phone || ""} onChange={e => handleChange("phone", e.target.value)} />
            </div>

            <div style={{ borderTop: "1px solid rgba(148,163,184,0.2)", paddingTop: "1rem", marginTop: "1rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Уподобання</div>

              {/* Budget */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>Бюджет ($)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input className="input" type="number" placeholder="від" value={form.preferences.budgetFrom || ""} onChange={e => handlePrefChange("budgetFrom", e.target.value)} />
                  <input className="input" type="number" placeholder="до" value={form.preferences.budgetTo || ""} onChange={e => handlePrefChange("budgetTo", e.target.value)} />
                </div>
              </div>

              {/* Presets */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>Швидкий вибір:</div>
                <div className="chip-group">
                  {PRESETS.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      className="chip"
                      onClick={() => applyPreset(p)}
                      style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.3)" }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowFilters(!showFilters)}
                style={{ width: "100%", justifyContent: "center", marginBottom: "1rem" }}
              >
                {showFilters ? "▴ Сховати детальні фільтри" : "▾ Налаштувати детально"}
              </button>

              {/* Collapsible Section */}
              {showFilters && (
                <div className="grid grid-2" style={{ gap: "1rem", animation: "fadeIn 0.2s ease-out" }}>
                  {/* Type */}
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>1. Тип відпочинку</div>
                    <div className="chip-group">
                      {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className={"chip" + (form.preferences.type?.includes(key) ? " active" : "")}
                          onClick={() => togglePref("type", key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>2. Рівень активності</div>
                    <div className="chip-group">
                      {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className={"chip" + (form.preferences.difficulty?.includes(key) ? " active" : "")}
                          onClick={() => togglePref("difficulty", key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>3. Послуги та особливості</div>
                    <div className="chip-group">
                      {uniqueTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          className={"chip" + (form.preferences.tags?.includes(tag) ? " active" : "")}
                          onClick={() => togglePref("tags", tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "1rem", width: "100%" }}>
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

