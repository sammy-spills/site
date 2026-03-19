import { getAllContent } from "@/lib/content";
import { site } from "@/lib/data";
import type { BlogFrontmatter } from "@/lib/schemas/content";

export const dynamic = "force-static";

const baseUrl = "https://example.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllContent<BlogFrontmatter>("blog");

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.metadata.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.seo.defaultTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(site.seo.defaultDescription)}</description>
    <language>en-gb</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
