import React, { useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { Link } from "react-router-dom";

export function BookedToursPage() {
  const { state, getTourById } = useBooking();
  const [expandedId, setExpandedId] = useState(null);
  const allBookings = state.bookings.slice().reverse();

  const getStatusBadge = status => {
    if (status === "pending") {
      return <span className="badge badge-warning">Очікує підтвердження</span>;
    }
    if (status === "confirmed") {
      return <span className="badge badge-success">Підтверджено</span>;
    }
    if (status === "cancelled") {
      return <span className="badge badge-danger">Відхилено</span>;
    }
    return null;
  };

  if (!allBookings.length) {
    return (
      <div className="glass card-muted" style={{ padding: "1.5rem" }}>
        <div className="section-title">Ще немає бронювань</div>
        <div className="section-subtitle" style={{ marginBottom: "0.8rem" }}>
          Забронюйте тур, і він з'явиться тут зі статусом очікування підтвердження.
        </div>
        <Link to="/tours" className="btn btn-primary">
          Переглянути каталог турів
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="glass" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <div className="section-title">Мої бронювання</div>
        <div className="section-subtitle" style={{ marginBottom: "1rem" }}>
          Клікніть на бронювання, щоб побачити детальну інформацію.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {allBookings.map(b => {
          const tour = getTourById(b.tourId);
          const isExpanded = expandedId === b.id;
          
          return (
            <div key={b.id}>
              <div
                className="glass"
                style={{
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isExpanded ? "1px solid rgba(56,189,248,0.5)" : "1px solid rgba(148,163,184,0.3)"
                }}
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {tour?.title || b.tourTitle || "Тур не знайдено"}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                      {new Date(b.createdAt).toLocaleString("uk-UA", {
                        dateStyle: "long",
                        timeStyle: "short"
                      })}
                      {tour && ` · ${tour.country} · ${tour.durationDays} днів`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {getStatusBadge(b.status)}
                    <div style={{ fontSize: "1.2rem", color: "#9ca3af" }}>
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && tour && (
                <div
                  className="glass"
                  style={{
                    padding: "1.5rem",
                    marginTop: "0.5rem",
                    border: "1px solid rgba(148,163,184,0.3)"
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem", marginBottom: "1rem" }}>
                    <div
                      style={{
                        height: 200,
                        backgroundImage: `url(${tour.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: 12
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1.3rem", marginBottom: 8 }}>
                        {tour.title}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: 12 }}>
                        {tour.country} · {tour.durationDays} днів · від {tour.priceFrom}$
                      </div>
                      <div style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 12 }}>
                        {tour.description}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                        ★ {tour.rating} ({tour.reviewsCount} відгуків)
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 8 }}>
                      Параметри бронювання:
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", fontSize: "0.9rem" }}>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Кількість мандрівників:</span>{" "}
                        <strong>{b.people || 1}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Дата початку туру:</span>{" "}
                        <strong>{b.startDate || b.date || "Не вказано"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Повне ім'я:</span>{" "}
                        <strong>{b.fullName || b.contact?.fullName || "Не вказано"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Email:</span>{" "}
                        <strong>{b.email || b.contact?.email || "Не вказано"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Телефон:</span>{" "}
                        <strong>{b.phone || b.contact?.phone || "Не вказано"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#9ca3af" }}>Загальна вартість:</span>{" "}
                        <strong>{tour.priceFrom * (b.people || 1)}$</strong>
                      </div>
                    </div>
                  </div>

                  {tour.highlights && tour.highlights.length > 0 && (
                    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 8 }}>
                        Хайлайти туру:
                      </div>
                      <ul style={{ fontSize: "0.9rem", paddingLeft: "1.5rem", margin: 0 }}>
                        {tour.highlights.map((h, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


