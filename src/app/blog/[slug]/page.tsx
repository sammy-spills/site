import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { renderMdxWithToc } from "@/lib/mdx";
import {
  blogFrontmatterSchema,
  type BlogFrontmatter,
} from "@/lib/schemas/content";
import { siteConfig } from "@/lib/site-config";
import { formatTag } from "@/lib/utils";
import { format } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getContentBySlug<BlogFrontmatter>("blog", slug);
    const metadata = blogFrontmatterSchema.parse(post.metadata);

    return {
      title: metadata.title,
      description: metadata.excerpt,
      alternates: {
        canonical: `${siteConfig.siteUrl}/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: "Post not found",
    };
  }
}
