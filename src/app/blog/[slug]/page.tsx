import { evaluate } from "@mdx-js/mdx";
import {
  BlocksIcon,
  LayoutTemplateIcon,
  RocketIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  jsx as jsxFn,
  Fragment as jsxFragment,
  jsxs as jsxsFn,
} from "react/jsx-runtime";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Badge } from "@/components/ui/badge";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import type { BlogFrontmatter } from "@/lib/schemas/content";
import { formatTag } from "@/lib/utils";

const mdxComponents = {
  Callout,
  CalloutTitle,
  CalloutDescription,
  Image,
  RocketIcon,
  BlocksIcon,
  LayoutTemplateIcon,
  UsersIcon,
};

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = getContentBySlug<BlogFrontmatter>("blog", slug);
  return {
    title: metadata.title,
    description: metadata.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const { metadata, content } = getContentBySlug<BlogFrontmatter>("blog", slug);

  const { default: MDXContent } = await evaluate(content, {
    Fragment: jsxFragment,
    jsx: jsxFn,
    jsxs: jsxsFn,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeKatex],
  });

  return (
    <article className="space-y-8">
      {metadata.image && (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg">
          <Image
            alt={metadata.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            src={metadata.image}
          />
        </div>
      )}

      <header>
        <h1 className="mb-2 font-bold text-3xl">{metadata.title}</h1>
        <p className="mb-4 text-muted-foreground text-sm">{metadata.date}</p>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {formatTag(tag)}
            </Badge>
          ))}
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <MDXContent components={mdxComponents} />
      </div>
    </article>
  );
}
