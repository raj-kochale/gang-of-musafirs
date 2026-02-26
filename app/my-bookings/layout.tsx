import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Bookings | GangOfMusafirs",
    description: "View and track your trip bookings with GangOfMusafirs.",
};

export default function MyBookingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
