"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mountain, Lock, Loader2, Eye, EyeOff, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    /* Legacy password login (kept for backward compat) */
    const handlePasswordLogin = async (e: React.FormEvent) => {
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

    /* NextAuth-based login (Google OAuth) — role checked after redirect */
    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        signIn("google", { callbackUrl: "/admin" });
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
                    maxWidth: "420px",
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
                        marginBottom: "1.5rem",
                    }}
                >
                    Sign in with an admin account to access the dashboard
                </p>

                {/* ── Google Sign-In ── */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.6rem",
                        width: "100%",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-text)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: googleLoading ? "wait" : "pointer",
                        opacity: googleLoading ? 0.7 : 1,
                        transition: "all 0.2s",
                    }}
                >
                    {googleLoading ? (
                        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    )}
                    {googleLoading ? "Signing in…" : "Sign in with Google"}
                </button>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        margin: "1.5rem 0",
                        color: "var(--color-muted)",
                        fontSize: "0.8rem",
                    }}
                >
                    <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                    or use admin password
                    <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                </div>

                {/* ── Legacy Password Login ── */}
                <form
                    onSubmit={handlePasswordLogin}
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

                {/* Role info */}
                <div
                    style={{
                        marginTop: "1.5rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.75rem",
                        background: "rgba(122,158,126,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <ShieldCheck size={16} style={{ color: "var(--color-sage)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-muted)", textAlign: "left" }}>
                        Only accounts listed in <strong>ADMIN_EMAILS</strong> can access the admin dashboard via Google sign-in.
                    </span>
                </div>

                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
