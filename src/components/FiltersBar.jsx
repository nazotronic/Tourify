import React from "react";

export function FiltersBar({ filters, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleChipToggle = (field, value) => {
    const current = filters[field] || [];
    const exists = current.includes(value);
    const next = exists ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [field]: next });
  };

  return (
    <div
      className="glass"
      style={{
        padding: "0.9rem 1rem",
        marginBottom: "1.2rem",
        display: "grid",
        gap: "0.75rem"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap"
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
        <button
          className="btn btn-outline"
          onClick={() =>
            onChange({
              query: "",
              type: [],
              difficulty: [],
              minPrice: "",
              maxPrice: ""
            })
          }
        >
          Скинути фільтри
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "2.2fr 1.4fr 1.6fr"
        }}
      >
        <div>
          <label style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Пошук</label>
          <input
            className="input"
            placeholder="Назва туру, країна або тег..."
            value={filters.query}
            onChange={e => handleChange("query", e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
            Бюджет (від / до), $
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className="input"
              type="number"
              placeholder="від"
              value={filters.minPrice}
              onChange={e => handleChange("minPrice", e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="до"
              value={filters.maxPrice}
              onChange={e => handleChange("maxPrice", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
            Швидкі фільтри
          </label>
          <div className="chip-group">
            <button
              type="button"
              className={
                "chip" + (filters.type.includes("sea") ? " active" : "")
              }
              onClick={() => handleChipToggle("type", "sea")}
            >
              Море
            </button>
            <button
              type="button"
              className={
                "chip" + (filters.type.includes("mountain") ? " active" : "")
              }
              onClick={() => handleChipToggle("type", "mountain")}
            >
              Гори
            </button>
            <button
              type="button"
              className={
                "chip" + (filters.type.includes("city") ? " active" : "")
              }
              onClick={() => handleChipToggle("type", "city")}
            >
              Міста
            </button>
            <button
              type="button"
              className={
                "chip" + (filters.type.includes("adventure") ? " active" : "")
              }
              onClick={() => handleChipToggle("type", "adventure")}
            >
              Пригоди
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: 4 }}>
            Рівень активності
          </div>
          <div className="chip-group">
            <button
              type="button"
              className={
                "chip" + (filters.difficulty.includes("relax") ? " active" : "")
              }
              onClick={() => handleChipToggle("difficulty", "relax")}
            >
              Релакс
            </button>
            <button
              type="button"
              className={
                "chip" + (filters.difficulty.includes("medium") ? " active" : "")
              }
              onClick={() => handleChipToggle("difficulty", "medium")}
            >
              Помірно
            </button>
            <button
              type="button"
              className={
                "chip" + (filters.difficulty.includes("active") ? " active" : "")
              }
              onClick={() => handleChipToggle("difficulty", "active")}
            >
              Активно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






