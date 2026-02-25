import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Travel Packages",
  description:
    "Browse curated group travel packages across India — Hill Stations, Beaches, Adventure, Cultural tours and more. Find your perfect trip with GangOfMusafirs.",
  openGraph: {
    title: "Travel Packages | GangOfMusafirs",
    description:
      "Browse curated group travel packages across India. Hill Stations, Beaches, Adventure & Cultural destinations.",
  },
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
