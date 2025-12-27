import React, { useState, useMemo } from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { TYPE_LABELS, DIFFICULTY_LABELS, PRESETS } from "../utils/constants";

export function ProfilePage() {
  const { state, updateProfile, tours } = useBooking();
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
  const [showFilters, setShowFilters] = useState(false);

  const uniqueTags = useMemo(() => {
    return [...new Set(tours?.flatMap(t => t.tags || []) || [])].sort();
  }, [tours]);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

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
        tags: []
      }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    updateProfile(form);
    // Maybe show success toast? Toast is in App.jsx via context toast state
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

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setShowFilters(!showFilters)}
          style={{ width: "100%", justifyContent: "center", marginBottom: "1rem" }}
        >
          {showFilters ? "▴ Сховати детальні фільтри" : "▾ Налаштувати детально"}
        </button>

        {showFilters && (
          <div className="grid grid-2" style={{ gap: "1rem", animation: "fadeIn 0.2s ease-out" }}>
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

        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Зберегти уподобання
          </button>
        </div>
      </div>
    </div>
  );
}


