"use client";

import { useState } from "react";
import { Mountain, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                window.location.href = "/admin";
            } else {
                const data = await res.json();
                setError(data.error || "Invalid password");
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
            }}
        >
            <div
                className="glass"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    padding: "2.5rem",
                    borderRadius: "1.5rem",
                    textAlign: "center",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: "1rem",
                        background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem",
                    }}
                >
                    <Mountain size={32} color="white" />
                </div>

                <h1
                    style={{
                        fontFamily: "var(--font-outfit)",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        color: "var(--color-text)",
                        marginBottom: "0.5rem",
                    }}
                >
                    Admin Login
                </h1>
                <p
                    style={{
                        color: "var(--color-muted)",
                        fontSize: "0.875rem",
                        marginBottom: "2rem",
                    }}
                >
                    Enter your password to access the dashboard
                </p>

                <form
                    onSubmit={handleLogin}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <div style={{ position: "relative" }}>
                        <Lock
                            size={16}
                            style={{
                                position: "absolute",
                                left: "1rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--color-muted)",
                            }}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter admin password"
                            className="input-field"
                            style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "0.75rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-muted)",
                                padding: "0.25rem",
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {error && (
                        <p style={{ color: "#dc2626", fontSize: "0.85rem", textAlign: "left" }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !password}
                        style={{
                            justifyContent: "center",
                            opacity: loading || !password ? 0.7 : 1,
                            width: "100%",
                        }}
                    >
                        {loading ? (
                            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                            <Lock size={16} />
                        )}
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
