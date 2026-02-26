"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Loader2,
    FileText,
    AlertTriangle,
    Check,
    Eye,
    EyeOff,
} from "lucide-react";
import AdminNav from "@/components/AdminNav";

/* ───── Types ───── */
type BlogPost = {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string[];
    author: string;
    isPublished: boolean;
    publishedAt: string;
    createdAt: string;
};

const EMPTY_POST = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: [] as string[],
    author: "GangOfMusafirs",
    isPublished: false,
    publishedAt: "",
};

/* ───── Main Page ───── */
export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [form, setForm] = useState({ ...EMPTY_POST });
    const [tagsInput, setTagsInput] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/blog");
            const data = await res.json();
            setPosts(data.posts || []);
        } catch {
            showToast("Failed to load posts", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    /* ── Open form ── */
    const openCreate = () => {
        setEditingPost(null);
        setForm({ ...EMPTY_POST });
        setTagsInput("");
        setShowForm(true);
    };

    const openEdit = (post: BlogPost) => {
        setEditingPost(post);
        setForm({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            tags: post.tags || [],
            author: post.author,
            isPublished: post.isPublished,
            publishedAt: post.publishedAt,
        });
        setTagsInput((post.tags || []).join(", "));
        setShowForm(true);
    };

    /* ── Save ── */
    const handleSave = async () => {
        if (!form.title || !form.content) {
            showToast("Title and content are required", "error");
            return;
        }
        setSaving(true);

        const cleaned = {
            ...form,
            tags: tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            excerpt: form.excerpt || form.content.slice(0, 200) + "...",
        };

        try {
            let res: Response;
            if (editingPost) {
                res = await fetch(`/api/blog/${editingPost._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleaned),
                });
            } else {
                res = await fetch("/api/blog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleaned),
                });
            }

            const data = await res.json();
            if (res.ok) {
                showToast(editingPost ? "Post updated!" : "Post created!");
                setShowForm(false);
                fetchPosts();
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
            const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Post deleted");
                setDeleteConfirm(null);
                fetchPosts();
            } else {
                showToast("Delete failed", "error");
            }
        } catch {
            showToast("Delete failed", "error");
        }
    };

    /* ── Toggle publish ── */
    const togglePublish = async (post: BlogPost) => {
        try {
            const res = await fetch(`/api/blog/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...post,
                    isPublished: !post.isPublished,
                    publishedAt: !post.isPublished
                        ? new Date().toISOString()
                        : post.publishedAt,
                }),
            });
            if (res.ok) {
                showToast(post.isPublished ? "Post unpublished" : "Post published!");
                fetchPosts();
            }
        } catch {
            showToast("Update failed", "error");
        }
    };

    const published = posts.filter((p) => p.isPublished).length;
    const drafts = posts.filter((p) => !p.isPublished).length;

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

            {/* Action Bar */}
            <div
                className="container-custom"
                style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, auto)",
                        gap: "1rem",
                    }}
                >
                    {[
                        { label: "Total Posts", value: posts.length },
                        { label: "Published", value: published },
                        { label: "Drafts", value: drafts },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass"
                            style={{
                                padding: "1rem 1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            <FileText
                                size={18}
                                style={{ color: "var(--color-terracotta)" }}
                            />
                            <div>
                                <div
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: 800,
                                        color: "var(--color-text)",
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-muted)",
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={openCreate}
                    className="btn-primary"
                    style={{ fontSize: "0.85rem" }}
                >
                    <Plus size={16} /> New Blog Post
                </button>
            </div>

            {/* Post List */}
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
                        <p style={{ marginTop: "1rem" }}>Loading posts…</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        className="glass"
                        style={{
                            textAlign: "center",
                            padding: "4rem 2rem",
                            marginTop: "1rem",
                        }}
                    >
                        <FileText
                            size={48}
                            style={{ color: "var(--color-muted)", marginBottom: "1rem" }}
                        />
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                            No Blog Posts Yet
                        </h3>
                        <p
                            style={{
                                color: "var(--color-muted)",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Create your first blog post to boost SEO and engage travelers.
                        </p>
                        <button onClick={openCreate} className="btn-primary">
                            <Plus size={16} /> Create First Post
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.5rem" }}>
                        {posts.map((post) => (
                            <div
                                key={post._id}
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
                                        background: "var(--color-surface)",
                                    }}
                                >
                                    {post.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <FileText
                                                size={24}
                                                style={{ color: "var(--color-muted)" }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ minWidth: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <h3 style={{ fontSize: "1.05rem", margin: 0 }}>
                                            {post.title}
                                        </h3>
                                        <span
                                            style={{
                                                fontSize: "0.6rem",
                                                fontWeight: 700,
                                                padding: "0.15rem 0.5rem",
                                                borderRadius: "999px",
                                                background: post.isPublished
                                                    ? "rgba(16,185,129,0.1)"
                                                    : "rgba(245,158,11,0.1)",
                                                color: post.isPublished
                                                    ? "#10b981"
                                                    : "#f59e0b",
                                            }}
                                        >
                                            {post.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "var(--color-muted)",
                                            marginTop: "0.25rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {post.excerpt}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        onClick={() => togglePublish(post)}
                                        title={
                                            post.isPublished ? "Unpublish" : "Publish"
                                        }
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
                                            color: post.isPublished
                                                ? "#10b981"
                                                : "#f59e0b",
                                        }}
                                    >
                                        {post.isPublished ? (
                                            <Eye size={16} />
                                        ) : (
                                            <EyeOff size={16} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEdit(post)}
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
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    {deleteConfirm === post._id ? (
                                        <div style={{ display: "flex", gap: "0.35rem" }}>
                                            <button
                                                onClick={() => handleDelete(post._id)}
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
                                            onClick={() => setDeleteConfirm(post._id)}
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
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
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
                        {/* Panel Header */}
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
                            <h2
                                style={{
                                    fontSize: "1.15rem",
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                {editingPost ? <Pencil size={18} /> : <Plus size={18} />}
                                {editingPost ? "Edit Post" : "New Blog Post"}
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

                        {/* Form Body */}
                        <div style={{ padding: "1.5rem" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.25rem",
                                }}
                            >
                                {/* Title */}
                                <FormField label="Title *">
                                    <input
                                        className="input-field"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                title: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Top 10 Hidden Gems in Himachal Pradesh"
                                    />
                                </FormField>

                                {/* Excerpt */}
                                <FormField label="Excerpt">
                                    <textarea
                                        className="input-field"
                                        rows={2}
                                        value={form.excerpt}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                excerpt: e.target.value,
                                            }))
                                        }
                                        placeholder="Short description for preview cards (auto-generated if empty)"
                                        style={{ resize: "vertical" }}
                                    />
                                </FormField>

                                {/* Content */}
                                <FormField label="Content *">
                                    <textarea
                                        className="input-field"
                                        rows={12}
                                        value={form.content}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                content: e.target.value,
                                            }))
                                        }
                                        placeholder={"Write your blog post content here...\n\nSeparate paragraphs with blank lines."}
                                        style={{ resize: "vertical", lineHeight: 1.7 }}
                                    />
                                </FormField>

                                {/* Cover Image */}
                                <FormField label="Cover Image URL">
                                    <input
                                        className="input-field"
                                        value={form.coverImage}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                coverImage: e.target.value,
                                            }))
                                        }
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {form.coverImage && (
                                        <div
                                            style={{
                                                marginTop: "0.5rem",
                                                borderRadius: "0.5rem",
                                                overflow: "hidden",
                                                height: 120,
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={form.coverImage}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    )}
                                </FormField>

                                {/* Tags */}
                                <FormField label="Tags (comma-separated)">
                                    <input
                                        className="input-field"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        placeholder="e.g. travel, himachal, adventure"
                                    />
                                </FormField>

                                {/* Author + Status */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "1rem",
                                    }}
                                >
                                    <FormField label="Author">
                                        <input
                                            className="input-field"
                                            value={form.author}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    author: e.target.value,
                                                }))
                                            }
                                            placeholder="GangOfMusafirs"
                                        />
                                    </FormField>
                                    <FormField label="Status">
                                        <select
                                            className="input-field"
                                            value={
                                                form.isPublished
                                                    ? "published"
                                                    : "draft"
                                            }
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    isPublished:
                                                        e.target.value === "published",
                                                }))
                                            }
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </FormField>
                                </div>

                                {/* Save */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.75rem",
                                        paddingTop: "0.5rem",
                                        paddingBottom: "2rem",
                                    }}
                                >
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn-primary"
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            opacity: saving ? 0.7 : 1,
                                        }}
                                    >
                                        {saving ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {saving
                                            ? "Saving…"
                                            : editingPost
                                            ? "Update Post"
                                            : "Create Post"}
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary"
                                        style={{
                                            flex: 0.5,
                                            justifyContent: "center",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}

/* ───── Sub-component ───── */
function FormField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
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
