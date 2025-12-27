import React from "react";

export function Avatar({ src, alt, size = 40, className = "" }) {
    const initials = (alt || "User").charAt(0).toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(148,163,184,0.3)"
                }}
            />
        );
    }

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(30, 41, 59, 0.5)",
                color: "#94a3b8",
                border: "1px solid rgba(148,163,184,0.2)",
                overflow: "hidden"
            }}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "65%", height: "65%" }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
        </div>
    );
}
