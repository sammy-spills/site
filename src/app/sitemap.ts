import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import type { BlogFrontmatter } from "@/lib/schemas/content";

export const dynamic = "force-static";

const baseUrl = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
  ];

  const posts = getAllContent<BlogFrontmatter>("blog");
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...blogRoutes];
}
