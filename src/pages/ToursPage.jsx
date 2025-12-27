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
    tags: [],
    minPrice: "",
    maxPrice: ""
  });

  // Автоматично застосовувати фільтри з уподобань при заході на сторінку
  useEffect(() => {
    const prefs = state.profile?.preferences;
    if (prefs) {
      setFilters(prev => ({
        ...prev,
        type: prefs.type?.length ? prefs.type : prev.type,
        difficulty: prefs.difficulty?.length ? prefs.difficulty : prev.difficulty,
        tags: prefs.tags?.length ? prefs.tags : prev.tags,
        minPrice: prefs.budgetFrom || prev.minPrice,
        maxPrice: prefs.budgetTo || prev.maxPrice
      }));
    }
  }, [state.profile]);

  const uniqueTags = useMemo(() => {
    const allTags = tours.flatMap(t => t.tags || []);
    return [...new Set(allTags)].sort();
  }, [tours]);

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
      if (filters.tags?.length && !t.tags.some(tag => filters.tags.includes(tag)))
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
      <FiltersBar filters={filters} onChange={setFilters} availableTags={uniqueTags} />
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


