"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Loader2,
    Package,
    Mountain,
    Database,
    AlertTriangle,
    Check,
} from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import ImageUpload, { GalleryUpload } from "@/components/ImageUpload";

/* ───── Types ───── */
type ItineraryItem = { day: number; title: string; description: string };

type TripPackage = {
    _id?: string;
    id?: string;
    slug: string;
    name: string;
    tagline: string;
    category: "Hill Stations" | "Beaches" | "Adventure" | "Cultural" | "Custom";
    destination: string;
    duration: string;
    groupSize: string;
    price: number;
    priceDisplay: string;
    overview: string;
    coverImage: string;
    gallery: string[];
    highlights: string[];
    itinerary: ItineraryItem[];
    inclusions: string[];
    exclusions: string[];
    rating: number;
    reviews: number;
    isActive?: boolean;
};

const EMPTY_PACKAGE: TripPackage = {
    slug: "",
    name: "",
    tagline: "",
    category: "Hill Stations",
    destination: "",
    duration: "",
    groupSize: "",
    price: 0,
    priceDisplay: "",
    overview: "",
    coverImage: "",
    gallery: [],
    highlights: [""],
    itinerary: [{ day: 1, title: "", description: "" }],
    inclusions: [""],
    exclusions: [""],
    rating: 4.5,
    reviews: 0,
};

const CATEGORIES = ["Hill Stations", "Beaches", "Adventure", "Cultural", "Custom"] as const;

