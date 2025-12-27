import React, { useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { AdminToursPage } from "./AdminToursPage.jsx";

export function AdminToursManagePage() {
  const { tours, state, updateTour, deleteTour } = useBooking();
  const [editingTour, setEditingTour] = useState(null);
  const [view, setView] = useState("list"); // list | add

  const handleEdit = tour => {
    setEditingTour({ ...tour });
    setView("edit");
  };

  const handleSaveEdit = e => {
    e.preventDefault();
    const updatedData = {
      ...editingTour,
      tags: typeof editingTour.tags === "string"
        ? editingTour.tags.split(",").map(t => t.trim()).filter(Boolean)
        : editingTour.tags,
      highlights: typeof editingTour.highlights === "string"
        ? editingTour.highlights.split("\n").filter(Boolean)
        : editingTour.highlights,
      durationDays: parseInt(editingTour.durationDays) || 0,
      priceFrom: parseInt(editingTour.priceFrom) || 0,
      rating: parseFloat(editingTour.rating) || 4.5,
      seatsLeft: parseInt(editingTour.seatsLeft) || 0
    };
    updateTour(editingTour.id, updatedData);
    setEditingTour(null);
    setView("list");
  };

  const handleDelete = tourId => {
    if (confirm("Ви впевнені, що хочете видалити цей тур?")) {
      deleteTour(tourId);
    }
  };

  if (view === "add") {
    return (
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setView("list")}
          >
            ← Назад до списку
          </button>
        </div>
        <AdminToursPage />
      </div>
    );
  }

  if (view === "edit" && editingTour) {
    return (
      <div className="glass" style={{ padding: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setEditingTour(null);
              setView("list");
            }}
          >
            ← Назад до списку
          </button>
        </div>
        <div className="section-title">Редагувати тур</div>
        <form onSubmit={handleSaveEdit}>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Назва туру *
              </label>
              <input
                type="text"
                className="input"
                required
                value={editingTour.title || ""}
                onChange={e => setEditingTour({ ...editingTour, title: e.target.value })}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Країна *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={editingTour.country || ""}
                  onChange={e => setEditingTour({ ...editingTour, country: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Тривалість (днів) *
                </label>
                <input
                  type="number"
                  className="input"
                  required
                  min="1"
                  value={editingTour.durationDays || ""}
                  onChange={e => setEditingTour({ ...editingTour, durationDays: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Ціна від ($) *
                </label>
                <input
                  type="number"
                  className="input"
                  required
                  min="0"
                  value={editingTour.priceFrom || ""}
                  onChange={e => setEditingTour({ ...editingTour, priceFrom: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Рейтинг
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  min="0"
                  max="5"
                  value={editingTour.rating || ""}
                  onChange={e => setEditingTour({ ...editingTour, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Вільних місць
                </label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={editingTour.seatsLeft || ""}
                  onChange={e => setEditingTour({ ...editingTour, seatsLeft: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Тип *
                </label>
                <select
                  className="select"
                  required
                  value={editingTour.type || "sea"}
                  onChange={e => setEditingTour({ ...editingTour, type: e.target.value })}
                >
                  <option value="sea">Море</option>
                  <option value="mountain">Гори</option>
                  <option value="city">Міста</option>
                  <option value="adventure">Пригоди</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Рівень складності *
                </label>
                <select
                  className="select"
                  required
                  value={editingTour.difficulty || "relax"}
                  onChange={e => setEditingTour({ ...editingTour, difficulty: e.target.value })}
                >
                  <option value="relax">Релакс</option>
                  <option value="medium">Помірно</option>
                  <option value="active">Активно</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Теги (через кому)
              </label>
              <input
                type="text"
                className="input"
                value={Array.isArray(editingTour.tags) ? editingTour.tags.join(", ") : editingTour.tags || ""}
                onChange={e => setEditingTour({ ...editingTour, tags: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Опис *
              </label>
              <textarea
                className="textarea"
                required
                rows={3}
                value={editingTour.description || ""}
                onChange={e => setEditingTour({ ...editingTour, description: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                Хайлайти (кожен з нового рядка)
              </label>
              <textarea
                className="textarea"
                rows={4}
                value={Array.isArray(editingTour.highlights) ? editingTour.highlights.join("\n") : editingTour.highlights || ""}
                onChange={e => setEditingTour({ ...editingTour, highlights: e.target.value })}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  Наступний старт (дата)
                </label>
                <input
                  type="date"
                  className="input"
                  value={editingTour.nextStart || ""}
                  onChange={e => setEditingTour({ ...editingTour, nextStart: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                  URL зображення
                </label>
                <input
                  type="url"
                  className="input"
                  value={editingTour.image || ""}
                  onChange={e => setEditingTour({ ...editingTour, image: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Зберегти зміни
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingTour(null);
                  setView("list");
                }}
              >
                Скасувати
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="glass" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <div className="section-title">Управління турами</div>
            <div className="section-subtitle">
              Переглядайте, редагуйте та видаляйте тури з каталогу. Можна редагувати тільки додані вами тури.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setView("add")}
          >
            + Додати новий тур
          </button>
        </div>
        <div className="section-subtitle" style={{ marginBottom: "0.5rem" }}>
          Всього турів у каталозі: {tours.length}
        </div>
      </div>

      <div className="grid grid-3">
        {tours.map(tour => {
          return (
            <div key={tour.id} className="glass" style={{ padding: "1rem" }}>
              <div
                style={{
                  height: 120,
                  backgroundImage: `url(${tour.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 12,
                  marginBottom: "0.75rem"
                }}
              />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{tour.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: 6 }}>
                {tour.country} · {tour.durationDays} днів · від {tour.priceFrom}$
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                {tour.description?.substring(0, 80)}...
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                  onClick={() => handleEdit(tour)}
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                  onClick={() => handleDelete(tour.id)}
                >
                  Видалити
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

