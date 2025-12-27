import React from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export function TourCard({ tour }) {
  const { toggleFavourite, state } = useBooking();
  const isFav = state.favourites.includes(tour.id);

  return (
    <article className="glass" style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
        <div
          style={{
            position: "relative",
            minHeight: 130,
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
                "linear-gradient(to top, rgba(15,23,42,0.75), transparent 55%)"
            }}
          />
          <div style={{ position: "absolute", bottom: 8, left: 10 }}>
            <span className="tag" style={{ background: "rgba(15,23,42,0.92)" }}>
              {tour.country}
            </span>
          </div>
        </div>
        <div style={{ padding: "0.75rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: 4
                }}
              >
                {tour.title}
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                {tour.durationDays} днів · від {tour.priceFrom}$ ·{" "}
                <span style={{ color: "#fde68a" }}>★ {tour.rating}</span>{" "}
                <span>({tour.reviewsCount})</span>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#9ca3af",
              marginTop: 0,
              marginBottom: 0,
              flex: 1
            }}
          >
            {tour.description}
          </p>

          <div className="chip-group" style={{ marginTop: "0.25rem", marginBottom: "0.25rem" }}>
            <span className="chip chip-static active">{tour.type}</span>
            <span className="chip chip-static">{tour.difficulty}</span>
            {tour.tags.slice(0, 2).map(t => (
              <span key={t} className="chip chip-static">
                {t}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              marginTop: "0.25rem"
            }}
          >
            <button
              onClick={() => toggleFavourite(tour.id)}
              className="btn btn-outline"
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: 999,
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                flex: 1,
                maxWidth: "50%",
                justifyContent: "center"
              }}
            >
              {isFav ? "В обраному" : "В обране"}
            </button>
            <Link 
              to={`/tours/${tour.id}`} 
              className="btn btn-primary"
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: 999,
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                flex: 1,
                maxWidth: "50%",
                justifyContent: "center",
                textAlign: "center"
              }}
            >
              Детальніше
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}


