import React from "react";
import { useBooking } from "../context/BookingContext.jsx";

export function RoleSelector() {
  const { setUserRole } = useBooking();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 500,
          padding: "2rem",
          textAlign: "center"
        }}
      >
        <div className="section-title" style={{ marginBottom: 8 }}>
          Оберіть свою роль
        </div>
        <div className="section-subtitle" style={{ marginBottom: "2rem" }}>
          Це демо-версія без реєстрації. Оберіть, як ви хочете використовувати платформу.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            onClick={() => setUserRole("user")}
          >
            👤 Я користувач
            <div style={{ fontSize: "0.85rem", marginTop: 4, opacity: 0.9 }}>
              Бронювати тури та переглядати заявки
            </div>
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            onClick={() => setUserRole("admin")}
          >
            🔧 Я адміністратор
            <div style={{ fontSize: "0.85rem", marginTop: 4, opacity: 0.9 }}>
              Додавати тури та керувати заявками
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

