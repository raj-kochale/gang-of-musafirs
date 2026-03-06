"use client";

import { useEffect, useState, useCallback } from "react";
import AdminNav from "@/components/AdminNav";
import {
    Loader2,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Users,
    Calendar,
    Search,
    RefreshCw,
    ChevronDown,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

type Booking = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    travelers: number;
    travelerNames?: string[];
    travelDate: string;
    specialRequests?: string;
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

const STATUS_COLORS: Record<string, string> = {
    confirmed: "#10b981",
    paid: "#10b981",
    pending: "#f59e0b",
    created: "#f59e0b",
    cancelled: "#ef4444",
    failed: "#ef4444",
    refunded: "#6366f1",
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        try {
            await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            await fetchBookings();
        } catch {
            /* ignore */
        } finally {
            setUpdating(null);
        }
    };

    /* ── Filters ── */
    const filtered = bookings
        .filter((b) => {
            if (filter === "all") return true;
            if (filter === "confirmed") return b.status === "confirmed";
            if (filter === "pending") return b.status === "pending";
            if (filter === "cancelled") return b.status === "cancelled";
            if (filter === "paid") return b.paymentStatus === "paid";
            if (filter === "failed") return b.paymentStatus === "failed";
            return true;
        })
        .filter((b) => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                b.fullName.toLowerCase().includes(q) ||
                b.email.toLowerCase().includes(q) ||
                b.packageName.toLowerCase().includes(q) ||
                b.razorpayOrderId.toLowerCase().includes(q)
            );
        });

    /* ── Stats ── */
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        pending: bookings.filter((b) => b.status === "pending").length,
        revenue: bookings
            .filter((b) => b.paymentStatus === "paid")
            .reduce((s, b) => s + b.totalAmount, 0),
    };

    return (
        <>
            <AdminNav />

            <main className="section-padding">
                <div className="container-custom" style={{ maxWidth: 1100 }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 800,
                            fontSize: "1.75rem",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <CreditCard size={24} style={{ color: "var(--color-terracotta)" }} />
                        Booking Management
                    </h1>

                    {/* ── Stats ── */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {[
                            { label: "Total Bookings", value: stats.total, icon: CreditCard, color: "var(--color-terracotta)" },
                            { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "#10b981" },
                            { label: "Pending", value: stats.pending, icon: Clock, color: "#f59e0b" },
                            {
                                label: "Revenue",
                                value: `₹${stats.revenue.toLocaleString("en-IN")}`,
                                icon: CreditCard,
                                color: "#6366f1",
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="glass"
                                style={{
                                    padding: "1.25rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "0.75rem",
                                        background: `${s.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <s.icon size={20} style={{ color: s.color }} />
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--color-muted)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.04em",
                                        }}
                                    >
                                        {s.label}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Toolbar ── */}
                    <div
                        className="glass"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            marginBottom: "1.25rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ position: "relative", flex: "1 1 200px" }}>
                            <Search
                                size={14}
                                style={{
                                    position: "absolute",
                                    left: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "var(--color-muted)",
                                }}
                            />
                            <input
                                className="input-field"
                                style={{ paddingLeft: "2rem", margin: 0 }}
                                placeholder="Search by name, email, package, order ID…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div style={{ position: "relative" }}>
                            <select
                                className="input-field"
                                style={{
                                    margin: 0,
                                    appearance: "none",
                                    paddingRight: "2rem",
                                    cursor: "pointer",
                                    minWidth: 140,
                                }}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Bookings</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="failed">Failed</option>
                            </select>
                            <ChevronDown
                                size={14}
                                style={{
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none",
                                    color: "var(--color-muted)",
                                }}
                            />
                        </div>

                        <button
                            className="btn-secondary"
                            style={{ padding: "0.5rem 0.75rem", gap: "0.35rem" }}
                            onClick={fetchBookings}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>

                    {/* ── Loading ── */}
                    {loading && (
                        <div style={{ textAlign: "center", padding: "3rem 0" }}>
                            <Loader2
                                size={28}
                                style={{
                                    animation: "spin 1s linear infinite",
                                    color: "var(--color-terracotta)",
                                }}
                            />
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {!loading && filtered.length === 0 && (
                        <div
                            className="glass"
                            style={{
                                textAlign: "center",
                                padding: "3rem 1.5rem",
                                color: "var(--color-muted)",
                            }}
                        >
                            <CreditCard size={36} style={{ marginBottom: "0.75rem", opacity: 0.4 }} />
                            <p>No bookings found.</p>
                        </div>
                    )}

                    {/* ── Booking cards ── */}
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {filtered.map((b) => (
                            <div
                                key={b._id}
                                className="glass"
                                style={{ padding: "1.25rem 1.5rem" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "start",
                                        flexWrap: "wrap",
                                        gap: "0.75rem",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    <div>
                                        <h3
                                            style={{
                                                fontFamily: "var(--font-outfit)",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                marginBottom: "0.15rem",
                                            }}
                                        >
                                            {b.fullName}
                                        </h3>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "1rem",
                                                fontSize: "0.8rem",
                                                color: "var(--color-muted)",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                <Mail size={11} /> {b.email}
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                <Phone size={11} /> {b.phone}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        <StatusBadge label={b.status} />
                                        <StatusBadge label={b.paymentStatus} />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                        gap: "0.5rem",
                                        fontSize: "0.85rem",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    <Info icon={<MapPin size={12} />} label="Package" value={b.packageName} />
                                    <Info icon={<Users size={12} />} label="Travelers" value={String(b.travelers)} />
                                    {b.travelerNames && b.travelerNames.length > 0 && (
                                        <div style={{ gridColumn: "1 / -1", fontSize: 12, color: "var(--color-muted)" }}>
                                            <strong>Names:</strong> {b.fullName} (Lead), {b.travelerNames.join(", ")}
                                        </div>
                                    )}
                                    <Info
                                        icon={<Calendar size={12} />}
                                        label="Travel Date"
                                        value={new Date(b.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    />
                                    <Info
                                        icon={<CreditCard size={12} />}
                                        label="Total"
                                        value={`₹${b.totalAmount.toLocaleString("en-IN")}`}
                                        bold
                                    />
                                </div>

                                {b.razorpayPaymentId && (
                                    <div style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginBottom: "0.5rem" }}>
                                        Payment ID: {b.razorpayPaymentId}
                                    </div>
                                )}

                                {b.specialRequests && (
                                    <div
                                        style={{
                                            fontSize: "0.8rem",
                                            background: "var(--color-surface)",
                                            borderRadius: "0.5rem",
                                            padding: "0.5rem 0.75rem",
                                            marginBottom: "0.75rem",
                                            color: "var(--color-muted)",
                                        }}
                                    >
                                        <strong>Note:</strong> {b.specialRequests}
                                    </div>
                                )}

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                                        {new Date(b.createdAt).toLocaleString("en-IN")}
                                    </span>

                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        {b.status !== "confirmed" && (
                                            <button
                                                className="btn-primary"
                                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                                                disabled={updating === b._id}
                                                onClick={() => updateStatus(b._id, "confirmed")}
                                            >
                                                {updating === b._id ? (
                                                    <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                                                ) : (
                                                    <CheckCircle size={12} />
                                                )}
                                                Confirm
                                            </button>
                                        )}
                                        {b.status !== "cancelled" && (
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                                                disabled={updating === b._id}
                                                onClick={() => updateStatus(b._id, "cancelled")}
                                            >
                                                <XCircle size={12} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

/* ── helpers ── */
function StatusBadge({ label }: { label: string }) {
    const color = STATUS_COLORS[label] || "var(--color-muted)";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "capitalize",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: `${color}15`,
                color,
            }}
        >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
            {label}
        </span>
    );
}

function Info({ icon, label, value, bold }: { icon: React.ReactNode; label: string; value: string; bold?: boolean }) {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: "var(--color-muted)",
                    fontSize: "0.7rem",
                    marginBottom: "0.15rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                }}
            >
                {icon} {label}
            </div>
            <div style={{ fontWeight: bold ? 700 : 500 }}>{value}</div>
        </div>
    );
}
