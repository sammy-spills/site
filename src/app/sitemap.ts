import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import type { BlogFrontmatter } from "@/lib/schemas/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${siteConfig.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${siteConfig.siteUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${siteConfig.siteUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${siteConfig.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
  ];

  const posts = getAllContent<BlogFrontmatter>("blog");
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...blogRoutes];
}
