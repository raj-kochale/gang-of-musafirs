"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid or expired OTP. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  OAuthAccountNotLinked: "This email is already registered. Try signing in with OTP.",
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
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode
    ? errorMessages[errorCode] || errorMessages.Default
    : null;

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(errorMessage);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        setLoading(false);
        return;
      }

      setStep("otp");
      setCountdown(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last char
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      handleVerifyOtp(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    // Focus the next empty or the last
    const nextEmpty = newOtp.findIndex((d) => !d);
    otpRefs.current[nextEmpty >= 0 ? nextEmpty : 5]?.focus();
    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        otp: otpCode,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid or expired OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
      } else {
        setCountdown(60);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "1.75rem",
              background:
                "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
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
            padding: "clamp(1.5rem, 5vw, 2.5rem) clamp(1.25rem, 4vw, 2rem)",
            boxShadow: "0 4px 24px var(--color-card-shadow)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            {step === "email" ? (
              <Mail size={24} color="white" />
            ) : (
              <KeyRound size={24} color="white" />
            )}
          </div>

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
            {step === "email" ? "Welcome Back" : "Enter OTP"}
          </h1>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            {step === "email"
              ? "Sign in to plan your next adventure"
              : (
                  <>
                    We sent a 6-digit code to
                    <br />
                    <strong style={{ color: "var(--color-text)" }}>{email}</strong>
                  </>
                )}
          </p>

          {/* Error */}
          {error && (
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
              <AlertCircle
                size={16}
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              {error}
            </div>
          )}

          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <div>
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
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
                  margin: "1.5rem 0",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
                <span style={{ color: "var(--color-muted)", fontSize: "0.8rem", fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
              </div>

            <form onSubmit={handleSendOtp}>
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
              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
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
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: "center",
                  marginTop: "1.5rem",
                  color: "var(--color-muted)",
                  fontSize: "0.8rem",
                }}
              >
                <ShieldCheck size={14} />
                <span>We&apos;ll send a one-time code to your email</span>
              </div>
            </form>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <div>
              {/* 6-digit OTP inputs */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-input"
                    style={{
                      width: "48px",
                      height: "56px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-outfit)",
                      color: "var(--color-text)",
                      background: "var(--color-surface)",
                      border: digit
                        ? "2px solid var(--color-terracotta)"
                        : "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      caretColor: "var(--color-terracotta)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-terracotta)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-hover-shadow)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = digit ? "var(--color-terracotta)" : "var(--color-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>

              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Loader2
                    size={24}
                    style={{
                      animation: "spin 1s linear infinite",
                      color: "var(--color-terracotta)",
                    }}
                  />
                </div>
              )}

              {/* Verify button (fallback if auto-submit fails) */}
              <button
                onClick={() => handleVerifyOtp(otp.join(""))}
                disabled={loading || otp.join("").length !== 6}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.875rem",
                  opacity: loading || otp.join("").length !== 6 ? 0.7 : 1,
                  cursor: loading ? "wait" : "pointer",
                  marginBottom: "1.25rem",
                }}
              >
                {loading ? (
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  "Verify & Sign In"
                )}
              </button>

              {/* Resend / Change email */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  style={{
                    background: "none",
                    border: "none",
                    color:
                      countdown > 0
                        ? "var(--color-muted)"
                        : "var(--color-terracotta)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: countdown > 0 ? "default" : "pointer",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP"}
                </button>
                <button
                  onClick={() => {
                    setStep("email");
                    setOtp(["", "", "", "", "", ""]);
                    setError(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-muted)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                    textDecoration: "underline",
                  }}
                >
                  Change email
                </button>
              </div>
            </div>
          )}
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

      {/* Spinner keyframe + mobile */}
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media (max-width: 480px) {
          .otp-input {
            width: 40px !important;
            height: 48px !important;
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
