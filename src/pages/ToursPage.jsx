import React, { useMemo, useState, useEffect } from "react";
import { FiltersBar } from "../components/FiltersBar.jsx";
import { TourCard } from "../components/TourCard.jsx";
import { useBooking } from "../context/BookingContext.jsx";

export function ToursPage() {
  const { tours, state } = useBooking();
  const [filters, setFilters] = useState({
    query: "",
    type: [],
    difficulty: [],
    minPrice: "",
    maxPrice: ""
  });

  // Автоматично застосовувати фільтри з уподобань при заході на сторінку
  useEffect(() => {
    const prefs = state.profile?.preferences;
    if (prefs && (prefs.type?.length > 0 || prefs.difficulty?.length > 0)) {
      setFilters(prev => ({
        ...prev,
        type: prefs.type || [],
        difficulty: prefs.difficulty || []
      }));
    }
  }, [state.profile]);

  const filteredTours = useMemo(() => {
    return tours.filter(t => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const hay =
          (t.title + t.country + t.tags.join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.type.length && !filters.type.includes(t.type)) return false;
      if (
        filters.difficulty.length &&
        !filters.difficulty.includes(t.difficulty)
      )
        return false;
      if (filters.minPrice && t.priceFrom < Number(filters.minPrice))
        return false;
      if (filters.maxPrice && t.priceFrom > Number(filters.maxPrice))
        return false;
      return true;
    });
  }, [tours, filters]);

  return (
    <div>
      <FiltersBar filters={filters} onChange={setFilters} />
      <div className="grid grid-3">
        {filteredTours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
        {filteredTours.length === 0 && (
          <div className="glass card-muted" style={{ gridColumn: "1 / -1" }}>
            <div className="section-title">Нічого не знайдено</div>
            <div className="section-subtitle">
              Спробуйте прибрати частину фільтрів або змініть бюджет.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


