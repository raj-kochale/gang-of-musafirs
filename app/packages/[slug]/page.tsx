"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { packages } from "@/lib/data";
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const pkg = packages.find((p) => p.slug === slug);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [activeImg, setActiveImg] = useState(0);
  const [showForm, setShowForm] = useState(false);

  if (!pkg) return notFound();

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          height: "55vh",
          minHeight: "380px",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pkg.gallery[activeImg]}
          alt={pkg.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, var(--color-bg) 0%, rgba(255,250,247,0.4) 60%, transparent 100%)",
          }}
        />
        {/* Text Overlay */}
        <div
          className="container-custom"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
          }}
        >
          <span className="tag" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
            {pkg.category}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            {pkg.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-muted)", fontSize: "0.9rem" }}>
              <MapPin size={15} color="var(--color-terracotta)" /> {pkg.destination}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-muted)", fontSize: "0.9rem" }}>
              <Clock size={15} color="var(--color-sage)" /> {pkg.duration}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-muted)", fontSize: "0.9rem" }}>
              <Users size={15} color="var(--color-sage)" /> {pkg.groupSize}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-terracotta)", fontSize: "0.9rem", fontWeight: 600 }}>
              <Star size={15} fill="var(--color-terracotta)" /> {pkg.rating} ({pkg.reviews} reviews)
            </span>
          </div>
        </div>
      </section>

      {/* ─── GALLERY THUMBNAILS ─── */}
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "1rem 0",
        }}
      >
        <div className="container-custom" style={{ display: "flex", gap: "0.75rem", overflowX: "auto" }}>
          {pkg.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{
                flexShrink: 0,
                width: "90px",
                height: "65px",
                borderRadius: "0.5rem",
                overflow: "hidden",
                border: activeImg === i ? "2px solid var(--color-terracotta)" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                transition: "border-color 0.2s ease",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="section-padding">
        <div
          className="container-custom"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            {/* Overview */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={sectionHeading}>Overview</h2>
              <p style={{ color: "var(--color-muted)", lineHeight: 1.8, fontSize: "0.975rem" }}>
                {pkg.overview}
              </p>

              {/* Highlights */}
              <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {pkg.highlights.map((h) => (
                  <span
                    key={h}
                    style={{
                      background: "rgba(192,92,58,0.08)",
                      border: "1px solid rgba(192,92,58,0.2)",
                      color: "var(--color-terracotta)",
                      borderRadius: "999px",
                      padding: "0.35rem 0.85rem",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Itinerary Accordion */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={sectionHeading}>Day-by-Day Itinerary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {pkg.itinerary.map((item, i) => (
                  <div
                    key={item.day}
                    className="glass"
                    style={{ overflow: "hidden", borderRadius: "0.875rem" }}
                  >
                    <button
                      id={`itinerary-day-${item.day}`}
                      onClick={() => setOpenDay(openDay === i ? null : i)}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1.1rem 1.25rem",
                        cursor: "pointer",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span
                          style={{
                            background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                            color: "white",
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderRadius: "999px",
                            padding: "0.2rem 0.75rem",
                            flexShrink: 0,
                          }}
                        >
                          Day {item.day}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 600,
                            fontSize: "0.975rem",
                            color: "var(--color-text)",
                            textAlign: "left",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                      {openDay === i ? (
                        <ChevronUp size={18} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
                      ) : (
                        <ChevronDown size={18} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
                      )}
                    </button>
                    {openDay === i && (
                      <div style={{ padding: "0 1.25rem 1.1rem", color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              <div style={{ background: "rgba(122,158,126,0.07)", border: "1px solid rgba(122,158,126,0.2)", borderRadius: "1rem", padding: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#a8c5ab",
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <CheckCircle size={17} /> Inclusions
                </h3>
                {pkg.inclusions.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", fontSize: "0.875rem", color: "var(--color-muted)" }}>
                    <span style={{ color: "var(--color-terracotta)", flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "1rem", padding: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#f87171",
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <XCircle size={17} /> Exclusions
                </h3>
                {pkg.exclusions.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", fontSize: "0.875rem", color: "var(--color-muted)" }}>
                    <span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Sticky Sidebar */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div
              className="glass"
              style={{ borderRadius: "1.25rem", padding: "1.75rem" }}
            >
              {/* Price */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>Starting from</span>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 900,
                    fontSize: "2.25rem",
                    background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    marginTop: "0.25rem",
                  }}
                >
                  {pkg.priceDisplay}
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 400,
                      WebkitTextFillColor: "var(--color-muted)",
                      color: "var(--color-muted)",
                    }}
                  >
                    {" "}/ person
                  </span>
                </div>
              </div>

              {/* Quick info */}
              {[
                { label: "Duration", value: pkg.duration },
                { label: "Group Size", value: pkg.groupSize },
                { label: "Destination", value: pkg.destination },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.7rem 0",
                    borderBottom: "1px solid var(--color-border)",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--color-muted)" }}>{row.label}</span>
                  <span style={{ color: "var(--color-text)", fontWeight: 600, textAlign: "right", maxWidth: "180px" }}>
                    {row.value}
                  </span>
                </div>
              ))}

              {/* CTA buttons */}
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button id="enquire-now-btn" className="btn-primary" style={{ justifyContent: "center" }} onClick={() => setShowForm((v) => !v)}>
                  {showForm ? "Hide Form" : "Enquire Now"}
                </button>
                <a
                  href={`https://wa.me/917354177879?text=Hi!%20I%27m%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.%20Please%20share%20more%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ justifyContent: "center", textAlign: "center" }}
                >
                  <MessageCircle size={16} fill="#25D366" color="#25D366" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Inline form */}
            {showForm && (
              <div
                className="glass"
                style={{ borderRadius: "1.25rem", padding: "1.75rem", marginTop: "1.25rem" }}
              >
                <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)", marginBottom: "1.25rem" }}>
                  Quick Inquiry
                </h3>
                <InquiryForm prefilledDestination={pkg.destination} />
              </div>
            )}
          </div>
        </div>
      </main>

      <a
        href="https://wa.me/917354177879"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} color="white" fill="white" />
      </a>
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          main > .container-custom {
            grid-template-columns: 1fr !important;
          }
          [style*="position: sticky"] {
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-outfit)",
  fontWeight: 800,
  fontSize: "1.4rem",
  color: "var(--color-text)",
  marginBottom: "1.25rem",
  paddingBottom: "0.75rem",
  borderBottom: "2px solid var(--color-border)",
};
