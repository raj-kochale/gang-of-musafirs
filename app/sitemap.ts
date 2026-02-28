import type { MetadataRoute } from "next";
import { packages } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gangofmusafirs.online";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic package pages from static data
  const packagePages: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Try to fetch dynamic packages from DB
  let dbPackagePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/packages`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data.packages?.length > 0) {
      const staticSlugs = new Set(packages.map((p) => p.slug));
      dbPackagePages = data.packages
        .filter((p: { slug: string }) => !staticSlugs.has(p.slug))
        .map((p: { slug: string }) => ({
          url: `${baseUrl}/packages/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch {
    // fallback to static only
  }

  // Try to fetch blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data.posts?.length > 0) {
      blogPages = data.posts.map((post: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // skip dynamic blog entries
  }

  return [...staticPages, ...packagePages, ...dbPackagePages, ...blogPages];
}
