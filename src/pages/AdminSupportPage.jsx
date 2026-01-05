import React from "react";
import { useBooking } from "../context/BookingContext.jsx";

export function AdminSupportPage() {
  const { state, markSupportMessageRead } = useBooking();
  const { supportMessages } = state;

  const unreadCount = supportMessages.filter(msg => !msg.read).length;
  const sortedMessages = [...supportMessages].reverse();

  return (
    <div className="glass" style={{ padding: "1.5rem" }}>
      <div className="section-title">Повідомлення з онлайн-підтримки</div>
      <div className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
        Переглядайте повідомлення від користувачів. Нові повідомлення відмічені як непрочитані.
      </div>

      {unreadCount > 0 && (
        <div
          className="badge badge-warning"
          style={{ display: "inline-flex", marginBottom: "1rem", padding: "0.4rem 0.8rem" }}
        >
          {unreadCount} нових повідомлень
        </div>
      )}

      {supportMessages.length === 0 ? (
        <div className="card-muted" style={{ padding: "1rem", borderRadius: 14 }}>
          Поки що немає повідомлень від користувачів.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {sortedMessages.map(msg => (
            <div
              key={msg.id}
              className="glass"
              style={{
                padding: "1rem",
                border: msg.read
                  ? "1px solid rgba(148,163,184,0.3)"
                  : "1px solid rgba(56,189,248,0.6)",
                background: msg.read
                  ? "rgba(15,23,42,0.85)"
                  : "rgba(56,189,248,0.08)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    {new Date(msg.createdAt).toLocaleString("uk-UA", {
                      dateStyle: "long",
                      timeStyle: "short"
                    })}
                  </div>
                  {!msg.read && (
                    <span className="badge badge-warning" style={{ marginTop: 4 }}>
                      Нове
                    </span>
                  )}
                </div>
                {!msg.read && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}
                    onClick={() => markSupportMessageRead(msg.id)}
                  >
                    Позначити як прочитане
                  </button>
                )}
              </div>
              <div style={{ fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





