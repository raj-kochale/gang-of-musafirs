import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.gangofmusafirs.online";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login/", "/my-bookings/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