/* ───── Main Admin Page ───── */
export default function AdminDashboard() {
    const [packages, setPackages] = useState<TripPackage[]>([]);
    const [dataSource, setDataSource] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingPkg, setEditingPkg] = useState<TripPackage | null>(null);
    const [form, setForm] = useState<TripPackage>({ ...EMPTY_PACKAGE });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/packages");
            const data = await res.json();
            setPackages(data.packages || []);
            setDataSource(data.source || "unknown");
        } catch {
            showToast("Failed to load packages", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    /* ── Seed static data to DB ── */
    const handleSeed = async () => {
        setSeeding(true);
        try {
            const res = await fetch("/api/packages/seed", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message);
                fetchPackages();
            } else {
                showToast(data.error || "Seed failed", "error");
            }
        } catch {
            showToast("Seed failed", "error");
        } finally {
            setSeeding(false);
        }
    };

    /* ── Open form for create/edit ── */
    const openCreate = () => {
        setEditingPkg(null);
        setForm({ ...EMPTY_PACKAGE, highlights: [""], inclusions: [""], exclusions: [""], itinerary: [{ day: 1, title: "", description: "" }] });
        setShowForm(true);
    };

    const openEdit = (pkg: TripPackage) => {
        setEditingPkg(pkg);
        setForm({
            ...pkg,
            highlights: pkg.highlights?.length ? [...pkg.highlights] : [""],
            inclusions: pkg.inclusions?.length ? [...pkg.inclusions] : [""],
            exclusions: pkg.exclusions?.length ? [...pkg.exclusions] : [""],
            itinerary: pkg.itinerary?.length
                ? pkg.itinerary.map((it) => ({ ...it }))
                : [{ day: 1, title: "", description: "" }],
            gallery: pkg.gallery?.length ? [...pkg.gallery] : [],
        });
        setShowForm(true);
    };

    /* ── Save (Create or Update) ── */
    const handleSave = async () => {
        if (!form.name || !form.destination || !form.price) {
            showToast("Name, destination, and price are required", "error");
            return;
        }
        setSaving(true);

        // clean empty strings from arrays
        const cleaned = {
            ...form,
            highlights: form.highlights.filter((h) => h.trim()),
            inclusions: form.inclusions.filter((i) => i.trim()),
            exclusions: form.exclusions.filter((e) => e.trim()),
            itinerary: form.itinerary.filter((it) => it.title.trim()),
            gallery: form.gallery.filter((g) => g.trim()),
        };

        // Auto-generate priceDisplay if not set
        if (!cleaned.priceDisplay) {
            cleaned.priceDisplay = `₹${cleaned.price.toLocaleString("en-IN")}`;
        }

        try {
            let res: Response;
            if (editingPkg && (editingPkg._id || editingPkg.id)) {
                const pkgId = editingPkg._id || editingPkg.id;
                res = await fetch(`/api/packages/${pkgId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleaned),
                });
            } else {
                res = await fetch("/api/packages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleaned),
                });
            }

            const data = await res.json();
            if (res.ok) {
                showToast(editingPkg ? "Package updated!" : "Package created!");
                setShowForm(false);
                fetchPackages();
            } else {
                showToast(data.error || "Save failed", "error");
            }
        } catch {
            showToast("Save failed", "error");
        } finally {
            setSaving(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Package deleted");
                setDeleteConfirm(null);
                fetchPackages();
            } else {
                const data = await res.json();
                showToast(data.error || "Delete failed", "error");
            }
        } catch {
            showToast("Delete failed", "error");
        }
    };

    /* ── Array field helpers ── */
    const addArrayItem = (field: "highlights" | "inclusions" | "exclusions" | "gallery") => {
        setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
    };
    const updateArrayItem = (field: "highlights" | "inclusions" | "exclusions" | "gallery", i: number, val: string) => {
        setForm((f) => {
            const arr = [...f[field]];
            arr[i] = val;
            return { ...f, [field]: arr };
        });
    };
    const removeArrayItem = (field: "highlights" | "inclusions" | "exclusions" | "gallery", i: number) => {
        setForm((f) => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
    };

    /* ── Itinerary helpers ── */
    const addItineraryDay = () => {
        setForm((f) => ({
            ...f,
            itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: "", description: "" }],
        }));
    };
    const updateItinerary = (i: number, field: keyof ItineraryItem, val: string | number) => {
        setForm((f) => {
            const arr = [...f.itinerary];
            arr[i] = { ...arr[i], [field]: val };
            return { ...f, itinerary: arr };
        });
    };
    const removeItineraryDay = (i: number) => {
        setForm((f) => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }));
    };

    /* ───────────── Render ───────────── */
    return (
        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
            {/* ── Toast ── */}
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

            <AdminNav />

            {/* ── Action Bar ── */}
            <div className="container-custom" style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem", flexWrap: "wrap" }}>
                {dataSource === "static" && (
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.6rem 1.25rem",
                            borderRadius: "999px",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-surface)",
                            color: "var(--color-terracotta)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            cursor: seeding ? "not-allowed" : "pointer",
                            opacity: seeding ? 0.7 : 1,
                        }}
                    >
                        {seeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                        {seeding ? "Seeding…" : "Seed DB with Static Data"}
                    </button>
                )}
                <button
                    onClick={openCreate}
                    className="btn-primary"
                    style={{ fontSize: "0.85rem" }}
                >
                    <Plus size={16} /> Add New Trip
                </button>
            </div>

            {/* ── Stats Bar ── */}
            <div className="container-custom" style={{ marginTop: "1.5rem" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {[
                        { label: "Total Trips", value: packages.length, icon: <Package size={20} /> },
                        { label: "Data Source", value: dataSource === "db" ? "MongoDB" : "Static File", icon: <Database size={20} /> },
                        { label: "Categories", value: new Set(packages.map((p) => p.category)).size, icon: <Mountain size={20} /> },
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
                                    background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1, color: "var(--color-text)" }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.15rem" }}>
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Package List ── */}
            <main className="container-custom" style={{ padding: "1.5rem 1.5rem 4rem" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-muted)" }}>
                        <Loader2 size={36} style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "1rem" }}>Loading trips…</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div
                        className="glass"
                        style={{
                            textAlign: "center",
                            padding: "4rem 2rem",
                            marginTop: "2rem",
                        }}
                    >
                        <Package size={48} style={{ color: "var(--color-muted)", marginBottom: "1rem" }} />
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No Trips Yet</h3>
                        <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem" }}>
                            Start by adding your first trip or seed the database with existing static data.
                        </p>
                        <button onClick={openCreate} className="btn-primary">
                            <Plus size={16} /> Add First Trip
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "1rem", marginTop: "0.5rem" }}>
                        {packages.map((pkg) => {
                            const pkgId = pkg._id || pkg.id || "";
                            return (
                                <div
                                    key={pkgId}
                                    className="glass hover-lift"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "auto 1fr auto",
                                        gap: "1.25rem",
                                        padding: "1.25rem",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* Cover */}
                                    <div
                                        style={{
                                            width: 90,
                                            height: 65,
                                            borderRadius: "0.6rem",
                                            overflow: "hidden",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img
                                            src={pkg.coverImage}
                                            alt={pkg.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                            <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{pkg.name}</h3>
                                            <span className="tag" style={{ fontSize: "0.6rem", padding: "0.15rem 0.5rem" }}>
                                                {pkg.category}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {pkg.destination} · {pkg.duration} · {pkg.priceDisplay || `₹${pkg.price}`}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        {dataSource === "db" && (
                                            <>
                                                <button
                                                    onClick={() => openEdit(pkg)}
                                                    title="Edit"
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: "0.6rem",
                                                        border: "1px solid var(--color-border)",
                                                        background: "var(--color-surface)",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "var(--color-terracotta)",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                {deleteConfirm === pkgId ? (
                                                    <div style={{ display: "flex", gap: "0.35rem" }}>
                                                        <button
                                                            onClick={() => handleDelete(pkgId)}
                                                            title="Confirm delete"
                                                            style={{
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius: "0.6rem",
                                                                border: "none",
                                                                background: "#dc2626",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            title="Cancel"
                                                            style={{
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius: "0.6rem",
                                                                border: "1px solid var(--color-border)",
                                                                background: "var(--color-surface)",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "var(--color-muted)",
                                                            }}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(pkgId)}
                                                        title="Delete"
                                                        style={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: "0.6rem",
                                                            border: "1px solid var(--color-border)",
                                                            background: "var(--color-surface)",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#dc2626",
                                                            transition: "all 0.2s",
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {dataSource === "static" && (
                                            <span style={{ fontSize: "0.75rem", color: "var(--color-muted)", padding: "0.5rem", fontStyle: "italic" }}>
                                                Seed DB to edit
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* ── Slide-over Form ── */}
            {showForm && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setShowForm(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            zIndex: 1000,
                            backdropFilter: "blur(4px)",
                        }}
                    />

                    {/* Panel */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            width: "min(600px, 100vw)",
                            height: "100vh",
                            background: "var(--color-bg)",
                            zIndex: 1001,
                            overflowY: "auto",
                            boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
                            animation: "slideIn 0.3s ease-out",
                        }}
                    >
                        {/* Panel header */}
                        <div
                            style={{
                                position: "sticky",
                                top: 0,
                                background: "var(--color-bg)",
                                borderBottom: "1px solid var(--color-border)",
                                padding: "1.25rem 1.5rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                zIndex: 10,
                            }}
                        >
                            <h2 style={{ fontSize: "1.15rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {editingPkg ? <Pencil size={18} /> : <Plus size={18} />}
                                {editingPkg ? "Edit Trip" : "Add New Trip"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1px solid var(--color-border)",
                                    background: "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--color-muted)",
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form body */}
                        <div style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                {/* Name */}
                                <FormField label="Trip Name *">
                                    <input
                                        className="input-field"
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. Manali Adventure Escape"
                                    />
                                </FormField>

                                {/* Tagline */}
                                <FormField label="Tagline">
                                    <input
                                        className="input-field"
                                        value={form.tagline}
                                        onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                                        placeholder="e.g. Snow peaks, roaring rivers & mountain thrills"
                                    />
                                </FormField>

                                {/* Row: Category + Destination */}
                                <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <FormField label="Category *">
                                        <select
                                            className="input-field"
                                            value={form.category}
                                            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TripPackage["category"] }))}
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </FormField>
                                    <FormField label="Destination *">
                                        <input
                                            className="input-field"
                                            value={form.destination}
                                            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                                            placeholder="e.g. Manali, Himachal Pradesh"
                                        />
                                    </FormField>
                                </div>

                                {/* Row: Duration + Group Size */}
                                <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <FormField label="Duration">
                                        <input
                                            className="input-field"
                                            value={form.duration}
                                            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                                            placeholder="e.g. 5 Days / 4 Nights"
                                        />
                                    </FormField>
                                    <FormField label="Group Size">
                                        <input
                                            className="input-field"
                                            value={form.groupSize}
                                            onChange={(e) => setForm((f) => ({ ...f, groupSize: e.target.value }))}
                                            placeholder="e.g. 10–20 people"
                                        />
                                    </FormField>
                                </div>

                                {/* Row: Price + Price Display */}
                                <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <FormField label="Price (₹) *">
                                        <input
                                            className="input-field"
                                            type="number"
                                            value={form.price || ""}
                                            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                                            placeholder="e.g. 8499"
                                        />
                                    </FormField>
                                    <FormField label="Price Display">
                                        <input
                                            className="input-field"
                                            value={form.priceDisplay}
                                            onChange={(e) => setForm((f) => ({ ...f, priceDisplay: e.target.value }))}
                                            placeholder="Auto-generated if empty"
                                        />
                                    </FormField>
                                </div>

                                {/* Overview */}
                                <FormField label="Overview">
                                    <textarea
                                        className="input-field"
                                        rows={4}
                                        value={form.overview}
                                        onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
                                        placeholder="Describe this trip..."
                                        style={{ resize: "vertical" }}
                                    />
                                </FormField>

                                {/* Cover Image */}
                                <ImageUpload
                                    label="Cover Image"
                                    value={form.coverImage}
                                    onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
                                />

                                {/* Gallery */}
                                <GalleryUpload
                                    images={form.gallery}
                                    onChange={(urls) => setForm((f) => ({ ...f, gallery: urls }))}
                                />

                                {/* Highlights */}
                                <ArrayFieldEditor
                                    label="Highlights"
                                    items={form.highlights}
                                    placeholder="e.g. Solang Valley snow activities"
                                    onAdd={() => addArrayItem("highlights")}
                                    onUpdate={(i, v) => updateArrayItem("highlights", i, v)}
                                    onRemove={(i) => removeArrayItem("highlights", i)}
                                />

                                {/* Itinerary */}
                                <FormField label="Itinerary">
                                    {form.itinerary.map((it, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                background: "var(--color-surface)",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: "0.75rem",
                                                padding: "1rem",
                                                marginBottom: "0.75rem",
                                                position: "relative",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                                <span
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: "50%",
                                                        background: "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                                                        color: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {it.day}
                                                </span>
                                                <input
                                                    className="input-field"
                                                    value={it.title}
                                                    onChange={(e) => updateItinerary(i, "title", e.target.value)}
                                                    placeholder="Day title"
                                                    style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
                                                />
                                                {form.itinerary.length > 1 && (
                                                    <button
                                                        onClick={() => removeItineraryDay(i)}
                                                        style={{
                                                            flexShrink: 0,
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "50%",
                                                            border: "none",
                                                            background: "rgba(220,38,38,0.1)",
                                                            color: "#dc2626",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                className="input-field"
                                                rows={2}
                                                value={it.description}
                                                onChange={(e) => updateItinerary(i, "description", e.target.value)}
                                                placeholder="Day description"
                                                style={{ resize: "vertical", fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={addItineraryDay}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.5rem 1rem",
                                            border: "1px dashed var(--color-border)",
                                            borderRadius: "0.5rem",
                                            background: "transparent",
                                            color: "var(--color-terracotta)",
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        <Plus size={14} /> Add Day
                                    </button>
                                </FormField>

                                {/* Inclusions */}
                                <ArrayFieldEditor
                                    label="Inclusions"
                                    items={form.inclusions}
                                    placeholder="e.g. 4 nights accommodation"
                                    onAdd={() => addArrayItem("inclusions")}
                                    onUpdate={(i, v) => updateArrayItem("inclusions", i, v)}
                                    onRemove={(i) => removeArrayItem("inclusions", i)}
                                />

                                {/* Exclusions */}
                                <ArrayFieldEditor
                                    label="Exclusions"
                                    items={form.exclusions}
                                    placeholder="e.g. Flight tickets"
                                    onAdd={() => addArrayItem("exclusions")}
                                    onUpdate={(i, v) => updateArrayItem("exclusions", i, v)}
                                    onRemove={(i) => removeArrayItem("exclusions", i)}
                                />

                                {/* Row: Rating + Reviews */}
                                <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <FormField label="Rating">
                                        <input
                                            className="input-field"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={form.rating}
                                            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                                        />
                                    </FormField>
                                    <FormField label="Reviews Count">
                                        <input
                                            className="input-field"
                                            type="number"
                                            value={form.reviews}
                                            onChange={(e) => setForm((f) => ({ ...f, reviews: Number(e.target.value) }))}
                                        />
                                    </FormField>
                                </div>

                                {/* Save */}
                                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", paddingBottom: "2rem" }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn-primary"
                                        style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {saving ? "Saving…" : editingPkg ? "Update Trip" : "Create Trip"}
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary"
                                        style={{ flex: 0.5, justifyContent: "center" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Inline styles for custom animations ── */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @media (max-width: 600px) {
                    .admin-form-row {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

/* ───── Sub-components ───── */

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-muted)",
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

function ArrayFieldEditor({
    label,
    items,
    placeholder,
    onAdd,
    onUpdate,
    onRemove,
}: {
    label: string;
    items: string[];
    placeholder: string;
    onAdd: () => void;
    onUpdate: (i: number, v: string) => void;
    onRemove: (i: number) => void;
}) {
    return (
        <FormField label={label}>
            {items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <input
                        className="input-field"
                        value={item}
                        onChange={(e) => onUpdate(i, e.target.value)}
                        placeholder={placeholder}
                        style={{ flex: 1, padding: "0.6rem 0.75rem", fontSize: "0.85rem" }}
                    />
                    {items.length > 1 && (
                        <button
                            onClick={() => onRemove(i)}
                            style={{
                                flexShrink: 0,
                                width: 36,
                                height: 36,
                                borderRadius: "0.5rem",
                                border: "none",
                                background: "rgba(220,38,38,0.08)",
                                color: "#dc2626",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={onAdd}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    border: "1px dashed var(--color-border)",
                    borderRadius: "0.5rem",
                    background: "transparent",
                    color: "var(--color-terracotta)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                }}
            >
                <Plus size={14} /> Add {label.replace(/s$/, "")}
            </button>
        </FormField>
    );
}
