import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { AdminLoginPage } from "./pages/AdminLoginPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ToursPage } from "./pages/ToursPage.jsx";
import { FavouritesPage } from "./pages/FavouritesPage.jsx";
import { BookedToursPage } from "./pages/BookedToursPage.jsx";
import { TourDetailsPage } from "./pages/TourDetailsPage.jsx";
import { BookingPage } from "./pages/BookingPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { AdminToursPage } from "./pages/AdminToursPage.jsx";
import { AdminToursManagePage } from "./pages/AdminToursManagePage.jsx";
import { AdminBookingsPage } from "./pages/AdminBookingsPage.jsx";
import { AdminSupportPage } from "./pages/AdminSupportPage.jsx";
import { BookingProvider, useBooking } from "./context/BookingContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Toast() {
  const { toast } = useBooking();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: bookingLoading } = useBooking();

  if (authLoading || bookingLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass" style={{ padding: "2rem" }}>
          <div className="section-title">Завантаження...</div>
        </div>
      </div>
    );
  }

  // Routes accessible without authentication
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {role === "admin" ? (
          <>
            <Route path="/admin/tours-manage" element={<AdminToursManagePage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
            <Route path="*" element={<Navigate to="/admin/tours-manage" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:id" element={<TourDetailsPage />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/booked" element={<BookedToursPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route
              path="*"
              element={
                <div className="glass card-muted" style={{ padding: "1rem" }}>
                  <div className="section-title">Сторінку не знайдено</div>
                  <div className="section-subtitle">
                    Перевірте URL або перейдіть на головну сторінку.
                  </div>
                </div>
              }
            />
          </>
        )}
      </Routes>
      <Toast />
    </Layout>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <AppInner />
    </BookingProvider>
  );
}
