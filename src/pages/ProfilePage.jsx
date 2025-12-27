import React, { useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";

export function ProfilePage() {
  const { state, updateProfile } = useBooking();
  const [form, setForm] = useState(state.profile);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const togglePref = (group, value) => {
    const current = form.preferences[group] || [];
    const exists = current.includes(value);
    const next = exists ? current.filter(v => v !== value) : [...current, value];
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [group]: next }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    updateProfile(form);
  };

  return (
    <div className="layout-split">
      <div className="glass" style={{ padding: "1rem" }}>
        <div className="section-title">Профіль мандрівника</div>
        <div className="section-subtitle" style={{ marginBottom: 10 }}>
          Заповніть базові дані — вони будуть підставлятись у форму бронювання.
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Повне ім’я
            </label>
            <input
              className="input"
              value={form.fullName}
              onChange={e => handleChange("fullName", e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Email
            </label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Телефон
            </label>
            <input
              className="input"
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Зберегти профіль
          </button>
        </form>
      </div>
      <div className="glass" style={{ padding: "1rem" }}>
        <div className="section-title">Уподобання</div>
        <div className="section-subtitle" style={{ marginBottom: 10 }}>
          Оберіть швидкі фільтри, які будуть автоматично застосовуватися в каталозі турів.
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>
            Типи відпочинку (швидкі фільтри)
          </div>
          <div className="chip-group">
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.type.includes("sea") ? " active" : "")
              }
              onClick={() => togglePref("type", "sea")}
            >
              Море
            </button>
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.type.includes("mountain") ? " active" : "")
              }
              onClick={() => togglePref("type", "mountain")}
            >
              Гори
            </button>
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.type.includes("city") ? " active" : "")
              }
              onClick={() => togglePref("type", "city")}
            >
              Міста
            </button>
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.type.includes("adventure") ? " active" : "")
              }
              onClick={() => togglePref("type", "adventure")}
            >
              Пригоди
            </button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 6 }}>
            Рівень активності (швидкі фільтри)
          </div>
          <div className="chip-group">
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.difficulty.includes("relax") ? " active" : "")
              }
              onClick={() => togglePref("difficulty", "relax")}
            >
              Релакс
            </button>
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.difficulty.includes("medium") ? " active" : "")
              }
              onClick={() => togglePref("difficulty", "medium")}
            >
              Помірно
            </button>
            <button
              type="button"
              className={
                "chip" +
                (form.preferences.difficulty.includes("active") ? " active" : "")
              }
              onClick={() => togglePref("difficulty", "active")}
            >
              Активно
            </button>
          </div>
        </div>
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Зберегти уподобання
          </button>
        </div>
      </div>
    </div>
  );
}


