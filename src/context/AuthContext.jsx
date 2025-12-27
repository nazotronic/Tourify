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
      // Note: Password change would need backend implementation
      // For now, this is a placeholder
      console.warn("Password change not implemented yet");
      throw new Error("Зміна пароля наразі недоступна");
    } catch (err) {
      setError(err.message);
      throw err;
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
