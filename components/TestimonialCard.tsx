"use client";

import { Star, Quote } from "lucide-react";

type Props = {
  name: string;
  avatar: string;
  trip: string;
  quote: string;
  rating: number;
  location: string;
};

export default function TestimonialCard({ name, avatar, trip, quote, rating, location }: Props) {
  return (
    <div
      className="glass"
      style={{
        padding: "1.75rem",
        minWidth: "320px",
        maxWidth: "360px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
      }
    >
      {/* Quote Icon */}
      <Quote size={24} style={{ color: "var(--color-terracotta)", opacity: 0.6 }} />

      {/* Rating Stars */}
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={14} fill="var(--color-sunset)" color="var(--color-sunset)" />
        ))}
      </div>

      {/* Quote text */}
      <p
        style={{
          color: "var(--color-text)",
          fontSize: "0.9rem",
          lineHeight: 1.75,
          fontStyle: "italic",
          flex: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Trip tag */}
      <span className="tag" style={{ alignSelf: "flex-start" }}>
        {trip}
      </span>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={name}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "2px solid var(--color-terracotta)",
            objectFit: "cover",
            background: "var(--color-card)",
          }}
        />
        <div>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "var(--color-text)",
            }}
          >
            {name}
          </p>
          <p style={{ color: "var(--color-muted)", fontSize: "0.775rem" }}>
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}
