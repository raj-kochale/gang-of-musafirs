"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    /** Current image URL (could be an external URL or an uploaded path) */
    value: string;
    /** Called when a new image is uploaded or URL is changed */
    onChange: (url: string) => void;
    /** Label text */
    label?: string;
    /** Preview height in px */
    previewHeight?: number;
}

export default function ImageUpload({
    value,
    onChange,
    label = "Cover Image",
    previewHeight = 140,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = useCallback(
        async (file: File) => {
            setError("");
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append("files", file);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed");
                if (data.urls?.[0]) onChange(data.urls[0]);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
                setUploading(false);
            }
        },
        [onChange]
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        e.target.value = "";
    };

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) handleUpload(file);
        },
        [handleUpload]
    );

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

            {/* URL input — still allows pasting external URLs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                    className="input-field"
                    value={value}
                    onChange={(e) => { setError(""); onChange(e.target.value); }}
                    placeholder="Paste URL or upload below..."
                    style={{ flex: 1 }}
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        title="Clear"
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

            {/* Drag & drop / click-to-upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragOver ? "var(--color-terracotta)" : "var(--color-border)"}`,
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    textAlign: "center",
                    cursor: uploading ? "wait" : "pointer",
                    background: dragOver ? "rgba(200,80,50,0.04)" : "transparent",
                    transition: "all 0.2s",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{ display: "none" }}
                />
                {uploading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--color-muted)" }}>
                        <Loader2 size={20} className="spin" style={{ animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: "0.85rem" }}>Uploading...</span>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", color: "var(--color-muted)" }}>
                        <Upload size={22} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            Click to upload or drag & drop
                        </span>
                        <span style={{ fontSize: "0.7rem" }}>
                            JPEG, PNG, WebP, GIF · Max 5 MB
                        </span>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    {error}
                </p>
            )}

            {/* Preview */}
            {value && (
                <div
                    style={{
                        marginTop: "0.6rem",
                        borderRadius: "0.6rem",
                        overflow: "hidden",
                        height: previewHeight,
                        position: "relative",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            )}
        </div>
    );
}

/* ───── Gallery Upload variant ───── */

interface GalleryUploadProps {
    /** Array of image URLs */
    images: string[];
    /** Called with the updated array */
    onChange: (urls: string[]) => void;
}

export function GalleryUpload({ images, onChange }: GalleryUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");

    const handleUploadMulti = useCallback(
        async (files: FileList | File[]) => {
            setError("");
            setUploading(true);
            try {
                const formData = new FormData();
                Array.from(files).forEach((f) => formData.append("files", f));
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed");
                if (data.urls?.length) onChange([...images, ...data.urls]);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
                setUploading(false);
            }
        },
        [images, onChange]
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const fileList = e.dataTransfer.files;
            if (fileList.length) handleUploadMulti(fileList);
        },
        [handleUploadMulti]
    );

    const removeImage = (i: number) => {
        onChange(images.filter((_, idx) => idx !== i));
    };

    const updateUrl = (i: number, url: string) => {
        const updated = [...images];
        updated[i] = url;
        onChange(updated);
    };

    const addUrlSlot = () => onChange([...images, ""]);

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
                Gallery Images
            </label>

            {/* Existing images */}
            {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {images.map((url, i) => (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                                border: "1px solid var(--color-border)",
                                aspectRatio: "4/3",
                                background: "var(--color-surface)",
                            }}
                        >
                            {url ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={url}
                                        alt={`Gallery ${i + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        style={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            border: "none",
                                            background: "rgba(220,38,38,0.85)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </>
                            ) : (
                                <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem", height: "100%", justifyContent: "center" }}>
                                    <input
                                        className="input-field"
                                        value={url}
                                        onChange={(e) => updateUrl(i, e.target.value)}
                                        placeholder="Paste URL"
                                        style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        style={{
                                            fontSize: "0.65rem",
                                            color: "#dc2626",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragOver ? "var(--color-terracotta)" : "var(--color-border)"}`,
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    textAlign: "center",
                    cursor: uploading ? "wait" : "pointer",
                    background: dragOver ? "rgba(200,80,50,0.04)" : "transparent",
                    transition: "all 0.2s",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        if (e.target.files?.length) handleUploadMulti(e.target.files);
                        e.target.value = "";
                    }}
                    style={{ display: "none" }}
                />
                {uploading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--color-muted)" }}>
                        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: "0.8rem" }}>Uploading...</span>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--color-muted)" }}>
                        <ImageIcon size={18} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                            Upload gallery images (click or drag)
                        </span>
                    </div>
                )}
            </div>

            {/* Add URL slot button */}
            <button
                type="button"
                onClick={addUrlSlot}
                style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.75rem",
                    border: "1px dashed var(--color-border)",
                    borderRadius: "0.5rem",
                    background: "transparent",
                    color: "var(--color-terracotta)",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                }}
            >
                + Add URL manually
            </button>

            {error && (
                <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    {error}
                </p>
            )}
        </div>
    );
}
