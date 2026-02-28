"use client";

import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { packages as staticPackages } from "@/lib/data";
import type { Package } from "@/lib/data";
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  ZoomIn,
  Calendar,
  Shield,
} from "lucide-react";

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const staticMatch = staticPackages.find((p) => p.slug === slug);
  const [pkg, setPkg] = useState<Package | undefined>(staticMatch);
  const [loading, setLoading] = useState(!staticMatch);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [activeImg, setActiveImg] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "details">("overview");

  const fetchPackage = useCallback(async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      if (data.packages?.length > 0) {
        const found = data.packages.find((p: Package) => p.slug === slug);
        if (found) setPkg(found);
      }
    } catch {
      // keep static fallback
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchPackage(); }, [fetchPackage]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--color-muted)", fontSize: "1.1rem" }}>Loading trip details…</p>
        </div>
      </>
    );
  }

  if (!pkg) return notFound();

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "itinerary" as const, label: "Itinerary" },
    { key: "details" as const, label: "Details" },
  ];

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          maxHeight: "550px",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pkg.gallery[activeImg]}
          alt={pkg.name}
          onClick={() => setLightbox(activeImg)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.5s ease",
            cursor: "zoom-in",
            filter: "brightness(0.75)",
          }}
        />
        {/* Dark gradient overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(activeImg)}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: 40,
            height: 40,
            borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            zIndex: 5,
            transition: "all 0.2s",
          }}
          aria-label="View gallery"
        >
          <ZoomIn size={18} />
        </button>

        {/* Hero Text — always white for clarity on dark overlay */}
        <div
          className="container-custom"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "999px",
              padding: "0.25rem 0.75rem",
              marginBottom: "0.75rem",
              backdropFilter: "blur(4px)",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            {pkg.category}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "#fff",
              marginBottom: "0.75rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            {pkg.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
            {[
              { icon: <MapPin size={15} />, text: pkg.destination },
              { icon: <Clock size={15} />, text: pkg.duration },
              { icon: <Users size={15} />, text: pkg.groupSize },
              { icon: <Star size={15} fill="#fff" />, text: `${pkg.rating} (${pkg.reviews} reviews)` },
            ].map((item, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY THUMBNAILS ─── */}
      <div
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0.875rem 0",
        }}
      >
        <div className="container-custom" style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {pkg.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => { setActiveImg(i); }}
              style={{
                flexShrink: 0,
                width: "80px",
                height: "56px",
                borderRadius: "0.5rem",
                overflow: "hidden",
                border: activeImg === i ? "2px solid var(--color-terracotta)" : "2px solid var(--color-border)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s ease",
                opacity: activeImg === i ? 1 : 0.6,
                background: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      {/* ─── NAVIGATION TABS ─── */}
      <div
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: "64px",
          zIndex: 40,
        }}
      >
        <div className="container-custom" style={{ display: "flex", gap: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.key ? "2px solid var(--color-terracotta)" : "2px solid transparent",
                color: activeTab === tab.key ? "var(--color-terracotta)" : "var(--color-muted)",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0.875rem 1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ padding: "2.5rem 0 4rem" }}>
        <div
          className="container-custom pkg-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div style={{ animation: "pkgFadeIn 0.3s ease" }}>
                {/* Overview text */}
                <p style={{ color: "var(--color-muted)", lineHeight: 1.85, fontSize: "0.975rem", marginBottom: "1.75rem" }}>
                  {pkg.overview}
                </p>

                {/* Highlights */}
                <h3 style={{ ...sectionLabel, marginBottom: "1rem" }}>Trip Highlights</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
                  {pkg.highlights.map((h) => (
                    <span
                      key={h}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        borderRadius: "0.5rem",
                        padding: "0.4rem 0.85rem",
                        fontSize: "0.825rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span style={{ color: "var(--color-terracotta)" }}>✓</span> {h}
                    </span>
                  ))}
                </div>

                {/* Quick stats row */}
                <div
                  className="pkg-quick-stats"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  {[
                    { icon: <Calendar size={20} style={{ color: "var(--color-terracotta)" }} />, label: "Duration", value: pkg.duration },
                    { icon: <Users size={20} style={{ color: "var(--color-terracotta)" }} />, label: "Group Size", value: pkg.groupSize },
                    { icon: <Shield size={20} style={{ color: "var(--color-terracotta)" }} />, label: "Rating", value: `${pkg.rating}★ (${pkg.reviews})` },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.875rem",
                        padding: "1.25rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{stat.label}</div>
                      <div style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "0.925rem", color: "var(--color-text)" }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ITINERARY TAB ── */}
            {activeTab === "itinerary" && (
              <div style={{ animation: "pkgFadeIn 0.3s ease" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {pkg.itinerary.map((item, i) => (
                    <div
                      key={item.day}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        overflow: "hidden",
                        borderRadius: "0.875rem",
                        transition: "border-color 0.2s",
                        ...(openDay === i ? { borderColor: "var(--color-terracotta)" } : {}),
                      }}
                    >
                      <button
                        onClick={() => setOpenDay(openDay === i ? null : i)}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1rem 1.25rem",
                          cursor: "pointer",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <span
                            style={{
                              background: openDay === i
                                ? "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))"
                                : "var(--color-border)",
                              color: openDay === i ? "white" : "var(--color-muted)",
                              fontFamily: "var(--font-outfit)",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              borderRadius: "0.5rem",
                              padding: "0.3rem 0.7rem",
                              flexShrink: 0,
                              minWidth: "50px",
                              textAlign: "center",
                              transition: "all 0.2s",
                            }}
                          >
                            Day {item.day}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-outfit)",
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              color: "var(--color-text)",
                              textAlign: "left",
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                        {openDay === i ? (
                          <ChevronUp size={18} style={{ color: "var(--color-terracotta)", flexShrink: 0 }} />
                        ) : (
                          <ChevronDown size={18} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
                        )}
                      </button>
                      {openDay === i && (
                        <div
                          style={{
                            padding: "0 1.25rem 1.1rem 4.25rem",
                            color: "var(--color-muted)",
                            fontSize: "0.9rem",
                            lineHeight: 1.75,
                            borderTop: "1px solid var(--color-border)",
                            paddingTop: "0.875rem",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DETAILS TAB (Inclusions / Exclusions) ── */}
            {activeTab === "details" && (
              <div style={{ animation: "pkgFadeIn 0.3s ease" }}>
                <div
                  className="incl-excl-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                  }}
                >
                  {/* Inclusions */}
                  <div
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.875rem",
                      padding: "1.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--color-sage)",
                        marginBottom: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <CheckCircle size={17} /> What&apos;s Included
                    </h3>
                    {pkg.inclusions.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          gap: "0.6rem",
                          marginBottom: "0.75rem",
                          fontSize: "0.85rem",
                          color: "var(--color-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: "var(--color-sage)", flexShrink: 0, fontWeight: 600 }}>✓</span>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Exclusions */}
                  <div
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.875rem",
                      padding: "1.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--color-muted)",
                        marginBottom: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <XCircle size={17} /> Not Included
                    </h3>
                    {pkg.exclusions.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          gap: "0.6rem",
                          marginBottom: "0.75rem",
                          fontSize: "0.85rem",
                          color: "var(--color-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: "var(--color-muted)", flexShrink: 0 }}>✕</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN – Sticky Booking Sidebar */}
          <div style={{ position: "sticky", top: "120px" }}>
            <div
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 2px 12px var(--color-card-shadow)",
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ color: "var(--color-muted)", fontSize: "0.775rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Starting from</span>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "var(--color-terracotta)",
                    lineHeight: 1.2,
                    marginTop: "0.2rem",
                  }}
                >
                  {pkg.priceDisplay}
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 400,
                      color: "var(--color-muted)",
                    }}
                  >
                    {" "}/ person
                  </span>
                </div>
              </div>

              {/* Quick info rows */}
              {[
                { label: "Duration", value: pkg.duration },
                { label: "Group Size", value: pkg.groupSize },
                { label: "Destination", value: pkg.destination },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.6rem 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--color-muted)" }}>{row.label}</span>
                  <span style={{ color: "var(--color-text)", fontWeight: 600, textAlign: "right", maxWidth: "180px" }}>
                    {row.value}
                  </span>
                </div>
              ))}

              {/* CTA buttons */}
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <Link
                  href={`/book?package=${pkg.slug}`}
                  className="btn-primary"
                  style={{ justifyContent: "center", textAlign: "center", textDecoration: "none" }}
                >
                  Book Now – ₹{pkg.price.toLocaleString("en-IN")}/person
                </Link>
                <button
                  className="btn-secondary"
                  style={{ justifyContent: "center" }}
                  onClick={() => setShowForm((v) => !v)}
                >
                  {showForm ? "Hide Form" : "Enquire Now"}
                </button>
                <a
                  href={`https://wa.me/917354177879?text=Hi!%20I%27m%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.%20Please%20share%20more%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "1px solid var(--color-border)",
                    borderRadius: "999px",
                    padding: "0.65rem 1rem",
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#25D366",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  <MessageCircle size={16} fill="#25D366" color="#25D366" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Inline inquiry form */}
            {showForm && (
              <div
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  marginTop: "1rem",
                  boxShadow: "0 2px 12px var(--color-card-shadow)",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)", marginBottom: "1rem" }}>
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

      {/* ─── LIGHTBOX POPUP ─── */}
      {lightbox !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "lbFadeIn 0.25s ease-out",
          }}
          onClick={() => setLightbox(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: 42,
              height: 42,
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              zIndex: 10,
              transition: "background 0.2s",
            }}
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            {lightbox + 1} / {pkg.gallery.length}
          </div>

          {/* Prev button */}
          {pkg.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + pkg.gallery.length) % pkg.gallery.length);
              }}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transition: "background 0.2s",
                zIndex: 10,
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next button */}
          {pkg.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % pkg.gallery.length);
              }}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transition: "background 0.2s",
                zIndex: 10,
              }}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Main image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pkg.gallery[lightbox]}
            alt={`${pkg.name} - Image ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "0.75rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: "lbZoomIn 0.3s ease-out",
            }}
          />

          {/* Bottom thumbnails */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              gap: "0.4rem",
              marginTop: "1rem",
              overflowX: "auto",
              maxWidth: "90vw",
              padding: "0.25rem",
            }}
          >
            {pkg.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                style={{
                  flexShrink: 0,
                  width: 60,
                  height: 44,
                  borderRadius: "0.4rem",
                  overflow: "hidden",
                  border: lightbox === i ? "2px solid #fff" : "2px solid transparent",
                  opacity: lightbox === i ? 1 : 0.45,
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s ease",
                  background: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbZoomIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pkgFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) {
          .pkg-layout {
            grid-template-columns: 1fr !important;
          }
          .pkg-layout > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .incl-excl-grid {
            grid-template-columns: 1fr !important;
          }
          .pkg-quick-stats {
            grid-template-columns: 1fr !important;
          }
          section[style*="height: 60vh"] {
            height: 45vh !important;
            min-height: 300px !important;
          }
        }
      `}</style>
    </>
  );
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-outfit)",
  fontWeight: 700,
  fontSize: "0.85rem",
  color: "var(--color-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
