import React, { useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";

export function AdminToursPage() {
  const { addTour, tours } = useBooking();
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    durationDays: "",
    priceFrom: "",
    rating: "4.5",
    reviewsCount: "0",
    difficulty: "relax",
    type: "sea",
    tags: "",
    description: "",
    highlights: "",
    nextStart: "",
    seatsLeft: "",
    image: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    const tour = {
      ...formData,
      durationDays: parseInt(formData.durationDays) || 0,
      priceFrom: parseInt(formData.priceFrom) || 0,
      rating: parseFloat(formData.rating) || 4.5,
      reviewsCount: parseInt(formData.reviewsCount) || 0,
      seatsLeft: parseInt(formData.seatsLeft) || 0,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      highlights: formData.highlights.split("\n").filter(Boolean)
    };
    addTour(tour);
    setFormData({
      title: "",
      country: "",
      durationDays: "",
      priceFrom: "",
      rating: "4.5",
      reviewsCount: "0",
      difficulty: "relax",
      type: "sea",
      tags: "",
      description: "",
      highlights: "",
      nextStart: "",
      seatsLeft: "",
      image: ""
    });
  };

  return (
    <div className="glass" style={{ padding: "1.5rem" }}>
      <div className="section-title">Додати новий тур</div>
      <div className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
        Заповніть форму, щоб додати тур до каталогу. Він з'явиться у користувачів.
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
              Назва туру *
            </label>
            <input
              type="text"
              className="input"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Наприклад: Сонячний Балі"
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
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                placeholder="Наприклад: Індонезія"
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
                value={formData.durationDays}
                onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
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
                value={formData.priceFrom}
                onChange={e => setFormData({ ...formData, priceFrom: e.target.value })}
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
                value={formData.rating}
                onChange={e => setFormData({ ...formData, rating: e.target.value })}
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
                value={formData.seatsLeft}
                onChange={e => setFormData({ ...formData, seatsLeft: e.target.value })}
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
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
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
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
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
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Наприклад: all inclusive, SPA, серфінг"
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
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Короткий опис туру"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
              Хайлайти (кожен з нового рядка)
            </label>
            <textarea
              className="textarea"
              rows={4}
              value={formData.highlights}
              onChange={e => setFormData({ ...formData, highlights: e.target.value })}
              placeholder="Сніданки з видом на океан&#10;Приватний трансфер з аеропорту"
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
                value={formData.nextStart}
                onChange={e => setFormData({ ...formData, nextStart: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                URL зображення
              </label>
              <input
                type="url"
                className="input"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Додати тур до каталогу
          </button>
        </div>
      </form>
      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
        <div className="section-title" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          Всього турів у каталозі: {tours.length}
        </div>
        <div className="section-subtitle">
          {tours.length} турів доступні для бронювання користувачами.
        </div>
      </div>
    </div>
  );
}





