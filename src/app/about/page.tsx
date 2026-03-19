import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Add your personal or company story here.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">About</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          This page is ready for your biography, mission, or background.
        </p>
      </section>

      <section className="max-w-prose">
        <p className="text-muted-foreground text-sm/relaxed">
          Replace this placeholder with the story you want visitors to read.
        </p>
      </section>
    </div>
  );
}
