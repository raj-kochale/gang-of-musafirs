"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, ArrowRight, Star } from "lucide-react";
import { Package } from "@/lib/data";

type Props = {
  pkg: Package;
};

export default function PackageCard({ pkg }: Props) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        id={`package-card-${pkg.id}`}
        style={{
          background: "var(--color-card)",
          borderRadius: "1.25rem",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          transition: "all 0.35s ease",
          cursor: "pointer",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-hover-border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 40px var(--color-hover-shadow)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "220px",
            overflow: "hidden",
          }}
        >
          <Image
            src={pkg.coverImage}
            alt={pkg.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1)")
            }
          />
          {/* Overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 60%, rgba(255,255,255,0.1) 100%)",
            }}
          />
          {/* Category Tag */}
          <span
            className="tag"
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              background: "rgba(192,92,58,0.9)",
              color: "#fff",
              border: "none",
            }}
          >
            {pkg.category}
          </span>
          {/* Rating */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "var(--color-rating-bg)",
              backdropFilter: "blur(8px)",
              borderRadius: "999px",
              padding: "0.25rem 0.6rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Star size={12} fill="var(--color-sunset)" color="var(--color-sunset)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text)" }}>
              {pkg.rating}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "var(--color-text)",
              marginBottom: "0.375rem",
            }}
          >
            {pkg.name}
          </h3>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: "0.8rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <MapPin size={13} style={{ color: "var(--color-terracotta)" }} />
            {pkg.destination}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--color-muted)",
                fontSize: "0.8rem",
              }}
            >
              <Clock size={13} style={{ color: "var(--color-sage)" }} />
              {pkg.duration}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--color-muted)",
                fontSize: "0.8rem",
              }}
            >
              <Users size={13} style={{ color: "var(--color-sage)" }} />
              {pkg.groupSize}
            </span>
          </div>

          {/* Price Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}
              >
                Starting from
              </span>
              <div
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "1.375rem",
                  background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {pkg.priceDisplay}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    WebkitTextFillColor: "var(--color-muted)",
                  }}
                >
                  {" "}
                  / person
                </span>
              </div>
            </div>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={17} color="white" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
