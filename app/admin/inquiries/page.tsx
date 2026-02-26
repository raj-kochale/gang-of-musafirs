"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Loader2,
    MessageSquare,
    AlertTriangle,
    Check,
    X,
    Trash2,
    Phone,
    Mail,
    Calendar,
    Users,
    MapPin,
    DollarSign,
    Clock,
    ChevronDown,
    ChevronUp,
    Filter,
} from "lucide-react";
import AdminNav from "@/components/AdminNav";

/* ───── Types ───── */
type Inquiry = {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
    destination: string;
    travelDate: string;
    travelers: string;
    budget: string;
    message: string;
    status: string;
    createdAt: string;
};

const STATUS_OPTIONS = ["new", "contacted", "booked"] as const;

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
    new: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "New" },
    contacted: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Contacted" },
    booked: { bg: "rgba(16,185,129,0.1)", color: "#10b981", label: "Booked" },
};

/* ───── Main Page ───── */
export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/inquiries");
            const data = await res.json();
            setInquiries(data.inquiries || []);
        } catch {
            showToast("Failed to load inquiries", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                showToast(`Status updated to "${status}"`);
                fetchInquiries();
            } else {
                showToast("Update failed", "error");
            }
        } catch {
            showToast("Update failed", "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Inquiry deleted");
                setDeleteConfirm(null);
                fetchInquiries();
            } else {
                showToast("Delete failed", "error");
            }
        } catch {
            showToast("Delete failed", "error");
        }
    };

    const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);
    const counts = {
        all: inquiries.length,
        new: inquiries.filter((i) => i.status === "new").length,
        contacted: inquiries.filter((i) => i.status === "contacted").length,
        booked: inquiries.filter((i) => i.status === "booked").length,
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
            <AdminNav />

            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: "1.5rem",
                        right: "1.5rem",
                        zIndex: 9999,
                        padding: "1rem 1.5rem",
                        borderRadius: "0.75rem",
                        background: toast.type === "success" ? "#059669" : "#dc2626",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        animation: "fadeUp 0.3s ease-out",
                    }}
                >
                    {toast.type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Stats */}
            <div className="container-custom" style={{ marginTop: "1.5rem" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {[
                        { label: "Total", value: counts.all, color: "var(--color-terracotta)" },
                        { label: "New", value: counts.new, color: "#3b82f6" },
                        { label: "Contacted", value: counts.contacted, color: "#f59e0b" },
                        { label: "Booked", value: counts.booked, color: "#10b981" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass"
                            style={{
                                padding: "1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "0.75rem",
                                    background: stat.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    flexShrink: 0,
                                    opacity: 0.85,
                                }}
                            >
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 800,
                                        lineHeight: 1,
                                        color: "var(--color-text)",
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "var(--color-muted)",
                                        marginTop: "0.15rem",
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="container-custom" style={{ marginTop: "1.5rem" }}>
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <Filter size={16} style={{ color: "var(--color-muted)" }} />
                    {(["all", ...STATUS_OPTIONS] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`filter-tab ${filter === s ? "active" : ""}`}
                            style={{ fontSize: "0.8rem" }}
                        >
                            {s === "all" ? "All" : statusStyles[s]?.label || s} (
                            {counts[s as keyof typeof counts] || 0})
                        </button>
                    ))}
                </div>
            </div>

            {/* Inquiry List */}
            <main className="container-custom" style={{ padding: "1.5rem 1.5rem 4rem" }}>
                {loading ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "4rem 0",
                            color: "var(--color-muted)",
                        }}
                    >
                        <Loader2 size={36} style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "1rem" }}>Loading inquiries…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div
                        className="glass"
                        style={{
                            textAlign: "center",
                            padding: "4rem 2rem",
                            marginTop: "1rem",
                        }}
                    >
                        <MessageSquare
                            size={48}
                            style={{ color: "var(--color-muted)", marginBottom: "1rem" }}
                        />
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                            No Inquiries
                        </h3>
                        <p style={{ color: "var(--color-muted)" }}>
                            {filter === "all"
                                ? "No inquiries received yet."
                                : `No "${filter}" inquiries found.`}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.5rem" }}>
                        {filtered.map((inq) => {
                            const statusInfo = statusStyles[inq.status] || statusStyles.new;
                            const isExpanded = expandedId === inq._id;
                            const date = new Date(inq.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={inq._id}
                                    className="glass"
                                    style={{ overflow: "hidden", borderRadius: "0.875rem" }}
                                >
                                    {/* Summary Row */}
                                    <button
                                        onClick={() =>
                                            setExpandedId(isExpanded ? null : inq._id)
                                        }
                                        style={{
                                            width: "100%",
                                            background: "none",
                                            border: "none",
                                            padding: "1.1rem 1.25rem",
                                            cursor: "pointer",
                                            display: "grid",
                                            gridTemplateColumns: "1fr auto",
                                            gap: "1rem",
                                            alignItems: "center",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: 700,
                                                        color: "var(--color-text)",
                                                        fontSize: "0.95rem",
                                                    }}
                                                >
                                                    {inq.fullName}
                                                </span>
                                                <span
                                                    style={{
                                                        background: statusInfo.bg,
                                                        color: statusInfo.color,
                                                        fontSize: "0.65rem",
                                                        fontWeight: 700,
                                                        padding: "0.15rem 0.5rem",
                                                        borderRadius: "999px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                    }}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "var(--color-muted)",
                                                    marginTop: "0.25rem",
                                                    display: "flex",
                                                    gap: "1rem",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.25rem",
                                                    }}
                                                >
                                                    <MapPin size={12} /> {inq.destination}
                                                </span>
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.25rem",
                                                    }}
                                                >
                                                    <Calendar size={12} /> {inq.travelDate}
                                                </span>
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.25rem",
                                                    }}
                                                >
                                                    <Clock size={12} /> {date}
                                                </span>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp
                                                size={18}
                                                style={{ color: "var(--color-muted)" }}
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                style={{ color: "var(--color-muted)" }}
                                            />
                                        )}
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div
                                            style={{
                                                padding: "0 1.25rem 1.25rem",
                                                borderTop: "1px solid var(--color-border)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr",
                                                    gap: "1rem",
                                                    paddingTop: "1rem",
                                                }}
                                            >
                                                {[
                                                    {
                                                        icon: Phone,
                                                        label: "Phone",
                                                        value: inq.phone,
                                                        href: `tel:${inq.phone}`,
                                                    },
                                                    {
                                                        icon: Mail,
                                                        label: "Email",
                                                        value: inq.email,
                                                        href: `mailto:${inq.email}`,
                                                    },
                                                    {
                                                        icon: MapPin,
                                                        label: "Destination",
                                                        value: inq.destination,
                                                    },
                                                    {
                                                        icon: Calendar,
                                                        label: "Travel Date",
                                                        value: inq.travelDate,
                                                    },
                                                    {
                                                        icon: Users,
                                                        label: "Travelers",
                                                        value: inq.travelers,
                                                    },
                                                    {
                                                        icon: DollarSign,
                                                        label: "Budget",
                                                        value: inq.budget || "Not specified",
                                                    },
                                                ].map((field) => (
                                                    <div key={field.label}>
                                                        <span
                                                            style={{
                                                                fontSize: "0.7rem",
                                                                fontWeight: 600,
                                                                color: "var(--color-muted)",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.05em",
                                                            }}
                                                        >
                                                            {field.label}
                                                        </span>
                                                        {"href" in field && field.href ? (
                                                            <a
                                                                href={field.href}
                                                                style={{
                                                                    display: "block",
                                                                    color: "var(--color-terracotta)",
                                                                    fontSize: "0.9rem",
                                                                    fontWeight: 600,
                                                                    textDecoration: "none",
                                                                    marginTop: "0.15rem",
                                                                }}
                                                            >
                                                                {field.value}
                                                            </a>
                                                        ) : (
                                                            <p
                                                                style={{
                                                                    color: "var(--color-text)",
                                                                    fontSize: "0.9rem",
                                                                    fontWeight: 600,
                                                                    marginTop: "0.15rem",
                                                                }}
                                                            >
                                                                {field.value}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {inq.message && (
                                                <div
                                                    style={{
                                                        marginTop: "1rem",
                                                        background: "var(--color-surface)",
                                                        borderRadius: "0.5rem",
                                                        padding: "0.75rem 1rem",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "0.7rem",
                                                            fontWeight: 600,
                                                            color: "var(--color-muted)",
                                                            textTransform: "uppercase",
                                                        }}
                                                    >
                                                        Message
                                                    </span>
                                                    <p
                                                        style={{
                                                            color: "var(--color-text)",
                                                            fontSize: "0.875rem",
                                                            marginTop: "0.25rem",
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {inq.message}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div
                                                style={{
                                                    marginTop: "1rem",
                                                    display: "flex",
                                                    gap: "0.5rem",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "0.5rem",
                                                        flexWrap: "wrap",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "var(--color-muted)",
                                                            marginRight: "0.25rem",
                                                        }}
                                                    >
                                                        Status:
                                                    </span>
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateStatus(inq._id, s)}
                                                            style={{
                                                                padding: "0.35rem 0.75rem",
                                                                borderRadius: "999px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: 600,
                                                                cursor: "pointer",
                                                                border:
                                                                    inq.status === s
                                                                        ? "none"
                                                                        : "1px solid var(--color-border)",
                                                                background:
                                                                    inq.status === s
                                                                        ? statusStyles[s].color
                                                                        : "transparent",
                                                                color:
                                                                    inq.status === s
                                                                        ? "white"
                                                                        : "var(--color-muted)",
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            {statusStyles[s].label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                                    <a
                                                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${inq.fullName}! Thank you for your inquiry about ${inq.destination} with GangOfMusafirs. Let's plan your trip!`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            padding: "0.35rem 0.75rem",
                                                            borderRadius: "999px",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 600,
                                                            background: "#25D366",
                                                            color: "white",
                                                            textDecoration: "none",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "0.3rem",
                                                        }}
                                                    >
                                                        WhatsApp
                                                    </a>

                                                    {deleteConfirm === inq._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleDelete(inq._id)}
                                                                style={{
                                                                    padding: "0.35rem 0.75rem",
                                                                    borderRadius: "999px",
                                                                    fontSize: "0.75rem",
                                                                    fontWeight: 600,
                                                                    background: "#dc2626",
                                                                    color: "white",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                style={{
                                                                    padding: "0.35rem 0.75rem",
                                                                    borderRadius: "999px",
                                                                    fontSize: "0.75rem",
                                                                    fontWeight: 600,
                                                                    background: "var(--color-surface)",
                                                                    color: "var(--color-muted)",
                                                                    border: "1px solid var(--color-border)",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(inq._id)}
                                                            title="Delete"
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "0.5rem",
                                                                border: "1px solid var(--color-border)",
                                                                background: "var(--color-surface)",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#dc2626",
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
