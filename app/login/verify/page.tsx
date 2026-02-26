"use client";

import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyRequestPage() {
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
            padding: "3rem 2rem",
            boxShadow: "0 4px 24px var(--color-card-shadow)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Mail size={28} color="white" />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Check Your Email
          </h1>

          <p
            style={{
              color: "var(--color-muted)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              maxWidth: "340px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We&apos;ve sent a magic sign-in link to your email. Click the link
            to sign in — no password needed!
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              fontSize: "0.85rem",
              color: "var(--color-muted)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={14} style={{ color: "var(--color-sage)", flexShrink: 0 }} />
              <span>Link expires in 24 hours</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={14} style={{ color: "var(--color-sage)", flexShrink: 0 }} />
              <span>Check spam/junk folder if not found</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={14} style={{ color: "var(--color-sage)", flexShrink: 0 }} />
              <span>You can close this tab after clicking the link</span>
            </div>
          </div>
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
            href="/login"
            style={{
              color: "var(--color-terracotta)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
