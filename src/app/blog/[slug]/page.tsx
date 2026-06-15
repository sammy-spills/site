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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;

  try {
    post = getContentBySlug<BlogFrontmatter>("blog", slug);
  } catch {
    notFound();
  }

  const metadata = blogFrontmatterSchema.parse(post.metadata);
  const { content, headings } = await renderMdxWithToc(post.content);

  // Header section (back link, date, title, excerpt, tags, image)
  const headerSection = (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          className="text-muted-foreground text-sm underline-offset-4 hover:underline"
          href="/blog"
        >
          Back to blog
        </Link>
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
            {format(new Date(metadata.date), "d MMMM yyyy")}
          </p>
          <h1 className="font-bold text-3xl sm:text-4xl">{metadata.title}</h1>
          <p className="max-w-2xl text-muted-foreground text-sm/relaxed">
            {metadata.excerpt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {formatTag(tag)}
            </Badge>
          ))}
        </div>
      </div>

      {metadata.image && (
        <div className="relative mx-auto aspect-[16/9] max-w-prose overflow-hidden rounded-2xl border">
          <Image
            alt={metadata.title}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
            src={metadata.image}
            loading="eager"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Table of Contents - Left Sidebar on desktop, below hero on mobile */}
      <aside className="lg:w-80 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
        <div className="hidden lg:block">
          <TableOfContents items={headings} title={metadata.title} />
        </div>
      </aside>

      {/* Main Article Content */}
      <article className="flex-1 space-y-8">
        {headerSection}

        {/* Mobile TOC - shown below hero image */}
        <div className="lg:hidden">
          <TableOfContents items={headings} title={metadata.title} />
        </div>

        <Prose>{content}</Prose>
      </article>
    </div>
  );
}
