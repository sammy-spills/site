import { ArrowUpRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllContent } from "@/lib/content";
import {
  blogFrontmatterSchema,
  type BlogFrontmatter,
} from "@/lib/schemas/content";
import { formatTag } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog - Sam Spillard",
  description: "Thoughts and things I care about...",
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

  const latest = posts[0]?.metadata.date;

  return (
    <main className="mistral-prototype -mx-6 -mt-10 md:-mx-10 lg:-mx-16">
      <section className="border-border border-b">
        <div className="grid lg:grid-cols-[384px_1fr] xl:grid-cols-[480px_1fr]">
          <div className="border-border border-r px-6 py-14 md:px-10 lg:px-14">
            <p className="font-mono text-muted-foreground text-xs uppercase">
              Notes index
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none md:text-8xl">
              Blog.
            </h1>
          </div>
          <div className="flex flex-col justify-between py-14 lg:grid lg:grid-rows-[240px_96px] lg:py-0">
            <p className="max-w-3xl px-6 text-muted-foreground text-xl leading-8 md:px-12 lg:py-14">
              {metadata.description}
            </p>
            <div className="mt-11 ml-12 grid w-[calc(100%-3rem)] h-24 border border-border md:w-96 md:grid-cols-2 lg:mt-0 lg:h-24">
              <div className="flex flex-col justify-center border-border border-b px-5 md:border-r md:border-b-0">
                <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                  Total posts
                </p>
                <p className="mt-2 font-semibold text-sm">
                  {posts.length} entries
                </p>
              </div>
              <div className="flex flex-col justify-center px-5">
                <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                  Latest
                </p>
                <p className="mt-2 font-semibold text-sm">
                  {latest ? formatDateUK(latest) : "No records"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-14 md:px-10 lg:px-14">
            <p className="text-muted-foreground text-sm/relaxed">
              No posts have been published yet.
            </p>
            <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
          </div>
        </section>
      ) : (
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-10 md:py-10 lg:px-14">
            <div className="border-border border-y">
              {posts.map((post, index) => (
                <article
                  className="grid gap-5 border-border border-b py-7 last:border-b-0 md:grid-cols-[72px_1fr] lg:grid-cols-[88px_1fr_220px]"
                  key={post.slug}
                >
                  <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <Link
                      className="group inline-flex max-w-3xl items-start gap-3 text-foreground no-underline"
                      href={`/blog/${post.slug}`}
                    >
                      <h2 className="font-sans font-semibold text-2xl leading-tight transition-colors group-hover:text-primary">
                        {post.metadata.title}
                      </h2>
                      <ArrowUpRight
                        className="mt-1 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                    <p className="mt-3 max-w-3xl text-muted-foreground text-sm leading-7">
                      {post.metadata.excerpt}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.metadata.tags.map((tag) => (
                        <span
                          className="border border-border px-2 py-1 font-mono text-[0.68rem] text-muted-foreground uppercase"
                          key={tag}
                        >
                          {formatTag(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 lg:items-end lg:text-right">
                    {post.metadata.image ? (
                      <Link
                        className="relative block aspect-[4/3] w-full overflow-hidden border border-border lg:w-44"
                        href={`/blog/${post.slug}`}
                      >
                        <Image
                          alt={post.metadata.title}
                          className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                          fill
                          sizes="(max-width: 1024px) 100vw, 176px"
                          src={post.metadata.image}
                        />
                      </Link>
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center border border-border lg:w-44">
                        <ImageIcon
                          className="size-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-[0.7rem] text-primary uppercase">
                        {formatDateUK(post.metadata.date)}
                      </p>
                      <Link
                        className="mt-3 inline-flex h-9 w-fit items-center gap-2 border border-foreground/25 px-3 font-medium text-foreground text-xs no-underline transition-colors hover:bg-foreground hover:text-background"
                        href={`/blog/${post.slug}`}
                      >
                        Read
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
