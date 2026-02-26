"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  OAuthAccountNotLinked:
    "This email is already registered with a different method. Try signing in with email instead.",
  EmailSignin: "Could not send magic link. Please check your email address.",
  SessionRequired: "Please sign in to access this page.",
  Default: "Something went wrong. Please try again.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode
    ? errorMessages[errorCode] || errorMessages.Default
    : null;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await signIn("nodemailer", { email, callbackUrl });
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "block", textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "1.75rem",
              background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GangOfMusafirs
          </span>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "1.25rem",
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 24px var(--color-card-shadow)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "var(--color-text)",
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Sign in to plan your next adventure
          </p>

          {/* Error */}
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                borderRadius: "0.75rem",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "#dc2626",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
              {errorMessage}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.875rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: googleLoading ? "wait" : "pointer",
              transition: "all 0.2s ease",
              opacity: googleLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-terracotta)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px var(--color-card-hover-shadow)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {googleLoading ? (
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.75rem 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            <span style={{ color: "var(--color-muted)", fontSize: "0.8rem", fontWeight: 500 }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Email address
            </label>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <Mail
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
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.875rem",
                opacity: loading || !email.trim() ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "var(--color-muted)",
              fontSize: "0.8rem",
              marginTop: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            We&apos;ll send a sign-in link to your email.
            <br />
            No password needed!
          </p>
        </div>

        {/* Back link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--color-muted)",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--color-terracotta)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Home
          </Link>
        </p>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
