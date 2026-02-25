import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GangOfMusafirs to plan your dream trip across India. Fill out our inquiry form or reach us on WhatsApp — we respond within 1 hour!",
  openGraph: {
    title: "Contact GangOfMusafirs",
    description:
      "Plan your dream trip. Fill out our inquiry form or reach us on WhatsApp.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
