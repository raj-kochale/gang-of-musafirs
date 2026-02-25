import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | GangOfMusafirs",
    description: "Manage trips, packages, and inquiries for GangOfMusafirs.",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
