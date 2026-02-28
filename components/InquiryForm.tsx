"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "917354177879";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  travelers: string;
  budget: string;
  message: string;
};

const initialForm: FormData = {
  fullName: "",
  phone: "",
  email: "",
  destination: "",
  travelDate: "",
  travelers: "",
  budget: "",
  message: "",
};

type Props = {
  prefilledDestination?: string;
};

export default function InquiryForm({ prefilledDestination }: Props) {
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    destination: prefilledDestination || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ── Client-side validation ──
    const nameClean = form.fullName.trim();
    if (nameClean.length < 2 || nameClean.length > 100) {
      setError("Name must be 2–100 characters."); setLoading(false); return;
    }
    const phoneDigits = form.phone.replace(/[\s\-().]/g, "");
    if (!/^\+?\d{10,15}$/.test(phoneDigits)) {
      setError("Enter a valid 10-digit phone number."); setLoading(false); return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email) || form.email.length > 254) {
      setError("Enter a valid email address."); setLoading(false); return;
    }
    if (form.destination.trim().length < 2) {
      setError("Destination is required."); setLoading(false); return;
    }
    const travelD = new Date(form.travelDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (isNaN(travelD.getTime()) || travelD < today) {
      setError("Travel date must be today or in the future."); setLoading(false); return;
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);

      // WhatsApp redirect
      const msg = encodeURIComponent(
        `Hi GangOfMusafirs! 🌍\n\nI'd like to inquire about a trip:\n\n*Name:* ${form.fullName}\n*Phone:* ${form.phone}\n*Destination:* ${form.destination}\n*Travel Date:* ${form.travelDate}\n*Travelers:* ${form.travelers}\n*Budget:* ${form.budget}\n\n${form.message}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <CheckCircle size={64} color="var(--color-terracotta)" />
        <h3
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--color-text)",
          }}
        >
          Inquiry Sent! 🎉
        </h3>
        <p style={{ color: "var(--color-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
          We&apos;ve received your inquiry. We&apos;re now opening WhatsApp so
          you can connect with us instantly. Our team will respond within 1 hour!
        </p>
        <button
          onClick={() => { setSuccess(false); setForm(initialForm); }}
          className="btn-secondary"
          style={{ marginTop: "0.5rem" }}
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Name & Phone */}
      <div className="inquiry-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            id="form-fullname"
            name="fullName"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="Rahul Sharma"
            className="input-field"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={labelStyle}>Phone Number *</label>
          <input
            id="form-phone"
            name="phone"
            type="tel"
            required
            pattern="[+]?[0-9\s\-]{10,15}"
            maxLength={15}
            title="Enter a valid 10-digit phone number"
            placeholder="+91 98765 43210"
            className="input-field"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Email & Destination */}
      <div className="inquiry-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            id="form-email"
            name="email"
            type="email"
            required
            placeholder="rahul@email.com"
            className="input-field"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={labelStyle}>Destination *</label>
          <input
            id="form-destination"
            name="destination"
            type="text"
            required
            minLength={2}
            maxLength={200}
            placeholder="Manali, Goa, Rajasthan..."
            className="input-field"
            value={form.destination}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Date & Travelers */}
      <div className="inquiry-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Preferred Travel Date *</label>
          <input
            id="form-date"
            name="travelDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="input-field"
            value={form.travelDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={labelStyle}>Number of Travelers *</label>
          <select
            id="form-travelers"
            name="travelers"
            required
            className="input-field"
            value={form.travelers}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>1–2 people</option>
            <option>3–5 people</option>
            <option>6–10 people</option>
            <option>11–20 people</option>
            <option>20+ people</option>
          </select>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label style={labelStyle}>Budget Range (per person)</label>
        <select
          id="form-budget"
          name="budget"
          className="input-field"
          value={form.budget}
          onChange={handleChange}
        >
          <option value="">Select budget range</option>
          <option>Under ₹5,000</option>
          <option>₹5,000 – ₹10,000</option>
          <option>₹10,000 – ₹20,000</option>
          <option>₹20,000 – ₹50,000</option>
          <option>₹50,000+</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>Additional Message</label>
        <textarea
          id="form-message"
          name="message"
          rows={4}
          placeholder="Tell us more about your dream trip — type of experiences, special requirements, etc."
          className="input-field"
          value={form.message}
          onChange={handleChange}
          style={{ resize: "none", lineHeight: 1.6 }}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: "#F87171", fontSize: "0.85rem" }}>{error}</p>
      )}

      <button
        id="form-submit"
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ justifyContent: "center", fontSize: "1rem", padding: "0.875rem 2rem" }}
      >
        {loading ? (
          <>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit & Connect on WhatsApp
          </>
        )}
      </button>

      <p style={{ color: "var(--color-muted)", fontSize: "0.78rem", textAlign: "center" }}>
        ✅ We respond within 1 hour · No spam, ever
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .inquiry-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--color-muted)",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
