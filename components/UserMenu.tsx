"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      />
    );
  }

  if (!session) {
    return (
      <Link
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.5rem 1.1rem",
          borderRadius: "999px",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
          textDecoration: "none",
          fontSize: "0.85rem",
          fontFamily: "var(--font-inter)",
          fontWeight: 600,
          transition: "all 0.2s ease",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-terracotta)";
          (e.currentTarget as HTMLElement).style.color = "var(--color-terracotta)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
        }}
      >
        <User size={15} />
        Sign In
      </Link>
    );
  }

  const name = session.user?.name ?? session.user?.email?.split("@")[0] ?? "User";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={name}
            width={36}
            height={36}
            style={{
              borderRadius: "50%",
              border: "2px solid var(--color-border)",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "220px",
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 30px var(--color-card-hover-shadow)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* User info */}
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--color-text)",
                marginBottom: "0.15rem",
              }}
            >
              {name}
            </p>
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {session.user?.email}
            </p>
          </div>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.75rem 1rem",
              border: "none",
              background: "transparent",
              color: "var(--color-muted)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-inter)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
              (e.currentTarget as HTMLElement).style.color = "#dc2626";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
