import React from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { TourCard } from "../components/TourCard.jsx";
import { Link } from "react-router-dom";

export function FavouritesPage() {
  const { tours, state } = useBooking();
  const favTours = tours.filter(t => state.favourites.includes(t.id));

  if (!favTours.length) {
    return (
      <div className="glass card-muted">
        <div className="section-title">Ще немає обраних турів</div>
        <div className="section-subtitle" style={{ marginBottom: "0.8rem" }}>
          Додайте декілька турів у «Обране», щоб швидко повертатись до них.
        </div>
        <Link to="/tours" className="btn btn-primary">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "0.9rem" }}>
        <div className="section-title">Обрані тури</div>
        <div className="section-subtitle">
          Улюблені варіанти для швидкого бронювання.
        </div>
      </div>
      <div className="grid grid-3">
        {favTours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}






