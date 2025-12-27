import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTourById, createBooking, state } = useBooking();
  const tour = getTourById(id);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: state.profile.fullName || "",
    email: state.profile.email || "",
    phone: state.profile.phone || "",
    comment: "",
    people: 2,
    date: tour?.nextStart || ""
  });

  if (!tour) {
    return (
      <div className="glass card-muted">
        <div className="section-title">Тур не знайдено</div>
        <div className="section-subtitle">
          Перевірте посилання або спробуйте забронювати інший тур.
        </div>
      </div>
    );
  }

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = e => {
    e.preventDefault();
    createBooking({
      tourId: tour.id,
      tourTitle: tour.title,
      startDate: form.date,
      date: form.date,
      people: form.people,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      comment: form.comment
    });
    navigate("/dashboard");
  };

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
        <h2 className="section-title" style={{ marginBottom: 4 }}>
          Бронювання: {tour.title}
        </h2>
        <div className="section-subtitle" style={{ marginBottom: 10 }}>
          {tour.country} · {tour.durationDays} днів · від {tour.priceFrom}$ / особа
        </div>
        <div className="stepper">
          <span className={"pill-step" + (step === 1 ? " pill-step-active" : "")}>
            1. Деталі туру
          </span>
          <span className={"pill-step" + (step === 2 ? " pill-step-active" : "")}>
            2. Контакти
          </span>
          <span className={"pill-step" + (step === 3 ? " pill-step-active" : "")}>
            3. Підтвердження
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Дата старту
                </label>
                <input
                  className="input"
                  type="date"
                  value={form.date}
                  onChange={e => handleChange("date", e.target.value)}
                  required
                />
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
                  value={form.people}
                  onChange={e =>
                    handleChange("people", Number(e.target.value) || 1)
                  }
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                Далі
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Повне ім’я
                </label>
                <input
                  className="input"
                  value={form.fullName}
                  onChange={e => handleChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Телефон
                </label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Коментар для менеджера (необов’язково)
                </label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={form.comment}
                  onChange={e => handleChange("comment", e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                >
                  Назад
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                >
                  Далі
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div
                className="card-muted"
                style={{ padding: "0.8rem", borderRadius: 14, marginBottom: 10 }}
              >
                <div className="section-title" style={{ fontSize: "1rem" }}>
                  Підтвердження заявки
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#e5e7eb",
                    marginBottom: 6
                  }}
                >
                  Ми створимо локальну заявку на бронювання. Це демонстрація
                  для курсового, без реальної оплати.
                </div>
                <ul
                  style={{
                    paddingLeft: "1.2rem",
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#9ca3af"
                  }}
                >
                  <li>
                    Тур: <strong>{tour.title}</strong>
                  </li>
                  <li>
                    Дата старту:{" "}
                    <strong>{form.date || tour.nextStart || "не вказано"}</strong>
                  </li>
                  <li>
                    Мандрівників: <strong>{form.people}</strong>
                  </li>
                  <li>
                    Контакт: <strong>{form.fullName || "—"}</strong>,{" "}
                    {form.email || "—"}, {form.phone || "—"}
                  </li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(2)}
                >
                  Назад
                </button>
                <button type="submit" className="btn btn-primary">
                  Створити заявку
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="glass" style={{ padding: "1rem" }}>
        <div className="section-title">Що відбувається після бронювання?</div>
        <ol
          style={{
            paddingLeft: "1.2rem",
            fontSize: "0.85rem",
            color: "#e5e7eb"
          }}
        >
          <li>Заявка зберігається у вашому браузері в розділі «Аналітика».</li>
          <li>Ви можете змінити статус заявки (умовно: підтверджено / скасовано).</li>
          <li>Дані профілю підтягуються автоматично при наступних бронюваннях.</li>
        </ol>
      </div>
    </div>
  );
}


