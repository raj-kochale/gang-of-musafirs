"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Youtube, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "All Packages", href: "/packages" },
  { label: "Hill Stations", href: "/packages?category=Hill+Stations" },
  { label: "Beaches", href: "/packages?category=Beaches" },
  { label: "Adventure Trips", href: "/packages?category=Adventure" },
  { label: "Cultural Tours", href: "/packages?category=Cultural" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/gang.of.musafirs?igsh=azUxcnNwb3dycnh1",
    color: "#E1306C",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/917354177879",
    color: "#25D366",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com",
    color: "#FF0000",
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="container-custom">
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Column */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 800,
                fontSize: "1.5rem",
                background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              GangOfMusafirs
            </span>
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              Curated travel experiences built for true musafirs. We turn your
              dream destinations into real memories.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-muted)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = s.color;
                    (e.currentTarget as HTMLElement).style.borderColor = s.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--color-text)",
                marginBottom: "1.25rem",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: "var(--color-muted)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--color-terracotta)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--color-muted)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--color-text)",
                marginBottom: "1.25rem",
              }}
            >
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: Phone, text: "+91 73541 77879", href: "tel:+917354177879" },
                { icon: Mail, text: "rpkochale@gmail.com", href: "mailto:rpkochale@gmail.com" },
                { icon: MapPin, text: "India", href: "#" },
              ].map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "var(--color-muted)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")
                  }
                >
                  <item.icon size={16} style={{ color: "var(--color-terracotta)", flexShrink: 0 }} />
                  {item.text}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: "2rem" }}>
              <p style={{ color: "var(--color-muted)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                Get drop-everything travel deals & trip inspo:
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field"
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1rem", borderRadius: "0.5rem" }}
                />
                <button
                  className="btn-primary"
                  style={{ padding: "0.6rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} GangOfMusafirs. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "var(--color-muted)",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-muted)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
