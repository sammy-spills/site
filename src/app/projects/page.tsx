import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Showcase selected work here.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Projects</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          No projects have been added yet.
        </p>
      </section>
    </div>
  );
}
