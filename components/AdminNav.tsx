"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Mountain,
    Package,
    MessageSquare,
    FileText,
    CreditCard,
    ChevronLeft,
    LogOut,
} from "lucide-react";

const tabs = [
    { label: "Packages", href: "/admin", icon: Package },
    { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Bookings", href: "/admin/bookings", icon: CreditCard },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
];

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    return (
        <>
            {/* Gradient Header */}
            <header
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-terracotta), var(--color-sunset))",
                    padding: "1.25rem 0",
                    boxShadow: "0 2px 20px rgba(192,92,58,0.2)",
                }}
            >
                <div
                    className="container-custom"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <Link
                            href="/"
                            style={{
                                color: "rgba(255,255,255,0.8)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                                textDecoration: "none",
                            }}
                        >
                            <ChevronLeft size={16} /> Site
                        </Link>
                        <div
                            style={{
                                width: 1,
                                height: 24,
                                background: "rgba(255,255,255,0.3)",
                            }}
                        />
                        <h1
                            style={{
                                color: "#fff",
                                fontSize: "1.3rem",
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <Mountain size={22} /> Admin Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "999px",
                            border: "1px solid rgba(255,255,255,0.4)",
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                        }}
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <div
                style={{
                    background: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <div
                    className="container-custom"
                    style={{
                        display: "flex",
                        gap: "0.25rem",
                        overflowX: "auto",
                    }}
                >
                    {tabs.map((tab) => {
                        const active =
                            tab.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(tab.href);

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    padding: "0.85rem 1.25rem",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: active
                                        ? "var(--color-terracotta)"
                                        : "var(--color-muted)",
                                    textDecoration: "none",
                                    borderBottom: active
                                        ? "2px solid var(--color-terracotta)"
                                        : "2px solid transparent",
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
