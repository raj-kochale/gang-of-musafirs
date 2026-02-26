import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Travel Blog",
    description:
        "Travel tips, destination guides, and stories from GangOfMusafirs adventures across India. Get inspired for your next trip!",
    openGraph: {
        title: "Travel Blog | GangOfMusafirs",
        description:
            "Travel tips, destination guides, and stories from our adventures across India.",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
