import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, userAPI } from "../config/api.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, fetch profile from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() });
          } else {
            // Fallback if doc doesn't exist yet (registration race condition?)
            setUser({ id: firebaseUser.uid, email: firebaseUser.email });
          }
        } else {
          // User is signed out
          setUser(null);
          localStorage.removeItem('tourify_admin'); // Setup cleanup
        }
      } catch (err) {
        console.error("Auth State Error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      // api.js login function handles signInWithEmailAndPassword
      // Auth listener will update state
      await authAPI.login(email, password);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      setError(null);
      await authAPI.register(email, password, fullName);
      // Auth listener will update state
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authAPI.logout();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      setError(null);
      if (!user) throw new Error("Not authorized");
      await userAPI.changePassword(user.id, newPassword);
    } catch (err) {
      console.error("Change Password Error:", err);
      setError(err.message);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const updatedUser = await userAPI.getUser(user.id);
      setUser(prev => ({ ...prev, ...updatedUser }));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const adminLogin = async (password) => {
    try {
      setError(null);
      const res = await authAPI.adminLogin(password);
      if (res.success) {
        // Force refresh to get role if needed, but onAuthStateChanged handles it
        // Wait a tick? onAuthStateChanged should fire after signIn
        // We can return success
        localStorage.setItem('tourify_admin', 'true'); // For strict checks
        return res;
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
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
