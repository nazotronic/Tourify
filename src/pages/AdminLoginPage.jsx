import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await adminLogin(password);
            navigate("/admin/tours-manage");
        } catch (err) {
            setError("Невірний пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <div className="glass" style={{ maxWidth: "400px", width: "100%", padding: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div className="section-title" style={{ marginBottom: 4 }}>
                        Tourify
                    </div>
                    <div className="section-subtitle">
                        Вхід для адміністратора
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="password" style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 4, display: "block" }}>
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="Введіть пароль адміністратора"
                            required
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div
                            className="card-muted"
                            style={{
                                padding: "0.75rem 1rem",
                                borderRadius: 12,
                                marginBottom: "1rem",
                                border: "1px solid rgba(239,68,68,0.5)",
                                background: "rgba(239,68,68,0.1)",
                                color: "#fecaca"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", marginBottom: 12, textAlign: "center" }}
                    >
                        {loading ? "Перевірка..." : "Увійти"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", textAlign: "center" }}
                        onClick={() => navigate("/login")}
                    >
                        Увійти як користувач
                    </button>
                </div>
            </div>
        </div>
    );
}
