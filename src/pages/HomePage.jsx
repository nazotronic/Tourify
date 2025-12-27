import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export function HomePage() {
  const { tours, state } = useBooking();
  const popularCount = Math.max(1, Math.round(tours.length * 0.65)); // 60–70%
  const popularTours = tours.slice(0, popularCount);
  const [view, setView] = useState("popular"); // popular | pending | confirmed

  const totalPrice = tours.reduce((sum, t) => sum + t.priceFrom, 0);
  const avgPrice = Math.round(totalPrice / tours.length);
  const destinations = useMemo(
    () => new Set(tours.map(t => t.country)),
    [tours]
  );

  const pendingBookings = state.bookings.filter(b => b.status === "pending");
  const confirmedBookings = state.bookings.filter(b => b.status === "confirmed");

  return (
    <>
      <div className="hero-layout">
        <section>
          <h1 className="hero-title">
            Плануйте подорожі в{" "}
            <span className="hero-gradient">два кліки</span> з{" "}
            <span style={{ fontWeight: 700 }}>Tourify</span>.
          </h1>
          <p className="hero-subtitle">
            Обирайте тури, фільтруйте за напрямками, тривалістю та бюджетом,
            бронюйте онлайн та відстежуйте всі заявки в одному місці. Ідеально
            під навчальний проєкт і реальні подорожі мрії.
          </p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <Link to="/tours" className="btn btn-primary">
              Переглянути тури
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              Відкрити аналітику
            </Link>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <div className="hero-metric-value">{tours.length}</div>
              <div className="hero-metric-label">готових тур-пакетів</div>
            </div>
            <div className="hero-metric">
              <div className="hero-metric-value">{destinations.size}</div>
              <div className="hero-metric-label">напрямів по світу</div>
            </div>
            <div className="hero-metric">
              <div className="hero-metric-value">~{avgPrice}$</div>
              <div className="hero-metric-label">середній бюджет на тур</div>
            </div>
            <div className="hero-metric">
              <div className="hero-metric-value">
                {state.bookings.length || "0"}
              </div>
              <div className="hero-metric-label">
                зареєстрованих заявок (усі етапи)
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div
              className="glass"
              style={{
                padding: "0.5rem 0.5rem",
                display: "inline-flex",
                gap: 6,
                background: "rgba(15,23,42,0.9)",
                borderRadius: 999
              }}
            >
              <button
                type="button"
                className={
                  "chip" + (view === "popular" ? " active" : "")
                }
                style={{
                  borderRadius: 999,
                  fontSize: "0.95rem",
                  padding: "0.4rem 1rem"
                }}
                onClick={() => setView("popular")}
              >
                Популярні тури
              </button>
              <button
                type="button"
                className={
                  "chip" + (view === "pending" ? " active" : "")
                }
                style={{
                  borderRadius: 999,
                  fontSize: "0.95rem",
                  padding: "0.4rem 1rem"
                }}
                onClick={() => setView("pending")}
              >
                В обробці
              </button>
              <button
                type="button"
                className={
                  "chip" + (view === "confirmed" ? " active" : "")
                }
                style={{
                  borderRadius: 999,
                  fontSize: "0.95rem",
                  padding: "0.4rem 1rem"
                }}
                onClick={() => setView("confirmed")}
              >
                Заброньовані
              </button>
            </div>
          </div>
        </section>

        <aside className="hero-card">
          <div className="hero-card-header">
            <div>
              <div className="hero-card-title">Статус заброньованих турів</div>
              <div className="hero-card-destination">
                Етапи: заявка → підтвердження адміністратором → заброньовано
              </div>
            </div>
            <span className="badge badge-success">
              {confirmedBookings.length
                ? `${confirmedBookings.length} заброньовано`
                : "Чекаємо перше підтвердження"}
            </span>
          </div>
          <div className="hero-track">
            {confirmedBookings.slice(-3).map(b => {
              const tour = tours.find(t => t.id === b.tourId);
              if (!tour) return null;
              return (
                <div key={b.id} className="hero-track-item">
                  <div>
                    <div>{tour.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {tour.country} · {tour.durationDays} днів
                    </div>
                  </div>
                  <span className="badge badge-success">підтверджено</span>
                </div>
              );
            })}
            {confirmedBookings.length === 0 && (
              <div className="hero-track-item">
                <div>
                  <div>Поки немає підтверджених турів</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    Створіть заявку та позначте її як підтверджену в розділі
                    «Аналітика» (демо).
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="hero-card-footer">
            <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Дані зберігаються тільки у вашому браузері · Без реальних оплат
            </span>
            <Link to="/tours" className="btn btn-primary">
              Забронювати тур
            </Link>
          </div>
        </aside>
      </div>

      {/* Блок під геро-секцією, який залежить від вибраного режиму */}
      <div style={{ marginTop: "1.5rem" }}>
        <div className="glass" style={{ padding: "1rem" }}>
          {view === "popular" && (
            <>
              <div className="section-title">Популярні тури з каталогу</div>
              <div className="section-subtitle" style={{ marginBottom: "0.8rem" }}>
                Топ-напрямки за рейтингом. Для детального перегляду переходьте в
                каталог.
              </div>
              <div className="scroll-x-soft">
                <div
                  style={{
                    display: "flex",
                    gap: "0.9rem",
                    minWidth: 0
                  }}
                >
                  {popularTours.map(tour => (
                    <div
                      key={tour.id}
                      className="glass"
                      style={{
                        minWidth: 340,
                        maxWidth: 340,
                        flex: "0 0 auto",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: 150,
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
                        <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                          <span className="tag">{tour.country}</span>
                        </div>
                      </div>
                      <div style={{ padding: "0.7rem 0.8rem 0.8rem" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: 4,
                            fontSize: "0.95rem"
                          }}
                        >
                          {tour.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                            marginBottom: 6
                          }}
                        >
                          {tour.durationDays} днів · від {tour.priceFrom}$ · ★{" "}
                          {tour.rating}
                        </div>
                        <Link
                          to={`/tours/${tour.id}`}
                          className="btn btn-outline"
                          style={{
                            padding: "0.35rem 0.8rem",
                            fontSize: "0.8rem"
                          }}
                        >
                          Детальніше
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {view === "pending" && (
            <>
              <div className="section-title">
                Заявки в очікуванні підтвердження
              </div>
              <div className="section-subtitle" style={{ marginBottom: "0.8rem" }}>
                Це перший етап — реєстрація бронювання користувачем.
              </div>
              {pendingBookings.length === 0 ? (
                <div className="card-muted card">
                  Поки що немає заявок в обробці. Спробуйте забронювати будь-який
                  тур.
                </div>
              ) : (
                <div className="scroll-y-soft">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Дата створення</th>
                        <th>Тур</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBookings
                        .slice()
                        .reverse()
                        .map(b => {
                          const tour = tours.find(t => t.id === b.tourId);
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
                                <span className="badge badge-warning">
                                  очікує підтвердження
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {view === "confirmed" && (
            <>
              <div className="section-title">Заброньовані тури</div>
              <div className="section-subtitle" style={{ marginBottom: "0.8rem" }}>
                Третій етап — після підтвердження адміністратором тур вважається
                заброньованим.
              </div>
              {confirmedBookings.length === 0 ? (
                <div className="card-muted card">
                  Немає підтверджених заявок. Змініть статус у розділі
                  «Аналітика», щоб побачити приклад.
                </div>
              ) : (
                <div className="scroll-y-soft">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Дата підтвердження</th>
                        <th>Тур</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedBookings
                        .slice()
                        .reverse()
                        .map(b => {
                          const tour = tours.find(t => t.id === b.tourId);
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
                                <span className="badge badge-success">
                                  підтверджено
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}


