import type { Metadata } from "next";
import { packages } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Try static data first
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) {
    // Try fetching from API at build time
    try {
      const base = process.env.AUTH_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
      const res = await fetch(`${base}/api/packages`, { next: { revalidate: 3600 } });
      const data = await res.json();
      const found = data.packages?.find((p: { slug: string }) => p.slug === slug);
      if (found) {
        return buildMeta(found);
      }
    } catch {
      // fall through
    }

    return {
      title: "Package Not Found",
      description: "The travel package you're looking for doesn't exist.",
    };
  }

  return buildMeta(pkg);
}

function buildMeta(pkg: {
  name: string;
  destination: string;
  duration: string;
  overview: string;
  priceDisplay: string;
  coverImage: string;
  category: string;
}): Metadata {
  const title = `${pkg.name} – ${pkg.destination}`;
  const description = pkg.overview.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | GangOfMusafirs`,
      description,
      images: pkg.coverImage ? [{ url: pkg.coverImage, width: 1200, height: 630, alt: pkg.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pkg.coverImage ? [pkg.coverImage] : [],
    },
    keywords: `${pkg.destination}, ${pkg.category}, ${pkg.name}, travel package, GangOfMusafirs, ${pkg.duration}, group trip`,
  };
}

export default function PackageSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
