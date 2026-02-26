"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { packages as staticPackages } from "@/lib/data";
import type { Package } from "@/lib/data";
import { MessageCircle } from "lucide-react";

const CATEGORIES = ["All", "Hill Stations", "Beaches", "Adventure", "Cultural", "Custom"];

function PackagesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [active, setActive] = useState(initialCat);
  const [packages, setPackages] = useState<Package[]>(staticPackages);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      if (data.packages?.length > 0) setPackages(data.packages);
    } catch {
      // keep static fallback
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? packages
        : packages.filter((p) => p.category === active),
    [active, packages]
  );

  return (
    <>
      {/* Category Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
            onClick={() => setActive(cat)}
            className={`filter-tab ${active === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-muted)" }}>
          <p style={{ fontSize: "1.1rem" }}>No packages found for this category yet.</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
            Drop us a WhatsApp and we&apos;ll create a custom trip for you!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </>
  );
}

export default function PackagesPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
          paddingTop: "8rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container-custom">
          <div className="tag" style={{ marginBottom: "1rem", display: "inline-block" }}>
            🗺️ All Destinations
          </div>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--color-text)",
              marginBottom: "1rem",
            }}
          >
            Explore Our{" "}
            <span className="gradient-text">Travel Packages</span>
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "1.05rem", maxWidth: "560px", lineHeight: 1.7 }}>
            Curated group adventures for every kind of traveler. Filter by your travel vibe and find your perfect trip.
          </p>
        </div>
      </section>

      {/* Package List */}
      <main className="section-padding">
        <div className="container-custom">
          <Suspense fallback={<div style={{ color: "var(--color-muted)" }}>Loading packages...</div>}>
            <PackagesContent />
          </Suspense>
        </div>
      </main>

      {/* Custom Trip CTA */}
      <section
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          padding: "4rem 0",
        }}
      >
        <div className="container-custom" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              color: "var(--color-text)",
              marginBottom: "1rem",
            }}
          >
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p style={{ color: "var(--color-muted)", marginBottom: "2rem", maxWidth: "440px", margin: "0 auto 2rem" }}>
            We build fully custom trips too. Tell us your dream destination, dates, and budget — we&apos;ll handle it all.
          </p>
          <a
            href="https://wa.me/917354177879?text=Hi!%20I%20want%20to%20plan%20a%20custom%20trip%20with%20GangOfMusafirs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: "1.05rem" }}
          >
            <MessageCircle size={18} /> Request Custom Trip
          </a>
        </div>
      </section>

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
    </>
  );
}
