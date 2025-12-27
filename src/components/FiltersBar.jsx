import React, { useState } from "react";

export function FiltersBar({ filters, onChange, availableTags = [] }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleChipToggle = (field, value) => {
    const current = filters[field] || [];
    const exists = current.includes(value);
    const next = exists ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [field]: next });
  };

  const presets = [
    { label: "🏖 Релакс на морі", type: ["sea"], difficulty: ["relax"] },
    { label: "🏔 Гірський драйв", type: ["mountain"], difficulty: ["active"] },
    { label: "🏰 Міста Європи", type: ["city"], difficulty: ["medium"] },
    { label: "🎒 Пригоди", type: ["adventure"], difficulty: ["active"] }
  ];

  const applyPreset = (preset) => {
    onChange({
      ...filters,
      type: preset.type,
      difficulty: preset.difficulty,
      tags: [] // Reset tags for clean preset application
    });
  };

  return (
    <div
      className="glass"
      style={{
        padding: "1rem 1.2rem",
        marginBottom: "1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <div className="section-title" style={{ fontSize: "1.1rem" }}>
            Знайдіть ідеальний тур
          </div>
          <div className="section-subtitle">
            Оберіть напрям, тривалість, бюджет та тип відпочинку.
          </div>
        </div>

        {/* Main Search & Budget Always Visible */}
        <div style={{ display: "flex", gap: "0.75rem", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
          <input
            className="input"
            placeholder="🔍 Пошук за назвою..."
            value={filters.query}
            onChange={e => handleChange("query", e.target.value)}
            style={{ maxWidth: "240px" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>$</span>
            <input
              className="input"
              type="number"
              placeholder="від"
              value={filters.minPrice}
              onChange={e => handleChange("minPrice", e.target.value)}
              style={{ width: "80px" }}
            />
            <input
              className="input"
              type="number"
              placeholder="до"
              value={filters.maxPrice}
              onChange={e => handleChange("maxPrice", e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem", borderTop: "1px solid rgba(148,163,184,0.15)" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          <span style={{ fontSize: "0.85rem", color: "#9ca3af", marginRight: "0.5rem" }}>Швидкий підбір:</span>
          {presets.map(p => (
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

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button
            className={`btn ${expanded ? "btn-primary" : "btn-outline"}`}
            onClick={() => setExpanded(!expanded)}
            style={{ padding: "0.4rem 1rem" }}
          >
            {expanded ? "▴ Сховати фільтри" : "▾ Всі фільтри"}
            {(filters.type.length > 0 || filters.difficulty.length > 0 || (filters.tags && filters.tags.length > 0)) && (
              <span className="badge badge-success" style={{ marginLeft: 6, background: "rgba(255,255,255,0.2)", color: "inherit", border: "none" }}>
                {filters.type.length + filters.difficulty.length + (filters.tags?.length || 0)}
              </span>
            )}
          </button>

          <button
            className="btn btn-outline"
            style={{ padding: "0.4rem 0.8rem", borderColor: "rgba(239,68,68,0.3)", color: "#fca5a5" }}
            onClick={() => {
              onChange({
                query: "",
                type: [],
                difficulty: [],
                tags: [],
                minPrice: "",
                maxPrice: ""
              });
              setExpanded(false);
            }}
          >
            ✕ Скинути
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="grid grid-3"
          style={{
            marginTop: "0.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(148,163,184,0.15)",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          {/* Group 1: Type */}
          <div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>
              1. Тип відпочинку
            </div>
            <div className="chip-group">
              <button
                type="button"
                className={"chip" + (filters.type.includes("sea") ? " active" : "")}
                onClick={() => handleChipToggle("type", "sea")}
              >
                Море
              </button>
              <button
                type="button"
                className={"chip" + (filters.type.includes("mountain") ? " active" : "")}
                onClick={() => handleChipToggle("type", "mountain")}
              >
                Гори
              </button>
              <button
                type="button"
                className={"chip" + (filters.type.includes("city") ? " active" : "")}
                onClick={() => handleChipToggle("type", "city")}
              >
                Міста
              </button>
              <button
                type="button"
                className={"chip" + (filters.type.includes("adventure") ? " active" : "")}
                onClick={() => handleChipToggle("type", "adventure")}
              >
                Пригоди
              </button>
            </div>
          </div>

          {/* Group 2: Difficulty */}
          <div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>
              2. Рівень активності
            </div>
            <div className="chip-group">
              <button
                type="button"
                className={"chip" + (filters.difficulty.includes("relax") ? " active" : "")}
                onClick={() => handleChipToggle("difficulty", "relax")}
              >
                Релакс
              </button>
              <button
                type="button"
                className={"chip" + (filters.difficulty.includes("medium") ? " active" : "")}
                onClick={() => handleChipToggle("difficulty", "medium")}
              >
                Помірно
              </button>
              <button
                type="button"
                className={"chip" + (filters.difficulty.includes("active") ? " active" : "")}
                onClick={() => handleChipToggle("difficulty", "active")}
              >
                Активно
              </button>
            </div>
          </div>

          {/* Group 3: Services/Tags */}
          <div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>
              3. Послуги та особливості
            </div>
            <div className="chip-group">
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={"chip" + (filters.tags?.includes(tag) ? " active" : "")}
                    onClick={() => handleChipToggle("tags", tag)}
                  >
                    {tag}
                  </button>
                ))
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Немає доступних тегів</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
