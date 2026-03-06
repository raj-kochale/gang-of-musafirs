"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Loader2,
    MapPin,
    Clock,
    Users,
    CreditCard,
    Shield,
    CheckCircle,
    AlertTriangle,
    ArrowLeft,
    Calendar,
    User,
    Mail,
    Phone,
    MessageSquare,
} from "lucide-react";
import type { Package } from "@/lib/data";

/* ── Razorpay type for window ── */
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

export default function BookPage() {
    return (
        <Suspense>
            <BookContent />
        </Suspense>
    );
}

function BookContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams.get("package");

    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [error, setError] = useState("");

    /* ── Form state ── */
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        travelers: 1,
        travelDate: "",
        specialRequests: "",
    });

    const [travelerNames, setTravelerNames] = useState<string[]>([]);

    const set = (key: string, value: string | number) => {
        setForm((f) => {
            const next = { ...f, [key]: value };
            // Sync travelerNames array length when travelers count changes
            if (key === "travelers") {
                const count = Number(value);
                setTravelerNames((prev) => {
                    const arr = [...prev];
                    // Grow or shrink to (count - 1) since the lead booker is traveler #1
                    while (arr.length < count - 1) arr.push("");
                    return arr.slice(0, Math.max(0, count - 1));
                });
            }
            return next;
        });
    };

    /* ── Fetch package ── */
    const fetchPackage = useCallback(async () => {
        if (!slug) return;
        try {
            const res = await fetch("/api/packages");
            const data = await res.json();
            const found = data.packages?.find((p: Package) => p.slug === slug);
            if (found) setPkg(found);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPackage();
    }, [fetchPackage]);

    /* ── Load Razorpay script ── */
    useEffect(() => {
        if (document.getElementById("razorpay-script")) return;
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    /* ── Handle payment ── */
    const handlePay = async () => {
        if (!pkg) return;
        if (!form.fullName || !form.email || !form.phone || !form.travelDate) {
            setError("Please fill in all required fields");
            return;
        }

        // ── Client-side validation ──
        const nameClean = form.fullName.trim();
        if (nameClean.length < 2 || nameClean.length > 100) {
            setError("Name must be 2–100 characters."); return;
        }
        const phoneDigits = form.phone.replace(/[\s\-().]/g, "");
        if (!/^\+?\d{10,15}$/.test(phoneDigits)) {
            setError("Enter a valid 10-digit phone number."); return;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(form.email) || form.email.length > 254) {
            setError("Enter a valid email address."); return;
        }
        const travelD = new Date(form.travelDate);
        const today = new Date(); today.setHours(0,0,0,0);
        if (isNaN(travelD.getTime()) || travelD < today) {
            setError("Travel date must be today or in the future."); return;
        }
        if (form.travelers < 1 || form.travelers > 30) {
            setError("Travelers must be between 1 and 30."); return;
        }

        setError("");
        setPaying(true);

        try {
            // 1. Create order
            const res = await fetch("/api/bookings/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    travelerNames: travelerNames.filter((n) => n.trim()),
                    packageId: pkg.id || pkg.slug,
                    packageSlug: pkg.slug,
                    packageName: pkg.name,
                    pricePerPerson: pkg.price,
                }),
            });

            const orderData = await res.json();
            if (!res.ok) throw new Error(orderData.error);

            // 2. Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "GangOfMusafirs",
                description: `${pkg.name} – ${form.travelers} traveler(s)`,
                order_id: orderData.orderId,
                prefill: {
                    name: form.fullName,
                    email: form.email,
                    contact: form.phone,
                },
                theme: {
                    color: "#C05C3A",
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async (response: any) => {
                    // 3. Verify payment
                    try {
                        const verifyRes = await fetch("/api/bookings/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            setSuccess(true);
                            setBookingId(verifyData.bookingId);
                        } else {
                            setError(
                                verifyData.error || "Payment verification failed"
                            );
                        }
                    } catch {
                        setError("Payment verification failed. Contact support.");
                    }
                    setPaying(false);
                },
                modal: {
                    ondismiss: () => {
                        setPaying(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to initiate payment"
            );
            setPaying(false);
        }
    };

    const totalAmount = pkg ? pkg.price * form.travelers : 0;

    /* ── Loading state ── */
    if (!slug) {
        return (
            <>
                <Navbar />
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <AlertTriangle size={48} style={{ color: "var(--color-muted)" }} />
                    <p style={{ color: "var(--color-muted)" }}>
                        No package selected.
                    </p>
                    <Link href="/packages" className="btn-primary">
                        Browse Packages
                    </Link>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Loader2
                        size={36}
                        style={{
                            animation: "spin 1s linear infinite",
                            color: "var(--color-terracotta)",
                        }}
                    />
                </div>
            </>
        );
    }

    if (!pkg) {
        return (
            <>
                <Navbar />
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <AlertTriangle size={48} style={{ color: "var(--color-muted)" }} />
                    <p style={{ color: "var(--color-muted)" }}>
                        Package not found.
                    </p>
                    <Link href="/packages" className="btn-primary">
                        Browse Packages
                    </Link>
                </div>
            </>
        );
    }

    /* ── Success state ── */
    if (success) {
        return (
            <>
                <Navbar />
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                    }}
                >
                    <div
                        className="glass"
                        style={{
                            maxWidth: 520,
                            width: "100%",
                            padding: "3rem 2rem",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                background: "rgba(16,185,129,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.5rem",
                            }}
                        >
                            <CheckCircle size={36} style={{ color: "#10b981" }} />
                        </div>
                        <h1
                            style={{
                                fontFamily: "var(--font-outfit)",
                                fontSize: "1.75rem",
                                fontWeight: 800,
                                marginBottom: "0.5rem",
                            }}
                        >
                            Booking Confirmed! 🎉
                        </h1>
                        <p
                            style={{
                                color: "var(--color-muted)",
                                marginBottom: "1.5rem",
                                lineHeight: 1.6,
                            }}
                        >
                            Your booking for <strong>{pkg.name}</strong> has been
                            confirmed. A confirmation email has been sent to{" "}
                            <strong>{form.email}</strong>.
                        </p>

                        <div
                            style={{
                                background: "var(--color-surface)",
                                borderRadius: "0.75rem",
                                padding: "1rem 1.25rem",
                                marginBottom: "1.5rem",
                                textAlign: "left",
                            }}
                        >
                            <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--color-muted)" }}>Booking ID</span>
                                    <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>{bookingId}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--color-muted)" }}>Trip</span>
                                    <span style={{ fontWeight: 600 }}>{pkg.name}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--color-muted)" }}>Travelers</span>
                                    <span style={{ fontWeight: 600 }}>{form.travelers}</span>
                                </div>
                                {travelerNames.filter((n) => n.trim()).length > 0 && (
                                    <div style={{ paddingTop: "0.25rem" }}>
                                        <span style={{ color: "var(--color-muted)", fontSize: 13 }}>Traveler Names</span>
                                        <div style={{ fontSize: 13, fontWeight: 500, paddingLeft: 4, marginTop: 2 }}>
                                            <div>1. {form.fullName} (Lead)</div>
                                            {travelerNames.filter((n) => n.trim()).map((n, i) => (
                                                <div key={i}>{i + 2}. {n}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--color-muted)" }}>Total Paid</span>
                                    <span style={{ fontWeight: 700, color: "var(--color-terracotta)" }}>
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/" className="btn-primary">
                                Back to Home
                            </Link>
                            <a
                                href={`https://wa.me/91${process.env.NEXT_PUBLIC_WHATSAPP || "7354177879"}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    /* ── Checkout form ── */
    return (
        <>
            <Navbar />

            {/* Header */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
                    paddingTop: "clamp(5.5rem, 12vw, 7rem)",
                    paddingBottom: "2rem",
                }}
            >
                <div className="container-custom">
                    <Link
                        href={`/packages/${pkg.slug}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            color: "var(--color-muted)",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                            marginBottom: "1rem",
                        }}
                    >
                        <ArrowLeft size={14} /> Back to {pkg.name}
                    </Link>
                    <h1
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 900,
                            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                            color: "var(--color-text)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        Book Your Trip
                    </h1>
                    <p style={{ color: "var(--color-muted)", fontSize: "1rem" }}>
                        Secure your spot – pay online via UPI, cards, wallets or net banking.
                    </p>
                </div>
            </section>

            <main className="section-padding">
                <div
                    className="container-custom"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 380px",
                        gap: "2.5rem",
                        alignItems: "start",
                    }}
                >
                    {/* LEFT: Form */}
                    <div>
                        {error && (
                            <div
                                style={{
                                    background: "rgba(220,38,38,0.08)",
                                    border: "1px solid rgba(220,38,38,0.2)",
                                    borderRadius: "0.75rem",
                                    padding: "0.75rem 1rem",
                                    marginBottom: "1.25rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "0.9rem",
                                    color: "#dc2626",
                                }}
                            >
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="glass" style={{ padding: "2rem" }}>
                            <h2
                                style={{
                                    fontFamily: "var(--font-outfit)",
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    marginBottom: "1.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                <User size={20} style={{ color: "var(--color-terracotta)" }} />
                                Traveler Details
                            </h2>

                            <div style={{ display: "grid", gap: "1.25rem" }}>
                                {/* Name */}
                                <Field label="Full Name *" icon={<User size={15} />}>
                                    <input
                                        className="input-field"
                                        value={form.fullName}
                                        onChange={(e) => set("fullName", e.target.value)}
                                        placeholder="e.g. Raj Kochale"
                                        required
                                    />
                                </Field>

                                {/* Email + Phone */}
                                <div className="book-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <Field label="Email *" icon={<Mail size={15} />}>
                                        <input
                                            className="input-field"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => set("email", e.target.value)}
                                            placeholder="you@email.com"
                                            required
                                        />
                                    </Field>
                                    <Field label="Phone *" icon={<Phone size={15} />}>
                                        <input
                                            className="input-field"
                                            type="tel"
                                            pattern="[+]?[0-9\s\-]{10,15}"
                                            maxLength={15}
                                            title="Enter a valid 10-digit phone number"
                                            value={form.phone}
                                            onChange={(e) => set("phone", e.target.value)}
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </Field>
                                </div>

                                {/* Travelers + Date */}
                                <div className="book-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <Field label="No. of Travelers *" icon={<Users size={15} />}>
                                        <input
                                            className="input-field"
                                            type="number"
                                            min={1}
                                            max={30}
                                            value={form.travelers}
                                            onChange={(e) =>
                                                set(
                                                    "travelers",
                                                    Math.max(1, parseInt(e.target.value) || 1)
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Travel Date *" icon={<Calendar size={15} />}>
                                        <input
                                            className="input-field"
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            value={form.travelDate}
                                            onChange={(e) => set("travelDate", e.target.value)}
                                            required
                                        />
                                    </Field>
                                </div>

                                {/* Additional Traveler Names */}
                                {form.travelers > 1 && (
                                    <div style={{
                                        background: "var(--color-surface)",
                                        borderRadius: 12,
                                        padding: "1rem 1.25rem",
                                        border: "1px solid var(--color-border)",
                                    }}>
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "var(--color-terracotta)",
                                            marginBottom: "0.75rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                        }}>
                                            <Users size={14} />
                                            Additional Traveler Names
                                        </p>
                                        <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: "0.75rem" }}>
                                            {form.fullName || "Lead booker"} is Traveler #1. Please enter names for the remaining travelers.
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            {travelerNames.map((name, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span style={{ fontSize: 12, color: "var(--color-muted)", minWidth: 24 }}>#{i + 2}</span>
                                                    <input
                                                        className="input-field"
                                                        type="text"
                                                        placeholder={`Traveler ${i + 2} full name`}
                                                        value={name}
                                                        onChange={(e) => {
                                                            setTravelerNames((prev) => {
                                                                const arr = [...prev];
                                                                arr[i] = e.target.value;
                                                                return arr;
                                                            });
                                                        }}
                                                        style={{ flex: 1 }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Special Requests */}
                                <Field label="Special Requests" icon={<MessageSquare size={15} />}>
                                    <textarea
                                        className="input-field"
                                        rows={3}
                                        value={form.specialRequests}
                                        onChange={(e) => set("specialRequests", e.target.value)}
                                        placeholder="Dietary needs, room preferences, etc. (optional)"
                                        style={{ resize: "vertical" }}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div
                            style={{
                                display: "flex",
                                gap: "1.5rem",
                                marginTop: "1.5rem",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {[
                                { icon: Shield, text: "SSL Secured" },
                                { icon: CreditCard, text: "UPI / Cards / Wallets" },
                                { icon: CheckCircle, text: "Instant Confirmation" },
                            ].map(({ icon: Icon, text }) => (
                                <span
                                    key={text}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.35rem",
                                        fontSize: "0.8rem",
                                        color: "var(--color-muted)",
                                    }}
                                >
                                    <Icon size={14} style={{ color: "var(--color-sage)" }} />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div
                        className="glass"
                        style={{
                            padding: "1.75rem",
                            position: "sticky",
                            top: "5.5rem",
                        }}
                    >
                        {/* Package preview */}
                        <div
                            style={{
                                borderRadius: "0.75rem",
                                overflow: "hidden",
                                marginBottom: "1.25rem",
                                height: 160,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={pkg.coverImage}
                                alt={pkg.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>

                        <h3
                            style={{
                                fontFamily: "var(--font-outfit)",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                marginBottom: "0.25rem",
                            }}
                        >
                            {pkg.name}
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap",
                                fontSize: "0.8rem",
                                color: "var(--color-muted)",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <MapPin size={12} /> {pkg.destination}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Clock size={12} /> {pkg.duration}
                            </span>
                        </div>

                        <hr
                            style={{
                                border: "none",
                                borderTop: "1px solid var(--color-border)",
                                margin: "1rem 0",
                            }}
                        />

                        {/* Price breakdown */}
                        <div style={{ display: "grid", gap: "0.6rem", fontSize: "0.9rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--color-muted)" }}>
                                    Price per person
                                </span>
                                <span style={{ fontWeight: 600 }}>
                                    ₹{pkg.price.toLocaleString("en-IN")}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--color-muted)" }}>
                                    Travelers
                                </span>
                                <span style={{ fontWeight: 600 }}>× {form.travelers}</span>
                            </div>
                            <hr
                                style={{
                                    border: "none",
                                    borderTop: "1px dashed var(--color-border)",
                                }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                                    Total
                                </span>
                                <span
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "1.2rem",
                                        color: "var(--color-terracotta)",
                                    }}
                                >
                                    ₹{totalAmount.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Pay button */}
                        <button
                            onClick={handlePay}
                            disabled={paying}
                            className="btn-primary"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                marginTop: "1.5rem",
                                fontSize: "1rem",
                                padding: "0.875rem 2rem",
                                opacity: paying ? 0.7 : 1,
                            }}
                        >
                            {paying ? (
                                <>
                                    <Loader2
                                        size={18}
                                        style={{ animation: "spin 1s linear infinite" }}
                                    />
                                    Processing…
                                </>
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Pay ₹{totalAmount.toLocaleString("en-IN")}
                                </>
                            )}
                        </button>

                        <p
                            style={{
                                fontSize: "0.7rem",
                                color: "var(--color-muted)",
                                textAlign: "center",
                                marginTop: "0.75rem",
                                lineHeight: 1.5,
                            }}
                        >
                            Powered by Razorpay • 100% Secure Payment
                        </p>
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 900px) {
                    main > .container-custom {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 600px) {
                    .book-form-row {
                        grid-template-columns: 1fr !important;
                    }
                    main .glass {
                        padding: 1.25rem !important;
                    }
                }
            `}</style>
        </>
    );
}

/* ── Field wrapper ── */
function Field({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-muted)",
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                }}
            >
                {icon} {label}
            </label>
            {children}
        </div>
    );
}
