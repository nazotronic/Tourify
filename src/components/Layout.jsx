import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ProfileModal } from "./ProfileModal.jsx";
import { Avatar } from "./Avatar.jsx";

export function Layout({ children }) {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    state: { favourites, bookings, supportMessages },
    role,
    addSupportMessage
  } = useBooking();
  const { user, logout } = useAuth();

  const pendingCount = bookings.filter(b => b.status === "pending").length;

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="nav">
        <div className="glass nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-mark">T</div>
            <div>
              <div
                style={{ fontSize: "0.95rem", fontWeight: 650, color: "#f9fafb" }}
              >
                Tourify
              </div>
            </div>
          </div>
          <nav className="nav-links">
            {role === "admin" ? (
              <>
                <NavLink
                  to="/admin/tours-manage"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Управління турами
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Користувачі
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Заявки
                  {pendingCount > 0 && (
                    <span className="badge badge-warning" style={{ marginLeft: 4 }}>
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/admin/support"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Підтримка
                  {supportMessages.filter(m => !m.read).length > 0 && (
                    <span className="badge badge-warning" style={{ marginLeft: 4 }}>
                      {supportMessages.filter(m => !m.read).length}
                    </span>
                  )}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Головна
                </NavLink>
                <NavLink
                  to="/tours"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Каталог турів
                </NavLink>
                <NavLink
                  to="/favourites"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Обрані тури
                  {favourites.length > 0 && (
                    <span className="pill-badge" style={{ marginLeft: 4 }}>
                      {favourites.length}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/booked"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Заброньовані тури
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                >
                  Аналітика
                </NavLink>
              </>
            )}
          </nav>
          <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: "0.3rem 0.7rem",
                fontSize: "0.8rem"
              }}
              onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? "🌙 Темна" : "☀️ Світла"}
            </button>
            {role === "user" && (
              <button
                type="button"
                className="pill"
                style={{
                  background: "rgba(15,23,42,0.9)",
                  borderColor: "rgba(56,189,248,0.8)",
                  cursor: "pointer",
                  padding: "0.4rem 1.1rem"
                }}
                onClick={() => {
                  setSupportOpen(true);
                  setSupportSent(false);
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    background: "#22c55e"
                  }}
                />
                Онлайн-підтримка
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "50%"
                }}
                title="Відкрити налаштування"
              >
                <Avatar src={user.profile?.avatar} alt={user.fullName} size={42} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">{children}</main>

      {supportOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
          }}
          onClick={() => setSupportOpen(false)}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: "1.1rem 1.2rem",
              boxShadow: "0 18px 50px rgba(15,23,42,0.95)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8
              }}
            >
              <div>
                <div className="section-title" style={{ fontSize: "1.1rem", marginBottom: 2 }}>
                  Написати в онлайн-підтримку
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "0.2rem 0.6rem", fontSize: "0.8rem" }}
                onClick={() => setSupportOpen(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Текст повідомлення
              </label>
              <textarea
                className="textarea"
                rows={4}
                value={supportMessage}
                onChange={e => setSupportMessage(e.target.value)}
                placeholder="Опишіть, будь ласка, своє питання або побажання щодо туру..."
              />
            </div>
            {supportSent && (
              <div
                className="badge badge-success"
                style={{ display: "inline-flex", marginBottom: 8 }}
              >
                Повідомлення умовно надіслано (для демонстрації курсового).
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 4
              }}
            >
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}
                onClick={() => {
                  setSupportOpen(false);
                  setSupportMessage("");
                  setSupportSent(false);
                }}
              >
                Скасувати
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
                onClick={() => {
                  if (supportMessage.trim()) {
                    addSupportMessage(supportMessage.trim());
                    setSupportSent(true);
                    setSupportMessage("");
                  }
                }}
              >
                Надіслати
              </button>
            </div>
          </div>
        </div>
      )}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <footer className="footer">
        <span>© {new Date().getFullYear()} Tourify. All rights reserved.</span>
        <span>Privacy Policy · Terms of Service</span>
      </footer>
    </div>
  );
}


