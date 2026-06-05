import { ArrowUpRight, Blocks, BrainCircuit, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllContent } from "@/lib/content";
import { site } from "@/lib/data";
import type { BlogFrontmatter } from "@/lib/schemas/content";

function formatDateUK(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${day}-${month}-${d.getUTCFullYear()}`;
}

const focusAreas = [
  {
    title: "Operational AI systems",
    description:
      "Research engineering for models, agents, and evaluation loops that have to survive contact with real users.",
    icon: BrainCircuit,
  },
  {
    title: "Cyber security",
    description:
      "Applied ML for threat understanding, national-scale analysis, and resilient decision support.",
    icon: ShieldCheck,
  },
  {
    title: "Research to deployment",
    description:
      "Bridging papers, prototypes, and production constraints with careful implementation and measurement.",
    icon: Blocks,
  },
];

const metrics = [
  ["Role", site.profile.role],
  ["Base", site.profile.institute],
];

export default function Home() {
  const posts = getAllContent<BlogFrontmatter>("blog");
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  return (
    <main className="mistral-prototype -mx-6 -mt-10 md:-mx-10 lg:-mx-16">
      <section className="hero-grid min-h-[calc(100svh-150rem)] border-border border-b">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="flex min-h-[680px] flex-col justify-between border-border border-r px-6 py-8 md:px-10 lg:px-14">
            <div className="flex flex-wrap items-center justify-between gap-4 text-foreground text-sm">
              <Link
                className="inline-flex items-center gap-2 font-semibold text-foreground no-underline"
                href={site.social.linkedin || "/about"}
                rel="noreferrer"
                target="_blank"
              >
                <span className="size-2 bg-primary" aria-hidden="true" />
                {site.profile.fullName}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="max-w-4xl py-14 md:py-20">
              <p className="mb-5 max-w-xl font-medium text-base text-muted-foreground md:text-lg">
                {site.profile.role} at{" "}
                <a
                  className="text-foreground underline"
                  href={site.profile.instituteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.profile.institute}
                </a>
              </p>
              <h1 className="max-w-5xl font-display text-6xl text-foreground leading-none md:text-6xl xl:text-8xl">
                AI Engineering for National Security.
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-8 md:text-xl">
                I build and evaluate AI systems for hard, high-consequence
                environments, turning research ideas into robust software,
                models, and decision workflows.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-11 items-center gap-2 bg-foreground px-5 font-semibold text-background no-underline transition-opacity hover:opacity-85"
                  href="/cv"
                >
                  View CV
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  className="inline-flex h-11 items-center gap-2 border border-foreground/30 px-5 font-semibold text-foreground no-underline transition-colors hover:bg-foreground hover:text-background"
                  href="/publications"
                >
                  Read publications
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid border-border border-t md:grid-cols-2">
              {metrics.map(([label, value]) => (
                <div
                  className="border-border border-b py-5 md:border-r md:border-b-0 md:px-5 first:md:pl-0 last:md:border-r-0"
                  key={label}
                >
                  <p className="font-mono text-[0.72rem] text-muted-foreground uppercase">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold text-sm leading-6">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[520px] flex-col bg-[#1f1f1f] text-[#fff8e0]">
            <div className="relative min-h-[420px] flex-1 overflow-hidden">
              <Image
                alt={site.profile.fullName || "Profile image"}
                className="object-cover grayscale"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src={site.profile.image || "/pp.webp"}
                priority
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,31,31,0)_28%,rgba(31,31,31,0.72)_100%)]"
                aria-hidden="true"
              />
              <div className="absolute right-5 bottom-5 left-5 border border-[#fff8e0]/30 bg-[#1f1f1f]/70 p-5 backdrop-blur">
                <p className="font-mono text-[0.7rem] uppercase text-[#ffa110]">
                  Current focus
                </p>
                <p className="mt-3 text-2xl leading-tight">
                  Practical AI capability for public-sector and security
                  contexts.
                </p>
              </div>
            </div>
            <div className="sunset-stripe h-8" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-border border-r px-6 py-16 md:px-10 lg:px-14">
            <p className="font-mono text-xs text-muted-foreground uppercase">
              Areas of work
            </p>
            <h2 className="mt-4 max-w-xl font-display text-5xl leading-none md:text-6xl">
              Systems that hold up under pressure.
            </h2>
          </div>
          <div className="divide-y divide-border">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  className="grid gap-6 px-6 py-9 md:grid-cols-[56px_1fr] md:px-10"
                  key={area.title}
                >
                  <div className="flex size-12 items-center justify-center border border-foreground bg-background">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-sans text-2xl font-semibold">
                      {area.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-muted-foreground leading-7">
                      {area.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="border-border border-b bg-[#fff8e0] text-[#1f1f1f]">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
            <Link
              className="group relative min-h-[420px] overflow-hidden border-[#1f1f1f]/20 border-r text-[#fff8e0] no-underline"
              href={`/blog/${featuredPost.slug}`}
            >
              {featuredPost.metadata.image && (
                <Image
                  alt={featuredPost.metadata.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  src={featuredPost.metadata.image}
                />
              )}
              <div className="absolute inset-0 bg-[#1f1f1f]/55" />
              <div className="absolute right-6 bottom-6 left-6">
                <p className="font-mono text-xs uppercase text-[#ffd900]">
                  Latest note / {formatDateUK(featuredPost.metadata.date)}
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-5xl leading-none md:text-6xl">
                  {featuredPost.metadata.title}
                </h2>
              </div>
            </Link>
            <div className="flex flex-col justify-between px-6 py-12 md:px-10 lg:px-14">
              <div>
                <p className="font-mono text-xs uppercase text-primary">
                  Journal
                </p>
                <p className="mt-5 text-xl leading-8">
                  {featuredPost.metadata.excerpt}
                </p>
              </div>
              <div className="mt-10 divide-y divide-[#1f1f1f]/20 border-[#1f1f1f]/20 border-y">
                {secondaryPosts.map((post) => (
                  <Link
                    className="flex items-center justify-between gap-5 py-5 text-[#1f1f1f] no-underline transition-colors hover:text-primary"
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                  >
                    <span className="font-semibold">{post.metadata.title}</span>
                    <ArrowUpRight
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-14">
          <div className="sunset-stripe mb-10 h-6" aria-hidden="true" />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"></div>
        </div>
      </section>
    </main>
  );
}
