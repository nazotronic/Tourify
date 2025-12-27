import React from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { state, getTourById, role, updateBookingStatus } = useBooking();
  const { bookings } = state;

  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  const groupedByCountry = bookings.reduce((acc, b) => {
    const tour = getTourById(b.tourId);
    const key = tour?.country || "Невідомо";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const groupedByType = bookings.reduce((acc, b) => {
    const tour = getTourById(b.tourId);
    const key = tour?.type || "Невідомо";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => {
      const tour = getTourById(b.tourId);
      return sum + (tour?.priceFrom || 0) * (b.people || 1);
    }, 0);

  const avgPeoplePerBooking = bookings.length
    ? Math.round(bookings.reduce((sum, b) => sum + (b.people || 1), 0) / bookings.length * 10) / 10
    : 0;

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div className="glass" style={{ padding: "1.5rem" }}>
        <div className="section-title">Аналітика бронювань</div>
        <div className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
          Статистика та аналіз заявок на бронювання турів.
        </div>
        
        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric-value">{total}</div>
            <div className="hero-metric-label">усіх заявок</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">{pending}</div>
            <div className="hero-metric-label">в очікуванні</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">{confirmed}</div>
            <div className="hero-metric-label">підтверджені</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">{cancelled}</div>
            <div className="hero-metric-label">відхилені</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">{totalRevenue}$</div>
            <div className="hero-metric-label">загальний дохід</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">{avgPeoplePerBooking}</div>
            <div className="hero-metric-label">середня кількість людей</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 12 }}>
            Розподіл за статусами
          </div>
          <div
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.4)",
              height: 24,
              display: "flex",
              marginBottom: 12
            }}
          >
            {["pending", "confirmed", "cancelled"].map(status => {
              const value =
                status === "pending"
                  ? pending
                  : status === "confirmed"
                  ? confirmed
                  : cancelled;
              const percent = total ? (value / total) * 100 : 0;
              if (!percent) return null;
              const colors = {
                pending: "rgba(250,204,21,0.7)",
                confirmed: "rgba(34,197,94,0.7)",
                cancelled: "rgba(239,68,68,0.7)"
              };
              return (
                <div
                  key={status}
                  style={{
                    width: `${percent}%`,
                    background: colors[status],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: "#f9fafb"
                  }}
                >
                  {value > 0 && `${Math.round(percent)}%`}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            {pending > 0 && <div>🟡 Очікує: {pending}</div>}
            {confirmed > 0 && <div>🟢 Підтверджено: {confirmed}</div>}
            {cancelled > 0 && <div>🔴 Відхилено: {cancelled}</div>}
          </div>
        </div>

        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 12 }}>
            Розподіл за типами турів
          </div>
          {Object.keys(groupedByType).length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Немає даних
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(groupedByType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const typeNames = {
                    sea: "Море",
                    mountain: "Гори",
                    city: "Міста",
                    adventure: "Пригоди"
                  };
                  const percent = total ? (count / total) * 100 : 0;
                  return (
                    <div key={type}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.85rem" }}>{typeNames[type] || type}</span>
                        <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{count} ({Math.round(percent)}%)</span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(15,23,42,0.9)",
                          borderRadius: 999,
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: "rgba(56,189,248,0.6)",
                            borderRadius: 999
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 12 }}>
            Бронювання за країнами
          </div>
          {Object.keys(groupedByCountry).length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Поки що немає жодної заявки.
            </div>
          ) : (
            <div className="scroll-y-soft">
              <table className="table">
                <thead>
                  <tr>
                    <th>Країна</th>
                    <th>Заявок</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedByCountry)
                    .sort((a, b) => b[1] - a[1])
                    .map(([country, count]) => {
                      const percent = total ? Math.round((count / total) * 100) : 0;
                      return (
                        <tr key={country}>
                          <td>{country}</td>
                          <td>{count}</td>
                          <td>{percent}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 12 }}>
            Останні бронювання
          </div>
          {recentBookings.length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Немає бронювань
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentBookings.map(b => {
                const tour = getTourById(b.tourId);
                return (
                  <div
                    key={b.id}
                    style={{
                      padding: "0.75rem",
                      background: "rgba(15,23,42,0.6)",
                      borderRadius: 8,
                      border: "1px solid rgba(148,163,184,0.2)"
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: 4 }}>
                      {tour?.title || b.tourTitle || "Тур не знайдено"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {new Date(b.createdAt).toLocaleDateString("uk-UA")} · {b.status === "pending" ? "Очікує" : b.status === "confirmed" ? "Підтверджено" : "Відхилено"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


