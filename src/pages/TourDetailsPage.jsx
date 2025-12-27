import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { TYPE_LABELS, DIFFICULTY_LABELS } from "../utils/constants";

export function TourDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTourById, toggleFavourite, state } = useBooking();
  const tour = getTourById(id);
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState(tour?.nextStart || "");

  if (!tour) {
    return (
      <div className="glass card-muted">
        <div className="section-title">Тур не знайдено</div>
        <div className="section-subtitle">
          Перевірте посилання або оберіть інший тур у каталозі.
        </div>
      </div>
    );
  }

  const isFav = state.favourites.includes(tour.id);
  const total = people * tour.priceFrom;

  return (
    <div className="layout-split">
      <div className="glass" style={{ padding: "1rem" }}>
        <button
          className="btn btn-outline"
          style={{ marginBottom: "0.8rem", padding: "0.3rem 0.7rem" }}
          onClick={() => navigate(-1)}
        >
          ⟵ Назад
        </button>
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: "0.9rem",
            position: "relative",
            minHeight: 210,
            backgroundImage: `url(${tour.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15,23,42,0.85), transparent 60%)"
            }}
          />
          <div style={{ position: "absolute", bottom: 12, left: 14 }}>
            <div className="pill">
              {tour.country} · {tour.durationDays} днів
            </div>
          </div>
        </div>
        <h2 className="section-title" style={{ marginBottom: 4 }}>
          {tour.title}
        </h2>
        <div className="section-subtitle" style={{ marginBottom: 10 }}>
          від {tour.priceFrom}$ / особа ·{" "}
          <span style={{ color: "#fde68a" }}>★ {tour.rating}</span>
        </div>
        <p style={{ fontSize: "0.9rem", color: "#e5e7eb", marginBottom: 10 }}>
          {tour.description}
        </p>
        <div className="chip-group" style={{ marginBottom: 10 }}>
          <span className="chip chip-static">{TYPE_LABELS[tour.type] || tour.type}</span>
          <span className="chip chip-static">{DIFFICULTY_LABELS[tour.difficulty] || tour.difficulty}</span>
          {tour.tags.map(t => (
            <span key={t} className="chip chip-static">
              {t}
            </span>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4 }}>
            Головні враження туру
          </div>
          <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem" }}>
            {tour.highlights.map(h => (
              <li key={h} style={{ marginBottom: 4 }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass" style={{ padding: "1rem" }}>
        <div className="stepper">
          <span className="pill-step pill-step-active">1. Параметри</span>
          <span className="pill-step">2. Контакти</span>
          <span className="pill-step">3. Підтвердження</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: 6 }}>
          Оберіть кількість мандрівників, орієнтовні дати та перевірте вартість.
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Кількість мандрівників
          </label>
          <input
            className="input"
            type="number"
            min={1}
            max={10}
            value={people}
            onChange={e => setPeople(Number(e.target.value) || 1)}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Дата старту</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div
          style={{
            padding: "0.7rem 0.8rem",
            borderRadius: 14,
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.55)",
            marginBottom: 10
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Попередній розрахунок</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.9rem" }}>
              {people} × {tour.priceFrom}$
            </div>
            <div style={{ fontWeight: 650 }}>{total}$</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: 8 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/book/${tour.id}`, { state: { date, people } })}
          >
            Перейти до бронювання
          </button>
          <button
            className="btn btn-outline"
            onClick={() => toggleFavourite(tour.id)}
          >
            {isFav ? "Прибрати з обраних" : "Додати в обране"}
          </button>
        </div>
        <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
          Заявка не є фінансовою операцією. Це лише демонстрація для курсового
          проєкту.
        </div>
      </div>
    </div>
  );
}


