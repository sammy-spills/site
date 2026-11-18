import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/rsvp" },
      { userAgent: "*", disallow: "/maple-two" },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
