import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { tours as initialTours } from "../data/tours.js";
import { tourAPI, bookingAPI, supportAPI, favouritesAPI, userAPI } from "../config/api.js";
import { useAuth } from "./AuthContext.jsx";

const BookingContext = createContext(null);

const defaultState = {
  favourites: [],
  bookings: [],
  supportMessages: [],
  customTours: [],
  profile: {
    fullName: "",
    email: "",
    phone: "",
    preferences: {
      type: [],
      difficulty: [],
      budgetFrom: 0,
      budgetTo: 5000
    }
  }
};

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(defaultState);
  const [toast, setToast] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tours from API
  useEffect(() => {
    const loadTours = async () => {
      try {
        const tours = await tourAPI.getAllTours();

        if (tours.length === 0) {
          // Initialize with default tours if none exist
          await tourAPI.initializeTours(initialTours);
          setState(prev => ({ ...prev, customTours: initialTours }));
        } else {
          setState(prev => ({ ...prev, customTours: tours }));
        }
      } catch (err) {
        console.error("Помилка завантаження турів:", err);
        // Fallback to local data
        setState(prev => ({ ...prev, customTours: initialTours }));
      }
    };

    loadTours();
  }, []);

  // Load user data from API
  useEffect(() => {
    if (!user) {
      setRole(null);
      // Don't reset tours, just reset user-specific data
      setState(prev => ({
        ...prev,
        favourites: [],
        bookings: [],
        supportMessages: [],
        profile: defaultState.profile
      }));
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        // Check if admin
        const isAdmin = user.role === 'admin' || localStorage.getItem('tourify_admin') === 'true';
        setRole(isAdmin ? 'admin' : 'user');

        if (isAdmin) {
          // Admin loads all bookings and messages
          const [allBookings, allMessages] = await Promise.all([
            bookingAPI.getBookings(null, true),
            supportAPI.getMessages(null, true)
          ]);

          setState(prev => ({
            ...prev,
            bookings: allBookings || [],
            supportMessages: allMessages || [],
            profile: {
              fullName: 'Administrator',
              email: 'admin@tourify.com',
              phone: '',
              preferences: {
                type: [],
                difficulty: [],
                budgetFrom: 0,
                budgetTo: 5000
              }
            }
          }));
        } else {
          // Regular user loads their own data
          const userData = await userAPI.getUser(user.id);

          setState(prev => ({
            ...prev,
            favourites: userData.favourites || [],
            bookings: userData.bookings || [],
            supportMessages: userData.supportMessages || [],
            profile: userData.profile || {
              fullName: userData.fullName || "",
              email: userData.email || "",
              phone: "",
              preferences: {
                type: [],
                difficulty: [],
                budgetFrom: 0,
                budgetTo: 5000
              }
            }
          }));
        }
      } catch (err) {
        console.error("Помилка завантаження даних користувача:", err);
        // Set default values on error
        setRole(user.role || 'user');
        setState(prev => ({
          ...prev,
          favourites: [],
          bookings: [],
          supportMessages: [],
          profile: {
            fullName: user.fullName || "",
            email: user.email || "",
            phone: "",
            preferences: {
              type: [],
              difficulty: [],
              budgetFrom: 0,
              budgetTo: 5000
            }
          }
        }));
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const allTours = useMemo(() => {
    return state.customTours || [];
  }, [state.customTours]);

  const setUserRole = newRole => {
    setRole(newRole);
  };

  const value = useMemo(() => {
    const toggleFavourite = async (tourId) => {
      if (!user || role === 'admin') return;

      try {
        const { favourites } = await favouritesAPI.toggleFavourite(user.id, tourId);

        setState(prev => {
          const exists = prev.favourites.includes(tourId);
          setToast(exists ? "Тур видалено з обраних" : "Тур додано в обрані");
          return { ...prev, favourites };
        });
      } catch (err) {
        console.error("Помилка оновлення обраних:", err);
        setToast("Помилка оновлення обраних");
      }
    };

    const createBooking = async (booking) => {
      if (!user || role === 'admin') return;

      try {
        const newBooking = await bookingAPI.createBooking(user.id, booking);

        setState(prev => ({
          ...prev,
          bookings: [...prev.bookings, newBooking]
        }));

        setToast("Заявку на бронювання надіслано");
      } catch (err) {
        console.error("Помилка створення бронювання:", err);
        setToast("Помилка створення бронювання");
      }
    };

    const updateBookingStatus = async (bookingId, status) => {
      const booking = state.bookings.find(b => b.id === bookingId);
      if (!booking) {
        console.error("Бронювання не знайдено:", bookingId);
        return;
      }

      const userId = booking.userId || user.id;

      try {
        await bookingAPI.updateBookingStatus(bookingId, status, userId);

        setState(prev => ({
          ...prev,
          bookings: prev.bookings.map(b =>
            b.id === bookingId ? { ...b, status } : b
          )
        }));

        if (status === "confirmed") {
          setToast("Бронювання підтверджено");
        } else if (status === "cancelled") {
          setToast("Бронювання відхилено");
        }
      } catch (err) {
        console.error("Помилка оновлення бронювання:", err);
        setToast("Помилка оновлення бронювання");
      }
    };

    const updateProfile = async (profile) => {
      if (!user || role === 'admin') return;

      try {
        const updatedProfile = { ...state.profile, ...profile };

        await userAPI.updateUser(user.id, {
          profile: updatedProfile,
          fullName: profile.fullName || state.profile?.fullName || "",
          email: profile.email || state.profile?.email || user.email || ""
        });

        setState(prev => ({
          ...prev,
          profile: updatedProfile
        }));

        setToast("Профіль збережено");
      } catch (err) {
        console.error("Помилка оновлення профілю:", err);
        setToast("Помилка оновлення профілю");
      }
    };

    const addTour = async tour => {
      if (role !== 'admin') return;

      try {
        const newTour = await tourAPI.createTour(tour);

        setState(prev => ({
          ...prev,
          customTours: [...prev.customTours, newTour]
        }));

        setToast("Тур додано до каталогу");
      } catch (err) {
        console.error("Помилка додавання туру:", err);
        setToast("Помилка додавання туру");
      }
    };

    const updateTour = async (tourId, updatedData) => {
      if (role !== 'admin') return;

      try {
        const updatedTour = await tourAPI.updateTour(tourId, updatedData);

        setState(prev => ({
          ...prev,
          customTours: prev.customTours.map(t =>
            t.id === tourId ? updatedTour : t
          )
        }));

        setToast("Тур оновлено");
      } catch (err) {
        console.error("Помилка оновлення туру:", err);
        setToast("Помилка оновлення туру");
      }
    };

    const deleteTour = async tourId => {
      if (role !== 'admin') return;

      try {
        await tourAPI.deleteTour(tourId);

        setState(prev => ({
          ...prev,
          customTours: prev.customTours.filter(t => t.id !== tourId),
          favourites: prev.favourites.filter(id => id !== tourId)
        }));

        setToast("Тур видалено з каталогу");
      } catch (err) {
        console.error("Помилка видалення туру:", err);
        setToast("Помилка видалення туру");
      }
    };

    const addSupportMessage = async (message) => {
      if (!user || role === 'admin') return;

      try {
        const newMessage = await supportAPI.sendMessage(user.id, message);

        setState(prev => ({
          ...prev,
          supportMessages: [...prev.supportMessages, newMessage]
        }));
      } catch (err) {
        console.error("Помилка відправки повідомлення:", err);
        setToast("Помилка відправки повідомлення");
      }
    };

    const markSupportMessageRead = async messageId => {
      const message = state.supportMessages.find(m => m.id === messageId);
      if (!message) return;

      const userId = message.userId || user.id;

      try {
        await supportAPI.updateMessage(messageId, userId, { read: true });

        setState(prev => ({
          ...prev,
          supportMessages: prev.supportMessages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
      } catch (err) {
        console.error("Помилка оновлення повідомлення:", err);
      }
    };

    const getTourById = id => allTours.find(t => t.id === id);

    return {
      state,
      tours: allTours,
      initialTours,
      role,
      loading,
      setUserRole,
      toggleFavourite,
      createBooking,
      updateBookingStatus,
      updateProfile,
      addTour,
      updateTour,
      deleteTour,
      addSupportMessage,
      markSupportMessageRead,
      getTourById,
      toast
    };
  }, [state, toast, role, allTours, loading, user]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
