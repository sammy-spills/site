import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { site } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { BlogFrontmatter } from "@/lib/schemas/content";

function formatDateUK(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${day}-${month}-${d.getUTCFullYear()}`;
}

function formatTag(tag: string) {
  return `#${tag.replace(/\s+/g, "-")}`;
}

const aoes = [
  {
    title: "AI & ML Research",
    description:
      "Developing operational and mission-tested AI & ML systems at scale for the UK public sector. Focus on bringing novel and cutting-edge research into the hands of end-users with end-to-end research engineering.",
  },
  {
    title: "Cyber Security",
    description:
      "Experience in protecting the UK's cyber space, applying advanced AI techniques to understand the threat landscape, as well as research into how novel AI research can be applied at a national level to secure the UK from advanced threats.",
  },
];

export default function Home() {
  const posts = getAllContent<BlogFrontmatter>("blog");
  const featuredPost = posts[0];

  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        {site.profile.image ? (
          <div className="mx-auto relative size-32 overflow-hidden rounded-full border">
            <Image
              alt={site.profile.fullName || "Profile image"}
              className="object-cover"
              fill
              sizes="256px"
              src={site.profile.image}
            />
          </div>
        ) : (
          <Badge variant="secondary">Starter Template</Badge>
        )}
        <div className="space-y-3">
          <h1 className="font-bold text-3xl sm:text-4xl">
            {site.profile.fullName || "Your Name"}
          </h1>
          <p className="text-muted-foreground text-sm/relaxed">
            {site.profile.role} @{" "}
            <a
              href={site.profile.instituteUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {site.profile.institute}
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl sm:text-2xl">Areas of Expertise</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {aoes.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm/relaxed">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Blog Post */}
      {featuredPost && (
        <section>
          <h2 className="mb-4 text-xl sm:text-2xl">Latest Post</h2>
          <Link href={`/blog/${featuredPost.slug}`}>
            <Card className="gap-0 overflow-hidden p-0 transition-colors hover:bg-muted/50 md:flex-row">
              {featuredPost.metadata.image && (
                <div className="relative aspect-[2/1] md:aspect-auto md:w-72 md:shrink-0">
                  <Image
                    alt={featuredPost.metadata.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    src={featuredPost.metadata.image}
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 py-4">
                <CardHeader>
                  <CardTitle className="font-semibold">
                    {featuredPost.metadata.title}
                  </CardTitle>
                  <CardDescription>
                    {formatDateUK(featuredPost.metadata.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm/relaxed">
                    {featuredPost.metadata.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {featuredPost.metadata.tags.map((tag) => (
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
        </section>
      )}
    </div>
  );
}
