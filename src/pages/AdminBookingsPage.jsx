import React from "react";
import { useBooking } from "../context/BookingContext.jsx";

export function AdminBookingsPage() {
  const { state, getTourById, updateBookingStatus } = useBooking();
  const { bookings } = state;

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  return (
    <div className="glass" style={{ padding: "1.5rem" }}>
      <div className="section-title">Управління заявками на бронювання</div>
      <div className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
        Підтверджуйте або відхиляйте заявки від користувачів. Тільки два варіанти дій.
      </div>

      <div className="hero-metrics" style={{ marginBottom: "1.5rem" }}>
        <div className="hero-metric">
          <div className="hero-metric-value">{pendingBookings.length}</div>
          <div className="hero-metric-label">очікують рішення</div>
        </div>
        <div className="hero-metric">
          <div className="hero-metric-value">{confirmedBookings.length}</div>
          <div className="hero-metric-label">підтверджені</div>
        </div>
        <div className="hero-metric">
          <div className="hero-metric-value">{cancelledBookings.length}</div>
          <div className="hero-metric-label">відхилені</div>
        </div>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="card-muted" style={{ padding: "1rem", borderRadius: 14 }}>
          Немає заявок, які очікують рішення. Всі заявки вже оброблені.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pendingBookings
            .slice()
            .reverse()
            .map(b => {
              const tour = getTourById(b.tourId);
              return (
                <div key={b.id} className="glass" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>
                        {tour?.title || b.tourTitle || "Тур не знайдено"}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 12 }}>
                        Дата створення: {new Date(b.createdAt).toLocaleString("uk-UA", {
                          dateStyle: "long",
                          timeStyle: "short"
                        })}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", fontSize: "0.9rem" }}>
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
                          <span style={{ color: "#9ca3af" }}>Кількість мандрівників:</span>{" "}
                          <strong>{b.people || 1}</strong>
                        </div>
                        <div>
                          <span style={{ color: "#9ca3af" }}>Дата початку туру:</span>{" "}
                          <strong>{b.startDate || b.date || "Не вказано"}</strong>
                        </div>
                        <div>
                          <span style={{ color: "#9ca3af" }}>Загальна вартість:</span>{" "}
                          <strong>{tour ? (tour.priceFrom * (b.people || 1)) + "$" : "—"}</strong>
                        </div>
                      </div>
                      {b.comment && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(148,163,184,0.3)" }}>
                          <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4 }}>Коментар:</div>
                          <div style={{ fontSize: "0.9rem" }}>{b.comment}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap"
                        }}
                        onClick={() => updateBookingStatus(b.id, "confirmed")}
                      >
                        ✅ Підтвердити
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap"
                        }}
                        onClick={() => updateBookingStatus(b.id, "cancelled")}
                      >
                        ❌ Відхилити
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {(confirmedBookings.length > 0 || cancelledBookings.length > 0) && (
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(148,163,184,0.3)" }}>
          <div className="section-title" style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>
            Історія оброблених заявок
          </div>
          <div className="scroll-y-soft">
            <table className="table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тур</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {[...confirmedBookings, ...cancelledBookings]
                  .slice()
                  .reverse()
                  .map(b => {
                    const tour = getTourById(b.tourId);
                    return (
                      <tr key={b.id}>
                        <td>
                          {new Date(b.createdAt).toLocaleString("uk-UA", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </td>
                        <td>{tour?.title || b.tourTitle}</td>
                        <td>
                          {b.status === "confirmed" && (
                            <span className="badge badge-success">
                              підтверджено
                            </span>
                          )}
                          {b.status === "cancelled" && (
                            <span className="badge badge-danger">
                              відхилено
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

