"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

const navLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Blog", href: "/blog" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "About", href: "/#about" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transition: "all 0.3s ease",
        background: scrolled
          ? "var(--color-navbar-bg)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
      }}
    >
      <div
        className="container-custom"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 800,
                fontSize: "1.4rem",
                background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              GangOfMusafirs
            </span>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "0.65rem",
                color: "var(--color-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Travel Experiences
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "var(--color-muted)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--color-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <UserMenu />
          <a
            href="https://wa.me/917354177879?text=Hi!%20I%27d%20like%20to%20plan%20a%20trip%20with%20GangOfMusafirs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem" }}
          >
            Plan My Trip
          </a>
        </nav>

        {/* Mobile Controls */}
        <div className="show-mobile" style={{ display: "none", alignItems: "center", gap: "0.5rem" }}>
          <UserMenu />
          <ThemeToggle />
          <button
            id="navbar-hamburger"
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text)",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          style={{
            background: "var(--color-drawer-bg)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--color-border)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                color: "var(--color-text)",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/917354177879?text=Hi!%20I%27d%20like%20to%20plan%20a%20trip%20with%20GangOfMusafirs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textAlign: "center" }}
          >
            Plan My Trip
          </a>
        </div>
      )}

    </header>
  );
}
