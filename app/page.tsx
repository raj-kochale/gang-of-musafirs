"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Mountain,
  Waves,
  Zap,
  Globe2,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import TestimonialCard from "@/components/TestimonialCard";
import ScrollReveal from "@/components/ScrollReveal";
import { packages as staticPackages, testimonials, stats, whyUs } from "@/lib/data";
import type { Package } from "@/lib/data";

export default function HomePage() {
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

  const featured = packages.slice(0, 4);

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
        }}
      >
        {/* Background decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(192,92,58,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(122,158,126,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container-custom"
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "clamp(5.5rem, 12vw, 8rem)",
            paddingBottom: "clamp(3rem, 8vw, 6rem)",
          }}
        >
          <div style={{ maxWidth: "780px" }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="tag"
                style={{
                  marginBottom: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>🏔️</span> India&apos;s Most Loved Travel Community
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                lineHeight: 1.05,
                color: "var(--color-text)",
                marginBottom: "1.5rem",
              }}
            >
              Skip the Tourist Traps.{" "}
              <span className="gradient-text">Experience Real India.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{
                color: "var(--color-muted)",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "600px",
              }}
            >
              We design curated group adventures across India — from Himalayan
              peaks to tropical coastlines. Expert-planned, stress-free, and
              built for people who live to explore.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "3.5rem",
              }}
            >
              <Link
                href="/packages"
                className="btn-primary"
                style={{ fontSize: "1.05rem", padding: "0.9rem 2rem" }}
              >
                Explore Packages <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/917354177879?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20GangOfMusafirs%20trips"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: "1.05rem", padding: "0.9rem 2rem" }}
              >
                <MessageCircle size={18} fill="#25D366" color="#25D366" />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Micro social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div style={{ display: "flex" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "2px solid var(--color-bg)",
                      marginLeft: n > 1 ? "-12px" : "0",
                      overflow: "hidden",
                      background: "var(--color-card)",
                    }}
                  >
                    <Image
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=traveler${n}`}
                      alt="traveler"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--color-text)",
                  }}
                >
                  2,000+ Happy Travelers
                </div>
                <div
                  style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}
                >
                  ⭐⭐⭐⭐⭐ 4.9/5 average rating
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating destination pills */}
        <div
          style={{
            position: "absolute",
            right: "5%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            zIndex: 2,
          }}
          className="hidden-mobile"
        >
          {[
            { icon: "🏔️", name: "Manali" },
            { icon: "🏖️", name: "Goa" },
            { icon: "🏰", name: "Rajasthan" },
            { icon: "🌊", name: "Rishikesh" },
            { icon: "☕", name: "Coorg" },
          ].map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
              className="glass"
              style={{
                padding: "0.6rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{d.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "var(--color-text)",
                }}
              >
                {d.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0",
        }}
      >
        <div
          className="container-custom"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 45%), 1fr))",
            gap: "1.25rem",
          }}
        >
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 900,
                    fontSize: "2.25rem",
                    background:
                      "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PACKAGES ─── */}
      <section id="packages" className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "3rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div className="divider" />
                <h2
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 800,
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    color: "var(--color-text)",
                    lineHeight: 1.2,
                  }}
                >
                  Featured Packages
                </h2>
                <p
                  style={{
                    color: "var(--color-muted)",
                    marginTop: "0.75rem",
                    fontSize: "1rem",
                  }}
                >
                  Handpicked adventures, crafted for unforgettable memories
                </p>
              </div>
              <Link
                href="/packages"
                className="btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            {featured.map((pkg, i) => (
              <ScrollReveal key={pkg.id} delay={i * 0.1}>
                <PackageCard pkg={pkg} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section
        style={{
          background: "var(--color-surface)",
          padding: "5rem 0",
        }}
      >
        <div className="container-custom">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div
                className="divider"
                style={{ margin: "0 auto 1.5rem" }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--color-text)",
                }}
              >
                Travel by Vibe
              </h2>
              <p
                style={{ color: "var(--color-muted)", marginTop: "0.75rem" }}
              >
                Every traveler is different. Find your perfect type of escape.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: Mountain,
                label: "Hill Stations",
                emoji: "🏔️",
                desc: "Himalayas, Western Ghats & more",
                slug: "Hill+Stations",
              },
              {
                icon: Waves,
                label: "Beaches",
                emoji: "🏖️",
                desc: "Goa, Kerala, Andamans & more",
                slug: "Beaches",
              },
              {
                icon: Zap,
                label: "Adventure",
                emoji: "⚡",
                desc: "Rafting, Trekking, Bungee & more",
                slug: "Adventure",
              },
              {
                icon: Globe2,
                label: "Cultural",
                emoji: "🏰",
                desc: "Rajasthan, Varanasi & Heritage sites",
                slug: "Cultural",
              },
            ].map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.1}>
                <Link
                  href={`/packages?category=${cat.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="glass hover-lift"
                    style={{
                      padding: "1.75rem 1.5rem",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2.5rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {cat.emoji}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "var(--color-text)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {cat.label}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-muted)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / WHY US ─── */}
      <section id="about" className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div
                className="divider"
                style={{ margin: "0 auto 1.5rem" }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--color-text)",
                }}
              >
                Why Musafirs Choose Us
              </h2>
              <p
                style={{
                  color: "var(--color-muted)",
                  marginTop: "0.75rem",
                  maxWidth: "520px",
                  margin: "0.75rem auto 0",
                }}
              >
                We&apos;re more than a travel agency — we&apos;re your trip
                companions, planning every detail so you can just show up and
                soak it all in.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            {whyUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div
                  className="glass hover-lift"
                  style={{ padding: "1.75rem" }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "var(--color-text)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-muted)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        style={{
          background: "var(--color-surface)",
          padding: "5rem 0",
        }}
      >
        <div className="container-custom">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div
                className="divider"
                style={{ margin: "0 auto 1.5rem" }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--color-text)",
                }}
              >
                How It Works
              </h2>
              <p
                style={{ color: "var(--color-muted)", marginTop: "0.75rem" }}
              >
                Start your adventure in 3 simple steps
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                step: "01",
                title: "Browse Packages",
                desc: "Explore our handpicked destinations. Filter by type of experience — hills, beach, adventure, or culture.",
                emoji: "🔍",
              },
              {
                step: "02",
                title: "Submit Enquiry",
                desc: "Fill out the quick form or drop us a WhatsApp message. We respond within 1 hour.",
                emoji: "📝",
              },
              {
                step: "03",
                title: "Pack & Travel",
                desc: "We handle hotels, transport, activities, food. You just pack and show up ready for the adventure.",
                emoji: "🎒",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(192,92,58,0.1), rgba(244,132,95,0.06))",
                      border: "1px solid rgba(192,92,58,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.25rem",
                      fontSize: "2rem",
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      letterSpacing: "0.15em",
                      color: "var(--color-terracotta)",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {item.step}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "var(--color-text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-muted)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="section-padding">
        <div className="container-custom" style={{ overflow: "hidden" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div
                className="divider"
                style={{ margin: "0 auto 1.5rem" }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--color-text)",
                }}
              >
                What Travelers Say
              </h2>
              <p
                style={{ color: "var(--color-muted)", marginTop: "0.75rem" }}
              >
                Real stories from real musafirs 🧳
              </p>
            </div>
          </ScrollReveal>

          <div
            className="scroll-x"
            style={{
              display: "flex",
              gap: "1.25rem",
              paddingBottom: "1.5rem",
            }}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--color-terracotta) 0%, var(--color-sunset) 100%)",
          padding: "5rem 0",
        }}
      >
        <div className="container-custom" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <h2
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "white",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              Stop saving travel reels.
              <br />
              Actually go.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "1.1rem",
                marginBottom: "2.5rem",
                maxWidth: "480px",
                margin: "0 auto 2.5rem",
                lineHeight: 1.7,
              }}
            >
              Your next great story is waiting. Let&apos;s plan it together —
              one WhatsApp message away.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "white",
                  color: "var(--color-terracotta)",
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  padding: "0.9rem 2rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                Plan My Trip <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/917354177879"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  padding: "0.9rem 2rem",
                  borderRadius: "999px",
                  border: "2px solid rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(8px)",
                }}
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FLOATING WHATSAPP ─── */}
      <a
        href="https://wa.me/917354177879?text=Hi%20GangOfMusafirs!%20I%27d%20like%20to%20plan%20a%20trip."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} color="white" fill="white" />
      </a>

      <Footer />
    </>
  );
}
