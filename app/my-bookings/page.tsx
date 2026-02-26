"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Loader2,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Users,
    Calendar,
    MapPin,
    ArrowRight,
    AlertTriangle,
    Package,
} from "lucide-react";

type Booking = {
    _id: string;
    fullName: string;
    email: string;
    travelers: number;
    travelDate: string;
    packageName: string;
    packageSlug: string;
    pricePerPerson: number;
    totalAmount: number;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    paymentStatus: "created" | "paid" | "failed" | "refunded";
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
};

const BADGE: Record<string, { bg: string; color: string }> = {
    confirmed: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
    paid: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    created: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    cancelled: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
    failed: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
    refunded: { bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
};

export default function MyBookingsPage() {
    const [email, setEmail] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchBookings = useCallback(async (e: string) => {
        if (!e) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/bookings?email=${encodeURIComponent(e)}`);
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        if (email.trim()) {
            setSearchEmail(email.trim());
            fetchBookings(email.trim());
        }
    };

    return (
        <>
            <Navbar />

            {/* Header */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
                    paddingTop: "7rem",
                    paddingBottom: "2.5rem",
                }}
            >
                <div className="container-custom" style={{ maxWidth: 700 }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 900,
                            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        My Bookings
                    </h1>
                    <p style={{ color: "var(--color-muted)" }}>
                        Enter the email you used while booking to view your trips.
                    </p>
                </div>
            </section>

            <main className="section-padding">
                <div className="container-custom" style={{ maxWidth: 700 }}>
                    {/* Email search */}
                    <form
                        onSubmit={handleSubmit}
                        className="glass"
                        style={{
                            display: "flex",
                            gap: "0.75rem",
                            padding: "1rem 1.25rem",
                            marginBottom: "2rem",
                            alignItems: "center",
                        }}
                    >
                        <input
                            className="input-field"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ flex: 1, margin: 0 }}
                        />
                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ whiteSpace: "nowrap", padding: "0.6rem 1.25rem" }}
                        >
                            {loading ? (
                                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <>
                                    <ArrowRight size={16} /> View
                                </>
                            )}
                        </button>
                    </form>

                    {/* Results */}
                    {loading && (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <Loader2
                                size={28}
                                style={{
                                    animation: "spin 1s linear infinite",
                                    color: "var(--color-terracotta)",
                                }}
                            />
                        </div>
                    )}

                    {!loading && searched && bookings.length === 0 && (
                        <div
                            className="glass"
                            style={{
                                textAlign: "center",
                                padding: "3rem 1.5rem",
                            }}
                        >
                            <AlertTriangle
                                size={36}
                                style={{
                                    color: "var(--color-muted)",
                                    opacity: 0.5,
                                    marginBottom: "0.75rem",
                                }}
                            />
                            <p style={{ color: "var(--color-muted)", marginBottom: "1rem" }}>
                                No bookings found for <strong>{searchEmail}</strong>.
                            </p>
                            <Link href="/packages" className="btn-primary">
                                <Package size={16} /> Browse Packages
                            </Link>
                        </div>
                    )}

                    {!loading && bookings.length > 0 && (
                        <div style={{ display: "grid", gap: "1.25rem" }}>
                            {bookings.map((b) => {
                                const badge = BADGE[b.status] || BADGE.pending;
                                const payBadge = BADGE[b.paymentStatus] || BADGE.created;
                                return (
                                    <div
                                        key={b._id}
                                        className="glass"
                                        style={{ padding: "1.5rem" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "start",
                                                flexWrap: "wrap",
                                                gap: "0.5rem",
                                                marginBottom: "0.75rem",
                                            }}
                                        >
                                            <Link
                                                href={`/packages/${b.packageSlug}`}
                                                style={{
                                                    fontFamily: "var(--font-outfit)",
                                                    fontWeight: 700,
                                                    fontSize: "1.05rem",
                                                    textDecoration: "none",
                                                    color: "var(--color-text)",
                                                }}
                                            >
                                                {b.packageName}
                                            </Link>
                                            <div style={{ display: "flex", gap: "0.35rem" }}>
                                                <span
                                                    style={{
                                                        ..._badge(badge),
                                                    }}
                                                >
                                                    {b.status === "confirmed" && <CheckCircle size={10} />}
                                                    {b.status === "pending" && <Clock size={10} />}
                                                    {b.status === "cancelled" && <XCircle size={10} />}
                                                    {b.status}
                                                </span>
                                                <span style={{ ..._badge(payBadge) }}>
                                                    <CreditCard size={10} />
                                                    {b.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                                                gap: "0.75rem",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            <Detail icon={<Users size={13} />} label="Travelers" value={`${b.travelers}`} />
                                            <Detail
                                                icon={<Calendar size={13} />}
                                                label="Travel Date"
                                                value={new Date(b.travelDate).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            />
                                            <Detail
                                                icon={<CreditCard size={13} />}
                                                label="Amount"
                                                value={`₹${b.totalAmount.toLocaleString("en-IN")}`}
                                                highlight
                                            />
                                            <Detail
                                                icon={<MapPin size={13} />}
                                                label="Booked"
                                                value={new Date(b.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            />
                                        </div>

                                        {b.razorpayPaymentId && (
                                            <div
                                                style={{
                                                    marginTop: "0.75rem",
                                                    fontSize: "0.75rem",
                                                    color: "var(--color-muted)",
                                                }}
                                            >
                                                Payment ID: {b.razorpayPaymentId}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

function _badge(b: { bg: string; color: string }): React.CSSProperties {
    return {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "capitalize",
        padding: "0.2rem 0.6rem",
        borderRadius: "999px",
        background: b.bg,
        color: b.color,
    };
}

function Detail({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: "var(--color-muted)",
                    fontSize: "0.7rem",
                    marginBottom: "0.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                }}
            >
                {icon} {label}
            </div>
            <div
                style={{
                    fontWeight: highlight ? 700 : 500,
                    color: highlight ? "var(--color-terracotta)" : "var(--color-text)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
