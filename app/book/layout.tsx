import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book Your Trip",
    description:
        "Complete your booking and pay securely via Razorpay – UPI, cards, wallets & net banking accepted.",
};

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
