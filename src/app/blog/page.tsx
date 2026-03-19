import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Publish posts and updates here.",
};

export default function BlogIndexPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Blog</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          No posts have been published yet.
        </p>
      </section>
    </div>
  );
}
