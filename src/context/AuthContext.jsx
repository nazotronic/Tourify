import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, userAPI } from "../config/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('tourify_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('tourify_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { user: userData } = await authAPI.login(email, password);

      setUser(userData);
      localStorage.setItem('tourify_user', JSON.stringify(userData));

      return userData;
    } catch (err) {
      console.error("Помилка логіну:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      setError(null);
      const { user: userData } = await authAPI.register(email, password, fullName);

      setUser(userData);
      localStorage.setItem('tourify_user', JSON.stringify(userData));

      return userData;
    } catch (err) {
      console.error("Помилка реєстрації:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setUser(null);
      localStorage.removeItem('tourify_user');
      localStorage.removeItem('tourify_admin');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      setError(null);
      if (!user) throw new Error("Користувач не авторизований");

      if (typeof userAPI.changePassword !== 'function') {
        console.error("userAPI.changePassword is not a function", userAPI);
        throw new Error("Функція зміни паролю недоступна. Спробуйте перезавантажити сторінку.");
      }

      await userAPI.changePassword(user.id, newPassword);

      // Optional: Logout user to required re-login, or just succeed.
      // We'll just succeed.
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const updatedUser = await userAPI.getUser(user.id);
      setUser(updatedUser);
      localStorage.setItem('tourify_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const adminLogin = async (password) => {
    try {
      setError(null);
      const { success, role } = await authAPI.adminLogin(password);

      if (success && role === 'admin') {
        const adminUser = {
          id: 'admin',
          email: 'admin@tourify.com',
          role: 'admin',
          fullName: 'Administrator'
        };
        setUser(adminUser);
        localStorage.setItem('tourify_user', JSON.stringify(adminUser));
        localStorage.setItem('tourify_admin', 'true');
        return adminUser;
      }
    } catch (err) {
      console.error("Помилка адмін-логіну:", err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        changePassword,
        adminLogin,
        refreshUser,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
