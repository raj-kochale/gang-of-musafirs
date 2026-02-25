"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 73541 77879",
    href: "tel:+917354177879",
    color: "#C05C3A",
  },
  {
    icon: Mail,
    label: "Email",
    value: "rpkochale@gmail.com",
    href: "mailto:rpkochale@gmail.com",
    color: "#F4845F",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat instantly",
    href: "https://wa.me/917354177879",
    color: "#25D366",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 1 hour",
    href: "#",
    color: "#7A9E7E",
  },
  {
    icon: MapPin,
    label: "Based In",
    value: "India 🇮🇳",
    href: "#",
    color: "#C05C3A",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
          paddingTop: "8rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container-custom">
          <div className="tag" style={{ marginBottom: "1rem", display: "inline-block" }}>
            ✉️ Get In Touch
          </div>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--color-text)",
              marginBottom: "1rem",
              lineHeight: 1.1,
            }}
          >
            Let&apos;s Plan Your{" "}
            <span className="gradient-text">Dream Trip</span>
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "1.05rem", maxWidth: "500px", lineHeight: 1.7 }}>
            Fill out the form below and we&apos;ll connect with you on WhatsApp within 1 hour. No spam, no pressure.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="section-padding">
        <div
          className="container-custom"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Form */}
          <div className="glass" style={{ borderRadius: "1.5rem", padding: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Inquiry Form
            </h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "2rem", fontSize: "0.875rem" }}>
              Tell us about your dream trip and we&apos;ll craft the perfect itinerary.
            </p>
            <InquiryForm />
          </div>

          {/* Contact Info Sidebar */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "var(--color-text)",
                marginBottom: "1.75rem",
              }}
            >
              Contact Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="glass"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.1rem 1.25rem",
                    borderRadius: "0.875rem",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,92,58,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "var(--color-card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {item.label}
                    </p>
                    <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "0.95rem", marginTop: "0.1rem" }}>
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick WhatsApp CTA */}
            <div
              style={{
                marginTop: "2rem",
                background: "linear-gradient(135deg, var(--color-primary-light), var(--color-surface))",
                border: "1px solid rgba(192,92,58,0.2)",
                borderRadius: "1rem",
                padding: "1.5rem",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>
                Prefer to chat directly?
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                Skip the form and reach us instantly on WhatsApp. Available 9 AM – 10 PM daily.
              </p>
              <a
                href="https://wa.me/917354177879?text=Hi%20GangOfMusafirs!%20I%27d%20like%20to%20plan%20a%20trip."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#25D366",
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(37,211,102,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <MessageCircle size={18} /> Open WhatsApp
              </a>
            </div>
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
        }
      `}</style>
    </>
  );
}
