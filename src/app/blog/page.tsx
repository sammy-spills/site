import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllContent } from "@/lib/content";
import { blogFrontmatterSchema, type BlogFrontmatter } from "@/lib/schemas/content";
import { formatTag } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Sam Spillard",
  description: "Thoughts and things I care about",
};

function formatDateUK(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${day}-${month}-${d.getUTCFullYear()}`;
}

export default function BlogIndexPage() {
  const posts = getAllContent<BlogFrontmatter>("blog").map((post) => ({
    ...post,
    metadata: blogFrontmatterSchema.parse(post.metadata),
  }));

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="font-bold text-3xl">Blog</h1>
        <p className="max-w-2xl text-muted-foreground text-sm/relaxed">
          Notes, updates, and longer-form writing published from MDX files in
          the repo.
        </p>
      </section>

      {posts.length === 0 ? (
        <section>
          <p className="text-muted-foreground text-sm/relaxed">
            No posts have been published yet.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <Card
                key={post.slug}
                className="gap-0 overflow-hidden p-0 transition-colors hover:bg-muted/50 md:flex-row"
              >
                {post.metadata.image && (
                  <div className="relative aspect-[2/1] md:aspect-auto md:w-72 md:shrink-0">
                    <Image
                      alt={post.metadata.title}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 288px, 100vw"
                      src={post.metadata.image}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-4 py-4">
                  <CardHeader>
                    <CardTitle className="font-semibold">
                      {post.metadata.title}
                    </CardTitle>
                    <CardDescription>
                        {formatDateUK(post.metadata.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-sm/relaxed">
                      {post.metadata.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {post.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {formatTag(tag)}
                        </Badge>
                      ))}
                      <span className="ml-auto text-muted-foreground text-sm">
                        Read more &rarr;
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
