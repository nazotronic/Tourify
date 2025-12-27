import React, { useState, useEffect } from "react";
import { userAPI } from "../config/api.js";

export function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); // For modal

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load users", err);
            setError("Не вдалося завантажити список користувачів");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо відмінити.")) return;
        try {
            await userAPI.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            if (selectedUser?.id === id) setSelectedUser(null);
        } catch (err) {
            alert("Помилка видалення: " + err.message);
        }
    };

    const filteredUsers = users.filter(u => {
        const term = searchTerm.toLowerCase();
        return (
            (u.fullName || "").toLowerCase().includes(term) ||
            (u.email || "").toLowerCase().includes(term)
        );
    });

    return (
        <div>
            <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <div className="section-title">Користувачі</div>
                        <div className="section-subtitle">
                            Управління акаунтами відвідувачів
                        </div>
                    </div>
                    <div style={{ position: "relative", minWidth: 250 }}>
                        <input
                            className="input"
                            placeholder="Пошук за ім'ям або email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: "2rem" }}
                        />
                        <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>Завантаження...</div>
            ) : error ? (
                <div className="card-muted" style={{ padding: "1rem", color: "#fca5a5", textAlign: "center" }}>{error}</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {filteredUsers.map(user => (
                        <div key={user.id} className="glass" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>{user.fullName || "Без імені"}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{user.email}</div>
                                </div>
                                <div
                                    style={{
                                        width: 32, height: 32, borderRadius: "50%",
                                        background: "rgba(56,189,248,0.2)", color: "#38bdf8",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.9rem", fontWeight: 700
                                    }}
                                >
                                    {user.fullName?.[0]?.toUpperCase() || "U"}
                                </div>
                            </div>

                            <div style={{ marginTop: "auto", paddingTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, justifyContent: "center", fontSize: "0.8rem", padding: "0.3rem" }}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    Переглянути
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, justifyContent: "center", fontSize: "0.8rem", padding: "0.3rem", color: "#fca5a5", borderColor: "rgba(239,68,68,0.3)" }}
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                            Користувачів не знайдено
                        </div>
                    )}
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(5px)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem"
                    }}
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="glass hide-scrollbar"
                        style={{ width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", padding: "1.5rem" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <div className="section-title">Інформація про акаунт</div>
                            <button className="btn btn-outline" style={{ padding: "0.2rem 0.6rem" }} onClick={() => setSelectedUser(null)}>✕</button>
                        </div>

                        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                            <div
                                style={{
                                    width: 60, height: 60, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #38bdf8, #22c55e)", color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.5rem", fontWeight: 700
                                }}
                            >
                                {selectedUser.fullName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{selectedUser.fullName || "Не вказано"}</div>
                                <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>ID: {selectedUser.id}</div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: "1rem" }}>
                            <InfoRow label="Email" value={selectedUser.email} />
                            <InfoRow label="Телефон" value={selectedUser.profile?.phone || "Не вказано"} />
                            <div style={{ borderTop: "1px solid rgba(148,163,184,0.2)", margin: "0.5rem 0" }} />
                            <InfoRow label="Бюджет" value={selectedUser.profile?.preferences?.budgetTo ? `до ${selectedUser.profile.preferences.budgetTo}$` : "Не налаштовано"} />
                            <InfoRow label="Улюблені типи" value={selectedUser.profile?.preferences?.type?.join(", ") || "—"} />
                            <InfoRow label="Рівень активності" value={selectedUser.profile?.preferences?.difficulty?.join(", ") || "—"} />
                        </div>

                        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
                            <button
                                className="btn btn-outline"
                                style={{ color: "#fca5a5", borderColor: "rgba(239,68,68,0.3)" }}
                                onClick={() => {
                                    handleDelete(selectedUser.id);
                                }}
                            >
                                Видалити акаунт
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: "0.95rem" }}>{value}</div>
        </div>
    );
}
